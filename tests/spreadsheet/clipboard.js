(function() {
    var view;
    var workbook;
    var sheet;
    var clipboard;
    var defaults = {"prefix":"","name":"Spreadsheet","toolbar":true,"rows":200,"columns":10,"rowHeight":20,"columnWidth":64,"headerHeight":20,"headerWidth":32};

    // check for the existence of `props` in `obj` (deep).  does not
    // mind if `obj` contains additional properties, but those
    // specified in 'props' must be present and have same values.
    function hasProps(obj, props) {
        for (var i in props) {
            if (Object.prototype.hasOwnProperty.call(props, i)) {
                var val = props[i];
                if (Array.isArray(val) || (typeof val == "object" && val != null)) {
                    hasProps(obj[i], val);
                } else {
                    equal(obj[i], val);
                }
            }
        }
    }

    module("Clipboard API", {
        setup: function() {
            var element = $("<div>").appendTo(QUnit.fixture);
            view = new kendo.spreadsheet.View(element);
            workbook = new kendo.spreadsheet.Workbook(defaults, view);
            sheet = workbook.activeSheet();
            clipboard = workbook.clipboard();
        },
        teardown: function() {
            sheet.unbind();
            view.destroy();
            workbook.destroy();
            kendo.destroy(QUnit.fixture);
            QUnit.fixture.empty();
        }
    });

    test("basic copy - paste works", function() {
        sheet.range("A1").value("test").select();
        clipboard.copy();
        sheet.range("B1").select();
        clipboard.menuInvoked = false;
        clipboard.parse();
        clipboard.paste();

        equal(sheet.range("B1").value(), "test");
    });

    test("paste on sheet edge truncates the clipboard contents", function() {
        sheet.range("A1:C1").value("test").select();
        clipboard.copy();
        sheet.range("I1:J1").select();
        clipboard.menuInvoked = false;
        clipboard.parse();
        clipboard.paste();

        equal(sheet.range("J1").value(), "test");
    });

    test("can copy returns false for union ranges", function() {
        sheet.range("A1:C1,B2").select();
        clipboard.copy();

        ok(!clipboard.canCopy().canCopy);
    });

    test("canPaste returns false if merged cells are partially overlapped", function() {
        sheet.range("A1:C1").select();
        clipboard.copy();

        sheet.range("D1:F1").merge();
        sheet.range("C1").select();
        clipboard.menuInvoked = false;
        ok(!clipboard.canPaste().canPaste);
    });

    test("canPaste returns true if no merged cells are affected", function() {
        sheet.range("A1:C1").select();
        clipboard.copy();

        sheet.range("C1").select();
        clipboard.menuInvoked = false;
        ok(clipboard.canPaste().canPaste);
    });

    test("canPaste returns false if pasting into larger merged cell", function() {
        sheet.range("A1:C1").select();
        clipboard.copy();

        sheet.range("D1:G1").merge().select();
        clipboard.menuInvoked = false;
        ok(!clipboard.canPaste().canPaste);
    });

    test("parse returns font-size as integer", function() {
        clipboard._externalContent = {
            html: "<table><trbody><tr><td style='font-size: 8px'>foo</td></tr></tbody></table>"
        };
        clipboard.parse();
        equal(clipboard._content.data[0][0].fontSize, 8);
    });

    test("parseHTML handles merged cells with rowspan", function() {
        clipboard._externalContent = {
            html: '<table> <tbody> <tr> <td>0,0</td> <td rowspan="2">0,1 - 1,1</td> <td>0,2</td> </tr> <tr> <td>1,0</td> <td>1,2</td> </tr> </tbody> </table>'
        };
        clipboard.parse();
        hasProps(clipboard._content, {
            mergedCells: [ "B1:B2" ],
            data: [
                [ {value:"0,0"}, {value:"0,1 - 1,1"}, {value:"0,2"} ],
                [ {value:"1,0"}, {value:null}, {value:"1,2"} ]
            ]
        });
    });

    test("parseHTML handles merged cells with colspan", function() {
        clipboard._externalContent = {
            html: '<table> <tbody> <tr><td>0,0</td><td colspan="2">0,1 - 0,2</td><td>0,3</td></tr><tr><td>1,0</td><td>1,1</td><td>1,2</td><td>1,3</td></tr> </tbody> </table>'
        };
        clipboard.parse();
        hasProps(clipboard._content, {
            mergedCells: [ "B1:C1" ],
            data: [
                [ {value:"0,0"}, {value:"0,1 - 0,2"}, {value:null}, {value:"0,3"} ],
                [ {value:"1,0"}, {value:"1,1"}, {value: "1,2"}, {value:"1,3"} ],
            ]
        });
    });

    test("parseHTML handles merged cells with colspan and rowspan", function() {
        clipboard._externalContent = {
            html: '<table> <td>0,0</td> <td colspan="2" rowspan="3">0,1-0,2:2,1-2,2</td> </tr> <tr> <td>1,0</td> </tr> <tr> <td >2,0</td> </tr> </tbody> </table>'
        };
        clipboard.parse();
        hasProps(clipboard._content, {
            mergedCells: [ "B1:C3" ],
            data: [
                [ {value:"0,0"}, {value:"0,1-0,2:2,1-2,2"}, {value:null} ],
                [ {value:"1,0"}, {value:null}, {value:null} ],
                [ {value:"2,0"}, {value:null}, {value:null} ]
            ]
        });
    });

    test("Pasting from external source interprets values as input", function(){
        clipboard.external({
            html: "<table> <td>1</td> <td>true</td> <td>=sum(a1:b1)</td> </table>"
        });
        clipboard.parse();
        clipboard.paste();
        equal(typeof sheet.range("A1").value(), "number");
        equal(typeof sheet.range("B1").value(), "boolean");
        equal(sheet.range("C1").formula().toString(), "sum(A1:B1)");
    });

    test("Pasting from external source keeps cell formatting", function(){
        sheet.range("A1").format("#,#.00").value("1111").select();
        clipboard.external({ html: "<table><td>1234</td></table>" });
        clipboard.parse();
        clipboard.paste();
        equal(sheet.range("A1").value(), 1234);
        equal(sheet.range("A1").format(), "#,#.00");
    });

    test("Pasting from filtered range does not include hidden values", function(){
        sheet.range("A1:A3").values([
            [ 1 ], [ 2 ], [ 3 ]
        ]).filter({
            column: 0,
            filter: new kendo.spreadsheet.CustomFilter({
                criteria: [
                    { operator: "neq", value: 2 }
                ]
            })
        }).select();
        clipboard.copy();
        sheet.range("B1").select();
        clipboard.parse();
        clipboard.paste();
        equal(sheet.range("B1").value(), 1);
        equal(sheet.range("B2").value(), 3);
    });
})();
