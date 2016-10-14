(function() {
    var Grid = kendo.ui.Grid,
        div,
        table,
        lockedTable,
        DataSource = kendo.data.DataSource,
        Model = kendo.data.Model,
        dataSource;

    function setup(options) {
        options = $.extend({}, {
            editable: true,
            navigatable: true,
            dataSource: {
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { field: "id", readonly: true },
                            name: "name",
                            foo: { field: "foo", validation: { required: true } }
                        }
                    }
                },
                data: [
                    { foo: "bar", name: "tom", id: 0 },
                    { foo: "baz", name: "jerry", id: 1 },
                    { foo: "baz", name: "foo", id: 2 }
                ]
            }
        },
        options);

        var grid = new Grid(div, options);
        dataSource = grid.dataSource;
        table = grid.table;
        lockedTable = grid.lockedTable;
        return grid;
    }

    function focusCell(grid, selector) {
        selector = selector || "tr:first>td:first";
        grid.current(grid.table.focus().find(selector));

        return grid;
    }

    module("grid editing navigation", {
        setup: function() {
            div = $("<div />").appendTo(QUnit.fixture);

            $.fn.press = function(key, ctrl, shift) {
                return this.trigger( { type: "keydown", keyCode: key, ctrlKey: ctrl, shiftKey: shift } );
            }

            jasmine.clock().install();
        },
        teardown: function() {
            jasmine.clock().uninstall();
            kendo.destroy(QUnit.fixture);
            div.remove();
        }
    });

    test("pressing enter key edit the cell", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);

        ok(table.find("tr>td:first").hasClass("k-edit-cell"));
    });

    test("pressing enter key on command column does not edit the cell", function() {
        var grid = setup({ columns: [{ command: "destroy" }, "id"]} );

        focusCell(grid).table.press(kendo.keys.ENTER);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
    });

    test("pressing enter key on edited cell exits edit mode", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ENTER);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
    });

    test("pressing enter key on edited cell restores current", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ENTER);

        ok(table.find("tr>td:first")[0] === grid.current()[0]);
        ok(table.find("tr>td:first").hasClass("k-state-focused"));
    });

    test("pressing enter key on edited cell does not exits edit mode if validation fails", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);
        table.find("tr>td>input:first").val("").press(kendo.keys.ENTER);

        ok(table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td>input:first")[0] === document.activeElement);
    });

    test("pressing enter key when active element is not within current", function() {
        var grid = setup({
            sortable: true
        });

        grid.thead.find("th:first").click();
        grid.addRow();
        grid.table.find("input:first").press(kendo.keys.ENTER);

        equal(grid.current()[0], table.find("tr>td")[0]);
    });

    test("pressing navigation key action is skipped if cell is edited", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);
        table.find("tr>td>input:first").press(kendo.keys.RIGHT);

        ok(table.find("tr>td:first")[0] === grid.current()[0]);
    });

    test("pressing enter on cell when another is edited", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);
        grid.current(table.find("tr>td").eq(1));
        table.find("tr>td").eq(1).press(kendo.keys.ENTER);

        ok(table.find("tr>td")[1] === grid.current()[0]);
        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td").eq(1).hasClass("k-edit-cell"));
    });

    test("pressing enter on cell when another is edited and validation fails", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);
        table.find("tr>td>input:first").val("");
        grid.current(table.find("tr>td").eq(1));
        table.find("tr>td").eq(1).press(kendo.keys.ENTER);

        ok(table.find("tr>td")[0] === grid.current()[0]);
        ok(table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(!table.find("tr>td").eq(1).hasClass("k-edit-cell"));
    });

    test("pressing space key inside grid editor does not change selection", function() {
        var grid = setup({ selectable: "cell" });

        focusCell(grid).table.press(kendo.keys.ENTER);
        table.find("tr>td>input:first").press(kendo.keys.SPACEBAR);

        ok(!grid.current().hasClass("k-state-selected"));
    });

    test("pressing tab key edit next cell", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.TAB);

        ok(table.find("tr>td").eq(1).hasClass("k-edit-cell"));
    });

    test("pressing tab key on edited cell exits edit mode", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.TAB);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td").eq(1).hasClass("k-edit-cell"));
    });

    test("pressing tab key on edited cell does not exits edit mode if validation fails", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER);
        table.find("tr>td>input:first").val("").press(kendo.keys.TAB);

        ok(table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td>input:first")[0] === document.activeElement);
    });

    test("pressing tab when current is at the end of the row focus first cell on next row", function() {
        var grid = setup();

        grid.current(table.find("tr:first>td:last"));
        table.focus().press(kendo.keys.TAB);

        ok(table.find("tr:nth(1)>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr:nth(1)>td>input:first")[0] === document.activeElement);
    });

    test("pressing shift and tab key edit previous cell", function() {
        var grid = setup();

        grid.current(table.find("tr>td").eq(1));
        table.focus().press(kendo.keys.TAB, false, true);

        ok(table.find("tr>td").eq(0).hasClass("k-edit-cell"));
    });

    test("pressing shift and tab when current is at the begining of the row focus last cell on previous row", function() {
        var grid = setup();

        grid.current(table.find("tr:eq(2)>td:first"));
        table.focus().press(kendo.keys.TAB, false, true);

        ok(table.find("tr:eq(1)>td:last")[0] === grid.current()[0]);
    });

    test("pressing escape key on edited cell exits edit mode", function() {
        var grid = setup();

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ESC);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td:first").hasClass("k-state-focused"));
    });

    test("pressing escape key on edited cell triggers cancel event (incell edit mode)", function() {
        var grid = setup({
            cancel: function(e) {
                equal(e.container[0], table.find("tr>td")[0]);
            }
        });

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ESC);
    });

    test("pressing escape key on edited cell triggers cancel event (inline edit mode)", function() {
        var grid = setup({
            editable: "inline",
            cancel: function(e) {
                equal(e.container[0], table.find("tr")[0]);
            }
        });

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ESC);
    });

    test("pressing enter key edit the row in inline mode", function() {
        var grid = setup({ editable: "inline" });

        focusCell(grid).table.press(kendo.keys.ENTER);

        ok(table.find("tr:first").hasClass("k-grid-edit-row"));
        equal(table.find("tr:first").data("role"), "editable");
    });

    test("pressing enter key on edited item closes edit form in inline mode", function() {
        var grid = setup({ editable: "inline" });

        focusCell(grid).table.press(kendo.keys.ENTER).press(kendo.keys.ENTER);

        jasmine.clock().tick(1);

        ok(!table.find("tr:first").hasClass("k-grid-edit-row"));
    });

    test("pressing enter key on edited row does not exits edit mode if validation fails in inline mode", function() {
        var grid = setup({ editable: "inline" });

        focusCell(grid).table.press(kendo.keys.DOWN).press(kendo.keys.ENTER);
        table.find("tr>td>input:first").val("").press(kendo.keys.ENTER);

        ok(table.find("tr:eq(1)").hasClass("k-grid-edit-row"));
        ok(table.find("tr>td>input:first")[0] === document.activeElement);
        equal(table.find("tr:eq(1)>td:first")[0], grid.current()[0]);
    });

    test("pressing enter on row when another item is edited and validation fails in inline mode", function() {
        var grid = setup({ editable: "inline" });

        focusCell(grid).table.press(kendo.keys.DOWN).press(kendo.keys.ENTER);
        table.find("tr>td>input:first").val("");
        grid.current(table.find("tr>td:first"));
        grid.current().press(kendo.keys.ENTER);

        equal(table.find("tr:eq(1)>td")[0], grid.current()[0]);
        ok(table.find("tr:eq(1)").hasClass("k-grid-edit-row"));
        ok(!table.find("tr:first").hasClass("k-grid-edit-row"));
    });

    test("pressing escape key on edited row exits edit mode when in inline", function() {
        var grid = setup({ editable: "inline" });

        focusCell(grid).table.press(kendo.keys.DOWN).press(kendo.keys.ENTER).press(kendo.keys.ESC);

        ok(!table.find("tr:eq(1)").hasClass("k-grid-edit-row"));
        ok(table.find("tr:eq(1)>td:first").hasClass("k-state-focused"));
    });

    test("enter key on button in editable grid", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                template: '<input id="button" type="button" />'
            }]
        });

        grid.table.focus().press(kendo.keys.ENTER);
        $("#button").press(kendo.keys.ENTER);

        ok(!grid.current().hasClass("k-edit-cell"));
    });

    test("pressing enter on delete command button", function() {
        var grid = setup({
            editable: {
                confirmation: false
            },
            columns: [{ command: "destroy" }]
        });

        focusCell(grid).table.press(kendo.keys.ENTER).find(".k-button:first").click();

        equal(table.find("td")[0], grid.current()[0]);
    });

    test("pressing enter on cancel command button", function() {
        var grid = setup({
            editable: "inline",
            columns: ["foo", { command: "edit" }]
        });

        focusCell(grid).table.press(kendo.keys.ENTER).find(".k-grid-cancel").click();

        equal(table.find("td")[0], grid.current()[0]);
        ok(grid.current().hasClass("k-state-focused"));
        equal(document.activeElement, grid.table[0]);
    });

    test("pressing enter on save command button", function() {
        var grid = setup({
            editable: "inline",
            columns: ["foo", { command: "edit" }]
        });

        focusCell(grid).table.press(kendo.keys.ENTER).find(".k-grid-update").click();

        jasmine.clock().tick(1);

        equal(table.find("td")[0], grid.current()[0]);
        ok(grid.current().hasClass("k-state-focused"));
        equal(document.activeElement, grid.table[0]);
    });

    test("click on save command button for new item", function() {
        var grid = setup({
            editable: "inline",
            columns: [{ command: "edit" }]
        });

        grid.addRow();

        table.find(".k-grid-update").click();

        jasmine.clock().tick(1);

        ok(grid.current());
        equal(document.activeElement, grid.table[0]);
    });

    test("pressing escape key on new item without current", function() {
        var grid = setup();

        grid.addRow();
        grid.table.press(kendo.keys.ESC);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td:first").hasClass("k-state-focused"));
    });

    test("pressing enter key on new item without current and validation error", function() {
        var grid = setup();

        grid.addRow();
        grid.table.press(kendo.keys.ENTER).find(":input:first").val("foo").end().press(kendo.keys.ENTER);

        ok(!table.find("tr>td:first").hasClass("k-edit-cell"));
        ok(table.find("tr>td:first").hasClass("k-state-focused"));
    });

    test("pressing tab key on new item edit next cell", function() {
        var grid = setup({ columns: [ "name", "foo" ] });

        grid.addRow();
        grid.table.press(kendo.keys.TAB);

        ok(!table.find("tr>td").eq(0).hasClass("k-edit-cell"));
        ok(table.find("tr>td").eq(1).hasClass("k-edit-cell"));
    });

    test("pressing tab key on new item edit when current is not the edit container", function() {
        var grid = setup({ columns: [  "name", "foo" ] });

        grid.table.focus();
        document.activeElement.blur()
        grid.addRow();
        grid.table.press(kendo.keys.TAB);

        ok(!table.find("tr>td").eq(0).hasClass("k-edit-cell"));
        ok(table.find("tr>td").eq(1).hasClass("k-edit-cell"));
        equal(document.activeElement.parentNode, table.find(".k-edit-cell")[0]);
    });

    test("pressing enter on destroy command button of the only item", function() {
        var grid = setup({
            editable: { confirmation: false },
            columns: ["foo", { command: "destroy" }],
            dataSource: [{ foo: "bar", name: "tom", id: 0 }]
        });

        focusCell(grid).table.press(kendo.keys.ENTER).find(".k-grid-delete").click();

        ok(!grid._current);
    });

    test("pressing tab in locked table incell edit mode", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: true },
                { field: "id", locked: false }
            ]
        });

        lockedTable.focus().press(kendo.keys.TAB);

        equal(lockedTable.find("tr:first>td:last")[0], grid.current()[0]);
        ok(lockedTable.find("tr:first>td:last").hasClass("k-edit-cell"));
    });

    test("pressing tab moves from locked to non-locked table", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: true },
                { field: "id", locked: false }
            ]
        });

        lockedTable.focus().press(kendo.keys.TAB).press(kendo.keys.TAB);

        equal(table.find("tr:first>td")[0], grid.current()[0]);
        equal(table.attr("tabIndex"), "0");
        equal(lockedTable.attr("tabIndex"), "-1");
    });

    test("pressing shift+tab moves from non-locked to locked table", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: true },
                { field: "id", locked: false }
            ]
        });

        table.focus().press(kendo.keys.TAB, false, true);

        equal(lockedTable.find("tr:first>td:last")[0], grid.current()[0]);
        equal(table.attr("tabIndex"), "-1");
        equal(lockedTable.attr("tabIndex"), "0");
    });

    test("pressing tab moves from non-locked to next row in locked table", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: true },
                { field: "id", locked: false }
            ]
        });

        table.focus().press(kendo.keys.TAB);

        equal(lockedTable.find("tr:eq(1)>td")[0], grid.current()[0]);
        equal(table.attr("tabIndex"), "-1");
        equal(lockedTable.attr("tabIndex"), "0");
    });

    test("pressing shift+tab moves from locked to prev row in non-locked table", function() {
        var grid = setup({
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: true },
                { field: "id", locked: false }
            ]
        });

        grid.current(lockedTable.find("tr:eq(1)>td:first"));
        lockedTable.focus().press(kendo.keys.TAB, false, true);

        equal(table.find("tr:eq(0)>td:last")[0], grid.current()[0]);
        equal(table.attr("tabIndex"), "0");
        equal(lockedTable.attr("tabIndex"), "-1");
    });

    test("focus first column when locked columns", function() {
        var grid = setup({
            editable: "inline",
            columns: [
                { field: "foo", locked: true },
                { field: "name", locked: false },
                { field: "id", locked: false }
            ]
        });

        lockedTable.focus().press(kendo.keys.ENTER);

        strictEqual(document.activeElement, lockedTable.find("input")[0]);
    });
})();
