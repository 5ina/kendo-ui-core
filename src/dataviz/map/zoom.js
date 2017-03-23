(function(f, define){
    define([ "../../kendo.core" ], f);
})(function(){

(function ($) {
    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;
    var keys = kendo.keys;
    var proxy = $.proxy;

    // Helper functions =======================================================
    function button(dir, iconClass) {
       return kendo.format(
           '<button class="k-button k-zoom-{0}" title="zoom-{0}" aria-label="zoom-{0}"><span class="k-icon {1}"></span></button>',
           dir, iconClass);
    }

    var NS = ".kendoZoomControl";
    var BUTTONS = button("in", "k-i-plus") + button("out", "k-i-minus");

    var PLUS = 187;
    var MINUS = 189;
    var FF_PLUS = 61;
    var FF_MINUS = 173;


    var ZoomControl = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);
            this._initOptions(options);

            this.element.addClass("k-widget k-zoom-control k-button-wrap k-buttons-horizontal k-button-group k-group-horizontal")
                        .append(BUTTONS)
                        .on("click" + NS, ".k-button", proxy(this, "_click"));

            var parentElement = this.element.parent().closest("[" + kendo.attr("role") + "]");
            this._keyroot = parentElement.length > 0 ? parentElement : this.element;

            this._tabindex(this._keyroot);

            this._keydown = proxy(this._keydown, this);
            this._keyroot.on("keydown", this._keydown);
        },

        options: {
            name: "ZoomControl",
            zoomStep: 1
        },

        events: [
            "change"
        ],

        _change: function(dir) {
            var zoomStep = this.options.zoomStep;
            this.trigger("change", {
                delta: dir * zoomStep
            });
        },

        _click: function(e) {
            var button = $(e.currentTarget);
            var dir = 1;

            if (button.is(".k-zoom-out")) {
                dir = -1;
            }

            this._change(dir);
            e.preventDefault();
        },

        _keydown: function(e) {
            switch (e.which) {
                case keys.NUMPAD_PLUS:
                case PLUS:
                case FF_PLUS:
                    this._change(1);
                    break;

                case keys.NUMPAD_MINUS:
                case MINUS:
                case FF_MINUS:
                    this._change(-1);
                    break;
            }
        }
    });


    // Exports ================================================================
    kendo.dataviz.ui.plugin(ZoomControl);

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
