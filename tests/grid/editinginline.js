(function() {
   var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        dataSource;

    function setup(options) {
        options = $.extend(true, {}, {
        editable: "inline",
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

    module("grid inline editing", {
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

    test("saveRow should returns resolved promise when not in edit mode", function() {
        var grid = setup();

        var promise = grid.saveRow();

        equal(promise.state(), "resolved");
    });

    test("saveRow should returns rejected promise on validation errors", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline",
            dataSource: {
                schema: {
                    model: {
                        fields: {
                            foo: { validation: { custom: function() { return false; } } }
                        }
                    }
        }}});

        grid.editRow(table.find("tr:first"));
        var promise = grid.saveRow();

        equal(promise.state(), "rejected");
    });

    test("saveRow should returns rejected promise save event is prevented", function() {
        var grid = setup({
            save: function(e) {
                e.preventDefault();
            }
        });

        grid.editRow(table.find("tr:first"));
        var promise = grid.saveRow();

        equal(promise.state(), "rejected");
    });

    test("propagation is stopped when update is clicked", function() {
        var grid = setup({ columns: [{ command: ["edit"] }] });
        var e = new $.Event();

        e.type = "click";
        grid.editRow(table.find("tr:first"));
        table.find(".k-grid-update:first").trigger(e);

        ok(e.isPropagationStopped());
    });

    test("propagation is stopped when destroy is clicked", function() {
        var grid = setup({ columns: [{ command: ["destroy"] }], editable: { confirm: false } });
        var e = new $.Event();

        e.type = "click";

        table.find(".k-grid-delete:first").trigger(e);

        ok(e.isPropagationStopped());
    });

    test("propagation is stopped when cancel is clicked", function() {
        var grid = setup({ columns: [{ command: ["edit"] }] });
        var e = new $.Event();

        e.type = "click";
        grid.editRow(table.find("tr:first"));
        table.find(".k-grid-cancel:first").trigger(e);

        ok(e.isPropagationStopped());
    });

    test("editing row passes column settings to Editable", function() {
        var grid = setup({ columns: [{ field: "foo", format: "bar", editor: function(){} }, "name"] });
        var tr = table.find("tr:first")

        grid.editRow(tr);

        equal(tr.data("kendoEditable").options.fields[0].field, "foo");
        equal(tr.data("kendoEditable").options.fields[0].format, "bar");
        ok(tr.data("kendoEditable").options.fields[0].editor);
    });

    test("editRow with selector", function() {
        var grid = setup({ editable: "inline" });

        grid.editRow("table>tbody tr:first");
        ok(grid.table.find("tr:first").hasClass("k-grid-edit-row"));
    });

    test("column editor is not pass to the Editable if not set", function() {
        var grid = setup({ columns: [{ field: "foo"}, "name"] });
        var tr = table.find("tr:first")

        grid.editRow(tr);

        ok(!tr.data("kendoEditable").options.fields[0].editor);
    });

    test("correct model is passed to the editable instance", function() {
        var grid = setup();

        var tr = table.find("tr:first")

        grid.editRow(tr);

        equal(tr.data("kendoEditable").options.model, dataSource.get("bar"));
    });

    test("k-grid-edit-row is applied on edited cell tr", function() {
        var grid = setup();

        var tr = table.find("tr:first")

        grid.editRow(tr);;

        ok(tr.hasClass("k-grid-edit-row"));
    });

    test("editing row passes column fields to Editable", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var editable = tr.data("kendoEditable");
        equal(editable.options.fields.length, 2);
        equal(editable.options.fields[0].field, "foo");
        equal(editable.options.fields[1].field, "name");
    });

    test("clicking edit command calls editRow", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: "inline" }),
            tr = table.find("tr:first"),
            editRow = stub(grid, "editRow");

        tr.find("a.k-grid-edit").click();
        equal(editRow.calls("editRow"), 1);
    });

    test("clicking edit command calls editRow if edit mode is inline", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: { mode: "inline" } }),
            tr = table.find("tr:first"),
            editRow = stub(grid, "editRow");

        tr.find("a.k-grid-edit").click();
        equal(editRow.calls("editRow"), 1);
    });

    test("clicking edit command does not call editRow if edit mode is not inline", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: true }),
            tr = table.find("tr:first"),
            editRow = stub(grid, "editRow");

        tr.find("a.k-grid-edit").click();
        equal(editRow.calls("editRow"), 0);
    });

    test("edit command column is rendered if set", function() {
        var grid = setup( { editable: true, columns: [ { command: "edit" }] });

        ok(grid.table.find("tr:first > td:last").has("a.k-grid-edit").length);
    });

    test("editRow does not remove the delete command buttons", function() {
        var grid = setup({ columns: ["foo", "name", { command: "destroy" }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        ok(tr.find("a.k-grid-delete").length);
    });

    test("editRow transforms the edit command column", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var commandCell = tr.find("td:last");
        equal(commandCell.find("a.k-button").length, 2);
        equal(commandCell.find("a.k-grid-update").length, 1);
        equal(commandCell.find("a.k-grid-cancel").length, 1);
    });

    test("editRow custom text is applied to update and cancel commands", function() {
        var grid = setup({ columns: ["foo", "name", { command: { name: "edit", text: { edit: "myEdit", update: "myUpdate", cancel: "myCancel"} } }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var commandCell = tr.find("td:last");
        equal(commandCell.find("a.k-button").length, 2);
        equal(commandCell.find("a.k-grid-update").text(), "myUpdate");
        equal(commandCell.find("a.k-grid-cancel").text(), "myCancel");
    });

    test("editRow edit command attributes are applied to update and cancel commands", function() {
        var grid = setup({ columns: ["foo", "name", { command: { name: "edit", attr: { bar: "baz" } } }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var commandCell = tr.find("td:last");
        equal(commandCell.find("a.k-button").length, 2);
        equal(commandCell.find("a.k-grid-update").attr("bar"), "baz");
        equal(commandCell.find("a.k-grid-cancel").attr("bar"), "baz");
    });

    test("editRow transforms the edit command column if column has multiple commands", function() {
        var grid = setup({ columns: ["foo", "name", { command: ["edit", "destroy"] }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var commandCell = tr.find("td:last");
        equal(commandCell.find("a.k-button").length, 2);
        equal(commandCell.find("a.k-grid-update").length, 1);
        equal(commandCell.find("a.k-grid-cancel").length, 1);
    });

    test("clicking on cancel button switch edited row in display mode", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        tr.find("a.k-grid-cancel").click();

        ok(!table.find("tr:first").find(":input").length);
    });

    test("clicking cancel command calls cancelRow", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: "inline" }),
            tr = table.find("tr:first"),
            cancelRow = stub(grid, "cancelRow");

        grid.editRow(tr);

        tr.find("a.k-grid-cancel").click();

        equal(cancelRow.calls("cancelRow"), 2); // the cancelRow is called withing the editRow
    });

    test("editRow editors for not editable cells are not created", function() {
        var grid = setup({
                columns: ["foo", "name", { command: "destroy" }],
                editable: "inline",
                dataSource: { schema: { model: { fields: { foo: { editable:false } } } } }
            }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        ok(!tr.find("td:first > input").length);
        ok(tr.find("td:eq(1) > input").length);
    });

    test("editRow editors for columns without field are not created", function() {
        var grid = setup({
                columns: [{ template: "foo" }, "name"],
                editable: "inline"
            }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        ok(!tr.find("td:first > input").length);
        equal(tr.find("td:first").text(), "foo");
        ok(tr.find("td:eq(1) > input").length);
    });

    test("cancelRow switch edited row in display mode", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.cancelRow(tr);
        ok(!table.find("tr:first").find(":input").length);
    });

    test("cancelRow destroyes Editable", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.cancelRow(tr);

        ok(!table.find("tr:first").data("kendoEditable"));
    });

    test("cancelRow destroyes kendo widgets inside the editable form", function() {
        var grid = setup(
            {
                columns: [
                    {
                        field: "foo",
                        editor: function(container, model) {
                            $("<input />").appendTo(container).kendoDatePicker();
                        }
                    },
                    "name"
                ],
                editable: "inline"
            }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.cancelRow(tr);

        ok(!table.find("tr:first").data("kendoEditable"));
        equal($(".k-popup").length, 0);
    });

    test("cancelRow remove the css class from the edited row", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.cancelRow(tr);

        ok(!table.find("tr:first").hasClass("k-grid-edit-row"));
    });

    test("cancelRow cancel changes made to the record", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.dataItem(tr).set("foo", "moo");
        grid.cancelRow(tr);

        equal(grid.dataItem(table.find("tr:first")).get("foo"), "bar");
    });

    test("updateRow switches other edited rows to display mode", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" });

        grid.editRow(table.find("tr:first"));
        grid.editRow(table.find("tr:eq(1)"));

        ok(!table.find("tr:first").find(":input").length);
        equal(table.find("tr.k-grid-edit-row").length, 1);
        ok(table.find("tr:eq(1)").hasClass("k-grid-edit-row"));
    });

    asyncTest("saveRow switches edit row in display mode", 1, function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.dataItem(tr).set("foo", "42");
        grid.saveRow().done(function() {
            start();
            equal(table.find("tr:first").find("input").length, 0);
        });
    });

    test("clicking update command calls saveRow", function() {
        var grid = setup({ columns: ["foo", "name", { command: "edit" }], editable: "inline" }),
            tr = table.find("tr:first"),
            saveRow = stub(grid, "saveRow");

        grid.editRow(tr);

        tr.find("a.k-grid-update").click();

        equal(saveRow.calls("saveRow"), 1);
    });

    asyncTest("saveRow destroyes Editable", 1, function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.dataItem(tr).set("foo", "42");
        grid.saveRow(tr).done(function() {
            start();
            ok(!table.find("tr:first").data("kendoEditable"));
        });
    });

    test("saveRow calls validate", function() {
         var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var validate = stub(tr.data("kendoValidator"), "validate");

        grid.saveRow(tr);

        ok(validate.calls("validate"));
    });

    test("saveRow item does not leave edit mode if validation fails", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline",
            dataSource: {
                schema: {
                    model: {
                        fields: {
                            foo: { validation: { custom: function() { return false; } } }
                        }
                    }
        }}}),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.saveRow();

        ok(table.find("tr:first").find(":input").length);
    });

    test("saveRow calls DataSource sync", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var sync = stub(grid.dataSource, "sync");

        grid.saveRow(tr);

        ok(sync.calls("sync"));
    });

    test("addRow sets the first row in edit mode", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" });

        grid.addRow();

        equal(table.find("tr:first").find("input").length, 2);
    });

    test("edit event is raised when entering edit mode", 2, function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "inline",
            edit: function(e) {
                ok(e.container.find("input").length);
                equal(e.model, grid.dataSource.get("bar"));
            }
        });

        grid.editRow(table.find("tr:first"));
    });

    test("save event is raised when item is updated", 2, function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "inline",
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
            columns: ["foo", "name", { command: "edit" }],
            editable: "inline",
            cancel: function(e) {
                equal(e.model, dataSource.get("bar"));
                ok(e.container.length);
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);
        row.find(".k-grid-cancel").click();
    });

    test("calling preventDefault in the cancel event handler leaves the grid in edit mode", function() {
        var grid = setup({
            columns: ["foo", { command: "edit" }],
            editable: "inline",
            cancel: function(e) {
                e.preventDefault();
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);

        row.find(".k-grid-cancel").click();

        equal(1, table.find("tr:first").find(".k-grid-cancel").length);
    });

    test("sync is not call if save event is canceled", function() {
        var grid = setup({
            columns: ["foo", "name"],
            editable: "inline",
            save: function(e) {
                e.preventDefault();
            }
        }),
        row = table.find("tr:first");

        grid.editRow(row);
        grid.saveRow();
        equal(row.find("input").length, 2);
    });

    test("editRow sets locked column in edit mode", function() {
        var grid = setup({
            columns: [ { field: "foo", locked: true }, "name"],
            editable: "inline"
        });

        grid.editRow(grid.table.find("tr:first"));

        ok(grid.lockedTable.find("tr:first").hasClass("k-grid-edit-row"));
        ok(grid.lockedTable.find("tr:first td").find("input").length);
    });

    test("same editable instance is attached to locked and non locked columns", function() {
        var grid = setup({
            columns: [ { field: "foo", locked: true }, "name"],
            editable: "inline"
        });

        grid.editRow(grid.table.find("tr:first"));

        deepEqual(grid.lockedTable.find("tr:first").data("kendoEditable"), grid.table.find("tr:first").data("kendoEditable"));
        deepEqual(grid.lockedTable.find("tr:first").data("kendoEditable"), grid.editable);
    });

    test("edit event is raised with both locked and non locked row as container", 3, function() {
        var grid = setup({
            columns: [ { field: "foo", locked: true }, "name"],
            editable: "inline",
            edit: function(e) {
                equal(e.container.length, 2);
                equal(e.container.eq(0)[0], grid.lockedTable.find("tr:first")[0]);
                equal(e.container.eq(1)[0], grid.table.find("tr:first")[0]);
            }
        });

        grid.editRow(grid.table.find("tr:first"));
    });

    test("cancel event adjusts the height of the edited locked and non locked row", function() {
        var grid = setup({
            columns: [ { field: "foo", locked: true, editor: "<textarea style='height:200px'></textarea>"}, "name"],
            editable: "inline"
        });

        var originalHeigth = grid.table.find("tr:first").height();

        grid.editRow(grid.table.find("tr:first"));

        grid.cancelRow();

        equal(grid.lockedTable.find("tr:first").height(), grid.table.find("tr:first").height());
        equal(grid.table.find("tr:first").height(), originalHeigth);
    });

    test("Validator instance has both locked and non locked rows as target", function() {
        var grid = setup({
            columns: [ { field: "foo", locked: true }, "name"],
            editable: "inline"
        });

        grid.editRow(grid.table.find("tr:first"));

        equal(grid.editable.validatable.element.length, 2);

        deepEqual(grid.lockedTable.find("tr:first")[0], grid.editable.validatable.element[0]);
        deepEqual(grid.table.find("tr:first")[0], grid.editable.validatable.element[1]);
    });

    test("cancel edit updates detail icon status", function() {
        var grid = setup({
            columns: [ "foo", "name"],
            editable: "inline",
            detailTemplate: "detail template"
        });

        grid.expandRow(grid.table.find("tr:first"));

        grid.editRow(grid.table.find("tr:first"));

        grid.cancelRow();

        ok(grid.table.find(".k-icon:first").hasClass("k-i-arrow-60-right"));
        ok(!grid.table.find(".k-icon:first").hasClass("k-i-arrow-60-down"));
    });

    asyncTest("saveRow detaches button click handlers", 1, function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        grid.dataItem(tr).set("foo", "42");
        grid.saveRow(tr).done(function() {
            start();
            ok(!$._data(tr[0], "events"));
        });

    });

    test("calling cancelRow from within the edit event does not throw error", 1, function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" }),
            tr = table.find("tr:first");

        grid.bind("edit", function() {
            grid.cancelRow();
        });

        grid.editRow(tr);

        ok(true);
    });

    test("cell click does not enter edit mode if editable returns false", function() {
        var grid = setup({ columns: [
                {
                    field: "foo", 
                    editable: function (dataItem) {
                        return dataItem.name !== "tom";
                    }
                },	
                { field: "name" }
            ], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);
        equal(tr.find("td:first > input").length, 0);
    });

    test("cell enters edit mode if editable returns true", function() {
        var grid = setup({ columns: [
                {
                    field: "foo", 
                    editable: function (dataItem) {
                        return dataItem.name === "tom";
                    }
                },	
                { field: "name" }
            ], editable: "inline" }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        equal(tr.find("td:first > input").length, 1);
    });

})();
