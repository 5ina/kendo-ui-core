using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Mvc.UI
{
    /// <summary>
    /// Kendo UI ChartSeriesLabelsSettings class
    /// </summary>
    public partial class ChartSeriesLabelsSettings<T> where T : class 
    {
        public string Align { get; set; }

        public string Background { get; set; }

        public ChartSeriesLabelsBorderSettings<T> Border { get; } = new ChartSeriesLabelsBorderSettings<T>();

        public string Color { get; set; }

        public double? Distance { get; set; }

        public string Font { get; set; }

        public string Format { get; set; }

        public ChartSeriesLabelsMarginSettings<T> Margin { get; } = new ChartSeriesLabelsMarginSettings<T>();

        public ChartSeriesLabelsPaddingSettings<T> Padding { get; } = new ChartSeriesLabelsPaddingSettings<T>();

        public string Position { get; set; }

        public string Template { get; set; }

        public string TemplateId { get; set; }

        public bool? Visible { get; set; }

        public ClientHandlerDescriptor Visual { get; set; }

        public ChartSeriesLabelsFromSettings<T> From { get; } = new ChartSeriesLabelsFromSettings<T>();

        public ChartSeriesLabelsToSettings<T> To { get; } = new ChartSeriesLabelsToSettings<T>();


        public Chart<T> Chart { get; set; }

        protected Dictionary<string, object> SerializeSettings()
        {
            var settings = new Dictionary<string, object>();

            if (Align?.HasValue() == true)
            {
                settings["align"] = Align;
            }

            if (Background?.HasValue() == true)
            {
                settings["background"] = Background;
            }

            var border = Border.Serialize();
            if (border.Any())
            {
                settings["border"] = border;
            }

            if (Color?.HasValue() == true)
            {
                settings["color"] = Color;
            }

            if (Distance.HasValue)
            {
                settings["distance"] = Distance;
            }

            if (Font?.HasValue() == true)
            {
                settings["font"] = Font;
            }

            if (Format?.HasValue() == true)
            {
                settings["format"] = Format;
            }

            var margin = Margin.Serialize();
            if (margin.Any())
            {
                settings["margin"] = margin;
            }

            var padding = Padding.Serialize();
            if (padding.Any())
            {
                settings["padding"] = padding;
            }

            if (Position?.HasValue() == true)
            {
                settings["position"] = Position;
            }

            if (TemplateId.HasValue())
            {
                settings["template"] = new ClientHandlerDescriptor {
                    HandlerName = string.Format(
                        "jQuery('{0}{1}').html()", Chart.IdPrefix, TemplateId
                    )
                };
            }
            else if (Template.HasValue())
            {
                settings["template"] = Template;
            }

            if (Visible.HasValue)
            {
                settings["visible"] = Visible;
            }

            if (Visual?.HasValue() == true)
            {
                settings["visual"] = Visual;
            }

            var from = From.Serialize();
            if (from.Any())
            {
                settings["from"] = from;
            }

            var to = To.Serialize();
            if (to.Any())
            {
                settings["to"] = to;
            }

            return settings;
        }
    }
}
