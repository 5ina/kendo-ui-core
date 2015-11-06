(function() {

    var Grid = kendo.ui.Grid,
        DataSource = kendo.data.DataSource;

    function table() {
        return QUnit.fixture[0].appendChild(document.createElement("table"));
    }

    module("kendo.ui.Grid aggregates", {
        setup: function() {
            kendo.ns = "kendo-";
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            $("div.k-grid").remove();
            kendo.ns = "";
        }
    });

    test("footer row is added to the grid if data source aggregates are set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}],
                aggregate: { field: "foo", aggregate: "count" }
            }
        }),
        footer = grid.wrapper.children("div.k-grid-footer");
        ok(footer.length);
    });

    test("footer row is added to the grid if autoBind is false and footerTemplate is set", function() {
        var grid = new Grid(table(), {
            autoBind: false,
            columns: [ { field: "foo", footerTemplate: "bar" }],
            dataSource: {
                data: []
            }
        });

        ok(grid.wrapper.children("div.k-grid-footer").length);
    });

    test("footer row is not added to the grid if data source aggregates are not set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}]
            }
        });
        ok(!grid.wrapper.children("div.k-grid-footer").length);
    });

    test("single footer row is rendered on multiple datasource rebind", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}]
            },
            columns: [ { field: "foo", footerTemplate: "baz" } ]
        });
        grid.dataSource.read();
        grid.dataSource.read();
        equal(grid.wrapper.children("div.k-grid-footer").length, 1);
    });

    test("single footer row is rendered on multiple datasource rebind with no scrolling", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}]
            },
            scrollable: false,
            columns: [ { field: "foo", footerTemplate: "baz" } ]
        });
        grid.dataSource.read();
        grid.dataSource.read();
        equal(grid.table.find("tfoot>tr.k-footer-template").length, 1);
    });

    test("footer row is added before the pager if datasource aggregates are set and paging is enabled", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            pageable: true
        }),
        footer = grid.wrapper.children("div.k-grid-footer");
        ok(footer.length);
        ok(footer.next(".k-grid-pager").length);
    });

    test("footer row is rendered in the tfoot if no scrolling is enabled", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            scrollable: false
        })

        ok(grid.table.find("tfoot>tr.k-footer-template").length);
    });

    test("footer row scrolls together with the data area", 1, function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            columns: [ { field: "foo", footerTemplate: "baz", width: "3000px" } ]
        }),
        footerWrap = grid.wrapper.find("div.k-grid-footer-wrap"),
        contentDiv = grid.wrapper.children("div.k-grid-content");

        contentDiv.scrollLeft(100);
        contentDiv.trigger(new $.Event("scroll"));

        equal(footerWrap.scrollLeft(), 100);
    });

    test("footer row scrolls together with the data area after group is applied", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1},{foo: 2},{foo: 3}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            columns: [ { field: "foo", footerTemplate: "baz", width: "3000px" } ]
        });

        grid.dataSource.group({
            field: "foo",
            aggregate: { field: "foo", aggregate: "count" }
        });

        var footerWrap = grid.wrapper.find("div.k-grid-footer-wrap"),
        contentDiv = grid.wrapper.children("div.k-grid-content");

        contentDiv.scrollLeft(100);
        contentDiv.trigger(new $.Event("scroll"));

        equal(footerWrap.scrollLeft(), 100);
    });

    test("footer cell is rendered for each column", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}],
                aggregate: { field: "foo", aggregate: "count" }
            }
        }),
        footer = grid.wrapper.children("div.k-grid-footer");

        equal(footer.find("tr.k-footer-template").find("td").length, 2);
    });

    test("column footer template are rendered", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}]
            },
            columns: [ { field: "foo", footerTemplate: "bar" },"bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "bar");
        equal(footerCells.last().html(), "&nbsp;");
    });

    test("column footer template are rendered no scrolling", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}]
            },
            scrollable: false,
            columns: [ { field: "foo", footerTemplate: "bar" },"bar" ]
        }),
        footerCells = grid.table.find("tr.k-footer-template").find("td");

        equal(footerCells.length, 2);
        equal(footerCells.first().text(), "bar");
        equal(footerCells.last().html(), "&nbsp;");
    });

    test("column footer template as function are rendered", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}]
            },
            columns: [ { field: "foo", footerTemplate: function() { return "bar" } },"bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "bar");
        equal(footerCells.last().html(), "&nbsp;");
    });

    test("column footer template with aggregate expression", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            columns: [ { field: "foo", footerTemplate: "count:#=count#" },"bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "count:1");
        equal(footerCells.last().html(), "&nbsp;");
    });

    test("aggregates are set to zero when bound to empty data", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [],
                aggregate: { field: "foo", aggregate: "count" }
            },
            columns: [ { field: "foo", footerTemplate: "#=count#" },"bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "0");
    });

    test("aggregates are undefined if not specified", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [],
                aggregate: [{ field: "foo", aggregate: "count" }, { field: "foo", aggregate: "min" } ]
            },
            columns: [ { field: "foo", footerTemplate: "#=typeof max == 'undefined'#" },"bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "true");
    });

    test("column footer template with both aggregate expression and column template", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}],
                aggregate: { field: "foo", aggregate: "count" }
            },
            columns: [ { field: "foo", footerTemplate: "count:#=count#" }, { field: "bar", footerTemplate: "baz" } ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "count:1");
        equal(footerCells.last().text(), "baz");
    });

    test("column footer template with aggregate on nested field", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ { foo: { bar: 1 } }],
                aggregate: { field: "foo.bar", aggregate: "count" }
            },
            columns: [ { field: "foo.bar", footerTemplate: "count:#=count#" } ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        footerCells = footer.find("tr.k-footer-template").find("td");

        equal(footerCells.first().text(), "count:1");
    });

    test("column width is set to the footer cell", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2}]
            },
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        col  = footer.find("colgroup").find("col").first();

        ok(col.attr("style").indexOf("100px") != -1);
    });

    test("group cell is added to footer row when grid is groupped", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ]
            },
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } , "bar" ]
        });
        grid.dataSource.group("foo");
        var footer = grid.wrapper.children("div.k-grid-footer"),
        cells = footer.find("tr.k-footer-template").find("td");

        equal(cells.length, 3);
        ok(cells.first().hasClass("k-group-cell"));
    });

    test("group cell is added to footer row when grid is initially groupped", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: { field: "foo" }
            },
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } , "bar" ]
        }),
        footer = grid.wrapper.children("div.k-grid-footer"),
        cells = footer.find("tr.k-footer-template").find("td");

        equal(cells.length, 3);
        ok(cells.first().hasClass("k-group-cell"));
    });

    test("group cell is added to footer row when grid is initially groupped no scrolling", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: { field: "foo" }
            },
            scrollable: false,
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } , "bar" ]
        }),
        cells = grid.table.find("tr.k-footer-template").find("td");

        equal(cells.length, 3);
        ok(cells.first().hasClass("k-group-cell"));
    });

    test("hierarchy cell is added to footer row when grid has detail template no scrolling", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ]
            },
            scrollable: false,
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } , "bar" ],
            detailTemplate: " bar"
        }),
        cells = grid.table.find("tr.k-footer-template").find("td");

        equal(cells.length, 3);
        ok(cells.first().hasClass("k-hierarchy-cell"));
    });

    test("hierarchy cell is added to footer row when grid has detail template", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ]
            },
            columns: [ { field: "foo", footerTemplate: "foo", width: "100px" } , "bar" ],
            detailTemplate: " bar"
        }),
        cells = grid.wrapper.find("tr.k-footer-template").find("td");

        equal(cells.length, 3);
        ok(cells.first().hasClass("k-hierarchy-cell"));
    });

    test("generating headers sets data-kendo-aggregates attr for columns with aggregate", function() {
        var element = $(table()),
        grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo", aggregates: ["count", "sum"] },
                { field: "bar" }
            ]
        });
        var ths = grid.wrapper.find("th"),
        aggregates = ths.eq(0).attr("data-kendo-aggregates").split(",");

        equal(aggregates.length,2);
        equal(aggregates[0], "count");
        equal(aggregates[1], "sum");
        ok(ths.eq(1).attr("data-kendo-aggregates") === undefined);
    });

    test("does not generate headers data-kendo-aggregates attr for columns with aggregate if set to empty array", function() {
        var element = $(table()),
        grid = new Grid(element, {
            data: [],
            columns: [
                { field: "foo", aggregates: [] },
                { field: "bar" }
            ]
        });
        var ths = grid.wrapper.find("th");

        ok(ths.eq(0).attr("data-kendo-aggregates") === undefined);
    });

    test("group footer row is rendered if column footer template is set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: "foo"
            },
            columns: [ { field: "foo", groupFooterTemplate: "foo", width: "100px" } , "bar" ],
        });

        ok(grid.table.find("tr.k-group-footer").length);
    });

    test("group footer row is not rendered if there is no groupFooter template set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: "foo"
            },
            columns: [ { field: "foo", width: "100px" } , "bar" ],
        });

        ok(!grid.table.find("tr.k-group-footer").length);
    });

    test("column group footer template is rendered if set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: "foo"
            },
            columns: [ { field: "foo", groupFooterTemplate: "foo", width: "100px" } , "bar" ],
        }),
        groupFooter = grid.table.find("tr.k-group-footer");
        equal(groupFooter.find("td").eq(1).text(), "foo");
    });

    test("column group footer template with aggregate is rendered if set", function() {
        var grid = new Grid(table(), {
            dataSource: {
                data: [ {foo: 1, bar: 2} ],
                group: { field: "foo", aggregates: [{ field: "foo", aggregate: "count" }]}
            },
            columns: [ { field: "foo", groupFooterTemplate: "#=count#", width: "100px" } , "bar" ],
        }),
        groupFooter = grid.table.find("tr.k-group-footer");

        equal(groupFooter.find("td").eq(1).text(), 1);
    });
})();
