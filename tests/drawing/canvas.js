(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,

        g = kendo.geometry,
        Point = g.Point,
        Matrix = g.Matrix,

        d = kendo.drawing,
        canv = d.canvas,
        Surface = canv.Surface;

    var Context = kendo.Class.extend({
        init: function() {
            this._state = [];
        },

        beginPath: $.noop,
        clearRect: $.noop,
        close: $.noop,
        drawImage: $.noop,
        fill: $.noop,
        fillText: $.noop,
        lineTo: $.noop,
        moveTo: $.noop,
        restore: function() {
            deepExtend(this, this._state.pop());
        },
        save: function() {
            this._state.push(deepExtend({}, this));
        },
        stroke: $.noop,
        strokeText: $.noop,
        createLinearGradient: $.noop,
        createRadialGradient: $.noop,
        rect: $.noop
    });

    function mockContext(members) {
        var context = new Context();
        return deepExtend(context, members);
    }

    // ------------------------------------------------------------
    (function() {
        var container,
            surface;

        baseSurfaceTests("Canvas", Surface);

        function createSurface(options) {
            if (surface) {
                surface.destroy();
            }

            surface = new Surface(container, options);
        }

        module("Surface / Canvas", {
            setup: function() {
                container = $("<div>").appendTo(QUnit.fixture);
                createSurface();
            },
            teardown: function() {
                surface.destroy();
                container.remove();
            }
        });

        test("reports actual surface type", function() {
            createSurface({ type: "foo" });
            equal(surface.type, "canvas");
        });

        test("appends canvas element to container", function() {
            equal(QUnit.fixture.find("canvas").length, 1);
        });

        test("sets actual width on root element", function() {
            createSurface({ width: "500px" });
            equal(surface._rootElement.width, 500);
        });

        test("sets actual height on root element", function() {
            createSurface({ height: "500px" });
            equal(surface._rootElement.height, 500);
        });

        test("sets actual width on resize", function() {
            surface.element.css("width", "500px");
            surface.resize();
            equal(surface._rootElement.width, 500);
        });

        test("sets actual height on resize", function() {
            surface.element.css("height", "500px");
            surface.resize();
            equal(surface._rootElement.height, 500);
        });

        test("destroys root node", function() {
            surface._root.destroy = function() {
                ok(true);
            };

            surface.destroy();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var root;

        function createRoot(ctx) {
            root = new canv.RootNode({
                getContext: function() {
                    return ctx;
                }
            });
        }

        module("RootNode", {
            setup: function() {
                createRoot(mockContext());
            }
        });

        test("throttles invalidate", function() {
            createRoot(mockContext({
                clearRect: function() {
                    ok(true);
                }
            }));

            root.invalidate();
            root.invalidate();

            root.destroy();
        });

        asyncTest("makes a tail call to invalidate", function() {
            var count = 0;
            createRoot(mockContext({
                clearRect: function() {
                    if (++count == 2) {
                        ok(true);
                        start();
                    }
                }
            }));

            root.invalidate();
            root.invalidate();
        });

        test("destroy clears timeout", 0, function() {
            var firstRun = true;
            createRoot(mockContext({
                clearRect: function() {
                    if (!firstRun) {
                        ok(false);
                    }

                    firstRun = false;
                }
            }));

            root.invalidate();
            root.invalidate();
            root.destroy();
        });

        test("traverse traverses children", function() {
            var child = new canv.Node();
            root.append(child);

            root.traverse(function(item) {
                deepEqual(item, child);
            });
        });

        test("traverse traverses child group nodes", function() {
            var childGroup = new canv.GroupNode();
            root.append(childGroup);

            var child = new canv.Node();
            childGroup.append(child);

            root.traverse(function(item) {
                ok(true);
            });
        });

        test("traverse is chainable", function() {
            equal(root.traverse($.noop), root);
        });
    })();

    function clipTests(TShape, TNode, nodeName) {
        var shape;
        var node;
        var clip;

        module("Clip Tests / " + nodeName, {
            setup: function() {
                clip = new d.Path();

                shape = new TShape();
                shape.clip(clip);

                node = new TNode(shape);
            }
        });

        test("inits clip", function() {
            equal(node.clip, clip);
        });

        test("adds clip observer", function() {
            ok($.inArray(node, clip.observers()) != -1);
        });

        test("clear removes clip", function() {
            node.clear();
            equal(node.clip, undefined);
        });

        test("clear removes clip observer", function() {
            node.clear();
            equal($.inArray(node, clip.observers()), -1);
        });

        test("sets clip", function() {
            var context = mockContext({
                clip: function() {
                    ok(true);
                }
            });
            node.renderTo(context);
        });

        test("sets clip after transformation", function() {
            shape.transform(g.transform());
            var isSetTransformation = false;
            var context = mockContext({
                clip: function() {
                    ok(isSetTransformation);
                },
                transform: function() {
                    isSetTransformation = true;
                }
            });
            node.renderTo(context);
        });
    }

    // ------------------------------------------------------------
    (function() {
        var node;
        var srcElement;

        module("Node", {
            setup: function() {
                node = new canv.Node();
            }
        });

        test("load appends Node for Group", function() {
            node.append = function(child) {
                ok(child instanceof canv.Node);
            };

            node.load([new d.Group()]);
        });

        test("load append Node at position", function() {
            node.insertAt = function(child, pos) {
                equal(pos, 1);
            };

            node.load([new d.Group()], 1);
        });

        test("load appends PathNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.PathNode);
            };

            node.load([new d.Path()]);
        });

        test("load appends MultiPathNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.MultiPathNode);
            };

            node.load([new d.MultiPath()]);
        });

        test("load appends TextNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.TextNode);
            };

            node.load([new d.Text()]);
        });

        test("load appends CircleNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.CircleNode);
            };

            node.load([new d.Circle()]);
        });

        test("load appends ArcNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.ArcNode);
            };

            node.load([new d.Arc()]);
        });

        test("load appends ImageNode", function() {
            node.append = function(child) {
                ok(child instanceof canv.ImageNode);
            };

            node.load([new d.Image()]);
        });

        test("load appends child nodes", function() {
            var parentGroup = new d.Group();
            var childGroup = new d.Group();
            parentGroup.append(childGroup);

            node.load([parentGroup]);

            ok(node.childNodes[0].childNodes[0] instanceof canv.Node);
        });

        test("load invalidates node", function() {
            node.invalidate = function() { ok(true); };
            node.load([new d.Group()]);
        });

        // ------------------------------------------------------------
        module("Node / source observer", {
            setup: function() {
                srcElement = new d.Element();
                node = new canv.Node(srcElement);
            }
        });

        test("Adds srcElement observer", function() {
            equal(srcElement.observers()[0], node);
        });

        test("clear removes srcElement observer", function() {
            node.clear();
            equal(srcElement.observers().length, 0);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var group;
        var node;

        clipTests(d.Group, canv.GroupNode, "GroupNode");

        module("GroupNode", {
            setup: function() {
                group = new d.Group();
                node = new canv.GroupNode(group);
            }
        });

        test("renders transform", function() {
            group.transform(new Matrix(1e-6, 2, 3, 4, 5, 6));

            var ctx = mockContext({
                transform: function(a, b, c, d, e, f) {
                    deepEqual([a, b, c, d, e, f], [1e-6, 2, 3, 4, 5, 6]);
                }
            });

            node.load([group]);
            node.renderTo(ctx);
        });

        test("does not render transform if not set", 0, function() {
            var ctx = mockContext({
                transform: function(mx) {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("renders opacity", function() {
            group.opacity(0.5);

            var ctx = mockContext();
            node.renderTo(ctx);

            equal(ctx.globalAlpha, 0.5);
        });

        test("multiplies opacity with parent opacity", function() {
            group.opacity(0.5);

            var childGroup = new d.Group({ opacity: 0.5 });
            node.load([childGroup]);

            var ctx = mockContext({
                restore: $.noop
            });
            node.renderTo(ctx);

            equal(ctx.globalAlpha, 0.25);
        });

        test("does not render if source group is not visible", 0, function() {
            var ctx = mockContext({
                save: function(mx) {
                    ok(false);
                }
            });

            group.visible(false);

            node.renderTo(ctx);
        });

        test("does not render children if group is not visible", 0, function() {
            var childGroup = new d.Group({ visible: false });
            node.load([childGroup]);
            node.childNodes[0].renderTo = function() { ok(false); };

            var ctx = mockContext();
            node.renderTo(ctx);
        });
    })();

    function paintTests(TShape, TNode, nodeName) {
        var shape;
        var node;

        module("Paint Tests / " + nodeName, {
            setup: function() {
                shape = new TShape()
                    .stroke("red", 2).fill("blue");

                node = new TNode(shape);
            }
        });

        test("renders global opacity", function() {
            shape.opacity(0.5);

            var ctx = mockContext();
            node.renderTo(ctx);

            equal(ctx.globalAlpha, 0.5);
        });

        test("renders stroke", function() {
            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.strokeStyle, "red");
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke if set to 'none'", 0, function() {
            shape.options.set("stroke.color", "none");

            var ctx = mockContext({
                stroke: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke if set to 'transparent'", 0, function() {
            shape.options.set("stroke.color", "transparent");

            var ctx = mockContext({
                stroke: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke if set to ''", 0, function() {
            shape.options.set("stroke.color", "");

            var ctx = mockContext({
                stroke: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke if width is not positive", 0, function() {
            shape.options.set("stroke.width", 0);

            var ctx = mockContext({
                stroke: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("renders stroke width", function() {
            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.lineWidth, 2);
                }
            });

            node.renderTo(ctx);
        });

        test("renders stroke opacity", function() {
            shape.options.set("stroke.opacity", 0.5);

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.globalAlpha, 0.5);
                }
            });

            node.renderTo(ctx);
        });

        test("multiplies stroke opacity with global opacity", function() {
            shape.options.set("stroke.opacity", 0.5);
            shape.opacity(0.5);

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.globalAlpha, 0.25);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke opacity if not set", function() {
            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.globalAlpha, undefined);
                }
            });

            node.renderTo(ctx);
        });

        test("renders stroke dashType", function() {
            shape.options.set("stroke.dashType", "dot");

            var ctx = mockContext({
                setLineDash: function(arr) {
                    deepEqual(arr, [1.5, 3.5]);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render stroke dashType if not set", 0, function() {
            var ctx = mockContext({
                setLineDash: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("renders fill", function() {
            var ctx = mockContext({
                fill: function() {
                    equal(ctx.fillStyle, "blue");
                }
            });

            node.renderTo(ctx);
        });

        test("renders fill opacity", function() {
            shape.options.set("fill.opacity", 0.5);

            var ctx = mockContext({
                fill: function() {
                    equal(ctx.globalAlpha, 0.5);
                }
            });

            node.renderTo(ctx);
        });

        test("multiplies fill opacity with global opacity", function() {
            shape.options.set("fill.opacity", 0.5);
            shape.opacity(0.5);

            var ctx = mockContext({
                fill: function() {
                    equal(ctx.globalAlpha, 0.25);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render fill if not set", 0, function() {
            shape.options.set("fill", null);

            var ctx = mockContext({
                fill: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render fill if set to 'none'", 0, function() {
            shape.options.set("fill.color", "none");

            var ctx = mockContext({
                fill: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render fill if set to 'transparent'", 0, function() {
            shape.options.set("fill.color", "transparent");

            var ctx = mockContext({
                fill: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("does not render fill if set to ''", 0, function() {
            shape.options.set("fill.color", "");

            var ctx = mockContext({
                fill: function() {
                    ok(false);
                }
            });

            node.renderTo(ctx);
        });

        test("multiplies stroke and fill opacity with global opacity", function() {
            shape.options.set("stroke.opacity", 0.5);
            shape.options.set("fill.opacity", 0.5);
            shape.opacity(0.5);

            var ctx = mockContext({
                fill: function() {
                    equal(ctx.globalAlpha, 0.25);
                },
                stroke: function() {
                    equal(ctx.globalAlpha, 0.25);
                }
            });

            node.renderTo(ctx);
        });

        // ------------------------------------------------------------
        function MockGradient() {
            this.stops = [];
        }

        MockGradient.prototype = {
            addColorStop: function(offset, color) {
                this.stops.push({
                    offset: offset,
                    color: color
                });
            }
        };

        function createGradient() {
           var gradientFill = new MockGradient();
           gradientFill.params = arguments;
           return gradientFill;
        }

        function renderGradient(gradient) {
            var fillsContext = false;
            var transformation;
            var ctx = mockContext({
                transform: function() {
                    transformation = new g.Matrix();
                    transformation.init.apply(transformation, arguments);
                },
                fill: function() {
                    fillsContext = true;
                },
                createLinearGradient: createGradient,
                createRadialGradient: createGradient
            });

            shape.fill(gradient);
            node.renderTo(ctx);
            return {
                fillsContext: fillsContext,
                transformation: transformation,
                gradient: ctx.fillStyle
            };
        }

        module("Paint Tests / " + nodeName + " / gradient fill", {
            setup: function() {
                shape = new TShape();
                shape.rawBBox = function() {
                    return new g.Rect([10, 20], [100, 200]);
                };
                node = new TNode(shape);
            }
        });

        test("renders linear gradient", function() {
            var result = renderGradient(new d.LinearGradient({
                start: [0.1, 0.2],
                end: [0.5, 0.6]
            }));
            var params = result.gradient.params;
            ok(result.fillsContext);
            ok(result.gradient);
            equal(params[0], 0.1);
            equal(params[1], 0.2);
            equal(params[2], 0.5);
            equal(params[3], 0.6);
        });

        test("renders radial gradient", function() {
            var result = renderGradient(new d.RadialGradient({
                center: [10, 20],
                radius: 0.5
            }));
            var params = result.gradient.params;
            ok(result.fillsContext);
            ok(result.gradient);
            equal(params[0], 10);
            equal(params[1], 20);
            equal(params[2], 0);
            equal(params[3], 10);
            equal(params[4], 20);
            equal(params[5], 0.5);
        });

        test("sets transformation based on raw bounding box", function() {
            var result = renderGradient(new d.LinearGradient());
            compareMatrices(result.transformation, new g.Matrix(100, 0, 0, 200, 10, 20));
        });

        test("does not set transformation if userSpace is true", function() {
            var result = renderGradient(new d.LinearGradient({
                userSpace: true
            }));
            ok(!result.transformation);
        });

        test("adds gradient stops", function() {
            var result = renderGradient(new d.LinearGradient({
                stops: [[
                    0.1, "red", 0.5
                ], [
                    0.7, "blue", 1
                ]]
            }));

            var expectedStops = [{
                color: "rgba(255, 0, 0, 0.5)",
                offset: 0.1
            }, {
                color: "rgba(0, 0, 255, 1)",
                offset: 0.7
            }];
            deepEqual(result.gradient.stops, expectedStops);
        });
    }

    // ------------------------------------------------------------
    (function() {
        var path,
            pathNode;

        paintTests(d.Path, canv.PathNode, "PathNode");

        module("PathNode", {
            setup: function() {
                path = new d.Path({
                    stroke: {
                        color: "red",
                        width: 2
                    },
                    fill: {
                        color: "blue"
                    }
                });

                pathNode = new canv.PathNode(path);
            }
        });

        test("saves and restores context", function() {
            pathNode.renderTo(mockContext({
                save: function() {
                    ok(true);
                },
                restore: function() {
                    ok(true);
                }
            }));
        });

        test("renders straight segments", 3, function() {
            path.moveTo(0, 0).lineTo(10, 20);

            pathNode.renderTo(mockContext({
                beginPath: function() {
                    ok(true);
                },
                moveTo: function(x, y) {
                    deepEqual([x, y], [0, 0]);
                },
                lineTo: function(x, y) {
                    deepEqual([x, y], [10, 20]);
                }
            }));
        });

        test("renders closed paths", function() {
            path.moveTo(0, 0).lineTo(10, 20).close();

            pathNode.renderTo(mockContext({
                closePath: function() {
                    ok(true);
                }
            }));
        });

        test("renders curve", 4, function() {
            path.moveTo(0, 0).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0));

            var order = 0;
            pathNode.renderTo(mockContext({
                moveTo: function(x, y) {
                    equal(order++, 0, "#");
                    deepEqual([x, y], [0, 0]);
                },
                bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
                    equal(order++, 1, "#");
                    deepEqual([cp1x, cp1y, cp2x, cp2y, x, y], [10, 10, 20, 10, 30, 0]);
                }
            }));
        });

        test("switches between line and curve", 6, function() {
            path.moveTo(0, 0).lineTo(5, 5).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0));

            var order = 0;
            pathNode.renderTo(mockContext({
                moveTo: function(x, y) {
                    equal(order++, 0, "#");
                    deepEqual([x, y], [0, 0]);
                },
                lineTo: function(x, y) {
                    equal(order++, 1, "#");
                    deepEqual([x, y], [5, 5]);
                },
                bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
                    equal(order++, 2, "#");
                    deepEqual([cp1x, cp1y, cp2x, cp2y, x, y],
                              [10, 10, 20, 10, 30, 0]);
                }
            }));
        });

        test("switches between curve and line", 6, function() {
            path.moveTo(0, 0).curveTo(Point.create(10, 10), Point.create(20, 10), Point.create(30, 0)).lineTo(40, 10);

            var order = 0;
            pathNode.renderTo(mockContext({
                moveTo: function(x, y) {
                    equal(order++, 0, "#");
                    deepEqual([x, y], [0, 0]);
                },
                bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
                    equal(order++, 1, "#");
                    deepEqual([cp1x, cp1y, cp2x, cp2y, x, y],
                              [10, 10, 20, 10, 30, 0]);
                },
                lineTo: function(x, y) {
                    equal(order++, 2, "#");
                    deepEqual([x, y], [40, 10]);
                }
            }));
        });

        test("does not render empty path", 0, function() {
            pathNode.renderTo(mockContext({
                moveTo: function() {
                    ok(false);
                }
            }));
        });

        test("renders stroke dashType (legacy)", function() {
            path.options.set("stroke.dashType", "dot");

            var ctx = mockContext({
                stroke: function() {
                    deepEqual(ctx.mozDash, [1.5, 3.5]);
                    deepEqual(ctx.webkitLineDash, ctx.mozDash);
                }
            });

            pathNode.renderTo(ctx);
        });

        test("renders stroke lineJoin", function() {
            path.options.set("stroke.lineJoin", "round");

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.lineJoin, "round");
                }
            });

            pathNode.renderTo(ctx);
        });

        test("renders stroke linecap", function() {
            path.options.set("stroke.lineCap", "round");

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.lineCap, "round");
                }
            });

            pathNode.renderTo(ctx);
        });

        test("overrides stroke linecap when dashType is set", function() {
            path.options.set("stroke.lineCap", "round");
            path.options.set("stroke.dashType", "dot");

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.lineCap, "butt");
                }
            });

            pathNode.renderTo(ctx);
        });

        test("renders stroke linecap when dashType is set to solid", function() {
            path.options.set("stroke.lineCap", "round");
            path.options.set("stroke.dashType", "solid");

            var ctx = mockContext({
                stroke: function() {
                    equal(ctx.lineCap, "round");
                }
            });

            pathNode.renderTo(ctx);
        });

        test("renders transform", function() {
            path.transform(new Matrix(1e-6, 2, 3, 4, 5, 6));

            var ctx = mockContext({
                transform: function(a, b, c, d, e, f) {
                    deepEqual([a, b, c, d, e, f], [1e-6, 2, 3, 4, 5, 6]);
                }
            });

            pathNode.renderTo(ctx);
        });

        test("does not render transform if not set", 0, function() {
            var ctx = mockContext({
                transform: function(mx) {
                    ok(false);
                }
            });

            pathNode.renderTo(ctx);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var multiPath,
            multiPathNode;

        module("MultiPathNode", {
            setup: function() {
                multiPath = new d.MultiPath();
                multiPathNode = new canv.MultiPathNode(multiPath);
            }
        });

        test("renders composite paths", 4, function() {
            multiPath
                .moveTo(0, 0).lineTo(10, 20)
                .moveTo(10, 10).lineTo(10, 20);

            var order = 0;
            multiPathNode.renderTo(mockContext({
                moveTo: function(x, y) {
                    if (order === 0) {
                        deepEqual([x, y], [0, 0]);
                    } else if (order === 2) {
                        deepEqual([x, y], [10, 10]);
                    }

                    order++;
                },
                lineTo: function(x, y) {
                    deepEqual([x, y], [10, 20]);

                    order++;
                }
            }));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var circle,
            circleNode;

        module("CircleNode", {
            setup: function() {
                var geometry = new g.Circle(new Point(10, 20), 30);
                circle = new d.Circle(geometry);
                circleNode = new canv.CircleNode(circle);
            }
        });

        test("renders arc", function() {
            circleNode.renderTo(mockContext({
                arc: function(x, y, r, start, end) {
                    deepEqual([x, y, r, start, end],
                              [10, 20, 30, 0, Math.PI * 2]);
                }
            }));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var arc,
            arcNode;

        module("ArcNode", {
            setup: function() {
                var geometry = new g.Arc(new Point(10, 20), {
                    radiusX: 10,
                    radiusY: 10,
                    startAngle: 0,
                    endAngle: 90
                });
                arc = new d.Arc(geometry);
                arcNode = new canv.ArcNode(arc);
            }
        });

        test("renders equivalent curve", function() {
            var order = 0;
            arcNode.renderTo(mockContext({
                moveTo: function(x, y) {
                    equal(order++, 0, "#");
                    deepEqual([x, y], [20, 20]);
                },
                bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
                    var expected;
                    if (order++ === 1) {
                        expected = [20, 22.6, 18.9, 25.2, 17, 27];
                    } else {
                        expected = [15.2, 28.9, 12.6, 30, 10, 30];
                    }

                    arrayClose([cp1x, cp1y, cp2x, cp2y, x, y], expected, 0.3);
                }
            }));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var text;
        var textNode;

        paintTests(d.Text, canv.TextNode, "TextNode");
        clipTests(d.Text, canv.TextNode, "TextNode");

        module("TextNode", {
            setup: function() {
                text = new d.Text("Foo", new Point(10, 20), { font: "arial" });
                text.measure = function() {
                    return {
                        width: 20, height: 10, baseline: 15
                    };
                };

                textNode = new canv.TextNode(text);
            }
        });

        test("renders position accounting for baseline", function() {
            textNode.renderTo(mockContext({
                fillText: function(content, x, y) {
                    deepEqual([x, y], [10, 35]);
                }
            }));
        });

        test("renders content", function() {
            textNode.renderTo(mockContext({
                fillText: function(content) {
                    equal(content, "Foo");
                }
            }));
        });

        test("sets font", function() {
            var ctx = mockContext({
                fillText: function(content) {
                    equal(ctx.font, "arial");
                }
            });

            textNode.renderTo(ctx);
        });

        test("does not fill text if no fill is set", 0, function() {
            text.options.set("fill", null);

            var ctx = mockContext({
                fillText: function() {
                    ok(false);
                }
            });

            textNode.renderTo(ctx);
        });

        test("setting content invalidates node", function() {
            textNode.invalidate = function() {
                ok(true);
            };

            text.content("Bar");
        });

        test("strokes text", function() {
            text.stroke("red", 1);

            var ctx = mockContext({
                strokeText: function(content, x, y) {
                    equal(content, "Foo");
                    deepEqual([x, y], [10, 35]);
                }
            });

            textNode.renderTo(ctx);
        });

        test("does not stroke text if no stroke is set", 0, function() {
            var ctx = mockContext({
                strokeText: function() {
                    ok(false);
                }
            });

            textNode.renderTo(ctx);
        });

        test("renders transform", function() {
            text.transform(new Matrix(1e-6, 2, 3, 4, 5, 6));

            var ctx = mockContext({
                transform: function(a, b, c, d, e, f) {
                    deepEqual([a, b, c, d, e, f], [1e-6, 2, 3, 4, 5, 6]);
                }
            });

            textNode.renderTo(ctx);
        });

        test("does not render transform if not set", 0, function() {
            var ctx = mockContext({
                transform: function(mx) {
                    ok(false);
                }
            });

            textNode.renderTo(ctx);
        });

        test("creates new path", function() {
            var ctx = mockContext({
                beginPath: function(mx) {
                    ok(true);
                }
            });

            textNode.renderTo(ctx);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var image;
        var imageNode;

        var LoadedImageNode = canv.ImageNode.extend({
            init: function(srcElement) {
                canv.ImageNode.fn.init.call(this, srcElement);
                this.loading.resolve();
            }
        });

        clipTests(d.Image, LoadedImageNode, "ImageNode");

        module("ImageNode", {
            setup: function() {
                image = new d.Image("Foo", new g.Rect(new Point(10, 20), [90, 80]));
                imageNode = new canv.ImageNode(image);
                imageNode.loading.resolve();
            }
        });

        test("renders position", function() {
            imageNode.renderTo(mockContext({
                drawImage: function(img, x, y) {
                    deepEqual([x, y], [10, 20]);
                }
            }));
        });

        test("renders size", function() {
            imageNode.renderTo(mockContext({
                drawImage: function(img, x, y, width, height) {
                    deepEqual([width, height], [90, 80]);
                }
            }));
        });

        test("setting src resets loading state", function() {
            image.src("Bar");
            equal(imageNode.loading.state(), "pending");
        });

        test("load handler resolves loading state", function() {
            imageNode.onLoad();
            equal(imageNode.loading.state(), "resolved");
        });

        test("error handler rejects loading state", function() {
            image.src("Baz");
            imageNode.onError();
            equal(imageNode.loading.state(), "rejected");
        });

        test("load handler invalidates node", function() {
            imageNode.invalidate = function() {
                ok(true);
            };

            imageNode.onLoad();
        });

        test("geometryChange invalidates node", function() {
            imageNode.invalidate = function() {
                ok(true);
            };

            image.rect().origin.setX(20);
        });

        test("renders transform", function() {
            image.transform(new Matrix(1e-6, 2, 3, 4, 5, 6));

            var ctx = mockContext({
                transform: function(a, b, c, d, e, f) {
                    deepEqual([a, b, c, d, e, f], [1e-6, 2, 3, 4, 5, 6]);
                }
            });

            imageNode.renderTo(ctx);
        });

        test("does not render transform if not set", 0, function() {
            var ctx = mockContext({
                transform: function(mx) {
                    ok(false);
                }
            });

            imageNode.renderTo(ctx);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var Rect = d.Rect,
            RectNode = canv.RectNode,
            rect,
            rectNode;

        paintTests(Rect, RectNode, "RectNode");
        clipTests(Rect, RectNode, "RectNode");

        module("RectNode", {
            setup: function() {
                var geometry = new g.Rect([10,20],[30,40]);
                rect = new d.Rect(geometry);
                rectNode = new RectNode(rect);
            }
        });

        test("renders rect", function() {
            rectNode.renderTo(mockContext({
                rect: function(x, y, width, height) {
                    equal(x, 10);
                    equal(y, 20);
                    equal(width, 30);
                    equal(height, 40);
                }
            }));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var group;

        module("exportImage", {
            setup: function() {
                group = new d.Group();
            }
        });

        test("exports group", function() {
            d.exportImage(group).done(function(data) {
                contains(data, "data:image/png;base64,");
            });
        });

        test("exports with auto size", function() {
            var rect = new g.Rect([0, 0], [100, 100]);
            group.append(d.Path.fromRect(rect));

            d.exportImage(group).done(function(auto) {
                d.exportImage(group, { width: "100px", height: "100px" }).done(function(manual) {
                    equal(auto, manual);
                });
            });
        });

        test("exports with set size", function() {
            d.exportImage(group).done(function(small) {
                d.exportImage(group, { width: "1000px", height: "500px" }).done(function(large) {
                    ok(large.length > small.length);
                });
            });
        });

        test("waits for images to load", function() {
            var image = new d.Image("foo", new g.Rect([0, 0], [100, 100]));
            group.append(image);

            var loaded = false;
            d.exportImage(group).done(function(small) {
                ok(loaded);
            });

            loaded = true;
            image._observers[0].loading.resolve();
        });

        test("forces invalidate", function() {
            var surface = new d.canvas.Surface($("<div />"));
            surface._root._invalidate = function() {
                ok(true);
            };

            surface.draw(group);
            surface.image();

            surface.destroy();
        });

        asyncTest("throws an error if the canvas becomes tainted", function() {
            var image = new d.Image("http://kendobuild/pesho.jpg", new g.Rect([0, 0], [100, 100]));
            group.append(image);

            d.exportImage(group).done(function() {
                ok(false, "Should fail");
            }).fail(function(e) {
                contains(e.message, "Unable to load");
                contains(e.message, "pesho.jpg");
            }).always(function() {
                start();
            });
        });

        asyncTest("does not throw an error if image is CORS-enabled", function() {
            var image = new d.Image("http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png", new g.Rect([0, 0], [100, 100]));
            group.append(image);

            d.exportImage(group).done(function() {
                ok(true);
            }).always(function() {
                start();
            });
        });

        test("discards target origin", function() {
            var text = new d.Text("Foo", [10, 10]);
            group.append(text);

            d.exportImage(group).done(function(withOrigin) {
                text.position([0, 0]);
                d.exportImage(group).done(function(noOrigin) {
                    equal(withOrigin, noOrigin);
                });
            });
        });

        test("does not reparent target", function() {
            var parent = new d.Group();
            parent.append(group);
            group.append(new d.Text("Foo", [10, 10]));

            d.exportImage(group).done(function() {
                ok(group.parent === parent);
            });
        });
    })();
})();
