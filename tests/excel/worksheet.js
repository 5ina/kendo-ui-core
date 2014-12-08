(function(){

var sharedStrings;
var styles;

module("Worksheet", {
  setup: function() {
     sharedStrings = {
        uniqueCount: 0,
        count: 0,
        indexes: {}
     };
     styles = [];
  }
});

function Worksheet(options) {
    options = options || [ { cells: [ { value: "foo" } ] } ];

    if ($.isArray(options)) {
        options = { rows: options };
    }

    return new kendo.ooxml.Worksheet(options, sharedStrings, styles);
}

test("toXML creates a 'c' element for cells", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("c").length, 1);
});

test("toXML sets the r attribute to the alphanumeric and cell number (index plus one)", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("r"), "A1");
});

test("toXML sets the 'r' attribute to the alphanumeric when index is greater than 26", function() {
    var cells = new Array(27);

    cells.push({})

    var worksheet = Worksheet([ { cells: cells } ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("r"), "AB1");
});

test("toXML skips empty cells", function() {
    var row = new Array(25);

    var worksheet = Worksheet([
        { cells: [,,{}] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").length, 1);
});

test("toXML sets the t attribute to 's' when the value is a string", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("t"), "s");
});

test("toXML doesn't set the 't' attribute the value is a date", function() {
    var worksheet = Worksheet([
        { cells: [{ value: new Date() }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("t"), null);
});

test("toXML sets the 't' attribute to 'n' when the value is a number", function() {
    var worksheet = Worksheet([
        { cells: [{ value: 1 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("t"), "n");
});

test("toXML stores numbers", function() {
    var worksheet = Worksheet([
        { cells: [{ value: 1 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c > v").text(), "1");
});

test("toXML sets the 't' attribute to 'b' when the value is a boolean", function() {
    var worksheet = Worksheet([
        { cells: [{ value: true }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("t"), "b");
});

test("toXML doesn't set the 't' attribute when the value isn't primitive", function() {
    var worksheet = Worksheet([
        { cells: [{ value: {} }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("t"), null);
});

test("toXML doesn't store value that isn't primitive", function() {
    var worksheet = Worksheet([
        { cells: [{ value: {} }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c>v").text(), "");
});

test("toXML stores 'true' as '1'", function() {
    var worksheet = Worksheet([
        { cells: [{ value: true }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").text(), "1");
});

test("toXML stores 'false' as '0'", function() {
    var worksheet = Worksheet([
        { cells: [{ value: false }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").text(), "0");
});

test("toXML sets the 's' attribute of dates", function() {
    var worksheet = Worksheet([
        { cells: [{ value: new Date() }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").attr("s"), "1");
});

test("toXML stores dates as offsets from epoch", function() {
    // see http://xlsxwriter.readthedocs.org/en/latest/working_with_dates_and_time.html
    var date = new Date(2013, 0, 1, 12, 0);

    var worksheet = Worksheet([
        { cells: [{ value: date }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c > v").text(), "41275.5");
});

test("toXML adds strings to sharedStrings", function() {
    var worksheet = Worksheet();

    worksheet.toXML();

    equal(sharedStrings.indexes["$foo"], 0);
});

test("toXML increments count of sharedStrings", function() {
    var worksheet = Worksheet();

    worksheet.toXML();

    equal(sharedStrings.count, 1);
});

test("toXML increments uniqueCount of sharedStrings", function() {
    var worksheet = Worksheet();

    worksheet.toXML();

    equal(sharedStrings.uniqueCount, 1);
});

test("toXML increments shared string count when existing value is used", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo"}, { value: "foo" } ]  }
    ]);

    worksheet.toXML();

    equal(sharedStrings.count, 2);
});

test("toXML doesn't increment uniqueCount when existing value is used", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo"}, { value: "foo" } ]  }
    ]);

    worksheet.toXML();

    equal(sharedStrings.uniqueCount, 1);
});

test("toXML creates a new shared string", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo"}, { value: "bar" } ]  }
    ]);

    worksheet.toXML();

    equal(sharedStrings.uniqueCount, 2);
    equal(sharedStrings.count, 2);
    equal(sharedStrings.indexes["$bar"], 1);
});

test("toXML creates a 'v' element for the value", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("c").children("v").length, 1);
});

test("toXML uses the shared string index as the toXML value", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("c").children("v").text(), sharedStrings.indexes["$foo"]);
});

test("keeps the order of strings when numberic values are stored as strings", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo"}, { value: "0" } ]  }
    ]);

    worksheet.toXML();

    for (var index in sharedStrings.indexes) {
        equal(index, "$foo");
        break;
    }
});

test("toXML creates a 'row' element", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("> sheetData > row").length, 1);
});

test("toXML sets the 'r' attribute to index plus one", function() {
    var worksheet = Worksheet();

    var dom = $(worksheet.toXML());

    equal(dom.find("row").attr("r"), "1");
});

test("toXML renders cells as children elements", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo" }, { value: "bar" } ] }
    ]);

    var dom = $(worksheet.toXML());
    equal(dom.find("c:first v").text(), "0");
    equal(dom.find("c:last v").text(), "1");
});

test("toXML adds styles", function() {
    var worksheet = Worksheet([
        { cells: [ { bold: true, value: "foo" } ] }
    ]);

    worksheet.toXML();

    equal(styles.length, 1);
});

test("toXML sets style index plus one as 's' attribute", function() {
    var worksheet = Worksheet([
        { cells: [ { bold: true, value: "foo" } ] }
    ]);

    var dom = $(worksheet.toXML());
    equal(dom.find("c").attr("s"), 1);
});

test("toXML reuses styles", function() {
    var worksheet = Worksheet([
        { cells: [ { italic: true, value: "foo" } ] },
        { cells: [ { bold: true, value: "foo" } ] },
        { cells: [ { bold: true, value: "foo" } ] }
    ]);

    var dom = $(worksheet.toXML());
    equal(dom.find("row:last c:last").attr("s"), 2);
});

test("toXML does not set the 's' attribute if style is not set", function() {
    var worksheet = Worksheet([
        { cells: [ { value: "foo" } ] }
    ]);

    var dom = $(worksheet.toXML());
    equal(dom.find("c").attr("s"), null);
});

test("toXML creates a 'pane' element when the freezePane option is set", function() {
    var worksheet = Worksheet({
        freezePane: {
            colSplit: 1
        }
    });

    var dom = $(worksheet.toXML());
    equal(dom.find("pane").length, 1);
    equal(dom.find("pane").attr("topLeftCell"), "B1");
});

test("toXML sets the 'xSplit' attribute when the colSplit option is set", function() {
    var worksheet = Worksheet({
        freezePane: {
            colSplit: 2
        }
    });

    var dom = $(worksheet.toXML());
    equal(dom.find("pane").attr("xSplit"), 2);
});

test("toXML sets the 'ySplit' attribute when the rowSplit option is set", function() {
    var worksheet = Worksheet({
        freezePane: {
            rowSplit: 2
        }
    });

    var dom = $(worksheet.toXML());
    equal(dom.find("pane").attr("ySplit"), 2);
    equal(dom.find("pane").attr("topLeftCell"), "A3");
});

test("toXML creates 'cols' element when the columns option is set", function() {
    var worksheet = Worksheet({
        columns: []
    });

    var dom = $(worksheet.toXML());
    equal(dom.find("cols").length, 1);
});

test("toXML creates 'col' element for every item in the columns option that has width set", function() {
    var worksheet = Worksheet({
        columns: [{ width: 10}, { width: 10 }]
    });

    var dom = $($.parseXML(worksheet.toXML()));
    equal(dom.find("col").length, 2);
});

test("toXML sets the 'min' and 'max' attribute of the 'col' element to the column index plus one", function() {
    var worksheet = Worksheet({
        columns: [{ width: 10 }]
    });

    var dom = $($.parseXML(worksheet.toXML()));
    equal(dom.find("col").attr("min"), 1);
    equal(dom.find("col").attr("max"), 1);
});

test("toXML sets the 'customWidth' attribute of the 'col' element when width is set", function() {
    var worksheet = Worksheet({
        columns: [{
           width: 1
        }]
    });

    var dom = $($.parseXML(worksheet.toXML()));
    equal(dom.find("col").attr("customWidth"), 1);
});

test("toXML sets the 'width' attribute of the 'col' element according to formula", function() {
// see: http://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
// for some reason though subtracting 5 px padding didn't work and we don't do it

    var worksheet = Worksheet({
        columns: [{
           width: 500
        }]
    });

    var dom = $($.parseXML(worksheet.toXML()));
    equal(Math.round(dom.find("col").attr("width")), 71);
});

test("toXML calculates the 'width' attribute based on string length", function() {
// see: http://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
// for some reason though subtracting 5 px padding didn't work and we don't do it

    var worksheet = Worksheet({
        columns: [{
           autoWidth: true
        }],
        rows: [
            { cells: [ { value: "foo" }] }
        ]
    });

    var dom = $($.parseXML(worksheet.toXML()));
    equal(Math.round(dom.find("col").attr("width")), 4);
});

test("toXML creates the 'mergeCell' element for cells with colSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").length, 1);
});

test("toXML creates the 'mergeCell' element for cells with rowSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ rowSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").length, 1);
});

test("toXML sets the 'ref' attribute of the 'mergeCell' element for cells with colSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").attr("ref"), "A1:B1");
});

test("toXML sets the 'ref' attribute of the 'mergeCell' element for cells with rowSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ rowSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").attr("ref"), "A1:A2");
});

test("toXML creates the 'mergeCell' element for cells with rowSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ rowSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").length, 1);
});


test("toXML adds extra cells after cell with colSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 3 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").length, 3);
});

test("toXML adds missing cells after cell with rowSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ rowSpan: 3 }, {}] },
        { cells: [ {} ] },
        { cells: [ {} ] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c").length, 6);
});

test("toXML creates empty extra cells after cell with colSpan", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c:last").children().length, 0);
});

test("toXML adjusts the ref of cells after colspan", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 3 }, { }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("c:last").attr("r"), "D1");
});

test("toXML sets the 'count' attribute of the 'mergeCells' element", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 3 }, { }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCells").attr("count"), 1);
});

test("toXML creates 'mergeCell' elements for multiple cells with colSpan attribute", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 3 }, { }, { colSpan: 2}] },
        { cells: [{ colSpan: 3 }, { }, { colSpan: 2}] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").length, 4);
});

test("toXML creates one mergeCell for a cell with both colSpan and rowSpan set", function() {
    var worksheet = Worksheet([
        { cells: [{ colSpan: 2, rowSpan: 2 }] }
    ]);

    var dom = $(worksheet.toXML());

    equal(dom.find("mergeCell").length, 1);
    equal(dom.find("mergeCell").attr("ref"), "A1:B2");
});

test("toXML creates 'autoFilter' element when the filter option is set", function() {
    var worksheet = Worksheet({
        columns: [ {}, {}, {} ],
        filter: { from: 1, to: 2 }
    });

    var dom = $(worksheet.toXML());

    equal(dom.find("autoFilter").attr("ref"), "B1:C1");
});

test("toXML offsets cells if first has merged rows", function() {
    var worksheet = Worksheet({
        rows: [ {
            cells: [
                {"value":"","colSpan":2,"rowSpan":2},
                {"value":"dim 0","colSpan":1,"rowSpan":1}
            ]
        }, {
            cells: [
                {"value":"dim 0_1","colSpan":1,"rowSpan":1}
            ]
        } ]
    });

    var dom = $(worksheet.toXML());
    var cell = dom.find("row:eq(1) > c:eq(0)");

    equal(cell.attr("r"), "C2");
});

test("toXML offsets cells if second cell is merged in 3 rows", function() {
    var worksheet = Worksheet({
        rows: [ {
            cells: [
                { "value":"cell 0", "colSpan":1, "rowSpan":1 },
                { "value":"cell 1", "colSpan":1, "rowSpan":3 },
                { "value":"cell 2", "colSpan":1, "rowSpan":1 }
            ]
        }, {
            cells: [
                { "value":"cell 0_1", "colSpan":1, "rowSpan":1 },
                { "value":"cell 2_1", "colSpan":1, "rowSpan":1 }
            ]
        }, {
            cells: [
                { "value":"cell 0_2", "colSpan":1, "rowSpan":1 },
                { "value":"cell 2_2", "colSpan":1, "rowSpan":1 }
            ]
        } ]
    });

    var dom = $(worksheet.toXML());
    var cell0_1 = dom.find("row:eq(1) > c:eq(0)");
    var cell2_1 = dom.find("row:eq(1) > c:eq(1)");

    equal(cell0_1.attr("r"), "A2");
    equal(cell2_1.attr("r"), "C2");

    var cell0_2 = dom.find("row:eq(2) > c:eq(0)");
    var cell2_2 = dom.find("row:eq(2) > c:eq(1)");

    equal(cell0_2.attr("r"), "A3");
    equal(cell2_2.attr("r"), "C3");
});

test("toXML renders third level cells after second cell is merged in 2 rows", function() {
    var worksheet = Worksheet({
        rows: [ {
            cells: [
                { "value":"cell 0", "colSpan":1, "rowSpan":1 },
                { "value":"cell 1", "colSpan":1, "rowSpan":2 },
                { "value":"cell 2", "colSpan":1, "rowSpan":1 }
            ]
        }, {
            cells: [
                { "value":"cell 0_1", "colSpan":1, "rowSpan":1 },
                { "value":"cell 2_1", "colSpan":1, "rowSpan":1 }
            ]
        }, {
            cells: [
                { "value":"cell 0_2", "colSpan":1, "rowSpan":1 },
                { "value":"cell 1_2", "colSpan":1, "rowSpan":1 },
                { "value":"cell 2_2", "colSpan":1, "rowSpan":1 }
            ]
        } ]
    });

    var dom = $(worksheet.toXML());
    var cell0_1 = dom.find("row:eq(1) > c:eq(0)");
    var cell2_1 = dom.find("row:eq(1) > c:eq(1)");

    equal(cell0_1.attr("r"), "A2");
    equal(cell2_1.attr("r"), "C2");

    var cell0_2 = dom.find("row:eq(2) > c:eq(0)");
    var cell1_2 = dom.find("row:eq(2) > c:eq(1)");
    var cell2_2 = dom.find("row:eq(2) > c:eq(2)");

    equal(cell0_2.attr("r"), "A3");
    equal(cell1_2.attr("r"), "B3");
    equal(cell2_2.attr("r"), "C3");
});

}());
