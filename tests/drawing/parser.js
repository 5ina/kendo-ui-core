(function() {
    var dataviz = kendo.dataviz,
        d = kendo.drawing,
        g = kendo.geometry,
        Point = g.Point,
        parser = d.PathParser.current,
        multiPath,
        path,
        segment,
        point,
        TOLERANCE = 0.1,
        EXPONENT_TOLERANCE = 0.0000000000000001;

    module("Parser", {});

    test("throws error for invalid command letter", function() {
        throws(function() {
            parser.parse("M 100 100 k 10 10");
        });
    });

    test("returns MultiPath", function() {
        ok(parser.parse("") instanceof d.MultiPath);
    });

    test("parses floating point numbers", function() {
        multiPath = parser.parse("M1.123 0.456");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 1.123);
        equal(point.y, 0.456);
    });

    test("parses exponential numbers", function() {
        multiPath = parser.parse("M100 -5.96046447753906E-08 L 1.2333333333333332e+21 10");
        point = multiPath.paths[0].segments[0].anchor();
        var linePoint = multiPath.paths[0].segments[1].anchor();
        equal(point.x, 100);
        close(point.y, -0.000000059604644775, EXPONENT_TOLERANCE);
        equal(linePoint.x, 1233333333333333333333);
        equal(linePoint.y, 10);
    });

    test("parses numbers starting with decimal separator", function() {
        multiPath = parser.parse("M1 .1");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 1);
        equal(point.y, .1);
    });

    test("parses numbers starting with zero", function() {
        multiPath = parser.parse("M01 0002");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 1);
        equal(point.y, 2);
    });

    // ------------------------------------------------------------
    module("Parser / Move", {
        setup: function() {
            multiPath = parser.parse("M 100 100 m 50 50");
        }
    });

    test("moves path", function() {
        path = multiPath.paths[0];
        point = path.segments[0].anchor();
        equal(point.x, 100);
        equal(point.y, 100);
    });

    test("moves path with relative coordinates", function() {
        path = multiPath.paths[1];
        point = path.segments[0].anchor();
        equal(point.x, 150);
        equal(point.y, 150);
    });

    test("parses move with comma as separator", function() {
        multiPath = parser.parse("M 100,100");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 100);
        equal(point.y, 100);
    });

    test("parses move without space between the command and the coordinates", function() {
        multiPath = parser.parse("M100,100");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 100);
        equal(point.y, 100);
    });

    test("parses move sign as separator between the coordinates", function() {
        multiPath = parser.parse("M100-100");
        point = multiPath.paths[0].segments[0].anchor();
        equal(point.x, 100);
        equal(point.y, -100);
    });

    // ------------------------------------------------------------
    module("Parser / Line", {
        setup: function() {
            multiPath = parser.parse("M 100 100 L 300 300 l 50 -50 0 30 H 400 V 300 h 50 v 50");
            path = multiPath.paths[0];
        }
    });

    test("parses line", function() {
        segment = path.segments[1];
        point = segment.anchor();
        equal(point.x, 300);
        equal(point.y, 300);
    });

    test("parses line with relative coordinates", function() {
        segment = path.segments[2];
        point = segment.anchor();
        equal(point.x, 350);
        equal(point.y, 250);
    });

    test("parses multiple coordinates", function() {
        segment = path.segments[3];
        point = segment.anchor();
        equal(point.x, 350);
        equal(point.y, 280);
    });

    test("parses horizontal line", function() {
        segment = path.segments[4];
        point = segment.anchor();
        equal(point.x, 400);
        equal(point.y, 280);
    });

    test("parses vertical line", function() {
        segment = path.segments[5];
        point = segment.anchor();
        equal(point.x, 400);
        equal(point.y, 300);
    });

    test("parses horizontal line with relative coordinates", function() {
        segment = path.segments[6];
        point = segment.anchor();
        equal(point.x, 450);
        equal(point.y, 300);
    });

    test("parses vertical line with relative coordinates", function() {
        segment = path.segments[7];
        point = segment.anchor();
        equal(point.x, 450);
        equal(point.y, 350);
    });

    test("parses line with comma as separator", function() {
        multiPath = parser.parse("M 100,100 L 300,300");
        point = multiPath.paths[0].segments[1].anchor();
        equal(point.x, 300);
        equal(point.y, 300);
    });

    test("parses line with sign as separator", function() {
        multiPath = parser.parse("M100,100l100-50+20-40");
        var segments = multiPath.paths[0].segments;
        point = segments[1].anchor();
        equal(point.x, 200);
        equal(point.y, 50);
        point = segments[2].anchor();
        equal(point.x, 220);
        equal(point.y, 10);
    });

    test("parses line without spaces between the command and the coordinates", function() {
        multiPath = parser.parse("M 100,100 L300,300");
        point = multiPath.paths[0].segments[1].anchor();
        equal(point.x, 300);
        equal(point.y, 300);
    });

    test("implicit line with relative coordinates", function() {
        multiPath = parser.parse("m 10,20 30,40", {}, true);

        point = multiPath.paths[0].segments[1].anchor();
        equal(point.x, 40);
        equal(point.y, 60);
    });

    test("implicit line with relative coordinates (two segments)", function() {
        multiPath = parser.parse("m 10,20 30,40 5,5", {}, true);

        point = multiPath.paths[0].segments[2].anchor();
        equal(point.x, 45);
        equal(point.y, 65);
    });

    test("implicit line with absolute coordinates", function() {
        multiPath = parser.parse("M 10,20 30,40", {}, true);
        point = multiPath.paths[0].segments[1].anchor();
        equal(point.x, 30);
        equal(point.y, 40);
    });

    test("implicit line with absolute coordinates (two segments)", function() {
        multiPath = parser.parse("M 10,20 30,40 5,5", {}, true);
        point = multiPath.paths[0].segments[2].anchor();
        equal(point.x, 5);
        equal(point.y, 5);
    });

    // ------------------------------------------------------------
    var endSegment;

    module("Parser / Curve", {
        setup: function() {
            multiPath = parser.parse("M 100 100 C 150 150 200 300 150 100 c 10 -20 50 30 100 100 10 10 50 50 30 -20");
            path = multiPath.paths[0];
        }
    });

    test("parses curve", function() {
        var controlOut = Point.create(150, 150),
            controlIn = Point.create(200, 300),
            anchor = Point.create(150, 100);

        segment = path.segments[0];
        endSegment = path.segments[1];

        ok(segment.controlOut().equals(controlOut));
        ok(endSegment.controlIn().equals(controlIn));
        ok(endSegment.anchor().equals(anchor));
    });

    test("parses curve with relative coordinates", function() {
        var controlOut = Point.create(160, 80),
            controlIn = Point.create(200, 130),
            anchor = Point.create(250, 200);

        segment = path.segments[1];
        endSegment = path.segments[2];

        ok(segment.controlOut().equals(controlOut));
        ok(endSegment.controlIn().equals(controlIn));
        ok(endSegment.anchor().equals(anchor));
    });

    test("parses multiple coordinates", function() {
        var controlOut = Point.create(260, 210),
            controlIn = Point.create(300, 250),
            anchor = Point.create(280, 180);

        segment = path.segments[2];
        endSegment = path.segments[3];

        ok(segment.controlOut().equals(controlOut));
        ok(endSegment.controlIn().equals(controlIn));
        ok(endSegment.anchor().equals(anchor));
    });

    test("parses curve with comma as separator", function() {
        multiPath = parser.parse("M 100,100 C 150,150 200,300 150,100");
        path = multiPath.paths[0];
        segment = path.segments[0];
        endSegment = path.segments[1];

        var controlOut = Point.create(150, 150),
            controlIn = Point.create(200, 300),
            anchor = Point.create(150, 100);

        ok(segment.controlOut().equals(controlOut));
        ok(endSegment.controlIn().equals(controlIn));
        ok(endSegment.anchor().equals(anchor));
    });

    test("parses curve without spaces between the command and the coordinates", function() {
        multiPath = parser.parse("M100,100 C150,150 200,300 150,100");
        path = multiPath.paths[0];
        segment = path.segments[0];
        endSegment = path.segments[1];

        var controlOut = Point.create(150, 150),
            controlIn = Point.create(200, 300),
            anchor = Point.create(150, 100);

        ok(segment.controlOut().equals(controlOut));
        ok(endSegment.controlIn().equals(controlIn));
        ok(endSegment.anchor().equals(anchor));
    });

    // ------------------------------------------------------------
    module("Parser / Smooth curve", {
        setup: function() {
            multiPath = parser.parse("M100,100S 200,200 300 100s-50,250 150,50");
            path = multiPath.paths[0];
        }
    });

    test("parses current position as controlOut if previous segment is not a cubic curve", function() {
        var controlOut = path.segments[0].controlOut();

        equal(controlOut.x, 100);
        equal(controlOut.y, 100);
    });

    test("parses controlIn", function() {
        var controlIn = path.segments[1].controlIn();

        equal(controlIn.x, 200);
        equal(controlIn.y, 200);
    });

    test("parses anchor", function() {
        var anchor = path.segments[1].anchor();

        equal(anchor.x, 300);
        equal(anchor.y, 100);
    });

    test("parses controlOut as the reflected point of the previous segment controlIn point", function() {
        var controlOut = path.segments[1].controlOut();

        equal(controlOut.x, 400);
        equal(controlOut.y, 0);
    });

    test("parses relative controlIn", function() {
        var controlIn = path.segments[2].controlIn();

        equal(controlIn.x, 250);
        equal(controlIn.y, 350);
    });

    test("parses relative anchor", function() {
        var anchor = path.segments[2].anchor();

        equal(anchor.x, 450);
        equal(anchor.y, 150);
    });

    // ------------------------------------------------------------
    module("Parser / quadratic curve", {
        setup: function() {
            multiPath = parser.parse("M100,100Q200,200 300,100q-50,200 100,300");
            path = multiPath.paths[0];
        }
    });

    test("calculates controlOut", function() {
        var controlOut = path.segments[0].controlOut();

        close(controlOut.x, 166.6, TOLERANCE);
        close(controlOut.y, 166.6, TOLERANCE);
    });

    test("calculates controlIn", function() {
        var controlIn = path.segments[1].controlIn();

        close(controlIn.x, 233.3, TOLERANCE);
        close(controlIn.y, 166.6, TOLERANCE);
    });

    test("parses anchor", function() {
        var anchor = path.segments[1].anchor();

        equal(anchor.x, 300);
        equal(anchor.y, 100);
    });

    test("calculates relative controlOut", function() {
        var controlOut = path.segments[1].controlOut();

        close(controlOut.x, 266.6, TOLERANCE);
        close(controlOut.y, 233.3, TOLERANCE);
    });

    test("calculates relative controlIn", function() {
        var controlIn = path.segments[2].controlIn();

        equal(controlIn.x, 300);
        close(controlIn.y, 333.3, TOLERANCE);
    });

    test("parses relative anchor", function() {
        var anchor = path.segments[2].anchor();

        equal(anchor.x, 400);
        equal(anchor.y, 400);
    });

    // ------------------------------------------------------------

    module("Parser / Smooth quadratic curve", {
        setup: function() {
            multiPath = parser.parse("M100,100T 200,200 t50,0 -100,100");
            path = multiPath.paths[0];
        }
    });

    test("uses current position as control point if previous segment is not a quadratic curve", function() {
        var controlOut = path.segments[0].controlOut();

        close(controlOut.x, 100, TOLERANCE);
        close(controlOut.y, 100, TOLERANCE);
    });

    test("calculates controlIn", function() {
        var controlIn = path.segments[1].controlIn();

        close(controlIn.x, 133.3, TOLERANCE);
        close(controlIn.y, 133.3, TOLERANCE);
    });

    test("parses anchor", function() {
        var anchor = path.segments[1].anchor();

        equal(anchor.x, 200);
        equal(anchor.y, 200);
    });

    test("calculates control point as the reflected point of the previous segment control point", function() {
        var controlOut = path.segments[1].controlOut();

        close(controlOut.x, 266.6, TOLERANCE);
        close(controlOut.y, 266.6, TOLERANCE);
    });

    test("calculates relative controlIn", function() {
        var controlIn = path.segments[2].controlIn();

        close(controlIn.x, 283.3, TOLERANCE);
        close(controlIn.y, 266.6, TOLERANCE);
    });

    test("calculates relative anchor", function() {
        var anchor = path.segments[2].anchor();

        equal(anchor.x, 250);
        equal(anchor.y, 200);
    });

    test("calculates controlOut when specifying multiple segments", function() {
        var controlOut = path.segments[2].controlOut();

        close(controlOut.x, 216.6, TOLERANCE);
        close(controlOut.y, 133.3, TOLERANCE);
    });

    test("calculates controlIn when specifying multiple segments", function() {
        var controlIn = path.segments[3].controlIn();

        close(controlIn.x, 183.3, TOLERANCE);
        close(controlIn.y, 166.6, TOLERANCE);
    });

    test("calculates anchor when specifying multiple segments", function() {
        var anchor = path.segments[3].anchor();

        equal(anchor.x, 150);
        equal(anchor.y, 300);
    });

    // ------------------------------------------------------------
    function closePoints(point1, point2, tolerance) {
        if (point1) {
            if (!point2) {
                ok(false, "No second point");
            } else {
                close(point1.x, point2.x, tolerance);
                close(point1.y, point2.y, tolerance);
            }
        }
    }

    function closePaths(path1, path2, tolerance) {
        var segments1 = path1.segments,
            segments2 = path2.segments,
            length = segments1.length,
            i;

        if (segments1.length !== segments2.length) {
            ok(false, "Expected " + segments2.length + " segments, got " + segments1.length);
        }

        for (i = 0; i < length; i++) {
            closePoints(segments1[i].anchor(), segments2[i].anchor(), tolerance, "anchor @" + i);
            closePoints(segments1[i].controlOut(), segments2[i].controlOut(), tolerance, "controlOut @" + i);
            closePoints(segments1[i].controlIn(), segments2[i].controlIn(), tolerance, "controlIn @" + i);
        }
    }

    module("Parser / Arc", {});

    test("parses arc to curve", function() {
        multiPath = parser.parse("M 300 300 A 50 100 0 1 1 350 300");
        path = multiPath.paths[0];
        var expectedPath = new d.Path();
        expectedPath.moveTo(300, 300);
        expectedPath.curveTo([289.2, 287.5], [280.9, 266.7], [277.2, 242.9]);
        expectedPath.curveTo([273.5, 219] , [274.5, 192.5], [280, 170]);
        expectedPath.curveTo([285.4, 147.5] , [295.1, 129.4], [306.7, 120.3]);
        expectedPath.curveTo([318.3, 111.2] , [331.7, 111.2], [343.3, 120.3]);
        expectedPath.curveTo([354.9, 129.4] , [364.6, 147.5], [370, 170]);
        expectedPath.curveTo([375.5, 192.5] , [376.5, 219], [372.8, 242.9]);
        expectedPath.curveTo([369.1, 266.7] , [360.8, 287.5], [350, 300]);

        closePaths(path, expectedPath, TOLERANCE);
    });

    test("parses arc with relative coordinates", function() {
        multiPath = parser.parse("M 340 265.4 a 80 40 0 0 1 29.3 54.6");
        path = multiPath.paths[0];
        var expectedPath = new d.Path();

        expectedPath.moveTo(340, 265.4);
        expectedPath.curveTo([358.11, 270.62], [371.83, 279.57], [377.25, 289.68]);
        expectedPath.curveTo([382.67, 299.79], [379.73, 310.96], [369.26, 320.03]);

        closePaths(path, expectedPath, TOLERANCE);
    });

})();
