(function() {

    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        candlestickChart,
        root,
        firstPoint,
        firstLine,
        pointBody,
        TOLERANCE = 1;

    function setupCandlestickChart(plotArea, options) {

        candlestickChart = new dataviz.CandlestickChart(plotArea, options);

        root = new dataviz.RootElement();
        root.append(candlestickChart);
        root.box = chartBox.clone();
        candlestickChart.reflow(chartBox);
        root.renderVisual();

        firstPoint = candlestickChart.points[0];
        firstLine = getLine(getMainGroup(firstPoint));
        pointBody = getBody(getMainGroup(firstPoint));
    }

    function getMainGroup(point) {
        return point.visual.children[0];
    }

    function getLine(group) {
        return group.children[2];
    }

    function getBody(group) {
        return group.children[0];
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
        var series = { data: [[2,4,1,3]], type: "candlestick" },
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
        module("Candlestick Chart", {
            setup: function() {
                setupCandlestickChart(plotArea, { series: [ series ] });
            },
            teardown: destroyChart
        });

        test("creates points for candlestickChart data points", function() {
            equal(candlestickChart.points.length, series.data.length);
        });

        test("removes the series points if the visible is set to false", function() {
            chart = createChart({
                seriesDefaults: {
                    type: "candlestick"
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
        });

        test("creates empty points for null values", function() {
            setupCandlestickChart(plotArea, { series: [{
                data: [[2,4,1,3], null], type: "candlestick"
            }]});
            equal(candlestickChart.points[1], undefined);
        });

        test("creates empty points for undefined values", function() {
            setupCandlestickChart(plotArea, { series: [{
                data: [[2,4,1,3], undefined], type: "candlestick"
            }]});
            equal(candlestickChart.points[1], undefined);
        });

        test("creates empty points for partially undefined values", function() {
            setupCandlestickChart(plotArea, { series: [{
                data: [[2,4,1,3], [0, 1, undefined, 2]], type: "candlestick"
            }]});
            equal(candlestickChart.points[1], undefined);
        });

        test("empty points are not collapsed", function() {
            setupCandlestickChart(plotArea, { series: [{
                data: [[2,4,1,3], null, [2, 4, 1, 3]], type: "candlestick"
            }]});
            equal(candlestickChart.points[2].box.x1, 2);
        });

        test("reports minimum series value for default axis", function() {
            deepEqual(candlestickChart.valueAxisRanges[undefined].min, series.data[0][2]);
        });

        test("reports maximum series value for default axis", function() {
            deepEqual(candlestickChart.valueAxisRanges[undefined].max, series.data[0][1]);
        });

        test("reports number of categories", function() {
            setupCandlestickChart(plotArea, { series: [ series ]});
            equal(categoriesCount(candlestickChart.options.series), series.data.length);
        });

        test("sets point owner", function() {
            ok(candlestickChart.points[0].owner === candlestickChart);
        });

        test("sets point series", function() {
            ok(candlestickChart.points[0].series === series);
        });

        test("sets point series index", function() {
            ok(candlestickChart.points[0].seriesIx === 0);
        });

        test("sets point category", function() {
            equal(candlestickChart.points[0].category, "A");
        });

        test("sets point dataItem", function() {
            equal(typeof candlestickChart.points[0].dataItem, "object");
        });

        // ------------------------------------------------------------

        module("Candlestick Chart / Values exceeding value axis min or max options ", {});

        test("values are not limited", 5, function() {
            var plotArea = stubPlotArea(
                function(categoryIndex) {
                    return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                                     categoryIndex + 1, CATEGORY_AXIS_Y);
                },
                function(value, axisCrossingValue, limit) {
                    ok(!limit);
                    return Box2D();
                }, {
                    categoryAxis: {
                        categories: ["A"]
                    }
                }
            );

            setupCandlestickChart(plotArea, { series: [ {data: [[1,2,3,4]], type: "candlestick"} ] });
        });

        // ------------------------------------------------------------
        module("Candlestick Chart / Rendering", {
            setup: function() {
                setupCandlestickChart(plotArea, {
                    series: [ $.extend({
                        line: {
                            width: 4,
                            color: "lineColor",
                            opacity: 0.5,
                            dashType: "dot"
                        },
                        color: "rectColor",
                        border: {
                            color: "borderColor",
                            width: 2,
                            opacity: 0.2,
                            dashType: "dot"
                        }
                    },
                    series)]
                });
            },
            teardown: destroyChart
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

        test("sets rect border", function() {
            equal(pointBody.options.stroke.width, 2);
            equal(pointBody.options.stroke.color, "borderColor");
            equal(pointBody.options.stroke.opacity, 0.2);
            equal(pointBody.options.stroke.dashType, "dot");
        });

        test("sets rect color(open < close)", function() {
            equal(pointBody.options.fill.color, "rectColor");
        });

        test("sets rect down body color(open > close)", function() {
            setupCandlestickChart(plotArea, {
                series: [{
                    type: "candlestick",
                    data: [[3,4,1,2]],
                    downColor: "downColor"
                }]
            });

            equal(pointBody.options.fill.color, "downColor");
        });

        test("sets rect default color if down color is null or empty(open > close)", function() {
            setupCandlestickChart(plotArea, {
                series: [{
                    type: "candlestick",
                    data: [[3,4,1,2]],
                    color: "color",
                    downColor: ""
                }]
            });

            equal(pointBody.options.fill.color, "color");
        });

        test("creates visual", function() {
            ok(candlestickChart.visual);
        });

        test("creates clip animation", function() {
            ok(candlestickChart.animation);
            ok(candlestickChart.animation instanceof dataviz.ClipAnimation);
            sameBox(candlestickChart.animation.options.box, candlestickChart.box);
            sameLinePath(candlestickChart.animation.element, draw.Path.fromRect(candlestickChart.box.toRect()));
        });

        test("does not set clip on points by default", function() {
            var points = candlestickChart.points;
            for (var idx = 0; idx < points.length; idx++) {
                ok(!points[idx].visual.clip());
            }
        });

        test("sets animation clip path to points with zIndex", function() {
            setupCandlestickChart(plotArea, {
                series: [{
                    type: "candlestick",
                    data: [[3,4,1,2]],
                    zIndex: 1
                }]
            });

            var clip = candlestickChart.points[0].visual.clip();
            ok(clip);
            ok(clip === candlestickChart.animation.element);
        });

        // ------------------------------------------------------------
        module("Candlestick Chart / Rendering / Highlight", {
            setup: function() {
                setupCandlestickChart(plotArea, {
                    series: [series]
                });
            },
            teardown: destroyChart
        });

        test("createHighlight renders default border width", function() {
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.width, 1);
        });

        test("createHighlight renders custom border width", function() {
            firstPoint.options.highlight.border.width = 2;
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.width, 2);
        });

        test("createHighlight renders default border color (computed)", function() {
            firstPoint.color = "#ffffff";
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.color, "#cccccc");
        });

        test("createHighlight renders custom border color", function() {
            firstPoint.options.border.color = "red";
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.color, "red");
        });

        test("createHighlight renders default border opacity", function() {
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.opacity, 1);
        });

        test("createHighlight renders custom border opacity", function() {
            firstPoint.options.highlight.border.opacity = 0.5;
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.opacity, 0.5);
        });

        test("createHighlight renders default border width", function() {
            var rect = getBody(firstPoint.createHighlight());

            equal(rect.options.stroke.width, 1);
        });

        test("createHighlight renders custom line width", function() {
            firstPoint.options.highlight.line.width = 2;
            var line = getLine(firstPoint.createHighlight());

            equal(line.options.stroke.width, 2);
        });

        test("createHighlight renders default line color (computed)", function() {
            firstPoint.color = "#ffffff";
            var line = getLine(firstPoint.createHighlight());

            equal(line.options.stroke.color, "#cccccc");
        });

        test("createHighlight renders custom line color", function() {
            firstPoint.options.highlight.line.color = "red";
            var line = getLine(firstPoint.createHighlight());

            equal(line.options.stroke.color, "red");
        });

        test("createHighlight renders default line opacity", function() {
            var line = getLine(firstPoint.createHighlight());

            equal(line.options.stroke.opacity, 1);
        });

        test("createHighlight renders custom line opacity", function() {
            firstPoint.options.highlight.line.opacity = 0.5;
            var line = getLine(firstPoint.createHighlight());

            equal(line.options.stroke.opacity, 0.5);
        });

    })();

    (function() {
        var candlestickChart,
            MARGIN = PADDING = BORDER = 5,
            candlestick;

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

        function createCandlestickChart(options) {
            candlestickChart = new dataviz.CandlestickChart(plotArea, {
                series: [$.extend({
                    name: "candlestickSeries",
                    data: [[1,4,2,3]],
                    border: {
                        opacity: 0.5,
                        dashType: "dot",
                    },
                    line: {
                        dashType: "dot",
                        color: "red",
                        opacity: 0.7,
                        width: 0.2
                    },
                    color: "#f00",
                    opacity: 0.2,
                    type: "candlestick"
                }, options)]
            });
            candlestick = candlestickChart.points[0];
        }

        // ------------------------------------------------------------
        module("Candlestick Chart / Configuration", {
            setup: function() {
                createCandlestickChart();
            },
            teardown: destroyChart
        });

        test("applies series color to point", function() {
            equal(candlestick.options.color, "#f00");
        });

        test("applies opacity to point", function() {
            equal(candlestick.options.opacity, 0.2);
        });

        test("applies border color to point", function() {
            createCandlestickChart({ border: { color: "point-border" } });
            equal(candlestick.options.border.color, "point-border");
        });

        test("applies dashType", function() {
            equal(candlestick.options.border.dashType, "dot");
        });

        test("applies line dashType", function() {
            equal(candlestick.options.line.dashType, "dot");
        });

        test("applies line color", function() {
            equal(candlestick.options.line.color, "red");
        });

        test("applies line width", function() {
            equal(candlestick.options.line.width, 0.2);
        });

        test("applies line opacity", function() {
            equal(candlestick.options.line.opacity, 0.7);
        });

        test("applies color function", function() {
            createCandlestickChart({
                color: function(bubble) { return "#f00" }
            });

            equal(candlestick.options.color, "#f00");
        });

        test("applies color function for each point", 2, function() {
            createCandlestickChart({
                data: [[1,4,2,3], [1,4,2,3]],
                color: function(bubble) { ok(true); }
            });
        });

        test("color fn argument contains value", 1, function() {
            createCandlestickChart({
                color: function(c) { equal(c.value.open, 1); }
            });
        });

        test("color fn argument contains dataItem", 1, function() {
            createCandlestickChart({
                color: function(c) {
                    deepEqual(c.dataItem, [1,4,2,3]);
                }
            });
        });

        test("color fn argument contains series", 1, function() {
            createCandlestickChart({
                color: function(c) { equal(c.series.name, "candlestickSeries"); }
            });
        });

    })();

    (function() {
        var Candlestick = dataviz.Candlestick,
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

        function createPoint(options, clipBox) {
            point = new Candlestick(VALUE,
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
                            return new Box2D(a,a,b,b);
                        }
                    };
                },
                pane: {
                    clipBox: function(){
                        return clipBox || new Box2D(0, 0, 100, 100);
                    }
                }
            }

            box = new Box2D(0, 0, 100, 100);
            point.reflow(box);

            root = new dataviz.RootElement();
            root.append(point);
            root.box = box.clone();
            root.renderVisual();
        }

        // ------------------------------------------------------------
        module("Candlestick", {
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

        test("tooltipAnchor is limited to the clip box", function() {
            createPoint({}, Box2D(0,2,100,4));

            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.box.x2 + TOOLTIP_OFFSET, 2 + TOOLTIP_OFFSET], TOLERANCE)
        });

        test("highlightVisual returns _mainVisual", function() {
            createPoint({});
            var visual = point.highlightVisual();
            ok(visual instanceof draw.Group);
            ok(visual === point._mainVisual);
        });

    })();

    (function() {
        var data = [{
                open: 2,
                high: 4,
                low: 1,
                close: 3,
                color: "color",
                downColor: "downColor"
            }],
            point;

        function createCandlestickChart(candlestickSeries) {
            chart = createChart({
                dataSource: {
                    data: data
                },
                series: [kendo.deepExtend({
                    type: "candlestick"
                }, candlestickSeries)]
            });

            point = chart._plotArea.charts[0].points[0];
        }

        // ------------------------------------------------------------
        module("Candlestick Chart / Data Binding / Data Source", {
            teardown: function() {
                destroyChart();
            }
        });

        test("binds to 4-element array", function() {
            createCandlestickChart({
                data: [[2, 4, 0, 3]]
            });

            deepEqual(point.value, { open: 2, high: 4, low: 0, close: 3 });
        });

        test("binds open, high, low and close field", function() {
            createCandlestickChart({
                openField: "open",
                highField: "high",
                lowField: "low",
                closeField: "close"
            });

            deepEqual(point.value, { open: 2, high: 4, low: 1, close: 3 });
        });

        test("binds color field", function() {
            createCandlestickChart({
                openField: "open",
                highField: "high",
                lowField: "low",
                closeField: "close",
                colorField: "color"
            });

            deepEqual(point.color, "color");
        });

        test("binds downColor field", function() {
            var chart = createChart({
                dataSource: {
                    data: [{ open: 3, high: 4, low: 1, close: 2, color: "color", downColor: "downColor" }]
                },
                series: [{
                    type: "candlestick",
                    openField: "open",
                    highField: "high",
                    lowField: "low",
                    closeField: "close",
                    baseField: "downColor"
                }]
            });

            point = chart._plotArea.charts[0].points[0];

            deepEqual(point.color, "downColor");
        });

        test("evaluates color function", function() {
            createCandlestickChart({
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

        test("does not taint following points with down color", function() {
            var chart = createChart({
                dataSource: {
                    data: [{
                        open: 3, high: 4, low: 1, close: 2, color: "color", downColor: "downColor"
                    }, {
                        open: 2, high: 4, low: 1, close: 3, color: "color", downColor: "downColor"
                    }]
                },
                series: [{
                    type: "candlestick",
                    openField: "open",
                    highField: "high",
                    lowField: "low",
                    closeField: "close",
                    baseField: "downColor"
                }]
            });

            point = chart._plotArea.charts[0].points[1];

            deepEqual(point.color, "color");
        });
    })();

    (function() {
        var note;

        module("Candlestick Chart / Note", {
            setup: function() {
                var chart = createChart({
                    series: [{
                        type: "candlestick",
                        data: [{ open: 3, high: 4, low: 1, close: 2, noteText: "A" }]
                    }]
                });

                note = chart._plotArea.charts[0].points[0].note;
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("should have text", function() {
            equal(note.text, "A");
        });

        module("Candlestick Chart / Note Template", {
            teardown: function() {
                destroyChart();
            }
        });

        function createNote(options) {
            var chart = createChart({
                series: [{
                    type: "candlestick",
                    data: [{ open: 3, high: 4, low: 1, close: 2, noteText: "A", test: "test" }],
                    notes: $.extend({}, options),
                    name: "name"
                }]
            });

            note = chart._plotArea.charts[0].points[0].note;
        }

        test("dataItem", function() {
            createNote({
                label: {
                    template: "#= dataItem.test #"
                }
            });

            equal(note.label.content, "test");
        });

        test("value", function() {
            createNote({
                label: {
                    template: "open: #= value.open # high: #= value.high # low: #= value.low # close: #= value.close #"
                }
            });

            equal(note.label.content, "open: 3 high: 4 low: 1 close: 2");
        });

        test("series", function() {
            createNote({
                label: {
                    template: "#= series.name #"
                }
            });

            equal(note.label.content, "name");
        });
    })();
})();
