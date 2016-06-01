(function() {
    var Groupable = kendo.ui.Groupable,
        DataSource = kendo.data.DataSource,
        div,
        extend = $.extend;

    module("kendo.ui.Groupable", {
        setup: function() {
            kendo.ns = "kendo-";
            div = $("<div><div class='container' style='height:20px;'></div><table><thead><th data-kendo-field='field1'></th><th data-kendo-field='field2'></th></thead></table></div>").prependTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
            div.remove();
        }
    });

    function moveOverDropTarget(draggable, dropTarget) {
        var position = dropTarget.position();

        draggable.trigger({ type: "mousedown", pageX: 1, pageY: 1 });

        $(document.documentElement).trigger({
            type: "mousemove",
            pageX: position.left,
            pageY: position.top,
            clientX: position.left,
            clientY: position.top
        });

        $(document.documentElement).trigger({
            type: "mouseup",
            pageX: position.left,
            pageY: position.top,
            clientX: position.left,
            clientY: position.top
        });
    }

    function moveOutDropTarget(draggable, dropTarget) {
        var position = dropTarget.position();

        draggable.trigger({ type: "mousedown", pageX: 1, pageY: 1 });
        $(document.documentElement).trigger({ type: "mousemove", pageX: position.left, pageY: position.top, clientX: position.left, clientY: position.top });
        $(document.documentElement).trigger({ type: "mousemove", pageX: position.left, pageY: position.top - 10, clientX: position.left, clientY: position.top - 10 });
        $(document.documentElement).trigger({ type: "mouseup" });
    }

    function ev(options) {
        return $.extend(new $.Event, options);
    }

    test("group container as string is intialized as DropTarget", function() {
        var groupContainer = ".container";
        var groupable = new Groupable(div, { groupContainer:  groupContainer });

        ok($(groupContainer).data("kendoDropTarget"));
    });

    test("group container as jQuery object is intialized as DropTarget", function() {
        var groupContainer = $(".container");
        var groupable = new Groupable(div, { groupContainer:  groupContainer });

        ok(groupContainer.data("kendoDropTarget"));
    });

    test("element is initialized as Draggable ", function() {
        var groupable = new Groupable(div);

        ok(div.data("kendoDraggable"));
    });

    test("dropping over group container creates group indicator", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);

        equal(groupContainer.children().length, 1);
    });

    test("dropping over group container appends group indicator", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            th = div.find("th");

        moveOverDropTarget(th.eq(0), groupContainer);
        moveOverDropTarget(th.eq(1), groupContainer);

        equal(groupContainer.children().length, 2);
    });

    test("dropping over group container same indicator twice rejects it", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);
        moveOverDropTarget(th, groupContainer);

        equal(groupContainer.children().length, 1);
    });

    test("dropping out of group container indicator is not added", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            th = div.find("th:first");

        moveOutDropTarget(th, groupContainer);

        equal(groupContainer.children().length, 0);
    });

    test("indicator from drag out of container is destroyed", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        moveOutDropTarget(indicator, groupContainer);

        equal(groupContainer.children().length, 0);
    });

    test("clicking close button ungroup", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        indicator.find(".k-button").click();

        equal(groupContainer.children().length, 0);
    });

    test("descriptors returns group descriptors", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer });

       groupContainer.append(groupable.buildIndicator("field1"));
       groupContainer.append(groupable.buildIndicator("field2", "title", "desc"));

       var descriptors = groupable.descriptors();

       equal(descriptors.length, 2);
       equal(descriptors[0].field, "field1");
       equal(descriptors[0].dir, "asc");
       equal(descriptors[1].field, "field2");
       equal(descriptors[1].dir, "desc");
    });

    test("adding new group indicator calls dataSource group", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: extend({}, DataSource.create(), { group: function() {groupWasCalled = true;}})
            }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);

        ok(groupWasCalled);
    });

    test("removing group indicator calls dataSource group", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: extend({}, DataSource.create(), { group: function() {groupWasCalled = true;}})
            }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        moveOutDropTarget(indicator, groupContainer);

        ok(groupWasCalled);
    });

    test("removing group indicator by clicking close button calls dataSource group", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: extend({}, DataSource.create(), { group: function() {groupWasCalled = true;}})
            }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        indicator.find(".k-button").click();

        ok(groupWasCalled);
    });

    test("sort asc group indicator change to desc", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        indicator.find(".k-link").click();

        equal(groupContainer.find(".k-group-indicator:first").attr("data-kendo-dir"), "desc");
    });

    test("sort desc group indicator change to asc", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            indicator = groupContainer.append(groupable.buildIndicator("", "", "desc")).find(".k-group-indicator:first");

        indicator.find(".k-link").click();

        equal(groupContainer.find(".k-group-indicator:first").attr("data-kendo-dir"), "asc");
    });

    test("sorting calls dataSource group", function() {
        var groupContainer = $(".container"),
            groupWasCalled = false,
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: extend({}, DataSource.create(), { group: function() {groupWasCalled = true;}})
            }),
            indicator = groupContainer.append(groupable.buildIndicator("")).find(".k-group-indicator:first");

        indicator.find(".k-link").click();

        ok(groupWasCalled);
    });

    test("change of grouped dataSource creates group indicators", function() {
        var groupContainer = $(".container"),
            dataSource =  DataSource.create([{field1: "foo", field2: "bar"}, {field1: "foo", field2: "baz"}]),
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: dataSource
            }),
            indicator;

        dataSource.group({field: "field1", dir: "desc"});

        indicator = groupContainer.find(".k-group-indicator");
        equal(indicator.length, 1);
        equal(indicator.attr(kendo.attr("field")), "field1");
        equal(indicator.attr(kendo.attr("dir")), "desc");
    });

    test("data-title is set for group indicator", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer }),
            indicator = groupContainer.append(groupable.buildIndicator("field", "field title")).find(".k-group-indicator:first");

        equal(groupContainer.find(".k-group-indicator:first").attr(kendo.attr("title")), "field title");
    });

   test("group descriptor aggregates is empty array if not set", function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer });

       groupContainer.append(groupable.buildIndicator("field", "field title", "desc"));

       var descriptors = groupable.descriptors();

       equal(descriptors.length, 1);
       ok(!descriptors[0].aggregates.length);
   });

   test("group descriptors contains aggregates for all of the fields", function() {
       div.remove();
       div = $("<div><div class='container'></div><table><thead><th data-kendo-field='field1' data-kendo-aggregates='count'></th><th data-kendo-field='field2' data-kendo-aggregates='sum'></th></thead></table></div>").appendTo(QUnit.fixture);

       var groupContainer = $(".container"),
           groupable = new Groupable(div, { groupContainer:  groupContainer });

       groupContainer.append(groupable.buildIndicator("field", "field title", "desc"));

       var descriptor = groupable.descriptors()[0],
            aggregates = descriptor.aggregates;

       equal(aggregates.length, 2);
       equal(aggregates[0].field,"field1");
       equal(aggregates[0].aggregate,"count");
       equal(aggregates[1].field,"field2");
       equal(aggregates[1].aggregate,"sum");
   });

   test("dropping over group container creates group indicator for complex field ", function() {
       div.remove();
       div = $("<div><div class='container' style='height:10px;'></div><table><thead><th data-kendo-field='field1.foo'></th><th data-kendo-field='field2.foo'></th></thead></table></div>").prependTo(QUnit.fixture);

        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer, dataSource: new kendo.data.DataSource() }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);

        equal(groupContainer.children().length, 1);
    });

    test("group container draggable is destroyed", function() {
        div.remove();
        div = $("<div><div class='container' style='height:10px;'></div><table><thead><th data-kendo-field='field1.foo'></th><th data-kendo-field='field2.foo'></th></thead></table></div>").prependTo(QUnit.fixture);

        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer, dataSource: new kendo.data.DataSource() }),
            draggable = groupContainer.data("kendoDraggable");

        draggable = stub(draggable, {
            destroy: draggable.destroy
        });

        groupable.destroy();

        equal(draggable.calls("destroy"), 1);
    });

    test("group container drop target is destroyed", function() {
        div.remove();
        div = $("<div><div class='container' style='height:10px;'></div><table><thead><th data-kendo-field='field1.foo'></th><th data-kendo-field='field2.foo'></th></thead></table></div>").prependTo(QUnit.fixture);

        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer, dataSource: new kendo.data.DataSource() }),
            dropTarget = groupContainer.data("kendoDropTarget");

        dropTarget = stub(dropTarget, {
            destroy: dropTarget.destroy
        });

        groupable.destroy();

        equal(dropTarget.calls("destroy"), 1);
    });

    test("draggable is destroyed", function() {
        div.remove();
        div = $("<div><div class='container' style='height:10px;'></div><table><thead><th data-kendo-field='field1.foo'></th><th data-kendo-field='field2.foo'></th></thead></table></div>").prependTo(QUnit.fixture);

        var groupContainer = $(".container"),
            groupable = new Groupable(div, { groupContainer:  groupContainer, dataSource: new kendo.data.DataSource() }),
            draggable = groupable.draggable;

        draggable = stub(draggable, {
            destroy: draggable.destroy
        });

        groupable.destroy();

        equal(draggable.calls("destroy"), 1);
    });

    test("external draggable is not destroyed", function() {
        div.remove();
        div = $("<div><div class='container' style='height:10px;'></div><table><thead><th data-kendo-field='field1.foo'></th><th data-kendo-field='field2.foo'></th></thead></table></div>").prependTo(QUnit.fixture);

        var groupContainer = $(".container"),
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: new kendo.data.DataSource(),
                draggable: new kendo.ui.Draggable($("<div></div>").appendTo(QUnit.fixture))
            }),
            draggable = groupable.draggable;

        draggable = stub(draggable, {
            destroy: draggable.destroy
        });

        groupable.destroy();

        equal(draggable.calls("destroy"), 0);
    });

    test("sorting triggers change event", 3, function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: DataSource.create(),
                change: function(e) {
                    equal(e.groups.length, 1);
                    equal(e.groups[0].field, "foo");
                    equal(e.groups[0].dir, "desc");
                }
            }),
            indicator = groupContainer.append(groupable.buildIndicator("foo")).find(".k-group-indicator:first");

        indicator.find(".k-link").click();
    });

    test("adding new group indicator triggers change event", 3, function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: DataSource.create(),
                change: function(e) {
                    equal(e.groups.length, 1);
                    equal(e.groups[0].field, "field1");
                    equal(e.groups[0].dir, "asc");
                }
            }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);
    });

    test("preventing change event does not set the group to the DataSource", 1, function() {
        var groupContainer = $(".container"),
            groupable = new Groupable(div, {
                groupContainer:  groupContainer,
                dataSource: DataSource.create(),
                change: function(e) {
                    e.preventDefault();
                }
            }),
            th = div.find("th:first");

        moveOverDropTarget(th, groupContainer);

        equal(groupable.dataSource.group().length, 0);
    });
})();
