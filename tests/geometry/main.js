(function() {
    var dataviz = kendo.dataviz,

        g = kendo.geometry,
        Circle = g.Circle,
        Point = g.Point,
        Rect = g.Rect,
        Size = g.Size,
        Matrix = g.Matrix,
        Arc = g.Arc,
        Transformation = g.Transformation;

    // ------------------------------------------------------------
    var point;

    module("Point", {
        setup: function() {
            point = new Point(10, 20);
        }
    });

    test("constructor sets x", function() {
        equal(point.x, 10);
    });

    test("constructor sets y", function() {
        equal(point.y, 20);
    });

    test("x defaults to 0", function() {
        equal(new Point().x, 0);
    });

    test("y defaults to 0", function() {
        equal(new Point().y, 0);
    });

    test("create from x, y", function() {
        ok(Point.create(10, 20).equals(new Point(10, 20)));
    });

    test("create from x, y array", function() {
        ok(Point.create([10, 20]).equals(new Point(10, 20)));
    });

    test("create from Point", function() {
        ok(Point.create(new Point(10, 20)).equals(new Point(10, 20)));
    });

    test("create from Point does not clone instance", function() {
        var loc = new Point(10, 20);
        ok(Point.create(loc) === loc);
    });

    test("create from undefined", function() {
        equal(Point.create(undefined), undefined);
    });

    test("sets x", function() {
        point.setX(10);
        equal(point.x, 10);
    });

    test("sets y", function() {
        point.setY(10);
        equal(point.y, 10);
    });

    test("set is chainable", function() {
        equal(point.setX(10), point);
    });

    test("gets x", function() {
        equal(point.getX(), 10);
    });

    test("gets y", function() {
        equal(point.getY(), 20);
    });

    test("changing x triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        point.setX(1);
    });

    test("changing y triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        point.setY(1);
    });

    test("setting x to same value does not trigger geometryChange", 0, function() {
        point.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });

        point.setX(10);
    });

    test("setting y to same value does not trigger geometryChange", 0, function() {
        point.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });

        point.setY(20);
    });

    test("clone returns new point instance", function() {
        var clone = point.clone();
        notEqual(clone, point);
        ok(clone instanceof Point);
    });

    test("clone copies x and y", function() {
        var clone = point.clone();
        equal(clone.x, point.x);
        equal(clone.y, point.y);
    });

    test("rotate rotates x and y around center", function() {
        point.rotate(90, new Point(100, 100));
        close(point.x, 180, 1);
        close(point.y, 10, 1);
    });

    test("move sets x and y", function() {
        point.move(90, 100);
        equal(point.x, 90);
        equal(point.y, 100);
    });

    test("move returns point", function() {
        equal(point.move(90, 100), point);
    });

    test("move triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        point.move(90, 100)
    });

    test("rotate rotates x and y around center (array)", function() {
        point.rotate(90, [100, 100]);
        close(point.x, 180, 1);
        close(point.y, 10, 1);
    });

    test("rotate returns point", function() {
        deepEqual(point.rotate(90), point);
    });

    test("rotate triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        point.rotate(90)
    });

    test("equals is true for same coordinates", function() {
        ok(new Point(1, 1).equals(new Point(1, 1)));
    });

    test("equals is false for different x coordinates", function() {
        ok(!new Point(1, 1).equals(new Point(2, 1)));
    });

    test("equals is false for different y coordinates", function() {
        ok(!new Point(1, 1).equals(new Point(1, 2)));
    });

    test("equals is false for undefined point", function() {
        ok(!new Point(1, 1).equals());
    });

    test("distanceTo calculates distance", function() {
        equal(new Point(1, 1).distanceTo(new Point(2, 2)), Math.sqrt(2));
    });

    test("scale applies to x and y", function() {
        deepEqual(point.scale(2, 3), new Point(20, 60));
    });

    test("scale uses first parameter as default", function() {
        deepEqual(point.scale(2), new Point(20, 40));
    });

    test("scale returns point", function() {
        deepEqual(point.scale(2), point);
    });

    test("scaleCopy does not change point", function() {
        var original = point.clone();
        point.scaleCopy(2);
        deepEqual(point, original);
    });

    test("scaleCopy does not trigger geometry change", 0, function() {
        point.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });
        point.scaleCopy(2);
    });

    test("scaleCopy returns point with x and y multiplied", function() {
        deepEqual(point.scaleCopy(2, 3), new Point(20, 60));
    });

    test("scaleCopy uses first parameter as default", function() {
        deepEqual(point.scaleCopy(2), new Point(20, 40));
    });

    test("translates x and y", function() {
        deepEqual(point.translate(5, 10), new Point(15, 30));
    });

    test("translate returns point", function() {
        deepEqual(point.translate(5, 10), point);
    });

    test("translate triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() { ok(true); }
        });

        point.translate(5, 10);
    });

    test("translateWith translates x and y", function() {
        deepEqual(point.translateWith(new Point(5, 10)), new Point(15, 30));
    });

    test("translateWith returns point", function() {
        deepEqual(point.translateWith(new Point(5, 10)), point);
    });

    test("translate triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() { ok(true); }
        });

        point.translateWith(new Point(5, 10));
    });

    test("transform applies matrix", function() {
        deepEqual(point.transform(Matrix.translate(10, 10)), new Point(20, 30));
    });

    test("transform applies transformation matrix", function() {
        deepEqual(point.transform(new Transformation(Matrix.translate(10, 10))), new Point(20, 30));
    });

    test("transform returns point", function() {
        deepEqual(point.transform(Matrix.unit), point);
    });

    test("transformCopy applies matrix to new point", function() {
        var matrix = Matrix.translate(10, 10),
            original = point.clone(),
            transformedPoint = point.transformCopy(Matrix.translate(10, 10));
        deepEqual(point, original);
        deepEqual(transformedPoint, new Point(20, 30));
    });

    test("transformCopy returns new point", function() {
        var transformedPoint = point.transformCopy(Matrix.unit);
        ok(transformedPoint instanceof Point);
        ok(transformedPoint !== point);
    });

    test("transformCopy returns clone of the point if no matrix is passed", function() {
        var transformedPoint = point.transformCopy();
        ok(transformedPoint instanceof Point);
        ok(transformedPoint  !== point);
    });

    test("transformCopy does not trigger geometry change", 0, function() {
        point.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });
        point.transformCopy(Matrix.unit);
    });

    test("round rounds x", function() {
        point.x = 5.5;
        point.round();

        equal(point.x, 6);
    });

    test("round rounds x to precision", function() {
        point.x = 5.151;
        point.round(2);

        equal(point.x, 5.15);
    });

    test("round rounds y", function() {
        point.y = 5.5;
        point.round();

        equal(point.y, 6);
    });

    test("round rounds y to precision", function() {
        point.y = 5.151;
        point.round(2);

        equal(point.y, 5.15);
    });

    test("round returns point", function() {
        deepEqual(point.round(), point);
    });

    test("round triggers geometryChange", function() {
        point.addObserver({
            geometryChange: function() { ok(true); }
        });

        point.round();
    });

    test("toString concatenates x and y", function() {
        equal(point.toString(), "10 20");
    });

    test("toString rounds x and y", function() {
        point.x = 10.1;
        point.y = 20.1;

        equal(point.toString(0), "10 20");
    });

    test("toString rounds x and y to precision", function() {
        point.x = 10.567;
        point.y = 20.567;

        equal(point.toString(1), "10.6 20.6");
    });

    test("Point.min returns a new point with minimum x y", function() {
        var other = new Point(20, 10);
        var minPoint = Point.min(point, other);

        equal(minPoint.x, 10);
        equal(minPoint.y, 10);
    });

    test("Point.min accepts multiple arguments", function() {
        var minPoint = Point.min(Point.maxPoint(), Point.maxPoint(), point);

        equal(minPoint.x, 10);
        equal(minPoint.y, 20);
    });

    test("Point.max returns a new point with maximum x y", function() {
        var other = new Point(20, 10);
        var maxPoint = Point.max(point, other);

        equal(maxPoint.x, 20);
        equal(maxPoint.y, 20);
    });

    test("Point.max accepts multiple arguments", function() {
        var maxPoint = Point.max(Point.minPoint(), Point.minPoint(), point);

        equal(maxPoint.x, 10);
        equal(maxPoint.y, 20);
    });

    test("toArray returns an array with the values", function() {
        var result = point.toArray();
        deepEqual(result, [10, 20]);
    });

    test("toArray returns an array with the values rounded to the specified precision", function() {
        point.move(3.14, 3.45);
        var result = point.toArray(1);
        deepEqual(result, [3.1, 3.5]);
    });

    // ------------------------------------------------------------
    (function() {
        var size;

        module("Size", {
            setup: function() {
                size = new Size(10, 20);
            }
        });

        test("constructor sets width", function() {
            equal(size.width, 10);
        });

        test("constructor sets height", function() {
            equal(size.height, 20);
        });

        test("width defaults to 0", function() {
            equal(new Size().width, 0);
        });

        test("height defaults to 0", function() {
            equal(new Size().height, 0);
        });

        test("create from width, height", function() {
            ok(Size.create(10, 20).equals(new Size(10, 20)));
        });

        test("create from width, height array", function() {
            ok(Size.create([10, 20]).equals(new Size(10, 20)));
        });

        test("create from Size", function() {
            ok(Size.create(new Size(10, 20)).equals(new Size(10, 20)));
        });

        test("create from Size does not clone instance", function() {
            var loc = new Size(10, 20);
            ok(Size.create(loc) === loc);
        });

        test("create from undefined", function() {
            equal(Size.create(undefined), undefined);
        });

        test("sets width", function() {
            size.setWidth(10);
            equal(size.width, 10);
        });

        test("sets height", function() {
            size.setHeight(10);
            equal(size.height, 10);
        });

        test("set is chainable", function() {
            equal(size.setWidth(10), size);
        });

        test("gets width", function() {
            equal(size.getWidth(), 10);
        });

        test("gets height", function() {
            equal(size.getHeight(), 20);
        });

        test("toArray returns an array with the values", function() {
            var result = size.toArray();
            deepEqual(result, [10, 20]);
        });

        test("toArray returns an array with the values rounded to the specified precision", function() {
            size.width = 3.14;
            size.height = 3.45;
            var result = size.toArray(1);
            deepEqual(result, [3.1, 3.5]);
        });

        test("changing width triggers geometryChange", function() {
            size.addObserver({
                geometryChange: function() {
                    ok(true);
                }
            });

            size.setWidth(1);
        });

        test("changing height triggers geometryChange", function() {
            size.addObserver({
                geometryChange: function() {
                    ok(true);
                }
            });

            size.setHeight(1);
        });

        test("setting width to same value does not trigger geometryChange", 0, function() {
            size.addObserver({
                geometryChange: function() {
                    ok(false);
                }
            });

            size.setWidth(10);
        });

        test("setting height to same value does not trigger geometryChange", 0, function() {
            size.addObserver({
                geometryChange: function() {
                    ok(false);
                }
            });

            size.setHeight(20);
        });

        test("clone returns new Size instance", function() {
            var clone = size.clone();
            notEqual(clone, size);
            ok(clone instanceof Size);
        });

        test("clone copies width and height", function() {
            var clone = size.clone();
            equal(clone.width, size.width);
            equal(clone.height, size.height);
        });
    })();

    // ------------------------------------------------------------
    var rect;

    module("Rect", {
        setup: function() {
            rect = new Rect(new Point(0, 0), new Size(10, 20));
        }
    });

    test("constructor sets origin", function() {
        ok(rect.origin.equals(new Point(0, 0)));
    });

    test("constructor sets origin from array", function() {
        rect = new Rect([0, 0], [10, 10]);
        ok(rect.origin.equals(new Point(0, 0)));
    });

    test("constructor sets size", function() {
        ok(rect.size.equals, new Size(10, 20));
    });

    test("constructor sets size from array", function() {
        rect = new Rect(new Point(0, 0), [10, 20]);
        ok(rect.size.equals, new Size(10, 20));
    });

    test("sets origin", function() {
        var origin = new g.Point(10, 10);
        rect.setOrigin(origin);
        ok(rect.origin.equals(origin));
    });

    test("sets origin from array", function() {
        rect.setOrigin([10, 10]);
        ok(rect.origin.equals(new g.Point(10, 10)));
    });

    test("sets origin observer", function() {
        var origin = new g.Point(10, 10);
        rect.setOrigin(origin);
        equal(origin.observers()[0], rect);
    });

    test("removes existing origin observer", function() {
        var origin = new g.Point(10, 10);
        var newOrigin = new g.Point(20, 20);
        rect.setOrigin(origin);
        rect.setOrigin(newOrigin);
        equal(origin.observers().length, 0);
    });

    test("gets origin", function() {
        ok(rect.getOrigin().equals(new g.Point(0, 0)));
    });

    test("sets size", function() {
        var size = new g.Size(10, 10);
        rect.setSize(size);
        ok(rect.size.equals(size));
    });

    test("sets size from array", function() {
        rect.setSize([10, 10]);
        ok(rect.size.equals(new g.Size(10, 10)));
    });

    test("sets size observer", function() {
        var size = new g.Size(10, 10);
        rect.setSize(size);
        equal(size.observers()[0], rect);
    });

    test("removes existing size observer", function() {
        var size = new g.Size(10, 10);
        var newSize = new g.Size(20, 20);
        rect.setSize(size);
        rect.setSize(newSize);
        equal(size.observers().length, 0);
    });

    test("gets size", function() {
        ok(rect.getSize().equals(new g.Size(10, 20)));
    });

    test("returns width", function() {
        equal(rect.width(), 10);
    });

    test("returns height", function() {
        equal(rect.height(), 20);
    });

    test("center returns center", function() {
        deepEqual(rect.center(), new Point(5,10));
    });

    test("topLeft returns top left corner", function() {
        ok(rect.topLeft().equals(new Point(0, 0)));
    });

    test("bottomRight returns bottom right corner", function() {
        ok(rect.bottomRight().equals(new Point(10, 20)));
    });

    test("topRight returns top right corner", function() {
        ok(rect.topRight().equals(new Point(10, 0)));
    });

    test("bottomLeft returns bottom left corner", function() {
        ok(rect.bottomLeft().equals(new Point(0, 20)));
    });

    test("modifying origin triggers geometryChange", function() {
        rect.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        rect.origin.setX(1);
    });

    test("modifying size triggers geometryChange", function() {
        rect.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        rect.size.setWidth(1);
    });

    test("boundingBox returns the bounding Rect", function() {
        var bbox = rect.bbox();
        compareBoundingBox(rect, [0, 0, 10, 20]);
    });

    test("boundingBox returns the transformed bounding Rect", function() {
        var bbox = rect.bbox(Matrix.scale(2,1));
        compareBoundingBox(bbox, [0, 0, 20, 20]);
    });

    test("boundingBox takes all corners into account", function() {
        var bbox = rect.bbox(Matrix.rotate(45, new Point(5, 10)));
        compareBoundingBox(bbox, [-14.1421, 0, 7.0711, 21.2132], 1e-4);
    });

    test("clone returns new instance", function() {
        var clone = rect.clone();
        notEqual(clone, rect);
        ok(clone instanceof Rect);
    });

    test("clone copies origin", function() {
        var clone = rect.clone();
        notEqual(clone.origin, rect.origin);
        ok(clone.origin.equals(rect.origin));
    });

    test("clone copies size", function() {
        var clone = rect.clone();
        notEqual(clone.size, rect.size);
        ok(clone.size.equals(rect.size));
    });

    test("equals is true for same rectangle", function() {
        ok(rect.equals(rect.clone()));
    });

    test("equals is false for different origin", function() {
        var other = rect.clone();
        other.origin.move(1, 1);
        ok(!rect.equals(other));
    });

    test("equals is false for different size", function() {
        var other = rect.clone();
        other.size.setWidth(100);
        ok(!rect.equals(other));
    });

    test("equals is false for undefined rectangle", function() {
        ok(!rect.equals());
    });

    test("contains point returns true if point is inside area", function() {
        equal(rect.containsPoint(new Point(5, 5)), true);
    });

    test("contains point returns true if point is on path", function() {
        equal(rect.containsPoint(new Point(5, 0)), true);
    });

    test("contains point returns false if point is outside", function() {
        equal(rect.containsPoint(new Point(11, 5)), false);
    });

    // ------------------------------------------------------------
    (function() {
        module("Rect / Class methods");

        test("union of two rectangles", function() {
            var a = new Rect(new Point(0, 0), new Size(10, 20));
            var b = new Rect(new Point(-1, 5), new Size(16, 10));
            var union = Rect.union(a, b);

            equal(union.origin.x, -1);
            equal(union.origin.y, 0);
            equal(union.size.width, 16);
            equal(union.size.height, 20);
        });
    })();

    // ------------------------------------------------------------
    var circle;

    module("Circle", {
        setup: function() {
            circle = new Circle(new Point(0, 0), 10);
        }
    });

    test("constructor sets center", function() {
        ok(circle.center.equals(new Point(0, 0)));
    });

    test("constructor sets center from array", function() {
        circle = new Circle([0, 0], 10);
        ok(circle.center.equals(new Point(0, 0)));
    });

    test("constructor sets radius", function() {
        equal(circle.radius, 10);
    });

    test("modifying center triggers geometryChange", function() {
        circle.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        circle.center.setX(1);
    });

    test("sets center", function() {
        var center = new g.Point(10, 10);
        circle.setCenter(center);
        ok(circle.center.equals(center));
    });

    test("sets center observer", function() {
        var center = new g.Point(10, 10);
        circle.setCenter(center);
        equal(center.observers()[0], circle);
    });

    test("clears existing center observer", function() {
        var center = new g.Point(10, 10);
        circle.setCenter(center);
        circle.setCenter(new g.Point(20, 20));
        equal(center.observers().length, 0);
    });

    test("sets center from array", function() {
        circle.setCenter([10, 10]);
        ok(circle.center.equals(new g.Point(10, 10)));
    });

    test("gets center", function() {
        ok(circle.getCenter().equals(new g.Point(0, 0)));
    });

    test("sets radius", function() {
        circle.setRadius(1);
        equal(circle.radius, 1);
    });

    test("gets radius", function() {
        equal(circle.getRadius(), 10);
    });

    test("setting radius triggers geometryChange", function() {
        circle.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        circle.setRadius(1);
    });

    test("setting radius to same value does not trigger geometryChange", 0, function() {
        circle.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });

        circle.setRadius(10);
    });

    test("equals is true for same center and radius", function() {
        ok(new Circle(new Point(0, 0), 10).equals(circle));
    });

    test("equals is false for different centers", function() {
        ok(!new Circle(new Point(1, 1), 10).equals(circle));
    });

    test("equals is false for different radius", function() {
        ok(!new Circle(new Point(0, 0), 1).equals(circle));
    });

    test("equals is false for undefined circle", function() {
        ok(!new Circle(new Point(1, 1), 10).equals());
    });

    test("clone returns new instance", function() {
        var clone = circle.clone();
        notEqual(clone, circle);
        ok(clone instanceof Circle);
    });

    test("clone returns new center instance", function() {
        var clone = circle.clone();
        notEqual(clone.center, circle.center);
    });

    test("clone copies center", function() {
        var clone = circle.clone();
        ok(clone.center.equals(clone.center));
    });

    test("clone copies radius", function() {
        var clone = circle.clone();
        equal(clone.radius, circle.radius);
    });

    test("boundingBox returns the circle bounding Rect", function() {
        var rect = circle.bbox();
        compareBoundingBox(rect, [-10,-10,10,10]);
    });

    test("boundingBox returns the transformed circle bounding Rect", function() {
        var rect = circle.bbox(Matrix.scale(2,1));
        compareBoundingBox(rect, [-20,-10,20,10]);
    });

    // ------------------------------------------------------------
    var arc,
        ARC_POINT_TOLERANCE = 0.1;

    module("Arc", {
        setup: function() {
            arc = new Arc(new Point(100, 100), {
                startAngle: 0,
                endAngle: 180,
                radiusX: 50,
                radiusY: 100
            });
        }
    });

    test("constructor sets center", function() {
        ok(arc.center.equals(new Point(100, 100)));
        ok(arc.center.observers()[0] === arc);
    });

    test("constructor inits center if not passed", function() {
        arc = new Arc();
        ok(arc.center instanceof Point);
    });

    test("constructor sets center from array", function() {
        arc = new Arc([0, 0], 10);
        ok(arc.center.equals(new Point(0, 0)));
    });

    test("constructor sets options", function() {
        equal(arc.radiusX, 50);
        equal(arc.radiusY, 100);
        equal(arc.startAngle, 0);
        equal(arc.endAngle, 180);
    });

    test("anticlockwise is false by default", function() {
        equal(arc.anticlockwise, false);
    });

    test("modifying center triggers geometryChange", function() {
        arc.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        arc.center.setX(1);
    });

    test("sets fields", function() {
        arc.setRadiusX(10);
        arc.setRadiusY(20);
        arc.setStartAngle(30);
        arc.setEndAngle(40);
        arc.setAnticlockwise(true);

        equal(arc.radiusX, 10);
        equal(arc.radiusY, 20);
        equal(arc.startAngle, 30);
        equal(arc.endAngle, 40);
        equal(arc.anticlockwise, true);
    });

    test("setting a field triggers geometryChange", function() {
        arc.addObserver({
            geometryChange: function() {
                ok(true);
            }
        });

        arc.setRadiusX(10);
    });

    test("setting a field to the same value does not trigger geometryChange", 0, function() {
        arc.addObserver({
            geometryChange: function() {
                ok(false);
            }
        });

        arc.setRadiusX(50);
    });

    test("gets fields", function() {
        equal(arc.getRadiusX(), 50);
        equal(arc.getRadiusY(), 100);
        equal(arc.getStartAngle(), 0);
        equal(arc.getEndAngle(), 180);
        equal(arc.getAnticlockwise(), false);
    });

    test("sets center", function() {
        var center = new g.Point(10, 10);
        arc.setCenter(center);
        ok(arc.center.equals(center));
    });

    test("sets center observer", function() {
        var center = new g.Point(10, 10);
        arc.setCenter(center);
        equal(center.observers()[0], arc);
    });

    test("clears existing center observer", function() {
        var center = new g.Point(10, 10);
        arc.setCenter(center);
        arc.setCenter(new g.Point(10, 10));
       equal(center.observers().length, 0);
    });

    test("sets center from array", function() {
        arc.setCenter([10, 10]);
        ok(arc.center.equals(new g.Point(10, 10)));
    });

    test("gets center", function() {
        ok(arc.getCenter().equals(new g.Point(100, 100)));
    });

    test("pointAt returns the point on the elipse for a given angle", function() {
        var point1 = arc.pointAt(0),
            point2 = arc.pointAt(180),
            point3 = arc.pointAt(360);

        close(point1.x, 150, ARC_POINT_TOLERANCE);
        close(point1.y, 100, ARC_POINT_TOLERANCE);
        close(point2.x, 50, ARC_POINT_TOLERANCE);
        close(point2.y, 100, ARC_POINT_TOLERANCE);
        close(point3.x, 150, ARC_POINT_TOLERANCE);
        close(point3.y, 100, ARC_POINT_TOLERANCE);
    });

    test("boundingBox returns the arc bounding Rect", function() {
        var rect = arc.bbox();
        compareBoundingBox(rect, [50,100,150,200]);
    });

    test("boundingBox returns the transformed arc bounding Rect", function() {
        var rect = arc.bbox(Matrix.scale(2,1));
        compareBoundingBox(rect, [100,100,300,200]);
    });

    test("curvePoints returns points for a curve that approximate the arc", function() {
        var points = arc.curvePoints(),
        expected = [[150, 100], [150, 126.18], [144.61, 152.2], [135.36, 170.71], [126.1, 189.22], [113.09, 200],
                    [100, 200], [86.91, 200], [73.9, 189.22], [64.64, 170.71], [55.39, 152.2], [50, 126.18], [50, 100]];

        equal(points.length, expected.length);

        for (var i = 0; i < points.length; i++) {
            arrayClose(points[i].toArray(), expected[i], ARC_POINT_TOLERANCE);
        }
    });

    test("Arc.fromPoints returns Arc", function() {
        var arc = Arc.fromPoints(new Point(400, 300), new Point(250, 256.7), 100, 50, true, true);
        close(arc.center.x, 300, 0.1);
        close(arc.center.y, 300, 0.1);
        equal(arc.getRadiusX(), 100);
        equal(arc.getRadiusY(), 50);
        equal(arc.getStartAngle(), 0);
        equal(arc.getEndAngle(), -120);
        equal(arc.getAnticlockwise(), false);
    });

    // ------------------------------------------------------------
    (function() {
        var matrix,
            result;

        function initMatrix(a,b,c,d,e,f) {
            return {a: a, b: b, c: c, d: d, e: e, f: f};
        }

        module("Matrix", {
              setup: function() {
                  matrix = Matrix.unit();
              }
        });

        test("sets passed parameters", function() {
            matrix = new Matrix(2,2,2,2,2,2);
            compareMatrices(matrix, initMatrix(2,2,2,2,2,2));
        });

        test("sets undefined values to zero", function() {
            matrix = new Matrix(undefined,2,2,undefined,2,2);
            compareMatrices(matrix, initMatrix(0,2,2,0,2,2));
        });

        test("multiplyCopy multiplies matrix", function() {
            matrix = new Matrix(2,2,2,2,2,2);
            compareMatrices(matrix.multiplyCopy(new Matrix(3,3,3,3,3,3)), initMatrix(12,12,12,12,14,14));
        });

        test("multiplyCopy returns a new matrix", function() {
            matrix = new Matrix(2,2,2,2,2,2);
            result = matrix.multiplyCopy(new Matrix(3,3,3,3,3,3));
            ok(result !== matrix);
            ok(result instanceof Matrix);
        });

        test("clone returns a new matrix with the same values", function() {
            matrix = new Matrix(2,2,2,2,2,2);
            result = matrix.clone();
            compareMatrices(result, initMatrix(2,2,2,2,2,2));
        });

        test("equals is falsy for null", function() {
            ok(!matrix.equals(null));
        });

        test("equals is falsy for undefined", function() {
            ok(!matrix.equals(null));
        });

        test("equals is true for same matrix", function() {
            matrix = new Matrix(1, 2, 3, 4, 5, 6);

            ok(matrix.equals(matrix.clone()));
        });

        test("equals is false for different matrix", function() {
            matrix = new Matrix(1, 2, 3, 4, 5, 6);
            ok(!matrix.equals(new Matrix(1, 2, 3, 4, 5, 0)));
        });

        test("unit returns the identity matrix", function() {
            matrix = Matrix.unit();
            compareMatrices(matrix, initMatrix(1,0,0,1,0,0));
        });

        test("Matrix.IDENTITY is equal to the unit matrix", function() {
            compareMatrices(Matrix.IDENTITY, Matrix.unit());
        });

        test("translate returns the identity matrix translated with x y", function() {
            matrix = Matrix.translate(10, 20);
            compareMatrices(matrix, initMatrix(1,0,0,1,10,20));
        });

        test("rotate returns the rotated matrix for the specified angle", function() {
            matrix = Matrix.rotate(45);
            compareMatrices(matrix, initMatrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,0,0), 0.000001);
        });

        test("rotate returns the rotated around point matrix for the specified angle, x and y values", function() {
            matrix = Matrix.rotate(45, 100, 100);

            compareMatrices(matrix, initMatrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,
                0.7071067811865476, 100,-41.421356237309496), 0.000001);
        });

        test("scale returns the identity matrix scaled by x y", function() {
            matrix = Matrix.scale(1.5, 1.1);
            compareMatrices(matrix, initMatrix(1.5,0,0,1.1,0,0));
        });

        test("round rounds members to specified precision", function() {
            ok(new Matrix(1.555, 2.555, 3.555, 4.555, 5.555, 6.555).round(2).equals(
               new Matrix(1.56, 2.56, 3.56, 4.56, 5.56, 6.56)));
        });

        // ------------------------------------------------------------
        module("Matrix / toArray", {
            setup: function() {
                matrix = new Matrix(1.2345678,0,0,1.2345, 2, 3);
            }
        });

        test("returns an array with the values", function() {
            result = matrix.toArray();
            deepEqual(result, [1.2345678,0,0,1.2345,2,3]);
        });

        test("returns an array with the values rounded to the specified precision", function() {
            result = matrix.toArray(3);
            deepEqual(result, [1.235,0,0,1.235,2,3]);
        });

        // ------------------------------------------------------------
        module("Matrix / toString", {
            setup: function() {
                matrix = new Matrix(1.2345678,0,0,1.2345, 2, 3);
            }
        });

        test("returns a string with the values separated by comma", function() {
            result = matrix.toString();
            equal(result, "1.2345678,0,0,1.2345,2,3");
        });

        test("returns a string with the values separated by the specified separator", function() {
            result = matrix.toString(undefined, ";");
            equal(result, "1.2345678;0;0;1.2345;2;3");
        });

        test("returns a string with the values rounded to the specified precision", function() {
            result = matrix.toString(3);
            equal(result, "1.235,0,0,1.235,2,3");
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var transform = g.transform,
            transformation,
            matrix = Matrix.rotate(30),
            IDENTITY = new Matrix(1, 0, 0, 1, 0, 0);

        // ------------------------------------------------------------
        module("Transformation");

        test("sets passed matrix", function() {
            transformation = new Transformation(matrix);
            deepEqual(transformation._matrix, matrix);
        });

        test("sets identity matrix if no matrix is passed", function() {
            transformation = new Transformation();
            deepEqual(transformation._matrix, IDENTITY);
        });

        test("matrix returns current matrix", function() {
            transformation = new Transformation(matrix);
            deepEqual(transformation.matrix(), matrix);
        });

        test("matrix sets current matrix", function() {
            var newMatrix = Matrix.scale(1.5);
            transformation = new Transformation(matrix);
            transformation.matrix(newMatrix);
            deepEqual(transformation.matrix(), newMatrix);
        });

        test("matrix returns transformation if new matrix is set", function() {
            var newMatrix = Matrix.scale(1.5);
            transformation = new Transformation(matrix);
            ok(transformation === transformation.matrix(newMatrix));
        });

        test("matrix triggers optionsChange", 1, function() {
            var newMatrix = Matrix.scale(1.5);
            transformation = new Transformation(matrix);
            transformation.addObserver({
                optionsChange: function(e) {
                    equal(e.field, "transform");
                }
            });

            transformation.matrix(newMatrix);
        });

        test("clone returns new instance", function() {
            var clone = transformation.clone();
            notEqual(clone, transformation);
            ok(clone instanceof Transformation);
        });

        test("clone copies matrix", function() {
            var clone = transformation.clone();
            notEqual(clone._matrix, transformation._matrix);
            ok(clone._matrix.equals(transformation._matrix));
        });

        test("equals is true for same transformation", function() {
            ok(transformation.equals(transformation.clone()));
        });

        test("equals is false for different matrix", function() {
            var other = transformation.clone();
            other._matrix.a = 5;
            ok(!transformation.equals(other));
        });

        test("equals is false for undefined transformation", function() {
            ok(!transformation.equals());
        });

        // ------------------------------------------------------------
        module("Transformation / transform");

        test("transform returns a new Transformation", function() {
            transformation = transform();
            ok(transformation instanceof Transformation);
        });

        test("transform returns same Transformation", function() {
            transformation = new Transformation();
            equal(transform(transformation), transformation);
        });

        test("transform returns emptry transform", function() {
            ok(transform().matrix().equals(Matrix.IDENTITY));
        });

        test("transform passes null through", function() {
            equal(transform(null), null);
        });

        test("transform returns new Transformation with the specified matrix set", function() {
            transformation = transform(matrix);
            deepEqual(transformation.matrix(), matrix);
        });

        // ------------------------------------------------------------
        module("Transformation / operations", {
            setup: function() {
                transformation = new Transformation();
            }
        });

        test("translate returns transformation", function() {
            result = transformation.translate(10, 20);
            ok(result === transformation);
        });

        test("translate applies translate to matrix", function() {
            transformation.translate(10, 20);
            deepEqual(transformation.matrix(), Matrix.translate(10, 20));
        });

        test("translate triggers observer optionsChange", function() {
            transformation = new Transformation();
            transformation.addObserver({
                optionsChange: function(e) {
                    equal(e.field, "transform");
                    equal(e.value, transformation);
                }
            });
            transformation.translate(10, 20);
        });

        test("scale returns transformation", function() {
            result = transformation.scale(1, 2);
            ok(result === transformation);
        });

        test("scale applies scale to matrix", function() {
            transformation.scale(1, 2);
            deepEqual(transformation.matrix(), Matrix.scale(1, 2));
        });

        test("scale accepts [x, y] as origin", function() {
            transformation.scale(1, 2, [10, 20]);
            deepEqual(transformation.matrix(),
                      Matrix.translate(10, 20).
                          multiplyCopy(Matrix.scale(1, 2)).
                          multiplyCopy(Matrix.translate(-10, -20))
            );
        });

        test("scale accepts Point as origin", function() {
            transformation.scale(1, 2, new Point(10, 20));
            deepEqual(transformation.matrix(),
                      Matrix.translate(10, 20).
                          multiplyCopy(Matrix.scale(1, 2)).
                          multiplyCopy(Matrix.translate(-10, -20))
            );
        });

        test("scale applies scale to both x and y if only one parameter is passed", function() {
            transformation.scale(2);
            deepEqual(transformation.matrix(), Matrix.scale(2, 2));
        });

        test("scale triggers observer optionsChange", function() {
            transformation = new Transformation();
            transformation.addObserver({
                optionsChange: function(e) {
                    equal(e.field, "transform");
                    equal(e.value, transformation);
                }
            });
            transformation.scale(1, 2);
        });

        test("rotate returns transformation", function() {
            result = transformation.rotate(30);
            ok(result === transformation);
        });

        test("rotate applies rotation to matrix", function() {
            transformation.rotate(30);
            deepEqual(transformation.matrix(), Matrix.rotate(30));
        });

        test("rotate accepts [x, y] array as center", function() {
            transformation.rotate(30, [100, 100]);
            deepEqual(transformation.matrix(), Matrix.rotate(30, 100, 100));
        });

        test("rotate accepts Point as center", function() {
            transformation.rotate(30, new Point(100, 100));
            deepEqual(transformation.matrix(), Matrix.rotate(30, 100, 100));
        });

        test("rotate triggers observer optionsChange", function() {
            transformation = new Transformation();
            transformation.addObserver({
                optionsChange: function(e) {
                    equal(e.field, "transform");
                    equal(e.value, transformation);
                }
            });
            transformation.rotate(30);
        });

        test("multiply multiplies matrix by the passed transformation matrix", function() {
            transformation = new Transformation(new Matrix(2,2,2,2,2,2));
            transformation.multiply(new Transformation(new Matrix(3,3,3,3,3,3)));
            deepEqual(transformation.matrix(), new Matrix(12,12,12,12,14,14));
        });

        test("multiply multiplies matrix by the passed matrix", function() {
            transformation = new Transformation(new Matrix(2,2,2,2,2,2));
            transformation.multiply(new Matrix(3,3,3,3,3,3));
            deepEqual(transformation.matrix(), new Matrix(12,12,12,12,14,14));
        });


        test("multiply triggers observer optionsChange", function() {
            transformation = new Transformation();
            transformation.addObserver({
                optionsChange: function(e) {
                    equal(e.field, "transform");
                    equal(e.value, transformation);
                }
            });
            transformation.multiply(new Matrix(3,3,3,3,3,3));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        module("Namespaces");

        test("kendo.geometry is aliased as kendo.dataviz.geometry", function() {
            deepEqual(kendo.geometry, kendo.dataviz.geometry);
        });
    })();

})();
