(function() {
    var keys = kendo.keys,
        scheduler,
        container,
        now;

    module("scheduler ARIA", {
        setup: function() {
            jasmine.clock().install();
            now = new Date();

            container = $("<div>");

            QUnit.fixture.append(container);

            scheduler = new kendo.ui.Scheduler(container, {
                selectable: true,
                views: [
                    "day",
                    { type: "week", selected: true }
                ],
                dataSource: [
                    { start: now, end: new Date(now + (60 * 60 * 1000)), title: "Test" }
                ],
                messages: {
                    ariaSlotLabel: "Selected slot",
                    ariaEventLabel: "Selected event"
                }
            });
        },

        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(container);
        }
    });

    function createSampleEvent() {
        return scheduler.dataSource.add({
            title: "Foo",
            start: new Date(now.setHours(10)),
            end: new Date(now.setHours(11))
        });
    }

    test("scheduler persists last selected cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });
          jasmine.clock().tick(1);
        var cell = scheduler.view().current();
        equal(cell, td[0]);
    });

    test("scheduler persists last selected event", function() {
        createSampleEvent();
          jasmine.clock().tick(1);
        var event = container.find(".k-event").eq(0);

        event.trigger({
            type: "mousedown",
            currentTarget: event
        });
          jasmine.clock().tick(1);
        var div = scheduler.view().current();
        equal(div, event[0]);
    });

    test("scheduler sets id to the cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        ok(td.attr("id"));
    });

    test("scheduler adds aria-label to the selected cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        equal(td.attr("aria-label"), "Selected slot");
    });


    test("scheduler adds aria-label to the selected event", function() {
        createSampleEvent();
          jasmine.clock().tick(1);
        var event = container.find(".k-event").eq(0);

        event.trigger({
            type: "mousedown",
            currentTarget: event
        });

        equal(event.attr("aria-label"), "Selected event");
    });

    test("scheduler adds aria-selected to the selected slot", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        ok(td.attr("aria-selected"));
    });

    test("scheduler adds aria-selected to the selected event", function() {
        createSampleEvent();
          jasmine.clock().tick(1);
        var event = container.find(".k-event").eq(0);

        event.trigger({
            type: "mousedown",
            currentTarget: event
        });

        ok(event.attr("aria-selected"));
    });

    test("scheduler sets aria-activedescendant to the wrapper", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        ok(container.attr("aria-activedescendant"));
    });

    test("scheduler removes id from current cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");
        var td2 = container.find(".k-scheduler-content td").eq(1);

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        td2.trigger({
            type: "mousedown",
            currentTarget: td2
        });

        ok(!td.attr("id"));
        ok(td2.attr("id"));
    });

    test("scheduler removes aria-label from current cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");
        var td2 = container.find(".k-scheduler-content td").eq(1);

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        td2.trigger({
            type: "mousedown",
            currentTarget: td2
        });

        ok(!td.attr("aria-label"));
        equal(td2.attr("aria-label"), "Selected slot");
    });

    test("scheduler sets aria-selected to false on selection of other cell", function() {
          jasmine.clock().tick(1);
        var td = container.find(".k-scheduler-content td:first");
        var td2 = container.find(".k-scheduler-content td").eq(1);

        td.trigger({
            type: "mousedown",
            currentTarget: td
        });

        td2.trigger({
            type: "mousedown",
            currentTarget: td2
        });

        equal(td.attr("aria-selected"), "false");
        equal(td2.attr("aria-selected"), "true");
    });

    test("scheduler adds aria-label attribute to prev and next navigation buttons", function(){
        jasmine.clock().tick(1);
        var toolbar = scheduler.toolbar;

        equal(toolbar.find(".k-nav-prev .k-link").attr("aria-label"), "Previous");
        equal(toolbar.find(".k-nav-next .k-link").attr("aria-label"), "Next");
    });
})();
