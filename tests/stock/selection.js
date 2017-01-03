(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        Selection = dataviz.Selection;

    (function() {
        var chart,
            navi,
            naviAxis,
            selection,
            sOpts;

        function setup(options) {
            var div = $("<div id='container' style='width: 600px; height: 400px;' />").appendTo(QUnit.fixture);
            chart = div.kendoStockChart(deepExtend({
                navigator: {
                    categoryAxis: {
                        categories: [
                            new Date("2012/01/01 00:00"),
                            new Date("2012/01/10 00:00")
                        ]
                    },
                    select: {
                        from: new Date("2012/01/02 00:00"),
                        to: new Date("2012/01/03 00:00")
                    }
                }
            }, options)).data("kendoStockChart");

            navi = chart._navigator;
            naviAxis = navi.mainAxis();
            selection = navi.selection;
            if (selection) {
                sOpts = selection.options;
            }
        }

        function stubArgs(x, y, options) {
            return deepExtend({
                target: $("<div class='k-leftHandle' />")[0],
                x: { location: x || 0 },
                y: { location: y || 0 },
                preventDefault: function() {}
            }, options);
        }

        // ------------------------------------------------------------
        module("Selection / Configuration", {
            teardown: destroyChart
        });

        test("Selection is created for navigator axis", function() {
            setup();

            ok(selection.categoryAxis.options.name, "_navigator");
        });

        test("Selection is not created if no data", function() {
            setup({
                navigator: {
                    categoryAxis: {
                        categories: []
                    }
                }
            });

            ok(!naviAxis.selection);
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

        test("selection is destroyed on navigator redraw", function() {
            stubMethod(Selection.fn, "destroy", function() {
                ok(true);
            }, function() {
                setup();
                navi.redraw();
            });
        });

        test("selection extends to axis max", function() {
            setup({
                navigator: {
                    select: { }
                }
            });

            deepEqual(sOpts.max, new Date("2012/01/10 02:00"));
        });

        test("selection extends to axis max for non-justified series", function() {
            setup({
                navigator: {
                    select: { },
                    series: {
                        type: "column"
                    }
                }
            });

            deepEqual(sOpts.max, new Date("2012/01/10 02:00"));
        });

        // ------------------------------------------------------------
        module("Selection / API", {
            setup: function() {
                setup();
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("select returns current selection", function() {
            deepEqual(chart.navigator.select(), {
                from: new Date("2012/01/02 00:00"),
                to: new Date("2012/01/03 00:00")
            });
        });

        test("select updates selection", function() {
            var select = chart.navigator.select(
                new Date("2012/01/02 10:00"),
                new Date("2012/01/02 11:00")
            );
            deepEqual(select.from, new Date("2012/01/02 10:00"));
            deepEqual(select.to, new Date("2012/01/02 11:00"));
        });

        test("select updates selection (strings)", function() {
            var select = chart.navigator.select(
                "2012/01/02 10:00",
                "2012/01/02 11:00"
            );
            deepEqual(select.from, new Date("2012/01/02 10:00"));
            deepEqual(select.to, new Date("2012/01/02 11:00"));
        });

        test("select updates selection object", function() {
            chart.navigator.selection.set = function(from, to) {
                deepEqual(from, new Date("2012/01/02 10:00"));
                deepEqual(to, new Date("2012/01/02 11:00"));
            };

            chart.navigator.select(
                new Date("2012/01/02 10:00"),
                new Date("2012/01/02 11:00")
            );
        });

        test("select does not fire select", 0, function() {
            chart.navigator.select(
                new Date("2012/01/02 10:00"),
                new Date("2012/01/02 11:00")
            );
            chart.bind("select", function() { ok(false); });
        });

        test("select does not fire selectEnd", 0, function() {
            chart.navigator.select(
                new Date("2012/01/02 10:00"),
                new Date("2012/01/02 11:00")
            );
            chart.bind("selectEnd", function() { ok(false); });
        });

        // ------------------------------------------------------------
        module("Selection / Event proxy", {
            setup: function() {
                setup();
            },
            teardown: destroyChart
        });

        test("selectStart fires", function() {
            chart.bind("selectStart", function() {
                ok(true);
            });

            selection._start(stubArgs());
        });

        test("selectStart args contain axis options", function() {
            chart.bind("selectStart", function(e) {
                equal(e.axis.name, "_navigator");
            });

            selection._start(stubArgs());
        });

        test("selectStart args contain date range", function() {
            chart.bind("selectStart", function(e) {
                deepEqual(e.from, new Date("2012/01/02 00:00"));
                deepEqual(e.to, new Date("2012/01/03 00:00"));
            });

            selection._start(stubArgs());
        });

        test("selectStart can be cancelled", 0, function() {
            chart.bind("select", function(e) {
                ok(false);
            });

            chart.bind("selectStart", function(e) {
                e.preventDefault();
            });

            selection._start(stubArgs());

            selection._move(stubArgs(100, 0));
        });

        test("select fires", 1, function() {
            chart.bind("select", function(e) {
                ok(true);
            });

            selection._start(stubArgs());
            selection._move(stubArgs(100, 0));
        });

        test("select args contain axis options", function() {
            chart.bind("select", function(e) {
                equal(e.axis.name, "_navigator");
            });

            selection._start(stubArgs());
            selection._move(stubArgs(100, 0));
        });

        test("select args contain date range", function() {
            chart.bind("select", function(e) {
                deepEqual(e.from, new Date("2012/01/01 00:00"));
                deepEqual(e.to, new Date("2012/01/03 00:00"));
            });

            selection._start(stubArgs());
            selection._move(stubArgs(-100, 0));
        });

        test("selectEnd fires", 1, function() {
            chart.bind("selectEnd", function(e) {
                ok(true);
            });

            selection._start(stubArgs());
            selection._end();
        });

        test("selectEnd args contain axis options", function() {
            chart.bind("selectEnd", function(e) {
                equal(e.axis.name, "_navigator");
            });

            selection._start(stubArgs());
            selection._end();
        });

        test("selectEnd args contain date range", function() {
            chart.bind("selectEnd", function(e) {
                deepEqual(e.from, new Date("2012/01/01 00:00"));
                deepEqual(e.to, new Date("2012/01/03 00:00"));
            });

            selection._start(stubArgs());
            selection._move(stubArgs(-100, 0));
            selection._end();
        });

    })();
})();
