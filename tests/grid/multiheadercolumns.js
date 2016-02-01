(function() {
    var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource;

    module("grid multicolumnheaders", {
        setup: function() {
            kendo.ns = "kendo-";
            table = document.createElement("table");
            QUnit.fixture[0].appendChild(table);
        },
        teardown: function() {
            var component = $(table).data("kendoGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    test("render correct number of rows and columns - single nested column", function() {

        var grid = new Grid(table, {
            columns: [{ title: "master", columns: [{ title: "child" }] }]
        });

        equal(grid.thead.find("tr").length, 2);
        equal(grid.thead.find("tr:first").find("th").length, 1);
        equal(grid.thead.find("tr:last").find("th").length, 1);
    });

    test("render correct number of rows and columns - two parent and one child columns", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master", columns: [{ title: "child" }] }, { title: "master1" }]
        });

        var firstRow = grid.thead.find("tr:first");
        var lastRow = grid.thead.find("tr:last");

        equal(grid.thead.find("tr").length, 2);
        equal(firstRow.find("th").length, 2);
        equal(firstRow.find("th").first().text(), "master");
        equal(firstRow.find("th").last().text(), "master1");
        equal(lastRow.find("th").length, 1);
        equal(lastRow.find("th").last().text(), "child");
    });

    test("render rowspan to parent cell - two parent and one child columns", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master", columns: [{ title: "child" }] }, { title: "master1" }]
        });

        var firstRow = grid.thead.find("tr:first");
        var lastRow = grid.thead.find("tr:last");

        ok(!firstRow.find("th").first().attr("rowSpan"), "first master column rowspan is not correct");
        equal(firstRow.find("th").last().attr("rowSpan"), 2);
        ok(!lastRow.find("th").first().attr("rowSpan"), "first child column rowspan is not correct");
    });

    test("does not render colspan for cells - two parent and one child columns", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master", columns: [{ title: "child" }] }, { title: "master1" }]
        });

        var firstRow = grid.thead.find("tr:first");
        var lastRow = grid.thead.find("tr:last");

        ok(!firstRow.find("th").first().attr("colSpan"));
        ok(!firstRow.find("th").last().attr("colSpan"));
        ok(!lastRow.find("th").first().attr("colSpan"));
    });

    test("render rows and columns - two parents and second one with mutiple child columns", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master" }, { title: "master1", columns: [{ title: "child" }, { title: "child1" }] }]
        });

        var firstRow = grid.thead.find("tr:first");
        var lastRow = grid.thead.find("tr:last");

        equal(grid.thead.find("tr").length, 2);
        equal(firstRow.find("th").length, 2);
        equal(firstRow.find("th").first().attr("rowSpan"), 2);
        equal(firstRow.find("th").first().text(), "master");
        equal(firstRow.find("th").last().attr("colSpan"), 2, "foo");
        equal(firstRow.find("th").last().text(), "master1");
        equal(lastRow.find("th").length, 2);
        equal(lastRow.find("th").first().text(), "child");
        equal(lastRow.find("th").last().text(), "child1");
    });

    test("render rows and columns - three parents, second one with 3 level columns, third one with two child columns", function() {
        var grid = new Grid(table, {
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        var firstRow = grid.thead.find("tr:first");
        var secondRow = grid.thead.find("tr:eq(1)");
        var lastRow = grid.thead.find("tr:last");

        equal(grid.thead.find("tr").length, 3);
        equal(firstRow.find("th").length, 3);
        equal(firstRow.find("th").first().attr("rowSpan"), 3);
        equal(firstRow.find("th").first().text(), "master");

        equal(firstRow.find("th").eq(1).text(), "master1");
        equal(firstRow.find("th").eq(1).attr("colSpan"), 2);

        equal(firstRow.find("th").last().attr("colSpan"), 2);
        equal(firstRow.find("th").last().text(), "master2");

        equal(secondRow.find("th").length, 4);
        equal(secondRow.find("th").first().text(), "master1-child");
        ok(!secondRow.find("th").first().attr("colSpan"));
        equal(secondRow.find("th").eq(1).text(), "master1-child1");
        equal(secondRow.find("th").eq(1).attr("rowSpan"), 2);
        equal(secondRow.find("th").eq(2).text(), "master2-child");
        ok(!secondRow.find("th").eq(2).attr("colSpan"));
        equal(secondRow.find("th").eq(3).text(), "master2-child1");
        ok(!secondRow.find("th").eq(3).attr("colSpan"));

        equal(lastRow.find("th").length, 1);
        ok(!lastRow.find("th").first().attr("colSpan"));
        equal(lastRow.find("th").first().text(), "master1-child-child");
    });

    test("render correct number of rows and columns - two parents with 3 levels single columns", function() {

        var grid = new Grid(table, {
            columns: [
                {
                    title: "master1",
                    columns: [{
                        title: "master1-child",
                        columns: [{ title: "master1-child-child"}]
                    }]
                },
                {
                    title: "master2",
                    columns: [{
                        title: "master2-child",
                        columns: [{ title: "master2-child-child1"}]
                    }]
                }]
        });

        equal(grid.thead.find("tr").length, 3);
        equal(grid.thead.find("tr:first").find("th").length, 2);
        equal(grid.thead.find("tr:eq(1)").find("th").length, 2);
        equal(grid.thead.find("tr:last").find("th").length, 2);
    });


    test("render correct number of col elements", function() {
        var grid = new Grid(table, {
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        equal(grid.thead.parent().find("col").length, 5);
        equal(grid.tbody.parent().find("col").length, 5);
    });

    test("hierarchy cell is added to the header if detailView is defined", function() {
        var grid = new Grid(table, {
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ],
            detailTemplate: "#= foo #",
        });

        var firstRow = grid.thead.find("tr:first");
        var secondRow = grid.thead.find("tr:eq(1)");
        var lastRow = grid.thead.find("tr:last");

        equal(grid.thead.find("tr").length, 3);
        ok(firstRow.find("th").first().hasClass("k-hierarchy-cell"));
        ok(secondRow.find("th").first().hasClass("k-hierarchy-cell"));
        ok(lastRow.find("th").first().hasClass("k-hierarchy-cell"));
        equal(grid.thead.find("th.k-hierarchy-cell").length, 3);
    });

    test("group cell is added to the header when grouped", function() {
        var grid = new Grid(table, {
            dataSource: {
                group: "foo"
            },
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        var firstRow = grid.thead.find("tr:first");
        var secondRow = grid.thead.find("tr:eq(1)");
        var lastRow = grid.thead.find("tr:last");

        equal(grid.thead.find("tr").length, 3);
        ok(firstRow.find("th").first().hasClass("k-group-cell"));
        ok(secondRow.find("th").first().hasClass("k-group-cell"));
        ok(lastRow.find("th").first().hasClass("k-group-cell"));
        equal(grid.thead.find("th.k-group-cell").length, 3);
    });

    test("render header additional col element for hierarchy cell", function() {
        var grid = new Grid(table, {
            detailTemplate: "bar",
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        equal(grid.thead.parent().find("col").length, 6);
        equal(grid.thead.parent().find("col.k-hierarchy-col").length, 1);
        ok(grid.thead.parent().find("col").first().hasClass("k-hierarchy-col"));
    });

    test("render correct number content cells", function() {
        var grid = new Grid(table, {
            dataSource: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}],
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        equal(grid.tbody.find("tr td").length, 5);
    });

    test("render correct number content cells - non-scrollable grid", function() {
        var grid = new Grid(table, {
            dataSource: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}],
            scrollable: false,
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        equal(grid.tbody.find("tr td").length, 5);
    });

    test("footer created when footerTemplate is set to leaf column", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", footerTemplate: "foo" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });
        equal(grid.footer.find("td").length, 5);
    });

    test("footer is not created when footerTemplate is set to non-leaf column", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [
                { title: "master" },
                { title: "master1", footerTemplate: "foo", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        ok(!grid.footer.length);
    });

    test("group header colspan is set", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}],
                group: "foo"
            },
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });
        equal(grid.tbody.find(".k-grouping-row>td").attr("colspan"), 6);
    });

    test("colspan of detail template row", function() {
        var grid = new Grid(table, {
            detailTemplate: "bar",
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [
                { title: "master" },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child" }] }, { title: "master1-child1" }] },
                { title: "master2", columns: [{ title: "master2-child" }, { title: "master2-child1" }] }
            ]
        });

        grid.expandRow(grid.items().first());

        equal(grid.tbody.find("tr.k-detail-row td.k-detail-cell").attr("colspan"), 5);
    });

    test("render rowspan for the command column", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master", columns: [{ title: "child" }] }, { command: "foo" } ]
        });

        var ths = grid.thead.find("tr:first th");

        equal(ths[1].rowSpan, 2);
    });

    test("cellIndex return correct index", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master", columns: [{ title: "child" }, { title: "child2" }] }, { title: "master2" }]
        });

        var cell = grid.tbody.find("tr:first td:eq(2)");

        equal(grid.cellIndex(cell), 2);
    });

    test("cellIndex return correct index for non locked column - with locked columns", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master", locked: true, columns: [{ title: "child" }, { title: "child2" }] }, { title: "master2" }]
        });

        var cell = grid.tbody.find("tr:first td:eq(0)");

        equal(grid.cellIndex(cell), 2);
    });

    test("cellIndex return correct index for locked column - with locked columns", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master", locked: true, columns: [{ title: "child" }, { title: "child2" }] }, { title: "master2" }]
        });

        var cells = grid.lockedTable.find("tr:first td");

        equal(grid.cellIndex(cells.eq(0)), 0);
        equal(grid.cellIndex(cells.eq(1)), 1);
    });

    test("render correct col elements with locked columns", function() {
        var grid = new Grid(table, {
            columns: [{ title: "master", locked: true, columns: [{ title: "child" }, { title: "child2" }] }, { title: "master2", locked: true }, { title: "master3" }]
        });

        var cols = grid.lockedHeader.find("col");

        equal(cols.length, 3);
    });

    test("k-first class is added to the first header cell of the child rows", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master2" }, { title: "master", columns: [{ title: "child" }, { title: "child2" }] }]
        });

        var trs = grid.thead.find("tr");

        ok(!trs.first().children().first().hasClass("k-first"), "first row");
        ok(trs.eq(1).children().first().hasClass("k-first"), "second row");
        equal(trs.find("th.k-first").length, 1);
    });

    test("k-first class is added to the first header cell of the child rows with locked columns", function() {
        var grid = new Grid(table, {
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master2", locked: true },
                { title: "master", locked: true, columns: [{ title: "child" }, { title: "child2" }] },
                { title: "master2" },
                { title: "master", columns: [{ title: "child" }, { title: "child2" }] }]
        });

        var trs = grid.thead.find("tr");

        var lockedTrs = grid.lockedHeader.find("tr");

        ok(!trs.first().children().first().hasClass("k-first"), "first row");
        ok(trs.eq(1).children().first().hasClass("k-first"), "second row");
        equal(trs.find("th.k-first").length, 1);

        ok(!lockedTrs.first().children().first().hasClass("k-first"), "first locked row");
        ok(lockedTrs.eq(1).children().first().hasClass("k-first"), "second locked row");
        equal(lockedTrs.find("th.k-first").length, 1);

    });

    test("k-first class is not added to the first header cell of the child rows if details are set", function() {
        var grid = new Grid(table, {
            detailTemplate: "foo",
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master2" }, { title: "master", columns: [{ title: "child" }, { title: "child2" }] }]
        });

        var trs = grid.thead.find("tr");

        ok(!trs.first().children().first().hasClass("k-first"), "first row");
        ok(!trs.eq(1).children(":not(.k-hierarchy-cell)").first().hasClass("k-first"), "second row");
        ok(!trs.find("th.k-first").length);
    });

    test("k-first class is not added to the first header cell of the child rows with grouping", function() {
        var grid = new Grid(table, {
            dataSource: {
                group: "foo",
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master2" }, { title: "master", columns: [{ title: "child" }, { title: "child2" }] }]
        });

        var trs = grid.thead.find("tr");

        ok(!trs.first().children().first().hasClass("k-first"), "first row");
        ok(!trs.eq(1).children(":not(.k-hierarchy-cell)").first().hasClass("k-first"), "second row");
        ok(!trs.find("th.k-first").length);
    });

    test("k-first class is not added if no multi column headers are used", function() {
        var grid = new Grid(table, {
            filterable: { mode: "row" },
            dataSource: {
                data: [{ foo: "foo1", foo1: "foo1", foo2: "foo1", foo3: "foo1", foo4: "foo1"}]
            },
            columns: [{ title: "master2" }, { title: "master" }]
        });

        var trs = grid.thead.find("tr");

        ok(!trs.first().children().first().hasClass("k-first"));
        ok(!trs.find("th.k-first").length);
    });

    test("create from table with locked columns and first non-locked hidden column", function() {
        $(table).append($('<thead><tr><th class="k-header" data-field="CustomerID" data-index="2" rowspan="2" style="display:none">Customer ID</th><th class="k-header" data-field="CompanyName" data-index="0" rowspan="2">Company Name</th><th class="k-header" data-field="Address" data-index="1" rowspan="2">Address</th><th class="k-header" data-field="PostalCode" data-index="3" rowspan="2">Postal Code</th><th class="k-header" colspan="1" data-colspan="1">Contact Info</th></tr><tr><th class="k-header" data-field="Phone" data-index="4">Phone</th></tr></thead>'));

        var grid = new Grid(table, {
            "columns":[{"title":"Customer ID","hidden":true,"width":"120px","field":"CustomerID","encoded":true},{"title":"Company Name","width":"120px","locked":true,"field":"CompanyName","encoded":true},{"title":"Address","width":"120px","locked":true,"field":"Address","encoded":true},{"title":"Postal Code","width":"100px","field":"PostalCode","encoded":true},{"title":"Contact Info","columns":[{"title":"Phone","width":"200px","field":"Phone","encoded":true}]}]
        });

        var trs = grid.lockedHeader.find("tr");

        equal(trs.first().children().first().text(), "Company Name");
    });

})();
