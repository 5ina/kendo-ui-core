(function(f, define){
    define([ ], f);
})(function() {

    /* jshint eqnull:true */

    var spreadsheet = kendo.spreadsheet;
    var CellRef = kendo.spreadsheet.CellRef;
    var RangeRef = kendo.spreadsheet.RangeRef;
    var UnionRef = kendo.spreadsheet.UnionRef;
    var NameRef = kendo.spreadsheet.NameRef;

    var FormulaContext = kendo.Class.extend({
        init: function (workbook) {
            this.workbook = workbook;
        },

        getRefCells: function(ref, hiddenInfo) {
            var sheet, formula, value, i;
            if (ref instanceof CellRef) {
                sheet = this.workbook.sheetByName(ref.sheet);
                if (!sheet) {
                    return [{
                        value: new kendo.spreadsheet.calc.runtime.CalcError("SHEET")
                    }];
                }
                formula = sheet.formula(ref);
                value = sheet.range(ref.row, ref.col).value();

                if (formula != null || value != null) {
                    return [{
                        formula: formula,
                        value: value,
                        row: ref.row,
                        col: ref.col,
                        sheet: ref.sheet,
                        hidden: hiddenInfo ? (sheet.columnWidth(ref.col) === 0 || sheet.rowHeight(ref.row) === 0) : false
                    }];
                } else {
                    return [];
                }
            }
            if (ref instanceof RangeRef) {
                i = this.workbook.sheetIndex(ref.sheet);
                var states = [], n = i;
                if (ref.endSheet) {
                    // "3D" reference.
                    n = this.workbook.sheetIndex(ref.endSheet);
                    if (i > n) {
                        var tmp = i;
                        i = n;
                        n = tmp;
                    }
                }

                if (i < 0 || n < 0) {
                    return [{
                        value: new kendo.spreadsheet.calc.runtime.CalcError("SHEET")
                    }];
                }

                // XXX: This is nicer, but significantly slower.
                // Should investigate why, or add some options to make
                // it faster (i.e. probably because it adds all cell
                // properties, while we only need value and formula).
                //
                //     var add = function(row, col, data){
                //         data.row = row;
                //         data.col = col;
                //         data.sheet = sheet.name();
                //         states.push(data);
                //     };
                //     while (i <= n) {
                //         sheet = this.workbook.sheetByIndex(i++);
                //         sheet.forEach(ref, add);
                //     }
                //
                // For now keep doing it "manually".

                while (i <= n) {
                    sheet = this.workbook.sheetByIndex(i++);
                    var tl = sheet._grid.normalize(ref.topLeft);
                    var br = sheet._grid.normalize(ref.bottomRight);

                    var startCellIndex = sheet._grid.cellRefIndex(tl);
                    var endCellIndex = sheet._grid.cellRefIndex(br);

                    var values = sheet._properties.iterator("value", startCellIndex, endCellIndex);

                    for (var col = tl.col; col <= br.col; ++col) {
                        for (var row = tl.row; row <= br.row; ++row) {
                            var index = sheet._grid.index(row, col);
                            formula = sheet._properties.get("formula", index);
                            value = values.at(index);
                            if (formula != null || value != null) {
                                states.push({
                                    formula : formula,
                                    value   : value,
                                    row     : row,
                                    col     : col,
                                    sheet   : sheet.name(),
                                    hidden  : hiddenInfo ? (sheet.columnWidth(col) === 0 || sheet.rowHeight(row) === 0) : false
                                });
                            }
                        }
                    }
                }

                return states;
            }
            if (ref instanceof UnionRef) {
                var a = [];
                for (i = 0; i < ref.refs.length; ++i) {
                    a = a.concat(this.getRefCells(ref.refs[i], hiddenInfo));
                }
                return a;
            }
            if (ref instanceof NameRef) {
                // XXX: NameRef-s not yet supported
                return [{
                    value: new kendo.spreadsheet.calc.runtime.CalcError("NAME")
                }];
            }
            return [];
        },

        getData: function(ref) {
            var data = this.getRefCells(ref).map(function(cell){
                return cell.value;
            });
            return ref instanceof CellRef ? data[0] : data;
        },

        onFormula: function(f) {
            var sheet = this.workbook.sheetByName(f.sheet);
            var row = f.row, col = f.col, value = f.value;
            var currentFormula = sheet.formula({ row: row, col: col });
            if (currentFormula !== f) {
                // could have been deleted or modified in the mean time,
                // if the formula was asynchronous.  ignore this result.
                return false;
            }

            if (value instanceof kendo.spreadsheet.calc.runtime.Matrix) {
                value.each(function(value, r, c) {
                    sheet._value(row + r, col + c, value);
                });
            } else {
                sheet._value(row, col, value);
            }

            return true;
        }
    });

    spreadsheet.FormulaContext = FormulaContext;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
