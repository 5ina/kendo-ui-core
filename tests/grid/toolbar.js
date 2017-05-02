(function() {
   var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        toolbar,
        dataSource;

    function setup(options) {
        options = $.extend({}, {
        editable: true,
        dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            name: "name",
                            foo: "foo"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }, options);
        dataSource = options.dataSource;

        var grid = table.kendoGrid(options).data("kendoGrid");
        toolbar = grid.wrapper.find(".k-grid-toolbar");

        return grid;
    }

    module("grid toolbar", {
        setup: function() {
            table = document.createElement("table");
            QUnit.fixture[0].appendChild(table);

            table = $(table);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            table.closest(".k-grid").remove();
        }
    });

    test("div is appended before the table when toolbar is enabled", function() {
        var grid = setup({ toolbar: true }),
            wrapper = grid.wrapper;

        equal(wrapper.find(".k-grid-toolbar").length, 1);

        ok(wrapper.children().first().hasClass("k-grid-toolbar"));
    });

    test("div is appended before the table when toolbar is enabled without scrolling", function() {
        var grid = setup({ toolbar: true, scrollable: false }),
            wrapper = grid.wrapper;

        equal(wrapper.find(".k-grid-toolbar").length, 1);

        ok(wrapper.children().first().hasClass("k-grid-toolbar"));
    });

    test("toolbar template", function() {
        setup({ toolbar: "foo" });

        equal(toolbar.text(), "foo");
    });

    test("toolbar as kendo template", function() {
        setup({ toolbar: "#= 1+2 #" });

        equal(toolbar.text(), "3");
    });

    test("toolbar as kendo template grid is passed as parameter", function() {
        setup({ toolbar: "#= this.wrapper[0].className #" });

        equal(toolbar.text(), "k-grid k-widget k-display-block");
    });

    test("toolbar template as function", function() {
        setup({
            toolbar: function() {
                return "bar";
            }
        });

        equal(toolbar.text(), "bar");
    });

    test("toolbar create command renders add button", function() {
        setup({
            toolbar: ["create"]
        });

        var button = toolbar.children().first();
        ok(button.is("a"));
        ok(button.hasClass("k-grid-add"));
        equal(button.text(), "Add new record");
    });

    test("toolbar create command renders add button with correct aria role", function() {
        setup({
            toolbar: ["create"]
        });

        var button = toolbar.children().first();
        equal(button.attr("role"), "button");
        equal(button.text(), "Add new record");
    });

    test("toolbar create command from settings", function() {
        setup({
            toolbar: [ { name: "create", text: "foo" }]
        });

        var button = toolbar.children().first();
        ok(button.is("a"));
        ok(button.hasClass("k-grid-add"));
        equal(button.text(), "foo");
    });

    test("toolbar create custom command from string", function() {
        setup({
            toolbar: [ "foo" ]
        });

        var button = toolbar.children().first();
        ok(button.is("a"));
        equal(button.text(), "foo");
    });

    test("custom toolbar does not have k-icon on inner span", function() {
        setup({
            toolbar: [ "foo" ]
        });

        var button = toolbar.children().first();
        ok(!button.find("span").hasClass("k-icon"));
    });

    test("toolbar create custom command from setting", function() {
        setup({
            toolbar: [ { text: "bar" } ]
        });

        var button = toolbar.children().first();
        ok(button.is("a"));
        equal(button.text(), "bar");
    });

    test("toolbar create custom command as template", function() {
        setup({
            toolbar: [ { template: "bar" } ]
        });

        equal(toolbar.text(), "bar");
    });

    test("toolbar create custom command from settings name without text", function() {
        setup({
            toolbar: [ { name: "bar" } ]
        });

        equal(toolbar.text(), "bar");
    });

    test("toolbar create custom command attributes are appended", function() {
        setup({
            toolbar: [ { name: "bar", attr: 'id="foo"' } ]
        });

        equal(toolbar.text(), "bar");
        equal(toolbar.children().first().attr("id"), "foo");
    });

    test("multiple builtin commands", function() {
        setup({
            toolbar: [ { name: "create", text: "foo" }, "cancel" ]
        });

        var createButton = toolbar.children().first();
        ok(createButton.is("a"));
        ok(createButton.hasClass("k-grid-add"));
        equal(createButton.text(), "foo");

        var cancelButton = toolbar.children().eq(1);
        ok(cancelButton.is("a"));
        ok(cancelButton.hasClass("k-grid-cancel-changes"));
        equal(cancelButton.text(), "Cancel changes");
    });

    test("clicking create command button calls addRow", function() {
         var grid = setup({
            toolbar: [ "create" ]
        }),
        addMethod = stub(grid, "addRow");

        toolbar.find(".k-grid-add").click();

        ok(addMethod.calls("addRow"));
    });

    test("clicking save command button calls saveChanges", function() {
         var grid = setup({
            toolbar: [ "save" ]
        }),
        method = stub(grid, "saveChanges");

        toolbar.find(".k-grid-save-changes").click();

        ok(method.calls("saveChanges"));
    });

    test("clicking cancel command button calls cancelChanges", function() {
         var grid = setup({
            toolbar: [ "cancel" ]
        }),
        method = stub(grid, "cancelChanges");

        toolbar.find(".k-grid-cancel-changes").click();

        ok(method.calls("cancelChanges"));
    });

    test("toolbar function is called only once", 1, function() {
        var grid = setup({
            toolbar: function() { ok(true) }
        });
    });

    test("toolbar function containing #", 1, function() {
        var grid = setup({
            toolbar: function() { return '<a class="mylink" href="#">foo</a>'; }
        });

        ok(toolbar.find(".mylink").length);
    });
})();
