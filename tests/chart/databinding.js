(function() {
    var dataviz = kendo.dataviz;

    (function() {
        var chart;

        // ------------------------------------------------------------
        module("Late binding", {
            setup: function() {
                chart = createChart();
            },
            teardown: destroyChart
        });

        test("creates empty data source", function() {
            ok(chart.dataSource);
        });

        asyncTest("binds series when data becomes available", function() {
            chart = createChart({
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    equal(this.options.series[0].data.length, 2);
                    start();
                }
            });

            chart.dataSource.data([{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }]
            );
        });

        // ------------------------------------------------------------
        module("Inline binding", {
            setup: function() {
                chart = createChart();
            },
            teardown: destroyChart
        });

        test("categories are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period",
                    data: [{
                        period: "Jan",
                        sales: 100
                    }, {
                        period: "Feb",
                        sales: 110
                    }]
                }]
            });

            deepEqual(chart.options.categoryAxis.categories, ["Jan", "Feb"]);
        });

        test("categories data items are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period",
                    data: [{
                        period: "Jan",
                        sales: 100
                    }, {
                        period: "Feb",
                        sales: 110
                    }]
                }]
            });

            equal(chart.options.categoryAxis.dataItems[1].sales, 110);
        });

        // ------------------------------------------------------------
        module("Binding to DataSource", {
            setup: function() {
                chart = createChart();
            },
            teardown: destroyChart
        });

        asyncTest("series points are populated", 1, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    equal(this.options.series[0].data.length, 2);
                    start();
                }
            });
        });

        asyncTest("categories are populated", function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                categoryAxis: {
                    field: "period"
                },
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories, ["Jan", "Feb"]);
                    start();
                }
            });
        });

        asyncTest("categories data items are populated", function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                categoryAxis: {
                    field: "period"
                },
                dataBound: function() {
                    equal(this.options.categoryAxis.dataItems[1].sales, 110);
                    start();
                }
            });
        });

        asyncTest("categories are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories, ["Jan", "Feb"]);
                    start();
                }
            });
        });

        asyncTest("categories data items are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                dataBound: function() {
                    equal(this.options.categoryAxis.dataItems[1].sales, 110);
                    start();
                }
            });
        });

        asyncTest("categories are populated from series on named axis", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period",
                    categoryAxis: "foo"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                categoryAxis: [{
                    categories: []
                }, {
                    name: "foo"
                }],
                dataBound: function() {
                    equal(this.options.categoryAxis[0].categories.length, 0);
                    deepEqual(this.options.categoryAxis[1].categories, ["Jan", "Feb"]);
                    start();
                }
            });
        });

        asyncTest("categories for named axis are not populated from series on default axis", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                categoryAxis: [{
                    // default
                }, {
                    name: "foo",
                    categories: []
                }],
                dataBound: function() {
                    equal(this.options.categoryAxis[1].categories.length, 0);
                    start();
                }
            });
        });

        asyncTest("categories for are populated from series on named default axis", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                categoryAxis: {
                    name: "foo"
                },
                dataBound: function() {
                    equal(this.options.categoryAxis.categories.length, 2);
                    start();
                }
            });
        });

        asyncTest("only unique categories are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }, {
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories, ["Jan", "Feb"]);
                    start();
                }
            });
        });

        asyncTest("unique date categories are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: new Date("2013/01/01 00:00"),
                    sales: 100
                }, {
                    period: new Date("2013/02/01 00:00"),
                    sales: 110
                }, {
                    period: new Date("2013/01/01 00:00"),
                    sales: 100
                }, {
                    period: new Date("2013/02/01 00:00"),
                    sales: 110
                }],
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories,
                        [new Date("2013/01/01 00:00"), new Date("2013/02/01 00:00")]);
                    start();
                }
            });
        })

        asyncTest("string date categories are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: "2013/01/01 00:00",
                    sales: 100
                }, {
                    period: "2013/02/01 00:00",
                    sales: 110
                }, {
                    period: "2013/01/01 00:00",
                    sales: 100
                }, {
                    period: "2013/02/01 00:00",
                    sales: 110
                }],
                categoryAxis: {
                    type: "date"
                },
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories,
                        [new Date("2013/01/01 00:00"), new Date("2013/02/01 00:00")]);
                    start();
                }
            });
        });;

        asyncTest("date categories data items are populated from series", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: new Date("2013/01/01 00:00"),
                    sales: 100
                }, {
                    period: new Date("2013/02/01 00:00"),
                    sales: 110
                }],
                dataBound: function() {
                    equal(this.options.categoryAxis.dataItems[1].sales, 110);
                    start();
                }
            });
        });

        asyncTest("date categories are populated from series even if first is undefined", function() {
            chart = createChart({
                dataSource: {
                    data: [{
                        value: 1
                    }, {
                        cat: new Date("2014/01/01 10:00"),
                        value: 2
                    }]
                },
                series: [{
                    field: "value",
                    categoryField: "cat"
                }],
                categoryAxis: {
                    type: "date"
                },
                dataBound: function(e) {
                    equal(e.sender.options.categoryAxis.categories.length, 2);
                    start();
                }
            });
        });

        asyncTest("date categories populated from series are sorted", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: new Date("2013/02/01 00:00"),
                    sales: 100
                }, {
                    period: new Date("2013/01/01 00:00"),
                    sales: 110
                }],
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories,
                        [new Date("2013/01/01 00:00"), new Date("2013/02/01 00:00")]);
                    start();
                }
            });
        });

        asyncTest("date categories populated from series are not sorted for category axis", function() {
            chart = createChart({
                series: [{
                    field: "sales",
                    categoryField: "period"
                }],
                dataSource: [{
                    period: new Date("2013/02/01 00:00"),
                    sales: 100
                }, {
                    period: new Date("2013/01/01 00:00"),
                    sales: 110
                }],
                categoryAxis: {
                    type: "category"
                },
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories,
                        [new Date("2013/02/01 00:00"), new Date("2013/01/01 00:00")]);
                    start();
                }
            });
        });

        test("initial binding is done using fetch", 1, function() {
            stubMethod(kendo.data.DataSource.fn, "fetch", function() {
                ok(true);
            }, function() {
                chart = createChart({
                    dataSource: [{
                        period: "Jan",
                        sales: 100
                    }],
                    series: [{
                        field: "sales"
                    }]
                });
            });
        });

        test("refresh does not invoke read", 0, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }]
            });

            stubMethod(kendo.data.DataSource.fn, "read",
                function() { ok(false); },
                function() {
                    chart.refresh();
                }
            );
        });

        test("redraw does not invoke read", 0, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }]
            });

            stubMethod(kendo.data.DataSource.fn, "read",
                function() { ok(false); },
                function() {
                    chart.redraw();
                }
            );
        });

        asyncTest("data binding is not performed when autoBind is false", function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }],
                autoBind: false,
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    ok(false);
                }
            });

            setTimeout(function() {
                equal(chart.options.series[0].data.length, 0);
                start();
            }, 50);
        });

        asyncTest("series data is cleaned when data source returns empty view", 1, function() {
            var dataSource = new kendo.data.DataSource({
                data: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }]
            });

            chart = createChart({
                dataSource: dataSource,
                series: [{
                    field: "sales"
                }]
            });

            chart.bind("dataBound", function() {
                    var series = this.options.series[0];
                    equal(series.data.length, 0);
                    start();
                }
            );

            dataSource.query( { filter: { field: "period", operator: "==", value: "Mar" } } );
        });

        asyncTest("series data is not cleaned when defined inline", 1, function() {
            var dataSource = new kendo.data.DataSource({
                data: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }]
            });

            chart = createChart({
                dataSource: dataSource,
                series: [{
                    field: "sales"
                }, {
                    data: [ 1 ]
                }]
            });

            chart.bind("dataBound", function() {
                    var series = this.options.series[1];
                    equal(series.data.length, 1);
                    start();
                }
            );

            dataSource.query( { filter: { field: "period", operator: "==", value: "Mar" } } );
        });

        test("categories data is cleaned when data source returns empty view", 1, function() {
            var dataSource = new kendo.data.DataSource({
                data: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }]
            });

            chart = createChart({
                dataSource: dataSource,
                categoryAxis: [{
                    field: "period"
                }]
            });

            dataSource.data([]);
            equal(chart.options.categoryAxis.categories.length, 0);
        });

        test("setDataSource accepts DataSource configuration", function() {
            chart = createChart();
            chart.setDataSource({
                data: [{
                    period: "Jan",
                    sales: 100
                }, {
                    period: "Feb",
                    sales: 110
                }]
            });

            equal(chart.dataSource.view().length, 2);
        });

        // ------------------------------------------------------------
        module("Binding to DataSource / Null values", {
            teardown: destroyChart
        });

        asyncTest("series points are populated if point is null", 1, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, null],
                series: [{
                    field: "sales",
                    sales: null
                }],
                dataBound: function() {
                    equal(this.options.series[0].data.length, 2);
                    start();
                }
            });
        });

        asyncTest("categories are populated", function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: 100
                }, null],
                categoryAxis: {
                    field: "period"
                },
                dataBound: function() {
                    deepEqual(this.options.categoryAxis.categories, ["Jan", null]);
                    start();
                }
            });
        });

        asyncTest("series points are populated if field is null", 1, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: null
                }, {
                    period: "Feb",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    equal(this.options.series[0].data.length, 2);
                    start();
                }
            });
        });

        asyncTest("series points order is preserved if field is null", 1, function() {
            chart = createChart({
                dataSource: [{
                    period: "Jan",
                    sales: null
                }, {
                    period: "Feb",
                    sales: 100
                }],
                series: [{
                    field: "sales"
                }],
                dataBound: function() {
                    equal(this.options.series[0].data[1].sales, 100);
                    start();
                }
            });
        });

        // ------------------------------------------------------------
        function createGroupedChart(dataBound, series, data) {
            chart = createChart({
                dataSource: {
                    data: data || [{
                        period: "Jan",
                        product: "Foo",
                        sales: 100
                    }, {
                        period: "Jan",
                        product: "Bar",
                        sales: 100
                    }, {
                        period: "Feb",
                        product: "Foo",
                        sales: 110
                    }],
                    group: {
                        field: "product",
                        dir: "desc"
                    }
                },
                series: series || [{
                    name: "Sales",
                    field: "sales"
                }],
                categoryAxis: {
                    field: "period"
                },
                dataBound: dataBound
            });
        }

        function getSales(items) {
            return $.map(items, function(item) { return item.sales });
        }

        module("Binding to grouped DataSource", {
            teardown: destroyChart
        });

        asyncTest("creates series for each group bound to field", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series.length, 2);
                start();
            });
        });

        asyncTest("creates series with visibleInLegend set to false if there is no data", 2, function() {
            createGroupedChart(function() {
                equal(this.options.series.length, 1);
                equal(this.options.series[0].visibleInLegend, false);
                start();
            }, null, []);
        });

        asyncTest("does not duplicate series on rebind", 1, function() {
            var firstCall = true;
            createGroupedChart(function() {
                if (firstCall) {
                    firstCall = false;
                    this.dataSource.read();
                } else {
                    equal(this.options.series.length, 2);
                    start();
                }
            });
        });

        asyncTest("does not duplicate series on refresh", 1, function() {
            var firstCall = true;
            createGroupedChart(function() {
                if (firstCall) {
                    firstCall = false;
                    this.refresh();
                } else {
                    equal(this.options.series.length, 2);
                    start();
                }
            });
        });

        asyncTest("creates series on rebind when new group is added", 2, function() {
            var firstCall = true;
            createGroupedChart(function() {
                if (firstCall) {
                    firstCall = false;
                    this.dataSource.add({
                        period: "Jan",
                        product: "Baz",
                        sales: 120
                    });
                } else {
                    equal(this.options.series.length, 3);
                    equal(this.options.series[1].name, "Baz: Sales");
                    start();
                }
            });
        });

        asyncTest("removes series on rebind when group is removed", 2, function() {
            var firstCall = true;
            createGroupedChart(function() {
                if (firstCall) {
                    firstCall = false;
                    this.dataSource.remove(this.dataSource.at(1));
                } else {
                    equal(this.options.series.length, 1);
                    equal(this.options.series[0].name, "Foo: Sales");
                    start();
                }
            });
        });

        asyncTest("assigns grouped points to first series", 1, function() {
            createGroupedChart(function() {
                deepEqual(getSales(this.options.series[0].data),
                     getSales(this.dataSource.view()[0].items));
                start();
            });
        });

        asyncTest("assigns grouped points to second series", 1, function() {
            createGroupedChart(function() {
                deepEqual(getSales(this.options.series[1].data),
                     getSales(this.dataSource.view()[1].items));
                start();
            });
        });

        asyncTest("copies field to group series", 1, function() {
            createGroupedChart(function() {
                var series = this.options.series;
                equal(series[1].field, series[0].field);
                start();
            });
        });

        asyncTest("creates series for each group bound to x/yField", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series.length, 2);
                start();
            }, [{
                xField: "sales",
                yField: "sales",
                type: "scatter"
            }]);
        });

        asyncTest("copies x/yField to group series", 2, function() {
            createGroupedChart(function() {
                var series = this.options.series;
                equal(series[1].xField, series[0].xField);
                equal(series[1].yField, series[0].yField);
                start();
            }, [{
                xField: "sales",
                yField: "sales",
                type: "scatter"
            }]);
        });

        asyncTest("populates categories once", 1, function() {
            createGroupedChart(function() {
                deepEqual(this.options.categoryAxis.categories, ["Jan", "Feb"]);
                start();
            });
        });

        asyncTest("sets source series name to default group name template", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[0].name, "Foo: Sales");
                start();
            });
        });

        asyncTest("default group name template renders only group name when no series name is defined", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[0].name, "Foo");
                start();
            }, [{ field: "sales" }]);
        });

        asyncTest("sets cloned series name to default group name template", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[1].name, "Bar: Sales");
                start();
            });
        });

        asyncTest("sets cloned series color to next in palette", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[1].color, "#a0a700");
                start();
            });
        });

        asyncTest("does not alter cloned series color function", 1, function() {
            createGroupedChart(function() {
                ok($.isFunction(this.options.series[0].color));
                start();
            }, [{
                name: "Sales",
                field: "sales",
                color: function() { return "foo"; }
            }]);
        });

        asyncTest("evaluates name as group name template", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[1].name, "Sales for product Bar");
                start();
            }, [{
                name: "Sales for #= group.field # #= group.value #",
                field: "sales"
            }]);
        });

        asyncTest("does not overwrite name with empty groupNameTemplate (legacy)", 1, function() {
            createGroupedChart(function() {
                equal(this.options.series[1].name, "Sales");
                start();
            }, [{
                name: "Sales",
                field: "sales",
                groupNameTemplate: ""
            }]);
        });

        test("Warns about legacy template usage", function() {
            stubMethod(kendo, "logToConsole", function(msg) {
                ok(msg.indexOf("obsolete"));
            }, function() {
                createGroupedChart($.noop, [{
                    name: "Sales",
                    field: "sales",
                    groupNameTemplate: "Foo"
                }]);
            });
        });
    })();

    (function() {
        var binder,
            series;

        // ------------------------------------------------------------
        module("Series Binder", {
            setup: function() {
                binder = new dataviz.SeriesBinder();
                binder.register(["foo"]);

                series = { type: "foo" };
            }
        });

        test("sets valueFields from string", function() {
            series.data = ["abc"];
            deepEqual(binder.bindPoint(series, 0),
            { valueFields: { value: "abc" }, fields: {} }
            );
        });

        test("sets valueFields from number", function() {
            series.data = [1];
            deepEqual(binder.bindPoint(series, 0),
            { valueFields: { value: 1 }, fields: {} }
            );
        });

        test("sets valueFields from undefined", function() {
            series.data = [undefined];

            deepEqual(binder.bindPoint(series, 0),
            { valueFields: { value: undefined }, fields: {} }
            );
        });

        test("sets valueFields from null", function() {
            series.data = [null];

            deepEqual(binder.bindPoint(series, 0),
            { valueFields: { value: null }, fields: {} }
            );
        });

        test("sets valueFields from null", function() {
            binder.register(["bar"], ["x", "y"]);
            series.data = [null];
            series.type = "bar";

            deepEqual(binder.bindPoint(series, 0),
                { valueFields: { x: null, y: null }, fields: {} }
            );
        });

        test("binds valueFields using field name", function() {
            series.field = "aValue";
            series.data = [{ aValue: 1 }];
            series.type = "foo";

            deepEqual(binder.bindPoint(series, 0),
            { valueFields: { value:  1 }, fields: {} }
            );
        });

        test("binds array to multiple values", function() {
            binder.register(["bar"], ["x", "y"]);

            series.data = [[1, 2]];
            series.type = "bar";

            deepEqual(binder.bindPoint(series, 0),
                { valueFields: { x: 1, y: 2 }, fields: {} }
            );
        });

        test("binds other fields", function() {
            binder.register(["bar"], ["value"], ["color"]);

            series.data = [{ value: 1, color: "red" }];
            series.type = "bar";

            deepEqual(binder.bindPoint(series, 0).fields,
                { color: "red" }
            );
        });

        test("binds other fields using field name", function() {
            binder.register(["bar"], ["value"], ["color"]);

            series.data = [{ value: 1, c: "red" }];
            series.type = "bar";
            series.colorField = "c";

            deepEqual(binder.bindPoint(series, 0).fields,
                { color: "red" }
            );
        });

        test("other fields are empty if data item is null", function() {
            binder.register(["bar"], ["value"], ["color"]);

            series.data = [null];
            series.type = "bar";

            deepEqual(binder.bindPoint(series, 0).fields, { });
        });

        test("returns canonical names for all fields", function() {
            binder.register(["bar"], ["value"], ["color"]);

            deepEqual(
                binder.canonicalFields({ type: "bar" }),
                ["value", "color"]);
        });
    })();
})();
