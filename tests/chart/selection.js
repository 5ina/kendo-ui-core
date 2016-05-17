(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        Selection = dataviz.Selection;

    (function() {
        var chart,
            categoryAxis,
            selection,
            sOpts;

        function setup(options) {
            chart = createChart(deepExtend({
                series: [{
                    data: new Array(100),
                }],
                categoryAxis: {
                    name: "main"
                },
                chartArea: {
                    width: 600,
                    height: 400
                }
            }, options));

            categoryAxis = chart._plotArea.categoryAxis;
            selection = chart._selections[0];
            if (selection) {
                sOpts = selection.options;
            }
        }

        function stubArgs(x, y, options) {
            return deepExtend({
                event: { target: $("<div class='k-leftHandle' />") },
                x: { location: x || 0, client: x || 0 },
                y: { location: y || 0, client: x || 0 },
                preventDefault: function() {}
            }, options);
        }

        function triggerMousewheel(delta) {
            selection._mousewheel({
                originalEvent: {
                    detail: delta * 3
                },
                preventDefault: function() {},
                stopPropagation: function() {}
            });
        }

        // ------------------------------------------------------------
        module("Selection / Configuration", {
            teardown: destroyChart
        });

        test("Selection is created for categoryAxis", function() {
            setup({
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 1
                    }
                }
            });

            ok(chart._selections[0] instanceof Selection);
        });

        test("Selection is not created if not configured", function() {
            setup();

            ok(!categoryAxis.selection);
        });

        test("Selection is not created for vertical categoryAxis", function() {
            setup({
                seriesDefaults: {
                    type: "bar"
                },
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 1
                    }
                }
            });

            ok(!categoryAxis.selection);
        });

        test("selection is destroyed on chart destroy", function() {
            stubMethod(Selection.fn, "destroy", function() {
                ok(true);
            }, function() {
                setup({
                    categoryAxis: {
                        select: {
                            from: 0,
                            to: 1
                        }
                    }
                });

                destroyChart();
            });
        });

        test("selection is destroyed on chart redraw", function() {
            stubMethod(Selection.fn, "destroy", function() {
                ok(true);
            }, function() {
                setup({
                    categoryAxis: {
                        select: {
                            from: 0,
                            to: 1
                        }
                    }
                });

                chart.redraw();
            });
        });

        test("selection can reach last category for non-justified charts", function() {
            setup({
                series: [{
                    type: "column",
                    data: new Array(10)
                }],
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 10
                    }
                }
            });

            equal(selection.selection.width(), selection.categoryAxis.lineBox().width() - 1);
        });

        test("selection can reach last category for justified charts", function() {
            setup({
                series: [{
                    type: "area",
                    data: new Array(10)
                }],
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 10
                    }
                }
            });

            equal(selection.selection.width(), selection.categoryAxis.lineBox().width() - 1);
        });

        // ------------------------------------------------------------
        module("Selection / Events", {
            setup: function() {
                setup({
                    categoryAxis: {
                        select: {
                            from: 0,
                            to: 2
                        }
                    }
                });
            },
            teardown: destroyChart
        });

        test("selectStart fires on UserEvents start", function() {
            chart.bind("selectStart", function() {
                ok(true);
            });

            selection._start(stubArgs());
        });

        test("selectStart fires on tap", function() {
            chart.bind("selectStart", function() {
                ok(true);
            });

            selection._tap(stubArgs());
        });

        test("selectStart does not fire on right click", 0, function() {
            chart.bind("selectStart", function() {
                ok(false);
            });

            selection._tap(stubArgs(0, 0, { event: { which: 3 } }));
        });

        test("selectStart fires on mousewheel", function() {
            chart.bind("selectStart", function() {
                ok(true);
            });

            triggerMousewheel(1);
        });

        test("selectStart args contain range (from and to)", function() {
            chart.bind("selectStart", function(e) {
                equal(e.from, 0);
                equal(e.to, 2);
            });

            selection._start(stubArgs());
        });

        test("selectStart args contain axis options", function() {
            chart.bind("selectStart", function(e) {
                equal(e.axis.name, "main");
            });

            selection._start(stubArgs());
        });

        test("selectStart can be cancelled", 0, function() {
            chart.bind("select", function(e) {
                ok(false);
            });

            selection.bind("selectStart", function(e) {
                e.preventDefault();
            });

            selection._start(stubArgs());

            selection._move(stubArgs(100, 0));
        });

        test("selectStart on tap can be cancelled", 0, function() {
            chart.bind("select", function(e) {
                ok(false);
            });

            selection.bind("selectStart", function(e) {
                e.preventDefault();
            });

            selection._tap(stubArgs());
        });

        test("select fires on UserEvents move", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            selection._start(stubArgs());
            selection._move(stubArgs(100, 0));
        });

        test("select fires on tap", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            selection._tap(stubArgs());
        });

        test("select contains correct category on tap", 2, function() {
            setup({
                series: [{
                    data: new Array(10),
                }],
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 1
                    }
                }
            });

            chart.bind("select", function(e) {
                equal(e.from, 9);
                equal(e.to, 10);
            });

            selection._tap(stubArgs(550));
        });

        test("select contains correct category on tap for justified charts", 2, function() {
            setup({
                series: [{
                    type: "area",
                    data: new Array(10),
                }],
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 1
                    }
                }
            });

            chart.bind("select", function(e) {
                equal(e.from, 8);
                equal(e.to, 9);
            });

            selection._tap(stubArgs(580));
        });

        test("select fires on mousewheel", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            triggerMousewheel(1);
        });

        test("select does not fire twice with the same range", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            triggerMousewheel(100);
            triggerMousewheel(100);
        });

        test("select args contain axis options on mousewheel", function() {
            chart.bind("select", function(e) {
                equal(e.axis.name, "main");
            });

            triggerMousewheel(1);
        });

        test("select args contain axis options", function() {
            chart.bind("select", function(e) {
                equal(e.axis.name, "main");
            });

            selection._start(stubArgs());
            selection._move(stubArgs(100, 0));
        });

        test("select args contain range (from and to)", function() {
            chart.bind("select", function(e) {
                equal(e.from, 14);
                equal(e.to, 15);
            });

            selection._start(stubArgs());
            selection._move(stubArgs(80, 0));
        });

        test("select does not fire if range is not changed", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            selection._start(stubArgs());
            selection._move(stubArgs(100, 0));
            selection._move(stubArgs(100, 0));
        });

        test("selectEnd fires on UserEvents end", 1, function() {
            chart.bind("selectEnd", function(e) {
                ok(true);
            });

            selection._start(stubArgs());
            selection._end();
        });

        test("selectEnd fires on tap", 1, function() {
            chart.bind("selectEnd", function(e) {
                ok(true);
            });

            selection._tap(stubArgs());
        });

        asyncTest("selectEnd fires after mousewheel", function() {
            chart.bind("selectEnd", function(e) {
                ok(true);
                start();
            });

            triggerMousewheel(1);
        });

        test("selectEnd args contain axis options", function() {
            chart.bind("selectEnd", function(e) {
                equal(e.axis.name, "main");
            });

            selection._start(stubArgs());
            selection._end();
        });

        test("selectEnd updates final range on UserEvents end", 1, function() {
            chart.bind("selectEnd", function(e) {
                equal(sOpts.from, 2);
            });

            selection._start(stubArgs());
            selection._move(stubArgs(10, 0));
            selection._end();
        });

        asyncTest("selectEnd updates final after mousewheel", function() {
            chart.bind("selectEnd", function(e) {
                equal(sOpts.from, 1);
                equal(sOpts.to, 2);
                start();
            });

            triggerMousewheel(-1);
        });

        // ------------------------------------------------------------
        module("Selection / Mousewheel", {
            setup: function() {
                setup({
                    categoryAxis: {
                        select: {
                            from: 40,
                            to: 60
                        }
                    }
                });
            },
            teardown: destroyChart
        });

        test("selection shrinks left on mousewheel up", function() {
            sOpts.mousewheel.zoom = "left";
            triggerMousewheel(-1);

            equal(sOpts.from, 41);
            equal(sOpts.to, 60);
        });

        test("selection shrinks left on mousewheel down", function() {
            sOpts.mousewheel.zoom = "left";
            sOpts.mousewheel.reverse = true;
            triggerMousewheel(1);

            equal(sOpts.from, 41);
            equal(sOpts.to, 60);
        });

        test("selection shrinks right on mousewheel up", function() {
            sOpts.mousewheel.zoom = "right";
            triggerMousewheel(-1);

            equal(sOpts.from, 40);
            equal(sOpts.to, 59);
        });

        test("selection shrinks both sides on mousewheel up", function() {
            triggerMousewheel(-1);

            equal(sOpts.from, 41);
            equal(sOpts.to, 59);
        });

        test("selection shrinking accelerates", function() {
            triggerMousewheel(-10);

            equal(sOpts.from, 59);
        });

        test("selection expands left on mousewheel down", function() {
            sOpts.mousewheel.zoom = "left";
            triggerMousewheel(1);

            equal(sOpts.from, 39);
            equal(sOpts.to, 60);
        });

        test("selection expands left on mousewheel up", function() {
            sOpts.mousewheel.zoom = "left";
            sOpts.mousewheel.reverse = true;
            triggerMousewheel(-1);

            equal(sOpts.from, 39);
            equal(sOpts.to, 60);
        });

        test("selection expands right on mousewheel up", function() {
            sOpts.mousewheel.zoom = "right";
            triggerMousewheel(1);

            equal(sOpts.from, 40);
            equal(sOpts.to, 61);
        });

        test("selection expands both on mousewheel up", function() {
            triggerMousewheel(1);

            equal(sOpts.from, 39);
            equal(sOpts.to, 61);
        });

        test("selection expansion accelerates", function() {
            triggerMousewheel(10);

            equal(sOpts.from, 10);
        });

        test("selection does not expand beyond axis bounds", function() {
            triggerMousewheel(50);

            equal(sOpts.from, 0);
            equal(sOpts.to, 100);
        });

        test("selection does not expand beyond axis bounds for justified charts", function() {
            setup({
                series: [{
                    type: "area",
                    data: new Array(100)
                }],
                categoryAxis: {
                    select: {
                        from: 0,
                        to: 10
                    }
                }
            });

            triggerMousewheel(100);

            equal(sOpts.from, 0);
            equal(sOpts.to, 99);
        });

        test("selection does not expand beyond min/max range", function() {
            setup({
                categoryAxis: {
                    select: {
                        from: 40,
                        to: 60,
                        min: 30,
                        max: 70
                    }
                }
            });

            triggerMousewheel(100);

            equal(sOpts.from, 30);
            equal(sOpts.to, 70);
        });

        // ------------------------------------------------------------
        module("Selection / Date axis / Configuration", {
            setup: function() {
                setup({
                    series: [{
                        data: [1,2,3]
                    }],
                    categoryAxis: {
                        categories: [
                            new Date("2012/01/01 00:00"),
                            new Date("2012/01/30 00:00")
                        ],
                        baseUnit: "days",
                        select: {
                            from: "2012/01/10 15:00",
                            to: "2012/01/15 15:00",
                            min: "2012/01/05 00:00",
                            max: "2012/01/15 00:00"
                        }
                    }
                });
            },
            teardown: destroyChart
        });

        test("from can be parsed from string", function() {
            ok(sOpts.from instanceof Date);
        });

        test("to can be parsed from string", function() {
            ok(sOpts.to instanceof Date);
        });

        test("min can be parsed from string", function() {
            ok(sOpts.min instanceof Date);
        });

        test("max can be parsed from string", function() {
            ok(sOpts.max instanceof Date);
        });

        test("from is rounded down to prev date", function() {
            deepEqual(sOpts.from, new Date("2012/01/10 00:00"));
        });

        test("to is rounded down to prev date", function() {
            deepEqual(sOpts.to, new Date("2012/01/15 00:00"));
        });

        test("selection can reach last category", function() {
            setup({
                series: [{
                    type: "column",
                    data: [1,2,3]
                }],
                categoryAxis: {
                    categories: [
                        new Date("2012/01/01 00:00"),
                        new Date("2012/01/10 00:00")
                    ],
                    baseUnit: "days",
                    select: {
                        from: "2012/01/01 00:00",
                        to: "2012/01/11 00:00"
                    }
                }
            });

            close(selection.selection.width(), selection.categoryAxis.lineBox().width(), 1);
        });

        test("selection can reach last category for justified charts", function() {
            setup({
                series: [{
                    type: "area",
                    data: [1,2,3]
                }],
                    categoryAxis: {
                        categories: [
                            new Date("2012/01/01 00:00"),
                            new Date("2012/01/10 00:00")
                        ],
                        baseUnit: "days",
                        select: {
                            from: "2012/01/01 00:00",
                            to: "2012/01/10 00:00"
                        }
                    }
            });

            close(selection.selection.width(), selection.categoryAxis.lineBox().width(), 1);
        });

        // ------------------------------------------------------------
        module("Selection / Date axis", {
            setup: function() {
                setup({
                    series: [{
                        data: [1, 2, 3, 4]
                    }],
                    categoryAxis: {
                        categories: [
                            new Date("2012/01/01 00:00"),
                            new Date("2012/01/02 00:00"),
                            new Date("2012/01/03 00:00"),
                            new Date("2012/01/04 00:00")
                        ],
                        select: {
                            from: new Date("2012/01/02 00:00"),
                            to: new Date("2012/01/03 00:00")
                        }
                    }
                });
            },
            teardown: destroyChart
        });

        test("selection is rendered at chosen location", function() {
            equal(selection.leftMask.width(), 139);
            equal(selection.selection.width(), 138);
        });

        test("selectStart args contain date range", function() {
            chart.bind("selectStart", function(e) {
                deepEqual(e.from, new Date("2012/01/02 00:00"));
                deepEqual(e.to, new Date("2012/01/03 00:00"));
            });

            selection._start(stubArgs());
        });

        test("select args contain date range", function() {
            chart.bind("select", function(e) {
                deepEqual(e.from, new Date("2012/01/01 00:00"));
                deepEqual(e.to, new Date("2012/01/03 00:00"));
            });

            selection._start(stubArgs());
            selection._move(stubArgs(-100, 0));
        });

        test("selectEnd updates date range", 1, function() {
            chart.bind("selectEnd", function(e) {
                deepEqual(sOpts.from, new Date("2012/01/01 00:00"));
            });

            selection._start(stubArgs());
            selection._move(stubArgs(-100, 0));
            selection._end();
        });

        asyncTest("selectEnd updates date range after mousewheel", function() {
            chart.bind("selectEnd", function(e) {
                deepEqual(sOpts.from, new Date("2012/01/01 00:00"));
                deepEqual(sOpts.to, new Date("2012/01/04 00:00"));
                start();
            });

            triggerMousewheel(1);
        });

        test("selection does not expand beyond axis bounds", function() {
            triggerMousewheel(20);

            deepEqual(sOpts.from, new Date("2012/01/01 00:00"));
            deepEqual(sOpts.to, new Date("2012/01/05 00:00"));
        });

        test("selection does not expand beyond axis bounds for justified charts", function() {
            setup({
                series: [{
                    type: "area",
                    data: [1,2,3]
                }],
                categoryAxis: {
                    categories: [
                        new Date("2012/01/01 00:00"),
                        new Date("2012/01/10 00:00")
                    ],
                    baseUnit: "days",
                    select: {
                        from: "2012/01/01 00:00",
                        to: "2012/01/02 00:00"
                    }
                }
            });

            triggerMousewheel(20);

            deepEqual(sOpts.from, new Date("2012/01/01 00:00"));
            deepEqual(sOpts.to, new Date("2012/01/10 00:00"));
        });

        test("selection does not expand beyond min/max range", function() {
            setup({
                series: [{
                    type: "area",
                    data: [1,2,3]
                }],
                categoryAxis: {
                    categories: [
                        new Date("2012/01/01 00:00"),
                        new Date("2012/01/30 00:00")
                    ],
                    baseUnit: "days",
                    select: {
                        from: new Date("2012/01/10 00:00"),
                        to: new Date("2012/01/11 00:00"),
                        min: new Date("2012/01/05 00:00"),
                        max: new Date("2012/01/15 00:00")
                    }
                }
            });

            triggerMousewheel(1000);

            deepEqual(sOpts.from, new Date("2012/01/05 00:00"));
            deepEqual(sOpts.to, new Date("2012/01/15 00:00"));
        });

        test("selection expands to min/max range for partial categories", function() {
            setup({
                series: [{
                    type: "area",
                    data: [1,2]
                }],
                categoryAxis: {
                    categories: [
                        new Date("2012/01/05"),
                        new Date("2012/02/05")
                    ],
                    baseUnit: "months",
                    select: {
                        from: new Date("2012/01/10"),
                        to: new Date("2012/01/11"),
                        min: new Date("2012/01/01"),
                        max: new Date("2012/03/01")
                    }
                }
            });

            triggerMousewheel(1000);

            deepEqual(sOpts.from, new Date("2012/01/01"));
            deepEqual(sOpts.to, new Date("2012/03/01"));
        });

    })();
})();
