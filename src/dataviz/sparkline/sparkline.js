(function(f, define){
    define([
        "./kendo-sparkline"
    ], f);
})(function(){

(function () {

var dataviz = kendo.dataviz;
var Chart = dataviz.ui.Chart;
var KendoSparkline = dataviz.Sparkline;
var ChartInstanceObserver = dataviz.ChartInstanceObserver;

var Sparkline = Chart.extend({

    init: function(element, userOptions) {
        var options = userOptions;
        if (options instanceof kendo.data.ObservableArray) {
            options = { seriesDefaults: { data: options } };
        }

        Chart.fn.init.call(this, element, KendoSparkline.normalizeOptions(options));
    },

    _createChart: function(options, themeOptions) {
        this._instance = new KendoSparkline(this.element[0], options, themeOptions, {
            observer: new ChartInstanceObserver(this),
            sender: this
        });
    },

    _createTooltip: function() {
        return new SparklineTooltip(this.element, this.options.tooltip);
    },

    options: {
        name: "Sparkline",
        chartArea: {
            margin: 2
        },
        axisDefaults: {
            visible: false,
            majorGridLines: {
                visible: false
            },
            valueAxis: {
                narrowRange: true
            }
        },
        seriesDefaults: {
            type: "line",
            area: {
                line: {
                    width: 0.5
                }
            },
            bar: {
                stack: true
            },
            padding: 2,
            width: 0.5,
            overlay: {
                gradient: null
            },
            highlight: {
                visible: false
            },
            border: {
                width: 0
            },
            markers: {
                size: 2,
                visible: false
            }
        },
        tooltip: {
            visible: true,
            shared: true
        },
        categoryAxis: {
            crosshair: {
                visible: true,
                tooltip: {
                    visible: false
                }
            }
        },
        legend: {
            visible: false
        },
        transitions: false,

        pointWidth: 5,

        panes: [{
            clip: false
        }]
    }
});

dataviz.ui.plugin(Sparkline);

var SparklineTooltip = dataviz.Tooltip.extend({
    options: {
        animation: {
            duration: 0
        }
    },

    _hideElement: function() {
        if (this.element) {
            this.element.hide().remove();
        }
    }
});

dataviz.SparklineTooltip = SparklineTooltip;

})();

}, typeof define == 'function' && define.amd ? define : function(a1, a2, a3){ (a3 || a2)(); });
