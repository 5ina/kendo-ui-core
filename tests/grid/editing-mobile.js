(function() {
   var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        dataSource;

    function setup(options) {
        options = $.extend({}, {
        editable: "popup",
        mobile: "phone",
        dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            name: "name",
                            foo: "foo"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }, options);
        dataSource = options.dataSource;

        var grid = table.kendoGrid(options).data("kendoGrid");
        grid._editAnimation = "";

        return grid;
    }

    QUnit.config.reorder = false;

    module("grid mobile editing", {
        setup: function() {
            table = document.createElement("table");
            QUnit.fixture[0].appendChild(table);

            table = $(table);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            table.closest(".k-grid").remove();
            $(".km-pane-wrapper").remove();
        }
    });

    test("edit container is wrapped in mobile view", function() {
        var grid = setup();

        grid.editRow(grid.items().eq(0));

        ok(grid.editView);
        ok($.contains(grid.editView.element[0], grid.editable.element[0]));
    });

    test("grid pane navigates to edit view", function() {
        var grid = setup();

        grid.editRow(grid.items().eq(0));

        strictEqual(grid.pane.view(), grid.editView);
        ok(grid.editView.element.is(":visible"));
    });

    test("grid destroy removes the edit view", function() {
        var grid = setup();
        var wasCalled = false;

        grid.editRow(grid.items().eq(0));

        grid.editView.purge = function() {
            wasCalled = true;
        };

        grid.destroy();

        ok(!grid.editView);
        ok(wasCalled);
    });

    test("click on cancel button navigates back to grid view", function() {
        var grid = setup();

        grid.editRow(grid.items().eq(0));
        grid.editView.element.find(".k-grid-cancel").click();

        ok(grid.view === grid.pane.view(), "Current view is not the one which wraps the Grid");
    });

    asyncTest("loading indicator is shown when saving rows", 1, function() {
        var grid = setup({
            dataSource: {
                transport: {
                    read: function(e) {
                        e.success([{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]);
                    },
                    update: function(e) {
                        start();
                        equal(grid._editContainer.find(".k-loading-mask").length, 1);
                    }
                },
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            name: "name",
                            foo: "foo"
                        }
                    }
                }
            }
        });

        grid.editRow(grid.items().eq(0));
        grid._modelForContainer(grid._editContainer).set("name", "newName");
        grid.saveRow(grid.items().eq(0));
    });

    asyncTest("loading indicator is removed when request completes", 2, function() {
        var grid = setup({
            dataSource: {
                transport: {
                    read: function(e) {
                        e.success([{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]);
                    },
                    update: function(e) {
                        start();

                        equal(grid._editContainer.find(".k-loading-mask").length, 1);
                        e.error("SomeError");
                        equal(grid._editContainer.find(".k-loading-mask").length, 0);
                    }
                },
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            name: "name",
                            foo: "foo"
                        }
                    }
                }
            }
        });

        grid.editRow(grid.items().eq(0));
        grid._modelForContainer(grid._editContainer).set("name", "newName");
        grid.saveRow(grid.items().eq(0));
    });

    asyncTest("saveRow navigates back to grid view", 1, function() {
        var grid = setup();

        grid.editRow(grid.items().eq(0));
        grid.saveRow(grid.items().eq(0)).done(function() {
            start();
            ok(grid.view === grid.pane.view(), "Current view is not the one which wraps the Grid");
        });
    });
})();
