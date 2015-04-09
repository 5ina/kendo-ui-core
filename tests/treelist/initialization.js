(function() {
    var TreeListDataSource = kendo.data.TreeListDataSource;
    var TreeList = kendo.ui.TreeList;

    var dom;
    var instance;

    module("TreeList initialization", {
        setup: function() {
           dom = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);

            dom = instance = null;
        }
    });

    function createTreeList(options) {
        dom.kendoTreeList($.extend({
            dataSource: [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 }
            ]
        }, options));

        instance = dom.data("kendoTreeList");
    }

    test("creates dataSource instance from options", function() {
        createTreeList();

        ok(instance.dataSource instanceof TreeListDataSource);
    });

    test("creates dataSource instance from options", function() {
        var ds = new TreeListDataSource({
            data: [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 }
            ]
        });

        createTreeList({ dataSource: ds });

        strictEqual(instance.dataSource, ds);
    });

    test("calls dataSource.fetch upon initialization", function() {
        var ds = new TreeListDataSource({
            data: [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 }
            ]
        });

        var fetchSpy = spy(ds, "fetch");

        createTreeList({ dataSource: ds });

        equal(fetchSpy.calls("fetch"), 1);
    });

    test("does not call dataSource.fetch when autoBind is false", function() {
        var ds = new TreeListDataSource({
            data: [
                { id: 1, parentId: null },
                { id: 2, parentId: 1 }
            ]
        });

        var fetchSpy = spy(ds, "fetch");

        createTreeList({
            dataSource: ds,
            autoBind: false
        });

        equal(fetchSpy.calls("fetch"), 0);
    });

    test("calls refresh upon dataSource change event", function() {
        var impl = TreeList.prototype.refresh;

        try {
            TreeList.prototype.refresh = function() { ok(true); };
            createTreeList({ autoBind: false });

            instance.dataSource.read();
        } finally {
            TreeList.prototype.refresh = impl;
        }
    });

    test("columns are configured by columns configuration", function() {
        createTreeList({
            columns: [
                { field: "id" },
                { field: "parentId" }
            ]
        });

        var columns = instance.columns;

        equal(columns.length, 2);
        equal(columns[0].field, "id");
        equal(columns[1].field, "parentId");
    });

    test("columns can be initialized by field name only", function() {
        createTreeList({
            columns: [ "id", "parentId" ]
        });

        var columns = instance.columns;

        equal(columns.length, 2);
        equal(columns[0].field, "id");
        equal(columns[1].field, "parentId");
    });

    test("first column is expandable by default", function() {
        createTreeList({
            columns: [ "id", "parentId" ]
        });

        ok(instance.columns[0].expandable);
    });

    test("does not set expandable if defined", function() {
        createTreeList({
            columns: [
                { field: "id" },
                { field: "parentId", expandable: true }
            ]
        });

        ok(!instance.columns[0].expandable);
        ok(instance.columns[1].expandable);
    });

    test("column encoded is set by default", function() {
        createTreeList({
            columns: [ "id", "parentId" ]
        });

        ok(instance.columns[0].encoded);
        ok(instance.columns[1].encoded);
    });

    test("define column.encoded", function() {
        createTreeList({
            columns: [
                { field: "id", encoded: false },
                "parentId"
            ]
        });

        ok(!instance.columns[0].encoded);
        ok(instance.columns[1].encoded);
    });

    test("hidden column is not made expandable", function() {
        createTreeList({
            columns: [
                { field: "id", hidden: true },
                { field: "parentId" }
            ]
        });

        ok(!instance.columns[0].expandable);
        ok(instance.columns[1].expandable);
    });
})();
