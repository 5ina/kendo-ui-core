(function() {
    var Scheduler = kendo.ui.Scheduler;
    var MonthView = kendo.ui.MonthView,
         keys = kendo.keys,
         container;

    function setup(options) {
        return new MonthView(container, $.extend(true, { eventHeight: 10, date: new Date(2013, 1, 2) }, options));
    }

    function setupGroupedScheduler(orientation) {
        return new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: orientation || "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
    }

    function createSelection(options) {
        return $.extend(true, {
            events: [],
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            isAllDay: true,
            groupIndex: 0
        },
            options
        );
    }

    module("Month View selection", {
        setup: function() {
            jasmine.clock().install();
            container = $('<div class="k-scheduler">')
        },
        teardown: function() {
            jasmine.clock().uninstall();
            if (container.data("kendomonth")) {
                container.data("kendomonth").destroy();
            }
            kendo.destroy(container);
        }
    });

    test("view select: selects the selection start slot", function() {
        var view = setup();
        var selection = createSelection();

        view.select(selection);

        equal(view.table.find("td.k-state-selected").index(), 6);
    });

    test("view select: selects the selection end slot", function() {
        var view = setup();
        var selection = createSelection();

        view.select(selection);

        equal(view.table.find("td.k-state-selected").index(), 6);
    });

    test("view select: selects slots between selection start/end", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 6)
        });

        view.select(selection);

        equal(view.table.find("td.k-state-selected").length, 3);
        equal(view.table.find("td.k-state-selected").eq(0).index(), 0);
        equal(view.table.find("td.k-state-selected").eq(1).index(), 1);
        equal(view.table.find("td.k-state-selected").eq(2).index(), 2);
    });

    test("view select: clears previous selected items", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1)
        });

        view.select(createSelection());
        view.select(selection);

        equal(view.table.find("td.k-state-selected").length, 1);
        equal(view.table.find("td.k-state-selected").eq(0).index(), 5);
    });

    test("view select: selects event", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [event.uid]
        });

        view.render([
            event
        ]);

        view.select(selection);

        equal(view.table.find(".k-state-selected").data("uid"), event.uid);
    });

    test("view select: slot is not selected if event is found", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [event.uid]
        });

        view.render([
            event
        ]);

        view.select(selection);

        equal(view.table.find(".k-state-selected").data("uid"), event.uid);
        ok(!view.table.find(".k-scheduler-table:last td").eq(5).hasClass("k-state-selected"));
    });

    test("view select: slot is selected if event is not found", function() {
        var view = setup();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [event.uid]
        });

        view.render([
            //the event is not rendered
        ]);

        view.table.find(".k-event").remove();

        view.select(selection);

        equal(view.table.find(".k-state-selected").length, 1);
        equal(view.table.find("td.k-state-selected").eq(0).index(), 5);
    });

    test("view select: selects multiple events", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event"
        });

        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [firstEvent.uid, secondEvent.uid]
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        view.select(selection);

        var selected = view.table.find(".k-state-selected");
        equal(selected.length, 2);
        equal(selected.eq(0).data("uid"), firstEvent.uid);
        equal(selected.eq(1).data("uid"), secondEvent.uid);
    });

    test("view select: clear previous selected event", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event"
        });

        view.render([
            firstEvent
        ]);

        view.select(createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [firstEvent.uid]
        }));

        view.render([
            secondEvent
        ]);

        view.select(createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            events: [secondEvent.uid]
        }));

        var selected = view.table.find(".k-state-selected");
        equal(selected.length, 1);
        equal(selected.data("uid"), secondEvent.uid);
    });

    test("view select: support selection when isAllDay is undefined", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2)
        });

        selection.isAllDay = undefined;

        view.select(selection);

        var selected = view.table.find(".k-state-selected");
        equal(selected.length, 1);
    });

    test("view move: right key move selection to next day", function() {
        var view = setup();
        var selection = createSelection();

        view.move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 1, 3));
        deepEqual(selection.end, new Date(2013, 1, 4));
    });

    test("view move: right key move range selection to the day after selection.end", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2)
        });

        view.move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 1, 2));
        deepEqual(selection.end, new Date(2013, 1, 3));
    });

    test("view move: on right key returns true", function() {
        var view = setup();
        var selection = createSelection();

        ok(view.move(selection, keys.RIGHT), "RIGHT key is not handled");
    });

    test("view move: on left key returns true", function() {
        var view = setup();
        var selection = createSelection();

        ok(view.move(selection, keys.LEFT), "LEFT key is not handled");
    });

    test("view move: left key move selection to the day before selection.end", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 3)
        });
        var prevDay = new Date(2013, 1, 2);

        view.move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 1, 1));
        deepEqual(selection.end, prevDay);
    });

    test("view move: on down key returns true", function() {
        var view = setup();
        var selection = createSelection();

        ok(view.move(selection, keys.DOWN), "DOWN key is not handled");
    });

    test("view move: down key move range selection to next week same day as selection.end", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2)
        });
        var nextDay = new Date(2013, 1, 9);

        view.move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 1, 8));
        deepEqual(selection.end, nextDay);
    });

    test("view move: on up key returns true", function() {
        var view = setup();
        var selection = createSelection();

        ok(view.move(selection, keys.UP), "UP key is not handled");
    });

    test("view move: up key move range selection to previous week same day as selection.end", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 7),
            end: new Date(2013, 1, 9)
        });
        var prevDay = new Date(2013, 1, 2);

        view.move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 1, 1));
        deepEqual(selection.end, prevDay);
    });

    test("view move: right key with shift move end selection to next day", function() {
        var view = setup();
        var startDate = new Date(2013, 1, 2);
        var endDate = new Date(2013, 1, 3);
        var selection = createSelection({
            start: startDate,
            end: endDate
        });

        view.move(selection, keys.RIGHT, true);

        deepEqual(selection.start, startDate);
        deepEqual(selection.end, new Date(2013, 1, 4));
    });

    test("view move: left key with shift move start selection to previous day", function() {
        var view = setup();
        var startDate = new Date(2013, 1, 2);
        var endDate = new Date(2013, 1, 3);
        var selection = createSelection({
            start: startDate,
            end: endDate
        });

        view.move(selection, keys.LEFT, true);

        deepEqual(selection.start, new Date(2013, 1, 1));
        deepEqual(selection.end, endDate);
    });

    test("view move: left key with shift twice move start selection to previous day", function() {
        var view = setup();
        var startDate = new Date(2013, 1, 1);
        var selection = createSelection({
            start: startDate,
            end: new Date(2013, 1, 2)
        });

        view.move(selection, keys.LEFT, true);
        view.move(selection, keys.LEFT, true);

        deepEqual(selection.start, new Date(2013, 0, 30));
        deepEqual(selection.end, new Date(2013, 1, 2));
    });

    test("view move: left with shift with previous range selection", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 4),
            isAllDay: true
        });

        view.move(selection, keys.LEFT, true);

        deepEqual(selection.start, new Date(2013, 1, 2));
        deepEqual(selection.end, new Date(2013, 1, 3));
    });

    test("view move: up key with shift move end selection to previous week same day", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 9),
            end: new Date(2013, 1, 10)
        });

        view.move(selection, keys.UP, true);

        deepEqual(selection.start, new Date(2013, 1, 2));
        deepEqual(selection.end, new Date(2013, 1, 10));
    });

    test("view move: up key with shift move end selection to previous week same day (multiple selection)", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 12),
            end: new Date(2013, 1, 14)
        });

        view.move(selection, keys.UP, true);

        deepEqual(selection.start, new Date(2013, 1, 5));
        deepEqual(selection.end, new Date(2013, 1, 14));
    });

    test("view move: down key with shift move end selection to previous week same day (multiple selection)", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 12),
            end: new Date(2013, 1, 14)
        });

        view.move(selection, keys.DOWN, true);

        deepEqual(selection.start, new Date(2013, 1, 12));
        deepEqual(selection.end, new Date(2013, 1, 21));
    });

    test("view move: down key with shift move end selection to next week same day", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 3)
        });

        view.move(selection, keys.DOWN, true);

        deepEqual(selection.start, new Date(2013, 1, 2));
        deepEqual(selection.end, new Date(2013, 1, 10));
    });

    test("view move: clears selected event when key is handled", function() {
        var view = setup();
        var date = new Date(2013, 1, 2);
        var event = new kendo.data.SchedulerEvent({
            start: date,
            end: date,
            title: "one day event"
        });
        var selection = createSelection({
            start: date,
            end: date,
            events: [event.uid]
        });

        view.render([
            event
        ]);

        ok(view.move(selection, keys.LEFT));
        equal(selection.events.length, 0);
    });

    test("view moveToEvent: finds next closest event", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            isAllDay: true
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2),
            isAllDay: true
        });

        view.render([
            event
        ]);

        var found = view.moveToEvent(selection);

        equal(selection.events.length, 1);
        equal(selection.events[0], event.uid);
        ok(found);
    });

    test("view moveToEvent: returns false if event is not found", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1)
        });

        ok(!view.moveToEvent(selection));
    });

    test("view moveToEvent: updates selection to event slot", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1)
        });

        view.render([
            event
        ]);

        var found = view.moveToEvent(selection);

        equal(selection.events[0], event.uid);
        deepEqual(selection.start, event.start);
        deepEqual(selection.end, new Date(2013, 1, 3));
    });

    test("view moveToEvent: move selection from current event to next", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [firstEvent.uid]
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection));
        equal(selection.events.length, 1);
        equal(selection.events[0], secondEvent.uid);
    });

    test("view moveToEvent: with shift finds previous closest event", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3)
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], secondEvent.uid);
    });

    test("view moveToEvent: with shift finds previous closest event when selection is between events", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2)
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

    test("view moveToEvent: move selection from current event to previous", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            events: [secondEvent.uid]
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

    test("view moveToEvent: move selection from event to previous event in same slot", function() {
        QUnit.fixture.append(container);
        var view = setup();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "first event"
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "second event"
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [secondEvent.uid]
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

    test("constrainSelection sets selection to first slot of view", function() {
        var view = setup();
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

    test("view move doesn't modify the selection if range selection is out of current view", function() {
        var view = setup();
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2)
        });

        view.move(selection, keys.UP, true);

        deepEqual(selection.start, new Date(2013, 1, 2));
        deepEqual(selection.end, new Date(2013, 1, 2));
    });

    test("left key in horizontally grouped view selects previous group cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
        equal(selection.groupIndex, 0);
    });

    test("left key in horizontally grouped view selects last group cell on previous row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 5, 1));
        deepEqual(selection.end, new Date(2013, 5, 2));
        equal(selection.groupIndex, 1);
    });

    test("left key in horizontally grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 26),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 25));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view selects next group cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view selects first group cell on next row", function() {
        var scheduler = setupGroupedScheduler("horizontal");
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
        equal(selection.groupIndex, 0);
    });

    test("up key in horizontally grouped view persists group when change period", function() {
        var scheduler = setupGroupedScheduler("horizontal");

        var selection = createSelection({
            start: new Date(2013, 5, 1),
            end: new Date(2013, 5, 2),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 26));
        equal(selection.groupIndex, 1);
    });

    test("down key in horizontally grouped view persists group when change period", function() {
        var scheduler = setupGroupedScheduler("horizontal");

        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 13));
        deepEqual(selection.end, new Date(2013, 6, 14));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
        equal(selection.groupIndex, 0);
    });

    test("left key in vertically grouped view selects last cell on previous group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 27),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
        equal(selection.groupIndex, 0);
    });

    test("left key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 26),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 25));
        equal(selection.groupIndex, 1);
    });

    test("right key in vertically grouped view selects first cell on next group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 4, 26));
        deepEqual(selection.end, new Date(2013, 4, 27));
        equal(selection.groupIndex, 1);
    });

    test("right key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 6),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 7));
        equal(selection.groupIndex, 0);
    });

    test("up key in vertically grouped view selects in previous group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 27),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 5, 30));
        deepEqual(selection.end, new Date(2013, 6, 1));
        equal(selection.groupIndex, 0);
    });

    test("up key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 26),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 4, 19));
        deepEqual(selection.end, new Date(2013, 4, 19));
        equal(selection.groupIndex, 1);
    });

    test("down key in vertically grouped view selects in next group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 2),
            end: new Date(2013, 6, 2),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 4, 28));
        deepEqual(selection.end, new Date(2013, 4, 29));
        equal(selection.groupIndex, 1);
    });

    test("down key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 2),
            end: new Date(2013, 6, 3),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 9));
        deepEqual(selection.end, new Date(2013, 6, 10));
        equal(selection.groupIndex, 0);
    });

    test("shift + right key in horizontally grouped view", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 10));
        equal(selection.groupIndex, 0);
        equal(view.table.find(".k-state-selected").length, 2);
    });

    test("shift + right key in horizontally grouped view does not change groupIndex", function() {
        var scheduler = setupGroupedScheduler();
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 8),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 10));
        equal(selection.groupIndex, 1);
        equal(view.table.find(".k-state-selected").length, 2);
    });

    test("shift + right key in horizontally grouped view selects more then 2 rows", function() {
        var scheduler = setupGroupedScheduler();
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 16),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 17));
        equal(selection.groupIndex, 0);
    });

    test("shift + left key in horizontally grouped view selects more then 2 rows", function() {
        var scheduler = setupGroupedScheduler();
        var selection = createSelection({
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 16),
            groupIndex: 0,
            backward: true
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.LEFT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 5, 1));
        deepEqual(selection.end, new Date(2013, 5, 16));
        equal(selection.groupIndex, 0);
    });

    test("multiple selected slots does not change group shift + right", function() {
        var scheduler = setupGroupedScheduler();
        var selection = createSelection({
            start: new Date(2013, 6, 5),
            end: new Date(2013, 6, 7),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.RIGHT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 6, 5));
        deepEqual(selection.end, new Date(2013, 6, 7));
        equal(selection.groupIndex, 0);
    });

    test("shift + left key in horizontally grouped view does not change groupIndex", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"]
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.LEFT, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 5, 7));
        deepEqual(selection.end, new Date(2013, 5, 9));
        equal(selection.groupIndex, 1);
    });


    test("shift + down key in vertically grouped view is restricted to current group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        var view = scheduler.view();
        view.move(selection, keys.DOWN, true);
        view.select(selection);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
        equal(selection.groupIndex, 0);
        equal(view.table.find(".k-state-selected").length, 1);
    });

    test("left key in horizontally grouped view selects previous group cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            isAllDay: true,
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
        equal(selection.groupIndex, 0);
    });

    test("left key in horizontally grouped view selects previous date cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 3),
            end: new Date(2013, 5, 4),
            isAllDay: true,
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 5, 2));
        deepEqual(selection.end, new Date(2013, 5, 3));
        equal(selection.groupIndex, 1);
    });

    test("left key in horizontally grouped view selects last group cell on previous row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 2),
            end: new Date(2013, 5, 3),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 5, 1));
        deepEqual(selection.end, new Date(2013, 5, 2));
        equal(selection.groupIndex, 1);
    });

    test("left key in horizontally grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 26),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 25));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view selects next group cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 7),
            end: new Date(2013, 5, 8),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 5, 7));
        deepEqual(selection.end, new Date(2013, 5, 8));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view selects next date cell on same row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 7),
            end: new Date(2013, 5, 8),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 5, 8));
        deepEqual(selection.end, new Date(2013, 5, 9));
        equal(selection.groupIndex, 0);
    });

    test("right key in horizontally grouped view selects first group cell on next row", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
        equal(selection.groupIndex, 0);
    });

    test("up key in horizontally grouped view persists group when change period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });

        var selection = createSelection({
            start: new Date(2013, 5, 1),
            end: new Date(2013, 5, 2),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 26));
        equal(selection.groupIndex, 1);
    });

    test("down key in horizontally grouped view persists group when change period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });

        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 13));
        deepEqual(selection.end, new Date(2013, 6, 14));
        equal(selection.groupIndex, 1);
    });

    test("right key in horizontally grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
        equal(selection.groupIndex, 0);
    });

    test("left key in vertically grouped view selects last cell on previous group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 27),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 26));
        deepEqual(selection.end, new Date(2013, 4, 27));
        equal(selection.groupIndex, 0);
    });

    test("left key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 27),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 19));
        deepEqual(selection.end, new Date(2013, 4, 20));
        equal(selection.groupIndex, 1);
    });

    test("left key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 27),
            end: new Date(2013, 4, 27),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.LEFT);

        deepEqual(selection.start, new Date(2013, 4, 20));
        deepEqual(selection.end, new Date(2013, 4, 20));
        equal(selection.groupIndex, 1);
    });

    test("right key in vertically grouped view selects first cell on next group", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 6));
        deepEqual(selection.end, new Date(2013, 6, 7));
        equal(selection.groupIndex, 1);
    });

    test("right key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.RIGHT);

        deepEqual(selection.start, new Date(2013, 6, 13));
        deepEqual(selection.end, new Date(2013, 6, 14));
        equal(selection.groupIndex, 0);
    });

    test("up key in vertically grouped view selects in previous date", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 5),
            end: new Date(2013, 5, 6),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 5, 4));
        deepEqual(selection.end, new Date(2013, 5, 5));
        equal(selection.groupIndex, 1);
    });

    test("up key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 4, 26),
            end: new Date(2013, 4, 27),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.UP);

        deepEqual(selection.start, new Date(2013, 4, 25));
        deepEqual(selection.end, new Date(2013, 4, 26));
        equal(selection.groupIndex, 0);
    });

    test("down key in vertically grouped view selects in next date", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 5, 8),
            end: new Date(2013, 5, 9),
            groupIndex: 0
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 5, 9));
        deepEqual(selection.end, new Date(2013, 5, 10));
        equal(selection.groupIndex, 0);
    });

    test("down key in vertically grouped view changes view period", function() {
        var scheduler = new kendo.ui.Scheduler(container, {
            date: new Date(2013, 5, 6),
            group: {
                resources: ["ResourceName"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    name: "ResourceName",
                    dataSource: [
                        { text: "Foo 1", value: 1, color: "red" },
                        { text: "Foo 2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [],
            views: ["month"]
        });
        var selection = createSelection({
            start: new Date(2013, 6, 6),
            end: new Date(2013, 6, 7),
            groupIndex: 1
        });
        jasmine.clock().tick(1);
        scheduler.view().move(selection, keys.DOWN);

        deepEqual(selection.start, new Date(2013, 6, 7));
        deepEqual(selection.end, new Date(2013, 6, 8));
        equal(selection.groupIndex, 1);
    });

    function setupScheduler(options, selectedView) {
        options = options || {};
        selectedView = selectedView || "month";
        options = $.extend({
            views: [
                selectedView
            ],
            date: new Date(2013, 1, 1),
            views: [
                {
                    type: "month",
                }],
            group: {
                resources: ["Rooms"],
                date: true,
                orientation: "vertical"
            },
            resources: [
                {
                    field: "roomId",
                    name: "Rooms",
                    dataSource: [
                        { text: "Meeting Room 101", value: 1, color: "#6eb3fa" },
                        { text: "Meeting Room 201", value: 2, color: "#f58a8a" }
                    ],
                    title: "Room"
                }],
            dataSource: []
        }, options);

        QUnit.fixture.append(container);
        scheduler = new Scheduler(container, options);
    }

    test("grouped view view moveToEvent: finds next closest event", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            isAllDay: true,
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2),
            groupIndex: 0,
            isAllDay: true,
        });

        view.render([
            event
        ]);

        var found = view.moveToEvent(selection);

        equal(selection.events.length, 1);
        equal(selection.events[0], event.uid);
        ok(found);
    });

    test("grouped view moveToEvent: returns false if event is not found", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1)
        });

        ok(!view.moveToEvent(selection));
    });

    test("grouped view moveToEvent: updates selection to event slot", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var event = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            groupIndex: 0,
        });

        view.render([
            event
        ]);

        var found = view.moveToEvent(selection);

        equal(selection.events[0], event.uid);
        deepEqual(selection.start, event.start);
        deepEqual(selection.end, new Date(2013, 1, 3));
    });

    test("view moveToEvent: move selection from current event to next", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            roomId: 1
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2),
            events: [firstEvent.uid],
            groupIndex: 0,
            isAllDay: true
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection));
        equal(selection.events.length, 1);
        equal(selection.events[0], secondEvent.uid);
    });

    test("view moveToEvent: with shift finds previous closest event", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            roomId: 1
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 2),
            title: "one day event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 4),
            groupIndex: 0,
            isAllDay: true
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], secondEvent.uid);
    });

    test("view moveToEvent: with shift finds previous closest event when selection is between events", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            roomId: 1
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 2),
            end: new Date(2013, 1, 3),
            groupIndex: 0,
            isAllDay: true
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

    test("view moveToEvent: move selection from current event to previous", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "one day event",
            roomId: 1
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            title: "one day event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 3),
            end: new Date(2013, 1, 3),
            events: [secondEvent.uid],
            groupIndex: 0,
            isAllDay: true
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

    test("view moveToEvent: move selection from event to previous event in same slot", function() {
        setupScheduler();
        jasmine.clock().tick(1);
        var sch = $(container).data("kendoScheduler");
        var view = sch.view();
        var firstEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "first event",
            roomId: 1
        });
        var secondEvent = new kendo.data.SchedulerEvent({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            title: "second event",
            roomId: 1
        });
        var selection = createSelection({
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 1),
            events: [secondEvent.uid],
            groupIndex: 0,
            isAllDay: true
        });

        view.render([
            firstEvent,
            secondEvent
        ]);

        ok(view.moveToEvent(selection, true));
        equal(selection.events.length, 1);
        equal(selection.events[0], firstEvent.uid);
    });

})();
