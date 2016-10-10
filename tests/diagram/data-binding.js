(function() {
    var diagram;
    var dataSource;

    function createDiagram(options) {
        var div = $("<div id='container' />").appendTo(QUnit.fixture);
        div.kendoDiagram(options);

        return div.data("kendoDiagram");
    }

    function destroyDiagram() {
        kendo.destroy(QUnit.fixture);
        QUnit.fixture.empty();
    }

    function setupDataSource(type, options, data) {
        var items = data || [{id: 1}];
        var fields;
        if (type == "shape") {
            fields = {
                width: { type: "number" },
                height: { type: "number" },
                x: { type: "number" },
                y: { type: "number" },
                text: { type: "string" },
                type: { type: "string" }
            };
        } else {
            fields = {
                from: { type: "number" },
                to: { type: "number" },
                fromX: { type: "number" },
                fromY: { type: "number" },
                toX: { type: "number" },
                toY: { type: "number" }
            };
        }
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
                    id: "id"
                }
            }
        }, {
        }, options));
        return dataSource;
    }

    // ------------------------------------------------------------
    module("Diagram / Data Binding", {
          teardown: destroyDiagram
    });

    test("Binds to hierarchical data", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1",
                    items: [{
                        id: "1.1"
                    }]
                }],
                schema: {
                    model: {
                        children: "items"
                    }
                }
            }
        });

        equal(diagram.shapes.length, 2);
    });

    test("throws error if a flat dataSource instance is passed", function() {
        try {
            diagram = createDiagram({
                dataSource: new kendo.data.DataSource({
                    data: [{
                        id: "1"
                    }]
                })
            });
        } catch (e) {
            ok(/incorrect dataSource/ig.test(e.message));
        };
    });

    test("triggers dataBound once after binding all items", 1, function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1",
                    items: [{
                        id: "1.1"
                    }]
                }],
                schema: {
                    model: {
                        children: "items"
                    }
                }
            },
            dataBound: function() {
                equal(this.shapes.length, 2);
            }
        });
    });

    test("layouts diagram once after binding all items", 1, function() {
        var defaultLayout = kendo.dataviz.ui.Diagram.fn.layout;
        try {
            kendo.dataviz.ui.Diagram.fn.layout = function() {
                ok(true);
            };
            diagram = createDiagram({
                dataSource: {
                    data: [{
                        id: "1",
                        items: [{
                            id: "1.1"
                        }]
                    }],
                    schema: {
                        model: {
                            children: "items"
                        }
                    }
                },
                layout: {
                    type: "tree"
                }
            });
        } finally {
            kendo.dataviz.ui.Diagram.fn.layout = defaultLayout;
        }
    });

    asyncTest("triggers dataBound for each level if the children are loaded asynchronously", 2, function() {
        diagram = createDiagram({
            dataSource: {
                transport: {
                    read: function(options) {
                        setTimeout(function() {
                            if (options.data.id) {
                                options.success([{id: 2, hasChildren: false}]);
                            } else {
                                options.success([{id: 1, hasChildren: true}]);
                            }
                        }, 0);
                    }
                },
                schema: {
                    model: {
                        hasChildren: "hasChildren"
                    }
                }
            },
            dataBound: function() {
                ok(true);
                if (this.shapes.length == 2) {
                    start();
                }
            }
        });
    });

    test("Binds to flat data", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1"
                }]
            }
        });

        equal(diagram.shapes.length, 1);
    });

    test("Binds to hierarchical data (custom field)", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1",
                    bars: [{
                        id: "1.1"
                    }]
                }],
                schema: {
                    model: {
                        children: "bars"
                    }
                }
            }
        });

        equal(diagram.shapes.length, 2);
    });

    test("Binds to HierarchicalDataSource instance", function() {
        diagram = createDiagram({
            dataSource: new kendo.data.HierarchicalDataSource({
                data: [{
                    id: "1",
                    bars: [{
                        id: "1.1"
                    }]
                }],
                schema: {
                    model: {
                        children: "bars"
                    }
                }
            })
        });

        equal(diagram.shapes.length, 2);
    });

    test("Applies visual to bound shapes", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1",
                    bars: [{
                        id: "1.1"
                    }]
                }],
                schema: {
                    model: {
                        children: "bars"
                    }
                }
            },
            shapeDefaults: {
                visual: function() {
                    ok(true);
                    return new kendo.dataviz.diagram.Group();
                }
            }
        });
    });

    test("Provides access to data item", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1",
                    items: [{
                        id: "1.1",
                        foo: true
                    }]
                }],
                schema: {
                    model: {
                        children: "items"
                    }
                }
            }
        });

        ok(diagram.shapes[1].options.dataItem.foo);
    });

    test("does not throw error if shapes rotation is set", function() {
        diagram = createDiagram({
            dataSource: {
                data: [{
                    id: "1"
                }]
            },
            shapeDefaults: {
                rotation: {
                    angle: 45
                }
            }
        });

        ok(true);
    });

    (function() {
        var shapesData = [{id: 1}, {id: 2}];
        var connectionsData = [{id: 1, from: 1, to: 2}];

        function setupAsyncDiagram(options) {
            diagram = createDiagram(kendo.deepExtend({
                dataSource: {
                    transport: {
                        read: function(options) {
                            setTimeout(function() {
                                options.success(shapesData);
                            }, 10);
                        }
                    }
                },

                connectionsDataSource: {
                    transport: {
                        read: function(options) {
                            setTimeout(function() {
                                options.success(connectionsData);
                            }, 20);
                        }
                    }
                }
            }, options));
        }

        // ------------------------------------------------------------
        module("Diagram / Data Binding / Flat", {
            setup: function() {

            },
            teardown: destroyDiagram
        });

        test("rebinds once initially with local data", 1, function() {
            diagram = createDiagram({
                dataSource: shapesData,
                connectionsDataSource: connectionsData,
                dataBound: function() {
                    ok(true);
                }
            });
        });

        asyncTest("rebinds once initially with remote data", 1, function() {
            setupAsyncDiagram();

            diagram.bind("dataBound", function() {
                ok(true);
                start();
            });
        });

        asyncTest("rebinds once if the shapes and connections dataSources are read with remote data", 1, function() {
            setupAsyncDiagram({
                autoBind: false
            });
            diagram.dataSource.read();
            diagram.connectionsDataSource.read();
            diagram.bind("dataBound", function() {
                ok(true);
                start();
            });
        });

        test("triggers dataBound after the shapes and connections are created", function() {
            diagram = createDiagram({
                dataSource: shapesData,
                connectionsDataSource: connectionsData,
                dataBound: function() {
                   equal(this.shapes.length, 2);
                   equal(this.connections.length, 1);
                }
            });
        });

        test("clears previous shapes and connections when the data is read", function() {
            diagram = createDiagram({
                dataSource: setupDataSource("shape", {}, [{id: 1}]),
                connectionsDataSource: setupDataSource("connection", {}, [{id: 1}]),
            });

            diagram.dataSource.read();
            diagram.connectionsDataSource.read();
            equal(diagram.shapes.length, 1);
            equal(diagram.connections.length, 1);
        });

    })();

    // ------------------------------------------------------------
    var dataMap;
    var dataSource;
    var shapes;
    var connections;
    var shape;
    var uid;

    module("Diagram / Data Binding / updates", {
        setup: function() {
            diagram = createDiagram({
                dataSource: {
                    data: [{
                        id: "1",
                        items: [{
                            id: "1.1",
                            foo: true
                        }]
                    }, {
                        id: "2"
                    }],
                    schema: {
                        model: {
                            children: "items"
                        }
                    }
                },
                layout:{
                    type: "tree",
                    subtype: "Down"
                }
            });
            shapes = diagram.shapes;
            connections = diagram.connections;
            dataSource = diagram.dataSource;
            dataMap = diagram._dataMap;
        },
        teardown: destroyDiagram
    });

    test("binding adds dataItem uids to dataMap", function() {
        for (var idx = 0; idx < shapes.length; idx++) {
            shape = shapes[idx];
            ok(dataMap[shape.options.dataItem.uid] === shape);
        }
    });

    test("dataSource itemchange redraws shape", function() {
        shape = shapes[1];

        shape.redrawVisual = function() {
            ok(true);
        };
        shape.dataItem.set("foo", "bar");
    });

    test("dataSource remove removes uid from map", function() {
        var item = dataSource.at(0);
        uid = item.uid;
        dataSource.remove(item);
        ok(!dataMap[uid]);
    });

    test("dataSource remove removes shape and its connections ", function() {
        shape = diagram.shapes[0];
        var shapeConnections = shape.connections();
        var removed;
        var idx;
        dataSource.remove(dataSource.at(0));
        removed = $.inArray(shape, shapes) == -1;

        for (idx = 0; idx < shapeConnections.length; idx++) {
            removed = removed && $.inArray(shapeConnections[idx], connections) == -1;
        }
        ok(removed);
    });

    test("dataSource remove removes children shapes and their connections", function() {
        dataSource.remove(dataSource.at(0));
        equal(connections.length, 0);
        equal(shapes.length, 1);
    });

    test("dataSource remove updates layout", function() {
        diagram.layout = function() {
            ok(true);
        };
        dataSource.remove(dataSource.at(0));
    });

    test("dataSource add adds shape", function() {
        dataSource.add({id: "3"});

        equal(shapes.length, 4);
    });

    test("dataSource add updates layout", function() {
        diagram.layout = function() {
            ok(true);
        };

        dataSource.add({id: "3"});
    });

    test("dataSource add adds connections if shape has parents", function() {
        var item = dataSource.at(0);
        var newItem = item.children.add({id: "3"});
        var shape = dataMap[newItem.uid];
        ok(shape.connections().length);
    });

    test("dataSource read clears existing shapes before adding new ones", function() {
        dataSource.read();

        equal(shapes.length, 3);
    });

    test("dataSource read clears existing uids from map", function() {
        dataSource.read();
        dataMap = diagram._dataMap;
        var mapCount = 0;
        var existingItemsUids = true;
        for(var uid in dataMap) {
            mapCount++;
            existingItemsUids = existingItemsUids && !!dataSource.getByUid(uid);
        }

        ok(existingItemsUids);
        equal(mapCount, 3);
    });

    test("updating item fields does not layout diagram", 0, function() {
       diagram.layout = function() {
           ok(false);
       };
       var item = dataSource.at(0);
       item.set("foo", "bar");
    });

    test("updating item fields does not update shapes and connections", function() {
       var connectionsCount = connections.length;
       var shapesCount = shapes.length;
       var item = dataSource.at(0);
       item.set("foo", "bar");
       equal(connections.length, connectionsCount);
       equal(shapes.length, shapesCount);
    });

    // ------------------------------------------------------------
    module("Diagram / Shapes / Data Binding", {
        setup: function() {
            diagram = createDiagram({
                dataSource: {
                    data: [{
                        id: 1
                    },{
                        id: 2
                    },{
                        id: 3
                    }]
                },
                connectionsDataSource: { }
            });
        },
        teardown: destroyDiagram
    });

    test("binds to flat data", function() {
        equal(diagram.shapes.length, 3);
    });

    test("initial binding should add shapes in dataMap", function() {
        var count = 0;

        for (var item in diagram._dataMap) {
            count++;
            ok(diagram._dataMap[item] instanceof kendo.dataviz.diagram.Shape);
        }

        equal(count, 3);
    });

    test("remove should remove shape", function() {
        var item = diagram.dataSource.at(0);
        var id = item.id;
        var shape = diagram._dataMap[id];
        diagram.dataSource.remove(item);
        ok(!diagram._dataMap[id]);
        ok(!diagram.getShapeById(shape.id));
    });

    test("remove does not remove shape if updates are suspended", function() {
        var item = diagram.dataSource.at(0);
        var id = item.id;
        var shape = diagram._dataMap[id];
        diagram._suspendModelRefresh();
        diagram.dataSource.remove(item);
        ok(diagram._dataMap[id]);
        ok(diagram.getShapeById(shape.id));
    });

    test("itemchange should change the shape dataItem", function() {
        var item = diagram.dataSource.at(0);
        item.set("foo", "bar");
        var shape = diagram._dataMap[item.id];
        equal(shape.dataItem.foo, "bar");
    });

    (function() {
        var item;

        // ------------------------------------------------------------
        module("Diagram / Shapes / Inactive items", {
            setup: function() {
                diagram = createDiagram({
                    dataSource: setupDataSource("shape"),
                    connectionsDataSource: { }
                });
            },
            teardown: destroyDiagram
        });

        test("adding new item to the to the dataSource should add the item to the inactive items", function() {
            item = dataSource.add({});
            ok(diagram._inactiveShapeItems.getByUid(item.uid));
        });

        asyncTest("inactive item is removed after it has been synced", 0, function() {
            item = dataSource.add({});
            dataSourceSync(function() {
                diagram._inactiveShapeItems.forEach(function() {
                    ok(false);
                });
            });
        });

        asyncTest("inactive item callbacks are executed after an item is synced with the dataItem as parameter", 1, function() {
            item = dataSource.add({});
            var inactiveItem = diagram._inactiveShapeItems.getByUid(item.uid);
            inactiveItem.onActivate(function(e) {
                start();
                ok(item === e);
            });
            dataSource.sync();
        });

        asyncTest("deferreds are resolved after an item is synced", 1, function() {
            item = dataSource.add({});
            var inactiveItem = diagram._inactiveShapeItems.getByUid(item.uid);
            var deferred = inactiveItem.onActivate(function() {});
            $.when(deferred).then(function() {
                start();
                ok(true);
            });
            dataSource.sync();
        });

        asyncTest("adds shape for the inactive dataItem after it has been synced", 1, function() {
            item = dataSource.add({});
            dataSourceSync(function() {
                ok(diagram._dataMap[item.id]);
            });
        });

        asyncTest("adds existing shape for the inactive item if the element is set", 1, function() {
            item = dataSource.add({});
            var inactiveItem = diagram._inactiveShapeItems.getByUid(item.uid);
            var shape = new kendo.dataviz.diagram.Shape();
            inactiveItem.element = shape;
            dataSourceSync(function() {
                ok(diagram._dataMap[item.id] === shape);
            });
        });

        test("does not add shape to undo redo stack for existing shape if undoable is set to false", 1, function() {
            item = dataSource.add({});
            var inactiveItem = diagram._inactiveShapeItems.getByUid(item.uid);
            var shape = new kendo.dataviz.diagram.Shape();
            var count = diagram.undoRedoService.count();
            inactiveItem.element = shape;
            inactiveItem.undoable = false;
            dataSource.sync();
            equal(diagram.undoRedoService.count(), count);
        });

        var dataSourceSync = function (assertCallback) {
            dataSource.one("sync", function() {
                start();
                assertCallback();
            });
            dataSource.sync();
        };

    })();

    (function() {
        var item, shape;

        // ------------------------------------------------------------
        module("Diagram / Shapes / Updates", {
            setup: function() {
                diagram = createDiagram({
                    shapeDefaults: {
                        content: {
                            template: "#:foo#"
                        }
                    },
                    dataSource: setupDataSource("shape", {}, [{id: 1, width: 100, height: 100, x: 10, y: 10, text: "foo", foo: "bar", type: "circle"}]),
                    connectionsDataSource: { }
                });
                item =  diagram.dataSource.at(0);
                shape = diagram.shapes[0];
            },
            teardown: destroyDiagram
        });

        test("recreates shape visual if the model type field is changed", function() {
            var shapeVisual = shape.shapeVisual;
            item.set("type", "rectangle");
            ok(shape.shapeVisual !== shapeVisual);
        });

        test("recreates shape visual if a field not related to the bounds is changed", function() {
            var shapeVisual = shape.shapeVisual;
            item.set("foo", "baz");
            ok(shape.shapeVisual !== shapeVisual);
        });

        test("does not recreate visual if a bounds field is changed", function() {
            var shapeVisual = shape.shapeVisual;
            item.set("x", 200);
            ok(shape.shapeVisual === shapeVisual);
        });

        test("does not recreate visual if updates are suspended", function() {
            var shapeVisual = shape.shapeVisual;
            diagram._suspendModelRefresh();
            item.set("type", "rectangle");
            item.set("foo", "baz");
            ok(shape.shapeVisual === shapeVisual);
        });

        test("updates content if a field not related to the bounds is changed", function() {
            var contentVisual = shape._contentVisual;
            item.set("foo", "baz");
            equal(shape._contentVisual.options.text, "baz");
        });

        test("updates bounds when a bounds model field is changed", function() {
            item.set("x", 200);
            item.set("y", 200);
            item.set("width", 200);
            item.set("height", 200);
            var bounds = shape.bounds();
            equal(bounds.x, 200);
            equal(bounds.y, 200);
            equal(bounds.width, 200);
            equal(bounds.height, 200);
        });

    })();

    (function() {
        // ------------------------------------------------------------
        module("Diagram / Connections / Data Binding", {
            setup: function() {
                diagram = createDiagram({
                    connectionDefaults: {
                        type: "cascading"
                    },
                    dataSource: {
                        data: [{
                            id: 1
                        },{
                            id: 2
                        },{
                            id: 3
                        }]
                    },
                    connectionsDataSource: {
                        data: [{
                            id: 1,
                            from: 1,
                            to: 2,
                            type: "polyline",
                            fromConnector: "Top",
                            toConnector: "Bottom"
                        },{
                            id: 2,
                            from: 2,
                            to: 3
                        }]
                    }
                });
            },
            teardown: destroyDiagram
        });

        test("binds to flat data", function() {
            equal(diagram.connections.length, 2);
        });

        test("initial binding should add shapes in connectionsDataMap", function() {
            var count = 0;

            for (var item in diagram._connectionsDataMap) {
                count++;
                ok(diagram._connectionsDataMap[item] instanceof kendo.dataviz.diagram.Connection);
            }

            equal(count, 2);
        });

        test("should set connection type from the dataItem", function() {
            equal(diagram.connections[0].type(), "polyline");
        });

        test("should set connection type from the default options if the dataItem does not have a type field", function() {
            equal(diagram.connections[1].type(), "cascading");
        });

        test("should set connection source based on the dataItem fromConnector field", function() {
            equal(diagram.connections[0].source().options.name, "Top");
        });

        test("should set connection target based on the dataItem toConnector field", function() {
            equal(diagram.connections[0].target().options.name, "Bottom");
        });

        test("remove should remove connection", function() {
            var item = diagram.connectionsDataSource.at(0);
            var uid = item.uid;
            diagram.connectionsDataSource.remove(item);
            ok(!diagram._connectionsDataMap[uid]);
            equal(diagram.connections.length, 1);

        });

        test("remove does not remove connection if updates are suspended", function() {
            var item = diagram.connectionsDataSource.at(0);
            var uid = item.uid;
            diagram._suspendModelRefresh();
            diagram.connectionsDataSource.remove(item);

            ok(diagram._connectionsDataMap[uid]);
            equal(diagram.connections.length, 2);
        });

        test("itemchange should change the connection dataItem", function() {
            var item = diagram.connectionsDataSource.at(0);
            item.set("foo", "bar");
            var connection = diagram._connectionsDataMap[item.uid];
            equal(connection.dataItem.foo, "bar");
        });

        test("changing the dataItem type field updates the connection type", function() {
            var item = diagram.connectionsDataSource.at(0);
            item.set("type", "cascading");
            equal(diagram.connections[0].type(), "cascading");
        });

        test("changing the dataItem type field updates the connection type", function() {
            var item = diagram.connectionsDataSource.at(0);
            item.set("type", "cascading");
            equal(diagram.connections[0].type(), "cascading");
        });

        test("changing the dataItem fromConnector field updates the connection source", function() {
            var item = diagram.connectionsDataSource.at(0);
            item.set("fromConnector", "Left");
            equal(diagram.connections[0].source().options.name, "Left");
        });

        test("changing the dataItem toConnector field updates the connection target", function() {
            var item = diagram.connectionsDataSource.at(0);
            item.set("toConnector", "Right");
            equal(diagram.connections[0].target().options.name, "Right");
        });

    })();

    (function() {
        var shapeItem, connectionItem, shape, connection;

        // ------------------------------------------------------------
        module("Diagram / Connections / UpdateModel", {
            setup: function() {
                diagram = createDiagram({
                    dataSource: setupDataSource("shape", {}, [{id: 1}, {id: 2}, {id: 3}]),
                    connectionsDataSource: setupDataSource("connection", {}, [{id: 1, from: 1, to: 2}, {id: 2, fromX: 100, fromY: 100, toX: 200, toY: 200}])
                });
                shapesItem = diagram.connectionsDataSource.at(0);
                pointsItem = diagram.connectionsDataSource.at(1);
                shapesConnection = diagram.connections[0];
                pointsConnection = diagram.connections[1];
            },
            teardown: destroyDiagram
        });

        test("updates from and to values in model", 2, function() {
            shapesConnection.options.from = 2;
            shapesConnection.options.to = 3;
            shapesItem.bind("change", function(e) {
                if (e.field == "from") {
                    equal(this.from, 2);
                } else if (e.field == "to") {
                    equal(this.to, 3);
                }
            });
            shapesConnection.updateModel();
        });

        test("updates fromConnector and toConnector values in model if defined", 2, function() {
            shapesConnection.source(diagram.shapes[2].getConnector("Top"));
            shapesConnection.target(diagram.shapes[1].getConnector("Left"));
            shapesItem.fromConnector = null;
            shapesItem.toConnector = null;
            shapesItem.bind("change", function(e) {
                if (e.field == "fromConnector") {
                    equal(this.fromConnector, "Top");
                } else if (e.field == "toConnector") {
                    equal(this.toConnector, "Left");
                }
            });
            shapesConnection.updateModel();
        });

        test("does not set fromConnector value in model if it is not defined", 0, function() {
            shapesConnection.source(diagram.shapes[2].getConnector("Top"));
            shapesConnection.target(diagram.shapes[1].getConnector("Left"));
            shapesItem.bind("change", function(e) {
                if (e.field == "fromConnector" || e.field == "toConnector") {
                   ok(false);
                }
            });
            shapesConnection.updateModel();
        });

        test("updates fromX and fromY values in model", 2, function() {
            pointsConnection.options.fromX = 5;
            pointsConnection.options.fromY = 10;
            pointsItem.bind("change", function(e) {
                if (e.field == "fromX") {
                    equal(this.fromX, 5);
                } else if (e.field == "fromY") {
                    equal(this.fromY, 10);
                }
            });
            pointsConnection.updateModel();
        });

        test("updates toX and toY values in model", 2, function() {
            pointsConnection.options.toX = 5;
            pointsConnection.options.toY = 10;
            pointsItem.bind("change", function(e) {
                if (e.field == "toX") {
                    equal(this.toX, 5);
                } else if (e.field == "toY") {
                    equal(this.toY, 10);
                }
            });
            pointsConnection.updateModel();
        });

        test("does not update options from model", 0, function() {
            shapesConnection.options.from = 2;
            shapesConnection.options.to = 3;
            shapesConnection.updateOptionsFromModel = function() {
                ok(false);
            };
            shapesConnection.updateModel();
        });

        test("does not reset from and fromConnector fields if not defined", 0, function() {
            pointsConnection.options.fromX = 2;
            pointsConnection.options.fromY = 3;

            pointsItem.bind("change", function(e) {
                if (e.field === "from" || e.field == "fromConnector") {
                    ok(false);
                }
            });

            pointsConnection.updateModel();
        });

        test("does not reset to and toConnector fields if not defined", 0, function() {
            pointsConnection.options.toX = 2;
            pointsConnection.options.toY = 3;

            pointsItem.bind("change", function(e) {
                if (e.field === "to" || e.field == "toConnector") {
                    ok(false);
                }
            });

            pointsConnection.updateModel();
        });

        test("does not reset fromX and fromY fields if not defined", 0, function() {
            shapesConnection.options.from = 3;

            shapesItem.bind("change", function(e) {
                if (e.field === "fromX" || e.field === "fromY") {
                    ok(false);
                }
            });

            shapesConnection.updateModel();
        });

        test("does not reset toX and toY fields if not defined", 0, function() {
            shapesConnection.options.to = 3;

            shapesItem.bind("change", function(e) {
                if (e.field === "toX" || e.field === "toY") {
                    ok(false);
                }
            });

            shapesConnection.updateModel();
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var dataSource, connectionsDataSource;
        module("Diagram / Sync", {
            setup: function() {
                dataSource = setupDataSource("shape", {}, [{id: 1}, {id: 2}, {id: 3}]);
                connectionsDataSource = setupDataSource("connection", {}, [{id: 1, from: 1, to: 2}, {id: 2, fromX: 100, fromY: 100, toX: 200, toY: 200}]);
                diagram = createDiagram({
                    dataSource: dataSource,
                    connectionsDataSource:connectionsDataSource
                });
            },
            teardown: destroyDiagram
        });

        asyncTest("_syncShapeChanges syncs dataSource", function() {
            dataSource.at(0).dirty = true;
            dataSource.one("sync", function() {
                start();
                ok(true);
            });
            diagram._syncShapeChanges();
        });

        asyncTest("_syncConnectionChanges syncs connectionsDataSource", function() {
            connectionsDataSource.at(0).dirty = true;
            connectionsDataSource.one("sync", function() {
                start();
                ok(true);
            });
            diagram._syncConnectionChanges();
        });

        asyncTest("_syncConnectionChanges syncs connectionsDataSource after the deferred connection updates are resolved", function() {
            var deferred = $.Deferred();
            diagram._deferredConnectionUpdates.push(deferred);
            connectionsDataSource.at(0).dirty = true;
            connectionsDataSource.sync = function() {
                ok(false);
            };
            diagram._syncConnectionChanges();

            connectionsDataSource.sync = function() {
                start();
                ok(true);
            };
            deferred.resolve();
        });

        asyncTest("_syncChanges syncs dataSource and connectionsDataSource", 2, function() {
            dataSource.at(0).dirty = true;
            connectionsDataSource.at(0).dirty = true;
            dataSource.one("sync", function() {
                ok(true);
            });
            connectionsDataSource.one("sync", function() {
                start();
                ok(true);
            });
            diagram._syncChanges();
        });

    })();


})();
