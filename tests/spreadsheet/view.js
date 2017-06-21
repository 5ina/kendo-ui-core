(function() {
    var element;
    var sheet;
    var spreadsheet;

    module("spreadsheet view", {
        setup: function() {
            element = $("<div>").appendTo(QUnit.fixture);

            spreadsheet = new kendo.ui.Spreadsheet(element, { rows: 3, columns: 3 });

            sheet = spreadsheet.activeSheet();
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    function singleCell(cell) {
        return { rows: [ { cells: [ cell ] } ] };
    }

    function firstDataCell(element) {
        return element.find(".k-spreadsheet-cell").eq(0);
    }

    test("The Healer of the Unit Test Module", function() {
        // On my machine, one of the other (real) tests
        // will fail if I remove this one.
        equal(true, true);
    });

    test("renders border color", function() {
        sheet.fromJSON(singleCell({ borderRight: { color: "rgb(255, 0, 0)" } }));

        equal(element.find(".k-spreadsheet-vborder").css("borderRightColor"), "rgb(255, 0, 0)");
    });

    test("renders 12 hours format", function() {
        sheet.fromJSON(singleCell({ format: "hh:mm", value: new Date("7/1/2014 15:15") }));
        equal(firstDataCell(element).text(), "03:15");
    });

    test("renders 24 hours format", function() {
        sheet.fromJSON(singleCell({ format: "HH:mm", value: new Date("7/1/2014 15:15") }));
        equal(firstDataCell(element).text(), "15:15");
    });

    test("renders border size", function() {
        sheet.fromJSON(singleCell({ borderBottom: { size: 2 } }));

        equal(element.find(".k-spreadsheet-hborder")[0].style.borderWidth, "2px");
    });

    test("renders fontSize", function() {
        sheet.fromJSON(singleCell({ fontSize: 8 }));

        equal(firstDataCell(element).css("fontSize"), "8px");
    });

    test("does not render null border", function() {
        sheet.fromJSON(singleCell({ borderBottom: null }));

        equal(firstDataCell(element)[0].style.borderBottomStyle, "");
    });

    test("renders border color on cells with background and no border", function() {
        sheet.fromJSON(singleCell({ background: "rgb(255, 0, 0)" }));
        // note: the border color will be a darker version of the background color
        equal(firstDataCell(element).css("outlineColor"), "rgb(230, 0, 0)");
    });

    test("add 'k-dirty-cell' of first cell when value is not valid", function() {
        var cell = singleCell({
            borderTop: { size: 1, color: "rgb(255, 0 0)" },
            validation: { from: "10", comparerType: "equalTo", messageTemplate: "Enter valid value!" }
        });
        sheet.fromJSON(cell);

        var topCell = firstDataCell(element);

        ok(topCell.hasClass("k-dirty-cell"));
    });

    test("add 'k-dirty' element to invalid cell", function() {
        var cell = singleCell({
            borderTop: { size: 1, color: "rgb(255, 0 0)" },
            validation: { from: "10", comparerType: "equalTo", messageTemplate: "Enter valid value!" }
        });
        sheet.fromJSON(cell);

        var topCell = firstDataCell(element);
        var flagSpan = topCell.children(".k-dirty");

        equal(flagSpan.length, 1);
        ok(flagSpan[0].nodeName, "SPAN");
    });

    test("add cell title if element is not valid", function() {
        var title = "Enter valid value!";
        var cell = singleCell({
            borderTop: { size: 1, color: "rgb(255, 0 0)" },
            validation: { from: "10", comparerType: "equalTo", messageTemplate: title }
        });
        sheet.fromJSON(cell);

        var topCell = firstDataCell(element);

        equal(topCell.attr("title"), title);
    });

    test("cell title is correctly formatted", function() {
        var title = "{0}{1}{2}{3}{4}{5}{6}{7}";
        var cell = singleCell({
            borderTop: { size: 1, color: "rgb(255, 0 0)" },
            validation: { from: "10", comparerType: "equalTo", messageTemplate: title }
        });
        sheet.fromJSON(cell);

        var topCell = firstDataCell(element);

        equal(topCell.attr("title"), "1010warningequalTo");
    });

    test("renders tabstrip", function() {
        ok(spreadsheet._view.tabstrip instanceof kendo.ui.TabStrip);
        ok($(".k-tabstrip").length);
    });

    test("renders quickAccessToolBar", function() {
        ok($(".k-spreadsheet-quick-access-toolbar").length);
        equal($(".k-spreadsheet-quick-access-toolbar").children().length, 2);
    });

    test("shifts tabstrip tabGroup elements", function() {
        var tabstrip = spreadsheet._view.tabstrip;
        var quickAccessToolBar = $(".k-spreadsheet-quick-access-toolbar");

        equal(parseInt(tabstrip.tabGroup.css("padding-left"), 10), parseInt(quickAccessToolBar.outerWidth(), 10));
    });

    test("createFilterMenu creates filter menu for column range", function() {
        sheet.range("A1:B3").filter(true);

        var filterMenu = spreadsheet._view.createFilterMenu(0);

        ok(filterMenu instanceof kendo.spreadsheet.FilterMenu);
        equal(filterMenu.options.range._ref.print(), "$A$1:$B$3");
        equal(filterMenu.options.column, 0);
    });

    test("createFilterMenu creates filter menu for correct column range", function() {
        sheet.range("A1:B3").filter(true);

        var filterMenu = spreadsheet._view.createFilterMenu(1);

        ok(filterMenu instanceof kendo.spreadsheet.FilterMenu);
        equal(filterMenu.options.range._ref.print(), "$A$1:$B$3");
        equal(filterMenu.options.column, 1);
    });

    test("createFilterMenu reuses filter menu if opened twice", function() {
        sheet.range("A1:B3").filter(true);

        var view = spreadsheet._view;
        var filterMenu = view.createFilterMenu(1);

        equal(view.createFilterMenu(1), filterMenu);
    });

    test("do not render clipboard content if in edit mode", function() {
        var view = spreadsheet._view;

        stub(view, {
            renderClipboardContents: view.renderClipboardContents
        });

        sheet.isInEditMode(true);
        view.render();

        equal(view.calls("renderClipboardContents"), 0);
    });

    test("renderes filter headers", function() {
        sheet.range("A1:B3").filter(true);

        equal(element.find(".k-spreadsheet-filter").length, 2);
    });

    test("renders filtered state of filter headers", function() {
        sheet.range("A1:B3").filter({
            column: 0,
            filter: new kendo.spreadsheet.ValueFilter({
                values: [ 1 ]
            })
        });

        var activeBottom = element.find(".k-spreadsheet-filter.k-state-active");
        equal(activeBottom.length, 1);
        equal(activeBottom.index(), 1);
    });

    test("renders one filter header on merged cell", function() {
        sheet.range("A1:B3").merge().filter(true);

        equal(element.find(".k-spreadsheet-filter").length, 1);
    });

    test("refresh quickAccessButtons position", function() {
        var tabstrip = spreadsheet._view.tabstrip;

        stub(tabstrip, {
            quickAccessAdjust: tabstrip.quickAccessAdjust
        });

        spreadsheet.refresh();
        equal(tabstrip.calls("quickAccessAdjust"), 1);
    });

})();
