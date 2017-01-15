(function() {
   var Grid = kendo.ui.Grid,
        table,
        data = [{ foo: "foo", bar: "bar" }],
        ns,
        DataSource = kendo.data.DataSource;

    module("grid column menu", {
        setup: function() {
            ns = kendo.ns;
            kendo.ns = "";
            table = $("<table></table>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            table.closest(".k-grid").remove();
            kendo.ns = ns;
        }
    });

    function setup(options) {
        return new Grid(table, $.extend(true, {}, {
            columnMenu: true,
            dataSource: data
        },
        options));
    }

    test("column menu in config options", function() {
        strictEqual(Grid.fn.options.columnMenu, false);
    });

    test("column menu initialized in Grid header", function() {
        var grid = setup({
            columns: ["foo", "bar"]
        });

        var th = grid.thead.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("column menu button renders text as title", function () {
        var grid = setup({
            columns: ["foo", "bar"]
        });

        var th = grid.thead.find("th").first();
        equal(th.find("a").attr("title"), th.data("kendoColumnMenu").options.messages.settings);
    });

    test("column menu initialized in Grid header when auto columns", function() {
        var grid = setup();

        var th = grid.thead.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("columnMenu as true boolean", function() {
        var grid = setup();

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, false);
        equal(menu.options.columns, true);
        equal(menu.options.filterable, false);
    });

    test("columnMenu columns message changed", function() {
        var grid = setup({
            columnMenu: {
                messages: {
                    columns: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.messages.columns, "foo");
    });

    test("columnMenu columns set to false", function() {
        var grid = setup({
            columnMenu: {
                columns: false
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.columns, false);
    });

    test("columnMenu as true boolean and sortable grid", function() {
        var grid = setup({ sortable: true });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.sortable);
        equal(menu.options.filterable, false);
    });

    test("columnMenu as true boolean and sortable grid not sortable column", function() {
        var grid = setup({
            sortable: true,
            columns: [{ field: "foo", sortable: false }]
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable, false);
    });

    test("columnMenu in sortable grid changed text", function() {
        var grid = setup({
            sortable: true,
            columnMenu: {
                messages: {
                    sortAscending: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.sortable);
        equal(menu.options.messages.sortAscending, "foo");
    });

    test("passes extended sortable options", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                sortable: {
                    compare: "foo",
                    mode: "single"
                }
            }],
            sortable: {
                mode: "multiple"
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.sortable.compare, "foo");
        equal(menu.options.sortable.mode, "multiple");
    });

    test("columnMenu as true boolean and filterable grid", function() {
        var grid = setup({ filterable : true });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.filterable);
    });

    test("columnMenu as true boolean and filterable grid not filterable column", function() {
        var grid = setup({
            filterable: true,
            columns: [{ field: "foo", filterable: false }]
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        equal(menu.options.filterable, false);
    });

    test("columnMenu in filterable grid changed text", function() {
        var grid = setup({
            filterable: true,
            columnMenu: {
                messages: {
                    filter: "foo"
                }
            }
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.filterable);
        equal(menu.options.messages.filter, "foo");
    });

    test("filterable grid does not render header filter link", function() {
        var grid = setup({ filterable: true });

        equal(grid.thead.find(".k-grid-filter").length, 0);
    });

    test("column filterable settings override globar filterable settings", function() {
        var grid = setup({
            filterable: {
                extra: false
            },
            columns: [{
                    field: "foo",
                    filterable: {
                        extra: true
                    }
                },
                "bar"
            ]
        });

        var menu = grid.thead.find("th:first").data("kendoColumnMenu");

        ok(menu.options.filterable.extra);
    });

    test("column menu init event", 1, function() {
        var grid = setup({
            columns: ["foo"],
            columnMenu: true,
            columnMenuInit: function(e) {
                equal(e.field, "foo");
            }
        });

        grid.thead.find("th:first").data("kendoColumnMenu").link.click();
    });

    test("column menu initialization over locked columns", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        ok(th.eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu, "locked column doesn't have column menu");
        ok(th.eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu, "non locked column doesn't have column menu");
    });

    test("column menu lockedColumns is set", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(0).data("kendoColumnMenu").options.lockedColumns, true);
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, true);
    });

    test("column menu lockedColumns is not set", function() {
        var grid = setup({
            columns: [
                { field: "foo" },
                { field: "bar" }
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(0).data("kendoColumnMenu").options.lockedColumns, false);
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, false);
    });

    test("column menu lockedColumns is not set when multicolumn headers are enabled", function() {
        var grid = setup({
            columns: [
                { columns: [
                    { field: "foo", locked: true },
                    { field: "bar" }
                ]}
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, false);
        equal(th.eq(2).data("kendoColumnMenu").options.lockedColumns, false);
    });


    test("column menu lockedColumns when lockable is disabled", function() {
        var grid = setup({
            columns: [
                { field: "foo", lockable: false, locked: true },
                { field: "bar", lockable: false, locked: false }
            ]
        });

        var th = grid.wrapper.find("th");
        equal(th.eq(0).data("kendoColumnMenu").options.lockedColumns, false);
        equal(th.eq(1).data("kendoColumnMenu").options.lockedColumns, false);
    });

    test("column menu initialization over multiline data columns", function() {
        var grid = setup({
            columns: [
                { columns: [{ field: "foo" }] },
                { field: "bar" },
                { columns: [{ field: "foo" }] }
            ]
        });

        var rows = grid.thead.find("tr");

        ok(rows.eq(0).find("th").eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(rows.eq(1).find("th").eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(rows.eq(1).find("th").eq(1).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("column menu initialization over multiline locked data columns", function() {
        var grid = setup({
            columns: [
                { columns: [{ field: "foo" }], locked: true },
                { field: "bar" },
                { columns: [{ field: "foo" }] }
            ]
        });

        var rows = grid.thead.find("tr");
        var lockedRows = grid.lockedHeader.find("tr");

        ok(lockedRows.eq(1).find("th").eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);

        ok(rows.eq(0).find("th").eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
        ok(rows.eq(1).find("th").eq(0).data("kendoColumnMenu") instanceof kendo.ui.ColumnMenu);
    });

    test("filtering highlights the column menu icon", function() {
        var grid = setup({
            columns: [
                {
                    field: "foo"
                }
            ],
            filterable: true
        });

        var link = grid.thead.find("th>a");
        link.click();
        grid.dataSource.filter({ field: "foo", operator: "eq", value: "foo" });

        ok(link.hasClass("k-state-active"), "the header cell is not marked as active");
    });

    test("filtering highlights the column menu icon when menu is not initialized", function() {
        var grid = setup({
            columns: [
                {
                    field: "foo"
                }
            ],
            filterable: true
        });

        var link = grid.thead.find("th>a");
        grid.dataSource.filter({ field: "foo", operator: "eq", value: "foo" });

        ok(link.hasClass("k-state-active"), "the header cell is not marked as active");
    });

})();
