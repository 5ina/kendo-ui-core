 (function() {
        var kendo = window.kendo,
            dataviz = kendo.dataviz,
            Box = dataviz.Box2D,
            DEFAULT_CAPS_WIDTH = 4,
            ErrorBarBase = dataviz.ErrorBarBase,
            CategoricalErrorBar = dataviz.CategoricalErrorBar,
            ScatterErrorBar = dataviz.ScatterErrorBar,
            ErrorRangeCalculator = dataviz.ErrorRangeCalculator,
            ErrorRange = function(low, high){
                this.low = low;
                this.high = high;
            },
            SCATTER = "scatter", SCATTER_LINE = "scatterLine", BUBBLE = "bubble",
            BAR = "bar", COLUMN = "column", LINE = "line", VERTICAL_LINE = "verticalLine", AREA = "area",
            testData = [{value: 1},{value: 6}, {value: 3}, {value: -1}],
            testDataWidthZeros = [{value: 1},{value: 10}, {value: 0}, {value: -1}, {value: 0}],
            testSeries = {data: testDataWidthZeros, type: BAR},
            average = 2.25,
            averageWithZeros = 2,
            valueGetter = function(d) {return d.value},
            mockErrorRangeCalculator = kendo.deepExtend({
                valueGetter: valueGetter
            }, ErrorRangeCalculator.fn);


        function MethodMocker(){
            this._original = {};
        }

        MethodMocker.prototype = {
            mock: function(fn, fnName, callback, replace){
                var that = this;
                that._original[fnName] = fn[fnName];
                fn[fnName] = function(){
                    if(replace){
                        return  callback.apply(this, arguments);
                    }
                    callback.apply(this, arguments);
                    return that._original[fnName].apply(this, arguments);
                };
            },
            restore: function(fn,fnName){
                fn[fnName] = this._original[fnName];
                delete this._original[fnName];
            }
        };
        var methodMocker = new MethodMocker();
        // ------------------------------------------------------------

        module("ErrorRangeCalculator / value getter / XY chart ", {
        });

        test("correct value getter is created for array xField when using XY chart", function() {
            var value = 1,
                item = [value, 2],
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "array xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "array xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "array xField for bubble chart");
        });

        test("correct value getter is created for array yField when using XY chart", function() {
            var value = 2,
                item = [1, value],
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "array yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "array yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "array yField for bubble chart");
        });

        test("correct value getter is created for object default xField when using XY chart", function() {
            var value = 1,
                item = {x: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "default xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "default xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "default xField for bubble chart");
        });

        test("correct value getter is created for object default yField when using XY chart", function() {
            var value = 1,
                item = {y: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "default yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "default yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "default yField for bubble chart");
        });

        test("correct value getter is created for object custom xField when using XY chart", function() {
            var value = 1,
                item = {foo: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: SCATTER}, "x"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: SCATTER_LINE}, "x"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], xField: "foo", type: BUBBLE}, "x");
            ok(valueGetterScatter(item) === value, "custom xField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "custom xField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "custom xField for bubble chart");
        });

        test("correct value getter is created for object custom yField when using XY chart", function() {
            var value = 1,
                item = {foo: value},
                valueGetterScatter = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: SCATTER}, "y"),
                valueGetterScatterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: SCATTER_LINE}, "y"),
                valueGetterBubble = ErrorRangeCalculator.fn.createValueGetter({data: [item], yField: "foo", type: BUBBLE}, "y");
            ok(valueGetterScatter(item) === value, "custom yField for scatter chart");
            ok(valueGetterScatterLine(item) === value, "custom yField for scatterLine chart");
            ok(valueGetterBubble(item) === value, "custom yField for bubble chart");
        });

        // ------------------------------------------------------------

        module("ErrorRangeCalculator / value getter / categorical chart ", {
        });

        test("correct value getter is created for plain value when using categorical chart", function() {
            var value = 1,
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: AREA}, "value");

            ok(valueGetterBar(value) === value, "plain value for bar chart");
            ok(valueGetterColumn(value) === value, "plain value for column chart");
            ok(valueGetterLine(value) === value, "plain value for line chart");
            ok(valueGetterVerticalLine(value) === value, "plain value for vertical line chart");
            ok(valueGetterArea(value) === value, "plain value for area chart");
        });

        test("correct value getter is created for plain value when the first value is zero", function() {
            var value = 0,
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [value], type: AREA}, "value");

            ok(valueGetterBar(value) === value, "plain value for bar chart");
            ok(valueGetterColumn(value) === value, "plain value for column chart");
            ok(valueGetterLine(value) === value, "plain value for line chart");
            ok(valueGetterVerticalLine(value) === value, "plain value for vertical line chart");
            ok(valueGetterArea(value) === value, "plain value for area chart");
        });

        test("correct value getter is created for object default value field when using categorical chart", function() {
            var value = 1,
                item = {value: value, category: "category"},
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [item], type: AREA}, "value");

            ok(valueGetterBar(item) === value, "default value field for bar chart");
            ok(valueGetterColumn(item) === value, "default value field for column chart");
            ok(valueGetterLine(item) === value, "default value field for line chart");
            ok(valueGetterVerticalLine(item) === value, "default value field for vertical line chart");
            ok(valueGetterArea(item) === value, "default value field for area chart");
        });

        test("correct value getter is created for object custom value field when using categorical chart", function() {
            var value = 1,
                item = {foo: value, category: "category"},
                valueGetterBar = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: BAR}, "value"),
                valueGetterColumn = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: COLUMN}, "value"),
                valueGetterLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: LINE}, "value"),
                valueGetterVerticalLine = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: VERTICAL_LINE}, "value"),
                valueGetterArea = ErrorRangeCalculator.fn.createValueGetter({data: [item], field: "foo", type: AREA}, "value");

            ok(valueGetterBar(item) === value, "default value field for bar chart");
            ok(valueGetterColumn(item) === value, "default value field for column chart");
            ok(valueGetterLine(item) === value, "default value field for line chart");
            ok(valueGetterVerticalLine(item) === value, "default value field for vertical line chart");
            ok(valueGetterArea(item) === value, "default value field for area chart");
        });

        // ------------------------------------------------------------

        module("ErrorRangeCalculator / calculations", {
        });

        test("correct average value is calculated", function() {
            var calculatedAverage,
                calculatedAverageWithZeros,
                expectedAverage = average,
                expectedAverageWithZeros = averageWithZeros;
            calculatedAverage = mockErrorRangeCalculator.getAverage(testData);
            calculatedAverageWithZeros = mockErrorRangeCalculator.getAverage(testDataWidthZeros);
            equal(calculatedAverage.value, expectedAverage, "average value");
            equal(calculatedAverageWithZeros.value, expectedAverageWithZeros, "average value with zeros");
        });

        test("correct average count is calculated", function() {
            var calculatedAverage = mockErrorRangeCalculator.getAverage(testData),
                expectedCount = testData.length;

            equal(calculatedAverage.count, expectedCount, "average count");
        });

        test("average value when there are missing values", function() {
            var data = [{value: 1},{}, {value: 3}],
                calculatedAverage = mockErrorRangeCalculator.getAverage(data);

            equal(calculatedAverage.value, 2, "average value");
        });

        test("average count when there are missing values", function() {
            var data = [{value: 1},{}, {value: 3}],
                calculatedAverage = mockErrorRangeCalculator.getAverage(data);

            equal(calculatedAverage.count, 2, "average value");
        });

        test("correct sample standard deviation is calculated", function() {
            var calculatedSampleSD,
                calculatedSampleSDWithZeros,
                expectedSampleSD = 2.986,
                expectedSampleSDWithZeros = 4.528;

            calculatedSampleSD = mockErrorRangeCalculator.getStandardDeviation(testData, {value: average, count: 4}, true);
            calculatedSampleSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros, {value: averageWithZeros, count: 5 }, true);
            equal(calculatedSampleSD.toFixed(3), expectedSampleSD, "sample standard deviation value");
            equal(calculatedSampleSDWithZeros.toFixed(3), expectedSampleSDWithZeros, "sample standard deviation with zeros value");
        });

        test("correct sample standard deviation with missing values", function() {
            var calculatedSampleSD,
                calculatedSampleSDWithZeros,
                expectedSampleSD = 2.986,
                expectedSampleSDWithZeros = 4.528;

            calculatedSampleSD = mockErrorRangeCalculator.getStandardDeviation(testData.concat({}), {value: average, count: 4}, true);
            calculatedSampleSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros.concat({}), {value: averageWithZeros, count: 5 }, true);
            equal(calculatedSampleSD.toFixed(3), expectedSampleSD, "sample standard deviation value");
            equal(calculatedSampleSDWithZeros.toFixed(3), expectedSampleSDWithZeros, "sample standard deviation with zeros value");
        });

        test("correct population standard deviation is calculated", function() {
            var calculatedSD,
                calculatedSDWithZeros,
                expectedSD = 2.586,
                expectedSDWithZeros = 4.050;

            calculatedSD = mockErrorRangeCalculator.getStandardDeviation(testData, {value: average, count: 4}, false);
            calculatedSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros, {value: averageWithZeros, count: 5 }, false);
            equal(calculatedSD.toFixed(3), expectedSD, "population standard deviation value");
            equal(calculatedSDWithZeros.toFixed(3), expectedSDWithZeros, "population standard deviation with zeros value");
        });

        test("correct population standard deviation with missing values", function() {
            var calculatedSD,
                calculatedSDWithZeros,
                expectedSD = 2.586,
                expectedSDWithZeros = 4.050;

            calculatedSD = mockErrorRangeCalculator.getStandardDeviation(testData.concat({}), {value: average, count: 4}, false);
            calculatedSDWithZeros = mockErrorRangeCalculator.getStandardDeviation(testDataWidthZeros.concat({}), {value: averageWithZeros, count: 5 }, false);
            equal(calculatedSD.toFixed(3), expectedSD, "population standard deviation value");
            equal(calculatedSDWithZeros.toFixed(3), expectedSDWithZeros, "population standard deviation with zeros value");
        });

        test("correct standard error is calculated", function() {
            var calculatedSE,
                calculatedSEWithZeros,
                expectedSE = 1.493,
                expectedSEWithZeros = 2.025;

            calculatedSE = mockErrorRangeCalculator.getStandardError(testData, {value: average, count: 4});
            calculatedSEWithZeros = mockErrorRangeCalculator.getStandardError(testDataWidthZeros, {value: averageWithZeros, count: 5 });
            equal(calculatedSE.toFixed(3), expectedSE, "standard error value");
            equal(calculatedSEWithZeros.toFixed(3), expectedSEWithZeros, "standard error with zeros value");
        });

        test("correct standard error with missing values", function() {
            var calculatedSE,
                calculatedSEWithZeros,
                expectedSE = 1.493,
                expectedSEWithZeros = 2.025;

            calculatedSE = mockErrorRangeCalculator.getStandardError(testData.concat({}), {value: average, count: 4});
            calculatedSEWithZeros = mockErrorRangeCalculator.getStandardError(testDataWidthZeros.concat({}), {value: averageWithZeros, count: 5 });
            equal(calculatedSE.toFixed(3), expectedSE, "standard error value");
            equal(calculatedSEWithZeros.toFixed(3), expectedSEWithZeros, "standard error with zeros value");
        });


        // ------------------------------------------------------------

        module("ErrorRangeCalculator / get error range", {
        });

        var correctErrorRanges = function(value, errorRangeCalculator, testData, expected){
            var length = testData.length,
                actual;

            for(var idx = 0; idx < length; idx++){
                actual = errorRangeCalculator.getErrorRange(testData[idx].value, value);
                if(actual.low !== expected[idx].low || actual.high !== expected[idx].high){
                    return false;
                }
            }

            return true;
        };

        test("correct error ranges with plain value", function() {
            var value = 1,
                expectedRanges = [new ErrorRange(0,2), new ErrorRange(9,11), new ErrorRange(-1,1), new ErrorRange(-2,0), new ErrorRange(-1,1)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(value, errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with array value", function() {
            var value = [1,2],
                expectedRanges = [new ErrorRange(0,3), new ErrorRange(9,12), new ErrorRange(-1,2), new ErrorRange(-2,1), new ErrorRange(-1,2)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(value, errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with percentage value", function() {
            var value = "percentage(5)",
                expectedRanges = [new ErrorRange(1 - 0.05, 1 + 0.05), new ErrorRange(10 - 0.5, 10 + 0.5), new ErrorRange(0,0), new ErrorRange(-1 -0.05, -1 + 0.05), new ErrorRange(0,0)],
                errorRangeCalculator = new ErrorRangeCalculator(value, testSeries, "value");

            ok(correctErrorRanges(value, errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("standard deviation is calculated only once", function() {
            var calls = 0,
                errorRangeCalculator;
                methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                    calls++;
                });

            errorRangeCalculator = new ErrorRangeCalculator("stddev", testSeries, "value");
            for(var idx = 0; idx < testSeries.data.length; idx++){
                errorRangeCalculator.getErrorRange(testSeries.data[idx].value);
            }
            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("correct error ranges with basic standard deviation", function() {
            var expectedSD = 4.049691346263317,
                errorRange = new ErrorRange(averageWithZeros - expectedSD, averageWithZeros + expectedSD),
                expectedRanges = [errorRange, errorRange, errorRange, errorRange, errorRange],
                errorRangeCalculator = new ErrorRangeCalculator("stddev", testSeries, "value");

            ok(correctErrorRanges("stddev", errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("correct error ranges with multiple standard deviation", function() {
            var expectedSD = 4.049691346263317,
                errorRange = new ErrorRange(averageWithZeros - 2 * expectedSD, averageWithZeros + 2 * expectedSD),
                expectedRanges = [errorRange, errorRange, errorRange, errorRange, errorRange],
                errorRangeCalculator = new ErrorRangeCalculator("stddev(2)", testSeries, "value");

            ok(correctErrorRanges("stddev(2)", errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        test("standard error is calculated only once", function() {
            var calls = 0,
                errorRangeCalculator;
                methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                    calls++;
                });

            errorRangeCalculator = new ErrorRangeCalculator("stderr", testSeries, "value");
            for(var idx = 0; idx < testSeries.data.length; idx++){
                errorRangeCalculator.getErrorRange(testSeries.data[idx].value);
            }
            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("correct error ranges with standard error", function() {
            var expectedSE = 2.024845673131659,
                expectedRanges = [new ErrorRange(1 - expectedSE, 1 + expectedSE), new ErrorRange(10 - expectedSE, 10 + expectedSE),
                    new ErrorRange(0 - expectedSE, 0 + expectedSE), new ErrorRange(-1 - expectedSE, -1 + expectedSE), new ErrorRange(0 - expectedSE, 0 + expectedSE)],
                errorRangeCalculator = new ErrorRangeCalculator("stderr", testSeries, "value");

            ok(correctErrorRanges("stderr", errorRangeCalculator, testDataWidthZeros, expectedRanges));
        });

        // ------------------------------------------------------------

        module("scatter chart error bar", {
        });


        var xAxisName = "xName",
            yAxisName = "yName",
            xErrorValue = 3,
            yErrorValue = 2,
            expectedXAxisMax = 5,
            expectedXAxisMin = -2,
            expectedYAxisMax = 4,
            expectedYAxisMin = -1,
            dataArraySeries = { data: [[1, 1], [2, 2]], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" },
            dataDefaultFieldsSeries = { data: [{x: 1, y: 1}, {x: 2, y: 2}], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" },
            dataCustomFieldsSeries = { data: [{fooX: 1, fooY: 1}, {fooX: 2, fooY: 2}], xField: "fooX", yField: "fooY", xAxis: xAxisName, yAxis: yAxisName, errorBars:{ xValue: xErrorValue, yValue: yErrorValue }, labels: {}, type: "scatter" };

        function addedScatterPointErrorBars(points, seriesData, xGetter, yGetter, xValues, yValues){
            var idx = 0,
                errorBars,
                xValue,
                yValue;

            for(;idx < points.length; idx++){
                xValue = xValues ? xValues[idx] : xErrorValue;
                yValue = yValues ? yValues[idx] : yErrorValue;
                if(!(errorBars = points[idx].errorBars) || !errorBars[0] || !errorBars[1] ||
                    errorBars[0].low != (xGetter(seriesData[idx]) - xValue) || errorBars[0].high != (xGetter(seriesData[idx]) + xValue) ||
                    errorBars[1].low != (yGetter(seriesData[idx]) - yValue) || errorBars[1].high != (yGetter(seriesData[idx]) + yValue ||
                    errorBars[0].isVertical || !errorBars[1].isVertical)){
                    return false;
                }
            }
            return true;
        }

        function addedScatterPointValues(points, expectedValues, field){
            var addedValues = true;
            for(var idx = 0;idx < points.length; idx++){
                addedValues = addedValues && points[idx][field + "Low"] === expectedValues[idx][field + "Low"] &&
                    points[idx][field + "High"] === expectedValues[idx][field + "High"];
            }
            return addedValues;
        }

        test("low and high values are added to scatter points", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                points = scatterChart.points,
                expectedValues = [{xLow: -2, xHigh: 4, yLow: -1, yHigh: 3},{xLow: -1, xHigh: 5, yLow: 0, yHigh: 4}];

            ok(addedScatterPointValues(points, expectedValues, "x"));
            ok(addedScatterPointValues(points, expectedValues, "y"));
        });

        test("error bars are correctly added to scatter points for array data", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                seriesData = dataArraySeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d[0]},
                yGetter = function(d) {return d[1]};


            ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("scatter axis ranges are updated when using array data", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataArraySeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];

            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("error bars are correctly added to scatter points for objects with default fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataDefaultFieldsSeries]}),
                seriesData = dataDefaultFieldsSeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d.x},
                yGetter = function(d) {return d.y};

             ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("scatter axis ranges are updated when using objects with default fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataDefaultFieldsSeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];


            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("error bars are correctly added to scatter points for objects with custom fields names", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [dataCustomFieldsSeries]}),
                seriesData = dataCustomFieldsSeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d.fooX},
                yGetter = function(d) {return d.fooY};

             ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter));
        });

        test("error bars are not added to scatter date axis points", function() {
            var scatterChart = new dataviz.ScatterChart({}, {series: [{ type: "scatter", data: [{date: new Date(), y: 1}, {date: new Date(), y : 2}], xField: "date", yField: "y",errorBars: {xValue: 10}}]}),
                seriesData = dataCustomFieldsSeries.data,
                points = scatterChart.points,
                addedErrorBars = false;
             for(var idx = 0; idx < points.length; idx++){
                addedErrorBars = addedErrorBars || points[idx].errorBars != undefined;
             }

             ok(!addedErrorBars);
        });

        test("scatter axis ranges are updated when using objects with custom fields names", function() {
            var scatterChart =  new dataviz.ScatterChart({}, {series: [dataCustomFieldsSeries]}),
                xRanges = scatterChart.xAxisRanges[xAxisName],
                yRanges = scatterChart.yAxisRanges[yAxisName];

            equal(xRanges.max, expectedXAxisMax, "xAxis max range is updated");
            equal(xRanges.min, expectedXAxisMin, "xAxis min range is updated");
            equal(yRanges.max, expectedYAxisMax, "yAxis max range is updated");
            equal(yRanges.min, expectedYAxisMin, "yAxis min range is updated");
        });

        test("correct error ranges with custom function when using scatter chart", function() {
            var xIdx = 0,
                yIdx = 0,
                xValues = [1, 2],
                yValues = [3, 4]
                customXRange = function(data){
                    return [xValues[xIdx], xValues[xIdx++]];
                },
                customYRange = function(data){
                    return [yValues[yIdx], yValues[yIdx++]];
                },
                scatterChart = new dataviz.ScatterChart({}, {series: [{ data: [[1, 1], [2, 2]], xAxis: xAxisName, yAxis: yAxisName, errorBars: { xValue: customXRange, yValue: customYRange }, labels: {}, type: "scatter" }]}),
                seriesData = dataArraySeries.data,
                points = scatterChart.points,
                xGetter = function(d) {return d[0]},
                yGetter = function(d) {return d[1]};

            ok(addedScatterPointErrorBars(points, seriesData, xGetter, yGetter, xValues, yValues));
        });

        // ------------------------------------------------------------

        module("categorical chart error bar", {
        });

        var errorValue = 3,
            axisName = "axisName",
            expectedMinRange = -2,
            expectedMaxRange = 6,
            categoricalPlotArea = {seriesCategoryAxis: function(){return { options: {}}}},
            categoricalArrayData = [1,2,3],
            categoricalNegativeArrayData = [-1, -2 , -3],
            categoricalMixedArrayData = [-1,-3, 1],
            errorBars = {value: errorValue};

        function createCategoricalSeries(seriesData, type){
            var idx,
                series = [],
                data = seriesData,
                length = data.length;
            for(idx = 0; idx < length; idx++){
                series.push({data: data[idx], axis: axisName, type: type, errorBars: errorBars});
            }
            return series;
        }

        function createCategoricalChart(data, type, stacked){
            var chart,
                isStacked = stacked || false;
            if(type === BAR){
                chart = new dataviz.BarChart(categoricalPlotArea, {series: createCategoricalSeries(data, BAR), invertAxes: true, isStacked: isStacked});
            }

            if(type == COLUMN){
                 chart = new dataviz.BarChart(categoricalPlotArea, {series: createCategoricalSeries(data, COLUMN), invertAxes: false, isStacked: isStacked});
            }

            if(type == LINE){
                chart = new dataviz.LineChart(categoricalPlotArea, {series: createCategoricalSeries(data, LINE), invertAxes: false, isStacked: isStacked});
            }

            if(type == VERTICAL_LINE){
                    chart = new dataviz.LineChart(categoricalPlotArea, {series: createCategoricalSeries(data, LINE), invertAxes: true, isStacked: isStacked});
            }

            if(type == AREA){
                chart = new dataviz.AreaChart(categoricalPlotArea, {series: createCategoricalSeries(data, AREA), invertAxes: false, isStacked: isStacked});
            }

            return chart;
        }

        function addedCategoricalPointErrorBar(points, seriesData, getter, isVertical, values) {
            var idx = 0,
                errorBars,
                value;

            for(;idx < points.length; idx++){
                value = values ? values[idx] : errorValue;
                if(!(errorBars = points[idx].errorBars) || !errorBars[0] ||
                    errorBars[0].low != (getter(seriesData[idx]) - value) || errorBars[0].high != (getter(seriesData[idx]) + value) ||
                    errorBars[0].isVertical !== isVertical){
                    return false;
                }
            }
            return true;
        }

        function addedStackedLinePointErrorBar(points, seriesData){
            var seriesIdx = 0,
                idx = 0,
                errorBars,
                length,
                currentIdx,
                plotValue;
            for(; seriesIdx < seriesData.length; seriesIdx++){
                 length = seriesData[seriesIdx].length;
                 currentIdx = idx;
                 for(;idx < length + currentIdx; idx++){
                    plotValue = points[idx].parent.plotRange(points[idx])[0];
                    if(!(errorBars = points[idx].errorBars) || !errorBars[0] ||
                        errorBars[0].low != (plotValue - errorValue) || errorBars[0].high != (plotValue + errorValue) ||
                        errorBars[0].isVertical !== true){
                        return false;
                    }
                }
            }

            return true;
        }

        function addedStackedBarPointErrorBar(points, seriesData){
            var seriesIdx = 0,
                idx = 0,
                categoryIdx,
                errorBars,
                seriesCount = seriesData.length,
                positiveTotals = [],
                negativeTotals = [],
                value,
                plotValue;

            for(; seriesIdx < seriesCount; seriesIdx++){
                 currentIdx = idx;
                 for(;idx < seriesCount + currentIdx; idx++){
                    value = points[idx].value;
                    categoryIdx = Math.floor(idx / seriesCount);
                    if(value > 0){
                       positiveTotals[categoryIdx] = (positiveTotals[categoryIdx] || 0) + value;
                       plotValue =  positiveTotals[categoryIdx];
                    }
                    else{
                       negativeTotals[categoryIdx] = (negativeTotals[categoryIdx] || 0) + value;
                       plotValue =  negativeTotals[categoryIdx];
                    }

                    var errorBar = points[idx].errorBars[0];
                    equal(errorBar.low, plotValue - errorValue, "Low value");
                    equal(errorBar.high, plotValue + errorValue, "High value");
                    ok(!errorBar.isVertical, "Should be horizontal");
                }
            }
        }

        function addedCategoricalPointValues(points, values){
            equal(points.length, values.length, "Number of points");
            for(var idx = 0; idx < points.length; idx++){
                deepEqual([points[idx].low, points[idx].high],
                          [values[idx].low, values[idx].high],
                         "Difference at index " + idx);
            }
        }

        test("low and high value are added to bar points", function(){
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -1, high: 5},{low: 0, high: 6}];

            addedCategoricalPointValues(points, expectedValues);
        });

        test("low and high value are added to stacked bar points", function(){
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], BAR, true),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -2, high: 4},{low: -1, high: 5},{low: -1, high: 5},{low: 0, high: 6},{low: 0, high: 6}];

            addedCategoricalPointValues(points, expectedValues);
        });

        test("low and high value are added to line points", function(){
            var chart = createCategoricalChart([categoricalArrayData], LINE),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -1, high: 5},{low: 0, high: 6}];

            addedCategoricalPointValues(points, expectedValues);
        });

        test("low and high value are added to stacked line points", function(){
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                points = chart.points,
                expectedValues = [{low: -2, high: 4},{low: -2, high: 4},{low: -1, high: 5},{low: -1, high: 5},{low: 0, high: 6},{low: 0, high: 6}];

            addedCategoricalPointValues(points, expectedValues);
        });

        test("horizontal error bars are correctly added to categorical points for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                points = chart.points,
                getter = function(d) {return d};

            ok(addedCategoricalPointErrorBar(points, categoricalArrayData, getter, false));
        });

        test("horizontal error bars are correctly added to categorical points for objects with default fields data", function() {
            var chart = createCategoricalChart([testDataWidthZeros], BAR),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, false));
        });

        test("horizontal error bars are correctly added to categorical points for objects with custom fields data", function() {
            var chart = createCategoricalChart([{foo: 1},{foo: 10}, {foo: 0}, {foo: -1}, {foo: 0}], BAR),
                points = chart.points,
                getter = function(d){return d.foo};

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, false));
        });

        test("vertical error bars are correctly added to categorical points for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], COLUMN),
                points = chart.points,
                getter = function(d) {return d};

            ok(addedCategoricalPointErrorBar(points, categoricalArrayData, getter, true));
        });

        test("vertical error bars are correctly added to categorical points for objects with default fields data", function() {
            var chart = createCategoricalChart([testDataWidthZeros], COLUMN),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, true));
        });

        test("vertical error bars are correctly added to categorical points for objects with custom fields data", function() {
            var chart = createCategoricalChart([{foo: 1},{foo: 10}, {foo: 0}, {foo: -1}, {foo: 0}], COLUMN),
                points = chart.points,
                getter = function(d){return d.foo};

            ok(addedCategoricalPointErrorBar(points, testDataWidthZeros, getter, true));
        });

        test("errorBars are correctly added when using custom function and categoricalChart", function() {
            var idx = 0,
                values = [1, 2, 3]
                customRange = function(data){
                    return [values[idx], values[idx++]];
                },
                data = [{value: 1},{value: 2},{value: 3}],
                chart = new dataviz.BarChart(categoricalPlotArea, {series: [{type: BAR, data: data, errorBars: {value: customRange}}],invertAxes: true}),
                points = chart.points,
                getter = valueGetter;

            ok(addedCategoricalPointErrorBar(points, data, getter, false, values));
        });

        test("value ranges are correctly updated for array data", function() {
            var chart = createCategoricalChart([categoricalArrayData], BAR),
                valueRanges = chart.valueAxisRanges.axisName;
            equal(valueRanges.min, expectedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked line data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -2,
                expectedStackedMaxRange = 9;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for negative positive stacked line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -6,
                expectedStackedMaxRange =  3;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for mixed stacked line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], LINE, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -8,
                expectedStackedMaxRange =  2;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked column data", function() {
          var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -2,
                expectedStackedMaxRange = 9;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked column data when there are only positive totals", function() {
          var chart = createCategoricalChart([[10, 15],[10, 15]], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = 10,
                expectedStackedMaxRange = 33;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for stacked column data when there are only negative totals", function() {
          var chart = createCategoricalChart([[-10, -15],[-10, -15]], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -33,
                expectedStackedMaxRange = -10;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for negative positive stacked column data", function() {
              var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -6,
                expectedStackedMaxRange = 6;

            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("value ranges are correctly updated for mixed stacked column data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], COLUMN, true),
                valueRanges = chart.valueAxisRanges.axisName,
                expectedStackedMinRange = -8,
                expectedStackedMaxRange =  4;
            equal(valueRanges.min, expectedStackedMinRange, "Min range is correctly updated");
            equal(valueRanges.max, expectedStackedMaxRange, "Max range is correctly updated")
        });

        test("errorBars are correctly calculated for stacked positive line data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalArrayData,categoricalArrayData]));
        });

        test("errorBars are correctly calculated for stacked negative positive line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalNegativeArrayData,categoricalArrayData]));
        });

        test("errorBars are correctly calculated for stacked mixed line data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalMixedArrayData], LINE, true),
                points = chart.points;

            ok(addedStackedLinePointErrorBar(points, [categoricalNegativeArrayData,categoricalMixedArrayData]));
        });

        test("errorBars are correctly calculated for stacked positive bar data", function() {
            var chart = createCategoricalChart([categoricalArrayData,categoricalArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalArrayData,categoricalArrayData]);
        });

        test("errorBars are correctly calculated for stacked negative positive bar data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData,categoricalArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalNegativeArrayData, categoricalArrayData]);
        });

        test("errorBars are correctly calculated for stacked mixed bar data", function() {
            var chart = createCategoricalChart([categoricalNegativeArrayData, categoricalMixedArrayData], BAR, true),
                points = chart.points;

            addedStackedBarPointErrorBar(points, [categoricalNegativeArrayData, categoricalMixedArrayData]);
        });

        test("ErrorRangeCalculator is created only for series with errorbars", function() {
            var chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, errorBars: {value: errorValue}, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]}),
            points = chart.points,
            length = points.length,
            isCreatedForFirstSeries = true,
            isNotCreatedForSecondSeries = true;

            for(var idx = 0; idx < length; idx++){
                if(idx % 2 === 0){
                    isCreatedForFirstSeries = isCreatedForFirstSeries && points[idx].errorBars !== undefined;
                }
                else{
                    isNotCreatedForSecondSeries = isNotCreatedForSecondSeries && points[idx].errorBars === undefined;
                }
            }

            ok(isCreatedForFirstSeries, "created for series with errorbar");
            ok(isNotCreatedForSecondSeries, "not created for series without errorbar");
        });

        test("ErrorRangeCalculator is created only for series with errorbars reverse", function() {
            var chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: errorValue}}]}),
            points = chart.points,
            length = points.length,
            isCreatedForFirstSeries = true,
            isNotCreatedForSecondSeries = true;

            for(var idx = 0; idx < length; idx++){
                if(idx % 2 === 1){
                    isCreatedForFirstSeries = isCreatedForFirstSeries && points[idx].errorBars !== undefined;
                }
                else{
                    isNotCreatedForSecondSeries = isNotCreatedForSecondSeries && points[idx].errorBars === undefined;
                }
            }

            ok(isCreatedForFirstSeries, "created for series with errorbar");
            ok(isNotCreatedForSecondSeries, "not created for series without errorbar");
        });

        test("standard deviation is not calculated for series without sd set", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]});


            equal(calls, 0);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard deviation is calculated once for each series", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}}]});

            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard deviation is calculated once for each series when multuple series with sd are used", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardDeviation", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stddev"}}]});

            equal(calls, 2);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardDeviation");
        });

        test("standard error is not calculated for series without se set", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData}]});

            equal(calls, 0);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("standard error is calculated once for each series", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}}]});

            equal(calls, 1);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        test("standard error is calculated once for each series when multuple series with se are used", function() {
            var calls = 0,
                chart;
            methodMocker.mock(ErrorRangeCalculator.fn, "getStandardError", function(){
                calls++;
            });
            chart = new dataviz.LineChart(categoricalPlotArea, {series: [{type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}},
                {type: LINE, data: categoricalArrayData, errorBars: {value: "stderr"}}]});

            equal(calls, 2);
            methodMocker.restore(ErrorRangeCalculator.fn, "getStandardError");
        });

        var defaultOptions = {
                endCaps: true,
                color: "red",
                line: {
                    width: 1
                }
            },
        expectedOptions = {
            stroke: {
                color: "red",
                width: 1
            },
            zIndex: 1
        },
        equalFields = function(a, b){
            var areEqual = true;
            if($.isArray(a)){
                if(!$.isArray(b) || a.length != b.length){
                    return false;
                }
                for(var idx = 0; idx < a.length; idx++){
                    areEqual = areEqual && equalFields(a[idx], b[idx]);
                }
                return areEqual;
            }
            if(typeof a === "object"){
                for(var field in a){
                    areEqual = areEqual && equalFields(a[field], b[field]);
                }
                return areEqual;
            }

            return a === b;
        },
        getSlot =  function(a, b){
           return new Box(a, a, b, b);
        },
        valueAxis = {
            getSlot: getSlot,
            startValue: function() {
                return 0;
            }
        },
        xAxis = {
            getSlot: getSlot
        },
        yAxis = {
            getSlot: getSlot
        },
        categoricalChart = {
            seriesValueAxis: function () {
                return valueAxis;
            }
        },
        xyChart = {
            seriesAxes: function () {
                return {
                    x: xAxis,
                    y: yAxis
                };
            }
        };

        module("error bar / value axis", {});

        test("value axis is found for categorical chart", function() {
            var errorbar = new CategoricalErrorBar(1,1, true, categoricalChart, {}, {});
            ok(errorbar.getAxis() === valueAxis);
        });

        test("xAxis is found for horizontal error bar", function() {
            var errorbar = new ScatterErrorBar(1,1, false, xyChart, {}, {});
            ok(errorbar.getAxis() === xAxis);
        });

        test("yAxis is found for vertical error bar", function() {
            var errorbar = new ScatterErrorBar(1,1, true, xyChart, {}, {});
            ok(errorbar.getAxis() === yAxis);
        });

        (function() {
            var Path = kendo.drawing.Path;
            var errorBar;

            function createErrorBar(type, vertical, chart, options) {
                var targetBox = new Box(5,5,9, 9);
                var rootElement = new dataviz.RootElement();
                errorBar = new type(1, 2, vertical, chart, {}, options);
                errorBar.reflow(targetBox);
                rootElement.box = targetBox;
                rootElement.append(errorBar);
                rootElement.renderVisual();
            }

            function renderedLines(expected, options) {
                var lines = errorBar.visual.children;
                equal(expected.length, lines.length);

                for (var idx = 0; idx < expected.length; idx++) {
                    sameLinePath(expected[idx], lines[idx]);
                    equalFields(lines[idx].options, options);
                }
            }

            module("error bar", {
            });

            test("the caps width is calculated from the box width when it is smaller than the default width for a vertical error bar", function(){
                var box = new Box(1,1, 8, 1),
                    expectedCapsWidth = Math.floor(box.width() / 2),
                    calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, true);
                equal(calculatedCapsWidth, expectedCapsWidth);
            });

            test("the default caps width is used when it is smaller than the box width for a vertical error bar", function(){
                var box = new Box(1,1, 23, 1),
                    expectedCapsWidth = DEFAULT_CAPS_WIDTH,
                    calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, true);
                equal(calculatedCapsWidth, expectedCapsWidth);
            });

            test("the caps width is calculated from the box height when it is smaller than the default width for a horizontal error bar", function(){
                var box = new Box(1,1, 1, 8),
                    expectedCapsWidth = Math.floor(box.height() / 2),
                    calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, false);
                equal(calculatedCapsWidth, expectedCapsWidth);
            });

            test("the default caps width is used when it is smaller than the box height for a horizontal error bar", function(){
                var box = new Box(1,1, 1, 23),
                    expectedCapsWidth = DEFAULT_CAPS_WIDTH,
                    calculatedCapsWidth = ErrorBarBase.fn.getCapsWidth(box, false);
                equal(calculatedCapsWidth, expectedCapsWidth);
            });

            test("lines are correctly created for a horizontal categorical error bar", function(){
                var expectedPaths = [new Path().moveTo(1, 7).lineTo(2, 7),
                        new Path().moveTo(1, 5).lineTo(1, 9),
                        new Path().moveTo(2, 5).lineTo(2, 9)];
                createErrorBar(CategoricalErrorBar, false, categoricalChart, defaultOptions);
                renderedLines(expectedPaths, expectedOptions);
            });

            test("lines are correctly created for a horizontal scatter error bar", function(){
                var expectedPaths = [new Path().moveTo(1, 7).lineTo(2, 7),
                        new Path().moveTo(1, 5).lineTo(1, 9),
                        new Path().moveTo(2, 5).lineTo(2, 9)];
                createErrorBar(ScatterErrorBar, false, xyChart, defaultOptions);

                renderedLines(expectedPaths, expectedOptions);
            });

            test("color is taken from errorbar options when specified for scatter error bar", function(){
                var expectedPaths = [new Path().moveTo(1, 7).lineTo(2, 7),
                    new Path().moveTo(1, 5).lineTo(1, 9),
                    new Path().moveTo(2, 5).lineTo(2, 9)],
                options = $.extend({}, expectedOptions, {stroke: {color: "black"}});

                createErrorBar(ScatterErrorBar, false, xyChart, {
                    endCaps: true,
                    color: "black"
                });

                renderedLines(expectedPaths, options);
            });

            test("color is taken from errorbar options when specified for categorical error bar", function(){
                var expectedPaths = [new Path().moveTo(7, 1).lineTo(7, 2),
                    new Path().moveTo(5, 1).lineTo(9, 1),
                    new Path().moveTo(5, 2).lineTo(9, 2)],
                options = $.extend({}, expectedOptions, {stroke: {color: "black"}});

                createErrorBar(CategoricalErrorBar, true, categoricalChart, {
                    endCaps: true,
                    color: "black"
                });

                renderedLines(expectedPaths, options);
            });

            test("lines are correctly created for a vertical categorical error bar", function(){
                var expectedPaths = [new Path().moveTo(7, 1).lineTo(7, 2),
                    new Path().moveTo(5, 1).lineTo(9, 1),
                    new Path().moveTo(5, 2).lineTo(9, 2)];

                createErrorBar(CategoricalErrorBar, true, categoricalChart, defaultOptions);

                renderedLines(expectedPaths, expectedOptions);
            });

            test("lines are correctly created for a vertical scatter error bar", function(){
                var expectedPaths = [new Path().moveTo(7, 1).lineTo(7, 2),
                    new Path().moveTo(5, 1).lineTo(9, 1),
                    new Path().moveTo(5, 2).lineTo(9, 2)];

                createErrorBar(ScatterErrorBar, true, xyChart, defaultOptions);

                renderedLines(expectedPaths, expectedOptions);
            });

            test("caps lines are not created for a horizontal categorical error bar when the endCaps option is false", function(){
                var expectedPaths = [new Path().moveTo(1, 7).lineTo(2, 7)];
                createErrorBar(CategoricalErrorBar, false, categoricalChart, $.extend({}, defaultOptions, {endCaps: false}));

                renderedLines(expectedPaths, expectedOptions);
            });

            test("caps lines are not created for a horizontal scatter error bar when the endCaps option is false", function(){
                var expectedPaths = [new Path().moveTo(1, 7).lineTo(2, 7)];
                createErrorBar(ScatterErrorBar, false, xyChart, $.extend({}, defaultOptions, {endCaps: false}));

                renderedLines(expectedPaths, expectedOptions);
            });

            test("caps lines are not created for a vertical categorical error bar when the endCaps option is false", function(){
                var expectedPaths = [new Path().moveTo(7, 1).lineTo(7, 2)];
                createErrorBar(CategoricalErrorBar, true, categoricalChart, $.extend({}, defaultOptions, {endCaps: false}));

                renderedLines(expectedPaths, expectedOptions);
            });

            test("caps lines are not created for a vertical scatter error bar when the endCaps option is false", function(){
                var expectedPaths = [new Path().moveTo(7, 1).lineTo(7, 2)];
                createErrorBar(ScatterErrorBar, true, xyChart, $.extend({}, defaultOptions, {endCaps: false}));

                renderedLines(expectedPaths, expectedOptions);
            });

        })();

        //-----------------------------------------------------------------------------------------
        (function() {
            var Path = kendo.drawing.Path;
            var errorBar, customVisual;

            function createErrorBar(options) {
                var targetBox = new Box(5,5,9, 9);
                var rootElement = new dataviz.RootElement();
                errorBar = new CategoricalErrorBar(1, 2, true, categoricalChart, {}, $.extend({}, defaultOptions, options));
                errorBar.reflow(targetBox);
                rootElement.box = targetBox;
                rootElement.append(errorBar);
                rootElement.renderVisual();
            }

            var customVisual;

            module("error bar / custom visual", {
                setup: function() {
                    customVisual = new kendo.drawing.Path();
                }
            });

            test("renders custom visual if visual option is set", function() {
                createErrorBar({
                    visual: function() {
                        return customVisual;
                    }
                });
                ok(errorBar.visual === customVisual);
            });

            test("does not render default visual if visual function returns nothing", function() {
                createErrorBar({
                    visual: function() {}
                });
                ok(!errorBar.visual);
            });

            test("passes the low value", function() {
                 createErrorBar({
                    visual: function(e) {
                        equal(e.low, 1);
                    }
                });
            });

            test("passes the high value", function() {
                 createErrorBar({
                    visual: function(e) {
                        equal(e.high, 2);
                    }
                });
            });

            test("passes the error bar rect", function() {
                 createErrorBar({
                    visual: function(e) {
                       ok(errorBar.box.toRect().equals(e.rect));
                    }
                });
            });

            test("passes the error bar options", function() {
                 createErrorBar({
                    visual: function(e) {
                       deepEqual(defaultOptions, e.options);
                    }
                });
            });

        })();

    })();
