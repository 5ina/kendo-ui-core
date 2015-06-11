(function() {
    var PivotGrid = kendo.ui.PivotGrid,
        div;

    module("PivotGrid initialziation", {
        setup: function() {
            kendo.ns = "kendo-";
            div = document.createElement("div");
            QUnit.fixture[0].appendChild(div);
        },
        teardown: function() {
            var component = $(div).data("kendoPivotGrid");
            if (component) {
                component.destroy();
            }
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
        }
    });

    function createPivot(options) {
        options = options || {};

        if (!options.dataSource) {
            options.dataSource = new kendo.data.PivotDataSource({
                schema: {
                    axes: function() {
                        return {};
                    }
                }
            });
        }

        return new PivotGrid($(div), options);
    }

    test("kendoPivotGrid attaches a pivotgrid object to target", function() {
        var pivotgrid = $(div).kendoPivotGrid({
            dataSource: {
                schema: {
                    axes: function() {
                        return {};
                    }
                }
            }
        });

        ok(pivotgrid.data("kendoPivotGrid") instanceof PivotGrid);
    });

    test("creates a PivotDataSource", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.dataSource instanceof kendo.data.PivotDataSource);
    });

    test("dataBinding event is triggered", function() {
        var wasCalled = false;
        var pivotgrid = createPivot({
            dataBinding: function() {
                wasCalled = true;
            }
        });

        ok(wasCalled);
    });

    test("dataBinding action argument", 1, function() {
        var pivotgrid = createPivot({
            dataBinding: function(e) {
                equal(e.action, "rebind");
            }
        });
    });

    test("prevent dataBinding event, prevents refresh", function() {
        var pivotgrid = createPivot({
            dataBinding: function(e) {
                e.preventDefault();
            }
        });

        equal(pivotgrid.content.find("tr").length, 0);
    });

    test("dataBound event is triggered", function() {
        var wasCalled = false;
        var pivotgrid = createPivot({
            dataBound: function() {
                wasCalled = true;
            }
        });

        ok(wasCalled);
    });

    test("dataSource fetch is called", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var fetch = stub(dataSource, "fetch");

        var pivot = new PivotGrid(div, { dataSource: dataSource });

        ok(fetch.calls("fetch"));
    });

    test("dataSource fetch is not called if autobind is false", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var fetch = stub(dataSource, "fetch");

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource, autoBind: false });

        ok(!fetch.calls("fetch"));
    });

    test("setDataSource attach new datasource", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource });

        dataSource = new kendo.data.PivotDataSource();

        var fetch = stub(dataSource, "fetch");

        pivotgrid.setDataSource(dataSource);

        deepEqual(pivotgrid.dataSource, dataSource);

        ok(fetch.calls("fetch"));
    });

    test("setDataSource updates setting targets datasource", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource });

        dataSource = new kendo.data.PivotDataSource();

        var measuresTarget = stub(pivotgrid.measuresTarget, "setDataSource");
        var columnsTarget = stub(pivotgrid.columnsTarget, "setDataSource");
        var rowsTarget = stub(pivotgrid.rowsTarget, "setDataSource");

        pivotgrid.setDataSource(dataSource);

        ok(measuresTarget.calls("setDataSource"));
        ok(columnsTarget.calls("setDataSource"));
        ok(rowsTarget.calls("setDataSource"));
    });

    test("PivotGrid shows progress on request start", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource });

        dataSource.trigger("progress");

        ok(pivotgrid.wrapper.find(".k-loading-mask")[0]);
    });

    test("PivotGrid hides progress on refresh", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource });

        ok(!pivotgrid.wrapper.find(".k-loading-mask")[0]);
    });

    test("PivotGrid hides progress on request error", function() {
        var dataSource = new kendo.data.PivotDataSource();

        var pivotgrid = new PivotGrid(div, { dataSource: dataSource });

        dataSource.trigger("progress");
        dataSource.trigger("error");

        ok(!pivotgrid.wrapper.find(".k-loading-mask")[0]);
    });

    test("PivotGrid creates column header virtual DOM node", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.columnsHeaderTree instanceof kendo.dom.Tree);
    });

    test("PivotGrid creates row header virtual DOM node", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.rowsHeaderTree instanceof kendo.dom.Tree);
    });

    test("PivotGrid creates content virtual DOM node", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.contentTree instanceof kendo.dom.Tree);
    });

    test("column setting target is attached to the column fields header", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.columnFields.data("kendoPivotSettingTarget") instanceof kendo.ui.PivotSettingTarget);
        ok(pivotgrid.columnsTarget instanceof kendo.ui.PivotSettingTarget);
    });

    test("column setting target shares same datasource", function() {
        var pivotgrid = createPivot();

        deepEqual(pivotgrid.columnsTarget.dataSource, pivotgrid.dataSource);
    });

    test("column setting target handles columns settings", function() {
        var pivotgrid = createPivot();

        equal(pivotgrid.columnsTarget.options.setting, "columns");
    });

    test("rows setting target is attached to the row fields header", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.rowFields.data("kendoPivotSettingTarget") instanceof kendo.ui.PivotSettingTarget);
        ok(pivotgrid.rowsTarget instanceof kendo.ui.PivotSettingTarget);
    });

    test("rows setting target shares same datasource", function() {
        var pivotgrid = createPivot();

        deepEqual(pivotgrid.rowsTarget.dataSource, pivotgrid.dataSource);
    });

    test("rows setting target handles rows settings", function() {
        var pivotgrid = createPivot();

        equal(pivotgrid.rowsTarget.options.setting, "rows");
    });

    test("measures setting target is attached to the measure fields header", function() {
        var pivotgrid = createPivot();

        ok(pivotgrid.measureFields.data("kendoPivotSettingTarget") instanceof kendo.ui.PivotSettingTarget);
        ok(pivotgrid.measuresTarget instanceof kendo.ui.PivotSettingTarget);
    });

    test("measures setting target shares same datasource", function() {
        var pivotgrid = createPivot();

        deepEqual(pivotgrid.measuresTarget.dataSource, pivotgrid.dataSource);
    });

    test("measures setting target handles rows settings", function() {
        var pivotgrid = createPivot();

        equal(pivotgrid.measuresTarget.options.setting, "measures");
    });

    test("datasource of configurator is set", function() {
        var configurator = $("<div id='configurator'/>").kendoPivotConfigurator();

        $(QUnit.fixture).append(configurator);

        var pivotgrid = createPivot({ configurator: "#configurator"});

        deepEqual(configurator.data("kendoPivotConfigurator").dataSource, pivotgrid.dataSource);
    });

    test("setDataSource updates configurator", function() {
        var configuratorElement = $("<div />").kendoPivotConfigurator();

        $(QUnit.fixture).append(configuratorElement);

        var pivotgrid = createPivot({ configurator: configuratorElement });
        var configurator = configuratorElement.data("kendoPivotConfigurator");
        var method = stub(configurator, "setDataSource");

        pivotgrid.setDataSource(new kendo.data.PivotDataSource());

        ok(method.calls("setDataSource"));
    });

    test("setOptions updates data template", function() {
        var pivotgrid = createPivot();

        pivotgrid.setOptions({
            dataCellTemplate: "test #: dataItem.value #"
        });

        var result = pivotgrid._contentBuilder.dataTemplate({
            dataItem: { value: "1" }
        });

        equal(result, "test 1");
    });

    test("setOptions updates kpi status template", function() {
        var pivotgrid = createPivot();

        pivotgrid.setOptions({
            kpiStatusTemplate: "test #: dataItem.value #"
        });

        var result = pivotgrid._contentBuilder.kpiStatusTemplate({
            dataItem: { value: "1" }
        });

        equal(result, "test 1");
    });

    test("setOptions updates kpi trend template", function() {
        var pivotgrid = createPivot();

        pivotgrid.setOptions({
            kpiTrendTemplate: "test #: dataItem.value #"
        });

        var result = pivotgrid._contentBuilder.kpiTrendTemplate({
            dataItem: { value: "1" }
        });

        equal(result, "test 1");
    });

    test("filterable option is not set for measures setting target", function() {
        var pivotgrid = createPivot({
            filterable: true
        });

        equal(pivotgrid.measuresTarget.options.filterable, false);
    });

    test("filterable option is set for columns setting target", function() {
        var pivotgrid = createPivot({
            filterable: true
        });

        equal(pivotgrid.columnsTarget.options.filterable, true);
    });

    test("filterable option is set for rows setting target", function() {
        var pivotgrid = createPivot({
            filterable: true
        });

        equal(pivotgrid.rowsTarget.options.filterable, true);
    });

    test("initialize using MVVM", function() {
        $(div).attr("data-kendo-role", "pivotgrid");
        $(div).attr("data-kendo-bind", "source: dataSource");

        kendo.bind($(div), kendo.observable({
            dataSource: new kendo.data.PivotDataSource({
                schema: {
                    axes: function() {
                        return {};
                    }
                }
            })
        }));

        ok($(div).data("kendoPivotGrid") instanceof kendo.ui.PivotGrid);
    });
})();
