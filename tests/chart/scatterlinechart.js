(function() {
    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        chartBox = new Box2D(0, 0, 800, 600),
        scatterLineChart,
        root,
        pointCoordinates,
        TOLERANCE = 1;

    function getSegmentPath(idx) {
        return scatterLineChart._segments[idx || 0].visual;
    }

    function setupScatterLineChart(plotArea, options, rootOptions) {
        scatterLineChart = new dataviz.ScatterLineChart(plotArea, options);

        root = new dataviz.RootElement(rootOptions);
        root.append(scatterLineChart);
        root.reflow();
        root.renderVisual();

        if (scatterLineChart._segments.length) {
            pointCoordinates = mapSegments(getSegmentPath().segments);
        }
    }

    (function() {
        var series = { data: [[1, 1], [2, 2]], labels: {}, type: "scatterLine" },
            sparseSeries = { data: [
                                [1, 1], [2, 2], undefined, [2, 2], [null, 1], [1, null]
                            ], labels: {}, type: "scatterLine", width: 0 },
            VALUE_AXIS_MAX = 2,
            CATEGORY_AXIS_Y = 2;

        function PlotAreaStub() { }

        $.extend(PlotAreaStub.prototype, {
            axisX: {
                getSlot: function(categoryIndex) {
                    return new Box2D(categoryIndex, CATEGORY_AXIS_Y,
                    categoryIndex + 1, CATEGORY_AXIS_Y);
                }
            },
            axisY: {
                getSlot: function(value) {
                    var value = typeof value === "undefined" ? 0 : value,
                        valueY = VALUE_AXIS_MAX - value,
                        slotTop = Math.min(CATEGORY_AXIS_Y, valueY),
                        slotBottom = Math.max(CATEGORY_AXIS_Y, valueY);

                    return new Box2D(0, slotTop, 0, slotBottom);
                },
                options: {}
            },
            namedXAxes: {},
            namedYAxes: {}
        });

        // ------------------------------------------------------------
        module("Scatter Line Chart / Series", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupScatterLineChart(plotArea, { series: [ series ] });
            }
        });

        test("removes the series points if the visible is set to false", function() {
            var chart = createChart({
                seriesDefaults: {
                    type: "scatterLine"
                },
                series: [{
                    data: [[1,2]],
                    visible: false
                },{
                    data: [[1,2]]
                }]
            });

            var points = chart._plotArea.charts[0].points;
            ok(points.length === 1);

            destroyChart();
        });

        test("Creates points for scatterLineChart data points", function() {
            equal(scatterLineChart.points.length, series.data.length);
        });

        test("Reports minimum series value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].min, series.data[0][0]);
        });

        test("Reports minimum series value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].min, series.data[0][1]);
        });

        test("Reports maximum series value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].max, series.data[1][0]);
        });

        test("Reports maximum series value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].max, series.data[1][1]);
        });

        test("points have set width", function() {
            $.each(scatterLineChart.points, function() {
                equal(this.box.width(), 1);
            });
        });

        test("points have set height according to value", function() {
            var pointHeights = $.map(scatterLineChart.points, function(point) {
                return point.box.height();
            });

            deepEqual(pointHeights, [1, 2]);
        });

        test("sets point owner", function() {
            ok(scatterLineChart.points[0].owner === scatterLineChart);
        });

        test("sets point series", function() {
            ok(scatterLineChart.points[0].series === series);
        });

        test("sets point series index", function() {
            ok(scatterLineChart.points[0].seriesIx === 0);
        });

        test("sets point dataItem", function() {
            equal(typeof scatterLineChart.points[0].dataItem, "object");
        });

        test("renders empty scatter line series", 0, function() {
            setupScatterLineChart(plotArea, { series: [ { data: [] } ] });
        });

        test("renders empty and non-empty scatter line series", 0, function() {
            setupScatterLineChart(plotArea, { series: [ { data: [] }, series ] });
        });

        // ------------------------------------------------------------
        module("Scatter Line Chart / Multiple Axes", {
            setup: function() {
                plotArea = new PlotAreaStub();
                plotArea.namedXAxes.secondary = plotArea.axisX;
                plotArea.namedYAxes.secondary = plotArea.axisY;

                setupScatterLineChart(plotArea, {
                    series: [
                        { type: "scatterLine", data: [[1, 10], [2, 20]] },
                        { type: "scatterLine", xAxis: "secondary", yAxis: "secondary", data: [[3, 30], [4, 40]] }
                    ]
                });
            }
        });

        test("Reports minimum value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].min, 1);
        });

        test("Reports minimum value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].min, 10);
        });

        test("Reports maximum value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].max, 2);
        });

        test("Reports maximum value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].max, 20);
        });

        test("Reports minimum value for secondary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges.secondary.min, 3);
        });

        test("Reports minimum value for secondary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges.secondary.min, 30);
        });

        test("Reports maximum value for secondary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges.secondary.max, 4);
        });

        test("Reports maximum value for secondary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges.secondary.max, 40);
        });

        test("Throws error when unable to locate X axis", function() {
            raises(function() {
                    setupScatterLineChart(plotArea, {
                        series: [
                            { data: [[1, 10], [2, 20]], xAxis: "b" }
                        ]
                    });
                },
                /Unable to locate X axis with name b/);
        });

        test("Throws error when unable to locate Y axis", function() {
            raises(function() {
                    setupScatterLineChart(plotArea, {
                        series: [
                            { data: [[1, 10], [2, 20]], yAxis: "b" }
                        ]
                    });
                },
                /Unable to locate Y axis with name b/);
        });

        // ------------------------------------------------------------
        module("Scatter Line Chart / Missing values", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupScatterLineChart(plotArea, {
                    series: [ sparseSeries ]
                });
            }
        });

        test("Reports minimum series value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].min, 1);
        });

        test("Reports minimum series value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].min, 1);
        });

        test("Reports maximum series value for primary X axis", function() {
            deepEqual(scatterLineChart.xAxisRanges[undefined].max, 2);
        });

        test("Reports maximum series value for primary Y axis", function() {
            deepEqual(scatterLineChart.yAxisRanges[undefined].max, 2);
        });

        test("omits null points by default", function() {
            equal(scatterLineChart.points[2], null);
        });

        test("omits null points when interpolating", function() {
            setupScatterLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "interpolate" }, sparseSeries)
                ]
            });

            equal(scatterLineChart.points[2], null);
        });

        test("point with missing X value is omitted", function() {
            equal(scatterLineChart.points[5], null);
        });

        test("point with missing Y value is omitted", function() {
            equal(scatterLineChart.points[6], null);
        });

        // ------------------------------------------------------------
        module("Scatter Line Chart / Rendering", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupScatterLineChart(plotArea, {
                    series: [
                            $.extend({
                                width: 4,
                                color: "#cf0",
                                opacity: 0.5,
                                dashType: "dot",
                                type: "scatterLine"
                            },
                            series
                        )
                    ]
                });
            }
        });

        test("sets line width", function() {
            equal(getSegmentPath().options.stroke.width, 4);
        });

        test("sets line color", function() {
            equal(getSegmentPath().options.stroke.color, "#cf0");
        });

        test("sets line opacity", function() {
            equal(getSegmentPath().options.stroke.opacity, 0.5);
        });

        test("sets line dashType", function() {
            equal(getSegmentPath().options.stroke.dashType, "dot");
        });

        test("creates visual", function() {
            ok(scatterLineChart.visual);
        });

        test("creates clip animation", function() {
            ok(scatterLineChart.animation);
            ok(scatterLineChart.animation instanceof dataviz.ClipAnimation);
            sameBox(scatterLineChart.animation.options.box, root.box);
            sameLinePath(scatterLineChart.animation.element, draw.Path.fromRect(root.box.toRect()));
        });

        test("does not create clip animation if transitions are disabled", function() {
            setupScatterLineChart(new PlotAreaStub(), { series: series }, {
                transitions: false
            });

            ok(!scatterLineChart.animation);
            ok(!scatterLineChart.visual.clip());
        });

        test("does not set clip on points markers by default", function() {
            var points = scatterLineChart.points;
            for (var idx = 0; idx < points.length; idx++) {
                ok(!points[idx].marker.visual.clip());
            }
        });

        test("does not set clip on segments by default", function() {
            var segments = scatterLineChart._segments;
            for (var idx = 0; idx < segments.length; idx++) {
                ok(!segments[idx].visual.clip());
            }
        });

        test("sets animation clip path to points markers with zIndex", function() {
            plotArea = new PlotAreaStub();
            setupScatterLineChart(plotArea, {
                series: [{
                    type: "scatterLine",
                    data: [[0, 1]]
                }, {
                    type: "scatterLine",
                    data: [[1, 2]],
                    zIndex: 1
                }]
            });

            var clip = scatterLineChart.seriesPoints[1][0].marker.visual.clip();
            ok(clip);
            ok(clip === scatterLineChart.animation.element);
        });

        test("sets animation clip path to segments with zIndex", function() {
            plotArea = new PlotAreaStub();
            setupScatterLineChart(plotArea, {
                series: [{
                    type: "scatterLine",
                    data: [[0, 1], [1, 2]]
                }, {
                    type: "scatterLine",
                    data: [[1, 2], [2, 3]],
                    zIndex: 1
                }]
            });

            var clip = scatterLineChart._segments[1].visual.clip();
            ok(clip);
            ok(clip === scatterLineChart.animation.element);
        });

        // ------------------------------------------------------------
        module("Scatter Line Chart / Rendering / Missing Values", {
            setup: function() {
                plotArea = new PlotAreaStub();
            }
        });

        test("line stops before missing value", function() {
            setupScatterLineChart(plotArea, {
                series: [
                    $.extend({ missingValues: "gap" }, sparseSeries)
                ]
            });

            deepEqual(pointCoordinates, [
                [ 1.5, 1 ], [ 2.5, 0 ]
            ]);
        });

        test("no line is created for isolated points", function() {
            setupScatterLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            equal(scatterLineChart._segments.length, 1);
        });

        test("line continues after missing value", function() {
            setupScatterLineChart(plotArea, {
                series: [{
                    data: [ null, [1, 1], [2, 2]],
                    labels: {}, type: "scatterLine", width: 0
                }]
            });

            deepEqual(pointCoordinates, [
                [ 1.5, 1 ], [ 2.5, 0 ]
            ]);
        });

        test("line is drawn between existing points", function() {
            setupScatterLineChart(plotArea, {
                series: [
                    sparseSeries
                ]
            });

            deepEqual(pointCoordinates, [
                [ 1.5, 1 ], [ 2.5, 0 ], [ 2.5, 0 ]
            ]);
        });

        // ------------------------------------------------------------\

        function getPointText(idx) {
            return scatterLineChart.points[idx || 0].label.visual.children[0];
        }

        module("Scatter Line Chart / Labels", {
            setup: function() {
                plotArea = new PlotAreaStub();
            }
        });

        test("applies full label format", function() {
            setupScatterLineChart(plotArea, {
                series: [{
                    data: [[1, 10], [2, 20]],
                    labels: { visible: true, format: "{0:C} {1:C}" },
                    type: "scatterLine"
                }]
            });

            equal(getPointText().content(), "$1.00 $10.00");
        });

    })();

    (function() {
        var scatterLineChart,
            MARGIN = PADDING = BORDER = 5,
            linePoint,
            TEMPLATE = "template",
            FORMAT = "format";

        function PlotAreaStub() { }

        $.extend(PlotAreaStub.prototype, {
            axisX: {
                getSlot: function(value) {
                    return new Box2D();
                }
            },
            axisY: {
                getSlot: function(categoryIndex) {
                    return new Box2D();
                }
            }
        });

        function createScatterLineChart(options) {
            plotArea = new PlotAreaStub();
            scatterLineChart = new dataviz.ScatterLineChart(plotArea, {
                series: [$.extend({
                    data: [[0, 0], [1, 1]],
                    type: "scatterLine",
                    color: "#f00",
                    markers: {
                        visible: false,
                        size: 10,
                        type: "triangle",
                        border: {
                            width: BORDER
                        }
                    },
                    labels: {
                        visible: false,
                        color: "labels-color",
                        background: "labels-background",
                        border: {
                            color: "labels-border",
                            width: BORDER
                        },
                        margin: MARGIN,
                        padding: PADDING,
                        template: TEMPLATE,
                        format: FORMAT
                    },
                    opacity: 0.5,
                    dashType: "dot"
                }, options)]
            });
            scatterLinePoint = scatterLineChart.points[0];
        }

        // ------------------------------------------------------------
        module("Scatter Line Chart / Configuration", {
            setup: function() {
                createScatterLineChart();
            }
        });

        test("applies visible to point markers", function() {
            equal(scatterLinePoint.options.markers.visible, false);
        });

        test("applies series color to point markers border", function() {
            createScatterLineChart({ markers: { visible: true } });
            scatterLineChart.reflow(chartBox);
            equal(scatterLinePoint.marker.options.border.color, "#f00");
        });

        test("applies series opacity color to point markers", function() {
            equal(scatterLinePoint.options.markers.opacity, 0.5);
        });

        test("applies size to point markers", function() {
            equal(scatterLinePoint.options.markers.size, 10);
        });

        test("applies type to point markers", function() {
            equal(scatterLinePoint.options.markers.type, "triangle");
        });

        test("applies border color to point markers", function() {
            createScatterLineChart({ markers: { border: { color: "marker-border" } } });
            equal(scatterLinePoint.options.markers.border.color, "marker-border");
        });

        test("applies border width to point markers.", function() {
            equal(scatterLinePoint.options.markers.border.width, BORDER);
        });

        test("applies visible to point labels", function() {
            equal(scatterLinePoint.options.labels.visible, false);
        });

        test("applies color to point labels", function() {
            equal(scatterLinePoint.options.labels.color, "labels-color");
        });

        test("applies background to point labels", function() {
            equal(scatterLinePoint.options.labels.background, "labels-background");
        });

        test("applies border color to point labels", function() {
            equal(scatterLinePoint.options.labels.border.color, "labels-border");
        });

        test("applies border width to point labels", function() {
            equal(scatterLinePoint.options.labels.border.width, BORDER);
        });

        test("applies padding to point labels", function() {
            equal(scatterLinePoint.options.labels.padding, PADDING);
        });

        test("applies margin to point labels", function() {
            equal(scatterLinePoint.options.labels.margin, MARGIN);
        });

        test("applies dashType to point labels", function() {
            equal(scatterLinePoint.options.dashType, "dot");
        });

        test("applies template to point labels", function() {
            equal(scatterLinePoint.options.labels.template, TEMPLATE);
        });

        test("applies format to point labels", function() {
            equal(scatterLinePoint.options.labels.format, FORMAT);
        });

        test("applies color function", function() {
            createScatterLineChart({
                color: function(point) { return "#f00" }
            });

            equal(scatterLinePoint.color, "#f00");
        });

        test("applies color function for each point", 2, function() {
            createScatterLineChart({
                color: function() { ok(true); }
            });
        });

        test("color fn argument contains value", 1, function() {
            createScatterLineChart({
                data: [[1, 1]],
                color: function(point) {
                    deepEqual(point.value, { x: 1, y: 1});
                }
            });
        });

        test("color fn argument contains series", 1, function() {
            createScatterLineChart({
                name: "series 1",
                data: [[1, 1]],
                color: function(point) { equal(point.series.name, "series 1"); }
            });
        });

        test("color fn argument contains dataItem", 1, function() {
            createScatterLineChart({
                data: [[1, 1]],
                color: function(point) { equal(point.dataItem[0], 1); }
            });
        });

    })();

    (function() {
        var data = [{
                xValue: 3,
                yValue: 1
            }, {
                xValue: 2,
                yValue: 2
            }, {
                xValue: 2,
                yValue: 2
            }],
            points;

        // ------------------------------------------------------------
        module("Scatter Chart / Integration", {
            setup: function() {
                var chart = createChart({
                    dataSource: {
                        data: data
                    },
                    series: [{
                        type: "scatter",
                        xField: "xValue",
                        yField: "yValue"
                    }]
                });

                points = chart._plotArea.charts[0].points;
            },
            teardown: destroyChart
        });

        test("gets data from x and y field", function() {
            equal(points.length, 3);
        });

    })();

    (function() {
        var note;

        module("Scatter Line Chart / Note", {
            setup: function() {
                var chart = createChart({
                    series: [{
                        name: "Value",
                        type: "scatter",
                        data: [{ x: 1, y: 10, noteText: "A" }]
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

        module("Scatter Line Chart / Note Template", {
            teardown: function() {
                destroyChart();
            }
        });

        function createNote(options) {
            var chart = createChart({
                series: [{
                    name: "Value",
                    type: "scatter",
                    data: [{ x: 1, y: 10, noteText: "A", test: "test" }],
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
                    template: "x: #= value.x # y: #= value.y #"
                }
            });

            equal(note.label.content, "x: 1 y: 10");
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

    // ------------------------------------------------------------

    (function() {
        module("Scatter Chart / Values exceeding axis min or max options ", {});

        test("values are not limited", 2, function() {
            var plotArea = {
                axisX: {
                    getSlot: function(a,b,limit) {
                        ok(!limit);
                        return Box2D();
                    }
                },
                axisY: {
                    getSlot: function(a,b, limit) {
                        ok(!limit);
                        return Box2D();
                    }
                }
            };

            setupScatterLineChart(plotArea, { series: [ {data: [[1, 2]], type: "scatterLine"} ] });
        });
    })();
})();
