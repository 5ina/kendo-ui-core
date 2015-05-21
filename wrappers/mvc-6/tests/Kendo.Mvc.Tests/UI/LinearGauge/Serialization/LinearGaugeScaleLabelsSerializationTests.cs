﻿namespace Kendo.Mvc.UI.Tests
{
    using System.Collections.Generic;
    using Xunit;

    public class LinearGaugeScaleLabelsSerializationTests
    {
        private readonly LinearGaugeScaleLabelsSettings labels;

        public LinearGaugeScaleLabelsSerializationTests()
        {
            labels = new LinearGaugeScaleLabelsSettings();
        }

        [Fact]
        public void Serializes_font()
        {
            labels.Font = "Font";
            GetJson()["font"].ShouldEqual("Font");
        }

        [Fact]
        public void Does_not_serialize_default_font()
        {
            GetJson().ContainsKey("font").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_template()
        {
            labels.Template = "<# customerID #>";
            GetJson()["template"].ShouldEqual("<# customerID #>");
        }

        [Fact]
        public void Does_not_serialize_default_template()
        {
            GetJson().ContainsKey("template").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_visible()
        {
            labels.Visible = true;
            GetJson()["visible"].ShouldEqual(true);
        }

        [Fact]
        public void Does_not_serialize_default_visible()
        {
            GetJson().ContainsKey("visible").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_background()
        {
            labels.Background = "Red";
            GetJson()["background"].ShouldEqual("Red");
        }

        [Fact]
        public void Does_not_serialize_default_background()
        {
            GetJson().ContainsKey("background").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_format()
        {
            labels.Format = "{0:C}";
            GetJson()["format"].ShouldEqual("{0:C}");
        }

        [Fact]
        public void Does_not_serialize_default_format()
        {
            GetJson().ContainsKey("format").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_color()
        {
            labels.Color = "Red";
            GetJson()["color"].ShouldEqual("Red");
        }

        [Fact]
        public void Does_not_serialize_default_color()
        {
            GetJson().ContainsKey("color").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_margin()
        {
            labels.Margin.Top = 20;
            GetJson().ContainsKey("margin").ShouldBeTrue();
        }

        [Fact]
        public void Does_not_serialize_default_margin()
        {
            GetJson().ContainsKey("margin").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_border()
        {
            labels.Border.Color = "red";
            labels.Border.Width = 1d;
            labels.Border.DashType = ChartDashType.Dot;
            ((Dictionary<string, object>)GetJson()["border"])["width"].ShouldEqual(1d);
            ((Dictionary<string, object>)GetJson()["border"])["color"].ShouldEqual("red");
            ((Dictionary<string, object>)GetJson()["border"])["dashType"].ShouldEqual("dot");
        }

        [Fact]
        public void Does_not_serialize_default_border()
        {
            GetJson().ContainsKey("border").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_padding()
        {
            labels.Padding.Top = 40;

            GetJson().ContainsKey("padding").ShouldBeTrue();
        }

        [Fact]
        public void Does_not_serialize_default_padding()
        {
            GetJson().ContainsKey("padding").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_Opacity()
        {
            labels.Opacity = 0.5;
            GetJson()["opacity"].ShouldEqual(0.5);
        }

        [Fact]
        public void Does_not_serialize_default_Opacity()
        {
            GetJson().ContainsKey("opacity").ShouldBeFalse();
        }

        private IDictionary<string, object> GetJson()
        {
            return labels.Serialize();
        }
    }
}
