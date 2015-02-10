﻿///<reference path="qunit-1.12.0.js" />

(function ($, undefined) {
    var kendo = window.kendo;
    var deepExtend = kendo.deepExtend;
    var diagram = kendo.dataviz.diagram;
    var Point = diagram.Point;
    var element;
    var d;

    function setup() {
        setupDiagram();
        addShapes();
    }

    function getMeta(enabled) {
        var meta = {
            ctrlKey: false,
            altKey: false,
            shiftKey: false
        };
        if (enabled) {
            meta[enabled + "Key"] = true;
        }
        return meta;
    }

    function addShapes() {
        d.addShape({ x: 10, y: 20, data: "Rectangle", dataItem: {} });
        d.addShape({ x: 50, y: 100, data: "Rectangle", dataItem: {} });
        d.addShape({ x: 30, y: 200, data: "Rectangle", dataItem: {} });
        d.addShape({ x: 500, y: 100, data: "Rectangle", dataItem: {} });
    }

    function setupDiagram(options) {
        element = $('<div id=canvas />').appendTo(QUnit.fixture);
        element.kendoDiagram(deepExtend({
            theme: "black"
        }, options));
        d = element.data("kendoDiagram");
    }

    function teardown() {
        kendo.destroy(QUnit.fixture);
        element.remove();
    }

    module("ToolService", {
        setup: setup,
        teardown: teardown
    });

    test("toolservice ends tool on start if there is active tool", function() {
        d.toolService.activeTool = {
            end: function(p, meta) {
                ok(true);
            }
        };
        d.toolService.start(new Point(), {});
    });

    module("Selection tests", {
        setup: setup,
        teardown: teardown
    });

    test("Select/Deselect all", function () {
        d.selectAll();

        equal(d.shapes.length + d.connections.length, d.select().length);
    });

    test("Select/Deselect any", function () {
        d.shapes[2].select(true);
        d.shapes[3].select(true);

        equal(2, d.select().length);

        d.shapes[2].select(false);
        d.shapes[3].select(false);
        equal(0, d.select().length);
    });

    test("Drag group - 2 shapes and connection", function () {
        var s1 = d.shapes[0], s2 = d.shapes[1];
        var c = d.connect(s1, s2);
        s1.select(true);
        s2.select(true);
        c.select(true);

        var s1c = s1.bounds().center().minus(new diagram.Point(5, 5));

        d.toolService.start(s1c);
        var endpoint = s1c.plus(new diagram.Point(5, 5));
        d.toolService.move(endpoint);
        d.toolService.end(endpoint);

        ok(c.sourceConnector !== undefined, "Connection is attached to the source.");
        ok(c.targetConnector !== undefined, "Connection is attached to the target.");
    });

    test("Dragging shapes does not add undo unit if the shapes positions have not changed", function () {
        var shape1 = d.shapes[0], shape2 = d.shapes[1];
        var stackCount = d.undoRedoService.count();

        shape1.select(true);
        shape2.select(true);

        var shape1Center = shape1.bounds().center().minus(new diagram.Point(5, 5));

        d.toolService.start(shape1Center);
        d.toolService.move(shape1.bounds().center());
        d.toolService.end(shape1Center);

        equal(d.undoRedoService.count(), stackCount);
    });

    (function() {
        var adorner;
        var visual;
        var drawingContainer;

        module("Resizing/Selection adorner / initialization", {
            setup: function() {
                setupDiagram();
                adorner = d._resizingAdorner;
                visual = adorner.visual;
                drawingContainer = visual.drawingContainer();
            },
            teardown: teardown
        });

        test("creates visual group", function() {
            ok(visual instanceof diagram.Group);
        });

        test("creates bounds rectangle", function() {
            ok(adorner.rect instanceof diagram.Rectangle);
        });

        test("appends bounds rectangle to visual group", function() {
            ok($.inArray(adorner.rect.drawingContainer(), drawingContainer.children) >= 0);
        });

        test("creates handles", function() {
            var map = adorner.map;
            equal(map.length, 8);
            for (var i = 0; i < 8; i++) {
                ok(map[i].visual instanceof diagram.Rectangle);
            }
        });

        test("adds handles to visual group", function() {
            var map = adorner.map;
            for (var i = 0; i < 8; i++) {
                ok($.inArray(map[i].visual.drawingContainer(), drawingContainer.children) >= 0);
            }
        });

        // ------------------------------------------------------------
        module("Resizing/Selection adorner / editable", {
            setup: function() {
                setupDiagram({
                    editable: {
                        resize: false,
                        rotate: false
                    }
                });
                adorner = d._resizingAdorner;
                visual = adorner.visual;
                drawingContainer = visual.drawingContainer();
            },
            teardown: teardown
        });

        test("does not create handles if resizing is disabled", function() {
            equal(adorner.map.length, 0);
        });

        // ------------------------------------------------------------
        module("Resizing/Selection adorner", {
            setup: function() {
                setupDiagram();
                adorner = d._resizingAdorner;
                addShapes();
            },
            teardown: teardown
        });

        test("bounds", function () {
            var shape = d.shapes[0];
            shape.select(true);
            deepEqual(shape.bounds("transformed").inflate(adorner.options.offset, adorner.options.offset), adorner.bounds(), "Adoner has correct bounds");
        });

        test("correct cursor", function () {
            var last = d.shapes[d.shapes.length - 1];

            last.select(true);
            var delta = new Point(adorner.options.offset + 4, adorner.options.offset + 4);
            var testP = last.bounds().bottomRight().plus(delta);

            equal(adorner._getCursor(testP), "se-resize", "Cursor is correct.");
        });
    })();

    (function() {
        var ScrollerTool = diagram.ScrollerTool;
        var toolservice;
        var scrollerTool;
        var shape;

        function setupTool(options) {
            setupDiagram(options);
            shape = d.addShape({ x: 10, y: 20, data: "Rectangle", dataItem: {} });
            toolservice = d.toolService;
            for (var i = 0; i < toolservice.tools.length; i++) {
                if (toolservice.tools[i] instanceof ScrollerTool) {
                    scrollerTool = toolservice.tools[i];
                    break;
                }
            }
        }

        module("ScrollerTool", {
            teardown: teardown
        });

        test("activates if ctrl is pressed", function() {
            setupTool({});

            ok(scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate if ctrl is not pressed", function() {
            setupTool({});

            ok(!scrollerTool.tryActivate({}, getMeta()));
        });

        test("does not activate there is a hovered adorner", function() {
            setupTool({});

            toolservice.hoveredAdorner = true;

            ok(!scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate there is a hovered connector", function() {
            setupTool({});

            toolservice._hoveredConnector = true;

            ok(!scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate if panning is disabled", function() {
            setupTool({
                pannable: false
            });

            ok(!scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        module("ScrollerTool / custom key", {
            teardown: teardown
        });

        test("activates if key is set to none and no key is pressed", function() {
            setupTool({
                pannable: {
                    key: "none"
                }
            });

            ok(scrollerTool.tryActivate({}, getMeta()));
        });

        test("activates on ctrl if key is not set", function() {
            setupTool({
                pannable: {}
            });

            ok(scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate if key is set to none and a key is pressed", function() {
            setupTool({
                pannable: {
                    key: "none"
                }
            });

            ok(!scrollerTool.tryActivate({}, getMeta("alt")));
        });

        test("activates if specific key is set and pressed", function() {
            setupTool({
                pannable: {
                    key: "alt"
                }
            });

            ok(scrollerTool.tryActivate({}, getMeta("alt")));
        });

        test("does not activate if specific key is set but not pressed", function() {
            setupTool({
                pannable: {
                    key: "alt"
                }
            });

            ok(!scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate if ctrl key is set and pressed and there is a hoveredItem", function() {
            setupTool({
                pannable: {
                    key: "ctrl"
                }
            });

            toolservice.hoveredItem = true;
            ok(!scrollerTool.tryActivate({}, getMeta("ctrl")));
        });

    })();

    (function() {
        var PointerTool = diagram.PointerTool;
        var toolservice;
        var pointertool;
        var shape;
        function setupTool(options) {
            setupDiagram(options);
            shape = d.addShape({ x: 10, y: 20, data: "Rectangle", dataItem: {} });
            toolservice = d.toolService;
            for (var i = 0; i < toolservice.tools.length; i++) {
                if (toolservice.tools[i] instanceof PointerTool) {
                    pointertool = toolservice.tools[i];
                    break;
                }
            }
        }

        module("PointerTool", {
            teardown: teardown
        });

        test("selects hovered item if diagram is selectable", function() {
            setupTool({
                selectable: true
            });
            toolservice.hoveredItem = shape;
            pointertool.start(new Point(), {});
            ok(shape.isSelected);
        });

        test("does not select hovered item if diagram is not selectable", function() {
            setupTool({
                selectable: false
            });
            toolservice.hoveredItem = shape;
            pointertool.start(new Point(), {});
            ok(!shape.isSelected);
        });
    })();

    (function() {
        var SelectionTool = diagram.SelectionTool;
        var toolservice;
        var selectiontool;

        function setupTool(options) {
            setupDiagram(options);
            toolservice = d.toolService;
            for (var i = 0; i < toolservice.tools.length; i++) {
                if (toolservice.tools[i] instanceof SelectionTool) {
                    selectiontool = toolservice.tools[i];
                    break;
                }
            }
        }

        module("SelectionTool", {
            teardown: teardown
        });

        test("does not activate if diagram is not selectable", function() {
            setupTool({
                selectable: false
            });
            ok(!selectiontool.tryActivate(new Point(), {}));
        });

        test("activates if diagram is selectable", function() {
            setupTool({
                selectable: true
            });
            ok(selectiontool.tryActivate(new Point(), {}));
        });

        test("does not activate if there is a hovered item", function() {
            setupTool({
                selectable: true
            });
            toolservice.hoveredItem = {};
            ok(!selectiontool.tryActivate(new Point(), {}));
        });

        test("does not activate if there is a hovered adorner", function() {
            setupTool({
                selectable: true
            });
            toolservice.hoveredAdorner = {};
            ok(!selectiontool.tryActivate(new Point(), {}));
        });

        module("SelectionTool / custom key", {
            teardown: teardown
        });

        test("activates if key is set to none", function() {
            setupTool({
                selectable: {
                    key: "none"
                }
            });

            ok(selectiontool.tryActivate({}, getMeta()));
        });

        test("activates if key is not set", function() {
            setupTool({
                selectable: {}
            });

            ok(selectiontool.tryActivate({}, getMeta()));
        });

        test("activates if key is set and pressed", function() {
            setupTool({
                selectable: {
                    key: "ctrl"
                }
            });

            ok(selectiontool.tryActivate({}, getMeta("ctrl")));
        });

        test("does not activate if key is set but not pressed", function() {
            setupTool({
                selectable: {
                    key: "ctrl"
                }
            });

            ok(!selectiontool.tryActivate({}, getMeta()));
        });
    })();

    (function() {
        var ConnectionEditTool = diagram.ConnectionEditTool;
        var toolservice;
        var connectionEditTool;

        function setupTool(options) {
            setupDiagram(options);
            toolservice = d.toolService;
            for (var i = 0; i < toolservice.tools.length; i++) {
                if (toolservice.tools[i] instanceof ConnectionEditTool) {
                    connectionEditTool = toolservice.tools[i];
                    break;
                }
            }
        }

        module("ConnectionEditTool", {
            teardown: teardown
        });

        test("does not activate if diagram is not selectable", function() {
            setupTool({
                selectable: false
            });
            ok(!connectionEditTool.tryActivate(new Point(), {}));
        });

        test("activates if diagram is selectable and the hovered item is a connection", function() {
            setupTool({
                selectable: true
            });
            toolservice.hoveredItem = new diagram.Connection(new Point(), new Point());
            ok(connectionEditTool.tryActivate(new Point(), {}));
        });

        test("does not activates if the connection is already selected and ctrl is pressed", function() {
            setupTool({
                selectable: true
            });
            toolservice.hoveredItem = new diagram.Connection(new Point(), new Point());
            toolservice.hoveredItem.isSelected = true;
            ok(!connectionEditTool.tryActivate(new Point(), getMeta("ctrl")));
        });

    })();

    (function() {
        var toolservice;
        var shape1, shape2;

        function setupTool(options) {
            setupDiagram(options);
            toolservice = d.toolService;
        }

        module("ToolService", {
            teardown: teardown
        });

        test("does not set hoveredItem if there is a hovered adorner on the same position", function() {
            setupTool({});
            shape1 = d.addShape({ x: 10, y: 20, data: "Rectangle", dataItem: {}, width: 100, height: 100 });
            shape2 = d.addShape({ x: 30, y: 20, data: "Rectangle", dataItem: {}, width: 100, height: 100 });

            shape1.select(true);
            var handleBounds = d._resizingAdorner._getHandleBounds({x: 1, y: 0});
            handleBounds.offset(d._resizingAdorner._bounds.x, d._resizingAdorner._bounds.y);
            var point = new Point(handleBounds.x + handleBounds.width / 2, handleBounds.y + + handleBounds.height / 2);
            toolservice.start(point, {});
            ok(!toolservice.hoveredItem);
        });
    })();

    (function() {
        var Selector = diagram.Selector;
        var selector;
        module("Selector", {});

        test("Selector extends its visual options with diagram selectable options", function() {
            var diagram = {
                options: {
                    selectable: {
                        stroke: {
                            color: "#919191"
                        },
                        fill: {
                            color: "#919191"
                        }
                    }
                }
            };
            selector = new Selector(diagram);
            var rectangle = selector.visual;
            var options = rectangle.options;
            equal(options.stroke.color, "#919191");
            equal(options.fill.color, "#919191");
        });
    })();

    // ------------------------------------------------------------
    module("Tooling tests. Ensure the tools are activated correctly.", {
        setup: setup,
        teardown: teardown
    });

    test("Connectors activated", function () {
        var s1 = d.shapes[0];
        var s1c = s1.bounds().center();
        d.toolService.move(s1c);

        ok(d._connectorsAdorner, "The adorner is visible");
        //equal(d.toolService._hoveredConnector, s1.getConnector("Auto"), "Auto (center) connector is hovered");
    });

    test("ConnectionTool - create connection", function () {
        d.clear();
        d.addShape({ x: 0, y: 0, dataItem: {} });
        var s1 = d.shapes[0];
        var s1c = s1.bounds().center();
        d.toolService.start(s1c);
        d.toolService.move(s1c);
        d.toolService.end(s1c);

        d.toolService.start(s1c);
        d.toolService.move(s1c);
        var target = new Point(300, 300);
        d.toolService.move(target);

        ok(d.toolService.newConnection, "New Connection is present");
        equal(target, d.toolService.newConnection.targetPoint(), "New Connection target is ok");

        var c = d.toolService.newConnection;
        d.toolService.end(target);
        ok(!d.toolService.newConnection, "New Connection is empty");

        equal(target, c.targetPoint(), "Connection target is ok");
        //equal(d.toolService._hoveredConnector, s1.getConnector("Auto"), "Auto (center) connector is hovered");
    });

    // ------------------------------------------------------------
    // module("Hitesting tests", {
        // setup: setup,
        // teardown: teardown
    // });

    // ------------------------------------------------------------
    QUnit.module("UndoRedo tests", {
        setup: setup,
        teardown: teardown
    });

    test("UndoRedoService basic", function () {
        var ur = new diagram.UndoRedoService();
        var unit = new Task("Counting unit.");
        ur.begin();
        ur.addCompositeItem(unit);
        ur.commit();
        ok(unit.Count == 1, "Unit was executed");
        ur.undo();
        ok(ur.count() > 0, "The units are still there.");
        QUnit.equal(unit.Count, 0, "Unit undo was executed");
        ur.redo();
        ok(unit.Count == 1, "Unit was executed");
        QUnit.throws(function () {
            ur.Redo();
        }, "Supposed to raise an exception since we are passed the length of the stack.");
        ur.undo();
        ok(unit.Count == 0, "Unit was executed");
        ur = new diagram.UndoRedoService();
        unit = new Task("Counting unit.");
        ur.add(unit);
        ok(unit.Count == 1, "Unit was executed");
    });

    test("Delete shape, undo, connection attached", function () {
        var s1 = d.shapes[0];
        var s2 = d.shapes[1];

        var c1 = d.connect(s1, s2);

        ok(c1.sourceConnector !== undefined, "Source attached");
        ok(c1.sourceConnector.options.name == "Auto", "Attached to Auto");

        d.remove(s1, true);

        d.undo();

        ok(c1.sourceConnector !== undefined, "Source attached after undo");
        ok(c1.sourceConnector.options.name == "Auto", "Attached to Auto");
    });

    test("Delete Connection, undo, connection attached", function () {
        var s1 = d.shapes[0];
        var s2 = d.shapes[1];

        var c1 = d.connect(s1, s2);

        ok(c1.sourceConnector !== undefined, "Source attached");
        ok(c1.sourceConnector.options.name == "Auto", "Attached to Auto");

        d.remove(c1, true);

        d.undo();

        var lastC = d.connections[d.connections.length - 1];

        ok(lastC.sourceConnector !== undefined, "Source attached after undo");
        ok(lastC.sourceConnector.options.name == "Auto", "Attached to Auto");

        ok(lastC.targetConnector !== undefined, "Target attached after undo");
        ok(lastC.targetConnector.options.name == "Auto", "Attached to Auto");
    });

})(kendo.jQuery);

