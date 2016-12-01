(function() {
    var div;

    function equalWithRound(value, expected) {
        QUnit.close(value, expected, 4);
    }

    module("moving", {
        setup: function() {
            jasmine.clock().install();
            div = $("<div>").width(500).height(1000);
            div.appendTo(QUnit.fixture);
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(QUnit.fixture);
            $(".k-window, .k-overlay").remove();
        }
    });

    test("hint shows start and end time when moving event in week view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
         jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, handle.offset());
        drag(scheduler, handle, slots.eq(1).offset());

        equal($(".k-event-drag-hint .k-event-time").text(), "10:30 AM - 11:30 AM");
    });

    test("hint shows updated start and end time when moving event in week view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
         jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(1));
        jasmine.clock().tick(1);
        handle = div.find(".k-event");

        dragstart(scheduler, handle, handle.offset());

        jasmine.clock().tick(1);

        drag(scheduler, handle, slots.eq(2).offset());
        equal($(".k-event-drag-hint .k-event-time").text(), "11:00 AM - 12:00 PM");

    });

    test("hint shows north icon when start time is before the start of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, slots.eq(1).offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-up").length, 1);
    });

    test("hint shows west icon when start time is before the start of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/3 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragstart(scheduler, handle, slots.eq(1).offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-left").length, 1);
    });

    test("hint shows east icon when end time is after the end of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/7 10:00"), end: new Date("2013/6/8 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragstart(scheduler, handle, slots.eq(5).offset());

        drag(scheduler, handle, slots.eq(6).offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-right").length, 1);
    });

    test("hint shows south icon when end time is after the end of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:30"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.last().offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-down").length, 1);
    });

    test("hint shows west icon when the start time is before the start of the month view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/26 10:00"), end: new Date("2013/5/27 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, slots.eq(1).offset());

        drag(scheduler, handle, slots.first().offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-left").length, 1);
    });

    test("move hint in month view is two slots long when the event is two days long", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/26 10:00"), end: new Date("2013/5/28 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(3)");

        dragstart(scheduler, handle, slots.eq(0).prev().offset());

        drag(scheduler, handle, slots.first().offset());

        equalWithRound($(".k-event-drag-hint").outerWidth(), 2 * slots.first().outerWidth());
    });

    test("move hint in week view is two slots long when the event is two days long", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/4 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td:nth-child(3)");

        dragstart(scheduler, handle, slots.eq(0).prev().offset());

        drag(scheduler, handle, slots.first().offset());

        equalWithRound($(".k-event-drag-hint").outerWidth(), 2 * slots.first().outerWidth());
    });

    test("move hint in month view is two slots long when the event is all day two days long", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/26 12:00 AM"), end: new Date("2013/5/27 12:00 AM"), isAllDay: true, title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(3)");

        dragstart(scheduler, handle, slots.eq(0).prev().offset());

        drag(scheduler, handle, slots.first().offset());

        equalWithRound($(".k-event-drag-hint").outerWidth(), 2 * slots.first().outerWidth());
    });

    test("moving the occurrence shows the dialog if editable is object but no editRecurringMode is set", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            editable: {},
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal($(".k-window-title").text(), "Edit Recurring Item");
    });

    test("moving the occurrence changes the start of the series when editRecurringMode is set to series", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            editable: {
                editRecurringMode: "series"
            },
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).start.getHours(), 11);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).start.getDate(), 28);
        equal(scheduler.dataSource.at(0).start.getMonth(), 4);
    });

    test("moving the occurrence changes the start of the occurrence when editRecurringMode is set to occurrence", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 11:00"),
            views: ["month"],
            editable: {
                editRecurringMode: "occurrence"
            },
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(1).start.getHours(), 11);
        equal(scheduler.dataSource.at(1).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(1).start.getDate(), 28);
        equal(scheduler.dataSource.at(1).start.getMonth(), 4);
    });

    test("moving the occurrence changes the start of the series if the edit series button is clicked", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        $(".k-window .k-button:last").click();

        equal(scheduler.dataSource.at(0).start.getHours(), 11);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).start.getDate(), 28);
        equal(scheduler.dataSource.at(0).start.getMonth(), 4);
    });

    test("moving the occurrence changes the start of the exception if the edit occurence button is clicked", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 11:00"),
            views: ["month"],
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        $(".k-window .k-button:first").click();

        equal(scheduler.dataSource.at(1).start.getHours(), 11);
        equal(scheduler.dataSource.at(1).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(1).start.getDate(), 28);
        equal(scheduler.dataSource.at(1).start.getMonth(), 4);
    });

    test("moving the recurrence head changes the start of the series if the edit series button is clicked", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:first");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(1));

        $(".k-window .k-button:last").click();

        equal(scheduler.dataSource.at(0).start.getHours(), 11);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).start.getDate(), 27);
        equal(scheduler.dataSource.at(0).start.getMonth(), 4);
    });

    test("moving the recurrence head changes the start of the exception if the edit occurence button is clicked", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 11:00"),
            views: ["month"],
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:first");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        $(".k-window .k-button:first").click();

        equal(scheduler.dataSource.at(1).start.getHours(), 11);
        equal(scheduler.dataSource.at(1).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(1).start.getDate(), 28);
        equal(scheduler.dataSource.at(1).start.getMonth(), 4);
    });

    test("moving the recurrence head removes all exceptions", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/5/26"),
            views: ["week"],
            dataSource: [
                { id: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "", recurrenceRule: "FREQ=DAILY;COUNT=2" },
                { id: 2, recurrenceId: 1, start: new Date("2013/5/26 11:00"), end: new Date("2013/5/26 11:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:first");

        var slot = div.find(".k-scheduler-content tr").eq(0).find("td").eq(0);

        dragdrop(scheduler, handle, slot);

        $(".k-window .k-button:last").click();

        equal(scheduler.dataSource.data().length, 1);
    });

    test("hint shows east icon when the end time is after the end of the month view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/7/5 10:00"), end: new Date("2013/7/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, slots.last().prev().offset());

        drag(scheduler, handle, slots.last().offset());

        equal($(".k-event-drag-hint .k-i-arrow-60-right").length, 1);
    });

    test("moving event in day view changes its start time", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 30);
        equal(scheduler.dataSource.at(0).start.getDate(), 6);
    });

    tzTest("Sofia", "moving event in day view honours DST", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2014/3/30"),
            startTime: new Date("2014/3/30"),
            dataSource: [
                { start: new Date("2014/3/30"), end: new Date("2014/3/30 00:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(5));

        equal(scheduler.dataSource.at(0).start.getHours(), 2);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 30);

        equal(scheduler.dataSource.at(0).end.getHours(), 4);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
    });

    test("moving event pass the end of the view when the view ends at 12:00 AM", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 17:00"),
            dataSource: [
                { start: new Date("2013/6/6 11:00 PM"), end: new Date("2013/6/7 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.last());

        equal(scheduler.dataSource.at(0).start.getHours(), 23);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 30);
        equal(scheduler.dataSource.at(0).start.getDate(), 6);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 30);
        equal(scheduler.dataSource.at(0).end.getDate(), 7);
    });

    test("moving event in day view changes its end time", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 40);
        equal(scheduler.dataSource.at(0).end.getDate(), 6);
    });

    test("moving event in week before the start of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        var offset = handle.offset();

        offset.top += slots.first().outerHeight();

        dragdrop(scheduler, handle, offset, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 9);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 30);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 30);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
    });

    test("moving all day event in week view before the start of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/3 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        var offset = handle.offset();

        offset.left += slots.first().outerWidth();

        dragdrop(scheduler, handle, offset, slots.first());

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 1);
        equal(scheduler.dataSource.at(0).end.getHours(), 11);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).end.getDate(), 2);
    });

    test("moving all day event in week view after the end of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/7 10:00"), end: new Date("2013/6/8 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragdrop(scheduler, handle, slots.last());

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 8);
        equal(scheduler.dataSource.at(0).end.getHours(), 11);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).end.getDate(), 9);
    });

    test("moving event in week after the end of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:30"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        var offset = handle.offset();

        dragdrop(scheduler, handle, offset, slots.last());

        equal(scheduler.dataSource.at(0).start.getHours(), 11);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 2);
        equal(scheduler.dataSource.at(0).end.getHours(), 12);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).end.getDate(), 2);
    });

    test("moving all day event in week view changes its start and end time", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: true, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
    });

    test("moving all day event in week view to timeslots changes its isAllDay field", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: true, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content .k-scheduler-table td");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 08);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 08);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
        equal(scheduler.dataSource.at(0).isAllDay, false);
    });

    test("moving all day event in week view to timeslots and back to allDay slots saves event", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: true, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content .k-scheduler-table td");
        var allDaySlots = div.find(".k-scheduler-header-all-day td");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(0).offset());

        drag(scheduler, handle, allDaySlots.eq(1).offset());

        dragend(scheduler, handle, allDaySlots.eq(1).offset());

        equal(scheduler.dataSource.at(0).start.getHours(), 0);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
        equal(scheduler.dataSource.at(0).isAllDay, true);
    });

    test("moving event in week view to allDay slots changes its isAllDay field", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: false, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 00);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 00);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
        equal(scheduler.dataSource.at(0).isAllDay, true);
    });

    test("moving event in week view to allDay slots creates only one hint", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: false, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td:nth-child(2)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equal(div.find(".k-event-drag-hint").length, 1);

    });

    test("moving event to allDay slot the move hint is correctly positioned", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 8:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: false, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td:nth-child(2)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(0).offset().left);
        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(0).offset().top);
    });

    test("moving allDay event in timeline view makes it regular event", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["timelineWeek"],
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "", isAllDay: true }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).isAllDay, false);
    });

    test("moving all day event in week view changes its start and end time relative to the current slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { isAllDay: true, start: new Date("2013/6/2 10:00"), end: new Date("2013/6/4 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        var offset = handle.offset();

        dragdrop(scheduler, handle, offset, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 5);
    });

    test("moving event in month view changes its start and end time", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(2)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
    });

    test("moving event in month view changes its start and end time relatively to the current slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/4 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(3)");
        var handle = div.find(".k-event");

        var offset = handle.offset();

        offset.left += slots.first().outerWidth() + 10;

        dragdrop(scheduler, handle, offset, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 5);
    });

    test("moving event in month view before the view start", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/26 10:00"), end: new Date("2013/5/27 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(1)");
        var handle = div.find(".k-event");

        var offset = handle.offset();

        offset.left += slots.first().outerWidth() + 10;

        dragdrop(scheduler, handle, offset, slots.eq(0));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 25);
        equal(scheduler.dataSource.at(0).start.getMonth(), 4);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 26);
        equal(scheduler.dataSource.at(0).end.getMonth(), 4);
    });

    test("moving event which starts before the start of the month view by its last slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/24 9:00 PM"), end: new Date("2013/5/27 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(2)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.eq(0));

        equal(scheduler.dataSource.at(0).start.getHours(), 21);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 25);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).end.getDate(), 28);
    });

    test("moving event which ends after the end of the month view by its first slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/7/5 9:00 PM"), end: new Date("2013/7/7 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(7)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.last());

        equal(scheduler.dataSource.at(0).start.getHours(), 21);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 6);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).end.getDate(), 8);
    });

    test("moving event which starts before the start of the month view by its middle slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/5/25 9:00 PM"), end: new Date("2013/5/27 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(2)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.eq(0));

        equal(scheduler.dataSource.at(0).start.getHours(), 21);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 26);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).end.getDate(), 28);
    });

    test("moving event in month view after the view start", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/7/5 10:00"), end: new Date("2013/7/6 10:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(7)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.eq(5));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 6);
        equal(scheduler.dataSource.at(0).start.getMonth(), 6);
        equal(scheduler.dataSource.at(0).end.getHours(), 10);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 7);
        equal(scheduler.dataSource.at(0).end.getMonth(), 6);
    });

    test("moving event which ends after the end of the month view by its first slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/7/4 9:00 PM"), end: new Date("2013/7/7 12:00 AM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var slots = div.find(".k-scheduler-content td:nth-child(6)");
        var handle = div.find(".k-event");

        dragdrop(scheduler, handle, slots.last());

        equal(scheduler.dataSource.at(0).start.getHours(), 21);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 5);
        equal(scheduler.dataSource.at(0).end.getHours(), 0);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
        equal(scheduler.dataSource.at(0).end.getDate(), 8);
    });

    test("moving event in week view changes its start and end time relatively to the current slot", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 11:10"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        var offset = handle.offset();

        offset.top += slots.first().outerHeight();

        dragdrop(scheduler, handle, offset, slots.eq(1));

        equal(scheduler.dataSource.at(0).start.getHours(), 10);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 00);
        equal(scheduler.dataSource.at(0).start.getDate(), 3);
        equal(scheduler.dataSource.at(0).end.getHours(), 11);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 10);
        equal(scheduler.dataSource.at(0).end.getDate(), 3);
    });

    test("dragging and dropping doesn't change the event time if editable is set to false", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            editable: false,
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).end.getHours(), 11);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
    });

    test("dragging and dropping doesn't change the event time if editable.move is set to false", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            editable: { move: false },
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).end.getHours(), 11);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
    });

    test("the hint is as tall as the event", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 11:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(1).offset());

        equalWithRound(div.find(".k-event-drag-hint").outerHeight(), 3 * slots.eq(1).outerHeight());
    });

    test("the move hint is in the right resource group", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:30"), ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(8)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(1).offset());

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(1).offset().left);
        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(1).offset().top);
    });

    test("the move hint is in the right resource group when moving all day event", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:30"), isAllDay: true, ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-header-all-day td");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(8).offset());

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(8).offset().left);
        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(8).offset().top);
    });

    test("the move hint is in the right vertical resource group when moving all day event", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:00"),
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:30"), isAllDay: true, ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        dragstart(scheduler, handle, handle.offset());

        var offset = slots.eq(3).offset();
        offset.top += 10;

        drag(scheduler, handle, offset);

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(3).offset().left);

        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(3).offset().top);
    });

    test("the move hint is in the right vertical resource group when moving events", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:00"),
            date: new Date("2013/6/6"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:00"), end: new Date("2013/6/2 10:30"), ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(4).offset());

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(4).offset().left);
        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(4).offset().top);
    });

    test("moving event between groups changes its resource", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:00"),
            date: new Date("2013/6/6"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:30"), ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        dragdrop(scheduler, handle, slots.eq(0).prev());

        equal(scheduler.dataSource.at(0).ownerId, 1);
    });

    test("moving event between groups changes selection", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:00"),
            date: new Date("2013/6/6"),
            selectable: true,
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:30"), ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        scheduler.focus();

        var handle = div.find(".k-event:last");

        scheduler.select([div.find(".k-event").data("uid")]);

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        dragdrop(scheduler, handle, slots.eq(0).prev());

        ok(scheduler.wrapper.find(".k-event").hasClass("k-state-selected"));
    });

    test("moving event between vertical groups changes its resource", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            startTime: new Date("2013/6/6 10:00"),
            endTime: new Date("2013/6/6 11:00"),
            date: new Date("2013/6/6"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:30"), ownerId: 2, title: "" }
            ],
            group: {
                resources: ["Owner"],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).ownerId, 1);
    });

    test("the hint is positoned to another resource group in month view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/6/1 11:30"), end: new Date("2013/6/1 12:00 PM"), ownerId: 1, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(8)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equalWithRound(div.find(".k-event-drag-hint").outerWidth(), slots.eq(0).outerWidth());
        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(0).offset().left);
    });

    test("the hint is positoned to another resource group in day view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["day"],
            dataSource: [
                { start: new Date("2013/6/6 1:00"), end: new Date("2013/6/6 1:30"), ownerId: 1, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(2)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(0).offset());

        equalWithRound(div.find(".k-event-drag-hint").offset().left, slots.eq(0).offset().left);
        equalWithRound(div.find(".k-event-drag-hint").offset().top, slots.eq(0).offset().top);
    });

    test("moving long event at the end of the month view is restricted by resource", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            views: ["month"],
            dataSource: [
                { start: new Date("2013/7/5 11:30"), end: new Date("2013/7/6 12:00 PM"), ownerId: 1, title: "" }
            ],
            group: {
                resources: ["Owner"]
            },
            resources: [
                {
                    field: "ownerId",
                    name: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "red" },
                        { text: "Bob", value: 2, color: "green" }
                    ],
                    title: "Owner"
                }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(7)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(5).offset());

        equalWithRound(div.find(".k-event-drag-hint").outerWidth(), slots.eq(5).outerWidth());
    });

    test("moving multiday event creates two hints", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/6 11:30"), end: new Date("2013/6/7 10:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:first");

        var slots = div.find(".k-scheduler-content td:nth-child(4)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(4).offset());

        equal(div.find(".k-event-drag-hint").length, 2);
    });

    test("moving one day event to 12:00 AM creates only one hint", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/2 11:30 PM"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(slots.length - 2).offset());

        equal(div.find(".k-event-drag-hint").length, 1);
    });

    test("moving one day event creates only one hint if the end time is before the start time of the view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(slots.length - 2).offset());

        equal(div.find(".k-event-drag-hint").length, 1);
    });

    test("cancelling the drag operation removes the hint", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(slots.length - 2).offset());

        dragcancel(scheduler);

        equal(div.find(".k-event-drag-hint").length, 0);
    });

    test("moving event triggers movestart event", 1, function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            moveStart: function(e) {
                equal(e.event, scheduler.dataSource.at(0));
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());
    });

    test("moving event triggers move event", 4, function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            move: function(e) {
                equal(e.event, scheduler.dataSource.at(0));
                ok(e.slot.element);
                deepEqual(e.slot.start, new Date("2013/6/2 11:00 PM"));
                deepEqual(e.slot.end, new Date("2013/6/2 11:30 PM"));
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, handle.offset());

        drag(scheduler, handle, slots.eq(slots.length - 2).offset());
    });

    test("dropping event triggers moveend event", 4, function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            moveEnd: function(e) {
                equal(e.event, scheduler.dataSource.at(0));
                ok(e.slot.element);
                deepEqual(e.slot.start, new Date("2013/6/2 11:00 PM"));
                deepEqual(e.slot.end, new Date("2013/6/2 11:30 PM"));
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragdrop(scheduler, handle, slots.eq(2));
    });

    test("preventing moveEnd event cancels the move", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: ["week"],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            moveEnd: function(e) {
                e.preventDefault();
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragdrop(scheduler, handle, slots.eq(2));

        var event = scheduler.dataSource.at(0);

        deepEqual(event.start, new Date("2013/6/2 10:30 PM"));
        deepEqual(event.end, new Date("2013/6/3 12:00 PM"));

        equal(div.find(".k-event-drag-hint").length, 0);
    });

    test("disabliing editing prevents the move", 0, function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: [{
                type: "week",
                editable: false
            }],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            moveStart: function() {
                ok(false);
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, slots.eq(2));
    });

    test("disabled editable.move prevents the move", 0, function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 22:00"),
            views: [{
                type: "week",
                editable: {
                    move: false
                }
            }],
            dataSource: [
                { start: new Date("2013/6/2 10:30 PM"), end: new Date("2013/6/3 12:00"), title: "" }
            ],
            moveStart: function() {
                ok(false);
            }
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td:nth-child(1)");

        dragstart(scheduler, handle, slots.eq(2));
    });

    test("hint is not snapped when snap is disabled", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            snap: false,
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, handle.offset());

        var offset = slots.eq(0).offset();

        offset.top += slots.eq(0).outerHeight() / 2;

        drag(scheduler, handle, offset);

        var hint = div.find(".k-event-drag-hint");

        equalWithRound(hint.offset().top, slots.eq(0).offset().top + slots.eq(0).outerHeight() / 2);
    });

    test("event can be freely moved when snap is disabled", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            snap: false,
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:30"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, handle.offset());
        jasmine.clock().tick(1);
        var offset = slots.eq(0).offset();

        offset.top += slots.eq(0).outerHeight() / 2;
        drag(scheduler, handle, offset);

        dragend(scheduler, handle, offset);
        var event = scheduler.dataSource.at(0);

        equal(event.start.getHours(), 10);
        equalWithRound(event.start.getMinutes(), 15, 2);
        equal(event.end.getHours(), 10);
        equalWithRound(event.end.getMinutes(), 45, 2);
    });

    test("moving the event with startTimezone preserves its last place", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/5/26"),
            timezone: "Etc/UTC",
            views: ["week"],
            dataSource: [
                { id: 1, start: new Date("2013/5/27 3:00"), end: new Date("2013/5/27 4:30"), title: "", startTimezone: "Europe/Berlin" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event:last");

        var slot = div.find(".k-scheduler-content tr").eq(1).find("td").eq(1);

        dragdrop(scheduler, handle, slot);

        jasmine.clock().tick(1);
        equal(scheduler.dataSource.at(0).start.getHours(), 0);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 30);
    });

    test("moving an occurrence with startTimezone preserves series place", function() {
        var startTime = new Date("2013/5/27 6:00");
        var end = new Date("2013/5/27 6:30");
        var berlinTZ = "Europe/Berlin";
        var utcTZ = "Etc/UTC";

        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/5/26"),
            timezone: utcTZ,
            views: ["week"],
            dataSource: [
                { id: 1, start: startTime, end: end, title: "", startTimezone: berlinTZ, recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        startTime = scheduler.dataSource.at(0).start;

        var handle = div.find(".k-event:last");

        var slot = div.find(".k-scheduler-content tr").eq(1).find("td").eq(2);

        dragdrop(scheduler, handle, slot);

        $(".k-window").find(".k-button:first").click()
        jasmine.clock().tick(1);
        var occurrence = scheduler.occurrenceByUid(div.find(".k-event:last").attr("data-uid"));

        equal(div.find(".k-event").length, 2);

        equal(occurrence.start.getHours(), 0);
        equal(occurrence.start.getMinutes(), 30);

        equal(scheduler.dataSource.at(0).start.getHours(), startTime.getHours());
        equal(scheduler.dataSource.at(0).start.getMinutes(), startTime.getMinutes());

    });

    test("moving a head occurrence with startTimezone preserves series place", function() {
        var startTime = new Date("2013/5/27 6:00");
        var end = new Date("2013/5/27 6:30");
        var berlinTZ = "Europe/Berlin";
        var utcTZ = "Etc/UTC";

        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/5/26"),
            timezone: utcTZ,
            views: ["week"],
            dataSource: [
                { id: 1, start: startTime, end: end, title: "", startTimezone: berlinTZ, recurrenceRule: "FREQ=DAILY;COUNT=2" }
            ]
        });
        jasmine.clock().tick(1);
        startTime = scheduler.dataSource.at(0).start;

        var handle = div.find(".k-event:first");

        var slot = div.find(".k-scheduler-content tr").eq(1).find("td").eq(1);

        dragdrop(scheduler, handle, slot);

        $(".k-window").find(".k-button:first").click()

        jasmine.clock().tick(1);
        equal(div.find(".k-event").length, 2);

        equal(scheduler.dataSource.at(0).start.getHours(), startTime.getHours());
        equal(scheduler.dataSource.at(0).start.getMinutes(), startTime.getMinutes());

        equal(scheduler.dataSource.at(1).start.getHours(), 0);
        equal(scheduler.dataSource.at(1).start.getMinutes(), 30);

    });

    tzTest("Sofia", "moving event in timeline view honours DST", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2014/3/30"),
            views: ["timeline"],
            dataSource: [
                { start: new Date("2014/3/30"), end: new Date("2014/3/30 1:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragdrop(scheduler, handle, slots.eq(2));

        equal(scheduler.dataSource.at(0).start.getHours(), 1);
        equal(scheduler.dataSource.at(0).start.getMinutes(), 0);

        equal(scheduler.dataSource.at(0).end.getHours(), 2);
        equal(scheduler.dataSource.at(0).end.getMinutes(), 0);
    });

    test("hint shows start and end time when moving event in timeline view", function() {
        var scheduler = new kendo.ui.Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            views: ["timeline"],
            dataSource: [
                { start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 11:00"), title: "" }
            ]
        });
        jasmine.clock().tick(1);
        var handle = div.find(".k-event");

        var slots = div.find(".k-scheduler-content td");

        dragstart(scheduler, handle, handle.offset());
        drag(scheduler, handle, slots.eq(2).offset());

        equal($(".k-event-drag-hint .k-event-time").text(), "11:00 AM - 12:00 PM");
    });

    function dragcancel(scheduler) {
        var draggable = scheduler._moveDraggable;
        draggable.trigger("dragcancel");
    }

    function dragdrop(scheduler, target, offset, to) {
        if (!to) {
            to = offset;
            offset = target.offset();
        }

        dragstart(scheduler, target, offset);
        drag(scheduler, target, to.offset());
        dragend(scheduler, target, to.offset());
    }

    function dragstart(scheduler, target, offset) {
        var draggable = scheduler._moveDraggable;

        if (!draggable) {
            return;
        }

        draggable.trigger("dragstart", {
            currentTarget: target,
            x: { startLocation: offset.left },
            y: { startLocation: offset.top }
        });
    }

    function drag(scheduler, target, offset) {
        var draggable = scheduler._moveDraggable;

        if (!draggable) {
            return;
        }

        draggable.trigger("drag", {
            currentTarget: target,
            x: { location: offset.left },
            y: { location: offset.top }
        });
    }

    function dragend(scheduler, target, offset) {
        var draggable = scheduler._moveDraggable;

        if (!draggable) {
            return;
        }

        draggable.trigger("dragend", {
            currentTarget: target,
            x: { startLocation: offset.left },
            y: { startLocation: offset.top }
        });
    }
})();
