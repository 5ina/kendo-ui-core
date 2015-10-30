(function() {
   var Grid = kendo.ui.Grid,
        div,
        data = [{ foo: "foo", bar: "bar", baz: "baz" }],
        DataSource = kendo.data.DataSource;

    module("grid column hiding", {
        setup: function() {
            div = $("<div></div>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    function setup(options) {
        options = $.extend(true, {}, {
            dataSource: {
                data: data
            },
            columns: [
                { field: "foo", width: 10 },
                { field: "bar", width: 20 },
                { field: "baz", width: 30 }
            ]
        },
        options);

        return new Grid(div, options);
    }

    test("hiding nested column renders correct footer cols", function() {
        var grid = setup({
            columns: [
                {
                    title: "parent",
                    locked: true,
                    columns: [
                        { field: "foo", hidden: true, width: 100 },
                        { field: "foo", hidden: false, width: 200 }
                    ]
                },
                {
                    field: "bar",
                    width: 300,
                    footerTemplate: "footer template"
                },
                {
                    field: "baz",
                    width: 400
                }
            ]
        });

        var locked = grid.footer.find(".k-grid-footer-locked col");
        var nonLocked = grid.footer.find(".k-grid-footer-wrap col");

        equal(locked.length, 1);
        equal(nonLocked.length, 2);
        equal(locked[0].style.width, "200px");
        equal(nonLocked[0].style.width, "300px");
        equal(nonLocked[1].style.width, "400px");
    });

    test("hide cols for column in not scrollable grid", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide cols for column in not scrollable grid passing column instance", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn(grid.columns[0]);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide cols for non multirow column in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
        equal(cols[2].style.width, "40px");
        equal(cols[3].style.width, "50px");
    });

    test("hide cols for group multirow column in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "40px");
        equal(cols[2].style.width, "50px");
    });


    test("hide cols for child multirow column in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[2].columns[0]);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
        equal(cols[3].style.width, "50px");
    });

    test("hide parent th when all child multirow column are hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[2].columns[0]);
        grid.hideColumn(grid.columns[2].columns[1]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 3);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(!rows.eq(0).find("th").eq(2).is(":visible"));

        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(!rows.eq(1).find("th").eq(3).is(":visible"));
        ok(!rows.eq(1).find("th").eq(4).is(":visible"));
    });

    test("hide parent th when all three level child multirow column are hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[0]);
        grid.hideColumn(grid.columns[1].columns[1]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 3);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(!rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));

        ok(!rows.eq(1).find("th").eq(0).is(":visible"));
        ok(!rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));

        ok(!rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("does not hide parent th when child group but not all child columns of multirow column are hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 4);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));

        ok(!rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));

        ok(!rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("does not hide parent th when not all three level child multirow column are hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[0]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 4);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));

        ok(!rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));

        ok(!rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("hide parents th colspan is updated when child multirow column is hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[0]);

        var rows = grid.thead.find("tr");

        equal(rows.eq(0).find("th")[1].colSpan, 1);
        equal(rows.eq(1).find("th")[0].colSpan, 1);
    });

    test("show parents th colspan is updated when child multirow column is hidden in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[0]);
        grid.showColumn(grid.columns[1].columns[0].columns[0]);

        var rows = grid.thead.find("tr");

        equal(rows.eq(0).find("th")[1].colSpan, 2);
        equal(rows.eq(1).find("th")[0].colSpan, 1);
    });

    test("hide cols for all child multirow column in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[2].columns[0]);
        grid.hideColumn(grid.columns[2].columns[1]);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("hide cols for column in scrollable grid", function() {
        var grid = setup();

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        var tableCols = grid.table.find(">colgroup col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
        equal(tableCols.length, 2);
        equal(tableCols[0].style.width, "20px");
        equal(tableCols[1].style.width, "30px");
    });

    test("hide cols for non multiline column in scrollable grid - multiline grid", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        var tableCols = grid.table.find(">colgroup col");

        equal(cols.length, 4);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
        equal(cols[2].style.width, "40px");
        equal(cols[3].style.width, "50px");

        equal(tableCols.length, 4);
        equal(tableCols[0].style.width, "20px");
        equal(tableCols[1].style.width, "30px");
        equal(tableCols[2].style.width, "40px");
        equal(tableCols[3].style.width, "50px");
    });

    test("hide cols for group multiline column in scrollable grid - multiline grid", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);

        var cols = grid.thead.prev().find("col");
        var tableCols = grid.table.find(">colgroup col");

        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "40px");
        equal(cols[2].style.width, "50px");

        equal(tableCols.length, 3);
        equal(tableCols[0].style.width, "10px");
        equal(tableCols[1].style.width, "40px");
        equal(tableCols[2].style.width, "50px");
    });

    test("hide cols for child multiline column in scrollable grid - multiline grid", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[1]);

        var cols = grid.thead.prev().find("col");
        var tableCols = grid.table.find(">colgroup col");

        equal(cols.length, 4);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "30px");
        equal(cols[2].style.width, "40px");
        equal(cols[3].style.width, "50px");

        equal(tableCols.length, 4);
        equal(tableCols[0].style.width, "10px");
        equal(tableCols[1].style.width, "30px");
        equal(tableCols[2].style.width, "40px");
        equal(tableCols[3].style.width, "50px");
    });

    test("hide column by field name", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn("foo");

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide column by field name - multiline headers", function() {
        var grid = new Grid(div, {
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master2", columns: [{ title: "master2-child", field: "foo", width: 20 }, { title: "master2-child1", width: 30 }] }
            ]
        });

        grid.hideColumn("foo");

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "30px");
    });

    test("hide column header cells", function() {
        var grid = setup();

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
    });

    test("hide non muliline column header cells - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        ok(ths.eq(3).is(":visible"));
        ok(ths.eq(4).is(":visible"));
    });

    test("hide two level group column header cells - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(2);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(!rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(!rows.eq(1).find("th").eq(2).is(":visible"));
        ok(!rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("hide three level group column header cells - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(!rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));
        ok(!rows.eq(1).find("th").eq(0).is(":visible"));
        ok(!rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(!rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("hide two column header cells", function() {
        var grid = setup();

        grid.hideColumn(0);
        grid.hideColumn(2);

        var ths = grid.thead.find("th");
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
        ok(!ths.eq(2).is(":visible"));
    });

    test("hide group column header cells in grid with details - multiline headers", function() {
        var grid = setup({
            detailTemplate: "foo",
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(!rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(0).find("th").eq(3).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(!rows.eq(1).find("th").eq(1).is(":visible"));
        ok(!rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(1).find("th").eq(4).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
        ok(!rows.eq(2).find("th").eq(1).is(":visible"));
    });

    test("hide column header cells in grid with details", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(ths.eq(0).is(":visible"));
        ok(!ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        ok(ths.eq(3).is(":visible"));
    });

    test("hide column header cells in grouped grid", function() {
        var grid = setup({
            dataSource: {
                group: { field: "foo" }
            },
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(!rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(0).find("th").eq(3).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(!rows.eq(1).find("th").eq(1).is(":visible"));
        ok(!rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(1).find("th").eq(4).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
        ok(!rows.eq(2).find("th").eq(1).is(":visible"));
    });

    test("hide top multiline column header cells in grouped grid - multiline headers", function() {
        var grid = setup({ dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(ths.eq(0).is(":visible"));
        ok(!ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        ok(ths.eq(3).is(":visible"));
    });


    test("hide column cells", function() {
        var grid = setup();

        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
    });

    test("hiding already hidden column", function() {
        var grid = setup();

        grid.hideColumn(0);
        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
    });

    test("hidden columns remains hidden on refresh", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn(0);
        grid.refresh();

        var tds = grid.table.find("td");
        var ths = grid.thead.find("th");
        var cols = grid.thead.prev().find("col");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        equal(cols.length, 2);
        ok(grid.columns[0].hidden);
    });

    test("hide column cells in grid with details", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(tds.eq(0).is(":visible"));
        ok(!tds.eq(1).is(":visible"));
    });

    test("hiding column changes detail row colspan", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.expandRow(grid.items()[0]);
        grid.hideColumn(0);

        var tds = grid.table.find(".k-detail-row>td");
        ok(tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        equal(tds.eq(1).attr("colspan"), "2");
    });

    test("hide column cells in groupable grid", function() {
        var grid = setup({
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var tds = grid.table.find("tr:nth(1)>td");
        ok(tds.eq(0).is(":visible"));
        ok(!tds.eq(1).is(":visible"));
    });

    test("hiding column changes grouping row cell colspan", function() {
        var grid = setup({
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var td = grid.table.find("tr>td:first");
        ok(td.is(":visible"));
        equal(td.attr("colspan"), "3");
    });

    test("hide footer cells", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);

        var footer = grid.footer.find("td");
        ok(!footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(footer.eq(2).is(":visible"));
    });

    test("hide footer cells in grid with groups and details", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo template"
            }],
            detailTemplate: "detail template",
            dataSource: {
                group: {
                    field: "foo"
                }
            }
        });

        grid.hideColumn(0);

        var footer = grid.footer.find("td");
        ok(footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(!footer.eq(2).is(":visible"));
        ok(footer.eq(3).is(":visible"));
        ok(footer.eq(4).is(":visible"));
    });

    test("hide footer cols in scrollable grid", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);

        var cols = grid.footer.find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("footer table width is persisted in scrollable grid", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);
        grid.refresh();

        var table = grid.footer.find("table");
        equal(table.width(), 50);

    });

    test("hide footer cols in scrollable grid with details and grouping", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }],
            detailTemplate: "detail template",
            dataSource: {
                group: {
                    field: "foo"
                }
            }
        });

        grid.hideColumn(0);

        var cols = grid.footer.find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-group-col"));
        ok(cols.eq(1).hasClass("k-hierarchy-col"));
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("hidden columns footer remains hidden on refresh", function() {
        var grid = setup({
            scrollable: false,
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);
        grid.refresh();

        var footer = grid.footer.find("td");
        ok(!footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(footer.eq(2).is(":visible"));
    });

    test("hiding column recalculates table width", function() {
        var grid = setup();

        grid.hideColumn(0);

        equal(grid.table.width(), 50);
    });

    test("hiding column does not change table width if column without width exist", function() {
        var grid = setup({
            columns: ["foo", { field: "bar" }, "baz"]
        }),
        width = grid.table.width();

        grid.hideColumn(0);

        equal(grid.table.width(), width);
    });

    test("showing column adds col element", function() {
        var grid = setup({
            scrollable: false,
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("showing column adds col element in scrollable grid", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var headerCols = grid.thead.prev().find("col");
        var cols = grid.tbody.prev().find("col");
        equal(headerCols .length, 3);
        equal(cols .length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("showing column adds col element in grid with details", function() {
        var grid = setup({
            scrollable: false,
            detailTemplate: "foo",
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-hierarchy-col"));
        equal(cols[1].style.width, "10px");
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("showing column adds col element in grid with grouping", function() {
        var grid = setup({
            scrollable: false,
            dataSource: {
                group: { field: "foo" }
            },
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-group-col"));
        equal(cols[1].style.width, "10px");
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("showing column that doesn't exist", function() {
        var grid = setup({
            scrollable: false,
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(-1);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
    });

    test("showing column by field name", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
    });

    test("showing column displays header cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 3);
    });

    test("showing column displays header cells in grid with details", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 4);
        ok(ths.eq(0).hasClass("k-hierarchy-cell"));
    });

    test("showing column displays header cells in grid with grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 4);
        ok(ths.eq(0).hasClass("k-group-cell"));
    });

    test("showing column displays footer cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }]
        });

        grid.showColumn("foo");

        var tds = grid.footer.find("td:visible");
        equal(tds.length, 3);
    });

    test("showing column displays footer cells in grid with details and grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }],
            detailTemplate: "details",
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");

        var tds = grid.footer.find("td:visible");
        equal(tds.length, 5);
        ok(tds.eq(0).hasClass("k-group-cell"));
        ok(tds.eq(1).hasClass("k-hierarchy-cell"));
    });

    test("showing column displays footer cols", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }]
        });

        grid.showColumn("foo");

        var cols = grid.footer.find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
    });

    test("showing column displays data cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");

        var tds = grid.tbody.find("td:visible");
        equal(tds.length, 3);
        equal(tds.eq(0).text(), "foo");
    });

    test("showing column displays data cells in grid with details", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.showColumn("foo");

        var tds = grid.tbody.find("tr:first>td:visible");
        equal(tds.length, 4);
        ok(tds.eq(0).hasClass("k-hierarchy-cell"));
        equal(tds.eq(1).text(), "foo");
    });

    test("showing column changes detail row colspan", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.expandRow(grid.tbody.children()[0]);
        grid.showColumn("foo");

        var td = grid.tbody.find(".k-detail-row .k-detail-cell");
        equal(td.attr("colspan"), "3");
    });

    test("showing column in grid with grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");

        equal(grid.table.find(".k-grouping-row>td").attr("colspan"), "4");
        equal(grid.tbody.children().eq(1).find("td:visible").length, 4);
    });

    test("showing column without specified width removes table width", function() {
        var grid = setup({
            columns: ["foo"]
        });
        var width = grid.table.css("width");

        grid.hideColumn("foo");
        grid.showColumn("foo");

        equal(grid.table.css("width"), width);
    });

    test("showing column with specified width changes table width", function() {
        var grid = setup();

        grid.hideColumn("bar");
        grid.showColumn("bar");

        equal(grid.table[0].style.width, "60px");
    });

    test("showing column with specified width in grid which has column width in percents", function() {
        var grid = setup({
            columns: [{ field: "foo", width: "10%" }]
        });

        grid.hideColumn("bar");
        var width = grid.table[0].style.width;
        grid.showColumn("bar");

        equal(grid.table[0].style.width, width);
    });

    test("showing column remains visible on refresh", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "template" }]
        });

        grid.showColumn("foo");
        grid.refresh();

        equal(grid.thead.prev().find("col").length, 3);
        equal(grid.thead.find("th:visible").length, 3);
        equal(grid.tbody.find("td:visible").length, 3);
        equal(grid.footer.find("td:visible").length, 3);
        equal(grid.columns[0].attributes.style, "");
    });

    test("showing column remove display style from attributes", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                hidden: true,
                attributes: { style: "foo: bar" }
            }]
        });

        grid.showColumn("foo");
        var attr = grid.columns[0].attributes;

        ok(attr.style);
        equal(attr.style, "foo: bar");
    });

    test("hiding column triggers event", function() {
        var args,
            grid = setup({
                columnHide: function() {
                    args = arguments[0];
                }
            });

        grid.hideColumn("foo");

        ok(args);
        equal(args.column.field, "foo");
    });

    test("showing column triggers event", function() {
        var args,
            grid = setup({
                columns: [{
                    field: "foo",
                    hidden: true
                }],
                columnShow: function() {
                    args = arguments[0];
                }
            });

        grid.showColumn("foo");

        ok(args);
        equal(args.column.field, "foo");
    });

    test("hiding last consecutive columns", function() {
        var grid = setup();

        grid.hideColumn(1);
        grid.hideColumn(2);

        equal(grid.tbody.find("td:visible").length, 1, "visible column cells");
        equal(grid.tbody.find("td:not(:visible)").length, 2, "hidden column cells");
    });

    test("hide locked column header", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(0);
        var th = grid.wrapper.find("th");
        equal(th.eq(0).is(":visible"), false);
        equal(th.eq(1).is(":visible"), true);
        equal(th.eq(2).is(":visible"), true);
    });

    test("hide last multiline group column header in locked grid - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10, locked: true },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(2);

        var rows = grid.thead.find("tr");
        var lockedRows = grid.lockedHeader.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(!rows.eq(0).find("th").eq(1).is(":visible"));
        ok(lockedRows.eq(0).find("th").eq(0).is(":visible"), "locked header cell");

        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(!rows.eq(1).find("th").eq(2).is(":visible"), "last column cell 1");
        ok(!rows.eq(1).find("th").eq(3).is(":visible"), "last column cell 2");
    });

    test("hide last multiline group column header in locked grid - multiline headers with group locked column", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", locked: true, columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(2);

        var rows = grid.thead.find("tr");
        var lockedRows = grid.lockedHeader.find("tr");

        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(!rows.eq(0).find("th").eq(1).is(":visible"), "hidden header row 1");
        ok(lockedRows.eq(0).find("th").eq(0).is(":visible"), "locked header row 1");

        ok(!rows.eq(1).find("th").eq(0).is(":visible"), "hidden header row 2 cell 1");
        ok(!rows.eq(1).find("th").eq(1).is(":visible"), "hidden header row 2 cell 2");

        ok(lockedRows.eq(1).find("th").eq(0).is(":visible"), "locked header row 2 cell 1");
        ok(lockedRows.eq(1).find("th").eq(1).is(":visible"), "locked header row 2 cell 2");

        ok(!rows.eq(3).find("th").eq(0).is(":visible"));
    });

    test("hide non locked column header in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        var th = grid.wrapper.find("th");
        equal(th.eq(0).is(":visible"), true);
        equal(th.eq(1).is(":visible"), false);
        equal(th.eq(2).is(":visible"), true);
    });

    test("hide locked column col", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(0);
        var cols = grid.wrapper.find("colgroup>col");
        equal(cols.length, 4);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("hide non locked column col in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        var cols = grid.wrapper.find("colgroup>col");
        equal(cols.length, 4);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "30px");
        equal(cols[2].style.width, "10px");
        equal(cols[3].style.width, "30px");
    });

    test("hide locked column footer", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        var td = grid.wrapper.find(".k-footer-template>td");
        equal(td.eq(0).is(":visible"), false);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("hide non locked column footer in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar", footerTemplate: "bar" }
            ]
        });

        grid.hideColumn(1);
        var td = grid.wrapper.find(".k-footer-template>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), false);
        equal(td.eq(2).is(":visible"), true);
    });

    test("hide locked column footer col", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        var cols = grid.footer.find("colgroup>col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide non locked column footer col in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar", footerTemplate: "bar" }
            ]
        });

        grid.hideColumn(1);
        var cols = grid.footer.find("colgroup>col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "30px");
    });

    test("hide locked column cell", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        var td = grid.lockedTable.find("td").add(grid.table.find("td"));
        equal(td.eq(0).is(":visible"), false);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("hide non locked column cell in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        var td = grid.lockedTable.find("td").add(grid.table.find("td"));
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), false);
        equal(td.eq(2).is(":visible"), true);
    });

    test("hide locked column with grouping", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);
        var td = grid.lockedTable.add(grid.table).find(":not(.k-grouping-row)>td");
        var groupCell = grid.lockedTable.add(grid.table).find(".k-grouping-row>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), false);
        equal(td.eq(2).is(":visible"), true);
        equal(td.eq(3).is(":visible"), true);
        equal(parseInt(groupCell.eq(0).attr("colspan"), 10), 1);
        equal(parseInt(groupCell.eq(1).attr("colspan"), 10), 2);
    });

    test("hide non locked column in grid with locked column and grouping", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(1);
        var td = grid.lockedTable.add(grid.table).find(":not(.k-grouping-row)>td");
        var groupCell = grid.lockedTable.add(grid.table).find(".k-grouping-row>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), false);
        equal(td.eq(3).is(":visible"), true);
        equal(parseInt(groupCell.eq(0).attr("colspan"), 10), 2);
        equal(parseInt(groupCell.eq(1).attr("colspan"), 10), 1);
    });

    test("show locked column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10, locked: true },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);

        var rows = grid.thead.find("tr");
        ok(grid.lockedHeader.find("tr").eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show multiline group column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show second multiline group column header with previous multiline header hidden", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", hidden: true, columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", hidden: true, columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.showColumn(2);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(!rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));
        ok(!rows.eq(1).find("th").eq(0).is(":visible"));
        ok(!rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(!rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show multiline group locked column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", locked: true, columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);

        var rows = grid.thead.find("tr");
        var lockedRows = grid.lockedHeader.find("tr");

        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));

        ok(lockedRows.eq(0).find("th").eq(0).is(":visible"));

        ok(lockedRows.eq(1).find("th").eq(0).is(":visible"));
        ok(lockedRows.eq(1).find("th").eq(1).is(":visible"));

        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(lockedRows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show two multiline group locked column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", locked: true, columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", locked: true, columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);

        var rows = grid.thead.find("tr");
        var lockedRows = grid.lockedHeader.find("tr");

        ok(lockedRows.eq(0).find("th").eq(0).is(":visible"));
        ok(lockedRows.eq(0).find("th").eq(1).is(":visible"));

        ok(rows.eq(0).find("th").eq(0).is(":visible"));

        ok(lockedRows.eq(1).find("th").eq(0).is(":visible"));
        ok(lockedRows.eq(1).find("th").eq(1).is(":visible"));
        ok(lockedRows.eq(1).find("th").eq(2).is(":visible"));
        ok(lockedRows.eq(1).find("th").eq(3).is(":visible"));

        ok(lockedRows.eq(2).find("th").eq(0).is(":visible"));
    });


    test("show multiline child group column header - multiline headers", function() {
        var grid = setup({
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[1]);
        grid.showColumn(grid.columns[1].columns[1]);

        var rows = grid.thead.find("tr");
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("show locked column header", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var th = grid.wrapper.find("th");
        equal(th.eq(0).is(":visible"), true);
        equal(th.eq(1).is(":visible"), true);
        equal(th.eq(2).is(":visible"), true);
    });

    test("show/hide locked column header with filtercell", function() {
        var grid = setup({
            filterable: {
                mode: "row menu"
            },
            columns: [
                { field: "foo", locked: true },
                { field: "bar", locked: false }
            ]
        });
        var lockedThs = grid.wrapper.find(".k-grid-header-locked th");
        var unLockedThs = grid.wrapper.find(".k-grid-header-wrap th");

        grid.hideColumn(1);

        equal(lockedThs.length, 2);
        equal(unLockedThs.length, 4);

        equal(lockedThs.eq(0).is(":visible"), true);
        equal(lockedThs.eq(1).is(":visible"), true);

        equal(unLockedThs.eq(0).is(":visible"), false, "this is data-header");
        equal(unLockedThs.eq(1).is(":visible"), true);
        equal(unLockedThs.eq(2).is(":visible"), false, "this is data-filter-cell");
        equal(unLockedThs.eq(3).is(":visible"), true);

        grid.showColumn(1);

        equal(lockedThs.eq(0).is(":visible"), true);
        equal(lockedThs.eq(1).is(":visible"), true);

        equal(unLockedThs.eq(0).is(":visible"), true);
        equal(unLockedThs.eq(1).is(":visible"), true);
        equal(unLockedThs.eq(2).is(":visible"), true);
        equal(unLockedThs.eq(3).is(":visible"), true);
    });

    test("show non locked column header in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var th = grid.wrapper.find("th");
        equal(th.eq(0).is(":visible"), true);
        equal(th.eq(1).is(":visible"), true);
        equal(th.eq(2).is(":visible"), true);
    });

    test("show locked column col", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var cols = grid.wrapper.find("colgroup>col");
        equal(cols.length, 6);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
        equal(cols[3].style.width, "10px");
        equal(cols[4].style.width, "20px");
        equal(cols[5].style.width, "30px");
    });

    test("show non locked column col in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var cols = grid.wrapper.find("colgroup>col");
        equal(cols.length, 6);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
        equal(cols[3].style.width, "10px");
        equal(cols[4].style.width, "20px");
        equal(cols[5].style.width, "30px");
    });

    test("show locked column footer", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var td = grid.wrapper.find(".k-footer-template>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("show non locked column footer in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar", footerTemplate: "bar" }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var td = grid.wrapper.find(".k-footer-template>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("show locked column footer col", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var cols = grid.footer.find("colgroup>col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("show non locked column footer col in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "bar", footerTemplate: "bar" }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var cols = grid.footer.find("colgroup>col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("show locked column cell", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo" }
            ]
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var td = grid.lockedTable.find("td").add(grid.table.find("td"));
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("show non locked column cell in grid with locked column", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ]
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var td = grid.lockedTable.find("td").add(grid.table.find("td"));
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
    });

    test("show locked column with grouping", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);
        grid.showColumn(0);
        var td = grid.lockedTable.add(grid.table).find(":not(.k-grouping-row)>td");
        var groupCell = grid.lockedTable.add(grid.table).find(".k-grouping-row>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
        equal(td.eq(3).is(":visible"), true);
        equal(parseInt(groupCell.eq(0).attr("colspan"), 10), 2);
        equal(parseInt(groupCell.eq(1).attr("colspan"), 10), 2);
    });

    test("hide non locked column in grid with locked column and grouping", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true }
            ],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(1);
        grid.showColumn(1);
        var td = grid.lockedTable.add(grid.table).find(":not(.k-grouping-row)>td");
        var groupCell = grid.lockedTable.add(grid.table).find(".k-grouping-row>td");
        equal(td.eq(0).is(":visible"), true);
        equal(td.eq(1).is(":visible"), true);
        equal(td.eq(2).is(":visible"), true);
        equal(td.eq(3).is(":visible"), true);
        equal(parseInt(groupCell.eq(0).attr("colspan"), 10), 2);
        equal(parseInt(groupCell.eq(1).attr("colspan"), 10), 2);
    });

    test("refresh with hidden column updates footer cols", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, footerTemplate: "foo", width: 10 },
                { field: "bar", locked: true, width: 20 },
                { field: "baz", locked: true, width: 30 },
                { field: "bax", width: 40 },
                { field: "fuzz", width: 50 }
            ]
        });

        grid.hideColumn(1);
        grid.refresh();

        var lockedCol = grid.wrapper.find(".k-grid-footer-locked col");
        equal(lockedCol[0].style.width, "10px");
        equal(lockedCol[1].style.width, "30px");

        var nonLockedCol = grid.wrapper.find(".k-grid-footer-wrap col");
        equal(nonLockedCol[0].style.width, "40px");
        equal(nonLockedCol[1].style.width, "50px");
    });

    test("show parent th when all child multirow column are shown in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[2].columns[0]);
        grid.hideColumn(grid.columns[2].columns[1]);

        grid.showColumn(grid.columns[2].columns[0]);
        grid.showColumn(grid.columns[2].columns[1]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 5);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));

        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));
    });

    test("show parent th when all three level child multirow column are shown in not scrollable grid - multiline headers", function() {
        var grid = setup({
            scrollable: false,
            columns: [
                { title: "master", width: 10 },
                { title: "master1", columns: [{ title: "master1-child", columns: [{ title: "master1-child-child", width: 20 }] }, { title: "master1-child1", width: 30 }] },
                { title: "master2", columns: [{ title: "master2-child", width: 40 }, { title: "master2-child1", width: 50 }] }
            ]
        });

        grid.hideColumn(grid.columns[1].columns[0].columns[0]);
        grid.hideColumn(grid.columns[1].columns[1]);

        grid.showColumn(grid.columns[1].columns[0].columns[0]);
        grid.showColumn(grid.columns[1].columns[1]);

        var cols = grid.thead.prev().find("col");
        var rows = grid.thead.find("tr");

        equal(cols.length, 5);
        ok(rows.eq(0).find("th").eq(0).is(":visible"));
        ok(rows.eq(0).find("th").eq(1).is(":visible"));
        ok(rows.eq(0).find("th").eq(2).is(":visible"));

        ok(rows.eq(1).find("th").eq(0).is(":visible"));
        ok(rows.eq(1).find("th").eq(1).is(":visible"));
        ok(rows.eq(1).find("th").eq(2).is(":visible"));
        ok(rows.eq(1).find("th").eq(3).is(":visible"));

        ok(rows.eq(2).find("th").eq(0).is(":visible"));
    });

    test("hideColumn when grid is hidden", function() {
        var grid = setup({
            columns: [
                { field: "foo" },
                { field: "bar" },
            ]
        });

        grid.wrapper.hide();

        grid.hideColumn(0);

        grid.wrapper.show();

        equal(grid.table.find("td").eq(0).is(":visible"), false, "first body cell");
        equal(grid.table.find("td").eq(1).is(":visible"), true, "second body cell");
        equal(grid.thead.find("th").eq(0).is(":visible"), false, "first header cell");
        equal(grid.thead.find("th").eq(1).is(":visible"), true, "second header cell");
    });

    test("hideColumn when grid is hidden - locked columns", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "baz", locked: true },
                { field: "bar" },
            ]
        });

        grid.wrapper.hide();

        grid.hideColumn(0);

        grid.wrapper.show();

        equal(grid.lockedTable.find("td").eq(0).is(":visible"), false, "first locked body cell");
        equal(grid.lockedTable.find("td").eq(1).is(":visible"), true, "second locked body cell");

        equal(grid.lockedHeader.find("th").eq(0).is(":visible"), false, "first locked header cell");
        equal(grid.lockedHeader.find("th").eq(1).is(":visible"), true, "second locked header cell");

        equal(grid.table.find("td").eq(0).is(":visible"), true, "first body cell");
        equal(grid.thead.find("th").eq(0).is(":visible"), true, "first header cell");
    });

    test("showColumn when grid is hidden", function() {
        var grid = setup({
            columns: [
                { field: "foo", hidden: true },
                { field: "bar" },
            ]
        });

        grid.wrapper.hide();

        grid.showColumn(0);

        grid.wrapper.show();

        equal(grid.table.find("td").eq(0).is(":visible"), true, "first body cell");
        equal(grid.table.find("td").eq(1).is(":visible"), true, "second body cell");
        equal(grid.thead.find("th").eq(0).is(":visible"), true, "first header cell");
        equal(grid.thead.find("th").eq(1).is(":visible"), true, "second header cell");
    });

    test("hideColumn when grid is hidden - locked columns", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true, hidden: true },
                { field: "baz", locked: true },
                { field: "bar" },
            ]
        });

        grid.wrapper.hide();

        grid.showColumn(0);

        grid.wrapper.show();

        equal(grid.lockedTable.find("td").eq(0).is(":visible"), true, "first locked body cell");
        equal(grid.lockedTable.find("td").eq(1).is(":visible"), true, "second locked body cell");

        equal(grid.lockedHeader.find("th").eq(0).is(":visible"), true, "first locked header cell");
        equal(grid.lockedHeader.find("th").eq(1).is(":visible"), true, "second locked header cell");

        equal(grid.table.find("td").eq(0).is(":visible"), true, "first body cell");
        equal(grid.thead.find("th").eq(0).is(":visible"), true, "first header cell");
    });

})();
