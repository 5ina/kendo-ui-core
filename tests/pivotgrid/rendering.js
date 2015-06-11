(function() {
    var PivotDataSource = kendo.data.PivotDataSource,
        PivotGrid = kendo.ui.PivotGrid,
        div;

    module("PivotGrid render layout", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    function createPivot(options) {
        options = options || {};

        if (!options.dataSource) {
            options.dataSource = new kendo.data.PivotDataSource({
                schema: {
                    axes: function() {
                        return {};
                    }
                }
            });
        }

        return new PivotGrid($(div), options);
    }

    test("PivotGrid adds CSS classes to the wrapper elements", function() {
        var pivotgrid = createPivot();

        var wrapper = pivotgrid.wrapper;

        ok(wrapper.hasClass("k-widget"));
        ok(wrapper.hasClass("k-pivot"));
    });

    test("PivotGrid renders layout table", function() {
        var pivotgrid = createPivot();

        var layout = pivotgrid.wrapper.find(".k-pivot-layout");

        ok(layout[0]);
        ok(layout.is("table"));
    });

    test("PivotGrid renders left layout column wrapper", function() {
        var pivotgrid = createPivot();

        var leftLayoutColumn = pivotgrid.wrapper.find(".k-pivot-rowheaders");

        ok(leftLayoutColumn.is("div"));
        ok(leftLayoutColumn.parent().is("td"));
        equal(leftLayoutColumn.length, 1);
    });

    test("PivotGrid renders right layout column wrapper", function() {
        var pivotgrid = createPivot();

        var rightLayoutColumn = pivotgrid.wrapper.find(".k-pivot-table");

        ok(rightLayoutColumn.is("div"));
        ok(rightLayoutColumn.parent().is("td"));
        equal(rightLayoutColumn.length, 1);
    });

    test("PivotGrid renders data fields section", function() {
        var pivotgrid = createPivot();

        var leftLayoutColumn = pivotgrid.wrapper.find(".k-pivot-rowheaders");

        var measureFields = leftLayoutColumn.children("div").eq(0);

        ok(measureFields.is("div"));
        ok(measureFields.hasClass("k-pivot-toolbar"));
        ok(measureFields.hasClass("k-header"));
        equal(measureFields.text(), pivotgrid.options.messages.measureFields);
    });

    test("PivotGrid renders row fields section", function() {
        var pivotgrid = createPivot();

        var leftLayoutColumn = pivotgrid.wrapper.find(".k-pivot-rowheaders");

        var rowFields = leftLayoutColumn.children("div").eq(1);

        ok(rowFields.is("div"));
        ok(rowFields.hasClass("k-pivot-toolbar"));
        ok(rowFields.hasClass("k-header"));
        equal(rowFields.text(), pivotgrid.options.messages.rowFields);
    });

    test("PivotGrid renders rows header section", function() {
        var pivotgrid = createPivot();

        var leftLayoutColumn = pivotgrid.wrapper.find(".k-pivot-rowheaders");

        var rowFields = leftLayoutColumn.children("div").eq(2);

        ok(rowFields.is("div"));
        ok(rowFields.hasClass("k-grid"));
        ok(rowFields.hasClass("k-widget"));
        ok(rowFields.hasClass("k-alt"));
    });

    test("PivotGrid renders column fields section", function() {
        var pivotgrid = createPivot();

        var rightLayoutColumn = pivotgrid.wrapper.find(".k-pivot-table");

        var columnFields = rightLayoutColumn.children("div").eq(0);

        ok(columnFields.is("div"));
        ok(columnFields.hasClass("k-pivot-toolbar"));
        ok(columnFields.hasClass("k-header"));
        equal(columnFields.text(), pivotgrid.options.messages.columnFields);
    });

    test("PivotGrid renders pivot content wrapper", function() {
        var pivotgrid = createPivot();

        var rightLayoutColumn = pivotgrid.wrapper.find(".k-pivot-table");

        var columnFields = rightLayoutColumn.children("div").eq(1);

        ok(columnFields.is("div"));
        ok(columnFields.hasClass("k-grid"));
        ok(columnFields.hasClass("k-widget"));
    });

    test("PivotGrid renders columns header section", function() {
        var pivotgrid = createPivot();

        var rightLayoutColumn = pivotgrid.wrapper.find(".k-pivot-table");

        var gridWrapper = rightLayoutColumn.find(".k-grid");

        var columnsHeader = gridWrapper.children("div").eq(0);

        ok(columnsHeader.is("div"));
        ok(columnsHeader.hasClass("k-grid-header"));

        var columnsHeaderWrap = columnsHeader.children().eq(0);

        ok(columnsHeaderWrap.is("div"));
        ok(columnsHeaderWrap.hasClass("k-grid-header-wrap"));
    });

    test("PivotGrid renders pivot content column", function() {
        var pivotgrid = createPivot();

        var rightLayoutColumn = pivotgrid.wrapper.find(".k-pivot-table");

        var gridWrapper = rightLayoutColumn.find(".k-grid");

        var gridContent = gridWrapper.children("div").eq(1);

        ok(gridContent.is("div"));
        ok(gridContent.hasClass("k-grid-content"));
    });

    module("PivotGrid column headers rendering", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    function createDataSource(tuples, data, measures) {
        return new PivotDataSource({
            measures: measures || [],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            columns: {
                                tuples: tuples || []
                            }
                        },
                        data: data || []
                    });
                }
            }
        });
    }

    test("PivotGrid renders column header with a non-breaking space if no tuples", function() {
        var tuples = [
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        equal(tr.length, 1);
        equal(th.length, 1);
        equal(th.html(), "&nbsp;");
    });

    test("PivotGrid renders column header for 1 dimension with one tuple", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        equal(tr.length, 1);
        equal(th.length, 1);

        equal(th.text(), "dim 0");
        equal(th.html(), "<span>dim 0</span>");
    });

    test("PivotGrid renders column header for 2 dimension with one tuple each", function() {
        var tuples = [
            { members: [ { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        equal(tr.length, 2);
        equal(th.length, 2);
        equal(th.eq(0).text(), "dim 1");
        equal(th.eq(1).text(), "dim 2");
    });

    asyncTest("PivotGrid renders one expanded dimension", 8, function() {
        var tuples = [
            { members: [{ name: "dim 1", levelNum: "0", children: [] }] },
            { members: [{ name: "child 1", levelNum: "1",  parentName: "dim 1", children: [] }] },
            { members: [{ name: "child 2", levelNum: "1",  parentName: "dim 1", children: [] }] },
            { members: [{ name: "child 3", levelNum: "1",  parentName: "dim 1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();

            var tr = headerTable.find("tr");
            equal(tr.length, 2);

            var row_1 = tr.eq(0);
            var cells_row1 = row_1.find("th");

            equal(cells_row1.length, 2);
            equal(cells_row1.eq(0).attr("colspan"), 3);
            equal(cells_row1.eq(1).attr("rowspan"), 2);

            var row_2 = tr.eq(1);
            var cells_row2 = row_2.find("th");

            equal(cells_row2.length, 3);
            equal(cells_row2.eq(0).text(), "child 1");
            equal(cells_row2.eq(1).text(), "child 2");
            equal(cells_row2.eq(2).text(), "child 3");
        }, 50);
    });

    asyncTest("PivotGrid renders one expanded dimension of two", 13, function() {
        var tuples = [
            { members: [{ name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [{ name: "child 1", levelNum: "1",  parentName: "dim 1", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [{ name: "child 2", levelNum: "1",  parentName: "dim 1", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [{ name: "child 3", levelNum: "1",  parentName: "dim 1", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();
            var tr = headerTable.find("tr");
            equal(tr.length, 3);

            var row_1 = tr.eq(0);
            var cells_row1 = row_1.find("th");

            equal(cells_row1.length, 2);
            equal(cells_row1.eq(0).attr("colspan"), 3);
            equal(cells_row1.eq(1).attr("rowspan"), 2);

            var row_2 = tr.eq(1);
            var cells_row2 = row_2.find("th");

            equal(cells_row2.length, 3);
            equal(cells_row2.eq(0).text(), "child 1");
            equal(cells_row2.eq(1).text(), "child 2");
            equal(cells_row2.eq(2).text(), "child 3");

            var row_3 = tr.eq(2);
            var cells_row3 = row_3.find("th");

            equal(cells_row3.length, 4);
            equal(cells_row3.eq(0).text(), "dim 2");
            equal(cells_row3.eq(1).text(), "dim 2");
            equal(cells_row3.eq(2).text(), "dim 2");
            equal(cells_row3.eq(3).text(), "dim 2");
        });
    });

    asyncTest("PivotGrid renders three level expanded dimension", 18, function() {
        var tuples = [
            { members: [ { name: "level 0",  levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2", levelNum: "2",  parentName: "level 1_1", children: [] }] },
            { members: [ { name: "level 3", levelNum: "3",  parentName: "level 2", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();
            var tr = headerTable.find("tr");
            equal(tr.length, 4);

            var row_1 = tr.eq(0);
            var cells_row1 = row_1.find("th");

            equal(cells_row1.length, 2);
            equal(cells_row1.eq(0).attr("colspan"), 5);
            equal(cells_row1.eq(1).attr("rowspan"), 4);

            var row_2 = tr.eq(1);
            var cells_row2 = row_2.find("th");

            equal(cells_row2.length, 4);
            equal(cells_row2.eq(0).text(), "level 1_1");
            equal(cells_row2.eq(0).attr("colspan"), 2);

            equal(cells_row2.eq(1).text(), "level 1_1");
            equal(cells_row2.eq(1).attr("rowspan"), 3);

            equal(cells_row2.eq(2).text(), "level 1_2");
            equal(cells_row2.eq(2).attr("rowspan"), 3);

            equal(cells_row2.eq(3).text(), "level 1_3");
            equal(cells_row2.eq(3).attr("rowspan"), 3);

            var row_3 = tr.eq(2);
            var cells_row3 = row_3.find("th");

            equal(cells_row3.length, 2);
            equal(cells_row3.eq(0).text(), "level 2");
            equal(cells_row3.eq(1).text(), "level 2");
            equal(cells_row3.eq(1).attr("rowspan"), 2);

            var row_4 = tr.eq(3);
            var cells_row4 = row_4.find("th");

            equal(cells_row4.length, 1);
        });
    });

    asyncTest("PivotGrid renders third level corretly if second parent has been expanded", 18, function() {
        var tuples = [
            { members: [ { name: "level 0",  levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2", levelNum: "2",  parentName: "level 1_2", children: [] }] },
            { members: [ { name: "level 3", levelNum: "3",  parentName: "level 2", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();

            var tr = headerTable.find("tr");
            equal(tr.length, 4);

            var row_1 = tr.eq(0);
            var cells_row1 = row_1.find("th");

            equal(cells_row1.length, 2);
            equal(cells_row1.eq(0).attr("colspan"), 5);
            equal(cells_row1.eq(1).attr("rowspan"), 4);

            var row_2 = tr.eq(1);
            var cells_row2 = row_2.find("th");

            equal(cells_row2.length, 4);

            equal(cells_row2.eq(0).text(), "level 1_1");
            equal(cells_row2.eq(0).attr("rowspan"), 3);

            equal(cells_row2.eq(1).text(), "level 1_2");
            equal(cells_row2.eq(1).attr("colspan"), 2);

            equal(cells_row2.eq(2).text(), "level 1_2");
            equal(cells_row2.eq(2).attr("rowspan"), 3);

            equal(cells_row2.eq(3).text(), "level 1_3");
            equal(cells_row2.eq(3).attr("rowspan"), 3);

            var row_3 = tr.eq(2);
            var cells_row3 = row_3.find("th");

            equal(cells_row3.length, 2);
            equal(cells_row3.eq(0).text(), "level 2");
            equal(cells_row3.eq(1).text(), "level 2");
            equal(cells_row3.eq(1).attr("rowspan"), 2);

            var row_4 = tr.eq(3);
            var cells_row4 = row_4.find("th");

            equal(cells_row4.length, 1);
        });
    });

    test("PivotGrid renders second level with two expanded tuples corretly", function() {
       var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1",  parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2_1", levelNum: "2",  parentName: "level 1_1", children: [] }] },
            { members: [ { name: "level 2_2", levelNum: "2",  parentName: "level 1_2", children: [] }] },
            { members: [ { name: "level 2_3", levelNum: "2",  parentName: "level 1_2", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        equal(tr.length, 3);

        var row_2 = tr.eq(1);
        var cells_row2 = row_2.find("th");

        equal(cells_row2.length, 5);

        equal(cells_row2.eq(0).text(), "level 1_1");
        equal(cells_row2.eq(0).attr("colspan"), 1);

        equal(cells_row2.eq(1).text(), "level 1_1");
        equal(cells_row2.eq(1).attr("rowspan"), 2);

        equal(cells_row2.eq(2).text(), "level 1_2");
        equal(cells_row2.eq(2).attr("colspan"), 2);

        equal(cells_row2.eq(3).text(), "level 1_2");
        equal(cells_row2.eq(3).attr("rowspan"), 2);

        equal(cells_row2.eq(4).text(), "level 1_3");
        equal(cells_row2.eq(4).attr("rowspan"), 2);

        var row_3 = tr.eq(2);
        var cells_row3 = row_3.find("th");

        equal(cells_row3.length, 3);
        equal(cells_row3.eq(0).text(), "level 2_1");
        equal(cells_row3.eq(1).text(), "level 2_2");
        equal(cells_row3.eq(2).text(), "level 2_3");
    });

    test("PivotGrid appends first level expanded tuple to two levels expanded sibling tuple ", function() {
       var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2_1", levelNum: "2", parentName: "level 1_1", children: [] }] },
            { members: [ { name: "level 3_1", levelNum: "3", parentName: "level 2_1", children: [] }] },
            { members: [ { name: "level 2_2", levelNum: "2", parentName: "level 1_2", children: [] }] },
            { members: [ { name: "level 2_3", levelNum: "2", parentName: "level 1_2", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");
        var tr = headerTable.find("tr");

        var row_2 = tr.eq(1);
        var cells_row2 = row_2.find("th");

        equal(cells_row2.length, 5);

        equal(cells_row2.eq(2).text(), "level 1_2");
        equal(cells_row2.eq(2).attr("colspan"), 2);

        equal(cells_row2.eq(3).text(), "level 1_2");
        equal(cells_row2.eq(3).attr("rowspan"), 3);

        var row_3 = tr.eq(2);
        var cells_row3 = row_3.find("th");

        equal(cells_row3.eq(2).text(), "level 2_2");
        equal(cells_row3.eq(2).attr("rowspan"), 2);
        equal(cells_row3.eq(3).text(), "level 2_3");
        equal(cells_row3.eq(3).attr("rowspan"), 2);
    });

    test("PivotGrid normalizes rowspan values of master row", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2", levelNum: "2", parentName: "level 1_1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr").eq(1);
        var th_level1 = tr.find("th");

        ok(!th_level1.eq(0).attr("rowspan"));
        equal(th_level1.eq(1).attr("rowspan"), 2);
        equal(th_level1.eq(2).attr("rowspan"), 2);
        equal(th_level1.eq(3).attr("rowspan"), 2);
    });

    test("PivotGrid normalizes rowspan values of all master rows", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_2", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 1_3", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 2", levelNum: "2", parentName: "level 1_1", children: [] }] },
            { members: [ { name: "level 3", levelNum: "3", parentName: "level 2", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr").eq(1);
        var th_level1 = tr.find("th");

        ok(!th_level1.eq(0).attr("rowspan"));
        equal(th_level1.eq(0).attr("colspan"), 2);
        equal(th_level1.eq(1).attr("rowspan"), 3);
        equal(th_level1.eq(2).attr("rowspan"), 3);
        equal(th_level1.eq(3).attr("rowspan"), 3);
    });

    asyncTest("PivotGrid normalize colspan value of all dimension rows", 3, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_1", parentName: "dim 2", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_2", parentName: "dim 2", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_3", parentName: "dim 2", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();
            var rows = headerTable.find("tr");

            equal(rows.length, 4);

            var tr_dim0 = rows.eq(0);
            var tr_dim1 = rows.eq(1);

            equal(tr_dim0.find("th").attr("colspan"), 4);
            equal(tr_dim1.find("th").attr("colspan"), 4);
        });
    });

    asyncTest("PivotGrid does not set colspan to the parent dimension if child was not expanded", 3, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        setTimeout(function() {
            start();
            var rows = headerTable.find("tr");

            equal(rows.length, 3);

            var tr_dim0 = rows.eq(0);
            var tr_dim1 = rows.eq(1);

            equal(tr_dim0.find("th").last().attr("colspan"), 1);
            ok(!tr_dim1.find("th").last().attr("colspan"));
        });
    });

    asyncTest("PivotGrid calculates colspan of two of three expanded dimensions", 2, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }, { name: "dim 2", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_1", parentName: "dim 2", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_2", parentName: "dim 2", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "level 1_3", parentName: "dim 2", levelNum: "1", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");

        var tr_dim0 = rows.eq(0);
        var tr_dim1 = rows.eq(1);

        setTimeout(function() {
            start();
            equal(tr_dim0.find("th").last().attr("colspan"), 6);
            equal(tr_dim1.find("th").last().attr("colspan"), 4);
        });
    });

    asyncTest("PivotGrid expands All cell of second dimension under first dimension child correctly", 3, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");

        var th_level0 = rows.eq(0).find("th");
        var th_level1 = rows.eq(1).find("th");
        var th_level2 = rows.eq(2).find("th");

        setTimeout(function() {
            start();
            equal(th_level0.eq(0).attr("colspan"), 4);
            equal(th_level1.eq(1).attr("colspan"), 3);
            equal(th_level2.eq(1).attr("colspan"), 2);
        });
    });

    asyncTest("PivotGrid expands All cell of second dimension under first dimension child when child is expanded", 3, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");

        var th_level0 = rows.eq(0).find("th");
        var th_level1 = rows.eq(1).find("th");
        var th_level3 = rows.eq(3).find("th");

        setTimeout(function() {
            start();
            equal(th_level0.eq(0).attr("colspan"), 6);
            equal(th_level1.eq(2).attr("colspan"), 4);
            equal(th_level3.eq(2).attr("colspan"), 3);
        });
    });

    asyncTest("PivotGrid expands child cells and all cells of both dimensions (complex expanded header)", 9, function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");

        var th_level0 = rows.eq(0).find("th");
        var th_level1 = rows.eq(1).find("th");
        var th_level3 = rows.eq(3).find("th");
        var th_level4 = rows.eq(4).find("th");

        setTimeout(function() {
            start();
            //All section of dim 0
            equal(th_level0.eq(0).attr("colspan"), 6);
            equal(th_level1.eq(2).attr("colspan"), 4);
            equal(th_level3.eq(2).attr("colspan"), 3);

            //All section of dim 1
            equal(th_level0.eq(1).attr("colspan"), 3);
            equal(th_level0.eq(1).attr("rowspan"), 3);
            equal(th_level3.eq(4).attr("colspan"), 2);
            equal(th_level3.eq(5).attr("rowspan"), 3);
            equal(th_level4.eq(3).attr("rowspan"), 2);
            equal(th_level4.eq(4).attr("rowspan"), 2);
        });
    });

    test("PivotGrid renders k-header style to TH cell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        ok(th.hasClass("k-header"));
    });

    test("PivotGrid renders k-header k-alt style to all TH cell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_level0 = rows.eq(0).find("th");
        var th_level1 = rows.eq(1).find("th");

        ok(th_level0.eq(0).hasClass("k-header"));
        ok(!th_level0.eq(0).hasClass("k-alt"));

        ok(th_level0.eq(1).hasClass("k-header"));
        ok(th_level0.eq(1).hasClass("k-alt"));

        ok(th_level1.eq(0).hasClass("k-header"));
        ok(!th_level1.eq(0).hasClass("k-alt"));
    });

    test("PivotGrid renders k-header k-alt style to measures of all cells", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] }] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] }] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 1", children: [] }] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 2", children: [] }] }
        ]

        var measures = ["measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var cells = headerTable.find("tr:last").find("th");

        ok(cells.eq(2).hasClass("k-alt"));
        ok(cells.eq(3).hasClass("k-alt"));
    });

    test("PivotGrid renders k-first class to the physical cell that is not visually first", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", parentName: "level 0", levelNum: "1", children: [] }] },
            { members: [ { name: "level 1_2", parentName: "level 0", levelNum: "1", children: [] }] },
            { members: [ { name: "level 1_3", parentName: "level 0", levelNum: "1", children: [] }] },
            { members: [ { name: "level 2_1", parentName: "level 1_2", levelNum: "2", children: [] }] },
            { members: [ { name: "level 2_2", parentName: "level 1_3", levelNum: "2", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_level2 = rows.eq(2).find("th");

        ok(th_level2.eq(0).hasClass("k-first"));
        ok(!th_level2.eq(1).hasClass("k-first"));
    });

    test("PivotGrid renders k-first class third level child that visually is not first", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] },
            { members: [ { name: "level 1_1", parentName: "level 0", levelNum: "1", children: [] }] },
            { members: [ { name: "level 1_2", parentName: "level 0", levelNum: "1", children: [] }] },
            { members: [ { name: "level 2_1", parentName: "level 1_2", levelNum: "2", children: [] }] },
            { members: [ { name: "level 3_1", parentName: "level 2_1", levelNum: "3", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_level3 = rows.eq(3).find("th");

        ok(th_level3.eq(0).hasClass("k-first"));
    });

    test("PivotGrid renders expand button collapsed", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        var button = th.find("span");

        ok(button[0]);
        ok(button.hasClass("k-icon"));
        ok(button.hasClass("k-i-arrow-e"));
        ok(!button.hasClass("k-i-arrow-s"));
        equal(button.attr(kendo.attr("path")), kendo.stringify(["level 0"]));
    });

    test("PivotGrid renders expand button with correct path", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_0 = rows.eq(0).find("th");
        var th_1 = rows.eq(1).find("th");

        equal(th_0.find("span").attr(kendo.attr("path")), kendo.stringify(["dim 0"]));
        equal(th_1.find("span").attr(kendo.attr("path")), kendo.stringify(["dim 0", "dim 1"]));
    });

    test("PivotGrid renders expand button expanded", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 0_2", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 0_3", levelNum: "1", parentName: "level 0", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var tr = headerTable.find("tr");
        var th = headerTable.find("th");

        var button = th.find("span");

        ok(button[0]);
        ok(button.hasClass("k-icon"));
        ok(!button.hasClass("k-i-arrow-e"));
        ok(button.hasClass("k-i-arrow-s"));
        equal(button.attr(kendo.attr("path")), kendo.stringify(["level 0"]));
    });

    asyncTest("PivotGrid renders one dimension with two measures", 4, function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_1 = rows.eq(1).find("th");

        setTimeout(function() {
            start();
            equal(rows.eq(0).find("th").attr("colspan"), 2);
            equal(th_1.eq(0).text(), "measure 1");
            equal(th_1.eq(1).text(), "measure 2");

            ok(th_1.eq(0).hasClass("k-header"));
        });
    });

    asyncTest("PivotGrid renders child tuple with two measures", 3, function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_0 = rows.eq(0).find("th");
        var th_1 = rows.eq(1).find("th");

        setTimeout(function() {
            start();
            equal(th_0.eq(0).attr("colspan"), 2);
            equal(th_0.eq(1).attr("colspan"), 2);
            equal(th_1.eq(0).attr("colspan"), 2);
        });
    });

    asyncTest("PivotGrid renders two dimensions with three measures", 5, function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_2 = rows.eq(2).find("th");

        setTimeout(function() {
            start();
            equal(rows.eq(0).find("th").attr("colspan"), 3);
            equal(rows.eq(1).find("th").attr("colspan"), 3);

            equal(th_2.eq(0).text(), "measure 1");
            equal(th_2.eq(1).text(), "measure 2");
            equal(th_2.eq(2).text(), "measure 3");
        });
    });

    test("PivotGrid renders measures as a single dimension", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_0 = rows.eq(0).find("th");

        equal(rows.length, 1);
        equal(th_0.eq(0).text(), "measure 1");
        equal(th_0.eq(1).text(), "measure 2");
    });

    test("PivotGrid renders colgroup", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [], measures)
        });

        var colGroup  = pivotgrid.wrapper.find(".k-grid-header").find("colgroup");

        var cols = colGroup.find("col");

        equal(cols.length, 2);
    });

    test("PivotGrid use columnHeaderTemplate to render column header measure", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [ "measure 1" ];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            columnHeaderTemplate: "test #: data.member.name #"
        });

        var cell  = pivotgrid.wrapper.find(".k-grid-header").find("tbody").find("th");

        equal(cell.text(), "test measure 1");
    });

    test("PivotGrid use columnHeaderTemplate to render column header cell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples),
            columnHeaderTemplate: "test #: data.member.name #"
        });

        var cell  = pivotgrid.wrapper.find(".k-grid-header").find("tbody").find("th");

        equal(cell.text(), "test level 0");
    });

    test("PivotGrid use columnHeaderTemplate to render column header allcell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "level 1", parentName: "level 0", levelNum: "1", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples),
            columnHeaderTemplate: "test #: data.member.name #"
        });

        var row = pivotgrid.wrapper.find(".k-grid-header").find("tbody").find("tr:first");

        equal(row.find("th:last").text(), "test level 0");
    });

    test("PivotGrid passes correct tuple to columnHeaderTemplate", 1, function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] }
        ]

        window.checkTuple = function(tuple) {
            equal(tuple.members[0].name, "level 0");
        }

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples),
            columnHeaderTemplate: "#checkTuple(data.tuple)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid renders correctly column tuples with missing measures", function() {
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
                            columns: {
                                tuples: [
                                    { members: [ { name: "Calendar", children: [], levelNum: "0" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "Calendar", children: [], levelNum: "0" }, { name: "measure 2", children: [] } ] },
                                    { members: [ { name: "2008", parentName: "Calendar", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "2008", parentName: "Calendar", children: [], levelNum: "1" }, { name: "measure 2", children: [] } ] },
                                    { members: [ { name: "2009", parentName: "Calendar", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] },
                                    { members: [ { name: "2010", parentName: "Calendar", children: [], levelNum: "1" }, { name: "measure 1", children: [] } ] }
                                ]
                            },
                            rows: {
                                tuples: [
                                    { members: [ { name: "Product", children: [], levelNum: "0" } ] },
                                    { members: [ { name: "P1", parentName: "Product", children: [], levelNum: "1" } ] },
                                    { members: [ { name: "P2", parentName: "Product", children: [], levelNum: "1" } ] }
                                ]
                            }
                        },
                        data: [
                            { value: "92", ordinal: 0 },
                            { value: "32265", ordinal: 1 },
                            { value: "92", ordinal: 2 },
                            { value: "92", ordinal: 3 },
                            { value: "92", ordinal: 4 },
                            { value: "92", ordinal: 6 },
                            { value: "92", ordinal: 7 },
                            { value: "92", ordinal: 8 },
                            { value: "21067", ordinal: 9 },
                            { value: "92", ordinal: 10 },
                            { value: "92", ordinal: 11 }
                        ]
                    });
                }
            }
        });

        createPivot({
            dataSource: dataSource
        });

        //no JavaScript errors
        ok(true);
    });

    test("PivotGrid renders colum header starting from specific dimension member", function() {
        var tuples = [
            { members: [ { name: "dim 1_1", levelNum: "1", parentName: "dim 0", hasChildren: true, children: [] }, { name: "dim 2_1", levelNum: "1", parentName: "dim 2", children: [] } ] },
            { members: [ { name: "dim 1_2", levelNum: "2", parentName: "dim 1_1", children: [] }, { name: "dim 2_1", levelNum: "1", parentName: "dim 2", children: [] } ] }
        ];

        var pivotgrid = createPivot({
            dataSource: new PivotDataSource({
                columns: [
                    { name: "dim 1_1", expand: true },
                    { name: "dim 2_1", expand: false }
                ],
                measures: [],
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: {
                                columns: {
                                    tuples: tuples || []
                                }
                            },
                            data: []
                        });
                    }
                }
            })
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");

        var rows = headerTable.find("tr");
        var th_0 = rows.eq(0).find("th");
        var th_1 = rows.eq(1).find("th");
        var th_2 = rows.eq(2).find("th");

        equal(th_0.eq(0).text(), "dim 1_1");
        equal(th_0.eq(1).text(), "dim 1_1");
        equal(th_1.eq(0).text(), "dim 1_2");

        equal(th_2.eq(0).text(), "dim 2_1");
        equal(th_2.eq(1).text(), "dim 2_1");
    });

    module("PivotGrid rows header rendering", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    function createDataSourceRows(tuples, data, measures) {
        return new PivotDataSource({
            measures: {
                values: measures || [],
                axis: "rows"
            },
            rows: [ { name: "level 0" } ],
            schema: {
                axes: "axes",
                data: "data"
            },
            transport: {
                read: function(options) {
                    options.success({
                        axes: {
                            rows: {
                                tuples: tuples || []
                            }
                        },
                        data: data || []
                    });
                }
            }
        });
    }

    test("PivotGrid renders row header with a non-breaking space if no tuples", function() {
        var tuples = [
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var tr = headerTable.find("tr");
        var td = headerTable.find("td");

        equal(tr.length, 1);
        equal(td.length, 1);
        equal(td.html(), "&nbsp;");
    });

    test("PivotGrid renders row header for 1 dimension with one tuple", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var tr = headerTable.find("tr");
        var td = headerTable.find("td");

        equal(tr.length, 1);
        equal(td.length, 1);
        equal(td.text(), "level 0");
    });

    test("PivotGrid renders row header for 2 dimensions with one tuple", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var tr = headerTable.find("tr");
        var td = headerTable.find("td");

        equal(tr.length, 1);
        equal(td.length, 2);
        equal(td.eq(0).text(), "dim 0");
        equal(td.eq(1).text(), "dim 1");
    });

    test("PivotGrid renders row header for 1 dimension with one child", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");

        equal(rows.length, 2);

        equal(td_level0.length, 2);
        equal(td_level1.length, 1);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level1.text(), "dim 0");

        //equal(td_level0.eq(0).attr("rowspan"), 1);
        //equal(td_level1.eq(0).attr("colspan"), 2);
    });

    test("PivotGrid renders row header for 1 dimension with two children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");

        equal(rows.length, 3);

        equal(td_level0.length, 2);
        equal(td_level1.length, 1);
        equal(td_level2.length, 1);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level1.text(), "dim 0_2");
        equal(td_level2.text(), "dim 0");
    });

    test("PivotGrid renders row header for 1 dimension with three levels", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_2", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");
        var td_level3 = rows.eq(3).find("td");

        equal(rows.length, 4);

        equal(td_level0.length, 2);
        equal(td_level1.length, 2);
        equal(td_level2.length, 1);
        equal(td_level3.length, 1);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level1.eq(0).text(), "dim 0_2");
        equal(td_level1.eq(1).text(), "dim 0_3");
        equal(td_level2.text(), "dim 0_2");
        equal(td_level3.text(), "dim 0");
    });

    test("PivotGrid renders row header for 2 dimension with a child in each dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");

        equal(rows.length, 3);

        equal(td_level0.length, 3);
        equal(td_level1.length, 3);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level0.eq(2).text(), "dim 1");
        equal(td_level1.eq(0).text(), "dim 0");
        equal(td_level1.eq(1).text(), "dim 1");
        equal(td_level1.eq(2).text(), "dim 1_1");
        equal(td_level2.eq(0).text(), "dim 1");
    });

    test("PivotGrid renders row header for 2 dimension with two children in each dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");
        var td_level3 = rows.eq(3).find("td");
        var td_level4 = rows.eq(4).find("td");

        equal(rows.length, 5);

        equal(td_level0.length, 4);
        equal(td_level1.length, 1);
        equal(td_level2.length, 1);
        equal(td_level3.length, 2);
        equal(td_level4.length, 2);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level0.eq(2).text(), "dim 1");
        equal(td_level0.eq(3).text(), "dim 1_1");

        equal(td_level1.eq(0).text(), "dim 1_2");
        equal(td_level2.eq(0).text(), "dim 1");

        equal(td_level3.eq(0).text(), "dim 0_2");
        equal(td_level3.eq(1).text(), "dim 1");

        equal(td_level4.eq(0).text(), "dim 0");
        equal(td_level4.eq(1).text(), "dim 1");
    });

    test("PivotGrid renders row header for 2 dimensions with three level children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");
        var td_level3 = rows.eq(3).find("td");

        equal(rows.length, 4);

        equal(td_level0.length, 4);
        equal(td_level1.length, 2);
        equal(td_level2.length, 2);
        equal(td_level3.length, 2);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level0.eq(2).text(), "dim 0_3");
        equal(td_level0.eq(3).text(), "dim 1");

        equal(td_level1.eq(0).text(), "dim 0_1");
        equal(td_level1.eq(1).text(), "dim 1");

        equal(td_level2.eq(0).text(), "dim 0_2");
        equal(td_level2.eq(1).text(), "dim 1");

        equal(td_level3.eq(0).text(), "dim 0");
        equal(td_level3.eq(1).text(), "dim 1");
    });

    test("PivotGrid renders row header for 3 dimension with a child in 1st and 2nd dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");

        equal(rows.length, 3);

        equal(td_level0.length, 4);
        equal(td_level1.length, 4);
        equal(td_level2.length, 2);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level0.eq(2).text(), "dim 1");
        equal(td_level0.eq(3).text(), "dim 2");

        equal(td_level1.eq(0).text(), "dim 0");
        equal(td_level1.eq(1).text(), "dim 1");
        equal(td_level1.eq(2).text(), "dim 1_1");
        equal(td_level1.eq(3).text(), "dim 2");

        equal(td_level2.eq(0).text(), "dim 1");
        equal(td_level2.eq(1).text(), "dim 2");
    });

    test("PivotGrid renders row header for 3 dimension with a child in each dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "dim 2_1", parentName: "dim 2", levelNum: "1", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");
        var td_level3 = rows.eq(3).find("td");

        equal(rows.length, 4);

        equal(td_level0.length, 4);
        equal(td_level1.length, 5);
        equal(td_level2.length, 1);
        equal(td_level3.length, 2);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 0_1");
        equal(td_level0.eq(2).text(), "dim 1");
        equal(td_level0.eq(3).text(), "dim 2");

        equal(td_level1.eq(0).text(), "dim 0");
        equal(td_level1.eq(1).text(), "dim 1");
        equal(td_level1.eq(2).text(), "dim 1_1");
        equal(td_level1.eq(3).text(), "dim 2");
        equal(td_level1.eq(4).text(), "dim 2_1");

        equal(td_level2.eq(0).text(), "dim 2");

        equal(td_level3.eq(0).text(), "dim 1");
        equal(td_level3.eq(1).text(), "dim 2");
    });

    test("PivotGrid renders row header for 3 dimensions with last expanded dimension only", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2_1", parentName: "dim 2", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2_2", parentName: "dim 2", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "dim 2_3", parentName: "dim 2_2", levelNum: "2", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level1 = rows.eq(1).find("td");
        var td_level2 = rows.eq(2).find("td");
        var td_level3 = rows.eq(3).find("td");

        equal(rows.length, 4);

        equal(td_level0.length, 4);
        equal(td_level1.length, 2);
        equal(td_level2.length, 1);
        equal(td_level3.length, 1);

        equal(td_level0.eq(0).text(), "dim 0");
        equal(td_level0.eq(1).text(), "dim 1");
        equal(td_level0.eq(2).text(), "dim 2");
        equal(td_level0.eq(3).text(), "dim 2_1");

        equal(td_level1.eq(0).text(), "dim 2_2");
        equal(td_level1.eq(1).text(), "dim 2_3");

        equal(td_level2.eq(0).text(), "dim 2_2");

        equal(td_level3.eq(0).text(), "dim 2");
    });

    test("PivotGrid renders rowspan for header of 1 dimension with one child", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        ok(!td_level0.eq(0).attr("rowspan"));
    });

    test("PivotGrid renders rowspan for header of 1 dimension with two children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 2);
    });

    test("PivotGrid renders rowspan for header of 1 dimension with two level children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0_1", levelNum: "2", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 2);
    });

    test("PivotGrid renders rowspan for header of 1 dimension with two level children (two children on first level)", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 3);
    });

    test("PivotGrid renders rowspan for header of 1 dimension with three level children (with two children on each level)", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_3", levelNum: "3", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_3", levelNum: "3", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 5);
        equal(td_level0.eq(1).attr("rowspan"), 3);
        equal(td_level0.eq(2).attr("rowspan"), 2);
    });

    test("PivotGrid renders rowspan for header of 2 dimension with a child in second dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 2);
    });

    test("PivotGrid renders rowspan for header of 2 dimension with two children in second dimension", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 3);
    });

    test("PivotGrid renders rowspan for header of 2 dimension with three level children and with two children in each level", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_2", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level2 = rows.eq(2).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 6);
        equal(td_level0.eq(1).attr("rowspan"), 5);

        equal(td_level2.eq(0).attr("rowspan"), 2);
    });

    test("PivotGrid renders rowspan for header of 2 dimension with three level children and with two children in each level", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_2", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] } ] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level2 = rows.eq(2).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 2);
        equal(td_level2.eq(0).attr("rowspan"), 6);
        equal(td_level2.eq(1).attr("rowspan"), 5);
    });

    test("PivotGrid renders rowspan for header of 2 dimension with expanded second dimension of all row", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1", levelNum: "1", children: [] }] },
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 6);
    });

    test("PivotGrid renders rowspan for header of 2 dimension - fully expanded", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_4", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_5", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_6", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_2", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level0 = rows.eq(0).find("td");
        var td_level3 = rows.eq(3).find("td");
        var td_level6 = rows.eq(6).find("td");
        var td_level8 = rows.eq(8).find("td");

        equal(td_level0.eq(0).attr("rowspan"), 6);
        equal(td_level0.eq(1).attr("rowspan"), 3);
        equal(td_level0.eq(2).attr("rowspan"), 2);

        equal(td_level3.eq(0).attr("rowspan"), 3);
        equal(td_level3.eq(1).attr("rowspan"), 2);

        equal(td_level6.eq(0).attr("rowspan"), 6);
        equal(td_level6.eq(1).attr("rowspan"), 5);

        equal(td_level8.eq(0).attr("rowspan"), 2);
    });

    test("PivotGrid renders colspan for header of one dimension with 4 levels", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_3", parentName: "dim 0", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 1_1", parentName: "dim 0_1", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 2_1", parentName: "dim 1_1", levelNum: "3", children: [] } ] },
            { members: [ { name: "dim 3_1", parentName: "dim 2_1", levelNum: "4", children: [] } ] },
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td");
        var td_1 = rows.eq(1).find("td");
        var td_2 = rows.eq(2).find("td");
        var td_3 = rows.eq(3).find("td");
        var td_4 = rows.eq(4).find("td");
        var td_5 = rows.eq(5).find("td");
        var td_6 = rows.eq(6).find("td");

        equal(td_0.eq(1).attr("colspan"), 4);
        ok(!td_1.eq(3).attr("colspan"));
        equal(td_2.eq(0).attr("colspan"), 2);
        equal(td_3.eq(0).attr("colspan"), 3);
        equal(td_4.eq(0).attr("colspan"), 4);
        equal(td_5.eq(0).attr("colspan"), 4);
        equal(td_6.eq(0).attr("colspan"), 5);
    });

    test("PivotGrid renders colspan for header of 2 dimension - fully expanded", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_4", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_5", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_6", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_2", levelNum: "2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_level6 = rows.eq(6).find("td");
        var td_level7 = rows.eq(7).find("td");
        var td_level10 = rows.eq(10).find("td");
        var td_level11 = rows.eq(11).find("td");

        equal(td_level6.eq(0).attr("colspan"), 2);
        equal(td_level7.eq(0).attr("colspan"), 2);
        equal(td_level10.eq(0).attr("colspan"), 2);
        equal(td_level11.eq(0).attr("colspan"), 3);
    });

    test("PivotGrid renders k-first cell to the first root cell", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td");
        var td_1 = rows.eq(1).find("td");

        ok(td_0.eq(0).hasClass("k-first"));
        ok(!td_0.eq(1).hasClass("k-first"));
        ok(!td_0.eq(2).hasClass("k-first"));

        ok(td_1.eq(0).hasClass("k-first"));
        ok(!td_1.eq(1).hasClass("k-first"));
    });

    test("PivotGrid renders k-grid-footer to all cells", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1_3", parentName: "dim 1", levelNum: "1", children: [] }] },
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var cells3 = rows.eq(3).find("td");
        var cells5 = rows.eq(5).find("td");

        ok(cells3.hasClass("k-grid-footer"));
        ok(cells5.eq(0).hasClass("k-grid-footer"));
        ok(cells5.eq(1).hasClass("k-grid-footer"));
    });

    test("PivotGrid doesn't render k-grid-footer if cell has children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var cells = headerTable.find("tr").eq(1).find("td");

        ok(cells.eq(0).hasClass("k-grid-footer"));
        ok(!cells.eq(1).hasClass("k-grid-footer"));
        ok(!cells.eq(2).hasClass("k-grid-footer"));
    });

    test("PivotGrid renders expand button collapsed of the row headers", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var td = headerTable.find("td");

        var button = td.find("span");

        ok(button[0]);
        ok(button.hasClass("k-icon"));
        ok(button.hasClass("k-i-arrow-e"));
        ok(!button.hasClass("k-i-arrow-s"));
        equal(button.attr(kendo.attr("path")), kendo.stringify(["level 0"]));
    });

    test("PivotGrid renders expand button with correct path", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td").eq(0);
        var td_1 = rows.eq(0).find("td").eq(1);

        equal(td_0.find("span").attr(kendo.attr("path")), kendo.stringify(["dim 0"]));
        equal(td_1.find("span").attr(kendo.attr("path")), kendo.stringify(["dim 0", "dim 1"]));
    });

    test("PivotGrid renders expand button expanded", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 0_2", levelNum: "1", parentName: "level 0", children: [] }] },
            { members: [ { name: "level 0_3", levelNum: "1", parentName: "level 0", children: [] }] }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var td = headerTable.find("td");

        var button = td.find("span");

        ok(button[0]);
        ok(button.hasClass("k-icon"));
        ok(!button.hasClass("k-i-arrow-e"));
        ok(button.hasClass("k-i-arrow-s"));
        equal(button.attr(kendo.attr("path")), kendo.stringify(["level 0"]));
    });

    test("PivotGrid renders one dimension with two measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td");
        var td_1 = rows.eq(1).find("td");

        equal(rows.length, 2);

        equal(td_0.eq(0).text(), "level 0");
        equal(td_0.eq(0).attr("rowspan"), 2);

        equal(td_0.eq(1).text(), "measure 1");
        equal(td_1.eq(0).text(), "measure 2");
    });

    test("PivotGrid renders child tuple with two measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td");
        var td_1 = rows.eq(1).find("td");
        var td_2 = rows.eq(2).find("td");
        var td_3 = rows.eq(3).find("td");

        equal(td_0.eq(0).text(), "level 0");
        equal(td_0.eq(0).attr("rowspan"), 2);

        equal(td_0.eq(1).text(), "level 0_1");
        equal(td_0.eq(1).attr("rowspan"), 2);

        equal(td_0.eq(2).text(), "measure 1");
        equal(td_1.eq(0).text(), "measure 2");

        equal(td_2.eq(0).text(), "level 0");
        equal(td_2.eq(0).attr("rowspan"), 2);

        equal(td_2.eq(1).text(), "measure 1");
        equal(td_3.eq(0).text(), "measure 2");
    });

    test("PivotGrid renders k-grid-footer class to all footer rows with multiple measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var cells2 = rows.eq(2).find("td");
        var cells3 = rows.eq(3).find("td");

        ok(cells2.eq(0).hasClass("k-grid-footer"));
        ok(cells2.eq(1).hasClass("k-grid-footer"));
        ok(cells3.eq(0).hasClass("k-grid-footer"));
    });

    test("PivotGrid renders k-first class to the first root cell when multiple measures are used", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", levelNum: "1", parentName: "level 0", children: [] }, { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_2 = rows.eq(2).find("td");
        var td_3 = rows.eq(3).find("td");

        ok(td_2.eq(0).hasClass("k-first"));
        ok(!td_3.eq(0).hasClass("k-first"));
    });

    test("PivotGrid renders measures as a single dimension", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, [], measures)
        });

        var headerTable = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("table");

        var rows = headerTable.find("tr");
        var td_0 = rows.eq(0).find("td");
        var td_1 = rows.eq(1).find("td");

        equal(rows.length, 2);
        equal(td_0.eq(0).text(), "measure 1");
        equal(td_1.eq(0).text(), "measure 2");
    });

    test("PivotGrid renders colgroup", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data, measures)
        });

        var colGroup = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("colgroup");

        var cols = colGroup.find("col");

        equal(cols.length, 1);
    });

    test("PivotGrid renders colgroup when two dimensions are expanded", function() {
        var columns = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] } ] }
        ];

        var rows = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] } ] }
        ];

        var data = [
            { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 },
            { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }
        ];

        var pivotgrid = createPivot({
            dataSource: new PivotDataSource({
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: {
                                columns: {
                                    tuples: (columns || []).slice()
                                },
                                rows: {
                                    tuples: (rows || []).slice()
                                }
                            },
                            data: (data || []).slice()
                        });
                    }
                }
            })
        });

        var colGroup = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("colgroup");

        var cols = colGroup.find("col");

        equal(cols.length, 4);
    });

    test("PivotGrid use rowHeaderTemplate to render row header measure", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [ "measure 1" ];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data, measures),
            rowHeaderTemplate: "test #: data.member.name #"
        });

        var cell  = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("tbody").find("td");

        equal(cell.text(), "test measure 1");
    });

    test("PivotGrid use rowHeaderTemplate to render row header cell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples),
            rowHeaderTemplate: "test #: data.member.name #"
        });

        var cell  = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("tbody").find("td");

        equal(cell.text(), "test level 0");
    });

    test("PivotGrid use rowHeaderTemplate to render row header allcell", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "level 1", parentName: "level 0", levelNum: "1", children: [] } ] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples),
            rowHeaderTemplate: "test #: data.member.name #"
        });

        var row = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("tbody").find("tr:last");

        equal(row.find("td:last").text(), "test level 0");
    });

    test("PivotGrid passes correct tuple to rowHeaderTemplate", 1, function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] } ] }
        ]

        window.checkTuple = function(tuple) {
            equal(tuple.members[0].name, "level 0");
        }

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples),
            rowHeaderTemplate: "#checkTuple(data.tuple)#"
        });

        window.checkTuple = null;
    });

    module("PivotGrid content rendering", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    test("PivotGrid renders a non-breaking space if no data", function() {
        var tuples = [
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [])
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");

        equal(rows.length, 1);
        equal(rows.find("td").length, 1);
        equal(rows.find("td").eq(0).html(), "&nbsp;");
    });

    test("PivotGrid renders one data cell", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [{ value: 1 }])
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");

        equal(rows.length, 1);
        equal(rows.find("td").length, 1);
        equal(rows.find("td").eq(0).text(), "1");
    });

    test("PivotGrid shuffles data with parent and child cell", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [{ value: 1 }, { value: 2 }])
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);
        equal(cells.length, 2);
        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "1");
    });

    test("PivotGrid shuffles data with parent and two children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, [{ value: 1 }, { value: 2 }, { value: 3 }])
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);
        equal(cells.length, 3);
        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "3");
        equal(cells.eq(2).text(), "1");
    });

    test("PivotGrid shuffles data with parent and two level children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_6", parentName: "dim 0_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 },
            { value: 7 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "4");
        equal(cells.eq(1).text(), "5");
        equal(cells.eq(2).text(), "2");
        equal(cells.eq(3).text(), "6");
        equal(cells.eq(4).text(), "7");
        equal(cells.eq(5).text(), "3");
        equal(cells.eq(6).text(), "1");
    });

    test("PivotGrid shuffles two dimensional data", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "3");
        equal(cells.eq(2).text(), "1");
    });

    test("PivotGrid shuffles two dimensional expanded data", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "3");
        equal(cells.eq(2).text(), "4");
        equal(cells.eq(3).text(), "5");
        equal(cells.eq(4).text(), "1");
    });

    test("PivotGrid skips data when parent is collapsed", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_6", parentName: "dim 0_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 },
            { value: 7 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        //collapse root member
        pivotgrid._columnBuilder.metadata["[\"dim 0\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);
        equal(cells.length, 1);

        equal(cells.eq(0).text(), "1");
    });

    test("PivotGrid skips data when second level parent is collapsed", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_6", parentName: "dim 0_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 },
            { value: 7 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        //collapse root member
        pivotgrid._columnBuilder.metadata["[\"dim 0_1\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "6");
        equal(cells.eq(2).text(), "7");
        equal(cells.eq(3).text(), "3");
        equal(cells.eq(4).text(), "1");
    });

    test("PivotGrid shows data shuffled correctly after collapse", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_6", parentName: "dim 0_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 },
            { value: 7 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        //collapse root member
        pivotgrid._columnBuilder.metadata["[\"dim 0\"]"].expanded = false;
        pivotgrid.refresh();

        //expand root member
        pivotgrid._columnBuilder.metadata["[\"dim 0\"]"].expanded = true;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "4");
        equal(cells.eq(1).text(), "5");
        equal(cells.eq(2).text(), "2");
        equal(cells.eq(3).text(), "6");
        equal(cells.eq(4).text(), "7");
        equal(cells.eq(5).text(), "3");
        equal(cells.eq(6).text(), "1");
    });

    test("PivotGrid takes into account the collapsed member on expand", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] }
                    ]
                },
                rows: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_4", parentName: "dim 0_2", levelNum: "2", children: [] }] },
                        { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] }
                    ]
                },
                rows: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
                    ]
                }
            }
        ];

        var data = [
            [
                { value: 1 }, { value: 2 },
                { value: 3 }, { value: 4 },
                { value: 5 }, { value: 6 },
                { value: 7 }, { value: 8 }
            ], [
                { value: 3 }, { value: 9 },
                { value: 10 }, { value: 7 },
                { value: 11 }, { value: 12 },
            ]
        ];

        var pivotgrid = createPivot({
            dataSource: {
                measures: [],
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: axes.shift(),
                            data: data.shift()
                        });
                    }
                }
            }
        });

        //collapse first child
        pivotgrid._columnBuilder.metadata["[\"dim 0_1\"]"].expanded = false;
        pivotgrid.refresh();

        pivotgrid.dataSource.expandColumn("dim 0_2");

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_level1 = rows.eq(0).find("td");
        var cells_level2 = rows.eq(1).find("td");

        equal(rows.length, 2);

        equal(cells_level1.eq(0).text(), "6");
        equal(cells_level1.eq(1).text(), "11");
        equal(cells_level1.eq(2).text(), "12");
        equal(cells_level1.eq(3).text(), "7");
        equal(cells_level1.eq(4).text(), "5");

        equal(cells_level2.eq(0).text(), "2");
        equal(cells_level2.eq(1).text(), "9");
        equal(cells_level2.eq(2).text(), "10");
        equal(cells_level2.eq(3).text(), "3");
        equal(cells_level2.eq(4).text(), "1");
    });

    test("PivotGrid does not throw an exception when expand and collapse two child members", function() {
        var axes = [
            {
                columns: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] }
                    ]
                },
                rows: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
                    ]
                }
            },
            {
                columns: {
                    tuples: [
                        { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_4", parentName: "dim 0_2", levelNum: "2", children: [] }] },
                        { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] }
                    ]
                },
                rows: {
                    tuples: [
                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
                    ]
                }
            }
        ];

        var data = [
            [
                { value: 1 }, { value: 2 },
                { value: 3 }, { value: 4 },
                { value: 5 }, { value: 6 },
                { value: 7 }, { value: 8 }
            ], [
                { value: 3 }, { value: 9 },
                { value: 10 }, { value: 7 },
                { value: 11 }, { value: 12 },
            ]
        ];

        var pivotgrid = createPivot({
            dataSource: {
                measures: [],
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: axes.shift(),
                            data: data.shift()
                        });
                    }
                }
            }
        });

        //collapse first child
        pivotgrid._columnBuilder.metadata["[\"dim 0_1\"]"].expanded = false;
        pivotgrid.refresh();

        pivotgrid.dataSource.expandColumn("dim 0_2");

        //collapse first child
        pivotgrid._columnBuilder.metadata["[\"dim 0_2\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_level1 = rows.eq(0).find("td");
        var cells_level2 = rows.eq(1).find("td");

        equal(rows.length, 2);

        equal(cells_level1.eq(0).text(), "6");
        equal(cells_level1.eq(1).text(), "7");
        equal(cells_level1.eq(2).text(), "5");

        equal(cells_level2.eq(0).text(), "2");
        equal(cells_level2.eq(1).text(), "3");
        equal(cells_level2.eq(2).text(), "1");
    });

    test("PivotGrid renders one dimension with three measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "1");
        equal(cells.eq(1).text(), "2");
        equal(cells.eq(2).text(), "3");
    });

    test("PivotGrid renders parent and child of one dimension with three measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 3", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "4");
        equal(cells.eq(1).text(), "5");
        equal(cells.eq(2).text(), "6");

        equal(cells.eq(3).text(), "1");
        equal(cells.eq(4).text(), "2");
        equal(cells.eq(5).text(), "3");
    });

    test("PivotGrid renders collapsed parent with three measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0_1", parentName: "level 0", levelNum: "1", children: [] }, { name: "measure 3", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        //collapse root member
        pivotgrid._columnBuilder.metadata["[\"level 0\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "1");
        equal(cells.eq(1).text(), "2");
        equal(cells.eq(2).text(), "3");
    });

    test("PivotGrid renders two dimensions with 3 measures", function() {
        var tuples = [
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "level 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "1");
        equal(cells.eq(1).text(), "2");
        equal(cells.eq(2).text(), "3");
    });

    test("PivotGrid renders two expanded dimensions with 3 measures", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 3", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 2 },
            { value: 2 },
            { value: 2 },
            { value: 3 },
            { value: 3 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "2");
        equal(cells.eq(1).text(), "2");
        equal(cells.eq(2).text(), "2");

        equal(cells.eq(3).text(), "3");
        equal(cells.eq(4).text(), "3");
        equal(cells.eq(5).text(), "3");

        equal(cells.eq(6).text(), "1");
        equal(cells.eq(7).text(), "1");
        equal(cells.eq(8).text(), "1");
    });

    test("PivotGrid renders two collapsed dimensions with 3 measures", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }, { name: "measure 3", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 2", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }, { name: "measure 3", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2", "measure 3"];

        var data = [
            { value: 1 },
            { value: 1 },
            { value: 1 },
            { value: 2 },
            { value: 2 },
            { value: 2 },
            { value: 3 },
            { value: 3 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        //collapse root member
        pivotgrid._columnBuilder.metadata["[\"dim 0\"]"].expanded = false;
        pivotgrid._columnBuilder.metadata["[\"dim 0\",\"dim 1\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);
        equal(cells.length, 3);

        equal(cells.eq(0).text(), "1");
        equal(cells.eq(1).text(), "1");
        equal(cells.eq(2).text(), "1");
    });

    test("PivotGrid renders one data row", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] }
        ]

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");

        equal(rows.length, 1);
        equal(rows.find("td").length, 1);
        equal(rows.find("td").eq(0).text(), "1");
    });

    test("PivotGrid renders rows for parent and child tuple", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");

        equal(rows.length, 2);
        equal(cells_0.eq(0).text(), "2");
        equal(cells_1.eq(0).text(), "1");
    });

    test("PivotGrid renders rows for parent and two children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] }
        ]

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");
        var cells_2 = rows.eq(2).find("td");

        equal(rows.length, 3);
        equal(cells_0.eq(0).text(), "2");
        equal(cells_1.eq(0).text(), "3");
        equal(cells_2.eq(0).text(), "1");
    });

    test("PivotGrid renders rows for three level children", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_2", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");
        var cells_2 = rows.eq(2).find("td");
        var cells_3 = rows.eq(3).find("td");
        var cells_4 = rows.eq(4).find("td");
        var cells_5 = rows.eq(5).find("td");

        equal(rows.length, 6);
        equal(cells_0.eq(0).text(), "4");
        equal(cells_1.eq(0).text(), "2");
        equal(cells_2.eq(0).text(), "5");
        equal(cells_3.eq(0).text(), "6");
        equal(cells_4.eq(0).text(), "3");
        equal(cells_5.eq(0).text(), "1");
    });

    test("PivotGrid renders rows for three level children of two dimensions", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 },
            { value: 7 },
            { value: 8 },
            { value: 9 },
            { value: 10 },
            { value: 11 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");

        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");
        var cells_2 = rows.eq(2).find("td");
        var cells_3 = rows.eq(3).find("td");
        var cells_4 = rows.eq(4).find("td");
        var cells_5 = rows.eq(5).find("td");
        var cells_6 = rows.eq(6).find("td");
        var cells_7 = rows.eq(7).find("td");
        var cells_8 = rows.eq(8).find("td");
        var cells_9 = rows.eq(9).find("td");
        var cells_10 = rows.eq(10).find("td");

        equal(rows.length, 11);
        equal(cells_0.eq(0).text(), "4");
        equal(cells_1.eq(0).text(), "2");
        equal(cells_2.eq(0).text(), "5");
        equal(cells_3.eq(0).text(), "6");
        equal(cells_4.eq(0).text(), "3");
        equal(cells_5.eq(0).text(), "9");
        equal(cells_6.eq(0).text(), "10");
        equal(cells_7.eq(0).text(), "7");
        equal(cells_8.eq(0).text(), "11");
        equal(cells_9.eq(0).text(), "8");
        equal(cells_10.eq(0).text(), "1");
    });

    test("PivotGrid renders one dimension collapsed", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_2", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_3", parentName: "dim 0_1", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_4", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] },
            { members: [ { name: "dim 0_5", parentName: "dim 0_2", levelNum: "2", children: [] }, { name: "dim 1", levelNum: "0", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        //collapse root member
        pivotgrid._rowBuilder.metadata["[\"dim 0_1\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");
        var cells_2 = rows.eq(2).find("td");
        var cells_3 = rows.eq(3).find("td");
        var cells_4 = rows.eq(4).find("td");
        var cells_5 = rows.eq(5).find("td");

        equal(rows.length, 5);
        equal(cells_0.eq(0).text(), "2");
        equal(cells_1.eq(0).text(), "5");
        equal(cells_2.eq(0).text(), "6");
        equal(cells_3.eq(0).text(), "3");
        equal(cells_4.eq(0).text(), "1");
    });

    test("PivotGrid renders second dimension collapsed", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 },
            { value: 6 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        //collapse root member
        pivotgrid._rowBuilder.metadata["[\"dim 0\",\"dim 1_2\"]"].expanded = false;
        pivotgrid.refresh();

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");
        var cells_2 = rows.eq(2).find("td");
        var cells_3 = rows.eq(3).find("td");
        var cells_4 = rows.eq(4).find("td");
        var cells_5 = rows.eq(5).find("td");

        equal(rows.length, 5);
        equal(cells_0.eq(0).text(), "4");
        equal(cells_1.eq(0).text(), "5");
        equal(cells_2.eq(0).text(), "2");
        equal(cells_3.eq(0).text(), "3");
        equal(cells_4.eq(0).text(), "1");
    });

    test("PivotGrid renders data for measures on column axis", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "1");
        equal(cells.eq(1).text(), "2");
    });

    test("PivotGrid renders formatted value if any", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1, fmtValue: "$1" },
            { value: 2, fmtValue: "$2" }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "$1");
        equal(cells.eq(1).text(), "$2");
    });

    test("PivotGrid renders data for measures on column axis when one of measures has no data", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        var rows = contentTable.find("tr");
        var cells = rows.find("td");

        equal(rows.length, 1);

        equal(cells.eq(0).text(), "1");
    });

    test("PivotGrid renders colgroup", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var colGroup  = pivotgrid.wrapper.find(".k-grid-content").find("colgroup");

        var cols = colGroup.find("col");

        equal(cols.length, 2);
    });

    test("PivotGrid use dataCellTemplate to render data cells", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [ "measure 1" ];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            dataCellTemplate: "test #: data.dataItem.value #"
        });

        var cell  = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("td");

        equal(cell.text(), "test 1");
    });

    test("PivotGrid passes column tuple to cell template", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 0 },
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 }
        ];

        var indexes = [3, 4, 1, 5, 2, 0];

        window.checkTuple = function (data) {
            var tuple = tuples[indexes.shift()];
            var templateTuple = data.columnTuple;

            equal(tuple.members[0].name, templateTuple.members[0].name);
            equal(tuple.members[1].name, templateTuple.members[1].name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid passes row tuple to cell template", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1", levelNum: "0", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_1", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_2", parentName: "dim 1", levelNum: "1", hasChildren: true, children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_3", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_4", parentName: "dim 1_1", levelNum: "2", children: [] }] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "dim 1_5", parentName: "dim 1_2", levelNum: "2", children: [] }] }
        ];

        var data = [
            { value: 0 },
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 }
        ];

        var indexes = [3, 4, 1, 5, 2, 0];

        window.checkTuple = function (data) {
            var tuple = tuples[indexes.shift()];
            var templateTuple = data.rowTuple;

            equal(tuple.members[0].name, templateTuple.members[0].name);
            equal(tuple.members[1].name, templateTuple.members[1].name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid passes a measure with the column tuple", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] }
        ];

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var index = indexes.shift();

            var tuple = tuples[index];
            var templateTuple = data.columnTuple;

            equal(data.measure.name, measures[index]);

            equal(tuple.members[0].name, templateTuple.members[0].name);
            equal(tuple.members[1].name, templateTuple.members[1].name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid passes a measure along with the row tuple", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "measure 1", children: [] } ] },
            { members: [ { name: "dim 0", levelNum: "0", children: [] }, { name: "measure 2", children: [] } ] }
        ];

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var index = indexes.shift();

            var tuple = tuples[index];
            var templateTuple = data.rowTuple;

            equal(data.measure.name, measures[index]);

            equal(tuple.members[0].name, templateTuple.members[0].name);
            equal(tuple.members[1].name, templateTuple.members[1].name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid pass column measure to dataCellTemplate", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var measure = measures[indexes.shift()];
            equal(measure, data.measure.name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid pass row measure to dataCellTemplate", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var measure = measures[indexes.shift()];

            equal(measure, data.measure.name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid renders k-grid-footer class to the row representing 'Grand Total'", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] } ] }
        ];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");

        ok(!rows.eq(0).hasClass("k-grid-footer"));
        ok(rows.eq(1).hasClass("k-grid-footer"));
    });

    test("PivotGrid renders k-grid-footer class to all 'Grand Total' rows", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0_1", levelNum: "2", children: [] } ] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSourceRows(tuples, data)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");

        ok(!rows.eq(0).hasClass("k-grid-footer"));
        ok(rows.eq(1).hasClass("k-grid-footer"));
        ok(rows.eq(2).hasClass("k-grid-footer"));
    });

    test("PivotGrid renders k-alt class to 'Grand Total' cells", function() {
        var tuples = [
            { members: [ { name: "dim 0", levelNum: "0", children: [] } ] },
            { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", children: [] } ] },
            { members: [ { name: "dim 0_2", parentName: "dim 0_1", levelNum: "2", children: [] } ] }
        ];

        var data = [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cells = rows.eq(0).find("td");

        ok(!cells.eq(0).hasClass("k-alt"));
        ok(cells.eq(1).hasClass("k-alt"));
        ok(cells.eq(2).hasClass("k-alt"));
    });

    test("PivotGrid pass column measure to dataCellTemplate", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var measure = measures[indexes.shift()];
            equal(measure, data.measure.name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid pass column measure to dataCellTemplate", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var indexes = [0, 1];

        window.checkTuple = function (data) {
            var measure = measures[indexes.shift()];
            equal(measure, data.measure.name);
        };

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures),
            dataCellTemplate: "#checkTuple(data)#"
        });

        window.checkTuple = null;
    });

    test("PivotGrid renders kpi open-status icon for Status measure", 2, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "status"
        }];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-open"));
        equal(icon.text(), "1");
    });

    test("PivotGrid renders kpi hold-status icon for Status measure", 2, function() {
        var tuples = [
            { members: [ { name: "dim 0", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "status"
        }];

        var data = [
            { value: 0 }
        ];

        var pivotgrid = createPivot({
            dataSource: new PivotDataSource({
                columns: ["dim 0"],
                measures: measures,
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: {
                                columns: {
                                    tuples: tuples
                                }
                            },
                            data: data
                        });
                    }
                }
            })
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-hold"));
        equal(icon.text(), "0");
    });

    test("PivotGrid renders kpi denied-status icon for Status measure", 2, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "status"
        }];

        var data = [
            { value: -1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-denied"));
        equal(icon.text(), "-1");
    });

    test("PivotGrid renders kpi increase-trend icon for Trend measure", 2, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "trend"
        }];

        var data = [
            { value: 1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-increase"));
        equal(icon.text(), "1");
    });

    test("PivotGrid renders kpi equal-trend icon for Trend measure", 2, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "trend"
        }];

        var data = [
            { value: 0 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-equal"));
        equal(icon.text(), "0");
    });

    test("PivotGrid renders kpi decrease-trend icon for Trend measure", 2, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "trend"
        }];

        var data = [
            { value: -1 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(icon.hasClass("k-i-kpi-decrease"));
        equal(icon.text(), "-1");
    });

    test("PivotGrid does not render status icon if no value", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = [{
            name: "measure 1",
            type: "trend"
        }];

        var data = [
            { value: "" }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);
        var icon = cell.children(":first");

        ok(!icon[0]);
    });

    test("PivotGrid renders data correctly when start from specific tuple", function() {
        var columns = [
            { members: [ { name: "dim 1_1", levelNum: "1", parentName: "dim 0", hasChildren: true, children: [] }, { name: "dim 2_1", levelNum: "1", parentName: "dim 2", children: [] } ] },
            { members: [ { name: "dim 1_2", levelNum: "2", parentName: "dim 1_1", children: [] }, { name: "dim 2_1", levelNum: "1", parentName: "dim 2", children: [] } ] }
        ];

        var rows = [
            { members: [ { name: "dim 3", levelNum: "0", hasChildren: true, children: [] } ] },
            { members: [ { name: "dim 3_1", levelNum: "1", parentName: "dim 3", children: [] } ] }
        ];

        var data = [
            { value: 1 }, { value: 2 },
            { value: 3 }, { value: 4 }
        ];

        var pivotgrid = createPivot({
            dataSource: new PivotDataSource({
                columns: [
                    { name: "dim 1_1", expand: true },
                    { name: "dim 2_1", expand: false }
                ],
                rows: [
                    { name: "dim 3", expand: true }
                ],
                measures: [],
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: {
                                columns: { tuples: columns },
                                rows: { tuples: rows }
                            },
                            data: data
                        });
                    }
                }
            })
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cells_0 = rows.eq(0).find("td");
        var cells_1 = rows.eq(1).find("td");

        equal(cells_0.eq(0).text(), "4");
        equal(cells_0.eq(1).text(), "3");

        equal(cells_1.eq(0).text(), "2");
        equal(cells_1.eq(1).text(), "1");
    });

    module("PivotGrid resize on render", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    test("PivotGrid sets width bigger than 100 percents if content table is wider than pivot", function() {
        var tuples = [{ members: [ { name: "dim 0", levelNum: "0", children: [] }] }];
        var data = [];

        for (var idx = 0; idx < 100; idx++) {
            tuples.push({ members: [ { name: "tuple " + idx, parentName: "dim 0", levelNum: "1", children: [] }] });
            data.push(idx);
        }

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var headerTable = pivotgrid.wrapper.find(".k-grid-header").find("table");
        var contentTable = pivotgrid.wrapper.find(".k-grid-content").find("table");

        contentTable.wrap("<div/>");

        pivotgrid.refresh();

        ok(parseInt(headerTable.css("width")) > 100);
        ok(parseInt(contentTable.css("width")) > 100);
    });

    test("PivotGrid sets height to the column header if rows-field section is higher", function() {
        var pivotgrid = createPivot({
            dataSource: createDataSource()
        });

        var columnHeaderWrap = pivotgrid.wrapper.find(".k-grid-header-wrap");
        var rowsField = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-header:last");

        equal(rowsField.innerHeight(), columnHeaderWrap.height());
    });

    test("PivotGrid sets height to the measure-fields section if column descriptors", function() {
        var pivotgrid = createPivot({
            dataSource: createDataSource()
        });

        var measureFields = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("div:first");
        var columnFields = pivotgrid.wrapper.find(".k-pivot-table").find("div:first");

        columnFields.height("100px");

        pivotgrid.refresh();

        equal(measureFields.height(), columnFields.height());
    });

    test("PivotGrid sets height to the column-fields section if measures", function() {
        var pivotgrid = createPivot({
            dataSource: createDataSource()
        });

        var measureFields = pivotgrid.wrapper.find(".k-pivot-rowheaders").find("div:first");
        var columnFields = pivotgrid.wrapper.find(".k-pivot-table").find("div:first");

        measureFields.height("100px");

        pivotgrid.refresh();

        equal(columnFields.height(), measureFields.height());
    });

    test("PivotGrid sets height of rows header", function() {
        var pivotgrid = createPivot({
            dataSource: createDataSource()
        });

        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        content.height("100px");

        pivotgrid.refresh();

        equal(rowsHeader.height(), content.height());
    });

    test("PivotGrid sets height of rows header when height option is defined", function() {
        var pivotgrid = createPivot({
            height: 200,
            dataSource: createDataSource()
        });

        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        equal(pivotgrid.wrapper.height(), 200);
        equal(rowsHeader.height(), content.height());
    });

    test("PivotGrid supports string height option value", function() {
        var pivotgrid = createPivot({
            height: "200px",
            dataSource: createDataSource()
        });

        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        equal(pivotgrid.wrapper.height(), 200);
        equal(rowsHeader.height(), content.height());
    });

    test("PivotGrid sets 'auto' heigth to the content when options.height is not defined", function() {
        var tuples = [
            [
                { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] }
            ],
            [
                { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] },
                { members: [ { name: "dim 0_4", parentName: "dim 0_1", levelNum: "2", children: [] }] },
                { members: [ { name: "dim 0_5", parentName: "dim 0_1", levelNum: "2", children: [] }] },
                { members: [ { name: "dim 0_6", parentName: "dim 0_1", levelNum: "2", children: [] }] },
                { members: [ { name: "dim 0_7", parentName: "dim 0_1", levelNum: "2", children: [] }] }
            ]
        ];

        var data = [
            [
                { value: 1 },
                { value: 2 }
            ], [
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 },
                { value: 6 },
            ]
        ];

        var pivotgrid = createPivot({
            dataSource: {
                measures: [],
                schema: {
                    axes: "axes",
                    data: "data"
                },
                transport: {
                    read: function(options) {
                        options.success({
                            axes: {
                                rows: {
                                    tuples: tuples.shift()
                                }
                            },
                            data: data.shift()
                        });
                    }
                }
            }
        });

        var content = pivotgrid.wrapper.find(".k-grid-content");

        var initial = content.height();

        pivotgrid.dataSource.expandRow("dim 0_1");

        ok(content.height() > initial);
    });

    test("PivotGrid sets calculates inner height based on parent when height is 100%", function() {
        var height = 500;

        $(div).wrap('<div style="height: ' + height + 'px"></div>');

        var pivotgrid = createPivot({
            height: "100%",
            dataSource: {
                measures: [],
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
                                        { members: [ { name: "dim 0", levelNum: "0", hasChildren: true, children: [] }] },
                                        { members: [ { name: "dim 0_1", parentName: "dim 0", levelNum: "1", hasChildren: true, children: [] }] }
                                    ]
                                }
                            },
                            data: [
                                { value: 1 },
                                { value: 2 }
                            ]
                        });
                    }
                }
            }
        });

        equal(pivotgrid.wrapper.innerHeight(), 500);
    });

    test("PivotGrid sets min height if height value is lower than scrollbar width", function() {
        var pivotgrid = createPivot({
            height: 10,
            dataSource: createDataSource()
        });

        var scrollbar = kendo.support.scrollbar();
        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        scrollbar = (scrollbar * 2 + 1);

        equal(content.height(), scrollbar);
    });

    test("PivotGrid sets heights to 3 scrollbar width if horizontal scollbar is visible", function() {
        var tuples = [{ members: [ { name: "dim 0", levelNum: "0", children: [] }] }];
        var data = [];

        for (var idx = 0; idx < 100; idx++) {
            tuples.push({ members: [ { name: "tuple " + idx, parentName: "dim 0", levelNum: "1", children: [] }] });
            data.push(idx);
        }

        var pivotgrid = createPivot({
            height: 10,
            dataSource: createDataSource(tuples, data)
        });

        var scrollbar = kendo.support.scrollbar();
        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        scrollbar = (scrollbar * 3 + 1);

        equal(content.height(), scrollbar);
    });

    test("PivotGrid sets height of rows header without scrollbar if horizontal content scrollbar", function() {
        var tuples = [{ members: [ { name: "dim 0", levelNum: "0", children: [] }] }];
        var data = [];

        for (var idx = 0; idx < 100; idx++) {
            tuples.push({ members: [ { name: "tuple " + idx, parentName: "dim 0", levelNum: "1", children: [] }] });
            data.push(idx);
        }

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data)
        });

        var content = pivotgrid.wrapper.find(".k-grid-content");
        var rowsHeader = pivotgrid.wrapper.find(".k-pivot-rowheaders").find(".k-grid");

        content.height("100px");

        pivotgrid.refresh();

        equal(rowsHeader.height(), content.height() - kendo.support.scrollbar());
    });

    test("PivotGrid sets padding of .k-grid-header element", function() {
        var pivotgrid = createPivot({
            dataSource: createDataSource()
        });

        var columnHeader = pivotgrid.wrapper.find(".k-grid-header");

        equal(columnHeader.css("padding-right"), kendo.support.scrollbar() + "px");
    });

    test("PivotGrid sets width of measures and row fields if row header table is empty", function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] },
            { members: [ { name: "measure 2", children: [] } ] },
        ]

        var measures = [ "measure 1", "measure 2"];

        var data = [
            { value: 1 },
            { value: 2 }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });


        var leftColumn = pivotgrid.wrapper.find(".k-pivot-rowheaders");

        var table = leftColumn.find("table");
        var measures = leftColumn.find(".k-settings-measures");
        var rowFields = leftColumn.find(".k-settings-rows");

        equal(measures.width(), rowFields.width());
    });

    test("PivotGrid renders nbsp if no data value", 1, function() {
        var tuples = [
            { members: [ { name: "measure 1", children: [] } ] }
        ]

        var measures = ["measure 1"];

        var data = [
            { value: "" }
        ];

        var pivotgrid = createPivot({
            dataSource: createDataSource(tuples, data, measures)
        });

        var rows = pivotgrid.wrapper.find(".k-grid-content").find("tbody").find("tr");
        var cell = rows.eq(0).find("td").eq(0);

        equal(cell.html(), "&nbsp;");
    });
})();
