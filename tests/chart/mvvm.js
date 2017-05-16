(function() {
    var dom;

    module("chart MVVM", {
        setup: function() {
            window.chartDataBound  = function() {
                ok(true);
            }
        },
        teardown: function() {
            kendo.destroy(dom);

            delete window.chartDataBound;
        }
    });

    test("initializes a chart when data role is chart", function() {
        dom = $('<div data-role="chart"/>');

        kendo.bind(dom, {}, kendo.dataviz.ui);

        ok(dom.data("kendoChart") instanceof kendo.dataviz.ui.Chart);
    });

    test("initializes options from data attributes", function() {
        dom = $('<div data-role="chart" data-axis-defaults="{ foo: \'bar\' }" data-series=\'[{"field":"foo"}]\'"/>');

        kendo.bind(dom, {}, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        equal(chart.options.series.length, 1);
        equal(chart.options.axisDefaults.foo, "bar");
    });

    test("initalizes data source", function() {
        dom = $('<div data-role="chart" data-bind="source:items" />');

        kendo.bind(dom, { items: ["foo", "bar"] }, kendo.dataviz.ui );

        equal(dom.data("kendoChart").dataSource.view()[0], "foo");
        equal(dom.data("kendoChart").dataSource.view()[1], "bar");
    });

    test("binding chart initialized before binding", function() {
        dom = $('<div data-bind="source:items" data-series=\'[{"field":"text"}]\'"/>');

        var observable = kendo.observable({ items: [{text:"foo"}, {text:"bar"}]});

        var chart = dom.kendoChart().data("kendoChart");

        kendo.bind(dom, observable, kendo.dataviz.ui);

        equal(chart.dataSource.data().length, 2);
        equal(chart.options.series.length, 1);
        deepEqual(chart.options.series[0].data.length, 2);
    });

    test("binding chart initialized after binding", function() {
        dom = $('<div data-bind="source:items" />');

        var observable = kendo.observable({ items: [{text:"foo"}, {text:"bar"}] });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var chart =dom.kendoChart({series:[{ field: "text" }] }).data("kendoChart");

        equal(chart.dataSource.data().length, 2);
        equal(chart.options.series.length, 1);
        equal(chart.options.series[0].data.length, 2);
    });

    test("destroying binding targets when the datasource changes", function() {
        dom = $('<div data-role="chart" data-bind="source:items" />');

        var observable = kendo.observable({ items: [{ text:"foo"} ] });

        kendo.bind(dom, observable, kendo.dataviz.ui);
        dom.data("kendoChart").refresh();

        equal(observable.items._events["change"].length, 2); //1 for the text binding and 1 for the ObservableArray
    });

    test("removing items from the model updates the UI", function() {
        dom = $('<div data-bind="source:items" data-series=\'[{"field":"text"}]\'"/>');

        var observable = kendo.observable({ items: [{ text:"foo"},{ text: "bar" },{ text: "baz" }] });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var chart = dom.kendoChart().data("kendoChart");

        observable.items.splice(0,1);

        equal(chart.options.series[0].data.length, 2);
    });

    test("binding are removed if element is rebind", 1, function() {
        dom = $('<div data-role="chart" data-bind="source:items" />');

        var observable = kendo.observable({ items: [{ text:"foo"},{ text: "bar" } ] });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var destroy = stub(dom[0].kendoBindingTarget, "destroy");

        kendo.bind(dom, observable, kendo.dataviz.ui);

        equal(destroy.calls("destroy"), 1);
    });

    test("expressions are destroyed", 1, function() {
        dom = $('<div data-role="chart" data-bind="source:items" />');

        var observable = kendo.observable({ items: [{ text:"foo"},{ text: "bar" } ] });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var destroy = stub(dom[0].kendoBindingTarget, "destroy");

        kendo.bind(dom, observable, kendo.dataviz.ui);

        equal(destroy.calls("destroy"), 1);
    });

    test("destroys detaches the events to widget", function() {
        dom = $('<div data-role="chart" data-bind="source:items" />');

        var observable = kendo.observable({ items: [{text:"foo"}, {text:"bar"}] });

        kendo.bind(dom, observable, kendo.dataviz.ui);
        kendo.unbind(dom);

        var chart = dom.data("kendoChart");

        equal(chart._events["dataBound"].length, 0);
        equal(chart._events["dataBinding"].length, 0);
    });

    test("dataBound event is raised if attached as option", 1, function() {
        dom = $('<div data-role="chart" data-bound="chartDataBound" data-bind="source:items" />').data("series", [{ field: "text" }]);

        var observable = kendo.observable({
            items: [{text:"foo"}, {text:"bar"}]
        });

        kendo.bind(dom, observable, kendo.dataviz.ui);
    });

    test("dataBound event is raised if attached as option to a already initialized chart", 1, function() {
        dom = $('<div data-bound="chartDataBound" data-bind="source:items" />').kendoChart( { series: [{ field: "text" }] });

        var observable = kendo.observable({
            items: [{text:"foo"}, {text:"bar"}]
        });

        kendo.bind(dom, observable, kendo.dataviz.ui);
    });

    test("assign to DataSource as ViewModel field", function() {
        dom = $('<div data-role="chart" data-bind="source:dataSource" />').data("series", [{ field: "text" }]);

        var dataSource = new kendo.data.DataSource({
            data: [{text:"foo"}, {text:"bar"}]
        });

        var observable = kendo.observable({
            dataSource: dataSource
        });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        strictEqual(chart.dataSource, dataSource);
    });

    test("binding visible to true shows the chart", function() {
        dom = $('<div data-role="chart" data-bind="visible: visible"></div>');

        kendo.bind(dom, { visible: true }, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        ok(chart.wrapper.css("display") != "none", "chart is visible");
    });

    test("binding visible to false hides the chart", function() {
        dom = $('<div data-role="chart" data-bind="visible: visible"></div>');

        kendo.bind(dom, { visible: false }, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        ok(chart.wrapper.css("display") == "none", "chart is not visible");
    });

    test("binding invisible to true hides the chart", function() {
        dom = $('<div data-role="chart" data-bind="invisible: invisible"></div>');

        kendo.bind(dom, { invisible: true }, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        ok(chart.wrapper.css("display") == "none", "chart is invisible");
    });

    test("binding invisible to false shows the chart", function() {
        dom = $('<div data-role="chart" data-bind="invisible: invisible"></div>');

        kendo.bind(dom, { invisible: false }, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");

        ok(chart.wrapper.css("display") != "none", "chart is not invisible");
    });

    test("setting autobind when bound to DataSource", function() {
        dom = $('<div data-role="chart" data-bind="source:dataSource" data-auto-bind="false" data-series=\'[{"field":"text"}]\'"/>');

        var dataSource = new kendo.data.DataSource({
            data: [{text:"foo"}, {text:"bar"}]
        });

        var observable = kendo.observable({
            dataSource: dataSource
        });

        kendo.bind(dom, observable, kendo.dataviz.ui);

        var chart = dom.data("kendoChart");
        ok(!chart.options.series[0].data.length);
    });

    test("initializes renderAs value", function() {
        dom = $('<div data-role="chart" data-render-as="canvas"/>');

        kendo.bind(dom, {}, kendo.dataviz.ui);

        equal(dom.data("kendoChart").options.renderAs, "canvas");
    });

    test("initializes seriesColors", function() {
        dom = $('<div data-role="chart" data-series-colors="[\'red\']"/>');

        kendo.bind(dom, {}, kendo.dataviz.ui);

        deepEqual(dom.data("kendoChart").options.seriesColors, ["red"]);
    });
})();
