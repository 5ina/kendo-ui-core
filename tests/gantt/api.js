﻿(function() {
    var element;
    var gantt;
    var ganttTimeline;
    var ganttList;
    var tasks;
    var dependencies;
    var Gantt = kendo.ui.Gantt;
    var GanttTask = kendo.data.GanttTask;
    var GanttList = kendo.ui.GanttList;
    var GanttDataSource = kendo.data.GanttDataSource;
    var GanttDependencyDataSource = kendo.data.GanttDependencyDataSource;
    var setupGanttList = function(options) {
        var dataSource = setupDataSource(options.data);
        ganttList = new GanttList(element, {
            columns: options.columns,
            dataSource: dataSource
        });

        dataSource.fetch();
        ganttList._render(dataSource.taskTree());
    };
    var setupGantt = function(options) {
        var dataSource = setupDataSource(options.data || []);
        var dependencies = setupDependencyDataSource(options.dependencies || []);

        gantt = new Gantt(element, {
            editable: { confirmation: false },
            columns: options.columns,
            dataSource: dataSource,
            dependencies: dependencies,
            showWorkDays: false
        });

        ganttList = gantt.list;
    };
    var setupDataSource = function(data) {
        return new GanttDataSource({
            data: data,
            schema: {
                model: {
                    id: "id"
                }
            }
        });
    };
    var setupDependencyDataSource = function(data) {
        return new GanttDependencyDataSource({
            data: data,
            schema: {
                model: {
                    id: "id"
                }
            }
        });
    };

    module("Gantt", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            gantt.destroy();
            kendo.destroy(element);
            element.remove();
            gantt = null;
        }
    });

    test("select(':selector') calls list's select method with argument", function() {
        setupGantt({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(ganttList, {
            select: function(value) {
                ok(value);
            }
        });

        gantt.select("tr:first");
    });

    test("select() calls list's select method with no argument", function() {
        setupGantt({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(ganttList, {
            select: function(value) {
                ok(!value);
            }
        });

        gantt.select();
    });

    test("clearSelection() calls list's clearSelection()", function() {
        setupGantt({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(ganttList, "clearSelection");

        gantt.clearSelection();

        ok(ganttList.calls("clearSelection"));
    });

    test("view('name') calls timeline's view method", function() {
        gantt = new Gantt(element);

        stub(gantt.timeline, "view");

        gantt.view("week");

        ok(gantt.timeline.calls("view"));
    });

    test("range('range') calls timeline's view method", function () {
        gantt = new Gantt(element);

        stub(gantt.timeline, "_render");

        var range = {
            start: new Date("2014/01/16"),
            end: new Date("2014/09/17 10:00")
        };

        gantt.range(range);

        ok(gantt.timeline.calls("_render"));
    });

    test("range() returns the range of the timeline's view", 2, function () {
        gantt = new Gantt(element);

        stub(gantt.timeline, "_render");

        var range = gantt.range();

        equal(range.start, gantt.view().start);
        equal(range.end, gantt.view().end);
    });

    test("range() returns the range of the timeline's view with custom start and end", 2, function () {
        gantt = new Gantt(element);
        gantt.options.range = {
            start: new Date("2014/01/16"),
            end: new Date("2014/09/17 10:00")
        };

        stub(gantt.timeline, "_render");

        var range = gantt.range();

        equal(range.start, gantt.view().start);
        equal(range.end, gantt.view().end);
    });

    test("removeTask() triggers remove event", 1, function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        gantt.bind("remove", function() {
            ok(true);
        });

        gantt.removeTask(gantt.dataSource.at(0));
    });

    test("removeTask() calls dataSource remove method", function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(gantt.dataSource, "remove");

        gantt.removeTask(gantt.dataSource.at(0));

        ok(gantt.dataSource.calls("remove"));
    });

    test("removeTask() calls dataSource remove method with argument", 1, function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(gantt.dataSource, {
            remove: function(task) {
                equal(task.title, "foo");
            }
        });

        gantt.removeTask(gantt.dataSource.at(0));
    });

    test("removeTask() calls dataSource remove method with argument when uid passed as argument", 1, function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        stub(gantt.dataSource, {
            remove: function(task) {
                equal(task.title, "foo");
            }
        });

        gantt.removeTask(gantt.dataSource.at(0).uid);
    });

    test("removeTask() canceling remove event prevents calling dataSource remove method", 1, function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        gantt.bind("remove", function(e) {
            e.preventDefault();
        });

        stub(gantt.dataSource, "remove");

        gantt.removeTask(gantt.dataSource.at(0));

        ok(!gantt.dataSource.calls("remove"));
    });

    test("removeTask() deletes related dependency when task is predecessor", function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ],
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 3, successorId: 4, type: 2 }
            ]
        });

        gantt.removeTask(gantt.dataSource.at(0));

        equal(gantt.dependencies.total(), 1);
    });

    test("removeTask() deletes related dependency when task is successor", function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ],
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 3, successorId: 4, type: 2 }
            ]
        });

        gantt.removeTask(gantt.dataSource.at(1));

        equal(gantt.dependencies.total(), 1);
    });

    test("removeTask() deletes multiple related dependencies", function() {
        setupGantt({
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ],
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 3, type: 2 },
                { id: 3, predecessorId: 3, successorId: 4, type: 2 }
            ]
        });

        gantt.removeTask(gantt.dataSource.at(1));

        equal(gantt.dependencies.total(), 1);
    });

    test("removeDependency() triggers remove event", 1, function() {
        setupGantt({
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 4, type: 2 }
            ]
        });

        gantt.bind("remove", function() {
            ok(true);
        });

        gantt.removeDependency(gantt.dependencies.at(0));
    });

    test("removeDependency() calls dataSource remove method", 1, function() {
        setupGantt({
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 4, type: 2 }
            ]
        });

        stub(gantt.dependencies, "remove");

        gantt.removeDependency(gantt.dependencies.at(0));

        ok(gantt.dependencies.calls("remove"));
    });

    test("removeDependency() calls dataSource remove method with argument", 1, function() {
        setupGantt({
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 4, type: 2 }
            ]
        });

        stub(gantt.dependencies, {
            remove: function(dependency) {
                equal(dependency.id, 1);
            }
        });

        gantt.removeDependency(gantt.dependencies.at(0));
    });

    test("removeDependency() calls dataSource remove method with argument when uid passed as argument", 1, function() {
        setupGantt({
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 4, type: 2 }
            ]
        });

        stub(gantt.dependencies, {
            remove: function(dependency) {
                equal(dependency.id, 1);
            }
        });

        gantt.removeDependency(gantt.dependencies.at(0).uid);
    });

    test("removeDependency() canceling remove event prevents calling dataSource remove method", 1, function() {
        setupGantt({
            dependencies: [
                { id: 1, predecessorId: 1, successorId: 2, type: 0 },
                { id: 2, predecessorId: 2, successorId: 4, type: 2 }
            ]
        });

        gantt.bind("remove", function(e) {
            e.preventDefault();
        });

        stub(gantt.dependencies, "remove");

        gantt.removeDependency(gantt.dependencies.at(0));

        ok(!gantt.dependencies.calls("remove"));
    });

    module("GanttList", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            ganttList.destroy();
            kendo.destroy(element);
            element.remove();
            ganttList = null;
        }
    });

    test("select(':selector') applies selected class to element", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.select("tr:first");

        ok(ganttList.content.find("tr:first").hasClass("k-state-selected"));
    });

    test("select(':selector') triggers change event", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.bind("change", function() {
            ok(true);
        });
        ganttList.select("tr:first");
    });

    test("select(':selector') removes selected class from previously selected element", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });
        var target = ganttList.content.find("tr:last")
            .addClass("k-state-selected");

        ganttList.select("tr:first");

        ok(!target.hasClass("k-state-selected"));
    });

    test("select() retrieves selected element", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        var target = ganttList.content.find("tr:first").addClass("k-state-selected");
        var selected = ganttList.select();

        equal(selected.length, 1);
        equal(selected[0], target[0]);
    });

    test("select() does not trigger change event", function() {
        var flag = false;
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.bind("change", function() {
            flag = true;
        });
        ganttList.select();

        ok(!flag);
    });

    test("clearSelection() removes selected class from element", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.select("tr:first");
        ganttList.clearSelection();

        ok(!ganttList.content.find("tr:first").hasClass("k-state-selected"));
    });

    test("clearSelection() triggers change event when deselecting items", function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.select("tr:first");

        ganttList.bind("change", function() {
            ok(true);
        });
        ganttList.clearSelection();
    });

    test("clearSelection() does not trigger the change event if no item is selected", 0, function() {
        setupGanttList({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        ganttList.bind("change", function() {
            ok(false);
        });
        ganttList.clearSelection();
    });

    module("GanttTimeline", {
        setup: function() {
            element = $("<div />");
            gantt = new Gantt(element);
            ganttTimeline = gantt.timeline;
            tasks = [new GanttTask({
                id: 1,
                uid: "UniqueId1",
                start: new Date("2014/04/15"),
                end: new Date("2014/04/16")
            }), new GanttTask({
                id: 2,
                uid: "UniqueId2",
                start: new Date("2014/04/16"),
                end: new Date("2014/04/17")
            }), new GanttTask({
                id: 3,
                uid: "UniqueId3",
                start: new Date("2014/04/16"),
                end: new Date("2014/04/17")
            })];
            dependencies = [{
                uid: "DependencyUniqueId1",
                predecessorId: 1,
                successorId: 2,
                type: 1
            }, {
                uid: "DependencyUniqueId2",
                predecessorId: 2,
                successorId: 3,
                type: 1
            }];
        },
        teardown: function() {
            gantt.destroy();

            kendo.destroy(element);
        }
    });

    test("select(':selector') applies selected class to element", function() {
        ganttTimeline._render(tasks);

        ganttTimeline.select(".k-task:first");

        ok(ganttTimeline.wrapper.find(".k-task:first").hasClass("k-state-selected"));
    });

    test("select(':selector') removes selected class from previously selected element", function() {
        ganttTimeline._render(tasks);

        ganttTimeline.wrapper.find(".k-task:last").addClass("k-state-selected");
        ganttTimeline.select(".k-task:first");

        ok(!ganttTimeline.wrapper.find(".k-task:last").hasClass("k-state-selected"));
    });
    
    test("select() retrieves selected element", function() {
        ganttTimeline._render(tasks);

        var target = ganttTimeline.wrapper.find(".k-task:first").addClass("k-state-selected");

        var selected = ganttTimeline.select();

        equal(selected.length, 1);
        equal(selected[0], target[0]);
    });

    test("selectDependency() applies selected class to elements", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        ganttTimeline.selectDependency(".k-line:first");

        ok(ganttTimeline.wrapper.find(".k-line[data-uid='DependencyUniqueId1']").hasClass("k-state-selected"));
    });

    test("selectDependency() doesn't apply selected class to other dependencies elements", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        ganttTimeline.selectDependency(".k-line:first");

        ok(!ganttTimeline.wrapper.find(".k-line[data-uid='DependencyUniqueId2']").hasClass("k-state-selected"));
    });

    test("selectDependency() retrieves selected elements", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        var targets = ganttTimeline.wrapper.find(".k-line[data-uid='DependencyUniqueId2']");

        ganttTimeline.selectDependency(targets[0]);

        var selected = ganttTimeline.selectDependency();

        equal(selected.length, 5);
        equal(selected[0], targets[0]);
        equal(selected[1], targets[1]);
        equal(selected[2], targets[2]);
        equal(selected[3], targets[3]);
        equal(selected[4], targets[4]);
    });

    test("clearSelection() removes selected class from task element", function() {
        ganttTimeline._render(tasks);

        ganttTimeline.wrapper.find(".k-event:last").addClass("k-state-selected");
        ganttTimeline.clearSelection();

        ok(!ganttTimeline.wrapper.find(".k-event:last").hasClass("k-state-selected"));
    });

    test("clearSelection() removes selected class from dependency elements", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        ganttTimeline.wrapper.find(".k-line:last").addClass("k-state-selected");
        ganttTimeline.clearSelection();

        ok(!ganttTimeline.wrapper.find(".k-line:last").hasClass("k-state-selected"));
    });

})();
