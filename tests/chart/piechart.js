(function() {

    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        geom = kendo.geometry,
        deepExtend = kendo.deepExtend,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        plotArea,
        pieChart,
        firstSegment,
        TOLERANCE = 0.1,
        root,
        view;

    function setupPieChart(plotArea, options) {
        view = new ViewStub();

        pieChart = new dataviz.PieChart(plotArea, $.extend({}, { padding: 60 }, options));

        root = new dataviz.RootElement();
        root.append(pieChart);

        root.box = chartBox;
        pieChart.reflow(chartBox);

        root.renderVisual();

        firstSegment = pieChart.points[0];
    }

    function getTextBoxes() {
        return $.map(pieChart.points, function(item) {
            return item.label.visual;
        });
    }

    function getTexts() {
        return $.map(getTextBoxes(), function(item) {
            return kendo.util.last(item.children);
        });
    }

    (function() {
        var values = { type: "pie", data: [1, 2] },
            dataValues = {
                type: "pie",
                data: [{
                   value: 1,
                   category: "A",
                   color: "red",
                   explode: true
               }, {
                   value: 2,
                   category: "B"
               }]
            };

        function PlotAreaStub() { }

        $.extend(PlotAreaStub.prototype, {
            options: { }
        });

        // ------------------------------------------------------------
        module("Pie Chart / Array with values", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, { series: [ values ] });
            }
        });

        test("creates points for pie chart data points", function() {
            equal(pieChart.points.length, values.data.length);
        });

        test("points have set angle", function() {
            $.each(pieChart.points, function() {
                ok(this.sector.angle);
            });
        });

        test("points have set startAngle", function() {
            $.each(pieChart.points, function() {
                ok(this.sector.angle);
            });
        });

        test("points have set owner", function() {
            ok(firstSegment.owner === pieChart);
        });

        test("sets segment category", function() {
            equal(firstSegment.category, "");
        });

        test("sets segment series", function() {
            ok(firstSegment.series === values);
        });

        test("sets segment series index", function() {
            ok(firstSegment.seriesIx === 0);
        });

        test("sets segment dataItem", function() {
            equal(typeof firstSegment.dataItem, "number");
        });

        // ------------------------------------------------------------
        module("Pie Chart / Array with items", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, { series: [ dataValues ] });
            }
        });

        test("sets segment category", function() {
            equal(firstSegment.category, "A");
        });

        test("points have set owner", function() {
            ok(firstSegment.owner === pieChart);
        });

        test("sets segment series", function() {
            ok(firstSegment.series === dataValues);
        });

        test("sets segment series index", function() {
            ok(firstSegment.seriesIx === 0);
        });

        test("sets segment dataItem", function() {
            equal(typeof firstSegment.dataItem, "object");
        });

        test("sets segment percentage", function() {
            close(firstSegment.percentage, 0.333, TOLERANCE);
        });

        test("sets segment percentage to zero if total is zero", function() {
            plotArea = new PlotAreaStub();
            setupPieChart(plotArea, { series: [{
                type: "pie",
                data: [{
                   value: 0
                }]
            }] });
            equal(firstSegment.percentage, 0);
        });

        test("sets segment explode", function() {
            ok(firstSegment.explode == true);
        });

        test("sets segment different center if segment have explode sets to true", function() {
            ok(firstSegment.sector.c != pieChart.points[1].sector.c);
        });

        // ------------------------------------------------------------
        module("Pie Chart / Legend items", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, { series: [ { type: "pie", data: dataValues.data } ] });
            }
        });

        test("return legend item for each segment", function() {
            equal(pieChart.legendItems.length, 2);
        });

        test("set legend item point index", function() {
            equal(pieChart.legendItems[0].pointIndex, 0);
            equal(pieChart.legendItems[1].pointIndex, 1);
        });

        test("set legend item name to category", function() {
            equal(pieChart.legendItems[0].text, "A");
        });

        test("set legend item color", function() {
            equal(pieChart.legendItems[0].markerColor, "red");
        });

        test("skip points with visibleInLegend set to false", function() {
            var data = [{
                    value: 1,
                    category: "A"
                }, {
                    value: 2,
                    category: "B",
                    visibleInLegend: false
                }];

            setupPieChart(plotArea, { series: [ { type: "pie", data: data } ] });
            equal(pieChart.legendItems.length, 1);
        });

        test("skip points with null or empty text", function() {
            var data = [{
                    value: 1,
                    category: ""
                }, {
                    value: 2,
                    category: null
                }, {
                    value: 3,
                    category: "foo"
                }];

            setupPieChart(plotArea, { series: [ { type: "pie", data: data } ] });
            equal(pieChart.legendItems.length, 1);
        });

        test("set legend item name with template", function() {
            setupPieChart(plotArea, {
                series: [ { type: "pie", data: dataValues.data, test: "test" } ],
                legend: {
                    labels: {
                        template: "#= series.test #"
                    }
                }
            });

            equal(pieChart.legendItems[0].text, "test");
            setupPieChart(plotArea, { series: [ {
                type: "pie",
                data: dataValues.data,
                legend: {
                    labels: {
                        template: "#= text #"
                    }
                }
            } ] });
            equal(pieChart.legendItems[0].text, "A");
        });

        // ------------------------------------------------------------

        function setupInactiveItemsPieChart(options) {
            setupPieChart(plotArea, deepExtend({ series: [ { type: "pie", data: [{
                    value: 1,
                    category: "A",
                    color: "red"
                }, {
                    value: 2,
                    category: "B",
                    color: "blue",
                    visible: false
                }] } ],
                legend: {
                    inactiveItems: {
                        labels: {
                            color: "foo",
                            font: "bar"
                        },
                        markers: {
                            color: "green"
                        }
                    }
                }
            }, options));
        }

        module("Pie Chart / Inactive Legend items", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupInactiveItemsPieChart();
            }
        });

        test("return legend item for each segment", function() {
            equal(pieChart.legendItems.length, 2);
        });

        test("set legend item name to category", function() {
            equal(pieChart.legendItems[0].text, "A");
            equal(pieChart.legendItems[1].text, "B");
        });

        test("set legend item color", function() {
            equal(pieChart.legendItems[0].markerColor, "red");
            equal(pieChart.legendItems[1].markerColor, "green");
        });

        test("set legend item labels", function() {
            var inactiveLabels = pieChart.legendItems[1].labels;
            equal(inactiveLabels.color, "foo");
            equal(inactiveLabels.font, "bar");
        });

        test("set legend item text with template", function() {
            setupInactiveItemsPieChart({
                legend: {
                    inactiveItems: {
                        labels: {
                            template: "baz"
                        }
                    }
                }
            });
            equal(pieChart.legendItems[1].text, "baz");
        });

        test("set inactive legend item text with labels template if inactive items template is not specified", function() {
            setupInactiveItemsPieChart({
                legend: {
                    labels: {
                        template: "baz"
                    }
                }
            });
            equal(pieChart.legendItems[1].text, "baz");
        });

    })();


    (function() {
        var data = [{
                value: 10,
                explode: true,
                color: "red",
                category: "A",
                test: "test"
            }, {
                value: 50,
                explode: false,
                color: "red",
                category: "B"
            }],
            chart,
            pieChart,
            firstSegment;

        function createPieChart(options) {
            chart = createChart(deepExtend({
                dataSource: {
                    data: data
                },
                series: [{
                    type: "pie",
                    field: "value",
                    categoryField: "category",
                    colorField: "color",
                    explodeField: "explode"
                }]
            }, options));

            pieChart = chart._plotArea.charts[0];
            firstSegment = pieChart.points[0];
        }

        // ------------------------------------------------------------
        module("Pie Chart / Data Source", {
            setup: function() {
                createPieChart();
            },
            teardown: destroyChart
        });

        test("sets segment angle based on value", function() {
            equal(firstSegment.sector.angle, 60);
        });

        test("sets segment angle for negative values", function() {
            createPieChart({
                dataSource: {
                    data: [{
                        value: -10
                    }, {
                        value: 10
                    }]
                }
            });

            equal(firstSegment.sector.angle, 180);
        });

        test("sets segment category from dataItem", function() {
            equal(firstSegment.category, "A");
        });

        test("sets segment color from dataItem", function() {
            equal(firstSegment.options.color, "red");
        });

        test("sets segment explode from dataItem", function() {
            ok(firstSegment.explode == true);
        });

        test("sets legend item name from dataItem", function() {
            chart = createChart({
                dataSource: {
                    data: [{
                        value: 10,
                        category: "A",
                        test: "test"
                    }]
                },
                series: [{
                    type: "pie",
                    field: "value",
                    categoryField: "category"
                }],
                legend: {
                    labels: {
                        template: "#= dataItem.test #"
                    }
                }
            });

            equal(chart._plotArea.charts[0].legendItems[0].text, "test");
        });

    })();


    (function() {
        var point,
            box,
            label,
            root,
            sector,
            VALUE = 1,
            CATEGORY = "A",
            segment,
            view,
            SERIES_NAME = "series";

        function createSegment(options) {
            segment = new dataviz.PieSegment(
                VALUE,
                new dataviz.Sector(new dataviz.Point2D(0,0), 100, 90, 100),
                options
            );

            segment.dataItem = { value: VALUE };

            box = new Box2D(0, 0, 100, 100);
            segment.reflow(box);

            root = new dataviz.RootElement();
            root.box = box;
            root.append(segment);
            root.renderVisual();
            sector = segment.visual.children[0];
        }

        // ------------------------------------------------------------
        module("Pie Segment", {
            setup: function() {
                createSegment();
            }
        });

        test("fills target box", function() {
            sameBox(segment.box, box);
        });

        test("sets border color", function() {
            createSegment({ border: { color: "red" } });
            equal(sector.options.stroke.color, "red");
        });

        test("sets pie border width", function() {
            createSegment({ border: { width: 4 } });
            equal(sector.options.stroke.width, 4);
        });

        test("sets pie border opacity", function() {
            createSegment({ border: { width: 4, opacity: 0.5 } });
            equal(sector.options.stroke.opacity, 0.5);
        });

        test("tooltipAnchor is set distance from segment", function() {
            var anchor = segment.tooltipAnchor(10, 10);
            arrayClose([Math.round(anchor.x), Math.round(anchor.y)], [80, -77], TOLERANCE);
        });

        test("renders overlay with same path", function() {
            closePaths(sector, segment.visual.children[1]);
        });

        test("does not render overlay when no overlay is defined", function() {
            createSegment({ overlay: null });
            equal(segment.visual.children.length, 1);
        });

        // ------------------------------------------------------------
        module("Pie Segment / Highlight", {
            setup: function() {
                createSegment();
            }
        });

        test("createHighlight renders same path", function() {
            closePaths(sector, segment.createHighlight());
        });

        test("highlightOverlay renders default border width", function() {
            var highlight = segment.createHighlight();

            equal(highlight.options.stroke.width, 1);
        });

        test("highlightOverlay renders custom border width", function() {
            segment.options.highlight.border.width = 2;
            var highlight = segment.createHighlight();

            equal(highlight.options.stroke.width, 2);
        });

        test("highlightOverlay renders custom highlight color", function() {
            segment.options.highlight.color = "red";
            var highlight = segment.createHighlight();

            equal(highlight.options.fill.color, "red");
        });

        test("highlightOverlay renders custom border color", function() {
            segment.options.highlight.border.color = "red";
            var highlight = segment.createHighlight();

            equal(highlight.options.stroke.color, "red");
        });

        test("highlightOverlay renders custom border opacity", function() {
            segment.options.highlight.border.opacity = 0.5;
            var highlight = segment.createHighlight();

            equal(highlight.options.stroke.opacity, 0.5);
        });

        test("highlightVisual returns visual", function() {
            var visual = segment.highlightVisual();

            ok(visual instanceof draw.Group);
            ok(visual === segment.visual);
        });

        test("highlightVisualArgs returns an object with the options, the visual and the sector options", function() {
            var result = segment.highlightVisualArgs();
            var sector = segment.sector;
            deepEqual(result.options, segment.options);
            ok(segment.visual === result.visual);
            equal(result.radius, sector.r);
            equal(result.innerRadius, sector.ir);
            ok(result.center instanceof geom.Point);
            equal(result.center.x, sector.c.x);
            equal(result.center.y, sector.c.y);
            equal(result.startAngle, sector.startAngle);
            equal(result.endAngle, sector.angle + sector.startAngle);
        });

    })();

    (function() {
        var chart,
            model,
            title,
            legend,
            plotArea
            MARGIN = 10;

        function createPieChart(series) {
            chart = createChart({
                title: {
                    text: "Chart Title"
                },
                series: series,
                chartArea: {
                    margin: 0
                }
            });

            model = chart._model;
            title = model.children[0];
            legend = model.children[1];
            plotArea = model.children[2];
        }

        module("Pie Chart / Model", {
            setup: function() {
                createPieChart([{
                    name: "Value",
                    type: "pie",
                    data: [{
                        value: 100,
                        category: "Value A"
                    }, {
                        value: 200,
                        category: "Value B"
                    }, {
                        value: 300,
                        category: "Value C"
                    }]
                }]);
            },
            teardown: destroyChart
        });

        test("model is a RootElement", function() {
            ok(model instanceof dataviz.RootElement);
        });

        test("title is created", function() {
            ok(title instanceof dataviz.Title);
        });

        test("title text is set", function() {
            equal(title.options.text, "Chart Title");
        });

        test("title box is positioned at top", function() {
            equal(title.box.y1, 0);
        });

        test("legend is created", function() {
            ok(legend instanceof dataviz.Legend);
        });

        test("legend series are populated", function() {
            equal(legend.options.items[0].text, "Value A");
        });

        test("points can be removed with visible false", function() {
            createPieChart([{
                type: "pie",
                data: [{
                    value: 100,
                    category: "Value A"
                }, {
                    value: 200,
                    category: "Value B",
                    visible: false
                }, {
                    value: 300,
                    category: "Value C",
                    visible: false
                }]
            }]);

            equal(chart._plotArea.charts[0].points.length, 1);
        });

        test("points can be excluded from legend", function() {
            createPieChart([{
                name: "Value",
                type: "pie",
                data: [{
                    value: 100,
                    category: "Value A",
                    visibleInLegend: false
                }]
            }]);

            equal(legend.options.items.length, 0);
        });

        test("legend is positioned at right", function() {
            equal(legend.box.x1,
                model.box.width() - legend.box.width());
        });

        test("legend is positioned at vertical center", function() {
            var titleHeight = title.box.height(),
                vCenter = titleHeight +
                          ((model.box.height() - titleHeight - legend.box.height()) / 2);
            equal(legend.box.y1, vCenter);
        });

        test("plotArea is created", function() {
            ok(plotArea instanceof dataviz.PiePlotArea);
        });

    })();


    (function() {
        var PADDING = 5,
            MARGIN = 5,
            START_ANGLE = 20,
            pieSegment;

        function PlotAreaStub() { }

        $.extend(PlotAreaStub.prototype, {
            options: { }
        });

        function createPieChart(seriesOptions, options) {
            plotArea = new PlotAreaStub();
            setupPieChart(plotArea, deepExtend({
                series: [
                    deepExtend({
                        data: [{ value: 1, explode: true }]
                    }, seriesOptions)
                ],
                padding: PADDING,
                startAngle: START_ANGLE,
                connectors: { width: 2, color: "blue", padding: 4 }
            }, options));
            pieSegment = firstSegment;
        }

        // ------------------------------------------------------------
        module("Pie Chart / Configuration", {
            setup: function() {
                createPieChart();
            }
        });

        test("sets padding to the pie chart", function() {
            equal(pieChart.options.padding, PADDING);
        });

        test("sets startAngle to the pie chart", function() {
            equal(pieChart.options.startAngle, START_ANGLE);
        });

        test("sets points if points are more then 1", function() {
            equal(pieSegment.explode, false);
        });

        test("sets connectors settings to the pie labels", function() {
            equal(pieChart.options.connectors.width, 2);
            equal(pieChart.options.connectors.color, "blue");
            equal(pieChart.options.connectors.padding, 4);
        });

        test("sets default radius to 5 pixels", function() {
            createPieChart({}, { padding: 500 });
            equal(pieSegment.sector.r, 5);
        });

        test("applies color function", function() {
            createPieChart({
                color: function(p) { return "#f00" }
            });

            equal(pieSegment.options.color, "#f00");
        });

        test("applies color function for each point", 2, function() {
            createPieChart({
                data: [1, 2],
                color: function() { ok(true); }
            });
        });

        test("color fn argument contains value", 1, function() {
            createPieChart({
                color: function(p) { equal(p.value, 1); }
            });
        });

        test("color fn argument contains percentage", 1, function() {
            createPieChart({
                color: function(p) { equal(p.percentage, 1); }
            });
        });

        test("color fn argument contains dataItem", 1, function() {
            createPieChart({
                color: function(p) {
                    deepEqual(p.dataItem, {
                        "explode": true,
                        "value": 1
                    });
                }
            });
        });

        test("color fn argument contains series", 1, function() {
            createPieChart({
                name: "pieSeries",
                color: function(p) { equal(p.series.name, "pieSeries"); }
            });
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels", {
            setup: function() {
                plotArea = new PlotAreaStub();
            }
        });

        test("applies full label format", function() {
            setupPieChart(plotArea, {
                series: [{
                    data: [1, 2],
                    labels: { visible: true, format: "{0:C}" }
                }]
            });

            equalTexts(getTexts(), ["$1.00", "$2.00"]);
        });

        test("applies simple label format", function() {
            setupPieChart(plotArea, {
                series: [{
                    data: [1, 2],
                    labels: { visible: true, format: "C" }
                }]
            });

            equalTexts(getTexts(), ["$1.00", "$2.00"]);
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Configuration", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ { data: [1, 2],
                        labels: {
                            visible: false,
                            color: "labels-color",
                            background: "labels-background",
                            border: {
                                color: "labels-border-color",
                                width: 2,
                                dashType: "dot"
                            },
                            padding: PADDING,
                            margin: MARGIN,
                            distance: 20,
                            font: "labels-font",
                            position: "center"
                        }
                    } ]
                });
                pieSegment = firstSegment;
            }
        });

        test("applies visible to data labels", function() {
            equal(pieSegment.options.labels.visible, false);
        });

        test("applies color to data labels", function() {
            equal(pieSegment.options.labels.color, "labels-color");
        });

        test("applies background to data labels", function() {
            equal(pieSegment.options.labels.background, "labels-background");
        });

        test("applies border color to data labels", function() {
            equal(pieSegment.options.labels.border.color, "labels-border-color");
        });

        test("applies border width to data labels", function() {
            equal(pieSegment.options.labels.border.width, 2);
        });

        test("applies padding to data labels", function() {
            equal(pieSegment.options.labels.padding, PADDING);
        });

        test("applies margin to data labels", function() {
            equal(pieSegment.options.labels.margin, MARGIN);
        });

        test("applies margin to data labels", function() {
            equal(pieSegment.options.labels.border.dashType, "dot");
        });

        test("applies distance to data labels", function() {
            equal(pieSegment.options.labels.distance, 20);
        });

        test("applies font to data labels", function() {
            equal(pieSegment.options.labels.font, "labels-font");
        });

        test("applies font to data labels", function() {
            equal(pieSegment.options.labels.position, "center");
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Connectors (1)", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ {
                        data: [ 1, 2, 3, 4, 4, 3, 2, 1 ],
                        labels: {
                            visible: true,
                            distance: 20
                        }
                    } ]
                });
            }
        });

        test("start point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[0].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 438.17, 59.004 ], [ 543.42, 102.6 ],
                           [ 640.996, 261.83 ], [ 543.42, 497.4 ],
                           [ 256.58, 497.4 ], [ 159.004, 261.83 ],
                           [ 256.58, 102.6 ], [ 361.83, 59.004 ] ],
                       TOLERANCE);
        });

        test("middle point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[1].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 440.467, 44.5 ], [ 552.211, 90.5 ],
                           [ 649.393, 260.5 ], [ 553.196, 511.5 ],
                           [ 246.804, 511.5 ], [ 150.607, 260.5 ],
                           [ 247.789, 90.5 ], [ 359.533, 44.5 ] ],
                       TOLERANCE);
        });

        test("end point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[2].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 477.185, 44.5 ], [ 560.921, 90.5 ],
                           [ 654.145, 260.5 ], [ 557.196, 511.5 ],
                           [ 242.804, 511.5 ], [ 145.855, 260.5 ],
                           [ 239.079, 90.5 ], [ 322.815, 44.5 ] ],
                       TOLERANCE);
        });

        test("middle point Y and end point Y should be equal", function() {
            $.each(pieChart._connectorLines, function() {
                if (this.segments.length > 3) {
                    equal(this.segments[2].anchor().y, this.segments[3].anchor().y);
                } else {
                    equal(this.segments[1].anchor().y, this.segments[2].anchor().y);
                }
            });
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Connectors (2)", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ {
                        data: [ 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1 ],
                        labels: {
                            visible: true,
                            distance: 20
                        }
                    } ]
                });
            }
        });

        test("start point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[0].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 418.234, 56.682 ], [ 471.92, 66.84 ],
                           [ 552.132, 109.233 ], [ 627.133, 210.857 ],
                           [ 633.16, 371.92 ], [ 505.868, 519.836 ],
                           [ 294.132, 519.836 ], [ 166.84, 371.92 ],
                           [ 172.867, 210.857 ], [ 247.868, 109.233 ],
                           [ 328.08, 66.84 ], [ 381.766, 56.682 ] ],
                       TOLERANCE);
        });

        test("second point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[1].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 419.746, 36.5 ], [ 476.343, 52.5 ],
                           [ 561.489, 97.5 ], [ 637.365, 205.5 ],
                           [ 642.4, 377.5 ], [ 513.411, 535.5 ],
                           [ 286.589, 535.5 ], [ 157.6, 377.5 ],
                           [ 162.635, 205.5 ], [ 238.511, 97.5 ],
                           [ 323.657, 52.5 ], [ 380.254, 36.5 ] ],
                       TOLERANCE);
        });

        test("end point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[2].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 446.744, 36.5 ], [ 498.367, 52.5 ],
                           [ 569.101, 97.5 ], [ 641.365, 205.5 ],
                           [ 646.4, 377.5 ], [ 520.964, 535.5 ],
                           [ 279.036, 535.5 ], [ 153.6, 377.5 ],
                           [ 158.635, 205.5 ], [ 230.899, 97.5 ],
                           [ 301.633, 52.5 ], [ 353.256, 36.5 ] ],
                       TOLERANCE);
        });

        test("middle point Y and end point Y should be equal", function() {
            $.each(pieChart._connectorLines, function() {
                if (this.segments.length > 3) {
                    equal(this.segments[2].anchor().y, this.segments[3].anchor().y);
                } else {
                    equal(this.segments[1].anchor().y, this.segments[2].anchor().y);
                }
            });
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Connectors / Stress test case 1", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ {
                        data: [ 40, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 140 ],
                        labels: {
                            visible: true,
                            distance: 20
                        }
                    } ]
                });
            }
        });

        test("start point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[0].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 544.67, 103.514 ], [ 634.116, 231.257 ],
                           [ 636.179, 238.72 ], [ 638.005, 246.244 ],
                           [ 639.591, 253.823 ], [ 640.935, 261.448 ],
                           [ 642.037, 269.111 ], [ 642.895, 276.806 ],
                           [ 643.509, 284.525 ], [ 643.877, 292.258 ],
                           [ 644, 300 ], [ 643.877, 307.742 ],
                           [ 643.509, 315.475 ], [ 642.895, 323.194 ],
                           [ 642.037, 330.889 ], [ 640.935, 338.552 ],
                           [ 639.591, 346.177 ], [ 638.005, 353.756 ],
                           [ 636.179, 361.28 ], [ 205.834, 447.769 ] ],
                       TOLERANCE);
        });

        test("second point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[1].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 553.516, 91.5 ], [ 613.594, 155.5 ],
                           [ 622.651, 171.5 ], [ 630.294, 187.5 ],
                           [ 636.655, 203.5 ], [ 641.832, 219.5 ],
                           [ 645.898, 235.5 ], [ 648.905, 251.5 ],
                           [ 650.89, 267.5 ], [ 651.877, 283.5 ],
                           [ 651.877, 299.5 ], [ 651.877, 315.5 ],
                           [ 650.89, 331.5 ], [ 648.905, 347.5 ],
                           [ 645.898, 363.5 ], [ 641.832, 379.5 ],
                           [ 636.655, 395.5 ], [ 630.294, 411.5 ],
                           [ 622.651, 427.5 ], [ 196.342, 458.5 ] ],
                       TOLERANCE);
        });

        test("end point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[2].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 562.132, 91.5 ], [ 617.594, 155.5 ],
                           [ 626.651, 171.5 ], [ 634.294, 187.5 ],
                           [ 640.655, 203.5 ], [ 645.832, 219.5 ],
                           [ 649.898, 235.5 ], [ 652.905, 251.5 ],
                           [ 654.89, 267.5 ], [ 655.877, 283.5 ],
                           [ 655.877, 299.5 ], [ 655.877, 315.5 ],
                           [ 654.89, 331.5 ], [ 652.905, 347.5 ],
                           [ 649.898, 363.5 ], [ 645.832, 379.5 ],
                           [ 640.655, 395.5 ], [ 634.294, 411.5 ],
                           [ 626.651, 427.5 ], [ 192.342, 458.5 ] ],
                       TOLERANCE);
        });

        test("middle point Y and end point Y should be equal", function() {
            $.each(pieChart._connectorLines, function() {
                if (this.segments.length > 3) {
                    equal(this.segments[2].anchor().y, this.segments[3].anchor().y);
                } else {
                    equal(this.segments[1].anchor().y, this.segments[2].anchor().y);
                }
            });
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Connectors / Stress test case 2", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ {
                        data: [ 70, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 40, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 20 ],
                        labels: {
                            visible: true,
                            distance: 20
                        }
                    } ]
                });
            }
        });

        test("start point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[0].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 622.251, 199.299 ], [ 580.792, 463.86 ],
                           [ 575.334, 469.688 ], [ 569.688, 475.334 ],
                           [ 563.86, 480.792 ], [ 557.857, 486.057 ],
                           [ 551.685, 491.122 ], [ 545.351, 495.983 ],
                           [ 538.86, 500.633 ], [ 532.222, 505.069 ],
                           [ 525.441, 509.286 ], [ 368.152, 541.913 ],
                           [ 158.087, 331.848 ], [ 190.714, 174.559 ],
                           [ 194.931, 167.778 ], [ 199.367, 161.14 ],
                           [ 204.017, 154.649 ], [ 208.878, 148.315 ],
                           [ 213.943, 142.143 ], [ 219.208, 136.14 ],
                           [ 224.666, 130.312 ], [ 230.312, 124.666 ],
                           [ 236.14, 119.208 ], [ 242.143, 113.943 ],
                           [ 248.315, 108.878 ], [ 321.569, 68.949 ] ],
                       TOLERANCE);
        });

        test("second point", function() {
            var points = [];
            $.each(pieChart._connectorLines, function() {
                var point = this.segments[1].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 632.824, 193.5 ], [ 588.792, 463.86 ],
                           [ 583.334, 469.688 ], [ 577.688, 475.334 ],
                           [ 571.86, 480.792 ], [ 565.857, 486.057 ],
                           [ 559.685, 491.122 ], [ 551.668, 504.5 ],
                           [ 541.101, 520.5 ], [ 515.122, 536.5 ],
                           [ 479.034, 552.5 ], [ 366.495, 554.5 ],
                           [ 149.512, 335.5 ], [ 182.714, 174.559 ],
                           [ 186.931, 167.778 ], [ 191.367, 161.14 ],
                           [ 196.017, 154.649 ], [ 200.878, 148.315 ],
                           [ 205.943, 142.143 ], [ 211.882, 129.5 ],
                           [ 218.485, 113.5 ], [ 234.899, 97.5 ],
                           [ 254.703, 81.5 ], [ 279.454, 65.5 ],
                           [ 312.942, 49.5 ], [ 375.813, 33.5 ] ],
                       TOLERANCE);
        });

        test("end point", function() {
            var points = [];

            $.each(pieChart._connectorLines, function() {
                var point = this.segments[2].anchor();
                points.push([ point.x, point.y ]);
            });

            arrayClose(points, [ [ 636.824, 193.5 ], [ 631.581, 408.5 ],
                           [ 624.187, 424.5 ], [ 615.408, 440.5 ],
                           [ 605.07, 456.5 ], [ 592.935, 472.5 ],
                           [ 578.652, 488.5 ], [ 565.679, 504.5 ],
                           [ 545.101, 520.5 ], [ 519.122, 536.5 ],
                           [ 483.034, 552.5 ], [ 322.815, 554.5 ],
                           [ 145.512, 335.5 ], [ 156.516, 225.5 ],
                           [ 161.269, 209.5 ], [ 167.176, 193.5 ],
                           [ 174.325, 177.5 ], [ 182.833, 161.5 ],
                           [ 192.863, 145.5 ], [ 200.638, 129.5 ],
                           [ 214.485, 113.5 ], [ 230.899, 97.5 ],
                           [ 250.703, 81.5 ], [ 275.454, 65.5 ],
                           [ 308.942, 49.5 ], [ 371.813, 33.5 ] ],
                       TOLERANCE);
        });

        test("middle point Y and end point Y should be equal", function() {
            $.each(pieChart._connectorLines, function() {
                if (this.segments.length > 3) {
                    equal(this.segments[2].anchor().y, this.segments[3].anchor().y);
                } else {
                    equal(this.segments[1].anchor().y, this.segments[2].anchor().y);
                }
            });
        });

        // ------------------------------------------------------------
        module("Pie Chart / Labels / Positions", {
            setup: function() {
                plotArea = new PlotAreaStub();
                setupPieChart(plotArea, {
                    series: [ {
                        data: [ 40, 1, 140 ],
                        labels: {
                            visible: true
                        }
                    } ]
                });
            }
        });

        test("center", function() {
            plotArea = new PlotAreaStub();
            setupPieChart(plotArea, {
                series: [ {
                    data: [ 40, 1, 140 ],
                    labels: {
                        visible: true,
                        position: "center"
                    }
                } ]
            });

            closeTextPosition(false, getTexts(), [
                [ 473.898, 193.63 ],
                [ 522.264, 270.99 ],
                [ 304.407, 388.934 ] ], TOLERANCE);
        });

        test("insideEnd", function() {
            plotArea = new PlotAreaStub();
            setupPieChart(plotArea, {
                series: [{
                    data: [ 40, 1, 140 ],
                    labels: {
                        visible: true,
                        position: "insideEnd"
                    }
                }]
            });

            closeTextPosition(false, getTexts(), [
                [ 540.440, 113.704 ],
                [ 624.853, 253.918 ],
                [ 236.488, 467.693 ] ], TOLERANCE);
        });

        test("outsideEnd", function() {
            var points = [];
            $.each(view.log.text, function() {
                var style = this.style;
                points.push([ style.x, style.y ]);
            });

            closeTextPosition(false, getTexts(), [
                [ 587.103, 82 ],
                [ 673.133, 248 ],
                [ 188.896, 502 ] ], TOLERANCE);
        });

    })();

    (function() {
        // ------------------------------------------------------------
        var chart,
            labelElement,
            segmentElement;

        function createPieChart(options) {
            chart = createChart($.extend({
                series: [{
                    type: "pie",
                    data: [1],
                    labels: {
                        visible: true,
                        distance: 20
                    }
                }]
            }, options));

            var plotArea = chart._model.children[1],
                segment = plotArea.charts[0].points[0],
                label = segment.children[0];

            segmentElement = getChartDomElement(segment);
            labelElement = getChartDomElement(label);
        }

        module("Pie Chart / Events / seriesClick ", {
            setup: function() {
                createPieChart({
                    seriesClick: function() { ok(true); }
                });
            },
            teardown: destroyChart
        });

        test("fires when clicking points", 1, function() {
            chart._userEvents.press(0, 0, segmentElement);
            chart._userEvents.end(0, 0);
        });

        test("fires when clicking labels", 1, function() {
            chart._userEvents.press(0, 0, labelElement);
            chart._userEvents.end(0, 0);
        });

        // ------------------------------------------------------------
        module("Pie Chart / Events / seriesHover", {
            setup: function() {
                createPieChart({
                    seriesHover: function() { ok(true); }
                });
            },
            teardown: destroyChart
        });

        test("fires when clicking points", 1, function() {
            segmentElement.mouseover();
        });

        test("fires when clicking labels", 1, function() {
            labelElement.mouseover();
        });

    })();
})();
