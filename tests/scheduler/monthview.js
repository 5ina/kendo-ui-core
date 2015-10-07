(function() {
    var MonthView = kendo.ui.MonthView,
        container;

    function setup(options) {
        return new MonthView(container, $.extend(true, { eventHeight: 10, date: new Date(2013, 1, 2) }, options));
    }

    function equalWithRound(value, expected) {
        QUnit.close(value, expected, 3);
    }

    function removeDefaultHorizontalOffset(value) {
        return value - 2;
    }

    function applyDefaultTopOffset(slot, value) {
        var firstChild = slot.children().first();

        return value + (firstChild.length ? firstChild.outerHeight() : 0) + 3;
    }

    function applyDefaultRightOffset(value) {
        return 1 + value + 4;
    }

    function setupGroupedScheduler(element, orientation, view) {
        orientation = orientation || "horizontal";

        new kendo.ui.Scheduler(element, {
            date: new Date("2013/6/6"),
            editable: false,
            draggable: false,
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

    module("Month View rendering", {
        setup: function() {
            container = document.createElement("div");
            QUnit.fixture[0].appendChild(container);
            container = $(container).addClass("k-scheduler");
        },
        teardown: function() {
            if (container.data("kendomonth")) {
                container.data("kendomonth").destroy();
            }
            kendo.destroy(QUnit.fixture);
        }
    });

    test("class is added to the table", function() {
        var view = setup();

        ok(view.table.hasClass("k-scheduler-monthview"));
    });

    test("startDate is set to the first visible day for the month", function() {
        var view = setup();

        deepEqual(view.startDate(), new Date(2013, 0, 27));
    });

    test("endDate is set to the last visible day for the month", function() {
        var view = setup();


        deepEqual(view.endDate(), new Date(2013, 2, 9));
    });

    test("headers are populated with days of the week names", function() {
        var view = setup();


        var headerCells = view.datesHeader.find("th");

        equal(headerCells.length, 7);
        equal(headerCells.first().text(), "Sunday");
        equal(headerCells.eq(1).text(), "Monday");
        equal(headerCells.eq(2).text(), "Tuesday");
        equal(headerCells.eq(3).text(), "Wednesday");
        equal(headerCells.eq(4).text(), "Thursday");
        equal(headerCells.eq(5).text(), "Friday");
        equal(headerCells.eq(6).text(), "Saturday");
    });

    test("day slots are created", function() {
        var view = setup();

        equal(view.content.find("tr").length, 6);
        equal(view.content.find("td").length, 42);
    });

    test("scripts nested inside eventTemplate are executed", function() {
        var view = setup({
            eventTemplate: "<div class='elementForRemove'>Text</div><script>$('.elementForRemove').remove();</script>"
        });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" })
        ]);

        equal(view.content.find(".elementForRemove").length, 0);
    });

    test("today class is added", function() {
        var view = setup({ date: new Date() });

        equal(view.content.find("td.k-today").text(), kendo.toString(new Date(), "dd"));
    });

    test("position event", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" })
        ]);

        var eventOffset = view.content.find(".k-event").offset();
        var slot = view.content.find("td").eq(9);
        var slotOffset = slot.offset();

        equalWithRound(view.content.find(".k-event").length, 1);
        equalWithRound(removeDefaultHorizontalOffset(eventOffset.left), slotOffset.left);
        equalWithRound(eventOffset.top, applyDefaultTopOffset(slot, slotOffset.top));
    });

    test("position event with dayTemplate with a text node", function() {
        var view = setup({ dayTemplate: "foo<span>bar</span>" });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" })
        ]);

        var eventOffset = view.content.find(".k-event").offset();
        var slot = view.content.find("td").eq(9);
        var slotOffset = slot.offset();

        equalWithRound(view.content.find(".k-event").length, 1);
        equalWithRound(removeDefaultHorizontalOffset(eventOffset.left), slotOffset.left);
        equalWithRound(eventOffset.top, applyDefaultTopOffset(slot, slotOffset.top));
    });

    test("position event with dayTemplate with only text", function() {
        var view = setup({ dayTemplate: "foo" });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" })
        ]);

        var eventOffset = view.content.find(".k-event").offset();
        var slot = view.content.find("td").eq(9);
        var slotOffset = slot.offset();

        equalWithRound(view.content.find(".k-event").length, 1);
        equalWithRound(removeDefaultHorizontalOffset(eventOffset.left), slotOffset.left);
        equalWithRound(eventOffset.top, applyDefaultTopOffset(slot, slotOffset.top));
    });


    test("position multiple events in a single slot", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" }),
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "other one day event" })
        ]);

        var firstEventOffset = view.content.find(".k-event:first").offset();
        var secondEventOffset = view.content.find(".k-event:last").offset();

        var slot = view.content.find("td").eq(9);
        var slotOffset = slot.offset();

        equalWithRound(view.content.find(".k-event").length, 2);
        equalWithRound(removeDefaultHorizontalOffset(firstEventOffset.left), slotOffset.left);
        equalWithRound(removeDefaultHorizontalOffset(secondEventOffset.left), slotOffset.left);

        equalWithRound(firstEventOffset.top, applyDefaultTopOffset(slot, slotOffset.top));

        equalWithRound(secondEventOffset.top, 10 + firstEventOffset.top + 3);
    });

    test("width of single day event is same as the slot", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "one day event" })
        ]);

        var eventWidth = view.content.find(".k-event").width();
        var slotWidth = view.content.find("td").eq(9).outerWidth();

        equal(applyDefaultRightOffset(eventWidth), slotWidth);
    });

    test("width of multi day event", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 6, 10), title: "multi day event" })
        ]);

        var eventWidth = view.content.find(".k-event").width();
        var firstSlotWidth = view.content.find("td").eq(9).outerWidth();
        var secondSlotWidth = view.content.find("td").eq(10).outerWidth();

        equal(applyDefaultRightOffset(eventWidth), firstSlotWidth + secondSlotWidth);
    });

    test("three day event which end on the first day of the next week is split correctly", function() {
        var view = setup({ date: new Date("2013/6/1") });

        view.render([
            new kendo.data.SchedulerEvent({ isAllDay: true, start: new Date("2013/5/31"), end: new Date("2013/6/2"), title: "multi day event" })
        ]);
        equal(view.content.find(".k-event").length, 2);
    });

    test("event on multiple rows is split", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 12), title: "multi day event" })
        ]);

        var firstEventOffset = view.content.find(".k-event:first").offset();
        var secondEventOffset = view.content.find(".k-event:last").offset();

        equal(view.content.find(".k-event").length, 2);

        var firstSlot = view.content.find("td").eq(9).offset();
        var secondSlot = view.content.find("td").eq(14).offset();

        equalWithRound(removeDefaultHorizontalOffset(firstEventOffset.left), firstSlot.left);
        equalWithRound(removeDefaultHorizontalOffset(secondEventOffset.left), secondSlot.left);
    });

    test("event on two rows has arrows added", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 12), title: "multi day event" })
        ]);

        var firstEvent = view.content.find(".k-event:first");
        var secondEvent = view.content.find(".k-event:last");

        ok(!firstEvent.find(".k-event-actions:first .k-i-arrow-w").length);
        equal(firstEvent.find(".k-event-actions:last .k-i-arrow-e").length, 1);

        equal(secondEvent.find(".k-event-actions:first .k-i-arrow-w").length, 1);
        equal(secondEvent.find(".k-event-actions:last .k-i-arrow-e").length, 0);
    });

    test("event on multiple rows has arrows added", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 19), title: "multi day event" })
        ]);

        var firstEvent = view.content.find(".k-event:first");
        var secondEvent = view.content.find(".k-event:eq(1)");
        var lastEvent = view.content.find(".k-event:last");

        ok(!firstEvent.find(".k-event-actions:first .k-i-arrow-w").length);
        equal(firstEvent.find(".k-event-actions:last .k-i-arrow-e").length, 1);

        equal(secondEvent.find(".k-event-actions:first .k-i-arrow-w").length, 1);
        equal(secondEvent.find(".k-event-actions:last .k-i-arrow-e").length, 1);

        equal(lastEvent.find(".k-event-actions:first .k-i-arrow-w").length, 1);
        ok(!lastEvent.find(".k-event-actions:last .k-i-arrow-e").length);
    });

    test("event ending after the endDate has arrows added", function() {
        var view = setup({ date: new Date(2013, 2, 2) });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 2, 31), end: new Date(2013, 3, 19), title: "multi day event" })
        ]);

        var firstEvent = view.content.find(".k-event:first");

        ok(firstEvent.length);

        ok(!firstEvent.find(".k-event-actions:first .k-i-arrow-w").length);
        equal(firstEvent.find(".k-event-actions:last .k-i-arrow-e").length, 1);
   });

    test("event start after the start of the week and ending after the endDate has arrows added", function() {
        var view = setup({ date: new Date(2013, 2, 2) });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 3, 1), end: new Date(2013, 3, 19), title: "multi day event" })
        ]);

        var firstEvent = view.content.find(".k-event:first");

        ok(!firstEvent.find(".k-event-actions:first .k-i-arrow-w").length);
        equal(firstEvent.find(".k-event-actions:last .k-i-arrow-e").length, 1);
   });

   test("event starting on a last week start and ending after the endDate", function() {
       var view = setup({ date: new Date(2013, 2, 2) });

       view.render([
           new kendo.data.SchedulerEvent({ start: new Date(2013, 2, 31), end: new Date(2013, 3, 19), title: "multi day event" })
       ]);

       equal(view.content.find(".k-event").length, 1);
   });

   test("event starting on the end of the week and ending on the first day of the next", function() {
       var view = setup({ date: new Date(2013, 2, 2) });

       view.render([
           new kendo.data.SchedulerEvent({ start: new Date(2013, 2, 16), end: new Date(2013, 2, 17), title: "multi day event" })
       ]);

       equal(view.content.find(".k-event").length, 1);
   });

   test("clicking the cell link trigger navigate event", 2, function() {
       var view = setup();

       var slotIndex = view._slotIndex(new Date(2013, 1, 2));

       view.bind("navigate", function(e) {
           equal(e.view, "day");
           equal(e.date.getTime(), new Date(2013, 1, 2).getTime());
       });

       view.content.find("td").eq(slotIndex).find(".k-link.k-nav-day").click();
   });

   test("more button is shown if cell cannot accumulate the events", function() {
       var view = setup();

       view.render([
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 1" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 2" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 3" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 4" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 5" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 6" })
       ]);

       equal(view.content.find(".k-event").length, 4);
       equal(view.content.find(".k-more-events").length, 1);
    });

    test("clicking more button triggers navigate event", function() {
       var view = setup();

       view.render([
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 1" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 2" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 3" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 4" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 5" }),
           new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "event 6" })
       ]);

       view.bind("navigate", function(e) {
            equal(e.view, "day");
            deepEqual(e.date, new Date(2013, 1, 5));
       });

       view.content.find(".k-more-events").click();
    });

    test("refresh icon is shown if month event has recurring rule", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "day event", recurrenceRule: "FREQ=DAILY" })
        ]);

        equal(view.content.find(".k-event .k-i-refresh").length, 1);
    });

    test("refresh icon is shown if month event has recurrenceId", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date(2013, 1, 5), end: new Date(2013, 1, 5), title: "day event", recurrenceId: "1" })
        ]);

        equal(view.content.find(".k-event .k-i-refresh").length, 1);
    });

    test("exception icon is shown if month event is exception recurring event", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({
                start: new Date(2013, 1, 5),
                end: new Date(2013, 1, 5),
                title: "day event",
                id: "2",
                recurrenceId: "1"
            })
        ]);

        equal(view.content.find(".k-event .k-i-exception").length, 1);
        equal(view.content.find(".k-event .k-i-refresh").length, 0);
    });

    test("event in the first slot is correctly positioned", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 10:00"), end: new Date("2013/1/27 10:00"),  title: "day event" })
        ]);

        equal(view.groups[0].getDaySlotCollection(0).events()[0].start, 0);
        equal(view.groups[0].getDaySlotCollection(0).events()[0].end, 0);
    });

    test("more button is shown for every cell with more events than possible to show", function() {
        var view = setup({
            eventHeight: 22
        });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 10:00"), end: new Date("2013/1/28 10:00"),  title: "day event" }),
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 10:00"), end: new Date("2013/1/28 10:00"),  title: "day event" }),
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 10:00"), end: new Date("2013/1/28 10:00"),  title: "day event" })
        ]);

        equal(view.content.find(".k-more-events").length, 2);
    });

    test("event which ends at 12:00 AM occupies one slot", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 10:00"), end: new Date("2013/1/28 12:00 AM"),  title: "" })
        ]);

        equal(view.content.find(".k-event").outerWidth(), removeDefaultHorizontalOffset(view.content.find("td").outerWidth()));
    });

    test("event which is two days long and ends at 12:00 AM occupies two slots", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/27 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  title: "" })
        ]);

        equalWithRound(view.content.find(".k-event").outerWidth(), 2 * removeDefaultHorizontalOffset(view.content.find("td").outerWidth()));
    });

    test("event which starts and ends at 12:00 AM occupies one slot", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/28 12:00 AM"),  title: "" })
        ]);

        equalWithRound(view.content.find(".k-event").outerWidth(), removeDefaultHorizontalOffset(view.content.find("td").outerWidth()));
    });

    test("all day event which is from 12 AM to 12 AM on the next day occupies two slots", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: "" })
        ]);

        equalWithRound(view.content.find(".k-event").outerWidth(), 2 * removeDefaultHorizontalOffset(view.content.find("td").outerWidth()));
    });

    test("title with quotes", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: '["my event"]' })
        ]);

        ok(view.content.find("div.k-event>div").attr("title").indexOf('["my event"]') > -1);
    });

    test("title with single quotes", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: "['my event']" })
        ]);

        ok(view.content.find("div.k-event>div").attr("title").indexOf("['my event']") > -1);
    });

    test("all day event title with quotes", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: '["my event"]' })
        ]);

        ok(view.element.find("div.k-event>div").attr("title").indexOf('["my event"]') > -1);
    });

    test("correct resources are passed to dayTemplate (horizontal grouping)", function() {
        var group1, group2, group3, group4;

        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "horizontal", {
            type: "month",
            dayTemplate: function(data) {
                var resources = data.resources();

                if (resources.rooms == 1 && resources.persons == 1) {
                    group1 = true;
                }

                if (resources.rooms == 1 && resources.persons == 2) {
                    group2 = true;
                }

                if (resources.rooms == 2 && resources.persons == 1) {
                    group3 = true;
                }

                if (resources.rooms == 2 && resources.persons == 2) {
                    group4 = true;
                }
            }
        });

        ok(group1 && group2 && group3 && group4);
    });

    test("texts and values of resources are passed to groupHeaderTemplate", function() {
        var texts = [], values = [];
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "horizontal", {
            type: "month",
            groupHeaderTemplate: function(data) {
                texts.push(data.text);
                values.push(data.value);
                return data.text + data.value;
            }
        });

        var view = element.getKendoScheduler().view();

        equal(texts.indexOf("Room1"), 0);
        equal(texts.indexOf("Barny"), 2);
        equal(values.indexOf(1), 0);
        equal(values.indexOf(2), 2);
        equal(view.datesHeader.find("tr:first th:first").html(), "Room11");
    });


    test("correct resources are passed to dayTemplate (vertical grouping)", function() {
        var group1, group2, group3, group4;

        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "vertical", {
            type: "month",
            dayTemplate: function(data) {
                var resources = data.resources();

                if (resources.rooms == 1 && resources.persons == 1) {
                    group1 = true;
                }

                if (resources.rooms == 1 && resources.persons == 2) {
                    group2 = true;
                }

                if (resources.rooms == 2 && resources.persons == 1) {
                    group3 = true;
                }

                if (resources.rooms == 2 && resources.persons == 2) {
                    group4 = true;
                }
            }
        });

        ok(group1 && group2 && group3 && group4);
    });

   test("Name is the same case as the class name", function() {
        var view = setup();

        var viewName = "month";
        equal(viewName, view.name);
    });

    module("Month View ARIA rendering", {
        setup: function() {
            container = document.createElement("div");
            QUnit.fixture[0].appendChild(container);
            container = $(container).addClass("k-scheduler");
        },
        teardown: function() {
            if (container.data("kendomonth")) {
                container.data("kendomonth").destroy();
            }

            kendo.destroy(QUnit.fixture);
        }
    });

    test("View renders tr elements with a role 'row'", function() {
        var view = setup();

        var rows = view.content.find("tr");

        equal(rows.filter("[role=row]").length, rows.length);
    });

    test("View renders td elements with a role 'gridcell'", function() {
        var view = setup();

        var cells = view.content.find("td");

        equal(cells.filter("[role=gridcell]").length, cells.length);
    });

    test("View renders td elements with an attribute 'aria-selected'", function() {
        var view = setup();

        var cells = view.content.find("td");

        equal(cells.filter("[aria-selected=false]").length, cells.length);
    });

    test("View renders events with a role 'gridcell'", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: '["my event"]' })
        ]);

        var events = view.element.find(".k-event");

        equal(events.filter("[role=gridcell]").length, events.length);
    });

    test("View renders events with an attribute 'aria-selected'", function() {
        var view = setup();

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/1/28 12:00 AM"), end: new Date("2013/1/29 12:00 AM"),  isAllDay: true, title: '["my event"]' })
        ]);

        var events = view.element.find(".k-event");

        equal(events.filter("[aria-selected=false]").length, events.length);
    });

    test("event which end date is the first day of the month is not rendered", function() {
        var view = setup({ date: new Date("2013/12/1") });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/11/23"), end: new Date("2013/11/24"), title: "event" })
        ]);

        ok(!view.element.find(".k-event").length);
    });

    test("event which ends on the first date of the month is rendered", function() {
        var view = setup({ date: new Date("2013/12/1") });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2013/11/23"), end: new Date("2013/11/24"), isAllDay: true, title: "event" })
        ]);

        equal(view.element.find(".k-event").length, 1);
    });

    tzTest("Brazil", "Hourly method honours DST", function() {
        var view = setup({ date: new Date("2015/10/1") });

        view.render([
            new kendo.data.SchedulerEvent({ start: new Date("2015/10/19"), end: new Date("2015/10/19"), isAllDay: true, title: "event" })
        ]);

        var offset = view.element.find(".k-event").eq(0).offset();
        var slot = view._slotByPosition(offset.left, offset.top);

        equal($(slot.element).find(".k-nav-day").text(), 19);
    });

})();
