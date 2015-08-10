(function() {
    var tolerance = 0.0001,
        dataviz = kendo.dataviz,
        Point = dataviz.diagram.Point,
        Rect = dataviz.diagram.Rect,
        Geometry = dataviz.diagram.Geometry,
        diagram;

    function createDiagram(options, styles) {
        QUnit.fixture.html('<div id="canvas" />');
        if (styles) {
            $("#canvas").css(styles);
        }

        diagram = $("#canvas").kendoDiagram(options).getKendoDiagram();
    }

    function setup() {
        createDiagram();
    }

    function teardown() {
        diagram.destroy();
    }

    function setupDataSource(options, data) {
        var items = data || [{id: 1}];

        dataSource = new kendo.data.DataSource($.extend({
            transport: {
                read: function(options) {
                    options.success(items);
                },
                update: function(options) {
                    options.success();
                },
                create: function(options) {
                    var newItem = options.data;
                    newItem.id = items.length + 1;
                    items.push(newItem);
                    options.success([newItem]);
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        width: { type: "number" },
                        height: { type: "number" },
                        x: { type: "number" },
                        y: { type: "number" },
                        text: { type: "string" },
                        type: { type: "string" },
                        from: { type: "number" },
                        to: { type: "number" },
                        fromX: { type: "number" },
                        fromY: { type: "number" },
                        toX: { type: "number" },
                        toY: { type: "number" }
                    }
                }
            }
        }, {
        }, options));
        return dataSource;
    }

    // ------------------------------------------------------------
    module("Diagram", {
        teardown: teardown
    });

    test("Diagram should have default theme", function () {
        createDiagram();
        equal(diagram.options.theme, "default");
    });

    test("inits elements", function () {
        createDiagram();
        var element = diagram.element;

        equal(element.attr("tabindex"), 0);
        equal(element.css("position"), "relative");
        ok(element.hasClass("k-widget"));
        ok(element.hasClass("k-diagram"));

        ok(diagram.wrapper);
        ok(diagram.scrollable);
    });

    test("creates canvas container with class k-layer", function () {
        createDiagram();
        equal(diagram.element.find(".k-layer").length, 1);
    });

    test("sets initial element size to canvas", function () {
        createDiagram({}, { width: "1024px", height: "800px" });
        var width = diagram.element.width();
        var height = diagram.element.height();
        var size = diagram.canvas.size();
        equal(size.width, width);
        equal(size.height, height);
    });

    test("sets initial size to canvas when there is a toolbar", function () {
        createDiagram({
            editable: {
                tools: ["undo"]
            }
        });
        var width = diagram.element.width();
        var height = diagram.element.height() - diagram.toolBar.element.outerHeight();
        var size = diagram.canvas.size();
        equal(size.width, width);
        equal(size.height, height);
    });

    test("sets initial height to the scrollable element equal to the total height minus the toolbar height", function () {
        createDiagram({
            editable: {
                tools: ["undo"]
            }
        });

        equal(diagram.scrollable.height(), diagram.element.height() - diagram.toolBar.element.outerHeight());
    });

    test("_resize sets canvas size to the total height minus the toolbar height", function () {
        createDiagram({
            editable: {
                tools: ["undo"]
            }
        }, {
            width: "800px",
            height: "300px"
        });

        diagram.element.height(300);
        diagram._resize();
        var size = diagram.canvas.size();
        equal(size.width, diagram.element.width());
        equal(size.height,  diagram.element.height() - diagram.toolBar.element.outerHeight());
    });

    test("_resize sets scrollable element height to the total height minus the toolbar height", function () {
        createDiagram({
            editable: {
                tools: ["undo"]
            }
        });
        diagram.element.height(300);
        diagram._resize();
        equal(diagram.scrollable.height(), diagram.element.height() - diagram.toolBar.element.outerHeight());
    });

    test("sets default width and height if element has 0 width or height", function () {
        QUnit.fixture.html('<div id="canvas" />');
        diagram = $("#canvas").hide().kendoDiagram().getKendoDiagram();
        var size = diagram.canvas.size();
        equal(size.width, 600);
        equal(size.height, 600);
    });

    // ------------------------------------------------------------
    (function() {
        function tapEvent(x, y) {
            return {
                x: {
                    location: x
                },
                y: {
                    location: y
                }
            };
        }

        module("Diagram / tap", {
            setup: function() {
                setup();
            },
            teardown: teardown
        });

        test("converts point", function(e) {
            var expected = diagram.documentToModel(new Point(10, 20));
            diagram.toolService._updateHoveredItem = function(actual) {
                equal(expected.x, actual.x);
                equal(expected.y, actual.y);
            };
            diagram._tap(tapEvent(10, 20));
        });

        test("selects the hovered item", function(e) {
            stubMethod(diagram, "select", function(item, options) {
                if (item) {
                    equal(item, "foo");
                    equal(options.addToSelection, true);
                } else {
                    return [];
                }
            }, function() {
                diagram.toolService._updateHoveredItem = function() {
                    this.hoveredItem = "foo";
                };
                diagram._tap(tapEvent(10, 20));
            });

        });

        test("does not select item if no item is hovered", 0, function(e) {
            stubMethod(diagram, "select", function(item, options) {
                if (item) {
                    ok(false);
                }
            }, function() {
                diagram.toolService._updateHoveredItem = $.noop;
                diagram._tap(tapEvent(10, 20));
            });
        });

        test("deselects already selected item", function(e) {
            var item = {
                isSelected: true,
                select: function(e) {
                    equal(e, false);
                }
            };
            diagram.toolService._updateHoveredItem = function() {
                this.hoveredItem = item;
            };
            diagram._tap(tapEvent(10, 20));
        });

        test("triggers click if there is a hovered item", function(e) {
            diagram.toolService._updateHoveredItem = function() {
                this.hoveredItem = "foo";
            };
            diagram.bind("click", function(e) {
                equal(e.item, "foo");
            });
            diagram._tap(tapEvent(10, 20));
        });

        test("does triggers click if there is not a hovered item", 0, function(e) {
            diagram.toolService._updateHoveredItem = $.noop;
            diagram.bind("click", function(e) {
                ok(false);
            });
            diagram._tap(tapEvent(10, 20));
        });

        // ------------------------------------------------------------
        module("Diagram / tap / mouse*", {
            setup: function() {
                setup();

                diagram.addShape({
                    id: "TestShape",
                    data: "rectangle",
                    width: 100, height: 100,
                    x: 100,
                    y: 100
                });
            },
            teardown: teardown
        });

        test("triggers mouseEnter on tap", function(e) {
            diagram.bind("mouseEnter", function(e) {
                equal(e.item.id, "TestShape");
            });

            diagram._tap(tapEvent(150, 150));
        });

        test("triggers mouseLeave on tap outside of item", function(e) {
            diagram.bind("mouseLeave", function(e) {
                equal(e.item.id, "TestShape");
            });

            diagram._tap(tapEvent(150, 150));
            diagram._tap(tapEvent(0, 0));
        });

    })();

    // ------------------------------------------------------------
    (function() {
        function move(x, y) {
            diagram._mouseMove({
                which: 0,
                pageX: x,
                pageY: y,
                preventDefault: $.noop
            });
        }

        module("Diagram / mousemove", {
            setup: function() {
                setup();

                diagram.addShape({
                    id: "TestShape",
                    data: "rectangle",
                    width: 100, height: 100,
                    x: 100,
                    y: 100
                });
            },
            teardown: teardown
        });

        test("triggers mouseEnter on mousemove", function(e) {
            diagram.bind("mouseEnter", function(e) {
                equal(e.item.id, "TestShape");
            });

            move(150, 150);
        });

        test("triggers mouseLeave on tap outside of item", function(e) {
            diagram.bind("mouseLeave", function(e) {
                equal(e.item.id, "TestShape");
            });

            move(150, 150);
            move(0, 0);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var MOBILE_ZOOM_RATE = 0.05;
        var MOBILE_PAN_DISTANCE = 5;
        var gesture;

        function createGesture(options) {
            return kendo.deepExtend({
                center: {
                    x: 100,
                    y: 100
                },
                distance: 10,
                preventDefault: function() {}
            }, options);
        };

        module("Diagram / gestures", {
            setup: function() {
                setup();
                gesture = createGesture();
                diagram.documentToView = function(p) {
                    return p;
                };
            },
            teardown: teardown
        });

        test("_gestureStart disables scroller", function () {
            diagram.scroller.disable = function() {
                ok(true);
            };
            diagram._gestureStart(gesture);
        });

        test("_gestureStart saves gesture", function () {
            diagram._gestureStart(gesture);
            ok(diagram._gesture === gesture);
        });

        test("_gestureStart saves initial center", function () {
            diagram.zoom(2);
            diagram._gestureStart(gesture);

            var center = diagram._initialCenter;
            equal(center.x, 50);
            equal(center.y, 50);
        });

        test("_gestureStart triggers zoomStart", function () {
            diagram.zoom(2);
            diagram.bind("zoomStart", function(e) {
                var point = e.point;
                equal(point.x, 50);
                equal(point.y, 50);
                equal(e.zoom, 2);
            });
            diagram._gestureStart(gesture);
        });

        test("_gestureChange updates zoom if scaleDelta is bigger or equal to mobile zoom rate", function () {
            var newDistance = 10 + 10 * MOBILE_ZOOM_RATE;
            diagram._gestureStart(gesture);
            diagram._gestureChange(createGesture({distance: newDistance}));
            var zoom = diagram._zoom;
            var expecteZoom = newDistance / 10;
            equal(zoom, expecteZoom);
        });

        test("_gestureChange does no update zoom if scaleDelta is lower than mobile zoom rate", function () {
            var newDistance = 10;
            diagram._gestureStart(gesture);
            diagram._gestureChange(createGesture({distance: newDistance}));
            var zoom = diagram._zoom;

            equal(zoom, 1);
        });

        test("_gestureChange updates pan if zoom is the same but the center has changed with bigger distance than minimum pan distance", function () {
            var newDistance = 10;
            var newCenter = Math.sqrt(Math.pow(MOBILE_PAN_DISTANCE, 2) / 2) + 101;
            diagram._gestureStart(gesture);

            diagram._gestureChange(createGesture({
                distance: newDistance,
                center: {
                  x: newCenter,
                  y: newCenter
                }
            }));
            var pan = diagram._pan;

            close(pan.x, 4.5, 0.1);
            close(pan.y, 4.5, 0.1);
        });

        test("_gestureChange does not transform diagram if new the current zoom and distance are not big enough", 0, function () {
            var newDistance = 10;
            var newCenter = Math.sqrt(Math.pow(MOBILE_PAN_DISTANCE, 2) / 2) + 99;
            diagram._gestureStart(gesture);

            diagram._panTransform = function() {
                ok(false);
            };
            diagram._gestureChange(createGesture({
                distance: newDistance,
                center: {
                  x: newCenter,
                  y: newCenter
                }
            }));
        });

        test("_gestureEnd enables scroller", function () {
            diagram.scroller.enable = function() {
                ok(true);
            };
            diagram._gestureEnd(gesture);
        });

        test("_gestureEnd does not enable scroller if panning is disabled", 0, function () {
            diagram.options.pannable = false;
            diagram.scroller.enable = function() {
                ok(false);
            };
            diagram._gestureEnd(gesture);
        });

        test("_gestureEnd triggers zoomEnd", function () {
            diagram.zoom(2);
            diagram._gestureStart(gesture);
            diagram.bind("zoomEnd", function(e) {
                var point = e.point;
                equal(point.x, 50);
                equal(point.y, 50);
                equal(e.zoom, 2);
            });
            diagram._gestureEnd(gesture);
        });
    })();

    // ------------------------------------------------------------
    module("Diagram / add shape", {
        setup: function() {
            createDiagram();
            diagram.addShape({
                id: "TestShape",
                data: "rectangle",
                width: 200, height: 100,
                background: "#778899",
                x: 100,
                y: 120
            });
        },
        teardown: teardown
    });

    test("adds shape to shapes", function() {
        equal(diagram.shapes.length, 1);
    });

    test("adds shape to quad tree", function() {
        equal(diagram._shapesQuadTree.rootMap[0][0].shapes.length, 1);
    });

    test("appends shape to main layer", function() {
        var shape = diagram.shapes[0];
        ok($.inArray(shape.visual.drawingContainer(), diagram.mainLayer.drawingContainer().children) >= 0);
    });

    test("shape has 5 connectors by default", function() {
        equal(diagram.shapes[0].connectors.length, 5);
    });

    test("sets shape id", function() {
        equal(diagram.shapes[0].options.id, "TestShape");
    });

    // ------------------------------------------------------------
    (function() {
        var shape;

        module("Diagram / remove", {
            setup: function() {
                createDiagram();
                shape = diagram.addShape({
                    width: 200,
                    height: 100,
                    x: 100,
                    y: 120
                });
            },
            teardown: teardown
        });

        test("removes shape from shapes", function() {
            diagram.remove(shape);
            equal(diagram.shapes.length, 0);
        });

        test("removes shape from quad tree", function() {
            diagram.remove(shape);
            equal(diagram._shapesQuadTree.rootMap[0][0].shapes.length, 0);
        });

        test("removes shape from main layer", function() {
            diagram.remove(shape);
            equal(diagram.mainLayer.children.length, 0);
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var shape;

        module("Diagram / clear", {
            setup: function() {
                createDiagram();
                shape = diagram.addShape({
                    width: 200,
                    height: 100,
                    x: 100,
                    y: 120
                });
                diagram.select(shape);
            },
            teardown: teardown
        });

        test("clears shapes", function() {
            diagram.clear();
            equal(diagram.shapes.length, 0);
        });

        test("clears quad tree", function() {
            diagram._shapesQuadTree.clear = function() {
                ok(true);
            };
            diagram.clear();
        });

        test("clears selection", function() {
            diagram.clear();
            equal(diagram._selectedItems.length, 0);
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var shape;

        function setupShapeDefaults(shapeDefaults) {
            createDiagram({
                shapeDefaults: shapeDefaults
            });
        }

        module("Diagram / shapeDefaults", {
            teardown: teardown
        });

        test("default shape type", function() {
            setupShapeDefaults({type: "circle"});
            shape = diagram.addShape({id: "shape1"});

            equal("circle", shape.options.type, "the type of the shape should come from shapeDefaults");
        });

        test("default shape path", function() {
            setupShapeDefaults({path: "m0,100 L100,100 L50,0z"});
            shape = diagram.addShape({id: "shape1"});

            equal("m0,100 L100,100 L50,0z", shape.options.path, "path should be set by the shapeDefaults");
        });

        test("shape is undoable", function() {
            setupShapeDefaults({});
            shape = diagram.addShape({id: "shape1"});

            equal(shape, diagram.undoRedoService.stack[0].shape, "shape is undoable");
        });

        test("editable connect is true by default", function() {
            setupShapeDefaults({});
            shape = diagram.addShape({id: "shape1"});

            equal(shape.options.editable.connect, true);
        });

        test("editable connect is set", function() {
            setupShapeDefaults({
                editable: {
                    connect: false
                }
            });
            shape = diagram.addShape({id: "shape1"});

            equal(shape.options.editable.connect, false);
        });

        test("editable is set to false if diagram editable is false", function() {
            createDiagram({
                editable: false
            });
            shape = diagram.addShape({id: "shape1"});

            equal(shape.options.editable, false);
        });

        test("shapeDefaults connectors are overridden by the user options", function() {
            setupShapeDefaults({
                connectors: [{name: "right"}]
            });
            shape = diagram.addShape({id: "shape1"});

            equal(shape.options.connectors.length, 1);
            equal(shape.options.connectors[0].name, "right");
        });

        test("shapeDefaults editable drag is set", function() {
            setupShapeDefaults({
                editable: {
                    drag: false
                }
            });
            equal(diagram.options.shapeDefaults.editable.drag, false);
        });

        test("shapeDefaults editable drag is set from the diagram editable options if not set", function() {
            createDiagram({
                editable: {
                    drag: false
                }
            });
            equal(diagram.options.shapeDefaults.editable.drag, false);
        });

        test("shapeDefaults editable drag is not overridden by the diagram editable options", function() {
            createDiagram({
                editable: {
                    drag: false
                },
                shapeDefaults: {
                    editable: {
                        drag: true
                    }
                }
            });
            equal(diagram.options.shapeDefaults.editable.drag, true);
        });

        test("shapeDefaults editable remove is set", function() {
            setupShapeDefaults({
                editable: {
                    remove: false
                }
            });
            equal(diagram.options.shapeDefaults.editable.remove, false);
        });

        test("shapeDefaults editable remove is set from the diagram editable options if not set", function() {
            createDiagram({
                editable: {
                    remove: false
                }
            });
            equal(diagram.options.shapeDefaults.editable.remove, false);
        });

        test("shapeDefaults editable remove is not overridden by the diagram editable options", function() {
            createDiagram({
                editable: {
                    remove: false
                },
                shapeDefaults: {
                    editable: {
                        remove: true
                    }
                }
            });

            equal(diagram.options.shapeDefaults.editable.remove, true);
        });

    })();

    // ------------------------------------------------------------
    (function() {

        module("Diagram / connectionDefaults", {
            teardown: teardown
        });

        test("editable drag is set", function() {
            createDiagram({
                connectionDefaults: {
                    editable: {
                        drag: false
                    }
                }
            });
            equal(diagram.options.connectionDefaults.editable.drag, false);
        });

        test("editable drag is set from the diagram editable options if not set", function() {
            createDiagram({
                editable: {
                    drag: false
                }
            });
            equal(diagram.options.connectionDefaults.editable.drag, false);
        });

        test("editable drag is not overridden by the diagram editable options", function() {
            createDiagram({
                editable: {
                    drag: false
                },
                connectionDefaults: {
                    editable: {
                        drag: true
                    }
                }
            });
            equal(diagram.options.connectionDefaults.editable.drag, true);
        });

        test("editable remove is set", function() {
            createDiagram({
                connectionDefaults: {
                    editable: {
                        remove: false
                    }
                }
            });
            equal(diagram.options.connectionDefaults.editable.remove, false);
        });

        test("editable remove is set from the diagram editable options if not set", function() {
            createDiagram({
                editable: {
                    remove: false
                }
            });
            equal(diagram.options.connectionDefaults.editable.remove, false);
        });

        test("editable remove is not overridden by the diagram editable options", function() {
            createDiagram({
                editable: {
                    remove: false
                },
                connectionDefaults: {
                    editable: {
                        remove: true
                    }
                }
            });

            equal(diagram.options.connectionDefaults.editable.remove, true);
        });

        test("the connection type is set", function() {
            createDiagram({
                connectionDefaults: {
                    type: "cascading"
                }
            });
            var connection = diagram.connect(new Point(), new Point());
            equal(diagram.options.connectionDefaults.type, "cascading");
            equal(connection.type(), "cascading");
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var diagram;
        module("Diagram / Toolbar", {
            teardown: function() {
                diagram.destroy();
            }
        });

        test("does not create global toolbar if editable is false", function() {
            diagram = setupEditableDiagram({
                editable: false
            });
            ok(!diagram.toolBar);
        });

        test("does not create element toolbar if element editable option is set to false", function() {
            diagram = setupEditableDiagram({});
            var shape = diagram.shapes[0];
            shape.options.editable = false;
            diagram.select(shape);
            diagram._createToolBar();
            ok(!diagram.singleToolBar);
        });

        test("creates element toolbar with edit, rotateClockwise, rotateAnticlockwise and delete tools for shapes if no tools are set", function() {
            diagram = setupEditableDiagram({});
            var shape = diagram.shapes[0];
            diagram.select(shape);
            diagram._createToolBar();
            var tools = diagram.singleToolBar.options.tools;
            equal(tools.length, 4);
            equal(tools[0], "edit");
            equal(tools[1], "rotateClockwise");
            equal(tools[2], "rotateAnticlockwise");
            equal(tools[3], "delete");
        });

        test("does not include delete action if shape editable remove option is set to false", function() {
            diagram = setupEditableDiagram({});
            var shape = diagram.shapes[0];
            shape.options.editable.remove = false;
            diagram.select(shape);
            diagram._createToolBar();

            equal($.inArray("delete", diagram.singleToolBar.options.tools), -1);
        });

        test("creates element toolbar with edit and delete tools for connections if no tools are set", function() {
            diagram = setupEditableDiagram({});
            var connection = diagram.connections[0];
            diagram.select(connection);
            diagram._createToolBar();
            var tools = diagram.singleToolBar.options.tools;
            equal(tools.length, 2);
            equal(tools[0], "edit");
            equal(tools[1], "delete");
        });

        test("does not include delete action if connection editable remove option is set to false", function() {
            diagram = setupEditableDiagram({});
            var connection = diagram.connections[0];
            connection.options.editable.remove = false;
            diagram.select(connection);
            diagram._createToolBar();

            equal($.inArray("delete", diagram.singleToolBar.options.tools), -1);
        });
    })();

    // ------------------------------------------------------------
    (function() {

        module("Diagram / pan", {
            setup: setup,
            teardown: teardown
        });

        test("pan calls scroller scrollTo method with negated pan", function() {
            diagram.scroller.scrollTo = function(x, y) {
                equal(x, -100);
                equal(y, -200);
            };
            diagram.pan(new Point(100, 200));
        });

        test("pan updatesAdorners after scrollTo", function() {
            var scrollCompleted = false;
            diagram._updateAdorners = function() {
                ok(scrollCompleted);
            };
            diagram.scroller.scrollTo = function(x, y) {
                scrollCompleted = true;
            };
            diagram.pan(new Point(100, 200));
        });

        test("pan calls scroller animatedScrollTo method with negated pan if second parameter is true", function() {
            diagram.scroller.animatedScrollTo = function(x, y) {
                equal(x, -100);
                equal(y, -200);
            };
            diagram.pan(new Point(100, 200), true);
        });

        test("pan updatesAdorners in animatedScrollTo completed callback", function() {
            var scrollCompleted = false;
            diagram._updateAdorners = function() {
                ok(scrollCompleted);
            };

            diagram.scroller.animatedScrollTo = function(x, y, callback) {
                scrollCompleted = true;
                callback();
            };
            diagram.pan(new Point(100, 200), true);
        });

        test("pan adds passed pan to the current stored pan if panning is not handled by the canvas", function() {
            diagram.scroller.scrollTo = function(x, y) {
                equal(x, -150);
                equal(y, -300);
            };
            delete diagram.canvas.translate;
            diagram._pan = new Point(50, 100);
            diagram.pan(new Point(100, 200));
        });

        test("pan does not call scroller scrollTo or animatedScrollTo method if no point is passed", 0, function() {
            diagram.scroller.animatedScrollTo = function() {
                ok(false);
            };
            diagram.scroller.scrollTo = function() {
                ok(false);
            };

            diagram.pan()
        });

    })();
    // ------------------------------------------------------------
    (function() {
        var rect;
        var shape;
        var newPan;
        var viewport = new Rect(0, 0, 800, 600);

        function setupBringIntoView(options) {
                createDiagram(options);
                diagram.viewport = function() {
                    return viewport;
                };
                diagram.pan = function(point) {
                    if (point) {
                        this._storePan(point);
                    }
                    return this._pan;
                };
                diagram._zoomMainLayer = function() {};
        }

        module("Diagram / bring into view", {
            setup: function() {
                setupBringIntoView();
            },
            teardown: teardown
        });

        test("clears current pan", function () {
            diagram._storePan = function(pan) {
                equal(pan.x, 0);
                equal(pan.y, 0);
            };

            diagram.pan = function() {
                return this._pan;
            };
            diagram.bringIntoView(new Rect(0, 0, 400, 400));
        });

        test("passes animate option to pan", function () {
            diagram.pan = function(pan, animate) {
                ok(animate);
            };
            diagram.bringIntoView(new Rect(0, 0, 400, 400), {animate: true});
            diagram.pan = function(pan, animate) {
                ok(!animate);
            };
            diagram.bringIntoView(new Rect(0, 0, 400, 400), {animate: false});
        });

        test("rectangle", function () {
            rect = new Rect(0, 0, 400, 400);
            diagram.bringIntoView(rect);
            newPan = new Point(viewport.width / 2, viewport.height / 2).minus(rect.center());
            deepEqual(diagram.pan(), newPan.times(-1));
        });

        test("shape", function () {
            shape = diagram.addShape({});
            rect = shape.bounds();

            diagram.bringIntoView(shape);
            newPan = new Point(viewport.width / 2, viewport.height / 2).minus(rect.center());
            deepEqual(diagram.pan(), newPan.times(-1));
        });

        test("multiple shapes", function () {
            shape = diagram.addShape({});
            var point = new Point(500, 500);
            var shape1 = diagram.addShape({
                x: point.x,
                y: point.y
            });

            rect = shape.bounds().union(shape1.bounds());

            diagram.bringIntoView([shape, shape1], {center: true});
            newPan = new Point(viewport.width / 2, viewport.height / 2).minus(rect.center());
            deepEqual(diagram.pan(), newPan.times(-1));
        });

        test("align top right", function () {
            shape = diagram.addShape({});
            rect = shape.bounds("transformed");

            newPan = viewport.topRight().minus(rect.topRight()).plus(diagram.pan()).times(-1);
            diagram.bringIntoView([shape], {align: "top right"});
            equal(diagram.pan().x, Math.floor(newPan.x));
            equal(diagram.pan().y, Math.floor(newPan.y));
        });

        test("align center bottom", function () {
            shape = diagram.addShape({});
            rect = shape.bounds("transformed");

            newPan = viewport.bottom().minus(rect.bottom()).plus(diagram.pan()).times(-1);
            diagram.bringIntoView([shape], {align: "center bottom"});
            equal(diagram.pan().x, newPan.x);
            equal(diagram.pan().y, newPan.y);
        });

        module("Diagram / bring into view / zoom", {
            setup: function() {
                setupBringIntoView({
                    zoom: 2
                });
            },
            teardown: teardown
        });

        test("takes current zoom into account", function() {
            rect = new Rect(1000, 1000, 100, 100);
            diagram.bringIntoView(rect);
            newPan = new Point(viewport.width / 2, viewport.height / 2).minus(rect.clone().zoom(2).center()).times(-1);
            deepEqual(diagram.pan(), newPan);
        });

        test("zooms out if the bounding rect width or height is bigger than the viewport width or height", function() {
            rect = new Rect(1000, 1000, 1000, 100);
            diagram._zoomMainLayer = function() {
                close(diagram._zoom, 800 / 1000, 0.1);
            };
            diagram.bringIntoView(rect);

            rect = new Rect(1000, 1000, 100, 1000);
            diagram._zoomMainLayer = function() {
                close(diagram._zoom, 600 / 1000, 0.1);
            };
            diagram.bringIntoView(rect);
        });

        test("doe not zoom out if viewport has zero width or height", function() {
            var initialZoom = diagram.zoom();
            rect = new Rect(1000, 1000, 1000, 100);
            diagram.viewport = function() {
                return new Rect(0, 0, 0, 600);
            };

            diagram.bringIntoView(rect);
            equal(diagram.zoom(), initialZoom);
            diagram.viewport = function() {
                return new Rect(0, 0, 800, 0);
            };

            diagram.bringIntoView(rect);
            equal(diagram.zoom(), initialZoom);
        });

    })();

    // ------------------------------------------------------------
    (function() {
        module("initialization / layout", {
            teardown: teardown
        });

        test("stores grid layout width option", function () {
            createDiagram({ layout: {
                    grid: {
                        width: 600
                    }
                }
            });
            equal(diagram.options.layout.grid.width, 600, "");
        });

        test("applies layout for shapes and connections added with the configuration", function () {
            createDiagram({
                layout: {
                    type: "layered"
                },
                connections: [{
                    from: {
                        shapeId: "shape1"
                    },
                    to: {
                        shapeId: "shape2"
                    }
                }],
                shapes: [{
                    id: "shape1"
                }, {
                    id: "shape2"
                }]
            });

            ok(diagram.shapes[0].bounds().x !== 0);
            ok(diagram.shapes[1].bounds().x !== 0);
        });
    })();

    (function() {
        var shape;

        // ------------------------------------------------------------
        module("Shape / initialization", {
            setup: setup,
            teardown: teardown
        });

        test("sets autoSize to true to visual group by default", function() {
            shape = diagram.addShape({});
            equal(shape.visual.options.autoSize, true);
        });

        test("sets autoSizeto visual group base on the options", function() {
            shape = diagram.addShape({
                autoSize: false
            });
            equal(shape.visual.options.autoSize, false);
        });

        // ------------------------------------------------------------
        module("Shape / types", {
            setup: setup,
            teardown: teardown
        });

        test("create path shape", function() {
            shape = diagram.addShape({
                id: "pathShape",
                path: "m0,100 L100,100 L50,0z"
            });

            equal(diagram.shapes.length, 1, "should have a single path");
            var path = diagram.shapes[0];
            equal(path.shapeVisual.data(), shape.options.path, "the shape visual should have the same path data");
        });

        test("path shape should be translated to the origin", function() {
            shape = diagram.addShape({
                id: "pathShape",
                path: "M100,100 L 300,300"
            });
            var bbox = shape.shapeVisual.drawingContainer().clippedBBox(null);

            equal(bbox.origin.x, 0);
            equal(bbox.origin.y, 0);
        });

        test("create image shape", function() {
            shape = diagram.addShape({
                id: "imageShape",
                type: "image",
                source: "http://demos.telerik.com/kendo-ui/content/web/foods/1.jpg"
            });

            equal(diagram.shapes.length, 1, "should have a single group with rect");
            var imageShape = diagram.shapes[0];
            equal(imageShape.shapeVisual.options.source, "http://demos.telerik.com/kendo-ui/content/web/foods/1.jpg", "the shape visual should have the same image source");
        });

        test("visual template", function() {
            var visualCalled = false;
            shape = diagram.addShape({
                id: "visualShape",
                visual: function() {
                    visualCalled = true;
                    return new dataviz.diagram.Group({ id: "shapeRoot" });
                }
            });

            ok(visualCalled, "visual method should be called");
            equal(diagram.shapes.length, 1, "should have a single shape");
        });

        test("visual template should be used if both template and path are specified", function() {
            var visualCalled = false;
            shape = diagram.addShape({
                id: "visualShape",
                path: "M100 100L 200, 200",
                visual: function() {
                    visualCalled = true;
                    return new dataviz.diagram.Group({ id: "shapeRoot" });
                }
            });

            ok(visualCalled, "visual method should be called");
            equal(diagram.shapes[0].shapeVisual.id, "shapeRoot");
        });

        test("typed shape", function() {
            shape = diagram.addShape({
                id: "circle",
                type: "circle"
            });

            equal(diagram.shapes.length, 1, "should have a single shape");
            equal(diagram.shapes[0].shapeVisual.options.type, shape.options.type, "shape visual is same type as the shape itself");
        });

        // ------------------------------------------------------------
        (function() {
            var contentVisual;

            function setupShape(options) {
                shape = diagram.addShape(options);
                contentVisual = shape._contentVisual;
            }

            module("Shape / Content", {
                setup: setup,
                teardown: teardown
            });

            test("template", function() {
                setupShape({
                    content: {
                        template: "foo"
                    }
                });

                equal(shape.options.content.text, "foo");
                equal(contentVisual.content(), "foo");
            });

            test("text", function() {
                setupShape({
                    content: {
                        text: "foo"
                    }
                });

                equal(shape.options.content.text, "foo");
                equal(contentVisual.content(), "foo");
            });

            test("content should extend content options if an object is passed", function() {
                setupShape({
                    content: {
                        text: "foo"
                    }
                });
                shape.content({
                    text: "bar",
                    fill: {
                        color: "#2e2e2e"
                    }
                });

                equal(shape.options.content.text, "bar");
                equal(shape.options.content.fill.color, "#2e2e2e");
            });

            test("aligns text", function() {
                setupShape({
                    content: {
                        text: "foo",
                        align: "center middle"
                    },
                    type: "rectangle",
                    width: 100,
                    height: 100
                });

                var contentBBox = contentVisual.drawingElement.bbox(null);
                var position = contentVisual.position();
                close(position.x, (100 - contentBBox.width()) / 2, 1);
                close(position.y, (100 - contentBBox.height()) / 2, 1);
            });

            test("aligns text with transformed visual", function() {
                setupShape({
                    content: {
                        text: "foo",
                        align: "center middle"
                    },
                    type: "rectangle",
                    width: 100,
                    height: 100,
                    x: 200,
                    y: 100,
                    rotation: {
                        angle: 30
                    }
                });

                shape.bounds(new Rect(0, 0, 200, 200));
                shape.content("foo");

                var contentBBox = contentVisual.drawingElement.bbox(null);
                var position = contentVisual.position();
                close(position.x, (100 - contentBBox.width()) / 2, 1);
                close(position.y, (100 - contentBBox.height()) / 2, 1);
            });

        })();

        (function() {
            var bounds;

            // ------------------------------------------------------------
            module("Shape / bounds", {
                setup: setup,
                teardown: teardown
            });

            test("inits position", function() {
                shape = diagram.addShape({
                    id: "visualShape",
                    type: "rectangle",
                    x: 10,
                    y: 40
                });
                bounds = shape.bounds();
                equal(bounds.x, 10);
                equal(bounds.y, 40);
            });

            test("dose not set position to shape visual", function() {
                shape = diagram.addShape({
                    id: "visualShape",
                    type: "rectangle",
                    x: 10,
                    y: 40
                });
                var visual = shape.shapeVisual;
                equal(visual.options.x, 0);
                equal(visual.options.y, 0);
            });

            test("inits width and height based on visual content", function() {
                shape = diagram.addShape({
                    id: "visualShape",
                    visual: function() {
                        return new dataviz.diagram.Rectangle({ width: 300, height: 150, stroke: {width: 0}});
                    }
                });
                bounds = shape.bounds();
                equal(bounds.width, 300);
                equal(bounds.height, 150);
            });

            test("inits width and height based on width and height options with predefined type", function() {
                shape = diagram.addShape({
                    type: "rectangle",
                    width: 150,
                    height: 200,
                    stroke: {width: 0}
                });
                bounds = shape.bounds();
                equal(bounds.width, 150);
                equal(bounds.height, 200);
            });

            // ------------------------------------------------------------
            var shapeVisual;

            module("Shape / bounds / update", {
                setup: function() {
                    setup();
                    shape = diagram.addShape({
                        type: "rectangle",
                        width: 150,
                        height: 200,
                        stroke: {width: 0},
                        content: {
                            text: "foo"
                        },
                        rotation: {
                            angle: 30
                        }
                    });
                    shapeVisual = shape.visual.children[0];
                },
                teardown: teardown
            });

            test("updateBounds should update shape bounds", function() {
                shapeVisual.redraw({
                    width: 300,
                    height: 100
                });
                shape.updateBounds();
                bounds = shape.bounds();
                equal(bounds.width, 300);
                equal(bounds.height, 100);
            });

            test("updateBounds should update content alignment", function() {
                var contentVisual = shape._contentVisual;
                contentVisual.drawingElement.measure = function() {
                    return {width: 30, height: 10};
                };
                shapeVisual.redraw({
                    width: 300,
                    height: 100
                });
                shape.updateBounds();
                var position = contentVisual.position();

                equal(position.x, 135);
                equal(position.y, 45);
            });

            test("updateBounds should update rotation", function() {
                shapeVisual.redraw({
                    width: 300,
                    height: 100
                });
                shape.updateBounds();
                var rotation = shape.visual.rotate();
                equal(rotation.x, 150);
                equal(rotation.y, 50);
            });
        })();

        // ------------------------------------------------------------
        (function() {
            module("Shape / rotate", {
                setup: function() {
                    setup();
                    shape = diagram.addShape({
                        id: "visualShape",
                        type: "rectangle",
                        x: 10,
                        y: 40,
                        width: 100,
                        height: 100,
                        rotation: {
                            angle: 30
                        }
                    });
                },
                teardown: teardown
            });

            test("Adds RotationUnit only if angle has changed", function() {
                var stackCount = diagram.undoRedoService.count();
                shape.rotate(30);
                equal(diagram.undoRedoService.count(), stackCount);
                shape.rotate(40);
                equal(diagram.undoRedoService.count(), stackCount + 1);
            });

        })();

        (function() {
            var Connection = dataviz.diagram.Connection;

            // ------------------------------------------------------------
            module("Shape / redraw", {
                setup: function() {
                    setup();
                    shape = diagram.addShape({
                        id: "visualShape",
                        type: "rectangle",
                        x: 10,
                        y: 40,
                        width: 100,
                        height: 100
                    });
                },
                teardown: teardown
            });

            test("redraw sets new position", function() {
                shape.redraw({
                    x: 20,
                    y: 50
                });
                var bounds = shape.bounds();
                equal(bounds.x, 20);
                equal(bounds.y, 50);
            });

            test("redraw sets new width and height", function() {
                shape.redraw({
                    x: 200,
                    y: 300
                });

                var bounds = shape.bounds();
                equal(bounds.x, 200);
                equal(bounds.y, 300);
            });

            test("redraw calls _rotate if bounds have changed", function() {
                shape._rotate = function() {
                    ok(true);
                };

                shape.redraw({
                    width: 200
                });
            });

            test("redraw calls _rotate if rotation is passed", function() {
                shape._rotate = function() {
                   equal(this.options.rotation.angle, 33);
                };

                shape.redraw({
                    rotation: {
                        angle: 33
                    }
                });
            });

            test("redraw sets content", function() {
                shape.content = function(options) {
                    equal(options.text, "foo");
                };
                shape.redraw({content: {text: "foo"}});
            });

            test("redraw redraws shape visual with visual options", function() {
                var visualOptions = {
                    path: "foo",
                    source: "bar",
                    hover: {fill: "fooHover"},
                    fill: {color: "fooColor"},
                    stroke: {width: 3},
                    startCap: "fooCap",
                    endCap: "fooCap"
                };

                shape.shapeVisual.redraw = function(options) {
                    equal(options.data, visualOptions.path);
                    equal(options.source, visualOptions.source);
                    equal(options.hover.fill, visualOptions.hover.fill);
                    equal(options.fill.color, visualOptions.fill.color);
                    equal(options.startCap, visualOptions.startCap);
                    equal(options.endCap, visualOptions.endCap);
                };

                shape.redraw(visualOptions);
            });

            test("redraw updates connectors", function() {
                shape.redraw({
                    connectors: [{name: "top"}]
                });
                equal(shape.connectors.length, 1);
                equal(shape.connectors[0].options.name, "top");
            });

            test("redraw updates connection source with the new instance", function() {
                var connection = new Connection(shape.getConnector("top"), new Point());
                shape.redraw({
                    connectors: [{name: "top"}]
                });
                ok(connection.source() === shape.getConnector("top"));
            });

            test("redraw sets connection source to the source point if previous connector is not from the new connectors", function() {
                var connection = new Connection(shape.getConnector("auto"), new Point());
                shape.redraw({
                    connectors: [{name: "top"}]
                });
                ok(connection.source().equals(connection.sourcePoint()));
            });

            test("redraw updates connection target with the new instance", function() {
                var connection = new Connection(new Point(), shape.getConnector("top"));
                shape.redraw({
                    connectors: [{name: "top"}]
                });
                ok(connection.target() === shape.getConnector("top"));
            });

            test("redraw sets connection target to the target point if previous connector is not from the new connectors", function() {
                var connection = new Connection(new Point(), shape.getConnector("auto"));
                shape.redraw({
                    connectors: [{name: "top"}]
                });
                ok(connection.target().equals(connection.targetPoint()));
            });

            test("redraw updates connection model", 2, function() {
                var connectionSource = new Connection(shape.getConnector("auto"), new Point());
                var connectionTarget = new Connection(new Point(), shape.getConnector("auto"));
                connectionSource.updateModel = connectionTarget.updateModel = function() {
                    ok(true);
                };
                shape.redraw({
                    connectors: [{name: "top"}]
                });
            });
        })();

        // ------------------------------------------------------------
        module("Shape / bounds / events", {
            setup: setup,
            teardown: teardown
        });

        test("itemBoundsChange event is raised after position set", function () {
            var s = diagram.addShape({}),
                raised;

            diagram.bind("itemBoundsChange", function () {
                raised = true;
            });

            s.position(new Point(100, 100));
            ok(raised);
        });

        test("itemBoundsChange event is raised after bounds set", function () {
            var s = diagram.addShape({}),
                raised;

            diagram.bind("itemBoundsChange", function () {
                raised = true;
            });

            s.bounds(new Rect(100, 100, 100, 100));

            ok(raised);
        });


        test("Add shape raises change event", function() {
            var eventShape = null,
                called = false;

            diagram.bind("change", function(args) {
                eventShape = args.added[0];
                called = true;
            });

            var addedShape = diagram.addShape({});
            ok(called, "change event should be raised");
            equal(eventShape, addedShape, "the reported shape should be the same as the added");
        });

        test("Remove shape raises change event", function() {
            var eventShape = null,
                called = false,
                shape = diagram.addShape({});

            diagram.bind("change", function(args) {
                eventShape = args.removed[0];
                called = true;
            });

            diagram.remove(shape);
            ok(called, "change event should be raised");
            equal(eventShape, shape, "the reported shape should be the same as the removed");
        });

        test("Remove multiple items raises change event", function() {
            var eventShapes = [],
                point = new Point(1, 0),
                shapes = [diagram.addShape({}), diagram.addShape({ x: point.x, y: point.y })];

            diagram.bind("change", function(args) {
                eventShapes = args.removed;
            });

            diagram.remove(shapes);
            equal(eventShapes.length, shapes.length, "all shapes should be reported by the event handler");
        });

        test("Remove selected shapes raises change event with the removed shapes as parameter", 1, function() {
            var eventShape = null,
                called = false,
                shape = diagram.addShape({});

            diagram.bind("change", function(args) {
                eventShape = args.removed[0];
                ok(eventShape === shape);
            });
            diagram.select(shape);
            diagram.remove(diagram.select());
        });

        // ------------------------------------------------------------
        module("Shape / bounds / zoom", {
            setup: setup,
            teardown: teardown
        });

        test("visual bounds are ok after zoom", function () {
            var s = diagram.addShape({});
            var z = 0.5;
            z = diagram.zoom(z);

            var vb = s.bounds("transformed");
            var b = s.bounds();
            close(b.width, vb.width / z, tolerance);
            close(b.height, vb.height / z, tolerance);
        });
    })();

    // ------------------------------------------------------------
    module("event handling", {
        setup: setup,
        teardown: teardown
    });

    test("limit zoom with min/max values", function () {
        equal(diagram._getValidZoom(0.7), 0.7, "valid, zoom out");
        equal(diagram._getValidZoom(1), 1, "valid, no zoom");
        equal(diagram._getValidZoom(1.4), 1.4, "valid, zoom in");
        equal(diagram._getValidZoom(2), 2, "is max");
        equal(diagram._getValidZoom(2.2), 2, "above max");
    });

    test("zoom does not change the pan", function () {
        var pan = diagram._pan.clone();
        diagram.zoom(1.1);

        ok(pan.equals(diagram._pan));
    });

    test("zoom at position changes diagram zoom", function () {
        var zoom = diagram.zoom(1.1, new Point(200, 200));
        equal(zoom, 1.1);
    });

    // ------------------------------------------------------------
    module("Coordinate transformations", {
        setup: setup,
        teardown: teardown
    });

    test("transform document point to view point", function() {
        var doc = diagram.element.offset(),
            point = new Point(100, 100);

        var result = diagram.documentToView(point);

        roughlyEqualPoint(result, new Point(point.x - doc.left, point.y - doc.top), "transformed point should be relative to the diagram view");
    });

    test("transform document point to view point when there is a toolbar", function() {
        diagram.options.editable.tools = ["undo"];
        diagram._createGlobalToolBar();

        var offset = diagram.element.offset();
        var point = new Point(100, 100);
        var toolbarHeight = diagram.toolBar.element.outerHeight();
        var result = diagram.documentToView(point);

        roughlyEqualPoint(result, new Point(point.x - offset.left, point.y - offset.top - toolbarHeight));
    });

    test("transform view point to document point", function() {
        var doc = diagram.element.offset(),
            point = new Point(100, 100);

        var result = diagram.viewToDocument(point);

        roughlyEqualPoint(result, new Point(point.x + doc.left, point.y + doc.top), "transformed point should include the diagram container offset");
    });

    test("transform view point to document point when there is a toolbar", function() {
        diagram.options.editable.tools = ["undo"];
        diagram._createGlobalToolBar();

        var offset = diagram.element.offset();
        var point = new Point(100, 100);
        var toolbarHeight = diagram.toolBar.element.outerHeight();
        var result = diagram.viewToDocument(point);

        roughlyEqualPoint(result, new Point(point.x + offset.left, point.y + offset.top + toolbarHeight));
    });

    test("transform view to layer point", function() {
        var point = new Point(100, 100);
        diagram.zoom(1.5);

        var result = diagram.viewToModel(point);

        roughlyEqualPoint(result, point.times(1/1.5), "view point should correspond to a scaled down vector in the layer");
    });

    test("transform layer to view point", function() {
        var point = new Point(100, 100);
        diagram.zoom(1.5);

        var result = diagram.modelToView(point);

        roughlyEqualPoint(result, point.times(1.5), "layer point should appear as zoomed in the view coordinate system");
    });

    test("transform document to layer", function() {
        var point = new Point(100, 100);
        diagram.zoom(1.5);
        diagram.pan(-20, -20);

        var result = diagram.documentToModel(point);
        var expected = diagram.viewToModel(diagram.documentToView(point));

        roughlyEqualPoint(result, expected, "document to layer transformation should be same as document->view->layer");
    });

    test("transform layer to document", function() {
        var point = new Point(100, 100);
        diagram.zoom(1.5);
        diagram.pan(-20, -20);

        var result = diagram.modelToDocument(point);
        var expected = diagram.viewToDocument(diagram.modelToView(point));

        roughlyEqualPoint(result, expected, "layer->view->document");
    });

    (function() {
        var Connection = dataviz.diagram.Connection;
        var source, target, shape1, shape2, connection;

        // ------------------------------------------------------------
        module("Diagram / Connections and connectors / initialization", {
            teardown: teardown
        });

        test("connection is created with 'to' reference to a shape", function() {
            createDiagram({
                shapes: [{id: "s1"}, {id: "s2"}],
                connections: [{
                    from: { shapeId: "s1", connector: "auto" },
                    to: "s2"
                }]
            });

            equal(diagram.connections.length, 1, "diagram should have a single connection");
            equal(diagram.connections[0].to.shape, diagram.getShapeById("s2"), "the to property should point to the second shape");
        });

        test("creates connection on init", function() {
            createDiagram({
                shapes: [{id: "s1"},{id: "s2"}],
                connections: [{
                    from: { shapeId: "s1" },
                    to: { shapeId: "s2" }
                }]
            });

            connection = diagram.connections[0];
            source = connection.source();
            target = connection.target();

            equal(diagram.connections.length, 1, "one connection should be created");
            equal(source.shape.id, "s1", "source should be the from shape");
            equal(target.shape.id, "s2", "target should be the to shape");
        });

        test("connections init with specific connector", function() {
            createDiagram({
                shapes: [{
                    id: "s1"
                },{
                    id: "s2"
                }],
                connections: [{
                    from: {
                        shapeId: "s1",
                        connector: "bottom"
                    },
                    to: {
                        shapeId: "s2",
                        connector: "top"
                    }
                }]
            });

            connection = diagram.connections[0];
            source = connection.source();
            target = connection.target();

            equal(source.options.name, "Bottom", "source connector is specific");
            equal(target.options.name, "Top", "target connector is specific");
        });

        // ------------------------------------------------------------
        module("Diagram / connect", {
            setup: setup,
            teardown: teardown
        });

        test("adds connections", function () {
            var shape3, bottomCorner;

            shape1 = AddShape(diagram, new Point(100, 120),
                kendo.deepExtend(Shapes.SequentialData, {
                    width: 80, height: 80, title: "sequential data"
                }));
            shape2 = AddShape(diagram, new Point(100, 400));
            shape3 = AddShape(diagram, new Point(370, 400), Shapes.Wave);

            bottomCorner = shape1.getConnector("Bottom");
            diagram.connect(bottomCorner, shape2.getConnector("Top"), {
                startCap: "ArrowEnd",
                endCap: "FilledCircle"
            });
            diagram.connect(bottomCorner, shape3.getConnector("Top"));
            equal(diagram.connections.length, 2, "diagram should have 2 connections");
        });

        test("sets auto connectors", function () {
            shape1 = diagram.addShape({});
            shape2 = diagram.addShape({ x: 100, y: 0 });

            connection = diagram.connect(shape1, shape2);
            equal(connection.sourceConnector.options.name, "Auto");
            equal(connection.targetConnector.options.name, "Auto");
        });

        test("resolves auto connectors", function () {
            shape1 = diagram.addShape({});
            shape2 = diagram.addShape({ x: 100, y: 0 });

            connection = diagram.connect(shape1, shape2);
            equal(connection._resolvedSourceConnector.options.name, "Right");
            equal(connection._resolvedTargetConnector.options.name, "Left");
        });

        test("resolves auto connectors border", function () {
            shape1 = diagram.addShape({ x: 100, y: 100 });
            shape2 = diagram.addShape({ x: 160, y: 160 });

            connection = diagram.connect(shape1, shape2);
            equal(connection._resolvedSourceConnector.options.name, "Bottom");
            equal(connection._resolvedTargetConnector.options.name, "Left");
        });

        test("resolves auto connectors after move", function () {
            shape1 = diagram.addShape({ x: 100, y: 100 });
            shape2 = diagram.addShape({ x: 160, y: 160 });

            connection = diagram.connect(shape1, shape2);
            equal(connection._resolvedSourceConnector.options.name, "Bottom");
            equal(connection._resolvedTargetConnector.options.name, "Left");

            shape2.position(new Point(300, 100));
            connection.refresh();
            equal(connection._resolvedSourceConnector.options.name, "Right");
            equal(connection._resolvedTargetConnector.options.name, "Left");
        });

        test("Connection detach", function () {
            shape1 = diagram.addShape({});
            shape2 = diagram.addShape({ x: 200, y: 0 });

            connection = diagram.connect(shape1, shape2);
            connection.select(true);
            diagram.toolService.start(shape2.bounds().left());

            ok(connection.adorner, "The connection edit adorner is present");
            ok(diagram.toolService.activeTool.type === "ConnectionTool", "The active tool is ConnectionEditTool");

            diagram.toolService.move(new Point(400, 0));
            diagram.toolService.end(new Point(400, 0));

            equal(connection._resolvedSourceConnector.options.name, "Right");
            equal(connection.sourceConnector.options.name, "Auto");
        });


        // ------------------------------------------------------------
        module("Diagram / connection events", {
            setup: setup,
            teardown: teardown
        });

        test("addConnection triggers change", 2, function() {
            var connection = new Connection(new Point(), new Point(100, 100));
            diagram.bind("change", function(args) {
                equal(args.added.length, 1);
                ok(args.added[0] === connection);
            });

            diagram.addConnection(connection);
        });

        test("connect triggers change", 2, function() {
            shape1 = diagram.addShape({ x: 100, y: 100 });
            shape2 = diagram.addShape({ x: 160, y: 160 });
            diagram.bind("change", function(args) {
                equal(args.added.length, 1);
                ok(args.added[0] instanceof Connection);
            });

            diagram.connect(shape1, shape2);
        });

        test("removing connection triggers change", 2, function() {
            var connection = new Connection(new Point(), new Point(100, 100));
            diagram.addConnection(connection);
            diagram.bind("change", function(args) {
                equal(args.removed.length, 1);
                ok(args.removed[0] instanceof Connection);
            });

            diagram.remove(connection);
        });

    })();

    (function() {
        var Shape = dataviz.diagram.Shape;
        var Connection = dataviz.diagram.Connection;
        var shape1, shape2, shape3;
        var connection;

        // ------------------------------------------------------------
        module("Connection / cascading / resolve auto connectors", {
            setup: function() {
                createDiagram();
                shape1 = diagram.addShape({width: 100, height: 100});
                shape2 = diagram.addShape({y: 100, width: 100, height: 100});
                shape3 = diagram.addShape({x: 100, y: 100, width: 100, height: 100});

                connection = diagram.connect(shape1, shape3, {
                    type: "cascading"
                });
            },

            teardown: teardown
        });

        test("chooses closest connectors with route that does not overlap any other shapes", function() {
            equal(connection._resolvedSourceConnector.options.name, "Right");
            equal(connection._resolvedTargetConnector.options.name, "Top");
        });

        test("fall backs to closest connectors if there isn't a route that does not overlap any other shapes", function() {
            diagram.addShape({x: 100, width: 100, height: 100});
            connection.refresh();
            equal(connection._resolvedSourceConnector.options.name, "Bottom");
            equal(connection._resolvedTargetConnector.options.name, "Left");
        });

    })();

    (function() {
        var Connection = dataviz.diagram.Connection;
        var PathDefiner = dataviz.diagram.PathDefiner;
        var connection;

        function setupConnection(options) {
            connection = new Connection(new Point(10, 20), new Point(100, 100), options);
        }

        // ------------------------------------------------------------
        module("Connection / initialization", {
            setup: function() {
                setupConnection({
                    content: {
                        text: "foo"
                    }
                });
            }
        });

        test("inits router", function() {
            ok(connection._router instanceof dataviz.diagram.PolylineRouter);
        });

        test("inits polyline path", function() {
            ok(connection.path instanceof dataviz.diagram.Polyline);
        });

        test("appends path to visual", function() {
            ok(connection.path === connection.visual.children[0]);
        });

        test("inits path points with start and end point", function() {
            var points = connection.path.points();
            equal(points[0].x, 10);
            equal(points[0].y, 20);
            equal(points[1].x, 100);
            equal(points[1].y, 100);
        });

        test("inits path points with start, points and end point", function() {
            setupConnection({
                points: [new Point(30, 40)]
            });
            var points = connection.path.points();
            equal(points[0].x, 10);
            equal(points[0].y, 20);
            equal(points[1].x, 30);
            equal(points[1].y, 40);
            equal(points[2].x, 100);
            equal(points[2].y, 100);
        });

        test("sets transparent fill to polyline", function() {
            equal(connection.path.options.fill.color, "transparent");
        });

        test("inits content visual", function() {
            ok(connection._contentVisual);
        });

        test("positions content visual", function() {
            var position = connection._contentVisual.position();
            equal(position.x, 55);
            equal(position.y, 60);
        });

        // ------------------------------------------------------------
        module("Connection / redraw", {
            setup: function() {
                setupConnection({
                    content: {
                        text: "foo"
                    },
                    points: [new Point(50, 50)]
                });
            }
        });

        test("updates content", function() {
            connection.redraw({
                content: {
                    text: "bar"
                }
            });
            equal(connection._contentVisual.content(), "bar");
        });

        test("positions content visual", function() {
            connection.redraw({
                content: {
                    text: "bar"
                }
            });
            var position = connection._contentVisual.position();
            equal(position.x, 55);
            equal(position.y, 60);
        });

        test("updates path", function() {
            connection.redraw({
                points: [new Point(30, 40)]
            });
            var points = connection.path.points();
            equal(points[0].x, 10);
            equal(points[0].y, 20);
            equal(points[1].x, 30);
            equal(points[1].y, 40);
            equal(points[2].x, 100);
            equal(points[2].y, 100);
        });

        // ------------------------------------------------------------
        module("Connection / content", {
            setup: function() {
                setupConnection();
            }
        });

        test("inits content visual", function() {
            connection.content("foo");
            equal(connection._contentVisual.content(), "foo");
        });

        test("positions content visual", function() {
            connection.content("foo");
            var position = connection._contentVisual.position();
            equal(position.x, 55);
            equal(position.y, 60);
        });

        test("updates content", function() {
            setupConnection({
                content: {
                    text: "foo"
                },
            });

            connection.content("bar");
            equal(connection._contentVisual.content(), "bar");
        });

        // ------------------------------------------------------------
        module("Connection", {});

        test('definers', function () {
            connection = new Connection(new Point(10, 20), new Point(100, 200));
            connection.points([new Point(1, 2), new Point(3, 4), new Point(5, 6)]);
            equal(connection.points().length, 3);
            equal(connection.allPoints().length, 5);
            ok(connection.sourceDefiner().point === connection.sourcePoint());
            ok(connection.targetDefiner().point === connection.targetPoint());

            connection.sourceDefiner(new PathDefiner(new Point(44, 55), new Point(478, 44), new Point(-55, 0)));
            ok(connection.sourceDefiner().point.x === 44 && connection.sourceDefiner().point.y === 55);
            ok(connection.sourceDefiner().left === null);
            ok(connection.sourceDefiner().right.x === -55 && connection.sourceDefiner().right.y === 0);

            connection.targetDefiner(new PathDefiner(new Point(44, 55), new Point(478, 102), new Point(-55, 0)));
            ok(connection.targetDefiner().point.x === 44 && connection.targetDefiner().point.y === 55);
            ok(connection.targetDefiner().right===null);
            ok(connection.targetDefiner().left.x === 478 && connection.targetDefiner().left.y === 102);
        });

        test('bounds', function () {
            connection = new Connection(new Point(0, 0), new Point(500, 500));
            connection.points([new Point(25,10), new Point(101,88), new Point(250,37), new Point(100,100), new Point(301,322), new Point(660,770)]);
            var bounds = connection._router.getBounds();
            ok(bounds.x===0 && bounds.y===0 && bounds.width===660 && bounds.height===770);
        });

        test('Distance to a line segment', function () {
            var distance = Geometry.distanceToLine(new Point(0,0), new Point(0,100), new Point(100,100));
            equal(distance, 100);
            distance = Geometry.distanceToLine(new Point(57.88, 0), new Point(0, 100), new Point(100, 100));
            equal(distance,100);
            distance = Geometry.distanceToLine(new Point(100, 44.02), new Point(0, 0), new Point(0, 100));
            equal(distance,100);
        });

        test('Distance to polyline', function () {
            var polyline = [new Point(0,0), new Point(100,0), new Point(100,100), new Point(0,100)];
            var distance = Geometry.distanceToPolyline(new Point(50,50), polyline);
            equal(distance, 50);
            distance = Geometry.distanceToPolyline(new Point(57,50), polyline);
            equal(distance, 43);
        });

    })();

    (function() {
        var Shape = dataviz.diagram.Shape;
        var Connection = dataviz.diagram.Connection;
        var connection, shape, cpnnector;

        // ------------------------------------------------------------
        module("Connection / source");

        test("source method does nothing if the passed shape does not have auto connector", function() {
            connection = new Connection();
            var initialSource = connection.source();
            shape = new Shape({
                connectors: [{name: "top"}]
            });
            connection.source(shape);
            ok(connection.source() === initialSource);
        });

        test("does not add duplicate connection to connector connections", function() {
            connection = new Connection();
            shape = new Shape({
                connectors: [{name: "top"}]
            });
            connector = shape.getConnector("top");
            connection.source(connector);
            connection.source(connector);
            equal(connector.connections.length, 1);
            ok(connector.connections[0] === connection);
        });

        test("does not add duplicate connection to auto connector connections", function() {
            connection = new Connection();
            shape = new Shape({});
            connection.source(shape);
            connection.source(shape);
            connector = shape.getConnector("auto");
            equal(connector.connections.length, 1);
            ok(connector.connections[0] === connection);
        });
    })();

    (function() {
        var Shape = dataviz.diagram.Shape;
        var Connection = dataviz.diagram.Connection;
        var connection, shape;

        // ------------------------------------------------------------
        module("Connection / target");

        test("target method does nothing if the passed shape does not have auto connector", function() {
            connection = new Connection();
            var initialTarget = connection.target();
            shape = new Shape({
                connectors: [{name: "top"}]
            });
            connection.target(shape);
            ok(connection.target() === initialTarget);
        });

        test("does not add duplicate connection to connector connections", function() {
            connection = new Connection();
            shape = new Shape({
                connectors: [{name: "top"}]
            });
            connector = shape.getConnector("top");
            connection.target(connector);
            connection.target(connector);
            equal(connector.connections.length, 1);
            ok(connector.connections[0] === connection);
        });

        test("does not add duplicate connection to auto connector connections", function() {
            connection = new Connection();
            shape = new Shape({});
            connection.target(shape);
            connection.target(shape);
            connector = shape.getConnector("auto");
            equal(connector.connections.length, 1);
            ok(connector.connections[0] === connection);
        });

    })();

    (function() {
        var Shape = dataviz.diagram.Shape;
        var Connection = dataviz.diagram.Connection;
        var connection, shape;

        function isConnected(connection, connector, name) {
            ok($.inArray(connection, connector.connections) >= 0);
            ok(connection[name + "Connector"] === connector);
            if (name == "source") {
                equal(connection.options.from, connector.shape.dataItem.id);
            } else {
                equal(connection.options.to, connector.shape.dataItem.id);
            }
        }

        // ------------------------------------------------------------
        module("Connection / _updateConnector", {
            setup: function() {
                createDiagram({
                    dataSource: setupDataSource({}),
                    connectionsDataSource: setupDataSource()
                });
                connection = diagram.connections[0];
            },
            teardown: teardown
        });

        test("Sets target if the connector shape is existing one", function() {
            var connector = diagram.shapes[0].getConnector("auto");
            connection._updateConnector(connector, "target");
            isConnected(connection, connector, "target");
        });

        test("Sets source if the connector shape is existing one", function() {
            var connector = diagram.shapes[0].getConnector("auto");
            connection._updateConnector(connector, "source");
            isConnected(connection, connector, "source");
        });

        test("Sets target if the shape does not exist but its dataItem is used for existing shape", function() {
            var shape = new Shape();
            shape.dataItem = diagram.dataSource.at(0);
            var connector = shape.getConnector("left");
            connection._updateConnector(connector, "target");
            isConnected(connection, diagram.shapes[0].getConnector("left"), "target");
        });

        test("Sets source if the shape does not exist but its dataItem is used for existing shape", function() {
            var shape = new Shape();
            shape.dataItem = diagram.dataSource.at(0);
            var connector = shape.getConnector("left");
            connection._updateConnector(connector, "source");
            isConnected(connection, diagram.shapes[0].getConnector("left"), "source");
        });

        test("Sets target if the shape does not exist but its dataItem is for inactive shape", function() {
            var dataItem = diagram.dataSource.add({});
            var shape = new Shape();
            shape.dataItem = dataItem;
            var connector = shape.getConnector("left");
            connection._updateConnector(connector, "target");
            diagram.dataSource.sync();
            isConnected(connection, diagram._dataMap[dataItem.id].getConnector("left"), "target");
        });

        test("Sets source if the shape does not exist but its dataItem is for inactive shape", function() {
            var dataItem = diagram.dataSource.add({});
            var shape = new Shape();
            shape.dataItem = dataItem;
            var connector = shape.getConnector("left");
            connection._updateConnector(connector, "source");
            diagram.dataSource.sync();
            isConnected(connection, diagram._dataMap[dataItem.id].getConnector("left"), "source");
        });
    })();

    // ------------------------------------------------------------
    module("Serialization - Cut/Copy/Paste", {
        setup: function () {
            QUnit.fixture.html('<div id="canvas" />');
            $("#canvas").kendoDiagram();

            d = $("#canvas").getKendoDiagram();
            randomDiagram(d);
            d._isEditable = false;
        },
        teardown: function () {
            d.destroy();
        }
    });

    test("Copy Selected", function () {
        var s1 = d.shapes[0];

        s1.select(true);
        equal(d._clipboard.length, 0);
        d.copy();
        equal(d._clipboard.length, 1);
    });

    test("Copy and Paste", function () {
        var shapesCount = d.shapes.length;
        var s1 = d.shapes[0];

        s1.select(true);
        equal(d._clipboard.length, 0);
        d.copy();
        equal(d._clipboard.length, 1);
        d.paste();
        equal(shapesCount + 1, d.shapes.length);
    });

    test("Copy and Paste - positions", function () {
        var shapesCount = d.shapes.length;
        var s1 = d.shapes[0];
        var pos = s1.position().clone();

        s1.select(true);
        d.copy();
        d.paste();
        var copied = d.shapes[d.shapes.length - 1];
        pos = pos.plus(new Point(d.options.copy.offsetX, d.options.copy.offsetY));
        deepEqual(copied.position(), pos);

        d.paste();
        copied = d.shapes[d.shapes.length - 1];
        pos = pos.plus(new Point(d.options.copy.offsetX, d.options.copy.offsetY));
        deepEqual(copied.position(), pos);
    });

    test("Copy - copying the options", function () {
        var shapesCount = d.shapes.length;
        var s1 = d.shapes[0];
        var copy = s1.clone();
        ok(copy.id!==s1.id && copy.options.id!==s1.options.id);
        copy.options.id = s1.options.id;
        deepEqual(copy.options, s1.options);
    });

    test("Copy connection", function () {
        var c1 = d.connect(d.shapes[0], d.shapes[1], { type: "polyline" });

        var copy = c1.clone();

        deepEqual(copy.options, c1.options);
        deepEqual(copy.from, c1.from);
        deepEqual(copy.to, c1.to);
    });

    test("Copy/Paste connection", function () {
        var c1 = d.connect(d.shapes[0], d.shapes[1]);
        var cons = d.connections.length;

        c1.select(true);
        equal(d._clipboard.length, 0);
        d.copy();
        equal(d._clipboard.length, 1);
        d.paste();
        equal(cons + 1, d.connections.length);
    });

    test("Cut/Paste connection", function () {
        var c1 = d.connect(d.shapes[0], d.shapes[1]);
        var cons = d.connections.length;

        c1.select(true);
        equal(d._clipboard.length, 0);
        d.cut();
        equal(d._clipboard.length, 1);
        d.paste();
        equal(cons, d.connections.length);
    });

    (function() {
        function pasteShape() {
            var shape = diagram.shapes[0];
            shape.select(true);
            diagram.copy();
            diagram.paste();
        }

        // ------------------------------------------------------------
        module("Editing / Paste / Shapes", {
            setup: function() {
                createDiagram({
                    dataSource: setupDataSource({}, [{id: 1, width: 300, height: 300, text: "foo"}]),
                    connectionsDataSource: setupDataSource()
                });

            },
            teardown: teardown
        });

        test("Paste should insert shape", function () {
            pasteShape();
            equal(diagram.dataSource.data().length, 2);
            equal(diagram.shapes.length, 2);
        });

        test("Paste should sync dataSource", function () {
            diagram.dataSource.bind("sync", function() {
                ok(true);
            });
            pasteShape();
        });

        test("Paste should set new shape position", function () {
            pasteShape();
            var shape = diagram.shapes[1];
            var item = shape.dataItem;
            var bounds = shape.bounds();
            equal(item.x, 20);
            equal(item.y, 20);
            equal(bounds.x, 20);
            equal(bounds.y, 20);
        });

        test("Paste should set original shape options to new shape", function () {
            pasteShape();
            var shape = diagram.shapes[1];
            var item = shape.dataItem;
            var bounds = shape.bounds();

            equal(item.width, 300);
            equal(item.height, 300);
            equal(item.text, "foo");

            equal(bounds.width, 300);
            equal(bounds.height, 300);
        });

        test("Paste should trigger add", function () {
            diagram.bind("add", function() {
                ok(true);
            });
            pasteShape();
        });

        test("Paste should not add item or shape if the default action is prevented", function () {
            var shape;
            diagram.bind("add", function(e) {
                e.preventDefault();
                shape = e.shape;
            });
            pasteShape();

            ok(!diagram.getShapeById(shape.id));
            equal(diagram.dataSource.data().length, 1);
        });

        test("Paste should add the shape passed to the add event after sync", function () {
            var shape;
            diagram.bind("add", function(e) {
                shape = e.shape;
            });
            pasteShape();

            ok(diagram.getShapeById(shape.id) === shape);
        });

    })();

    (function() {
        function pasteConnection() {
            var connection = diagram.connections[0];
            connection.select(true);
            diagram.copy();
            diagram.paste();
        }

        // ------------------------------------------------------------
        module("Editing / Paste / Connections", {
            setup: function() {
                createDiagram({
                    dataSource: setupDataSource({}, [{id: 1}, {id: 2}]),
                    connectionsDataSource: setupDataSource({}, [
                        {id: 1, fromX: 10, fromY: 10, toX: 20, toY: 20, text: "foo"},
                        {id: 1, from: 1, to: 2, text: "bar"}
                    ])
                });
            },
            teardown: teardown
        });

        test("Paste should insert connection", function () {
            pasteConnection();
            equal(diagram.connectionsDataSource.data().length, 3);
            equal(diagram.connections.length, 3);
        });

        test("Paste should sync connectionsDataSource", function () {
            diagram.connectionsDataSource.bind("sync", function() {
                ok(true);
            });
            pasteConnection();
        });

        test("Paste should set new connection position", function () {
            pasteConnection();
            var connection = diagram.connections[2];
            var offsetX = diagram.options.copy.offsetX;
            var offsetY = diagram.options.copy.offsetX;
            var item = connection.dataItem;
            var source = connection.source();
            var target = connection.target();

            equal(source.x, 10 + offsetX);
            equal(source.y, 10 + offsetY);
            equal(target.x, 20 + offsetX);
            equal(target.y, 20 + offsetY);
        });

        test("Paste should set original connection options to new connection", function () {
            pasteConnection();
            var connection = diagram.connections[2];
            equal(connection.dataItem.text, "foo");
        });

        test("Paste should set connected shapes to new connection", function () {
            var originalConnection = diagram.connections[1];
            originalConnection.select(true);
            diagram.shapes[0].select();
            diagram.shapes[1].select();
            diagram.copy();
            diagram.paste();

            var connection = diagram.connections[2];
            var sourceShape = diagram.shapes[2];
            var targetShape = diagram.shapes[3];
            var source = connection.source();
            var target = connection.target();
            var item = connection.dataItem;
            equal(item.from, sourceShape.dataItem.id);
            equal(item.to, targetShape.dataItem.id);
            ok(source.shape === sourceShape);
            ok(target.shape === targetShape);
        });

        test("Paste should trigger add", function () {
            diagram.bind("add", function() {
                ok(true);
            });
            pasteConnection();
        });

        test("Paste should not add item or connection if the default action is prevented", function () {
            var connection;
            diagram.bind("add", function(e) {
                e.preventDefault();
                connection = e.connection;
            });
            pasteConnection();

            for (var idx = 0; idx < diagram.connections.length; idx++) {
                if (diagram.connections[idx] === connection) {
                    ok(false);
                }
            }
            equal(diagram.connectionsDataSource.data().length, 2);
        });

        test("Paste should add the connection passed to the add event after sync", 1, function () {
            var connection;
            diagram.bind("add", function(e) {
                connection = e.connection;
            });
            pasteConnection();

            for (var idx = 0; idx < diagram.connections.length; idx++) {
                if (diagram.connections[idx] === connection) {
                    ok(true);
                }
            }
        });

    })();

    // ------------------------------------------------------------
    module("Editing / Shape data source", {
        setup: function () {
            d = setupEditableDiagram();
        },
        teardown: function () {
            d.destroy();
        }
    });

    test("Copy and Paste should insert shape dataItem", function () {
        var shape = d.shapes[0];

        shape.select(true);
        d.copy();
        d.paste();
        equal(d.dataSource.data().length, 3);
    });

    test("Cut should remove shape dataItem", function () {
        var shape = d.shapes[0];

        shape.select(true);
        d.cut();
        equal(d.dataSource.data().length, 1);
    });

    test("Redo should add shape dataItem", function () {
        var shape = d.shapes[0];

        shape.select(true);
        d.remove(d.select(), true);
        d.undo();
        equal(d.dataSource.data().length, 2);
    });

    // ------------------------------------------------------------
    module("Editing / Shape data source / createShape", {
        setup: function () {
            d = setupEditableDiagram();
            d.createShape();
        },
        teardown: function () {
            d.destroy();
            QUnit.fixture.closest("body").find(".k-window-content").each(function(idx, element){
                $(element).data("kendoWindow").destroy();
            });
            QUnit.fixture.closest("body").find(".k-overlay").remove();
        }
    });

    test("should insert dataItem", function () {
        equal(d.dataSource.data().length, 3);
    });

    test("should insert dataItem at the end of data array", function () {
        equal(d.dataSource.data()[2].id, "");
    });

    test("should create editor", function () {
        ok(d.editor != null);
    });

    test("should create editor with type shape", function () {
        equal(d.editor.options.type, "shape");
    });

    test("should trigger add", function () {
        d.bind("add", function(e) {
            ok(true);
        });
        d.createShape();
    });

    test("should not add item or shape if the default action is prevented", function () {
        var shape;
        d.bind("add", function(e) {
            e.preventDefault();
            shape = e.shape;
        });
        d.createShape();

        d.dataSource.sync();
        ok(!d.getShapeById(shape.id));
        equal(d.dataSource.data().length, 3);
    });

    test("should add the shape passed to the add event after sync", function () {
        var shape;
        d.bind("add", function(e) {
            shape = e.shape;
        });
        d.createShape();

        d.dataSource.sync();
        ok(d.getShapeById(shape.id));
    });

    // ------------------------------------------------------------
    module("Editing / Connections data source", {
        setup: function () {
            d = setupEditableDiagram();
        },
        teardown: function () {
            d.destroy();
        }
    });

    test("Copy and Paste should insert connection dataItem", function () {
        var connection = d.connections[0];

        connection.select(true);
        d.copy();
        d.paste();
        equal(d.connectionsDataSource.data().length, 2);
    });

    test("Cut should remove connection dataItem", function () {
        var connection = d.connections[0];

        connection.select(true);
        d.cut();
        equal(d.connectionsDataSource.data().length, 0);
    });

    test("Redo should add connection dataItem", function () {
        var connection = d.connections[0];

        connection.select(true);
        d.remove(d.select(), true);
        d.undo();
        equal(d.connectionsDataSource.data().length, 1);
    });

    // ------------------------------------------------------------
    module("Editing / Connection data source / createConnection", {
        setup: function () {
            d = setupEditableDiagram();
            d.createConnection();
        },
        teardown: function () {
            d.destroy();
            QUnit.fixture.closest("body").find(".k-window-content").each(function(idx, element){
                $(element).data("kendoWindow").destroy();
            });
            QUnit.fixture.closest("body").find(".k-overlay").remove();
        }
    });

    test("should insert dataItem", function () {
        equal(d.connectionsDataSource.data().length, 2);
    });

    test("should create editor", function () {
        ok(d.editor != null);
    });

    test("should create editor with type shape", function () {
        equal(d.editor.options.type, "connection");
    });

    test("should trigger add", function () {
        d.bind("add", function(e) {
            ok(true);
        });
        d.createConnection();
    });

    test("should not add item or connection if the default action is prevented", function () {
        var connection;
        d.bind("add", function(e) {
            e.preventDefault();
            connection = e.connection;
        });
        d.createConnection();

        for (var idx = 0; idx < d.connections.length; idx++) {
            if (d.connections[idx] === connection) {
                ok(false);
            }
        }
        equal(d.connectionsDataSource.data().length, 2);
    });

    test("should add the connection passed to the add event", function () {
        var connection;
        d.bind("add", function(e) {
            connection = e.connection;
        });
        d.createConnection();

        for (var idx = 0; idx < d.connections.length; idx++) {
            if (d.connections[idx] === connection) {
                ok(true);
            }
        }
    });

    var ShapeMock = function(bounds, angle) {
        this._bounds = bounds || new Rect(0, 0, 100, 100);
        this._angle = angle || 0;
        this.bounds = function() {
            return this._bounds;
        };
        this.rotate = function() {
            return {
                angle: this.angle
            };
        }
    };

     // ------------------------------------------------------------
    (function() {
        var QuadRoot = dataviz.diagram.QuadRoot;
        var bounds;
        var shape;
        var root;
        var rect;

        module("QuadRoot", {
            setup: function() {
                root = new QuadRoot();
                shape = new ShapeMock();
                rect = new Rect();
            }
        });

        test("insert adds shape and bounds to shapes array", function() {
            root.insert(shape, rect);
            equal(root.shapes[0].shape, shape);
            equal(root.shapes[0].bounds, rect);
        });

        test("insert sets shape quad node", function() {
            root.insert(shape, rect);
            equal(shape._quadNode, root);
        });

        test("remove removes shape from shapes array", function() {
            root.insert(shape, rect);
            root.remove(shape);
            equal(root.shapes.length, 0);
        });

        // ------------------------------------------------------------
        module("QuadRoot / hitTestRect", {
            setup: function() {
                root = new QuadRoot();
                rect = new Rect(100, 100, 200, 300);
                shape = new ShapeMock(rect);
                root.insert(shape, rect);
            }
        });

        test("returns true if passed rect overlaps a shape", function() {
            var targetRect = new Rect(50, 100, 100, 10);
            equal(root.hitTestRect(targetRect), true);
        });

        test("returns false if passed rect does not overlap a shape", function() {
            var targetRect = new Rect(50, 100, 10, 10);
            ok(!root.hitTestRect(targetRect));
        });

        test("returns true if passed rect overlaps the border", function() {
            var targetRect = new Rect(50, 100, 50, 10);

            equal(root.hitTestRect(targetRect), true);
        });

    })();

     // ------------------------------------------------------------
    (function() {
        var QuadNode = dataviz.diagram.QuadNode;
        var bounds;
        var shape;
        var node;
        var rect = new Rect(0, 0, 100, 100);

        function insertChildren(bounds) {
            for (var idx = 0; idx < bounds.length; idx++) {
                node.insert(new ShapeMock(bounds[idx]), bounds[idx]);
            }
        }

        module("QuadNode", {
            setup: function() {
                node = new QuadNode(rect);
                shape = new ShapeMock();
            }
        });

        test("insert inserts shape if it is inside the node bounds", function() {
            bounds = new Rect(90, 50, 10, 50);
            node.insert(shape, bounds);
            equal(node.shapes[0].shape, shape);
            equal(node.shapes[0].bounds, bounds);
        });

        test("insert  does not insert shape if it is not inside the node bounds", function() {
            bounds = new Rect(90, 50, 11, 50);
            node.insert(shape, bounds);
            equal(node.shapes.length, 0);
        });

        test("insert sets shape _quadNode", function() {
            bounds = new Rect(90, 50, 10, 50);
            node.insert(shape, bounds);
            equal(shape._quadNode, node);
        });

        test("insert does not init children if it contains no more than 4 shapes", function() {
            bounds = new Rect(90, 50, 10, 50);
            insertChildren([bounds, bounds, bounds, bounds]);
            equal(node.children.length, 0);
        });

        test("insert inits children if it contains more than 4 shapes", function() {
            bounds = new Rect(90, 50, 10, 50);
            insertChildren([bounds, bounds, bounds, bounds, bounds]);
            equal(node.children.length, 4);
            deepEqual(node.children[0].rect, new Rect(0, 0, 50, 50));
            deepEqual(node.children[1].rect, new Rect(50, 0, 50, 50));
            deepEqual(node.children[2].rect, new Rect(0, 50, 50, 50));
            deepEqual(node.children[3].rect, new Rect(50, 50, 50, 50));
        });

        test("insert moves current shapes to children if they fit", function() {
            insertChildren([new Rect(0, 0, 30, 30), new Rect(0, 60, 30, 30),
                new Rect(60, 0, 30, 30), new Rect(60, 60, 30, 30), new Rect(40, 0, 30, 30)]);
            equal(node.shapes.length, 1);
            deepEqual(node.children[0].shapes.length, 1);
            deepEqual(node.children[1].shapes.length, 1);
            deepEqual(node.children[2].shapes.length, 1);
            deepEqual(node.children[3].shapes.length, 1);
        });

        test("remove removes shape", function() {
            bounds = new Rect(90, 50, 10, 50);
            node.insert(shape, bounds);
            node.remove(shape);
            equal(node.shapes.length, 0);
        });

        test("hitTestRect returns false if shape is not in node bounds", function() {
            equal(node.hitTestRect(new Rect(110, 50, 50, 50)), false);
        });

        test("hitTestRect returns false if it does not contain a shape that overlaps the rect", function() {
            bounds = new Rect(90, 50, 10, 50);
            node.insert(new ShapeMock(bounds), bounds);
            equal(node.hitTestRect(new Rect(70, 50, 19, 50)), false);
        });

        test("hitTestRect returns false if it and its children do not contain a shape that overlaps the rect", function() {
            insertChildren([new Rect(0, 0, 30, 30), new Rect(0, 60, 30, 30),
                new Rect(60, 0, 30, 30), new Rect(60, 60, 30, 30), new Rect(40, 0, 30, 30)]);
            equal(node.hitTestRect(new Rect(31, 0, 8, 10)), false);
        });

        test("hitTestRect returns true if it contains a shape that overlaps the rect", function() {
            bounds = new Rect(90, 50, 10, 50);
            node.insert(shape, bounds);
            equal(node.hitTestRect(new Rect(80, 50, 10, 50)), true);
        });

        test("hitTestRect returns true if its children contain a shape that overlaps the rect", function() {
            insertChildren([new Rect(0, 0, 30, 30), new Rect(0, 60, 30, 30),
                new Rect(60, 0, 30, 30), new Rect(60, 60, 30, 30), new Rect(40, 0, 30, 30)]);
            equal(node.hitTestRect(new Rect(0, 0, 30, 30)), true);
        });

    })();

     // ------------------------------------------------------------
    (function() {
        var ShapesQuadTree = dataviz.diagram.ShapesQuadTree;
        var QuadRoot = dataviz.diagram.QuadRoot;
        var bounds;
        var shape;
        var tree;
        var diagram;

        var DiagramMock = kendo.Observable.extend({});

        module("ShapesQuadTree", {
            setup: function() {
                diagram = new DiagramMock();
                tree = new ShapesQuadTree(diagram);
                shape = new ShapeMock();
            }
        });

        test("inits roots", function() {
            ok($.isPlainObject(tree.rootMap));
            ok(tree.root instanceof QuadRoot);
        });

        test("insert adds shape to sector root", function() {
            shape = new ShapeMock(new Rect(1000, 0, 100, 100));
            tree.insert(shape);

            equal(tree.rootMap[1][0].shapes.length, 1);
        });

        test("insert adds shape to root if shape bounds span across multiple sectors", function() {
            shape = new ShapeMock(new Rect(-50, 0, 100, 100));
            tree.insert(shape);

            equal(tree.root.shapes.length, 1);
        });

        test("remove removes shape", function() {
            shape = new ShapeMock(new Rect(1000, 0, 100, 100));
            tree.insert(shape);
            tree.remove(shape);

            equal(tree.rootMap[1][0].shapes.length, 0);
        });

        test("diagram itemBoundsChange removes and reinserts shape", function() {
            shape = new ShapeMock();
            tree.insert(shape);
            shape._bounds = new Rect(1000, 0, 100, 100);
            diagram.trigger("itemBoundsChange", {item: shape});
            equal(tree.rootMap[0][0].shapes.length, 0);
            equal(tree.rootMap[1][0].shapes.length, 1);
        });

        test("diagram itemRotate removes and reinserts shape", function() {
            shape = new ShapeMock();
            tree.insert(shape);
            shape._bounds = new Rect(1000, 0, 100, 100);
            diagram.trigger("itemRotate", {item: shape});
            equal(tree.rootMap[0][0].shapes.length, 0);
            equal(tree.rootMap[1][0].shapes.length, 1);
        });

        test("hitTestRect returns true if the root contains a shape that overlaps the rect", function() {
            shape = new ShapeMock(new Rect(-50, 0, 100, 100));
            tree.insert(shape);
            equal(tree.hitTestRect(new Rect(-100, 0, 50, 50)), true);
        });

        test("hitTestRect returns true if a sector root contains a shape that overlaps the rect", function() {
            shape = new ShapeMock();
            tree.insert(shape);
            equal(tree.hitTestRect(new Rect(80, 0, 50, 50)), true);
        });

        test("hitTestRect detects hits for rects that span across two sectors", function() {
            shape = new ShapeMock();
            tree.insert(shape);
            equal(tree.hitTestRect(new Rect(-50, 0, 100, 50)), true);
        });

        test("hitTestRect detects hits for rects that span across more than two sectors", function() {
            shape = new ShapeMock();
            tree.insert(shape);
            equal(tree.hitTestRect(new Rect(-1050, 0, 3000, 50)), true);
        });

    })();

})();
