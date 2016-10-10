(function() {
    var tolerance = 0.0001,
        dataviz = kendo.dataviz,
        toolbar,
        diagram;

    function createDiagram() {
        QUnit.fixture.html('<div id="canvas" />');
        diagram = $("#canvas").kendoDiagram({
            dataSource: setupDiagramDataSource(),
            connectionsDataSource: setupDiagramDataSource()
        }).getKendoDiagram();
    }

    function createToolBar(options) {
        QUnit.fixture.html('<div id="diagram" />');
        diagram = {
            element: $("#diagram"),
            select: function() {
                return [];
            }
        };

        toolbar = new dataviz.diagram.DiagramToolBar(diagram, options || {});
        diagram.element.append(toolbar.element);
    }

    // ------------------------------------------------------------
    module("ToolBar / Actions", {
        teardown: function() {
            toolbar.destroy();
        }
    });

    test("should create edit action", function () {
        createToolBar({ tools: ["edit"] });
        equal(toolbar.element.find("a").data("action"), "edit");
    });

    test("should create delete action", function () {
        createToolBar({ tools: ["delete"] });
        equal(toolbar.element.find("a").data("action"), "delete");
    });

    test("should create rotateAnticlockwise action", function () {
        createToolBar({ tools: ["rotateAnticlockwise"] });
        equal(toolbar.element.find("a").data("action"), "rotateAnticlockwise");
    });

    test("should create rotateClockwise action", function () {
        createToolBar({ tools: ["rotateClockwise"] });
        equal(toolbar.element.find("a").data("action"), "rotateClockwise");
    });

    test("should create rotateAnticlockwise action with custom step", function () {
        createToolBar({ tools: [{ name: "rotateAnticlockwise", step: 45 }] });
        equal(toolbar.element.find("a").data("step"), 45);
    });

    test("should create rotateClockwise action with custom step", function () {
        createToolBar({ tools: [{ name: "rotateClockwise", step: 45 }] });
        equal(toolbar.element.find("a").data("step"), 45);
    });

    test("should create custom tool", function () {
        createToolBar({ tools: [{ type: "button", text: "foo"}] });
        ok(toolbar.element.find(":contains(foo)").length !== 0);
    });

    // ------------------------------------------------------------
    module("ToolBar / Actions / delete", {
        setup: function() {
            createDiagram();
        },
        teardown: function() {
            removeMocksIn(diagram);
            diagram.destroy();
        }
    });

    test("should trigger remove for selected shapes", function () {
        var shape = diagram.shapes[0];
        diagram.bind("remove", function(e) {
            ok(e.shape === shape);
        });

        shape.select(true);
        diagram.toolBar["delete"]();
    });

    test("should remove the selected shapes", function () {
        var shape = diagram.shapes[0];

        trackMethodCall(diagram, "remove");
        diagram.remove.addMethod(function(items) {
            ok(shape === items[0]);
        });

        shape.select(true);
        diagram.toolBar["delete"]();
    });

    test("should not remove the selected shapes if the default action is prevented", function () {
        var shape = diagram.shapes[0];
        diagram.bind("remove", function(e) {
            e.preventDefault();
        });

        trackMethodCall(diagram, "remove");

        shape.select(true);
        diagram.toolBar["delete"]();

        ok(!diagram.remove.called);
    });

    asyncTest("should sync the shape changes", function () {
        var shape = diagram.shapes[0];
        diagram.dataSource.one("sync", function() {
            start();
            ok(true);
        });
        shape.select(true);
        diagram.toolBar["delete"]();
    });

    test("should trigger remove for selected connections", function () {
        var connection = diagram.connections[0];
        diagram.bind("remove", function(e) {
            ok(e.connection === connection);
        });

        connection.select(true);
        diagram.toolBar["delete"]();
    });

    test("should remove the selected connections", function () {
        var connection = diagram.connections[0];
        diagram.remove = function(items) {
            ok(connection === items[0]);
        };

        connection.select(true);
        diagram.toolBar["delete"]();
    });

    test("should not remove the selected connections if the default action is prevented", function () {
        var connection = diagram.connections[0];
                diagram.bind("remove", function(e) {
            e.preventDefault();
        });

        trackMethodCall(diagram, "remove");

        connection.select(true);
        diagram.toolBar["delete"]();

        ok(!diagram.remove.called);
    });

    asyncTest("should sync the connection changes", function () {
        var connection = diagram.connections[0];
        diagram.connectionsDataSource.one("sync", function() {
            start();
            ok(true);
        });
        connection.select(true);
        diagram.toolBar["delete"]();
    });

    // ------------------------------------------------------------
    module("ToolBar / Actions / edit", {
        teardown: function() {
            diagram.destroy();
        }
    });

    test("should not throw error if there isn't a selected shape", function() {
       createDiagram();
       var toolbar = diagram.toolbar;
       diagram.toolBar.edit();
       ok(true);
    });

    // ------------------------------------------------------------
    module("ToolBar / events / click", {
        teardown: function() {
            toolbar.destroy();
        }
    });

    test("passes event target element", function() {
         createToolBar({ tools: [{ name: "foo", text: "bar", type: "button" }] });
         var element = toolbar.element.find(":contains(bar)");
         toolbar.bind("click", function(e) {
           ok(e.target.is(element));
         });
         element.click();
    });

    test("passes tool name as action", function() {
         createToolBar({ tools: [{ name: "foo", text: "bar", type: "button" }] });
         var element = toolbar.element.find(":contains(bar)");
         toolbar.bind("click", function(e) {
            equal(e.action, "foo");
         });
         element.click();
    });

    test("passes selected shapes and connections", function() {
         createToolBar({ tools: [{ name: "foo", text: "bar", type: "button" }] });
         var shape = new dataviz.diagram.Shape();
         var connection = new dataviz.diagram.Connection();
         diagram.select = function() {
            return [connection, shape];
         };

         var element = toolbar.element.find(":contains(bar)");
         toolbar.bind("click", function(e) {
            ok(e.shapes[0] === shape);
            equal(e.shapes.length, 1);
            ok(e.connections[0] === connection);
            equal(e.connections.length, 1);
         });
         element.click();
    });

})();
