(function(f, define){
    define([ "../kendo.core" ], f);
})(function(){

(function(kendo) {
    if (kendo.support.browser.msie && kendo.support.browser.version < 9) {
        return;
    }

    var $ = kendo.jQuery;

    var CLASS_NAMES = {
        input: "k-spreadsheet-name-editor",
        list: "k-spreadsheet-name-list"
    };

    var NameEditor = kendo.ui.Widget.extend({
        init: function(element, options) {
            kendo.ui.Widget.call(this, element, options);
            element.addClass(CLASS_NAMES.input);

            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(options) {
                        var data = [];
                        this._workbook.forEachName(function(def){
                            if (!def.hidden && def.value instanceof kendo.spreadsheet.Ref) {
                                data.push({ name: def.name });
                            }
                        });
                        options.success(data);
                    }.bind(this),
                    cache: false
                }
            });

            this.combo = $("<input />").appendTo(element)
                .kendoComboBox({
                    clearButton: false,
                    dataTextField: "name",
                    dataValueField: "name",
                    template: "#:data.name#<a class='k-button-delete' href='\\#'><span class='k-icon k-i-close'></span></a>",
                    dataSource: dataSource,
                    autoBind: false,
                    ignoreCase: true,
                    change: this._on_listChange.bind(this),
                    open: function() {
                        dataSource.read();
                    }
                }).getKendoComboBox();

            this.combo.input
                .on("keydown", this._on_keyDown.bind(this))
                .on("focus", this._on_focus.bind(this));

            this.combo.popup.element
                .addClass("k-spreadsheet-names-popup")
                .on("click", ".k-button-delete", function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    var item = $(ev.target).closest(".k-item");
                    item = this.combo.dataItem(item);
                    this._deleteItem(item.name);
                }.bind(this));
        },
        value: function(val) {
            if (val === undefined) {
                return this.combo.value();
            } else {
                this.combo.value(val);
            }
        },
        _deleteItem: function(name) {
            this.trigger("delete", { name: name });
        },
        _on_keyDown: function(ev) {
            switch (ev.keyCode) {
              case 27:
                this.combo.value(this._prevValue);
                this.trigger("cancel");
                break;
              case 13:
                this.trigger("enter");
                break;
            }
        },
        _on_focus: function() {
            this._prevValue = this.combo.value();
        },
        _on_listChange: function() {
            var name = this.combo.value();
            if (name) {
                this.trigger("select", { name: name });
            }
        }
    });

    kendo.spreadsheet.NameEditor = NameEditor;
})(window.kendo);
}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
