(function(f, define){
    define([ "../kendo.core", "./runtime", "./references", "./excel-reader" ], f);
})(function(){

(function(kendo) {
    if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
        return;
    }

    var $ = kendo.jQuery;

    var Workbook = kendo.Observable.extend({
        init: function(options, view) {
            kendo.Observable.fn.init.call(this);

            this.options = options;

            this._view = view;
            this._sheets = [];

            this._sheetsSearchCache = {};

            this._sheet = this.insertSheet({
                rows: this.options.rows,
                columns: this.options.columns,
                rowHeight: this.options.rowHeight,
                columnWidth: this.options.columnWidth,
                headerHeight: this.options.headerHeight,
                headerWidth: this.options.headerWidth,
                dataSource: this.options.dataSource
            });

            this.undoRedoStack = new kendo.util.UndoRedoStack();
            this.undoRedoStack.bind(["undo", "redo"], this._onUndoRedo.bind(this));

            this._context = new kendo.spreadsheet.FormulaContext(this);
            this._validationContext = new kendo.spreadsheet.ValidationFormulaContext(this);
            this._names = Object.create(null);

            this.fromJSON(this.options);
        },

        clipboard: function() {
            if(!this._clipboard) {
                 this._clipboard = new kendo.spreadsheet.Clipboard(this);
            }
            return this._clipboard;
        },

        destroy: function() {
            this.unbind();

            if (this._clipboard) {
                this._clipboard.destroy();
            }
        },

        events: [
            "change",
            "excelImport",
            "excelExport"
        ],

        _sheetChange: function(e) {
            this.trigger("change", e);
        },

        _sheetCommandRequest: function(e) {
            this.trigger("commandRequest", e);
        },

        _inputForRef: function(ref) {
            return new kendo.spreadsheet.Range(ref, this._sheet).input();
        },

        _onUndoRedo: function(e) {
            e.command.range().select();
        },

        execute: function(options) {
            var commandOptions = $.extend({ workbook: this }, options.options);
            var command = new kendo.spreadsheet[options.command](commandOptions);
            var sheet = this.activeSheet();

            if (commandOptions.origin) {
                command.origin(commandOptions.origin);
            }

            if (commandOptions.operatingRange) {
                command.range(commandOptions.operatingRange);
            } else if (commandOptions.editActiveCell) {
                command.range(sheet.activeCellSelection());
            } else {
                command.range(sheet.selection());
            }

            var result = command.exec();

            if (!result || result.reason !== "error") {
                if (command.cannotUndo) {
                    this.undoRedoStack.clear();
                } else {
                    this.undoRedoStack.push(command);
                }
            }

            return result;
        },

        resetFormulas: function() {
            this._sheets.forEach(function(sheet){
                sheet.resetFormulas();
            });
        },

        resetValidations: function() {
            this._sheets.forEach(function(sheet){
                sheet.resetValidations();
            });
        },

        refresh: function(reason) {
            if (reason.recalc) {
                this.resetFormulas();
                this.resetValidations();
                this._sheet.recalc(this._context);
                this._sheet.revalidate(this._validationContext);
            }
        },

        activeSheet: function(sheet) {
            if (sheet === undefined) {
                return this._sheet;
            }

            if (!this.sheetByName(sheet.name())) {
                return;
            }

            this._sheet = sheet;

            //TODO: better way to get all reasons?
            sheet.triggerChange(kendo.spreadsheet.ALL_REASONS);
        },

        moveSheetToIndex: function(sheet, toIndex) {
            var fromIndex = this.sheetIndex(sheet);
            var sheets = this._sheets;

            if (fromIndex === -1) {
                return;
            }

            this._sheetsSearchCache = {};

            sheets.splice(toIndex, 0, sheets.splice(fromIndex, 1)[0]);

            this.trigger("change", { sheetSelection: true });
        },

        insertSheet: function(options) {
            options = options || {};
            var that = this;
            var insertIndex = typeof options.index === "number" ? options.index : that._sheets.length;
            var sheetName;
            var sheets = that._sheets;

            var getUniqueSheetName = function(sheetNameSuffix) {
                sheetNameSuffix = sheetNameSuffix ? sheetNameSuffix : 1;

                var name = "Sheet" + sheetNameSuffix;

                if (!that.sheetByName(name)) {
                    return name;
                }

                return getUniqueSheetName(sheetNameSuffix + 1);
            };

            if (options.name && that.sheetByName(options.name)) {
                return;
            }

            this._sheetsSearchCache = {};

            sheetName = options.name || getUniqueSheetName();

            var sheet = new kendo.spreadsheet.Sheet(
                options.rows || this.options.rows,
                options.columns || this.options.columns,
                options.rowHeight || this.options.rowHeight,
                options.columnWidth || this.options.columnWidth,
                options.headerHeight || this.options.headerHeight,
                options.headerWidth || this.options.headerWidth
            );

            sheet._workbook = this;

            sheet._name(sheetName);

            sheet.bind("change", this._sheetChange.bind(this));
            sheet.bind("commandRequest", this._sheetCommandRequest.bind(this));

            sheets.splice(insertIndex, 0, sheet);

            if (options.data) {
                sheet.fromJSON(options.data);
            }

            if (options.dataSource) {
                sheet.setDataSource(options.dataSource);
            }

            this.trigger("change", { sheetSelection: true });

            return sheet;
        },

        sheets: function() {
            return this._sheets.slice();
        },

        sheetByName: function (sheetName) {
            return this._sheets[this.sheetIndex(sheetName)];
        },

        sheetByIndex: function(index) {
            return this._sheets[index];
        },

        sheetIndex: function(sheet) {
            var sheets = this._sheets;
            var sheetName = (typeof sheet == "string" ? sheet : sheet.name()).toLowerCase();
            var idx = this._sheetsSearchCache[sheetName];

            if (idx >= 0) {
                return idx;
            }

            for(idx = 0; idx < sheets.length; idx++) {
                var name = sheets[idx].name().toLowerCase();
                this._sheetsSearchCache[name] = idx;

                if (name === sheetName) {
                    return idx;
                }
            }

            return -1;
        },

        renameSheet: function(sheet, newSheetName) {
            var oldSheetName = sheet.name();

            if (!newSheetName ||
                oldSheetName === newSheetName) {
                return;
            }

            sheet = this.sheetByName(oldSheetName);

            if (!sheet) {
                return;
            }

            this._sheetsSearchCache = {};

            // update references
            this._sheets.forEach(function(sheet){
                sheet._forFormulas(function(formula){
                    formula.renameSheet(oldSheetName, newSheetName);
                });
            });

            sheet._name(newSheetName);

            this.trigger("change", { sheetSelection: true });

            return sheet;
        },

        removeSheet: function(sheet) {
            var that = this;
            var sheets = that._sheets;
            var name = sheet.name();
            var index = that.sheetIndex(sheet);

            if (sheets.length === 1) {
                return;
            }

            this._sheetsSearchCache = {};

            if (index > -1) {
                sheet.unbind();

                sheets.splice(index, 1);

                if (that.activeSheet().name() === name) {
                    var newSheet = sheets[index === sheets.length ? index-1 : index];
                    that.activeSheet(newSheet);
                } else {
                    this.trigger("change", { recalc: true,  sheetSelection: true });
                }
            }
        },

        _clearSheets: function() {
            for (var i = 0; i < this._sheets.length; i++) {
                this._sheets[i].unbind();
            }
            this._sheets = [];
            this._sheetsSearchCache = {};
        },

        fromJSON: function(json) {
            if (json.sheets) {
                this._clearSheets();

                for (var idx = 0; idx < json.sheets.length; idx++) {
                    var data = json.sheets[idx];
                    var args = sheetParamsFromJSON(data, this.options);
                    var sheet = this.insertSheet({
                        rows         : args.rowCount,
                        columns      : args.columnCount,
                        rowHeight    : args.rowHeight,
                        columnWidth  : args.columnWidth,
                        headerHeight : args.headerHeight,
                        headerWidth  : args.headerWidth,
                        data         : data
                    });

                    if (data.dataSource) {
                        sheet.setDataSource(data.dataSource);
                    }
                }
            }

            if (json.activeSheet) {
                this.activeSheet(this.sheetByName(json.activeSheet));
            } else {
                this.activeSheet(this._sheets[0]);
            }
        },

        toJSON: function() {
            this.resetFormulas();
            this.resetValidations();
            return {
                activeSheet: this.activeSheet().name(),
                sheets: this._sheets.map(function(sheet) {
                    sheet.recalc(this._context);
                    return sheet.toJSON();
                }, this)
            };
        },

        fromFile: function(file) {
            var deferred = new $.Deferred();
            var promise = deferred.promise();
            var args = { file: file, promise: promise };

            if (file && !this.trigger("excelImport", args)) {
                this._clearSheets();
                kendo.spreadsheet.readExcel(file, this, deferred);
            } else {
                deferred.reject();
            }

            return promise;
        },

        saveAsExcel: function(options) {
            options = $.extend({}, this.options.excel, options);
            var data = this.toJSON();

            if (!this.trigger("excelExport", { workbook: data })) {
                var workbook = new kendo.ooxml.Workbook(data);

                kendo.saveAs({
                    dataURI: workbook.toDataURL(),
                    fileName: data.fileName || options.fileName,
                    proxyURL: options.proxyURL,
                    forceProxy: options.forceProxy
                });
            }
        },

        draw: function(options, callback) {
            if (typeof options == "function" && !callback) {
                callback = options;
                options = {};
            }
            var parts = [], sheets = this._sheets;
            (function loop(i){
                if (i < sheets.length) {
                    sheets[i].draw(kendo.spreadsheet.SHEETREF, options, function(group){
                        parts.push(group);
                        loop(i + 1);
                    });
                } else {
                    var group = parts[0];
                    for (i = 1; i < parts.length; ++i) {
                        group.children = group.children.concat(parts[i].children);
                    }
                    callback(group);
                }
            })(0);
        },

        nameForRef: function(ref, sheet) {
            if (sheet === undefined) {
                sheet = ref.sheet;
            }
            sheet = sheet.toLowerCase();
            ref = ref.simplify();
            var str = ref + "";
            for (var name in this._names) {
                var def = this._names[name];
                var val = def.value;
                if (val instanceof kendo.spreadsheet.Ref) {
                    if (sheet == val.sheet.toLowerCase()) {
                        if (val + "" == str) {
                            return { name: def.name, def: def };
                        }
                    }
                }
            }
            return { name: str };
        },

        defineName: function(name, value, hidden) {
            this._names[name.toLowerCase()] = { value: value, hidden: hidden, name: name };
        },

        undefineName: function(name) {
            delete this._names[name.toLowerCase()];
        },

        nameValue: function(name) {
            name = name.toLowerCase();
            if (name in this._names) {
                return this._names[name].value;
            }
            return null;
        },

        adjustNames: function(affectedSheet, forRow, start, delta) {
            affectedSheet = affectedSheet.toLowerCase();
            Object.keys(this._names).forEach(function(name){
                var ref = this.nameValue(name);
                if (ref instanceof kendo.spreadsheet.Ref &&
                    ref.sheet.toLowerCase() == affectedSheet) {
                    ref = ref.adjust(null, null, null, null, forRow, start, delta);
                    this.defineName(name, ref);
                }
            }, this);
        },
        options: {}
    });

    function sheetParamsFromJSON(data, options) {
        function or(a, b, c) {
            return a !== undefined ? a : b !== undefined ? b : c;
        }

        var rowCount     = or(data.rowCount, options.rows, 200),
            columnCount  = or(data.columnCount, options.columns, 50),
            rowHeight    = or(data.rowHeight, options.rowHeight, 20),
            columnWidth  = or(data.columnWidth, options.columnWidth, 64),
            headerHeight = or(data.headerHeight, options.headerHeight, 20),
            headerWidth  = or(data.headerWidth, options.headerWidth, 32);

        if (data.rows !== undefined) {
            for (var i = 0; i < data.rows.length; ++i) {
                var row = data.rows[i];
                var ri = or(row.index, i);
                if (ri >= rowCount) { rowCount = ri + 1; }
                if (row.cells) {
                    for (var j = 0; j < row.cells.length; ++j) {
                        var cell = row.cells[j];
                        var ci = or(cell.index, j);
                        if (ci >= columnCount) { columnCount = ci + 1; }
                    }
                }
            }
        }

        return {
            rowCount     : rowCount,
            columnCount  : columnCount,
            rowHeight    : rowHeight,
            columnWidth  : columnWidth,
            headerHeight : headerHeight,
            headerWidth  : headerWidth
        };
    }

    kendo.spreadsheet.Workbook = Workbook;
    if (kendo.PDFMixin) {
        kendo.PDFMixin.extend(Workbook.prototype);

        Workbook.prototype.saveAsPDF = function(options) {
            var progress = new $.Deferred();
            var promise = progress.promise();
            var args = { promise: promise };
            if (this.trigger("pdfExport", args)) {
                return;
            }

            this._drawPDF(options, progress)
            .then(function(root) {
                return kendo.drawing.exportPDF(root);
            })
            .done(function(dataURI) {
                kendo.saveAs({
                    dataURI: dataURI,
                    fileName: options.fileName,
                    proxyURL: options.proxyURL,
                    forceProxy: options.forceProxy,
                    proxyTarget: options.proxyTarget
                });

                progress.resolve();
            })
            .fail(function(err) {
                progress.reject(err);
            });

            return promise;
        };

        Workbook.prototype._drawPDF = function(options) {
            var result = new $.Deferred();
            var callback = function(group) {
                result.resolve(group);
            };
            switch(options.area) {
            case "workbook":
                options.workbook.draw(options, callback);
                break;
            case "sheet":
                options.workbook.activeSheet().draw(options, callback);
                break;
            case "selection":
                options.workbook.activeSheet().selection().draw(options, callback);
                break;
            }

            return result.promise();
        };
    }
})(kendo);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
