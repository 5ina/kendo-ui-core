(function() {
    var dataviz = kendo.dataviz,
        geom = kendo.geometry,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D,
        chartBox = new Box2D(5, 5, 1000, 1000),
        uniqueId = dataviz.uniqueId,
        TOLERANCE = 2;

    function ChartElementStub() {
        this.reflow = function() { }
    }

    function moduleSetup() {

    }

    function moduleTeardown() {
    }


    (function() {
        var chartElement;

        function setup() {
            chartElement = new dataviz.ChartElement();
        }

        // ------------------------------------------------------------
        module("ChartElement", {
            setup: setup
        });

        test("box wraps children", function() {
            var childStub = {
                reflow: function() { },
                box: new dataviz.Box2D(10, 10, 100, 100)
            };

            chartElement.children.push(childStub);
            chartElement.reflow();

            sameBox(chartElement.box, childStub.box);
        });

        test("parent set to appended children", function() {
            var child = new dataviz.ChartElement();
            chartElement.append(child);
            ok(child.parent === chartElement);
        });

        test("getRoot returns root for first level children", function() {
            var child = new dataviz.ChartElement();

            chartElement.getRoot = function() { return this; }

            chartElement.append(child);
            ok(child.getRoot() === chartElement);
        });

        test("getRoot returns root for second level children", function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            chartElement.getRoot = function() { return this; }

            child1.append(child2);
            chartElement.append(child1);

            ok(child2.getRoot() === chartElement);
        });

        test("getRoot returns null if element does not have parent", function() {
            ok(chartElement.getRoot() === null);
        });

        test("stackRoot returns the stackRoot for first level children", function() {
            var child = new dataviz.ChartElement();

            chartElement.stackRoot = function() { return this; }

            chartElement.append(child);
            ok(child.stackRoot() === chartElement);
        });

        test("stackRoot returns root for second level children", function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            chartElement.stackRoot = function() { return this; }

            child1.append(child2);
            chartElement.append(child1);

            ok(child2.stackRoot() === chartElement);
        });

        test("traverse traverses all children", 2, function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            child1.append(child2);
            chartElement.append(child1);
            chartElement.traverse(function(element) {
                ok(element === child1 || element === child2);
            });
        });

        test("closest returns matched parent",function() {
            var child1 = new dataviz.ChartElement(),
                child2 = new dataviz.ChartElement();

            child1.append(child2);
            chartElement.append(child1);

            var result = child2.closest(function(element) {
                return element === chartElement;
            });
            ok(result === chartElement);
        });

        test("stackRoot returns self if element does not have parent", function() {
            ok(chartElement.stackRoot() === chartElement);
        });

        test("stackVisual inserts visual at sorted position", function() {
            var child = new dataviz.ChartElement({zIndex: 2}),
                visual1 = new draw.Path({zIndex: 1}),
                visual2 = new draw.Path({zIndex: 3});

            chartElement.createVisual();
            chartElement.visual.append(visual1, visual2);
            chartElement.stackVisual(child);

            equal($.inArray(child, chartElement.visual.children), 1);
        });

        test("createVisual creates group with zIndex and visibility set", function() {
            chartElement.options.zIndex = 10;
            chartElement.options.visible = false;
            chartElement.createVisual();

            var visual = chartElement.visual;
            ok(visual instanceof draw.Group);
            equal(visual.options.zIndex, 10);
            equal(visual.options.visible, false);
        });

        test("createVisual sets visible to true by default", function() {
            chartElement.createVisual();
            equal(chartElement.visual.options.visible, true);
        });

        test("createAnimation creates visual animation", function() {
            chartElement.options.animation = {
                type: "bar"
            };
            chartElement.createVisual();
            chartElement.createAnimation();
            ok(chartElement.animation);
            ok(chartElement.animation.element === chartElement.visual);
        });

        // ------------------------------------------------------------
        module("ChartElement / appendVisual", {
            setup: setup
        });

        test("assigns chartElement to visual", function() {
            var visual = new draw.Group();
            chartElement.createVisual();
            chartElement.appendVisual(visual);
            ok(visual.chartElement === chartElement);
        });

        test("does not override already assigned chartElement", function() {
            var visual = new draw.Group();
            visual.chartElement = "foo";
            chartElement.createVisual();
            chartElement.appendVisual(visual);
            equal(visual.chartElement, "foo");
        });

        test("appends visual", function() {
            var visual = new draw.Group();
            chartElement.createVisual();
            chartElement.appendVisual(visual);
            ok(chartElement.visual.children[0] === visual);
        });

        test("appends visual to parent if element does not have visual", function() {
            var visual = new draw.Group();
            chartElement.parent = {
                appendVisual: function(childVisual) {
                    ok(visual, childVisual);
                }
            };
            chartElement.appendVisual(visual);
        });

        test("appends visual to the clipRoot if noclip is true", function() {
            var child = new dataviz.ChartElement();
            var visual = new draw.Group({
                noclip: true
            });
            chartElement.append(child);
            chartElement.createVisual();
            chartElement.clipRoot = function() { return this; };

            child.appendVisual(visual);
            ok(chartElement.visual.children[0] === visual);
        });

        test("appends stacks visual to stack root if visual has zIndex", function() {
            var child = new dataviz.ChartElement();
            var visual = new draw.Group({
                zIndex: 1
            });
            chartElement.append(child);
            chartElement.createVisual();
            chartElement.stackRoot = function() { return this; };
            chartElement.stackVisual = function(childVisual) {
                ok(visual === childVisual);
            };

            child.appendVisual(visual);
        });

        // ------------------------------------------------------------
        module("ChartElement / renderVisual", {
            setup: setup
        });

        test("creates visual", function() {
            chartElement.createVisual = function() {
                ok(true);
            };
            chartElement.renderVisual();
        });

        test("assigns chartElement to visual", function() {
            chartElement.renderVisual();
            ok(chartElement.visual.chartElement === chartElement);
        });

        test("appends visual to parent", function() {
            chartElement.parent = {
                appendVisual: function(visual) {
                    ok(chartElement.visual, visual);
                }
            };
            chartElement.renderVisual();
        });

        test("renders children", 2, function() {
            var child1 = child2 = {
                renderVisual: function() {
                    ok(true);
                }
            };
            chartElement.append(child1, child2);
            chartElement.renderVisual();
        });

        test("creates animation", function() {
            chartElement.createAnimation = function() {
                ok(true);
            };
            chartElement.renderVisual();
        });

        test("calls renderComplete", function() {
            chartElement.renderComplete = function() {
                ok(true);
            };
            chartElement.renderVisual();
        });

        // ------------------------------------------------------------
        module("ChartElement / toggleHighlight", {
            setup: function() {
                setup();
                chartElement.createVisual();
            }
        });

        test("creates highlight", function() {
            chartElement.createHighlight = function() {
                ok(true);
                return new draw.Path();
            };
            chartElement.toggleHighlight();
        });

        test("creates highlight only once", 1, function() {
            chartElement.createHighlight = function() {
                ok(true);
                return new draw.Path();
            };
            chartElement.toggleHighlight(true);
            chartElement.toggleHighlight(false);
        });

        test("appends highlight", function() {
            var visual = new draw.Path();
            chartElement.createHighlight = function() {
                return visual;
            };
            chartElement.toggleHighlight();
            ok(chartElement.visual.children[0] === visual);
        });

        test("passes default options", function() {
            chartElement.createHighlight = function(options) {
                equal(options.fill.color, "#fff");
                equal(options.fill.opacity, 0.2);
                equal(options.stroke.color, "#fff");
                equal(options.stroke.width, 1);
                equal(options.stroke.opacity, 0.2);
                return new draw.Path();
            };
            chartElement.toggleHighlight();
        });

        test("sets highlight visibility", function() {
            var visual = new draw.Path();
            chartElement.createHighlight = function() {
                return visual;
            };

            chartElement.toggleHighlight(false);
            equal(visual.visible(), false);

            chartElement.toggleHighlight(true);
            equal(visual.visible(), true);
        });

        test("appends highlight to the same container as the element when zIndex is set", function() {
            var parent = new dataviz.ChartElement();
            var child = new dataviz.ChartElement();
            var highlight = new draw.Path();
            chartElement.options.zIndex = 1;
            parent.append(child);
            child.append(chartElement);
            parent.renderVisual();

            chartElement.createHighlight = function() {
                return highlight;
            };
            chartElement.toggleHighlight();
            equal(parent.visual.children.length, 3);
            ok($.inArray(highlight, parent.visual.children) >= 0);
        });

        // ------------------------------------------------------------
        (function() {
            var visual;

            function returnVisual() {
                return visual;
            }

            module("ChartElement / toggleHighlight / custom visual", {
                setup: function() {
                    setup();
                    chartElement.options.highlight = {};
                    chartElement.highlightVisualArgs = function() { return {}; };
                    chartElement.createVisual();
                    visual = new kendo.drawing.Path();
                }
            });

            test("uses visual returned from the visual function", function() {
                chartElement.options.highlight.visual = returnVisual;
                chartElement.toggleHighlight(true);
                ok(chartElement._highlight === visual);
            });

            test("appends custom visual", function() {
                chartElement.options.highlight.visual = returnVisual;
                chartElement.appendVisual = function (childVisual) {
                    ok(visual === childVisual);
                };
                chartElement.toggleHighlight(true);
            });

            test("does nothing if visual function returns no result", function() {
                chartElement.options.highlight.visual = $.noop;
                chartElement.toggleHighlight(true);
                ok(chartElement._highlight === undefined);
            });

            test("toggles custom visual visiblity", function() {
                chartElement.options.highlight.visual = returnVisual;
                chartElement.toggleHighlight(true);
                equal(visual.visible(), true);
                chartElement.toggleHighlight(false);
                equal(visual.visible(), false);
            });

            test("sets zIndex to custom visual", function() {
                chartElement.options.zIndex = 100;
                chartElement.options.highlight.visual = returnVisual;
                chartElement.toggleHighlight();
                equal(visual.options.zIndex, 100);
            });

            test("passes highlightVisualArgs to visual function", function() {
                chartElement.highlightVisualArgs = function() {
                    return {
                        foo: "bar"
                    };
                };
                chartElement.options.highlight.visual = function(e) {
                    equal(e.foo, "bar");
                };
                chartElement.toggleHighlight();
            });

            test("passes a function that returns the default highlight visual", function() {
                var defaultVisual = new kendo.drawing.Path();
                chartElement.createHighlight = function() {
                    return defaultVisual;
                };
                chartElement.options.highlight.visual = function(e) {
                    ok(e.createVisual() ===  defaultVisual);
                };
                chartElement.toggleHighlight();
            });

            test("passes the element series, dataItem, category, value, percentage, runningTotal and total", function() {
                var defaultVisual = new kendo.drawing.Path();
                chartElement.series = "foo";
                chartElement.dataItem = "bar";
                chartElement.category = "baz";
                chartElement.value = 1;
                chartElement.percentage = 0.5;
                chartElement.runningTotal = 2;
                chartElement.total = 3;
                chartElement.getRoot = function() { return { chart: "chart" } };
                chartElement.options.highlight.visual = function(e) {
                    equal(e.series, "foo");
                    equal(e.sender, "chart");
                    equal(e.dataItem, "bar");
                    equal(e.category, "baz");
                    equal(e.value, 1);
                    equal(e.percentage, 0.5);
                    equal(e.runningTotal, 2);
                    equal(e.total,3);
                };
                chartElement.toggleHighlight();
            });

        })();

        // ------------------------------------------------------------
        (function() {
            var gradient;
            var gradientOptions;
            var path;
            var overlay;
            module("ChartElement / createGradientOverlay", {
                setup: function() {
                    setup();
                    gradient = new draw.LinearGradient();
                    path = new draw.Path().moveTo(10, 20).curveTo([20, 30], [40, 30], [60, 10]);
                    chartElement.parent = {
                        createGradient: function(options) {
                            gradientOptions = options;
                            return gradient;
                        }
                    };
                }
            });

            test("creates Path with gradient fill", function() {
                overlay = chartElement.createGradientOverlay(path);
                ok(overlay instanceof draw.Path);
                ok(overlay.fill() === gradient);
            });

            test("overlay path has none stroke color", function() {
                overlay = chartElement.createGradientOverlay(path);
                equal(overlay.options.stroke.color, "none");
            });

            test("overlay path has same segments", function() {
                overlay = chartElement.createGradientOverlay(path);
                closePaths(path, overlay);
            });

            test("overlay path is closed based on source element path", function() {
                overlay = chartElement.createGradientOverlay(path);
                ok(!overlay.options.closed);

                path.close();
                overlay = chartElement.createGradientOverlay(path);
                ok(overlay.options.closed);
            });

            test("creates gradient with passed options", function() {
                overlay = chartElement.createGradientOverlay(path, {}, {
                    foo: "bar"
                });
                equal(gradientOptions.foo, "bar");
            });

            test("sets custom options to path", function() {
                overlay = chartElement.createGradientOverlay(path, {
                    stroke: {
                        color: "red"
                    }
                });
                equal(overlay.options.stroke.color, "red");
            });

        })();

        // ------------------------------------------------------------
        module("ChartElement / destroy", {
            setup: setup
        });

        test("destroys animation", function() {
            chartElement.animation = {
                destroy: function() {
                    ok(true);
                }
            };
            chartElement.destroy();
        });

        test("destroys children", function() {
            var child1 = new dataviz.ChartElement();
            chartElement.append(child1);
            child1.destroy = function() {
                ok(true);
            };
            chartElement.destroy();

        });
    })();

    (function() {
        var rootElement,
            rootRect,
            MARGIN = 10;

        function createRoot(options) {
            rootElement = new dataviz.RootElement(options);

            rootElement.reflow();
        }

        function renderRoot() {
            rootElement.renderVisual();
            rootRect = rootElement.visual.children[0];
        }

        // ------------------------------------------------------------
        module("RootElement", {
            setup: function() {
                moduleSetup();

                createRoot();
            }
        });

        test("reflow is called for all children", 2, function() {
            var childStub = {
                reflow: function() { ok(true); },
                box: new dataviz.Box2D()
            };

            rootElement.children.push(childStub, childStub);

            rootElement.reflow();
        });

        test("reflow passes empty box if there is no box left with non zero size left", function() {
            var childStub = {
                reflow: function(box) {
                    this.box = dataviz.Box2D(box.x1, box.y2 - 10, box.x2, box.y2);
                }
            };

            var child1Stub = {
                reflow: function(box) {
                    ok(box);
                    equal(box.hasSize(), false);
                },
                box: dataviz.Box2D()
            };

            rootElement.children.push(childStub, child1Stub);
            rootElement.options.width = 10;
            rootElement.options.height = 10;

            rootElement.reflow();
        });

        test("sets border to rootElement", function() {
            createRoot({
                border: {
                    width: 1,
                    color: "red",
                    dashType: "dot"
                }
            });
            renderRoot();
            var stroke = rootRect.options.stroke;

            sameRectPath(rootRect, [1, 1, 599, 399]);
            equal(stroke.width, 1);
            equal(stroke.color, "red");
            equal(stroke.dashType, "dot");
        });

        test("sets background to rootElement", function() {
            createRoot({
                background: "red"
            });
            renderRoot();

            equal(rootRect.options.fill.color, "red");
        });

        test("sets background opacity to rootElement", function() {
            createRoot({
                opacity: 0.1
            });
            renderRoot();

            equal(rootRect.options.fill.opacity, 0.1);
        });

        test("applies top margin", function() {
            createRoot({
                margin: {
                    top: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.y1, rootRect.segments[0].anchor().y + MARGIN);
        });

        test("applies right margin", function() {
            createRoot({
                margin: {
                    right: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.x2, rootRect.segments[1].anchor().x - MARGIN);
        });

        test("applies bottom margin", function() {
            createRoot({
                margin: {
                    bottom: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.y2, rootRect.segments[2].anchor().y - MARGIN);
        });

        test("applies left margin", function() {
            createRoot({
                margin: {
                    left: MARGIN
                }
            });
            renderRoot();

            equal(rootElement.box.x1, rootRect.segments[0].anchor().x + MARGIN);
        });

        test("getRoot returns self", function() {
            ok(rootElement.getRoot() === rootElement);
        });

        // ------------------------------------------------------------
        module("RootElement / createGradient", {
            setup: function() {
                createRoot();
            }
        });

        test("creates gradient based on type", function() {
            var linear = rootElement.createGradient({
                gradient: "glass"
            });

            ok(linear instanceof draw.LinearGradient);

            var radial = rootElement.createGradient({
                gradient: "sharpGlass"
            });

            ok(radial instanceof draw.RadialGradient);
            equal(radial.stops.length, 6);
        });

        test("returns the same instance if the options are the same", function() {
            var linear1 = rootElement.createGradient({
                gradient: "glass"
            });
            var linear2 = rootElement.createGradient({
                gradient: "glass"
            });

            ok(linear1 === linear2);
        });

        test("returns a new instance if the options are not the same", function() {
            var linear1 = rootElement.createGradient({
                gradient: "glass"
            });
            var linear2 = rootElement.createGradient({
                gradient: "glass",
                foo: "bar"
            });

            ok(linear1 !== linear2);
        });

        test("sets custom options to gradient", function() {
            var linear = rootElement.createGradient({
                gradient: "glass",
                userSpace: true
            });

            ok(linear.userSpace());
        });

        test("converts stops offsets for radial gradient if innerRadius is passed", function() {
            var radial = rootElement.createGradient({
                gradient: "roundedBevel",
                innerRadius: 10,
                radius: 20
            });
            var stops = radial.stops;
            var expectedStops = [{
                offset: 0.665
            }, {
                offset: 0.915
            }, {
                offset: 0.975
            }];

            for (var idx = 0; idx < stops.length; idx++) {
                equal(stops[idx].offset(), expectedStops[idx].offset);
            }
        });

        test("sets supportVML based on gradient options", function() {
            var radial = rootElement.createGradient({
                gradient: "roundedBevel"
            });

            equal(radial.supportVML, true);

            radial = rootElement.createGradient({
                gradient: "roundedGlass"
            });

            equal(radial.supportVML, false);
        });

    })();

    (function() {
        var MARGIN = 3,
            PADDING = 2,
            BORDER = 1,
            WIDTH = 10,
            HEIGHT = 20,
            targetBox = new Box2D(100, 100, 200, 200),
            childBoxes,
            childrenBox = new Box2D(0, 0, 20, 20),
            boxElement,
            childElements,
            visual,
            rectVisual;

        function ChildElementStub() {
            this.boxes = []
            this.reflow = function(box) {
                this.box = box;
                this.boxes.push(box.clone());
            }
        };

        // ------------------------------------------------------------
        module("BoxElement", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement({
                    width: WIDTH,
                    height: HEIGHT
                });
            }
        });

        test("sets width", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
        });

        test("sets height", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.height(), HEIGHT);
        });

        test("applies top margin", function() {
            boxElement.options.margin.top = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.y1, boxElement.box.y2],
                 [targetBox.y1, targetBox.y1 + HEIGHT + MARGIN]);
        });

        test("applies right margin", function() {
            boxElement.options.margin.right = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.x2],
                 [targetBox.x1, targetBox.x1 + WIDTH + MARGIN]);
        });

        test("applies bottom margin", function() {
            boxElement.options.margin.bottom = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.y1, boxElement.box.y2],
                 [targetBox.y1, targetBox.y1 + HEIGHT + MARGIN]);
        });

        test("applies left margin", function() {
            boxElement.options.margin.left = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.x2],
                 [targetBox.x1, targetBox.x1 + WIDTH + MARGIN]);
        });

        test("applies margins", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            deepEqual([boxElement.box.x1, boxElement.box.y1,
                  boxElement.box.x2, boxElement.box.y2],
                 [targetBox.x1, targetBox.y1,
                  targetBox.x1 + WIDTH + 2 * MARGIN,
                  targetBox.y1 + HEIGHT + 2 * MARGIN]);
        });

        test("padding is added to outer box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * PADDING);
            equal(boxElement.box.height(), HEIGHT + 2 * PADDING);
        });

        test("padding is added to paddingBox", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH + 2 * PADDING);
            equal(boxElement.paddingBox.height(), HEIGHT + 2 * PADDING);
        });

        test("border is added to outer box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * BORDER);
            equal(boxElement.box.height(), HEIGHT + 2 * BORDER);
        });

        test("border is not added to padding box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("margin is added to outer box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH + 2 * MARGIN);
            equal(boxElement.box.height(), HEIGHT + 2 * MARGIN);
        });

        test("margin is not added to padding box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("content box has no padding, border or margin", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.contentBox.width(), WIDTH);
            equal(boxElement.contentBox.height(), HEIGHT);
        });

        test("reflows children in box with the actual size", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            var stubElement = new ChildElementStub();
            boxElement.children = [stubElement];
            boxElement.reflow(targetBox);

            equal(stubElement.boxes[0].width(), WIDTH);
            equal(stubElement.boxes[0].height(), HEIGHT);
        });

        // ------------------------------------------------------------
        module("BoxElement / Shrink to fit", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement({
                    shrinkToFit: true,
                    width: WIDTH,
                    height: HEIGHT
                });
            }
        });

        test("padding is not added to outer box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("padding is added to padding box", function() {
            boxElement.options.padding = PADDING;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH);
            equal(boxElement.paddingBox.height(), HEIGHT);
        });

        test("border is not added to outer box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("border is subtracted from padding box", function() {
            boxElement.options.border.width = BORDER;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH - 2 * BORDER);
            equal(boxElement.paddingBox.height(), HEIGHT - 2 * BORDER);
        });

        test("margin is not added to outer box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), WIDTH);
            equal(boxElement.box.height(), HEIGHT);
        });

        test("margin is subtracted from padding box", function() {
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            equal(boxElement.paddingBox.width(), WIDTH - 2 * MARGIN);
            equal(boxElement.paddingBox.height(), HEIGHT - 2 * MARGIN);
        });

        test("content box has padding, border and margin", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            boxElement.reflow(targetBox);

            var nonContent = 2 * PADDING + 2 * BORDER + 2 * MARGIN;

            equal(boxElement.contentBox.width(), WIDTH - nonContent);
            equal(boxElement.contentBox.height(), HEIGHT - nonContent);
        });

        test("reflows children in box with the actual size", function() {
            boxElement.options.padding = PADDING;
            boxElement.options.border.width = BORDER;
            boxElement.options.margin = MARGIN;
            boxElement.options.width = 50;
            boxElement.options.height = 50;
            var stubElement = new ChildElementStub();
            boxElement.children = [stubElement];
            boxElement.reflow(targetBox);

            equal(stubElement.boxes[0].width(), 38);
            equal(stubElement.boxes[0].height(), 38);
        });

        // ------------------------------------------------------------
        module("BoxElement / Alignment", {
            setup: function() {
                moduleSetup();
                boxElement = new dataviz.BoxElement({
                    width: WIDTH,
                    height: HEIGHT,
                    margin: MARGIN,
                    padding: PADDING,
                    border: { width: BORDER }
                });
            }
        });

        test("top alignment", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.y1, targetBox.y1);
        });

        test("bottom alignment", function() {
            boxElement.options.vAlign = "bottom";
            boxElement.reflow(targetBox);

            equal(boxElement.box.y2, targetBox.y2);
        });

        test("vertical center alignment", function() {
            boxElement.options.vAlign = "center";
            boxElement.reflow(targetBox);

            equal(boxElement.box.y1,
                  targetBox.y1 + (targetBox.height() - boxElement.box.height()) / 2);
        });

        test("left alignment", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.x1, targetBox.x1);
        });

        test("right alignment", function() {
            boxElement.options.align = "right";
            boxElement.reflow(targetBox);

            equal(boxElement.box.x2, targetBox.x2);
        });

        test("horizontal center alignment", function() {
            boxElement.options.align = "center";
            boxElement.reflow(targetBox);

            equal(boxElement.box.x1,
                  targetBox.x1 + (targetBox.width() - boxElement.box.width()) / 2);
        });

        // ------------------------------------------------------------
        module("BoxElement / With children", {
            setup: function() {
                moduleSetup();

                boxElement = new dataviz.BoxElement();
                childElements = [
                    new ChartElementStub(),
                    new ChartElementStub()
                ];

                childBoxes = [
                    new Box2D(0, 0, 10, 10),
                    new Box2D(0, 0, 20, 20)
                ];

                childElements[0].box = childBoxes[0];
                childElements[1].box = childBoxes[1];
                [].push.apply(boxElement.children, childElements);
            }
        });

        test("children set width", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.width(), childrenBox.width());
        });

        test("children set height", function() {
            boxElement.reflow(targetBox);

            equal(boxElement.box.height(), childrenBox.height());
        });

        test("moves children from margins", function() {
            boxElement.options.margin = {
                left: 1,
                top: 2
            };
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                deepEqual([this.box.x1, this.box.y1],
                     [targetBox.x1 + 1, targetBox.y1 + 2]);
            });
        });

        test("moves children from padding", function() {
            boxElement.options.padding = {
                left: 1,
                top: 2
            };
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                deepEqual([this.box.x1, this.box.y1],
                     [targetBox.x1 + 1, targetBox.y1 + 2]);
            });
        });

        test("children moved after top alignment", function() {
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                equal(this.box.y1, targetBox.y1);
            });
        });

        test("children moved after bottom alignment", function() {
            boxElement.options.vAlign = "bottom";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.y2, 190);
            equal(childElements[1].box.y2, 200);
        });

        test("children moved after vertical center alignment", function() {
            boxElement.options.vAlign = "center";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.y1, 140);
            equal(childElements[1].box.y1, 140);
        });

        test("children moved after left alignment", function() {
            boxElement.reflow(targetBox);

            $.each(childElements, function() {
                equal(this.box.x1, targetBox.x1);
            });
        });

        test("children moved after right alignment", function() {
            boxElement.options.align = "right";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.x2, 190);
            equal(childElements[1].box.x2, 200);
        });

        test("children moved after horizontal center alignment", function() {
            boxElement.options.align = "center";
            boxElement.reflow(targetBox);

            equal(childElements[0].box.x1, 140);
            equal(childElements[1].box.x1, 140);
        });

        function renderBoxElement(options) {
            boxElement = new dataviz.BoxElement(options);
            boxElement.reflow(targetBox);
            boxElement.renderVisual();
            visual = boxElement.visual;
            if (visual) {
                rectVisual = visual.children[0];
            }
        }

        // ------------------------------------------------------------
        module("BoxElement / Rendering", {
            setup: function() {
                moduleSetup();
                renderBoxElement({
                    width: WIDTH,
                    height: HEIGHT,
                    border: { width: 1, color: "#f00", dashType: "dot" },
                    opacity: 0.5,
                    background: "#f00"
                });
            }
        });

        test("does not render rectangle when no border and background are set", function() {
            renderBoxElement();
            equal(visual.children.length, 0);
        });

        test("renders border width", function() {
            equal(rectVisual.options.stroke.width, 1);
        });

        test("renders border color", function() {
            equal(rectVisual.options.stroke.color, "#f00");
        });

        test("renders border dash type", function() {
            equal(rectVisual.options.stroke.dashType, "dot");
        });

        test("renders opacity as strokeOpacity", function() {
            equal(rectVisual.options.stroke.opacity, 0.5);
        });

        test("does not render rectangle when no width is set", function() {
            renderBoxElement({
                border: {
                    width: 0,
                    color: "#f00"
                }
            });

            equal(visual.children.length, 0);
        });

        test("renders fill color", function() {
            equal(rectVisual.options.fill.color, "#f00");
        });

        test("renders opacity as fillOpacity", function() {
            equal(rectVisual.options.fill.opacity, 0.5);
        });

        test("content box includes padding", function() {
            renderBoxElement({
                padding: PADDING,
                width: WIDTH,
                height: HEIGHT,
                background: "#f00"
            });

            var box = rectVisual.rawBBox();
            var size = box.size;

            equal(size.width, WIDTH + 2 * PADDING);
            equal(size.height, HEIGHT + 2 * PADDING);
        });

        test("padding box does not include border", function() {
            renderBoxElement({
                width: WIDTH,
                height: HEIGHT,
                border: { width: BORDER}
            });

            var box = rectVisual.rawBBox();
            var size = box.size;
            equal(size.width, WIDTH);
            equal(size.height, HEIGHT);
        });

        test("padding box does not include margin", function() {
            renderBoxElement({
                width: WIDTH,
                height: HEIGHT,
                background: "#f00",
                margin: MARGIN
            });
            var box = rectVisual.rawBBox();
            var size = box.size;
            equal(size.width, WIDTH);
            equal(size.height, HEIGHT);
        });

        test("does not render when visible is false", function() {
            renderBoxElement({
                visible: false
            });
            ok(!boxElement.visual);
        });

        test("renders zIndex", function() {
            renderBoxElement({
                zIndex: 100
            });

            equal(visual.options.zIndex, 100);
        });

        test("renders cursor", function() {
            renderBoxElement({
                width: WIDTH,
                height: HEIGHT,
                background: "#f00",
                cursor: {
                    style: "pointer"
                }
            });

            equal(rectVisual.options.cursor.style, "pointer");
        });

    })();

    (function() {
        var title,
            titleTextBox,
            titleText,
            Title = dataviz.Title,
            TITLE_TEXT_HEIGHT = 15,
            TITLE_TEXT_WIDTH = 40,
            MARGIN = 10,
            PADDING = 5;

        function createTitle(options) {
            title = new Title($.extend({
                text: "Title",
                font: SANS16,
                margin: MARGIN,
                padding: PADDING }, options));
            title.reflow(chartBox);
            titleTextBox = title.children[0],
            titleText = titleTextBox.children[0].children[0];
        }

        module("Title", {
            setup: function() {
                moduleSetup();

                createTitle();
            },
            teardown: moduleTeardown
        });

        test("text is created", function() {
            ok(titleText != null);

        });

        test("text element has set content", function() {
            equal(titleText.content, "Title");
        });

        test("text element has set font", function() {
            createTitle({
                font: "10px sans-serif"
            });
            equal(titleText.options.font, title.options.font);
        });

        test("text element has set color", function() {
            createTitle({
                color: "#cf0"
            });
            equal(titleText.options.color, title.options.color);
        });

        test("text box has set vAlign", function() {
            createTitle({
                position: "bottom"
            });

            equal(titleTextBox.options.vAlign, "bottom");
        });

        test("text box has set align", function() {
            createTitle({
                align: "right"
            });

            equal(titleTextBox.options.align, "right");
        });

        test("text box has set background", function() {
            createTitle({
                background: "#f00"
            });

            equal(titleTextBox.options.background, "#f00");
        });

        test("text is positioned at top", function() {
            equal(titleText.box.y1 - MARGIN - PADDING, chartBox.y1);
            close(titleText.box.y2 - MARGIN - PADDING,
                   chartBox.y1 + TITLE_TEXT_HEIGHT, TOLERANCE);
        });

        test("text is positioned at bottom", function() {
            createTitle({
                position: "bottom"
            });

            title.reflow(chartBox);
            close(titleText.box.y1 + MARGIN + PADDING,
                   chartBox.y2 - TITLE_TEXT_HEIGHT, TOLERANCE);
            equal(titleText.box.y2 + MARGIN + PADDING, chartBox.y2);
        });

        test("text is aligned at center", function() {
            close(titleText.box.x1,
                   chartBox.x1 + (chartBox.width() - TITLE_TEXT_WIDTH) / 2, TOLERANCE);
        });

        test("box width is equal to container width", function() {
            equal(title.box.width(), chartBox.width());
        });

        test("box height is equal to text height", function() {
            close(title.box.height() - MARGIN * 2 - PADDING * 2,
                   TITLE_TEXT_HEIGHT, TOLERANCE);
        });

        test("positions title at top with margin 20", function() {
            title = new Title({
                text: "Title",
                margin: MARGIN * 2
            });
            title.reflow(chartBox);

            title1 = new Title({
                text: "Title"
            });

            title1.reflow(chartBox);

            equal(title.box.height(),
                  title1.box.height() + MARGIN * 2 + PADDING * 2);
        });

        test("positions title at bottom with margin 20", function() {
            title = new Title({
                text: "Title",
                position: "bottom",
                margin: MARGIN * 2
            });

            title.reflow(chartBox);

            title1 = new Title({
                text: "Title",
                position: "bottom"
            });

            title1.reflow(chartBox);

            equal(title.box.height(),
                  title1.box.height() + MARGIN * 2 + PADDING * 2);
        });

        // ------------------------------------------------------------
        var parent;

        module("Title / buildTitle", {
            setup: function() {
                parent = new dataviz.ChartElement();
            },
            teardown: moduleTeardown
        });

        test("creates a title from string", function() {
            title = Title.buildTitle("Title", parent);
            equal(title.options.text, "Title");
        });

        test("creates a title from options with text", function() {
            title = Title.buildTitle({ text: "Title" }, parent);
            equal(title.options.text, "Title");
        });

        test("does not create title when not visible", function() {
            title = Title.buildTitle({ text: "Title", visible: false }, parent);
            equal(title, undefined);
        });

        test("does not create title without text", function() {
            title = Title.buildTitle({ text: "" }, parent);
            equal(title, undefined);
        });

        test("applies default options", function() {
            title = Title.buildTitle("Title", parent, { flag: true });
            equal(title.options.flag, true);
        });

    })();

    (function() {
        var text;
        var textVisual;

        function renderText(content, box) {
            text = new dataviz.Text(content || "&nbsp;", { font: SANS12, color: "red" });
            text.reflow(box || new Box2D());
            text.renderVisual();
            textVisual = text.visual;
        }

        module("Text", {
            setup: function() {
                moduleSetup();

                renderText();
            },
            teardown: moduleTeardown
        });

        test("renders text", function() {
            ok(textVisual instanceof draw.Text);
        });

        test("sets content on text", function() {
            renderText("Content");
            equal(textVisual.content(), "Content");
        });

        test("sets position on text", 2, function() {
            renderText("", new Box2D(100, 110, 200, 200));
            var origin = textVisual.rect().origin;
            equal(origin.x, 100);
            equal(origin.y, 110);
        });

        test("sets font", function() {
            equal(textVisual.options.font, SANS12);
        });

        test("sets color", function() {
            equal(textVisual.options.fill.color, "red");
        });

    })();

    (function() {
        var textBox,
            TextBox = dataviz.TextBox,
            FloatElement = dataviz.FloatElement,
            Text = dataviz.Text,
            TEXT = "text",
            floatElement,
            floatElementStub,
            targetBox = Box2D(0, 0, 100, 100),
            texts,
            rect;

        function createTextBox(options, text) {
            textBox = new TextBox(text || TEXT, options);
            floatElement = textBox.children[0];
            texts = floatElement.children;
        }

        // ------------------------------------------------------------
        module("TextBox", {});

        test("appends float element", function() {
            createTextBox();
            ok(floatElement instanceof FloatElement);
            ok(floatElement.parent === textBox);
        });

        test("sets align to float element from its options", function() {
            createTextBox({align: "right"});
            equal(floatElement.options.align, "right");
        });

        test("sets float element wrap to false", function() {
            createTextBox();
            equal(floatElement.options.wrap, false);
        });

        test("sets float element direction to vertical", function() {
            createTextBox();
            equal(floatElement.options.vertical, true);
        });

        test("appends text to float element", function() {
            createTextBox();
            ok(texts[0] instanceof Text);
            ok(texts[0].parent === floatElement);
        });

        test("passes text options", function() {
            createTextBox({font: "foo", color: "bar", cursor: {style: "baz"}});
            var options = texts[0].options;
            equal(options.font, "foo");
            equal(options.color, "bar");
            equal(options.cursor.style, "baz");
        });

        test("sets text vertical align to top", function() {
            createTextBox();
            equal(texts[0].options.vAlign, "top");
        });

        test("sets text align to left", function() {
            createTextBox();
            equal(texts[0].options.align, "left");
        });

        test("creates text when passed content is a number", function() {
            createTextBox({}, 1);
            ok(texts[0]);
        });

        test("splits text by line feed and creates a appends text to float element for each line", function() {
            createTextBox({}, "line1 \n line2");
            ok(texts[0] instanceof Text);
            equal(texts[0].content, "line1");
            ok(texts[1] instanceof Text);
            equal(texts[1].content, "line2");
        });

        test("has box after the initialization", function() {
            textBox = new TextBox(TEXT, {});
            ok(textBox.box);
        });

        // ------------------------------------------------------------

        function FloatElementStub(box) {
            this.box = box;
            this.reflow = function(target) {
            };
            this.renderVisual = $.noop;
            this.options = {};
        }

        function createTextBoxMock(options, floatBox) {
            createTextBox($.extend({
                align: "left",
                vAlign: "top"
            }, options));
            floatElementStub = new FloatElementStub(floatBox || Box2D(0,0,30,30));
            textBox.children = [floatElementStub];
            textBox.container = floatElementStub;
        }

        module("TextBox / reflow", {});

        test("updates float element align option", function() {
            createTextBoxMock();
            textBox.options.align = "right";
            textBox.reflow(targetBox);
            equal(floatElementStub.options.align, "right");
        });

        test("applies margin", function() {
            createTextBoxMock({margin: 5});
            textBox.reflow(targetBox);
            sameBox(textBox.box, floatElementStub.box.pad(5));
        });

        test("applies padding", function() {
            createTextBoxMock({padding: 10});
            textBox.reflow(targetBox);
            sameBox(textBox.box, floatElementStub.box.pad(10));
        });

        test("applies border", function() {
            createTextBoxMock({border: {width: 15}});
            textBox.reflow(targetBox);
            sameBox(textBox.box, floatElementStub.box.pad(15));
        });

        // ------------------------------------------------------------
        module("TextBox / reflow / align", {
            setup: function() {
                createTextBoxMock();
            }
        });

        test("top", function() {
            textBox.options.vAlign = "top";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.y1, 0);
            equal(floatElementStub.box.y2, 30);
            equal(textBox.box.y1, 0);
            equal(textBox.box.y2, 30);
        });

        test("bottom", function() {
            textBox.options.vAlign = "bottom";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.y1, 70);
            equal(floatElementStub.box.y2, 100);
            equal(textBox.box.y1, 70);
            equal(textBox.box.y2, 100);
        });

        test("vertical center", function() {
            textBox.options.vAlign = "center";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.y1, 35);
            equal(floatElementStub.box.y2, 65);
            equal(textBox.box.y1, 35);
            equal(textBox.box.y2, 65);
        });

        test("left", function() {
            textBox.options.align = "left";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.x1, 0);
            equal(floatElementStub.box.x2, 30);
            equal(textBox.box.x1, 0);
            equal(textBox.box.x2, 30);
        });

        test("right", function() {
            textBox.options.align = "right";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.x1, 70);
            equal(floatElementStub.box.x2, 100);
            equal(textBox.box.x1, 70);
            equal(textBox.box.x2, 100);
        });

        test("horizontal center", function() {
            textBox.options.align = "center";
            textBox.reflow(targetBox);
            equal(floatElementStub.box.x1, 35);
            equal(floatElementStub.box.x2, 65);
            equal(textBox.box.x1, 35);
            equal(textBox.box.x2, 65);
        });

        // ------------------------------------------------------------
        module("TextBox / reflow / rotation", {
            setup: function() {
                createTextBoxMock({rotation: 90}, Box2D(0,0,20,30));
            }
        });

        test("rotates box", function() {
            textBox.reflow(targetBox);
            sameBox(textBox.box, Box2D(0,0, 30, 20));
        });

        test("sets normal box to box prior to rotation", function() {
            textBox.reflow(targetBox);
            sameBox(textBox.normalBox, Box2D(0,0, 20, 30));
        });

        test("sets normal box to box prior to rotation without margin", function() {
            textBox.options.margin = 5;
            textBox.reflow(targetBox);
            sameBox(textBox.normalBox, Box2D(5,5, 25, 35));
        });

        test("rotates box without margin and translates the rotated box with the margin", function() {
            textBox.options.margin = 5;
            textBox.reflow(targetBox);
            sameBox(textBox.rotatedBox, Box2D(0,0, 30, 20));
        });

        test("box is equal to the rotated box with margin applied", function() {
            textBox.options.margin = 5;
            textBox.reflow(targetBox);
            sameBox(textBox.box, Box2D(-5, -5, 35, 25));
        });

        // ------------------------------------------------------------
        module("TextBox / reflow / rotation / align", {
            setup: function() {
                createTextBoxMock({rotation: 90}, Box2D(0,0,20,30));
            }
        });

        test("top", function() {
            textBox.options.vAlign = "top";
            textBox.reflow(targetBox);
            equal(textBox.box.y1, 0);
            equal(textBox.box.y2, 20);
        });

        test("bottom", function() {
            textBox.options.vAlign = "bottom";
            textBox.reflow(targetBox);
            equal(textBox.box.y1, 80);
            equal(textBox.box.y2, 100);
        });

        test("vertical center", function() {
            textBox.options.vAlign = "center";
            textBox.reflow(targetBox);
            equal(textBox.box.y1, 40);
            equal(textBox.box.y2, 60);
        });

        test("left", function() {
            textBox.options.align = "left";
            textBox.reflow(targetBox);
            equal(textBox.box.x1, 0);
            equal(textBox.box.x2, 30);
        });

        test("right", function() {
            textBox.options.align = "right";
            textBox.reflow(targetBox);
            equal(textBox.box.x1, 70);
            equal(textBox.box.x2, 100);
        });

        test("horizontal center", function() {
            textBox.options.align = "center";
            textBox.reflow(targetBox);
            equal(textBox.box.x1, 35);
            equal(textBox.box.x2, 65);
        });

        // ------------------------------------------------------------
        function renderTextBox(options, text) {
            createTextBox(options, text);
            textBox.renderVisual();
        }

        module("TextBox / rendering", {
            setup: function() {
                moduleSetup();
            }
        });

        test("renders group", function() {
            renderTextBox();
            ok(textBox.visual);
        });

        test("sets transformation if rotation is set", function() {
            createTextBoxMock({rotation: 90}, Box2D(0,0,20,30));
            textBox.reflow(targetBox);
            textBox.renderVisual();

            var matrix = textBox.visual.transform().matrix();
            var tolerance = 0.01;
            close(matrix.a, 0, tolerance);
            close(matrix.b, 1, tolerance);
            close(matrix.c, -1, tolerance);
            close(matrix.d, 0, tolerance);
            close(matrix.e, 30, tolerance);
            close(matrix.f, 0, tolerance);
        });

        test("sets zIndex", function() {
            renderTextBox({zIndex: 1});
            equal(textBox.visual.options.zIndex, 1);
        });

        test("creates rect when background is set", function() {
            renderTextBox({background: "foo"});
            ok(textBox.visual.children[0] instanceof draw.Path);
        });

        test("creates rect when border is set", function() {
            renderTextBox({border: { width: 1 }});
            ok(textBox.visual.children[0] instanceof draw.Path);
        });

        test("creates text", function() {
            renderTextBox();
            ok(textBox.visual.children[0] instanceof draw.Text);
        });

        test("creates text for each line", function() {
            renderTextBox({}, "line1 \n line2");
            equal(textBox.visual.children.length, 2);
        });

        // ------------------------------------------------------------
        module("TextBox / rendering / rect options", {
            setup: function() {
                moduleSetup();
                renderTextBox({
                    id: "1",
                    zIndex: 1,
                    border: {
                        width: 2,
                        color: "red",
                        opacity: 0.5,
                        dashType: "foo"
                    },
                    background: "green",
                    opacity: 0.7
                });

                rect = textBox.visual.children[0];
            }
        });

        test("sets stroke options", function() {
            equal(rect.options.stroke.color, "red");
            equal(rect.options.stroke.width, 2);
            equal(rect.options.stroke.opacity, 0.5);
            equal(rect.options.stroke.dashType, "foo");
        });

        test("sets fill", function() {
            equal(rect.options.fill.color, "green");
            equal(rect.options.fill.opacity, 0.7);
        });

        // ------------------------------------------------------------
        (function() {
            var BOX = new Box2D(10, 20, 30, 40);
            var RECT = BOX.toRect();
            var customVisual = draw.Path.fromRect(new geom.Rect([0,0], [100, 200]));

            function renderTextBox(options,box) {
                createTextBox(options);
                textBox.getChart = function() {
                    return "chart";
                };
                textBox.reflow(box || BOX);
                textBox.renderVisual();
            }

            module("TextBox / rendering / visual", {
                setup: function() {
                    moduleSetup();
                }
            });

            test("renders custom visual if the visual option is set", 3, function() {
                renderTextBox({
                    visual: function() {
                        ok(true);
                        return customVisual;
                    }
                });
                ok(textBox.visual === customVisual);
            });

            test("appends custom visual", 3, function() {
                createTextBox({
                    visual: function() {
                        ok(true);
                        return customVisual;
                    }
                });

                textBox.getChart = $.noop;
                textBox.parent = {
                    appendVisual: function(visual) {
                        ok(visual === customVisual);
                    }
                };
                textBox.reflow(BOX);
                textBox.renderVisual();
            });

            test("does not render default visual if visual function returns nothing", function() {
                renderTextBox({
                    visual: function() {}
                });
                ok(!textBox.visual);
            });

            test("passes the text", function() {
                renderTextBox({
                    visual: function(e) {
                        equal(e.text, TEXT);
                    }
                });
            });

            test("passes the chart instance", function() {
                renderTextBox({
                    visual: function(e) {
                        if (e.sender) {
                            equal(e.sender, "chart");
                        }
                    }
                });
            });

            test("passes the textbox original size as rect initially", 1, function() {
                var initial = true;
                renderTextBox({
                    visual: function(e) {
                        if (initial) {
                            ok(e.rect.equals(e.createVisual().bbox()));
                        }
                        initial = false;
                    }
                });
            });

            test("passes the textbox target box as rect", 1, function() {
                var initial = true;
                renderTextBox({
                    visual: function(e) {
                        if (!initial) {
                            ok(e.rect.equals(RECT));
                        }
                        initial = false;
                    }
                });
            });

            test("the createVisual function returns the reflowed visual", function() {
                var initial = true;
                createTextBox({
                    visual: function(e) {
                        if (!initial) {
                            var defaultVisual = e.createVisual();
                            ok(defaultVisual.bbox().equals(new geom.Rect([10, 20], [120, 15])));
                        }
                        initial = false;
                    }
                }, Box2D(0, 0, 10, 10));

                textBox.reflow(BOX);
                textBox.renderVisual();
            });

            test("sets the textbox box based on the visual bbox", function() {
                 renderTextBox({
                    visual: function(e) {
                        return customVisual;
                    }
                });
                ok(textBox.box.toRect().equals(customVisual.bbox()));
            });

            test("passes the text options", function() {
                var textBoxOptions = {
                    background: "red",
                    border: {
                        width: 3,
                        color: "blue"
                    },
                    color: "green",
                    font: "foo",
                    margin: {
                        left: 2,
                        top: 2,
                        botom: 2,
                        right: 2
                    },
                    padding: {
                        left: 3,
                        top: 3,
                        botom: 3,
                        right: 3
                    },
                    visible: false
                };

                renderTextBox(kendo.deepExtend({}, textBoxOptions, {
                    visual: function(e) {
                        deepEqual(e.options, textBoxOptions);
                    }
                }));
            });

            test("sets noclip on custom visual", function() {
                renderTextBox({
                    noclip: true,
                    visual: function() {
                        return customVisual;
                    }
                });

                ok(textBox.visual.options.noclip);
            });

            test("sets zIndex on custom visual", function() {
                renderTextBox({
                    zIndex: 4,
                    visual: function() {
                        return customVisual;
                    }
                });

                equal(textBox.visual.options.zIndex, 4);
            });

            test("creates animation for custom visual", function() {
                renderTextBox({
                    animation: {
                        type: "fadein"
                    },
                    visual: function() {
                        return customVisual;
                    }
                });

                ok(textBox.animation);
            });

        })();

    })();

    (function() {
        var label,
            AxisLabel = dataviz.AxisLabel,
            TEXT = "text",
            targetBox = Box2D(10, 10, 100, 100),
            rect;

        function createLabel(options, text) {
            label = new AxisLabel(null, text || TEXT, 0, null, options);
        }

        // ------------------------------------------------------------
        module("AxisLabel / rotation / top anchor", {
            setup: function() {
                createLabel({
                    rotation: 30,
                    align: "center"
                });
                label.options.rotationOrigin = "top";
                label.reflow(targetBox);
            }
        });

        test("aligns text to the top border", function() {
            equal(label.box.y1, 10);
        });

        test("aligns text closest end center to the target center", function() {
            equal(label.box.x1, 51.25);

            label.options.rotation = -30;
            label.reflow(targetBox);

            equal(label.box.x2, 58.75);
        });

        test("aligns text center to the target center if the text is parallel to the origin after the rotation", function() {
            label.options.rotation = 180;
            label.reflow(targetBox);

            equal(label.box.center().x, targetBox.center().x);
        });

        test("aligns text center to the target center if alignRotation is set to center", function() {
            label.options.alignRotation = "center";
            label.reflow(targetBox);

            equal(label.box.center().x, targetBox.center().x);
        });

        // ------------------------------------------------------------
        module("AxisLabel / rotation / bottom anchor", {
            setup: function() {
                createLabel({
                    rotation: 30,
                    align: "center"
                });
                label.options.rotationOrigin = "bottom";
                label.reflow(targetBox);
            }
        });

        test("aligns text to the top border", function() {
            equal(label.box.y1, 10);
        });

        test("aligns text closest end center to the target center", function() {
            equal(label.box.x2, 58.75);

            label.options.rotation = -30;
            label.reflow(targetBox);

            equal(label.box.x1, 51.25);
        });

        test("aligns text center to the target center if the text is parallel to the origin after the rotation", function() {
            label.options.rotation = 180;
            label.reflow(targetBox);

            equal(label.box.center().x, targetBox.center().x);
        });

        test("aligns text center to the target center if alignRotation is set to center", function() {
            label.options.alignRotation = "center";
            label.reflow(targetBox);

            equal(label.box.center().x, targetBox.center().x);
        });

        // ------------------------------------------------------------
        module("AxisLabel / rotation / left anchor", {
            setup: function() {
                createLabel({
                    rotation: 30,
                    align: "center",
                    vAlign: "center"
                });
                label.options.rotationOrigin = "left";
                label.reflow(targetBox);
            }
        });

        test("aligns text to the left border", function() {
            equal(label.box.x1, 10);
        });

        test("aligns text closest end center to the target center", function() {
            close(label.box.y1, 48.5, 0.1);

            label.options.rotation = -30;
            label.reflow(targetBox);

            close(label.box.y2, 61.5, 0.1);
        });

        test("aligns text center to the target center if the text is parallel to the origin after the rotation", function() {
            label.options.rotation = 90;
            label.reflow(targetBox);

            equal(label.box.center().y, targetBox.center().y);
        });

        test("aligns text center to the target center if alignRotation is set to center", function() {
            label.options.alignRotation = "center";
            label.reflow(targetBox);

            equal(label.box.center().y, targetBox.center().y);
        });

        // ------------------------------------------------------------
        module("AxisLabel / rotation / right anchor", {
            setup: function() {
                createLabel({
                    rotation: 30,
                    align: "center",
                    vAlign: "center"
                });
                label.options.rotationOrigin = "right";
                label.reflow(targetBox);
            }
        });

        test("aligns text to the left border", function() {
            equal(label.box.x1, 10);
        });

        test("aligns text closest end center to the target center", function() {
            close(label.box.y2, 61.5, 0.1);

            label.options.rotation = -30;
            label.reflow(targetBox);

            close(label.box.y1, 48.5, 0.1);
        });

        test("aligns text center to the target center if the text is parallel to the origin after the rotation", function() {
            label.options.rotation = 90;
            label.reflow(targetBox);

            equal(label.box.center().y, targetBox.center().y);
        });

        test("aligns text center to the target center if alignRotation is set to center", function() {
            label.options.alignRotation = "center";
            label.reflow(targetBox);

            equal(label.box.center().y, targetBox.center().y);
        });

    })();

    (function() {
        var legend,
            MARKER_MARGIN = MARKER_SIZE = 7,
            MARGIN = 10;

        function createLegend(options) {
            legend = new dataviz.Legend($.extend({
                items: [ { text: "Series 1" } ],
                labels: {
                    font: SANS12
                }
            }, options));

            legend.reflow(chartBox);
            legend.renderVisual();
        }

        // ------------------------------------------------------------
        module("Legend", {
            setup: function() {
                moduleSetup();

                createLegend();
            },
            teardown: moduleTeardown
        });

        test("renders legend in a group", function() {
            ok(legend.visual instanceof draw.Group);
        });

        test("renders no elements if legend has no items", function() {
            createLegend({items: []});

            ok(!legend.visual);
        });

        test("sets zIndex on group", function() {
            createLegend({
                zIndex: 10
            });

            equal(legend.visual.options.zIndex, 10);
        });

        test("default zIndex is 1", function() {
            equal(legend.options.zIndex, 1);
        });

        test("positions legend to absolute vertical center (relative to y=0)", function() {
            legend = new dataviz.Legend({
                items: [ { text: "Series 1" } ]
            });

            var legendBox = chartBox.clone().translate(100, 100);
            legend.reflow(legendBox);

            var label = legend.children[0];
            equal(label.box.y1,
                 (legendBox.y2 - label.box.height()) / 2);
        });

        test("legend fills available height", function() {
            deepEqual([legend.box.y1, legend.box.y2], [chartBox.y1, chartBox.y2]);
        });

        // ------------------------------------------------------------
        var baseWidth,
            baseHeight;

        module("Legend position", {
            setup: function() {
                moduleSetup();

                createLegend({ margin: 0 });
                baseWidth = legend.box.width();

                createLegend({ margin: 0, position: "top" });
                baseHeight = legend.box.height();
            },
            teardown: moduleTeardown
        });

        test("positions legend to the right", function() {
            createLegend({
                position: "right",
                margin: 0
            });

            equal(legend.box.x1, chartBox.x2 - legend.box.width());
        });

        test("positions legend to the left", function() {
            createLegend({
                position: "left"
            });

            equal(legend.box.x1, chartBox.x1);
            equal(legend.box.x2, chartBox.x1 + legend.box.width());
        });

        test("positions legend to the top", function() {
            createLegend({
                position: "top"
            });

            equal(legend.box.y1, chartBox.y1);
        });

        test("positions legend to the bottom should have correct box", function() {
            createLegend({
                position: "bottom"
            });

            var legendBox = legend.children[0].box;

            sameBox(legendBox, new Box2D(453, 965, 552, 1000), TOLERANCE);
        });

        test("positions legend to the top should have correct box", function() {
            createLegend({
                position: "top"
            });

            var legendBox = legend.children[0].box;

            sameBox(legendBox, new Box2D(453, 5, 552, 40), TOLERANCE);
        });

        test("positions legend to the bottom", function() {
            createLegend({
                position: "bottom"
            });

            close(legend.box.y1, chartBox.y2 - legend.box.height(), TOLERANCE);
        });

        test("applies left and right margin when positioned to the right", function() {
            createLegend({
                position: "right",
                margin: MARGIN
            });

            equal(legend.box.x1, chartBox.x2 - baseWidth - 2 * MARGIN);
        });

        test("applies left and right margin when positioned to the left", function() {
            createLegend({
                position: "left",
                margin: MARGIN
            });

            equal(legend.box.x2, chartBox.x1 + baseWidth + 2 * MARGIN);
        });

        test("applies top and bottom margin when positioned to the top", function() {
            createLegend({
                position: "top",
                margin: MARGIN
            });

            equal(legend.box.y2, chartBox.y1 + baseHeight + 2 * MARGIN);
        });

        test("applies top and bottom margin when positioned to the bottom", function() {
            createLegend({
                position: "bottom",
                margin: MARGIN
            });
            equal(legend.box.y1, chartBox.y2 - baseHeight - 2 * MARGIN);
        });

        // ------------------------------------------------------------
       (function() {
            var innerContainer;

            function isVertical(value) {
                innerContainer = legend.children[0].children[0];
                equal(innerContainer.options.vertical, value);
            }

            module("Legend / orientation");

            test("sets orientation to horizontal for top position by default", function() {
                createLegend({
                    position: "top"
                });

                isVertical(false);
            });

            test("sets orientation to horizontal for top position if orientation is set to horizontal", function() {
                createLegend({
                    position: "top",
                    orientation: "horizontal"
                });

                isVertical(false);
            });

            test("sets orientation to horizontal for top position if orientation is set to vertical", function() {
                createLegend({
                    position: "top",
                    orientation: "vertical"
                });

                isVertical(true);
            });

            test("sets orientation to horizontal for bottom position by default", function() {
                createLegend({
                    position: "bottom"
                });

                isVertical(false);
            });

            test("sets orientation to horizontal for bottom position if orientation is set to horizontal", function() {
                createLegend({
                    position: "bottom",
                    orientation: "horizontal"
                });

                isVertical(false);
            });

            test("sets orientation to horizontal for bottom position if orientation is set to vertical", function() {
                createLegend({
                    position: "bottom",
                    orientation: "vertical"
                });

                isVertical(true);
            });

            test("sets orientation to vertical for left position by default", function() {
                createLegend({
                    position: "left"
                });

                isVertical(true);
            });

            test("sets orientation to horizontal for left position if orientation is set to horizontal", function() {
                createLegend({
                    position: "left",
                    orientation: "horizontal"
                });

                isVertical(false);
            });

            test("sets orientation to vertical for left position if orientation is set to vertical", function() {
                createLegend({
                    position: "left",
                    orientation: "vertical"
                });

                isVertical(true);
            });


            test("sets orientation to vertical for right position by default", function() {
                createLegend({
                    position: "right"
                });

                isVertical(true);
            });

            test("sets orientation to horizontal for right position if orientation is set to horizontal", function() {
                createLegend({
                    position: "right",
                    orientation: "horizontal"
                });

                isVertical(false);
            });

            test("sets orientation to vertical for right position if orientation is set to vertical", function() {
                createLegend({
                    position: "right",
                    orientation: "vertical"
                });

                isVertical(true);
            });

        })();

        // ------------------------------------------------------------
       (function() {
            function createLegend(options) {
                legend = new dataviz.Legend($.extend({
                    items: [ { text: "Series 1" } ],
                    labels: {
                        font: SANS12
                    }
                }, options));
            }

            module("Legend / height");

            test("reflows container in a box with the specified height for top position with vertical orientation", function() {
                createLegend({
                    position: "top",
                    orientation: "vertical",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height aligned to the top for top position with vertical orientation", function() {
                createLegend({
                    position: "top",
                    orientation: "vertical",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, chartBox.y1);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height for bottom position with vertical orientation", function() {
                createLegend({
                    position: "bottom",
                    orientation: "vertical",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height aligned to the bottom for bottom position with vertical orientation", function() {
                createLegend({
                    position: "bottom",
                    orientation: "vertical",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.y2, chartBox.y2);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height for left position", function() {
                createLegend({
                    position: "left",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified height for left position", function() {
                createLegend({
                    position: "left",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, (chartBox.height() +  chartBox.y1 - 100) / 2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in top aligned box with the specified height for left position with align set to start", function() {
                createLegend({
                    position: "left",
                    height: 100,
                    align: "start"
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, 0);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified height for left position with align set to center", function() {
                createLegend({
                    position: "left",
                    height: 100,
                    align: "center"
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, (chartBox.height() +  chartBox.y1 - 100) / 2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in bottom aligned box with the specified height for left position with align set to end", function() {
                createLegend({
                    position: "left",
                    height: 100,
                    align: "end"
                });

                legend.container.reflow = function(box) {
                    equal(box.y2, chartBox.y2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height for right position", function() {
                createLegend({
                    position: "right",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified height for right position", function() {
                createLegend({
                    position: "right",
                    height: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, (chartBox.height() +  chartBox.y1 - 100) / 2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in top aligned box with the specified height for right position with align set to start", function() {
                createLegend({
                    position: "right",
                    height: 100,
                    align: "start"
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, 0);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified height for right position with align set to center", function() {
                createLegend({
                    position: "right",
                    height: 100,
                    align: "center"
                });

                legend.container.reflow = function(box) {
                    equal(box.y1, (chartBox.height() +  chartBox.y1 - 100) / 2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in bottom aligned box with the specified height for right position with align set to end", function() {
                createLegend({
                    position: "right",
                    height: 100,
                    align: "end"
                });

                legend.container.reflow = function(box) {
                    equal(box.y2, chartBox.y2);
                    equal(box.height(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            // ------------------------------------------------------------
            module("Legend / width");

            test("reflows container in a box with the specified width for left position with horizontal orientation", function() {
                createLegend({
                    position: "left",
                    orientation: "horizontal",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified height aligned to the left for left position with horizontal orientation", function() {
                createLegend({
                    position: "left",
                    orientation: "horizontal",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified width for right position with horizontal orientation", function() {
                createLegend({
                    position: "right",
                    orientation: "horizontal",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified width aligned to the right for right position with horizontal orientation", function() {
                createLegend({
                    position: "right",
                    orientation: "horizontal",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.x2, chartBox.x2);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });



            test("reflows container in a box with the specified width for top position", function() {
                createLegend({
                    position: "top",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified width for top position", function() {
                createLegend({
                    position: "top",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.x1,  chartBox.x1 + (chartBox.width() - 100) / 2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in left aligned box with the specified width for top position with align set to start", function() {
                createLegend({
                    position: "top",
                    width: 100,
                    align: "start"
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified width for top position with align set to center", function() {
                createLegend({
                    position: "top",
                    width: 100,
                    align: "center"
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1 + (chartBox.width() - 100) / 2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in right aligned box with the specified width for top position with align set to end", function() {
                createLegend({
                    position: "top",
                    width: 100,
                    align: "end"
                });

                legend.container.reflow = function(box) {
                    equal(box.x2, chartBox.x2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in a box with the specified width for bottom position", function() {
                createLegend({
                    position: "bottom",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified width for bottom position", function() {
                createLegend({
                    position: "bottom",
                    width: 100
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1 + (chartBox.width() - 100) / 2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in left aligned box with the specified width for bottom position with align set to start", function() {
                createLegend({
                    position: "bottom",
                    width: 100,
                    align: "start"
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in center aligned box with the specified width for bottom position with align set to center", function() {
                createLegend({
                    position: "bottom",
                    width: 100,
                    align: "center"
                });

                legend.container.reflow = function(box) {
                    equal(box.x1, chartBox.x1 + (chartBox.width() - 100) / 2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

            test("reflows container in right aligned box with the specified width for bottom position with align set to end", function() {
                createLegend({
                    position: "bottom",
                    width: 100,
                    align: "end"
                });

                legend.container.reflow = function(box) {
                    equal(box.x2, chartBox.x2);
                    equal(box.width(), 100);
                    this.box = box;
                };

                legend.reflow(chartBox);
            });

        })();

        // ------------------------------------------------------------
        module("Legend align / position top", {});

        test("aligns content to the center by default", function() {
            createLegend({
                position: "top"
            });

            equal(legend.container.box.x1, chartBox.x1 + (chartBox.width() - legend.container.box.width()) / 2);
        });

        test("aligns content to the left if align is set to start", function() {
            createLegend({
                position: "top",
                align: "start"
            });

            equal(legend.container.box.x1, chartBox.x1);
        });

       test("aligns content to the center if align is set to center", function() {
            createLegend({
                position: "top",
                align: "center"
            });

            equal(legend.container.box.x1, chartBox.x1 + (chartBox.width() - legend.container.box.width()) / 2);
        });

        test("aligns content to the right if align is set to end", function() {
            createLegend({
                position: "top",
                align: "end"
            });

            equal(legend.container.box.x2, chartBox.x2);
        });

        // ------------------------------------------------------------
        module("Legend align / position bottom", {});

        test("aligns content to the center by default", function() {
            createLegend({
                position: "bottom"
            });

            equal(legend.container.box.x1, chartBox.x1 + (chartBox.width() - legend.container.box.width()) / 2);
        });

        test("aligns content to the left if align is set to start", function() {
            createLegend({
                position: "bottom",
                align: "start"
            });

            equal(legend.container.box.x1, chartBox.x1);
        });

       test("aligns content to the center if align is set to center", function() {
            createLegend({
                position: "bottom",
                align: "center"
            });

            equal(legend.container.box.x1, chartBox.x1 + (chartBox.width() - legend.container.box.width()) / 2);
        });

        test("aligns content to the right if align is set to end", function() {
            createLegend({
                position: "bottom",
                align: "end"
            });

            equal(legend.container.box.x2, chartBox.x2);
        });

        // ------------------------------------------------------------
        module("Legend align / position left", {});

        test("aligns content to the center by default", function() {
            createLegend({
                position: "left"
            });

            equal(legend.container.box.y1, (chartBox.height() + chartBox.y1 - legend.container.box.height()) / 2);
        });

        test("aligns content to the top if align is set to start", function() {
            createLegend({
                position: "left",
                align: "start"
            });

            equal(legend.container.box.y1, 0);
        });

        test("aligns content to the center if align is set to center", function() {
            createLegend({
                position: "left",
                align: "center"
            });

            equal(legend.container.box.y1, (chartBox.height() + chartBox.y1 - legend.container.box.height()) / 2);
        });

        test("aligns content to the bottom if align is set to end", function() {
            createLegend({
                position: "left",
                align: "end"
            });

            equal(legend.container.box.y2, chartBox.y2);
        });

        // ------------------------------------------------------------
        module("Legend align / position right", {});

        test("aligns content to the center by default", function() {
            createLegend({
                position: "right"
            });

            equal(legend.container.box.y1, (chartBox.height() + chartBox.y1 - legend.container.box.height()) / 2);
        });

        test("aligns content to the top if align is set to start", function() {
            createLegend({
                position: "right",
                align: "start"
            });

            equal(legend.container.box.y1, 0);
        });

        test("aligns content to the center if align is set to center", function() {
            createLegend({
                position: "right",
                align: "center"
            });

            equal(legend.container.box.y1, (chartBox.height() + chartBox.y1 - legend.container.box.height()) / 2);
        });

        test("aligns content to the bottom if align is set to end", function() {
            createLegend({
                position: "right",
                align: "end"
            });

            equal(legend.container.box.y2, chartBox.y2);
        });

        // ------------------------------------------------------------
        module("Legend custom position", {});

        test("sets legend box to targetBox", function() {
            createLegend({
                position: "custom"
            });

            equal(legend.box.x1, chartBox.x1);
            equal(legend.box.y1, chartBox.y1);
            equal(legend.box.x2, chartBox.x2);
            equal(legend.box.y2, chartBox.y2);
        });

        test("positions legend container at 0,0 by default", function() {
            createLegend({
                position: "custom"
            });
            var container = legend.children[0];
            equal(container.box.x1, 0);
            equal(container.box.y1, 0);
        });

        test("positions legend container at specified offset", function() {
            createLegend({
                position: "custom",
                offsetX: 100,
                offsetY: 50
            });
            var container = legend.children[0];
            equal(container.box.x1, 100);
            equal(container.box.y1, 50);
        });

        test("sets inner container direction to vertical by default", function() {
            createLegend({
                position: "custom"
            });
            var innerContainer = legend.children[0].children[0];
            equal(innerContainer.options.vertical, true);
        });

        test("sets inner container direction based on orientation option", function() {
            createLegend({
                position: "custom",
                orientation: "horizontal"
            });
            var innerContainer = legend.children[0].children[0];
            equal(innerContainer.options.vertical, false);
            createLegend({
                position: "custom",
                orientation: "vertical"
            });
            innerContainer = legend.children[0].children[0];
            equal(innerContainer.options.vertical, true);
        });

        test("reflows container in a box with the specified width for horizontal orientation", 2, function() {
            createLegend({
                position: "custom",
                orientation: "horizontal",
                width: 100
            });
            legend.container = {
                children: [{children: [1]}],
                reflow: function(box) {
                    this.box = box;

                    equal(box.width(), 100);
                }
            };
            legend.reflow(chartBox);
        });

        test("reflows container in a box with the specified height for vertical orientation", 2, function() {
            createLegend({
                position: "custom",
                orientation: "vertical",
                height: 100
            });
            legend.container = {
                children: [{children: [1]}],
                reflow: function(box) {
                    this.box = box;

                    equal(box.height(), 100);
                }
            };
            legend.reflow(chartBox);
        });

        // ------------------------------------------------------------
        var legendBox,
            BORDER_WIDTH = 2,
            BORDER_COLOR = "#f00",
            BORDER_DASH_TYPE = "dot",
            BACKGROUND = "#0f0",
            PADDING = 10;

        module("Legend / Box", {
            setup: function() {
                moduleSetup();

                legend = new dataviz.Legend({
                    items: [ { text: "Series 1", color: "#f00" } ],
                    labels: {
                        font: SANS12
                    },
                    border: {
                        color: BORDER_COLOR,
                        width: BORDER_WIDTH,
                        dashType: BORDER_DASH_TYPE
                    },
                    background: BACKGROUND,
                    padding: PADDING
                });

                legend.reflow(chartBox);
                legend.renderVisual();

                legendBox = legend.container.visual.children[0];
            },
            teardown: moduleTeardown
        });

        test("renders box with padding", function() {
            sameRectPath(legendBox, [894, 482.5, 993, 517.5], TOLERANCE);
        });

        test("renders border width", function() {
            deepEqual(legendBox.options.stroke.width, BORDER_WIDTH);
        });

        test("renders border color", function() {
            deepEqual(legendBox.options.stroke.color, BORDER_COLOR);
        });

        test("renders border dashType", function() {
            deepEqual(legendBox.options.stroke.dashType, BORDER_DASH_TYPE);
        });

        test("renders background color", function() {
            deepEqual(legendBox.options.fill.color, BACKGROUND);
        });

        // ------------------------------------------------------------

        var legendSeries = [{name: "item1"}, {name: "item2"}],
            legendItems;

        function createLegendWithItems(options) {
            createLegend($.extend({
                items: [{
                    active: true,
                    text: "item1",
                    labels:  {
                        color: "blue",
                        font: "foo"
                    },
                    markerColor: "red",
                    series: legendSeries
                },{
                    active: false,
                    text: "item2",
                    labels:  {
                        color: "green",
                        font: "bar"
                    },
                    markerColor: "pink",
                    series: legendSeries
                }],
                labels: {
                    color: "cyan",
                    font: SANS12,
                    margin: 5
                },
                markers: {
                    border: {
                        width: 2,
                        color: "yellow"
                    },
                    size: 10,
                    margin: 5,
                    type: "circle",
                    padding: 5
                }
            }, options));
            legendItems = legend.container.children[0].children;
        }

        module("Legend / items", {
            setup: function() {
                createLegendWithItems();
            },
            teardown: destroyChart
        });

        test("uses LegendLayout to align items", function() {
            ok(legend.container.children[0] instanceof dataviz.LegendLayout);
        });

        test("sets float element options", function() {
            var layoutOptions = legend.container.children[0].options;
            equal(layoutOptions.spacing, legend.options.spacing);
            equal(layoutOptions.vertical, true);
            createLegendWithItems({position: "top"});
            layoutOptions = legend.container.children[0].options;
            equal(layoutOptions.spacing, legend.options.spacing);
            equal(layoutOptions.vertical, false);
        });

        test("appends items to float element", function() {
            equal(legendItems.length, 2);
        });

        test("sets active state", function() {
            equal(legendItems[0].options.active, true);
            equal(legendItems[1].options.active, false);
        });

        test("sets markerColor", function() {
            equal(legendItems[0].options.markerColor, "red");
            equal(legendItems[1].options.markerColor, "pink");
        });

        test("sets text", function() {
            equal(legendItems[0].options.text, "item1");
            equal(legendItems[1].options.text, "item2");
        });

        test("reverses items", function() {
            createLegendWithItems({
                reverse: true
            });

            equal(legendItems[0].options.text, "item2");
            equal(legendItems[1].options.text, "item1");
        });

        test("sets series", function() {
            deepEqual(legendItems[0].options.series, legendSeries);
            deepEqual(legendItems[1].options.series, legendSeries);
        });

        test("sets item labels color", function() {
            equal(legendItems[0].options.labels.color, "blue");
            equal(legendItems[1].options.labels.color, "green");
        });

        test("sets options labels color if item has no labels color set", function() {
            createLegendWithItems({
                items: [{
                    text: "item1"
                }, {
                    text: "item2"
                }]
            });
            equal(legendItems[0].options.labels.color, "cyan");
            equal(legendItems[1].options.labels.color, "cyan");
        });

        test("sets item labels font", function() {
            equal(legendItems[0].options.labels.font, "foo");
            equal(legendItems[1].options.labels.font, "bar");
        });

        test("sets options labels font if item has no labels font set", function() {
            createLegendWithItems({
                items: [{
                    text: "item1"
                }, {
                    text: "item2"
                }]
            });
            equal(legendItems[0].options.labels.font, SANS12);
            equal(legendItems[1].options.labels.font, SANS12);
        });

        test("sets labels margin", function() {
            equal(legendItems[0].options.labels.margin, 5);
            equal(legendItems[1].options.labels.margin, 5);
        });

       test("sets markers border", function() {
            var border = legendItems[0].options.markers.border;
            equal(border.width, 2);
            equal(border.color, "yellow");
            border = legendItems[1].options.markers.border;
            equal(border.width, 2);
            equal(border.color, "yellow");
        });

        test("sets markers size", function() {
            equal(legendItems[0].options.markers.size, 10);
            equal(legendItems[1].options.markers.size, 10);
        });

        test("sets markers margin", function() {
            equal(legendItems[0].options.markers.margin, 5);
            equal(legendItems[1].options.markers.margin, 5);
        });

        test("sets markers padding", function() {
            equal(legendItems[0].options.markers.padding, 5);
            equal(legendItems[1].options.markers.padding, 5);
        });

        test("sets markers type", function() {
            equal(legendItems[0].options.markers.padding, 5);
            equal(legendItems[1].options.markers.padding, 5);
        });

        test("sets item options", function() {
            equal(legendItems[0].options.zIndex, legend.options.item.zIndex);
            equal(legendItems[0].options.cursor.style, legend.options.item.cursor.style);
        });

        // ------------------------------------------------------------

        var legendItem,
            container,
            marker,
            textbox;

        function createLegendItem(options) {
            legendItem = new dataviz.LegendItem($.extend({
                active: true,
                text: "item1",
                markerColor: "red",
                series: legendSeries,
                labels: {
                    color: "cyan",
                    font: SANS12,
                    margin: 5
                },
                markers: {
                    border: {
                        width: 2
                    },
                    width: 10,
                    height: 10,
                    margin: 5,
                    type: "triangle",
                    padding: 5
                }
            }, options));

            container = legendItem.children[0];
            marker = container.children[0];
            textbox = container.children[1];
        }

        module("LegendItem", {
            setup: function() {
                createLegendItem();
            }
        });

        test("uses float element to align children", function() {
            ok(container instanceof dataviz.FloatElement);
        });

        test("sets float element options", function() {
            equal(container.options.wrap, false);
            equal(container.options.vertical, false);
            equal(container.options.align, "center");
        });

        test("appends marker to container", function() {
            ok(marker instanceof dataviz.ShapeElement);
        });

        test("sets marker color to border color and background", function() {
            equal(marker.options.border.color, "red");
            equal(marker.options.background, "red");
        });

        test("sets marker type", function() {
            equal(marker.options.type, "triangle");
        });

        test("sets marker width and height", function() {
            equal(marker.options.width, 10);
            equal(marker.options.height, 10);
        });

        test("sets marker border width", function() {
            equal(marker.options.border.width, 2);
        });

        test("sets marker margin", function() {
            equal(marker.options.margin, 5);
        });

        test("sets marker padding", function() {
            equal(marker.options.padding, 5);
        });

        test("appends textbox to container", function() {
            ok(textbox instanceof dataviz.TextBox);
        });

        test("sets textbox text", function() {
            equal(textbox.content, "item1");
        });

        test("sets textbox color", function() {
            equal(textbox.options.color, "cyan");
        });

        test("sets textbox font", function() {
            equal(textbox.options.font, SANS12);
        });

        test("sets textbox margin", function() {
            equal(textbox.options.margin, 5);
        });

        // ------------------------------------------------------------
        (function() {
            var box = new Box2D(0, 0, 100, 100);
            var customVisual;

            function renderLegendItem(options) {
                createLegendItem(options);
                legendItem.reflow(box);
                legendItem.renderVisual();
            }

            module("LegendItem / Visual", {
                setup: function() {
                    customVisual = new draw.Path();
                }
            });

            test("creates custom visual if visual option is set", function() {
                renderLegendItem({
                    visual: function() {
                        return customVisual;
                    }
                });
                ok(legendItem.visual === customVisual);
            });

            test("appends custom visual", function() {
                createLegendItem({
                    visual: function() {
                        return customVisual;
                    }
                });
                legendItem.reflow(box);
                legendItem.parent = {
                    appendVisual: function(visual) {
                        ok(visual === customVisual);
                    }
                };
                legendItem.renderVisual();
            });

            test("does not create default visual if custom visual function returns nothing", function() {
                renderLegendItem({
                    visual: function() {
                    }
                });
                ok(!legendItem.visual);
            });

            test("does not append default visual if createVisual is called", 0, function() {
                createLegendItem({
                    visual: function(e) {
                        e.createVisual();
                    }
                });
                legendItem.reflow(box);
                legendItem.parent = {
                    getRoot: $.noop,
                    appendVisual: function(visual) {
                        ok(false);
                    }
                };
                legendItem.renderVisual();
            });

            test("passes active as parameter", function() {
                renderLegendItem({
                    visual: function(e) {
                       ok(e.active);
                    }
                });
            });

            test("passes series as parameter", function() {
                renderLegendItem({
                    visual: function(e) {
                        deepEqual(e.series, legendItem.options.series);
                    }
                });
            });

            test("passes pointIndex as parameter", function() {
                renderLegendItem({
                    pointIndex: 3,
                    visual: function(e) {
                        deepEqual(e.pointIndex, 3);
                    }
                });
            });

            test("passes options", function() {
                renderLegendItem({
                    visual: function(e) {
                       var options = legendItem.options;
                       deepEqual(e.options, {
                            labels: legendItem.options.labels,
                            markers: legendItem.markerOptions()
                       });
                    }
                });
            });

            test("passes function that returns the default visual", function() {
                renderLegendItem({
                    visual: function(e) {
                       var defaultVisual = e.createVisual();
                       ok(defaultVisual.children[0] instanceof draw.Path);
                       ok(defaultVisual.children[1].children[0] instanceof draw.Text);
                       ok(defaultVisual.children[2] instanceof draw.Path);
                    }
                });
            });

            test("sets item cursor from object", function() {
                renderLegendItem({
                    text: "item1",
                    cursor: {
                        style: "foo"
                    }
                });

                equal(legendItem._itemOverlay.options.cursor, "foo");
            });

            test("sets item cursor from string", function() {
                renderLegendItem({
                    text: "item1",
                    cursor: "foo"
                });

                equal(legendItem._itemOverlay.options.cursor, "foo");
            });
        })();

        // ------------------------------------------------------------
        var chart,
            legend,
            legendItemOverlay;

        function setupLegendItemEvent(options, itemIndex) {
            chart = createChart($.extend(true, {
                series: [{
                    type: "line",
                    data: [1,2,3],
                    name: "test",
                    color: "color"
                }]
            }, options));

            legend = chart._model.children[0];
            legendItem = legend.children[0].children[0].children[itemIndex || 0];

            legendItemOverlay = $(legendItem._itemOverlay.observers()[0].element);
        }

        module("LegendItem / Events / click", {
            teardown: destroyChart
        });

        test("fires when clicking item overlay", 1, function() {
            setupLegendItemEvent({
                legendItemClick: function() { ok(true); }
            });
            clickChart(chart, legendItemOverlay);
        });

        test("event arguments contain DOM element", 1, function() {
            setupLegendItemEvent({
                legendItemClick: function(e) {
                    equal(e.element.length, 1);
                }
            });
            clickChart(chart, legendItemOverlay);
        });

        test("event arguments contain series name as text", 1, function() {
            setupLegendItemEvent({
                legendItemClick: function(e) {
                    equal(e.text, "test");
                }
            });
            clickChart(chart, legendItemOverlay);
        });

        test("event arguments contain series", 1, function() {
            setupLegendItemEvent({
                legendItemClick: function(e) {
                    equal(e.series.type, "line");
                }
            });
            clickChart(chart, legendItemOverlay);
        });

        test("event arguments contain seriesIndex", 1, function() {
            setupLegendItemEvent({
                series: [{
                    name: "series1"
                }, {
                    name: "series2"
                }],
                legendItemClick: function(e) {
                    equal(e.seriesIndex, 1);
                }
            }, 1);
            clickChart(chart, legendItemOverlay);
        });

        // ------------------------------------------------------------
        module("LegendItem / Events / hover", {
            teardown: destroyChart
        });

        test("fires when hovering item overlay", 1, function() {
            setupLegendItemEvent({
                legendItemHover: function() { ok(true); }
            });
            triggerEvent("mouseover", legendItemOverlay);
        });

        test("event arguments contain DOM element", 1, function() {
            setupLegendItemEvent({
                legendItemHover: function(e) {
                    equal(e.element.length, 1);
                }
            });
            triggerEvent("mouseover", legendItemOverlay);
        });

        test("event arguments contain series name as text", 1, function() {
            setupLegendItemEvent({
                legendItemHover: function(e) {
                    equal(e.text, "test");
                }
            });
            triggerEvent("mouseover", legendItemOverlay);
        });

        test("event arguments contain series", 1, function() {
            setupLegendItemEvent({
                legendItemHover: function(e) {
                    equal(e.series.type, "line");
                }
            });
            triggerEvent("mouseover", legendItemOverlay);
        });

        test("event arguments contain seriesIndex", 1, function() {
            setupLegendItemEvent({
                series: [{
                    name: "series1"
                }, {
                    name: "series2"
                }],
                legendItemHover: function(e) {
                    equal(e.seriesIndex, 1);
                }
            }, 1);
            triggerEvent("mouseover", legendItemOverlay);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var box = new Box2D(10, 20 , 30, 40);
        var LegendLayout = dataviz.LegendLayout;
        var layout;

        function createLayout(options) {
            layout = new LegendLayout(kendo.deepExtend({
                spacing: 5,
                vertical: true
            }, options));
        }

        module("LegendLayout", {
            setup: function() {
                createLayout();
            }
        });

        test("render creates drawing Layout visual", function() {
            layout.render();
            ok(layout.visual instanceof draw.Layout);
        });

        test("sets spacing based on the orientation", function() {
            layout.render();
            equal(layout.visual.options.spacing, 0);
            equal(layout.visual.options.lineSpacing, 5);
            layout.options.vertical = false;
            layout.render();
            equal(layout.visual.options.spacing, 5);
            equal(layout.visual.options.lineSpacing, 0);
        });

        test("sets orientation", function() {
            layout.render();
            equal(layout.visual.options.orientation, "vertical");
            layout.options.vertical = false;
            layout.render();
             equal(layout.visual.options.orientation, "horizontal");
        });

        test("render reflows and renders children", 2, function() {
            layout.children.push({
                reflow: function() {
                    ok(true);
                },
                renderVisual: function() {
                    ok(true);
                }
            })
            layout.render();
        });

        // ------------------------------------------------------------
        module("LegendLayout / reflow", {
            setup: function() {
                createLayout();
                layout.render();
            }
        });

        test("reflow sets rect to layout", function() {
            layout.reflow(box);
            ok(layout.visual.rect().equals(box.toRect()));
        });

        test("reflow sets reflows visual", function() {
            layout.visual.reflow = function() {
                ok(true);
            };
            layout.reflow(box);
        });

        test("reflow sets box based on visual bbox", function() {
            var rect = new geom.Rect([50, 60], [100, 200]);
            layout.visual.clippedBBox = function() {
                return rect;
            };
            layout.reflow(box);
            ok(layout.box.toRect().equals(rect));
        });

        test("sets empty box if visual has no bbox", function() {
            layout.visual.clippedBBox = function() {};
            layout.reflow(box);
            equal(layout.box.width(), 0);
            equal(layout.box.height(), 0);
        });

        test("renderVisual appends visual", function() {
            layout.parent = {
                appendVisual: function() {
                    ok(true);
                }
            };
            layout.renderVisual();
        });

    })();


    (function() {
        var ring,
            ringBox;

        function createRing(startAngle, angle, innerRadius) {
            ring = new dataviz.Ring(
                new dataviz.Point2D(100, 100), innerRadius || 0, 100,
                startAngle, angle - startAngle);
            var box = ring.getBBox();
            ringBox = [box.x1, box.y1, box.x2, box.y2]
        }

        // ------------------------------------------------------------
        module("Ring with zero inner radius");

        test("get box with startAngle 10 and endAngle 190", function() {
            createRing(10, 190);
            arrayClose(ringBox, [1, 0, 200, 117], TOLERANCE);
        });

        test("get box with startAngle 10 and endAngle 30", function() {
            createRing(10, 30);
            arrayClose(ringBox, [1, 50, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 90", function() {
            createRing(0, 90);
            arrayClose(ringBox, [0, 0, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 30 and endAngle 170", function() {
            createRing(30, 170);
            arrayClose(ringBox, [13, 0, 198, 100], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 360", function() {
            createRing(0, 360);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 280", function() {
            createRing(0, 280);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 90 and endAngle 90 (full circle)", function() {
            createRing(90, 90);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 180 and endAngle 0", function() {
            createRing(180, 0);
            arrayClose(ringBox, [0, 100, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 180.1 and endAngle 0", function() {
            createRing(180.1, 0);
            arrayClose(ringBox, [0, 100, 200, 200], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Ring with inner radius");

        test("get box with startAngle 10 and endAngle 190", function() {
            createRing(10, 190, 50);
            arrayClose(ringBox, [1, 0, 200, 117], TOLERANCE);
        });

        test("get box with startAngle 10 and endAngle 30", function() {
            createRing(10, 30, 50);
            arrayClose(ringBox, [1, 50, 13, 83], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 90", function() {
            createRing(0, 90, 50);
            arrayClose(ringBox, [0, 0, 100, 100], TOLERANCE);
        });

        test("get box with startAngle 30 and endAngle 170", function() {
            createRing(30, 170, 50);
            arrayClose(ringBox, [13, 0, 198, 83], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 360", function() {
            createRing(0, 360, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 0 and endAngle 280", function() {
            createRing(0, 280, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 90 and endAngle 450", function() {
            createRing(90, 450, 50);
            arrayClose(ringBox, [0, 0, 200, 200], TOLERANCE);
        });

        test("get box with startAngle 410 and endAngle 450", function() {
            createRing(410, 450, 50);
            arrayClose(ringBox, [35, 0, 100, 23], TOLERANCE);
        });

    })();

    (function() {
        var Pane = dataviz.Pane,
            pane, rect, paneTitle;

        function createPaneRect(options) {
            pane = new Pane(options);
            pane.createGridLines = function() {};
            pane.reflow(chartBox);
            pane.renderVisual();

            rect = pane.visual.children[0];
        }

        // ------------------------------------------------------------
        module("Pane");

        test("Sets background color", function() {
            createPaneRect({ background: "color", width: 600, height: 400 });
            equal(rect.options.fill.color, "color");
        });

        test("Sets border", function() {
            createPaneRect({ border: { color: "color", width: 1, dashType: "dashType" }, width: 600, height: 400 });
            var stroke = rect.options.stroke;
            equal(stroke.color, "color");
            equal(stroke.width, 1);
            equal(stroke.dashType, "dashType");
        });

        test("is clipRoot", function() {
            pane.parent = {
                clipRoot: function() {
                    return "foo";
                }
            };
            ok(pane.clipRoot() === pane);
        });

        // ------------------------------------------------------------

        function createPaneWithTitle(options) {
            pane = new Pane($.extend(true, { title: {
                text: "Title"
            }, width: 600, height: 400 }, options));
            pane.reflow(chartBox);
            paneTitle = pane.title;
        }

        module("Pane / Title");

        test("positions title to the top", function() {
            createPaneWithTitle();

            equal(paneTitle.options.position, "top");
        });

        test("Title shrinks content box", function() {
            createPaneWithTitle();

            equal(pane.contentBox.height(), 365);
        });

        test("aligns Title to the left", function() {
            createPaneWithTitle();
            equal(paneTitle.options.align, "left");
        });

        test("aligns Title to the center", function() {
            createPaneWithTitle({
                title: {
                    position: "center"
                }
            });

            equal(paneTitle.options.align, "center");
        });

        test("aligns Title to the right", function() {
            createPaneWithTitle({
                title: {
                    position: "right"
                }
            });

            equal(paneTitle.options.align, "right");
        });

        test("rendered after refresh", function() {
            createPaneRect({
                title: {
                    text: "Foo"
                }
            });

            pane.refresh();

            ok(pane.visual.children[0] === pane.title.visual);
        });

    })();

    (function() {
        var ShapeElement = dataviz.ShapeElement,
            SIZE = 5,
            BORDER = 2,
            BORDER_COLOR = "#cf0",
            BACKGROUND = "#f00",
            shape,
            visual,
            box;

        function createShape(options, pointData) {
            shape = new ShapeElement(
                $.extend({
                    width: SIZE,
                    height: SIZE,
                    border: { width: BORDER },
                    background: "#f00"
                }, options),
            pointData);

            box = new Box2D(0, 0, SIZE, SIZE);
            shape.reflow(box);

            shape.renderVisual();
            visual = shape.visual;
        }

        // ------------------------------------------------------------
        module("ShapeElement", {
            setup: function() {
                createShape({ type: "square" });
            }
        });

        test("renders square", function() {
            sameRectPath(visual, [0, 0, SIZE, SIZE]);
        });

        test("renders rotated square", function() {            ;
            createShape({ type: "square", rotation: 45 });
            visual = shape.visual;

            sameRectPath(visual, [0, 0, SIZE, SIZE]);
            ok(visual.transform().equals(geom.transform().rotate(-45, [SIZE / 2 , SIZE / 2])));
            ok(visual.options.closed);
        });

        test("renders triangle", function() {
            createShape({ type: "triangle" });
            var expectedPath = new draw.Path().moveTo(SIZE / 2, 0)
                .lineTo(0, SIZE).lineTo(SIZE, SIZE).close();

            sameLinePath(shape.visual, expectedPath);
        });

        test("renders rotated triangle", function() {
            createShape({ type: "triangle", rotation: 180 });
            var expectedPath = new draw.Path().moveTo(SIZE / 2, 0)
                .lineTo(0, SIZE).lineTo(SIZE, SIZE).close();

            sameLinePath(shape.visual, expectedPath);
            ok(shape.visual.transform().equals(geom.transform().rotate(-180, [SIZE / 2 , SIZE / 2])));
        });

        test("renders circle", function() {
            createShape({ type: "circle" });
            var circle = shape.visual.geometry();

            deepEqual(circle.center.x, SIZE / 2);
            deepEqual(circle.center.y, SIZE / 2);
            deepEqual(circle.radius, SIZE / 2);
        });

        test("renders cross", function() {
            createShape({ type: "cross" });
            var cross = shape.visual;
            sameLinePath(cross.paths[0], new draw.Path().moveTo(0, 0).lineTo(SIZE, SIZE));
            sameLinePath(cross.paths[1], new draw.Path().moveTo(0, SIZE).lineTo(SIZE, 0));
        });

        test("sets cross zIndex", function() {
            createShape({ type: "cross", zIndex: 1 });
            var cross = shape.visual;

            equal(cross.options.zIndex, 1);
        });

        test("does not render element when hidden", function() {
            createShape({ visible: false });
            ok(!shape.visual);
        });

        test("does not render element when hidden (triangle)", function() {
            createShape({ visible: false,  type: "triangle"});
            ok(!shape.visual);
        });

        test("does not render element when hidden (circle)", function() {
            createShape({ visible: false,  type: "circle"});
            ok(!shape.visual);
        });

        // ------------------------------------------------------------
        var customVisual = new draw.Path();
        module("ShapeElement / custom visual");

        test("creates custom visual if visual option is set", function() {
            createShape({
                visual: function() {
                    return customVisual;
                }
            });
            ok(visual === customVisual);
        });

        test("passes paddingBox rect as parameter", function() {
            createShape({
                visual: function(e) {
                   ok(e.rect.equals(shape.paddingBox.toRect()));
                }
            });
        });

        test("passes dataItem, value and series", function() {
            var dataItem = "foo";
            var series = "foo";
            var value = 3;
            var category = "bar";
            createShape({
                visual: function(e) {
                   equal(e.dataItem, dataItem);
                   equal(e.series, series);
                   equal(e.value, value);
                   equal(e.category, category);
                }
            }, {
                dataItem: dataItem,
                series: series,
                value: value,
                category: category
            });
        });

        test("passes shapeelement options", function() {
            createShape({
                visual: function(e) {
                   var options = shape.options;
                   deepEqual(e.options, {
                        background: options.background,
                        border: options.border,
                        margin: options.margin,
                        padding: options.padding,
                        type: options.type,
                        size: options.width,
                        visible: options.visible
                   });
                }
            });
        });

        test("passes function that returns the default visual", function() {
            createShape({
                type: "circle",
                visual: function(e) {
                   var defaultVisual = e.createVisual();
                   ok(defaultVisual instanceof draw.Circle);
                }
            });
        });
    })();

    (function() {
        var DEFAULT_ICON_SIZE = 7;
        var Note = dataviz.Note;
        var customVisual;
        var box;
        var note;
        var visual;

        function createNote(options) {
            note = new Note(1, "foo", "bar", "baz", "qux", kendo.deepExtend({
                line: {
                    length: 10,
                    width: 1
                }
            }, options));

            box = new Box2D(0, 0, 10, 10);
            note.reflow(box);

            note.getRoot = function() {
                return {
                    chart: "chart"
                };
            };

            note.renderVisual();
            visual = note.visual;
        }

        // ------------------------------------------------------------
        module("Note");

        test("sets default icon size if no size is set and label position is outside", function() {
            createNote({
                label: {
                    position: "outside"
                }
            });
            equal(note.marker.box.width(), DEFAULT_ICON_SIZE);
            equal(note.marker.box.height(), DEFAULT_ICON_SIZE);
        });

        test("circle icon size is set based on the max of the label width and height if no size is set and label position is inside", function() {
            createNote({
                label: {
                    position: "inside"
                },
                icon: {
                    type: "circle"
                }
            });

            var size = Math.max(note.label.box.width(), note.label.box.height());
            equal(note.marker.box.width(), size);
            equal(note.marker.box.height(), size);
        });

        test("non circle icon size is set based on the label width and height if no size is set and label position is inside", function() {
            createNote({
                label: {
                    position: "inside"
                },
                icon: {
                    type: "square"
                }
            });

            equal(note.marker.box.width(), note.label.box.width());
            equal(note.marker.box.height(), note.label.box.height());
        });

        test("sets icon size from the options if set and label position is outside", function() {
            createNote({
                label: {
                    position: "outside"
                },
                icon: {
                    size: 30
                }
            });

            equal(note.marker.box.width(), 30);
            equal(note.marker.box.height(), 30);
        });

        test("sets icon size from the options if set and label position is inside", function() {
            createNote({
                label: {
                    position: "inside"
                },
                icon: {
                    size: 30
                }
            });

            equal(note.marker.box.width(), 30);
            equal(note.marker.box.height(), 30);
        });

        // ------------------------------------------------------------
        module("Note / custom visual", {
            setup: function() {
                customVisual = new draw.Path();
            }
        });

        test("creates custom visual if visual option is set", function() {
            createNote({
                visual: function() {
                    return customVisual;
                }
            });
            ok(visual === customVisual);
        });

        test("appends custom visual", function() {
            createNote({
                visual: function() {
                    return customVisual;
                }
            });
            note.parent = {
                appendVisual: function(visual) {
                    ok(visual === customVisual);
                }
            };
            note.renderVisual();
        });

        test("does not create default visual if custom visual function returns nothing", function() {
            createNote({
                visual: function() {
                }
            });
            ok(!note.visual);
        });

        test("passes rect as parameter", function() {
            createNote({
                visual: function(e) {
                   ok(e.rect.equals(note.targetBox.toRect()));
                }
            });
        });

        test("passes dataItem, category, value, text, series", function() {
            createNote({
                visual: function(e) {
                    equal(e.value, 1);
                    equal(e.text, "foo");
                    equal(e.dataItem, "bar");
                    equal(e.category, "baz");
                    equal(e.sender, "chart");
                    equal(e.series, "qux");
                }
            });
        });

        test("passes options", function() {
            createNote({
                visual: function(e) {
                   var options = note.options;
                   deepEqual(e.options, {
                        background: options.background,
                        border: options.background,
                        icon: options.icon,
                        label: options.label,
                        line: options.line,
                        position: options.position,
                        visible: options.visible
                   });
                }
            });
        });

        test("passes function that returns the default visual", function() {
            createNote({
                visual: function(e) {
                   ok(e.createVisual() instanceof draw.Group);
                }
            });
        });

        test("passes visual in event args", function() {
            createNote({
                visual: function() {
                    return customVisual;
                }
            });
            equal(note.eventArgs(new $.Event()).visual, customVisual);
        });

    })();
})();
