(function(){

var Exporter = kendo.ExcelExporter;
var DataSource = kendo.data.DataSource;
var exporter;
var dataSource;

module("excel exporter", {
    setup: function() {
        jasmine.clock().install();
    },
    teardown: function() {
        jasmine.clock().uninstall();
    }
});

function testWorkbook(options, callback) {
    exporter = new Exporter(options);

    var workbook = exporter.workbook();

    jasmine.clock().tick(1);

    workbook.done(callback);
}

test("returns a promise", function() {
    exporter = new Exporter({
        dataSource: {}
    });

    equal(typeof exporter.workbook().then, "function");
});

test("clones the data source option", function() {
    dataSource = new DataSource();

    exporter = new Exporter({
        dataSource: dataSource
    });

    ok(exporter.dataSource);
    ok(exporter.dataSource !== dataSource);
});

test("sets the columns option of the workbook", 1, function() {
    testWorkbook({ columns: [ { field: "foo", width: 100 } ], dataSource: [] }, function(book) {
        equal(book.sheets[0].columns[0].width, 100);
    });
});

test("skips columns that don't have a field", function() {
    testWorkbook({ columns: [ { }, { field: "foo"} ], dataSource: [] }, function(book) {
        equal(book.sheets[0].columns.length, 1);
    });
});

test("skips hidden columns", function() {
    testWorkbook({ columns: [ { field: "bar", hidden: true }, { field: "foo"} ], dataSource: [] }, function(book) {
        equal(book.sheets[0].columns.length, 1);
    });
});

test("sets autoWidth if the column width isn't set", 1, function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [] }, function(book) {
        equal(book.sheets[0].columns[0].autoWidth, true);
    });
});

test("the first row contains the column titles", 2, function() {
    testWorkbook({ columns: [ { title: "foo", field: "foo" }, { field: "bar", title: "bar"} ], dataSource: [] }, function(book) {
        equal(book.sheets[0].rows[0].cells[0].value, "foo");
        equal(book.sheets[0].rows[0].cells[1].value, "bar");
    });
});

test("uses column field when title is not set", 1, function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [] }, function(book) {
        equal(book.sheets[0].rows[0].cells[0].value, "foo");
    });
});

test("the data source data is exported after the columns", 1, function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [{ foo: "bar" }] }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("resolves the promise with the datasource data", 1, function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [{ foo: "bar" }] }, function(book, data) {
        equal(data[0].foo, "bar");
    });
});

test("uses the text instead of the value when values is set", 1, function() {
    testWorkbook({ columns: [ { field: "foo", values: [ { value: 1, text: "bar" }] } ], dataSource: [{ foo: 1 }] }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("uses the text during grouping instead of the value when values is set", 1, function() {
    var dataSource = {
       data: [{ foo: 1 }],
       group: { field: "foo" }
    };

    testWorkbook({ columns: [ { field: "foo", values: [ { value: 1, text: "bar" }] } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "foo: bar");
    });
});

test("the type of data rows is set to 'data'", function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [{ foo: "bar" }] }, function(book) {
        equal(book.sheets[0].rows[1].type, "data");
    });
});

test("the type of header row is set to 'header'", function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [{ foo: "bar" }] }, function(book) {
        equal(book.sheets[0].rows[0].type, "header");
    });
});

test("correct number of header rows are added for multi-column headers", function() {
    testWorkbook({ columns: [{ columns: [{ field: "foo" }] }], dataSource: [{ foo: "bar" }] }, function(book) {
        equal(book.sheets[0].rows[0].type, "header");
        equal(book.sheets[0].rows[1].type, "header");
    });
});

test("header rows cells text is set with multi-column headers", function() {
    testWorkbook({ columns: [{ title: "master", columns: [{ field: "foo" }] }], dataSource: [{ foo: "bar" }] }, function(book) {
        equal(book.sheets[0].rows[0].cells[0].value, "master");
        equal(book.sheets[0].rows[1].cells[0].value, "foo");
    });
});

test("colSpan is set to parent column with multi-column headers", function() {
    testWorkbook({
        columns: [
            { title: "master", columns: [{ field: "foo" }] },
            { title: "master2", columns: [{ field: "bar" }, { field: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].rows[0].cells[0].colSpan, 1);
        equal(book.sheets[0].rows[0].cells[1].colSpan, 2);
    });
});

test("skips columns that don't have a field - multi-column headers", function() {
    testWorkbook({ columns: [
            { title: "master" },
            { title: "master2", columns: [{ field: "bar" }, { field: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].columns.length, 2);
        equal(book.sheets[0].rows[0].cells.length, 1);
        equal(book.sheets[0].rows[1].cells.length, 2);
        equal(book.sheets[0].rows[2].cells.length, 2);
    });
});

test("skips header column if all child columns that don't have a field - multi-column headers", function() {
    testWorkbook({ columns: [
            { title: "master", field: "baz" },
            { title: "master2", columns: [{ title: "bar" }, { title: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].columns.length, 1);
        equal(book.sheets[0].rows[0].cells.length, 1);
        equal(book.sheets[0].rows[1].cells.length, 1);
    });
});

test("does not skips header column if there is at least one child columns that do have a field - multi-column headers", function() {
    testWorkbook({ columns: [
            { title: "master", field: "baz" },
            { title: "master2", columns: [{ field: "bar" }, { title: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].columns.length, 2);
        equal(book.sheets[0].rows[0].cells.length, 2);
        equal(book.sheets[0].rows[1].cells.length, 1);
        equal(book.sheets[0].rows[2].cells.length, 2);
    });
});

test("rowSpan is set column with no children with multi-column headers", function() {
    testWorkbook({
        columns: [
            { title: "master", field: "foo" },
            { title: "master2", columns: [{ field: "bar" }, { field: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].rows[0].cells[0].rowSpan, 2);
        equal(book.sheets[0].rows[0].cells[1].rowSpan, 1);
    });
});

test("hidden column is not rendered in the multi-column headers - top level is hidden", function() {
    testWorkbook({
        columns: [
            { title: "master", columns: [{ field: "foo" }] },
            { title: "master2", hidden: true, columns: [{ field: "bar" }] }
        ], dataSource: [{ foo: "bar", bar: "baz" }] }, function(book) {

        equal(book.sheets[0].rows[0].cells.length, 1);
        equal(book.sheets[0].rows[1].cells.length, 1);
    });
});

test("parent column is not rendered if all child columns are hidden in the multi-column headers", function() {
    testWorkbook({
        columns: [
            { title: "master", columns: [{ field: "foo" }] },
            { title: "master2", columns: [{ field: "bar", hidden: true }] }
        ], dataSource: [{ foo: "bar", bar: "baz" }] }, function(book) {

        equal(book.sheets[0].rows[0].cells.length, 1);
        equal(book.sheets[0].rows[1].cells.length, 1);
    });
});

test("only data items that match the filter are exported", 2, function() {
    var options = {
        columns: [ { field: "foo" } ],
        dataSource: new DataSource({
            data: [
               { foo: "foo" },
               { foo: "bar" }
            ]
        })
    };

    options.dataSource.read();
    options.dataSource.filter({ field: "foo", operator: "neq", value: "foo" });

    testWorkbook(options, function(book) {
        equal(book.sheets[0].rows.length, 2);
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("exports current page", 2, function() {
    var options = {
        columns: [ { field: "foo" } ],
        dataSource: new kendo.data.DataSource({
            data: [
               { foo: "foo" },
               { foo: "bar" }
            ],
            pageSize: 1
        })
    };

    options.dataSource.read();
    options.dataSource.page(2);

    testWorkbook(options, function(book) {
        equal(book.sheets[0].rows.length, 2);
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("exports all pages if allPages is set", 1, function() {
    var options = {
        columns: [ { field: "foo" } ],
        allPages: true,
        dataSource: new kendo.data.DataSource({
            data: [
               { foo: "foo" },
               { foo: "bar" }
            ],
            pageSize: 1
        })
    };

    options.dataSource.read();
    options.dataSource.page(2);

    testWorkbook(options, function(book) {
        equal(book.sheets[0].rows.length, 3);
    });
});

test("exports current pageSize", 2, function() {
    var options = {
        columns: [ { field: "foo" } ],
        dataSource: new kendo.data.DataSource({
            data: [
               { foo: "foo" },
               { foo: "bar" }
            ],
            pageSize: 1
        })
    };

    options.dataSource.read();
    options.dataSource.pageSize(2);

    testWorkbook(options, function(book) {
        equal(book.sheets[0].rows.length, 3);
        equal(book.sheets[0].rows[1].cells[0].value, "foo");
    });
});

test("exports sorted data", function() {
    var options = {
        columns: [ { field: "foo" } ],
        dataSource: new kendo.data.DataSource({
            data: [
               { foo: "foo" },
               { foo: "bar" }
            ]
        })
    };

    options.dataSource.sort({ field: "foo", dir: "asc" });

    testWorkbook(options, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("freezes first row", function() {
    testWorkbook({ columns: [ { field: "foo" } ], dataSource: [ {} ] }, function(book) {
        equal(book.sheets[0].freezePane.rowSplit, 1);
    });
});

test("freezes all header rows with multi-column headers set", function() {
    testWorkbook({
        columns: [
            { title: "master", columns: [{ field: "foo" }] },
            { title: "master2", columns: [{ field: "bar" }, { field: "baz" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {

        equal(book.sheets[0].freezePane.rowSplit, 2);
    });
});

test("enables filtering", function() {
    testWorkbook({ filterable: true, columns: [ { field: "foo" } ], dataSource: [ {} ] }, function(book) {
        equal(book.sheets[0].filter.from, 0);
        equal(book.sheets[0].filter.to, 0);
    });
});

test("locked columns set the freezePane", function() {
    testWorkbook({ columns: [ { field: "foo", locked: true }, { field: "bar", locked: true } ], dataSource: [ {} ] }, function(book) {
        equal(book.sheets[0].freezePane.colSplit, 2);
    });
});

test("locked multi-column headers set the freezePane", function() {
    testWorkbook({
        columns: [
            { title: "master2", locked: true, columns: [{ field: "bar" }, { field: "baz" }] },
            { title: "master", columns: [{ field: "foo" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {
        equal(book.sheets[0].freezePane.colSplit, 2);
    });
});

test("locked multi-column with hidden child column set the freezePane", function() {
    testWorkbook({
        columns: [
            { title: "master2", locked: true, columns: [{ field: "bar" }, { field: "baz", hidden: true }] },
            { title: "master", columns: [{ field: "foo" }] }
        ], dataSource: [{ foo: "bar", bar: "baz", baz: "moo" }] }, function(book) {
        equal(book.sheets[0].freezePane.colSplit, 1);
    });
});

test("creates group rows", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].type, "group-header");
    });
});

test("sets the value of the group cell to the group field and value", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "foo: boo");
        equal(book.sheets[0].rows[3].cells[0].value, "foo: foo");
    });
});

test("sets the value of the group cell to the unencoded group value", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo & co", bar: "bar" },
           { foo: "boo & co", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "foo: boo & co");
        equal(book.sheets[0].rows[3].cells[0].value, "foo: foo & co");
    });
});

test("uses the column title for the group cell value", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "Foo: boo");
    });
});

test("uses groupHeaderTemplate for the group cell value", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  }
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo", groupHeaderTemplate: "Foo=#=value#,count=#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "Foo=boo,count=1");
    });
});

test("uses groupHeaderTemplate for the group cell value when the column is hidden", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  }
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo", groupHeaderTemplate: "Foo=#=value#,count=#=count#", hidden: true }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "Foo=boo,count=1");
    });
});

test("creates row when groupFooterTemplate is set", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  }
    });

    testWorkbook({ columns: [ { field: "foo", groupFooterTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows.length, 4);
    });
});

test("creates row at the end when footerTemplate is set", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [ { field: "foo", footerTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows.length, 3);
    });
});

test("passes all aggregates to footerTemplate", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [ { field: "foo", footerTemplate: "Foo: #= data.foo.count #" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[2].cells[0].value, "Foo: 1");
    });
});

test("passes all aggregates to footerTemplate fn", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [{
        field: "foo",
        footerTemplate: function(data) { return "Foo: " + data.foo.count; }
    }, {
            field: "bar"
    }],
        dataSource: dataSource
    }, function(book) {
        equal(book.sheets[0].rows[2].cells[0].value, "Foo: 1");
    });
});

test("passes all aggregates to groupFooterTemplate", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       aggregate: [
           { field: "foo", aggregate: "count" },
           { field: "bar", aggregate: "count" }
       ],
       group: [
         {
             field: "bar",
             aggregates: [
               { field: "foo", aggregate: "count" },
               { field: "bar", aggregate: "count" }
             ]
         }
       ],
    });

    testWorkbook({ columns: [ { field: "foo", groupFooterTemplate: "Foo: #= data.foo.count # #=data.bar.count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[3].cells[1].value, "Foo: 1 1");
    });
});

test("passes all aggregates as zero to footerTemplate when there is no data", function() {
    dataSource = new DataSource({
       data: [
       ],
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [ { field: "foo", footerTemplate: "Foo: #= data.foo.count #" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "Foo: 0");
    });
});
test("sets row type to 'footer' when footerTemplate is set", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [ { field: "foo", footerTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[2].type, "footer");
    });
});

test("sets row type to 'group-footer' when groupFooterTemplate is set", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  }
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo", groupFooterTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[3].type, "group-footer");
    });
});

test("uses groupFooterTemplate", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       group: { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  }
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo", groupFooterTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[3].cells[1].value, 1);
    });
});

test("indents groupFooterTemplate", function() {
    dataSource = new DataSource({
        data: [
            { foo: "foo", bar: "bar" }
        ],
        group: [
            { field: "foo", aggregates: [ { field: "foo", aggregate: "count" }]  },
            { field: "bar", aggregates: [ { field: "foo", aggregate: "count" }]  }
        ]
    });

    testWorkbook({ columns: [ { title: "Foo", field: "foo", groupFooterTemplate: "#=count#" }, { field: "bar"} ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[5].cells[2].value, 1);
    });
});

test("sets row type to 'footer' when footerTemplate is set", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" }
       ],
       group: { field: "foo" },
       aggregate: [
           { field: "foo", aggregate: "count" }
       ]
    });

    testWorkbook({ columns: [ { field: "foo", footerTemplate: "#=count#" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[3].cells[1].value, 1);
    });
});

test("sets colSpan of the group cell to the number of columns", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].colSpan, 3);
    });
});

test("creates data rows for the group items", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: { field: "foo" }
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[2].type, "data");
    });
});

test("creates group rows for nested group items", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: [{ field: "foo" }, { field: "bar" }]
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].type, "group-header");
        equal(book.sheets[0].rows[2].type, "group-header");
        equal(book.sheets[0].rows[3].type, "data");
    });
});

test("creates padding cells for groups", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: [{ field: "foo" }, { field: "bar" }]
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[0].cells.length, 4);
        equal(book.sheets[0].rows[1].cells.length, 1);
        equal(book.sheets[0].rows[2].cells.length, 2);
        equal(book.sheets[0].rows[3].cells.length, 4);
    });
});

test("creates a column for every group", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: [{ field: "foo" }, { field: "bar" }]
    });

    testWorkbook({ columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].columns.length, 4);
    });
});

test("filtering skips the groups", function() {
    dataSource = new DataSource({
       data: [
           { foo: "foo", bar: "bar" },
           { foo: "boo", bar: "baz" }
       ],
       group: [{ field: "foo" }, { field: "bar" }]
    });

    testWorkbook({ filterable: true, columns: [ { field: "foo" }, { field: "bar" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].filter.from, 2);
        equal(book.sheets[0].filter.to, 3);
    });
});

test("exports data set after data source initialization", 1, function() {
    dataSource = new DataSource({});

    dataSource.data([ { foo: "bar" } ]);

    testWorkbook({ columns: [ { field: "foo" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows[1].cells[0].value, "bar");
    });
});

test("keeps loaded TreeListDataSource items", function() {
    dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: function(options) {
                if (!options.id) {
                    options.success([ { id: 1, parentId: null, hasChildren: true } ]);
                } else {
                    options.success([ { id: 2, parentId: 1, hasChildren: false } ]);
                }
            }
        }
    });

    dataSource.read();
    dataSource.load(dataSource.get(1));

    testWorkbook({ columns: [ { field: "id" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows.length, 3);
    });
});

test("keeps custom TreeListDataSource parentId", function() {
    dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: function(options) {
                options.success([ { id: 1, Parent: 0, hasChildren: true } ]);
            }
        },
        schema: {
            model: {
                parentId: "Parent",
                fields: {
                    Parent: { defaultValue: 0, type: "number" }
                }
            }
        }
    });

    dataSource.read();

    testWorkbook({ columns: [ { field: "id" } ], dataSource: dataSource }, function(book) {
        equal(book.sheets[0].rows.length, 2);
    });
});

}());
