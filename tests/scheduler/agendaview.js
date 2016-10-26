(function() {
    var Event = kendo.data.SchedulerEvent;
    var Scheduler = kendo.ui.Scheduler;
    var dom;

    module("Agenda view", {
        setup: function() {
            jasmine.clock().install();
            dom = document.createElement("div");
            QUnit.fixture[0].appendChild(dom);
            dom = $(dom).addClass("k-scheduler");
        },
        teardown: function() {
            jasmine.clock().uninstall();
            dom.data("kendoagenda").destroy();
            kendo.destroy(QUnit.fixture);
        }
    });

    function agendaView(options) {
        agenda = new kendo.ui.AgendaView(dom, options);

        return agenda;
    }

    test("agenda renders table with headers for date, time and event", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        var table = agenda.element.find(".k-scheduler-table");

        var dateHeaderCell = table.find(".k-scheduler-datecolumn");

        equal(dateHeaderCell.text(), "Date");

        var timeHeaderCell = table.find(".k-scheduler-timecolumn");

        equal(timeHeaderCell.text(), "Time");

        var eventHeaderCell = timeHeaderCell.next();

        equal(eventHeaderCell.text(), "Event");
    });

    test("eventTemplate is wrapped in a div with class k-task", function() {
        var agenda = agendaView({
            date: new Date("2013/06/06 00:00"),
            eventTemplate: "<strong>#: title #</strong>"
        });
        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                title: "foo"
            })
        ]);

        ok(agenda.element.find("strong").parent().is("div.k-task"));
    });

    test("agenda renders a cell for the event date", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                title: ""
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.find(".k-scheduler-agendaday").text(), "06");
        equal(dateCell.find(".k-scheduler-agendaweek").text(), "Thursday");
        equal(dateCell.find(".k-scheduler-agendadate").text(), "June, 2013");
    });

    test("agenda renders a k-first class for event date cell when no grouping", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                title: ""
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        ok(dateCell.hasClass("k-first"));
    });

    test("agenda renders a cell for the event time", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: ""
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.text(), "12:00 AM-1:00 AM");
    });

    test("agenda renders a cell for the event title", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event title"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.next().text(), "event title");
    });

    test("agenda renders a table row for events", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event title"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");
        equal(table.find("tr:has(td)").length, 1);
    });

    test("agenda renders a table rows for long event which starts before and ends outside of the timeframe", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/04 00:00"),
                end: new Date("2013/12/06 01:00"),
                title: "event title"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");
        equal(table.find("tr:has(td)").length, 8);
    });

    test("agenda groups events having the same date", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 2"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");
        var tableRows = table.find("tr:has(td)");

        equal(tableRows.eq(0).find("td").length, 3);
        equal(tableRows.eq(1).find("td").length, 2);
    });

    test("date cell has rowspan equal to the number of events for this date", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 2"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.attr("rowspan"), 2);
    });

    test("agenda creates date cells a date cell for every date", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/07 00:00"),
                end: new Date("2013/06/07 01:00"),
                title: "event 2"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCells = table.find("td.k-scheduler-datecolumn");

        equal(dateCells.length, 2);
    });

    test("agenda displays 'all day' in the time cell for all day events", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                isAllDay: true,
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.text(), "all day");
    });

    test("agenda sorts events by start time", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 22:00"),
                end: new Date("2013/06/06 23:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 08:00"),
                end: new Date("2013/06/06 09:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "8:00 AM-9:00 AM");
    });

    test("agenda sorts events by end time", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 08:00"),
                end: new Date("2013/06/06 10:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 08:00"),
                end: new Date("2013/06/06 9:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "8:00 AM-9:00 AM");
    });

    test("agenda splits a two day event to two tasks", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 08:00"),
                end: new Date("2013/06/07 10:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.eq(0).find(".k-scheduler-agendaday").text(), "06");
        equal(dateCell.eq(1).find(".k-scheduler-agendaday").text(), "07");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "8:00 AM");
        equal(timeCell.eq(1).text(), "10:00 AM");
    });

    test("agenda splits a two day (less than 24 hour) event to two tasks", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 20:00"),
                end: new Date("2013/06/07 10:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.eq(0).find(".k-scheduler-agendaday").text(), "06");
        equal(dateCell.eq(1).find(".k-scheduler-agendaday").text(), "07");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "8:00 PM");
        equal(timeCell.eq(1).text(), "10:00 AM");
    });

    test("agenda splits a three day event to three tasks", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 08:00"),
                end: new Date("2013/06/08 10:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.eq(0).find(".k-scheduler-agendaday").text(), "06");
        equal(dateCell.eq(1).find(".k-scheduler-agendaday").text(), "07");
        equal(dateCell.eq(2).find(".k-scheduler-agendaday").text(), "08");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "8:00 AM");
        equal(timeCell.eq(1).text(), "all day");
        equal(timeCell.eq(2).text(), "10:00 AM");
    });

    test("all day events are displayed first", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: ""
            }),
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                isAllDay: true,
                title: ""
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");
        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(0).text(), "all day");
        equal(timeCell.eq(1).text(), "12:00 AM-1:00 AM");
    });

    test("delete icon is not rendered if view is not editable", 1, function() {

        var agenda = agendaView({ date: new Date("2013/06/06 00:00"), editable: false });

        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        equal(table.find(".k-si-close").length, 0);
    });

    test("agenda view WTF", function() {
        var agenda = agendaView({ date: new Date("2014/1/3") });

        agenda.render([
            new Event({
                start: new Date("2014/1/1 11:00"),
                end: new Date("2014/1/3 9:00"),
                title: ""
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.text(), "9:00 AM");
    });

    test("clicking the delete icon fires the remove event", 1, function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: ""
        });

        agenda.render([event]);

        agenda.bind("remove", function(e) {
            equal(e.uid, event.uid);
        });

        var table = agenda.element.find(".k-scheduler-table");

        table.find(".k-si-close").click();
    });

    test("agenda wraps time cells in a div", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.children("div").length, 1);
    });

    test("agenda renders right icon for events which continue on the next day", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/07 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn:first");

        equal(timeCell.find(".k-icon").length, 1);
        equal(timeCell.find(".k-i-arrow-e").length, 1);
    });

    test("agenda renders left icon for events which start on the previous day", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/07 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn:last");

        equal(timeCell.find(".k-icon").length, 1);
        equal(timeCell.find(".k-i-arrow-w").length, 1);
    });

    test("agenda renders left and right icon for events which start on the previous day and end on the next day", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/08 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").eq(1);

        equal(timeCell.find(".k-icon").length, 2);
        equal(timeCell.find(".k-i-arrow-w").length, 1);
        equal(timeCell.find(".k-i-arrow-e").length, 1);
    });

    test("setDate makes endDate a week away from startDate", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        equal(agenda.endDate().getTime() - agenda.startDate().getTime(), 7 * kendo.date.MS_PER_DAY);
    });

    test("agenda shows tasks which end within the specified interval", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        var event = new Event({
            start: new Date("2013/06/13 00:00"),
            end: new Date("2013/06/14 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCells = table.find("td.k-scheduler-timecolumn");

        equal(timeCells.length, 1);
    });

    test("agenda renders refresh icon for events which have recurring rule", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: "",
            recurrenceRule: "FREQ=DAILY"
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var taskCell = table.find(".k-task");

        equal(taskCell.find(".k-i-refresh").length, 1);
    });

    test("agenda renders refresh icon for event with recurrenceId", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: "",
            recurrenceId: "1"
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var taskCell = table.find(".k-task");

        equal(taskCell.find(".k-i-refresh").length, 1);
    });

    test("agenda renders exception icon for events which are recurring exception", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });
        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: "",
            id: 1,
            recurrenceId: 12,
            recurrenceRule: "FREQ=DAILY"
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        var taskCell = table.find(".k-task");

        equal(taskCell.find(".k-i-exception").length, 1);
        equal(taskCell.find(".k-i-refresh").length, 0);
    });

    test("editable:true allows only deletion of events", function() {
        var agenda = agendaView({ editable: true, date: new Date("2013/06/06 00:00") });

        var editable = agenda.options.editable;

        ok(editable);
        ok(editable.delete === true);
        ok(editable.create === false);
        ok(editable.update === false);
    });

    test("editable.delete:false disallows deletion", function() {
        var agenda = agendaView({ editable: { delete: false }, date: new Date("2013/06/06 00:00") });

        var editable = agenda.options.editable;

        ok(editable.delete === false);
    });

    test("agenda renders rows with ARIA role", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: "",
            recurrenceRule: "FREQ=DAILY"
        });

        agenda.render([event]);

        var table = agenda.content.find(".k-scheduler-table");

        var rows = table.find("tr");

        equal(rows.filter("[role=row]").length, rows.length);
    });

    test("agenda renders cells with ARIA attribute", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: "",
            recurrenceRule: "FREQ=DAILY"
        });

        agenda.render([event]);

        var table = agenda.content.find(".k-scheduler-table");

        var rows = table.find("tr");

        equal(rows.filter("[aria-selected=false]").length, rows.length);
    });

    test("Name is the same case as the class name", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 00:00"),
                title: ""
            })
        ]);

        var viewName = "agenda";
        equal(viewName, agenda.name);
    });

    module("mobile phone agenda view", {
        teardown: function() {
            jasmine.clock().uninstall();
            if (agenda) {
                agenda.destroy();
            }
            kendo.destroy(QUnit.fixture);
        }
    });

    test("date cell has colspan equal to the number of detail columns", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00"), mobile: "phone" });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 2"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.attr("colspan"), 2);
    });

    test("date cell has no rowspan set", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00"), mobile: "phone" });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 1"
            }),
            new Event({
                start: new Date("2013/06/06 00:00"),
                end: new Date("2013/06/06 01:00"),
                title: "event 2"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        ok(!dateCell.filter("[rowspan]").length);
    });

    test("delete icon is not rendered", 1, function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00"), mobile: "phone" });

        var event = new Event({
            start: new Date("2013/06/06 00:00"),
            end: new Date("2013/06/06 01:00"),
            title: ""
        });

        agenda.render([event]);

        var table = agenda.element.find(".k-scheduler-table");

        equal(table.find(".k-si-close").length, 0);
    });

    test("agenda renders table with headers only for time and event", function() {
        var agenda = agendaView({ date: new Date("2013/06/06 00:00"), mobile: "phone" });

        var table = agenda.element.find(".k-scheduler-table");

        ok(!table.find(".k-scheduler-datecolumn").length);

        var timeHeaderCell = table.find(".k-scheduler-timecolumn");

        equal(timeHeaderCell.text(), "Time");

        var eventHeaderCell = timeHeaderCell.next();

        equal(eventHeaderCell.text(), "Event");
    });

    test("agenda renders a table rows for event which starts after the start and ends pass the end", function() {
        var agenda = agendaView({ date: new Date("2015/8/21") });

        agenda.render([
            new Event({
                start: new Date("2015/8/26 08:00 AM"),
                end: new Date("2015/8/29 12:00 AM"),
                title: "event title"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");
        equal(table.find("tr:has(td)").length, 3);
    });

    test("agenda displays only one task for event ending at midnight", function() {
        var agenda = agendaView({ date: new Date("2013/06/07 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 14:00"),
                end: new Date("2013/06/07 00:00"),
                title: "event 1"
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.length, 0);
    });

    test("agenda displays two tasks for all day event ending at midnight", function() {
        var agenda = agendaView({ date: new Date("2013/06/07 00:00") });

        agenda.render([
            new Event({
                start: new Date("2013/06/06 14:00"),
                end: new Date("2013/06/07 00:00"),
                title: "event 1",
                isAllDay: true
            })
        ]);

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.length, 1);
    });

    module("grouped by date agenda view", {
        setup: function() {
            jasmine.clock().install();
            dom = document.createElement("div");
            QUnit.fixture[0].appendChild(dom);
            dom = $(dom).addClass("k-scheduler");
        },
        teardown: function() {
            jasmine.clock().uninstall();
            dom.data("kendoagenda").destroy();
            kendo.destroy(QUnit.fixture);
        }
    });




    function groupedAgendaView(options) {
                var startDate = new Date(2013, 1, 3, 0, 0, 0, 0);
                var end = new Date(startDate);
                end.setHours(1);

                 var startDate1 = new Date(2013, 1, 4, 0, 0, 0);
                var end1 =  new Date(2013, 1, 5, 0, 0, 0);

                options = options || {};
                options = $.extend({
                    selectable: true,
                    date: new Date(2013, 1, 3, 0, 0, 0, 0),
                    views: [
                        "agenda"
                    ],
                    group: {
                        resources: ["Rooms", "Attendees"],
                        date: true
                    },
                     dataSource: [
                        { start: startDate, end: end, title: "first event title", roomId: 2, attendees: 1 },
                        { start: startDate1, end: end1, title: "second event title", isAllDay: true, roomId: 2, attendees: 2 },
                        { start: startDate, end: end1, title: "third event title", roomId: 2, attendees: 1 },
                        { start: startDate, end: end, title: "fifth event title", roomId: 2, attendees: 2 },

                    ],
                    resources: [
                    {
                        field: "roomId",
                        name: "Rooms",
                        dataSource: [
                            { text: "Resource1", value: 1, color: "#6eb3fa" },
                            { text: "Resource2", value: 2, color: "#f58a8a" }
                        ],
                        title: "Room"
                    }, {
                        field: "attendees",
                        name: "Attendees",
                        dataSource: [
                            { text: "Alex", value: 1, color: "#f8a398" },
                            { text: "Bob", value: 2, color: "#51a0ed" },
                            { text: "Charlie", value: 3, color: "#56ca85" }
                        ],
                        multiple: true,
                        title: "Attendees"
                    }]
                }, options);

                scheduler = new Scheduler(dom, options);
          jasmine.clock().tick(1);
                dom.focus();

                agenda = scheduler.view();

                return agenda;
            }

    test("agenda renders table with headers for date, time and event", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0), dataSource:[] });

        var table = agenda.element.find(".k-scheduler-table");

        var dateHeaderCell = table.find("th").eq(0);

        ok(dateHeaderCell.hasClass("k-scheduler-datecolumn"));
        equal(dateHeaderCell.text(), "Date");

        var timeHeaderCell = table.find("th").eq(3);

        ok(timeHeaderCell.hasClass("k-scheduler-timecolumn"));
        equal(timeHeaderCell.text(), "Time");

        var eventHeaderCell = timeHeaderCell.next();

        equal(eventHeaderCell.text(), "Event");
    });

    test("eventTemplate is wrapped in a div with class k-task", function() {
        var agenda = groupedAgendaView({
            date: new Date(2013, 1, 3, 0, 0, 0, 0),
            eventTemplate: "<strong>#: title #</strong>"
        });

        ok(agenda.element.find("strong").parent().is("div.k-task"));
    });

    test("agenda renders a cell for the event date", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.find(".k-scheduler-agendaday").first().text(), "03");
        equal(dateCell.find(".k-scheduler-agendaweek").first().text(), "Sunday");
        equal(dateCell.find(".k-scheduler-agendadate").first().text(), "February, 2013");
    });

    test("agenda renders a k-first class for event date cell", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        ok(dateCell.hasClass("k-first"));
    });

    test("agenda renders a cell for the event time", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").first();

        equal(timeCell.text(), "12:00 AM-1:00 AM");
    });

    test("agenda renders a cell for the event title", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").first();

        equal(timeCell.next().text(), "first event title");
    });

    test("agenda renders a table row for events", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0)});

        var table = agenda.element.find(".k-scheduler-table");
        equal(table.find("tr:has(td)").length, 6);
    });

    test("agenda groups events having the same date", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");
        var tableRows = table.find("tr:has(td)");

        equal(tableRows.eq(0).find("td").length, 5);
        equal(tableRows.eq(1).find("td").length, 2);
    });

    test("date cell has rowspan equal to the number of events for this date", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.attr("rowspan"), 3);

         var firstResourceCell = dateCell.next();

         equal(firstResourceCell.attr("rowspan"), 3);

         var secondResourceCell = firstResourceCell.next();

        equal(secondResourceCell.attr("rowspan"), 2);
    });

    test("agenda creates date cells a date cell for every date", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var dateCells = table.find("td.k-scheduler-datecolumn");

        equal(dateCells.length, 3);
    });

    test("agenda displays 'all day' in the time cell for all day events", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").last();

        equal(timeCell.text(), "all day");
    });


    test("agenda splits a two day (less than 24 hour) event to two tasks", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var dateCell = table.find("td.k-scheduler-datecolumn");

        equal(dateCell.eq(0).find(".k-scheduler-agendaday").text(), "03");
        equal(dateCell.eq(1).find(".k-scheduler-agendaday").text(), "04");

        var timeCell = table.find("td.k-scheduler-timecolumn");

        equal(timeCell.eq(1).text(), "12:00 AM");
        equal(timeCell.eq(3).text(), "12:00 AM");
    });

    test("delete icon is not rendered if view is not editable", 1, function() {

        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0), editable: false });

        var table = agenda.element.find(".k-scheduler-table").first();

        equal(table.find(".k-si-close").length, 0);
    });

    test("agenda wraps time cells in a div", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").first();

        equal(timeCell.children("div").length, 1);
    });

    test("agenda renders right icon for events which continue on the next day", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").eq(1);

        equal(timeCell.find(".k-icon").length, 1);
        equal(timeCell.find(".k-i-arrow-e").length, 1);
    });

    test("agenda renders left icon for events which start on the previous day", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCell = table.find("td.k-scheduler-timecolumn").eq(3);

        equal(timeCell.find(".k-icon").length, 1);
        equal(timeCell.find(".k-i-arrow-w").length, 1);
    });

    test("setDate makes endDate a week away from startDate", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });
        equal(agenda.endDate().getTime() - agenda.startDate().getTime(), 7 * kendo.date.MS_PER_DAY);
    });

    test("agenda shows tasks which end within the specified interval", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.element.find(".k-scheduler-table");

        var timeCells = table.find("td.k-scheduler-timecolumn");

        equal(timeCells.length, 6);
    });

    test("agenda renders rows with ARIA role", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.content.find(".k-scheduler-table");

        var rows = table.find("tr");

        equal(rows.filter("[role=row]").length, rows.length);
    });

    test("agenda renders cells with ARIA attribute", function() {
        var agenda = groupedAgendaView({ date: new Date(2013, 1, 3, 0, 0, 0, 0) });

        var table = agenda.content.find(".k-scheduler-table");

        var rows = table.find("tr");

        equal(rows.filter("[aria-selected=false]").length, rows.length);
    });

})();
