function baseLayerTests(name, TLayer) {
    var dataviz = kendo.dataviz,
        d = kendo.drawing,
        m = dataviz.map;

    var layer;

    function assertUnbind() {
        map.unbind = function(name, handler) {
            if (name === "reset") {
                ok(true);
            }

            if (name === "resize") {
                ok(true);
            }
        };
    }

    function destroyLayer() {
        if (layer) {
            layer.destroy();
        }
    }

    // ------------------------------------------------------------
    module(name + " / styles", {
        setup: function() {
            map = new MapMock();
        },
        teardown: destroyLayer
    });

    test("zIndex", function() {
        layer = new TLayer(map, { zIndex: 100 });
        equal(layer.element.css("zIndex"), 100);
    });

    test("opacity", function() {
        layer = new TLayer(map, { opacity: 0.10 });
        close(layer.element.css("opacity"), 0.10, 0.001);
    });

    // ------------------------------------------------------------
    module(name + " / hide", {
        setup: function() {
            map = new MapMock();
            layer = new TLayer(map);
        },
        teardown: destroyLayer
    });

    test(name + " / hide hides element", function() {
        layer.hide();
        equal(layer.element.css("display"), "none");
    });

    test("detaches map event handlers", 2, function() {
        assertUnbind();
        layer.hide();

        map.unbind = $.noop;
    });

    // ------------------------------------------------------------
    module(name + " / show", {
        setup: function() {
            map = new MapMock();
            layer = new TLayer(map);
            layer.hide();
        },
        teardown: destroyLayer
    });

    test("shows element", function() {
        layer.show();
        equal(layer.element.css("display"), "block");
    });

    test("re-attaches map event handlers", function() {
        stubMethod(TLayer.fn, "reset", function() {
            ok(true);
        }, function() {
            layer.show();
            map.trigger("reset");
        });
    });

    test("triggers reset", function() {
        stubMethod(TLayer.fn, "reset", function() {
            ok(true);
        }, function() {
            layer.show();
        });
    });

    // ------------------------------------------------------------
    module(name + " / destroy", {
        setup: function() {
            map = new MapMock();
            layer = new TLayer(map);
        }
    });

    test("detaches map event handlers", 2, function() {
        assertUnbind();
        layer.destroy();
    });

    // ------------------------------------------------------------
    module(name + " / extent", {
        setup: function() {
            map = new MapMock();
        },
        teardown: destroyLayer
    });

    test("layer is hidden when zoom < minZoom", function() {
        layer = new TLayer(map, { minZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(!visible);
        }, function() {
            map._zoom = 4;
            map.trigger("reset");
        });
    });

    test("layer is shown when zoom = minZoom", function() {
        layer = new TLayer(map, { minZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(visible);
        }, function() {
            map._zoom = 5;
            map.trigger("reset");
        });
    });

    test("layer is hidden when zoom > maxZoom", function() {
        layer = new TLayer(map, { maxZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(!visible);
        }, function() {
            map._zoom = 6;
            map.trigger("reset");
        });
    });

    test("layer is shown when zoom = maxZoom", function() {
        layer = new TLayer(map, { maxZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(visible);
        }, function() {
            map._zoom = 5;
            map.trigger("reset");
        });
    });

    test("layer is hidden when outside zoom range", function() {
        layer = new TLayer(map, { minZoom: 3, maxZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(!visible);
        }, function() {
            map._zoom = 1;
            map.trigger("reset");
        });
    });

    test("layer is shown when inside zoom range", function() {
        layer = new TLayer(map, { minZoom: 3, maxZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(visible);
        }, function() {
            map._zoom = 4;
            map.trigger("reset");
        });
    });

    test("layer is hidden when outside extent", function() {
        layer = new TLayer(map, {
            extent: [
                45.3444, 20.8960,
                40.5222, 29.6850
            ]
        });

        map._extent = new m.Extent([0, 0], [-10, 10]);

        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(!visible);
        }, function() {
            map.trigger("reset");
        });
    });

    test("layer is shown when inside extent", function() {
        layer = new TLayer(map, {
            extent: [
                45.3444, 20.8960,
                40.5222, 29.6850
            ]
        });

        map._extent = new m.Extent([42, 0], [0, 30]);

        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(visible);
        }, function() {
            map.trigger("reset");
        });
    });

    test("layer is shown when inside extent and zoom range", function() {
        layer = new TLayer(map, {
            extent: [
                45.3444, 20.8960,
                40.5222, 29.6850
            ],
            minZoom: 5,
            maxZoom: 10
        });

        map._zoom = 5;
        map._extent = new m.Extent([42, 0], [0, 30]);

        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(visible);
        }, function() {
            map.trigger("reset");
        });
    });

    test("layer is hidden when inside extent, but outside zoom range", function() {
        layer = new TLayer(map, {
            extent: [
                45.3444, 20.8960,
                40.5222, 29.6850
            ],
            minZoom: 5,
            maxZoom: 10
        });

        map._zoom = 4;
        map._extent = new m.Extent([0, 42], [30, 0]);

        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(!visible);
        }, function() {
            map.trigger("reset");
        });
    });

    test("extent is evaluated on panEnd", function() {
        layer = new TLayer(map, { minZoom: 5 });
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(true);
        }, function() {
            map.trigger("panEnd");
        });
    });

    test("extent not evaluated for hidden layer", 0, function() {
        layer = new TLayer(map, { minZoom: 5 });
        layer.hide();
        stubMethod(TLayer.fn, "_setVisibility", function(visible) {
            ok(false);
        }, function() {
            map.trigger("reset");
        });
    });

    // ------------------------------------------------------------
    module(name + " / reset", {
        setup: function() {
            map = new MapMock();
            layer = new TLayer(map);
        },
        teardown: destroyLayer
    });

    test("reset triggers _beforeReset handler", function() {
        layer._beforeReset = function() { ok(true) };
        layer.reset();
    });

    test("reset triggers _reset handler", function() {
        layer._reset = function() { ok(true), TLayer.fn._reset.call(this); };
        layer.reset();
    });

    // ------------------------------------------------------------
    module(name + " / exportVisual", {
        setup: function() {
            map = new MapMock();
            layer = new TLayer(map);

            map.scroller = {
                scrollLeft: 100,
                scrollTop: 200,
                element: $("<div/>").css({
                    width: "600px", height: "400px", position: "absolute"
                })
            };
        },
        teardown: destroyLayer
    });

    test("clips root element", function() {
        var visual = layer.exportVisual();
        var clip = visual.clip().bbox();

        deepEqual(clip.size.toArray(), [600, 400]);
        deepEqual(clip.origin.toArray(), [0, 0]);
    });

    test("translates content element", function() {
        var content = layer.exportVisual().children[0];
        var matrix = content.transform().matrix();

        deepEqual(matrix.toArray(), [1,0,0,1,-100,-200]);
    });
}
