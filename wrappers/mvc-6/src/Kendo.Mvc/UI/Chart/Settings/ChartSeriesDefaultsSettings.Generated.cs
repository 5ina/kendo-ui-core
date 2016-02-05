using System.Collections.Generic;
using System.Linq;

namespace Kendo.Mvc.UI
{
    /// <summary>
    /// Defines the Chart series defaults settings
    /// </summary>
    public partial class ChartSeriesDefaultsSettings
    {
        /// <summary>
        /// The Area series default settings.
        /// </summary>
        public ChartSeries Area { get; } = new ChartSeries();

        /// <summary>
        /// The Bar series default settings.
        /// </summary>
        public ChartSeries Bar { get; } = new ChartSeries();

        /// <summary>
        /// The Column series default settings.
        /// </summary>
        public ChartSeries Column { get; } = new ChartSeries();

        /// <summary>
        /// The Line series default settings.
        /// </summary>
        public ChartSeries Line { get; } = new ChartSeries();

        /// <summary>
        /// The VerticalArea series default settings.
        /// </summary>
        public ChartSeries VerticalArea { get; } = new ChartSeries();

        /// <summary>
        /// The VerticalLine series default settings.
        /// </summary>
        public ChartSeries VerticalLine { get; } = new ChartSeries();

        /// <summary>
        /// The RadarArea series default settings.
        /// </summary>
        public ChartSeries RadarArea { get; } = new ChartSeries();

        /// <summary>
        /// The RadarColumn series default settings.
        /// </summary>
        public ChartSeries RadarColumn { get; } = new ChartSeries();

        /// <summary>
        /// The RadarLine series default settings.
        /// </summary>
        public ChartSeries RadarLine { get; } = new ChartSeries();

        /// <summary>
        /// The BoxPlot series default settings.
        /// </summary>
        public ChartSeries BoxPlot { get; } = new ChartSeries();

        /// <summary>
        /// The Bubble series default settings.
        /// </summary>
        public ChartSeries Bubble { get; } = new ChartSeries();

        /// <summary>
        /// The Bullet series default settings.
        /// </summary>
        public ChartSeries Bullet { get; } = new ChartSeries();

        /// <summary>
        /// The VerticalBullet series default settings.
        /// </summary>
        public ChartSeries VerticalBullet { get; } = new ChartSeries();

        /// <summary>
        /// The Candlestick series default settings.
        /// </summary>
        public ChartSeries Candlestick { get; } = new ChartSeries();

        /// <summary>
        /// The OHLC series default settings.
        /// </summary>
        public ChartSeries OHLC { get; } = new ChartSeries();

        /// <summary>
        /// The Funnel series default settings.
        /// </summary>
        public ChartSeries Funnel { get; } = new ChartSeries();

        /// <summary>
        /// The RangeColumn series default settings.
        /// </summary>
        public ChartSeries RangeColumn { get; } = new ChartSeries();

        /// <summary>
        /// The RangeBar series default settings.
        /// </summary>
        public ChartSeries RangeBar { get; } = new ChartSeries();

        /// <summary>
        /// The Pie series default settings.
        /// </summary>
        public ChartSeries Pie { get; } = new ChartSeries();

        /// <summary>
        /// The Donut series default settings.
        /// </summary>
        public ChartSeries Donut { get; } = new ChartSeries();

        /// <summary>
        /// The Scatter series default settings.
        /// </summary>
        public ChartSeries Scatter { get; } = new ChartSeries();

        /// <summary>
        /// The ScatterLine series default settings.
        /// </summary>
        public ChartSeries ScatterLine { get; } = new ChartSeries();

        /// <summary>
        /// The PolarArea series default settings.
        /// </summary>
        public ChartSeries PolarArea { get; } = new ChartSeries();

        /// <summary>
        /// The PolarLine series default settings.
        /// </summary>
        public ChartSeries PolarLine { get; } = new ChartSeries();

        /// <summary>
        /// The PolarScatter series default settings.
        /// </summary>
        public ChartSeries PolarScatter { get; } = new ChartSeries();

        /// <summary>
        /// The Waterfall series default settings.
        /// </summary>
        public ChartSeries Waterfall { get; } = new ChartSeries();

        /// <summary>
        /// The HorizontalWaterfall series default settings.
        /// </summary>
        public ChartSeries HorizontalWaterfall { get; } = new ChartSeries();


        public IDictionary<string, object> Serialize()
        {
            var settings = new Dictionary<string, object>();

            var area = Area.Serialize();
            if (area.Any())
            {
                settings["area"] = area;
            }

            var bar = Bar.Serialize();
            if (bar.Any())
            {
                settings["bar"] = bar;
            }

            var column = Column.Serialize();
            if (column.Any())
            {
                settings["column"] = column;
            }

            var line = Line.Serialize();
            if (line.Any())
            {
                settings["line"] = line;
            }

            var verticalArea = VerticalArea.Serialize();
            if (verticalArea.Any())
            {
                settings["verticalArea"] = verticalArea;
            }

            var verticalLine = VerticalLine.Serialize();
            if (verticalLine.Any())
            {
                settings["verticalLine"] = verticalLine;
            }

            var radarArea = RadarArea.Serialize();
            if (radarArea.Any())
            {
                settings["radarArea"] = radarArea;
            }

            var radarColumn = RadarColumn.Serialize();
            if (radarColumn.Any())
            {
                settings["radarColumn"] = radarColumn;
            }

            var radarLine = RadarLine.Serialize();
            if (radarLine.Any())
            {
                settings["radarLine"] = radarLine;
            }

            var boxPlot = BoxPlot.Serialize();
            if (boxPlot.Any())
            {
                settings["boxPlot"] = boxPlot;
            }

            var bubble = Bubble.Serialize();
            if (bubble.Any())
            {
                settings["bubble"] = bubble;
            }

            var bullet = Bullet.Serialize();
            if (bullet.Any())
            {
                settings["bullet"] = bullet;
            }

            var verticalBullet = VerticalBullet.Serialize();
            if (verticalBullet.Any())
            {
                settings["verticalBullet"] = verticalBullet;
            }

            var candlestick = Candlestick.Serialize();
            if (candlestick.Any())
            {
                settings["candlestick"] = candlestick;
            }

            var oHLC = OHLC.Serialize();
            if (oHLC.Any())
            {
                settings["oHLC"] = oHLC;
            }

            var funnel = Funnel.Serialize();
            if (funnel.Any())
            {
                settings["funnel"] = funnel;
            }

            var rangeColumn = RangeColumn.Serialize();
            if (rangeColumn.Any())
            {
                settings["rangeColumn"] = rangeColumn;
            }

            var rangeBar = RangeBar.Serialize();
            if (rangeBar.Any())
            {
                settings["rangeBar"] = rangeBar;
            }

            var pie = Pie.Serialize();
            if (pie.Any())
            {
                settings["pie"] = pie;
            }

            var donut = Donut.Serialize();
            if (donut.Any())
            {
                settings["donut"] = donut;
            }

            var scatter = Scatter.Serialize();
            if (scatter.Any())
            {
                settings["scatter"] = scatter;
            }

            var scatterLine = ScatterLine.Serialize();
            if (scatterLine.Any())
            {
                settings["scatterLine"] = scatterLine;
            }

            var polarArea = PolarArea.Serialize();
            if (polarArea.Any())
            {
                settings["polarArea"] = polarArea;
            }

            var polarLine = PolarLine.Serialize();
            if (polarLine.Any())
            {
                settings["polarLine"] = polarLine;
            }

            var polarScatter = PolarScatter.Serialize();
            if (polarScatter.Any())
            {
                settings["polarScatter"] = polarScatter;
            }

            var waterfall = Waterfall.Serialize();
            if (waterfall.Any())
            {
                settings["waterfall"] = waterfall;
            }

            var horizontalWaterfall = HorizontalWaterfall.Serialize();
            if (horizontalWaterfall.Any())
            {
                settings["horizontalWaterfall"] = horizontalWaterfall;
            }


            return settings;
        }
    }
}
