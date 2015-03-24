(function() {
    var dataviz = kendo.dataviz;
    var draw = kendo.drawing;
    var geom = kendo.geometry;
    var deepExtend = kendo.deepExtend;
    var plotArea;
    var chart;

    function createChart(series, options) {
        plotArea = new dataviz.CategoricalPlotArea([]);
        chart = new dataviz.WaterfallChart(plotArea, deepExtend({ series: series }, options));
    }

    function makeSeries(data) {
        return [{
            type: "waterfall",
            data: data
        }];
    }

    function assertFields(field, values) {
        deepEqual(
            $.map(chart.points, function(p) { return p[field]; }),
            values
        );
    }

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Point Fields /", {
            setup: function() {
                createChart(makeSeries([1, 2, 3, 4]));
            }
        });

        test("total field is set on all points", function() {
            assertFields("total", [1, 3, 6, 10]);
        });

        test("runningTotal field is set on all points", function() {
            assertFields("runningTotal", [1, 3, 6, 10]);
        });

        test("sets correct category if multiple categoryAxis are used", function() {
            plotArea = new dataviz.CategoricalPlotArea([{
                    type: "waterfall",
                    categoryAxis: "A",
                    data: [1, 2]
                }, {
                    type: "waterfall",
                    categoryAxis: "B",
                    data: [3, 4]
                }], {
                categoryAxis: [{
                    name: "A",
                    categories: [1, 2]
                }, {
                    name: "B",
                    categories: [3, 4]
                }]
            });

            for (var chartIdx = 0; chartIdx < plotArea.charts.length; chartIdx++) {
                chart = plotArea.charts[chartIdx];

                for (var idx = 0; idx < chart.points.length; idx++) {
                    equal(chart.points[idx].category, chart.points[idx].value);
                }
            }
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Running Total /", {
            setup: function() {
                createChart(makeSeries([
                   { summary: "runningTotal" },
                   { value: 1 }, { value: 2 }, { summary: "runningTotal" },
                   { value: 3 }, { value: 4 }, { summary: "runningTotal" }
                ]));
            }
        });

        test("runningTotal field is set on all points", function() {
            assertFields("runningTotal", [0, 1, 3, 0, 3, 7, 0]);
        });

        test("running total #1 is set as value", function() {
            equal(chart.points[0].value, 0);
        });

        test("running total #2 is set as value", function() {
            equal(chart.points[3].value, 3);
        });

        test("running total #3 is set as value", function() {
            equal(chart.points[6].value, 7);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Running Total / Missing Values /");

        test("ignores null values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: null }, { value: 2 }, { summary: "runningTotal" }
            ]));

            assertFields("runningTotal", [1, 1, 3, 0]);
        });

        test("ignores undefined values", function() {
            createChart(makeSeries([
               { value: 1 }, {}, { value: 2 }, { summary: "runningTotal" }
            ]));

            assertFields("runningTotal", [1, 1, 3, 0]);
        });

        test("ignores NaN values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: NaN }, { value: 2 }, { summary: "runningTotal" }
            ]));

            assertFields("runningTotal", [1, 1, 3, 0]);
        });

        test("ignores other values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: "foo" }, { value: 2 }, { summary: "runningTotal" }
            ]));

            assertFields("runningTotal", [1, 1, 3, 0]);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Total /", {
            setup: function() {
                createChart(makeSeries([
                   { summary: "total" },
                   { value: 1 }, { value: 2 }, { summary: "total" },
                   { value: 3 }, { value: 4 }, { summary: "total" }
                ]));
            }
        });

        test("total field is set on all points", function() {
            assertFields("total", [0, 1, 3, 3, 6, 10, 10]);
        });

        test("total #1 is set as value", function() {
            equal(chart.points[0].value, 0);
        });

        test("total #2 is set as value", function() {
            equal(chart.points[3].value, 3);
        });

        test("total #3 is set as value", function() {
            equal(chart.points[6].value, 10);
        });

        test("total is not reset by running total", function() {
            createChart(makeSeries([
               { value: 1 }, { value: 2 }, { summary: "runningTotal" },
               { value: 3 }, { value: 4 }, { summary: "total" }
            ]));

            equal(chart.points[5].value, 10);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Total / Missing Values /");

        test("ignores null values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: null }, { value: 2 }, { summary: "total" }
            ]));

            assertFields("total", [1, 1, 3, 3]);
        });

        test("ignores undefined values", function() {
            createChart(makeSeries([
               { value: 1 }, {}, { value: 2 }, { summary: "total" }
            ]));

            assertFields("total", [1, 1, 3, 3]);
        });

        test("ignores NaN values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: NaN }, { value: 2 }, { summary: "total" }
            ]));

            assertFields("total", [1, 1, 3, 3]);
        });

        test("ignores other values", function() {
            createChart(makeSeries([
               { value: 1 }, { value: "foo" }, { value: 2 }, { summary: "total" }
            ]));

            assertFields("total", [1, 1, 3, 3]);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        function assertPlotRange(index, range) {
            deepEqual(chart.plotRange(chart.points[index]), range);
        }

        module("Waterfall / Plot Range /", {
            setup: function() {
                createChart(makeSeries([
                   { value: 1 }, { value: 3 }, { summary: "runningTotal" },
                   { value: -1 }, { value: -2 }, { summary: "runningTotal" },
                   { summary: "total" }
                ]));
            }
        });

        test("point #1 starts at 0", function() {
            assertPlotRange(0, [0, 1]);
        });

        test("point #2 starts point #1 end", function() {
            assertPlotRange(1, [1, 4]);
        });

        test("point #3 shows running total from point #2 end", function() {
            assertPlotRange(2, [4, 0]);
        });

        test("point #4 starts from point #2", function() {
            assertPlotRange(3, [4, 3]);
        });

        test("point #5 starts from point #4 end", function() {
            assertPlotRange(4, [3, 1]);
        });

        test("point #6 shows running total starting from point #5 end", function() {
            assertPlotRange(5, [1, 4]);
        });

        test("point #7 shows total starting from 0", function() {
            assertPlotRange(6, [0, 1]);
        });

        test("negative running total", function() {
            createChart(makeSeries([
               { value: -1 }, { value: -2 }, { summary: "runningTotal" }
            ]));

            assertPlotRange(2, [-3, 0]);
        });

        test("negative total", function() {
            createChart(makeSeries([
               { value: -1 }, { value: -2 }, { summary: "total" }
            ]));

            assertPlotRange(2, [0, -3]);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Waterfall / Axis Range /", {
            setup: function() {
                createChart(makeSeries([
                   { value: 1 }, { value: 3 }, { summary: "runningTotal" },
                   { value: -1 }, { value: -2 }, { summary: "total" }
                ]));
            }
        });

        test("Reports minimum value for default axis", function() {
            equal(chart.valueAxisRanges[undefined].min, 0);
        });

        test("Reports maximum value for default axis", function() {
            equal(chart.valueAxisRanges[undefined].max, 4);
        });

        test("negative running total", function() {
            createChart(makeSeries([
               { value: 1 }, { value: 2 }, { summary: "runningTotal" },
               { value: -1 }, { summary: "runningTotal" }
            ]));

            equal(chart.valueAxisRanges[undefined].min, 0);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        function assertSegment(segmentIx, fromIx, toIx) {
            equal(chart.segments[segmentIx].from, chart.points[fromIx]);
            equal(chart.segments[segmentIx].to, chart.points[toIx]);
        }

        module("Waterfall / Segments /", {
            setup: function() {
                createChart(makeSeries([
                   { value: 1 }, { value: 3 }, { summary: "runningTotal" },
                   { value: -1 }, { value: -2 }, { summary: "total" }
                ]));
            }
        });

        test("creates segments between regular points", function() {
            assertSegment(0, 0, 1);
            assertSegment(3, 3, 4);
        });

        test("creates segments between regular points and totals", function() {
            assertSegment(1, 1, 2);
            assertSegment(2, 2, 3);
            assertSegment(4, 4, 5);
        });

        test("doesn't fail with no points", function() {
            createChart(makeSeries([]));
            ok(true);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var segment;
        var polyline;

        module("WaterfallSegment", {
            setup: function() {
                segment = new dataviz.WaterfallSegment({
                    // From point
                    aboveAxis: true,
                    isVertical: true,
                    box: new dataviz.Box2D(0, 0, 10, 100)
                }, {
                    // To point
                    aboveAxis: true,
                    isVertical: true,
                    box: new dataviz.Box2D(20, 0, 30, 100)
                }, {
                    // Series
                    line: {
                        color: "blue",
                        width: 2,
                        opacity: 0.5,
                        dashType: "dot"
                    }
                });

                segment.renderVisual();
                polyline = segment.visual.children[0];
            }
        });

        test("connects point end to next point start", function() {
            ok(polyline.segments[0].anchor().equals(new geom.Point(0.5, 0.5)));
            ok(polyline.segments[1].anchor().equals(new geom.Point(30.5, 0.5)));
        });

        test("connects point end to next point start (negative values)", function() {
            segment.from.aboveAxis = segment.to.aboveAxis = false;
            segment.renderVisual();
            polyline = segment.visual.children[0];
            ok(polyline.segments[0].anchor().equals(new geom.Point(0.5, 100.5)));
            ok(polyline.segments[1].anchor().equals(new geom.Point(30.5, 100.5)));
        });

        test("renders open polyline", function() {
            ok(!polyline.closed);
        });

        test("sets default animation", function() {
            equal(segment.animation.options.type, "fadeIn");
        });

        test("sets color", function() {
            equal(polyline.options.stroke.color, "blue");
        });

        test("sets width", function() {
            equal(polyline.options.stroke.width, 2);
        });

        test("sets opacity", function() {
            equal(polyline.options.stroke.opacity, 0.5);
        });

        test("sets dashType", function() {
            equal(polyline.options.stroke.dashType, "dot");
        });

        // ------------------------------------------------------------
        module("WaterfallSegment / Horizontal", {
            setup: function() {
                segment = new dataviz.WaterfallSegment({
                    // From point
                    aboveAxis: true,
                    isVertical: false,
                    box: new dataviz.Box2D(0, 0, 100, 10)
                }, {
                    // To point
                    aboveAxis: true,
                    isVertical: false,
                    box: new dataviz.Box2D(0, 20, 100, 30)
                }, {
                    // Series
                });

                segment.renderVisual();
                polyline = segment.visual.children[0];
            }
        });

        test("connects point end to next point start", function() {
            ok(polyline.segments[0].anchor().equals(new dataviz.Point2D(100.5, 0.5)));
            ok(polyline.segments[1].anchor().equals(new dataviz.Point2D(100.5, 30.5)));
        });

        test("connects point end to next point start (negative values)", function() {
            segment.from.aboveAxis = segment.to.aboveAxis = false;
            segment.renderVisual();
            polyline = segment.visual.children[0];
            ok(polyline.segments[0].anchor().equals(new dataviz.Point2D(0.5, 0.5)));
            ok(polyline.segments[1].anchor().equals(new dataviz.Point2D(0.5, 30.5)));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var segment;
        var polyline;

        module("Waterfall / point / custom visual");

        test("Passes runningTotal and total", function() {
            createChart([{
                data: [1, 2],
                visual: function(e) {
                    equal(e.runningTotal, 3);
                    equal(e.total, 3);
                }
            }]);
            var point = chart.points[1];
            point.parent = {
                appendVisual: $.noop
            };
            point.reflow(new dataviz.Box2D(0, 0, 100, 100));
            point.renderVisual();

        });

    })();
})();
