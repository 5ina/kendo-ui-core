(function() {
       var Grid = kendo.ui.Grid,
            table,
            DataSource = kendo.data.DataSource,
            Model = kendo.data.Model,
            dataSource;

        function setup(options) {
            options = $.extend({}, {
            editable: {
                confirmation: false
            },
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

            return table.kendoGrid(options).data("kendoGrid");
        }

        module("grid deleting", {
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

        test("removeRow calls DataSource remove method", function() {
            var grid = setup();
            var removeMethod = stub(dataSource, "remove");

            grid.removeRow(table.find("tbody>tr:first"));

            ok(removeMethod.calls("remove"));
            ok(removeMethod.args("remove", 0)[0] instanceof Model);
            equal(removeMethod.args("remove", 0)[0].get("foo"), "bar");
        });

        test("removeRow with html element as argument calls DataSource remove method", function() {
            var grid = setup();

            var removeMethod = stub(dataSource, "remove");

            grid.removeRow(table.find("tbody>tr:first")[0]);

            ok(removeMethod.calls("remove"));
            ok(removeMethod.args("remove", 0)[0] instanceof Model);
            equal(removeMethod.args("remove", 0)[0].get("foo"), "bar");
        });

        test("removeRow hides coresponding row from the grid", function() {
            var grid = setup();

            var tr = table.find("tbody>tr:first");

            grid.removeRow(tr);

            ok(!tr.is(":visible"));
        });

        test("removeRow hides coresponding locked row from the grid", function() {
            var grid = setup({
                editable: { mode: "incell", confirmation: false },
                height: 800,
                columns: [
                    { field: "foo", locked: true, width: 100 },
                    { field: "bar", locked: true, width: 100 },
                    { command: "destroy", width: 100 }
                ]});

            grid.dataSource.group({ field: "foo" });

            var lockedRow = grid.lockedTable.find("tbody>tr:not(.k-grouping-row):first");
            var tr = grid.tbody.find("tr:not(.k-grouping-row):first");

            grid.removeRow(tr);

            ok(!tr.is(":visible"), "non-locked");
            ok(!lockedRow.is(":visible"), "locked");
        });

        test("removeRow does not call DataSource remove method if not existing row", function() {
            var grid = setup();
            var removeMethod = stub(dataSource, "remove");

            grid.removeRow($("<tr />"));

            ok(!removeMethod.calls("remove"));
        });

        test("removeRow raises remove event", function() {
            var called = false,
                grid = setup({
                    remove: function() {
                        called = true;
                    }
                });

            grid.removeRow(table.find("tbody>tr:first"));

            ok(called);
        });

        test("dataSource is not called if remove event is called", function() {
            var grid = setup({
                    remove: function(e) {
                        e.preventDefault();
                    }
                }),
                removeMethod = stub(dataSource, "remove");

            grid.removeRow(table.find("tbody>tr:first"));

            ok(!removeMethod.calls("remove"));
        });

        test("removeRow raises remove event passing the model and row element", function() {
            var args,
                grid = setup({
                    remove: function() {
                       args = arguments[0];
                    }
                });

            grid.removeRow(table.find("tbody>tr:first"));

            ok(args.row.length);
            ok(args.model instanceof Model);
        });

        test("canceling the remove event destroyes the editable", function() {
            var args,
                grid = setup({
                    editable: "incell",
                    remove: function(e) {
                        e.preventDefault();
                    }
                });

            var destroyEditable = stub(grid, {
                "_destroyEditable": $.noop,
                "_showMessage": function() { return true; }
            });

            grid.removeRow(table.find("tbody>tr:first"));

            equal(destroyEditable.calls("_destroyEditable"), 1);
        });

        test("removeRow does not show confirmation message if editing is false", function() {
            var grid = setup({ editable: { confirmation: undefined } });
                method = stub(grid, "_showMessage");

            grid.removeRow(table.find("tbody>tr:first"));

            ok(!method.calls("_showMessage"));
        });

        test("removeRow calls _confirmation if delete confirm is true", function() {
            var grid = setup({ editable: { confirmation: true } });
                method = stub(grid, "_confirmation");

            grid.removeRow(table.find("tbody>tr:first"));

            ok(method.calls("_confirmation"));
        });

        test("confirmation as function", 1, function() {
            var grid = setup({ editable: { confirmation: function(e) { return "foo" + e.name; } } }),
                text;

            grid._showMessage = function(e) {
              equal(e.title, "footom");
            }

            grid.removeRow(table.find("tbody>tr:first"));

        });

        test("_confirmation uses default text when set to true", function() {
            var grid = setup({ editable: { confirmation: true } }),
                text;

            grid._showMessage = function() {
               text = arguments[0].title;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            equal(text, "Are you sure you want to delete this record?");
        });

        test("_confirmation use the text set through the options", function() {
            var grid = setup({ editable: { confirmation: "foo" } }),
                text;

            grid._showMessage = function() {
               text = arguments[0].title;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            equal(text, "foo");
        });

        test("_confirmation use the text set through the options", function() {
            var grid = setup({ editable: { confirmation: false } }),
               called = false;

            grid._showMessage = function() {
                called = true;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            ok(!called);
        });

        test("_confirmation use default if not set", function() {
            var grid = setup({ editable: true }),
               text;

            grid._showMessage = function() {
                text = arguments[0].title;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            equal(text,"Are you sure you want to delete this record?");
        });

        test("dataSource is not called if confirmation is false", function() {
            var grid = setup( { editable: true }),
                removeMethod = stub(dataSource, "remove");

            grid._showMessage = function() {
                return false;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            ok(!removeMethod.calls("remove"));
        });

        test("dataSource is called if confirmation is true", function() {
            var grid = setup( { editable: true }),
                removeMethod = stub(dataSource, "remove");

            grid._showMessage = function() {
                return true;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            ok(removeMethod.calls("remove"));
        });

        test("delete column is rendered if set", function() {
            var grid = setup( { editable: true, columns: [ { command: "destroy" }] });

            ok(grid.table.find("tr:first > td:last").has("a.k-grid-delete").length);
        });

        test("delete column is not rendered if not added to the column array", function() {
            var grid = setup( { editable: true });

            ok(!grid.table.find("tr:first > td:last").has("a.k-grid-delete").length);
        });

        test("clicking on the delete column button calls removeRow", function() {
            var grid = setup( { editable: true, columns: [ { command: "destroy" }]  }),
                removeMethod = stub(grid, "removeRow");

            grid.table.find("tr:first > td:last").find("a.k-grid-delete").click();

            ok(removeMethod.calls("removeRow"));
        });

        test("clicking on the delete column with a button calls removeRow", function() {
            var grid = setup( { editable: true, columns: [ { template: '<button class="k-grid-delete"></button>' }]  }),
                removeMethod = stub(grid, "removeRow");

            grid.table.find("tr:first > td:last").find("button.k-grid-delete").click();

            ok(removeMethod.calls("removeRow"));
        });

        test("no text is rendered in the header for delete command if no title is set", function() {
            var grid = setup( { editable: true, columns: [ { command: "destroy" }] }),
                cell = grid.thead.find("th:last") ;

            equal(cell.text(), "");
            ok(!cell.data("field"));
        });

        test("title is rendered in the header for delete command if set", function() {
            var grid = setup( { editable: true, columns: [ { command: "destroy", title: "foo" }] }),
                cell = grid.thead.find("th:last") ;

            equal(cell.text(), "foo");
            ok(!cell.data("field"));
        });

        test("sync is called if edit mode is inline", function() {
            var grid = setup( { editable: "inline" }),
                sync = stub(dataSource, "sync");

            grid._showMessage = function() {
                return true;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            ok(sync.calls("sync"));
        });

        test("sync is called if edit mode is popup", function() {
            var grid = setup( { editable: "popup" }),
                sync = stub(dataSource, "sync");

            grid._showMessage = function() {
                return true;
            }

            grid.removeRow(table.find("tbody>tr:first"));

            ok(sync.calls("sync"));
        });

        test("removeRow calls cancelRow if record is edited", function() {
            var grid = setup( { editable: { mode: "inline", confirmation: false } });
                cancelRowMethod = stub(grid, "cancelRow");

            grid.addRow();
            grid.removeRow(grid.items().eq(1));

            equal(cancelRowMethod.calls("cancelRow"), 3);//2 times called from addRow

        });

        test("removeRow does not call cancelRow if record is in incell edit", function() {
            var grid = setup( { editable: { mode: "incell", confirmation: false } });
                cancelRowMethod = stub(grid, "cancelRow");

            grid.addRow();

            grid.removeRow(grid.items().eq(1));

            ok(!cancelRowMethod.calls("cancelRow"));//2 times called from addRow
        });
    })();
