(function() {

    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        ohlcChart,
        root,
        firstPoint,
        firstLine,
        TOLERANCE = 1;

    function setupOHLCChart(plotArea, options, rootOptions) {
        ohlcChart = new dataviz.OHLCChart(plotArea, options);

        root = new dataviz.RootElement(rootOptions);
        root.append(ohlcChart);

        root.reflow();
        root.renderVisual();

        firstPoint = ohlcChart.points[0];
        var visual = firstPoint.visual;
        var mainVisual = visual.children[0];
        firstLine = mainVisual.children[0];
    }

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    axisCrossingValue: 0,
                    categories: options.categoryAxis.categories
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {
                    axisCrossingValue: 0
                },
                startValue: function() {
                    return 0;
                }
            };

            this.namedCategoryAxes = { };
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    (function() {
        var series = { data: [[3,4,1,2]], type: "ohlc" },
            VALUE_AXIS_MAX = 4,
            CATEGORY_AXIS_Y = 2;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                                 categoryIndex + 1, CATEGORY_AXIS_Y);
            },
            function(value) {
                var value = typeof value === "undefined" ? 0 : value,
                    valueY = VALUE_AXIS_MAX - value,
                    slotTop = Math.min(CATEGORY_AXIS_Y, valueY),
                    slotBottom = Math.max(CATEGORY_AXIS_Y, valueY);

                return new Box2D(0, slotTop, 0, slotBottom);
            }, {
                categoryAxis: {
                    categories: ["A", "B"]
                }
            }
        );

        // ------------------------------------------------------------
        module("OHLC Chart", {
            setup: function() {
                setupOHLCChart(plotArea, { series: [ series ] });
            }
        });

        test("removes the series points if the visible is set to false", function() {
            var chart = createChart({
                seriesDefaults: {
                    type: "ohlc"
                },
                series: [{
                    data: [[2,4,1,3]],
                    visible: false
                },{
                    data: [[2,4,1,3]]
                }]
            });

            var points = chart._plotArea.charts[0].points;
            ok(points.length === 1);

            destroyChart();
        });

        test("creates points for ohlcChart data points", function() {
            equal(ohlcChart.points.length, series.data.length);
        });

        test("creates empty points for null values", function() {
            setupOHLCChart(plotArea, { series: [{
                data: [[2,4,1,3], null], type: "ohlc"
            }]});
            equal(ohlcChart.points[1], undefined);
        });

        test("creates empty points for undefined values", function() {
            setupOHLCChart(plotArea, { series: [{
                data: [[2,4,1,3], undefined], type: "ohlc"
            }]});
            equal(ohlcChart.points[1], undefined);
        });

        test("creates empty points for partially undefined values", function() {
            setupOHLCChart(plotArea, { series: [{
                data: [[2,4,1,3], [0, 1, undefined, 2]], type: "ohlc"
            }]});
            equal(ohlcChart.points[1], undefined);
        });

        test("empty points are not collapsed", function() {
            setupOHLCChart(plotArea, { series: [{
                data: [[2,4,1,3], null, [2, 4, 1, 3]], type: "ohlc"
            }]});
            equal(ohlcChart.points[2].box.x1, 2);
        });

        test("reports minimum series value for default axis", function() {
            deepEqual(ohlcChart.valueAxisRanges[undefined].min, series.data[0][2]);
        });

        test("reports maximum series value for default axis", function() {
            deepEqual(ohlcChart.valueAxisRanges[undefined].max, series.data[0][1]);
        });

        test("reports number of categories", function() {
            setupOHLCChart(plotArea, { series: [ series ]});
            equal(categoriesCount(ohlcChart.options.series), series.data.length);
        });

        test("sets point owner", function() {
            ok(ohlcChart.points[0].owner === ohlcChart);
        });

        test("sets point series", function() {
            ok(ohlcChart.points[0].series === series);
        });

        test("sets point series index", function() {
            ok(ohlcChart.points[0].seriesIx === 0);
        });

        test("sets point category", function() {
            equal(ohlcChart.points[0].category, "A");
        });

        test("sets point dataItem", function() {
            equal(typeof ohlcChart.points[0].dataItem, "object");
        });

        // ------------------------------------------------------------
        module("OHLC Chart / Rendering", {
            setup: function() {
                setupOHLCChart(plotArea, {
                    series: [ $.extend({
                        line: {
                            width: 4,
                            dashType: "dot"
                        },
                        color: "lineColor",
                        opacity: 0.5
                    },
                    series)]
                });
            }
        });

        test("sets line width", function() {
            equal(firstLine.options.stroke.width, 4);
        });

        test("sets line color", function() {
            equal(firstLine.options.stroke.color, "lineColor");
        });

        test("sets line opacity", function() {
            equal(firstLine.options.stroke.opacity, 0.5);
        });

        test("sets line dashType", function() {
            equal(firstLine.options.stroke.dashType, "dot");
        });

        test("creates visual", function() {
            ok(ohlcChart.visual);
        });

        test("creates clip animation", function() {
            ok(ohlcChart.animation);
            ok(ohlcChart.animation instanceof dataviz.ClipAnimation);
            sameBox(ohlcChart.animation.options.box, root.box);
            sameLinePath(ohlcChart.animation.element, draw.Path.fromRect(root.box.toRect()));
        });

        test("does not create clip animation if transitions are disabled", function() {
            setupOHLCChart(plotArea, { series: [ series ] }, {
                transitions: false
            });

            ok(!ohlcChart.animation);
            ok(!ohlcChart.visual.clip());
        });

        test("does not set clip on points by default", function() {
            var points = ohlcChart.points;
            for (var idx = 0; idx < points.length; idx++) {
                ok(!points[idx].visual.clip());
            }
        });

        test("sets animation clip path to points with zIndex", function() {
            setupOHLCChart(plotArea, {
                series: [{
                    type: "ohlc",
                    data: [[3,4,1,2]],
                    zIndex: 1
                }]
            });

            var clip = ohlcChart.points[0].visual.clip();
            ok(clip);
            ok(clip === ohlcChart.animation.element);
        });

        // ------------------------------------------------------------
        module("OHLC Chart / Rendering / Highlight", {
            setup: function() {
                setupOHLCChart(plotArea, {
                    series: [series]
                });
            }
        });

        test("createHighlight renders default line width", function() {
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.width, 1);
        });

        test("createHighlight renders custom line width", function() {
            firstPoint.options.highlight.line.width = 2;
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.width, 2);
        });

        test("createHighlight renders default line color (computed)", function() {
            firstPoint.color = "#ffffff";
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.color, "#cccccc");
        });

        test("createHighlight renders custom line color", function() {
            firstPoint.options.highlight.line.color = "red";
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.color, "red");
        });

        test("createHighlight renders default line opacity", function() {
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.opacity, 1);
        });

        test("createHighlight renders custom line opacity", function() {
            firstPoint.options.highlight.line.opacity = 0.5;
            var line = firstPoint.createHighlight().children[0];

            equal(line.options.stroke.opacity, 0.5);
        });

    })();

    (function() {
        var ohlcChart,
            MARGIN = PADDING = BORDER = 5,
            ohlcPoint;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D();
            },
            function(value) {
                return new Box2D();
            },
            {
                categoryAxis: { }
            }
        );

        function createOHLCChart(options) {
            ohlcChart = new dataviz.OHLCChart(plotArea, {
                series: [$.extend({
                    name: "ohlcSeries",
                    data: [[3,4,2,1]],
                    dashType: "dashType",
                    color: "lineColor",
                    opacity: 0.7,
                    width: 0.2,
                    type: "ohlc"
                }, options)]
            });
            ohlcPoint = ohlcChart.points[0];
        }

        // ------------------------------------------------------------
        module("OHLC Chart / Configuration", {
            setup: function() {
                createOHLCChart();
            }
        });

        test("applies series color to point border", function() {
            equal(ohlcPoint.color, "lineColor");
        });

        test("applies opacity to point", function() {
            equal(ohlcPoint.options.opacity, 0.7);
        });

        test("applies dashType", function() {
            equal(ohlcPoint.options.dashType, "dashType");
        });

        test("applies line width", function() {
            equal(ohlcPoint.options.width, 0.2);
        });

        test("applies color function", function() {
            createOHLCChart({
                color: function(p) { return "#f00" }
            });

            equal(ohlcPoint.color, "#f00");
        });

        test("applies color function for each point", 2, function() {
            createOHLCChart({
                data: [[3,4,2,1], [3,4,2,1]],
                color: function() { ok(true); }
            });
        });

        test("color fn argument contains value", 1, function() {
            createOHLCChart({
                color: function(p) { equal(p.value.open, 3); }
            });
        });

        test("color fn argument contains dataItem", 1, function() {
            createOHLCChart({
                color: function(p) {
                    deepEqual(p.dataItem, [3,4,2,1]);
                }
            });
        });

        test("color fn argument contains series", 1, function() {
            createOHLCChart({
                color: function(p) { equal(p.series.name, "ohlcSeries"); }
            });
        });

    })();

    (function() {
        var OHLCPoint = dataviz.OHLCPoint,
            point,
            box,
            label,
            root,
            VALUE = {
                open: 2,
                high: 4,
                low: 1,
                close: 3

            },
            TOOLTIP_OFFSET = 5,
            CATEGORY = "A",
            SERIES_NAME = "series";

        function createPoint(options) {
            point = new OHLCPoint(VALUE,
                $.extend(true, {
                    labels: { font: SANS12 }
                }, options)
            );

            point.category = CATEGORY;
            point.dataItem = { value: VALUE };
            point.series = { name: SERIES_NAME };

            point.owner = {
                formatPointValue: function(point, tooltipFormat) {
                    return kendo.dataviz.autoFormat(tooltipFormat, point.value);
                },
                seriesValueAxis: function(series) {
                    return {
                        getSlot: function(a,b) {
                            return new Box2D();
                        }
                    };
                },
                pane: {
                    clipBox: function() {
                        return new Box2D(0, 0, 100, 100);
                    }
                }
            }

            box = new Box2D(0, 0, 100, 100);
            point.reflow(box);

            root = new dataviz.RootElement();
            root.append(point);
        }

        // ------------------------------------------------------------
        module("OHLC Point", {
            setup: function() {
                createPoint();
            }
        });

        test("sets point border width", function() {
            createPoint({ border: { width: 4 } });
            equal(point.options.border.width, 4);
        });

        test("sets point opacity", function() {
            createPoint({ opacity: 0.5 });
            deepEqual(point.options.opacity, 0.5);
        });

        test("tooltipAnchor is at top right of point", function() {
            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.box.x2 + TOOLTIP_OFFSET, point.box.y1 + TOOLTIP_OFFSET], TOLERANCE)
        });

    })();

    (function() {
        var data = [{
                open: 2,
                high: 4,
                low: 1,
                close: 3,
                color: "color"
            }],
            point;

        function createOHLCChart(candlestickSeries) {
            var chart = createChart({
                dataSource: {
                    data: data
                },
                series: [kendo.deepExtend({
                    type: "ohlc"
                }, candlestickSeries)]
            });

            point = chart._plotArea.charts[0].points[0];

            destroyChart();
        }

        // ------------------------------------------------------------
        module("OHLC Chart / Data Binding / Data Source", {
            teardown: destroyChart
        });

        test("binds to 4-element array", function() {
            createOHLCChart({
                data: [[2, 4, 0, 3]]
            });

            deepEqual(point.value, { open: 2, high: 4, low: 0, close: 3 });
        });

        test("binds open, high, low and close field", function() {
            createOHLCChart({
                openField: "open",
                highField: "high",
                lowField: "low",
                closeField: "close"
            });

            deepEqual(point.value, { open: 2, high: 4, low: 1, close: 3 });
        });

        test("binds color field", function() {
            createOHLCChart({
                openField: "open",
                highField: "high",
                lowField: "low",
                closeField: "close",
                colorField: "color"
            });

            deepEqual(point.color, "color");
        });

        test("evaluates color function", function() {
            createOHLCChart({
                openField: "open",
                highField: "high",
                lowField: "low",
                closeField: "close",
                colorField: "color",
                color: function() {
                    return "foo";
                }
            });

            deepEqual(point.color, "foo");
        });

    })();
})();
