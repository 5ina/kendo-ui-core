(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        draw = kendo.drawing,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        lineChart,
        root,
        segmentPath,
        pointCoordinates,
        TOLERANCE = 1;

    function setupLineChart(plotArea, options) {
        lineChart = new dataviz.LineChart(plotArea, options);

        root = new dataviz.RootElement();
        root.append(lineChart);
        root.reflow();
        root.renderVisual();
        segmentPath = lineChart._segments[0].visual;

        pointCoordinates = mapSegments(segmentPath.segments);
    }

    function stubPlotArea(getCategorySlot, getValueSlot, options) {
        return new function() {
            this.categoryAxis = this.primaryCategoryAxis = {
                getSlot: getCategorySlot,
                options: {
                    categories: ["A", "B"]
                }
            };

            this.valueAxis = {
                getSlot: getValueSlot,
                options: {},
                startValue: function() {
                    return 0;
                }
            };

            this.namedCategoryAxes = {};
            this.namedValueAxes = {};

            this.seriesCategoryAxis = function(series) {
                return series.categoryAxis ?
                    this.namedCategoryAxes[series.categoryAxis] : this.primaryCategoryAxis;
            };

            this.options = options;
        };
    }

    baseLineChartTests("line", dataviz.LineChart);

    (function() {
        var positiveSeries = { type: "line", data: [1, 2], labels: {} },
            negativeSeries = { type: "line", data: [-1, -2], labels: {} },
            sparseSeries = { type: "line", data: [1, 2, undefined, 2], width: 0 },
            VALUE_AXIS_MAX = 2,
            CATEGORY_AXIS_Y = 2;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                                 categoryIndex + 1, CATEGORY_AXIS_Y);
            },
            function(value, b) {
                var value = typeof value === "undefined" ? 0 : value,
                    valueY = VALUE_AXIS_MAX - value,
                    slotTop = Math.min(CATEGORY_AXIS_Y, valueY),
                    slotBottom = Math.max(CATEGORY_AXIS_Y, valueY);

                return new Box2D(0, slotTop, 0, slotBottom);
            }
        );

        // ------------------------------------------------------------
        module("Line Chart / Values exceeding value axis min or max options ", {});

        test("values are not limited", 2, function() {
            var plotArea = stubPlotArea(
                function(categoryIndex) {
                    return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                                     categoryIndex + 1, CATEGORY_AXIS_Y);
                },
                function(value, axisCrossingValue, limit) {
                    ok(!limit);
                    return Box2D();
                }
            );

            setupLineChart(plotArea, { series: [ {data: [1, 2]} ] });
        });

        // ------------------------------------------------------------
        module("Line Chart / Multiple Series", {
            setup: function() {
                setupLineChart(plotArea, { series: [ negativeSeries, positiveSeries ] });
            }
        });

        test("Reports number of categories for two series", function() {
            setupLineChart(plotArea, {series: [ positiveSeries, negativeSeries ]});
            equal(categoriesCount(lineChart.options.series), positiveSeries.data.length);
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2, point.box.y2 + 100, 1);

            ok(result === point);
        });

        test("aboveAxis is set independently for each point", function() {
            equal(lineChart.points[0].aboveAxis, false);
            equal(lineChart.points[2].aboveAxis, false);
        });

        // ------------------------------------------------------------
        module("Line Chart / Multiple Category Axes", {
            setup: function() {
                var chart = createChart({
                    series: [{
                        type: "line",
                        data: [1],
                        categoryAxis: "secondary"
                    }],
                    valueAxis: {
                        axisCrossingValue: [10, 0]
                    },
                    categoryAxis: [{
                        categories: ["A"]
                    }, {
                        name: "secondary",
                        categories: ["B"]
                    }]
                });

                series = chart._model._plotArea.charts[0];
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("sets category axis to first series category axis", function() {
            equal(series.categoryAxis.options.name, "secondary");
        });

        test("line is marked as above axis with respect to its category axis", function() {
            equal(series.points[0].aboveAxis, true);
        });

        // ------------------------------------------------------------
        module("Line Chart / Mismatched series", {
            setup: function() {
                setupLineChart(plotArea, {
                series: [ { data: [1, 2, 3] },
                          positiveSeries
                    ]
                });
            }
        });

        test("getNearestPoint returns nearest series point", function() {
            var point = lineChart.points[3],
                result = lineChart.getNearestPoint(point.box.x2 + 100, point.box.y2, 1);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Line Chart / Missing values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ sparseSeries ]
                });
            },
            teardown: destroyChart
        });

        test("ignores null values when reporting minimum series value", function() {
            setupLineChart(plotArea, {
                series: [{ data: [1, 2, null] }]
            });
            equal(lineChart.valueAxisRanges[undefined].min, 1);
        });

        test("omits missing points by default", function() {
            equal(lineChart.points[2], null);
        });

        test("missing points are assumed to be 0", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "zero" }, sparseSeries)
                ]
            });

            equal(lineChart.points[2].value, 0);
        });

        test("missing points are plotted at 0", function() {
            var chart = createChart({
                series: [
                    $.extend({ missingValues: "zero" }, sparseSeries)
                ],
                valueAxis: {
                    axisCrossingValue: -1000
                }
            });

            lineChart = chart._model._plotArea.charts[0];
            deepEqual(lineChart.plotRange(lineChart.points[2]), [0, 0]);
        });

        test("getNearestPoint returns nearest series point (left)", function() {
            var point = lineChart.points[1],
                result = lineChart.getNearestPoint(point.box.x2 + 0.1, point.box.y2, 0);

            ok(result === point);
        });

        test("getNearestPoint returns nearest series point (right)", function() {
            var point = lineChart.points[3],
                result = lineChart.getNearestPoint(point.box.x1 - 0.1, point.box.y1, 0);

            ok(result === point);
        });

        // ------------------------------------------------------------
        module("Line Chart / Stack / Missing values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ sparseSeries, sparseSeries ],
                    isStacked: true
                });
            }
        });

        test("line is drawn between existing points", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "interpolate" }, sparseSeries)
                ],
                isStacked: true
            });

            deepEqual(pointCoordinates, [
                [ 0.5, 1 ], [ 1.5, 0 ], [ 3.5, 0 ]
            ]);
        });

        test("line stops before missing value", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ],
                isStacked: true
            });

            deepEqual(pointCoordinates, [
                [ 0.5, 1 ], [ 1.5, 0 ]
            ]);
        });

        // ------------------------------------------------------------
        module("Line Chart / 100% Stacked / Positive Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ positiveSeries, positiveSeries ],
                    isStacked: true, isStacked100: true }
                );
            }
        });

        test("reports minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 0.5);
        });

        test("reports maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, 1);
        });

        // ------------------------------------------------------------
        module("Line Chart / 100% Stacked / Negative Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [ negativeSeries, negativeSeries ],
                    isStacked: true, isStacked100: true }
                );
            }
        });

        test("reports minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, -1);
        });

        test("reports maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, -0.5);
        });

        // ------------------------------------------------------------
        module("Line Chart / 100% Stacked / Mixed Values", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [{
                        data: [2, 2],
                        labels: {}
                    }, {
                        data: [-1, -1],
                        labels: {}
                    }],
                    isStacked: true, isStacked100: true }
                );
            }
        });

        test("reports minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 1/3);
        });

        test("reports maximum value for default axis", function() {
            close(lineChart.valueAxisRanges[undefined].max, 2/3);
        });

        // ------------------------------------------------------------
        module("Line Chart / 100% Stacked / Zero", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [{
                        data: [0, 1],
                        labels: {}
                    }, {
                        data: [0, 2],
                        labels: {}
                    }],
                    isStacked: true, isStacked100: true }
                );
            }
        });

        test("reports minumum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].min, 0);
        });

        test("reports maximum value for default axis", function() {
            equal(lineChart.valueAxisRanges[undefined].max, 1);
        });

        // ------------------------------------------------------------
        module("Line Chart / Rendering", {
            setup: function() {
                setupLineChart(plotArea, {
                    series: [
                        $.extend({
                                width: 4,
                                color: "#cf0",
                                opacity: 0.5
                            },
                            positiveSeries
                        )
                    ]
                });
            },
            teardown: destroyChart
        });

        test("sets line width", function() {
            equal(segmentPath.options.stroke.width, 4);
        });

        test("sets line color", function() {
            equal(segmentPath.options.stroke.color, "#cf0");
        });

        test("sets line color to default if series color is fn", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({
                            _defaults: { color: "#cf0" },
                            width: 4,
                            color: function() { },
                            opacity: 0.5
                        },
                        positiveSeries
                    )
                ]
            });
            equal(segmentPath.options.stroke.color, "#cf0");
        });

        test("sets line opacity", function() {
            equal(segmentPath.options.stroke.opacity, 0.5);
        });

        test("does not render points for hidden points", function() {
            var plotArea = stubPlotArea(
                function(categoryIndex) {
                    return new Box2D();
                },
                function(value) {
                    if (value !== 0) {
                        return Box2D();
                    } else {
                        return;
                    }
                }
            );

            setupLineChart(plotArea, {
                series: [{ type: "line", data: [1, 0, 2] }]
            });

            equal(lineChart._segments[0].points().length, 2);
        });

        // ------------------------------------------------------------
        module("Line Chart / Rendering / Missing Values", {
              teardown: destroyChart
        });

        test("line stops before missing value", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0.5, 1 ], [ 1.5, 0 ]
            ]);
        });

        test("no line is created for isolated points", function() {
            setupLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            equal(lineChart._segments.length, 1);
        });

        test("line continues after missing value", function() {
            setupLineChart(plotArea, {
                series: [{
                    data: [ null, 1, 2 ],
                    width: 0
                }]
            });

            deepEqual(pointCoordinates, [
                [ 1.5, 1 ], [ 2.5, 0 ]
            ]);
        });

        test("line is drawn between existing points", function() {
            setupLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0.5, 1 ], [ 1.5, 0 ], [ 3.5, 0 ]
            ]);
        });

        test("line goes to zero for missing point", function() {
            setupLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "zero" }, sparseSeries)
                ]
            });

            deepEqual(pointCoordinates, [
                [ 0.5, 1 ], [ 1.5, 0 ], [ 2.5, 2 ], [ 3.5, 0 ]
            ]);
        });

    })();

    (function() {
        var LinePoint = dataviz.LinePoint,
            point,
            box,
            marker,
            label,
            root,
            VALUE = 1,
            TOOLTIP_OFFSET = 5,
            CATEGORY = "A",
            SERIES_NAME = "series";

        function createPoint(options, clipBox) {
            point = new LinePoint(VALUE,
                $.extend(true, {
                    labels: { font: SANS12 }
                }, LinePoint.fn.defaults, options)
            );

            point.category = CATEGORY;
            point.dataItem = { value: VALUE };
            point.series = { name: SERIES_NAME };
            point.percentage = 0.5;

            point.owner = {
                formatPointValue: function(point, tooltipFormat) {
                    return kendo.dataviz.autoFormat(tooltipFormat, point.value);
                },
                pane: {
                    clipBox: function(){
                        return clipBox || new Box2D(0, 0, 100, 100);
                    }
                }
            };

            box = new Box2D(0, 0, 100, 100);
            point.reflow(box);

            root = new dataviz.RootElement();
            root.append(point);
            root.box = box;
            root.renderVisual();

            marker = point.marker;
            label = point.label;
        }

        // ------------------------------------------------------------
        module("Line Point", {
            setup: function() {
                createPoint();
            }
        });

        test("fills target box", function() {
            sameBox(point.box, box);
        });

        test("creates marker", function() {
            ok(marker instanceof dataviz.BoxElement);
        });

        test("sets marker width", function() {
            createPoint({ markers: { size: 10 } });
            equal(marker.options.width, 10);
        });

        test("sets marker height", function() {
            createPoint({ markers: { size: 10 } });
            equal(marker.options.height, 10);
        });

        test("sets marker rotation", function() {
            createPoint({ markers: { rotation: 90 } });
            equal(marker.options.rotation, 90);
        });

        test("doesn't create marker if size is 0", function() {
            createPoint({ markers: { size: 0 } });
            ok(!marker);
        });

        test("sets marker background color", function() {
            deepEqual(marker.options.background, point.options.markers.background);
        });

        test("sets default marker border color based on background", function() {
            createPoint({ markers: { background: "#cf0" } });
            equal(marker.options.border.color, "#a3cc00");
        });

        test("does not change marker border color if set", function() {
            createPoint({ markers: { border: { color: "" } } });
            equal(marker.options.border.color, "");
        });

        test("sets marker border width", function() {
            createPoint({ markers: { border: { width: 4 } } });
            equal(marker.options.border.width, 4);
        });

        test("doesn't create marker", function() {
            createPoint({ markers: { visible: false }});
            ok(!marker);
        });

        test("sets marker shape type", function() {
            createPoint({ markers: { type: "triangle" }});
            equal(marker.options.type, "triangle");
        });

        test("marker is positioned at top", function() {
            createPoint({ vertical: true, aboveAxis: true });
            sameBox(marker.box, new Box2D(44, -6, 56, 6));
        });

        test("marker is positioned at bottom", function() {
            createPoint({ vertical: true, aboveAxis: false });
            sameBox(marker.box, new Box2D(44, 94, 56, 106));
        });

        test("marker is positioned at right", function() {
            createPoint({ vertical: false, aboveAxis: true });
            sameBox(marker.box, new Box2D(94, 44, 106, 56));
        });

        test("marker is positioned at left", function() {
            createPoint({ vertical: false, aboveAxis: false });
            sameBox(marker.box, new Box2D(-6, 44, 6, 56));
        });

        test("sets marker opacity", function() {
            createPoint({ markers: { opacity: 0.5 }});
            deepEqual(marker.options.opacity, point.options.markers.opacity);
        });

        test("createHighlight returns marker outline", function() {
            createPoint({ markers: { type: "circle" }});
            var marker = point.marker.visual.geometry();
            var highlight = point.createHighlight().geometry();

            ok(marker.center.equals(highlight.center));
            equal(marker.radius, highlight.radius);
        });

        test("createHighlight returns marker when not initially visible", function() {
            createPoint({ markers: { visible: false }});

            var highlight = point.createHighlight();
            ok(highlight instanceof draw.Circle);
        });

        test("tooltipAnchor is at top right of marker / above axis", function() {
            createPoint({ aboveAxis: true });
            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.marker.box.x2 + TOOLTIP_OFFSET, point.marker.box.y1 - 10])
        });

        test("tooltipAnchor is at bottom right of marker / below axis", function() {
            createPoint({ aboveAxis: false });
            var anchor = point.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y],
                 [point.marker.box.x2 + TOOLTIP_OFFSET, point.marker.box.y2])
        });

        test("tooltipAnchor returns undefined if the marker box is after the clipbox", function() {
            createPoint({ aboveAxis: true }, Box2D(1,1, 40, 100));
            var anchor = point.tooltipAnchor(10, 10);
            equal(anchor, undefined);
        });

        test("tooltipAnchor returns undefined if the marker box is before the clipbox", function() {
            createPoint({ aboveAxis: true}, Box2D(57,1, 100, 100));
            var anchor = point.tooltipAnchor(10, 10);
            equal(anchor, undefined);
        });

        test("tooltipAnchor returns undefined if the marker box is below the clipbox", function() {
            createPoint({ aboveAxis: true}, Box2D(1,-10, 100, -7));
            var anchor = point.tooltipAnchor(10, 10);
            equal(anchor, undefined);
        });

        test("tooltipAnchor returns undefined if the marker box is above the clipbox", function() {
            createPoint({ aboveAxis: true}, Box2D(1, 10, 100, 20));
            var anchor = point.tooltipAnchor(10, 10);
            equal(anchor, undefined);
        });

        // ------------------------------------------------------------
        module("Line Point / Labels", {
            setup: function() {
                createPoint({ labels: { visible: true } });
            }
        });

        test("sets label text", function() {
            equal(label.content, VALUE);
        });

        test("applies full label format", function() {
            createPoint({ labels: { visible: true, format: "{0}%" }});
            equal(label.content, VALUE + "%");
        });

        test("applies simple label format", function() {
            createPoint({ labels: { visible: true, format: "p0" }});
            equal(label.content, VALUE * 100 + " %");
        });

        test("sets label color", function() {
            createPoint({ labels: { visible: true, color: "#cf0" }});
            deepEqual(label.options.color, "#cf0");
        });

        test("sets label background", function() {
            createPoint({ labels: { visible: true, background: "#cf0" }});
            deepEqual(label.options.background, "#cf0");
        });

        test("sets label border color", function() {
            createPoint({ labels: { visible: true, border: { color: "#cf0" } }});
            deepEqual(label.options.border.color, "#cf0");
        });

        test("sets label border width", function() {
            createPoint({ labels: { visible: true, border: { width: 4 } }});
            deepEqual(label.options.border.width, 4);
        });

        test("sets label font", function() {
            createPoint({ labels: { visible: true, font: "12px comic-sans" }});
            deepEqual(label.options.font, "12px comic-sans");
        });

        test("sets default left margin", function() {
            deepEqual(label.options.margin.left, 3);
        });

        test("sets default right margin", function() {
            deepEqual(label.options.margin.right, 3);
        });

        test("labels are not visible by default", function() {
            createPoint();
            equal(typeof label, "undefined");
        });

        test("sets label visibility", function() {
            equal(label.options.visible, true);
        });

        test("label is positioned above marker", function() {
            createPoint({ labels: { visible: true, position: "above" } });
            sameBox(label.box, new Box2D(39, -35, 60, -6), TOLERANCE);
        });

        test("label is positioned below marker", function() {
            createPoint({ labels: { visible: true, position: "below" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        test("label is positioned right of marker", function() {
            createPoint({ labels: { visible: true, position: "right" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        test("label is positioned left of marker", function() {
            createPoint({ labels: { visible: true, position: "left" } });
            sameBox(marker.box, new Box2D(44, -6, 56, 6), TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Line Point / Labels / Template");

        function assertTemplate(template, value, format) {
            createPoint({ labels: { visible: true, template: template, format: format } });
            equal(label.content, value);
        }

        test("renders template", function() {
            assertTemplate("${value}%", VALUE + "%");
        });

        test("renders template even when format is set", function() {
            assertTemplate("${value}%", VALUE + "%", "{0:C}");
        });

        test("template has category", function() {
            assertTemplate("${category}", CATEGORY);
        });

        test("template has percentage", function() {
            assertTemplate("${percentage}", "0.5");
        });

        test("template has dataItem", function() {
            assertTemplate("${dataItem.value}", VALUE);
        });

        test("template has series", function() {
            assertTemplate("${series.name}", SERIES_NAME);
        });
    })();

    (function() {
        var chart,
            marker,
            label,
            segment;

        function createLineChart(options) {
            chart = createChart($.extend({
                series: [{
                    type: "line",
                    data: [1, 2]
                }],
                categoryAxis: {
                    categories: ["A"]
                },
                chartArea: {
                    width: 600,
                    height: 400
                }
            }, options));

            var plotArea = chart._model.children[1],
                lineChart = plotArea.charts[0],
                point = lineChart.points[0];

            marker = point.children[0];
            label = point.children[1];
            segment = lineChart._segments[0];
        }

        function linePointClick(callback) {
            createLineChart({
                seriesClick: callback
            });

            chart._userEvents.press(0, 0, getChartDomElement(marker));
            chart._userEvents.end(0, 0);
        }

        function linePointHover(callback) {
            createLineChart({
                seriesHover: callback
            });

            getChartDomElement(marker).mouseover();
        }

        function lineClick(callback, x, y) {
            createLineChart({
                seriesClick: callback
            });

            chart._userEvents.press(x, y, getChartDomElement(segment));
            chart._userEvents.end(x, y);
        }

        function lineHover(callback, x, y) {
            createLineChart({
                seriesHover: callback
            });

            triggerEvent("mouseover", getChartDomElement(segment), x, y);
        }

        // ------------------------------------------------------------
        module("Line Chart / Events / seriesClick", {
            teardown: destroyChart
        });

        test("fires when clicking line points", 1, function() {
            linePointClick(function() { ok(true); });
        });

        test("fires when clicking line point labels", 1, function() {
            createLineChart({
                seriesDefaults: {
                    line: {
                        labels: {
                            visible: true
                        }
                    }
                },
                seriesClick: function(e) { ok(true); }
            });
            chart._userEvents.press(0, 0, getChartDomElement(label));
            chart._userEvents.end(0, 0);
        });

        test("event arguments contain value", 1, function() {
            linePointClick(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain category", 1, function() {
            linePointClick(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain percentage", function() {
            createLineChart({
                seriesDefaults: {
                    type: "line",
                    stack: { type: "100%" }
                },
                series: [{ data: [1] }, { data: [2] }],
                seriesClick: function(e) { equal(e.percentage, 1/3); }
            });
            chart._userEvents.press(0, 0, getChartDomElement(marker));
            chart._userEvents.end(0, 0);
        });

        test("event arguments contain series", 1, function() {
            linePointClick(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain dataItem", 1, function() {
            linePointClick(function(e) {
                deepEqual(e.value, e.value);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            linePointClick(function(e) {
                equal(e.element[0], getChartDomElement(marker)[0]);
            });
        });

        test("fires when clicking line", 1, function() {
            lineClick(function() { ok(true); });
        });

        test("fires for closest point when clicking line (1)", 1, function() {
            lineClick(function(e) { equal(e.value, 1); }, 0, 0);
        });

        test("fires for closest point when clicking line (2)", 1, function() {
            lineClick(function(e) { equal(e.value, 2); }, 1000, 0);
        });

        // ------------------------------------------------------------
        module("Line Chart / Events / seriesHover", {
            teardown: function() {
                destroyChart();
                $(document.body).unbind(".tracking");
            }
        });

        test("fires when hovering line points", 1, function() {
            linePointHover(function() { ok(true); });
        });

        test("fires when hovering line point labels", 1, function() {
            createLineChart({
                seriesDefaults: {
                    line: {
                        labels: {
                            visible: true
                        }
                    }
                },
                seriesHover: function(e) { ok(true); }
            });
            getChartDomElement(label).mouseover();
        });

        test("event arguments contain value", 1, function() {
            linePointHover(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain percentage", function() {
            createLineChart({
                seriesDefaults: {
                    type: "line",
                    stack: { type: "100%" }
                },
                series: [{ data: [1] }, { data: [2] }],
                seriesHover: function(e) { equal(e.percentage, 1/3); }
            });
            getChartDomElement(marker).mouseover();
        });

        test("event arguments contain category", 1, function() {
            linePointHover(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain series", 1, function() {
            linePointHover(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain dataItem", 1, function() {
            linePointHover(function(e) {
                deepEqual(e.dataItem, e.value);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            linePointHover(function(e) {
                equal(e.element[0], getChartDomElement(marker)[0]);
            });
        });

        test("fires when hovering line", 1, function() {
            lineHover(function() { ok(true); });
        });

        test("fires for closest point when hovering line (1)", 1, function() {
            lineHover(function(e) { equal(e.value, 1); }, 0, 0);
        });

        test("fires for closest point when hovering line (2)", 1, function() {
            lineHover(function(e) { equal(e.value, 2); }, 1000, 0);
        });

        test("fires when moving over neighbor", 2, function() {
            lineHover(function() { ok(true); });

            var e = new jQuery.Event("mousemove"),
                element = $("#container"),
                offset = element.offset();

            e.clientX = offset.left + 500;
            e.clientY = offset.top + 100;
            $(document.body).trigger(e);
       });

    })();
})();
