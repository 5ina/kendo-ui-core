(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        categoriesCount = dataviz.categoriesCount,
        chartBox = new Box2D(0, 0, 800, 600),
        series,
        view;

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
        var bulletChart;

        var plotArea = stubPlotArea(
            function(categoryIndex) {
                return new Box2D();
            },
            function(from, to) {
                return new Box2D(0, 0, to || from, 0);
            },
            {
                categoryAxis: {
                    categories: ["A"]
                }
            }
        );

        // ------------------------------------------------------------
        module("Bullet Chart / Rendering", {
            setup: function() {
                bulletChart = new dataviz.BulletChart(plotArea, {
                    series: [{
                        data: [[0, 0]],
                        color: "#f00",
                        opacity: 0.5,
                        overlay: "none"
                    }]
                });
            }
        });

        test("applies series fill color to bars", function() {
            equal(bulletChart.points[0].color, "#f00");
        });

        test("applies series opacity color to bullets", function() {
            equal(bulletChart.points[0].options.opacity, 0.5);
        });

        test("applies series overlay to bullets", function() {
            equal(bulletChart.points[0].options.overlay, "none");
        });

        test("applies color function", function() {
            bulletChart = new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [[0, 0]],
                    color: function(bullet) { return "#f00" }
                }]
            });

            equal(bulletChart.points[0].color, "#f00");
        });

        test("applies color function for each point", 2, function() {
            bulletChart = new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [[0, 0], [1, 1]],
                    color: function() { ok(true); }
                }]
            });
        });

        test("color fn argument contains value", 2, function() {
            new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [[0, 1]],
                    color: function(bullet) {
                        equal(bullet.value.current, 0);
                        equal(bullet.value.target, 1);
                    }
                }]
            });
        });

        test("color fn argument contains series", 1, function() {
            new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    name: "series 1",
                    data: [[0, 0]],
                    color: function(bubble) { equal(bubble.series.name, "series 1"); }
                }]
            });
        });

        test("applies color binding", function() {
            bulletChart = new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [{ value: [0, 0], color: "red" }],
                    colorField: "color"
                }]
            });

            equal(bulletChart.points[0].color, "red");
        });

        test("sets bar size to current value", function() {
            bulletChart = new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [[10, 15]],
                    notes: { label: { } }
                }],
                invertAxes: true
            });
            bulletChart.reflow(chartBox);

            equal(bulletChart.points[0].box.x2, 10);
        });

        test("sets target position to target value", function() {
            bulletChart = new dataviz.BulletChart(plotArea, {
                series: [{
                    type: "bullet",
                    data: [[10, 15]],
                    notes: { label: { } }
                }],
                invertAxes: true
            });
            bulletChart.reflow(chartBox);

            equal(bulletChart.points[0].target.box.x2, 15);
        });

    })();

    (function() {
        var chart;

        function createBulletChart(options) {
            chart = createChart(kendo.deepExtend({
                series: [{
                    type: "bullet",
                    data: [[1,2]]
                }]
            }, options));
        }

        // ------------------------------------------------------------
        module("Bullet Chart / Configuration", {
            teardown: function() {
                destroyChart();
            }
        });

        test("forces categoryAxis.justified to false", function() {
            createBulletChart({
                categoryAxis: {
                    justified: true
                }
            });

            ok(!chart._plotArea.categoryAxis.options.justified);
        });

        test("with no data should not render target", function() {
            createBulletChart({
                series: [{
                    type: "bullet",
                    data: []
                }]
            });

            ok(typeof chart._plotArea.charts[0].points[0].target === "undefined");
        });
    })();


    (function() {
        var Bullet = dataviz.Bullet,
            bullet,
            box,
            root,
            VALUE = 1,
            CATEGORY = "A",
            SERIES_NAME = "series",
            TOOLTIP_OFFSET = 5;

        var AxisMock = function() {
            this.getSlot = function() {
                return new Box2D();
            };
        };

        function createBullet(options, clipBox) {
            box = new Box2D(0, 0, 100, 100);
            bullet = new Bullet({
                target: VALUE
            }, kendo.deepExtend({}, {
                notes: {
                    label: {}
                }
            }, options));

            bullet.category = CATEGORY;
            bullet.dataItem = { value: VALUE };
            bullet.percentage = 0.5;
            bullet.series = { name: SERIES_NAME };
            bullet.owner = {
                pane: {
                    clipBox: function(){
                        return clipBox || new Box2D(0, 0, 100, 100);
                    }
                },
                seriesValueAxis: function() {
                    return new AxisMock();
                },
                categorySlot: function() {
                    return new Box2D();
                }
            };
            root = new dataviz.RootElement();
            root.box = box;
            root.append(bullet);
            bullet.reflow(box);

            root.renderVisual();
        }

        // ------------------------------------------------------------
        module("Bullet", {});

        test("tooltipAnchor is top right corner / vertical / above axis",
        function() {
            createBullet({ vertical: true, aboveAxis: true, isStacked: false });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 + TOOLTIP_OFFSET, bullet.box.y1])
        });

        test("tooltipAnchor is top right corner / vertical / above axis / stacked",
        function() {
            createBullet({ vertical: true, aboveAxis: true, isStacked: true });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 + TOOLTIP_OFFSET, bullet.box.y1])
        });

        test("tooltipAnchor is bottom right corner / vertical / below axis",
        function() {
            createBullet({ vertical: true, aboveAxis: false, isStacked: false });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 + TOOLTIP_OFFSET, bullet.box.y2 - 10])
        });

        test("tooltipAnchor is bottom right corner / vertical / below axis / stacked",
        function() {
            createBullet({ vertical: true, aboveAxis: false, isStacked: true });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 + TOOLTIP_OFFSET, bullet.box.y2 - 10])
        });

        test("tooltipAnchor is top right corner / horizontal / above axis",
        function() {
            createBullet({ vertical: false, aboveAxis: true, isStacked: false });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 + TOOLTIP_OFFSET, bullet.box.y1])
        });

        test("tooltipAnchor is above top right corner / horizontal / above axis / stacked",
        function() {
            createBullet({ vertical: false, aboveAxis: true, isStacked: true });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x2 - 10, bullet.box.y1 - 10 - TOOLTIP_OFFSET])
        });

        test("tooltipAnchor is top left corner / horizontal / below axis",
        function() {
            createBullet({ vertical: false, aboveAxis: false, isStacked: false });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x1 - 10 - TOOLTIP_OFFSET, bullet.box.y1])
        });

        test("tooltipAnchor is above top left corner / horizontal / below axis / stacked",
        function() {
            createBullet({ vertical: false, aboveAxis: false, isStacked: true });
            var anchor = bullet.tooltipAnchor(10, 10);
            deepEqual([anchor.x, anchor.y], [bullet.box.x1, bullet.box.y1 - 10 - TOOLTIP_OFFSET])
        });

        test("tooltipAnchor is limited to the clipbox / horizontal / above axis", function() {
            createBullet({ vertical: false, aboveAxis: true }, Box2D(1, 20, 40, 100));
            var anchor = bullet.tooltipAnchor(10, 10);
            equal(anchor.x, 40 + TOOLTIP_OFFSET);
            equal(anchor.y, 20);
        });

        test("tooltipAnchor is limited to the clipbox / vertical / above axis", function() {
            createBullet({ vertical: true, aboveAxis: true}, Box2D(1, 40, 50, 100));
            var anchor = bullet.tooltipAnchor(10, 10);
            equal(anchor.x, 50 + TOOLTIP_OFFSET);
            equal(anchor.y, 40);
        });

        test("tooltipAnchor is limited to the clipbox / horizontal / below axis", function() {
            createBullet({ vertical: false, aboveAxis: false}, Box2D(40, 20, 100, 100));
            var anchor = bullet.tooltipAnchor(10, 10);
            equal(anchor.x, 30 - TOOLTIP_OFFSET);
            equal(anchor.y, 20);
        });

        test("tooltipAnchor is limited to the clipbox / vertical / below axis", function() {
            createBullet({ vertical: true, aboveAxis: false}, Box2D(1, 1, 50, 40));
            var anchor = bullet.tooltipAnchor(10, 10);
            equal(anchor.x, 50 + TOOLTIP_OFFSET);
            equal(anchor.y, 30);
        });

        test("highlightVisual returns bodyVisual", function() {
            createBullet({});
            ok(bullet.highlightVisual() === bullet.bodyVisual);
        });

        test("highlightVisualArgs returns an object with the options, the bullet rect and the bodyVisual", function() {
            createBullet({});
            var result = bullet.highlightVisualArgs();
            deepEqual(result.options, bullet.options);
            ok(bullet.box.toRect().equals(result.rect));
            ok(bullet.bodyVisual === result.visual);
        });
    })();

})();
