(function() {
    var PivotDataSource = kendo.data.PivotDataSource;

    module("PivotDataSource merging of data", { });

    test("expand of root level column axis, without rows", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [], levelNum: "0" } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 0", children: [], levelNum: "0" } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            }
        ];
        var data = [
            [ { value: 10, ordinal: 0 } ],
            [ { value: 10, ordinal: 0 }, { value: 3, ordinal: 1 }, { value: 7, ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 0");

        var data = dataSource.data();
        equal(data.length, 3);
        equal(data[0].value, 10);
        equal(data[1].value, 3);
        equal(data[2].value, 7);
    });

    test("expand of second level column axis", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [] } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 10, ordinal: 0 }, { value: 3, ordinal: 1 }, { value: 7, ordinal: 2 } ],
            [ { value: 3, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 1, ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 1-0");

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, 10);
        equal(data[1].value, 3);
        equal(data[2].value, 2);
        equal(data[3].value, 1);
        equal(data[4].value, 7);
    });

    test("expand of second dimension of root column tuple after the second dimension of a child tuple is expanded", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] } ] },
                ]
            }
        ];
        var data = [
            [ { value: 10, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 3, ordinal: 2 }, { value: 6, ordinal: 3 }, { value: 7, ordinal: 4 } ],
            [ { value: 10, ordinal: 0 }, { value: 4, ordinal: 1 }, { value: 5, ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0","dim 1"]);

        var data = dataSource.data();
        equal(data.length, 7);

        equal(data[0].value, 10);
        equal(data[1].value, 2);
        equal(data[2].value, 6);
        equal(data[3].value, 7);
        equal(data[4].value, 3);
        equal(data[5].value, 4);
        equal(data[6].value, 5);
    });

    test("expand of second dimension of root column tuple after the second dimension of a child tuple is expanded (two measures)", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 100, ordinal: 0 }, { value: 200, ordinal: 1 },
              { value: 2, ordinal: 2 }, { value: 4, ordinal: 3 },
              { value: 3, ordinal: 4 }, { value: 6, ordinal: 5 },
              { value: 5, ordinal: 6 }, { value: 10, ordinal: 7 },
              { value: 7, ordinal: 8 }, { value: 14, ordinal: 9 } ],

            [ { value: 100, ordinal: 0 }, { value: 200, ordinal: 1 },
              { value: 30, ordinal: 2 }, { value: 60, ordinal: 3 },
              { value: 40, ordinal: 4 }, { value: 80, ordinal: 5 } ]
        ];
        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0","dim 1"]);

        var data = dataSource.data();

        equal(data.length, 14);
        equal(data[0].value, 100);
        equal(data[1].value, 200);
        equal(data[2].value, 2);
        equal(data[3].value, 4);
        equal(data[4].value, 5);
        equal(data[5].value, 10);
        equal(data[6].value, 7);
        equal(data[7].value, 14);
        equal(data[8].value, 3);
        equal(data[9].value, 6);
        equal(data[10].value, 30);
        equal(data[11].value, 60);
        equal(data[12].value, 40);
        equal(data[13].value, 80);
    });

    test("expand of second dimension of root column tuple after the second dimension of a child tuple is expanded (three measures)", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-2", parentName: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0-1", parentName: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 3", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-1", parentName: "dim 1", children: [] }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "dim 0", children: [] }, { name: "dim 1-2", parentName: "dim 1", children: [] }, { name: "measure 3", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 100, ordinal: 0 }, { value: 200, ordinal: 1 }, { value: 300, ordinal: 2 },
              { value: 2, ordinal: 3 }, { value: 4, ordinal: 4 }, { value: 8, ordinal: 5 },
              { value: 3, ordinal: 6 }, { value: 6, ordinal: 7 }, { value: 9, ordinal: 8 },
              { value: 5, ordinal: 9 }, { value: 10, ordinal: 10 }, { value: 15, ordinal: 11 },
              { value: 7, ordinal: 12 }, { value: 14, ordinal: 13 }, { value: 21, ordinal: 14 } ],

            [ { value: 100, ordinal: 0 }, { value: 200, ordinal: 1 }, { value: 300, ordinal: 2 },
              { value: 30, ordinal: 3 }, { value: 60, ordinal: 4 }, { value: 90, ordinal: 5 },
              { value: 40, ordinal: 6 }, { value: 80, ordinal: 7 }, { value: 120, ordinal: 8 } ]
        ];
        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2", "measure 3"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0","dim 1"]);

        var data = dataSource.data();

        equal(data.length, 21);
        equal(data[0].value, 100);
        equal(data[1].value, 200);
        equal(data[2].value, 300);
        equal(data[3].value, 2);
        equal(data[4].value, 4);
        equal(data[5].value, 8);
        equal(data[6].value, 5);
        equal(data[7].value, 10);
        equal(data[8].value, 15);
        equal(data[9].value, 7);
        equal(data[10].value, 14);
        equal(data[11].value, 21);
        equal(data[12].value, 3);
        equal(data[13].value, 6);
        equal(data[14].value, 9);
        equal(data[15].value, 30);
        equal(data[16].value, 60);
        equal(data[17].value, 90);
        equal(data[18].value, 40);
        equal(data[19].value, 80);
        equal(data[20].value, 120);
    });

    test("expand the first dimension of expanded first child column", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] }
                ]
            },
            {
                tuples: [
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [{ name: "row 0", children: [] }] },
                    { members: [{ name: "row 0-1", parentName: "row 0", children: [] }] },
                    { members: [{ name: "row 0-2", parentName: "row 0", children: [] }] }
                ]
            },
            {
                tuples: [
                    { members: [{ name: "row 0", children: [] }] },
                    { members: [{ name: "row 0-1", parentName: "row 0", children: [] }] },
                    { members: [{ name: "row 0-2", parentName: "row 0", children: [] }] }
                ]
            }
        ];;

        var data = [
            [
                { "value": 24, "ordinal": 0  }, { "value": 48, "ordinal": 1  },
                { "value": 24, "ordinal": 2  }, { "value": 48, "ordinal": 3  },
                { "value": 8,  "ordinal": 2  }, { "value": 16, "ordinal": 3  },
                { "value": 16, "ordinal": 4  }, { "value": 32, "ordinal": 5  },
                { "value": 9,  "ordinal": 4  }, { "value": 18, "ordinal": 5  },
                { "value": 9,  "ordinal": 6  }, { "value": 18, "ordinal": 7  },
                { "value": 3,  "ordinal": 8  }, { "value": 6,  "ordinal": 9  },
                { "value": 6,  "ordinal": 10 }, { "value": 12, "ordinal": 11 },
                { "value": 15, "ordinal": 8  }, { "value": 30, "ordinal": 9  },
                { "value": 15, "ordinal": 10 }, { "value": 30, "ordinal": 11 },
                { "value": 5,  "ordinal": 14 }, { "value": 10, "ordinal": 15 },
                { "value": 10, "ordinal": 16 }, { "value": 20, "ordinal": 17 }
            ], [
                { "value": 24, "ordinal": 0  }, { "value": 48, "ordinal": 1  },
                { "value": 8,  "ordinal": 2  }, { "value": 16, "ordinal": 3  },
                { "value": 16, "ordinal": 4  }, { "value": 32, "ordinal": 5  },
                { "value": 9,  "ordinal": 2  }, { "value": 18, "ordinal": 3  },
                { "value": 3,  "ordinal": 8  }, { "value": 6,  "ordinal": 9  },
                { "value": 6,  "ordinal": 10 }, { "value": 12, "ordinal": 11 },
                { "value": 15, "ordinal": 4  }, { "value": 30, "ordinal": 5  },
                { "value": 5,  "ordinal": 14 }, { "value": 10, "ordinal": 15 },
                { "value": 10, "ordinal": 16 }, { "value": 20, "ordinal": 17 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["All Categories", "All Years"]);

        equalArrays(dataSource.data(), [
            { "value": 24, "ordinal": 0  }, { "value": 48, "ordinal": 1  },
            { "value": 24, "ordinal": 2  }, { "value": 48, "ordinal": 3  },
            { "value": 8,  "ordinal": 2  }, { "value": 16, "ordinal": 3  },
            { "value": 16, "ordinal": 4  }, { "value": 32, "ordinal": 5  },
            { "value": 8,  "ordinal": 2  }, { "value": 16, "ordinal": 3  },
            { "value": 16, "ordinal": 4  }, { "value": 32, "ordinal": 5  },
            { "value": 9,  "ordinal": 4  }, { "value": 18, "ordinal": 5  },
            { "value": 9,  "ordinal": 6  }, { "value": 18, "ordinal": 7  },
            { "value": 3,  "ordinal": 8  }, { "value": 6,  "ordinal": 9  },
            { "value": 6,  "ordinal": 10 }, { "value": 12, "ordinal": 11 },
            { "value": 3,  "ordinal": 8  }, { "value": 6,  "ordinal": 9  },
            { "value": 6,  "ordinal": 10 }, { "value": 12, "ordinal": 11 },
            { "value": 15, "ordinal": 8  }, { "value": 30, "ordinal": 9  },
            { "value": 15, "ordinal": 10 }, { "value": 30, "ordinal": 11 },
            { "value": 5,  "ordinal": 14 }, { "value": 10, "ordinal": 15 },
            { "value": 10, "ordinal": 16 }, { "value": 20, "ordinal": 17 },
            { "value": 5,  "ordinal": 14 }, { "value": 10, "ordinal": 15 },
            { "value": 10, "ordinal": 16 }, { "value": 20, "ordinal": 17 }
        ]);
    });

    test("expand the second dimension of expanded first child column", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "Category&Beverages", parentName: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] }
                ]
            },
            {
                tuples: [
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2010", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 1", children: [] }] },
                    { members: [{ name: "All Categories", children: [] }, { name: "Year&2011", parentName: "All Years", children: [] }, { name: "measure 2", children: [] }] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [{ name: "row 0", children: [] }] },
                    { members: [{ name: "row 0-1", parentName: "row 0", children: [] }] },
                    { members: [{ name: "row 0-2", parentName: "row 0", children: [] }] }
                ]
            },
            {
                tuples: [
                    { members: [{ name: "row 0", children: [] }] },
                    { members: [{ name: "row 0-1", parentName: "row 0", children: [] }] },
                    { members: [{ name: "row 0-2", parentName: "row 0", children: [] }] }
                ]
            }
        ];

        var data = [
            [
                { "value": 24, "ordinal": 0  }, { "value": 48 ,"ordinal":  1 },
                { "value": 24, "ordinal": 2  }, { "value": 48, "ordinal":  3 },
                { "value": 9,  "ordinal": 4  }, { "value": 18, "ordinal":  5 },
                { "value": 9,  "ordinal": 6  }, { "value": 18, "ordinal":  7 },
                { "value": 15, "ordinal": 8  }, { "value": 30, "ordinal":  9 },
                { "value": 15, "ordinal": 10 }, { "value": 30, "ordinal": 11 }
            ], [
                { "value": 24, "ordinal": 0  }, { "value": 48, "ordinal": 1  },
                { "value": 8,  "ordinal": 2  }, { "value": 16, "ordinal": 3  },
                { "value": 16, "ordinal": 4  }, { "value": 32, "ordinal": 5  },
                { "value": 9,  "ordinal": 6  }, { "value": 18, "ordinal": 7  },
                { "value": 3,  "ordinal": 8  }, { "value": 6,  "ordinal": 9  },
                { "value": 6,  "ordinal": 10 }, { "value": 12, "ordinal": 11 },
                { "value": 15, "ordinal": 12 }, { "value": 30, "ordinal": 13 },
                { "value": 5,  "ordinal": 14 }, { "value": 10, "ordinal": 15 },
                { "value": 10, "ordinal": 16 }, { "value": 20, "ordinal": 17 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["All Categories", "All Years"]);

        equalArrays(dataSource.data(), [
            { "value": 24, "ordinal": 0  }, { "value": 48, "ordinal": 1  },
            { "value": 24, "ordinal": 2  }, { "value": 48, "ordinal": 3  },
            { "value": 8,  "ordinal": 4  }, { "value": 16, "ordinal": 5  },
            { "value": 16, "ordinal": 6  }, { "value": 32, "ordinal": 7  },
            { "value": 9,  "ordinal": 8  }, { "value": 18, "ordinal": 9  },
            { "value": 9,  "ordinal": 10 }, { "value": 18, "ordinal": 11 },
            { "value": 3,  "ordinal": 12 }, { "value": 6,  "ordinal": 13 },
            { "value": 6,  "ordinal": 14 }, { "value": 12, "ordinal": 15 },
            { "value": 15, "ordinal": 16 }, { "value": 30, "ordinal": 17 },
            { "value": 15, "ordinal": 18 }, { "value": 30, "ordinal": 19 },
            { "value": 5,  "ordinal": 20 }, { "value": 10, "ordinal": 21 },
            { "value": 10, "ordinal": 22 }, { "value": 20, "ordinal": 23 }
        ]);
    });

    test("expand of root level row axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 10, ordinal: 0 } ],
            [ { value: 10, ordinal: 0 }, { value: 3, ordinal: 1 }, { value: 7, ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 0");

        var data = dataSource.data();
        equal(data.length, 3);
        equal(data[0].value, 10);
        equal(data[1].value, 3);
        equal(data[2].value, 7);
    });

    test("expand of second level row axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [] } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 10, ordinal: 0 }, { value: 3, ordinal: 1 }, { value: 7, ordinal: 2 } ],
            [ { value: 3, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 1, ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 1-0");

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, 10);
        equal(data[1].value, 3);
        equal(data[2].value, 2);
        equal(data[3].value, 1);
        equal(data[4].value, 7);
    });

    test("initially expanded row and column axes", function() {
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
                                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] }
                                ]
                            },
                            rows: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: [
                            { value: 1 },
                            { value: 2 },
                            { value: 3 },
                            { value: 4 }
                        ]
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 4);
        equal(data[0].value, 1);
        equal(data[1].value, 2);
        equal(data[2].value, 3);
        equal(data[3].value, 4);
    });

    test("expand column axis with rows expanded", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [] } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 1 }, { value: 2 }, { value: 3 },  { value: 4 }, { value: 5 }, { value: 6 } ],
            [ { value: 2 }, { value: 7 }, { value: 8 },  { value: 5 }, { value: 9 }, { value: 10 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 1-0");

        var data = dataSource.data();
        equal(data.length, 10);
        equal(data[0].value, 1);
        equal(data[1].value, 2);
        equal(data[2].value, 7);
        equal(data[3].value, 8);
        equal(data[4].value, 3);

        equal(data[5].value, 4);
        equal(data[6].value, 5);
        equal(data[7].value, 9);
        equal(data[8].value, 10);
        equal(data[9].value, 6);
    });

    test("initially expanded row and columns, expand row axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [] } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 1 }, { value: 2 }, { value: 3 },  { value: 4 }, { value: 5 }, { value: 6 } ],
            [ { value: 3 }, { value: 4 }, { value: 7 },  { value: 8 }, { value: 9 }, { value: 10 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift(),
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 1-0");

        var data = dataSource.data();
        equal(data.length, 10);
        equal(data[0].value, 1);
        equal(data[1].value, 2);
        equal(data[2].value, 3);
        equal(data[3].value, 4);
        equal(data[4].value, 7);
        equal(data[5].value, 8);
        equal(data[6].value, 9);
        equal(data[7].value, 10);
        equal(data[8].value, 5);
        equal(data[9].value, 6);
    });

    test("expand row axis with only one column", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 10 } ],
            [ { value: 10 }, { value: 3 }, { value: 7 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift(),
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 0");

        var data = dataSource.data();
        equal(data.length, 3);
        equal(data[0].value, 10);
        equal(data[1].value, 3);
        equal(data[2].value, 7);
    });

    test("initially expanded columns, expand row axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 1 }, { value: 2 } ],
            [ { value: 1 }, { value: 2 }, { value: 3 },  { value: 4 }, { value: 5 }, { value: 6 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift(),
                            columns: {
                                tuples: [
                                    { members: [ { name: "level 0", children: [] } ] },
                                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] }
                                ]
                            }
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 0");

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, 1);
        equal(data[1].value, 2);
        equal(data[2].value, 3);
        equal(data[3].value, 4);
        equal(data[4].value, 5);
        equal(data[5].value, 6);
    });

    test("expand second level on row axis without columns", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [] } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [] } ] },
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [] } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [] } ] }
                ]
            }
        ];

        var data = [
            [ { value: 1, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 3, ordinal: 2 } ],
            [ { value: 2, ordinal: 0 }, { value: 4, ordinal: 1 }, { value: 5, ordinal: 2 } ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow("level 1-0");

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, 1);
        equal(data[1].value, 2);
        equal(data[2].value, 4);
        equal(data[3].value, 5);
        equal(data[4].value, 3);
    });

    test("initially expanded multiple members on column axis", function() {
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
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                ]
                            }
                        },
                        data: [
                            { value: "dim 0 level 0", ordinal: 0 },
                            { value: "dim 0 level 1-0", ordinal: 1 },
                            { value: "dim 1 level 1-0", ordinal: 2 },
                            { value: "dim 2 level 1-0", ordinal: 3 },
                            { value: "dim 0 level 1-0, dim 1 level 1-0", ordinal: 4 },
                            { value: "dim 0 level 1-0, dim 2 level 1-0", ordinal: 5 },
                            { value: "dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0", ordinal: 6 }
                        ]
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 7);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-0, dim 1 level 1-0");
        equal(data[3].value, "dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0");
        equal(data[4].value, "dim 0 level 1-0, dim 2 level 1-0");
        equal(data[5].value, "dim 1 level 1-0");
        equal(data[6].value, "dim 2 level 1-0");
    });

    test("initially expanded multiple members on row axis", function() {
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
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                ]
                            }
                        },
                        data: [
                            { value: "dim 0 level 0", ordinal: 0 },
                            { value: "dim 0 level 1-0", ordinal: 1 },
                            { value: "dim 1 level 1-0", ordinal: 2 },
                            { value: "dim 2 level 1-0", ordinal: 3 },
                            { value: "dim 0 level 1-0, dim 1 level 1-0", ordinal: 4 },
                            { value: "dim 0 level 1-0, dim 2 level 1-0", ordinal: 5 },
                            { value: "dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0", ordinal: 6 }
                        ]
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 7);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-0, dim 1 level 1-0");
        equal(data[3].value, "dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0");
        equal(data[4].value, "dim 0 level 1-0, dim 2 level 1-0");
        equal(data[5].value, "dim 1 level 1-0");
        equal(data[6].value, "dim 2 level 1-0");
    });

    test("initially expanded multiple members on row axis and multuple columns", function() {
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
                                    { members: [
                                        { name: "dim 0 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                                    ] }
                                ]
                            },
                            rows: {
                                tuples: [
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                    { members: [
                                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] },
                                        { name: "dim 2 level 1-0", parentName: "dim 2 level 0", children: [] }
                                    ] },
                                ]
                            }
                        },
                        data: [
                            { value: "col 0 dim 0 level 0" },
                            { value: "col 1 dim 0 level 0" },
                            { value: "col 0 dim 0 level 1-0" },
                            { value: "col 1 dim 0 level 1-0" },
                            { value: "col 0 dim 1 level 1-0" },
                            { value: "col 1 dim 1 level 1-0" },
                            { value: "col 0 dim 2 level 1-0" },
                            { value: "col 1 dim 2 level 1-0" },
                            { value: "col 0 dim 0 level 1-0, dim 1 level 1-0" },
                            { value: "col 1 dim 0 level 1-0, dim 1 level 1-0" },
                            { value: "col 0 dim 0 level 1-0, dim 2 level 1-0" },
                            { value: "col 1 dim 0 level 1-0, dim 2 level 1-0" },
                            { value: "col 0 dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0" },
                            { value: "col 1 dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0" }
                        ]
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 14);
        equal(data[0].value, "col 0 dim 0 level 0");
        equal(data[1].value, "col 1 dim 0 level 0");
        equal(data[2].value, "col 0 dim 0 level 1-0");
        equal(data[3].value, "col 1 dim 0 level 1-0");
        equal(data[4].value, "col 0 dim 0 level 1-0, dim 1 level 1-0");
        equal(data[5].value, "col 1 dim 0 level 1-0, dim 1 level 1-0");
        equal(data[6].value, "col 0 dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0");
        equal(data[7].value, "col 1 dim 0 level 1-0, dim 1 level 1-0, dim 2 level 1-0");
        equal(data[8].value, "col 0 dim 0 level 1-0, dim 2 level 1-0");
        equal(data[9].value, "col 1 dim 0 level 1-0, dim 2 level 1-0");
        equal(data[10].value, "col 0 dim 1 level 1-0");
        equal(data[11].value, "col 1 dim 1 level 1-0");
        equal(data[12].value, "col 0 dim 2 level 1-0");
        equal(data[13].value, "col 1 dim 2 level 1-0");
    });

    test("expand first member on node with alreay expanded second member on column axis", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-1", parentName: "dim 1 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] }
                ]
            }
        ];
        var data = [
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 1 level 1-0", ordinal: 1 }, { value: "dim 1 level 1-1", ordinal: 2 } ],
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 0 level 1-0", ordinal: 1 }, { value: "dim 0 level 1-1", ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0"]);

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-1");
        equal(data[3].value, "dim 1 level 1-0");
        equal(data[4].value, "dim 1 level 1-1");
    });

    test("expand second member on node with alreay expanded first member on column axis", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-1", parentName: "dim 1 level 0", children: [] }
                    ] }
                ]
            }
        ];
        var data = [
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 0 level 1-0", ordinal: 1 }, { value: "dim 0 level 1-1", ordinal: 2 } ],
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 1 level 1-0", ordinal: 1 }, { value: "dim 1 level 1-1", ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0", "dim 1 level 0"]);

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-1");
        equal(data[3].value, "dim 1 level 1-0");
        equal(data[4].value, "dim 1 level 1-1");
    });

    test("expand first member on node with alreay expanded second member on row axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-1", parentName: "dim 1 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] }
                ]
            }
        ];
        var data = [
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 1 level 1-0", ordinal: 1 }, { value: "dim 1 level 1-1", ordinal: 2 } ],
            [ { value: "dim 0 level 0", ordinal: 0 }, { value: "dim 0 level 1-0", ordinal: 1 }, { value: "dim 0 level 1-1", ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-1");
        equal(data[3].value, "dim 1 level 1-0");
        equal(data[4].value, "dim 1 level 1-1");
    });

    test("expand second member on node with alreay expanded first member on rows axis", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-0", parentName: "dim 1 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "dim 1 level 1-1", parentName: "dim 1 level 0", children: [] }
                    ] }
                ]
            }
        ];
        var data = [
            [ { value: "dim 0 level 0", ordinal: 0}, { value: "dim 0 level 1-0", ordinal: 1 }, { value: "dim 0 level 1-1", ordinal: 2 } ],
            [ { value: "dim 0 level 0", ordinal: 0}, { value: "dim 1 level 1-0", ordinal: 1 }, { value: "dim 1 level 1-1", ordinal: 2 } ]
        ];
        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0", "dim 1 level 0"]);

        var data = dataSource.data();
        equal(data.length, 5);
        equal(data[0].value, "dim 0 level 0");
        equal(data[1].value, "dim 0 level 1-0");
        equal(data[2].value, "dim 0 level 1-1");
        equal(data[3].value, "dim 1 level 1-0");
        equal(data[4].value, "dim 1 level 1-1");
    });

    test("return less column tuples on row expand", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [], levelNum: "0" }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [], levelNum: "0" }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [], levelNum: "1" }
                    ] }
                ]
            }
        ];

        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [], levelNum: "0" }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [], levelNum: "1" }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [], levelNum: "1" }
                    ] }
                ]
            },
            {
                tuples: [
                { members: [
                    { name: "dim 0 level 0", children: [], levelNum: "0"  }
                    ] },
                { members: [
                    { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [], levelNum: "1" }
                    ] }
                ]
            }
        ];

        var data = [
            [{ value: "col 0, row 0" }, { value: "col 1, row 0" }, { value: "col 2, row 0" }],
            [{ value: "col 0, row 0" }, { value: "col 2, row 0" }, { value: "col 0, row 1" }, { value: "col 2, row 1" }]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 2);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 1);

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, "col 0, row 0");
        equal(data[1].value, "col 1, row 0");
        equal(data[2].value, "col 2, row 0");
        equal(data[3].value, "col 0, row 1");
        equal(data[4].value, "", "col 1, row 1 is not empty");
        equal(data[5].value, "col 2, row 1");
    });

    test("return less row tuples on column expand", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                { members: [
                    { name: "dim 0 level 0", children: [] }
                    ] },
                { members: [
                    { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0", ordinal: 0 },
                { value: "col 0, row 1", ordinal: 1 },
                { value: "col 0, row 2", ordinal: 2 }
            ],
            [
                { value: "col 0, row 0", ordinal: 0 },
                { value: "col 1, row 0", ordinal: 1 },
                { value: "col 0, row 2", ordinal: 2 },
                { value: "col 1, row 2", ordinal: 3 }
            ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 1);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 2);

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, "col 0, row 0");
        equal(data[1].value, "col 1, row 0");
        equal(data[2].value, "col 0, row 1");
        equal(data[3].value, "", "col 1, row 2 is not empty");
        equal(data[4].value, "col 0, row 2");
        equal(data[5].value, "col 1, row 2");
    });

    test("expand column with multiple measures", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [{ value: "level 0, measure 1", ordinal: 0 }, { value: "level 0, measure 2", ordinal: 1 }],
            [
                { value: "level 0, measure 1", ordinal: 0}, { value: "level 0, measure 2", ordinal: 1 },
                { value: "level 1, measure 1", ordinal: 2}, { value: "level 1, measure 2", ordinal: 3 }
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0"]);

        var data = dataSource.data();
        equal(data.length, 4);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1, measure 1");
        equal(data[3].value, "level 1, measure 2");
    });

    test("expand second nested column with multiple measures", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-1", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-1", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "level 0, measure 1", ordinal: 0},
                { value: "level 0, measure 2", ordinal: 1},
                { value: "level 1-0, measure 1", ordinal: 2},
                { value: "level 1-0, measure 2", ordinal: 3},
                { value: "level 1-1, measure 1", ordinal: 4},
                { value: "level 1-1, measure 2", ordinal: 5}
            ],
            [
                { value: "level 1-1, measure 1", ordinal: 0 },
                { value: "level 1-1, measure 2", ordinal: 1 },
                { value: "level 2, measure 1", ordinal: 2 },
                { value: "level 2, measure 2", ordinal: 3 }
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 1-0"]);

        var data = dataSource.data();
        equal(data.length, 8);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1-0, measure 1");
        equal(data[3].value, "level 1-0, measure 2");
        equal(data[4].value, "level 1-1, measure 1");
        equal(data[5].value, "level 1-1, measure 2");
        equal(data[6].value, "level 2, measure 1");
        equal(data[7].value, "level 2, measure 2");
    });

    test("expand nested column with multiple measures", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "level 0, measure 1", ordinal: 0 },
                { value: "level 0, measure 2", ordinal: 1 },
                { value: "level 1, measure 1", ordinal: 2 },
                { value: "level 1, measure 2", ordinal: 3 }
            ],
            [
                { value: "level 1, measure 1", ordinal: 0},
                { value: "level 1, measure 2", ordinal: 1},
                { value: "level 2, measure 1", ordinal: 2},
                { value: "level 2, measure 2", ordinal: 3}
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: ["measure 1", "measure 2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 1-0"]);

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1, measure 1");
        equal(data[3].value, "level 1, measure 2");
        equal(data[4].value, "level 2, measure 1");
        equal(data[5].value, "level 2, measure 2");
    });

    test("expand row with multiple measures", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "level 0, measure 1", ordinal: 0},
                { value: "level 0, measure 2", ordinal: 1}
            ],
            [
                { value: "level 0, measure 1", ordinal: 0 },
                { value: "level 0, measure 2", ordinal: 1 },
                { value: "level 1, measure 1", ordinal: 2 },
                { value: "level 1, measure 2", ordinal: 3 }
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
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
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var data = dataSource.data();
        equal(data.length, 4);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1, measure 1");
        equal(data[3].value, "level 1, measure 2");
    });

    test("expand second nested row with multiple measures", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-1", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-1", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "level 0, measure 1", ordinal: 0 },
                { value: "level 0, measure 2", ordinal: 1 },
                { value: "level 1-0, measure 1", ordinal: 2 },
                { value: "level 1-0, measure 2", ordinal: 3 },
                { value: "level 1-1, measure 1", ordinal: 4 },
                { value: "level 1-1, measure 2", ordinal: 5 }
            ],
            [
                { value: "level 1-1, measure 1", ordinal: 0 },
                { value: "level 1-1, measure 2", ordinal: 1 },
                { value: "level 2, measure 1", ordinal: 2 },
                { value: "level 2, measure 2", ordinal: 3 }
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
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
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 1-0"]);

        var data = dataSource.data();
        equal(data.length, 8);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1-0, measure 1");
        equal(data[3].value, "level 1-0, measure 2");
        equal(data[4].value, "level 1-1, measure 1");
        equal(data[5].value, "level 1-1, measure 2");
        equal(data[6].value, "level 2, measure 1");
        equal(data[7].value, "level 2, measure 2");
    });

    test("expand nested row with multiple measures", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 2-0", parentName: "dim 0 level 1-0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "level 0, measure 1", ordinal: 0 },
                { value: "level 0, measure 2", ordinal: 1 },
                { value: "level 1, measure 1", ordinal: 2 },
                { value: "level 1, measure 2", ordinal: 3 }
            ],
            [
                { value: "level 1, measure 1", ordinal: 4 },
                { value: "level 1, measure 2", ordinal: 5 },
                { value: "level 2, measure 1", ordinal: 6 },
                { value: "level 2, measure 2", ordinal: 7 }
            ],
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
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
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 1-0"]);

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, "level 0, measure 1");
        equal(data[1].value, "level 0, measure 2");
        equal(data[2].value, "level 1, measure 1");
        equal(data[3].value, "level 1, measure 2");
        equal(data[4].value, "level 2, measure 1");
        equal(data[5].value, "level 2, measure 2");
    });

    test("return less column tuples with nulls on row expand", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                { members: [
                    { name: "dim 0 level 0", children: [] }
                    ] },
                { members: [
                    { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [{ value: "col 0, row 0", ordinal: 0 }, { value: "col 1, row 0", ordinal: 1}, { value: "col 2, row 0", ordinal: 2 }],
            [{ value: "col 0, row 0", ordinal: 0 }, { value: "col 2, row 0", ordinal: 1 }, { value: "col 2, row 1", ordinal: 3 }]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 2);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 1);

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[0].value, "col 0, row 0");
        equal(data[1].value, "col 1, row 0");
        equal(data[2].value, "col 2, row 0");
        equal(data[3].value, "", "col 0, row 1 is not empty");
        equal(data[4].value, "", "col 1, row 1 is not empty");
        equal(data[5].value, "col 2, row 1");
    });

    test("return less column tuples on row expand with multiple measures on columns", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 0, row 0, measure 2", ordinal: 1 },
                { value: "col 1, row 0, measure 1", ordinal: 2 },
                { value: "col 1, row 0, measure 2", ordinal: 3 },
                { value: "col 2, row 0, measure 1", ordinal: 4 },
                { value: "col 2, row 0, measure 2", ordinal: 5 }
            ],
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 0, row 0, measure 2", ordinal: 1 },
                { value: "col 2, row 0, measure 1", ordinal: 2 },
                { value: "col 2, row 0, measure 2", ordinal: 3 },
                { value: "col 0, row 1, measure 1", ordinal: 4 },
                { value: "col 0, row 1, measure 2", ordinal: 5 },
                { value: "col 2, row 1, measure 1", ordinal: 6 },
                { value: "col 2, row 1, measure 2", ordinal: 7 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
                axis: "columns"
            },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 2);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 1);

        var data = dataSource.data();
        equal(data.length, 12);
        equal(data[0].value, "col 0, row 0, measure 1");
        equal(data[1].value, "col 0, row 0, measure 2");
        equal(data[2].value, "col 1, row 0, measure 1");
        equal(data[3].value, "col 1, row 0, measure 2");
        equal(data[4].value, "col 2, row 0, measure 1");
        equal(data[5].value, "col 2, row 0, measure 2");
        equal(data[6].value, "col 0, row 1, measure 1");
        equal(data[7].value, "col 0, row 1, measure 2");
        equal(data[8].value, "", "col 1, row 1, measure 1 is not empty");
        equal(data[9].value, "", "col 1, row 1, measure 2 is not empty");
        equal(data[10].value, "col 2, row 1, measure 1");
        equal(data[11].value, "col 2, row 1, measure 2");
    });

    test("return less column tuples on row expand with multiple measures on rows", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                { members: [
                    { name: "dim 0 level 0", children: [] }
                    ] },
                { members: [
                    { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 1, row 0, measure 1", ordinal: 1 },
                { value: "col 2, row 0, measure 1", ordinal: 2 },
                { value: "col 0, row 0, measure 2", ordinal: 3 },
                { value: "col 1, row 0, measure 2", ordinal: 4 },
                { value: "col 2, row 0, measure 2", ordinal: 5 }
            ],
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 2, row 0, measure 1", ordinal: 1 },
                { value: "col 0, row 0, measure 2", ordinal: 2 },
                { value: "col 2, row 0, measure 2", ordinal: 3 },
                { value: "col 0, row 1, measure 1", ordinal: 4 },
                { value: "col 2, row 1, measure 1", ordinal: 5 },
                { value: "col 0, row 1, measure 2", ordinal: 6 },
                { value: "col 2, row 1, measure 2", ordinal: 7 }
            ]
        ];

        var dataSource = new PivotDataSource({
            columns: ["dim 0 level 0"],
            rows: ["dim 0 level 0"],
            measures: {
                values: ["measure 1", "measure 2"],
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
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandRow(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 2);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 1);

        var data = dataSource.data();
        equal(data.length, 12);
        equal(data[0].value, "col 0, row 0, measure 1");
        equal(data[1].value, "col 1, row 0, measure 1");
        equal(data[2].value, "col 2, row 0, measure 1");

        equal(data[3].value, "col 0, row 0, measure 2");
        equal(data[4].value, "col 1, row 0, measure 2");
        equal(data[5].value, "col 2, row 0, measure 2");

        equal(data[6].value, "col 0, row 1, measure 1");
        equal(data[7].value, "", "col 1, row 1, measure 1 is not empty");
        equal(data[8].value, "col 2, row 1, measure 1");

        equal(data[9].value, "col 0, row 1, measure 2");
        equal(data[10].value, "", "col 1, row 1, measure 2 is not empty");
        equal(data[11].value, "col 2, row 1, measure 2");
    });

    test("return less row tuples on column expand with multiple measures on columns", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                { members: [
                    { name: "dim 0 level 0", children: [] }
                    ] },
                { members: [
                    { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 0, row 0, measure 2", ordinal: 1 },
                { value: "col 0, row 1, measure 1", ordinal: 2 },
                { value: "col 0, row 1, measure 2", ordinal: 3 },
                { value: "col 0, row 2, measure 1", ordinal: 4 },
                { value: "col 0, row 2, measure 2", ordinal: 5 }
            ],
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 0, row 0, measure 2", ordinal: 1 },
                { value: "col 1, row 0, measure 1", ordinal: 2 },
                { value: "col 1, row 0, measure 2", ordinal: 3 },
                { value: "col 0, row 2, measure 1", ordinal: 4 },
                { value: "col 0, row 2, measure 2", ordinal: 5 },
                { value: "col 1, row 2, measure 1", ordinal: 6 },
                { value: "col 1, row 2, measure 2", ordinal: 7 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
                axis: "columns"
            },
            columns: [ "dim 0 level 0" ],
            rows: [ "dim 0 level 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 1);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 2);

        var data = dataSource.data();
        equal(data.length, 12);
        equal(data[0].value, "col 0, row 0, measure 1");
        equal(data[1].value, "col 0, row 0, measure 2");
        equal(data[2].value, "col 1, row 0, measure 1");
        equal(data[3].value, "col 1, row 0, measure 2");
        equal(data[4].value, "col 0, row 1, measure 1");
        equal(data[5].value, "col 0, row 1, measure 2");
        equal(data[6].value, "", "col 1, row 2, measure 1 is not empty");
        equal(data[7].value, "", "col 1, row 2, measure 2 is not empty");
        equal(data[8].value, "col 0, row 2, measure 1");
        equal(data[9].value, "col 0, row 2, measure 2");
        equal(data[10].value, "col 1, row 2, measure 1");
        equal(data[11].value, "col 1, row 2, measure 2");
    });

    test("return less row tuples on column expand with multiple measures on rows", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] }
                    ] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-0", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            },
            {
                tuples: [
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 1", children: [] }
                    ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] },
                        { name: "measure 2", children: [] }
                    ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 0, row 0, measure 2", ordinal: 1 },
                { value: "col 0, row 1, measure 1", ordinal: 2 },
                { value: "col 0, row 1, measure 2", ordinal: 3 },
                { value: "col 0, row 2, measure 1", ordinal: 4 },
                { value: "col 0, row 2, measure 2", ordinal: 5 }
            ],
            [
                { value: "col 0, row 0, measure 1", ordinal: 0 },
                { value: "col 1, row 0, measure 1", ordinal: 1 },
                { value: "col 0, row 0, measure 2", ordinal: 2 },
                { value: "col 1, row 0, measure 2", ordinal: 3 },
                { value: "col 0, row 2, measure 1", ordinal: 4 },
                { value: "col 1, row 2, measure 1", ordinal: 5 },
                { value: "col 0, row 2, measure 2", ordinal: 6 },
                { value: "col 1, row 2, measure 2", ordinal: 7 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: {
                values: ["measure 1", "measure 2"],
                axis: "rows"
            },
            columns: [ "dim 0 level 0" ],
            rows: [ "dim 0 level 0" ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn(["dim 0 level 0"]);

        var columns = dataSource.axes().columns.tuples;
        equal(columns.length, 1);
        equal(columns[0].members[0].children.length, 1);

        var rows = dataSource.axes().rows.tuples;
        equal(rows.length, 1);
        equal(rows[0].members[0].children.length, 2);

        var data = dataSource.data();
        equal(data.length, 12);
        equal(data[0].value, "col 0, row 0, measure 1");
        equal(data[1].value, "col 1, row 0, measure 1");
        equal(data[2].value, "col 0, row 0, measure 2");
        equal(data[3].value, "col 1, row 0, measure 2");

        equal(data[4].value, "col 0, row 1, measure 1");
        equal(data[5].value, "", "col 1, row 1, measure 1 is not empty");
        equal(data[6].value, "col 0, row 1, measure 2");
        equal(data[7].value, "", "col 1, row 1, measure 2 is not empty");

        equal(data[8].value, "col 0, row 2, measure 1");
        equal(data[9].value, "col 1, row 2, measure 1");
        equal(data[10].value, "col 0, row 2, measure 2");
        equal(data[11].value, "col 1, row 2, measure 2");
    });

    test("expand of root level column axis without root tuple", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            }
        ];
        var data = [
            [ { value: 3, ordinal: 0 }, { value: 7, ordinal: 1 } ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 3);
        equal(data[0].value, "");
        equal(data[0].ordinal, 0);
        equal(data[1].value, 3);
        equal(data[1].ordinal, 1);
        equal(data[2].value, 7);
        equal(data[2].ordinal, 2);
    });

    test("expand of root level row axis missing measures", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 3", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 1, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 3, ordinal: 2 }, { value: 6, ordinal: 3 } ]
        ];

        var dataSource = new PivotDataSource({
            measures: { values: ["measure 1", "measure 2", "measure 3"], axis: "rows" },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[3].value, "");
        equal(data[3].ordinal, 3);
        equal(data[4].value, "");
        equal(data[4].ordinal, 4);
        equal(data[5].value, 6);
        equal(data[5].ordinal, 5);
    });

    test("expand of root level column axis missing measures", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                    { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure 3", children: [] } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure 3", children: [] } ] }
                ]
            }
        ];
        var data = [
            [ { value: 1, ordinal: 0 }, { value: 2, ordinal: 1 }, { value: 3, ordinal: 2 }, { value: 6, ordinal: 3 } ]
        ];

        var dataSource = new PivotDataSource({
            measures: { values: ["measure 1", "measure 2", "measure 3"], axis: "columns" },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 6);
        equal(data[3].value, "");
        equal(data[3].ordinal, 3);
        equal(data[4].value, "");
        equal(data[4].ordinal, 4);
        equal(data[5].value, 6);
        equal(data[5].ordinal, 5);
    });

    test("expand of root level row axis without root tuple", function() {
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            }
        ];
        var data = [
            [ { value: 3, ordinal: 0 }, { value: 7, ordinal: 1 } ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 3);
        equal(data[0].value, "");
        equal(data[0].ordinal, 0);
        equal(data[1].value, 3);
        equal(data[1].ordinal, 1);
        equal(data[2].value, 7);
        equal(data[2].ordinal, 2);
    });

    test("expand of root level of row and column axes without roots", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            }
        ];
        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            }
        ];
        var data = [
            [ { value: 3, ordinal: 0 }, { value: 7, ordinal: 1 }, { value: 10, ordinal: 2 }, { value: 11, ordinal: 3 } ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();

        equal(data.length, 9);
        //empty row
        equal(data[0].value, "");
        equal(data[0].ordinal, 0);
        equal(data[1].value, "");
        equal(data[1].ordinal, 1);
        equal(data[2].value, "");
        equal(data[2].ordinal, 2);
        //empty col
        equal(data[3].value, "");
        equal(data[3].ordinal, 3);
        equal(data[4].value, 3);
        equal(data[4].ordinal, 4);
        equal(data[5].value, 7);
        equal(data[5].ordinal, 5);

        //empty col
        equal(data[6].value, "");
        equal(data[6].ordinal, 6);
        equal(data[7].value, 10);
        equal(data[7].ordinal, 7);
        equal(data[8].value, 11);
        equal(data[8].ordinal, 8);
    });

    test("expand of child level of column axis without root", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "level 0", children: [], levelNum: "0" } ] },
                    { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" } ] },
                    { members: [ { name: "level 1-1", parentName: "level 0", children: [], levelNum: "1" } ] }
                ]
            },
            {
                tuples: [
                    { members: [ { name: "level 2-0", parentName: "level 1-0", children: [], levelNum: "2" } ] },
                    { members: [ { name: "level 2-1", parentName: "level 1-0", children: [], levelNum: "2" } ] }
                ]
            }
        ];
        var data = [
            [ { value: 3, ordinal: 0 }, { value: 7, ordinal: 1 }, { value: 10, ordinal: 2 } ],
            [ { value: 22, ordinal: 0 }, { value: 25, ordinal: 1 } ]
        ];

        var dataSource = new PivotDataSource({
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();
        dataSource.expandColumn("level 1-0");

        var data = dataSource.data();

        equal(data.length, 5);

        equal(data[0].value, 3);
        equal(data[1].value, 7);
        equal(data[2].value, 22);
        equal(data[3].value, 25);
        equal(data[4].value, 10);
    });

    test("children with missing ordinals and measure columns in between are normalized correctly", 9, function() {
        var columns = {
            tuples: [
                { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure1", children: [] } ] },
                { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure2", children: [] } ] },
                { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure2", children: [] } ] }
            ]
        };

        //ordinal is 2, because one tuple is missing
        var data = [ { value: 0, ordinal: 0 }, { value: 3, ordinal: 2 } ];

        var dataSource = new PivotDataSource({
            measures: ["measure1", "measure2"],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columns
                        },
                        data: data
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();

        equal(data.length, 4);
        equal(data[0].value, 0);
        equal(data[0].ordinal, 0);
        equal(data[1].value, "");
        equal(data[1].ordinal, 1);
        equal(data[2].value, "");
        equal(data[2].ordinal, 2);
        equal(data[3].value, 3);
        equal(data[3].ordinal, 3);
    });

    test("children with missing ordinals and measure columns in between are normalized correctly (rows)", 9, function() {
        var rows = {
            tuples: [
                { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure1", children: [] } ] },
                { members: [ { name: "level 0", children: [], levelNum: "0" }, { name: "measure2", children: [] } ] },
                { members: [ { name: "level 1-0", parentName: "level 0", children: [], levelNum: "1" }, { name: "measure2", children: [] } ] }
            ]
        };

        //ordinal is 2, because one tuple is missing
        var data = [ { value: 0, ordinal: 0 }, { value: 3, ordinal: 2 } ];

        var dataSource = new PivotDataSource({
            measures: { axis: "rows", values: ["measure1", "measure2"] },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: rows
                        },
                        data: data
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();

        equal(data.length, 4);
        equal(data[0].value, 0);
        equal(data[0].ordinal, 0);
        equal(data[1].value, "");
        equal(data[1].ordinal, 1);
        equal(data[2].value, "");
        equal(data[2].ordinal, 2);
        equal(data[3].value, 3);
        equal(data[3].ordinal, 3);
    });

    test("children with missing measures and ordinals on multiple rows are normalized correctly", function() {
        var columnTuples = [
            {
                tuples: [
                    { members: [ { name: "dim 0 level 0", children: [] }, { name: "measure1", children: [] } ] },
                    { members: [ { name: "dim 0 level 0", children: [] }, { name: "measure2", children: [] } ] },
                    { members: [
                        { name: "dim 0 level 1-1", parentName: "dim 0 level 0", children: [] }, { name: "measure1", children: [] }
                    ] }
                ]
            }
        ];

        var rowTuples = [
            {
                tuples: [
                    { members: [ { name: "dim 1 level 0", children: [] } ] },
                    { members: [ { name: "dim 1 level 1-1", parentName: "dim 1 level 0", children: [] } ] },
                    { members: [ { name: "dim 1 level 1-2", parentName: "dim 1 level 0", children: [] } ] }
                ]
            }
        ];

        var data = [
            [
                { value: "col 0, row 0", ordinal: 0 }, { value: "col 1, row 0", ordinal: 1 }, { value: "col 2, row 0", ordinal: 2 },
                                                       { value: "col 1, row 1", ordinal: 4 },
                                                       { value: "col 1, row 2", ordinal: 7 }
            ]
        ];

        var dataSource = new PivotDataSource({
            measures: { axis: "columns", values: ["measure1", "measure2"] },
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: columnTuples.shift(),
                            rows: rowTuples.shift()
                        },
                        data: data.shift()
                    });
                }
            }
        });

        dataSource.read();

        var data = dataSource.data();
        equal(data.length, 12);
        equal(data[0].value, "col 0, row 0");
        equal(data[1].value, "col 1, row 0");
        equal(data[2].value, "col 2, row 0");
        equal(data[3].value, "", "col 3, row 0 is not empty");

        equal(data[4].value, "", "col 0, row 1 is not empty");
        equal(data[5].value, "col 1, row 1");
        equal(data[6].value, "", "col 2, row 1 is not empty");
        equal(data[7].value, "", "col 3, row 1 is not empty");

        equal(data[8].value, "", "col 0, row 2 is not empty");
        equal(data[9].value, "col 1, row 2");
        equal(data[10].value, "", "col 2, row 2 is not empty");
        equal(data[11].value, "", "col 3, row 2 is not empty");
    });
})();
