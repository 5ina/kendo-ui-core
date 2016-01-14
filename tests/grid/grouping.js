(function() {
    var Grid = kendo.ui.Grid,
        DataSource = kendo.data.DataSource;

    function table() {
        return QUnit.fixture[0].appendChild(document.createElement("table"));
    }

    module("kendo.ui.Grid grouping", {
        setup: function() {
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("groupable instanciate kendo.ui.Groupable", function() {
        var grid = new Grid(table(), { dataSource:[], groupable: true });
        ok(grid.groupable);
    });

    test("groupable creates .k-grouping-header", function() {
        var grid = new Grid(table(), { dataSource:[], groupable: true }),
            gridElement = grid.wrapper;

        var groupingHeader = gridElement.find("div.k-grouping-header");
        equal(groupingHeader.length, 1);
    });

    test("groupable is not initialized when groupable.enabled is set to false", function() {
        var grid = new Grid(table(), { dataSource:[], groupable: {
            enabled: false
        } }),
            gridElement = grid.wrapper;

        var groupingHeader = gridElement.find("div.k-grouping-header");
        equal(groupingHeader.length, 0);
    });

    test("groupable creates .k-grouping-header after the toolbar", function() {
        var grid = new Grid(table(), {
                dataSource:[],
                toolbar: "toolbar",
                groupable: true
            }),
            gridElement = grid.wrapper;

        var groupingHeader = gridElement.find("div.k-grouping-header");
        ok(groupingHeader.prev().hasClass("k-grid-toolbar"));
    });

    test("grouping row is created for every group", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo"}, {foo: "bar"}], groupable: true
        });
        grid.dataSource.group({field: "foo"});

        var groupingRows = grid.tbody.find("tr.k-grouping-row");
        equal(groupingRows.length, 2);
    });

    test("first level grouping row colspans is columns + number of groups", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo"}, {foo: "bar"}], groupable: true
        });
        grid.dataSource.group({field: "foo"});

        var groupingRowCell = grid.tbody.find("tr.k-grouping-row>td:first");
        equal(groupingRowCell.attr("colspan"), 2);
    });

    test("first level grouping row colspans is columns + number of groups and detailView if declared", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo"}, {foo: "bar"}],
            groupable: true,
            detailTemplate: "ddd"
        });
        grid.dataSource.group({field: "foo"});

        var groupingRowCell = grid.tbody.find("tr.k-grouping-row>td:first");
        equal(groupingRowCell.attr("colspan"), 3);
    });

    test("collapsing a group of the detail grid does not trigger master grid", function() {
        var grid = new Grid(table(), {
                dataSource:[{foo: "foo"}, {foo: "bar"}],
                groupable: true,
                detailTemplate: ""
            }),
            innerGrid;

        grid.bind("detailInit", function(e){
            innerGrid = $("<div/>").appendTo(e.detailCell).kendoGrid({
                dataSource: {
                    data: [{ foo: "foo" }],
                    group: {field: "foo" }
                },
                groupable: true
            }).data("kendoGrid");
        });
        grid.expandRow(grid.tbody.find("tr.k-master-row:first"));
        var masterExpandGroup = stub(grid, "expandGroup");

        innerGrid.tbody.find("tr.k-grouping-row:first > td:first a").click();
        equal(masterExpandGroup.calls("expandGroup"), 0);
    });

    test("expanding group with persist detail template state", function() {
        var grid = new Grid(table(), {
                dataSource: {
                    data: [{foo: "foo"}, {foo: "bar"}],
                    group: { field: "foo" }
                },
                groupable: true,
                detailTemplate: "foo"
            });
        grid.expandRow(grid.tbody.find("tr.k-master-row:first"));
        grid.collapseRow(grid.tbody.find("tr.k-master-row:first"));

        grid.expandGroup(grid.tbody.find("tr.k-grouping-row:first"));

        ok(!grid.tbody.find("tr.k-detail-row:first").is(":visible"));
    });

    test("nesting groups created grouping row for every group", function() {

        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}], groupable: true
        });
        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);

        var groupingRows = grid.tbody.find("tr.k-grouping-row");
        var groupingCells = groupingRows.find("td");
        equal(groupingRows.length, 4);
        equal(groupingCells.eq(0).attr("colspan"), 4);
        ok(groupingCells.eq(1).is(".k-group-cell"));
        equal(groupingCells.eq(2).attr("colspan"), 3);
    });

    test("nested groups creates group cells for nested grouping rows", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}], groupable: true
        });
        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);

        var nestedGroupingRow = grid.tbody.find("tr.k-grouping-row").eq(1);
        ok(nestedGroupingRow.find("td:first").is(".k-group-cell"));
    });

    test("group cells are created for every data row", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}], groupable: true
        });
        grid.dataSource.group([{field: "foo"}]);

        var dataRows = grid.tbody.find("tr:not(.k-grouping-row)").eq(0);
        ok(dataRows.find("td:first").is(".k-group-cell"));
    });

    test("grouping scrollable grid creates header group cells", function() {
         var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true,
            scrollable: true
        }),
        header = grid.thead;

        grid.dataSource.group([{field: "foo"},{field: "bar"}]);

        var headerCells = header.find("th");
        equal(headerCells.length, 4);
        ok(headerCells.is(".k-group-cell"));
    });

    test("grouping non-scrollable grid creates header group cells", function() {
         var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true,
            scrollable: false
        }),
        header = grid.thead;

        grid.dataSource.group([{field: "foo"},{field: "bar"}]);

        var headerCells = header.find("th");
        equal(headerCells.length, 4);
        ok(headerCells.is(".k-group-cell"));
    });

    test("ungroup remove header group cells", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}], groupable: true
        }),
        header = grid.thead;
        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);
        grid.dataSource.group([{field: "foo"}]);

        var headerCells = header.find("th");
        equal(headerCells.length, 3);
    });

    test("ungroup all remove all header group cells", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}], groupable: true
        }),
        header = grid.thead;
        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);
        grid.dataSource.group([]);

        var headerCells = header.find("th");
        equal(headerCells.length, 2);
    });

    test("grouping scrollable grid creates footer group cells", function() {
         var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true,
            scrollable: true,
            columns: [ { field: "foo", footerTemplate: "foo" }, "bar" ]
        });

        grid.dataSource.group([{field: "foo"}]);

        var cells = grid.footer.find("td");
        equal(cells.length, 3);
        ok(cells.eq(0).is(".k-group-cell"));
    });

    test("ungroup scrollable grid remove footer group cells", function() {
         var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true,
            scrollable: true,
            columns: [ { field: "foo", footerTemplate: "foo" }, "bar" ]
        });

        grid.dataSource.group([{field: "foo"}]);
        grid.dataSource.group([]);

        var cells = grid.footer.find("td");
        equal(cells.length, 2);
    });

    test("grouping scrollable grid with aggregates creates footer group cells", function() {
         var grid = new Grid(table(), {
             dataSource:{
                 data: [{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
                 group: [{ field: "foo" }],
                 aggregate: [{ field: "foo", aggregate: "count" }]
             },
             groupable: true,
             scrollable: true,
        });

        var cells = grid.footer.find("td");
        equal(cells.length, 3);
        ok(cells.eq(0).is(".k-group-cell"));
    });

    test("ungroup scrollable grid with aggregates removes footer group cells", function() {
         var grid = new Grid(table(), {
             dataSource:{
                 data: [{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
                 group: [{ field: "foo" }],
                 aggregate: [{ field: "foo", aggregate: "count" }]
             },
             groupable: true,
             scrollable: true,
        });

        grid.dataSource.group([]);

        var cells = grid.footer.find("td");
        equal(cells.length, 2);
    });

    test("collapseGroup hides all group data rows", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true
        });

        grid.dataSource.group([{field: "foo"}]);
        grid.collapseGroup(grid.tbody.find("tr.k-grouping-row:first"));

        var dataRows = grid.tbody.children(":not(.k-grouping-row)");
        equal(dataRows.length, 2);
        ok(dataRows.eq(0).is(":hidden"));
        ok(dataRows.eq(1).is(":visible"));
    });

    test("collapseGroup change button class to k-i-expand", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true
        }),
        groupingRow;

        grid.dataSource.group([{field: "foo"}]);
        groupingRow = grid.tbody.find("tr.k-grouping-row:first");
        grid.collapseGroup(groupingRow);

        ok(groupingRow.find(".k-icon").hasClass("k-i-expand"));
    });

    test("expandGroup change button class to k-i-collapse", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true
        }),
        groupingRow;

        grid.dataSource.group([{field: "foo"}]);
        groupingRow = grid.tbody.find("tr.k-grouping-row:first");
        grid.collapseGroup(groupingRow);
        grid.expandGroup(groupingRow);

        ok(groupingRow.find(".k-icon").hasClass("k-i-collapse"));
    });

    test("expandGroup shows all group data rows", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "fooz", bar: "baz"}],
            groupable: true
        }),
        groupingRow;

        grid.dataSource.group([{field: "foo"}]);
        groupingRow = grid.tbody.find("tr.k-grouping-row:first");
        grid.collapseGroup(groupingRow);
        grid.expandGroup(groupingRow);

        var dataRows = grid.tbody.children(":not(.k-grouping-row)");
        equal(dataRows.length, 2);
        ok(dataRows.eq(0).is(":visible"));
        ok(dataRows.eq(1).is(":visible"));
    });

    test("expand parent group does not expand collapsed sub groups", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "foo", bar: "baz"}],
            groupable: true
        }),
        tbody,
        masterGroup,
        subGroup;

        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);
        tbody = grid.tbody;
        masterGroup = tbody.find(".k-grouping-row:first");
        subGroup = tbody.find(".k-grouping-row").eq(1);

        grid.collapseGroup(subGroup);
        grid.collapseGroup(masterGroup);
        grid.expandGroup(masterGroup);

        equal(tbody.find("tr:visible").length, 4);
        ok(subGroup.find(".k-icon").hasClass("k-i-expand"));
    });

    test("expand parent group shows the footers of subgroups that are visible", function() {
        var grid = new Grid(table(), {
            groupable: {
                showFooter: true,
            },
            dataSource:[{foo: "foo", bar: "bar" }, {foo: "foo", bar: "baz"}],
            columns: [{ field:"foo", groupFooterTemplate: "<span class='my-class'></span>"}, { field:"bar" }],
        }),
        tbody,
        masterGroup,
        subGroup;

        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);
        tbody = grid.tbody;
        masterGroup = tbody.find(".k-grouping-row:first");
        firstSubGroup = tbody.find(".k-grouping-row").eq(1);
        secondSubGroup = tbody.find(".k-grouping-row").eq(2);

        grid.collapseGroup(firstSubGroup);
        grid.collapseGroup(secondSubGroup);

        grid.collapseGroup(masterGroup);
        grid.expandGroup(masterGroup);

        equal(tbody.find(".k-group-footer").length, 3);
    });

    test("grouping non-groupable grid updates html", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "foo", bar: "baz"}],
            groupable: false
        });

        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);

        equal(grid.thead.find("th").length, 4);
        equal(grid.wrapper.find(".k-group-cell").length, 8);
    });

    test("ungrouping non-groupable grid updates html", function() {
        var grid = new Grid(table(), {
            dataSource:[{foo: "foo", bar: "bar"}, {foo: "foo", bar: "baz"}],
            groupable: false
        });

        grid.dataSource.group([{field: "foo"}, {field: "bar"}]);
        grid.dataSource.group([]);

        equal(grid.thead.find("th").length, 2);
        equal(grid.wrapper.find(".k-group-cell").length, 0);
    });

    test("columns are retrieved from grouped dataSource", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}, {field: "bar"}]
        }),
        grid = new Grid($("<div />").appendTo(QUnit.fixture), { dataSource: dataSource });

        var columns = grid.columns;
        equal(columns.length, 2);
        equal(columns[0].field, "foo");
        equal(columns[1].field, "bar");
    })

    test("col elemens are generated for every group cell", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}, {field: "bar"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource, scrollable: false });

        var cols = grid.table.find("col");
        ok(cols.eq(0).hasClass("k-group-col"));
        ok(cols.eq(1).hasClass("k-group-col"));
    });

    test("colspan of group cell when grouping is disabled initial grouped grid with auto columns", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource });

        equal(grid.tbody.find("tr>td:first").attr("colspan"), 3);
    });

    test("text in grouping row uses column title", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource, columns: [{field: "foo", title: "bar"}, "bar"] });

        equal(grid.tbody.find("tr>td:first").text(), "bar: foo");
    });

    test("text in grouping row uses column field if no title set", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource });

        equal(grid.tbody.find("tr>td:first").text(), "foo: foo");
    });

    test("text in grouping row shows column value from values if set", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo1", bar: "bar"}, {foo: "foo2", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource, columns: [
            {
                field: "foo", title: "bar",
                values: [ { value: "foo", text: "custom text" }, { value: "foo1", text: "custom text1" },{ value: "foo2", text: "custom text2" }]
            },
            "bar"]
        });

        equal(grid.tbody.find("tr>td:first").text(), "bar: custom text1");
    });

    test("text in grouping row shows empty string if values is set but value does not exist", function() {
        var dataSource = new DataSource({
            data: [{foo: "notexisting", bar: "bar"}, {foo: "notexisting2", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource, columns: [
            {
                field: "foo", title: "bar",
                values: [ { value: "foo", text: "custom text" }, { value: "foo1", text: "custom text1" },{ value: "foo2", text: "custom text2" }]
            },
            "bar"]
        });

        equal(grid.tbody.find("tr>td:first").text(), "bar: ");
    });

    test("column format is applied on grouping row", function() {
        var dataSource = new DataSource({
            data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
            group: [{field: "foo"}]
        }),
        grid = new Grid(table(), { dataSource: dataSource, columns: [{field: "foo", format: "{0}_bar"}, "bar"] });

        equal(grid.tbody.find("tr>td:first").text(), "foo: foo_bar");
    });

    test("text in grouping row uses column groupHeaderTemplate if set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
                group: "foo"
            },
            columns: [ { field: "foo", groupHeaderTemplate: "baz" } ]
        });

        equal(grid.tbody.find("tr>td:first").text(), "baz");
    });

    test("text in grouping row uses column groupHeaderTemplate if set - multicolumn header", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "foo", bar: "bar"}, {foo: "foo1", bar: "baz"}],
                group: "foo"
            },
            columns: [ { title: "master", columns: [{ field: "foo", groupHeaderTemplate: "baz" } ] }]
        });

        equal(grid.tbody.find("tr>td:first").text(), "baz");
    });

    test("groupHeaderTemplate as function", function() {
        var args,
            grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "foo", bar: "bar"}],
                group: "foo"
            },
            columns: [ { field: "foo", groupHeaderTemplate: function() { args = arguments[0]; return "baz" }  } ]
        });

        equal(grid.tbody.find("tr>td:first").text(), "baz");
        equal(args.field, "foo");
        equal(args.value, "foo");
    });

    test("groupHeaderTemplate using aggregates", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"}, {foo: "foo1", bar: "baz"}],
                group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" } ]}
            },
            columns: [ { field: "foo", groupHeaderTemplate: "#=field# : #=value# count: #=count#"  } ]
        });

        equal(grid.tbody.find("tr>td:first").text(), "foo : 1 count: 1");
    });

    test("groupHeaderTemplate using aggregates - all aggregates are pass to the template", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"}, {foo: "foo1", bar: "baz"}],
                group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }, { field: "bar", aggregate: "count" } ]}
            },
            columns: [ { field: "foo", groupHeaderTemplate: "#=field# : #=value# count: #=count# bar count: #=aggregates.bar.count#"  } ]
        });

        equal(grid.tbody.find("tr>td:first").text(), "foo : 1 count: 1 bar count: 1");
    });

    test("resetting DataSource instantiate new Groupable", 1, function() {
        var grid = new Grid(table(), { groupable: true, columns: ["text", "value"] });

        var groupable = grid.groupable;

        grid.setDataSource(new kendo.data.DataSource({
            data:[{text: 1, value: 1}, {text:2, value:2}]
        }));

        notStrictEqual(grid.groupable, groupable);
    });

    test("clicking on the collapse button collapses the group after the datasource has been changed", function() {
        var grid = new Grid(table(), {
            columns: ["text", "value"],
            groupable: true,
            dataSource: {
                data: [{text: 1, value: 1}, {text:2, value:2}],
                group: { field: "text" }
            }
        });

        grid.setDataSource(new kendo.data.DataSource({
            data: [{text: 1, value: 1}, {text:2, value:2}],
            group: { field: "text" }
        }));

        grid.tbody.find("tr.k-grouping-row:first > td:first a").click();

        equal(grid.items().first().css("display"), "none");
    });

    test("clicking on the collapse button collapses the group", function() {
        var grid = new Grid(table(), {
            columns: ["text", "value"],
            groupable: true,
            dataSource: {
                data: [{text: 1, value: 1}, {text:2, value:2}],
                group: { field: "text" }
            }
        });

        grid.tbody.find("tr.k-grouping-row:first > td:first a").click();
        equal(grid.items().first().css("display"), "none");
    });

    test("clicking on the collapse button collapses the group", function () {

        var dom = $("<div style=\"width:400px;height:300px\" data-role=\"grid\" data-scrollable=\"true\" data-groupable=\"true\" " +
            "data-columns=\"[" +
                "{ 'field': 'foo', 'width': 200, locked: true }," +
                "{ 'field': 'bar', 'width': 150 }," +
                "{ 'field': 'baz', 'width': 150 }" +
            "]\" " +
            "data-bind=\"source: items\"></div>")
            .appendTo(QUnit.fixture);

        var observable = kendo.observable({
            items: new kendo.data.DataSource({
                data: [
                    { foo: "1", bar: "2", baz: "3" },
                    { foo: "1", bar: "2", baz: "3" },
                    { foo: "1", bar: "3", baz: "3" },
                    { foo: "1", bar: "3", baz: "3" },
                    { foo: "1", bar: "4", baz: "3" },
                    { foo: "1", bar: "4", baz: "3" }
                ]
            })
        });

        kendo.bind(dom, observable);

        var grid = dom.data("kendoGrid");
        grid.dataSource.group({ field: "bar" });
        grid.wrapper.find(".k-grid-content-locked tr.k-grouping-row:first > td:first a").click();

        var items = grid.items();

        equal(items.eq(0).css("display"), "none");
        equal(items.eq(1).css("display"), "none");

        var relatedRows = grid.wrapper.find(".k-grid-content tr:not(.k-grouping-row)");
        equal(relatedRows.eq(0).css("display"), "none");
        equal(relatedRows.eq(1).css("display"), "none");
    });

    test("expand collapse handlers are not attached multiple times if bound through mvvm and groupable is false", 1, function() {
        var grid = new Grid(table(), { columns: ["text", "value"] });

        grid.setDataSource(new kendo.data.DataSource({
            data:[{text: 1, value: 1}, {text:2, value:2}],
            group: { field: "text" }
        }));

        var expandGroup = stub(grid, "expandGroup");
        grid.tbody.find("tr.k-grouping-row:first > td:first a").click();
        equal(expandGroup.calls("expandGroup"), 0);
    });

    test("collapse child group does not hide parent footer", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"}],
                group: [{ field: "foo", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}, { field: "bar", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}]
            },
            columns: [{ field: "foo", groupFooterTemplate: "foo" }, "bar"]
        });

        grid.collapseGroup(grid.table.find("tr.k-grouping-row").eq(1));

        equal(grid.table.find("tr.k-group-footer:visible").length, 1);
    });

    test("collapse master group hides parent footer", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"}],
                group: [{ field: "foo", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}, { field: "bar", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}]
            },
            columns: [{ field: "foo", groupFooterTemplate: "foo" }, "bar"]
        });

        grid.collapseGroup(grid.table.find("tr.k-grouping-row").eq(0));

        equal(grid.table.find("tr.k-group-footer:visible").length, 0);
    });

    test("expand group shows group footer", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{ foo: "foo", bar: "bar" }],
                group: [{ field: "foo" }, { field: "bar" }]
            },
            columns: [
                { field: "foo", groupFooterTemplate: "foo" },
                { field: "bar"
            }]
        });

        var groups = grid.table.find("tr.k-grouping-row");
        grid.collapseGroup(groups.eq(1));
        grid.expandGroup(groups.eq(1));

        equal(grid.table.find(".k-group-footer:visible").length, 2);
    });

    test("expand outer group shows outer group footer", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{ foo: "foo", bar: "bar" }],
                group: [{ field: "foo" }, { field: "bar" }]
            },
            columns: [
                { field: "foo", groupFooterTemplate: "foo" },
                { field: "bar"
            }]
        });

        var groups = grid.table.find("tr.k-grouping-row");
        grid.collapseGroup(groups.eq(1));
        grid.collapseGroup(groups.eq(0));
        grid.expandGroup(groups.eq(0));

        equal(grid.table.find(".k-group-footer:visible").length, 1);
    });

    test("collapse group hides group footer", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{ foo: "foo", bar: "bar" }],
                group: [{ field: "foo" }]
            },
            columns: [ { field: "foo", groupFooterTemplate: "foo" },
                { field: "bar" }]
        });

        var groups = grid.table.find("tr.k-grouping-row");
        grid.collapseGroup(groups.eq(0));

        equal(grid.table.find(".k-group-footer:visible").length, 0);
    });

    test("collapse group does not hide group footer when showFooter is enabled", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{ foo: "foo", bar: "bar" }],
                group: [{ field: "foo" }]
            },
            groupable: {
                showFooter: true
            },
            columns: [ { field: "foo", groupFooterTemplate: "foo" },
                { field: "bar" }]
        });

        var groups = grid.table.find("tr.k-grouping-row");
        grid.collapseGroup(groups.eq(0));

        equal(grid.table.find(".k-group-footer:visible").length, 1);
    });

    test("items skips the group footer rows", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"}],
                group: [{ field: "foo", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}, { field: "bar", aggregates: [ { field: "foo", aggregate: "count" },{ field: "bar", aggregate: "count" } ]}]
            },
            columns: [{ field: "foo", groupFooterTemplate: "foo" }, "bar"]
        });

        equal(grid.items().length, 1);
    });

    test("groupFooterTemplate shows correct aggregates when multiple grouping are set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [{foo: "1", bar: "bar"},{foo: "1", bar: "bar"},{foo: "1", bar: "baz"}],
                group: [{ field: "foo", aggregates: [ { field: "foo", aggregate: "count" } ]}, { field: "bar", aggregates: [ { field: "foo", aggregate: "count" } ]}]
            },
            columns: [{ field: "foo", groupFooterTemplate: "#=count#" }, "bar"]
        });

        var footers = grid.table.find("tr.k-group-footer");
        equal(footers.eq(0).find("td:not(.k-group-cell):first").text(), 2);
        equal(footers.eq(1).find("td:not(.k-group-cell):first").text(), 1);
        equal(footers.eq(2).find("td:not(.k-group-cell):first").text(), 3);
    });


})();
