(function() {
    var Grid = kendo.ui.Grid,
        DataSource = kendo.data.DataSource;

    module("grid sorting", {
        setup: function() {
            kendo.ns = "kendo-";
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    function append(html) {
        return $(html).appendTo(QUnit.fixture);
    }

    test("sortable true attach sortable to the header", function() {
        var element = append("<table><thead><tr><th/><th/></tr></thead></table>"),
            grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo" },
                { field: "bar" }
            ],
            sortable: true,
            scrollable: false
        });
        var ths = $(element).find("th");
        ok(ths.eq(0).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
        ok(ths.eq(1).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
    });

    test("attach sortable to the header in scrollable grid", function() {
        var element = append("<table><thead><tr><th/><th/></tr></thead></table>"),
            grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo" },
                { field: "bar" }
            ],
            sortable: true,
            scrollable: true
        });

        var ths = grid.wrapper.find("th");

        ok(ths.eq(0).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
        ok(ths.eq(1).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
    });

    test("sortable passes options to the individual sorters", function() {
        var element = append("<table><thead><tr><th/></tr></thead></table>"),
            grid = new Grid(element, {
            data: [],
            columns: [{ field: "foo" }],
            sortable: {
                allowUnsort: false,
                mode: "multiple"
            }
        });
        var sortable = grid.wrapper.find("th").data("kendoColumnSorter");
        equal(sortable.options.mode, "multiple");
        equal(sortable.options.allowUnsort, false);
    });

    test("column sortable options are passed to the sorters", function() {
        var element = append("<table><thead><tr><th/></tr></thead></table>"),
            grid = new Grid(element, {
            data: [],
            columns: [ { field: "foo", sortable: { compare: $.noop } } ],
            sortable: {
                allowUnsort: false,
                mode: "multiple"
            }
        });
        var sortable = grid.wrapper.find("th").data("kendoColumnSorter");
        equal(sortable.options.compare, $.noop);
    });

    test("sortable is properly attached when there is no table header initially", function() {
        var element = append("<table />"),
            grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo" },
                { field: "bar" }
            ],
            sortable: true
        });
        var ths = grid.wrapper.find("th");
        ok(ths.eq(0).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
        ok(ths.eq(1).data("kendoColumnSorter") instanceof kendo.ui.ColumnSorter);
    });

    test("generating headers sets data-kendo-field attr when sorting is enabled", function() {
        var element = append("<table />"),
            grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo" },
                { field: "bar" }
            ],
            sortable: true
        });
        var ths = grid.wrapper.find("th");
        ok(ths.eq(0).attr("data-kendo-field") === "foo");
        ok(ths.eq(1).attr("data-kendo-field") === "bar");
    });

    test("resetting DataSource instantiate new Sortable", 1, function() {
        var grid = new Grid(append("<table />"), { sortable: true, columns: ["text", "value"] });

        var sortable = grid.thead.find("th:first").data("kendoColumnSorter");

        grid.setDataSource(new kendo.data.DataSource({
            data:[{text: 1, value: 1}, {text:2, value:2}]
        }));

        notStrictEqual(grid.thead.find("th:first").data("kendoColumnSorter"), sortable);
    });

    test("resetting DataSource destroyes the old Sortable", 1, function() {
        var grid = new Grid(append("<table />"), { sortable: true, columns: ["text", "value"] });

        var sortable = grid.thead.find("th:first").data("kendoColumnSorter");

        var destroy = stub(sortable, { "destroy": sortable.destroy });

        grid.setDataSource(new kendo.data.DataSource({
            data:[{text: 1, value: 1}, {text:2, value:2}]
        }));

        equal(destroy.calls("destroy"), 1);
    });

    test("sortable is not attached if column does not have field", 1, function() {
        var grid = new Grid(append("<table />"), { sortable: true, columns: [ { title: "foo" } ] });

       ok(!grid.thead.find("th:first").data("kendoColumnSorter"));
    });

    test("sortable is attached to the th elements with multi-line headers", function() {
        var element = append("<table></table>"),
            grid = new Grid(element, {
                sortable: true,
                data: [],
                columns: [{ title: "group", columns: [{ field: "foo" }, { field: "bar" }] }]
            });

        ok(!grid.thead.find("tr:first th").data("kendoColumnSorter"));

        var row = grid.thead.find("tr:last");
        ok(row.find("th:first").data("kendoColumnSorter"));
        ok(row.find("th:last").data("kendoColumnSorter"));
    });

    test("sorting triggers sort event", 2, function() {
        var grid = new Grid(append("<table />"), {
            sortable: true,
            columns: ["text", "value"],
            sort: function(e) {
                equal(e.sort.field, "text");
                equal(e.sort.dir, "asc");
            }
        });

        grid.thead.find("th:first > a").click();
    });

    test("preventing sort event prevents setting sort descriptor to DataSource", 1, function() {
        var grid = new Grid(append("<table />"), {
            sortable: true,
            columns: ["text", "value"],
            sort: function(e) {
                e.preventDefault();
            }
        });

        grid.thead.find("th:first > a").click();

        ok(!grid.dataSource.sort(), "There is sort descriptors in the DataSource");
    });


})();
