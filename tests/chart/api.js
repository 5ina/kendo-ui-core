(function() {
    var dataviz = kendo.dataviz,
        draw = dataviz.drawing;
        Chart = dataviz.ui.Chart;

    (function() {
        var chart;

        function setupChart(options) {
            chart = createChart(options);
        }

        // ------------------------------------------------------------
        module("refresh / redraw", {
            setup: function() {
                setupChart({series: [{}]});
            },
            teardown: destroyChart
        });

        test("refresh applies axis defaults", function() {
            $.extend(chart.options, {
                axisDefaults: {
                    flag: true
                }
            });

            chart.refresh();

            ok(chart.options.categoryAxis.flag === true);
        });

        test("redraw applies axis defaults", function() {
            $.extend(chart.options, {
                axisDefaults: {
                    flag: true
                }
            });

            chart.redraw();

            ok(chart.options.categoryAxis.flag === true);
        });

        test("redraw only redraws specified pane", 1, function() {
            setupChart({
                panes: [{ name: "top" }, { name: "bottom" }]
            });

            var plotArea = chart._model._plotArea;
            plotArea.redraw = function(pane) {
                ok(pane === plotArea.panes[1]);
            };

            chart.redraw("bottom");
        });

        test("redraw redraws default pane if invalid name is specified", 1, function() {
            setupChart({
                panes: [{ name: "top" }, { name: "bottom" }]
            });

            var plotArea = chart._model._plotArea;
            plotArea.redraw = function(pane) {
                ok(pane === plotArea.panes[0]);
            };

            chart.redraw("middle");
        });

        test("removes category axis aliases after init", 1, function() {
            setupChart({
                panes: [{ name: "top" }, { name: "bottom" }],
                categoryAxes: [{}]
            });

            ok(!chart.options.categoryAxes);
        });

        test("redraw keeps categories when using categoryAxes alias", function() {
            setupChart({
                dataSource: {
                    data: [{
                        type: "alpha",
                        value: 100
                    }]
                },
                series: [{
                    type: "column",
                    data: [1000]
                }],
                panes: [{
                    name: "top"
                }],
                categoryAxes: [{
                    field: "type",
                    pane: "top"
                }]
            });

            chart.redraw("top");
            equal(chart._model._plotArea.categoryAxis.options.categories[0], "alpha");
        });

        test("removes value axis alias after init", 1, function() {
            setupChart({
                series: [{
                    type: "column",
                    data: [1000]
                }],
                panes: [{
                    name: "top"
                }],
                valueAxes: [{
                    field: "type",
                    pane: "top"
                }]
            });

            ok(!chart.options.valueAxes);
        });

        test("refresh applies series defaults", function() {
            $.extend(chart.options, {
                seriesDefaults: {
                    labels: { visible: true }
                }
            });

            chart.refresh();

            equal(chart.options.series[0].labels.visible, true);
        });

        test("redraw applies series defaults", function() {
            $.extend(chart.options, {
                seriesDefaults: {
                    labels: { visible: true }
                }
            });

            chart.redraw();

            equal(chart.options.series[0].labels.visible, true);
        });

        test("redraw replaces SVG element", function() {
            chart.element.find("svg").data("dirty", true);
            chart.redraw();

            ok(!chart.element.data("dirty") > 0);
        });

        test("redraw sets series defaults", function() {
            setupChart({
                series: [{
                    type: "column",
                    data: [1000],
                    color: function() { return "foo"; }
                }],
                seriesColors: ["red"]
            });

            chart.redraw();
            equal(chart.options.series[0]._defaults.color, "red");
        });

        test("refresh sets series defaults", function() {
            setupChart({
                series: [{
                    type: "column",
                    data: [1000],
                    color: function() { return "foo"; }
                }],
                seriesColors: ["red"]
            });

            chart.refresh();
            equal(chart.options.series[0]._defaults.color, "red");
        });

        test("refresh applies changes to data-bound series", function() {
            setupChart({
                dataSource: [{ value: 1 }],
                series: [{ field: "value" }]
            });

            chart.options.series[0].flag = true;
            chart.refresh();

            ok(chart.options.series[0].flag);
        });

        test("refresh applies color to new series", function() {
            setupChart({
                seriesColors: ["red", "blue"],
                series: [{}]
            });

            chart.options.series.push({});
            chart.refresh();

            equal(chart.options.series[1].color, "blue");
        });

        test("refresh cleans up generated cateories", function() {
            setupChart({
                dataSource: [{ value: 1 }],
                series: [{ field: "value" }],
                categoryAxis: { categories: [] }
            });

            chart.options.series = [];
            chart.refresh();

            equal(chart.options.categoryAxis.categories.length, 0);
        });

        test("redraw clears cached size", function() {
            chart.element.css("width", 1000);
            chart.resize();

            chart.element.css("width", 0);
            chart.redraw();

            chart.element.css("width", 1000);
            chart.resize();

            equal(chart._model.options.width, 1000);
        });

        test("redraw creates a new overlay with the view and viewElement", function() {
            var highlight = chart._highlight;
            ok(highlight.view === chart._view);
            ok(highlight.viewElement === chart._viewElement);
        });

        test("redraw unsets active point", function() {
            chart._unsetActivePoint = function() { ok(true); };
            chart.redraw();
        });

        test("redraw resizes surface", function() {
            setupChart();

            chart.surface.resize = function() {
                ok(true);
            };
            chart.redraw();
        });

        // ------------------------------------------------------------
        (function() {
            module("chartArea size", {
                teardown: destroyChart
            });

            test("applies width in pixels", function() {
                setupChart({
                    chartArea: { width: 1000 }
                });
                equal(chart.element.width(), 1000);
            });

            test("applies height in pixels", function() {
                setupChart({
                    chartArea: { height: 500 }
                });
                equal(chart.element.height(), 500);
            });

            test("applies width in units", function() {
                setupChart({
                    chartArea: { width: "1000px" }
                });
                equal(chart.element.width(), 1000);
            });

            test("applies height", function() {
                setupChart({
                    chartArea: { height: "500px" }
                });
                equal(chart.element.height(), 500);
            });

            test("applies size to surface", function() {
                setupChart({
                    chartArea: {
                        height: 300,
                        width: 300
                    }
                });

                var size = chart.surface._size;
                equal(size.width, 300);
                equal(size.height, 300);
            });
        })();

        // ------------------------------------------------------------
        module("destroy", {
            setup: function() {
                setupChart({series: [{}]});
            }
        });

        test("removes data", function() {
            chart.destroy();
            ok(!$("#container").data("kendoChart"));
        });

        test("destroys tooltip", function() {
            chart._tooltip.destroy();
            chart._tooltip = { destroy: function() { ok(true); }, hide: $.noop };
            chart.destroy();
        });

        test("unbinds click from DOM container", function() {
            chart.destroy();
            ok(!($("#container").data("events") || {}).click);
        });

        test("unbinds mouseOver from DOM container", function() {
            chart.destroy();
            ok(!($("#container").data("events") || {}).mouseover);
        });

        test("unbinds DataSource change handler", function() {
            chart.destroy();
            equal(chart.dataSource._events["change"].length, 0);
        });

        // ------------------------------------------------------------
        var panePoint;
        var origEvent;

        function triggerMousewheel(delta) {
            chart._mousewheel({
                originalEvent: {
                    detail: delta * 3,
                    clientX: panePoint.x,
                    clientY: panePoint.y
                },
                preventDefault: function() {},
                stopPropagation: function() {}
            });
        }

        function createEventArg(options) {
            return kendo.deepExtend({
                event: { },
                x: {
                    startLocation: 0,
                    location: 0,
                    client: panePoint.x,
                    initialDelta: 0
                },
                y: {
                    startLocation: 0,
                    initialDelta: 0,
                    location: 0,
                    client: panePoint.y
                }
            }, options);
        }

        module("Events", {
            setup: function() {
                setupChart({
                    series: [{}],
                    valueAxis: { name: "value" },
                    chartArea: { width: 600, height: 400 }
                });
                panePoint = chart._plotArea.panes[0].chartsBox().center();
                origEvent = { clientX: panePoint.x, clientY: panePoint.y };
            },
            teardown: destroyChart
        });

        test("navigation does not start if no handlers are attached", 0, function() {
            stubMethod(Chart.fn, "_startNavigation", function() {
                ok(false);
            }, function() {
                chart._start(origEvent);
            });
        });

        test("navigation starts if dragStart handler is attached", 1, function() {
            chart.bind("dragStart", function() {});

            stubMethod(Chart.fn, "_startNavigation", function() {
                ok(true);
            }, function() {
                chart._start(origEvent);
            });
        });

        test("navigation starts if drag handler is attached", 1, function() {
            chart.bind("drag", function() {});

            stubMethod(Chart.fn, "_startNavigation", function() {
                ok(true);
            }, function() {
                chart._start(origEvent);
            });
        });

        test("navigation starts if dragEnd handler is attached", 1, function() {
            chart.bind("dragEnd", function() {});

            stubMethod(Chart.fn, "_startNavigation", function() {
                ok(true);
            }, function() {
                chart._start(origEvent);
            });
        });

        test("mousewheel down triggers zoom event (zoom out)", function() {
            chart.bind("zoom", function(e) {
                equal(e.axisRanges.value.max, 3.2);
            });
            triggerMousewheel(10);
        });

        test("mousewheel up triggers zoom event (zoom in)", function() {
            chart.bind("zoom", function(e) {
                equal(e.axisRanges.value.max, -0.8);
            });
            triggerMousewheel(-10);
        });

        asyncTest("mousewheel triggers zoomEnd with axisRanges", function() {
            chart.bind("zoomEnd", function(e) {
                ok(e.axisRanges.value);
                start();
            });
            triggerMousewheel(10);
        });

        // ------------------------------------------------------------
        module("Events / zoom selection", {
            setup: function() {
                setupChart({
                    series: [{}],
                    valueAxis: { name: "value" },
                    chartArea: { width: 600, height: 400 },
                    zoomable: true
                });

                chart._plotArea.paneByPoint = function() {
                    return chart._plotArea.panes[0];
                };
            },
            teardown: destroyChart
        });

        test("zoom selection start triggers zoomStart event", function() {
            chart.bind("zoomStart", function(e) {
                ok(true)
            });

            chart._start(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));
        });

        test("zoom selection end triggers zoom event", function() {
            chart.bind("zoom", function(e) {
                ok(true)
            });

            chart._start(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));

            chart._end(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));
        });

        test("zoom event is preventable", 0, function() {
            chart.bind("zoom", function(e) {
                e.preventDefault();
            });

            chart._start(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));

            chart._plotArea.redraw = function() {
                ok(false);
            };

            chart._end(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));
        });

        test("zoom selection end triggers zoomEnd event", function() {
            var redrawnPlotarea = false;
            chart.bind("zoomEnd", function(e) {
                ok(redrawnPlotarea);
            });

            chart._start(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));

            chart._plotArea.redraw = function() {
                redrawnPlotarea = true;
            };

            chart._end(createEventArg({
                event: {
                    shiftKey:  true
                }
            }));
        });

        // ------------------------------------------------------------
        module("Events / mousewheel zoom", {
            setup: function() {
                setupChart({
                    series: [{}],
                    categoryAxis: {
                        categories: ["A", "B", "C", "D"],
                        name: "foo",
                        min: 1,
                        max: 2
                    },
                    chartArea: { width: 600, height: 400 },
                    zoomable: true
                });
            },
            teardown: destroyChart
        });

        test("mousewheel triggers zoomStart", function() {
            chart.bind("zoomStart", function(e) {
                ok(true);
            });
            triggerMousewheel(10);
        });

        test("zoomStart is preventable", 0, function() {
            chart.bind("zoomStart", function(e) {
                e.preventDefault();
            });
            chart._plotArea.redraw = function() {
                ok(false);
            };
            triggerMousewheel(10);
        });

        test("mousewheel triggers zoom with updated ranges", function() {
            chart.bind("zoom", function(e) {
                equal(e.axisRanges.foo.min, 0);
                equal(e.axisRanges.foo.max, 4);
            });
            triggerMousewheel(10);
        });

        test("zoom event is preventable", 0, function() {
            chart.bind("zoom", function(e) {
                e.preventDefault();
            });
            chart._plotArea.redraw = function() {
                ok(false);
            };
            triggerMousewheel(10);
        });

        asyncTest("mousewheel triggers zoomEnd event", function() {
            chart.bind("zoomEnd", function(e) {
                ok(true);
                start();
            });
            triggerMousewheel(10);
        });

        asyncTest("zoomEnd sends axisRanges", function() {
            chart.bind("zoomEnd", function(e) {
                ok(e.axisRanges.foo);
                start();
            });
            triggerMousewheel(10);
        });


        // ------------------------------------------------------------

        function triggerPinchZoom(distance) {
            chart._gesturestart({
                distance: 10
            });

            chart._gesturechange({
                distance: distance,
                preventDefault: $.noop
            });

            chart._gestureend({
                distance: distance
            });
        }

        module("Events / pinch zoom", {
            setup: function() {
                setupChart({
                    series: [{}],
                    categoryAxis: {
                        categories: ["A", "B", "C", "D"],
                        name: "foo",
                        min: 1,
                        max: 2
                    },
                    chartArea: { width: 600, height: 400 },
                    zoomable: true
                });
            },
            teardown: destroyChart
        });

        test("triggers zoomStart", function() {
            chart.bind("zoomStart", function(e) {
                ok(true);
            });
            triggerPinchZoom(1);
        });

        test("zoomStart is preventable", 0, function() {
            chart.bind("zoomStart", function(e) {
                e.preventDefault();
            });
            chart._plotArea.redraw = function() {
                ok(false);
            };
            triggerPinchZoom(1);
        });

        test("triggers zoom with updated ranges", function() {
            chart.bind("zoom", function(e) {
                equal(e.axisRanges.foo.min, 0);
                equal(e.axisRanges.foo.max, 4);
            });
            triggerPinchZoom(1);
        });

        test("zoom event is preventable", 0, function() {
            chart.bind("zoom", function(e) {
                e.preventDefault();
            });
            chart._plotArea.redraw = function() {
                ok(false);
            };
            triggerPinchZoom(1);
        });

        test("triggers zoomEnd event", function() {
            chart.bind("zoomEnd", function(e) {
                ok(true);
            });
            triggerPinchZoom(1);
        });

    })();

    (function() {
        var chart;

        function setupChart(options) {
            chart = createChart(kendo.deepExtend({
                series: [{
                    type: "bar",
                    data: [1, 2]
                }]
            }, options));
        }

        exportTests("Chart", createChart);
        legacyExportTests("Chart", createChart);
        saveAsPDFTests("Chart", createChart);

        // ------------------------------------------------------------
        module("Export", {
            setup: function() {
                setupChart();
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("svg() does not replace model", function() {
            var oldModel = chart._model;
            chart.svg();
            ok(oldModel === chart._model);
        });

        test("svg() does not replace surface", function() {
            var oldSurface = chart.surface;
            chart.svg();
            ok(oldSurface === chart.surface);
        });

        test("svg() encodes entities", function() {
            setupChart({ categoryAxis: { categories: ["Foo & Bar"] } });
            ok(chart.svg().indexOf("Foo &amp; Bar") > -1);
        });

        test("svg() preserves encoded entities", function() {
            setupChart({ categoryAxis: { categories: ["Foo &amp; Bar"] } });
            ok(chart.svg().indexOf("Foo &amp; Bar") > -1);
        });

        test("imageDataURL() does not replace model", function() {
            var oldModel = chart._model;
            chart.imageDataURL();
            ok(oldModel === chart._model);
        });

        test("imageDataURL() does not replace surface", function() {
            var oldSurface = chart.surface;
            chart.imageDataURL();
            ok(oldSurface === chart.surface);
        });

        test("exportVisual creates visual with the specified width and height", function() {
            var visual = chart.exportVisual({
                width: 300,
                height: 300
            });
            var bbox = visual.bbox();
            equal(bbox.size.width, 300);
            equal(bbox.size.height, 300);
        });

        test("exportVisual return surface export visual if width and height are not specified", function() {
            var visual = chart.exportVisual({
                foo: "bar"
            });
            ok(visual === chart.surface.exportVisual());
        });

        test("exportVisual does not replace surface", function() {
            var oldSurface = chart.surface;
            chart.exportVisual({
                width: 300,
                height: 300
            });
            ok(oldSurface === chart.surface);
        });

        test("exportVisual does not replace model", function() {
            var oldModel = chart._model;
            chart.exportVisual({
                width: 300,
                height: 300
            });
            ok(oldModel === chart._model);
        });

        test("exportVisual does not change chartArea size", function() {
            var chartArea = chart.options.chartArea;
            var width = chartArea.width;
            var height = chartArea.height;
            chart.exportVisual({
                width: 300,
                height: 300
            });
            equal(chart.options.chartArea.width, width);
            equal(chart.options.chartArea.height, height);
        });
    })();

    (function() {
        var chart;
        dataviz.ui.themes.foo = {
            chart: {
                foo: true,
                seriesDefaults: {
                    foo: true
                },
                seriesColors: ["#f00"]
            }
        };

        function setupChart(options) {
            chart = createChart(options);
        }

        // ------------------------------------------------------------
        module("setOptions", {
            teardown: destroyChart
        });

        test("extends original options", function() {
            setupChart();

            chart.setOptions({
                foo: true
            });

            ok(chart._originalOptions.foo);
        });

        test("applies theme", function() {
            setupChart();
            chart.setOptions({ theme: "foo" });

            ok(chart.options.foo);
        });

        test("does not taint original options with theme", function() {
            setupChart({ theme: "foo" });

            chart.setOptions({ theme: "" });

            ok(!chart.options.foo);
        });

        test("does not taint series options with theme", function() {
            setupChart({
                theme: "foo",
                series: [{ }]
            });

            chart.setOptions({ theme: "" });

            ok(!chart.options.series[0].foo);
        });

        test("does not taint series colors with theme", function() {
            setupChart({
                series: [{ }]
            });

            chart.setOptions({ theme: "foo" });
            chart.setOptions({ theme: "" });

            ok(!chart.options.series[0].color);
        });

        test("resets series after grouping", function() {
            setupChart({
                dataSource: {
                    data: [{
                        value: 1,
                        group: "A"
                    }, {
                        value: 1,
                        group: "B"
                    }],
                    group: {
                        field: "group"
                    }
                },
                series: [{
                    field: "value"
                }]
            });

            chart.setOptions({
                series: [{
                    data: [1, 2, 3]
                }]
            });

            chart.dataSource.read();

            equal(chart.options.series.length, 1);
        });

        test("setOptions keeps grouped series", function() {
            setupChart({
                dataSource: {
                    data: [{
                        value: 1,
                        group: "A"
                    }, {
                        value: 1,
                        group: "B"
                    }],
                    group: {
                        field: "group"
                    }
                },
                series: [{
                    field: "value"
                }]
            });

            chart.setOptions({ });

            equal(chart.options.series.length, 2);
        });

        test("extends axis options", function() {
            setupChart({
                valueAxis: { name: "foo" }
            });

            chart.setOptions({ valueAxis: { max: 1 } });
            equal(chart.options.valueAxis.name, "foo");
        });

        test("sets data source", function() {
            setupChart({
                series: [{ field: "foo" }]
            });

            chart.setOptions({
                dataSource: { data: [{ "foo": 1 }] }
            });

            equal(chart.options.series[0].data.length, 1);
        });

        test("does not extend data source", 0, function() {
            setupChart();

            var ds = { data: [{ "foo": 1 }], foo: { } };
            ds.foo.bar = ds.foo;

            chart.setOptions({
                dataSource: ds
            });
        });

        test("gets the data from the dataSource when it is set with the setDataSource method and the setOptions method is used", function(){
            var dataSource = new kendo.data.DataSource({
                data: [{foo: 1}]
            });

            setupChart({
                series: [{ field: "foo" }]
            });

            chart.setDataSource(dataSource);

            chart.setOptions({});
            ok(chart.options.series[0].data.length === 1);
        });

        test("calls redraw implicitly", function() {
            setupChart();

            stubMethod(Chart.fn, "redraw", function() {
                ok(true);
            }, function() {
                chart.setOptions({
                    foo: true
                });
            });
        });

        test("calls _onDataChanged implicitly when bound to a data source", function() {
            setupChart({
                series: [{ field: "foo" }],
                dataSource: { data: [{ "foo": 1 }] }
            });

            stubMethod(Chart.fn, "_onDataChanged", function() {
                ok(true);
            }, function() {
                chart.setOptions({
                    foo: true
                });
            });
        });

        asyncTest("binds mousemove handler if crosshairs are enabled with the new options", function() {
            setupChart();
            chart._mousemove = function() {
                ok(true);
                start();
            };

            chart.setOptions({
                categoryAxis: {
                    crosshair:{
                        visible: true
                    }
                }
            });

            chart.element.trigger("mousemove");
        });

        test("binds categories from series data", function() {
            setupChart({});
            chart.setOptions({
                series: [{
                    data: [{
                        value: 1,
                        foo: "A"
                    }],
                    categoryField: "foo"
                }]
            });
            equal(chart._plotArea.categoryAxis.options.categories[0], "A");
        });

        test("clears original option if null is passed", function() {
            setupChart({
                valueAxis: {
                    min: 1
                }
            });

            chart.setOptions({
                valueAxis: {
                    min: null
                }
            });
            ok(chart.options.valueAxis.min === undefined);
        });

        test("clears original option if undefined is passed", function() {
            setupChart({
                valueAxis: {
                    majorUnit: 1
                }
            });
            chart.setOptions({
                valueAxis: {
                    majorUnit: undefined
                }
            });
            ok(chart.options.valueAxis.majorUnit === undefined);
        });

    })();

    // ------------------------------------------------------------
    (function() {
        module("Events / render", {
            teardown: destroyChart
        });

        test("triggers render after chart is rendered", 1, function() {
            createChart({
                series: [{
                    data: [1, 2, 3]
                }],
                render: function(e) {
                    ok(e.sender.surface._root.childNodes);
                }
            });
        });

        test("triggers render after dataBound", 1, function() {
            var dataBound = false;
            createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    dataBound = true;
                },
                render: function() {
                    ok(dataBound);
                }
            });
        });

        test("triggers render after rendering if autoBind is false", 1, function() {
            createChart({
                autoBind: false,
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    dataBound = true;
                },
                render: function() {
                    ok(true);
                }
            });
        });

        test("triggers render after setDataSource", 1, function() {
            var dataBound = false;
            var chart = createChart({
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    dataBound = true;
                }
            });

            chart.bind("render", function() {
                ok(dataBound);
            });

            chart.setDataSource([{
                period: "Jan",
                sales: 100
            }]);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var vml;

        module("Deferred redraw", {
            setup: function() {
                vml = kendo.support.vml;
                kendo.support.vml = true;
            },
            teardown: function() {
                kendo.support.vml = vml;
                destroyChart();
            }
        });

        asyncTest("chart model is accessible in dataBound + setTimeout", function() {
            createChart({
                dataSource: [{ foo: 1 }],
                series: [{ field: "foo" }],
                dataBound: function(e) {
                    setTimeout(function() {
                        equal(e.sender._plotArea.charts[0].points[0].value, 1);
                        start();
                    });
                }
            });
        });

    })();


    // ------------------------------------------------------------
    (function() {
        var axis = {
            slot: function(from, to) {
                return {
                    from: from,
                    to: to
                };
            },
            range: function() {
                return "foo";
            },

            getValue: function(point) {
                return point;
            },

            valueRange: function() {
                return "baz";
            }
        },
        chartAxis;

        module("wrappers / ChartAxis", {
            setup: function() {
                chartAxis = new dataviz.ChartAxis(axis);
            }
        });

        test("slot returns axis slot", function() {
            var slot = chartAxis.slot(1, 2);
            equal(slot.from, 1);
            equal(slot.to, 2);
        });

        test("slot limits range by default", function() {
            chartAxis = new dataviz.ChartAxis({
                slot: function(a, b, limit){
                    equal(a, 1);
                    equal(b, undefined);
                    equal(limit, true);
                }
            });
            var slot = chartAxis.slot(1);
        });

        test("slot passes user set limit value", function() {
            chartAxis = new dataviz.ChartAxis({
                slot: function(a, b, limit){
                    equal(a, 1);
                    equal(b, 2);
                    equal(limit, false);
                }
            });
            var slot = chartAxis.slot(1, 2, false);
        });

        test("range returns axis range", function() {
            var range = chartAxis.range();
            equal(range, "foo");
        });

        test("value returns axis value", function() {
            var value = chartAxis.value("bar");
            equal(value, "bar");
        });

        test("value returns axis category", function() {
            chartAxis = new dataviz.ChartAxis({
                getCategory: function(point) {
                    return point;
                }
            });
            var value = chartAxis.value("bar");
            equal(value, "bar");
        });

        test("valueRange returns axis valueRange", function() {
            var range = chartAxis.valueRange();
            equal(range, "baz");
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("getAxis", {
            setup: function() {
                chart = createChart({
                    valueAxes: {
                        name: "value"
                    },
                    categoryAxis: {
                        name: "category"
                    }
                });
            },
            teardown: destroyChart
        });

        test("returns ChartAxis with the axis based on the name", function() {
            var axes = chart._plotArea.axes;
            var categoryAxis;
            var valueAxis;
            var axis = chart.getAxis("category");
            if (axes[0].options.name == "category") {
                categoryAxis = axes[0];
                valueAxis = axes[1];
            } else {
                categoryAxis = axes[1];
                valueAxis = axes[0];
            }
            ok(axis instanceof dataviz.ChartAxis);
            ok(axis._axis === categoryAxis);

            axis = chart.getAxis("value");
            ok(axis._axis === valueAxis);
        });

        test("returns nothing if there isn't an axis with matching name", function() {
            ok(chart.getAxis("foo") === undefined);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var chart;
        function setupChart(options) {
            chart = createChart(options);
        }

        module("toggleHighlight", {
            teardown: destroyChart
        });

        test("toggles donut chart point highlight by series and category", 6, function() {
            setupChart({
                series: [{
                    type: "donut",
                    name: "foo",
                    data: [{
                        value: 1,
                        category: "bar"
                    }]
                }, {
                    type: "donut",
                    name: "baz",
                    data: [{
                        value: 1,
                        category: "qux"
                    }],
                    value: 1
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                equal(point.series.name, "baz");
                equal(point.category, "qux");
                equal(show, showHighlight);
            };
            chart.toggleHighlight(showHighlight, {
                series: "baz",
                category: "qux"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, {
                series: "baz",
                category: "qux"
            });
        });

        test("does not toggle donut chart point highlight if there isn't point with matching series and category", 0, function() {
            setupChart({
                series: [{
                    type: "donut",
                    name: "foo",
                    data: [{
                        value: 1,
                        category: "bar"
                    }]
                }, {
                    type: "donut",
                    name: "baz",
                    data: [{
                        value: 1,
                        category: "qux"
                    }],
                    value: 1
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                ok(false);
            };
            chart.toggleHighlight(showHighlight, {
                series: "foo",
                category: "qux"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, {
                series: "baz",
                category: "bar"
            });
        });

        test("toggles pie chart point highlight by category", 4, function() {
            setupChart({
                series: [{
                    type: "pie",
                    data: [{
                        value: 1,
                        category: "foo"
                    }, {
                        value: 1,
                        category: "bar"
                    }]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                equal(point.category, "bar");
                equal(show, showHighlight);
            };
            chart.toggleHighlight(showHighlight, {
                category: "bar"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "bar");
        });

        test("does not toggle pie chart point highlight if there isn't category with matching name", 0, function() {
            setupChart({
                series: [{
                    type: "pie",
                    data: [{
                        value: 1,
                        category: "foo"
                    }, {
                        value: 1,
                        category: "bar"
                    }]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                ok(false);
            };
            chart.toggleHighlight(showHighlight, {
                category: "baz"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "baz");
        });

        test("toggles categorical chart series points highlight by series name", 8, function() {
            setupChart({
                series: [{
                    type: "column",
                    name: "column",
                    data: [1, 2]
                }, {
                    type: "line",
                    name: "line",
                    data: [3, 4]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                equal(point.series.name, "line");
                equal(show, showHighlight);
            };
            chart.toggleHighlight(showHighlight, {
                series: "line"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "line");
        });

        test("does not toggle categorical chart points highlight if there isn't series with matching name", 0, function() {
            setupChart({
                series: [{
                    type: "column",
                    name: "column",
                    data: [1, 2]
                }, {
                    type: "line",
                    name: "line",
                    data: [3, 4]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                ok(false);
            };
            chart.toggleHighlight(showHighlight, {
                series: "foo"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "foo");
        });

        test("toggles scatter chart series points highlight by series name", 8, function() {
            setupChart({
                series: [{
                    type: "scatter",
                    name: "A",
                    data: [[1, 2], [3, 4]]
                }, {
                    type: "scatter",
                    name: "B",
                    data: [[5, 6], [7, 8]]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                equal(point.series.name, "A");
                equal(show, showHighlight);
            };
            chart.toggleHighlight(showHighlight, {
                series: "A"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "A");
        });

        test("does no toggle scatter chart points highlight if there isn't series with matching name", 0, function() {
            setupChart({
                series: [{
                    type: "scatter",
                    name: "A",
                    data: [[1, 2], [3, 4]]
                }, {
                    type: "scatter",
                    name: "B",
                    data: [[5, 6], [7, 8]]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                ok(false);
            };
            chart.toggleHighlight(showHighlight, {
                series: "foo"
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, "foo");
        });

        test("toggles chart points highlight using function", 4, function() {
            setupChart({
                series: [{
                    type: "column",
                    name: "column",
                    data: [1, 2]
                }, {
                    type: "line",
                    name: "line",
                    data: [3, 4]
                }]
            });

            var showHighlight = true;
            chart._highlight.togglePointHighlight = function(point, show) {
                equal(point.value, 1);
                equal(show, showHighlight);
            };

            chart.toggleHighlight(showHighlight, function(point) {
                return point.value === 1;
            });
            showHighlight = false;
            chart.toggleHighlight(showHighlight, function(point) {
                return point.value === 1;
            });
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var chart;

        module("show/hide Tooltip", {
            setup: function() {
                chart = createChart({
                    series: [{
                        data: [1, 2, 2]
                    }]
                });
            },
            teardown: destroyChart
        });

        test("shows tooltip for filtered point", function() {
           chart._tooltip.show = function(point) {
               equal(point.value, 1);
           };
           chart.showTooltip(function(point) {
               return point.value === 1;
           });
        });

        test("shows tooltip for the first point if the filter matches multiple points", function() {
           chart._tooltip.show = function(point) {
               equal(point.value, 2);
               equal(point.categoryIx, 1);
           };
           chart.showTooltip(function(point) {
               return point.value === 2;
           });
        });

        test("does nothing if no filter is passed", 0, function() {
            chart._tooltip.show = function(point) {
               ok(false);
            };
            chart.showTooltip();
        });

        test("does nothing if the filter returns no points", 0, function() {
            chart._tooltip.show = function(point) {
               ok(false);
            };

            chart.showTooltip(function() {
                return false;
            });
        });

        test("hide hides tooltip", function() {
            chart._tooltip.hide = function(point) {
               ok(true);
            };
            chart.hideTooltip();
        });
        // ------------------------------------------------------------
        module("show/hide Tooltip / shared", {
            setup: function() {
                chart = createChart({
                    series: [{
                        data: [1, 2, 2]
                    }, {
                        data: [3, 4, 5]
                    }],
                    tooltip: {
                        shared: true
                    }
                });
            },
            teardown: destroyChart
        });

        test("shows tooltip for filtered point", function() {
           chart._tooltip.showAt = function(points) {
               equal(points[0].value, 1);
               equal(points[1].value, 3);
           };
           chart.showTooltip(function(point) {
               return point.value === 1;
           });
        });

        test("shows tooltip for the first point if the filter matches multiple points", function() {
           chart._tooltip.showAt = function(points) {
               equal(points[0].value, 2);
               equal(points[1].value, 4);
               equal(points[0].categoryIx, 1);
           };
           chart.showTooltip(function(point) {
               return point.value === 2;
           });
        });

        test("does nothing if no filter is passed", 0, function() {
            chart._tooltip.showAt = function(point) {
               ok(false);
            };
            chart.showTooltip();
        });

        test("does nothing if the filter returns no points", 0, function() {
            chart._tooltip.showAt = function(point) {
               ok(false);
            };

            chart.showTooltip(function() {
                return false;
            });
        });

        test("hide hides tooltip", function() {
            chart._tooltip.hide = function(point) {
               ok(true);
            };
            chart.hideTooltip();
        });

    })();

    // ------------------------------------------------------------
    (function() {
        module("Custom fonts", {
            setup: function() {
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("loads custom fonts", function() {
            var font = "16px Deja Mu";

            stubMethod(kendo.util, "loadFonts", function(fonts) {
                deepEqual(fonts, [font]);
            }, function() {
                createChart({
                    categoryAxis: {
                        labels: {
                            font: font
                        }
                    }
                });
            });
        });

        test("does not crash with complex options", function() {
            stubMethod(kendo.util, "loadFonts", function() {
                ok(true)
            }, function() {
                createChart({
                    dataSource: new kendo.data.DataSource(),
                    foo: null,
                    series: [{
                        visual: function(e) {
                            return e.createVisual();
                        }
                    }]
                });
            });
        });
    })();

})();
