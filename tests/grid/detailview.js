(function() {
   var Grid = kendo.ui.Grid,
        DataSource = kendo.data.DataSource;

    function table() {
        return QUnit.fixture[0].appendChild(document.createElement("table"));
    }

     module("kendo.ui.Grid detailTemplate", {
        setup: function() {
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            $("div.k-grid").remove();
        }
    });

    test("detailTemplate renders rows element with css class name", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        ok($(grid.detailTemplate({})).hasClass("k-detail-row"));
    });

    test("detailTemplate renders rows element", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        ok($(grid.detailTemplate({})).is("tr"));
    });

    test("template has two cells if no grouping is applied", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        equal($(grid.detailTemplate({})).find("td").length, 2);
    });

    test("detailView cell has colspan equal to the column number", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        equal($(grid.detailTemplate({})).find("td").last().attr("colspan"), 2);
    });

    test("detailView cell has no colspan applied if there are no columns", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            detailTemplate: "foo"
        });

        ok(!$(grid.detailTemplate({})).find("td").last().attr("colspan"));
    });

    test("detailView first cell has css class applied", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        ok($(grid.detailTemplate({})).find("td").first().hasClass("k-hierarchy-cell"));
    });

    test("template content is added to the detailView row last cell", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: "foo"
        });

        equal($(grid.detailTemplate({})).find("td").last().text(), "foo");
    });

    test("default detailTemplate uses specified template settings renders data for the columns", function() {
        var grid = new Grid(table(), { templateSettings: {useWithBlock: false, paramName: "item" }, dataSource: [], columns: [{ field: "foo" }], detailTemplate: "#= item.foo #" });

        ok(grid.detailTemplate.toString().indexOf("item.foo") > -1);
    });

    test("template (as function) content is added to the detailView row last cell", function() {
        var grid = new Grid(table(), {
            dataSource: [],
            columns: [{ field: "foo" }, { field: "bar" }],
            detailTemplate: function() {
                return "baz";
            }
        });

        equal($(grid.detailTemplate({})).find("td").last().text(), "baz");
    });

    test("css class is added to the data rows when detailView is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #"
        });

        equal(grid.tbody.find(".k-master-row").length, 3);
    });

    test("css class is not added to the data rows when no detailView is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }]
        });

        ok(!grid.tbody.find(".k-master-row").length);
    });

    test("additional cell is added to the master rows when detailView is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #"
        }),
        masterRows = grid.tbody.find(".k-master-row");

        equal(masterRows.eq(0).find("td.k-hierarchy-cell").length, 1);
        ok(masterRows.eq(0).find("td").first().hasClass("k-hierarchy-cell"));
        equal(masterRows.eq(1).find("td.k-hierarchy-cell").length, 1);
        ok(masterRows.eq(1).find("td").first().hasClass("k-hierarchy-cell"));
        equal(masterRows.eq(2).find("td.k-hierarchy-cell").length, 1);
        ok(masterRows.eq(2).find("td").first().hasClass("k-hierarchy-cell"));
    });

    test("button is added to the master row additional cell when detailView is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #"
        }),
        masterRows = grid.tbody.find(".k-master-row");

        ok(masterRows.find("td.k-hierarchy-cell > a.k-icon").length);
    });

    test("detailView row is correctly populate from data item", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #"
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        equal(grid.tbody.find(".k-detail-row").find("td:last").text(), "foo");
    });

    test("detailTemplate is not rendered if no template is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }],
            columns: [{ field: "foo" }]
        });

        ok(!grid.tbody.find(".k-detail-row").length);
    });

    test("non-scrollable grid hierarchy cell is added to the header", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: false
        }),
        header = grid.thead;

        equal(header.find("th").length, 2);
        equal(header.find("th.k-hierarchy-cell").length, 1);
        ok(header.find("th").first().hasClass("k-hierarchy-cell"));
    });

    test("non-scrollable grid hierarchy cell is not added to the header if no detailView", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            scrollable: false
        }),
        header = grid.thead;

        equal(header.find("th").length, 1);
        ok(!header.find("th.k-hierarchy-cell").length);
    });

    test("scrollable grid hierarchy cell is added to the header", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        header = grid.thead;

        equal(header.find("th").length, 2);
        equal(header.find("th.k-hierarchy-cell").length, 1);
        ok(header.find("th").first().hasClass("k-hierarchy-cell"));
    });

    test("extra col element is generated when detailView is declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        data = grid.table;

        equal(data.find("col").length, 2);
        equal(data.find("col.k-hierarchy-col").length, 1);
        ok(data.find("col").first().hasClass("k-hierarchy-col"));
    });

    test("no extra col element is generated when detailView is not declared", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            scrollable: true
        }),
        data = grid.table;

        equal(data.find("col").length, 1);
        ok(!data.find("col.k-hierarchy-col").length);
    });

    test("clicking on the expand button shows the detailView for given master row", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        masterRow.find(".k-hierarchy-cell .k-i-arrow-60-down").click();

        ok(masterRow.next(":visible").hasClass("k-detail-row"));
        ok(!masterRow.find(".k-hierarchy-cell .k-i-arrow-60-down").length);
        ok(masterRow.find(".k-hierarchy-cell .k-i-arrow-60-right").length);
    });

    test("clicking on the collapse button hides the detailView for given master row", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        masterRow.find(".k-hierarchy-cell .k-i-arrow-60-right").click();

        ok(masterRow.next(":not(:visible)").hasClass("k-detail-row"));
    });

    test("collapseRow hides the detailView for given master row", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        grid.collapseRow(masterRow);

        ok(masterRow.next(":not(:visible)").hasClass("k-detail-row"));
    });

    test("multiple calls to collapseRow does not toggle the detailView", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);
        grid.collapseRow(masterRow);

        ok(grid.tbody.find("tr.k-detail-row:first").is(":not(:visible)"));
    });

    test("expandRow shows the detailView for given master row", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailTemplate: "#= foo #",
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        ok(masterRow.next(":visible").hasClass("k-detail-row"));
    });

    test("multiple calls to expandRow for same row does not recreate the template", function() {
        var count = 0,
            grid = new Grid(table(), {
                dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
                columns: [{ field: "foo" }],
                detailTemplate: function() { count++ }
            }),
            masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);
        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);
        grid.expandRow(masterRow);
        equal(count,1);
    });

    test("detailExpand event is raised when detail template is expanded", function() {
        var args,
            grid = new Grid(table(), {
                dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
                columns: [{ field: "foo" }],
                detailTemplate: "#= foo #",
                detailExpand: function() {
                   args = arguments[0];
                }
            }),
            masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);
        equal(args.masterRow[0], masterRow[0]);
        equal(args.detailRow[0], masterRow.next()[0]);
    });

    test("detailCollapse event is raised when detail template is expanded", function() {
        var args,
            grid = new Grid(table(), {
                dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
                columns: [{ field: "foo" }],
                detailTemplate: "#= foo #",
                detailCollapse: function() {
                   args = arguments[0];
                }
            }),
            masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);
        equal(args.masterRow[0], masterRow[0]);
        equal(args.detailRow[0], masterRow.next()[0]);
    });

    test("detailInit event is raised when detail template is created", function() {
        var args,
            grid = new Grid(table(), {
                dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
                columns: [{ field: "foo" }],
                detailTemplate: "<span id='test'></span>",
                detailInit: function() {
                   args = arguments[0];
                }
            }),
            masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        equal(args.masterRow[0], masterRow[0]);
        equal(args.detailRow[0], masterRow.next()[0]);
        equal(args.data.foo, "foo");
        ok(grid.tbody.find("span#test").length);
    });

    test("detailInit event is raised only once per item", function() {
        var count = 0,
            grid = new Grid(table(), {
                dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
                columns: [{ field: "foo" }],
                detailTemplate: "<span id='test'></span>",
                detailInit: function() {
                    count++;
                }
            }),
            masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);
        grid.expandRow(masterRow);
        grid.collapseRow(masterRow);

        equal(count, 1);
    });

    test("expandRow shows the detailView for given master row if no detailTemplate but detailInit is attached", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            columns: [{ field: "foo" }],
            detailInit: function(e) {
                e.detailCell.text("foo");
            },
            scrollable: true
        }),
        masterRow = grid.tbody.find("tr.k-master-row:first");

        grid.expandRow(masterRow);

        var detailRow = masterRow.next(":visible");
        ok(detailRow.hasClass("k-detail-row"));
        equal(detailRow.find(".k-detail-cell").text(), "foo");
    });

    test("alternating master rows have detail row with k-alt class name", function() {
        var grid = new Grid(table(), {
            dataSource: [{ foo: "foo" }, { foo: "bar" }, { foo: "boo" }],
            detailTemplate: "foo",
            columns: [{ field: "foo" }]
        }),
        masterRow = grid.tbody.find("tr.k-master-row:eq(1)");

        grid.expandRow(masterRow);

        var detailRow = masterRow.next();

        ok(masterRow.hasClass("k-alt"));
        ok(detailRow.hasClass("k-alt"));
    });
})();
