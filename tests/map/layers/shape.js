(function() {
    var dataviz = kendo.dataviz,
        g = kendo.geometry,
        d = kendo.drawing,
        m = dataviz.map,
        ShapeLayer = m.layers.ShapeLayer,
        Location = m.Location;

    var map;
    var layer;

    function destroyLayer() {
        if (layer) {
            layer.destroy();
        }
    }

    // ------------------------------------------------------------
    module("Shape Layer / Positioning", {
        setup: function() {
            map = new MapMock();
            layer = new ShapeLayer(map);
        },
        teardown: destroyLayer
    });

    test("Movable is attached to surface element", function() {
        equal(layer.movable.element[0], layer.surface.element[0]);
    });

    // ------------------------------------------------------------
    var pointData = [{
        "type": "Point",
        "coordinates": [-105.01621, 39.57422]
    }];

    module("Shape Layer / Markers", {
        setup: function() {
            map = new MapMock();
            map.markers = new m.layers.MarkerLayer(map);
            layer = new ShapeLayer(map);
        },
        teardown: destroyLayer
    });

    test("adds marker when parsing points", function() {
        map.markers.add = function() { ok(true); };

        layer._load(pointData);
    });

    test("removes old markers on _load", function() {
        map.markers.remove = function() { ok(true); }

        layer._load(pointData);
        layer._load(pointData);
    });

    test("sets marker location", function() {
        map.markers.bind = function(options) {
            ok(new Location(39.57422, -105.01621).equals(Location.create(options.location)));
        };

        layer._load(pointData);
    });

    test("sets marker dataItem", function() {
        map.markers = {
            bind: function(options, dataItem) {
                deepEqual(dataItem, pointData[0]);
            }
        };

        layer._load(pointData);
    });

    test("does not add marker when markerCreated is cancelled", 0, function() {
        map.markers.add = function() { ok(false); };
        map.bind("markerCreated", function(e) { e.preventDefault(); });

        layer._load(pointData);
    });

    test("adds circle when markerCreated is cancelled", function() {
        map.bind("markerCreated", function(e) { e.preventDefault(); });

        layer._root.append = function(container) {
            ok(container.children[0] instanceof d.Circle);
        };

        layer._load(pointData);
    });

    test("does not add circle when markerCreated and shapeCreated are cancelled", 0, function() {
        map.bind("markerCreated", function(e) { e.preventDefault(); });
        map.bind("shapeCreated", function(e) { e.preventDefault(); });

        layer.surface.draw = function(shape) {
            ok(false);
        };

        layer._load(pointData);
    });

    test("triggers markerCreated on map", function() {
        map.bind("markerCreated", function() { ok(true); });

        layer._load(pointData);
    });

    test("does not trigger shapeCreated on map", 0, function() {
        map.bind("shapeCreated", function() { ok(false); });

        layer._load(pointData);
    });

    test("triggers shapeCreated on map if markerCreated is cancelled", function() {
        map.bind("markerCreated", function(e) { e.preventDefault(); });
        map.bind("shapeCreated", function() { ok(true); });

        layer._load(pointData);
    });

    // ------------------------------------------------------------
    module("Shape Layer / destroy", {
        setup: function() {
            map = new MapMock();
            layer = new ShapeLayer(map);
        },
        teardown: destroyLayer
    });

    test("destroys surface", function() {
        layer.surface.destroy = function() {
            ok(true);
            kendo.drawing.Surface.fn.destroy.call(this);
        };

        layer.destroy();
    });

    // ------------------------------------------------------------
    module("Shape Layer / Data binding", {
        setup: function() {
            map = new MapMock();
            layer = new ShapeLayer(map, {
                dataSource: {
                    data: [{
                        "type": "LineString",
                        "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
                    }]
                }
            });
        },
        teardown: destroyLayer
    });

    test("redraws GeoJSON primitives on reset", function() {
        layer._root.append = function() {
            ok(true);
        };

        map.trigger("reset");
    });

    test("redraws all shapes on incremental change", function() {
        layer._load = function(data) {
            equal(data.length, 2);
        };

        layer.dataSource.add({});
    });

    test("does not duplicate shapes on rebind", function() {
        layer.dataSource.read();
        var count = 0;
        layer._root.traverse(function() {
            count++;
        });

        equal(count, 1);
    });

    test("sets the dataSource", function() {
        layer.setDataSource(new kendo.data.DataSource({
            data: [{
                "type": "LineString",
                "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
            }, {
                "type": "LineString",
                "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
            }]
        }));

        equal(layer._data.length, 2);
    });

    test("sets the dataSource configuration", function() {
        layer.setDataSource({
            data: [{
                "type": "LineString",
                "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
            }, {
                "type": "LineString",
                "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
            }]
        });

        equal(layer._data.length, 2);
    });

    // ------------------------------------------------------------
    module("Shape Layer / API", {
        setup: function() {
            map = new MapMock();
            layer = new ShapeLayer(map);
        },
        teardown: destroyLayer
    });

    test("surface is cleared before reset", function() {
        layer.surface.clear = function() {
            ok(true);
        };

        map.trigger("beforeReset");
    });

    test("surface is not cleared during reset", 0, function() {
        layer.surface.clear = function() {
            ok(false);
        };

        map.trigger("reset");
    });

    test("suspends surface tracking on pan", 1, function() {
        layer.surface.suspendTracking = function() {
            ok(true);
        };

        map.trigger("pan");
    });

    test("resumes surface tracking on pan", 1, function() {
        layer.surface.resumeTracking = function() {
            ok(true);
        };

        map.trigger("panEnd");
    });

    test("surface events are forwarded to map", function() {
        map.bind("shapeClick", function() { ok(true) });
        layer.surface.trigger("click", {
            element: { options: {} }
        });
    });

    // ------------------------------------------------------------
    module("Shape Layer / Events", {
        setup: function() {
            map = new MapMock();
            layer = new ShapeLayer(map);
        },
        teardown: destroyLayer
    });

    test("fires shapeCreated for single geometry", function() {
        map.bind("shapeCreated", function(e) {
            ok(true);
        });

        var data = [{
            "type": "LineString",
            "coordinates": [ [100.0, 0.0], [101.0, 1.0] ]
        }];

        layer._load(data);
    });

    test("fires shapeFeatureCreated for features", function() {
        map.bind("shapeFeatureCreated", function(e) {
            ok(true);
        });

        var data = [{
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-180.0, 10.0], [20.0, 90.0], [180.0, -5.0], [-30.0, -90.0]
                ]]
            },
            "properties": {
                "foo": "bar"
            }
        }];

        layer._load(data);
    });

    baseLayerTests("Shape Layer", ShapeLayer);
})();
