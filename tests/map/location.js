(function() {
    var TOLERANCE = 1e-6;

    var dataviz = kendo.dataviz,
        Point = dataviz.Point2D,

        map = dataviz.map,
        Extent = map.Extent,
        Location = map.Location;

    var loc;

    // ------------------------------------------------------------
    module("Location", {
        setup: function() {
            loc = new Location(51.9371170300465, 80.11230468750001);
        }
    });

    test("toString format is lat, lng", function() {
        equal(loc.toString(), "51.937117,80.112305");
    });

    test("toArray returns lat, lng array", function() {
        deepEqual(loc.toArray(), [51.9371170300465, 80.11230468750001]);
    });

    test("equals fails with different latitude", function() {
        ok(!new Location(10, 20).equals(new Location(11, 20)));
    });

    test("equals fails with different longitude", function() {
        ok(!new Location(10, 20).equals(new Location(10, 21)));
    });

    test("equals succeeds", function() {
        ok(new Location(10, 20).equals(new Location(10, 20)));
    });

    test("init from lat, lng array", function() {
        ok(Location.fromLatLng([10, 20]).equals(new Location(10, 20)));
    });

    test("init from lng, lat array", function() {
        ok(Location.fromLngLat([10, 20]).equals(new Location(20, 10)));
    });

    test("create from lng, lat", function() {
        ok(Location.create(10, 20).equals(new Location(10, 20)));
    });

    test("create from lng, lat array", function() {
        ok(Location.create([10, 20]).equals(new Location(10, 20)));
    });

    test("create from Location", function() {
        ok(Location.create(new Location(10, 20)).equals(new Location(10, 20)));
    });

    test("create from Location clones instance", function() {
        var loc = new Location(10, 20);
        ok(Location.create(loc) !== loc);
    });

    test("create from undefined", function() {
        equal(Location.create(undefined), undefined);
    });

    test("round rounds lng", function() {
        loc.lng = 5.5;
        loc.round();

        equal(loc.lng, 6);
    });

    test("round rounds lng to precision", function() {
        loc.lng = 5.151;
        loc.round(2);

        equal(loc.lng, 5.15);
    });

    test("round rounds lat", function() {
        loc.lat = 5.5;
        loc.round();

        equal(loc.lat, 6);
    });

    test("round rounds lat to precision", function() {
        loc.lat = 5.151;
        loc.round(2);

        equal(loc.lat, 5.15);
    });

    test("round returns location", function() {
        deepEqual(loc.round(), loc);
    });

    test("wrap wraps lng", function() {
        loc.lng = 200;
        loc.wrap();

        equal(loc.lng, 20);
    });

    test("wrap wraps negative lng", function() {
        loc.lng = -200;
        loc.wrap();

        equal(loc.lng, -20);
    });

    test("wrap wraps lat", function() {
        loc.lat = 100;
        loc.wrap();

        equal(loc.lat, 10);
    });

    test("wrap wraps negative lat", function() {
        loc.lat = -100;
        loc.wrap();

        equal(loc.lat, -10);
    });

    test("wrap returns location", function() {
        deepEqual(loc.wrap(), loc);
    });

    test("clone copies location", function() {
        deepEqual(loc.toArray(), loc.clone().toArray());
    });

    test("clone returns copy", function() {
        ok(loc !== loc.clone());
    });

    var from, to;
    // ------------------------------------------------------------
    module("Location / distanceTo", {
        setup: function() {
            from = new Location(42.7000, 23.3333);
            to = new Location(-33.8600, 151.2111);
        }
    });

    test("distanceTo with default ellipsoid", function() {
        equal(from.distanceTo(to), 15431830.77 /* m */);
    });

    test("distanceTo with custom ellipsoid", function() {
        var datum = { a: 6378137, b: 6378137, f: 0 }; // sphere
        equal(from.distanceTo(to, datum), 15452385.28);
    });

    test("distanceTo same point", function() {
        equal(from.distanceTo(from), 0);
    });

    test("distanceTo almost same point", function() {
        equal(from.distanceTo(new Location(from.lat + 1e-8, from.lng + 1e-8)), 0);
    });

    test("distanceTo on equator", function() {
        equal(new Location(0, 0).distanceTo([0, 10]), 1113194.91);
    });

    test("distanceTo antipodal point", function() {
        from = new Location(43.53, -8);

        // Precision suffers dramatically for antipodal points
        close(from.distanceTo([-43.53, 172]), 19951000, 100);
    });

    test("distanceTo undefined", function() {
        equal(from.distanceTo(), 0);
    });

    // ------------------------------------------------------------
    module("Location / greatCircleTo", {
        setup: function() {
            from = new Location(42.7000, 23.3333);
            to = new Location(-33.8600, 151.2111);
        }
    });

    test("greatCircleTo reports distance", function() {
        equal(from.greatCircleTo(to).distance, 15431830.77);
    });

    test("greatCircleTo reports azimuthFrom", function() {
        close(from.greatCircleTo(to).azimuthFrom, 95.338, 1e-3);
    });

    test("greatCircleTo reports azimuthTo", function() {
        close(from.greatCircleTo(to).azimuthTo, 118.162, 1e-3);
    });

    // ------------------------------------------------------------
    module("Location / destination", {
        setup: function() {
            from = new Location(42.7000, 23.3333);
        }
    });

    test("destination reports location", function() {
        var dest = from.destination(100000 /* 100km */, 270 /* W */).round(4);
        equal(dest.lat, 42.6935);
        equal(dest.lng, 22.1110);
    });

    test("destination reports location (custom datum)", function() {
        var dest = from.destination(100, 270, { a: 6371 }).round(4);
        equal(dest.lat, 42.7000);
        equal(dest.lng, 23.3321);
    });

    // ------------------------------------------------------------
    var extent;

    module("Extent", {
        setup: function() {
            extent = new Extent(
                new Location(45, -90),
                new Location(-45, 90)
            );
        }
    });

    test("constructor accepts Locations", function() {
        ok(extent.nw.equals(new Location(45, -90)));
    });

    test("constructor swaps Locations", function() {
        extent = new Extent(
            new Location(-45, 90),
            new Location(45, -90)
        );
        ok(extent.nw.equals(new Location(45, -90)));
    });

    test("constructor accepts [lat,lng]", function() {
        extent = new Extent([10, 20], [30, 40]);
        ok(extent.nw.equals(new Location(10, 20)));
        ok(extent.se.equals(new Location(30, 40)));
    });

    test("create from two locations", function() {
        extent = Extent.create(
            new Location(45, -90),
            new Location(-45, 90)
        );
        ok(extent.nw.equals(new Location(45, -90)));
    });

    test("create from two [lat, lnt] arrays", function() {
        extent = Extent.create([10, 20], [30, 40]);
        ok(extent.nw.equals(new Location(10, 20)));
        ok(extent.se.equals(new Location(30, 40)));
    });

    test("create from flat array", function() {
        extent = Extent.create([10, 20, 30, 40]);
        ok(extent.nw.equals(new Location(10, 20)));
        ok(extent.se.equals(new Location(30, 40)));
    });

    test("create from Extent", function() {
        result = Extent.create(extent);
        equal(result, extent);
    });

    test("create from undefined", function() {
        extent = Extent.create();
        equal(extent, undefined);
    });

    test("contains for negative longitude", function() {
        ok(extent.contains(new Location(0, -89)));
    });

    test("contains for positive longitude", function() {
        ok(extent.contains(new Location(0, 89)));
    });

    test("contains for negative latitude", function() {
        ok(extent.contains(new Location(-44, 0)));
    });

    test("contains for positive latitude", function() {
        ok(extent.contains(new Location(44, 0)));
    });

    test("does not contain for negative longitude", function() {
        ok(!extent.contains(new Location(0, -91)));
    });

    test("does not contain for positive longitude", function() {
        ok(!extent.contains(new Location(0, 91)));
    });

    test("does not contain for negative latitude", function() {
        ok(!extent.contains(new Location(-46, 0)));
    });

    test("does not contain for positive latitude", function() {
        ok(!extent.contains(new Location(46, 0)));
    });

    test("contains location on longitude limit", function() {
        ok(extent.contains(new Location(0, 90)));
    });

    test("contains location on latitude limit", function() {
        ok(extent.contains(new Location(45, 0)));
    });

    test("contains with array", function() {
        ok(extent.contains([0, -89]));
    });

    test("does not contain with array", function() {
        ok(!extent.contains([0, -91]));
    });

    test("containsAny with one matching and one non-matching", function() {
        ok(extent.containsAny([
            new Location(0, -89), new Location(0, -91)
        ]));
    });

    test("containsAny with two matching", function() {
        ok(extent.containsAny([
            new Location(0, -89), new Location(0, 89)
        ]));
    });

    test("containsAny with two non-matching", function() {
        ok(!extent.containsAny([
            new Location(0, -91), new Location(0, 91)
        ]));
    });

    // ------------------------------------------------------------
    module("Extent / User units", {
        setup: function() {
            extent = new Extent(
                new Location(500, -500),
                new Location(-500, 500)
            );
        }
    });

    test("contains point with negative x", function() {
        ok(extent.contains(new Location(0, -400)));
    });

    test("contains point with positive x", function() {
        ok(extent.contains(new Location(0, 400)));
    });

    test("contains point with negative y", function() {
        ok(extent.contains(new Location(-400, 0)));
    });

    test("contains point with positive y", function() {
        ok(extent.contains(new Location(400, 0)));
    });

    test("does not contain point with negative x", function() {
        ok(!extent.contains(new Location(0, -600)));
    });

    test("does not contain with positive x", function() {
        ok(!extent.contains(new Location(0, 600)));
    });

    test("does not contain with negative y", function() {
        ok(!extent.contains(new Location(-600, 0)));
    });

    test("does not contain with positive y", function() {
        ok(!extent.contains(new Location(600, 0)));
    });

    // ------------------------------------------------------------
    module("Extent / include", {
        setup: function() {
            extent = new Extent(
                new Location(0, 0),
                new Location(0, 0)
            );
        }
    });

    test("extends nw edge to negative longitude", function() {
        extent.include(new Location(0, -100));
        equal(extent.nw.lng, -100);
    });

    test("extends nw edge to positive latitude", function() {
        extent.include(new Location(45, 0));
        equal(extent.nw.lat, 45);
    });

    test("does not extends nw edge beyond sw latitude", function() {
        extent.include(new Location(-45, 0));
        equal(extent.nw.lat, 0);
    });

    test("does not extends nw edge beyond sw longitude", function() {
        extent.include(new Location(0, 100));
        equal(extent.nw.lng, 0);
    });

    test("extends se edge to positive longitude", function() {
        extent.include(new Location(0, 100));
        equal(extent.se.lng, 100);
    });

    test("extends se edge to negative latitude", function() {
        extent.include(new Location(-45, 0));
        equal(extent.se.lat, -45);
    });

    test("does not extends se edge beyond nw latitude", function() {
        extent.include(new Location(45, 0));
        equal(extent.se.lat, 0);
    });

    test("does not extends se edge beyond nw longitude", function() {
        extent.include(new Location(0, -100));
        equal(extent.se.lng, 0);
    });

    test("include accepts [lat, lng] array", function() {
        extent.include([10, 20]);
        equal(extent.nw.lat, 10);
        equal(extent.se.lng, 20);
    });

    test("includeAll includes all locations", function() {
        extent.includeAll([
            new Location(10, -10),
            new Location(-10, 10)
        ]);

        ok(extent.nw.equals(new Location(10, -10)));
        ok(extent.se.equals(new Location(-10, 10)));
    });

    test("includeAll accepts lng, lat arrays", function() {
        extent.includeAll([
            [10, 20],
            [-10, -20]
        ]);

        ok(extent.nw.equals(new Location(10, -20)));
        ok(extent.se.equals(new Location(-10, 20)));
    });

    // ------------------------------------------------------------
    module("Extent / overlaps", {
        setup: function() {
            extent = new Extent(
                new Location(10, -10),
                new Location(-10, 10)
            );
        }
    });

    test("overlaps at nw edge", function() {
        ok(extent.overlaps(new Extent(
            new Location(20, 20),
            new Location(-10, 10)
        )))
    });

    test("overlaps at se edge", function() {
        ok(extent.overlaps(new Extent(
            new Location(-10, 10),
            new Location(-20, 20)
        )))
    });

    test("overlaps within", function() {
        ok(extent.overlaps(new Extent(
            new Location(5, -5),
            new Location(-5, 5)
        )))
    });

    test("overlaps around", function() {
        ok(extent.overlaps(new Extent(
            new Location(50, -50),
            new Location(-50, 50)
        )))
    });

    test("overlaps implicit edge", function() {
        ok(extent.overlaps(new Extent(
            new Location(20, 5),
            new Location(5, 20)
        )));
    });

    test("does not overlap west", function() {
        ok(!extent.overlaps(new Extent(
            new Location(-100, 20),
            new Location(-20, 10)
        )))
    });

    test("does not overlap east", function() {
        ok(!extent.overlaps(new Extent(
            new Location(100, 20),
            new Location(20, 10)
        )))
    });

    test("does not overlap north", function() {
        ok(!extent.overlaps(new Extent(
            new Location(90, -10),
            new Location(20, 10)
        )))
    });

    test("does not overlap south", function() {
        ok(!extent.overlaps(new Extent(
            new Location(20, -10),
            new Location(90, 10)
        )))
    });

    // ------------------------------------------------------------
    module("Extent / center");

    test("negative longitude", function() {
        ok(new Extent([0, -100], [0, -80]).center().equals(
           new Location(0, -90)
        ));
    });

    test("positive longitude", function() {
        ok(new Extent([0, 80], [0, 100]).center().equals(
           new Location(0, 90)
        ));
    });

    test("mixed longitude", function() {
        ok(new Extent([0, -100], [0, 100]).center().equals(
           new Location(0, 0)
        ));
    });

    test("negative latitude", function() {
        ok(new Extent([-10, 0], [-30, 0]).center().equals(
           new Location(-20, 0)
        ));
    });

    test("positive latitude", function() {
        ok(new Extent([10, 0], [30, 0]).center().equals(
           new Location(20, 0)
        ));
    });

    test("mixed latitude", function() {
        ok(new Extent([10, 0], [-10, 0]).center().equals(
           new Location(0, 0)
        ));
    });

    // ------------------------------------------------------------
    module("Extent / edges", {
        setup: function() {
            extent = new Extent([10, -20], [-30, 40]);
        }
    });

    test("nw edge", function() {
        deepEqual(extent.edges().nw.toArray(), [10, -20]);
    });

    test("ne edge", function() {
        deepEqual(extent.edges().ne.toArray(), [10, 40]);
    });

    test("se edge", function() {
        deepEqual(extent.edges().se.toArray(), [-30, 40]);
    });

    test("sw edge", function() {
        deepEqual(extent.edges().sw.toArray(), [-30, -20]);
    });

    // ------------------------------------------------------------
    module("Extent / toArray", {
        setup: function() {
            extent = new Extent([10, -20], [-30, 40]);
        }
    });

    test("returns edges", function() {
        var edges = extent.edges();
        deepEqual(extent.toArray(), [edges.nw, edges.ne, edges.se, edges.sw]);
    });

    // ------------------------------------------------------------
    module("Extent / Constants");

    test("WORLD", function() {
        ok(Extent.World.nw.equals(new Location(90, -180)));
        ok(Extent.World.se.equals(new Location(-90, 180)));
    });
})();
