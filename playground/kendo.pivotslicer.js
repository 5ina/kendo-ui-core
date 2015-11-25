(function($, undefined) {
    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;
    var LIST_HTML = '<div class="k-fieldselector k-list-container k-reset"><ul class="k-pivot-configurator-settings k-list k-reset k-pivot-setting"/></div>';

    var PivotSlicer = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            this.dataSource = this.options.dataSource;

            if (!this.dataSource) {
                throw new Error("PivotDataSource instance is required");
            }

            this.itemTemplate = kendo.template(this.options.itemTemplate);

            this._setSettings();

            this._lists();

            this.refresh();
        },

        options: {
            name: "PivotSlicer",
            itemTemplate: '<li class="#:className#" data-idx="#:idx#">#: name #</li>',
            mergeChildren: false
        },

        _setSettings: function() {
            var columns = this.dataSource.columns().slice();
            var rows = this.dataSource.rows().slice();

            this.columns = isExpanded(columns) ? [{ name: getName(columns), settings: columns }] : [];
            this.rows = isExpanded(rows) ? [{ name: getName(rows), settings: rows }] : [];
        },

        setDataSource: function(source) {
            this.dataSource = source;
            this._setSettings();
            this.refresh();
        },

        push: function(axis, path) {
            var settings = this.dataSource[axis]();
            var length = path.length - 1;

            if (this.options.mergeChildren && length > 0) {
                return false;
            }

            for (var idx = 0; idx <= length; idx++) {
                settings[idx] = {
                    expand: idx === length,
                    name: [path[idx]]
                };
            }

            this[axis].push({
                name: JSON.stringify(path),
                settings: settings
            });

            this.update(axis, settings);

            return true;
        },

        pop: function(axis, idx) {
            var axisState = this[axis][idx];

            this[axis] = this[axis].slice(0, idx + 1);

            if (axisState) {
                this.update(axis, axisState.settings);
            }
        },

        update: function(axis, settings) {
            this.dataSource[axis](settings);
            this.refresh();
        },

        refresh: function() {
            this.columnsList.html(this._buildHtml(this.columns));
            this.rowsList.html(this._buildHtml(this.rows));
        },

        _lists: function() {
            this.element.append("<h4>Columns:</h4>");
            this.columnsList = $(LIST_HTML).appendTo(this.element).children("ul");

            this.element.append("<h4>Rows:</h4>");
            this.rowsList = $(LIST_HTML).appendTo(this.element).children("ul");

            this.columnsList.on("click", "li:not(.k-state-selected)", (function(e) {
                var idx = $(e.currentTarget).data("idx");

                this.pop("columns", idx);
            }).bind(this));

            this.rowsList.on("click", "li:not(.k-state-selected)", (function(e) {
                var idx = $(e.currentTarget).data("idx");

                this.pop("rows", idx);
            }).bind(this));

            this.columnsList.add(this.rowsList)
                .on("mouseenter mouseleave", "li", this._toggleHover);
        },

        _toggleHover: function(e) {
            $(e.currentTarget).toggleClass("k-state-hover", e.type === "mouseenter");
        },

        _buildHtml: function(list) {
            var html = "";
            var length = list.length;

            for (var idx = 0; idx < length; idx++) {
                var className = "k-item k-header" + (idx === (length - 1) ? " k-state-selected" : "");

                html += this.itemTemplate({
                    idx: idx,
                    name: list[idx].name,
                    className: className
                });
            }

            return html;
        }
    });

    function isExpanded(settings) {
        for (var idx = 0; idx < settings.length; idx++) {
            if (settings[idx].expand) {
                return true;
            }
        }
        return false;
    }

    function getName(settings) {
        var name = [];
        for (var idx = 0; idx < settings.length; idx++) {
            if (settings[idx].expand) {
                name.push(settings[idx].name);
            }
        }

        return JSON.stringify(name);
    }

    kendo.ui.plugin(PivotSlicer);
})(window.kendo.jQuery);
