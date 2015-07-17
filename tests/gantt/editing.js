﻿(function () {
    var Gantt = kendo.ui.Gantt;
    var GanttList = kendo.ui.GanttList;
    var GanttDataSource = kendo.data.GanttDataSource;
    var gantt;
    var ganttList;
    var ganttTimeline;
    var element;
    var columns;
    var extend = $.extend;
    var doubleTap = function(target) {
        target.trigger("dblclick");
    };

    module("Gantt inline editing", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);

            columns = [
                { field: "title", editable: true, editor: function() { } },
                { field: "start", editable: true },
                { field: "summary" }
            ];

            dataSource = new GanttDataSource({
                data: [{ title: "foo", start: new Date(), parentId: null, id: 1, summary: true }],
                schema: {
                    model: {
                        id: "id"
                    }
                }
            });

            dataSource.fetch();
            taskTree = dataSource.taskTree();

            ganttList = new GanttList(element, { columns: columns, dataSource: dataSource });
            ganttList._render(taskTree);
        },
        teardown: function() {
            ganttList.destroy();
            kendo.destroy(QUnit.fixture);
            element.remove();
        }
    });

    test("attaches editable widget to editable cell on dblclick", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.data("kendoEditable"));
    });

    test("doers not start edit on dblclick when another cell already in edit", function() {
        doubleTap(ganttList.content.find("td").eq(0));
        stub(ganttList, "_editCell");
        doubleTap(ganttList.content.find("td").eq(1));

        ok(!ganttList.calls("_editCell"));
    });

    test("applies css class to editable cell on dblclick", function () {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.hasClass("k-edit-cell"));
    });

    test("attaches model copy to the editable cell data", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.data("modelCopy"));
    });

    test("passes column settings to editable widget", 3, function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var editable;

        doubleTap(targetCell);
        editable = targetCell.data("kendoEditable");

        equal(editable.options.fields.field, ganttList.columns[0].field);
        equal(editable.options.fields.format, ganttList.columns[0].format);
        ok(editable.options.fields.editor);
    });

    test("passes the editable's clearContainer setting", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var editable;

        doubleTap(targetCell);
        editable = targetCell.data("kendoEditable");

        ok(!editable.options.clearContainer);
    });

    test("sets list's editable field", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(ganttList.editable instanceof kendo.ui.Editable);
    });

    test("detaches cell content before initializing the editable", 3, function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(ganttList._editableContent.eq(0).is("span"));
        ok(ganttList._editableContent.eq(1).is("span"));
        equal(ganttList._editableContent.eq(1).html(), "foo");
    });

    test("re-attaches cell content before initializing the editable", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
        ganttList._closeCell();

        ok(targetCell.children().eq(0).is("span"));
        ok(targetCell.children().eq(1).is("span"));
        equal(targetCell.children().eq(1).html(), "foo");
    });

    asyncTest("calls validate when cell leaves edit mode", function() {
        expect(1);
        var targetCell = ganttList.content.find("td").eq(0);
        var validate;

        doubleTap(targetCell);
        validate = stub(targetCell.data("kendoValidator"), "validate");
        targetCell.focusout();

        setTimeout(function() {
            ok(validate.calls("validate"));
            start();
        }, 2);
    });

    asyncTest("does not leaves edit mode if validation fails", function() {
        expect(1);
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
        stub(targetCell.data("kendoValidator"), { validate: function() { return false } });
        targetCell.focusout();

        setTimeout(function() {
            ok(targetCell.data("kendoEditable"));
            start();
        }, 2);
    });

    test("does not attach editable widget to non-editable cell on dblclick", function() {
        var targetCell = ganttList.content.find("td").eq(2);

        doubleTap(targetCell);

        ok(!targetCell.data("kendoEditable"));
    });

    test("triggers 'update' when edited cell closes", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ganttList.bind("update", function() {
            ok(true);
        });

        ganttList._closeCell();
    });

    test("does not trigger 'update' when edited cell closes with cancelUpdate parameter", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var updateTriggered;

        doubleTap(targetCell);

        ganttList.bind("update", function() {
            updateTriggered = true;
        });

        ganttList._closeCell(true);

        ok(!updateTriggered);
    });

    test("destroys editable widget after cell exits edit mode", 3, function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.data("kendoEditable"));

        ganttList._closeCell();

        ok(!targetCell.data("kendoEditable"));
        ok(!ganttList.editable);
    });

    test("detaches model copy after cell exits edit mode", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
        ganttList._closeCell();

        ok(!targetCell.data("modelCopy"));
    });

    test("removes css class after cell exists edit mode", function () {
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
        ganttList._closeCell();

        ok(!targetCell.hasClass("k-edit-cell"));
    });

    test("ESC keydown closes edited cell", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ESC;

        stub(ganttList, "_closeCell");
        doubleTap(targetCell);
        targetCell.trigger(event);

        ok(ganttList.calls("_closeCell"));
    });

    test("ESC keydown closes edited cell with cancelUpdate parameter", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ESC;

        stub(ganttList, { _closeCell: function(cancelUpdate) { ok(cancelUpdate) } });
        doubleTap(targetCell);
        targetCell.trigger(event);
    });

    test("ESC keydown trigger cancel event", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ESC;
        ganttList.bind("cancel", function() {
            ok(true);
        });

        doubleTap(targetCell);
        targetCell.trigger(event);
    });

    test("ESC keydown does not close edit cell when 'cancel' prevented", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ESC;

        ganttList.bind("cancel", function(e) {
            e.preventDefault();
        });

        stub(ganttList, "_closeCell");
        doubleTap(targetCell);
        targetCell.trigger(event);

        ok(!ganttList.calls("_closeCell"));
    });

    test("Enter keydown closes edited cell", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ENTER;

        stub(ganttList, "_closeCell");
        doubleTap(targetCell);
        targetCell.trigger(event);

        ok(ganttList.calls("_closeCell"));
    });

    test("cancel event has correct parameters", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var event = new $.Event('keyup');

        event.keyCode = kendo.keys.ESC;
        ganttList.bind("cancel", function(e) {
            equal(e.model, ganttList.dataSource.at(0));
            equal(e.cell[0], targetCell[0]);
        });

        doubleTap(targetCell);
        targetCell.trigger(event);
    });

    test("trigger edit event", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        ganttList.bind("edit", function(e) {
            ok(true);
            equal(e.model, ganttList.dataSource.at(0));
            equal(e.cell[0], targetCell[0])
        });

        doubleTap(targetCell);
    });

    test("edited cell closed when 'edit' is prevented", function() {
        var targetCell = ganttList.content.find("td").eq(0);

        stub(ganttList, "_closeCell");
        ganttList.bind("edit", function(e) {
            e.preventDefault();
        });

        doubleTap(targetCell);
        ok(ganttList.calls("_closeCell"));
    });

    var setup = function(options) {
        columns = [
            extend({ editable: true }, options.column)
        ];

        dataSource = new GanttDataSource({
            data: options.data,
            schema: {
                model: extend({
                    id: "id",
                    fields: {
                        start: { from: "start", type: "date" }
                    }
                }, options.fields)
            }
        });

        dataSource.fetch();
        taskTree = dataSource.taskTree();

        ganttList = new GanttList(element, { columns: columns, dataSource: dataSource });
        ganttList._render(taskTree);
    };

    module("Gantt custom date time editor", {
        setup: function() {
            element = $("<div/>");
        },
        teardown: function() {
            ganttList.destroy();
        }
    });

    test("edit date field with no type creates DateTimePicker", function() {
        setup({
            column: { field: "start" },
            data: [{ start: new Date()}]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("custom date time editor has binding attributes", function() {
        setup({
            column: { field: "start" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);
        var input;

        doubleTap(targetCell);

        input = targetCell.find("input");

        equal(input.attr("data-type"), "date");
        equal(input.attr("data-bind"), "value:start");
        equal(input.attr("name"), "start");
        equal(input.attr("required"), "required");
    });

    test("custom date time editor has format binding attribute when format set", function() {
        setup({
            column: { field: "start", format: "{0:MM/dd/yyyy HH:mm}" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);
        var input;

        doubleTap(targetCell);

        input = targetCell.find("input");

        equal(input.attr("data-format"), "MM/dd/yyyy HH:mm");
    });

    test("edit custom date field with no type creates DateTimePicker", function() {
        setup({
            column: { field: "customField" },
            data: [{ customField: new Date() }]
        });

        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("edit custom field with date type creates DateTimePicker", function() {
        setup({
            column: { field: "customField" },
            data: [{ CustomField: new Date() }],
            fields: {
                fields: {
                    customField: { from: "CustomField", type: "date" }
                }
            }
        });

        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("custom date field has required attribute", function() {
        setup({
            column: { field: "customField" },
            data: [{ CustomField: new Date() }],
            fields: {
                fields: {
                    customField: { from: "CustomField", type: "date", validation: { required: true } }
                }
            }
        });

        var targetCell = ganttList.content.find("td").eq(0);
        var input;

        doubleTap(targetCell);

        input = targetCell.find("input");

        equal(input.attr("required"), "required");
    });

    test("user defined editor is created for data fields", 1, function() {
        setup({
            column: {
                field: "start", editor: function() {
                    ok(true);
                }
            },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
    });

    test("user defined editor is created for custom data fields", 1, function() {
        setup({
            column: { field: "customField", editor: function() { ok(true); } },
            data: [{ CustomField: new Date() }],
            fields: {
                fields: {
                    customField: { from: "CustomField", type: "date" }
                }
            }
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);
    });

    test("format yyyy/MM/dd HH:mm:ss creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "yyyy/MM/dd HH:mm:ss" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format yyyy/MM/dd creates DatePicker", function() {
        setup({
            column: { field: "start", format: "yyyy/MM/dd" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDatePicker"));
    });

    test("format yyyy/MM/dd HH:mm creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "yyyy/MM/dd HH:mm" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format ddd MMM dd yyyy HH:mm:ss creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "ddd MMM dd yyyy HH:mm:ss" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format ddd MMM dd yyyy creates DatePicker", function() {
        setup({
            column: { field: "start", format: "ddd MMM dd yyyy" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDatePicker"));
    });

    test("format yyyy-MM-ddTHH:mm creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "yyyy-MM-ddTHH:mm" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format g creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "g" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format u creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "u" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    test("format F creates DateTimePicker", function() {
        setup({
            column: { field: "start", format: "F" },
            data: [{ start: new Date() }]
        });
        var targetCell = ganttList.content.find("td").eq(0);

        doubleTap(targetCell);

        ok(targetCell.find("input").data("kendoDateTimePicker"));
    });

    module("Gantt validation", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);

            dataSource = new GanttDataSource({
                data: [{
                    id: 1,
                    parentId: null,
                    title: "foo",
                    start: new Date("05/05/2014"),
                    end: new Date("05/06/2014")
                }],
                schema: {
                    model:{
                        id: "id",
                        fields: {
                            id: { from: "ID", type: "number" },
                            parentId: { from: "parentId", type: "number" },
                            start: { from: "start", type: "date" },
                            end: { from: "end", type: "date" },
                            title: { from: "title", type: "string" }
                        }
                    }
                }
            });

            gantt = new Gantt(element, {
                columns: [
                    { field: "start", editable: true, format: "{0:MM/dd/yyyy}" },
                    { field: "end", editable: true, format: "{0:MM/dd/yyyy}" }
                ],
                dataSource: dataSource
            });

            ganttList = gantt.list;
            ganttTimeline = gantt.timeline;
        },
        teardown: function() {
            gantt.destroy();
            kendo.destroy(QUnit.fixture);
            element.remove();
        }
    });

    test("passes when start after end", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("05/07/2014")

        ok(ganttList.editable.end());
    });

    test("passes when start equals end", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("05/06/2014")

        ok(ganttList.editable.end());
    });

    test("fails when end before start", function() {
        var targetCell = ganttList.content.find("td").eq(1);
        var picker;

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=end]"));
        picker.value("05/03/2014")

        ok(!ganttList.editable.end());

    });

    test("passes when end equals start", function() {
        var targetCell = ganttList.content.find("td").eq(1);
        var picker;

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=end]"));
        picker.value("05/05/2014")

        ok(ganttList.editable.end());

    });

    test("prevents navigation when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        stub(gantt, "view");
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        gantt.toolbar.find("li:last").click();

        ok(!gantt.calls("view"));
    });

    test("does not fire gantt's navigate when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var eventFired = false;
        var picker;

        gantt.bind("navigate", function(e) {
            eventFired = true;
        });
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        gantt.toolbar.find("li:last").click();

        ok(!eventFired);
    });

    test("prevents resizeStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("resizeStart", e);

        ok(e.isDefaultPrevented());
    });

    test("does not fire gantt's resizeStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();
        var eventFired = false;

        gantt.bind("resizeStart", function(e) { eventFired = true; });
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("resizeStart", e);

        ok(!eventFired);
    });

    test("prevents moveStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("moveStart", e);

        ok(e.isDefaultPrevented());
    });

    test("does not fire gantt's moveStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();
        var eventFired = false;

        gantt.bind("moveStart", function(e) { eventFired = true; });
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("moveStart", e);

        ok(e.isDefaultPrevented());

        ok(!eventFired);
    });

    test("prevents percentResizeStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("percentResizeStart", e);

        ok(e.isDefaultPrevented());
    });

    test("prevents dependencyDragStart when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("dependencyDragStart", e);

        ok(e.isDefaultPrevented());
    });

    test("does not call editTask when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        stub(gantt, "editTask");
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("editTask", {});

        ok(!gantt.calls("editTask"));
    });

    test("does not call removeTask when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        stub(gantt, "removeTask");
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("removeTask", {});

        ok(!gantt.calls("removeTask"));
    });

    test("does not call removeDependency when validation fails", function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        stub(gantt, "removeDependency");
        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttTimeline.trigger("removeDependency", {});

        ok(!gantt.calls("removeDependency"));
    });

    test("triggers editable validate event upon timeline select", 1, function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");
        ganttList.editable.bind("validate", function() {
            ok(true);
        });

        ganttTimeline.trigger("select", e);
    });

    test("triggers editable validate event upon list content click", 1, function() {
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;
        var e = new $.Event();

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");
        ganttList.editable.bind("validate", function() {
            ok(true);
        });

        ganttList.content.find("tr:first").trigger("click");
    });

    asyncTest("return focus to editable cell upon blur when validation fails", function() {
        expect(1);

        var focusable;
        var targetCell = ganttList.content.find("td").eq(0);
        var picker;

        doubleTap(targetCell);
        picker = kendo.widgetInstance(ganttList._editableContainer.find("input[name=start]"));
        picker.value("");

        ganttList.content.trigger("focusout");

        setTimeout(function() {
            focusable = ganttList.editable.element.find(":kendoFocusable:first");

            equal(document.activeElement, focusable[0]);
            start();
        }, 3);
    });

    module("Gantt non-editable", {
        setup: function() {
            element = $("<div/>");

            gantt = new Gantt(element, { editable: false });
        },
        teardown: function() {
            gantt.destroy();
        }
    });

    test("does not attach edit handler", function() {
        ok(!gantt.list._startEditHandler);
    });

    module("Gantt inline editing with column resizing", {
        setup: function() {
            element = $("<div/>").appendTo(QUnit.fixture);

            columns = [
                { field: "title", editable: true, editor: function() { } },
                { field: "start", editable: true },
                { field: "summary" }
            ];

            dataSource = new GanttDataSource({
                data: [{ title: "foo", start: new Date(), parentId: null, id: 1, summary: true }],
                schema: {
                    model: {
                        id: "id"
                    }
                }
            });


            gantt = new Gantt(element, { columns: columns, dataSource: dataSource, resizable: true, navigatable: true });
        },
        teardown: function() {
            gantt.destroy();
            kendo.destroy(QUnit.fixture);
            element.remove();
        }
    });

    test("does not trigger edit upon dbclick on dummy column", function() {
        stub(gantt.list, "_editCell");
        doubleTap(gantt.list.content.find("td:last"));

        ok(!gantt.list.calls("_editCell"));
    });

})();