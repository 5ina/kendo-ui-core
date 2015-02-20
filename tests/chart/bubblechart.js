(function() {
    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        chartBox = new Box2D(0, 0, 800, 600),
        plotArea,
        bubbleChart,
        firstPoint,
        root,
        TOLERANCE = 1;

    function setupBubbleChart(plotArea, options) {
        bubbleChart = new dataviz.BubbleChart(plotArea, options);

        root = new dataviz.RootElement();
        root.append(bubbleChart);
        root.box = chartBox.clone();
        bubbleChart.reflow(chartBox);
        root.renderVisual();
        firstPoint = bubbleChart.points[0];
    }

    (function() {
        var TOLERANCE = 1;
        var series = {
            data: [{
                x: 1, y: 10, size: 100, category: "a",
                color: "red"
            }, {
                x: 2, y: 2, size: 0, category: "b"
            }, {
                x: 3, y: 3, size: 20, category: "b"
            }],
            type: "bubble",
            minSize: 10,
            maxSize: 110
        };

        function PlotAreaStub() { }

        $.extend(PlotAreaStub.prototype, {
            axisX: {
                getSlot: function(categoryIndex) {
                    return new Box2D(0, 0, categoryIndex + 1, 0);
                }
            },
            axisY: {
                getSlot: function(value) {
                    return new Box2D(0, 1, 0, value);
                },
                options: {}
            },
            options: {}
        });

        // ------------------------------------------------------------
        module("Bubble Chart / Points", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupBubbleChart(plotArea, { series: [ series ] });
            }
        });

        test("Bubbles with negative size are hidden", function() {
            setupBubbleChart(plotArea, { series: [{
                    data: [{x: 1, y: 1, size: -100}],
                    negativeValues: { visible: false },
                    type: "bubble"
                }]
            });

            equal(bubbleChart.points.length, 0);
        });

        test("Maximum bubble diameter is set to maxSize", function() {
            close(firstPoint.options.markers.size, 110, TOLERANCE);
        });

        test("Minimum bubble diameter is set to minSize", function() {
            close(bubbleChart.points[1].options.markers.size, 10, TOLERANCE);
        });

        test("Default maximum bubble diameter is proportional to box size", function() {
            setupBubbleChart(plotArea, { series: [{
                    data: [{x: 1, y: 1, size: 100}],
                    type: "bubble"
                }]
            });

            close(firstPoint.options.markers.size, 120, TOLERANCE);
        });

        test("Default minimum bubble diameter is proportional to box size", function() {
            setupBubbleChart(plotArea, { series: [{
                    data: [{x: 1, y: 1, size: 10}, {x: 1, y: 1, size: 100}],
                    type: "bubble"
                }]
            });

            close(firstPoint.options.markers.size, 40, TOLERANCE);
        });

        test("Default minimum bubble diameter is floored to 10", function() {
            setupBubbleChart(plotArea, { series: [{
                    data: [{x: 1, y: 1, size: 10}, {x: 1, y: 1, size: 100}],
                    type: "bubble"
                }]
            });

            bubbleChart.reflow(new Box2D());
            close(firstPoint.options.markers.size, 10, TOLERANCE);
        });

        test("Bubble diameter is proportional to size value", function() {
            close(bubbleChart.points[2].options.markers.size, 50, TOLERANCE);
        });

        test("zIndex is higher for smaller bubbles", function() {
            ok(bubbleChart.points[1].options.markers.zIndex >
               firstPoint.options.markers.zIndex);
        });

        test("Color is set for bubbles with negative size", function() {
            setupBubbleChart(plotArea, { series: [{
                    data: [{x: 1, y: 1, size: -100}],
                    negativeValues: { visible: true, color: "red" },
                    type: "bubble"
                }]
            });

            equal(firstPoint.color, "red");
        });

        test("Color field is set", function() {
            equal(firstPoint.color, "red");
        });

        test("Color is copied to marker background", function() {
            equal(firstPoint.options.markers.background, "red");
        });

        test("format variable {0} returns x", function() {
            equal(firstPoint.formatValue("{0}"), 1);
        });

        test("format variable {1} returns y", function() {
            equal(firstPoint.formatValue("{1}"), 10);
        });

        test("format variable {2} returns size", function() {
            equal(firstPoint.formatValue("{2}"), 100);
        });

        test("format variable {3} returns category", function() {
            equal(firstPoint.formatValue("{3}"), "a");
        });

        // ------------------------------------------------------------
        module("Bubble Chart / Points / Rendering", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupBubbleChart(plotArea, { series: [ series ] });
            }
        });

        test("createHighlight creates a circle", function() {
            equal(firstPoint.createHighlight().nodeType, "Circle");
        });

        // ------------------------------------------------------------
        module("Bubble Chart / Points / Highlight", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupBubbleChart(plotArea, { series: [ series ] });
            }
        });

        test("createHighlight renders fill based on marker background", function() {
            var highlight = firstPoint.createHighlight();
            equal(highlight.options.fill.color, firstPoint.options.markers.background);
        });

        test("createHighlight creates a circle with 1 border smaller diameter", function() {
            firstPoint.options.highlight.border.width = 2;
            var outline = firstPoint.createHighlight();

            equal(outline.geometry().getRadius(), firstPoint.options.markers.size / 2 - 1);
        });

        test("createHighlight renders default border width", function() {
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.width, 1);
        });

        test("createHighlight renders custom border width", function() {
            firstPoint.options.highlight.border.width = 2;
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.width, 2);
        });

        test("createHighlight renders default border color (computed)", function() {
            firstPoint.options.markers.background = "#ffffff";
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.color, "#cccccc");
        });

        test("createHighlight renders custom border color", function() {
            firstPoint.options.highlight.border.color = "red";
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.color, "red");
        });

        test("createHighlight renders default border opacity", function() {
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.opacity, 1);
        });

        test("createHighlight renders custom border opacity", function() {
            firstPoint.options.highlight.border.opacity = 0.5;
            var outline = firstPoint.createHighlight();

            equal(outline.options.stroke.opacity, 0.5);
        });

        test("highlightVisual returns marker visual", function() {
            var visual = firstPoint.highlightVisual();
            ok(visual instanceof draw.Circle);
            ok(visual === firstPoint.marker.visual);
        });

    })();

    (function() {
        var data = [{
                xValue: 1,
                yValue: 10,
                sizeValue: 100,
                pointColor: "red"
            }, {
                xValue: 2,
                yValue: 20,
                sizeValue: 200,
                pointColor: "blue"
            }],
            points;

        function createBubbleChart(bubbleSeries) {
            var chart = createChart({
                dataSource: {
                    data: data
                },
                series: [kendo.deepExtend({
                    type: "bubble"
                }, bubbleSeries)]
            });

            points = chart._plotArea.charts[0].points;
        }

        // ------------------------------------------------------------
        module("Bubble Chart / Data Binding / Data Source", {
            teardown: function() {
                destroyChart();
            }
        });

        test("binds to 3-element array", function() {
            createBubbleChart({
                data: [[1, 10, 100], [2, 20, 200]]
            });

            deepEqual(points[1].value, { x: 2, y: 20, size: 200 });
        });

        test("binds x, y and size field", function() {
            createBubbleChart({
                xField: "xValue",
                yField: "yValue",
                sizeField: "sizeValue"
            });

            deepEqual(points[1].value, { x: 2, y: 20, size: 200 });
        });

        test("binds color field", function() {
            createBubbleChart({
                xField: "xValue",
                yField: "yValue",
                sizeField: "sizeValue",
                colorField: "pointColor"
            });

            deepEqual(points[1].color, "blue");
        });

        test("binds category field", function() {
            createBubbleChart({
                xField: "xValue",
                yField: "yValue",
                sizeField: "sizeValue",
                categoryField: "pointColor"
            });

            deepEqual(points[1].category, "blue");
        });

        test("binds to object with x, y and size fields", function() {
            createBubbleChart({
                data: [{x: 1, y: 10, size: 100}, {x: 2, y: 20, size: 200}]
            });

            deepEqual(points[1].value, { x: 2, y: 20, size: 200 });
        });

        test("binds color to object field", function() {
            createBubbleChart({
                data: [{ x: 1, y: 10, size: 100, color: "red" }]
            });

            deepEqual(points[0].color, "red");
        });

        test("binds category to object field", function() {
            createBubbleChart({
                data: [{ x: 1, y: 10, size: 100, category: "UK" }]
            });

            deepEqual(points[0].category, "UK");
        });

    })();

    (function() {
        var data = [{
                xValue: 1,
                yValue: 10,
                sizeValue: 100
            }, {
                xValue: 2,
                yValue: 20,
                sizeValue: 200
            }],
            points,
            bubbleChart,
            legend;

        function createBubbleChart(options) {
            chart = createChart(
                kendo.deepExtend({}, {
                    dataSource: {
                        data: data
                    },
                    series: [{
                        type: "bubble",
                        xField: "xValue",
                        yField: "yValue",
                        sizeField: "sizeValue",
                        name: "A",
                        test: "test"
                    }]
                }, options)
            );

            points = chart._plotArea.charts[0].points;
            bubbleChart = chart._plotArea.charts[0];
            legend = chart._model.children[0];
        }

        // ------------------------------------------------------------
        module("Bubble Chart / Configuration", {
            teardown: function() {
                destroyChart();
            }
        });

        test("tooltip options are applied to points", function() {
            createBubbleChart({
                tooltip: {
                    format: "a"
                }
            });

            deepEqual(points[0].options.tooltip.format, "a");
        });

        test("sets legend item name from dataItem", function() {
            createBubbleChart({
                legend: {
                    labels: {
                        template: "#= text #-#= series.test #"
                    }
                }
            });

            equal(legend.options.items[0].text, "A-test");
        });

        test("applies color function", function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    data: [[1, 10, 100]],
                    color: function(bubble) { return "#f00" }
                }]
            });

            equal(points[0].options.color, "#f00");
        });

        test("applies color function for each point", 1, function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    data: [[1, 10, 100]],
                    color: function() { ok(true); }
                }]
            });
        });

        test("color fn argument contains value", 1, function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    data: [[1, 10, 100]],
                    color: function(bubble) { equal(bubble.value.size, 100); }
                }]
            });
        });

        test("color fn argument contains dataItem", 1, function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    data: [[1, 10, 100]],
                    color: function(bubble) {
                        deepEqual(bubble.dataItem, [1, 10, 100]);
                    }
                }]
            });
        });

        test("color fn argument contains series", 1, function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    name: "series 1",
                    data: [[1, 10, 100]],
                    color: function(bubble) { equal(bubble.series.name, "series 1"); }
                }]
            });
        });

        test("evaluated color is set on point", function() {
            createBubbleChart({
                dataSource: null,
                series: [{
                    type: "bubble",
                    name: "series 1",
                    data: [[1, 10, 100]],
                    color: function() { return "red"; }
                }]
            });

            equal(points[0].color, "red");
        });

        test("negative values are hidden by default", function() {
            createBubbleChart({
                series: [{
                    type: "bubble",
                    name: "series 1",
                    data: [[1, 10, -100]]
                }]
            });

            equal(points.length, 0);
        });

        test("color function should be with bigger priority negative values color", function() {
            createBubbleChart({
                series: [{
                    type: "bubble",
                    name: "series 1",
                    data: [[1, 10, -100]],
                    color: function() { return "red" },
                    negativeValues: {
                        color: "blue",
                        visible: true
                    }
                }]
            });

            equal(points[0].color, "red");
        });

        test("point with size null should be hidden", function() {
            createBubbleChart({
                series: [{
                    type: "bubble",
                    name: "series 1",
                    data: [[1, 10, null]]
                }]
            });

            equal(points.length, 0);
        });

    })();

    (function() {
        var note;

        module("Bubble Chart / Note", {
            setup: function() {
                var chart = createChart({
                    series: [{
                        name: "Value",
                        type: "bubble",
                        data: [{ x: 1, y: 10, size: 100, noteText: "A" }]
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

        module("Bubble Chart / Note Template", {
            teardown: function() {
                destroyChart();
            }
        });

        function createNote(options) {
            var chart = createChart({
                series: [{
                    name: "Value",
                    type: "bubble",
                    data: [{ x: 1, y: 10, size: 100, noteText: "A", test: "test" }],
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
                    template: "x: #= value.x # y: #= value.y # size: #= value.size #"
                }
            });

            equal(note.label.content, "x: 1 y: 10 size: 100");
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

        module("Bubble Chart / Values exceeding axis min or max options ", {});

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
                },
                options: {}
            };

            setupBubbleChart(plotArea, { series: [ {data: [{x: 1, y: 1, size: 100}], type: "bubble"} ] });
        });
    })();
})();
