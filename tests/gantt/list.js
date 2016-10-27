﻿(function() {

    var GanttList = kendo.ui.GanttList;
    var GanttDataSource = kendo.data.GanttDataSource;
    var dataSource;
    var ganttList;
    var taskTree;
    var element;
    var columns;
    var paddingStep = 26;

    function equalWithRound(value, expected) {
        QUnit.close(value, expected, 3);
    }

    module("Gantt List", {
        setup: function() {
            element = $("<div/>");
            dataSource = new GanttDataSource();
        },
        teardown: function() {
            ganttList.destroy();
        }
    });

    test("add default title column", 2, function() {
        ganttList = new GanttList(element, { columns: [], dataSource: dataSource });

        equal(ganttList.options.columns.length, 1);
        equal(ganttList.options.columns[0], "title");
    });

    test("creates column from options", 5, function() {
        ganttList = new GanttList(element, {
            columns: [{
                field: "end",
                editable: true,
                title: "My End Time",
                sortable: true
            }],
            dataSource: dataSource
        });

        equal(ganttList.columns.length, 1);
        equal(ganttList.columns[0].field, "end");
        equal(ganttList.columns[0].title, "My End Time");
        ok(ganttList.columns[0].sortable);
        ok(ganttList.columns[0].editable);
    });

    test("creates column with default values from string", 4, function() {
        ganttList = new GanttList(element, {
            columns: ["end"],
            dataSource: dataSource
        });

        equal(ganttList.columns[0].field, "end");
        equal(ganttList.columns[0].title, "End Time");
        ok(!ganttList.columns[0].sortable);
        ok(!ganttList.columns[0].editable);
    });

    test("adds css classes to wrapper", function() {
        ganttList = new GanttList(element, { columns: [], dataSource: dataSource });

        ok(ganttList.element.hasClass("k-widget"));
        ok(ganttList.element.hasClass("k-grid"));
        ok(ganttList.element.hasClass("k-treelist"));
    });

    test("renders header's wrapping div", function() {
        ganttList = new GanttList(element, { columns: [], dataSource: dataSource });
        var wrapper = ganttList.element;

        equal(wrapper.children(".k-grid-header").length, 1);

    });

    test("renders header's inner wrapping div", function() {
        ganttList = new GanttList(element, { columns: [], dataSource: dataSource });
        var wrapper = ganttList.element;

        equal(wrapper.find(".k-grid-header-wrap").length, 1);

    });

    test("renders content's wrapping div", function() {
        ganttList = new GanttList(element, { columns: [], dataSource: dataSource });
        var wrapper = ganttList.element;

        equal(wrapper.children(".k-grid-content").length, 1);

    });

    module("Gantt List header renders", {
        setup: function() {
            jasmine.clock().install();
            element = $("<div/>");

            columns = [
                { field: "title", title: "Title", sortable: false },
                { field: "start", title: "Start Time", sortable: true, width: 150 },
                { field: "end", title: "End Time", sortable: true, width: 150 },
                { field: "percentComplete", title: "Task Percentage" }
            ];

            dataSource = new GanttDataSource();

            ganttList = new GanttList(element, { columns: columns, dataSource: dataSource, listWidth: 500 });
        },
        teardown: function() {
            jasmine.clock().uninstall();
            ganttList.destroy();
        }
    });

    test("table element", function() {
        var header = ganttList.header;

        equal(header.children("table").length, 1);
    });

    test("table element min-width", function() {
        var header = ganttList.header;

        equal(parseInt(header.children("table").css("min-width")), ganttList.options.listWidth);
    });

    test("table element role", function() {
        var header = ganttList.header;

        equal(header.children("table").attr("role"), "grid");
    });

    test("table colgroup", function() {
        var header = ganttList.header;

        equal(header.find("colgroup").length, 1);
    });

    test("table head", function() {
        var header = ganttList.header;

        equal(header.find("thead").length, 1);
    });

    test("table head role", function() {
        var header = ganttList.header;

        equal(header.find("thead").attr("role"), "rowgroup");
    });

    test("table col elements for each column", function() {
        var header = ganttList.header;

        equal(header.find("col").length, ganttList.columns.length);
    });

    test("table col elements with style attr when column width set", 4, function() {
        var header = ganttList.header;
        var cols = header.find("col");

        ok(!cols.eq(0).attr("style"));
        ok(cols.eq(1).attr("style"));
        ok(cols.eq(2).attr("style"));
        ok(!cols.eq(3).attr("style"));
    });

    test("table head row", function() {
        var header = ganttList.header;

        equal(header.find("thead > tr").length, 1);
        equal(header.find("thead > tr").attr("role"), "row");
    });

    test("table th elements for each column", function() {
        var header = ganttList.header;

        equal(header.find("th").length, ganttList.columns.length);
    });

    test("table th element class", 4, function() {
        var header = ganttList.header;
        var test = function(idx, th) {
            ok($(th).hasClass("k-header"));
        };

        header.find("th").each(test);
    });

    test("table th elements data attr for each column", function() {
        var header = ganttList.header;
        var test = function(idx, th) {
            th = $(th);
            equal(th.attr("data-field"), ganttList.columns[idx].field);
            equal(th.attr("data-title"), ganttList.columns[idx].title);
        };

        header.find("th").each(test);
    });

    test("table th elements role", function() {
        var header = ganttList.header;
        var test = function(idx, th) {
            equal($(th).attr("role"), "columnheader");
        };

        header.find("th").each(test);
    });

    test("table th elements sorter attr for sortable column", 4, function() {
        var header = ganttList.header;
        var ths = header.find("th");
        var column;

        for (var idx = 0; idx < ganttList.columns.length; idx++) {
            column = ganttList.columns[idx];
            if (column.sortable) {
                equal(ths.eq(idx).attr("data-role"), "columnsorter");
            } else {
                ok(!ths.eq(idx).attr("data-role"));
            }
        }
    });

    module("Gantt List content renders", {
        setup: function() {
            jasmine.clock().install();
            element = $("div");

            columns = [
                { field: "title", title: "Title", sortable: false },
                { field: "start", title: "Start Time", sortable: true, width: 150 },
                { field: "end", title: "End Time", sortable: true, width: "150px" },
                { field: "percentComplete", title: "Task Percentage" }
            ];

            dataSource = new GanttDataSource({
                data: [
                { title: "Task1", parentId: null, id: 1, summary: true, expanded: true },
                    { title: "Child 1.1", parentId: 1, id: 2, summary: true, expanded: true },
                        { title: "Child 1.1.1", parentId: 2, id: 3, summary: false },
                        { title: "Child 1.1.2", parentId: 2, id: 4, summary: true, expanded: true },
                            { title: "Child 1.1.2.1", parentId: 4, id: 11 },
                    { title: "Child 1.2", parentId: 1, id: 5, summary: false },
                    { title: "Child 1.3", parentId: 1, id: 6, summary: false },
                { title: "Task2", parentId: null, id: 7, summary: true, expanded: true },
                    { title: "Child 2.1", parentId: 7, id: 8, summary: false },
                    { title: "Child 2.2", parentId: 7, id: 9, summary: false },
                    { title: "Child 2.3", parentId: 7, id: 10, summary: false },
                { title: "Task3", parentId: null, id: 11, summary: true, expanded: false },
                    { title: "Child 3.1", parentId: 11, id: 12, summary: false }
                ],
                schema: {
                    model: {
                        id: "id"
                    }
                }
            });

            dataSource.fetch();
            taskTree = dataSource.taskTree();

            ganttList = new GanttList(element, { columns: columns, dataSource: dataSource, listWidth: 500 });
            ganttList._render(taskTree);
        },
        teardown: function() {
            jasmine.clock().uninstall();
            ganttList.destroy();
        }
    });

    test("table element", function() {
        var content = ganttList.content;

        equal(content.children("table").length, 1);
    });

    test("table element min-width", function() {
        var content = ganttList.content;

        equal(parseInt(content.children("table").css("min-width")), ganttList.options.listWidth);
    });

    test("table element role", function() {
        var content = ganttList.content;

        equal(content.children("table").attr("role"), "treegrid");
    });

    test("table colgroup", function() {
        var content = ganttList.content;

        equal(content.find("colgroup").length, 1);
    });

    test("table col elements for each column", function() {
        var content = ganttList.content;

        equal(content.find("col").length, ganttList.columns.length);
    });

    test("table col elements with style attr when column width set", 4, function() {
        var content = ganttList.content;
        var cols = content.find("col");

        ok(!cols.eq(0).attr("style"));
        ok(cols.eq(1).attr("style"));
        ok(cols.eq(2).attr("style"));
        ok(!cols.eq(3).attr("style"));
    });

    test("table col elements width set", function() {
        var content = ganttList.content;
        var cols = content.find("col");

        equal(cols.eq(1).width(), 150);
        equal(cols.eq(2).width(), 150);
    });

    test("table body", function() {
        var content = ganttList.content;

        equal(content.find("tbody").length, 1);
    });

    test("table body role", function() {
        var content = ganttList.content;

        equal(content.find("tbody").attr("role"), "rowgroup");
    });

    test("table tr elements for each visible task", function() {
        var content = ganttList.content;

        equal(content.find("tr").length, dataSource.taskTree().length);
    });

    test("table tr elements attr", function() {
        var content = ganttList.content;
        var test = function(idx, tr) {
            tr = $(tr);
            var task = taskTree[idx];
            var level = dataSource.taskLevel(task);
            equal(tr.attr("data-uid"), task.get("uid"));
            equal(parseInt(tr.attr("data-level")), level);
            equal(tr.attr("role"), "row");
        };

        content.find("tr").each(test);
    });

    test("table tr aria-expanded for summary rows", function() {
        var content = ganttList.content;
        var test = function(idx, tr) {
            var task = taskTree[idx];
            tr = $(tr);

            if (task.summary) {
                equal(tr.attr("aria-expanded"), task.expanded.toString());
            } else {
                ok(!tr.attr("aria-expanded"));
            }
        };

        content.find("tr").each(test);
    });

    test("table even tr elements style", function() {
        var content = ganttList.content;
        var test = function(idx, tr) {
            tr = $(tr);
            if (idx % 2 !== 0) {
                ok(tr.hasClass("k-alt"));
            }
        };

        content.find("tr").each(test);
    });

    test("table summary tr elements style", function() {
        var content = ganttList.content;
        var test = function(idx, tr) {
            tr = $(tr);

            if (taskTree[idx].get("summary")) {
                ok(tr.hasClass("k-treelist-group"));
            } else {
                ok(!tr.hasClass("k-treelist-group"));
            }
        };

        content.find("tr").each(test);
    })

    test("table td elements for each column", function() {
        var content = ganttList.content;

        equal(content.find("tr").eq(0).children("td").length, columns.length);
    });

    test("table td role", function() {
        var content = ganttList.content;
        var test = function(idx, td) {
            equal($(td).attr("role"), "gridcell");
        };

        content.find("td").each(test);
    });

    test("table td element with span as text container", function() {
        var content = ganttList.content;
        var test = function(idx, td) {
            ok($(td).children("span:not(.k-icon)").length);
        };
        content.find("tr").eq(0).children("td").each(test);
    });

    test("table td element with icon-span for title column", function() {
        var content = ganttList.content;
        var span = content.find("tr").eq(0).children("td").eq(0).children("span");

        equal(span.length, 2);
        ok(span.eq(0).hasClass("k-icon"));
    });

    test("table td element with span placeholders for title column", function() {
        var content = ganttList.content;
        var test = function(idx, tr) {
            tr = $(tr);
            var td = tr.children("td").eq(0);
            var task = taskTree[idx];
            var level = dataSource.taskLevel(task);

            equal(td.children("span.k-i-none").length, task.summary ? level : level + 1);
        };

        content.find("tr").each(test);
    });

    test("table td element with span with collapse icon expanded summary tasks", function() {
        var content = ganttList.content;
        var span = content.find("tr").eq(0)
            .children("td").eq(0).children("span.k-icon");

        ok(span.hasClass("k-i-collapse"));
    });

    test("table td element with span with expand icon collapsed summary tasks", function() {
        var content = ganttList.content;
        var span = content.find("tr").eq(11)
            .children("td").eq(0).children("span.k-icon");

        ok(span.hasClass("k-i-expand"));
    });

    function setupGantt(options) {
        columns = [
            { field: "title", title: "Title", sortable: false }
        ];

        dataSource = new GanttDataSource({
            data: [
                { title: "Task1", parentId: null, id: 1 },
                { title: "Task2", parentId: null, id: 7 },
                { title: "Task3", parentId: null, id: 11 },
            ],
            schema: {
                model: {
                    id: "id"
                }
            }
        });

        dataSource.fetch();
        taskTree = dataSource.taskTree();

        ganttList = new GanttList(element, $.extend({
            columns: columns,
            dataSource: dataSource,
            listWidth: 500,
            rowHeight: 100
        }, options));
        ganttList._render(taskTree);
    }

    module("Gantt List rowHeight content", {
        setup: function() {
            jasmine.clock().install();
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            jasmine.clock().uninstall();
            ganttList.destroy();
            element.remove();
        }
    });

    test("renders inline height to table element", function() {
        setupGantt();

        ok(ganttList.content.find("table").attr("style").match("height"));
    });

    test("renders correct height when rowHeight set in pixels", function() {
        setupGantt({ rowHeight: "100px" });

        var height = ganttList.content.find("tr").outerHeight();
        var count = dataSource.total();
        var totalHeight = height * count;

        equal(ganttList.content.find("table").height(), totalHeight);
    });

    test("renders correct height when rowHeight set in ems", function() {
        setupGantt({ rowHeight: "5em" });

        var height = ganttList.content.find("tr").outerHeight();
        var count = dataSource.total();
        var totalHeight = height * count;

        equal(ganttList.content.find("table").height(), totalHeight);
    });

    test("renders correct height when rowHeight set in pt", function() {
        setupGantt({ rowHeight: "70pt" });

        var height = ganttList.content.find("tr").outerHeight();
        var count = dataSource.total();
        var totalHeight = height * count;

        equalWithRound(ganttList.content.find("table").height(), totalHeight);
    });

})();
