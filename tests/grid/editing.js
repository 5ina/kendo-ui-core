(function() {
   var Grid = kendo.ui.Grid,
        table,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        dataSource;

    function setup(options) {
        options = $.extend({}, {
        editable: true,
        dataSource: new DataSource({
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
            })
        }, options);
        dataSource = options.dataSource;

        return table.kendoGrid(options).data("kendoGrid");
    }

    module("grid editing", {
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

    test("render multiple column commands", function() {
        setup({ columns: [{ command: ["destroy", "edit"] }] });
        var cell = table.find("tr:first").find("td:first");
        equal(cell.find("a.k-button").length, 2);
        equal(cell.find("a.k-grid-delete").length, 1);
        equal(cell.find("a.k-grid-edit").length, 1);
    });

    test("cell click enters edit mode", function() {
        setup();
        var cell = table.find("td:first").click();

        ok(cell.find(":input").length);
    });

    test("locked cell click enters edit mode", function() {
        var grid = setup({ columns: [{ field: "foo", locked: true }, "name"] });

        var cell = grid.lockedTable.find("td:first").click();

        ok(cell.find(":input").length);
    });

    test("editing locked cell sync row height", function() {
        var grid = setup({ columns: [{ field: "foo", locked: true, editor: "<input style='height:200px'>" }, "name"] });

        var cell = grid.lockedTable.find("td:first").click();

        var tr = cell.parent();
        var related = grid._relatedRow(tr);

        equal(tr.height(), related.height());
    });

    test("closeCell on locked cell sync row height", function() {
        var grid = setup({ columns: [{ field: "foo", locked: true, editor: "<input style='height:200px'>" }, "name"] });

        var cell = grid.lockedTable.find("td:first");

        var originalHeight = cell.parent().height();

        grid.editCell(cell);
        grid.closeCell(cell);

        var tr = cell.parent();
        var related = grid._relatedRow(tr);

        equal(tr.height(), related.height());
        equal(tr.height(), originalHeight);
    });


    test("editing locked cell both rows have css class set", function() {
        var grid = setup({ columns: [{ field: "foo", locked: true }, "name"] });

        var cell = grid.lockedTable.find("td:first").click();

        var tr = cell.parent();
        var related = grid._relatedRow(tr);

        ok(tr.hasClass("k-grid-edit-row"));
        ok(related.hasClass("k-grid-edit-row"));
    });

    test("editing locked cell add css class", function() {
        var grid = setup({ columns: [{ field: "foo", locked: true }, "name"] });

        var cell = grid.lockedTable.find("td:first").click();

        ok(cell.hasClass("k-edit-cell"));
    });

    test("clicking next to a cell with additional table is switched to edit mode", function() {
        setup({
            columns: [
                { field: "foo", template: "<table><tr><td>inner foo</td></tr></table>" },
                "name"
            ]
        });
        var cell = table.find("td:last").click();
        ok(cell.find(":input").length);
    });

    test("clicking delete command cell does not switch to edit mode", function() {
        setup({ columns: [{ command: "destroy" }] });
        var cell = table.find("td:last").click();

        ok(!cell.hasClass("k-edit-cell"));
    });

    test("clicking edit command cell does not switch to edit mode in cell edit mode", function() {
        setup({ columns: [{ command: "edit" }] });
        var cell = table.find("td:last").click();

        ok(!cell.hasClass("k-edit-cell"));
    });

    test("clicking custom button does not switch cell to edit mode", function() {
        setup({ columns: [{ template: '<a href="\\#">Custom</a>' }] });
        var cell = table.find("td:last a").click();

        ok(!cell.hasClass("k-edit-cell"));
    });

    test("editing cell passes column field to Editable", function() {
        setup({ columns: ["foo", "name"] });
        var cell = table.find("td:first").click();

        equal(cell.data("kendoEditable").options.fields.field, "foo");
    });

    test("editing cell passes column settings to Editable", function() {
        setup({ columns: [{ field: "foo", format: "bar", editor: function(){} }, "name"] });
        var cell = table.find("td:first").click();

        equal(cell.data("kendoEditable").options.fields.field, "foo");
        equal(cell.data("kendoEditable").options.fields.format, "bar");
        ok(cell.data("kendoEditable").options.fields.editor);
    });

    test("column editor is not pass to the Editable if not set", function() {
        setup({ columns: [{ field: "foo"}, "name"] });
        var cell = table.find("td:first").click();

        ok(!cell.data("kendoEditable").options.fields.editor);
    });

    test("cell click does not enter edit mode if editable mode is inline", function() {
        setup({ editable: "inline" } );
        var cell = table.find("td:first").click();

        ok(!cell.find(":input").length);
    });

    test("cell click does not enter edit mode if editable is false", function() {
        setup({ editable: false } );
        var cell = table.find("td:first").click();

        ok(!cell.find(":input").length);
    });

    test("cell click does not enter edit mode if update is false", function() {
        setup({ editable: { update: false } } );
        var cell = table.find("td:first").click();

        ok(!cell.find(":input").length);
    });

    test("correct model is passed to the editable instance", function() {
        setup();
        var cell = table.find("td:first").click();

        equal(cell.data("kendoEditable").options.model, dataSource.get("bar"));
    });

    test("k-edit-cell is applied on edited cell", function() {
        setup();
        var cell = table.find("td:first").click();

        ok(cell.hasClass("k-edit-cell"));
    });

    test("k-grid-edit-row is applied on edited cell tr", function() {
        setup();
        var cell = table.find("td:first").click();

        ok(cell.parent().hasClass("k-grid-edit-row"));
    });

    test("k-grid-edit-row is removed from edited cell tr when closed", function() {
        setup();

        var cell = table.find("td:first").click();

        table.data("kendoGrid").closeCell();

        ok(!cell.parent().hasClass("k-grid-edit-row"));
    });

    test("clicking outside of the grid leaves edit mode", function() {
        setup();

        var cell = table.find("td:first").click();

        table.data("kendoGrid").closeCell();

        ok(!cell.hasClass("k-edit-cell"));
    });

    test("clicking outside of the grid restores display content", function() {
        setup();

        var cell = table.find("td:first").click();

         table.data("kendoGrid").closeCell();

        equal(cell.html(), "bar");
    });

    test("clicking on another editable cell sets previous to display mode", function() {
        setup();

        var cell = table.find("td:first").click();
        table.find("td").eq(1).click();

        ok(!cell.hasClass("k-edit-cell"));
        ok(!cell.find(":input").length);
    });

    test("clicking twice on same input stays visible", function() {
        setup();

        var cell = table.find("td:first").click().find(":input").click().end();

        ok(cell.hasClass("k-edit-cell"));
        ok(cell.find(":input").length);
    });

    test("model change handlers are destroyed", function() {
        var grid = setup();

        grid.editCell(table.find("td:first"));
        grid.closeCell();
        grid.editCell(table.find("td:first"));
        grid.closeCell();

        equal(dataSource.at(0)._events["change"].length, 1);
    });

    test("editCell with selector", 1, function() {
        var grid = setup();

        grid.editCell("table td:first");
        ok(grid.table.find("td:first").hasClass("k-edit-cell"));
    });

    test("clicking on k-hierarchy-cell does not edit the cell", function() {
        setup({ detailTemplate: "" });

        var cell = table.find(".k-hierarchy-cell:first").click();

        ok(!cell.find(":input").length);
    });

    test("clicking on k-detail-cell does not edit the cell", function() {
        var grid, cell;
        setup({ detailTemplate: "" });

        grid = table.data("kendoGrid");
        grid.expandRow(table.find("tr.k-master-row").first());
        cell = table.find(".k-detail-cell:first").click();

        ok(!cell.find(":input").length);
    });

    test("clicking on cell inside detail template does not edit the cell", function() {
        var grid, cell;
        setup({ detailTemplate: "<table><tr><td>template</td></tr></table>" });

        grid = table.data("kendoGrid");
        grid.expandRow(table.find("tr.k-master-row").first());
        cell = table.find(".k-detail-cell:first").find("td").click().end();

        ok(!cell.find(":input").length);
    });

    test("clicking on cell inside k-grouping-row does edit the cell", function() {
        var grid, cell;
        setup({ groupable: true });

        grid = table.data("kendoGrid");
        dataSource.group({ field: "id" });
        cell = table.find(".k-grouping-row:first>td").click();

        ok(!cell.find(":input").length);
    });

    test("clicking on cell inside k-group-cell does edit the cell", function() {
        var grid, cell;
        setup({ groupable: true });

        grid = table.data("kendoGrid");
        dataSource.group({ field: "id" });
        cell = table.find(".k-group-cell:first").click();

        ok(!cell.find(":input").length);
    });

    test("cellIndex returns cell index skipping the group cell", function() {
        var grid, cell;
        setup({ groupable: true });

        grid = table.data("kendoGrid");
        dataSource.group({ field: "id" });
        cell = table.find("tr:not(.k-grouping-row):first>td:nth(1)");

        equal(grid.cellIndex(cell), 0);
    });

    test("cellIndex returns cell index skipping the hierarchy cell", function() {
        var grid, cell;
        setup({ detailTemplate: "" });

        grid = table.data("kendoGrid");
        cell = table.find("tr:first>td:nth(1)");

        equal(grid.cellIndex(cell), 0);
    });

    test("cellIndex returns cell index skipping both detail/hierarchy cell", function() {
        var grid, cell;
        setup({ detailTemplate: "", groupable: true });

        grid = table.data("kendoGrid");
        dataSource.group({ field: "id" });
        cell = table.find("tr.k-master-row:first>td:nth(2)");

        equal(grid.cellIndex(cell), 0);
    });

    test("edit cell input is populated with correct item value", function() {
        var grid, cell;
        setup({ detailTemplate: "" });

        grid = table.data("kendoGrid");
        cell = table.find("tr:first>td:nth(1)").click();

        equal(cell.find(":input").val(), "bar");
    });

    test("no error is raised when edited row is edited after been deleted", function() {
        var grid = setup({
            columns: [{ field: "name", locked: true }, "foo"],
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: { field: "foo", editable: false },
                            name: "name"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })

        });

        var cell = grid.lockedTable.find("tr:first>td:first").click();

        var data = grid.dataSource.data();
        var model = data.splice(0, data.length)[0];

        model.set("name", "moo");

        equal(grid.dataSource.view().length, 0);
    });

    test("edit cell is not refreshed on modelChange", function() {
        var grid, cell;
        setup();

        cell = table.find("tr:first>td:first").click();
        grid = table.data("kendoGrid");
        grid.dataSource.get("bar").set("name", "bart");

        cell = table.find("tr:first>td:first");

        ok(cell.find(":input").length);
        equal(cell.find(":input").val(), "bar");
        equal(cell.next().text(), "bart");
    });

    test("editibale is destroyed after cell exit edit mode", function() {
        setup();

        table.find("tr>td:first").click();
        table.data("kendoGrid").closeCell();

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(!table.find("tr>td:first").data("kendoEditable"));
    });

    test("click on cell of a editable=false field does not enter edit mode", function() {
        setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: { field: "foo", editable: false },
                            name: "name"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        });

        table.find("tr>td:first").click();

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(!table.find("tr>td:first").data("kendoEditable"));
    });

    test("validate is called when cell leaves edit mode", function() {
        setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            name: "name",
                            foo: { field: "foo" }
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        });


        table.find("tr>td:first").click();
        var validate = stub(table.find("tr>td:first").data("kendoValidator"), "validate");
        table.find("tr>td:nth(1)").click();

        ok(validate.calls("validate"));
    });

    test("cell does not leave edit mode if validation fails when another editable cell is clicked", function() {
        setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: {
                                field: "foo",
                                validation: {
                                    foo: function() {
                                        return false;
                                    }
                                }
                            },
                            name: "name"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        });


        table.find("tr>td:first").click();

        table.find("tr>td:nth(1)").click();

        ok(table.find("tr>td:first").hasClass("k-edit-cell"));
        equal(table.find("td.k-edit-cell").length, 1);
    });

    test("beforeEdit event is raised before entering edit mode", 3, function() {
        var grid = setup({
                beforeEdit: function(e) {
                    ok(!e.container);
                    ok(!this._editContainer);
                    equal(e.model, grid.dataSource.get("bar"));
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: "foo"
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();
    });

    test("beforeEdit event can be prevented", 3, function() {
        var grid = setup({
                beforeEdit: function(e) {
                    ok(!e.container);
                    ok(!this._editContainer);
                    equal(e.model, grid.dataSource.get("bar"));
                    e.preventDefault();
                },
                edit: function(e) {
                    ok(false);
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: "foo"
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();
    });

    test("edit event is raised when entering edit mode", function() {
        var args,
            grid = setup({
                edit: function() {
                    args = arguments[0];
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: "foo"
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();

        ok(args.container.find("input").length);
        equal(args.model, grid.dataSource.get("bar"));
    });

    test("edit event is not raised for editable=false columns", function() {
        var called = false,
            grid = setup({
                edit: function() {
                    called = true;
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: { field: "foo", editable: false  }
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();

        ok(!called);
    });

    test("change model value during save event", function() {
        var args,
            grid = setup({
                save: function(e) {
                    e.model.set("foo", "boo");
                    e.preventDefault();
                },
                dataSource: new DataSource({
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();
        table.find("tr>td:first input").val("baz").change();
        grid.closeCell();
        equal(table.find("tr>td:first").text(), "boo");
    });

    test("save event is raised when item is updated", function() {
        var args,
            grid = setup({
                save: function() {
                   args = arguments[0];
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: { field: "foo" }
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();
        table.find("tr>td:first input").val("baz").change();

        equal(args.model, dataSource.get("bar"));
        equal(args.values.foo, "baz");
        ok(args.container.length);
    });

    test("canceling save event does not change the model", function() {
        var called = false,
            grid = setup({
                save: function(e) {
                    e.preventDefault();
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: { field: "foo" }
                            }
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        table.find("tr>td:first").click();
        table.find("tr>td:first input").val("baz").change();

        equal(dataSource.get("bar").get("foo"), "bar");

    });

    test("saveChanges calls datasource sync", function() {
        var grid = setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo"
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        syncMethod = stub(dataSource, "sync");

        grid.saveChanges();

        ok(syncMethod.calls("sync"));
    });

    test("saveChanges calls datasource sync", function() {
        var grid = setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo"
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        syncMethod = stub(dataSource, "sync");

        grid.saveChanges();

        ok(syncMethod.calls("sync"));
    });

    test("saveChanges does not call datasource sync if validation fails", function() {
        var grid = setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: { foo: { field: "foo", validation: { required: true }}}
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        syncMethod = stub(dataSource, "sync");

        grid.addRow();

        grid.saveChanges();

        ok(!syncMethod.calls("sync"));
    });

    test("saveChanges triggers saveChanges event", function() {
        var called = false,
            grid = setup({
                saveChanges: function() {
                    called = true;
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo"
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            });

        grid.saveChanges();

        ok(called);
    });

    test("if saveChanges is canceled dataSource is not called", function() {
        var grid = setup({
                saveChanges: function(e) {
                    e.preventDefault();
                },
                dataSource: new DataSource({
                    schema: {
                        model: {
                            id: "foo"
                        }
                    },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                })
            }),
            method = stub(dataSource, "sync");

        grid.saveChanges();

        ok(!method.calls("sync"));
    });

    test("cancelChanges calls datasource cancelChanges", function() {
        var grid = setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo"
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        method = stub(dataSource, "cancelChanges");

        grid.cancelChanges();

        ok(method.calls("cancelChanges"));
    });

    test("dirty flag is shown for modified cell after edit", function() {
        var grid = setup({
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: "foo"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        cell = table.find("tr:first > td:first");

        cell.click();
        cell.find("input").val("baz").change();
        grid.closeCell();
        ok(cell.find("span.k-dirty").length);
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

    test("editRow puts row in edit mode when there is new row in edit mode", function() {
        var grid = setup({ columns: ["foo", "name"], editable: "inline" });
        grid.addRow();

        var row = table.find("tr").eq(1);
        var uid = row.attr(kendo.attr("uid"));

        grid.editRow(row);

        var editRow = table.find(".k-grid-edit-row");

        equal(editRow.attr(kendo.attr("uid")), uid);
    });

    test("editRow sets the first editable cell in edit mode", function() {
        var grid = setup({
                columns: ["foo", "name"],
                editable: true ,
                dataSource: {
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: { editable: false },
                                name: "name"
                            }
                        }
                    },

                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                }
            }),
            tr = table.find("tr:first");

        grid.editRow(tr);

        var editable = tr.find("td:last").data("kendoEditable");

        equal(editable.options.fields.field, "name");
    });

    test("editRow sets the first editable cell in edit mode with grouping", function() {
        var grid = setup({
                columns: ["foo", "name"],
                editable: true ,
                dataSource: {
                    schema: {
                        model: {
                            id: "foo",
                            fields: {
                                foo: { editable: false },
                                name: "name"
                            }
                        }
                    },
                    group: { field: "foo" },
                    data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
                }
            }),
            tr = grid.items().first();

        grid.editRow(tr);

        var editable = tr.find("td:last").data("kendoEditable");

        equal(editable.options.fields.field, "name");
    });


    test("addRow insert item at the end of the first page", function() {
        var grid = setup({
            editable: { createAt : "bottom" }
        });

        grid.addRow();
        var item = grid.element.find(".k-grid-edit-row");

        equal(item.index(), 2);
    });

    test("addRow insert item at the end of the current page", function() {
        var grid = setup({
            editable: { createAt : "bottom" },
            pageable: true,
            dataSource: new DataSource({
                schema: {
                    model: { id: "foo" }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }],
                pageSize: 2
            })
        });

        grid.addRow();
        var item = grid.element.find(".k-grid-edit-row");

        equal(item.index(), 1);
    });

    test("addRow insert item at the end of the current page when server paging", function() {
        var grid = setup({
            editable: { createAt : "bottom" },
            pageable: true,
            dataSource: new DataSource({
                schema: {
                    model: { id: "foo" }
                },
                serverPaging: true,
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }],
                pageSize: 2
            })
        });

        grid.addRow();
        var item = grid.element.find(".k-grid-edit-row");

        equal(item.index(), 2);
    });

    test("addRow on empty page", function() {
        var grid = setup({
            editable: {
                confirmation: false
            },
            pageable: true,
            dataSource: new DataSource({
                schema: {
                    model: { id: "foo" }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }],
                pageSize: 1
            })
        });

        grid.dataSource.page(2);
        grid.removeRow(grid.items());
        grid.addRow();
        var item = grid.element.find(".k-grid-edit-row");

        equal(item.length, 1);
        equal(grid.dataItem(item).isNew(), true);
    });

    test("add row cancels previous inserted item", function() {
        var grid = setup({
                editable: { mode: "inline" },
                dataSource: new DataSource({
                    schema: {
                        model: { id: "foo" }
                    },
                    data: [{ foo: "bar", name: "tom" }],
                })
            });

        grid.addRow();
        grid.addRow();

        equal(dataSource.data().length, 2);
    });

    test("addRow set the first editable set in edit mode", function() {
        var grid = setup({
            editable: { mode: "incell" },
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: { editable: false },
                            name: "name",
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }],
            })
        });

        grid.addRow();

        ok(grid.table.find("tr:first td:last input").length);
    });

    test("dirty flag is shown on locked columns", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name" }
            ],
            dataSource: new DataSource({
                schema: {
                    model: {
                        id: "foo",
                        fields: {
                            foo: "foo"
                        }
                    }
                },
                data: [{ foo: "bar", name: "tom" }, { foo: "baz", name: "jerry" }]
            })
        }),
        cell = grid.lockedTable.find("tr:first > td:first");

        cell.click();
        cell.find("input").val("baz").change();
        grid.closeCell();
        ok(cell.find("span.k-dirty").length);
    });

    test("editCell destroyes previous editor", function() {
        var grid = setup();

        grid.editCell(table.find("td:first"));
        grid.editCell(table.find("td:last"));

        equal(grid.table.find(".k-edit-cell").length, 1);
    });

    test("calling editCell multiple times doesn't trigger cancel event", function() {
        var wasCalled = false;
        var grid = setup({
            cancel: function() {
                wasCalled = true;
            }
        });

        grid.editCell(table.find("td:first"));
        grid.editCell(table.find("td:last"));

        ok(!wasCalled);
    });

    test("cellClose event is triggered", 3, function() {
        var wasCalled = false;
        var grid = setup({
            cellClose: function(e) {
                ok(e.container.is(table.find("td:first")));
                equal(e.model, grid.dataSource.get("bar"));
                equal(e.type, "save");
            }
        });

        grid.editCell(table.find("td:first"));
        grid.editCell(table.find("td:last"));
    });

    test("updating model field persist row selection", function() {
        var grid = setup({
            selectable: true,
            columns: [{ field: "foo" }, "name"],
            editable: true
        }),
        row = table.find("tr:first");

        grid.select(row);

        grid.editCell(row.find("td:first"));

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.table.find("tr:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ field: "foo" }, "name"],
            editable: true
        }),
        row = table.find("tr:first");

        grid.select(row.find("td:first"));

        grid.editCell(row.find("td:first"));

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.table.find("tr:first td:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection with locked columns", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ locked: true, field: "foo" }, "name"],
            editable: true
        }),
        row = table.find("tr:first");

        grid.select(grid.lockedTable.find("tr:first td:first"));

        grid.editCell(grid.lockedTable.find("tr:first td:first"));

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("foo", "12");

        ok(grid.lockedTable.find("tr:first td:first").hasClass("k-state-selected"));
    });

    test("updating model field persist cell selection - updated field is not selected one", function() {
        var grid = setup({
            selectable: "cell",
            columns: [{ field: "foo" }, "name"],
            editable: true
        }),
        row = table.find("tr:first");

        grid.select(row.find("td:first"));

        grid.editCell(row.find("td:last"));

        var container = grid._editContainer;
        var model = container.data("kendoEditable").options.model;

        model.set("bar", "12");

        ok(grid.table.find("tr:first td:first").hasClass("k-state-selected"));
    });

    test("cell click enters edit mode - multiline headers", function() {
        setup({ columns: [
            { title: "master", columns: [ { field: "foo" } ] },
            { field: "name" }
        ]});

        var cell = table.find("td:first").click();

        ok(cell.find(":input").length);
    });

    test("cell click does not enter edit mode if editable returns false", function() {
        setup({
            columns: [
                {
                    field: "foo", 
                    editable: function (dataItem) {
                        return dataItem.name !== "tom";
                    }
                },
                { field: "name" }
            ]
        });

        var cell = table.find("td:first").click();
        equal(cell.find(":input").length, 0);
    });

    test("cell enters edit mode if editable returns true", function() {
        setup({
            columns: [
                {
                    field: "foo", 
                    editable: function (dataItem) {
                        return dataItem.name === "tom";
                    }
                },
                { field: "name" }
            ]
        });

        var cell = table.find("td:first").click();
        equal(cell.find(":input").length, 1);
    });

})();
