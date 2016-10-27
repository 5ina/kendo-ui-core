(function() {

    var element;
    var ui = kendo.ui;
    var Gantt = ui.Gantt;
    var setup = function(options) {
        return new Gantt(element, options || {});
    };

    module("Gantt initialization", {
        setup: function() {
            jasmine.clock().install();
            element = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(element);
            element.remove();
        }
    });

    test("kendoGantt attaches a gantt instance to target element", function() {
        element.kendoGantt();

        ok(element.data("kendoGantt") instanceof Gantt);
    });

    test("kendoGantt creates GanttList widget", 2, function() {
        element.kendoGantt();

        ok(element.data("kendoGantt").list);
        ok(element.data("kendoGantt").list instanceof ui.GanttList);
    });

    test("kendoGantt creates GanttTimeline widget", function() {
        element.kendoGantt();

        ok(element.data("kendoGantt").timeline);
        ok(element.data("kendoGantt").timeline instanceof ui.GanttTimeline);
    });

    test("kendoGantt creates Popup editor widget", 2, function() {
        element.kendoGantt();

        ok(element.data("kendoGantt")._editor);
        ok(element.data("kendoGantt")._editor instanceof kendo.Observable);
    });

    test("kendoGantt dispose also disposes Popup editor", function() {
        element.kendoGantt();

        var gantt = element.data("kendoGantt");
        var editor = gantt._editor;

        stub(editor, "destroy");

        gantt.destroy();

        ok(editor.calls("destroy"));
    });

    test("initialized with default height", function() {
        var gantt = new Gantt(element);

        equal(element.height(), gantt.options.height);
    });

    test("initialized with height from options", function() {
        element.kendoGantt({ height: 800 });

        equal(element.height(), 800);
    });

    test("initialized with width from options", function() {
        element.kendoGantt({ width: 800 });

        equal(element.width(), 800);
    });

    test("css classes are added to the wrapper", 2, function() {
        var gantt = new Gantt(element);

        ok(gantt.wrapper.hasClass("k-widget"));
        ok(gantt.wrapper.hasClass("k-gantt"));
    });

    test("toolbar is created", 2, function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar);
        equal(gantt.wrapper.children(".k-gantt-toolbar")[0], gantt.toolbar[0]);
    });

    test("css classes added to the toolbar", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.hasClass("k-floatwrap k-header"));
    });

    test("footer is created", 2, function() {
        var gantt = new Gantt(element);

        ok(gantt.footer);
        equal(gantt.wrapper.children(".k-gantt-toolbar")[1], gantt.footer[0]);
    });

    test("footer is not created when not editable", function() {
        var gantt = new Gantt(element, { editable: false });

        ok(!gantt.footer);
    });

    test("footer is not created when editable create is false", function() {
        var gantt = new Gantt(element, { editable: { create: false } });

        ok(!gantt.footer);
    });

    test("css classes added to the footer", function() {
        var gantt = new Gantt(element);

        ok(gantt.footer.hasClass("k-floatwrap k-header"));
    });

    test("toggle button added to the toolbar", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-button.k-button-icon.k-gantt-toggle").length);
    });

    test("view buttons are added to the toolbar", 2, function() {
        var gantt = new Gantt(element, {
            views: ["day"]
        });

        ok(gantt.toolbar.find(".k-view-day").length);
        equal(gantt.toolbar.find(".k-gantt-views .k-link").text(), "Day");
    });

    test("current view button is added to the toolbar", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-current-view").length);
    });

    test("current view button is not added to the toolbar when only one view", function() {
        var gantt = new Gantt(element, {
            views: ["day"]
        });

        equal(gantt.toolbar.find(".k-current-view").length, 0);
    });

    test("toolbar action button is added", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-gantt-actions").children().length);
    });

    test("toolbar action button are not added when non editable", function() {
        var gantt = new Gantt(element, { editable: false });

        equal(gantt.toolbar.find(".k-gantt-actions").children().length, 0);
    });

    test("toolbar action button are not added when editable create is false", function() {
        var gantt = new Gantt(element, { editable: { create: false } });

        equal(gantt.toolbar.find(".k-gantt-actions").children().length, 0);
    });

    test("toolbar action button's elements are rendered", 4, function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-gantt-actions > button").length);
        ok(gantt.toolbar.find(".k-gantt-actions > button").hasClass("k-button k-button-icontext"));

        ok(gantt.toolbar.find(".k-gantt-actions span").length);
        ok(gantt.toolbar.find(".k-gantt-actions span").hasClass("k-icon k-i-plus"));
    });

    test("toolbar action button data attributes are rendered", function() {
        var gantt = new Gantt(element);

        equal(gantt.toolbar.find(".k-gantt-actions > button").attr("data-action"), "add");
    });

    test("toolbar action button command style is rendered", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-gantt-actions > button").hasClass("k-gantt-create"));
    });

    test("toolbar action button text is rendered", function() {
        var gantt = new Gantt(element);

        equal(gantt.toolbar.find(".k-gantt-actions > button").text(), "Add Task");
    });

    test("footer action button is added", function() {
        var gantt = new Gantt(element);

        ok(gantt.footer.find(".k-gantt-actions").length);
    });

    test("footer action button's elements are rendered", 4, function() {
        var gantt = new Gantt(element);

        ok(gantt.footer.find(".k-gantt-actions > button").length);
        ok(gantt.footer.find(".k-gantt-actions > button").hasClass("k-button k-button-icontext"));

        ok(gantt.footer.find(".k-gantt-actions span").length);
        ok(gantt.footer.find(".k-gantt-actions span").hasClass("k-icon k-i-plus"));
    });

    test("footer action button data attributes are rendered", function() {
        var gantt = new Gantt(element);

        equal(gantt.footer.find(".k-gantt-actions > button").attr("data-action"), "add");
    });

    test("footer action action button command style is rendered", function() {
        var gantt = new Gantt(element);

        ok(gantt.footer.find(".k-gantt-actions > button").hasClass("k-gantt-create"));
    });

    test("footer action button text is rendered", function() {
        var gantt = new Gantt(element);

        equal(gantt.footer.find(".k-gantt-actions > button").text(), "Add Task");
    });

    test("default action toolbar append button is localized", function() {
        var gantt = new Gantt(element, {
            messages: {
                actions: {
                    append: "bar"
                }
            }
        });

        equal(gantt.toolbar.find(".k-gantt-actions > button").text(), "bar");
    });

    test("default action toolbar pdf button is localized", function() {
        var gantt = new Gantt(element, {
            messages: {
                actions: {
                    pdf: "bar"
                }
            },
            toolbar: [
                "pdf"
            ]
        });

        equal(gantt.toolbar.find(".k-gantt-actions > button").text(), "bar");
    });

    test("default action footer append button is localized", function() {
        var gantt = new Gantt(element, {
            messages: {
                actions: {
                    append: "bar"
                }
            }
        });

        equal(gantt.footer.find(".k-gantt-actions > button").text(), "bar");
    });

    test("toolbar set as string is rendered", function() {
        var gantt = new Gantt(element, { toolbar: "<div class='customToolbarItem' />" });

        equal(gantt.toolbar.find(".k-gantt-actions").children(".customToolbarItem").length, 1);
    });

    test("toolbar set as function is rendered", function() {
        var gantt = new Gantt(element, { toolbar: kendo.template("<div class='customToolbarItem' />") });

        equal(gantt.toolbar.find(".k-gantt-actions").children(".customToolbarItem").length, 1);
    });

    test("toolbar set as array predefined commands are rendered", function() {
        var gantt = new Gantt(element, { toolbar: ["append"] });

        equal(gantt.toolbar.find(".k-gantt-actions").children("button.k-gantt-create").length, 1);
    });

    test("toolbar set as array custom commands as string are rendered", function() {
        var gantt = new Gantt(element, { toolbar: ["customCommand"] });

        equal(gantt.toolbar.find(".k-gantt-actions").children("button.k-button").length, 1);
        equal(gantt.toolbar.find(".k-gantt-actions").children("button.k-button").text(), "customCommand");
    });

    test("toolbar set as array custom commands as object are rendered", function() {
        var gantt = new Gantt(element, { toolbar: [{ name: "customCommand", className: "customClass", iconClass: "customIconClass" }] });

        equal(gantt.toolbar.find(".k-gantt-actions").children("button.customClass").length, 1);
        equal(gantt.toolbar.find(".k-gantt-actions").children("button.customClass").children("span.customIconClass").length, 1);
        equal(gantt.toolbar.find(".k-gantt-actions").children("button.customClass").text(), "customCommand");
    });

    test("toolbar action dropDown is created", 2, function() {
        var gantt = new Gantt(element);

        ok(gantt.headerDropDown);
        ok(gantt.headerDropDown instanceof kendo.Observable);
    });

    test("toolbar action dropDown is not created when non editable", function() {
        var gantt = new Gantt(element, { editable: false });

        ok(!gantt.headerDropDown);
    });

    test("toolbar action dropDown is not created when editable create is false", function() {
        var gantt = new Gantt(element, { editable: { create: false } });

        ok(!gantt.headerDropDown);
    });

    test("toolbar action dropDown has command event handler attached", function() {
        var gantt = new Gantt(element);

        ok(gantt.headerDropDown._events["command"]);
    });

    test("footer action dropDown is created", 2, function() {
        var gantt = new Gantt(element);

        ok(gantt.footerDropDown);
        ok(gantt.footerDropDown instanceof kendo.Observable);
    });

    test("footer action dropDown is not created when non editable", function() {
        var gantt = new Gantt(element, { editable: false });

        ok(!gantt.footerDropDown);
    });

    test("footer action dropDown is not created when editable create is false", function() {
        var gantt = new Gantt(element, { editable: { create: false } });

        ok(!gantt.footerDropDown);
    });

    test("footer action dropDown has command event handler attached", function() {
        var gantt = new Gantt(element);

        ok(gantt.footerDropDown._events["command"]);
    });

    test("first view is selected", function() {
        var gantt = new Gantt(element, {
            views: ["day", "week"]
        });

        ok(gantt.toolbar.find(".k-view-day").hasClass("k-state-selected"));
    });

    test("view is selected", function() {
        var gantt = new Gantt(element, {
            views: ["day", { type: "week", selected: true }]
        });

        ok(gantt.toolbar.find(".k-view-week").hasClass("k-state-selected"));
    });

    test("day, week and month views are rendered by default", function() {
        var gantt = new Gantt(element);

        ok(gantt.toolbar.find(".k-view-day").length);
        ok(gantt.toolbar.find(".k-view-week").length);
        ok(gantt.toolbar.find(".k-view-month").length);
    });

    test("default views custom options are merged", function() {
        var gantt = new Gantt(element, {
            views: [{
                type: "day",
                title: "My Custom Day View Title"
            }]
        });

        equal(gantt.toolbar.find(".k-view-day").text(), "My Custom Day View Title");
    });

    test("list's wrapper is created", function() {
        var gantt = new Gantt(element);
        var listWrapper = gantt.wrapper.children(".k-gantt-treelist");

        ok(listWrapper.length);
        ok(listWrapper.hasClass("k-gantt-layout"));
    });

    test("list's wrapper is created with default width", function() {
        var gantt = new Gantt(element);

        equal(gantt.wrapper.find(".k-gantt-treelist").get(0).style.width, gantt.options.listWidth);
    });

    test("list's wrapper is created with width from options", function() {
        var gantt = new Gantt(element, { listWidth: 200 });

        equal(gantt.wrapper.find(".k-gantt-treelist").width(), gantt.options.listWidth);
    });

    test("list's wrapper height is total height without the toolbar & footer", function() {
        var gantt = new Gantt(element, { listWidth: 800 });
        var toolbarHeight = gantt.toolbar.outerHeight();
        var footerHeight = gantt.footer.outerHeight();
        var totalHeight = element.height();

        equal(gantt.wrapper.find(".k-gantt-treelist").height(), totalHeight - (toolbarHeight + footerHeight));
    });

    test("timeline's wrapper is created", function() {
        var gantt = new Gantt(element);
        var timelineWrapper = gantt.wrapper.children(".k-gantt-timeline");

        ok(timelineWrapper.length);
        ok(timelineWrapper.hasClass("k-gantt-layout"));
    });

    test("timeline's wrapper height is total height without the toolbar & footer", function() {
        var gantt = new Gantt(element, { listWidth: 800 });
        var toolbarHeight = gantt.toolbar.outerHeight();
        var footerHeight = gantt.footer.outerHeight();
        var totalHeight = element.height();

        equal(gantt.wrapper.find(".k-gantt-timeline").height(), totalHeight - (toolbarHeight + footerHeight));
    });

    test("resizable wrapper is created", function() {
        var gantt = new Gantt(element, { height: 400 });

        ok(gantt.wrapper.find(".k-splitbar"));
    });

    test("resizable wrapper height is total height without the toolbar & footer", function() {
        var gantt = new Gantt(element, { listWidth: 800 });
        var toolbarHeight = gantt.toolbar.outerHeight();
        var footerHeight = gantt.footer.outerHeight();
        var totalHeight = element.height();

        equal(gantt.wrapper.find(".k-splitbar").height(), totalHeight - (toolbarHeight + footerHeight));
    });

    test("attaches Resizable widget to gantt wrapper", function() {
        var gantt = new Gantt(element);

        ok(gantt.wrapper.data("kendoResizable") instanceof ui.Resizable);
    });

    test("resizable initialized with correct options", function() {
        var gantt = new Gantt(element);

        equal(gantt._resizeDraggable.options.orientation, "horizontal");
        equal(gantt._resizeDraggable.options.handle, ".k-splitbar");
    });

    test("adds css class when rowHeight option is set", function() {
        var gantt = element.kendoGantt({ rowHeight: 100 }).data("kendoGantt");

        ok(gantt.wrapper.hasClass("k-gantt-rowheight"));
    });

    module("TaskDropDown", {
        setup: function() {
            jasmine.clock().install();
            element = $("<div/>");
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(element);
        }
    });

    test("initialize Popup widget", 2, function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;

        ok(dropDown.popup);
        ok(dropDown.popup instanceof kendo.ui.Popup);
    });

    test("default direction is 'down'", function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;

        equal(dropDown.options.direction, "down");
    });

    test("popup's anchor element is append button", function() {
        var gantt = setup();
        var popup = gantt.headerDropDown.popup;

        ok(popup.options.anchor.hasClass("k-gantt-create"));
    });

    test("footer's drop down direction is down", function() {
        var gantt = setup();
        var dropDown = gantt.footerDropDown;

        equal(dropDown.options.direction, "up");
    });

    test("footer's drop down open animation is slideIn:up", function() {
        var gantt = setup();
        var dropDown = gantt.footerDropDown;

        equal(dropDown.options.animation.open.effects, "slideIn:up");
    });

    test("css classes added to popup container", function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;

        ok(dropDown.list.hasClass("k-list-container"));
    });

    test("renders popup content list", 2, function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;

        ok(dropDown.list.children("ul").length);
        ok(dropDown.list.children("ul").hasClass("k-list k-reset"));
    });

    test("renders popup list's content", 7, function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;
        var actions = dropDown.options.messages.actions;

        equal(dropDown.list.find("li").length, 3);

        ok(dropDown.list.find("li").eq(0).hasClass("k-item"));
        equal(dropDown.list.find("li").eq(0).text(), actions.addChild);

        ok(dropDown.list.find("li").eq(1).hasClass("k-item"));
        equal(dropDown.list.find("li").eq(1).text(), actions.insertBefore);

        ok(dropDown.list.find("li").eq(2).hasClass("k-item"));
        equal(dropDown.list.find("li").eq(2).text(), actions.insertAfter);
    });

    test("renders list's item data attributes", 3, function() {
        var gantt = setup();
        var dropDown = gantt.headerDropDown;

        equal(dropDown.list.find("li").eq(0).attr("data-action"), "add");

        equal(dropDown.list.find("li").eq(1).attr("data-action"), "insert-before");

        equal(dropDown.list.find("li").eq(2).attr("data-action"), "insert-after");
    });
}());
