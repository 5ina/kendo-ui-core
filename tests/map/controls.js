(function() {
    var dataviz = kendo.dataviz,
        Point = dataviz.Point2D,

        m = dataviz.map,
        Extent = m.Extent,
        Location = m.Location;

    var map;
    function createMap(options) {
        destroyMap();

        var element = $("<div style='width: 512px; height: 512px;'></div>").appendTo(QUnit.fixture);
        map = new kendo.dataviz.ui.Map(element, options);
        return map;
    }

    function destroyMap() {
        if (map) {
            map.destroy();
            map.element.remove();
            map = null;
        }
    }

    (function() {
        // ------------------------------------------------------------
        module("Map / Navigator", {
            setup: function() { createMap(); },
            teardown: destroyMap
        });

        test("navigator is created by default", function() {
            ok(map.navigator);
        });

        test("navigator is not created on mobile devices", function() {
            var mobileOS = kendo.support.mobileOS;

            kendo.support.mobileOS = true;
            createMap();
            ok(!map.navigator);
            kendo.support.mobileOS = mobileOS;
        });

        test("navigator is not created if disabled", function() {
            createMap({ controls: { navigator: false } });
            ok(!map.navigator);
        });

        test("navigator options are passed", function() {
            createMap({ controls: { navigator: { foo: true } } });
            ok(map.navigator.options.foo);
        });

        test("panning triggers pan and panEnd", 2, function() {
            map.bind("pan", function() {
                map.bind("panEnd", function() {
                    ok(true);
                });

                ok(true);
            });
            map.navigator.trigger("pan", { x: 100, y: 0 });
        });

        test("panning moves origin", function() {
            map.bind("panEnd", function() {
                ok(new Location(53, -27).equals(map.extent().nw.round()));
            });
            map.navigator.trigger("pan", { x: 100, y: 100 });
        });

        test("panning is limited to world extent (west)", function() {
            createMap({ wraparound: false });
            map.bind("panEnd", function() {
                equal(map.scroller.scrollLeft, -768);
            });
            map.navigator.trigger("pan", { x: -10000, y: 0 });
        });

        test("panning is limited to world extent (east)", function() {
            createMap({ wraparound: false });
            map.bind("panEnd", function() {
                equal(map.scroller.scrollLeft, 768);
            });
            map.navigator.trigger("pan", { x: 10000, y: 0 });
        });

        test("panning is limited to world extent (north)", function() {
            createMap({ wraparound: false });
            map.bind("panEnd", function() {
                equal(map.scroller.scrollTop, 768);
            });
            map.navigator.trigger("pan", { x: 0, y: -10000 });
        });

        test("panning is limited to world extent (south)", function() {
            createMap({ wraparound: false });
            map.bind("panEnd", function() {
                equal(map.scroller.scrollTop, -768);
            });
            map.navigator.trigger("pan", { x: 0, y: 10000 });
        });

        test("panning wraps around world (west)", function() {
            map.bind("panEnd", function() {
                equal(map.scroller.scrollLeft, -10000);
            });
            map.navigator.trigger("pan", { x: -10000, y: 0 });
        });

        test("panning wraps around (east)", function() {
            map.bind("panEnd", function() {
                equal(map.scroller.scrollLeft, 10000);
            });
            map.navigator.trigger("pan", { x: 10000, y: 0 });
        });

        test("center resets center", function() {
            map.bind("reset", function() { ok(true); });
            map.navigator.trigger("center");
        });
    })();

    (function() {
        // ------------------------------------------------------------
        module("Map / ZoomControl", {
            setup: function() { createMap(); },
            teardown: destroyMap
        });

        test("zoomControl is created by default", function() {
            ok(map.zoomControl);
        });

        test("zoomControl is not created on mobile devices", function() {
            var mobileOS = kendo.support.mobileOS;

            kendo.support.mobileOS = true;
            createMap();
            ok(!map.zoomControl);
            kendo.support.mobileOS = mobileOS;
        });

        test("zoomControl is not created if disabled", function() {
            createMap({ controls: { zoom: false } });
            ok(!map.zoomControl);
        });

        test("zoomControl options are passed", function() {
            createMap({ controls: { zoom: { foo: true } } });
            ok(map.zoomControl.options.foo);
        });

        test("zooming triggers zoomStart and zoomEnd", 2, function() {
            map.bind("zoomStart", function() {
                map.bind("zoomEnd", function() {
                    ok(true);
                });

                ok(true);
            });
            map.zoomControl.trigger("change", { delta: 1 });
        });
    })();
})();
