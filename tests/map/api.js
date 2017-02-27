(function() {
    var dataviz = kendo.dataviz,

        g = kendo.geometry,
        Point = g.Point,

        m = dataviz.map,
        Extent = m.Extent,
        Location = m.Location;

    var map;
    function createMap(options) {
        destroyMap();

        var element = $("<div style='width: 512px; height: 512px; position: absolute; top: 0; left: 0'></div>")
                      .appendTo(QUnit.fixture);

        $(document.body).css({ "padding": "50px", "margin": 0 });

        map = new kendo.dataviz.ui.Map(element, options);
        return map;
    }

    function destroyMap() {
        $(document.body).css({ "padding": "", "margin": "" });

        if (map) {
            map.destroy();
            map.element.remove();
            map = null;
        }
    }

    // ------------------------------------------------------------
    module("Map / Center", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("accepts Location", function() {
        var center = new Location(42, 47);
        map.center(center);

        ok(map.center().equals(center));
    });

    test("accepts lat, lng array", function() {
        map.center([42, 47]);

        ok(map.center().equals(new Location(42, 47)));
    });

    test("updates options", function() {
        var center = [42, 47];
        map.center(center);
        deepEqual(map.options.center, center);
    });

    test("setting center resets origin", function() {
        var origin = map.extent().nw;
        map.center([42, 47]);
        ok(!map.extent().nw.equals(origin));
    });

    test("setter returns map", function() {
        equal(map.center([42, 47]), map);
    });

    // ------------------------------------------------------------
    module("Map / Zoom", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("not constrained to maxZoom", function() {
        createMap({ maxZoom: 4 });
        map.zoom(10);
        deepEqual(map.options.zoom, 4);
    });

    test("constraints to minZoom", function() {
        createMap({ minZoom: 4 });
        map.zoom(2);
        deepEqual(map.options.zoom, 4);
    });

    test("no reset if not changed", 0, function() {
        map.zoom(4);
        map._reset = function() { ok(false); };
        map.zoom(4);
    });

    test("updates options", function() {
        map.zoom(10);
        deepEqual(map.options.zoom, 10);
    });

    test("rounds value", function() {
        map.zoom(10.6);
        deepEqual(map.options.zoom, 11);
    });

    test("setting zoom resets origin", function() {
        var origin = map.extent().nw;
        map.zoom(10);
        ok(!map.extent().nw.equals(origin));
    });

    test("getter returns zoom", function() {
        equal(map.zoom(), 3);
    });

    test("setter returns map", function() {
        equal(map.zoom(5), map);
    });

    // ------------------------------------------------------------
    module("Map / Extent", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("se corner wraps around by default", function() {
        createMap({ zoom: 0 });
        map.element.css("width", "2000px");
        ok(map.extent().se.round().lng > 180);
    });

    test("se corner wraps around -180 in east direction", function() {
        createMap();
        map.extent(new Extent([10, 170], [0, -160]));

        close(map.extent().se.lng, 210, 10);
    });

    test("se corner does not wrap around -180", function() {
        createMap();
        map.extent(new Extent([10, -170], [10, -160]));

        close(map.extent().se.lng, -160, 10);
    });

    test("se corner does not wrap around", function() {
        createMap({ zoom: 1, wraparound: false });
        map.element.css("width", "2000px");
        equal(map.extent().se.round().lng, 180);
    });

    test("se is clipped visible area", function() {
        createMap({ zoom: 3 });
        map.element.css("width", "1024px");
        equal(map.extent().se.round().lng, 135);
    });

    test("setting extent sets center", function() {
        map.extent(new Extent([0, 10], [10, 0]));
        ok(map.center().equals(new Location(5, 5)));
    });

    test("setting extent sets min zoom", function() {
        createMap({ minZoom: 10, zoom: 11, maxZoom: 12 });
        map.extent(new Extent([90, -180], [-90, 180]));
        equal(map.zoom(), 10);
    });

    test("setting extent sets max zoom", function() {
        createMap({ minZoom: 10, zoom: 11, maxZoom: 12 });
        map.extent(new Extent([-0.1, 0.1], [0, 0]));
        equal(map.zoom(), 12);
    });

    test("setter accepts [nw_lat, nw_lng, se_lat, se_lng] array", function() {
        map.extent([0, 10, 10, 0]);
        ok(map.center().equals(new Location(5, 5)));
    });

    test("setter returns Map", function() {
        equal(map.extent(new Extent([0, 0], [-10, 10])), map);
    });

    // ------------------------------------------------------------
    module("Map / Location <-> Layer", {
        setup: function() {
            createMap({ zoom: 1 });
        },
        teardown: destroyMap
    });

    test("locationToLayer maps location to layer coordinates", function() {
        var point = map.locationToLayer(new Location(90, 240));
        ok(point.round().equals(new Point(597, 0)));
    });

    test("locationToLayer maps location to layer coordinates at specified zoom", function() {
        var point = map.locationToLayer(new Location(0, 0), 3);
        ok(point.round().equals(new Point(1024, 1024)));
    });

    test("locationToLayer clamps coordinates when wraparound is false", function() {
        createMap({ zoom: 1, wraparound: false });
        var point = map.locationToLayer(new Location(90, 240));
        ok(point.round().equals(new Point(512, 0)));
    });

    test("layerToLocation maps layer coordinates to location", function() {
        var loc = map.layerToLocation(new Point(597, 0));
        ok(loc.round().equals(new Location(85, 240)));
    });

    test("layerToLocation accepts x, y array", function() {
        var loc = map.layerToLocation([597, 0]);
        ok(loc.round().equals(new Location(85, 240)));
    });

    test("layerToLocation maps layer coordinates to location at specified zoom", function() {
        var loc = map.layerToLocation(new Point(1024, 1024), 3);
        ok(loc.round().equals(new Location(0, 0)));
    });

    test("layerToLocation maps layer coordinates to location when wraparound is false", function() {
        createMap({ zoom: 1, wraparound: false });
        var loc = map.layerToLocation(new Point(512, 0));
        ok(loc.round().equals(new Location(85, 180)));
    });

    // ------------------------------------------------------------
    module("Map / Location <-> View", {
        setup: function() {
            createMap({ zoom: 1 });
        },
        teardown: destroyMap
    });

    test("locationToView maps location to view coordinates", function() {
        var point = map.locationToView(new Location(90, 240));
        ok(point.round().equals(new Point(597, 0)));
    });

    test("locationToView maps location to view coordinates at specified zoom", function() {
        var point = map.locationToView(new Location(0, 0), 3);
        ok(point.round().equals(new Point(256, 256)));
    });

    test("viewToLocation maps view coordinates to location", function() {
        var loc = map.viewToLocation(new Point(597, 0));
        ok(loc.round().equals(new Location(85, 240)));
    });

    test("viewToLocation accepts x, y array", function() {
        var loc = map.viewToLocation([597, 0]);
        ok(loc.round().equals(new Location(85, 240)));
    });

    test("viewToLocation maps view coordinates to location at specified zoom", function() {
        var loc = map.viewToLocation(new Point(1024, 1024), 3);
        ok(loc.round().equals(new Location(0, 0)));
    });

    // ------------------------------------------------------------
    module("Map / Event coordinates", {
        setup: function() {
            createMap({ zoom: 2 });
        },
        teardown: destroyMap
    });

    test("eventToLocation maps event coordinates to location", function() {
        var loc = map.eventToLocation({ pageX: 150, pageY: 150 });
        ok(loc.round().equals(new Location(48, -55)));
    });

    test("eventToLocation maps event coordinates to location w/scroll", function() {
        map._navigatorPan({ x: 0, y: 100 });
        var loc = map.eventToLocation({ pageX: 150, pageY: 250 });
        equal(loc.round().toString(), new Location(48, -55).toString());
    });

    test("eventToLocation maps jQuery event coordinates to location", function() {
        var loc = map.eventToLocation({ originalEvent: { pageX: 150, pageY: 150 } });
        ok(loc.round().equals(new Location(48, -55)));
    });

    test("eventToView maps event coordinates to view coordinates", function() {
        var point = map.eventToView({ pageX: 150, pageY: 150 });
        ok(point.round().equals(new Point(100, 100)));
    });

    test("eventToView maps event coordinates to view coordinates w/scroll", function() {
        map._navigatorPan({ x: 0, y: 100 });
        var point = map.eventToView({ pageX: 150, pageY: 250 });
        ok(point.round().equals(new Point(100, 100)));
    });

    test("eventToLayer maps event coordinates to layer coordinates", function() {
        var point = map.eventToLayer({ pageX: 150, pageY: 150 });
        ok(point.round().equals(new Point(356, 356)));
    });

    test("eventToLayer maps event coordinates to layer coordinates w/scroll", function() {
        map._navigatorPan({ x: 0, y: 100 });
        var point = map.eventToLayer({ pageX: 150, pageY: 250 });
        ok(point.round().equals(new Point(356, 356)));
    });

    test("eventOffset maps event coordinates to offset", function() {
        map._navigatorPan({ x: 0, y: 100 });
        var point = map.eventOffset({ pageX: 150, pageY: 250 });
        ok(point.round().equals(new Point(100, 200)));
    });

    // ------------------------------------------------------------
    module("Map / setOptions", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("resets map", function() {
        map._reset = function() {
            ok(true);
        };

        map.setOptions({ foo: true });
    });

    // ------------------------------------------------------------
    module("Map / viewSize", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("returns element size", function() {
        map.element.css({ width: 1024, height: 1024 });
        deepEqual(map.viewSize(), { width: 1024, height: 1024 });
    });

    test("returns view size if smaller than element size", function() {
        map.options.minZoom = 0;
        map.zoom(0);
        deepEqual(map.viewSize(), { width: 512, height: 256 });
    });

    // ------------------------------------------------------------
    module("Map / pannable", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("setting to false sets virtual size to view size", function() {
        createMap({ pannable: false });
        deepEqual(map._virtualSize, { x: { min: 0, max: 512 }, y: { min: 0, max: 512 } });
    });

    // ------------------------------------------------------------
    module("Map / zoomable", {
        setup: function() { createMap(); },
        teardown: destroyMap
    });

    test("setting to false disables mousewheel zooming", function() {
        createMap({ zoom: 1, zoomable: false });
        map._mousewheel({ preventDefault: $.noop, originalEvent: { detail: -3 } });
        equal(map.zoom(), 1);
    });

    test("setting to false disables touch zooming", function() {
        createMap({ zoom: 1, zoomable: false });
        ok(!map.scroller.userEvents.multiTouch);
    });

    // ------------------------------------------------------------
    module("Map / Markers", {
        teardown: destroyMap
    });

    test("creates static markers", function() {
        createMap({ markers: [{ }] });
        equal(map.markers.items.length, 1);
    });

    test("applies markerDefaults for static markers", function() {
        createMap({ markers: [{ }], markerDefaults: { foo: true } });
        ok(map.markers.items[0].options.foo);
    });

    test("does not trigger markerCreated for static markers", 0, function() {
        createMap({ markers: [{ }], markerCreated: function() { ok(false); } });
    });

    // ------------------------------------------------------------
    module("Map / Markers", {
        setup: function() {
            createMap({
                markers: [{}],
                layers: [{ type: "shape" }]
            });
        },
        teardown: destroyMap
    });

    test("destroys static marker layer", function() {
        map.markers.destroy = function() { ok(true); };
        map.destroy();
    });

    test("destroys layers", function() {
        map.layers[0].destroy = function() { ok(true); };
        map.destroy();
    });

    test("destroys navigator", function() {
        map.navigator.destroy = function() { ok(true); };
        map.destroy();
    });

    test("destroys attribution", function() {
        map.attribution.destroy = function() { ok(true); };
        map.destroy();
    });

    test("destroys zoomControl", function() {
        map.zoomControl.destroy = function() { ok(true); };
        map.destroy();
    });
})();
