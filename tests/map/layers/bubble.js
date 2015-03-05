(function() {
    var dataviz = kendo.dataviz,
        g = kendo.geometry,
        d = kendo.drawing,
        m = dataviz.map,
        BubbleLayer = m.layers.BubbleLayer,
        Location = m.Location;

    var map;
    var layer;

    function load() {
        layer._load([{
            "location": [42, 45], "value": 10
        }, {
            "location": [42, 45], "value": 50
        }, {
            "location": [42, 45], "value": 100
        }])
    }

    function createLayer(map, options) {
        destroyLayer();
        layer = new BubbleLayer(map, options);
    }

    function destroyLayer() {
        if (layer) {
            layer.destroy();
        }

        layer = null;
    }

    // ------------------------------------------------------------
    (function() {
        module("Bubble Layer", {
            setup: function() {
                map = new MapMock();
                createLayer(map, {
                    style: {
                        fill: {
                            color: "foo"
                        }
                    }
                });
            },
            teardown: destroyLayer
        });

        test("creates circle symbols by default", function() {
            layer.surface.draw = function(shape) {
                ok(shape instanceof d.Circle);
            };

            load();
        });

        test("sets circle center", function() {
            layer.surface.draw = function(shape) {
                var center = shape.geometry().center
                equal(center.x, 45);
                equal(center.y, 42);
            };

            load();
        });

        test("sets circle radius to make area proportional", function() {
            var sizes = [];
            layer.surface.draw = function(shape) {
                sizes.push(Math.round(shape.geometry().radius));
            };

            load();

            deepEqual(sizes, [50, 35, 16]);
        });

        test("sets circle style", function() {
            layer.surface.draw = function(shape) {
                equal(shape.options.fill.color, "foo");
            };

            load();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Bubble Layer / Squares", {
            setup: function() {
                map = new MapMock();
                createLayer(map, {
                    symbol: "square",
                    style: {
                        fill: {
                            color: "foo"
                        }
                    }
                });
            },
            teardown: destroyLayer
        });

        test("creates square symbols", function() {
            layer.surface.draw = function(shape) {
                ok(shape instanceof d.Path);
            };

            load();
        });

        test("sets square center", function() {
            layer.surface.draw = function(shape) {
                var center = shape.bbox().center();
                equal(center.x, 45);
                equal(center.y, 42);
            };

            load();
        });

        test("sets square size to make area proportional", function() {
            var sizes = [];
            layer.surface.draw = function(shape) {
                sizes.push(Math.round(shape.bbox().width()));
            };

            load();

            deepEqual(sizes, [100, 71, 32]);
        });

        test("sets square style", function() {
            layer.surface.draw = function(shape) {
                equal(shape.options.fill.color, "foo");
            };

            load();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Bubble Layer / Custom Symbol", {
            setup: function() {
                map = new MapMock();
                createLayer(map, {
                    symbol: "foo",
                    style: "bar"
                });
            },
            teardown: destroyLayer
        });

        test("uses custom named symbol", function() {
            layer.surface.draw = function(shape) {
                ok(shape.foo);
            };

            m.symbols.foo = function() {
                return { foo: true };
            };

            load();
        });

        test("uses custom symbol function", function() {
            createLayer(map, {
                symbol: function() {
                    return { foo: true };
                },
                style: "bar"
            });

            layer.surface.draw = function(shape) {
                ok(shape.foo);
            };

            load();
        });

        test("sets symbol center", function() {
            m.symbols.foo = function(args) {
                equal(args.center.x, 45);
                equal(args.center.y, 42);

                return new d.Group();
            };

            load();
        });

        test("sets symbol size", function() {
            var sizes = [];
            m.symbols.foo = function(args) {
                sizes.push(Math.round(args.size));

                return new d.Group();
            };

            load();

            deepEqual(sizes, [100, 71, 32]);
        });

        test("sets symbol style", function() {
            m.symbols.foo = function(args) {
                equal(args.style, "bar");

                return new d.Group();
            };

            load();
        });

        test("sets symbol dataItem", function() {
            m.symbols.foo = function(args) {
                ok(args.dataItem);

                return new d.Group();
            };

            load();
        });

        test("sets symbol location", function() {
            m.symbols.foo = function(args) {
                ok(args.location.equals(new m.Location(42, 45)));

                return new d.Group();
            };

            load();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        function load() {
            layer._load([{
            }, {
                "location": [42, 45], "value": 10
            }, {
            }]);
        }

        module("Bubble Layer / Scale", {
            setup: function() {
                map = new MapMock();
                createLayer(map);
            },
            teardown: destroyLayer
        });

        test("undefined values are ignored", 1, function() {
            layer.surface.draw = function(shape) {
                equal(shape.geometry().radius, 50);
            };
            load();
        });

        test("initializes custom named scale", function() {
            m.scales.foo = function(domain, range) {
                deepEqual(domain, [0, 10]);
                deepEqual(range, [0, 100]);

                this.map = function() {
                    return 1;
                };
            };

            createLayer(map, {
                scale: "foo"
            });

            load();
        });

        test("initializes custom scale", function() {
            createLayer(map, {
                scale: function(domain, range) {
                    deepEqual(domain, [0, 10]);
                    deepEqual(range, [0, 100]);

                    this.map = function() {
                        return 1;
                    };
                }
            });

            load();
        });

        test("uses custom scale", function() {
            m.scales.foo = function(domain, range) {
                this.map = function() {
                    ok(true);
                    return 1;
                };
            };

            createLayer(map, {
                scale: "foo"
            });

            load();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Bubble Layer / Data binding", {
            setup: function() {
                map = new MapMock();
                createLayer(map, {
                    dataSource: {
                        data: [{
                            "location": [42, 45], "value": 10
                        }]
                    }
                });
            },
            teardown: destroyLayer
        });

        test("binds to empty data source", 0, function() {
            layer.destroy();
            createLayer(map, {
                dataSource: {
                    data: []
                }
            });
        });

        test("re-draws symbols on reset", function() {
            layer.surface.draw = function() {
                ok(true);
            };

            map.trigger("reset");
        });

        test("re-draws all symbols on incremental change", function() {
            layer._load = function(data) {
                equal(data.length, 2);
            };

            layer.dataSource.add({});
        });

        test("clears surface on change", function() {
            layer.surface.clear = function() {
                ok(true);
            };

            layer.dataSource.add({});
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Bubble Layer / Events", {
            setup: function() {
                map = new MapMock();
                createLayer(map);
            },
            teardown: destroyLayer
        });

        test("fires shapeCreated", function() {
            map.bind("shapeCreated", function(e) {
                ok(true);
            });

            load();
        });

        test("cancelling shapeCreated prevents shape from being drawn", 0, function() {
            layer.surface.draw = function() {
                ok(false);
            };

            map.bind("shapeCreated", function(e) {
                e.preventDefault();
            });

            load();
        });

        test("event has layer", function() {
            map.bind("shapeCreated", function(e) {
                equal(e.layer, layer);
            });

            load();
        });

        test("shape has dataItem", function() {
            map.bind("shapeCreated", function(e) {
                ok(e.shape.dataItem);
            });

            load();
        });

        test("shape has location", function() {
            map.bind("shapeCreated", function(e) {
                ok(e.shape.location.equals(new m.Location(42, 45)));
            });

            load();
        });

        test("shape has value", function() {
            map.bind("shapeCreated", function(e) {
                ok(e.shape.value);
            });

            load();
        });
    })();

    baseLayerTests("Bubble Layer", BubbleLayer);
})();
