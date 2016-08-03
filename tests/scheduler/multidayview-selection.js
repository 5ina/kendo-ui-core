(function() {
    var MultiDayView = kendo.ui.MultiDayView,
        SchedulerEvent = kendo.data.SchedulerEvent,
        keys = kendo.keys,
        container;

    var MyDayView = MultiDayView.extend({
        init: function(element, options) {
            var that = this;

            MultiDayView.fn.init.call(that, element, options);
        },
        calculateDateRange: function() {
            this._render(this.options.dates);
        }
    });

    function setup(options) {
        options = options || [];
        return new MyDayView(container, $.extend({ majorTick: 120 }, options));
    }

    function createSelection(options) {
        var start, end;
        if (options instanceof Date) {
            start = new Date(options);
            end = new Date(start.getTime() + (30 * kendo.date.MS_PER_MINUTE));
            options = {
                start: start,
                end: end
            };
        }

        return $.extend({ events: [], groupIndex: 0 }, options);
    }

    function module_setup() {
        container = $('<div class="k-scheduler" style="width:1000px;height:800px">');
    }

    function module_teardown() {
        if (container.data("kendoMultiDayView")) {
            container.data("kendoMultiDayView").destroy();
        }
    }

    module("Multi Day View selection", {
        setup: module_setup,
        teardown: module_teardown
    });

    test("constrainSelection sets selection to first slot of view", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var date = new Date(2013, 3, 1);
        var selection = createSelection({
            start: date,
            end: date
        });

        view.constrainSelection(selection);

        var slot = view.groups[0].firstSlot();

        deepEqual(selection.start, slot.startDate());
        deepEqual(selection.end, slot.endDate());
    });

    test("constrainSelection sets isAllDay to false if no daySlots", function() {
        var view = setup({
            dates: [new Date(2013, 6, 7)],
            allDaySlot: false
        });

        var selection = createSelection({
            start: new Date(2013, 6, 7, 10),
            end: new Date(2013, 6, 7, 10),
            isAllDay: true
        });

        view.constrainSelection(selection);

        equal(selection.isAllDay, false);
    });

    test("inRange method honour startTime/endTime of the view", function() {
        var view = setup({
            dates: [new Date(2013, 6, 7)],
            allDaySlot: false,
            showWorkHours: true,
            startTime: new Date(2013, 6, 7, 8),
            endTime: new Date(2013, 6, 7, 20)
        });

        var selection = createSelection({
            start: new Date(2013, 6, 7, 23, 30),
            end: new Date(2013, 6, 8)
        });

        ok(!view.inRange(selection));
    });

    test("View selects cell", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection(new Date(2013, 6, 7));

        view.select(selection);

        ok(view.content.find("table td:first").hasClass("k-state-selected"));
    });

    test("View selects multiple cells", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 30), end: new Date(2013, 6, 7, 2, 30) });

        view.select(selection);

        var allCells = view.content.find("table td"),
            cells = allCells.filter("td.k-state-selected");

        equal(cells.length, 3);
        equal(cells[0], allCells[0]);
        equal(cells[1], allCells[1]);
        equal(cells[2], allCells[2]);

    });

    test("View selects selection bigger than current column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 0, 0),
                end: new Date(2013, 6, 8, 2, 0)
            });

        view.select(selection);

        var allCells = view.content.find("table td"),
            cells = allCells.filter("td.k-state-selected");

        equal(cells.length, 26);
    });

    test("View selects selection between 3 columns", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8), new Date(2013, 6, 9)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 1), end: new Date(2013, 6, 9, 2, 30) });

        view.select(selection);

        var allCells = view.content.find("table td"),
            cells = allCells.filter("td.k-state-selected");

        equal(cells.length, 50);
    });

    test("View does not select allday if only last cell is selected", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8), new Date(2013, 6, 9)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 23, 30), end: new Date(2013, 6, 8) });

        view.select(selection);

        var cell = view.content.find("table td").filter("td.k-state-selected");

        equal(cell.length, 1);
        equal(view.datesHeader.find("td.k-state-selected").length, 0);
    });

    test("View does not select header cells if onlu one column is selected", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 30), end: new Date(2013, 6, 7, 2, 30) });

        view.select(selection);

        var cells = view.datesHeader.find("td.k-state-selected");

        equal(cells.length, 0);
    });

    test("View clear selection before new select", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });

        view.select(createSelection(new Date(2013, 6, 7)));
        view.select(createSelection(new Date(2013, 6, 7, 0, 30)));

        equal(view.content.find(".k-state-selected").length, 1);
    });

    test("View does not select content cells if selection starts from allDayEvent", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 30), end: new Date(2013, 6, 8, 0, 30), isAllDay: true });

        view.select(selection);

        var cells = view.datesHeader.find("td.k-state-selected");

        equal(cells.length, 2);
        equal(view.content.find("table td.k-state-selected").length, 0);
    });

    test("view continues events collection is populated with events", function() {
        var view = setup({
            dates: [ new Date(2013, 6, 7), new Date(2013, 6, 8) ]
        });
        var event1 = new SchedulerEvent({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            title: "Test"
        });
        var event2 = new SchedulerEvent({
            start: new Date(2013, 6, 8, 4),
            end: new Date(2013, 6, 8, 6),
            title: "Test"
        });

        view.render([
            event1,
            event2
        ]);

        var events = view.groups[0]._continuousEvents;

        equal(events.length, 2);
        equal(events[0].uid, event1.uid);
        equal(events[1].uid, event2.uid);
    });

    test("view continues events collection is populated with all day events", function() {
        var view = setup({
            dates: [ new Date(2013, 6, 7), new Date(2013, 6, 8) ]
        });
        var event1 = new SchedulerEvent({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7),
            isAllDay: true,
            title: "Test"
        });
        var event2 = new SchedulerEvent({
            start: new Date(2013, 6, 7, 4),
            end: new Date(2013, 6, 7, 6),
            title: "Test"
        });
        var event3 = new SchedulerEvent({
            start: new Date(2013, 6, 8, 4),
            end: new Date(2013, 6, 8, 6),
            title: "Test"
        });

        view.render([
            event1,
            event2,
            event3
        ]);

        var events = view.groups[0]._continuousEvents;

        equal(events.length, 3);
        equal(events[0].uid, event1.uid);
        equal(events[1].uid, event2.uid);
        equal(events[2].uid, event3.uid);
    });

    test("all day event must be before same day events", function() {
        var view = setup({
            dates: [
                new Date(2013, 6, 7),
                new Date(2013, 6, 8),
                new Date(2013, 6, 9),
            ]
        });
        var allDayEvent1 = new SchedulerEvent({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 9, 8),
            isAllDay: true,
            title: "Test"
        });
        var event1 = new SchedulerEvent({
            start: new Date(2013, 6, 7, 1),
            end: new Date(2013, 6, 7, 3),
            title: "Test"
        });
        var allDayEvent2 = new SchedulerEvent({
            start: new Date(2013, 6, 8, 2),
            end: new Date(2013, 6, 9, 8),
            isAllDay: true,
            title: "Test"
        });
        var event2 = new SchedulerEvent({
            start: new Date(2013, 6, 8, 1),
            end: new Date(2013, 6, 8, 6),
            title: "Test"
        });

        view.render([
            allDayEvent1,
            event1,
            allDayEvent2,
            event2
        ]);

        var events = view.groups[0]._continuousEvents;

        equal(events.length, 4);
        equal(events[0].uid, allDayEvent1.uid);
        equal(events[1].uid, event1.uid);
        equal(events[2].uid, allDayEvent2.uid);
        equal(events[3].uid, event2.uid);
    });

    test("continuous all day events must be in same order as rendered", function() {
        var view = setup({
            dates: [
                new Date(2013, 6, 7),
                new Date(2013, 6, 8),
                new Date(2013, 6, 9),
            ]
        });
        var allDayEvent1 = new SchedulerEvent({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7),
            isAllDay: true,
            title: "Test"
        });
        var allDayEvent2 = new SchedulerEvent({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 9, 4),
            isAllDay: true,
            title: "Test"
        });
        var event = new SchedulerEvent({
            start: new Date(2013, 6, 7, 1),
            end: new Date(2013, 6, 7, 3),
            title: "Test"
        });

        view.render([
            allDayEvent1,
            allDayEvent2,
            event
        ]);

        var events = view.groups[0]._continuousEvents;

        equal(events.length, 3);
        equal(events[0].uid, allDayEvent1.uid);
        equal(events[1].uid, allDayEvent2.uid);
        equal(events[2].uid, event.uid);
    });

    test("View select event by uid", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            uid = event.uid;

        view.render([
            event
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            events: [uid]
        });

        view.select(selection);

        equal(view.content.find("td.k-state-selected").length, 0);
        equal(view.content.find(".k-event").filter(".k-state-selected").length, 1);
    });

    test("View select multiple events by UIDs", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid1, uid2]
        });

        view.select(selection);

        equal(view.content.find("td.k-state-selected").length, 0);
        equal(view.content.find(".k-event").filter(".k-state-selected").length, 2);
    });

    test("View select cells if cannot find one of the selected events", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            uid = event.uid;

        view.render([
            event
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [kendo.guid()]
        });

        view.select(selection);

        equal(view.content.find("td.k-state-selected").length, 2);
        equal(view.content.find(".k-event").filter(".k-state-selected").length, 0);
    });

    test("View select only events found in current view", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid = event1.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid, kendo.guid()]
        });

        view.select(selection);

        equal(view.content.find("td.k-state-selected").length, 0);
        equal(view.content.find(".k-event").filter(".k-state-selected").length, 1);
        equal(view.content.find(".k-event.k-state-selected").data("uid"), uid);
    });

    test("View scrolls to the last selected event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid1, uid2]
        });

        view.select(selection);

        stub(view, {
            _scrollTo: view._scrollTo
        });

        view.select(selection);

        equal(view.calls("_scrollTo"), 1);
        equal(view.args("_scrollTo")[0], view.content.find(".k-event:last")[0]);
    });

    test("View select method scrolls to the first cell when start is bigger than end", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 8, 2, 0), end: new Date(2013, 6, 7) });

        stub(view, {
            _scrollTo: view._scrollTo
        });

        view.select(selection);

        var allCells = view.content.find("table td"),
            cells = allCells.filter("td.k-state-selected").eq(0);

        equal(view.args("_scrollTo")[0], cells[0]);
    });

    test("View selects last two cells", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 22), end: new Date(2013, 6, 8) });

        view.select(selection);

        var cells = view.content.find("table td").filter("td.k-state-selected");

        equal(cells.length, 2);
    });

    test("View selects last cell in view", 1, function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 8, 23, 30), end: new Date(2013, 6, 9) });

        view.select(selection);

        var cell = container.find(".k-scheduler-content td").last();

        ok(cell.hasClass("k-state-selected"));
    });

    test("View does not throw exception when pass invalid selection", 1, function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 6)] }),
            selection = createSelection({ start: new Date(2013, 6, 8, 23, 30), end: new Date(2013, 6, 9) });

        view.select(selection);
        ok(true);
    });

    module("Multi Day View navigation", {
        setup: module_setup,
        teardown: module_teardown
    });

    test("View moves selection with one day on right arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 1, 0) });

        view.move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 8));
        deepEqual(selection.end, new Date(2013, 6, 8, 1));
    });

    test("View clears selected events on right arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 2, 30), events:["1"] });

        view.move(selection, keys.RIGHT);

        equal(selection.events.length, 0);
    });

    test("View moves selection with one day on left arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 3) });

        view.move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 6, 3));
    });

    test("View clears selected events on left arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 2, 30), events:["1"] });

        view.move(selection, keys.LEFT);

        equal(selection.events.length, 0);
    });

    test("View correctly selects range on SHIFT + LEFT", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 8, 10), end: new Date(2013, 6, 8, 10) });

        view.move(selection, keys.LEFT, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 10));
        deepEqual(selection.end, new Date(2013, 6, 8, 10));
    });

    test("View moves selection with one slot on down arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 1, 0) });

        view.move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 7, 1, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 2, 0));
    });

    test("View increases selection on DOWN arrow + ShiftKey", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 0, 0),
                end: new Date(2013, 6, 7, 1)
            });

        view.move(selection, keys.DOWN, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View decreases selection on DOWN arrow + ShiftKey", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 8),
                end: new Date(2013, 6, 7, 10),
                backward: true
            });

        view.move(selection, keys.DOWN, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 9));
        deepEqual(selection.end, new Date(2013, 6, 7, 10));
    });

    test("View do nothing if Shift + DOWN when isAllDay", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7), end: new Date(2013, 6, 7), isAllDay: true });

        view.move(selection, keys.DOWN, true);

        ok(selection.isAllDay);
    });

    test("View shrink selection up to one slot on down arrow (selected events)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ uid: uid1, start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ uid: uid2, start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 8),
            events: [uid1, uid2]
        });

        view.move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 7, 8, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 9, 0));
    });

    test("View moves start with one interval if navigate backward more than a day", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 8, 2, 0),
                end: new Date(2013, 6, 8, 3, 0)
            });

        view.move(selection, keys.LEFT, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 2, 0));
        deepEqual(selection.end, new Date(2013, 6, 8, 3, 0));
    });

    test("View moves start with one interval backward if navigate from multiple columns to one cell", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 2, 0),
                end: new Date(2013, 6, 8, 3, 0),
                backward: true
            });

        view.move(selection, keys.RIGHT, true);

        deepEqual(selection.start, new Date(2013, 6, 8, 2, 0));
        deepEqual(selection.end, new Date(2013, 6, 8, 3, 0));
    });

    test("View navigates from start to upper slot (multiple selection)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 2, 0),
                end: new Date(2013, 6, 8, 3, 0)
            });

        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7, 1, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 2, 0));
    });

    test("View navigates from start to lower slot (multiple selection)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 2, 0),
                end: new Date(2013, 6, 8, 3, 0)
            });

        view.move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 8, 3, 0));
        deepEqual(selection.end, new Date(2013, 6, 8, 4, 0));
    });

    test("View selects first slot if isAllDay", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7, 0, 0),
                end: new Date(2013, 6, 8, 0, 0),
                isAllDay: true
            });

        view.move(selection, keys.DOWN);

        ok(!selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7, 0, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 1, 0));
    });

    test("View selects the first slot below the last selected allDay event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
        selection = createSelection({
            start: new Date(2013, 6, 7, 0, 0),
            end: new Date(2013, 6, 8, 0, 0),
            isAllDay: true
        });

        view.move(selection, keys.DOWN);

        ok(!selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7, 0, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 1, 0));
    });

    test("View moves selection to allDay if first slot was selected", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 1) });

        view.move(selection, keys.UP);

        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View does not move selection if allDay is selected", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 8, 0, 0), isAllDay: true });

        view.move(selection, keys.UP);

        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View moves selection to the left allDay event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({ start: new Date(2013, 6, 8), end: new Date(2013, 6, 9), isAllDay: true });

        view.move(selection, keys.LEFT);

        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View moves selection to the right allDay event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            selection = createSelection({
                start: new Date(2013, 6, 7),
                end: new Date(2013, 6, 8),
                isAllDay: true
            });

        view.move(selection, keys.RIGHT);

        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 8));
        deepEqual(selection.end, new Date(2013, 6, 9));
    });

    test("View moves selection outside of view range on LEFT", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7), end: new Date(2013, 6, 7, 1) });

        view.move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 6, 1));
    });

    test("View moves selection outside of view range on LEFT (AllDayEvent) ", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7), end: new Date(2013, 6, 8), isAllDay: true });

        view.move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
    });

    test("View moves selection outside of view range on RIGHT", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7), end: new Date(2013, 6, 7, 1) });

        view.move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 8));
        deepEqual(selection.end, new Date(2013, 6, 8, 1));
    });

    test("View moves selection outside of view range on RIGHT (AllDayEvent) ", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7), end: new Date(2013, 6, 8), isAllDay: true });

        view.move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 8));
        deepEqual(selection.end, new Date(2013, 6, 9));
    });

    test("View does nothing if allDaySlot is disabled", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)], allDaySlot: false }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0, 0), end: new Date(2013, 6, 7, 0) });

        view.move(selection, keys.UP);

        ok(!selection.isAllDay);
    });

    test("View moves selection to upper slot", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 1), end: new Date(2013, 6, 7, 2) });

        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View shrinks selection on up arrow", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 1), end: new Date(2013, 6, 7, 5) });

        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View shrinks selection on up arrow (when expanding down)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 1), end: new Date(2013, 6, 7, 5) });

        view.move(selection, keys.DOWN, true);
        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View shrinks selection on up arrow (when expanding up)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 4), end: new Date(2013, 6, 7, 5) });

        view.move(selection, keys.UP, true);
        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 3));
    });

    test("View decreases selection on UP", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 0), end: new Date(2013, 6, 7, 1) });

        view.move(selection, keys.UP, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View increases selection on UP", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 1), end: new Date(2013, 6, 7, 2), backward: true });

        view.move(selection, keys.UP, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View moves selection before first selected events", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ uid: uid1, start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ uid: uid2, start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 8),
            events: [uid1, uid2]
        });

        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 6, 7, 1));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View does not allow to move selection if end of column is reached", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7, 23, 30),
            end: new Date(2013, 6, 8)
        });

        view.move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 7, 23, 30));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View expand selection with one interval", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7, 1)
        });
        var shiftKey = true;

        view.move(selection, keys.DOWN, shiftKey);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View expand selection to end of the column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7, 22),
            end: new Date(2013, 6, 7, 23)
        });
        var shiftKey = true;

        view.move(selection, keys.DOWN, shiftKey);

        deepEqual(selection.start, new Date(2013, 6, 7, 22));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View moves selection with one slot on down arrow (ShiftKey)", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            selection = createSelection({ start: new Date(2013, 6, 7, 5, 0), end: new Date(2013, 6, 7, 6, 0) });

        view.move(selection, keys.DOWN, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 5, 0));
        deepEqual(selection.end, new Date(2013, 6, 7, 7, 0));
    });

    test("View expand selection with one interval in upper direction", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7, 1),
            end: new Date(2013, 6, 7, 2)
        });
        var shiftKey = true;

        view.move(selection, keys.UP, shiftKey);

        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View support shift up + down multiple selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7, 3),
            end: new Date(2013, 6, 7, 4)
        });
        var shiftKey = true;

        view.move(selection, keys.UP, shiftKey);
        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));

        view.move(selection, keys.DOWN, shiftKey);
        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 7, 3));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));

        view.move(selection, keys.DOWN, shiftKey);
        ok(!selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 7, 3));
        deepEqual(selection.end, new Date(2013, 6, 7, 5));

    });

    test("View backward selection does not allow to select allDay", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            backward: true,
            start: new Date(2013, 6, 7, 0),
            end: new Date(2013, 6, 7, 2)
        });

        var shiftKey = true;

        view.move(selection, keys.UP, shiftKey);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 2));
    });

    test("View forward selection does not allow to select timeSlot if Shift is pressed", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] });
        var selection = createSelection({
            backward: false,
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 8),
            isAllDay: true
        });

        var shiftKey = true;

        view.move(selection, keys.DOWN, shiftKey);

        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View selects two columns on backward selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7, 1)
        });

        var shiftKey = true;

        view.move(selection, keys.LEFT, shiftKey);

        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View selects initial slot after backward multiple selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7, 1)
        });

        var shiftKey = true;

        view.move(selection, keys.LEFT, shiftKey);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));

        view.move(selection, keys.RIGHT, shiftKey);

        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View selects initial slot after forward multiple selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 6, 1)
        });

        var shiftKey = true;

        view.move(selection, keys.RIGHT, shiftKey);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));

        view.move(selection, keys.LEFT, shiftKey);

        ok(!selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 6, 1));
    });

    test("View selects two all day cells on backward selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 8),
            isAllDay: true
        });

        var shiftKey = true;

        view.move(selection, keys.LEFT, shiftKey);

        ok(selection.backward);
        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View selects two columns on forward selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            backward: true,
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 6, 1)
        });

        var shiftKey = true;

        view.move(selection, keys.RIGHT, shiftKey);

        ok(!selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 1));
    });

    test("View selects two all day cells on forward selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            backward: true,
            isAllDay: true
        });

        var shiftKey = true;

        view.move(selection, keys.RIGHT, shiftKey);

        ok(!selection.backward);
        ok(selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 8));
    });

    test("View selects initial allDay cell after backward multiple selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 5), new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            isAllDay: true
        });

        var shiftKey = true;
        view.move(selection, keys.LEFT, shiftKey);

        ok(selection.isAllDay);
        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 5));
        deepEqual(selection.end, new Date(2013, 6, 7));

        view.move(selection, keys.RIGHT, shiftKey);

        ok(selection.isAllDay);
        ok(selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
    });

    test("View selects initial allDay cell after forward multiple selection", function() {
        var view = setup({ dates: [new Date(2013, 6, 5), new Date(2013, 6, 6), new Date(2013, 6, 7)] });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            isAllDay: true
        });

        var shiftKey = true;
        view.move(selection, keys.RIGHT, shiftKey);

        ok(selection.isAllDay);
        ok(!selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 8));

        view.move(selection, keys.LEFT, shiftKey);

        ok(selection.isAllDay);
        ok(!selection.backward);
        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
    });

    test("View moveToEvent method returns true if find an event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7, 1)
        });


        ok(view.moveToEvent(selection));
    });

    test("View moves to the first event after current slot", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7, 1)
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid1);
    });

    test("View moves to the closest event after current slot", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 4),
            end: new Date(2013, 6, 7, 4, 30)
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 7, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid2);
    });

    test("View moves to the next event in the column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            events: [uid1]
        });


        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 7, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid2);
    });

    test("View moves from all day event to the first event in next column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 7),
                end: new Date(2013, 6, 7),
                isAllDay: true,
                title: "Test"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 8, 6),
                end: new Date(2013, 6, 8, 8),
                title: "Test"
            }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7),
            events: [uid1],
            isAllDay: true
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 8, 6));
        deepEqual(selection.end, new Date(2013, 6, 8, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid2);
    });

    test("View moves from all day event to the last event in prev column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 8),
                end: new Date(2013, 6, 8),
                isAllDay: true,
                title: "Test1"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 8, 4),
                end: new Date(2013, 6, 8, 8),
                title: "Test2"
            }),
            event3 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 6),
                end: new Date(2013, 6, 7, 8),
                title: "Test3"
            });

        view.render([
            event1, event2, event3
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 8),
            end: new Date(2013, 6, 8),
            events: [event1.uid],
            isAllDay: true
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], event3.uid);
    });

    test("View moves from all day slot to the first event in same column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 2),
                end: new Date(2013, 6, 7, 4),
                title: "Test"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 6),
                end: new Date(2013, 6, 7, 8),
                title: "Test"
            });

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7),
            end: new Date(2013, 6, 7),
            events: [],
            isAllDay: true
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], event1.uid);
        ok(!selection.isAllDay);
    });

    test("View selects the last event in previous column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 8, 2),
                end: new Date(2013, 6, 8, 4),
                title: "Test"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 6),
                end: new Date(2013, 6, 7, 8),
                title: "Test"
            }),
            event3 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 2),
                end: new Date(2013, 6, 7, 4),
                title: "Test"
            });

        view.render([
            event1, event2, event3
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 8, 2),
            end: new Date(2013, 6, 8, 4),
            events: [ event1.uid ],
            isAllDay: false
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], event2.uid);
        ok(!selection.isAllDay);
    });

    test("View moves to the first event in the next column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 8, 6), end: new Date(2013, 6, 8, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            events: [uid1]
        });


        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 8, 6));
        deepEqual(selection.end, new Date(2013, 6, 8, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid2);
    });

    test("View moves to the next allDay event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 8, 0), end: new Date(2013, 6, 9, 0), title: "Test", isAllDay: true }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            events: [uid1]
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 8));
        deepEqual(selection.end, new Date(2013, 6, 9));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid2);
        equal(selection.isAllDay, true);
    });

    test("View moves to the first event in last column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8), new Date(2013, 6, 9)] }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 6),
                end: new Date(2013, 6, 7, 8),
                title: "Test"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 9, 2),
                end: new Date(2013, 6, 9, 4),
                title: "Test"
            });

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [ event1.uid ]
        });

        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 9, 2));
        deepEqual(selection.end, new Date(2013, 6, 9, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], event2.uid);
        ok(!selection.isAllDay);
    });

    test("View moves to the first event before current slot", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 10),
            end: new Date(2013, 6, 7, 11)
        });


        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 6));
        deepEqual(selection.end, new Date(2013, 6, 7, 8));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid);
    });

    test("View moves to the closest event before current slot", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 4),
            end: new Date(2013, 6, 7, 4, 30)
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid1);
    });

    test("View moves to the previous event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid2]
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid1);
    });

    test("View moves to the last event in previous column", function() {
        var view = setup({ dates: [new Date(2013, 6, 7)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 2), end: new Date(2013, 6, 7, 4), title: "Test" }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid2]
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 2));
        deepEqual(selection.end, new Date(2013, 6, 7, 4));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid1);
    });

    test("View moves to the previous all day event", function() {
        var view = setup({ dates: [new Date(2013, 6, 7), new Date(2013, 6, 8)] }),
            event1 = new SchedulerEvent({ start: new Date(2013, 6, 7, 0), end: new Date(2013, 6, 7, 0), title: "Test", isAllDay: true }),
            event2 = new SchedulerEvent({ start: new Date(2013, 6, 7, 6), end: new Date(2013, 6, 7, 8), title: "Test" }),
            uid1 = event1.uid,
            uid2 = event2.uid;

        view.render([
            event1, event2
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 6),
            end: new Date(2013, 6, 7, 8),
            events: [uid2]
        });

        view.moveToEvent(selection, true);

        deepEqual(selection.start, new Date(2013, 6, 7, 0));
        deepEqual(selection.end, new Date(2013, 6, 8, 0));
        equal(selection.events.length, 1);
        equal(selection.events[0], uid1);
        equal(selection.isAllDay, true);
    });

    test("move to next event when two events in same slot", function() {
        var view = setup({
                dates: [ new Date(2013, 6, 7), new Date(2013, 6, 8)]
            }),
            event1 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 2),
                end: new Date(2013, 6, 7, 4),
                title: "Test"
            }),
            event2 = new SchedulerEvent({
                start: new Date(2013, 6, 7, 2),
                end: new Date(2013, 6, 7, 4),
                title: "Test 2"
            }),
            event3 = new SchedulerEvent({
                start: new Date(2013, 6, 8, 1),
                end: new Date(2013, 6, 8, 2),
                title: "Test 3"
            });

        view.render([
            event1, event2, event3
        ]);

        var selection = createSelection({
            start: new Date(2013, 6, 7, 2),
            end: new Date(2013, 6, 7, 4),
            events: [ event1.uid ]
        });

        view.moveToEvent(selection);
        view.moveToEvent(selection);

        deepEqual(selection.start, new Date(2013, 6, 8, 1));
        deepEqual(selection.end, new Date(2013, 6, 8, 2));
        equal(selection.events.length, 1);
        equal(selection.events[0], event3.uid);
    });

    function setupGroupedScheduler(orientation, view) {
        orientation = orientation || "horizontal";

        scheduler = new kendo.ui.Scheduler(container, {
            date: new Date("2013/6/8"),
            group: {
                resources: ["ResourceName", "ResourceName2"],
                orientation: orientation
            },
            resources: [
                {
                    field: "rooms",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Room1", value: 1 },
                        { text: "Room2", value: 2 }
                    ]
                },
                {
                    field: "persons",
                    name: "ResourceName2",
                    dataSource: [
                        { text: "Fred", value: 1 },
                        { text: "Barny", value: 2 }
                    ]
                }
            ],
            views: [ view || "week" ]
        });
    }

    function bindGroupedScheduler() {
        scheduler.dataSource.data([
            { title: "Room1 - Fred", start: new Date(2013, 5, 8, 4), end: new Date(2013, 5, 8, 6), rooms: 1, persons: 1 },
            { title: "Room1 - Fred", start: new Date(2013, 5, 8, 8), end: new Date(2013, 5, 8, 10), rooms: 1, persons: 1 },
            { title: "Room1 - Barny", start: new Date(2013, 5, 8, 4), end: new Date(2013, 5, 8, 6), rooms: 1, persons: 2 },
            { title: "Room1 - Barny", start: new Date(2013, 5, 8, 8), end: new Date(2013, 5, 8, 10), rooms: 1, persons: 2 },
            { title: "Room2 - Fred", start: new Date(2013, 5, 8, 4), end: new Date(2013, 5, 8, 6), rooms: 2, persons: 1 },
            { title: "Room2 - Fred", start: new Date(2013, 5, 8, 8), end: new Date(2013, 5, 8, 10), rooms: 2, persons: 1 },
            { title: "Room2 - Barny", start: new Date(2013, 5, 8, 4), end: new Date(2013, 5, 8, 6), rooms: 2, persons: 2 },
            { title: "Room2 - Barny", start: new Date(2013, 5, 8, 8), end: new Date(2013, 5, 8, 10), rooms: 2, persons: 2 }
        ]);
    }

    module("Horizontally grouped Multi Day View selection", {
        setup: module_setup,
        teardown: function() {
            kendo.destroy(container);
        }
    });

    test("View select method selects cell in first group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();

        var start = new Date(2013, 5, 8, 1);
        var end = new Date(2013, 5, 8, 1, 30);
        var selection = {
            end: end,
            start: start,
            events: [],
            groupIndex: 0
        };

        view.select(selection);

        var td = view.content.find(".k-state-selected")[0];

        var slot = view.groups[0].ranges(start, start, false, false)[0].start;

        equal(td, slot.element);
    });

    test("View select method selects cell in second group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var start = new Date(2013, 5, 8, 1);
        var end = new Date(2013, 5, 8, 1, 30);
        var selection = {
            start: start,
            end: end,
            events: [],
            groupIndex: 1
        };

        view.select(selection);

        var td = view.content.find(".k-state-selected")[0];

        var slot = view.groups[1].ranges(start, start, false, false)[0].start;

        equal(td, slot.element);
    });

    test("View select method selects multiple columns in second group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 7, 1);
        var selection = {
            start: start,
            end: new Date(2013, 5, 8, 1, 30),
            events: [],
            groupIndex: 1
        };

        view.select(selection);

        var cells = view.content.find(".k-state-selected");
        var slot = view.groups[1].ranges(start, start, false, false)[0].start;

        equal(cells.length, 49);
        equal(cells[2], slot.element);
    });

    test("View select method selects only in view range", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 8, 1);
        var end = new Date(2013, 5, 10);
        var selection = {
            start: start,
            end: end,
            events: [],
            groupIndex: 1
        };

        view.select(selection);

        var cells = view.content.find(".k-state-selected");
        var ranges = view.groups[1].ranges(start, end, false, false);

        equal(cells.length, 46);
        equal(cells[0], ranges[0].start.element);
        equal(cells[cells.length - 1], ranges[ranges.length - 1].end.element);
    });

    test("View select method selects cells in three columns", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 6, 0);
        var end = new Date(2013, 5, 10);
        var selection = {
            start: new Date(2013, 5, 6, 0),
            end: new Date(2013, 5, 10),
            events: [],
            groupIndex: 1
        };

        view.select(selection);

        var cells = view.content.find(".k-state-selected");
        var ranges = view.groups[1].ranges(start, end, false, false);

        equal(cells.length, 144);
        equal(cells[0], ranges[0].start.element);
        equal(cells[cells.length - 1], ranges[ranges.length - 1].end.element);
    });

    test("View selects allDay cell in first group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 8);

        var selection = {
            start: start,
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.select(selection);

        var cell = view.datesHeader.find(".k-state-selected")[0];
        var slot = view.groups[0].ranges(start, start, true, false)[0].start;

        equal(cell, slot.element);
    });

    test("View selects allDay cell in second group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 8);
        var selection = {
            start: start,
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);

        var cell = view.datesHeader.find(".k-state-selected")[0];
        var slot = view.groups[1].ranges(start, start, true, false)[0].start;

        equal(cell, slot.element);
    });

    test("View selects all day slot in second group", function() {
        setupGroupedScheduler();

        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);

        var cell = view.datesHeader.find(".k-state-selected")[0];

        equal(cell, view.groups[1].ranges(selection.start, selection.end, true)[0].start.element);
    });

    test("View selects first event", function() {
        setupGroupedScheduler();
        bindGroupedScheduler();

        var model = scheduler.dataSource.data()[0];
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8, 1),
            groupIndex: 0,
            events: [model.uid]
        };

        view.select(selection);

        var event = view.content.find("[data-uid=" + model.uid + "]");

        ok(event.hasClass("k-state-selected"));
    });

    test("View does not select multiple allDay slots in different groups", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 10),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.select(selection);

        equal(selection.groupIndex, 0);
        equal(view.datesHeader.find(".k-state-selected").length, 1);
    });

    test("View moves to the last cells in the current group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 7, 3),
            end: new Date(2013, 5, 7, 4),
            groupIndex: 0,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 8, 3));
        deepEqual(selection.end, new Date(2013, 5, 8, 4));
    });

    test("View moves to the first cells in the current group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3, 3),
            end: new Date(2013, 5, 3, 4),
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 2, 3));
        deepEqual(selection.end, new Date(2013, 5, 2, 4));
    });

    test("View moves the selection to the next group", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8, 0, 30),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT);
        view.select(selection);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 2, 0, 30));
    });

    test("View moves the selection to the next group (AllDay cell)", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT);
        view.select(selection);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

    test("View navigates to next period if last group has been reached", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8, 0, 30),
            isAllDay: false,
            groupIndex: 3,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 9, 0, 30));
    });

    test("View navigates to next period if last group has been reached (all day cell)", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 3,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
    });

    test("View moves the selection to the next group (day view)", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8, 0, 30),
            isAllDay: false,
            groupIndex: 0,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.RIGHT);
        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 2);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 8, 0, 30));
    });

    test("View does not allow multiple selection if end moves to the next group", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        equal(selection.groupIndex, 0);
        equal(view.datesHeader.find(".k-state-selected").length, 1);
    });

    test("View moves the selection to the prev group (AllDay cell)", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 2),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View navigates to prev period if first group has been reached", function() {
        setupGroupedScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 3),
            end: new Date(2013, 5, 2, 3, 30),
            groupIndex: 0,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start, new Date(2013, 5, 1, 3));
        deepEqual(selection.end, new Date(2013, 5, 1, 3, 30));
    });

    test("View moves the selection to the prev group", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8, 0, 30),
            groupIndex: 2,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT);
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 8, 0, 30));
    });

    test("View moves the selection to the prev group (all day cell)", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 2,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT);
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does not move selection to previous group on UP key", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.UP);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does not move selection to next group on DOWN key", function() {
        setupGroupedScheduler("horizontal", "day");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 1);
        deepEqual(new Date(2013, 5, 8, 23, 30), selection.start);
        deepEqual(new Date(2013, 5, 9), selection.end);
    });

    test("View does not move selection if SHIFT + DOWN", function() {
        setupGroupedScheduler("horizontal");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 2,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.UP, true);

        equal(selection.groupIndex, 2);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does not move selection if SHIFT + UP", function() {
        setupGroupedScheduler("horizontal");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.UP, true);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    module("Vertically grouped Multi Day View selection/navigation", {
        setup: module_setup,
        teardown: function() {
            kendo.destroy(container);
        }
    });

    test("View select method selects cell in the first group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            events: [],
            groupIndex: 0
        };

        view.select(selection);

        var td = view.content.find(".k-state-selected")[0];
        var start = new Date(2013, 5, 8, 23, 30);
        var slot = view.groups[0].ranges(start, start, false, false)[0].start;

        equal(td, slot.element);
    });

    test("View select method selects cell in the second group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            events: [],
            groupIndex: 1
        };

        view.select(selection);

        var td = view.content.find(".k-state-selected")[0];
        var start = new Date(2013, 5, 8, 23, 30);
        var slot = view.groups[1].ranges(start, start, false, false)[0].start;

        equal(td, slot.element);
    });

    test("View select method selects multiple columns only in one group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var start = new Date(2013, 5, 7, 23, 30);
        var end = new Date(2013, 5, 9);

        var selection = {
            start: start,
            end: end,
            events: [],
            groupIndex: 1
        };

        view.select(selection);
        var cells = view.content.find(".k-state-selected");
        var ranges = view.groups[1].ranges(start, end, false, false);

        equal(cells.length, 49);
        equal(cells[47], ranges[0].start.element);
        equal(cells[48], ranges[1].end.element);

    });

    test("View selects allDay cell in first group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();

        var start = new Date(2013, 5, 8);
        var end = new Date(2013, 5, 9);

        var selection = {
            start: start,
            end: end,
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.select(selection);

        var cell = view.content.find(".k-state-selected")[0];
        var slot = view.groups[0].ranges(start, start, true, false)[0].start;

        equal(cell, slot.element);
    });

    test("View selects allDay cell in second group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();

        var start = new Date(2013, 5, 8);
        var end = new Date(2013, 5, 9);

        var selection = {
            start: start,
            end: end,
            isAllDay: true,
            groupIndex: 1,
            events: []
        };
        view.select(selection);

        var cell = view.content.find(".k-state-selected")[0];
        var slot = view.groups[1].ranges(start, start, true, false)[0].start;

        equal(cell, slot.element);
    });

    test("View moves selection to the next group allDay slot", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, true);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does nothing when end of the view is reached", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start, new Date(2013, 5, 8, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View moves selection to the prev group", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.UP);

        equal(selection.groupIndex, 0);
        ok(!selection.isAllDay);
        deepEqual(selection.start, new Date(2013, 5, 8, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does nothing if first slot if view is reached", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };
        view.move(selection, keys.UP);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View changes period on RIGHT", function() {
        setupGroupedScheduler("vertical", "day");

        scheduler.date(new Date(2013, 5, 8));
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };
        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
    });

    test("View changes period on LEFT", function() {
        setupGroupedScheduler("vertical", "day");

        scheduler.date(new Date(2013, 5, 8));
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };
        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start, new Date(2013, 5, 7));
        deepEqual(selection.end, new Date(2013, 5, 8));
    });

    test("View does not move selection if SHIFT + RIGHT", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 2,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        equal(selection.groupIndex, 2);
        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

    test("View does not move selection if SHIFT + LEFT", function() {
        setupGroupedScheduler("vertical");
        scheduler.wrapper.focus();
        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.select(selection);
        view.move(selection, keys.LEFT, true);

        equal(selection.groupIndex, 1);
        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });


     function setupGroupedByDateScheduler(orientation, view) {
        orientation = orientation || "horizontal";

        scheduler = new kendo.ui.Scheduler(container, {
            date: new Date("2013/6/8"),
            group: {
                resources: ["ResourceName", "ResourceName2"],
                date: true,
                orientation: orientation
            },
            resources: [
                {
                    field: "rooms",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Room1", value: 1 },
                        { text: "Room2", value: 2 }
                    ]
                },
                {
                    field: "persons",
                    name: "ResourceName2",
                    dataSource: [
                        { text: "Fred", value: 1 },
                        { text: "Barny", value: 2 }
                    ]
                }
            ],
            views: [ view || "week" ]
        });
    }

    function setupGroupedByDateSchedulerWorkWeek(orientation, view, start, end) {
        orientation = orientation || "horizontal";

        scheduler = new kendo.ui.Scheduler(container, {
            date: new Date("2013/6/8"),
            group: {
                resources: ["ResourceName", "ResourceName2"],
                date: true,
                orientation: orientation
            },
            workWeekStart: start,
            workWeekEnd: end,
            resources: [
                {
                    field: "rooms",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Room1", value: 1 },
                        { text: "Room2", value: 2 }
                    ]
                },
                {
                    field: "persons",
                    name: "ResourceName2",
                    dataSource: [
                        { text: "Fred", value: 1 },
                        { text: "Barny", value: 2 }
                    ]
                }
            ],
            views: [ view || "workWeek" ]
        });
    }


     module("Horizontally grouped by date Multi Day View selection", {
        setup: module_setup,
        teardown: function() {
            kendo.destroy(container);
        }
    });

     test("View select method selects cell in first group", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();
        var view = scheduler.view();

        var start = new Date(2013, 5, 8, 1);
        var end = new Date(2013, 5, 8, 1, 30);
        var selection = {
            end: end,
            start: start,
            events: [],
            groupIndex: 0
        };

        view.select(selection);

        var td = view.content.find(".k-state-selected")[0];

        var slot = view.groups[0].ranges(start, start, false, false)[0].start;

        equal(td, slot.element);
    });

      test("View moves selection to the next group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3, 23, 30),
            end: new Date(2013, 5, 4),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 3, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 4));
    });

    test("View moves selection to the next date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3, 23, 30),
            end: new Date(2013, 5, 4),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 4, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 5));
    });

     test("View moves selection to the next visible date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 00),
            end: new Date(2013, 5, 8, 23, 30),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start,  new Date(2013, 5, 9, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 9, 23, 30));
    });

     test("View moves allday selection to the next group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 3));
        deepEqual(selection.end, new Date(2013, 5, 4));
    });

    test("View moves allday selection to the next date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 4));
        deepEqual(selection.end, new Date(2013, 5, 5));
    });

     test("View moves selection to the next date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            isAllDay: true,
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
     });

    test("View moves selection to the prev group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3, 23, 30),
            end: new Date(2013, 5, 4),
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 3, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 4));
    });

    test("View moves selection to the prev date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3, 23, 30),
            end: new Date(2013, 5, 4),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the prev visible date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 00),
            end: new Date(2013, 5, 2, 23, 30),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start,  new Date(2013, 5, 1, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 1, 23, 30));
    });

      test("View moves selection to the prev visible date and group slot workWeek", function() {
        setupGroupedByDateSchedulerWorkWeek("horizontal","workWeek", 1 ,5);
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 00),
            end: new Date(2013, 5, 2, 23, 30),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start,  new Date(2013, 4, 31, 23, 00));
        deepEqual(selection.end, new Date(2013, 4, 31, 23, 30));
    });

    test("View moves selection to the prev visible date and group slot workWeek starts on sunday", function() {
        setupGroupedByDateSchedulerWorkWeek("horizontal","workWeek", 0 ,3);
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 00),
            end: new Date(2013, 5, 2, 23, 30),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start,  new Date(2013, 4, 29, 23, 00));
        deepEqual(selection.end, new Date(2013, 4, 29, 23, 30));
    });

   test("View moves selection to the prev visible date and group slot workWeek ends on saturday", function() {
        setupGroupedByDateSchedulerWorkWeek("horizontal","workWeek", 3 ,6);
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 5, 23, 00),
            end: new Date(2013, 5, 5, 23, 30),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        deepEqual(selection.start,  new Date(2013, 5, 1, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 1, 23, 30));
    });

test("View moves selection to the next visible date and group slot workWeek", function() {
        setupGroupedByDateSchedulerWorkWeek();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 7, 23, 00),
            end: new Date(2013, 5, 7, 23, 30),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start,  new Date(2013, 5, 10, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 10, 23, 30));
    });

    test("View moves selection to the next visible date and group slot workWeek starts on sunday", function() {
        setupGroupedByDateSchedulerWorkWeek("horizontal","workWeek", 0 ,3);
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 5, 23, 00),
            end: new Date(2013, 5, 5, 23, 30),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start,  new Date(2013, 5, 9, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 9, 23, 30));
    });

   test("View moves selection to the next visible date and group slot workWeek ends on saturday", function() {
        setupGroupedByDateSchedulerWorkWeek("horizontal","workWeek", 3 ,6);
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 00),
            end: new Date(2013, 5, 8, 23, 30),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        deepEqual(selection.start,  new Date(2013, 5, 12, 23, 00));
        deepEqual(selection.end, new Date(2013, 5, 12, 23, 30));
    });


     test("View moves allday selection to the prev group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 2,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 3));
        deepEqual(selection.end, new Date(2013, 5, 4));
    });

    test("View moves allday selection to the prev date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the prev visible date and group slot", function() {
        setupGroupedByDateScheduler();
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 1));
        deepEqual(selection.end, new Date(2013, 5, 2));
     });

     module("Vertically grouped by date Multi Day View selection", {
        setup: module_setup,
        teardown: function() {
            kendo.destroy(container);
        }
     });

    
      test("View moves selection to the next group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the first group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 3,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the prev group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the last group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });



     test("View moves allday selection to the next group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            groupIndex: 0,
            isAllDay: true,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves allday selection to the first group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 3,
            isAllDay: true,
            events: []
        };

        view.move(selection, keys.RIGHT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves allday selection to the prev group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 1,
            isAllDay: true,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves allday selection to the last group slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.LEFT);

        equal(selection.groupIndex, 3);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

    /////

     test("View moves selection to the next date slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 3));
        deepEqual(selection.end, new Date(2013, 5, 4));
    });

     test("View moves selection to the first date slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.UP);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the prev date slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            isAllDay: false,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, true);
        deepEqual(selection.start,  new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 9));
    });

     test("View moves selection to the next date slot", function() {
        setupGroupedByDateScheduler("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.UP);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 1, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 1));
    });

     function setupGroupedByDateSchedulerNoALLDay(orientation, view) {
        orientation = orientation || "horizontal";

        scheduler = new kendo.ui.Scheduler(container, {
            date: new Date("2013/6/8"),
            group: {
                resources: ["ResourceName", "ResourceName2"],
                date: true,
                orientation: orientation
            },
            allDaySlot: false,
            resources: [
                {
                    field: "rooms",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Room1", value: 1 },
                        { text: "Room2", value: 2 }
                    ]
                },
                {
                    field: "persons",
                    name: "ResourceName2",
                    dataSource: [
                        { text: "Fred", value: 1 },
                        { text: "Barny", value: 2 }
                    ]
                }
            ],
            views: [ view || "week" ]
        });
    }

     test("View moves selection to the next date slot not allday", function() {
        setupGroupedByDateSchedulerNoALLDay("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2, 23, 30),
            end: new Date(2013, 5, 3),
            groupIndex: 0,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 0);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 3));
        deepEqual(selection.end, new Date(2013, 5, 3, 0, 30));
    });

     test("View moves selection to the previous date slot not allday", function() {
        setupGroupedByDateSchedulerNoALLDay("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 3, 0, 30),
            isAllDay: false,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.UP);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 2, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 3));
    });

     test("View moves selection to the prev date slot not allday", function() {
        setupGroupedByDateSchedulerNoALLDay("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 8, 23, 30),
            end: new Date(2013, 5, 9),
            isAllDay: false,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.DOWN);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 9, 0, 30));
    });

     test("View moves selection to the next date slot not allday", function() {
        setupGroupedByDateSchedulerNoALLDay("vertical");
        scheduler.wrapper.focus();

        var view = scheduler.view();
        var selection = {
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3, 0, 30),
            isAllDay: false,
            groupIndex: 1,
            events: []
        };

        view.move(selection, keys.UP);

        equal(selection.groupIndex, 1);
        equal(selection.isAllDay, false);
        deepEqual(selection.start,  new Date(2013, 5, 1, 23, 30));
        deepEqual(selection.end, new Date(2013, 5, 1));
    });
})();
