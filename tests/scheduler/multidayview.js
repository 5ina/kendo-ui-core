(function() {
    var MultiDayView = kendo.ui.MultiDayView,
        WorkWeekView = kendo.ui.WorkWeekView,
        SchedulerEvent = kendo.data.SchedulerEvent,
        container;

    var MyDayView = MultiDayView.extend({
        init: function(element, options) {
            var that = this;

            MultiDayView.fn.init.call(that, element, options);
        },
        calculateDateRange: function() {
            this._render(this.options.dates || [new Date()]);
        }
    });

    var MyWorkWeekView = WorkWeekView.extend({
        init: function(element, options) {
            var that = this;
            WorkWeekView.fn.init.call(that, element, options);
        }
    });

    function slotHeight(table, slotsCount) {
        var height = Math.ceil(table.height() / table[0].rows.length);
        return Math.round((height * slotsCount) - 4);
    }

    function equalWithRound(value, expected) {
        QUnit.close(value, expected, 2);
    }

    function applyDefaultLeftOffset(value) {
        return value + 2;
    }

    function applySlotDefaultRightOffset(value, cell) {
        return Math.round(value - cell[0].clientWidth * 0.10);
    }

    function applyDefaultRightOffset(value) {
        return value - 4;
    }

    function setup(options) {
        return new MyDayView(container, $.extend({ majorTick: 120 }, options));
    }

    function setupGroupedScheduler(element, orientation, view, options) {
        orientation = orientation || "horizontal";
        options = $.extend({}, {
            date: new Date("2013/6/6"),
            startTime: new Date("2013/6/6 08:00"),
            endTime: new Date("2013/6/6 08:30"),
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
        }, options);

        new kendo.ui.Scheduler(element, options);
    }

    module("Multi Day View rendering", {
        setup: function() {
            container = $('<div class="k-scheduler" style="width:1000px;height:800px">');
        },
        teardown: function() {
            if (container.data("kendoMultiDayView")) {
                container.data("kendoMultiDayView").destroy();
            }

            kendo.destroy(QUnit.fixture);
        }
    });

    test("renders times header slots", function() {
        var view = setup();

        ok(container.find(".k-scheduler-times").length);
        equal(view.timesHeader[0], container.find(".k-scheduler-times")[0]);
    });

    test("renders headers for selected dates", function() {
        var view = setup({ dates: [new Date("1/2/2013"), new Date("2/1/2013")], allDaySlot: false });

        ok(view.datesHeader.hasClass("k-scheduler-header"));
        equal(view.datesHeader.find("th").length, 2);
    });

    test("k-today is render if date is today", function() {
        var view = setup({ dates: [new Date()] });

        equal(view.datesHeader.find("th.k-today").length, 1);
    });

    test("k-today is not render if date is not today", function() {
        var view = setup({ dates: [new Date("1/2/2013")] });

        ok(!view.datesHeader.find("th.k-today").length);
    });

    test("dates are formatted", function() {
        var view = setup({ dates: [new Date("1/26/2013")] });

        equal(view.datesHeader.find("th").text(), "Sat 1/26");
    });

    test("title is read from the options", function() {
        var view = setup({ title: "the title" });

        equal(view.title, "the title");
    });

    test("render time slots", function() {
        var view = setup({ });

        equal(view.times.find("th").length, 24);
        equal(view.times.find("th:first").text(), "12:00 AM");
    });

    test("render time slots with not exact start time", function() {
        var view = setup({
            startTime: new Date(2001, 1, 1, 10, 10, 0)
        });

        equal(view.times.find("th").length, 14);
        equal(view.times.find("th:first").text(), "10:10 AM");
    });

    test("time is shown in major time slots", function() {
        var view = setup({
                startTime: new Date(2000, 0, 1, 10, 0, 0),
                endTime: new Date(2000, 0, 1, 11, 0, 0),
                majorTick: 30
            });

        var cells = view.times.find("th");

        equal(cells.first().text(), "10:00 AM");
        equal(cells.eq(1).html(), "&nbsp;");
        equal(cells.eq(2).text(), "10:30 AM");
        equal(cells.eq(3).html(), "&nbsp;");
    });

    test("time slots does not overflow endTime", function() {
        var view = setup({
                startTime: new Date(2000, 0, 1, 0, 0, 0),
                endTime: new Date(2000, 0, 1, 23, 59, 0),
                minorTickCount: 8
            });

        equal(view.times.find("th").filter(function() { return this.innerHTML != "&nbsp;"; }).last().text(), "10:00 PM");
        equal(view.times.find("th").length, 96);
    });

    test("start time is a DST date", function() {
        var view = setup({
                majorTick: 60,
                startTime: new Date(2013, 2, 31, 0, 0, 0),
                endTime: new Date(2013, 2, 31, 0, 0, 0),
            });

        ok(view.times.find("th:contains(3:00 AM)").length);
        equal(view.times.find("th").length, 48);
    });

    test("start time is later than end time", function() {
        var view = setup({
                startTime: new Date(2000, 0, 1, 13, 0, 0),
                endTime: new Date(2000, 0, 1, 10, 0, 0),
            });

        equal(view.times.find("tr:not(:last) th").filter(function() { return this.innerHTML != "&nbsp;"; }).last().text(), "7:00 AM");
        equal(view.times.find("tr:last").text(), "9:00 AM");
        equal(view.times.find("th").length, 21);
    });

    test("render day slots", function() {
        var view = setup({
            dates: [
                new Date("1/26/2013"),
                new Date("1/27/2013")
            ]
        });

        equal(view.content.find("tr").length, 24);
        equal(view.content.find("td").length, 48);
    });

    test("render day slots template", function() {
        var view = setup({
            slotTemplate: "foo",
            dates: [
                new Date("1/26/2013"),
                new Date("1/27/2013")
            ]
        });

        equal(view.content.find("td").first().text(), "foo");
        equal(view.content.find("td").last().text(), "foo");
    });

    test("correct date is passed to slotTemplate", function() {
        var view = setup({
            slotTemplate: function(data) {
                deepEqual(kendo.date.getDate(data.date), new Date("1/26/2013"));
            },
            dates: [
                new Date("1/26/2013")
            ]
        });
    });

    test("correct resources is passed to slotTemplate (horizontal grouping)", function() {
        var group1, group2, group3, group4;
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "horizontal", {
            type: "day",
            slotTemplate: function(data) {
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
            type: "day",
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

    test("correct groupIndex is passed to slotTemplate (vertical grouping)", function() {
        var group1, group2, group3, group4;
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "vertical", {
            type: "day",
            slotTemplate: function(data) {
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

    test("correct groupIndex is passed to slotTemplate (horizontal grouping)", function() {
        var group1, group2, group3, group4;
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "horizontal", {
            type: "day",
            allDaySlotTemplate: function(data) {
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

    test("correct groupIndex is passed to slotTemplate (vertical grouping)", function() {
        var group1, group2, group3, group4;
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "vertical", {
            type: "day",
            allDaySlotTemplate: function(data) {
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

    test("render all day slots template", function() {
        var view = setup({
            allDaySlotTemplate: "foo",
            dates: [
                new Date("1/26/2013")
            ]
        });

        equal(view.element.find(".k-scheduler-header-all-day td").text(), "foo");
    });

    test("slot date is pass in the slots template", function() {
        var view = setup({
            allDaySlotTemplate: function(e) {
               deepEqual(e.date, new Date("1/26/2013"));
            },
            dates: [
                new Date("1/26/2013")
            ]
        });
    });

    test("apply css to day slot", function() {
        var view = setup({
            dates: [
                new Date("1/26/2013")
            ]
        });

        equal(view.content.find("tr.k-middle-row").length, 12);
        equal(view.content.find("tr:not(.k-middle-row)").length, 12);
    });

    test("all day slot is rendered", function() {
        var view = setup({
            dates: [
                new Date("1/26/2013")
            ]
        });

        equal(view.datesHeader.find(".k-scheduler-table").length, 2);
        equal(view.element.find(".k-scheduler-header-all-day td").length, 1);
    });

    test("all day slot is not rendered if disabled", function() {
        var view = setup({
            allDaySlot: false,
            dates: [
                new Date("1/26/2013")
            ]
        });

        equal(view.datesHeader.find(".k-scheduler-table").length, 1);
        ok(!view.allDayHeader);
    });

    test("render footer toolbar", function() {
        var view = setup();

        ok(view.footer);
        ok(view.footer.hasClass("k-scheduler-footer"));
    });

    test("footer is not rendered", function() {
        var view = setup({ footer: false });

        ok(!view.element.find("k-scheduler-footer").length);
    });

    test("render workday button in the footer", function() {
        var view = setup({
            footer: {
                command: "workDay"
            }
        });

        ok(view.footer.find(".k-scheduler-fullday").length);
    });

    test("render workday button in the footer by default", function() {
        var view = setup();

        ok(view.footer.find(".k-scheduler-fullday").length);
    });

    test("workday button is not rendered", function() {
        var view = setup({
           footer: {
                command: ""
            }
        });

        ok(!view.footer.find(".k-scheduler-fullday").length);
    });

    test("display basic event", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];

        view.render(events);

        equal(view.content.find("div.k-event").length, 1);
        equal(view.content.find(".k-event .k-event-template").last().text(), "my event");
    });

    test("uid is rendered", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({ start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];
            uid = events[0].uid;

        view.render(events);

        equal(view.content.find(".k-event").attr("data-uid"), uid);
    });

    test("multiple events are displayed", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "event1" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 13, 0, 0), end: new Date(2013, 1, 26, 14, 0, 0), title: "event2" })
        ];

        view.render(events);

        equal(view.content.find("div.k-event").length, 2);
        equal(view.content.find(".k-event:first .k-event-template").last().text(), "event1");
        equal(view.content.find(".k-event:last .k-event-template").last().text(), "event2");
    });

    test("cross-midnight events are split", function() {
        var view = setup({
            dates: [ new Date("2013/6/6"), new Date("2013/6/7") ]
        });

        view.render([new SchedulerEvent({ uid: "uid", title: "", start: new Date("2013/6/6 10:00"), end: new Date("2013/6/7 9:00") })]);
        equal(view.content.find("div.k-event").length, 2);
    });

    test("cross-midnight events are not split if the end time is before the start time of the view", function() {
        var view = setup({
            startTime: new Date("2013/6/6 9:00"),
            dates: [ new Date("2013/6/6"), new Date("2013/6/7") ]
        });

        view.render([new SchedulerEvent({ uid: "uid", title: "", start: new Date("2013/6/6 10:00"), end: new Date("2013/6/7 8:00") })]);
        equal(view.content.find("div.k-event").length, 1);
    });

    test("cross-midnight event is not rendered if ends at the begining of the View", function() {
        var view = setup({
            startTime: new Date("2013/6/6 9:00"),
            dates: [ new Date("2013/6/6"), new Date("2013/6/7") ]
        });

        view.render([new SchedulerEvent({ uid: "uid", title: "", start: new Date("2013/6/5 10:00"), end: new Date("2013/6/6 00:00") })]);
        equal(view.content.find("div.k-event").length, 0);
    });

    test("old events are removed on multiple databind calls", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];

        view.render(events);
        view.render(events);

        equal(view.content.find("div.k-event").length, 1);
        equal(view.content.find(".k-event .k-event-template").last().text(), "my event");
    });

    test("event is rendered with correct time title", 2, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var recur = new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 24, 10, 0, 0), end: new Date(2013, 1, 24, 11, 0, 0), title: "my event", recurrenceRule: "FREQ=DAILY" });
        var recurAll = new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 24), end: new Date(2013, 1, 24), isAllDay: true, title: "my event", recurrenceRule: "FREQ=DAILY" });

        var events = recur.expand(selectedDate, new Date(2013, 1, 27));
        events = events.concat(recurAll.expand(selectedDate, new Date(2013, 1, 27)));

        view.render(events);

        var eventTitle = view.content.find("div.k-event").find("div").first().attr("title");
        var alldayTitle = view.datesHeader.find("div.k-event").find("div").first().attr("title");

        equal(eventTitle, "(10:00 AM - 11:00 AM): my event");
        equal(alldayTitle, "(12:00 AM): my event");
    });

    test("custom event template", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                eventTemplate: '${title}',
                dates: [
                   selectedDate
                ]
            });


        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];

        view.render(events);

        equal(view.content.find("div.k-event").text(), "my event");
    });

    test("title with quotes", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });
        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: '["my event"]' })];
        view.render(events);

        ok(view.content.find("div.k-event>div").attr("title").indexOf('["my event"]') > -1);
    });

    test("title with single quotes", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "['my event']" })];

        view.render(events);

        ok(view.content.find("div.k-event>div").attr("title").indexOf("['my event']") > -1);
    });

    test("all day event title with quotes", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 0, 0, 0), end: new Date(2013, 1, 26, 0, 0, 0), isAllDay: true, title: '["my event"]' })];

        view.render(events);

        ok(view.element.find("div.k-event>div").attr("title").indexOf('["my event"]') > -1);
    });

    test("single day event which is outside of the time range is not displayed", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 12, 0, 0),
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];

        view.render(events);

        ok(!container.find(".k-event").length);
    });

    test("single day event which start at the end of the time range is not displayed", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                endTime: new Date(2013, 1, 26, 17, 0, 0),
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 17, 0, 0), end: new Date(2013, 1, 26, 19, 0, 0), title: "my event" })];

        view.render(events);

        ok(!container.find(".k-event").length);
    });


    test("single day event which starts and ends at the views bounderies is shown", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 7, 0, 0),
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 7, 0, 0), end: new Date(2013, 1, 27), title: "my event" })];

        view.render(events);
        equal(container.find(".k-event").length, 1);
    });

    test("single day event which starts and at the views start and ends before next day start", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 7, 0, 0),
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 7, 0, 0), end: new Date(2013, 1, 27, 5), title: "my event" })];

        view.render(events);

        equal(container.find(".k-event").length, 1);
    });

    test("multiple day events are added to all day slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 27, 11, 0, 0), title: "my event" })];

        view.render(events);

        equal(view.datesHeader.find("div.k-event").length, 1);
        equal(view.datesHeader.find(".k-event .k-event-template").last().text(), "my event");

    });

    test("events set as all day are added to all day slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), isAllDay: true, title: "all day event" })];

        view.render(events);

        equal(view.datesHeader.find("div.k-event").length, 1);
        equal(view.datesHeader.find(".k-event .k-event-template").last().text(), "all day event");

    });

    test("events set as all day are not render for next day slot", function() {
        var selectedDate = new Date(2013, 1, 27, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26), end: new Date(2013, 1, 26), isAllDay: true, title: "all day event" })];

        view.render(events);

        equal(view.datesHeader.find("div.k-event").length, 0);
    });

    test("events set as all day are not render for prev day slot", function() {
        var selectedDate = new Date(2013, 1, 25, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26), end: new Date(2013, 1, 26), isAllDay: true, title: "all day event" })];

        view.render(events);

        equal(view.datesHeader.find("div.k-event").length, 0);
    });

    test("day event which starts before the slot start time and end at the start time is not rendered", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 10, 0, 0),
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 9, 0, 0), end: new Date(2013, 1, 26, 10, 0, 0), title: "my event" })];

        view.render(events);

        var eventElement = view.content.find("div.k-event");

        equal(eventElement.length, 0);
    });

    test("does not position day event which is same day but outside of the slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 9, 0, 0),
                endTime: new Date(2013, 1, 26, 11, 0, 0),
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 7, 0, 0), end: new Date(2013, 1, 26, 8, 0, 0), title: "my event" })];

        view.render(events);
        ok(!view.content.find("div.k-event").length);
    });

    test("same time slot events are sorted by start time and end time", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 13, 0, 0), title: "second event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "same as first" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        equal(eventElements.eq(0).find(".k-event-template").last().text(), "second event");
        equal(eventElements.eq(1).find(".k-event-template").last().text(), "first event");
        equal(eventElements.eq(2).find(".k-event-template").last().text(), "same as first");
    });

    test("close button is rendered if set as editable", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", isAllDay: true, start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "all day event" })
        ];

        view.render(events);

        equal(view.content.find(".k-event a>.k-si-close").length, 1);
        equal(view.datesHeader.find(".k-event a>.k-si-close").length, 1);
    });

    test("close button is not rendered if editable.destroy is false", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: { destroy: false },
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", isAllDay: true, start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "all day event" })
        ];

        view.render(events);

        ok(!view.content.find(".k-event a>.k-si-close").length);
        ok(!view.datesHeader.find(".k-event a>.k-si-close").length);
    });

    test("close button is rendered if set as editable", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", isAllDay: true, start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "all day event" })
        ];

        view.render(events);

        equal(view.datesHeader.find(".k-event a:has(.k-si-close)").length, 1);
    });

    test("close button is not rendered if set to not editable", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: false,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", isAllDay: true, start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "all day event" })
        ];

        view.render(events);

        ok(!view.content.find(".k-event a>.k-si-close").length);
        ok(!view.datesHeader.find(".k-event a>.k-si-close").length);
    });

    test("clicking on close button triggers destroy event", 1, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                remove: function() {
                    ok(true);
                },
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" })
        ];

        view.render(events);

        view.content.find(".k-event a:has(.k-si-close)").click();
    });

    test("double clicking an all day event triggers edit event", 1, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                edit: function(e) {
                    ok(e.uid);
                },
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event", isAllDay: true })
        ];

        view.render(events);

        view.datesHeader.find(".k-event").trigger("dblclick");
    });

    test("double clicking an event triggers edit event", 1, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                edit: function(e) {
                    ok(e.uid);
                },
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" })
        ];

        view.render(events);

        view.content.find(".k-event").trigger("dblclick");
    });

    test("double clicking an event does not trigger edit event if not editable", 0, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: false,
                edit: function(e) {
                    ok(false);
                },
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" })
        ];

        view.render(events);

        view.content.find(".k-event").trigger("dblclick");
    });

    test("double clicking an event does not trigger edit event if update is false", 0, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: { update: false },
                edit: function(e) {
                    ok(false);
                },
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" })
        ];

        view.render(events);

        view.content.find(".k-event").trigger("dblclick");
    });

    test("west arrow is shown if multiday event starts before view's start date and ends before end of the view", function() {
        var view = new kendo.ui.WeekView(container, { date: new Date("2013/6/9") });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date("2013/5/30"), end: new Date("2013/6/15") })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 1);
        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 0);
    });

    test("west arrow is shown if multiday event starts before view's start date and ends at end of the view", function() {
        var view = new kendo.ui.WeekView(container, { date: new Date("2013/6/9") });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date("2013/5/30"), end: new Date("2013/6/16") })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 1);
        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 0);
    });

    test("east arrow is not shown if all day event ends at the end of the view", function() {
        var view = new kendo.ui.WeekView(container, { date: new Date("2013/6/9") });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date("2013/6/12"), end: new Date("2013/6/15 10:00"), isAllDay: true })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 0);
        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 0);
    });

    test("west and east arrow is shown if all day event starts before view's start date and ends at end of the view", function() {
        var view = new kendo.ui.WeekView(container, { date: new Date("2013/6/9") });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date("2013/5/30"), end: new Date("2013/6/16"), isAllDay: true })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 1);
        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 1);
    });

    test("arrow is shown if multiday event starts before view's start date", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 1), end: new Date(2013, 1, 2), isAllDay: true })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 1);
    });

    test("arrow is shown if multiday event ends after view's end date", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 2), end: new Date(2013, 1, 4) })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 1);
    });

    test("arrow is shown if multiday event starts before view's start date and ends after view's end date", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 1), end: new Date(2013, 1, 4) })]);

        equal(view.datesHeader.find(".k-event .k-i-arrow-e").length, 1);
        equal(view.datesHeader.find(".k-event .k-i-arrow-w").length, 1);
    });

    test("arrow is shown if event starts before view's start time", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)], startTime: new Date(2013, 1, 2, 10, 0, 0) });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 2, 9, 0, 0), end: new Date(2013, 1, 2, 11, 0, 0) })]);

        equal(view.content.find(".k-event .k-i-arrow-n").length, 1);
        ok(!view.content.find(".k-event .k-i-arrow-s").length);
    });

    test("arrow is shown if event ends after view's end time", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)], endTime: new Date(2013, 1, 2, 10, 0, 0) });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 2, 9, 0, 0), end: new Date(2013, 1, 2, 11, 0, 0) })]);

        equal(view.content.find(".k-event .k-i-arrow-s").length, 1);
        ok(!view.content.find(".k-event .k-i-arrow-n").length);
    });

    test("arrows are shown if event starts before and ends after view's start, end time", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)], startTime: new Date(2013, 1, 2, 10, 0, 0), endTime: new Date(2013, 1, 2, 11, 0, 0) });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 2, 9, 0, 0), end: new Date(2013, 1, 2, 12, 0, 0) })]);

        equal(view.content.find(".k-event .k-i-arrow-s").length, 1);
        equal(view.content.find(".k-event .k-i-arrow-n").length, 1);
    });

    test("arrows are not shown if event ends in the midnight", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 2, 9, 0, 0), end: new Date(2013, 1, 3, 0, 0, 0) })]);

        equal(view.content.find(".k-event .k-i-arrow-s").length, 0);
        equal(view.content.find(".k-event .k-i-arrow-n").length, 0);
    });

    test("refresh icon is shown if multiday event has recurring rule", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "", start: new Date(2013, 1, 1), end: new Date(2013, 1, 2), isAllDay: true, recurrenceRule: "FREQ=DAILY" })]);

        equal(view.datesHeader.find(".k-event .k-i-refresh").length, 1);
    });

    test("refresh icon is shown if multiday event has recurrenceId", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({ uid: "foo", title: "",  start: new Date(2013, 1, 1), end: new Date(2013, 1, 2), isAllDay: true, recurrenceId: "1" })]);

        equal(view.datesHeader.find(".k-event .k-i-refresh").length, 1);
    });

    test("refresh icon is shown if multiday event is recurring exception event", function() {
        var view = setup({ dates: [new Date(2013, 1, 1)] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 1),
            end: new Date(2013, 1, 2),
            id: "2",
            recurrenceId: "1"
        })]);

        equal(view.datesHeader.find(".k-event .k-i-exception").length, 1);
        equal(view.datesHeader.find(".k-event .k-i-refresh").length, 0);
    });

    test("same day event which starts and ends before the startTime is not rendered when week view", function() {
        var view = setup({ dates: [new Date(2013, 1, 2), new Date(2013, 1, 3)], startTime: new Date(2013, 1, 2, 7, 0, 0) });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 0, 0, 0),
            end: new Date(2013, 1, 2, 0, 0, 0),
            id: "2"
        })]);

        ok(!view.content.find(".k-event").length);
    });

    test("slot ending at 12:00 AM doesn't have the south arrow", function() {
        var view = setup({
            majorTick: 60,
            startTime: new Date("2013/6/6 10:00 PM"),
            dates: [new Date("2013/6/6")]
        });

        view.render([new SchedulerEvent({
            uid: "foo",
            title: "",
            start: new Date("2013/6/6 11:00 PM"),
            end: new Date("2013/6/7 12:00 AM"),
            id: "2"
        })]);

        equal(view.element.find(".k-i-arrow-s").length, 0);
    });

    test("workDayStart is used when rendered in work mode", function() {
        var view = setup({
            workDayStart: new Date("2013/6/6 10:00"),
            showWorkHours: true,
            dates: [new Date("2013/6/6")]
        });

        equal(view.times.find("th:first").text(), "10:00 AM");
    });

    test("workDayEnd is used when rendered in work mode", function() {
        var view = setup({
            workDayEnd: new Date("2013/6/6 14:00"),
            showWorkHours: true,
            dates: [new Date("2013/6/6")]
        });

        equal(view.times.find("tr th").filter(function() { return this.innerHTML != "&nbsp;"; }).last().text(), "12:00 PM");
    });

    test("default workDayEnd and workDayStart are used when rendered in work mode", function() {
        var view = setup({
            showWorkHours: true,
            dates: [new Date("2013/6/6")]
        });

        equal(view.times.find("th:first").text(), "8:00 AM");
        equal(view.times.find("tr th").filter(function() { return this.innerHTML != "&nbsp;"; }).last().text(), "4:00 PM");
    });

    test("clicking workday button triggers naivgate event", 2, function() {
        var view = setup();

        view.bind("navigate",function(e) {
            equal(e.view, "MultiDayView");
            ok(e.isWorkDay);
        });

        view.footer.find(".k-scheduler-fullday").click();
    });

    test("non working day is highlighted", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            workWeekStart: 4,
            workWeekEnd: 4,
        });

        equal(view.content.find("td.k-nonwork-hour").length, 15);
    });

    test("working day is not highlighted", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            workWeekStart: 4,
            workWeekEnd: 4,
            showWorkHours: true
        });

        ok(!view.content.find("td.k-nonwork-hour").length);
    });

    test("non working hours are highlighted", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            workDayStart: new Date("2013/6/6 10:00"),
            startTime: new Date("2013/6/6 9:00"),
            endTime: new Date("2013/6/6 12:00"),
            workDayEnd: new Date("2013/6/6 11:00"),
        });

        ok(view.content.find("td").first().hasClass("k-nonwork-hour"));
        ok(!view.content.find("td").eq(1).hasClass("k-nonwork-hour"));
        ok(view.content.find("td").last().hasClass("k-nonwork-hour"));
    });

    test("WorkWeek view name is the same case as the class name", function() {
        var viewName = "workWeek";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: []
        }).data("kendoScheduler");

        var view = scheduler.view().name;
        equal(viewName, view);
    });

    test("Day view name is the same case as the class name", function() {
        var viewName = "day";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: []
        }).data("kendoScheduler");

        var view = scheduler.view().name;
        equal(viewName, view);
    });

    test("Week view name is the same case as the class name", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: []
        }).data("kendoScheduler");

        var view = scheduler.view().name;
        equal(viewName, view);
    });

    tzTest("Sofia", "Current time marker is rendered correctly", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: [],
            date: new Date(),
            startTime: new Date("2013/6/6 01:00"),
            endTime: new Date("2013/6/6 00:59"),
        }).data("kendoScheduler");

        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        equal(timeElementsCount,1);
    });

    test("Current time marker is not rendered when the option is set to false", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: [],
            date: new Date(),
            startTime: new Date("2013/6/6 01:00"),
            endTime: new Date("2013/6/6 00:59"),
            currentTimeMarker: false
        }).data("kendoScheduler");

        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        equal(timeElementsCount,0);
    });

    test("Current time marker is not rendered when the currentTimeMarker option is not object", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);
        var scheduler = element.kendoScheduler({
            views: [viewName],
            dataSource: [],
            date: new Date(),
            startTime: new Date("2013/6/6 01:00"),
            endTime: new Date("2013/6/6 00:59"),
            currentTimeMarker: true
        }).data("kendoScheduler");

        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        equal(timeElementsCount,0);
    });

    test("Current time marker is rendered when horizontal grouping is applied", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "horizontal", viewName, {
            date: new Date(),
            startTime: new Date("2013/6/6 01:00"),
            endTime: new Date("2013/6/6 00:59"),
        });

        var scheduler = element.data("kendoScheduler");
        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        equal(timeElementsCount,1);
    });

    test("Current time marker is rendered when vertical grouping is applied", function() {
        var viewName = "week";
        var element = $("<div>").appendTo(QUnit.fixture);

        setupGroupedScheduler(element, "vertical", viewName, {
            date: new Date(),
            startTime: new Date("2013/6/6 01:00"),
            endTime: new Date("2013/6/6 00:59"),
        });

        var scheduler = element.data("kendoScheduler");
        var timeElementsCount = scheduler.view().element.find(".k-current-time").length;
        equal(timeElementsCount,4);
    });

    module("Multi Day View event positioning", {
        setup: function() {
            container = $('<div class="k-scheduler" style="width:1000px;height:800px">');
            QUnit.fixture.append(container);
        },
        teardown: function() {
            if (container.data("kendoMultiDayView")) {
                container.data("kendoMultiDayView").destroy();
            }
            kendo.destroy(container);
        }
    });

    test("gap below all day events if they do not start or end in 12:00 am", function() {
        var view = setup({
            dates: [
                new Date("2013/6/6")
            ]
        });

        var events = [
            new SchedulerEvent({
                uid:"uid",
                start: new Date("2013/6/6 2:00"),
                end: new Date("2013/6/6 2:00"),
                isAllDay: true,
                title: ""
            })
        ];

        view.render(events);

        ok(view.element.find(".k-scheduler-header-all-day td").outerHeight() >= view.element.find(".k-event").outerHeight() * 2);
    });

    test("leaves empty space after all day slot", function() {
        var view = setup({
            dates: [
               new Date("2013/6/6"),
               new Date("2013/6/7"),
            ]
        });

        var events = [
            new SchedulerEvent({
                uid:"uid",
                start: new Date("2013/6/6"),
                end: new Date("2013/6/6"),
                isAllDay: true,
                title: "event"
            }), new SchedulerEvent({
                uid:"uid",
                start: new Date("2013/6/7"),
                end: new Date("2013/6/7"),
                isAllDay: true,
                title: "event"
            })
        ];

        view.render(events);

        equalWithRound(view.element.find(".k-scheduler-header-all-day td").height(), view.element.find(".k-event").height() * 2);
    });

    test("event which starts at 15 minutes is positioned in the middle of the slot", function() {
        var view = setup({
            majorTick: 60,
            startTime: new Date("2013/6/6 10:00"),
            dates: [new Date("2013/6/6")]
        });

        var events = [new SchedulerEvent({ start: new Date("2013/6/6 10:15"), end: new Date("2013/6/6 10:30"), title: "" }) ];

        view.render(events);

        var event = view.element.find(".k-event");
        var slot = view.element.find(".k-scheduler-content td:first");

        equalWithRound(event[0].offsetTop, slot[0].offsetTop + slot[0].offsetHeight / 2);
    });

    test("events which don't overlap are not positioned next to each other", function() {
        var selectedDate = new Date("2013/6/6"),
            view = setup({
                startTime: new Date("2013/6/6 10:00"),
                dates: [
                   selectedDate
                ]
            });

            var events = [
                new SchedulerEvent({ uid:"uid", start: new Date("2013/6/6 10:00"), end: new Date("2013/6/6 10:45"), title: "" }),
                new SchedulerEvent({ uid:"uid", start: new Date("2013/6/6 10:45"), end: new Date("2013/6/6 11:30"), title: "" })
            ];

        view.render(events);

        var events = view.content.find(".k-event");

        ok(events.first().outerWidth() + events.last().outerWidth() > view.content.find("td").outerWidth());
    });


    test("get time slot index for date", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [ selectedDate ]
            });

        var index = view._timeSlotIndex(new Date(2013, 1, 26, 10, 0, 0));

        equal(index, 10);
    });

    test("position basic event in the correct time slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })],
            timeSlotPosition,
            eventPosition;

        view.render(events);

        eventPosition = view.content.find("div.k-event").offset();
        timeSlotPosition = view.content.find("tr").eq(10).offset();

        equalWithRound(timeSlotPosition.top, eventPosition.top);
        equalWithRound(applyDefaultLeftOffset(timeSlotPosition.left), eventPosition.left);
    });


    test("set the height of the event", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            }),
            events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "my event" })];

        view.render(events);

        equalWithRound(view.content.find("div.k-event").height(), slotHeight(view.content.find(">table"), 2));

    });

    test("multiple day event position is set to the date slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 27, 11, 0, 0), title: "my event" })];

        view.render(events);

        var eventOffset = view.datesHeader.find("div.k-event").offset();
        var slotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();

        equalWithRound(eventOffset.top, slotOffset.top);
        equalWithRound(eventOffset.left, applyDefaultLeftOffset(slotOffset.left));
    });

    test("multiple day event position is set to the date slot with multiple slots", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate,
                   new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 27, 11, 0, 0), title: "my event" })];

        view.render(events);
        var eventOffset = view.datesHeader.find("div.k-event").offset();
        var slotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();
        var slotWidth = 0;

        view.element.find(".k-scheduler-header-all-day td").each(function() {
            slotWidth += $(this).innerWidth();
        });

        equalWithRound(eventOffset.top, slotOffset.top);

        equalWithRound(eventOffset.left, applyDefaultLeftOffset(slotOffset.left));
        equalWithRound(view.datesHeader.find("div.k-event").width(), applyDefaultRightOffset(slotWidth));
    });

    test("recurring multiple day event position is set to the date slot with multiple slots", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   new Date(2013, 1, 26, 0, 0, 0),
                   new Date(2013, 1, 27, 0, 0, 0),
                   new Date(2013, 1, 28, 0, 0, 0),
                   new Date(2013, 1, 29, 0, 0, 0)
                ]
            });

        var event = new SchedulerEvent({
            id: 1,
            recurrenceRule: "FREQ=DAILY;COUNT=3",
            start: new Date(2013, 1, 26, 23, 0, 0),
            end: new Date(2013, 1, 27, 9, 0, 0),
            title: "my event"
        });

        view.render(event.expand(new Date(2013, 1, 26), new Date(2013, 1, 30)));

        var eventPosition = view.content.find("div.k-event").eq(3).offset(); //offset of the second part of the event
        var timeSlotPosition = view.content.find("tr").eq(0).find("td").eq(2).offset();

        equalWithRound(eventPosition.top, timeSlotPosition.top);
        equalWithRound(eventPosition.left, applyDefaultLeftOffset(timeSlotPosition.left));
    });


    test("position multiday event which starts before the selected range", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 24, 10, 0, 0), end: new Date(2013, 1, 26, 11, 0, 0), title: "my event" })];

        view.render(events);

        var slotWidth = view.element.find(".k-scheduler-header-all-day td")[0].clientWidth;

        equal(view.datesHeader.find("div.k-event").length, 1);
        equal(view.datesHeader.find("div.k-event").width(), applyDefaultRightOffset(slotWidth));
    });

    test("position multiday event which ends after the selected range", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 27, 11, 0, 0), title: "my event" })];

        view.render(events);

        var slotWidth = view.element.find(".k-scheduler-header-all-day td")[0].clientWidth;

        equal(view.datesHeader.find("div.k-event").length, 1);
        equal(view.datesHeader.find("div.k-event").width(), applyDefaultRightOffset(slotWidth));
    });

    test("position multiday event which starts before and ends after the selected range", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 24, 10, 0, 0), end: new Date(2013, 1, 27, 11, 0, 0), title: "my event" })];

        view.render(events);

        var slotWidth = view.element.find(".k-scheduler-header-all-day td")[0].clientWidth;

        equal(view.datesHeader.find("div.k-event").length, 1);
        equal(view.datesHeader.find("div.k-event").width(), applyDefaultRightOffset(slotWidth));
    });

    test("position day event which starts before the slot start time", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 10, 0, 0),
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 9, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "my event" })];

        view.render(events);

        var eventElement = view.content.find("div.k-event");
        equal(eventElement.length, 1);
        equal(eventElement.offset().top, view.content.find("tr:first").offset().top);
        equal(eventElement.offset().left, applyDefaultLeftOffset(view.content.find("tr:first").offset().left));
    });

    test("position day event which ends after the slot end time", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                endTime: new Date(2013, 1, 26, 11, 0, 0),
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 9, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "my event" })];

        view.render(events);
        var eventElement = view.content.find("div.k-event");

        equal(eventElement.length, 1);
        equalWithRound(eventElement.offset().top, view.content.find("tr").eq(9).offset().top);
        equalWithRound(eventElement.offset().left, applyDefaultLeftOffset(view.content.find("tr").eq(9).offset().left));
        equalWithRound(eventElement.height(), slotHeight(view.content.find("table"), 2));
    });

    test("position day event which start before and ends after the slot end time", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                startTime: new Date(2013, 1, 26, 9, 0, 0),
                endTime: new Date(2013, 1, 26, 11, 0, 0),
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "my event" })];

        view.render(events);

        var eventElement = view.content.find("div.k-event");
        equal(eventElement.length, 1);

        equalWithRound(eventElement.offset().top, view.content.find("tr").eq(0).offset().top);
        equalWithRound(eventElement.height(), slotHeight(view.content.find("table"), 2));
    });

    test("position day event which start in the last slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 27, 9, 0, 0), end: new Date(2013, 1, 27, 10, 0, 0), title: "my event" })];

        view.render(events);

        var eventElement = view.content.find("div.k-event");
        equal(eventElement.length, 1);
        equalWithRound(eventElement.offset().top, view.content.find("tr").eq(9).offset().top);
        equalWithRound(eventElement.height(), slotHeight(view.content.find("table"), 1));
    });

    test("position multiple single day events with same start time", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var slot = view.content.find("tr").eq(8).find("td:first");

        equal(eventElements.length, 2);
        equalWithRound(eventElements.first().offset().top, slot.offset().top);
        equalWithRound(eventElements.first().offset().left, applyDefaultLeftOffset(slot.offset().left));
        equalWithRound(eventElements.first().height(), slotHeight(view.content.find("table"), 4));
        equalWithRound(eventElements.first().width(), applySlotDefaultRightOffset(slot[0].clientWidth - 8, slot) / 2);
        equalWithRound(eventElements.last().offset().top, slot.offset().top);
        equalWithRound(eventElements.last().height(), slotHeight(view.content.find("table"), 4));
        equalWithRound(eventElements.last().width(), Math.floor(applySlotDefaultRightOffset(slot[0].clientWidth - 8, slot) / 2));
    });

    test("events with same start time - does not move events from other date slots", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 27, 8, 0, 0), end: new Date(2013, 1, 27, 12, 0, 0), title: "other slot event" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var firstSlot = view.content.find("tr").eq(8).find("td:first");
        var secondSlot = view.content.find("tr").eq(8).find("td:last");

        equal(eventElements.length, 3);

        equalWithRound(eventElements.first().offset().top, firstSlot.offset().top);

        equalWithRound(eventElements.eq(1).offset().left, applyDefaultLeftOffset(firstSlot.offset().left) + eventElements.first().width() + 4);

        equalWithRound(eventElements.last().offset().top, secondSlot.offset().top);
    });

    test("events with same start time - does not move events from same date slots with which does not collide", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 13, 0, 0), end: new Date(2013, 1, 26, 14, 0, 0), title: "no collision" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var firstTimeSlot = view.content.find("tr").eq(8).find("td:first");
        var secondTimeSlot = view.content.find("tr").eq(13).find("td:first");

        equal(eventElements.length, 3);

        equalWithRound(eventElements.first().offset().top, firstTimeSlot.offset().top);

        equalWithRound(eventElements.eq(1).offset().left, applyDefaultLeftOffset(firstTimeSlot.offset().left) + eventElements.first().width() + 4);

        equalWithRound(eventElements.last().offset().top, secondTimeSlot.offset().top);
        equalWithRound(eventElements.last().offset().left, applyDefaultLeftOffset(secondTimeSlot.offset().left));
    });

    test("event positioned after long events take the whole slot width", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 16, 0, 0), title: "long event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 16, 0, 0), end: new Date(2013, 1, 26, 16, 30, 0), title: "other event" })
        ];

        view.render(events);

        var eventElement = view.content.find("div.k-event").last();
        var timeSlot = view.content.find("tr").eq(16).find("td:first");

        equal(eventElement.width(), applySlotDefaultRightOffset(timeSlot[0].clientWidth - 4, timeSlot));
    });

    test("long events reposition other events in the same date slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 16, 0, 0), title: "long event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var firstTimeSlot = view.content.find("tr").eq(8).find("td:first");
        var secondTimeSlot = view.content.find("tr").eq(10).find("td:first");

        equalWithRound(eventElements.first().offset().top, firstTimeSlot.offset().top);
        equalWithRound(eventElements.last().offset().top, secondTimeSlot.offset().top);
        equalWithRound(eventElements.last().offset().left, applyDefaultLeftOffset(secondTimeSlot.offset().left) + eventElements.first()[0].clientWidth + 4);
    });

    test("long events reposition other events in the same time slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 16, 0, 0), title: "long event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 9, 0, 0), title: "same slot event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 9, 0, 0), title: "second same slot event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 10, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "second event" })
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var firstTimeSlot = view.content.find("tr").eq(8).find("td:first");
        var secondTimeSlot = view.content.find("tr").eq(10).find("td:first");

        equalWithRound(eventElements.first().offset().top, firstTimeSlot.offset().top);
        equalWithRound(eventElements.first().width(), applySlotDefaultRightOffset(firstTimeSlot[0].clientWidth - 12, firstTimeSlot) / 3);
        equalWithRound(eventElements.eq(1).offset().left, applyDefaultLeftOffset(firstTimeSlot.offset().left) + eventElements.first()[0].clientWidth + 4);
        equalWithRound(eventElements.last().offset().top, secondTimeSlot.offset().top);
        equalWithRound(eventElements.last().offset().left, applyDefaultLeftOffset(secondTimeSlot.offset().left) + eventElements.first().width() + 4);
    });

    test("subsequent events have same left position", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 9, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 9, 0, 0), end: new Date(2013, 1, 26, 10, 0, 0), title: "second event" }),
        ];

        view.render(events);

        var eventElements = view.content.find("div.k-event");
        var firstTimeSlot = view.content.find("tr").eq(8).find("td:first");
        var secondTimeSlot = view.content.find("tr").eq(9).find("td:first");

        equal(eventElements.first().offset().left, applyDefaultLeftOffset(firstTimeSlot.offset().left));
        equal(eventElements.last().offset().left, applyDefaultLeftOffset(secondTimeSlot.offset().left));
    });

    test("position multiple overlapping all day events in a single slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 27, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 27, 13, 0, 0), title: "second event" })
        ];

        view.render(events);

        var eventElements = view.datesHeader.find("div.k-event");

        var slotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();
        var slotWidth = 0;

        view.element.find(".k-scheduler-header-all-day td").each(function() {
            slotWidth += $(this).innerWidth();
        });

        equalWithRound(eventElements.first().offset().top, slotOffset.top);

        equalWithRound(eventElements.first().offset().left, applyDefaultLeftOffset(slotOffset.left));
        equalWithRound(eventElements.last().offset().left, applyDefaultLeftOffset(slotOffset.left));

        equalWithRound(eventElements.first().width(), applyDefaultRightOffset(slotWidth));
        equalWithRound(eventElements.first().width(), eventElements.last().width());
    });

    test("position multiple not overlapping all day events", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0),
                    new Date(2013, 1, 28, 0, 0, 0),
                    new Date(2013, 1, 29, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 27, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 28, 8, 0, 0), end: new Date(2013, 1, 29, 13, 0, 0), title: "second event" })
        ];

        view.render(events);

        var eventElements = view.datesHeader.find("div.k-event");

        var firstEventSlotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();
        var secondEventSlotOffset = view.element.find(".k-scheduler-header-all-day td").eq(2).offset();

        equalWithRound(eventElements.first().offset().top, firstEventSlotOffset.top);
        equalWithRound(eventElements.last().offset().top, secondEventSlotOffset.top);

        equalWithRound(eventElements.first().offset().left, applyDefaultLeftOffset(firstEventSlotOffset.left));
        equalWithRound(eventElements.last().offset().left, applyDefaultLeftOffset(secondEventSlotOffset.left));
    });

    test("set height of multiple overlapping all day events across multiple slots", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0),
                    new Date(2013, 1, 28, 0, 0, 0),
                    new Date(2013, 1, 29, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 27, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 27, 8, 0, 0), end: new Date(2013, 1, 28, 13, 0, 0), title: "second event" }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 28, 8, 0, 0), end: new Date(2013, 1, 29, 13, 0, 0), title: "third event" })
        ];

        view.render(events);

        var eventElements = view.datesHeader.find("div.k-event");

        var eventSlotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();
        var eventSlotHeigth = view.element.find(".k-scheduler-header-all-day td").eq(0).height();
        var eventHeight = view._allDayHeaderHeight;

        equalWithRound(eventElements.eq(0).offset().top, eventSlotOffset.top);
        equalWithRound(eventElements.eq(1).offset().top, eventSlotOffset.top + eventHeight);
        equalWithRound(eventElements.eq(2).offset().top, eventSlotOffset.top);
    });

    test("slot by position when the cursor is over the border", function() {
        var view = new MyWorkWeekView(container,  {
            date: new Date(),
            workWeekStart: 0,
        });

        var row = view.content.find("tr:first");
        var offset = row.find("td:first").offset();
        var slot = view._slotByPosition(offset.left, offset.top + row.find("td:first").innerHeight());

        ok(slot);
    });

    test("set top of multiple overlapping all day events in same slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event", isAllDay: true }),
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 13, 0, 0), title: "second event", isAllDay: true }),
        ];

        view.render(events);

        var eventElements = view.datesHeader.find("div.k-event");

        var eventSlotOffset = view.element.find(".k-scheduler-header-all-day td").eq(0).offset();
        var eventHeight = view._allDayHeaderHeight;

        equalWithRound(eventElements.eq(0).offset().top, eventSlotOffset.top);
        equalWithRound(eventElements.eq(1).offset().top, eventSlotOffset.top + eventHeight);
    });

    test("close button is not visible by default if set as editable", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var events = [
            new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "first event" }),
            new SchedulerEvent({uid:"uid", isAllDay: true, start: new Date(2013, 1, 26, 8, 0, 0), end: new Date(2013, 1, 26, 12, 0, 0), title: "all day event" })
        ];

        view.render(events);

        equal(view.content.find(".k-event a:has(.k-si-close)").css("display"), "none");
        equal(view.datesHeader.find(".k-event a:has(.k-si-close)").css("display"), "none");
    });

    test("double clicking a cell triggers add event", 2, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                add: function(e) {
                    var event = e.eventInfo;

                    equal(event.start.getTime(), new Date(2013, 1, 26, 2, 0, 0).getTime());
                    equal(event.end.getTime(), new Date(2013, 1, 26, 3, 0, 0).getTime());
                },
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var cell = view.content.find("td").eq(2);
        cell.trigger({ type: "dblclick", pageX: cell.offset().left, pageY: cell.offset().top });
    });

    test("double clicking a cell in the datesHeader triggers add event", 3, function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                add: function(e) {
                    var event = e.eventInfo;
                    deepEqual(event.start, new Date(2013, 1, 26, 0, 0, 0));
                    deepEqual(event.end, new Date(2013, 1, 26, 0, 0, 0));
                    equal(event.isAllDay, true);
                },
                editable: true,
                dates: [
                    selectedDate
                ]
            });

        var cell = view.datesHeader.find(".k-scheduler-header-all-day td");
        cell.trigger({ type: "dblclick", pageX: cell.offset().left, pageY: cell.offset().top });
    });

    test("slotByCell returns date for slot", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                dates: [
                    selectedDate
                ]
            });

        var result = view.selectionByElement(view.content.find("td").eq(2));

        deepEqual(result.startDate(), new Date(2013, 1, 26, 2, 0, 0));
        deepEqual(result.endDate(), new Date(2013, 1, 26, 3, 0, 0));
    });

    test("_dateSlotIndex returns correct index if date is same as endTime", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
        view = setup({
                endTime: new Date(2013, 1, 27, 10, 0, 0),
                dates: [
                    selectedDate,
                    new Date(2013, 1, 27, 0, 0, 0)
                ]
            });

        equal(view._dateSlotIndex(new Date(2013,1,27,10,0,0)), 1);
    });

    test("same day event which end at midnight is rendered in the day slot", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 10, 0, 0),
            end: new Date(2013, 1, 3, 0, 0, 0),
            id: "2"
        })]);

        var slots = view.content.find("td");

        var event = view.content.find(".k-event");

        equal(event.offset().top, slots.eq(10).offset().top);

        equalWithRound(event.offset().top + event.outerHeight(), slots.last().offset().top + slots.last().outerHeight());
    });

    test("same day event which starts and end at the startTime is rendered as one cell duration", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 0, 0, 0),
            end: new Date(2013, 1, 2, 0, 0, 0),
            id: "2"
        })]);

        equal(view.groups[0].getTimeSlotCollection(0).events()[0].start, 0);

        ok(view.content.find(".k-event").length);
    });

    test("same day event which starts before the startTime and ends at midnight is rendered", function() {
        var view = setup({ dates: [new Date(2013, 1, 2)], startTime: new Date(2013, 1, 2, 7, 0, 0) });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 6, 0, 0),
            end: new Date(2013, 1, 3, 0, 0, 0),
            id: "2"
        })]);

        var slots = view.content.find("td");

        var event = view.content.find(".k-event");

        equalWithRound(event.offset().top, slots.first().offset().top);
        equalWithRound(event.offset().top + event.outerHeight(), slots.last().offset().top + slots.last().outerHeight());
    });

    test("two day all day event is rendered correctly", function() {
        var view = setup({ dates: [ new Date(2013, 1, 2), new Date(2013, 1, 3) ] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 0, 0, 0),
            end: new Date(2013, 1, 3, 0, 0, 0),
            isAllDay: true,
            id: "2"
        })]);

        equal(view.groups[0].getDaySlotCollection(0).events()[0].start, 0);
        equal(view.groups[0].getDaySlotCollection(0).events()[0].end, 1);

        ok(view.datesHeader.find(".k-event").length);
    });

    test("last slot end date is set correctly when view end is restricted", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var slots = view.groups[0].getTimeSlotCollection(0);
        deepEqual(slots.last().startDate(), new Date("2013/6/6 19:00"));
        deepEqual(slots.last().endDate(), new Date("2013/6/6 20:00"));
    });

    test("next to last slot end date is set correctly", function() {
        var view = setup({
            majorTick: 60,
            dates: [new Date("2013/6/6")]
        });

        var slots = view.groups[0].getTimeSlotCollection(0);
        var count = slots.count();
        deepEqual(slots.at(count- 2).startDate(), new Date("2013/6/6 23:00"));
        deepEqual(slots.at(count -2).endDate(), new Date("2013/6/6 23:30"));
    });

    test("first day is correctly set in workWeek view", function() {

        var view = new MyWorkWeekView(container,  {
            date: new Date(),
            workWeekStart: 0,
        });

        var row = view.content.find("tr:first");
        var startOffset = row.find("td:first").offset();
        var startSlot = view._slotByPosition(startOffset.left, startOffset.top);
        var startDate = startSlot.startDate().getDay();

        equal(startDate, 0);
    });

    test("last day is correctly set in workWeek view", function() {

        var view = new MyWorkWeekView(container,  {
            date: new Date(),
            workWeekEnd: 2
        });

        var row = view.content.find("tr:first");
        var endOffset = row.find("td:last").offset();
        var endSlot = view._slotByPosition(endOffset.left, endOffset.top);
        var endDate = endSlot.startDate().getDay();

        equal(endDate, 2);
    });

    test("day is correctly set when last pixel of given slot is used", function() {

        var view = new MyWorkWeekView(container,  {
            date: new Date(),
            workWeekEnd: 3
        });

        var row = view.content.find("tr:first");
        var endOffset = row.find("td:nth-child(3)").offset();
        var endSlot = view._slotByPosition(Math.floor(endOffset.left-1), endOffset.top);
        var endDate = endSlot.startDate().getDay();

        equal(endDate, 2);
    });

    test("previous button is working correctly in workWeek view", function() {
        var scheduler = container.kendoScheduler({
            views: ["workWeek"],
            workWeekStart: 2,
            workWeekEnd: 5,
            date: new Date("2013/6/16"),
            dataSource: []
        }).data("kendoScheduler");

        scheduler.toolbar.find(".k-nav-prev").click();

        var view = scheduler.view();
        var row = view.content.find("tr:first");
        var offset = row.find("td:first").offset();
        var startSlot = view._slotByPosition(offset.left, offset.top);

        equal(startSlot.startDate().getDate(), 4);
    });

    test("next button is working correctly in workWeek view", function() {
        var scheduler = container.kendoScheduler({
            views: ["workWeek"],
            workWeekStart: 2,
            workWeekEnd: 5,
            date: new Date("2013/6/16"),
            dataSource: []
        }).data("kendoScheduler");

        scheduler.toolbar.find(".k-nav-next").click();

        var view = scheduler.view();
        var row = view.content.find("tr:first");
        var offset = row.find("td:first").offset();
        var startSlot = view._slotByPosition(offset.left, offset.top);

        equal(startSlot.startDate().getDate(), 18);
    });

    test("previous button is working correctly in workWeek view with workWeekStart greater then workWeekEnd", function() {
        var scheduler = container.kendoScheduler({
            views: ["workWeek"],
            workWeekStart: 5,
            workWeekEnd: 2,
            date: new Date("2013/6/16"),
            dataSource: []
        }).data("kendoScheduler");

        scheduler.toolbar.find(".k-nav-prev").click();

        var view = scheduler.view();
        var row = view.content.find("tr:first");
        var offset = row.find("td:first").offset();
        var startSlot = view._slotByPosition(offset.left, offset.top);

        equal(startSlot.startDate().getDate(), 7);
    });

    test("next button is working correctly in workWeek view with workWeekStart greater then workWeekEnd", function() {
        var scheduler = container.kendoScheduler({
            views: ["workWeek"],
            workWeekStart: 5,
            workWeekEnd: 2,
            date: new Date("2013/6/16"),
            dataSource: []
        }).data("kendoScheduler");

        scheduler.toolbar.find(".k-nav-next").click();

        var view = scheduler.view();
        var row = view.content.find("tr:first");
        var offset = row.find("td:first").offset();
        var startSlot = view._slotByPosition(offset.left, offset.top);

        equal(startSlot.startDate().getDate(), 21);
    });

    test("clicking the cell link trigger navigate event", 2, function() {
        var view = setup({ dates: [new Date(2013, 1, 2)] });

        view.bind("navigate", function(e) {
            equal(e.view, "day");
            equal(e.date.getTime(), new Date(2013, 1, 2).getTime());
        });
        view.datesHeader.find("th:first").find(".k-nav-day").click();
    });

    module("Multi Day View ARIA rendering", {
        setup: function() {
            container = $('<div class="k-scheduler" style="width:1000px;height:800px">');
        },
        teardown: function() {
            if (container.data("kendoMultiDayView")) {
                container.data("kendoMultiDayView").destroy();
            }
        }
    });

    test("View renders allday tr elements with 'row' role", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var rows = view.element.find(".k-scheduler-header-all-day tr");

        equal(rows.filter("[role=row]").length, rows.length);
    });

    test("View renders time tr elements with 'row' role", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var rows = view.content.find("tr");

        equal(rows.filter("[role=row]").length, rows.length);
    });

    test("View renders allday td elements with 'gridcell' role", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var cells = view.element.find(".k-scheduler-header-all-day td");

        equal(cells.filter("[role=gridcell]").length, cells.length);
    });

    test("View renders allday td elements with 'aria-selected' attribute", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var cells = view.element.find(".k-scheduler-header-all-day td");

        equal(cells.filter("[aria-selected=false]").length, cells.length);
    });

    test("View renders time td elements with 'gridcell' role", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var cells = view.content.find("td");

        equal(cells.filter("[role=gridcell]").length, cells.length);
    });

    test("View renders time td elements with 'aria-selected' attribute", function() {
        var view = setup({
            dates: [new Date("2013/6/6")],
            endTime: new Date("2013/6/6 20:00")
        });

        var cells = view.content.find("td");

        equal(cells.filter("[aria-selected=false]").length, cells.length);
    });

    test("View renders an all day event with role and aria-selected attribute", function() {
        var view = setup({ dates: [ new Date(2013, 1, 2), new Date(2013, 1, 3) ] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 0, 0, 0),
            end: new Date(2013, 1, 3, 0, 0, 0),
            isAllDay: true,
            id: "2"
        })]);

        var events = view.element.find(".k-event");

        equal(events.filter("[role=gridcell]").length, events.length);
        equal(events.filter("[aria-selected=false]").length, events.length);
    });

    test("View renders an event with role and aria-selected attribute", function() {
        var view = setup({ dates: [ new Date(2013, 1, 2), new Date(2013, 1, 3) ] });

        view.render([new SchedulerEvent({
            uid: "foo", title: "",
            start: new Date(2013, 1, 2, 0, 0, 0),
            end: new Date(2013, 1, 2, 1, 0, 0),
            id: "2"
        })]);

        var events = view.content.find(".k-event");

        equal(events.filter("[role=gridcell]").length, events.length);
        equal(events.filter("[aria-selected=false]").length, events.length);
    });

    test("Do not render events if daySlot is disabled", function() {
        var selectedDate = new Date(2013, 1, 26, 0, 0, 0),
            view = setup({
                allDaySlot: false,
                dates: [
                   selectedDate
                ]
            });

        var events = [new SchedulerEvent({uid:"uid", start: new Date(2013, 1, 26, 0, 0, 0), end: new Date(2013, 1, 26, 0, 0, 0), isAllDay: true, title: '["my event"]' })];

        view.render(events);

        equal(view.element.find("div.k-event>div").length, 0);
    });
})();
