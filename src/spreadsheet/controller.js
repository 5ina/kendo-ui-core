(function(f, define){
    define([ "../kendo.core" ], f);
})(function(){

(function(kendo) {
    'use strict';

    var $ = kendo.jQuery;

    var ACTIONS = {
       "up": "up",
       "down": "down",
       "left": "left",
       "right": "right",
       "home": "first-col",
       "ctrl+left": "first-col",
       "end": "last-col",
       "ctrl+right": "last-col",
       "ctrl+up": "first-row",
       "ctrl+down": "last-row",
       "ctrl+home": "first",
       "ctrl+end": "last",
       "pageup": "prev-page",
       "pagedown": "next-page"
    };

    var ENTRY_ACTIONS = {
        "tab": "next",
        "shift+tab": "previous",
        "enter": "lower",
        "shift+enter": "upper",
        "delete": "clearContents",
        "backspace": "clearContents",
        "shift+:alphanum": "edit",
        ":alphanum": "edit",
        "ctrl+:alphanum": "ctrl",
        ":edit": "edit"
    };

    var CONTAINER_EVENTS = {
        "wheel": "onWheel",
        "*+mousedown": "onMouseDown",
        "contextmenu": "onContextMenu",
        "*+mousedrag": "onMouseDrag",
        "*+mouseup": "onMouseUp",
        "*+dblclick": "onDblClick",
        "mousemove": "onMouseMove"
    };

    var CLIPBOARD_EVENTS = {
        "*+pageup": "onPageUp",
        "*+pagedown": "onPageDown",
        "mouseup": "onMouseUp",
        "*+cut": "onCut",
        "*+paste": "onPaste",
        "*+copy": "onCopy"
    };

    var EDITOR_EVENTS = {
        "esc": "onEditorEsc",
        "enter": "onEditorBlur",
        "shift+enter": "onEditorBlur",
        "tab": "onEditorBlur",
        "shift+tab": "oonEditorBlur"
    };

    var FORMULABAR_EVENTS = $.extend({ focus: "onEditorBarFocus" }, EDITOR_EVENTS);
    var FORMULAINPUT_EVENTS = $.extend({ focus: "onEditorCellFocus" }, EDITOR_EVENTS);

    var SELECTION_MODES = {
       cell: "range",
       rowheader: "row",
       columnheader: "column",
       topcorner: "sheet"
    };

    function toActionSelector(selectors) {
        return selectors.map(function(action) {
            return '[data-action="' + action + '"]';
        }).join(",");
    }

    var COMPOSITE_UNAVAILABLE_ACTION_SELECTORS = toActionSelector([ 'cut', 'copy', 'paste', 'insert-left', 'insert-right', 'insert-above', 'insert-below' ]);
    var UNHIDE_ACTION_SELECTORS = toActionSelector([ 'unhide-row', 'unhide-column' ]);

    var ACTION_KEYS = [];
    var SHIFT_ACTION_KEYS = [];
    var ENTRY_ACTION_KEYS = [];

    for (var key in ACTIONS) {
        ACTION_KEYS.push(key);
        SHIFT_ACTION_KEYS.push("shift+" + key);
    }

    for (key in ENTRY_ACTIONS) {
        ENTRY_ACTION_KEYS.push(key);
    }

    CLIPBOARD_EVENTS[ACTION_KEYS] = "onAction";
    CLIPBOARD_EVENTS[SHIFT_ACTION_KEYS] = "onShiftAction";
    CLIPBOARD_EVENTS[ENTRY_ACTION_KEYS] = "onEntryAction";

    var Controller = kendo.Class.extend({
        init: function(view, workbook) {
            this.view = view;
            this.workbook(workbook);
            this.container = $(view.container);
            this.clipboardElement = $(view.clipboard);
            this.cellContextMenu = view.cellContextMenu;
            this.rowHeaderContextMenu = view.rowHeaderContextMenu;
            this.colHeaderContextMenu = view.colHeaderContextMenu;
            this.scroller = view.scroller;
            this.tabstrip = view.tabstrip;

            this.editor = view.editor;
            this.editor.bind("change", this.onEditorChange.bind(this));
            this.editor.bind("activate", this.onEditorActivate.bind(this));
            this.editor.bind("deactivate", this.onEditorDeactivate.bind(this));
            this.editor.bind("update", this.onEditorUpdate.bind(this));

            $(view.scroller).on("scroll", this.onScroll.bind(this));
            this.listener = new kendo.spreadsheet.EventListener(this.container, this, CONTAINER_EVENTS);
            this.keyListener = new kendo.spreadsheet.EventListener(this.clipboardElement, this, CLIPBOARD_EVENTS);

            this.barKeyListener = new kendo.spreadsheet.EventListener(this.editor.barElement(), this, FORMULABAR_EVENTS);
            this.inputKeyListener = new kendo.spreadsheet.EventListener(this.editor.cellElement(), this, FORMULAINPUT_EVENTS);

            view.sheetsbar.bind("select", this.onSheetBarSelect.bind(this));
            view.sheetsbar.bind("reorder", this.onSheetBarReorder.bind(this));
            view.sheetsbar.bind("rename", this.onSheetBarRename.bind(this));
            view.sheetsbar.bind("remove", this.onSheetBarRemove.bind(this));

            this.cellContextMenu.bind("select", this.onContextMenuSelect.bind(this));
            this.rowHeaderContextMenu.bind("select", this.onContextMenuSelect.bind(this));
            this.colHeaderContextMenu.bind("select", this.onContextMenuSelect.bind(this));

            // this is necessary for Windows to catch prevent context menu correctly
            this.cellContextMenu.element.add(this.rowHeaderContextMenu.element).add(this.colHeaderContextMenu.element).on("contextmenu", false);

            if (this.tabstrip) {
                this.tabstrip.bind("action", this.onCommandRequest.bind(this));
                this.tabstrip.bind("dialog", this.onDialogRequest.bind(this));
            }

            $(this.view.container).on("click", ".k-link.k-spreadsheet-filter", this.onFilterHeaderClick.bind(this));
        },

        _execute: function(command) {
            var result = this._workbook.execute(command);

            if (result) {
                this.view.showError(result);
            }
        },

        onContextMenuSelect: function(e) {
                var action = $(e.item).data("action");
                var command;
                switch(action) {
                    case "cut":
                        this.onCut();
                        break;
                    case "copy":
                        this.onCopy();
                        break;
                    case "paste":
                        this.onPaste();
                        break;
                    case "unmerge":
                        command = { command: "MergeCellCommand", options: { value: "unmerge" } };
                        break;
                    case "merge":
                        this.view.openDialog("merge");
                        break;
                    case "hide-row":
                        command = { command: "HideLineCommand", options: { axis: "row" } };
                        break;
                    case "hide-column":
                        command = { command: "HideLineCommand", options: { axis: "column" } };
                        break;
                    case "unhide-row":
                        command = { command: "UnHideLineCommand", options: { axis: "row" } };
                        break;
                    case "unhide-column":
                        command = { command: "UnHideLineCommand", options: { axis: "column" } };
                        break;
                    case "delete-row":
                        command = { command: "DeleteRowCommand" };
                        break;
                    case "delete-column":
                        command = { command: "DeleteColumnCommand" };
                        break;
                }

                if (command) {
                    this._execute(command);
                }
        },

        onSheetBarRemove: function(e) {
            var sheet = this._workbook.sheetByName(e.name);

            //TODO: move to model!
            if (!sheet) {
                return;
            }

            this._workbook.removeSheet(sheet);
        },

        destroy: function() {
            this.listener.destroy();
            this.keyListener.destroy();
            this.inputKeyListener.destroy();
        },

        onSheetBarSelect: function(e) {
            var sheet;
            var workbook = this._workbook;

            if (e.isAddButton) {
                sheet = workbook.insertSheet();
            } else {
                sheet = workbook.sheetByName(e.name);
            }

            //TODO: move to model
            if (workbook.activeSheet().name() !== sheet.name()) {
                workbook.activeSheet(sheet);
            }
        },

        onSheetBarReorder: function(e) {
            var sheet = this._workbook.sheetByIndex(e.oldIndex);

            this._workbook.moveSheetToIndex(sheet, e.newIndex);

            this._workbook.activeSheet(sheet);
        },

        onSheetBarRename: function(e) {
            var sheet = this._workbook.sheetByIndex(e.sheetIndex);

            this._workbook.renameSheet(sheet, e.name);

            this.clipboardElement.focus();
        },

        sheet: function(sheet) {
            this.navigator = sheet.navigator();
            this.axisManager = sheet.axisManager();
        },

        workbook: function(workbook) {
            this._workbook = workbook;
            this.clipboard = workbook.clipboard();
        },

        refresh: function() {
            var workbook = this._workbook;

            this._viewPortHeight = this.view.scroller.clientHeight;
            this.navigator.height(this._viewPortHeight);

            if (!this.editor.isActive()) {
                this.editor.value(workbook._inputForRef(workbook.activeSheet().activeCell()));
            }
        },

        onScroll: function() {
            this.view.render();
        },

        onWheel: function(event) {
            var deltaX = event.originalEvent.deltaX;
            var deltaY = event.originalEvent.deltaY;

            if (event.originalEvent.deltaMode === 1) {
                deltaX *= 10;
                deltaY *= 10;
            }

            this.scrollWith(deltaX, deltaY);

            event.preventDefault();
        },

        onAction: function(event, action) {
            this.navigator.moveActiveCell(ACTIONS[action]);
            event.preventDefault();
        },

        onPageUp: function() {
            this.scrollDown(-this._viewPortHeight);
        },

        onPageDown: function() {
            this.scrollDown(this._viewPortHeight);
        },

        onEntryAction: function(event, action) {
            if (event.mod) {
                var shouldPrevent = true;
                var key = String.fromCharCode(event.keyCode);

                switch(key) {
                    case "A":
                        this.navigator.selectAll();
                        break;
                    case "Y":
                        this._workbook.undoRedoStack.redo();
                        break;
                    case "Z":
                        this._workbook.undoRedoStack.undo();
                        break;
                    default:
                        shouldPrevent = false;
                        break;
                }
                if(shouldPrevent) {
                    event.preventDefault();
                }
            } else {
                if (action == "delete" || action == "backspace") {
                    this._execute({ command: "ClearContentCommand" });
                    event.preventDefault();
                }
                else if (action === ":alphanum" || action === ":edit") {
                    if (action === ":alphanum") {
                        this.editor.value("");
                    }

                    this.editor
                        .activate({ rect: this.view.activeCellRectangle() })
                        .focus();

                } else {
                    this.navigator.navigateInSelection(ENTRY_ACTIONS[action]);
                    event.preventDefault();
                }
            }
        },

        onShiftAction: function(event, action) {
            this.navigator.modifySelection(ACTIONS[action.replace("shift+", "")], this.appendSelection);
            event.preventDefault();
        },

        onMouseMove: function(event) {
            var sheet = this._workbook.activeSheet();

            if (sheet.resizingInProgress() || sheet.selectionInProgress()) {
                return;
            }

            var object = this.objectAt(event);
            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
                sheet.positionResizeHandle(object.ref);
            } else {
                sheet.removeResizeHandle();
            }
        },

        onMouseDown: function(event) {
            var object = this.objectAt(event);

            if (object.pane) {
                this.originFrame = object.pane;
            }

            if (this.editor.canInsertRef() && object.ref) {
                this.navigator.startSelection(object.ref, this._selectionMode, this.appendSelection);
                event.preventDefault();
                return;
            } else {
                this.editor.deactivate();
            }

            var sheet = this._workbook.activeSheet();
            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
                sheet.startResizing({ x: object.x, y: object.y });
                event.preventDefault();
                return;
            }

            this._selectionMode = SELECTION_MODES[object.type];
            this.appendSelection = event.mod;
            this.navigator.startSelection(object.ref, this._selectionMode, this.appendSelection);
        },

        onContextMenu: function(event) {
            var sheet = this._workbook.activeSheet();

            if (sheet.resizingInProgress()) {
                return;
            }

            event.preventDefault();

            this.cellContextMenu.close();
            this.colHeaderContextMenu.close();
            this.rowHeaderContextMenu.close();

            var menu;

            var location = { pageX: event.pageX, pageY: event.pageY };

            var object = this.objectAt(location);

            if (object.type === "columnresizehandle" || object.type === "rowresizehandle") {
                return;
            }

            this.navigator.selectForContextMenu(object.ref, SELECTION_MODES[object.type]);

            var isComposite = this.navigator._sheet.select() instanceof kendo.spreadsheet.UnionRef;
            var showUnhide = false;
            var showUnmerge = false;

            if (object.type === "cell") {
                menu = this.cellContextMenu;
                showUnmerge = this.navigator.selectionIncludesMergedCells();
            } else if (object.type == "columnheader") {
                menu = this.colHeaderContextMenu;
                showUnhide = !isComposite && this.axisManager.selectionIncludesHiddenColumns();
            } else if (object.type == "rowheader") {
                menu = this.rowHeaderContextMenu;
                showUnhide = !isComposite && this.axisManager.selectionIncludesHiddenRows();
            }

            menu.element.find(COMPOSITE_UNAVAILABLE_ACTION_SELECTORS).toggle(!isComposite);
            menu.element.find(UNHIDE_ACTION_SELECTORS).toggle(showUnhide);
            menu.element.find('[data-action=unmerge]').toggle(showUnmerge);

            // avoid the immediate close
            setTimeout(function() {
                menu.open(event.pageX, event.pageY);
            });
        },

        prevent: function(event) {
            event.preventDefault();
        },

        constrainResize: function(type, ref) {
            var sheet = this._workbook.activeSheet();
            var resizeHandle = sheet.resizeHandlePosition();

            return !resizeHandle || type === "outside" || type === "topcorner" || ref.col < resizeHandle.col || ref.row < resizeHandle.row;
        },

        onMouseDrag: function(event) {
            if (this._selectionMode === "sheet") {
                return;
            }

            var location = { pageX: event.pageX, pageY: event.pageY };
            var object = this.objectAt(location);

            var sheet = this._workbook.activeSheet();
            if (sheet.resizingInProgress()) {

                if (!this.constrainResize(object.type, object.ref)) {
                    sheet.resizeHintPosition({ x: object.x, y: object.y });
                }

                return;
            }

            if (object.type === "outside") {
                this.startAutoScroll(object);
                return;
            }

            if (this.originFrame === object.pane) {
                this.selectToLocation(location);
            } else { // cross frame selection
                var frame = this.originFrame._grid;

                if (object.x > frame.right) {
                    this.scrollLeft();
                }

                if (object.y > frame.bottom) {
                    this.scrollTop();
                }

                if (object.y < frame.top || object.x < frame.left) {
                    this.startAutoScroll(object, location);
                } else {
                    this.selectToLocation(location);
                }
            }

            event.preventDefault();
        },

        onMouseUp: function(event) {
            var sheet = this._workbook.activeSheet();
            sheet.completeResizing();

            this.navigator.completeSelection();
            this.stopAutoScroll();

            var editor = this.editor.activeEditor();
            if (!editor) {
                return;
            }
            var el = event.target;
            while (el) {
                if (el === editor.element[0]) {
                    return;
                }
                el = el.parentNode;
            }

            var object = this.objectAt(event);
            if (object && object.ref && editor.canInsertRef()) {
                editor.refAtPoint(sheet.selection()._ref);
                sheet._setFormulaSelections(editor.highlightTokens());
            }
        },

        onDblClick: function(event) {
            var object = this.objectAt(event);

            if (object.type !== "cell") {
                return;
            }

            this.editor
                .activate({ rect: this.view.activeCellRectangle() })
                .focus();
        },

        onCut: function() {
            this._execute({
                command: "CutCommand",
                options: { workbook: this.view._workbook }
            });
        },

        clipBoardValue: function() {
            return this.clipboardElement.html();
        },

        onPaste: function(e) {
            var html = "";
            var plain = "";
            if(e) {
                if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
                    e.preventDefault();
                    if (/text\/html/.test(e.originalEvent.clipboardData.types)) {
                        html = e.originalEvent.clipboardData.getData('text/html');
                    }
                    if (/text\/plain/.test(e.originalEvent.clipboardData.types)) {
                        plain = e.originalEvent.clipboardData.getData('text/plain');
                    }
                } else {
                    //workaround for IE's lack of access to the HTML clipboard data
                    var table = this.clipboardElement.find("table.kendo-clipboard").detach();
                    this.clipboardElement.empty();
                    setTimeout(function() {
                        this.clipboard.external({html: this.clipboardElement.html(), plain: window.clipboardData.getData("Text")});
                        this.clipboardElement.empty().append(table);
                        this._execute({
                            command: "PasteCommand",
                            options: { workbook: this.view._workbook }
                        });
                    }.bind(this));

                    return;
                }

            } else {
                if(kendo.support.browser.msie) {
                    this.clipboardElement.focus().select();
                    document.execCommand('paste');
                    return;
                } else {
                    window.alert("todo: add dialog \n use ctrl+v instead");
                    return;
                }
            }

            this.clipboard.external({html: html, plain:plain});
            this._execute({
                command: "PasteCommand",
                options: { workbook: this.view._workbook }
            });

        },

        onCopy: function() {
            this._execute({
                command: "CopyCommand",
                options: { workbook: this.view._workbook }
            });
        },

////////////////////////////////////////////////////////////////////

        scrollTop: function() {
            this.scroller.scrollTop = 0;
        },

        scrollLeft: function() {
            this.scroller.scrollLeft = 0;
        },

        scrollDown: function(value) {
            this.scroller.scrollTop += value;
        },

        scrollRight: function(value) {
            this.scroller.scrollLeft += value;
        },

        scrollWith: function(right, down) {
            this.scroller.scrollTop += down;
            this.scroller.scrollLeft += right;
        },

        objectAt: function(location) {
            var offset = this.container.offset();
            var coordinates = {
                left: location.pageX - offset.left,
                top: location.pageY - offset.top
            };

            return this.view.objectAt(coordinates.left, coordinates.top);
        },

        selectToLocation: function(cellLocation) {
            var object = this.objectAt(cellLocation);

            if (object.pane) { // cell, rowheader or columnheader
                this.extendSelection(object);
                this.lastKnownCellLocation = cellLocation;
                this.originFrame = object.pane;
            }

            this.stopAutoScroll();
        },

        extendSelection: function(object) {
            this.navigator.extendSelection(object.ref, this._selectionMode, this.appendSelection);
        },

        autoScroll: function() {
            var x = this._autoScrollTarget.x;
            var y = this._autoScrollTarget.y;
            var boundaries = this.originFrame._grid;
            var scroller = this.view.scroller;
            var scrollStep = 8;

            var scrollLeft = scroller.scrollLeft;
            var scrollTop = scroller.scrollTop;

            if (x < boundaries.left) {
                this.scrollRight(-scrollStep);
            }
            if (x > boundaries.right) {
                this.scrollRight(scrollStep);
            }
            if (y < boundaries.top) {
                this.scrollDown(-scrollStep);
            }
            if (y > boundaries.bottom) {
                this.scrollDown(scrollStep);
            }

            if (scrollTop === scroller.scrollTop && scrollLeft === scroller.scrollLeft) {
                this.selectToLocation(this.finalLocation);
            } else {
                this.extendSelection(this.objectAt(this.lastKnownCellLocation));
            }
        },

        startAutoScroll: function(viewObject, location) {
            if (!this._scrollInterval) {
                this._scrollInterval = setInterval(this.autoScroll.bind(this), 50);
            }

            this.finalLocation = location || this.lastKnownCellLocation;

            this._autoScrollTarget = viewObject;
        },

        stopAutoScroll: function() {
            clearInterval(this._scrollInterval);
            this._scrollInterval = null;
        },

////////////////////////////////////////////////////////////////////

        _parseRefs: function(value) {
            var refs = [];
            var sheetName = this._workbook.activeSheet().name().toLowerCase();
            if (/^=/.test(value)) {
                var tokens = kendo.spreadsheet.calc.tokenize(value || "");
                var idx = 0;
                tokens.forEach(function(token) {
                    if (token.type === "ref") {
                        var ref = token.ref;
                        if (!ref.sheet || ref.sheet.toLowerCase() == sheetName) {
                            ref.sheet = null;
                            refs.push({
                                ref: ref,
                                color: (idx++) % 6
                            });
                        }
                    }
                });
            }
            return refs;
        },

        onEditorChange: function(e) {
            this._workbook.activeSheet()._edit(false);

            this._execute({
                command: "EditCommand",
                options: {
                    value: e.value
                }
            });
        },

        onEditorActivate: function() {
            var workbook = this._workbook;
            var sheet = workbook.activeSheet();

            sheet._setFormulaSelections(this.editor.highlightTokens());
            sheet._edit(true);
        },

        onEditorDeactivate: function() {
            var sheet = this._workbook.activeSheet();

            sheet._edit(false);
            sheet._setFormulaSelections([]);
        },

        onEditorUpdate: function(e) {
            this._workbook.activeSheet()._setFormulaSelections(this.editor.highlightTokens());
        },

        onEditorBarFocus: function() {
            this.editor.activate({ rect: this.view.activeCellRectangle() });
        },

        onEditorCellFocus: function() {
            this.editor.scale();
        },

        onEditorEsc: function() {
            this.editor.value(this._workbook._inputForRef(this._workbook.activeSheet().activeCell()));
            this.editor.deactivate();

            this.clipboardElement.focus();
        },

        onEditorBlur: function(_, action) {
            if (this.editor.isFiltered()) {
                return;
            }

            this.editor.deactivate();
            this.clipboardElement.focus();

            this.navigator.navigateInSelection(ENTRY_ACTIONS[action]);
        },

        onFilterHeaderClick: function(e) {
            var target = $(e.currentTarget);
            var filterMenu = this.view.createFilterMenu(target.data("column"));

            filterMenu.bind("action", this.onCommandRequest.bind(this));

            filterMenu.openFor(target);
        },

        onCommandRequest: function(e) {
            if (e.command) {
                this._execute(e);
            } else {
                this._workbook.undoRedoStack[e.action]();
            }
        },

        onDialogRequest: function(e) {
            this.view.openDialog(e.name, e.options);
        }
    });

    kendo.spreadsheet.Controller = Controller;
})(window.kendo);

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
