(function() {
   var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        dataSource;


    function setup(options) {
        options = $.extend(true, {}, {
        editable: "popup",
        dataSource: {
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: "foo",
                            name: "name"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            }
        }, options);
        options.dataSource = dataSource = new DataSource(options.dataSource);

        return table.kendoGrid(options).data("kendoGrid");
    }

    module("grid popup editing", {
        setup: function() {
            kendo.ns = "kendo-";

            table = document.createElement("table");

            QUnit.fixture[0].appendChild(table);

            table = $(table);
            kendo.effects.disable();
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);

            kendo.ns = "";

            table.closest(".k-grid").remove();

            $(".k-window").remove();
            $(".k-overlay").remove();

            kendo.effects.enable();
        }
    });

    test("editRow creates window instance", function() {
        var grid = setup();
        grid.editRow(table.find("tr:first"));

        ok(grid._editContainer.data("kendoWindow"));
    });

    test("default settings are applied to the window", function() {
        var grid = setup();
        grid.editRow(table.find("tr:first"));
        var wnd = grid._editContainer.data("kendoWindow");
        ok(wnd.options.modal);
        ok(!wnd.options.resizable);
        ok(wnd.options.draggable);
        equal(wnd.options.title, "Edit");
    });

    test("custom settings are applied to the window", function() {
        var grid = setup({ editable: { mode: "popup", window: { title: "foo" } } });

        grid.editRow(table.find("tr:first"));

        var wnd = grid._editContainer.data("kendoWindow");

        equal(wnd.options.title, "foo");
    });

    test("editing row passes column settings to Editable", function() {
        var grid = setup({ columns: [{ field: "foo", format: "bar", editor: function(){} }, "name"]});

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer;

        equal(container.data("kendoEditable").options.fields[0].field, "foo");
        equal(container.data("kendoEditable").options.fields[0].format, "bar");

        ok(container.data("kendoEditable").options.fields[0].editor);
    });

    test("column editor is not pass to the Editable if not set", function() {
        var grid = setup({ columns: [{ field: "foo"}, "name"]});

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer;

        ok(!container.data("kendoEditable").options.fields[0].editor);
    });

    test("correct model is passed to the editable instance", function() {
        var grid = setup();

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer;
        equal(container.data("kendoEditable").options.model, dataSource.get("bar"));
    });

    test("k-edit-form-container is applied editor container", function() {
        var grid = setup();

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer;

        ok(container.children("div:first").hasClass("k-edit-form-container"));
    });

    test("all fields are wrapped", function() {
        var grid = setup();

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        var elements = container.children("div").not(".k-edit-buttons");

        equal(elements.length, 4);
        ok(elements.eq(0).hasClass("k-edit-label"));
        equal(elements.eq(0).find("label").attr("for"), "foo");
        equal(elements.eq(1).data("kendo-container-for"), "foo");
        ok(elements.eq(1).hasClass("k-edit-field"));
    });

    test("non editable field value is shown", function() {
        var grid = setup({
            dataSource: { schema: { model: { fields: { foo: { editable:false } } } } }
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        var elements = container.children("div").not(".k-edit-buttons");

        equal(elements.length, 4);
        ok(elements.eq(0).hasClass("k-edit-label"));
        equal(elements.eq(0).find("label").attr("for"), "foo");
        equal(elements.eq(1).text(), "bar");
        ok(elements.eq(1).hasClass("k-edit-field"));
    });

    test("editor is not created for columns without field set", function() {
        var grid = setup({
            columns: [ { template: "foo" }, "name" ]
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        var elements = container.children("div").not(".k-edit-buttons");

        equal(elements.length, 4);
        ok(elements.eq(0).hasClass("k-edit-label"));
        equal(elements.eq(0).find("label").text(), "");
        equal(elements.eq(1).text(), "foo");
        ok(elements.eq(1).hasClass("k-edit-field"));
    });

    test("custom template is used if specified", function() {
        var grid = setup({ editable: { mode: "popup", template:"<div>#=foo#</div>" } });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("div:first").text(), "bar");
    });

    test("custom template as function", function() {
        var grid = setup({ editable: { mode: "popup",
                template: kendo.template("foo") } });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.text(), "fooUpdateCancel"); // includes the text of the buttons
    });

    test("update and cancel buttons are added if template is set", function() {
        var grid = setup({ editable: { mode: "popup", template:"<div>#=foo#</div>" } });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");

        equal(container.find("a.k-grid-update").length, 1);
        equal(container.find("a.k-grid-cancel").length, 1);
    });

    test("Update and cancel button are added to the edit form", function() {
        var grid = setup();

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").length, 1);
        equal(container.find("a.k-grid-cancel").length, 1);
    });

    test("Update and cancel button gets edit button attributes", function() {
        var grid = setup({
            editable: { mode: "popup", template:"<div>#=foo#</div>" },
            columns: [ { command: { name: "edit", attr: { bar: "baz" } } } ]
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").attr("bar"), "baz");
        equal(container.find("a.k-grid-cancel").attr("bar"), "baz");
    });

    test("Update and cancel button custom text", function() {
        var grid = setup({
            editable: { mode: "popup", template:"<div>#=foo#</div>" },
            columns: [ { command: { name: "edit", text: { update: "myUpdate", cancel: "myCancel", edit: "MyEdit" } } } ]
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").text(), "myUpdate");
        equal(container.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("Update and cancel button custom text when after additonal command and template", function() {
        var grid = setup({
            editable: { mode: "popup", template:"<div>#=foo#</div>" },
            columns: [
                { command: { name: "edit", text: { update: "myUpdate", cancel: "myCancel", edit: "MyEdit" } } },
                { command: [ "foo" ] }
            ]
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").text(), "myUpdate");
        equal(container.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("Update and cancel button custom text when after additonal command", function() {
        var grid = setup({
            editable: { mode: "popup" },
            columns: [
                { command: { name: "edit", text: { update: "myUpdate", cancel: "myCancel", edit: "MyEdit" } } },
                { command: [ "foo" ] }
            ]
        });

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").text(), "myUpdate");
        equal(container.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("Update and cancel button custom text if template is set", function() {
        var grid = setup({columns: [ { command: { name: "edit", text: { update: "myUpdate", cancel: "myCancel", edit: "MyEdit" } } } ]});

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").text(), "myUpdate");
        equal(container.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("Update and cancel button custom text if template is set - multiline headers", function() {
        var grid = setup({columns: [ { columns: [{ command: { name: "edit", text: { update: "myUpdate", cancel: "myCancel", edit: "MyEdit" } } }] } ]});

        grid.editRow(table.find("tr:first"));

        var container = grid._editContainer.children("div.k-edit-form-container");
        equal(container.find("a.k-grid-update").text(), "myUpdate");
        equal(container.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("clicking update buttons calls update row", function() {
        var grid = setup(),
            saveRow = stub(grid, "saveRow");

        grid.editRow(table.find("tr:first"));

        grid._editContainer.find("a.k-grid-update").click();

        ok(saveRow.calls("saveRow"));
    });

    test("clicking cancel buttons calls cancel row", function() {
        var grid = setup(),
            cancelRow = stub(grid, "cancelRow");

        grid.editRow(table.find("tr:first"));

        grid._editContainer.find("a.k-grid-cancel").click();

        ok(cancelRow.calls("cancelRow"));
    });

    test("cancelRow closes the popup", 2, function() {
        var grid = setup(),
            tr = table.find("tr:first");

        grid.editRow(tr);
        var wnd = grid._editContainer.data("kendoWindow");

        wnd.bind("close", function() {
            ok(true, "Window is not been closed");
        });

        grid.cancelRow(tr);
        ok(!grid._editContainer);
    });

    test("clicking close button of the window calls cancelRow", function() {
        var grid = setup(),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var cancelRow = stub(grid, { "cancelRow": grid.cancelRow });
        var wnd = grid._editContainer.data("kendoWindow");
        wnd.wrapper.find(".k-i-close").click();
        equal(cancelRow.calls("cancelRow"), 1);
    });

    test("edit event is raised when entering edit mode", 2, function() {
        var grid = setup({
            edit: function(e) {
                ok(e.container.find("input").length);
                equal(e.model, grid.dataSource.get("bar"));
            }
        });

        grid.editRow(table.find("tr:first"));
    });

    test("addRow creates window instance", function() {
        var grid = setup();
        grid.addRow();

        ok(grid._editContainer.data("kendoWindow"));
    });

    test("cell content is updated during editing", function() {
        var grid = setup();
        grid.editRow(table.find("tr:first"));
        grid._editContainer.find("input:first").val("moo").change();

        equal(table.find("tr:first > td:first").text(), "moo");
    });

    test("model change handlers are destroyed", function() {
        var grid = setup();

        grid.editRow(table.find("tr:first"));
        grid.cancelRow(table.find("tr:first"));

        grid.editRow(table.find("tr:first"));
        grid.cancelRow(table.find("tr:first"));

        equal(dataSource.at(0)._events["change"].length, 1);
    });

    asyncTest("cancelRow cancel changes made only to the record", 2, function() {
        var grid = setup({ columns: ["foo", "name"], editable: "popup" }),
            tr = table.find("tr:first");

        var cont = function() {
            start();
            var tr = table.find("tr:last");

            grid.editRow(tr);
            grid.dataItem(tr).set("foo", "foo");
            grid.cancelRow(tr);

            equal(grid.dataItem(table.find("tr:first")).get("foo"), "moo");
            equal(grid.dataItem(table.find("tr:last")).get("foo"), "baz");
        };

        grid.editRow(tr);
        grid.dataItem(tr).set("foo", "moo");
        grid.saveRow().done(cont);
    });

    test("save event is raised when item is updated", 2, function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "popup",
            save: function(e) {
                equal(e.model, dataSource.get("bar"));
                ok(e.container.length);
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);
        row.find("td:first input").val("baz").change();
        grid.saveRow();
    });

    test("cancel event is raised when cancel button is clicked", 2, function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "popup",
            cancel: function(e) {
                equal(e.model, dataSource.get("bar"));
                ok(e.container.length);
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        $(".k-grid-cancel").click();
    });

    test("preventing the cancel event leaves the window open when cancel button is clicked", function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "popup",
            cancel: function(e) {
                e.preventDefault();
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        $(".k-grid-cancel").click();

        equal($(".k-grid-cancel:visible").length, 1);
    });

    test("cancel event is raised when window is closed", 2, function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "popup",
            cancel: function(e) {
                equal(e.model, dataSource.get("bar"));
                ok(e.container.length);
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        $(".k-i-close").click();
    });

    test("preventing the cancel event leaves the window open when close button is clicked", function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "popup",
            cancel: function(e) {
                e.preventDefault();
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        $(".k-i-close").click();

        equal($(".k-grid-cancel:visible").length, 1);
    });

    test("adding new row in filtered datasource shows the popup editor", function() {
        var grid = setup();
        grid.dataSource.filter({ field: "foo", operation: "eq", value: 2 });

        grid.addRow();

        ok(grid._editContainer.data("kendoWindow"));
    });

    test("modifing edit form field updates locked column value", function() {
        var grid = setup({
            columns: [{ locked: true, field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        equal(grid.lockedTable.find("tr:first >td:first").text(), "12");
    });

    test("cancel row updates locked columns", function() {
        var grid = setup({
            columns: [{ locked: true, field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        grid.cancelRow();

        equal(grid.lockedTable.find("tr:first >td:first").text(), "bar");
    });

    test("cancel model persist row selection", function() {
        var grid = setup({
            selectable: true,
            columns: [{ field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row);

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        grid.cancelRow();

        ok(grid.table.find("tr:first").hasClass("k-state-selected"));
    });

    test("cancel model persist row selection with multiple selection", function() {
        var grid = setup({
            selectable: "multiple row",
            columns: [{ field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row);
        grid.select(table.find("tr:last"));

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        grid.cancelRow();

        equal(grid.table.find("tr.k-state-selected").length, 2);
    });

    test("cancel model persist row selection for locked row", function() {
        var grid = setup({
            selectable: true,
            columns: [{ locked: true, field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row);

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        grid.cancelRow();

        ok(grid.lockedTable.find("tr:first").hasClass("k-state-selected"));
    });

    test("updating model field persist row selection", function() {
        var grid = setup({
            selectable: true,
            columns: [{ field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row);

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.table.find("tr:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row.find("td:first"));

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.table.find("tr:first td:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection with locked columns", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ locked: true, field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(grid.lockedTable.find("tr:first td:first"));

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.lockedTable.find("tr:first td:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection - updated field is not selected one", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ field: "foo" }, "name"],
            editable: "popup"
        }),
        row = table.find("tr:first");

        grid.select(row.find("td:first"));

        grid.editRow(row);

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("bar", "12");

        ok(grid.table.find("tr:first td:first").hasClass("k-state-selected"));
    });

})();
