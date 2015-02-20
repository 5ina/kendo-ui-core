(function() {
    var dataviz = kendo.dataviz,
        getSpacing = dataviz.getSpacing,
        indexOf = dataviz.indexOf,
        sortDates = dataviz.sortDates,
        transpose = dataviz.transpose,
        uniqueDates = dataviz.uniqueDates,
        Chart = dataviz.ui.Chart,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D,
        box,
        targetBox;

    // ------------------------------------------------------------
    module("Box2D", {
        setup: function() {
            box = new Box2D(0, 0, 20, 20);
            targetBox = new Box2D(10, 10, 40, 40);
        }
    });

    test("clone returns new instance", function() {
        notEqual(box.clone(), box);
    });

    test("clone copies coordinates", function() {
        var clone = box.clone();

        deepEqual([clone.x1, clone.y1, clone.x2, clone.y2],
             [box.x1, box.y1, box.x2, box.y2]);
    });

    test("getHash returns hash code", function() {
        equal(box.getHash(), "0,0,20,20");
    });

    test("translate on x-axis", function() {
        var clone = box.clone().translate(10, 0);

        deepEqual([clone.x1, clone.y1, clone.x2, clone.y2],
             [box.x1 + 10, box.y1, box.x2 + 10, box.y2]);
    });

    test("translate y-axis", function() {
        var clone = box.clone().translate(0, 10);

        deepEqual([clone.x1, clone.y1, clone.x2, clone.y2],
             [box.x1, box.y1 + 10, box.x2, box.y2 + 10]);
    });

    test("translate returns box instance", function() {
        equal(box.translate(0, 0), box);
    });

    test("wrap increases box size to fit target box", function() {
        box.wrap(targetBox);
        deepEqual([box.x1, box.y1, box.x2, box.y2], [0, 0, 40, 40]);
    });

    test("wrap returns box instance", function() {
        equal(box.wrap(targetBox), box);
    });

    test("wrapPoint increases box size to fit point", function() {
        box.wrapPoint(new Point2D(40, 40));
        deepEqual([box.x1, box.y1, box.x2, box.y2], [0, 0, 40, 40]);
    });

    test("wrapPoint returns box instance", function() {
        equal(box.wrapPoint(new Point2D(40, 40)), box);
    });

    test("snapTo moves box to target location", function() {
        box.snapTo(targetBox);

        deepEqual([box.x1, box.y1], [targetBox.x1, targetBox.y1]);
    });

    test("snapTo updates dimensions to match target", function() {
        box.snapTo(targetBox);

        deepEqual([box.width(), box.height()], [targetBox.width(), targetBox.height()]);
    });

    test("snapTo on x-axis updates only x coordinates", function() {
        var clone = box.clone().snapTo(targetBox, "x");

        deepEqual([clone.x1, clone.y1, clone.x2, clone.y2],
             [targetBox.x1, box.y1, targetBox.x2, box.y2]);
    });

    test("snapTo on y-axis updates only y coordinates", function() {
        var clone = box.clone().snapTo(targetBox, "y");

        deepEqual([clone.x1, clone.y1, clone.x2, clone.y2],
             [box.x1, targetBox.y1, box.x2, targetBox.y2]);
    });

    test("snapTo returns box instance", function() {
        equal(box.snapTo(targetBox), box);
    });

    test("alignTo 'top' aligns box to target top", function() {
        box.alignTo(targetBox, "top");
        equal(box.y2, targetBox.y1);
    });

    test("alignTo 'top' keeps height", function() {
        var clone = box.clone().alignTo(targetBox, "top");
        equal(clone.height(), box.height());
    });

    test("alignTo 'bottom' aligns box to target bottom", function() {
        box.alignTo(targetBox, "bottom");
        equal(box.y1, targetBox.y2);
    });

    test("alignTo 'bottom' keeps height", function() {
        var clone = box.clone().alignTo(targetBox, "bottom");
        equal(clone.height(), box.height());
    });

    test("alignTo 'right' aligns box to target right edge", function() {
        box.alignTo(targetBox, "right");
        equal(box.x1, targetBox.x2);
    });

    test("alignTo 'right' keeps width", function() {
        var clone = box.clone().alignTo(targetBox, "right");
        equal(clone.height(), box.height());
    });

    test("alignTo 'left' aligns box to target left edge", function() {
        box.alignTo(targetBox, "left");
        equal(box.x2, targetBox.x1);
    });

    test("alignTo 'left' keeps width", function() {
        var clone = box.clone().alignTo(targetBox, "left");
        equal(clone.height(), box.height());
    });

    test("alignTo returns box instance", function() {
        equal(box.alignTo(targetBox, "bottom"), box);
    });

    test("shrink reduces width", function() {
        var clone = box.clone().shrink(10, 0);
        equal(clone.width(), box.width() - 10);
    });

    test("shrink reduces height", function() {
        var clone = box.clone().shrink(0, 10);
        equal(clone.height(), box.height() - 10);
    });

    test("shrink returns box instance", function() {
        equal(box.shrink(0, 0), box);
    });

    test("expand increases width", function() {
        var clone = box.clone().expand(10, 0);
        equal(clone.width(), box.width() + 10);
    });

    test("expand increases height", function() {
        var clone = box.clone().expand(0, 10);
        equal(clone.height(), box.height() + 10);
    });

    test("expand returns box instance", function() {
        equal(box.expand(0, 0), box);
    });

    test("move changes x", function() {
        var clone = box.clone().move(10, 0);
        equal(clone.x1, box.x1 + 10);
    });

    test("move changes y", function() {
        var clone = box.clone().move(0, 10);
        equal(clone.y1, box.y1 + 10);
    });

    test("move maintains width", function() {
        var clone = box.clone().move(10, 0);
        equal(clone.width(), box.width());
    });

    test("move maintains height", function() {
        var clone = box.clone().move(0, 10);
        equal(clone.height(), box.height());
    });

    test("move returns box instance", function() {
        equal(box.move(0, 0), box);
    });

    test("pad adds top padding", function() {
        var clone = box.clone().pad(10);
        equal(clone.y1, box.y1 - 10);
    });

    test("pad adds right padding", function() {
        var clone = box.clone().pad(10);
        equal(clone.x2, box.x2 + 10);
    });

    test("pad adds bottom padding", function() {
        var clone = box.clone().pad(10);
        equal(clone.y2, box.y2 + 10);
    });

    test("pad adds left padding", function() {
        var clone = box.clone().pad(10);
        equal(clone.x1, box.x1 - 10);
    });

    test("pad returns box instance", function() {
        equal(box.pad(0), box);
    });

    test("unpad adds top padding", function() {
        var clone = box.clone().unpad(10);
        equal(clone.y1, box.y1 + 10);
    });

    test("unpad adds right padding", function() {
        var clone = box.clone().unpad(10);
        equal(clone.x2, box.x2 - 10);
    });

    test("unpad adds bottom padding", function() {
        var clone = box.clone().unpad(10);
        equal(clone.y2, box.y2 - 10);
    });

    test("unpad adds left padding", function() {
        var clone = box.clone().unpad(10);
        equal(clone.x1, box.x1 + 10);
    });

    test("unpad returns box instance", function() {
        equal(box.unpad(0), box);
    });

    test("containsPoint returns true for points within box", function() {
        ok(box.containsPoint(new Point2D(5, 5)));
    });

    test("containsPoint returns false for points outside box", function() {
        ok(box.containsPoint(new Point2D(5, 5)));
    });

    test("center returns x center", function() {
        equal(box.center().x, 10);
    });

    test("center returns y center", function() {
        equal(box.center().y, 10);
    });

    test("points returns box points", function() {
        deepEqual($.map(box.points(), function(point) {
            return [[point.x, point.y]];
        }), [
            [0, 0], [20, 0], [20, 20], [0, 20]
        ]);
    });

    test("rotate rotates box", function() {
        box = Box2D(10, 10, 30, 40).rotate(45);
        equal(box.x1, 10);
        equal(box.y1, 10);
        close(box.x2, 45.4, 0.1);
        close(box.y2, 45.4, 0.1);
    });

    test("hasSize returns true if box has non zero width and height", function() {
        box = Box2D(10, 10, 30, 40);
        equal(box.hasSize(), true);
    });

    test("hasSize returns false if box has zero width and height", function() {
        box = Box2D(10, 10, 10, 10);
        equal(box.hasSize(), false);
    });

    // ------------------------------------------------------------
    var point;

    module("Point2D", {
        setup: function() {
            point = new Point2D(10, 20);
        }
    });

    test("constructor sets x", function() {
        equal(point.x, 10);
    });

    test("constructor sets y", function() {
        equal(point.y, 20);
    });

    test("x defaults to 0", function() {
        equal(new Point2D().x, 0);
    });

    test("y defaults to 0", function() {
        equal(new Point2D().y, 0);
    });

    test("clone returns new point instance", function() {
        var clone = point.clone();
        notEqual(clone, point);
        ok(clone instanceof Point2D);
    });

    test("clone copies x and y", function() {
        var clone = point.clone();
        equal(clone.x, point.x);
        equal(clone.y, point.y);
    });

    test("rotate rotates x and y around center", function() {
        point.rotate(new Point2D(0, 0), 90);
        equal(point.x, 20, 1);
        equal(point.y, -10, 1);
    });

    test("rotate returns point", function() {
        deepEqual(point.rotate(new Point2D(0, 0), 90), point);
    });

    test("equals is true for same coordinates", function() {
        ok(new Point2D(1, 1).equals(new Point2D(1, 1)));
    });

    test("equals is false for different x coordinates", function() {
        ok(!new Point2D(1, 1).equals(new Point2D(2, 1)));
    });

    test("equals is false for different y coordinates", function() {
        ok(!new Point2D(1, 1).equals(new Point2D(1, 2)));
    });

    test("equals is false for undefined point", function() {
        ok(!new Point2D(1, 1).equals());
    });

    test("distanceTo calculates distance", function() {
        equal(new Point2D(1, 1).distanceTo(new Point2D(2, 2)), Math.sqrt(2));
    });

    test("multiply applies to x and y", function() {
        deepEqual(point.multiply(2), new Point2D(20, 40));
    });

    test("multiply returns point", function() {
        deepEqual(point.multiply(2), point);
    });

    (function() {
        var sector;

        module("Sector", {
            setup: function() {
                sector = new dataviz.Sector(new Point2D(10, 20), 30, 90, 180);
            }
        });

        test("constructor sets center", function() {
            deepEqual([sector.c.x, sector.c.y], [10, 20]);
        });

        test("constructor sets radius", function() {
            equal(sector.r, 30);
        });

        test("constructor sets start angle", function() {
            equal(sector.startAngle, 90);
        });

        test("constructor sets angle", function() {
            equal(sector.angle, 180);
        });

        test("clone returns new sector instance", function() {
            notEqual(sector.clone(), sector);
            ok(sector instanceof dataviz.Sector);
        });

        test("expand returns same instance", function() {
            equal(sector.expand(100), sector);
        });

        test("expand increases radius", function() {
            equal(sector.expand(100).r, 130);
        });

        test("point returns intersection point for angle", function() {
            var point = sector.point(180);
            arrayClose([point.x, point.y], [40, 20], 1e-6)
        });
    })();

    (function() {
        var ring,
            point;

        module("Ring", {
            setup: function() {
                ring = new dataviz.Ring(new Point2D(100, 200), 20, 30, 90, 180);
            }
        });

        test("constructor sets center", function() {
            deepEqual([ring.c.x, ring.c.y], [100, 200]);
        });

        test("constructor sets radii", function() {
            equal(ring.ir, 20);
            equal(ring.r, 30);
        });

        test("constructor sets start angle", function() {
            equal(ring.startAngle, 90);
        });

        test("constructor sets angle", function() {
            equal(ring.angle, 180);
        });

        test("clone returns new ring instance", function() {
            notEqual(ring.clone(), ring);
        });

        test("middle returns middle angle", function() {
            equal(ring.middle(), 180);
        });

        test("point returns intersection point for angle", function() {
            var point = ring.point(180);
            deepEqual([point.x, point.y], [130, 200])
        });

        test("calculates inner point correctly", function() {
            var innerPoint = ring.point(90, true);

            equal(innerPoint.x, 100);
            equal(innerPoint.y, 180);
        });

        // ------------------------------------------------------------
        var outerRing;

        module("Ring / containsPoint", {
            setup: function() {
                ring = new dataviz.Ring(new Point2D(100, 200), 20, 30, 90, 180);
                outerRing = new dataviz.Ring(new Point2D(100, 200), 19, 31, 89, 181);
            }
        });

        test("containsPoint for inner start point", function() {
            point = ring.point(90.01, true);
            ok(ring.containsPoint(point));
        });

        test("containsPoint for inner mid-point", function() {
            point = ring.point(ring.middle(), true);
            ok(ring.containsPoint(point));
        });

        test("containsPoint for inner end point", function() {
            point = ring.point(180, true);
            ok(ring.containsPoint(point));
        });

        test("containsPoint for outer start point", function() {
            point = ring.point(90);
            ok(ring.containsPoint(point));
        });

        test("containsPoint for outer mid-point", function() {
            point = ring.point(ring.middle());
            ok(ring.containsPoint(point));
        });

        test("containsPoint for inner end point", function() {
            point = ring.point(180);
            ok(ring.containsPoint(point));
        });

        test("containsPoint for point next to inner start point", function() {
            point = outerRing.point(outerRing.startAngle, true);
            ok(!ring.containsPoint(point));
        });

        test("containsPoint for point next to inner mid-point", function() {
            point = outerRing.point(outerRing.middle(), true);
            ok(!ring.containsPoint(point));
        });

        test("containsPoint for point next to inner end point", function() {
            point = outerRing.point(outerRing.startAngle + outerRing.angle, true);
            ok(!ring.containsPoint(point));
        });

        test("containsPoint for point next to outer start point", function() {
            point = outerRing.point(outerRing.startAngle);
            ok(!ring.containsPoint(point));
        });

        test("containsPoint for point next to outer mid-point", function() {
            point = outerRing.point(outerRing.middle());
            ok(!ring.containsPoint(point));
        });

        test("containsPoint for point next to inner end point", function() {
            point = outerRing.point(outerRing.startAngle + outerRing.angle);
            ok(!ring.containsPoint(point));
        });
    })();

    // ------------------------------------------------------------
    var floorDate = dataviz.floorDate,
        ceilDate = dataviz.ceilDate,
        date;

    module("Date helpers / floorDate", {
        setup: function() {
            date = new Date("2012/03/29 17:40:10");
            date.setMilliseconds(100);
        }
    });

    test("floorDate rounds date down to years", function() {
        deepEqual(floorDate(date, "years"), new Date("2012/01/01 00:00"));
    });

    test("floorDate rounds date down to months", function() {
        deepEqual(floorDate(date, "months"), new Date("2012/03/01 00:00"));
    });

    test("floorDate rounds date down to weeks", function() {
        deepEqual(floorDate(date, "weeks"), new Date("2012/03/25 00:00"));
    });

    test("floorDate rounds date down to weeks with custom week start", function() {
        deepEqual(floorDate(date, "weeks", kendo.days.Monday), new Date("2012/03/26 00:00"));
    });

    test("floorDate rounds date down to days", function() {
        deepEqual(floorDate(date, "days"), new Date("2012/03/29 00:00"));
    });

    test("floorDate rounds date down to hours", function() {
        deepEqual(floorDate(date, "hours"), new Date("2012/03/29 17:00"));
    });

    test("floorDate rounds date down to minutes", function() {
        deepEqual(floorDate(date, "minutes"), new Date("2012/03/29 17:40"));
    });

    test("floorDate rounds date down to seconds", function() {
        deepEqual(floorDate(date, "seconds"), new Date("2012/03/29 17:40:10"));
    });

    test("floorDate returns undefined when no date is specified", function() {
        equal(floorDate(), undefined);
    });

    test("floorDate returns date when no unit is specified", function() {
        deepEqual(floorDate(date), date);
    });

    // ------------------------------------------------------------
    module("Date helpers / ceilDate", {
        setup: function() {
            date = new Date("2012/03/29 17:40:10");
            date.setMilliseconds(100);
        }
    });

    test("ceilDate rounds date up to years", function() {
        deepEqual(ceilDate(date, "years"), new Date("2013/01/01 00:00"));
    });

    test("ceilDate does not increment year for dates divisable by the baseUnit", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "years"),
            new Date("2013/01/01 00:00")
        );
    });

    test("ceilDate rounds date up to months", function() {
        deepEqual(ceilDate(date, "months"), new Date("2012/04/01 00:00"));
    });

    test("ceilDate does not increment month for dates divisable by the baseUnit", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "months"),
            new Date("2013/01/01 00:00")
        );
    });

    test("ceilDate rounds date up to weeks", function() {
        deepEqual(ceilDate(date, "weeks"), new Date("2012/04/01 00:00"));
    });

    test("ceilDate rounds date up to weeks with custom week start day", function() {
        deepEqual(ceilDate(date, "weeks", kendo.days.Monday), new Date("2012/04/02 00:00"));
    });

    test("ceilDate does not increment weeks for dates divisable by the baseUnit", function() {
        deepEqual(
            ceilDate(new Date("2012/03/25 00:00"), "weeks"),
            new Date("2012/03/25 00:00")
        );
    });

    test("ceilDate rounds date up to days", function() {
        deepEqual(ceilDate(date, "days"), new Date("2012/03/30 00:00"));
    });

    test("ceilDate does not increment day for dates divisable by the baseUnit", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "days"),
            new Date("2013/01/01 00:00")
        );
    });

    test("ceilDate rounds date up to hours", function() {
        deepEqual(ceilDate(date, "hours"), new Date("2012/03/29 18:00"));
    });

    test("ceilDate does not increment hour for dates divisable by the baseUnit", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "hours"),
            new Date("2013/01/01 00:00")
        );
    });

    test("ceilDate rounds date up to minutes", function() {
        deepEqual(ceilDate(date, "minutes"), new Date("2012/03/29 17:41"));
    });

    test("ceilDate rounds date up to seconds", function() {
        deepEqual(ceilDate(date, "seconds"), new Date("2012/03/29 17:40:11"));
    });

    test("ceilDate does not increment minutes for exact minutes", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "minutes"),
            new Date("2013/01/01 00:00")
        );
    });

    test("ceilDate does not increment seconds for exact seconds", function() {
        deepEqual(
            ceilDate(new Date("2013/01/01 00:00"), "seconds"),
            new Date("2013/01/01 00:00:00")
        );
    });

    test("ceilDate returns undefined when no date is specified", function() {
        equal(ceilDate(), undefined);
    });

    test("ceilDate returns date when no unit is specified", function() {
        deepEqual(ceilDate(date), date);
    });

    // ------------------------------------------------------------
    var duration = dataviz.duration,
        dateA = new Date("2010/01/01 10:00"),
        dateB = new Date("2011/03/01 15:00");

    module("Date helpers / duration");

    test("calculates duration in years", function() {
        equal(duration(dateA, dateB, "years"), 1);
    });

    test("calculates duration in months", function() {
        equal(duration(dateA, dateB, "months"), 14);
    });

    test("calculates duration in days", function() {
        equal(duration(dateA, dateB, "days"), 424);
    });

    tzTest("Sofia", "calculates duration in days during DST transition", function() {
        equal(duration(
            new Date("2012/03/24 GMT+0200 (FLE Standard Time)"),
            new Date("2012/03/26 GMT+0300 (FLE Daylight Time)"),
            "days"
            ), 2
        );
    });

    tzTest("Sofia", "calculates duration in hours", function() {
        equal(duration(dateA, dateB, "hours"), 10181);
    });

    tzTest("Sofia", "calculates duration in hours during DST transition", function() {
        equal(duration(
            new Date("2012/03/25 00:00 GMT+0200 (FLE Standard Time)"),
            new Date("2012/03/25 06:00 GMT+0300 (FLE Daylight Time)"),
            "hours"
            ), 5
        );
    });

    tzTest("Sofia", "calculates duration in minutes", function() {
        equal(duration(dateA, dateB, "minutes"), 610860);
    });

    tzTest("Sofia", "calculates duration in seconds", function() {
        equal(duration(dateA, dateB, "seconds"), 610860 * 60);
    });

    // ------------------------------------------------------------
    var addDuration = dataviz.addDuration;

    module("Date helpers / addDuration");

    test("rounds date to years", function() {
        deepEqual(addDuration(dateA, 10, "years"), new Date("2020/01/01"));
    });

    test("rounds date to months", function() {
        deepEqual(addDuration(dateA, 15, "months"), new Date("2011/04/01"));
    });

    test("rounds date to default week start (Sunday)", function() {
        deepEqual(addDuration(dateA, 1, "weeks", 0), new Date("2010/01/03"));
    });

    test("rounds date to default week start (Sunday) after adding 5 weeks", function() {
        deepEqual(addDuration(dateA, 5, "weeks", 0), new Date("2010/01/31"));
    });

    test("rounds date to custom week start", function() {
        deepEqual(addDuration(dateA, 1, "weeks", 1), new Date("2010/01/04"));
    });

    test("rounds date to custom week start after adding 5 weeks", function() {
        deepEqual(addDuration(dateA, 5, "weeks", 1), new Date("2010/02/01"));
    });

    test("rounds date to days", function() {
        deepEqual(addDuration(dateA, 35, "days"), new Date("2010/02/05"));
    });

    tzTest("Sofia", "rounds to days during DST transition", function() {
        deepEqual(addDuration(
                new Date("2012/03/25 GMT+0200 (FLE Standard Time)"),
                2,
                "days"
            ), new Date("2012/03/27 GMT+0300 (FLE Daylight Time)")
        );
    });

    test("rounds date to hours", function() {
        deepEqual(addDuration(dateA, 24, "hours"), new Date("2010/01/02 10:00"));
    });

    tzTest("Sofia", "rounds to hours during DST transition", function() {
        deepEqual(addDuration(
                new Date("2012/03/25 00:00 GMT+0200 (FLE Standard Time)"),
                6,
                "hours"
            ), new Date("2012/03/25 06:00 GMT+0300 (FLE Daylight Time)")
        );
    });

    tzTest("Sofia", "Adding hours skips DST start", function() {
        deepEqual(addDuration(new Date("2012/03/25 02:00"), 1, "hours"),
             new Date("2012/03/25 04:00:00")
        );
    });

    tzTest("Sofia", "Adding minutes skips DST start", function() {
        deepEqual(addDuration(new Date("2012/03/25 02:00"), 60, "minutes"),
             new Date("2012/03/25 04:00:00")
        );
    });

    tzTest("Sofia", "Adding seconds skips DST start", function() {
        deepEqual(addDuration(new Date("2012/03/25 02:59"), 60, "seconds"),
             new Date("2012/03/25 04:00:00")
        );
    });

    tzTest("Sofia", "Adding hours skips DST end", function() {
        deepEqual(addDuration(new Date("2012/10/28 02:00"), 2, "hours"),
             new Date("2012/10/28 04:00:00")
        );
    });

    tzTest("Sofia", "Adding minutes includes duplicate DST end", function() {
        deepEqual(addDuration(new Date("2012/10/28 02:00"), 180, "minutes"),
             new Date("2012/10/28 04:00:00")
        );
    });

    tzTest("Sofia", "Adding seconds includes duplicate DST end", function() {
        deepEqual(addDuration(new Date("2012/10/28 02:00"), 180 * 60, "seconds"),
             new Date("2012/10/28 04:00:00")
        );
    });

    test("rounds date to minutes", function() {
        deepEqual(addDuration(dateA, 75.1, "minutes"), new Date("2010/01/01 11:15"));
    });

    test("rounds date to seconds", function() {
        deepEqual(addDuration(dateA, 75.1, "seconds"), new Date("2010/01/01 10:01:15"));
    });

    tzTest("Brazil", "Adding days skips DST transition", function() {
        deepEqual(addDuration(new Date("2013/10/19"), 1, "days"),
                  new Date("2013/10/20 01:00:00"));
    });

    tzTest("Brazil", "Adding weeks skips DST transition", function() {
        deepEqual(addDuration(new Date("2013/10/13"), 1, "weeks"),
                  new Date("2013/10/20 01:00:00"));
    });

    tzTest("Moscow", "Adding years skips", function() {
        deepEqual(addDuration(new Date("2002/01/10"), 1, "years"),
                  new Date("2003/01/01 00:00:00"));
    });

    // ------------------------------------------------------------
    var toDate = dataviz.toDate;

    module("Date helpers / toDate");

    test("Returns date unchanged", function() {
        var date = new Date();

        deepEqual(date, toDate(date));
    });

    test("Returns array of dates unchanged", function() {
        var dates = [new Date(), new Date()];

        deepEqual(dates, toDate(dates));
    });

    test("Returns empty array unchanged", function() {
        var dates = [];

        deepEqual(dates, toDate(dates));
    });

    test("Converts string to date", function() {
        var date = "2012/01/01 00:00";

        deepEqual(new Date(date), toDate(date));
    });

    test("Converts array of strings to dates", function() {
        var dates = ["2012/01/01 00:00", "2012/01/02 00:00"];

        deepEqual([new Date(dates[0]), new Date(dates[1])], toDate(dates));
    });

    test("Converts time to date", function() {
        var time = 1325368800000;

        deepEqual(new Date(time), toDate(time));
    });

    test("Converts array of times to dates", function() {
        var times = [1325368800000, 1325455200000];

        deepEqual([new Date(times[0]), new Date(times[1])], toDate(times));
    });

    tzTest("Sofia", "Converts MS JSON string to date", function() {
        var jsonDate = "/Date(1325368800000)/";

        deepEqual(new Date("2012/01/01 00:00"), toDate(jsonDate));
    });

    tzTest("Sofia", "Converts array of MS JSON strings to dates", function() {
        var jsonDates = ["/Date(1325368800000)/", "/Date(1325455200000)/"];

        deepEqual([new Date("2012/01/01 00:00"), new Date("2012/01/02 00:00")], toDate(jsonDates));
    });

    // ------------------------------------------------------------
    module("Date Helpers / startOfWeek");

    test("does not hang with invalid dates", function() {
        dataviz.startOfWeek(new Date("foo"));
        ok(true);
    });

    // ------------------------------------------------------------
    var autoFormat = dataviz.autoFormat;

    module("autoFormat");

    test("Applies standard format with one argument", function() {
        equal(autoFormat("{0:N2}", 1), "1.00");
    });

    test("Applies standard format with one argument", function() {
        equal(autoFormat("{0:N2} {1:N2}", 1, 2), "1.00 2.00");
    });

    test("Applies simple format", function() {
        equal(autoFormat("N2", 1), "1.00");
    });

    (function() {
        // ------------------------------------------------------------
        var Aggregates = kendo.dataviz.Aggregates;
        var values = [1, 2, 3];
        var sparseValues = [1, 2, undefined, 3];

        module("Aggregates");

        test("min", function() {
            equal(Aggregates.min(values), 1);
        });

        test("min with no values", function() {
            equal(Aggregates.min([]), undefined);
        });

        test("max", function() {
            equal(Aggregates.max(values), 3);
        });

        test("max with no values", function() {
            equal(Aggregates.max([]), undefined);
        });

        test("sum", function() {
            equal(Aggregates.sum(values), 6);
        });

        test("sum with no values", function() {
            equal(Aggregates.sum([]), 0);
        });

        test("sumOrNull", function() {
            equal(Aggregates.sumOrNull(values), 6);
        });

        test("sumOrNull with no values", function() {
            equal(Aggregates.sumOrNull([]), null);
        });

        test("avg", function() {
            equal(Aggregates.avg(values), 2);
        });

        test("avg with no values", function() {
            equal(Aggregates.avg([]), undefined);
        });

        test("count", function() {
            equal(Aggregates.count(values), 3);
        });

        test("count with no values", function() {
            equal(Aggregates.count([]), 0);
        });
    })();

    (function() {
        // ------------------------------------------------------------
        var areNumbers = kendo.dataviz.areNumbers,
            countNumbers = kendo.dataviz.countNumbers,
            isNumber = kendo.dataviz.isNumber;

        module("Misc");

        test("isNumber returns true if number is finite", function() {
            ok(isNumber(1));
        });

        test("isNumber returns false if number is null", function() {
            ok(!isNumber(null));
        });

        test("isNumber returns false if number is undefined", function() {
            ok(!isNumber(undefined));
        });

        test("isNumber returns false if number is NaN", function() {
            ok(!isNumber(NaN));
        });

        test("countNumbers counts finite numbers", function() {
            equal(countNumbers([1, 2, 3]), 3);
        });

        test("countNumbers skips nulls", function() {
            equal(countNumbers([1, 2, null]), 2);
        });

        test("countNumbers skips undefined", function() {
            equal(countNumbers([1, 2, undefined]), 2);
        });

        test("countNumbers skips NaN", function() {
            equal(countNumbers([1, 2, NaN]), 2);
        });

        test("areNumbers returns true if all numbers are finite", function() {
            ok(areNumbers([1, 2, 3]));
        });

        test("areNumbers returns false if array contains null", function() {
            ok(!areNumbers([1, 2, null]));
        });

        test("areNumbers returns false if array contains undefined", function() {
            ok(!areNumbers([1, 2, undefined]));
        });

        test("areNumbers returns false if array contains NaN", function() {
            ok(!areNumbers([1, 2, NaN]));
        });

    })();

    (function() {
        var evalOptions = dataviz.evalOptions;

        // ------------------------------------------------------------
        module("Functional options");

        test("replaces function with its result", function() {
            var opts = { foo: function() { return "bar" } };
            evalOptions(opts);

            equal(opts.foo, "bar");
        });

        test("replaces function with its result (false)", function() {
            var opts = { foo: function() { return false } };
            evalOptions(opts);

            equal(opts.foo, false);
        });

        test("executes functions with context", function() {
            var opts = { foo: function(context) { return context; } };
            evalOptions(opts, "baz");

            equal(opts.foo, "baz");
        });

        test("replaces function in nested object with its result", function() {
            var opts = { baz: { foo: function() { return "bar" } } };
            evalOptions(opts);

            equal(opts.baz.foo, "bar");
        })

        test("evals functions up to 5 levels deep", function() {
            var opts = {};

            for (var i = 0, root = opts; i < 9; i++) {
                var child = root["n" + i] = {};

                child.foo = function() { return "bar" };
                child.dummy = {};

                root = root["n" + i];
            }

            evalOptions(opts);

            equal(opts.n0.n1.n2.n3.n4.foo, "bar");
            ok($.isFunction(opts.n0.n1.n2.n3.n4.n5.foo));
        });

        test("excluded options are ignored", function() {
            var opts = { bar: function() { } };
            evalOptions(opts, {}, { excluded: ["bar"] });

            ok($.isFunction(opts.bar));
        });

        test("excluded options children are ignored", function() {
            var opts = { bar: { baz: function() { } } };
            evalOptions(opts, {}, { excluded: ["bar"] });

            ok($.isFunction(opts.bar.baz));
        });

        test("undefined result is replaced by default value", function() {
            var opts = { bar: function() {} };
            evalOptions(opts, {}, { defaults: { bar: "foo" } });

            equal(opts.bar, "foo");
        });

    })();

    // ------------------------------------------------------------
    module("Misc");

    test("getSpacing expands single value", function() {
        deepEqual(getSpacing(1), { top: 1, left: 1, right: 1, bottom: 1 });
    });

    test("getSpacing replaces missing values with 0", function() {
        deepEqual(getSpacing({ top: 1 }), { top: 1, left: 0, right: 0, bottom: 0 });
    });

    test("getSpacing replaces missing values with default", function() {
        deepEqual(getSpacing({ top: 1 }, 2), { top: 1, left: 2, right: 2, bottom: 2 });
    });

    test("rectToBox returns Box2D from the passed geometry Rect", function() {
        var rect = new kendo.geometry.Rect([10, 20], [30, 40]);
        var box = dataviz.rectToBox(rect);
        ok(box instanceof Box2D);
        equal(box.x1, 10);
        equal(box.y1, 20);
        equal(box.x2, 40);
        equal(box.y2, 60);
    });

    // ------------------------------------------------------------
    var dates = [new Date("2012/05/01 00:00"), new Date("2012/06/01 00:00")];
    module("indexOf");

    test("returns correct index for dates", function() {
        equal(indexOf(new Date("2012/06/01 00:00"), dates), 1);
    });

    test("returns -1 for date not found in array", function() {
        equal(indexOf(new Date("2012/07/01 00:00"), dates), -1);
    });

    test("returns correct index for strings", function() {
        equal(indexOf("A", ["A", "B"]), 0);
    });

    test("returns -1 for strings not found in array", function() {
        equal(indexOf("C", ["A", "B"]), -1);
    });

    // ------------------------------------------------------------
    module("sortDates");

    test("sorts dates", function() {
        deepEqual(sortDates(dates.reverse()), dates);
    });

    test("does not change already sorted dates", function() {
        deepEqual(sortDates(dates.slice(0)), dates);
    });

    test("ignores undefined values", function() {
        var arr = dates.slice(0);
        arr.push(undefined);
        deepEqual(sortDates(arr), arr);
    });

    test("accepts custom comparer", function() {
        var clone = dates.slice(0);
        deepEqual(
            sortDates(clone, function(a, b) { return b.getTime() - a.getTime() }),
            dates.slice(0).reverse()
        );
    });

    // ------------------------------------------------------------
    module("uniqueDates");

    test("eliminates duplicates", function() {
        var dups = dates.slice(0);
        [].push.apply(dups, dates);

        deepEqual(uniqueDates(dups), dates);
    });

    test("ignores empty array", function() {
        deepEqual(uniqueDates([]), []);
    });

    test("accepts custom comparer", function() {
        var clone = dates.slice(0);
        deepEqual(
            uniqueDates(clone, function(a, b) { return b.getTime() - a.getTime() }),
            dates.slice(0).reverse()
        );
    });

    // ------------------------------------------------------------
    module("transpose");

    test("splits input array in (length) outputs", function() {
        deepEqual(
            transpose([[1, 2], [1, 2]]),
            [[1, 1], [2, 2]]
        );
    });

    // ------------------------------------------------------------
    module("decodeEntities");

    test("decodes HTML entities", function() {
        equal(dataviz.decodeEntities("test &gt;"), "test >");
    });

    test("returns empty string", function() {
        equal(dataviz.decodeEntities(""), "");
    });

    test("returns undefined", function() {
        equal(dataviz.decodeEntities(), undefined);
    });

    test("returns other types as-is", function() {
        equal(dataviz.decodeEntities(1), 1);
    });

    // ------------------------------------------------------------
    var ensureTree = dataviz.ensureTree;
    module("ensureTree");

    test("ensures shallow path", function() {
        var obj = {};
        ensureTree("foo.bar", obj);

        deepEqual(obj, { foo: {} });
    });

    test("ensures deep path", function() {
        var obj = {};
        ensureTree("foo.bar.baz", obj);

        deepEqual(obj, { foo: { bar: { } } });
    });

    test("preserves existing data", function() {
        var obj = { foo: { val: 1 } };
        ensureTree("foo.bar.baz", obj);

        deepEqual(obj, { foo: { val: 1, bar: { } } });
    });
})();
