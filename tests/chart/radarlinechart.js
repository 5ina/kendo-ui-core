(function() {
    var dataviz = kendo.dataviz,
        Point2D = dataviz.Point2D,
        Box2D = dataviz.Box2D,
        Ring = dataviz.Ring,
        TOLERANCE = 1,
        chartBox = new Box2D(0, 0, 800, 600),
        plotArea,
        chart,
        pointsXY;

    function getSegmentAt(chart, idx) {
        return chart._segments[idx || 0].visual;
    }

    function createChart(series, options) {
        plotArea = new dataviz.RadarPlotArea(series,
            kendo.deepExtend({
                categoryAxis: {
                    majorGridLines: { visible: false },
                    visible: false
                },
                valueAxis: {
                    majorGridLines: { visible: false },
                    visible: false,
                    startValue: function() {
                        return 0;
                    }
                },
                plotArea: {
                    padding: 35
                }
            }, options)
        );

        chart = plotArea.charts[0];

        plotArea.reflow(chartBox);
        plotArea.renderVisual();
        pointsXY = mapSegments(getSegmentAt(chart).segments);
    }

    // ------------------------------------------------------------
    module("Radar Line Chart / Positive values", {
        setup: function() {
            createChart([{
                type: "radarLine",
                data: [1, 2, 3]
            }]);
        }
    });

    test("rendered on polar axis", function() {
        arrayClose(pointsXY, [
            [400, 212], [553, 388], [171, 433]
        ], TOLERANCE);
    });

    test("line is closed when all points are non-null", function() {
        ok(getSegmentAt(chart).options.closed);
    });

    test("line is not closed if any of the points is null", function() {
        createChart([{
            type: "radarLine",
            data: [1, 2, null]
        }]);

        ok(!getSegmentAt(chart).options.closed);
    });

    // ------------------------------------------------------------

    (function() {
        module("RadarLine Chart / Values exceeding axis min or max options ", {});

        test("values are limited", 2, function() {
            var plotArea = {
                categoryAxis:  {
                    getSlot: function() {
                         return new Ring(Point2D());
                    },
                    lineBox: function() {
                        return new Box2D(0,2,2,2);
                    },
                    options: {
                        categories: ["A", "B"]
                    }
                },
                valueAxis: {
                    getSlot: function(a,b, limit) {
                        ok(limit);
                        return Box2D();
                    },
                    options: {
                        axisCrossingValue: 0
                    },
                    startValue: function() {
                        return 0;
                    }
                },
                seriesCategoryAxis: function() {
                    return plotArea.categoryAxis;
                }
            };

            var chart = new dataviz.RadarLineChart(plotArea, {series: [{
                type: "radaLine",
                data: [1,2]
            }]});

            chart.reflow();
        });
    })();
})();
