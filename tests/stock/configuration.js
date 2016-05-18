(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        StockChart = dataviz.ui.StockChart;

    (function() {
        var chart,
            plotArea;

        function createStockChart(options) {
            var div = $("<div id='container' />").appendTo(QUnit.fixture);
            chart = div.kendoStockChart(options).data("kendoStockChart");
        }

        // ------------------------------------------------------------
        module("Options / Defaults", {
            setup: function() {
                createStockChart({ });
            },
            teardown: destroyChart
        });

        test("tooltip is visible by default", function() {
            ok(chart.options.tooltip.visible);
        });

        test("legend is not visible by default", function() {
            ok(!chart.options.legend.visible);
        });

        // ------------------------------------------------------------
        module("Options / Date Field", {
            setup: function() {
                createStockChart({
                    navigator: {
                        series: { }
                    }
                });
            },
            teardown: destroyChart
        });

        test("default series categoryField is 'date'", function() {
            equal(chart.options.series[0].categoryField, "date");
        });

        test("dateField is applied as default categoryField", function() {
            createStockChart({ dateField: "d", navigator: { series: { } } });
            equal(chart.options.series[0].categoryField, "d");
        });

        test("default categoryField is applied", function() {
            createStockChart({
                seriesDefaults: {
                    categoryField: "d"
                },
                navigator: {
                    series: {}
                }
            });
            equal(chart.options.series[0].categoryField, "d");
        });

        asyncTest("navigator categoryField is inherited from the chart", function() {
            createStockChart({
                dateField: "Date",
                dataSource: {
                    data: [{
                            Date: new Date("2012/09/01"),
                            Sales: 100
                        }]
                },
                navigator: {
                    dataSource: {
                        data: [{
                            Date: new Date("2012/09/01"),
                            Volume: 100
                        }]
                    },
                    series: [{
                        field: "Volume"
                    }]
                }
            });

            setTimeout(function() {
                equal(chart.options.series[0].categoryField, "Date");
                start();
            }, 50);
        });

        asyncTest("navigator date field can be overriden", function() {
            createStockChart({
                dateField: "date",
                dataSource: {
                    data: [{
                            date: new Date("2012/09/01"),
                            Sales: 100
                        }]
                },
                navigator: {
                    dateField: "Date",
                    dataSource: {
                        data: [{
                            Date: new Date("2012/09/01"),
                            Volume: 100
                        }]
                    },
                    series: [{
                        field: "Volume"
                    }]
                }
            });

            setTimeout(function() {
                equal(chart.options.series[0].categoryField, "Date");
                start();
            }, 50);
        });

        // ------------------------------------------------------------
        module("Options / Navigator", {
              teardown: destroyChart
        });

        asyncTest("autoBind is inherited from the chart", function() {
            createStockChart({
                autoBind: false,
                navigator: {
                    dataSource: {
                        data: {
                            date: new Date("2012/09/01"),
                            volume: 1
                        }
                    },
                    series: {
                        field: "volume"
                    }
                }
            });

            setTimeout(function() {
                equal(chart.options.series[0].data.length, 0);
                start();
            }, 50);
        });

        asyncTest("autoBind can be overriden", function() {
            createStockChart({
                autoBind: false,
                navigator: {
                    dataSource: {
                        data: [{
                            date: new Date("2012/09/01"),
                            volume: 1
                        }]
                    },
                    autoBind: true,
                    series: [{
                        field: "volume"
                    }]
                }
            });

            setTimeout(function() {
                equal(chart.options.series[0].data.length, 1);
                start();
            }, 50);
        });

        test("roundToBaseUnit is set to true for equally sized series", function() {
            createStockChart({
                navigator: {
                    series: [{
                        type: "column"
                    }]
                }
            });

            $.each(chart._plotArea.axes, function(i, a) {
                if (a instanceof dataviz.CategoryAxis && a.options.pane === "_navigator") {
                    equal(a.options.roundToBaseUnit, true);
                }
            });
        });

        test("justified is set to false for equally sized series", function() {
            createStockChart({
                navigator: {
                    series: [{
                        type: "column"
                    }]
                }
            });

            $.each(chart._plotArea.axes, function(i, a) {
                if (a instanceof dataviz.CategoryAxis && a.options.pane === "_navigator") {
                    equal(a.options.justified, false);
                }
            });
        });

        test("maxDateGroups can be set on categoryAxis", function() {
            createStockChart({
                navigator: {
                    categoryAxis: {
                        maxDateGroups: 100
                    }
                }
            });

            equal(chart._navigator.mainAxis().options.maxDateGroups, 100);
        });

        test("majorTicks visibility can be hidden on categoryAxis", function() {
            createStockChart({
                navigator: {
                    categoryAxis: {
                        majorTicks: { visible: false }
                    }
                }
            });

            $.each(["_navigator_labels", "_navigator_ticks"], function() {
                equal(chart._plotArea.namedCategoryAxes[this].options.majorTicks.visible, false);
            });
        });

        test("majorTicks visibility are shown on categoryAxis", function() {
            createStockChart({ });

            $.each(["_navigator_labels", "_navigator_ticks"], function() {
                equal(chart._plotArea.namedCategoryAxes[this].options.majorTicks.visible, true);
            });
        });

        test("plotBands are applied on main axis", function() {
            createStockChart({
                navigator: {
                    categoryAxis: {
                        plotBands: [{}]
                    }
                }
            });

            equal(chart._navigator.mainAxis().options.plotBands.length, 1);
            $.each(["_navigator_labels", "_navigator_ticks"], function() {
                equal(chart._plotArea.namedCategoryAxes[this].options.plotBands.length, 0);
            });
        });

        test("extends valueAxis options", function() {
            createStockChart({
                navigator: {
                    valueAxis: {
                        name: "foo",
                        min: 100
                    }
                }
            });

            equal(chart._plotArea.namedValueAxes["foo"].options.min, 100);
        });

        test("title is applied on the label axis only", function() {
            createStockChart({
                navigator: {
                    categoryAxis: {
                        title: { text: "Foo" }
                    }
                }
            });

            equal(chart._plotArea.namedCategoryAxes["_navigator_labels"].title.options.text, "Foo");
            ok(!chart._plotArea.namedCategoryAxes["_navigator"].options.title);
            ok(!chart._plotArea.namedCategoryAxes["_navigator_ticks"].options.title);
        });

        test("default visibility is set on selection", function() {
            createStockChart({
                dateField: "Date",
                dataSource: {
                    data: [{
                        Date: new Date("2012/09/01"),
                        Sales: 100
                    }]
                },
                navigator: {
                    series: [{
                        field: "Sales"
                    }]
                }
            });

            equal(chart.navigator.selection.options.visible, true);
        });

        test("visibility is set on selection", function() {
            createStockChart({
                dateField: "Date",
                dataSource: {
                    data: [{
                        Date: new Date("2012/09/01"),
                        Sales: 100
                    }]
                },
                navigator: {
                    visible: false,
                    series: [{
                        field: "Sales"
                    }]
                }
            });

            equal(chart.navigator.selection.options.visible, false);
        });

        // ------------------------------------------------------------
        var support = deepExtend({}, kendo.support);
        var browserOptions = deepExtend({}, kendo.support.browser);

        module("Navigator / Live drag", {
            setup: function() {
                createStockChart({ navigator: { dataSource: null } });
            },
            teardown: function() {
                deepExtend(kendo.support, support);
                kendo.support.browser = deepExtend({}, browserOptions);
                destroyChart();
            }
        });

        test("disabled on touch", function() {
            kendo.support.touch = true;
            ok(!chart._navigator._liveDrag());
        });

        test("disabled on firefox", function() {
            kendo.support.browser.mozilla = true;
            ok(!chart._navigator._liveDrag());
        });

        test("disabled on old IEs", function() {
            kendo.support.browser.msie = true;
            kendo.support.browser.version = 8;
            ok(!chart._navigator._liveDrag());
        });

        test("enabled on everything else", function() {
            kendo.support.touch = false;
            kendo.support.browser.mozilla = false;
            kendo.support.browser.version = 9;
            ok(chart._navigator._liveDrag());
        });
    })();
})();
