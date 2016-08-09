(function() {

    var dataviz = kendo.dataviz,
        draw = kendo.drawing,
        Box2D = dataviz.Box2D,
        NumericAxis,
        numericAxis,
        gridLayout,
        chartBox = new Box2D(0, 0, 800, 600),
        COORDINATE_LIMIT = 100000,
        TOLERANCE = 1.5;

    NumericAxis = dataviz.NumericAxis.extend({
        options: {
            labels: {
                // Tests expect particular font size
                font: "16px Verdana, sans-serif"
            }
        }
    });

    function getBackground() {
         return numericAxis._backgroundPath;
    }

    function getLine() {
        return numericAxis._lineGroup.children[0];
    }

    function getTicks() {
        return numericAxis._lineGroup.children.slice(1);
    }

    function getAxisTextBoxes() {
        return $.map(numericAxis.labels, function(item) {
            return item.visual;
        });
    }

    function getAxisTexts() {
        return $.map(getAxisTextBoxes(), function(item) {
            return kendo.util.last(item.children);
        });
    }

    function createNumericAxis(options) {
        numericAxis = new NumericAxis(0, 1, options || {});
        numericAxis.reflow(chartBox);
        numericAxis.renderVisual();
    }

    function moduleSetup() {
        numericAxis = new NumericAxis(0, 1, {});
    }

    function moduleTeardown() {
    }

    module("Automatic Major Unit", {
        setup: moduleSetup
    });

    // min, max, expected Major Unit
    var referenceUnits = [
        // [0, max] (max >= 0)
        [0, 0, 0.1],
        [0, 0.1, 0.02],
        [0, 0.2, 0.05],
        [0, 0.5, 0.1],
        [0, 1, 0.2],
        [0, 2, 0.5],
        [0, 5, 1],
        [0, 10, 2],
        [0, 20, 5],
        [0, 47, 5],
        [0, 48, 10],
        [0, 95, 10],
        [0, 96, 20],
        [0, 190, 20],
        [0, 191, 50],
        [0, 476, 50],
        [0, 477, 100],
        [0, 952, 100],
        [0, 953, 200],
        [0, 1904, 200],
        [0, 1905, 500],

        // [min, max] (min > 0, max >= min)
        [1, 1, 0.2],
        [1, 1.1, 0.02],
        [1, 1.2, 0.05],
        [1000, 1000, 200],
        [1000, 1050, 10],
        [1000, 1100, 20],
        [1000, 1200, 50]
    ];

   test("Major unit calculation for positive values", function() {
        for (var i = 0; i < referenceUnits.length; i++) {
            var d = referenceUnits[i],
                min = d[0],
                max = d[1],
                mu = d[2];

            equal(dataviz.autoMajorUnit(min, max), mu, "[" + min + ", " + max  + "]");
        }
   });

   test("Major unit calculation for positive values with big precision should fallback to the default value", function() {
        equal(dataviz.autoMajorUnit(10.1234566667, 10.1234566668), 2);
   });

   test("Major unit calculation for negative values", function() {
        for (var i = 0; i < referenceUnits.length; i++) {
            var d = referenceUnits[i],
                min = -d[1],
                max = -d[0],
                mu = d[2];

            equal(dataviz.autoMajorUnit(min, max), mu, "[" + min + ", " + max + "]");
        }
   });

    test("Major unit calculation for mixed positive / negative values", function() {
        for (var i = 0; i < referenceUnits.length; i++) {
            var d = referenceUnits[i];

            if (d[0] != 0) {
                // Skip tests where min is not 0
                continue;
            }

            // Take a test triplet [min, max, mu] and transform it to [-max/2, max/2, mu]
            var min = -d[1] / 2,
                max = d[1] / 2,
                mu = d[2];

            equal(dataviz.autoMajorUnit(min, max), mu, "[" + min + ", " + max + "]");
        }
    });

    (function() {
        var TOLERANCE = 0.0000000001;

       // -----------------------------------------------------------------
       module("Automatic Axis Maximum", {
           setup: moduleSetup
       });

        // min, max, expected axis minimum, expected axis maximum
        var referenceAxisLimits = [
            [0, 0, 0, 1],
            [0, 0.5, 0, 0.5],
            [0, 2, 0, 2],
            [0, 5, 0, 5],
            [0, 18, 0, 18],
            [0, 20, 0, 20],
            [0, 50, 0, 50],
            [0, 200, 0, 200],
            [0, 500, 0, 500],
            [0, 1800, 0, 1800],

            // Axis limits for close, positive values
            [1.0000001, 1.0000002, 1.00000005, 1.0000002],
            [1, 1, 0, 1],
            [1, 1.1, 0.95, 1.1],
            [1000, 1000, 0, 1000],
            [1000, 1050, 975, 1050],
            [1000, 1100, 950, 1100],
            [1000, 1200, 900, 1200]
        ];

        test("Axis maximum for positive values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i],
                    min = d[0],
                    max = d[1],
                    axisMax = d[3];

                close(numericAxis.autoAxisMax(min, max), axisMax, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });

        test("Axis maximum for negative values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i];

                if (d[0] == 0 && d[1] == 0) {
                    // Skip the [0, 0] test
                    continue;
                }

                var min = -d[1],
                    max = -d[0],
                    axisMax = -d[2];

                close(numericAxis.autoAxisMax(min, max), axisMax, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });

        test("Axis maximum for mixed positive / negative values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i];

                if (d[0] != 0 || d[1] == 0) {
                    // Skip the [0, 0] and [x, y] tests
                    continue;
                }

                var min = -d[1],
                    max = d[1],
                    axisMax = d[3];

                close(numericAxis.autoAxisMax(min, max), axisMax, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });

        // -----------------------------------------------------------------
        module("Automatic Axis Minimum", {
            setup: moduleSetup
        });

        test("Axis minimum for positive values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i],
                    min = d[0],
                    max = d[1],
                    axisMin = d[2];

                close(numericAxis.autoAxisMin(min, max), axisMin, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });

        test("Axis minimum for negative values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i];

                if (d[0] == 0 && d[1] == 0) {
                    // Skip the [0, 0] test
                    continue;
                }

                var min = -d[1],
                    max = -d[0],
                    axisMin = -d[3];

                close(numericAxis.autoAxisMin(min, max), axisMin, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });

        test("Axis minimum for mixed positive/negative values", function() {
            for (var i = 0; i < referenceAxisLimits.length; i++) {
                var d = referenceAxisLimits[i];

                if (d[0] != 0 || d[1] == 0) {
                    // Skip the [0, 0] and [x, y] tests
                    continue;
                }

                var min = -d[1],
                    max = d[1],
                    axisMin = -d[3];

                close(numericAxis.autoAxisMin(min, max), axisMin, TOLERANCE, "[" + min + ", " + max + "]");
            }
        });
    })();

    (function() {
        // ------------------------------------------------------------
        module("Numeric Axis / Configuration", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Major unit is calculated for user set min/max", function() {
            numericAxis = new NumericAxis(1000, 10000, {
                min: 10,
                max: 100
            });

            equal(numericAxis.options.majorUnit, 10);
        });

        test("Major unit is calculated for user set min and automatic max", function() {
            numericAxis = new NumericAxis(1000, 10000, {
                min: 9000
            });

            equal(numericAxis.options.majorUnit, 500);
        });

        test("Major unit is calculated for user set max and automatic min", function() {
            numericAxis = new NumericAxis(1000, 10000, {
                max: 2000
            });

            equal(numericAxis.options.majorUnit, 500);
        });

        test("Major unit is calculated for series when user min/max are not set", function() {
        numericAxis = new NumericAxis(0, 190, {});

            equal(numericAxis.options.majorUnit, 20);
        });

        test("Major unit is calculated when axis minimum is automatically set to 0", function() {
            numericAxis = new NumericAxis(45, 60, {});

            equal(numericAxis.options.majorUnit, 10);
        });

        test("setting narrowRange prevents axis minimum from being extend to 0", function() {
            numericAxis = new NumericAxis(45, 60, { narrowRange: true });

            equal(numericAxis.options.min, 35);
        });

        test("setting narrowRange does not set axis minimum below 0", function() {
            numericAxis = new NumericAxis(25, 103, { narrowRange: true });

            equal(numericAxis.options.min, 0);
        });

        test("setting narrowRange prevents axis maximum from being extend to 0", function() {
            numericAxis = new NumericAxis(-60, -45, { narrowRange: true });

            equal(numericAxis.options.max, -35);
        });

        test("setting narrowRange does not set axis max above 0", function() {
            numericAxis = new NumericAxis(-103, -25, { narrowRange: true });

            equal(numericAxis.options.max, 0);
        });

        test("setting narrowRange to false forces axis minimum to 0 for any delta", function() {
            numericAxis = new NumericAxis(100, 100.1, { narrowRange: false });

            equal(numericAxis.options.min, 0);
        });

        test("setting narrowRange to false forces axis maximum to 0 for any delta", function() {
            numericAxis = new NumericAxis(-100.1, -100, { narrowRange: false });

            equal(numericAxis.options.max, 0);
        });

        test("Automatic maximum is rounded to set major unit", function() {
            numericAxis = new NumericAxis(0, 3, { majorUnit: 1 });
            equal(numericAxis.options.max, 4);
        });

        test("Automatic maximum is rounded to auto major unit", function() {
            numericAxis = new NumericAxis(45, 60, {});
            equal(numericAxis.options.max, 70);
        });

        test("Automatic minimum is rounded to auto major unit", function() {
            numericAxis = new NumericAxis(99, 101, {});
            equal(numericAxis.options.min, 98);
        });

        test("Maximum is set to 1 when min = max = 0", function() {
            numericAxis = new NumericAxis(0, 3, { min: 0, max: 0 });
            equal(numericAxis.options.max, 1);
        });

        test("Major unit is set to 0.2 when min = max = 0", function() {
            numericAxis = new NumericAxis(0, 3, { min: 0, max: 0 });
            equal(numericAxis.options.majorUnit, 0.2);
        });

        test("Minimum is set to 0 when min = max != 0", function() {
            numericAxis = new NumericAxis(0, 3, { min: 1, max: 1 });
            equal(numericAxis.options.min, 0);
        });

        test("Minimum is set to 1 when min is 0 max is 10 and majorUnit is 5", function() {
            numericAxis = new NumericAxis(0, 0, { min: 0, max: 10, majorUnit: 5 });
            equal(numericAxis.options.minorUnit, 1);
        });

        test("reports range minimum equal to options.min", function() {
            equal(numericAxis.range().min, 0);
        });

        test("reports range maximum equal to options.max", function() {
            equal(numericAxis.range().max, 1.2);
        });

        test("Automatic maximum is extended if maximum is within 33% of major unit", function() {
            numericAxis = new NumericAxis(0, 34, {});
            equal(numericAxis.options.max, 40);
        });

        test("Automatic maximum is not extended if maximum is not within 33% of major unit", function() {
            numericAxis = new NumericAxis(0, 33, {});
            equal(numericAxis.options.max, 35);
        });

        test("Automatic maximum is not extended if roundToMajorUnit is false", function() {
            numericAxis = new NumericAxis(0, 34, { roundToMajorUnit: false });
            equal(numericAxis.options.max, 35);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Configuration / Negative values", {
            setup: moduleSetup,
            teardown: moduleTeardown
        });

        test("Automatic maximum is rounded to auto major unit", function() {
            numericAxis = new NumericAxis(-60, -45, {});
            equal(numericAxis.options.max, 0);
        });

        test("Automatic minimum is rounded to auto major unit", function() {
            numericAxis = new NumericAxis(-60, -45, {});
            equal(numericAxis.options.min, -70);
        });

        test("Major unit is calculated when axis maximum is automatically set to 0", function() {
            numericAxis = new NumericAxis(-60, -45, {});

            equal(numericAxis.options.majorUnit, 10);
        });

        test("Automatic minimum is extended if maximum is within 33% of major unit", function() {
            numericAxis = new NumericAxis(-34, 0, {});
            equal(numericAxis.options.min, -40);
        });

        test("Automatic minimum is not extended if maximum is not within 33% of major unit", function() {
            numericAxis = new NumericAxis(-33, 0, {});
            equal(numericAxis.options.min, -35);
        });

        test("Automatic minimum is not extended if roundToMajorUnit is false", function() {
            numericAxis = new NumericAxis(-34, 0, { roundToMajorUnit: false });
            equal(numericAxis.options.min, -35);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Configuration / Labels", {});

        test("labels can be hidden", function() {
            createNumericAxis({ labels: { visible: false } });
            equal(numericAxis.labels.length, 0);
        });

        test("labels have rotation angle", 1, function() {
            createNumericAxis({ labels: { rotation: 42.5 } });

            equal(numericAxis.labels[0].options.rotation, 42.5);
        });

        test("creates labels with full format", 1, function() {
            createNumericAxis({ labels: { format: "{0:C}"} });
            equalTexts(getAxisTexts(), ["$0.00", "$0.20", "$0.40", "$0.60", "$0.80", "$1.00", "$1.20"]);
        });

        test("creates labels with simple format", 1, function() {
            createNumericAxis({ labels: { format: "C"} });
            equalTexts(getAxisTexts(), ["$0.00", "$0.20", "$0.40", "$0.60", "$0.80", "$1.00", "$1.20"]);
        });

        test("labels have set zIndex", 1, function() {
            createNumericAxis({ zIndex: 2 });

            equal(getAxisTextBoxes()[0].options.zIndex, 2);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Configuration / Labels / Globalization", {
            setup: function() {
                kendo.culture().numberFormat["."] = ",";
                createNumericAxis();
            },
            teardown: function() {
                kendo.culture().numberFormat["."] = ".";
            }
        });

        test("creates labels with global format", function() {
            equalTexts(getAxisTexts(), ["0", "0,2", "0,4", "0,6", "0,8", "1", "1,2"]);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Configuration / Labels / rotation");

        test("normalizes labels rotation options if object is passed", function() {
            createNumericAxis({
                labels: {
                    rotation: {
                        angle: 30,
                        align: "center"
                    }
                }
            });

            equal(numericAxis.labels[0].options.rotation, 30);
            equal(numericAxis.labels[0].options.alignRotation, "center");
        });

        test("sets labels rotation to zero if auto is set as value", function() {
            createNumericAxis({
                labels: {
                    rotation: {
                        angle: "auto"
                    }
                }
            });

            equal(numericAxis.labels[0].options.rotation, 0);

            createNumericAxis({
                labels: {
                    rotation: "auto"
                }
            });

            equal(numericAxis.labels[0].options.rotation, 0);
        });

        test("sets autoRotateLabels option to true if auto is set as rotation value", function() {
            createNumericAxis({
                labels: {
                    rotation: {
                        angle: "auto"
                    }
                }
            });

            equal(numericAxis.options.autoRotateLabels, true);

            createNumericAxis({
                labels: {
                    rotation: "auto"
                }
            });

            equal(numericAxis.options.autoRotateLabels, true);
        });

    })();


    (function() {
        module("valueRange", {
            setup: function() {
                numericAxis = new NumericAxis(5.7, 37, {});
            }
        });

        test("returns series min and max value", function() {
            var range = numericAxis.valueRange();
            equal(range.min, 5.7);
            equal(range.max, 37);
        });

    })();

    (function() {
        var FIRST_LABEL_WIDTH = 10,
            LAST_LABEL_WIDTH = 26,
            MAX_LABEL_WIDTH = 28,
            LABEL_HEIGHT = 17,
            MAJOR_TICK_HEIGHT = 4,
            MINOR_TICK_HEIGHT = 3,
            MARGIN = PADDING = 5;

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Rendering", {});

        test("creates axis line", function() {
            var expectedLine = draw.Path.fromPoints([[MAX_LABEL_WIDTH + MARGIN, chartBox.y1],
                [MAX_LABEL_WIDTH + MARGIN, chartBox.y2]]);
            dataviz.alignPathToPixel(expectedLine);
            createNumericAxis();

            sameLinePath(getLine(), expectedLine, TOLERANCE);
        });

        test("creates background box", function() {
            createNumericAxis({ background: "red" });

            var rect = getBackground();
            var box = draw.Path.fromRect(numericAxis.box.toRect())

            sameLinePath(rect, box, TOLERANCE);
        });

        test("should not create axis line if visible is false", function() {
            createNumericAxis({ line: { visible: false }});
            ok(!numericAxis._lineGroup);
        });

        test("should not render axis if visible is false", function() {
            createNumericAxis({ visible: false });
            ok(!numericAxis.visual);
        });

        test("creates axis line when max is not multiple of majorUnit", function() {
            var expectedLine = draw.Path.fromPoints([[MAX_LABEL_WIDTH + MARGIN, chartBox.y1],
                [MAX_LABEL_WIDTH + MARGIN, chartBox.y2]]);
            dataviz.alignPathToPixel(expectedLine);
            createNumericAxis({ min: 0, max: 1, majorUnit: .3 });

            sameLinePath(getLine(), expectedLine, TOLERANCE);
        });

        test("creates axis with dash type", function() {
            createNumericAxis({
                line: {
                    dashType: "dot"
                }
            });
            equal(getLine().options.stroke.dashType, "dot");
        });

        test("creates labels", function() {
            createNumericAxis();

            equalTexts(getAxisTexts(), ["0", "0.2", "0.4", "0.6", "0.8", "1", "1.2"]);
        });

        test("labels have set color", 1, function() {
            createNumericAxis({
                labels: {
                    color: "#f00"
                }
            });

            equal(getAxisTexts()[0].options.fill.color, "#f00");
        });

        test("labels have set background", 1, function() {
            createNumericAxis({
                labels: {
                    background: "#f0f"
                }
            });

            equal(getAxisTextBoxes()[0].children[0].options.fill.color, "#f0f");
        });

        test("labels have set template", 1, function() {
            createNumericAxis({
                labels: {
                    template: "|${ data.value }|"
                }
            });

            equal(getAxisTexts()[0].content(), "|0|");
        });

        test("labels are distributed vertically", function() {
            createNumericAxis();
            closeTextPosition("y", getAxisTexts(), [591.5, 491.6, 391.8, 291, 192.1, 92.3, -7.5], TOLERANCE);
        });

        test("labels are distributed vertically in reverse", function() {
            createNumericAxis({
                reverse: true
            });

            closeTextPosition("y", getAxisTexts(), [591.5, 491.6, 391.8, 291, 192.1, 92.3, -7.5].reverse(), TOLERANCE);
        });

        test("labels are aligned right", function() {
            createNumericAxis();
            closeTextPosition("x", getAxisTexts(), [16, 0, 0, 0, 0, 16, 0], TOLERANCE);
        });

        test("labels are aligned right with margin and padding", function() {
            createNumericAxis({
                labels: {
                    margin: MARGIN,
                    padding: PADDING
                }
            });

            closeTextPosition("x", getAxisTexts(), [ 26, 10, 10, 10, 10, 26, 10 ], TOLERANCE);
        });

        test("major ticks are distributed vertically", function() {
            createNumericAxis();

            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                 [599.5, 499.5, 399.5, 300, 200.5, 100.5, 0.5], TOLERANCE);
        });

        test("excess space is allocated after last major tick", function() {
            createNumericAxis({
                max: 1.2,
                majorUnit: 0.5
            });
            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                 [599.5, 348.5, 100.5], TOLERANCE);
        });

        test("major ticks are distributed vertically in reverse", function() {
            createNumericAxis({
                reverse: true
            });

            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                 [599.5, 499.5, 399.5, 300, 200.5, 100.5, 0.5].reverse(), TOLERANCE);
        });

        test("excess space is allocated after last major tick in reverse", function() {
            createNumericAxis({
                reverse: true,
                max: 1.2,
                majorUnit: 0.5
            });
            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                 [0.5, 251.5, 499.5], TOLERANCE);
        });

        test("minor ticks can be disabled", function() {
            createNumericAxis({
                line: {
                    width: 0
                }
            });

            ok(!numericAxis._lineGroup);
        });

        test("minor ticks are distributed vertically", function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });
            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                [599.5, 579.5, 559.5, 539.5, 519.5, 499.5,
                 479.5, 459.5, 439.5, 419.5, 399.5, 379.5,
                 359.5, 339.5, 319.5, 300.5, 280.5, 260.5,
                 240.5, 220.5, 200.5, 180.5, 160.5, 140.5,
                 120.5, 100.5, 80.5, 60.5, 40.5, 20.5, 0.5], TOLERANCE);
        });

        test("minor ticks are distributed vertically in reverse", function() {
            createNumericAxis({
                reverse: true,
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });
            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                [599.5, 579.5, 559.5, 539.5, 519.5, 499.5,
                 479.5, 459.5, 439.5, 419.5, 399.5, 379.5,
                 359.5, 339.5, 319.5, 300.5, 280.5, 260.5,
                 240.5, 220.5, 200.5, 180.5, 160.5, 140.5,
                 120.5, 100.5, 80.5, 60.5, 40.5, 20.5, 0.5].reverse(), TOLERANCE);
        });

        test("minor ticks are rendered after last major tick", function() {
            createNumericAxis({
                min: 0,
                max: 0.3,
                majorUnit: 0.2,
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });
            arrayClose($.map(getTicks(), function(line) {return line.segments[0].anchor().y;}),
                [599.5, 519.5, 439.5, 359.5, 280.5, 200.5, 120.5, 40.5], TOLERANCE);
        });

        test("major ticks are aligned to axis", 7, function() {
            createNumericAxis();

            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().x, 29.5);
            });
        });

        test("minor ticks are aligned to axis", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().x, 29.5);
            });
        });

        test("Returns just one major tick if majorUnit is 0", function() {
            createNumericAxis({ majorUnit: 0 });
            equal(getTicks().length, 1);
        });

        test("major tick step of 0 is treated as 1", function() {
            createNumericAxis({
                majorTicks: { step: 0 }
            });

            equal(getTicks().length, 7);
        });

        test("minor tick step of 0 is treated as 1", function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true, step: 0 }
            });

            equal(getTicks().length, 31);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Label Step / Rendering", {
            setup: function() {
                createNumericAxis({
                    labels: { step: 2 }
                });
            },
            teardown: moduleTeardown
        });

        test("renders every second label", function() {
            equalTexts(getAxisTexts(), ["0", "0.4", "0.8", "1.2"]);
        });

        test("labels are distributed vertically", function() {
            closeTextPosition("y", getAxisTexts(), [591.5, 391.8, 192.1, -7.5], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Label Step and skip / Rendering", {
            setup: function() {
                createNumericAxis({
                    labels: { step: 2, skip: 2 }
                });
            }
        });

        test("renders every second label, starting from the third", function() {
            equalTexts(getAxisTexts(), ["0.4", "0.8", "1.2"]);
        });

        test("labels are distributed vertically, starting from the third", function() {
            closeTextPosition("y", getAxisTexts(), [391.8, 192.1, -7.5], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Mirrored / Rendering", {
            setup: function() {
                createNumericAxis({
                    labels: {
                        mirror: true
                    }
                });
            }
        });

        test("labels are aligned left", 7, function() {
            closeTextPosition("x", getAxisTexts(), 9, TOLERANCE);
        });

        test("major ticks are aligned to axis", 7, function() {
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().x, 0.5);
            });
        });

        test("minor ticks are aligned to axis", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                labels: {
                    mirror: true
                }
            });
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().x, 0.5);
            });
        });

        // ------------------------------------------------------------
        module("Rendering / Horizontal", {
            setup: function() {
                createNumericAxis({ vertical: false });
            }
        });

        test("creates axis line", function() {
            var expectedLine = draw.Path.fromPoints([[chartBox.x1, chartBox.y1],
                [chartBox.x2, chartBox.y1]]);
            dataviz.alignPathToPixel(expectedLine);

            sameLinePath(getLine(), expectedLine, TOLERANCE);
        });

        test("should not create axis line if visible is false", function() {
            createNumericAxis({ line: { visible: false }, vertical: false});

            ok(!numericAxis._lineGroup);
        });

        test("should not render axis if visible is false", function() {
            createNumericAxis({ visible: false, vertical: false });
            ok(!numericAxis._lineGroup);
        });

        test("creates labels", function() {
            equalTexts(getAxisTexts(), ["0", "0.2", "0.4", "0.6", "0.8", "1", "1.2"]);
        });

        test("labels are distributed horizontally", function() {
            closeTextPosition("x", getAxisTexts(), [-4, 121.1, 254.3, 387.5, 520.6, 661.8, 787], TOLERANCE);
        });

        test("labels are distributed horizontally in reverse", function() {
            createNumericAxis({ vertical: false, reverse: true });
            closeTextPosition("x", getAxisTexts(), [795, 653.8, 520.6, 387.5, 254.3, 129.167, -12], TOLERANCE);
        });

        test("labels are aligned top", 7, function() {
            closeTextPosition("y", getAxisTexts(), MAJOR_TICK_HEIGHT + MARGIN);
        });

        test("labels are aligned top", 7, function() {
            createNumericAxis({
                vertical: false,
                labels: {
                    margin: MARGIN,
                    padding: PADDING
                }
            });

            closeTextPosition("y", getAxisTexts(), MAJOR_TICK_HEIGHT + 2 * MARGIN + PADDING);
        });

        test("major ticks are distributed horizontally", function() {
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                 [0.5, 133.5, 266.5, 400.5, 533.5, 666.5, 799.5], TOLERANCE);
        });

        test("excess space is allocated after last major tick", function() {
            createNumericAxis({
                vertical: false,
                max: 1.2,
                majorUnit: 0.5
            });
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                 [0, 334, 666.5], TOLERANCE);
        });

        test("major ticks are distributed horizontally in reverse", function() {
            createNumericAxis({ vertical: false, reverse: true });
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                 [0.5, 133.5, 266.5, 400.5, 533.5, 666.5, 799.5].reverse(), TOLERANCE);
        });

        test("excess space is allocated after last major tick in reverse", function() {
            createNumericAxis({
                vertical: false,
                reverse: true,
                max: 1.2,
                majorUnit: 0.5
            });
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                 [799.5, 465.833, 133.5], TOLERANCE);
        });

        test("major ticks are vertical", 7, function() {
            $.each(getTicks(), function() {
                equal(this.segments[1].anchor().x, this.segments[0].anchor().x);
            });
        });

        test("major ticks are aligned to axis", 7, function() {
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().y, 0.5);
            });
        });

        test("major ticks are of predefined height", 7, function() {
            $.each(getTicks(), function() {
                equal(this.segments[1].anchor().y - this.segments[0].anchor().y, MAJOR_TICK_HEIGHT);
            });
        });

        test("minor ticks are distributed horizontally", function() {
            createNumericAxis({
                vertical: false,
                reverse: true,
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });

            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                [0.5, 27.5, 53.5, 80.5, 107.5, 133.5, 160.5, 186.5,
                213.5, 240.5, 266.5, 293.5, 320.5, 346.5, 373.5,
                400.5, 426.5, 453.5, 479.5, 506.5, 533.5, 559.5,
                586.5, 613.5, 639.5, 666.5, 692.5, 719.5, 746.5, 772.5, 799.5].reverse(), TOLERANCE);
        });

        test("minor ticks are distributed horizontally in reverse", function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                vertical: false
            });
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                [0.5, 27.5, 53.5, 80.5, 107.5, 133.5, 160.5, 186.5,
                213.5, 240.5, 266.5, 293.5, 320.5, 346.5, 373.5,
                400.5, 426.5, 453.5, 479.5, 506.5, 533.5, 559.5,
                586.5, 613.5, 639.5, 666.5, 692.5, 719.5, 746.5, 772.5, 799.5], TOLERANCE);
        });

        test("minor ticks are rendered after last major tick", function() {
            createNumericAxis({
                vertical: false,
                min: 0,
                max: 0.3,
                majorUnit: 0.2,
                majorTicks: { visible: false },
                minorTicks: { visible: true }
            });
            arrayClose($.map(getTicks(), function(line) { return line.segments[0].anchor().x; }),
                [0.5, 107.5, 213.5, 320.5, 426.5, 533.5, 639.5, 746.5], TOLERANCE);
        });

        test("minor ticks are vertical", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                vertical: false
            });

            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().x, this.segments[1].anchor().x);
            });
        });

        test("minor ticks are aligned to axis", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                vertical: false
            });
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().y, 0.5);
            });
        });

        test("minor ticks are of predefined height", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                vertical: false
            });
            $.each(getTicks(), function() {
                equal(this.segments[1].anchor().y - this.segments[0].anchor().y, MINOR_TICK_HEIGHT);
            });
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / Label Step / Rendering", {
            setup: function() {
                createNumericAxis({
                    labels: { step: 2 },
                    vertical: false
                });
            }
        });

        test("renders every second label", function() {
            equalTexts(getAxisTexts(), ["0", "0.4", "0.8", "1.2"]);
        });

        test("labels are distributed horizontally", function() {
            closeTextPosition("x", getAxisTexts(), [-4, 253, 520.6, 787], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / Label Step and skip / Rendering", {
            setup: function() {
                createNumericAxis({
                    labels: { step: 2, skip: 2 },
                    vertical: false
                });
            },
            teardown: moduleTeardown
        });

        test("renders every second label, starting from the third label", function() {
            equalTexts(getAxisTexts(), ["0.4", "0.8", "1.2"]);
        });

        test("labels are distributed horizontally, starting from the thrid label", function() {
            closeTextPosition("x", getAxisTexts(), [254.3, 520.6, 787], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / Mirrored / Rendering", {
            setup: function() {
                createNumericAxis({
                    vertical: false,
                    labels: {
                        mirror: true
                    }
                });
            },
            teardown: moduleTeardown
        });

        test("labels are aligned bottom", 7, function() {
            closeTextPosition("y", getAxisTexts(), 0);
        });

        test("major ticks are aligned to axis", 7, function() {
            $.each(getTicks(), function() {
                equal(this.segments[0].anchor().y, 20.5);
            });
        });

        test("minor ticks are aligned to axis", 31, function() {
            createNumericAxis({
                majorTicks: { visible: false },
                minorTicks: { visible: true },
                vertical: false,
                labels: {
                    mirror: true
                }
            });
            $.each(getTicks(), function() {
                 equal(this.segments[0].anchor().y, 20.5);
            });
        });

    })();

    (function() {

        function testVmlCoordinateLimit(callback) {
            var supportVML = kendo.support.vml;
            try {
                kendo.support.vml = true;
                callback();
            } finally {
                kendo.support.vml = supportVML;
            }
        }

        module("Slots / Vertical", {
            setup: function() {
                createNumericAxis();
            }
        });

        test("positions slot for [0, 0.5]", function() {
            var slot = numericAxis.getSlot(0, 0.5);
            arrayClose([slot.y1, slot.y2], [348.5, 599], TOLERANCE);
        });

        test("positions slot for [0, 0.5] when reversed", function() {
            createNumericAxis({
                reverse: true
            });
            var slot = numericAxis.getSlot(0, 0.5);
            arrayClose([slot.y1, slot.y2], [0, 251], TOLERANCE);
        });

        test("positions slot for [0.5, 1]", function() {
            var slot = numericAxis.getSlot(0.5, 1);
            arrayClose([slot.y1, slot.y2], [99.8, 348.5], TOLERANCE);
        });

        test("positions slot for [0.5, 1] when reversed", function() {
            numericAxis.options.reverse = true;
            var slot = numericAxis.getSlot(0.5, 1);
            arrayClose([slot.y1, slot.y2], [249.5, 499.1], TOLERANCE);
        });

        test("slot width is 0", function() {
            var slot = numericAxis.getSlot(0, 0.5);
            close(slot.width(), 0);
        });

        test("a value capped to minimum value", function() {
            var slot = numericAxis.getSlot(-1000, 1, true);
            arrayClose([slot.y1, slot.y2], [99.8, 599], TOLERANCE);
        });

        test("a value is not capped to minimum value", function() {
            var slot = numericAxis.getSlot(-100, 1);
            arrayClose([slot.y1, slot.y2], [99.8, 50515.6], TOLERANCE);
        });

        test("a value capped to maximum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(-COORDINATE_LIMIT, 1);
                arrayClose([slot.y1, slot.y2], [99.8, COORDINATE_LIMIT], TOLERANCE);
            });
        });

        test("b value capped to maximum value", function() {
            var slot = numericAxis.getSlot(0, 1000, true);
            arrayClose([slot.y1, slot.y2], [0, 599], TOLERANCE);
        });

        test("b value is not capped to maximum value", function() {
            var slot = numericAxis.getSlot(0, 100);
            arrayClose([slot.y1, slot.y2], [-49317.6, 599], TOLERANCE);
        });

        test("b value capped to minimum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(0, COORDINATE_LIMIT);
                arrayClose([slot.y1, slot.y2], [-COORDINATE_LIMIT, 599], TOLERANCE);
            });
        });

        test("slot method returns slot as rect", function() {
            var box = numericAxis.getSlot(0, 100);
            var slot = numericAxis.slot(0, 100);
            ok(slot.equals(box.toRect()));
        });

        // ------------------------------------------------------------
        module("Slots / Vertical / Negative Values", {
            setup: function() {
                moduleSetup();

                numericAxis = new NumericAxis(-1, 0, {});
                numericAxis.reflow(chartBox);
            },
            teardown: moduleTeardown
        });

        test("positions slot for [-0.5, 0]", function() {
            var slot = numericAxis.getSlot(-0.5, 0);
            arrayClose([slot.y1, slot.y2], [0, 249.5], TOLERANCE);
        });

        test("positions slot for [-1, -0.5]", function() {
            var slot = numericAxis.getSlot(-1, -0.5);
            arrayClose([slot.y1, slot.y2], [249.5, 499.1], TOLERANCE);
        });

        test("a value capped to maximum value", function() {
            var slot = numericAxis.getSlot(1000, -1, true);
            arrayClose([slot.y1, slot.y2], [0, 499.1], TOLERANCE);
        });

        test("a value is not capped to maximum value", function() {
            var slot = numericAxis.getSlot(100, -1);
            arrayClose([slot.y1, slot.y2], [-49916.6, 499.1], TOLERANCE);
        });

        test("a value capped to minimum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(COORDINATE_LIMIT, -1);
                arrayClose([slot.y1, slot.y2], [-COORDINATE_LIMIT, 499.1], TOLERANCE);
            });
        });

        test("b value capped to minimum value", function() {
            var slot = numericAxis.getSlot(0, -1000, true);
            arrayClose([slot.y1, slot.y2], [0, 599], TOLERANCE);
        });

        test("b value is not capped to minimum value", function() {
            var slot = numericAxis.getSlot(0, -100);
            arrayClose([slot.y1, slot.y2], [0, 49916.6], TOLERANCE);
        });

        test("b value capped to maximum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(0, -COORDINATE_LIMIT);
                arrayClose([slot.y1, slot.y2], [0, COORDINATE_LIMIT], TOLERANCE);
            });
        });

        // ------------------------------------------------------------
        module("Slots / Horizontal", {
            setup: function() {
                moduleSetup();

                numericAxis = new NumericAxis(0, 1, { vertical: false });
                numericAxis.reflow(chartBox);
            },
            teardown: moduleTeardown
        });

        test("positions slot for [0, 0.5]", function() {
            var slot = numericAxis.getSlot(0, 0.5);
            arrayClose([slot.x1, slot.x2], [0, 332.9], TOLERANCE);
        });

        test("positions slot for [0, 0.5] when reversed", function() {
            numericAxis.options.reverse = true;
            var slot = numericAxis.getSlot(0, 0.5);
            arrayClose([slot.x1, slot.x2], [466, 799], TOLERANCE);
        });

        test("positions slot for [0.5, 1]", function() {
            var slot = numericAxis.getSlot(0.5, 1);
            arrayClose([slot.x1, slot.x2], [332.9, 665.8], TOLERANCE);
        });

        test("positions slot for [0.5, 1] when reversed", function() {
            numericAxis.options.reverse = true;
            var slot = numericAxis.getSlot(0.5, 1);
            arrayClose([slot.x1, slot.x2], [133.3, 466], TOLERANCE);
        });

        test("slot height is 0", function() {
            var slot = numericAxis.getSlot(0, 0.5);
            close(slot.height(), 0);
        });

        test("a value capped to minimum value", function() {
            var slot = numericAxis.getSlot(-1000, 1, true);
            arrayClose([slot.x1, slot.x2], [0, 665.8], TOLERANCE);
        });

        test("a value is not capped to minimum value", function() {
            var slot = numericAxis.getSlot(-100, 1);
            arrayClose([slot.x1, slot.x2], [-66583.3, 665.8], TOLERANCE);
        });

        test("a value capped to minimum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(-COORDINATE_LIMIT, 1);
                arrayClose([slot.x1, slot.x2], [-COORDINATE_LIMIT, 665.8], TOLERANCE);
            });
        });

        test("b value capped to maximum value", function() {
            var slot = numericAxis.getSlot(0, 1000, true);
            arrayClose([slot.x1, slot.x2], [0, 799], TOLERANCE);
        });

        test("b value is not capped to maximum value", function() {
            var slot = numericAxis.getSlot(0, 100);
            arrayClose([slot.x1, slot.x2], [0, 66583.3], TOLERANCE);
        });

        test("b value capped to maximum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(0, COORDINATE_LIMIT);
                arrayClose([slot.x1, slot.x2], [0, COORDINATE_LIMIT], TOLERANCE);
            });
        });

        test("slot method returns slot as rect", function() {
            var box = numericAxis.getSlot(0, 100);
            var slot = numericAxis.slot(0, 100);
            ok(slot.equals(box.toRect()));
        });

        // ------------------------------------------------------------
        module("Slots / Horizontal / Negative Values", {
            setup: function() {
                moduleSetup();

                numericAxis = new NumericAxis(-1, 0, { vertical: false });
                numericAxis.reflow(chartBox);
            },
            teardown: moduleTeardown
        });

        test("positions slot for [-0.5, 0]", function() {
            var slot = numericAxis.getSlot(-0.5, 0);
            arrayClose([slot.x1, slot.x2], [466.1, 799], TOLERANCE);
        });

        test("positions slot for [-1, -0.5]", function() {
            var slot = numericAxis.getSlot(-1, -0.5);
            arrayClose([slot.x1, slot.x2], [133.1, 466.1], TOLERANCE);
        });

        test("a value capped to maximum value", function() {
            var slot = numericAxis.getSlot(1000, -1, true);
            arrayClose([slot.x1, slot.x2], [133.166, 799], TOLERANCE);
        });

        test("a value is not capped to maximum value", function() {
            var slot = numericAxis.getSlot(100, -1);
            arrayClose([slot.x1, slot.x2], [133.1, 67382.3], TOLERANCE);
        });

        test("a value capped to maximum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(COORDINATE_LIMIT, -1);
                arrayClose([slot.x1, slot.x2], [133.1, COORDINATE_LIMIT], TOLERANCE);
            });
        });

        test("b value capped to minimum value", function() {
            var slot = numericAxis.getSlot(0, -1000, true);
            arrayClose([slot.x1, slot.x2], [0, 799]);
        });

        test("b value is not capped to minimum value", function() {
            var slot = numericAxis.getSlot(0, -100);
            arrayClose([slot.x1, slot.x2], [-65784.3, 799], TOLERANCE);
        });

        test("b value capped to minimum coordinate value", function() {
            testVmlCoordinateLimit(function() {
                var slot = numericAxis.getSlot(0, -COORDINATE_LIMIT);
                arrayClose([slot.x1, slot.x2], [-COORDINATE_LIMIT, 799], TOLERANCE);
            });
        });
    })();

    (function() {
        var TOLERANCE = 0.01;
        var Point2D = kendo.dataviz.Point2D;
        var numericAxis;

        // ------------------------------------------------------------
        module("Numeric Axis / getValue / Horizontal", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, {
                    vertical: false,
                    labels: { visible: false }
                });
                numericAxis.reflow(chartBox);
            }
        });

        test("returns null for coordinates left of axis", function() {
            deepEqual(numericAxis.getValue(new Point2D(-1, 0)), null);
        });

        test("returns null for coordinates right of axis", function() {
            deepEqual(numericAxis.getValue(new Point2D(1000, 0)), null);
        });

        test("returns minimum value for leftmost point", function() {
            equal(numericAxis.getValue(new Point2D(0, 0)), 0);
        });

        test("returns maximum value for righttmost point", function() {
            equal(numericAxis.getValue(new Point2D(799, 0)), 1.2);
        });

        test("returns value for middle point", function() {
            close(numericAxis.getValue(new Point2D(335, 0)), 0.5, TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / getValue / Horizontal / Reverse", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, {
                    vertical: false,
                    reverse: true,
                    labels: { visible: false }
                });

                numericAxis.reflow(chartBox);
            }
        });

        test("returns minimum value for righttmost point", function() {
            equal(numericAxis.getValue(new Point2D(799, 0)), 0);
        });

        test("returns maximum value for leftmost point", function() {
            equal(numericAxis.getValue(new Point2D(0, 0)), 1.2);
        });

        test("returns value for middle point", function() {
            close(numericAxis.getValue(new Point2D(465, 0)), 0.5, TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / getValue / Vertical", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, {
                    vertical: true,
                    labels: { visible: false }
                });
                numericAxis.reflow(chartBox);
            }
        });

        test("returns null for coordinates above the axis", function() {
            deepEqual(numericAxis.getValue(new Point2D(0, -1)), null);
        });

        test("returns null for coordinates below the axis", function() {
            deepEqual(numericAxis.getValue(new Point2D(0, 1000)), null);
        });

        test("returns minimum value for bottommost point", function() {
            equal(numericAxis.getValue(new Point2D(0, 599)), 0);
        });

        test("returns maximum value for topmost point", function() {
            equal(numericAxis.getValue(new Point2D(0, 0)), 1.2);
        });

        test("returns value for middle point", function() {
            close(numericAxis.getValue(new Point2D(0, 350)), 0.5, TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / getValue / Vertical / Reverse", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, {
                    vertical: true,
                    reverse: true,
                    labels: { visible: false }
                });

                numericAxis.reflow(chartBox);
            }
        });

        test("returns minimum value for topmost  point", function() {
            equal(numericAxis.getValue(new Point2D(0, 0)), 0);
        });

        test("returns maximum value for bottommost point", function() {
            equal(numericAxis.getValue(new Point2D(0, 599)), 1.2);
        });

        test("returns value for middle point", function() {
            close(numericAxis.getValue(new Point2D(0, 250)), 0.5, TOLERANCE);
        });

    })();

    (function() {
        var plotArea,
            plotBands,
            lineSeriesData = [{
                name: "Value A",
                type: "line",
                data: [0, 1]
            }],
            barSeriesData =  [{
                name: "Value A",
                type: "bar",
                data: [0, 1]
            }];

        function getPlotBands(axis) {
            var axis = plotArea.axisX instanceof dataviz.NumericAxis ? plotArea.axisX : plotArea.axisY;
            return axis._plotbandGroup;
        }

        function createPlotArea(series, valueAxisOptions) {
            var valueAxis = valueAxisOptions || {
                    plotBands: [{
                        from: 0.2,
                        to: 0.3,
                        color: "red",
                        opacity: 0.5
                    }],
                    labels: {
                        font: "16px Verdana, sans-serif"
                    }
                };
            plotArea = new dataviz.CategoricalPlotArea(series, {
                valueAxis: valueAxis,
                categoryAxis: {
                    categories: ["A"],
                    labels: {
                        font: "16px Verdana, sans-serif"
                    }
                }
            });

            plotArea.reflow(chartBox);
            plotArea.renderVisual();
            plotBands = getPlotBands().children[0];
        }

        // ------------------------------------------------------------
        module("Numeric Axis / Plot Bands / Horizontal", {
            setup: function() {
                createPlotArea(lineSeriesData);
            }
        });

        test("renders box", function() {
            sameRectPath(plotBands, [33, 433, 799, 481], TOLERANCE);
        });

        test("renders color", function() {
            equal(plotBands.options.fill.color, "red");
        });

        test("renders opacity", function() {
            equal(plotBands.options.fill.opacity, 0.5);
        });

        test("renders z index", function() {
            equal(getPlotBands().options.zIndex, -1);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Plot Bands / Vertical", {
            setup: function() {
                createPlotArea(barSeriesData);
            }
        });

        test("renders box", function() {
            sameRectPath(plotBands, [147, 0, 211, 576], TOLERANCE);
        });

        test("renders color", function() {
            equal(plotBands.options.fill.color, "red");
        });

        test("renders opacity", function() {
            equal(plotBands.options.fill.opacity, 0.5);
        });

        test("renders z index", function() {
            equal(getPlotBands().options.zIndex, -1);
        });

        module("Numeric Axis / Plot Bands / limit", {
            setup: function() {
                createPlotArea(lineSeriesData, {
                    min: 4,
                    max: 10,
                    plotBands: [{
                        from: 3,
                        to: 7,
                        color: "red",
                        opacity: 0.5
                    }],
                    labels: {
                        font: "16px Verdana, sans-serif"
                    }
                });
            }
        });

        test("limits plotBands slot", function() {
            arrayClose([plotBands.segments[0].anchor().y, plotBands.segments[3].anchor().y],
                 [291, 576], TOLERANCE);
        });

        test("do not render plotBands if the have zero size", function() {
            var axis = new NumericAxis(3, 10, {
                plotBands: [{
                    from: 1,
                    to: 2,
                    color: "red",
                    opacity: 0.5
                }, {
                    from: 3,
                    to: 3,
                    color: "red",
                    opacity: 0.5
                }],
                labels: {
                    font: "16px Verdana, sans-serif"
                },
                min: 3
            });
            axis.reflow(chartBox);

            plotArea = new dataviz.CategoricalPlotArea([{}], { });
            plotArea.reflow(chartBox);
            axis.plotArea = plotArea;
            axis.pane = { axes: [] };
            axis.renderVisual();

            equal(axis._plotbandGroup.children.length, 0);
        });

    })();


    (function() {
        var plotArea,
            title,
            titleTextBox,
            titleBackground,
            titleBox,
            lineSeriesData = [{
                name: "Value A",
                type: "line",
                data: [100]
            }],
            barSeriesData =  [{
                name: "Value A",
                type: "bar",
                data: [100]
            }];

        function createPlotArea(series, plotOptions) {
            plotArea = new dataviz.CategoricalPlotArea(series, kendo.deepExtend({
                valueAxis: {
                    title: {
                        font: "16px Verdana, sans-serif",
                        text: "text",
                        color: "red",
                        background: "green",
                        opacity: 0.33,
                        position: "center"
                    },
                    labels: {
                        font: "16px Verdana, sans-serif"
                    }
                },
                categoryAxis: {
                    categories: ["A"],
                    labels: {
                        font: "16px Verdana, sans-serif"
                    }
                }
            }, plotOptions));

            plotArea.reflow(chartBox);
            plotArea.renderVisual();
            numericAxis = plotArea.axisX instanceof dataviz.NumericAxis ? plotArea.axisX : plotArea.axisY;
            if (numericAxis.title) {
                titleTextBox = numericAxis.title.visual;
                titleBackground = titleTextBox.children[0];
                title = titleTextBox.children[1];
            }
        }

        // ------------------------------------------------------------
        module("Numeric Axis / Title / Horizontal", {
            setup: function() {
                createPlotArea(barSeriesData);
                titleBox = plotArea.axisX.title.box;
            }
        });

        test("does not change line box width", function() {
            var box = plotArea.axisX.lineBox();
            deepEqual([box.x1, box.x2], [17, 788]);
        });

        test("positioned at center", function() {
            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 387, 585, 419, 600 ], TOLERANCE);
        });

        test("positioned left", function() {
            createPlotArea(barSeriesData, { valueAxis: { title: { position: "left" }}});
            titleBox = plotArea.axisX.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 17, 585, 49, 600 ], TOLERANCE);
        });

        test("positioned right", function() {
            createPlotArea(barSeriesData, { valueAxis: { title: { position: "right" }}});
            titleBox = plotArea.axisX.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 757, 585, 789, 600 ], TOLERANCE);
        });

        test("renders color", function() {
            equal(title.options.fill.color, "red");
        });

        test("renders opacity", function() {
            equal(titleBackground.options.fill.opacity, 0.33);
        });

        test("renders zIndex", function() {
            equal(titleTextBox.options.zIndex, 1);
        });

        test("hidden when visible is false", function() {
            createPlotArea(barSeriesData, { valueAxis: { title: { visible: false }}});
            equal(plotArea.axisX.title, null);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / Mirrored / Title", {
            setup: function() {
                createPlotArea(barSeriesData, { valueAxis: { labels: { mirror: true } } });
                titleBox = plotArea.axisX.title.box;
            }
        });

        test("does not change line box width", function() {
            var box = plotArea.axisX.lineBox();
            arrayClose([box.x1, box.x2], [17, 788]);
        });

        test("positioned at center", function() {
            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 387, 560, 419, 575 ], TOLERANCE);
        });

        test("positioned left", function() {
            createPlotArea(barSeriesData, {
                valueAxis: { labels: { mirror: true }, title: { position: "left" }}
            });

            titleBox = plotArea.axisX.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 17, 560, 49, 575 ], TOLERANCE);
        });

        test("positioned right", function() {
            createPlotArea(barSeriesData, {
                valueAxis: { labels: { mirror: true }, title: { position: "right" }}
            });

            titleBox = plotArea.axisX.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 757, 560, 789, 575 ], TOLERANCE);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Title / Vertical", {
            setup: function() {
                createPlotArea(lineSeriesData);
                titleBox = plotArea.axisY.title.box;
            }
        });

        test("does not change line box height", function() {
            var box = plotArea.axisY.lineBox();
            arrayClose([box.y1, box.y2], [9, 576], TOLERANCE);
        });

        test("position at center", function() {
            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 0, 276.5, 15, 307.5 ], TOLERANCE);
        });

        test("positioned bottom", function() {
            createPlotArea(lineSeriesData, { valueAxis: { title: { position: "bottom" }}});
            titleBox = plotArea.axisY.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 0, 545, 16, 577 ], TOLERANCE);
        });

        test("positioned top", function() {
            createPlotArea(lineSeriesData, { valueAxis: { title: { position: "top" }}});
            titleBox = plotArea.axisY.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 0, 7.5, 15, 39.5 ], TOLERANCE);
        });

        test("renders color", function() {
            equal(title.options.fill.color, "red");
        });

        test("renders opacity", function() {
            equal(titleBackground.options.fill.opacity, 0.33);
        });

        test("renders zIndex", function() {
            equal(titleTextBox.options.zIndex, 1);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Mirrored / Title", {
            setup: function() {
                createPlotArea(lineSeriesData, { valueAxis: { labels: { mirror: true } } });
                titleBox = plotArea.axisY.title.box;
            }
        });

        test("does not change line box height", function() {
            var box = plotArea.axisY.lineBox();
            arrayClose([box.y1, box.y2], [9, 576], TOLERANCE);
        });

        test("position at center", function() {
            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 33, 276.5, 48, 307.5 ], TOLERANCE);
        });

        test("positioned bottom", function() {
            createPlotArea(lineSeriesData, {
                valueAxis: { labels: { mirror: true }, title: { position: "bottom" }}
            });

            titleBox = plotArea.axisY.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 33, 545, 48, 577 ], TOLERANCE);
        });

        test("positioned top", function() {
            createPlotArea(lineSeriesData, {
                valueAxis: { labels: { mirror: true }, title: { position: "top" }}
            });

            titleBox = plotArea.axisY.title.box;

            arrayClose([titleBox.x1, titleBox.y1, titleBox.x2, titleBox.y2],
                 [ 33, 7.5, 48, 39.5 ], TOLERANCE);
        });

    })();

    (function() {
        var chart,
            plotArea;

        function axisLabelClick(clickHandler, options) {
            chart = createChart($.extend(true, {
                series: [{
                    type: "line",
                    data: [1, 2, 3]
                }],
                axisLabelClick: clickHandler
            }, options));

            plotArea = chart._model.children[1];
            label = plotArea.valueAxis.labels[1];

            chart._userEvents.press(0, 0, getChartDomElement(label));
            chart._userEvents.end(0, 0);
        }

        // ------------------------------------------------------------
        module("Category Axis / Events / axisLabelClick", {
            teardown: destroyChart
        });

        test("fires when clicking axis labels", 1, function() {
            axisLabelClick(function() { ok(true); });
        });

        test("event arguments contain axis options", 1, function() {
            axisLabelClick(function(e) {
                equal(e.axis.type, "numeric");
            });
        });

        test("event arguments contain DOM element", 1, function() {
            axisLabelClick(function(e) {
                equal(e.element.length, 1);
            });
        });

        test("event arguments contain category index", 1, function() {
            axisLabelClick(function(e) {
                equal(e.index, 1);
            });
        });

        test("category index is correct when step is defined", 1, function() {
            axisLabelClick(function(e) {
                equal(e.index, 2);
            }, {
                valueAxis: {
                    labels: {
                        step: 2
                    }
                }
            });
        });

        test("event arguments contain category name as text", 1, function() {
            axisLabelClick(function(e) {
                equal(e.text, "0.5");
            });
        });

        test("event arguments contain category name as value", 1, function() {
            axisLabelClick(function(e) {
                equal(e.value, 0.5);
            });
        });

    })();

    (function() {
        var numericAxis,
            axisBox = new Box2D(0, 0, 800, 600);

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / translateRange", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, {});
                numericAxis.reflow(axisBox);
            }
        });

        test("positive delta translates range down", function() {
            r = numericAxis.translateRange(600);
            equal(Math.round(r.min), -1);
            equal(Math.round(r.max), 0);
        });

        test("negative delta translates range up", function() {
            r = numericAxis.translateRange(-600);
            equal(Math.round(r.min), 1);
            equal(Math.round(r.max), 2);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / Reverse / translateRange", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, { reverse: true });
                numericAxis.reflow(axisBox);
            }
        });

        test("positive delta translates range down", function() {
            r = numericAxis.translateRange(600);
            equal(Math.round(r.min), 1);
            equal(Math.round(r.max), 2);
        });

        test("negative delta translates range up", function() {
            r = numericAxis.translateRange(-600);
            equal(Math.round(r.min), -1);
            equal(Math.round(r.max), 0);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / translateRange", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, { vertical: false });
                numericAxis.reflow(axisBox);
            }
        });

        test("positive delta translates range right", function() {
            r = numericAxis.translateRange(800);
            equal(Math.round(r.min), 1);
            equal(Math.round(r.max), 2);
        });

        test("negative delta translates range right", function() {
            r = numericAxis.translateRange(-800);
            equal(Math.round(r.min), -1);
            equal(Math.round(r.max), 0);
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / Reverse / translateRange", {
            setup: function() {
                numericAxis = new NumericAxis(0, 1, { vertical: false, reverse: true });
                numericAxis.reflow(axisBox);
            }
        });

        test("positive delta translates range right", function() {
            r = numericAxis.translateRange(800);
            equal(Math.round(r.min), -1);
            equal(Math.round(r.max), 0);
        });

        test("negative delta translates range right", function() {
            r = numericAxis.translateRange(-800);
            equal(Math.round(r.min), 1);
            equal(Math.round(r.max), 2);
        });
    })();

    (function() {
        var ACTUAL_TICK_SIZE = 5;
        var MARGIN = 5;
        var axisBox;
        var axis;

        function LabelMock(box) {
            this.box = box;
            this.options = {};
            this.reflow = function(box) {
                this.box = box;
            };
        }

        // ------------------------------------------------------------
        module("Numeric Axis / Horizontal / reflow", {
            setup: function() {
                axis = new NumericAxis(0, 1, { vertical: false, margin: MARGIN });
                axis.labels = [new LabelMock(Box2D(0, 0, 20, 20)), new LabelMock(Box2D(0, 0, 20, 30))];
                axis.parent = {
                    box: new Box2D(0, 0, 100, 100),
                    getRoot: function() {
                        return this;
                    }
                };
                axisBox = new Box2D(0, 0, 50, 50);
                axis.getActualTickSize = function() {
                    return ACTUAL_TICK_SIZE;
                };
            }
        });

        test("box height is equal to the maximum label height plus the tick size plus the margin ", function() {
            axis.reflow(axisBox);
            equal(axis.box.height(), 30 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("box height includes title height if title is set", function() {
            axis.title = new LabelMock(Box2D(0, 0, 20, 40));
            axis.reflow(axisBox);
            equal(axis.box.height(), 70 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("only labels with height that can be fitted in the container box are taken into account", function() {
            axis.labels.push(new LabelMock(Box2D(0, 0, 20, 101 - ACTUAL_TICK_SIZE - MARGIN)));
            axis.reflow(axisBox);
            equal(axis.box.height(), 30 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("only labels with height that can be fitted in the container box including the title are taken into account", function() {
            axis.title = new LabelMock(Box2D(0, 0, 20, 40));
            axis.labels.push(new LabelMock(Box2D(0, 0, 20, 61 - ACTUAL_TICK_SIZE - MARGIN)));
            axis.reflow(axisBox);
            equal(axis.box.height(), 70 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("sets label rotation origin to top", function() {
            axis.reflow(axisBox);
            equal(axis.labels[0].options.rotationOrigin, "top");
        });

        test("sets label rotation origin to bottom if labels are mirrored", function() {
            axis.options.labels.mirror = true;
            axis.reflow(axisBox);
            equal(axis.labels[0].options.rotationOrigin, "bottom");
        });

        // ------------------------------------------------------------
        module("Numeric Axis / Vertical / reflow", {
            setup: function() {
                axis = new NumericAxis(0, 1, { vertical: true, margin: MARGIN });
                axis.labels = [new LabelMock(Box2D(0, 0, 20, 20)), new LabelMock(Box2D(0, 0, 30, 20))];
                axis.parent = {
                    box: new Box2D(0, 0, 100, 100),
                    getRoot: function() {
                        return this;
                    }
                };
                axisBox = new Box2D(0, 0, 50, 50);
                axis.getActualTickSize = function() {
                    return ACTUAL_TICK_SIZE;
                };
            }
        });

        test("box width is equal to the maximum label width plus the tick size plus the margin", function() {
            axis.reflow(axisBox);
            equal(axis.box.width(), 30 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("box width includes title width if title is set", function() {
            axis.title = new LabelMock(Box2D(0, 0, 40, 20));
            axis.reflow(axisBox);
            equal(axis.box.width(), 70 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("only labels with width that can be fitted in the container box are taken into account", function() {
            axis.labels.push(new LabelMock(Box2D(0, 0, 101 - ACTUAL_TICK_SIZE - MARGIN, 20)));
            axis.reflow(axisBox);
            equal(axis.box.width(), 30 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("only labels with width that can be fitted in the container box including the title are taken into account", function() {
            axis.title = new LabelMock(Box2D(0, 0, 40, 20));
            axis.labels.push(new LabelMock(Box2D(0, 0, 61 - ACTUAL_TICK_SIZE - MARGIN, 20)));
            axis.reflow(axisBox);
            equal(axis.box.width(), 70 + ACTUAL_TICK_SIZE + MARGIN);
        });

        test("sets label rotation origin to right", function() {
            axis.reflow(axisBox);
            equal(axis.labels[0].options.rotationOrigin, "right");
        });

        test("sets label rotation origin to bottom if labels are mirrored", function() {
            axis.options.labels.mirror = true;
            axis.reflow(axisBox);
            equal(axis.labels[0].options.rotationOrigin, "left");
        });

    })();

    (function() {
        var axisBox;
        var axis;

        function LabelMock(box) {
            this.box = box;
            this.options = {};
            this.reflow = $.noop;
        }

        function setupAxis(options) {
            axis = new NumericAxis(0, 1, kendo.deepExtend({
                vertical: false,
                labels: {
                    rotation: "auto"
                },
                majorUnit: 0.5,
                max: 1,
                min: 0
            }, options));
            axisBox = new Box2D(0, 0, 50, 50);
            axis.labels = [new LabelMock(Box2D(0, 0, 20, 20)), new LabelMock(Box2D(0, 0, 30, 20))];
        }

        // ------------------------------------------------------------
        module("Numeric Axis / autoRotateLabels", {
            setup: function() {
                setupAxis();
            }
        });

        test("rotates labels with -45 degrees if there is a label with width bigger than the slot width", function() {
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            equal(axis.labels[0].options.rotation, -45);
            equal(axis.labels[1].options.rotation, -45);
        });

        test("rotates labels with -90 degrees if there is a label with height bigger than the slot width", function() {
            axis.labels[1].box.y2 = 30;
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            equal(axis.labels[0].options.rotation, -90);
            equal(axis.labels[1].options.rotation, -90);
        });

        test("does not rotate labels with -90 degrees if there is a label with height bigger than the slot width but its width is smaller", function() {
            axis.labels[1].box.x2 = 20;
            axis.labels[1].box.y2 = 30;
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            ok(!axis.labels[0].options.rotation);
            ok(!axis.labels[1].options.rotation);
        });

        test("reflows rotated labels", 2, function() {
            axis.reflow(axisBox);
            axis.labels[0].reflow = axis.labels[1].reflow = function() {
                ok(true);
            };
            axis.autoRotateLabels();
        });

        test("does not rotate labels if there isn't a label with width bigger than the slot width", function() {
            axis.labels[1].box.x1 = 20;
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            ok(!axis.labels[0].options.rotation);
            ok(!axis.labels[1].options.rotation);
        });

        test("does not rotate labels if the axis is vertical", function() {
            axis.options.vertical = true;
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            ok(!axis.labels[0].options.rotation);
            ok(!axis.labels[1].options.rotation);
        });

        test("does not rotate labels if auto rotation is not enabled", function() {
            setupAxis({
                labels: {
                    rotation: 0
                }
            });
            axis.reflow(axisBox);
            axis.autoRotateLabels();

            ok(!axis.labels[0].options.rotation);
            ok(!axis.labels[1].options.rotation);
        });
    })();

})();
