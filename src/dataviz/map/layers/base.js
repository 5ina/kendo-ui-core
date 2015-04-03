(function(f, define){
    define([ "../../../kendo.core", "../location" ], f);
})(function(){

(function ($, undefined) {
    // Imports ================================================================
    var proxy = $.proxy,
        noop = $.noop,

        kendo = window.kendo,
        Class = kendo.Class,

        dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,

        Extent = dataviz.map.Extent,

        geom = kendo.geometry,
        draw = kendo.drawing,
        util = kendo.util,
        defined = util.defined,
        valueOrDefault = util.valueOrDefault;

    // Implementation =========================================================
    var Layer = Class.extend({
        init: function(map, options) {
            this._initOptions(options);
            this.map = map;

            this.element = $("<div class='k-layer'></div>")
               .css({
                   "zIndex": this.options.zIndex,
                   "opacity": this.options.opacity
               })
               .appendTo(map.scrollElement);

            this._beforeReset = proxy(this._beforeReset, this);
            this._reset = proxy(this._reset, this);
            this._resize = proxy(this._resize, this);
            this._panEnd = proxy(this._panEnd, this);
            this._activate();

            this._updateAttribution();
        },

        destroy: function() {
            this._deactivate();
        },

        show: function() {
            this.reset();
            this._activate();
            this._applyExtent(true);
        },

        hide: function() {
            this._deactivate();
            this._setVisibility(false);
        },

        reset: function() {
            this._beforeReset();
            this._reset();
        },

        exportVisual: function() {
            var scroller = this.map.scroller;
            var size = [scroller.element.width(), scroller.element.height()];

            var clipRect = new geom.Rect([0, 0], size);
            var clipRoot = new draw.Group({
                clip: draw.Path.fromRect(clipRect)
            });

            var root = new draw.Group({
                transform: geom.transform()
                               .translate(-scroller.scrollLeft, -scroller.scrollRight)
            });

            clipRoot.append(root);
            draw.drawDOM(this.element).done(function(dom) {
                root.append(dom);
            });

            return clipRoot;
        },

        _reset: function() {
            this._applyExtent();
        },

        _beforeReset: $.noop,

        _resize: $.noop,

        _panEnd: function() {
            this._applyExtent();
        },

        _applyExtent: function() {
            var options = this.options;

            var zoom = this.map.zoom();
            var matchMinZoom = !defined(options.minZoom) || zoom >= options.minZoom;
            var matchMaxZoom = !defined(options.maxZoom) || zoom <= options.maxZoom;

            var extent = Extent.create(options.extent);
            var inside = !extent || extent.overlaps(this.map.extent());

            this._setVisibility(matchMinZoom && matchMaxZoom && inside);
        },

        _setVisibility: function(visible) {
            this.element.css("display", visible ? "" : "none");
        },

        _activate: function() {
            var map = this.map;
            map.bind("beforeReset", this._beforeReset);
            map.bind("reset", this._reset);
            map.bind("resize", this._resize);
            map.bind("panEnd", this._panEnd);
        },

        _deactivate: function() {
            var map = this.map;
            map.unbind("beforeReset", this._beforeReset);
            map.unbind("reset", this._reset);
            map.unbind("resize", this._resize);
            map.unbind("panEnd", this._panEnd);
        },

        _updateAttribution: function() {
            var attr = this.map.attribution;

            if (attr) {
                attr.add(this.options.attribution);
            }
        }
    });

    // Exports ================================================================
    deepExtend(dataviz, {
        map: {
            layers: {
                Layer: Layer
            }
        }
    });

})(window.kendo.jQuery);

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
