﻿(function() {

    var element;
    var gantt;
    var ganttTimeline;
    var ganttList;
    var tasks
    var dependencies;
    var Gantt = kendo.ui.Gantt;
    var GanttTask = kendo.data.GanttTask;
    var GanttList = kendo.ui.GanttList;
    var GanttDataSource = kendo.data.GanttDataSource;
    var data = [
        {
            id: 1,
            parentId: null,
            orderId: 0,
            title: "foo",
            start: new Date("2014/03/31"),
            end: new Date("2014/04/05"),
            summary: true,
            expanded: true
        },
        {
            id: 2,
            parentId: null,
            orderId: 1,
            title: "bar",
            start: new Date("2014/04/02"),
            end: new Date("2014/04/03"),
            summary: false
        },
        {
            id: 3,
            parentId: 1,
            orderId: 0,
            title: "foo.bar",
            start: new Date("2014/03/31"),
            end: new Date("2014/04/02"),
            summary: false
        },
        {
            id: 4,
            parentId: 1,
            orderId: 1,
            title: "foo.foo",
            start: new Date("2014/04/02"),
            end: new Date("2014/04/05"),
            summary: false
        }
    ];
    var dependenciesData = [{
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
    var setup = function(options) {
        var dataSource = setupDataSource(options.data);
        ganttList = new GanttList(element, {
            columns: options.columns,
            dataSource: dataSource
        });

        dataSource.fetch();
        ganttList._render(dataSource.taskTree());
    };
    var setupDataSource = function(data) {
        return new GanttDataSource({
            data: data
        });
    };

    module("Expand / collapse ", {
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

    test("clicking on icon toggles expanded/collapsed model field", 2, function() {
        setup({ columns: [], data: [{ title: "foo", parentId: null, id: 1, summary: true, expanded: true }] })
        var target = ganttList.content.find(".k-icon:not(.k-i-none)").eq(0);

        ok(ganttList.dataSource.at(0).get("expanded"));
        target.click();
        ok(!ganttList.dataSource.at(0).get("expanded"));
    });

    test("dblclick on icon does not enter edit mode", function() {
        setup({ columns: [{ field: "title", editable: true }], data: [{ title: "foo", parentId: null, id: 1, summary: true, expanded: true }] })
        var target = ganttList.content.find(".k-icon:not(.k-i-none)").eq(0);
        var targetCell = ganttList.content.find("td").eq(0);

        tap(target);
        tap(target);

        ok(!targetCell.data("kendoEditable"));
    });

    module("List Selection", {
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

    test("clicking on a tr calls select(':selector')", function() {
        setup({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });

        var target = ganttList.content.find("tr:first");
        stub(ganttList, "select");

        target.click();

        ok(ganttList.calls("select"));
    });

    test("clicking with Ctrl on a tr calls clearSelection()", function() {
        setup({
            columns: [],
            data: [
                { title: "foo", parentId: null, id: 1, summary: false },
                { title: "bar", parentId: null, id: 2, summary: false }
            ]
        });
        var e = new $.Event("click");
        var target = ganttList.content.find("tr:first")
            .addClass(".k-state-selected");

        e.ctrlKey = true;
        stub(ganttList, "clearSelection");
        target.trigger(e);

        ok(ganttList.calls("clearSelection"));
    });

    module("Timeline Interaction", {
        setup: function() {
            element = $("<div />");
            gantt = new Gantt(element);
            ganttTimeline = gantt.timeline;
            tasks = [new GanttTask({
                id: 1,
                start: new Date("2014/04/15"),
                end: new Date("2014/04/16")
            }), new GanttTask({
                id: 2,
                start: new Date("2014/04/16"),
                end: new Date("2014/04/17")
            }), new GanttTask({
                id: 3,
                start: new Date("2014/04/16"),
                end: new Date("2014/04/17")
            })];
            dependencies = dependenciesData;
        },
        teardown: function() {
            gantt.destroy();

            kendo.destroy(element);
        }
    });

    test("clicking on a task calls select(':selector')", function() {
        ganttTimeline._render(tasks);

        var target = ganttTimeline.wrapper.find(".k-task:first");

        stub(gantt, "select");

        target.click();

        ok(gantt.calls("select"));
    });

    test("clicking on a task calls select(':selector') with correct parameter", 1, function() {
        ganttTimeline._render(tasks);

        var target = ganttTimeline.wrapper.find(".k-task:first");

        stub(gantt, {
            select: function(value) {
                equal(value, "[data-uid='" + tasks[0].uid + "']");
            }
        });

        target.click();
    });

    test("clicking with Ctrl on a task calls clearSelection()", function() {
        ganttTimeline._render(tasks);

        var e = new $.Event("click");
        var target = ganttTimeline.wrapper.find(".k-task:first")
            .addClass(".k-state-selected");

        e.ctrlKey = true;
        stub(gantt, "clearSelection");

        target.trigger(e);

        ok(gantt.calls("clearSelection"));
    });

    test("clicking on a dependency calls selectDependency(':selector')", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        var target = ganttTimeline.wrapper.find(".k-line:first");

        stub(ganttTimeline, "selectDependency");

        target.click();

        equal(ganttTimeline.calls("selectDependency"), 1);
    });

    test("clicking on a dependency calls selectDependency(':selector') with correct parameter", 1, function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        var target = ganttTimeline.wrapper.find(".k-line:first");

        stub(ganttTimeline, {
            selectDependency: function(value) {
                equal(value, target[0]);
            }
        });

        target.click();
    });

    test("clicking on the tasks table calls clearSelection()", function() {
        ganttTimeline._render(tasks);

        var target = ganttTimeline.wrapper.find(".k-gantt-tables");

        stub(gantt, "clearSelection");

        target.click();

        ok(gantt.calls("clearSelection"));
    });

    test("clicking on a task delete icon calls removeTask()", function() {
        ganttTimeline._render(tasks);

        var target = ganttTimeline.wrapper.find(".k-gantt-tasks .k-task-delete").first();

        stub(gantt, "removeTask");

        target.click();

        ok(gantt.calls("removeTask"));
    });

    test("pressing Del key calls removeDependency() if dependency is selected", function() {
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        stub(gantt, "removeDependency");

        ganttTimeline.selectDependency(ganttTimeline.wrapper.find(".k-line:first"));
        ganttTimeline.wrapper.trigger($.Event("keydown", { keyCode: kendo.keys.DELETE }));

        ok(gantt.calls("removeDependency"));
    });

    test("pressing Del key leaves no selected dependencies", function() {
        // This tests a quirk of the virtual DOM
        ganttTimeline._render(tasks);
        ganttTimeline._renderDependencies(dependencies);

        ganttTimeline.selectDependency(ganttTimeline.wrapper.find(".k-line:first"));
        ganttTimeline.wrapper.trigger($.Event("keydown", { keyCode: kendo.keys.DELETE }));

        ok(!ganttTimeline.selectDependency().length);
    });

    module("Header TaskDropDown", {
        setup: function() {
            element = $("<div/>");
            gantt = new Gantt(element, {
                dataSource: setupDataSource(data)
            });
        },
        teardown: function() {
            kendo.destroy(element);
        }
    });

    test("applies hover state to list item on mouseenter", function () {
        var dropDown = gantt.headerDropDown;

        dropDown.list.find("li.k-item").eq(0).mouseenter();

        ok(dropDown.list.find("li.k-item").hasClass("k-state-hover"));
    });

    test("removes hover state to list item on mouseleave", function () {
        var dropDown = gantt.headerDropDown;

        dropDown.list.find("li.k-item").eq(0).mouseenter();
        dropDown.list.find("li.k-item").eq(0).mouseleave();

        ok(!dropDown.list.find("li.k-item").hasClass("k-state-hover"));
    });

    test("triggers command upon click", 2, function() {
        var dropDown = gantt.headerDropDown;

        dropDown.bind("command", function(e) {
            ok(true);
            equal(e.type, "add");
        });

        dropDown.element.find("button").click();
    });

    test("triggers command upon list item click", 2, function() {
        var dropDown = gantt.headerDropDown;

        gantt.select("tr:first");

        dropDown.bind("command", function(e) {
            ok(true);
            equal(e.type, "add");
        });

        dropDown.list.find("li:first").eq(0).click();
    });

    test("closes popup upon list item click", function() {
        var dropDown = gantt.headerDropDown;

        gantt.select("tr:first");
        dropDown.element.find("li").click();

        stub(dropDown.popup, "close");

        dropDown.list.find("li:first").eq(0).click();

        ok(dropDown.popup.calls("close"));
    });

    test("does not trigger command upon click should gantt has selection", function() {
        var dropDown = gantt.headerDropDown;
        var flag = true;
        gantt.select("tr:first");

        dropDown.bind("command", function(e) {
            flag = false;
        });

        dropDown.element.find("li").click();

        ok(flag);
    });

    test("opens popup upon click should gantt has selection", function() {
        var dropDown = gantt.headerDropDown;

        gantt.select("tr:first");
        stub(dropDown.popup, "open");
        dropDown.element.find("button").click();

        ok(dropDown.popup.calls("open"));
    });

    test("'add' appends task to root collection", function() {
        var dropDown = gantt.headerDropDown;

        dropDown.trigger("command", { type: "add" });
        equal(gantt.dataSource.taskChildren().length, 3);
    });

    test("'add' appends task to root collection with correct parameters", 3, function() {
        var dropDown = gantt.headerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        dropDown.trigger("command", { type: "add" });

        newTask = gantt.dataSource.taskChildren()[2];

        equal(newTask.get("title"), "New task");
        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    test("'add' appends task to the selected task collection", function() {
        var dropDown = gantt.headerDropDown;
        var selectedTask;

        gantt.select("tr:first");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "add" });

        equal(gantt.dataSource.taskChildren(selectedTask).length, 3);
    });

    test("'add' appends task to the selected task collection with correct parameters", 3, function() {
        var dropDown = gantt.headerDropDown;
        var selectedTask;
        var newTask;

        gantt.select("tr:first");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "add" });
        newTask = gantt.dataSource.taskChildren(selectedTask)[2];

        equal(newTask.get("title"), "New task");
        equal(newTask.get("start"), selectedTask.get("start"));
        equal(newTask.get("end"), selectedTask.get("end"));
    });

    test("'insertBefore' insert task before the selected", 3, function() {
        var dropDown = gantt.headerDropDown;
        var rootTasks;

        gantt.select("tr:last");
        dropDown.trigger("command", { type: "insert-before" });
        rootTasks = gantt.dataSource.taskChildren();

        equal(rootTasks[0].get("title"), "foo");
        equal(rootTasks[1].get("title"), "New task");
        equal(rootTasks[2].get("title"), "bar");
    });

    test("'insertBefore' insert task with parent's start/end of selected task", 2, function() {
        var dropDown = gantt.headerDropDown;
        var selectedTask;
        var parent;
        var newTask;

        gantt.select("tr:eq(2)");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "insert-before" });
        parent = gantt.dataSource.taskParent(selectedTask);
        newTask = gantt.dataSource.taskSiblings(selectedTask)[1];


        equal(newTask.get("start"), parent.get("start"));
        equal(newTask.get("end"), parent.get("end"));
    });

    test("'insertBefore' insert task with first time slot start/end when selected task is root", 2, function() {
        var dropDown = gantt.headerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        gantt.select("tr:first");
        dropDown.trigger("command", { type: "insert-before" });
        newTask = gantt.dataSource.taskChildren()[0];

        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    test("'insertAfter' insert task after the selected", 3, function() {
        var dropDown = gantt.headerDropDown;
        var rootTasks;

        gantt.select("tr:last");
        dropDown.trigger("command", { type: "insert-after" });
        rootTasks = gantt.dataSource.taskChildren();

        equal(rootTasks[0].get("title"), "foo");
        equal(rootTasks[1].get("title"), "bar");
        equal(rootTasks[2].get("title"), "New task");
    });

    test("'insertAfter' insert task with parent's start/end of selected task", 2, function() {
        var dropDown = gantt.headerDropDown;
        var selectedTask;
        var parent;
        var newTask;

        gantt.select("tr:eq(2)");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "insert-after" });
        parent = gantt.dataSource.taskParent(selectedTask);
        newTask = gantt.dataSource.taskSiblings(selectedTask)[2];

        equal(newTask.get("start"), parent.get("start"));
        equal(newTask.get("end"), parent.get("end"));
    });

    test("'insertAfter' insert task with first time slot start/end when selected task is root", 2, function() {
        var dropDown = gantt.headerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        gantt.select("tr:first");
        dropDown.trigger("command", { type: "insert-after" });
        newTask = gantt.dataSource.taskChildren()[1];

        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    test("honors the dataSource set via setDataSource method", function() {
        var selectedTask;
        var dropDown = gantt.headerDropDown;
        var dataSource = setupDataSource([{
            id: 1000,
            parentId: null,
            orderId: 0,
            title: "FooBar",
            start: new Date("2014/03/31"),
            end: new Date("2014/04/05"),
            summary: true,
            expanded: true
        },
        {
            id: 1001,
            parentId: 1000,
            orderId: 0,
            title: "FooFoo",
            start: new Date("2014/03/31"),
            end: new Date("2014/04/05"),
            summary: false,
            expanded: false
        }]);

        gantt.setDataSource(dataSource);
        gantt.select("tr:eq(1)");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "insert-before" });

        equal(gantt.dataSource.taskSiblings(selectedTask).length, 2);
    });

    module("Footer TaskDropDown", {
        setup: function() {
            element = $("<div/>");
            gantt = new Gantt(element, {
                dataSource: setupDataSource(data)
            });
        },
        teardown: function() {
            kendo.destroy(element);
        }
    });

    test("applies hover state to list item on mouseenter", function() {
        var dropDown = gantt.footerDropDown;

        dropDown.list.find("li.k-item").eq(0).mouseenter();

        ok(dropDown.list.find("li.k-item").hasClass("k-state-hover"));
    });

    test("removes hover state to list item on mouseleave", function() {
        var dropDown = gantt.footerDropDown;

        dropDown.list.find("li.k-item").eq(0).mouseenter();
        dropDown.list.find("li.k-item").eq(0).mouseleave();

        ok(!dropDown.list.find("li.k-item").hasClass("k-state-hover"));
    });

    test("triggers command upon click", 2, function() {
        var dropDown = gantt.footerDropDown;

        dropDown.bind("command", function(e) {
            ok(true);
            equal(e.type, "add");
        });

        dropDown.element.find("button").click();
    });

    test("triggers command upon list item click", 2, function() {
        var dropDown = gantt.footerDropDown;

        gantt.select("tr:first");

        dropDown.bind("command", function(e) {
            ok(true);
            equal(e.type, "add");
        });

        dropDown.list.find("li:first").eq(0).click();
    });

    test("closes popup upon list item click", function() {
        var dropDown = gantt.footerDropDown;

        gantt.select("tr:first");
        dropDown.element.find("li").click();

        stub(dropDown.popup, "close");

        dropDown.list.find("li:first").eq(0).click();

        ok(dropDown.popup.calls("close"));
    });

    test("does not trigger command upon click should gantt has selection", function() {
        var dropDown = gantt.footerDropDown;
        var flag = true;
        gantt.select("tr:first");

        dropDown.bind("command", function(e) {
            flag = false;
        });

        dropDown.element.find("li").click();

        ok(flag);
    });

    test("opens popup upon click should gantt has selection", function() {
        var dropDown = gantt.footerDropDown;

        gantt.select("tr:first");
        stub(dropDown.popup, "open");
        dropDown.element.find("button").click();

        ok(dropDown.popup.calls("open"));
    });

    test("'add' appends task to root collection", function() {
        var dropDown = gantt.footerDropDown;

        dropDown.trigger("command", { type: "add" });
        equal(gantt.dataSource.taskChildren().length, 3);
    });

    test("'add' appends task to root collection with correct parameters", 3, function() {
        var dropDown = gantt.footerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        dropDown.trigger("command", { type: "add" });

        newTask = gantt.dataSource.taskChildren()[2];

        equal(newTask.get("title"), "New task");
        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    test("'add' appends task to the selected task collection", function() {
        var dropDown = gantt.footerDropDown;
        var selectedTask;

        gantt.select("tr:first");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "add" });

        equal(gantt.dataSource.taskChildren(selectedTask).length, 3);
    });

    test("'add' appends task to the selected task collection with correct parameters", 3, function() {
        var dropDown = gantt.footerDropDown;
        var selectedTask;
        var newTask;

        gantt.select("tr:first");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "add" });
        newTask = gantt.dataSource.taskChildren(selectedTask)[2];

        equal(newTask.get("title"), "New task");
        equal(newTask.get("start"), selectedTask.get("start"));
        equal(newTask.get("end"), selectedTask.get("end"));
    });

    test("'insertBefore' insert task before the selected", 3, function() {
        var dropDown = gantt.footerDropDown;
        var rootTasks;

        gantt.select("tr:last");
        dropDown.trigger("command", { type: "insert-before" });
        rootTasks = gantt.dataSource.taskChildren();

        equal(rootTasks[0].get("title"), "foo");
        equal(rootTasks[1].get("title"), "New task");
        equal(rootTasks[2].get("title"), "bar");
    });

    test("'insertBefore' insert task with parent's start/end of selected task", 2, function() {
        var dropDown = gantt.footerDropDown;
        var selectedTask;
        var parent;
        var newTask;

        gantt.select("tr:eq(2)");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "insert-before" });
        parent = gantt.dataSource.taskParent(selectedTask);
        newTask = gantt.dataSource.taskSiblings(selectedTask)[1];


        equal(newTask.get("start"), parent.get("start"));
        equal(newTask.get("end"), parent.get("end"));
    });

    test("'insertBefore' insert task with first time slot start/end when selected task is root", 2, function() {
        var dropDown = gantt.footerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        gantt.select("tr:first");
        dropDown.trigger("command", { type: "insert-before" });
        newTask = gantt.dataSource.taskChildren()[0];

        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    test("'insertAfter' insert task after the selected", 3, function() {
        var dropDown = gantt.footerDropDown;
        var rootTasks;

        gantt.select("tr:last");
        dropDown.trigger("command", { type: "insert-after" });
        rootTasks = gantt.dataSource.taskChildren();

        equal(rootTasks[0].get("title"), "foo");
        equal(rootTasks[1].get("title"), "bar");
        equal(rootTasks[2].get("title"), "New task");
    });

    test("'insertAfter' insert task with parent's start/end of selected task", 2, function() {
        var dropDown = gantt.footerDropDown;
        var selectedTask;
        var parent;
        var newTask;

        gantt.select("tr:eq(2)");
        selectedTask = gantt.dataItem(gantt.select());
        dropDown.trigger("command", { type: "insert-after" });
        parent = gantt.dataSource.taskParent(selectedTask);
        newTask = gantt.dataSource.taskSiblings(selectedTask)[2];

        equal(newTask.get("start"), parent.get("start"));
        equal(newTask.get("end"), parent.get("end"));
    });

    test("'insertAfter' insert task with first time slot start/end when selected task is root", 2, function() {
        var dropDown = gantt.footerDropDown;
        var firstTimeSlot = gantt.timeline.view()._timeSlots()[0];
        var newTask;

        gantt.select("tr:first");
        dropDown.trigger("command", { type: "insert-after" });
        newTask = gantt.dataSource.taskChildren()[1];

        equal(newTask.get("start"), firstTimeSlot.start);
        equal(newTask.get("end"), firstTimeSlot.end);
    });

    module("Views toolbar", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(element);
            element.remove();
        }
    });

    test("clicking on the view navigation selects the view", function() {
        var gantt = new Gantt(element);

        gantt.toolbar.find(".k-view-week").click();

        equal(gantt.timeline.view().name, "week");
        ok(gantt.toolbar.find(".k-view-week").hasClass("k-state-selected"));
    });

    test("clicking on the view navigation deselects the other views", function() {
        var gantt = new Gantt(element);

        gantt.toolbar.find(".k-view-week").click();

        equal(gantt.toolbar.find(".k-state-selected").length, 1);
    });

    test("clicking on the view navigation raises navigate event", 1, function() {
        var gantt = new Gantt(element, {
            navigate: function(e) {
                equal(e.view, "week");
            }
        });

        gantt.toolbar.find(".k-view-week").click();
    });

    test("canceling the navigate event prevents switching the view", function() {
        var gantt = new Gantt(element, {
            navigate: function(e) {
                e.preventDefault();
            }
        });

        gantt.toolbar.find(".k-view-week").click();

        equal(gantt.timeline.view().name, "day");
    });

    test("clicking on view toggle expanded css class when current view visible", 2, function() {
        var gantt = new Gantt(element);
        var currentView = gantt.toolbar.find(".k-current-view");

        currentView.show().trigger("click");

        ok(currentView.parent().hasClass("k-state-expanded"));

        currentView.show().trigger("click");

        ok(!currentView.parent().hasClass("k-state-expanded"));
    });

    test("clicking on view does not add expanded css class when current view invisible", function() {
        var gantt = new Gantt(element);
        var view = gantt.toolbar.find(".k-view-week");

        gantt.toolbar.find(".k-current-view").hide();
        view.trigger("click");

        ok(!view.parent().hasClass("k-state-expanded"));
    });

    test("clicking on the view changes current view text", function() {
        var gantt = new Gantt(element);

        gantt.toolbar.find(".k-view-week").click();

        equal(gantt.toolbar.find(".k-current-view > .k-link").text(), "Week");
    });

    module("Resizable", {
        setup: function () {
            element = $("<div/>").appendTo(QUnit.fixture);
            gantt = new Gantt(element, {
                dataSource: setupDataSource(data)
            });
        },
        teardown: function () {
            gantt.destroy();
            kendo.destroy(element);
            element.remove();
        }
    });

    test("hover state applied on mouseenter", function () {
        gantt.wrapper.find(".k-splitbar").eq(0).mouseenter();

        ok(gantt.wrapper.find(".k-splitbar").hasClass("k-splitbar-horizontal-hover"));
    });

    test("hover state removed on mouseleave", function () {
        gantt.wrapper.find(".k-splitbar").eq(0).mouseenter();
        gantt.wrapper.find(".k-splitbar").eq(0).mouseleave();

        ok(!gantt.wrapper.find(".k-splitbar").hasClass("k-splitbar-horizontal-hover"));
    });

    test("resize decrease timeline size when resized right", function () {
        var resizable = gantt._resizeDraggable;
        var timelineWrapper = gantt.wrapper.find(".k-gantt-timeline");
        var timelineWidth = timelineWrapper.width();
        var delta = 30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        equal(timelineWrapper.width(), timelineWidth - delta);
    });

    test("resize increase timeline size when resized left", function () {
        var resizable = gantt._resizeDraggable;
        var timelineWrapper = gantt.wrapper.find(".k-gantt-timeline");
        var timelineWidth = timelineWrapper.width();
        var delta = -30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        equal(timelineWrapper.width(), timelineWidth - delta);
    });

    test("resize change scroll upon resize", function () {
        var resizable = gantt._resizeDraggable;
        var timelineWrapper = gantt.wrapper.find(".k-gantt-timeline");
        var timelineContent = timelineWrapper.find(".k-grid-content");
        var timelineScroll = timelineContent.scrollLeft();
        var delta = 30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        equal(timelineContent.scrollLeft(), timelineScroll + delta);
    });

    test("resize increase treelist size when resized right", function () {
        var resizable = gantt._resizeDraggable;
        var treelistWrapper = gantt.wrapper.find(".k-gantt-treelist");
        var treelistWidth = treelistWrapper.width();
        var delta = 30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        equal(treelistWrapper.width(), treelistWidth + delta);
    });

    test("resize decrease treelist size when resized left", function () {
        var resizable = gantt._resizeDraggable;
        var treelistWrapper = gantt.wrapper.find(".k-gantt-treelist");
        var treelistWidth = treelistWrapper.width();
        var delta = -30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        equal(treelistWrapper.width(), treelistWidth + delta);
    });

    module("Content Scrollable", {
        setup: function () {
            element = $("<div/>").appendTo(QUnit.fixture);
            gantt = new Gantt(element, {
                dataSource: setupDataSource(data),
                height: 300,
                width: 700,
                listWidth: 60
            });
        },
        teardown: function () {
            gantt.destroy();
            kendo.destroy(element);
            element.remove();
        }
    });

    asyncTest("timeline scroll top scroll treelist", function () {
        var timelineContent = gantt.timeline.wrapper.find(".k-grid-content");
        var treelistContent = gantt.list.element.find(".k-grid-content");

        timelineContent.scrollTop(20);

        setTimeout(function () {
            equal(treelistContent.scrollTop(), timelineContent.scrollTop());
            start();
        }, 50);
    });

    asyncTest("timeline scroll left scroll header", function () {
        expect(1);
        var timelineContent = gantt.timeline.wrapper.find(".k-grid-content");
        var headerWrap = gantt.timeline.wrapper.find(".k-grid-header-wrap");

        timelineContent.scrollLeft(20);

        setTimeout(function () {
            equal(headerWrap.scrollLeft(), timelineContent.scrollLeft());
            start();
        }, 2);
    });

    asyncTest("treelist scroll left scroll header", function () {
        expect(1);
        var treelistContent = gantt.list.element.find(".k-grid-content");
        var headerWrap = gantt.list.element.find(".k-grid-header-wrap");
        var resizable = gantt._resizeDraggable;
        var delta = -30;

        resizable.trigger("start");
        resizable.trigger("resize", {
            x: {
                initialDelta: delta
            }
        });

        treelistContent.scrollLeft(20);

        setTimeout(function () {
            equal(headerWrap.scrollLeft(), treelistContent.scrollLeft());
            start();
        }, 2);
    });

    asyncTest("treelist scroll top timeline", function() {
        expect(1);

        var timelineContent = gantt.timeline.wrapper.find(".k-grid-content");
        var treelistContent = gantt.list.element.find(".k-grid-content");

        treelistContent.scrollTop(20);

        setTimeout(function() {
            equal(timelineContent.scrollTop(), treelistContent.scrollTop());
            start();
        }, 2);
    });

    module("Content Focusable", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(element);
            element.remove();
        }
    });

    asyncTest("navigatable and editable gantt focus list table upon mouse down", function() {
        expect(1);
        gantt = new Gantt(element, {
            dataSource: setupDataSource(data),
            navigatable: true
        });

        gantt.list.content.find("tr:first").mousedown();

        setTimeout(function() {
            equal(kendo._activeElement(), gantt.list.content.find("table").get(0));
            start();
        }, 3);
    });

    asyncTest("navigatable and editable gantt focus list table upon mouse down on timeline task", function() {
        expect(1);
        gantt = new Gantt(element, {
            dataSource: setupDataSource(data),
            navigatable: true
        });

        gantt.timeline.wrapper.find("div[data-uid]:first").mousedown();

        setTimeout(function() {
            equal(kendo._activeElement(), gantt.list.content.find("table").get(0));
            start();
        }, 3);
    });

    asyncTest("editable gantt focus list table upon mouse down", function() {
        expect(1);
        gantt = new Gantt(element, {
            dataSource: setupDataSource(data)
        });

        gantt.list.content.find("tr:first").mousedown();

        setTimeout(function() {
            equal(kendo._activeElement(), gantt.list.content.find("table").get(0));
            start();
        }, 3);
    });

    asyncTest("editable gantt focus list table upon mouse down on timeline task", function() {
        expect(1);
        gantt = new Gantt(element, {
            dataSource: setupDataSource(data)
        });

        gantt.timeline.wrapper.find("div[data-uid]:first").mousedown();

        setTimeout(function() {
            equal(kendo._activeElement(), gantt.list.content.find("table").get(0));
            start();
        }, 3);
    });

    asyncTest("navigatable and editable gantt does not focus list table upon mouse down on timeline dependency", function() {
        expect(1);
        gantt = new Gantt(element, {
            dataSource: setupDataSource(data),
            dependencies: dependenciesData,
            navigatable: true
        });

        gantt.timeline.wrapper.find("div.k-line").mousedown();

        setTimeout(function() {
            notEqual(kendo._activeElement(), gantt.list.content.find("table").get(0));
            start();
        }, 3);
    });
})();
