(function() {

    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        TOLERANCE = 1,
        box = new Box2D(0, 0, 800, 600),
        chart;

    function createFunnelChart(options) {
        var plotArea = {
            options: {
                seriesColors: ["red", "green", "blue"],
                legend:{
                    visible:false
                }
            }
        };

        chart = new dataviz.FunnelChart(plotArea, options);
        chart.reflow(box);
    }

    // ------------------------------------------------------------
    module("dynamicSlope false", {
        setup: function() {
            createFunnelChart({
                dynamicHeight:false,
                series: [{
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [707, 200], [93, 200]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [93, 200], [706, 200], [613, 400], [186, 400]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [186,400], [613, 400], [520, 600], [280, 600]
        ], TOLERANCE);
    });


    test("Creates segments for data points", function() {
        equal(chart.points.length, chart.options.series[0].data.length);
    });

    module("null/undefined cases", {
        teardown: destroyChart
    });

    test("does not render segments for null", function() {
            createFunnelChart({
                dynamicHeight: false,
                series: [{
                    data: [{
                        value: null,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.points.length, 2);
    });

    test("does not render segments for undefined", function() {
            createFunnelChart({
                dynamicHeight: false,
                series: [{
                    data: [{
                        value: undefined,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.points.length, 2);
    });

    test("does not render label for undefined", function() {
            createFunnelChart({
                dynamicHeight: false,
                labels: {
                    visible: true
                },
                series: [{
                    data: [{
                        value: undefined,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.labels.length, 2);
    });

    test("does not render label for null", function() {
            createFunnelChart({
                dynamicHeight: false,
                labels: {
                    visible: true
                },
                series: [{
                    data: [{
                        value: null,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.labels.length, 2);
    });

    test("renders segment for 0", function() {
            createFunnelChart({
                dynamicHeight: false,
                series: [{
                    data: [{
                        value: 0,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.points.length, 3);
    });

    test("renders label for 0", function() {
            createFunnelChart({
                dynamicHeight: false,
                labels: {
                    visible: true
                },
                series: [{
                    data: [{
                        value: 0,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });

            equal(chart.labels.length, 3);
    });

    test("renders segment for negative values", function() {
        createFunnelChart({
            dynamicHeight: false,
            series: [{
                data: [{
                    value: -1,
                    category: "A",
                }, {
                    value: 1,
                    category: "B"
                }]
            }]
        });

        equal(chart.points[0].percentage, 0.5);
    });

    module("dynamicSlope false", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:false,
                series: [{
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [753, 100], [46, 100]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [46, 100], [753, 100], [660, 300], [140, 300]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [140,300], [660, 300], [520, 600], [280, 600]
        ], TOLERANCE);
    });

    module("max neckRatio", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:false,
                neckRatio: 1,
                series: [{
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [800, 100], [0, 100]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [0, 100], [800, 100], [800, 300], [0, 300]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [0, 300], [800, 300], [800, 600], [0, 600]
        ], TOLERANCE);
    });

    module("min neckRatio", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:false,
                neckRatio: 0,
                series: [{
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [733, 100], [66, 100]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [66, 100], [733, 100], [600, 300], [200, 300]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [200, 300], [600, 300], [400, 600], [400, 600]
        ], TOLERANCE);
    });

    module("Series setup", {
        setup: function() {
            createFunnelChart({
                series: [{
                    type: "funnel",
                    opacity:0.3,
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 3,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    })

    test("sets point owner", function() {
        ok(chart.points[0].owner === chart);
    });

    test("sets point series", function() {
        equal(chart.points[0].series.type, "funnel");
    });

    test("sets point category", function() {
        equal(chart.points[0].category, "A");
    });

    test("sets point dataItem", function() {
        equal(typeof chart.points[0].dataItem, "object");
    });

    module("Series with empty data", {
        setup: function() {
            createFunnelChart({
                series: [{
                    type: "funnel",
                    data: []
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    })

    test("sets point dataItem", function() {
        ok(true);
    });

    module("Series with empty data", {
        setup: function() {
            createFunnelChart({
                series: [{
                    type: "funnel",
                    dynamicSlope:true,
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    })

    test("sets point dataItem", function() {
        ok(true);
    });

    module("dynamicSlope false with spacing", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:false,
                segmentSpacing:30,
                neckRatio: 0,
                series: [{
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 7,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [760, 54], [40, 54]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [40, 84], [760, 84], [680, 192], [120, 192]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [120, 222], [680, 222], [400, 600], [400, 600]
        ], TOLERANCE);
    });

    module("dynamicSlope false with spacing", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:false,
                segmentSpacing:33,
                neckRatio: 0,
                series: [{
                    segmentSpacing:33,
                    data: [{
                        value: 1,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 7,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [760, 53], [40, 53]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [40, 86], [760, 86], [680, 193], [120, 193]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [120, 226], [680, 226], [400, 600], [400, 600]
        ], TOLERANCE);
    });

    module("dynamicSlope true", {
        setup: function() {
            createFunnelChart({
                dynamicSlope:true,
                series: [{
                    data: [{
                        value: 7,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 7,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [514, 262], [285, 262]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [285, 262], [514, 262], [800, 337], [0, 337]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [0, 337], [800, 337], [800, 600], [0, 600]
        ], TOLERANCE);
    });

    module("dynamicSlope true with spacing", {
        setup: function() {
            createFunnelChart({
                segmentSpacing : 22,
                dynamicSlope:true,
                series: [{
                    data: [{
                        value: 7,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 7,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [0, 0], [800, 0], [514, 243], [285, 243]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [285, 265], [514, 265], [800, 334], [0, 334]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [0, 356], [800, 356], [800, 600], [0, 600]
        ], TOLERANCE);
    });

    module("using label with template", {
        setup: function() {
            createFunnelChart({
                segmentSpacing : 22,
                dynamicSlope:true,
                labels: {
                    visible:true,
                    align: function(context) { return context.index % 2 === 0 ? "left" : "right"; },
                    color:'red',
                    margin: 5,
                    template: "My Template #=value#"
                },
                series: [{
                    data: [{
                        value: 7,
                        category: "A",
                    }, {
                        value: 2,
                        category: "B"
                    }, {
                        value: 7,
                        category: "C"
                    }]
                }]
            });
        },
        teardown: function() {
            destroyChart();
        }
    });

    test("sets template options for the labels", function() {
        ok(chart.labels[0].options.template === "My Template #=value#");
    });

    test("sets margin options for the labels", function() {
        ok(chart.labels[0].options.margin === 5);
    });

    test("sets default options for the labels", function() {
        var padding = chart.labels[0].options.padding;
        ok(padding !== null && padding !== undefined);
        ok($.isEmptyObject(padding));
    });

    test("sets color for the labels", function() {
        var options = chart.labels[0].options;
        ok(options.color === 'red')
    });

    test("First label text position", function() {
        var textBox = chart.labels[0].children[0].box;
        close(textBox.x1,5,TOLERANCE);
        close(textBox.x2,109,TOLERANCE);
        close(textBox.y1,114,TOLERANCE);
        close(textBox.y2,129,TOLERANCE);
    });

    test("Second label text position", function() {
        var textBox = chart.labels[1].children[0].box;
        close(textBox.x1,691,TOLERANCE);
        close(textBox.x2,795,TOLERANCE);
        close(textBox.y1,292,TOLERANCE);
        close(textBox.y2,307,TOLERANCE);
    });

    test("Third label text position", function() {
        var textBox = chart.labels[2].children[0].box;
        close(textBox.x1,5,TOLERANCE);
        close(textBox.x2,109,TOLERANCE);
        close(textBox.y1,470,TOLERANCE);
        close(textBox.y2,485,TOLERANCE);
    });

    test("First label box position", function() {
        var textBox = chart.labels[0].box;
        close(textBox.x1,0,TOLERANCE);
        close(textBox.x2,114,TOLERANCE);
        close(textBox.y1,109,TOLERANCE);
        close(textBox.y2,134,TOLERANCE);
    });

    test("Second label bx position", function() {
        var textBox = chart.labels[1].box;
        close(textBox.x1,686,TOLERANCE);
        close(textBox.x2,800,TOLERANCE);
        close(textBox.y1,287,TOLERANCE);
        close(textBox.y2,312,TOLERANCE);
    });

    test("Third label box position", function() {
        var textBox = chart.labels[2].box;
        close(textBox.x1,0,TOLERANCE);
        close(textBox.x2,114,TOLERANCE);
        close(textBox.y1,465,TOLERANCE);
        close(textBox.y2,490,TOLERANCE);
    });

    test("First segment position", function() {
        arrayClose(mapPoints(chart.points[0].points), [
            [114, 0], [686, 0], [481.7, 243], [318, 243]
        ], TOLERANCE);
    });

    test("Second segment position", function() {
        arrayClose(mapPoints(chart.points[1].points), [
            [318, 265], [481, 265], [686, 334], [114, 334]
        ], TOLERANCE);
    });

    test("Third segment position", function() {
        arrayClose(mapPoints(chart.points[2].points), [
            [114, 356], [686, 356], [686, 600], [114, 600]
        ], TOLERANCE);
    });

    (function() {
        var chart,
            segment,
            segmentElement,
            plotArea;

        function createFunnelChart(options) {
            chart = createChart($.extend({
                series: [{
                    type: "funnel",
                    labels:{
                        visible:true
                    },
                    data: [{ value: 1, category: "A" }]
                }]
            }, options));

            plotArea = chart._plotArea;
            segment = plotArea.charts[0].points[0];
            segmentElement = getChartDomElement(segment);
        }

        function segmentClick(callback) {
            createFunnelChart({
                seriesClick: callback
            });

            clickChart(chart, segmentElement);
        }

        function segmentHover(callback) {
            createFunnelChart({
                seriesHover: callback
            });

            segmentElement.mouseover();
        }

        // ------------------------------------------------------------
        module("Funnel Chart / Events / seriesClick", {
            teardown: destroyChart
        });

        test("fires when clicking segments", 1, function() {
            segmentClick(function() { ok(true); });
        });

        test("fires on subsequent click", 2, function() {
            segmentClick(function() { ok(true); });
            clickChart(chart, segmentElement);
        });

        test("fires when clicking segment labels", 1, function() {
            createFunnelChart({
                seriesClick: function() { ok(true); }
            });
            var label = plotArea.charts[0].labels[0];
            clickChart(chart, getChartDomElement(label));
        });

        test("event arguments contain value", 1, function() {
            segmentClick(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain category", 1, function() {
            segmentClick(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain series", 1, function() {
            segmentClick(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            segmentClick(function(e) {
                equal(e.element[0], getChartDomElement(segment)[0]);
            });
        });

        // ------------------------------------------------------------
        module("Funnel Chart / Events / seriesHover", {
            teardown: destroyChart
        });

        test("fires when hovering segments", 1, function() {
            segmentHover(function() { ok(true); });
        });

        test("fires on tap", 1, function() {
            createFunnelChart({
                seriesHover: function() {
                    ok(true);
                }
            });

            clickChart(chart, segmentElement);
        });

        test("does not fire on subsequent tap", 1, function() {
            createFunnelChart({
                seriesHover: function() {
                    ok(true);
                }
            });

            clickChart(chart, segmentElement);
        });

        test("fires when hovering segment labels", 1, function() {
            createFunnelChart({
                seriesHover: function() { ok(true); }
            });
            var label = plotArea.charts[0].labels[0];
            $(getChartDomElement(label)).mouseover();
        });

        test("event arguments contain value", 1, function() {
            segmentHover(function(e) { equal(e.value, 1); });
        });

        test("event arguments contain category", 1, function() {
            segmentHover(function(e) { equal(e.category, "A"); });
        });

        test("event arguments contain series", 1, function() {
            segmentHover(function(e) {
                deepEqual(e.series, chart.options.series[0]);
            });
        });

        test("event arguments contain jQuery element", 1, function() {
            segmentHover(function(e) {
                equal(e.element[0], getChartDomElement(segment)[0]);
            });
        });

    })();

    (function() {
        var VALUE = 1,
            Point = kendo.geometry.Point,
            draw = kendo.drawing,
            segment, box, root,
            CATEGORY = "A",
            PERCENTAGE = 0.5,
            SERIES_NAME = "series";

        function createFunnelSegment(options, index) {
           segment = new dataviz.FunnelSegment(
                VALUE,
                options, {
                    index: index || 0
                }
            );

            segment.percentage = PERCENTAGE;
            segment.category = CATEGORY;
            segment.series = { name: SERIES_NAME };
            segment.dataItem = { value: VALUE };
            segment.points = [new Point(0, 0), new Point(100, 0), new Point(100, 100), new Point(0, 100)];

            box = new Box2D(0, 0, 100, 100);
            segment.reflow(box);


            root = new dataviz.RootElement();
            root.box = box;
            root.append(segment);
            root.renderVisual();
        }

        module("Funnel Segment / Highlight", {
            setup: function() {
                createFunnelSegment();
            }
        });

        test("highlightVisual returns segment visual path", function() {
            var visual = segment.highlightVisual();

            ok(visual instanceof draw.Path);
            ok(visual === segment.visual.children[0]);
        });

        test("highlightVisualArgs returns an object with the options and the path", function() {
            var result = segment.highlightVisualArgs();
            deepEqual(result.options, segment.options);
            sameLinePath(segment.visual.children[0], result.path);
        });

    (function() {
        var draw = kendo.drawing;

        // ------------------------------------------------------------
        module("Funnel Segment / custom visual");

        test("adds custom visual", function() {
            var visual;
            createFunnelSegment({
                visual: function(e) {
                    visual = new draw.Path();
                    return visual;
                }
            });
            equal(segment.visual.children.length, 1);
            ok(segment.visual.children[0] === visual);
        });

        test("doesn't add visual  if custom visual function returns undefined", function() {
            createFunnelSegment({
                visual: $.noop
            });
            equal(segment.visual.children.length, 0);
        });

        test("passes options to custom visual function", function() {
            createFunnelSegment({
                visual: function(e) {
                   deepEqual(segment.options, e.options);
                }
            });
        });

        test("passes category, dataItem, value, series and percentage to custom visual function", function() {
            createFunnelSegment({
                visual: function(e) {
                   equal(segment.category, CATEGORY);
                   equal(segment.dataItem.value, VALUE);
                   equal(segment.value, VALUE);
                   equal(e.series.name, SERIES_NAME);
                   equal(e.percentage, PERCENTAGE);
                }
            });
        });

        test("passes points to custom visual function", function() {
            createFunnelSegment({
                visual: function(e) {
                   deepEqual(e.points, segment.points);
                }
            });
        });

        test("createVisual creates default visual", function() {
            createFunnelSegment({
                visual: function(e) {
                   ok(e.createVisual() instanceof draw.Path);
                }
            });
        });

    })();

    })();

})();
