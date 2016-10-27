(function() {
    var Gantt = kendo.ui.Gantt;
    var GanttDataSource = kendo.data.GanttDataSource;
    var container;
    var JSONData = [
        { title: "Task1", parentId: null, id: 1 },
            { title: "Child 1.1", parentId: 1, id: 2 },
            { title: "Child 1.2", parentId: 1, id: 3 },
            { title: "Child 1.3", parentId: 1, id: 4 },
        { title: "Task2", parentId: null, id: 5 },
            { title: "Child 2.1", parentId: 5, id: 6 },
            { title: "Child 2.2", parentId: 5, id: 7 },
            { title: "Child 2.3", parentId: 5, id: 8 }
    ];
    var dataSource = {
        data: JSONData,
        schema: {
            model: {
                id: "id"
            }
        }
    };

    module("Gantt", {
        setup: function() {
            jasmine.clock().install();
            container = $("<div />");
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(container);
        }
    });

    test("creates a GanttDataSource", function() {
        var gantt = new Gantt(container);

        ok(gantt.dataSource instanceof kendo.data.GanttDataSource);
    });

    test("creates a GanttDataSource from array", function() {
        var gantt = new Gantt(container, []);

        ok(gantt.dataSource instanceof kendo.data.GanttDataSource);
    });

    test("creates a GanttDataSource from GanttDataSource", function() {
        var gantt = new Gantt(container, {
            dataSource: new kendo.data.GanttDataSource()
        });

        ok(gantt.dataSource instanceof kendo.data.GanttDataSource);
    });

    test("throws exception for wrong DataSource type", function() {
        throws(function() {
            new Gantt(container, {
                dataSource: new kendo.data.DataSource()
            });
        });
    });

    test("dataBinding event is fired", function() {
        var flag = false;

        new Gantt(container, {
            dataBinding: function(e) {
                flag = true;

            }
        });
        jasmine.clock().tick(1);
        ok(true);
    });

    test("dataBinding event is fired only once", function() {
        var counter = 0;
        new Gantt(container, {
            dataBinding: function(e) {
                counter++;
            }
        });
        jasmine.clock().tick(1);
        equal(counter, 1);
    });

    test("dataBound event is fired", function() {
        var flag = false;

        new Gantt(container, {
            dataBound: function(e) {
                flag = true;
            }
        });
        jasmine.clock().tick(1);
        ok(true);
    });

    test("dataBound event is fired only once", function() {
        var counter = 0;
        new Gantt(container, {
            dataBound: function(e) {
                counter++;
            }
        });
        jasmine.clock().tick(1);
        equal(counter, 1);
    });

    test("dataBinding event can be prevented", 0, function() {
        new Gantt(container, {
            dataBinding: function(e) {
                e.preventDefault();
            },
            dataBound: function() {
                ok(false);
            }
        });
    });

    test("AutoBind=false prevents gantt from binding", 0, function() {
        new Gantt(container, {
            autoBind: false,
            dataBinding: function() {
                ok(false);
            }
        });
    });

    test("resetting DataSource rebinds the widget", 1, function() {
        var flag = false

        var gantt = new Gantt(container, {
            dataBinding: function() {
                flag = true;

            }
        });

        gantt.setDataSource(new kendo.data.GanttDataSource());
        jasmine.clock().tick(1);
        ok(true);
    });

    test("Initializing from JSON array populates items", function() {
        var gantt = new Gantt(container, {
            dataSource: JSONData,
            showWorkDays: false
        });

        equal(gantt.dataSource.data().length, 8);
    });

    test("Initializing from local datasource populates items", function() {
        var gantt = new Gantt(container, {
            dataSource: dataSource,
            showWorkDays: false
        });

        equal(gantt.dataSource.data().length, 8);
    });

    test("Initializing from remote datasource populates items", function() {
        var gantt = new Gantt(container, {
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success([{}, {}]);
                    }
                }
            },
            showWorkDays: false
        });

        equal(gantt.dataSource.data().length, 2);
    });

    test("Initializing from existing datasource populates items", function() {
        var gantt = new Gantt(container, {
            dataSource: new GanttDataSource({
                data: JSONData
            }),
            showWorkDays: false
        });

        equal(gantt.dataSource.data().length, 8);
    });

    module("Dependencies", {
        setup: function() {
            jasmine.clock().install();
            container = $("<div />");
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(container);
        }
    });

    test("create GanttDependencyDataSource", function() {
        var gantt = new Gantt(container);

        ok(gantt.dependencies instanceof kendo.data.GanttDependencyDataSource);
    });

    test("create GanttDependencyDataSource from Array", function() {
        var gantt = new Gantt(container, {
            dependencies: [{}, {}]
        });

        ok(gantt.dependencies instanceof kendo.data.GanttDependencyDataSource);
    });

    test("create GanttDependencyDataSource from datasource", function() {
        var gantt = new Gantt(container, {
            dependencies: {
                data: [{}, {}]
            }
        });

        ok(gantt.dependencies instanceof kendo.data.GanttDependencyDataSource);
    });

    test("throw exception for wrong DataSource type", function() {
        throws(function() {
            new Gantt(container, {
                dependencies: new kendo.data.DataSource()
            });
        });
    });

    test("populated from JSON array", function() {
        var gantt = new Gantt(container, {
            dependencies: [{}, {}]
        });

        ok(gantt.dependencies.data().length === 2);
    });

    test("populated from local datasource", function() {
        var gantt = new Gantt(container, {
            dependencies: {
                data: [{}, {}]
            }
        });

        ok(gantt.dependencies.data().length === 2);
    });

    test("populated from remote datasource", function() {
        var gantt = new Gantt(container, {
            dependencies: {
                transport: {
                    read: function(options) {
                        options.success([{}, {}]);
                    }
                }
            }
        });

        ok(gantt.dependencies.data().length === 2);
    });

})();
