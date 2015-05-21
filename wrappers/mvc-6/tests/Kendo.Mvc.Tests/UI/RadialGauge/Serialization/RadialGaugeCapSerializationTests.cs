﻿namespace Kendo.Mvc.UI.Tests
{
    using System.Collections.Generic;
    using Xunit;

    public class RadialGaugeCapSerializationTests
    {
        private readonly RadialGaugePointerCapSettings cap;

        public RadialGaugeCapSerializationTests()
        {
            cap = new RadialGaugePointerCapSettings();
        }

        [Fact]
        public void Serializes_color()
        {
            cap.Color = "Color";
            GetJson()["color"].ShouldEqual("Color");
        }

        [Fact]
        public void Does_not_serialize_default_color()
        {
            GetJson().ContainsKey("color").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_opacity()
        {
            cap.Opacity = 0.33;
            GetJson()["opacity"].ShouldEqual(0.33);
        }

        [Fact]
        public void Does_not_serialize_default_opacity()
        {
            GetJson().ContainsKey("opacity").ShouldBeFalse();
        }

        [Fact]
        public void Serializes_value()
        {
            cap.Size = 3.3;
            GetJson()["size"].ShouldEqual(3.3);
        }

        [Fact]
        public void Does_not_serialize_default_value()
        {
            GetJson().ContainsKey("size").ShouldBeFalse();
        }

        private IDictionary<string, object> GetJson()
        {
            return cap.Serialize();
        }
    }
}
