(function() {
    var PivotDataSource = kendo.data.PivotDataSource;

    module("PivotDataSource merging of axes", { });

    test("add children to the first member of root level tuple", function() {
        var dataSource = new PivotDataSource({
            columns: [ "dim 0", "dim 1" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] } ] },
                                    { members: [ { name: "dim 0 - 1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[1].name, "dim 1");
        equal(axes.columns.tuples[0].members[0].children.length, 1);
        equal(axes.columns.tuples[0].members[0].children[0].members[0].name, "dim 0 - 1");
        equal(axes.columns.tuples[0].members[0].children[0].members[1].name, "dim 1");
    });

    test("add children to the second member of root level tuple", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "level 0");
        equal(axes.columns.tuples[0].members[1].name, "level 0");
        equal(axes.columns.tuples[0].members[0].children.length, 0);
        equal(axes.columns.tuples[0].members[1].children.length, 1);
        equal(axes.columns.tuples[0].members[1].children[0].members[0].name, "level 0");
        equal(axes.columns.tuples[0].members[1].children[0].members[1].name, "level 1");
    });

    test("add children to the first member of level 1 tuple", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].children.length, 1);
        equal(axes.columns.tuples[0].members[0].children[0].members[0].children.length, 0);
        equal(axes.columns.tuples[0].members[0].children[0].members[1].children.length, 1);
    });

    test("add children to the last member of root level tuple", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] } ] },
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].children.length, 0);
        equal(axes.columns.tuples[0].members[1].children.length, 0);
        equal(axes.columns.tuples[0].members[2].children.length, 1);
    });

    test("add children to the last member of last level tuple with 3 members", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] }, { name: "level 1", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        var level0 = axes.columns.tuples[0];
        equal(level0.members[0].children.length, 1);

        var level1 = level0.members[0].children[0];
        equal(level1.members[0].children.length, 0);
        equal(level1.members[1].children.length, 1);
        equal(level1.members[2].children.length, 0);

        var level2 = level1.members[1].children[0];
        equal(level2.members[0].children.length, 0);
        equal(level2.members[1].children.length, 0);
        equal(level2.members[2].children.length, 1);

        var level3 = level2.members[2].children[0];
        equal(level3.members[0].name, "level 1");
        equal(level3.members[1].name, "level 1");
        equal(level3.members[2].name, "level 1");
    });

    test("add children from single member tuple", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].children.length, 1);
    });

    test("multiple measures merged in single member", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);

        var tuple = axes.columns.tuples[0];
        equal(tuple.members[0].name, "level 0");
        equal(tuple.members[1].measure, true);
        equal(tuple.members[1].name, "Measures");
        equal(tuple.members[1].children.length, 2);
        equal(tuple.members[1].children[0].name, "measure 1");
        equal(tuple.members[1].children[1].name, "measure 2");
    });

    test("merge to existing axes on expand with single dimention", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" } ] },
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" } ] },
                        { members: [ { name: "level 2", parentName: "level 1", children: [], levelNum: "2" } ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 1");

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1, "one root tuple");
        equal(tuples[0].members[0].children.length, 1, "one tuple on second level");
        equal(tuples[0].members[0].children[0].members[0].children.length, 1, "one tuple on third level");
        equal(tuples[0].members[0].children[0].members[0].children[0].members[0].name, "level 2");
    });

    test("merge to existing axes on expand on root level of first dimention", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "level 1", children: [], levelNum: "0" }  ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "level 1", children: [], levelNum: "0" }  ] },
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" }, { name: "level 1", children: [], levelNum: "0" }  ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            columns: ["level 0", "level 1"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 0");

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1, "one root tuple");
        equal(tuples[0].members[0].children.length, 1, "one tuple on second level of first memeber");
        equal(tuples[0].members[0].children[0].members[0].name, "level 1");
        equal(tuples[0].members[1].children.length, 0, "zero tuples on second level of second member");
    });

    test("merge to existing axes on expand on root level of second dimention", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "level 1", children: [], levelNum: "0" } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "level 1", children: [], levelNum: "0" } ] },
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "level 2", parentName: "level 1", children: [], levelNum: "1" } ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            columns: ["level 0", "level 1"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["level 0", "level 1"]);

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1, "one root tuple");
        equal(tuples[0].members[0].children.length, 0, "zero tuples on second level of first memeber");
        equal(tuples[0].members[1].children.length, 1, "one tuple on second level of second member");
        equal(tuples[0].members[1].children[0].members[0].name, "level 0");
        equal(tuples[0].members[1].children[0].members[1].name, "level 2");
    });

    test("merge to existing axes with multuiple measures", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], hierarchy: "level 0", levelNum: "0" }, { name: "measure 1", children: [] } ] },
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                        { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] },
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 0");

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1, "one root tuple");
        equal(tuples[0].members[0].children.length, 1, "one tuple on second level of first memeber");
        equal(tuples[0].members[1].children.length, 2, "two measures on root level");

        equal(tuples[0].members[0].children[0].members[0].name, "level 1");
        equal(tuples[0].members[0].children[0].members[1].measure, true);
        equal(tuples[0].members[0].children[0].members[1].children.length, 2, "two measures on second level");
    });

    test("create measure tuple with single measure descriptor and no axis", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [{ name: "measure 1", children: [] }] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1);
        equal(tuples[0].members[0].measure, true);
        equal(tuples[0].members[0].children.length, 1);
    });

    test("merge tuples in rows axis", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1", parentName: "level 0", children: [] }, { name: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.rows.tuples.length, 1);
        equal(axes.rows.tuples[0].members[0].name, "level 0");
        equal(axes.rows.tuples[0].members[1].name, "level 0");
        equal(axes.rows.tuples[0].members[0].children.length, 1);
        equal(axes.rows.tuples[0].members[0].children[0].members[0].name, "level 1");
        equal(axes.rows.tuples[0].members[0].children[0].members[1].name, "level 0");
    });

    test("measures are merged only on column axis", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
                                ]
                            },
                            rows: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var columnTuples = dataSource.axes().columns.tuples;
        var rowTuples = dataSource.axes().rows.tuples;

        equal(columnTuples.length, 1);
        equal(columnTuples[0].members.length, 2);
        equal(columnTuples[0].members[1].measure, true);

        equal(rowTuples.length, 1);
        equal(rowTuples[0].members.length, 1);
    });

    test("measures are merged only on row axis", function() {
        var dataSource = new PivotDataSource({
            columns: [ "level 0" ],
            rows: [ "level 0" ],
            measures: {
                values: [ "measure 1", "measure 2"],
                axis: "rows"
            },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [], levelNum: "0" } ] }
                                ]
                            },
                            rows: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var columnTuples = dataSource.axes().columns.tuples;
        var rowTuples = dataSource.axes().rows.tuples;

        equal(rowTuples.length, 1);
        equal(rowTuples[0].members.length, 2);
        equal(rowTuples[0].members[1].measure, true);

        equal(columnTuples.length, 1);
        equal(columnTuples[0].members.length, 1);
    });

    test("tuple with empty children are skipped", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "member 0", children: [], levelNum: "0" }, { name: "member 1", children: [], levelNum: "0" } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "member 0", children: [], levelNum: "0" }, { name: "member 1", children: [], levelNum: "0" } ] },
                        { members: [ { name: "member 0 - 0", parentName: "member 0", children: [], levelNum: "1" }, { name: "member 1", children: [], levelNum: "0" } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "member 0", children: [], levelNum: "0" }, { name: "member 1", children: [], levelNum: "0" } ] },
                        { members: [ { name: "member 0", children: [], levelNum: "0" }, { name: "member 1 - 0", parentName: "member 1", children: [], levelNum: "1" } ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            columns: ["member 0", "member 1"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("member 0");
        dataSource.expandColumn(["member 0", "member 1"]);

        var tuples = dataSource.axes().columns.tuples;
        equal(tuples.length, 1, "one root tuple");
        equal(tuples[0].members[0].children.length, 1, "one child tuple in first member");
        equal(tuples[0].members[1].children.length, 1, "one child tuple in second member");
    });

    test("move column axis tuples to row axis if row descriptors", function() {
        var dataSource = new PivotDataSource({
            rows: ["member 0"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    {
                                        members: [
                                            { name: "member 0", children: [], levelNum: "0" }
                                        ]
                                    }
                                ]
                            },
                            rows: { }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        equal(axes.columns.tuples.length, 0);
        equal(axes.rows.tuples.length, 1);
        equal(axes.rows.tuples[0].members[0].name, "member 0");
    });

    test("move column axis tuples to row axis if measures on row axis", function() {
        var dataSource = new PivotDataSource({
            measures: {
                values: [ "measure 1" ],
                axis: "rows"
            },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    {
                                        members: [
                                            { name: "measure 1", children: [], levelNum: "0" }
                                        ]
                                    }
                                ]
                            },
                            rows: { }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        equal(axes.columns.tuples.length, 0);
        equal(axes.rows.tuples.length, 1);
        equal(axes.rows.tuples[0].members[0].measure, true);
    });

    test("reset root tuple if its members change", function() {
        var members = [ { name: "dim 0", children: [] } ];
        var dataSource = new PivotDataSource({
            columns: [ "dim 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: members }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        //change root members
        members = [ { name: "dim 0", children: [], levelNum: "0" }, { name: "dim 1", children: [], levelNum: "0" } ];

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members.length, 2);
        equal(axes.columns.tuples[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[1].name, "dim 1");
    });

    test("tuples with parentName without existing parent creates fake root tuple", function() {
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" }, { name: "level 1", children: [], levelNum: "0" } ] },
                                    { members: [ { name: "level 1-2", parentName: "level 0", children: [], levelNum: "1" }, { name: "level 1", children: [], levelNum: "0" } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "level 0");
        equal(axes.columns.tuples[0].members[1].name, "level 1");
    });

    test("create root if returned a child tuple", function() {
        var dataSource = new PivotDataSource({
            columns: [ "dim 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0 - 1", parentName: "dim 0", levelNum: "1", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[0].children.length, 1);
        equal(axes.columns.tuples[0].members[0].children[0].members[0].name, "dim 0 - 1");
    });

    test("skip root creation if dimension does not start from first level", function() {
        var dataSource = new PivotDataSource({
            columns: [ "dim 0 - 1" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0 - 1", parentName: "dim 0", levelNum: "1", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "dim 0 - 1");
        equal(axes.columns.tuples[0].members[0].children.length, 0);
    });

    test("skip root creation if returned tuple has parent in datasource", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 0", children: [], levelNum: "0" } ] }
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "level 1", parentName: "level 0", children: [], levelNum: "1" } ] }
                    ]
                }
            }
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: axes.shift(),
                        data: []
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 0");

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "level 0");
        equal(axes.columns.tuples[0].members[0].children.length, 1);
        equal(axes.columns.tuples[0].members[0].children[0].members[0].name, "level 1");
    });

    test("create root if only childs are returned (single dim)", function() {
        var dataSource = new PivotDataSource({
            columns: [ "dim 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0 - 1", parentName: "dim 0", levelNum: "1", children: [] } ] },
                                    { members: [ { name: "dim 0 - 2", parentName: "dim 0", levelNum: "1", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[0].children.length, 2);
        equal(axes.columns.tuples[0].members[0].children[0].members[0].name, "dim 0 - 1");
        equal(axes.columns.tuples[0].members[0].children[1].members[0].name, "dim 0 - 2");
    });

    test("create root if only childs are returned (second dim)", function() {
        var dataSource = new PivotDataSource({
            columns: [ "dim 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0", children: [], levelNum: "0" }, { name: "dim 1 - 1", children: [], parentName: "dim 1", levelNum: "1" } ] },
                                    { members: [ { name: "dim 0", children: [], levelNum: "0" }, { name: "dim 1 - 2", children: [], parentName: "dim 1", levelNum: "1" } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();

        equal(axes.columns.tuples.length, 1);
        equal(axes.columns.tuples[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[1].name, "dim 1");

        equal(axes.columns.tuples[0].members[0].children.length, 0);
        equal(axes.columns.tuples[0].members[1].children.length, 2);

        equal(axes.columns.tuples[0].members[1].children[0].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[1].children[0].members[1].name, "dim 1 - 1");

        equal(axes.columns.tuples[0].members[1].children[1].members[0].name, "dim 0");
        equal(axes.columns.tuples[0].members[1].children[1].members[1].name, "dim 1 - 2");
    });

    test("create root tuples for all measures", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] },
                                    { members: [ { name: "level 1-2", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 1-2", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        var tuple = axes.columns.tuples[0];
        var firstMember = tuple.members[0];

        equal(firstMember.name, "level 0");
        equal(firstMember.parentName, "");
        equal(firstMember.levelName, "level 0");
        equal(firstMember.levelNum, "0");
        equal(firstMember.hasChildren, true);
        equal(firstMember.hierarchy, "level 0");

        equal(tuple.members[1].measure, true);
        equal(tuple.members[1].name, "Measures");
        equal(tuple.members[1].children.length, 2);
        equal(tuple.members[1].children[0].name, "measure 1");
        equal(tuple.members[1].children[1].name, "measure 2");
    });

    asyncTest("skip root tuple creation if the dimensions are updated", 2, function() {
        var deferred = $.Deferred();

        var tuples = [
            [ { members: [ { name: "dim 0", children: [], levelNum: "0" } ] } ],
            [ { members: [ { name: "dim 1", children: [], levelNum: "0" } ] } ]
        ];

        var dataSource = new PivotDataSource({
            measures: [ ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    /*//simulate axes left after rebind
                    dataSource._axes = {
                        columns: {
                            tuples: [ { members: [ { name: "dim 0", children: [], levelNum: "0" } ] } ]
                        },
                        rows: {
                            tuples: [ ]
                        },
                    };*/

                    setTimeout(function() {
                        options.success({
                            axes: {
                                columns: {
                                    tuples: tuples.shift()
                                }
                            },
                            data: []
                        });

                        if (!tuples.length) {
                            deferred.resolve();
                        }
                    });
                }
            }
        });

        dataSource.rows("dim 1");
        dataSource.columns("dim 1");

        deferred.done(function() {
            start();

            var axes = dataSource.axes();
            var tuple = axes.columns.tuples[0];
            var firstMember = tuple.members[0];

            equal(firstMember.name, "dim 1");
            equal(firstMember.children.length, 0);
        });
    });

    test("create tuples for missing measures", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        var tuple = axes.columns.tuples[0];
        tuple = tuple.members[0].children[0]; //level 1-1;

        equal(tuple.members[0].name, "level 1-1");
        equal(tuple.members[1].name, "Measures");
        equal(tuple.members[1].measure, true);
        equal(tuple.members[1].children.length, 2);
        equal(tuple.members[1].children[0].name, "measure 1");
        equal(tuple.members[1].children[1].name, "measure 2");
    });

    test("copy correct member fields when create tuples for missing measures", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", hasChildren: true, levelName: "level name", hierarchy: "hierarchy", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        var tuple = axes.columns.tuples[0];
        var firstMember = tuple.members[0];

        ok(!firstMember.parentName);
        equal(firstMember.name, "level 0");
        equal(firstMember.levelName, "level name");
        equal(firstMember.levelNum, "0");
        equal(firstMember.hasChildren, true);
        equal(firstMember.hierarchy, "hierarchy");
    });

    test("create tuples for missing measures (multiple dimensions)", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            columns: [ "dim 0", "dim 1" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0", children: [], levelNum: "0" },{ name: "dim 1", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [], levelNum: "1" },{ name: "dim 1", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [], levelNum: "1" },{ name: "dim 1-1", parentName: "dim 1", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        var tuple = axes.columns.tuples[0];

        equal(tuple.members[0].name, "dim 0");
        equal(tuple.members[1].name, "dim 1");
        equal(tuple.members[2].name, "Measures");
        equal(tuple.members[2].children[0].name, "measure 1");
        equal(tuple.members[2].children[1].name, "measure 2");

        var child = tuple.members[0].children[0];

        equal(child.members[0].name, "dim 0-1");
        equal(child.members[1].name, "dim 1");
        equal(child.members[2].name, "Measures");
        equal(child.members[2].children[0].name, "measure 1");
        equal(child.members[2].children[1].name, "measure 2");

        child = child.members[1].children[0];

        equal(child.members[0].name, "dim 0-1");
        equal(child.members[1].name, "dim 1-1");
        equal(child.members[2].name, "Measures");
        equal(child.members[2].children[0].name, "measure 1");
        equal(child.members[2].children[1].name, "measure 2");
    });

    test("create tuples for missing measures when tuples are even", function() {
        var dataSource = new PivotDataSource({
            measures: [ "measure 1", "measure 2"],
            columns: [ "dim 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: [
                                    { members: [ { name: "dim 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] }
                                ]
                            }
                        },
                        data: []
                    });
                }
            }
        });

        dataSource.read();

        var axes = dataSource.axes();
        var tuple = axes.columns.tuples[0];

        equal(tuple.members[0].name, "dim 0");
        equal(tuple.members[1].name, "Measures");
        equal(tuple.members[1].children[0].name, "measure 1");
        equal(tuple.members[1].children[1].name, "measure 2");

        var child = tuple.members[0].children[0];

        equal(child.members[0].name, "dim 0-1");
        equal(child.members[1].name, "Measures");
        equal(child.members[1].children[0].name, "measure 1");
        equal(child.members[1].children[1].name, "measure 2");
    });

})();

