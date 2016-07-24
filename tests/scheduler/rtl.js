(function() {
    var Scheduler = kendo.ui.Scheduler;
    var SchedulerEvent = kendo.data.SchedulerEvent;

    var div;

    function equalWithRound(value, expected) {
        QUnit.close(value, expected, 3);
    }

    module("rtl", {
        setup: function() {
            var rtl = $('<div class="k-rtl"/>').appendTo(QUnit.fixture);
            div = $("<div/>").width(500).height(1000);
            div.appendTo(rtl);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("events are positioned according to top right edge of the slot in day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 10:30"), end: new Date("2013/6/6 11:30"), title: "" } )
            ]
        });

        var slots = div.find(".k-scheduler-content td");
        var event = div.find(".k-event");

        equalWithRound(event.outerWidth() + event.offset().left, slots.eq(0).outerWidth() + slots.offset().left);
    });

    test("current time marker is correctly positioned in timeline view", function() {
        var date = new Date(1980,1,2,10,0,0);
        var scheduler = new Scheduler(div, {
            date: date,
            views: ["timeline"],
            dataSource: []
        });

        var view = scheduler.view();

        view._updateCurrentTimeMarker(date);

        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        var top = scheduler.view().content[0].offsetTop;
        var slot = scheduler.slotByPosition($(".k-current-time").offset().left, top);

        //ok(slot.startDate <= date);
        equal(timeElementsCount,2);
    });

    test("two events are positioned according to top right edge of the slot in day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 10:30"), end: new Date("2013/6/6 11:30"), title: "" } ),
                new SchedulerEvent( { start: new Date("2013/6/6 10:30"), end: new Date("2013/6/6 11:30"), title: "" } ),
            ]
        });

        var slots = div.find(".k-scheduler-content td");
        var event = div.find(".k-event");

        equalWithRound(event.last().outerWidth() + event.last().offset().left, slots.eq(0).outerWidth() + slots.offset().left);
        equalWithRound(event.last().outerWidth() + event.first().outerWidth() + event.first().offset().left, slots.eq(0).outerWidth() + slots.offset().left);
    });

    test("all day events are positioned in day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 12:00 AM"), end: new Date("2013/6/6 12:00 AM"), isAllDay: true, title: "" } )
            ]
        });

        var slots = div.find(".k-scheduler-header-all-day td");
        var event = div.find(".k-event");

        equalWithRound(event.outerWidth(), slots.eq(0).outerWidth());
        equalWithRound(event.offset().left, slots.eq(0).offset().left);
    });

    test("all day events are positioned in vertically grouped day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            group: {
                resources: [ "foo" ],
                orientation: "vertical"
            },
            resources: [
                {
                    field: "foo",
                    dataSource: [
                        { text: "foo1", value: 1, color: "red" },
                        { text: "foo2", value: 2, color: "green" }
                    ]
                }
            ],
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 12:00 AM"), end: new Date("2013/6/6 12:00 AM"), isAllDay: true, title: "", foo: 1 } )
            ]
        });

        var slots = div.find(".k-scheduler-header-all-day td");
        var event = div.find(".k-event");

        equalWithRound(event.outerWidth(), slots.eq(0).outerWidth());
        equalWithRound(event.offset().left, slots.eq(0).offset().left);
    });

    test("south resize hint positioning in day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:00"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 10:00 "), end: new Date("2013/6/6 10:30 AM"), title: "" } )
            ],
            views:["day"]
        });

        var slots = div.find(".k-scheduler-content td");

        var handle = div.find(".k-resize-s");
        resizestart(scheduler, handle, handle.offset());
        resize(scheduler, handle, slots.eq(2).offset());

        var hint = div.find(".k-marquee");

        equalWithRound(hint.offset().left, slots.eq(2).offset().left);
        equalWithRound(hint.outerWidth(), slots.outerWidth());
    });

    test("multiday events are positioned in week view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/7 12:00 AM"), end: new Date("2013/6/8 12:00 AM"), isAllDay: true, title: "" } )
            ],
            views:["week"]
        });

        var slots = div.find(".k-scheduler-header-all-day td");
        var event = div.find(".k-event");

        equalWithRound(event.outerWidth(), 2 * slots.last().outerWidth());
        equalWithRound(event.offset().left, slots.last().offset().left);
    });

    test("multiple multiday events are positioned in week view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/7 12:00 AM"), end: new Date("2013/6/8 12:00 AM"), isAllDay: true, title: "" } ),
                new SchedulerEvent( { start: new Date("2013/6/6 12:00 AM"), end: new Date("2013/6/7 12:00 AM"), isAllDay: true, title: "" } )
            ],
            views:["week"]
        });

        var slots = div.find(".k-scheduler-header-all-day td");
        var event = div.find(".k-event");

        equalWithRound(event.first().outerWidth(), 2 * slots.last().outerWidth());
        equalWithRound(event.first().offset().left, slots.last().prev().offset().left);
        equalWithRound(event.last().outerWidth(), 2 * slots.last().outerWidth());
        equalWithRound(event.last().offset().left, slots.last().offset().left);
    });

    test("multiple multiday events are positioned in month view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/5/31 12:00 AM"), end: new Date("2013/6/1 12:00 AM"), isAllDay: true, title: "" } ),
                new SchedulerEvent( { start: new Date("2013/5/30 12:00 AM"), end: new Date("2013/5/31 12:00 AM"), isAllDay: true, title: "" } )
            ],
            views:["month"]
        });

        var slots = div.find(".k-scheduler-content tr:first td");
        var event = div.find(".k-event");

        equalWithRound(event.first().outerWidth(), 2 * slots.last().outerWidth());
        equalWithRound(event.first().offset().left, slots.last().prev().offset().left);
        equalWithRound(event.last().outerWidth(), 2 * slots.last().outerWidth());
        equalWithRound(event.last().offset().left, slots.last().offset().left);
    });

    test("events are positioned in month view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/5/26 12:00 AM"), end: new Date("2013/5/26 12:00 AM"), isAllDay: true, title: "" } )
            ],
            views: ["month"]
        });

        var slots = div.find(".k-scheduler-content td");
        var event = div.find(".k-event");

        equalWithRound(event.outerWidth(), slots.eq(0).outerWidth());
        equalWithRound(event.offset().left, slots.eq(0).offset().left);
    });

    test("the move hint is positioned according to top right edge of the slot in day view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 10:30"), end: new Date("2013/6/6 11:30"), title: "" } )
            ]
        });

        var slots = div.find(".k-scheduler-content td");
        var event = div.find(".k-event");

        movestart(scheduler, event, event.offset());
        move(scheduler, event, slots.eq(1).offset());

        var hint = div.find(".k-event-drag-hint");

        equalWithRound(hint.outerWidth() + hint.offset().left, slots.eq(1).outerWidth() + slots.eq(1).offset().left);
    });

    test("east moving changes the end of the event", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 10:30"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/6/6 12:00 AM"), end: new Date("2013/6/6 12:00 AM"), isAllDay: true, title: "" } )
            ],
            views: ["week"]
        });

        var slots = div.find(".k-scheduler-header-all-day td");
        var handle = div.find(".k-resize-e");

        resizestart(scheduler, handle, handle.offset());
        resize(scheduler, handle, slots.last().offset());

        var hint = div.find(".k-marquee");

        equalWithRound(hint.offset().left, slots.last().offset().left);
        equalWithRound(hint.outerWidth(), 3 * slots.outerWidth());
    });

    test("east resize hint in month view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/5/26 12:00 AM"), end: new Date("2013/5/26 12:00 AM"), title: "" } )
            ],
            views: ["month"]
        });

        var slots = div.find(".k-scheduler-content tr:first td");

        var handle = div.find(".k-resize-e");

        resizestart(scheduler, handle, handle.offset());

        var offset = slots.eq(1).offset();

        resize(scheduler, handle, offset);

        var hint = div.find(".k-marquee");

        equalWithRound(hint.offset().left, slots.eq(1).offset().left);
        equalWithRound(hint.outerWidth(), 2 * slots.outerWidth());
    });

    test("move hint multiple week event in month view", function() {
        var scheduler = new Scheduler(div, {
            date: new Date("2013/6/6"),
            dataSource: [
                new SchedulerEvent( { start: new Date("2013/5/26 12:00 AM"), end: new Date("2013/6/6 12:00 AM"), title: "" } )
            ],
            views: ["month"]
        });

        var slots = div.find(".k-scheduler-content tr:eq(1) td");
        var event = div.find(".k-event").first();

        movestart(scheduler, event, event.offset());
        move(scheduler, event, slots.last().offset());

        var hint = div.find(".k-event-drag-hint:first");
        equalWithRound(hint.offset().left, slots.last().offset().left);
   });


    function movestart(scheduler, target, offset) {
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

    function move(scheduler, target, offset) {
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

    function resizestart(scheduler, target) {
        var draggable = scheduler._resizeDraggable;

        if (!draggable) {
            return;
        }

        var offset = target.offset();

        draggable.trigger("dragstart", {
            currentTarget: target,
            x: { startLocation: offset.left },
            y: { startLocation: offset.top }
        });
    }

    function resize(scheduler, target, offset) {
        var draggable = scheduler._resizeDraggable;

        if (!draggable) {
            return;
        }

        draggable.trigger("drag", {
            currentTarget: target,
            x: { location: offset.left },
            y: { location: offset.top }
        });
    }

    function resizeend(scheduler, target, offset) {
        var draggable = scheduler._resizeDraggable;

        if (!draggable) {
            return;
        }

        draggable.trigger("dragend", {
            currentTarget: target,
            x: { location: offset.left },
            y: { location: offset.top }
        });
    }
})();
