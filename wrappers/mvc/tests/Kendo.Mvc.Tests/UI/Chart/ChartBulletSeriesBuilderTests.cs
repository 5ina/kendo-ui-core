namespace Kendo.Mvc.UI.Tests.Chart
{
    using Kendo.Mvc.UI;
    using Kendo.Mvc.UI.Fluent;
    using System;
    using Xunit;

    public class ChartBulletSeriesBuilderTests
    {
        protected IChartBulletSeries series;
        protected ChartBulletSeriesBuilder<SalesData> builder;
        private readonly Func<object, object> nullFunc;

        public ChartBulletSeriesBuilderTests()
        {
            series = new ChartBulletSeries<SalesData, decimal, string>(s => s.RepSales, s => s.TotalSales, null, null, null);
            builder = new ChartBulletSeriesBuilder<SalesData>(series);
            nullFunc = (o) => null;
        }

        [Fact]
        public void Name_should_set_name()
        {
            builder.Name("Series");
            series.Name.ShouldEqual("Series");
        }

        [Fact]
        public void Opacity_should_set_opacity()
        {
            builder.Opacity(0.5);
            series.Opacity.ShouldEqual(0.5);
        }

        [Fact]
        public void Opacity_should_return_builder()
        {
            builder.Opacity(0.5).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Color_should_set_color()
        {
            builder.Color("Blue");
            series.Color.ShouldEqual("Blue");
        }

        [Fact]
        public void Color_should_return_builder()
        {
            builder.Color("Blue").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Tooltip_should_set_visibility()
        {
            builder.Tooltip(true);
            series.Tooltip.Visible.Value.ShouldBeTrue();
        }

        [Fact]
        public void Tooltip_should_return_builder()
        {
            builder.Tooltip(true).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Tooltip_with_builder_should_configure_tooltip()
        {
            builder.Tooltip(tooltip => { tooltip.Visible(true); });
            series.Tooltip.Visible.Value.ShouldBeTrue();
        }

        [Fact]
        public void Tooltip_with_builder_should_return_builder()
        {
            builder.Tooltip(legend => { }).ShouldBeSameAs(builder);
        }

        [Fact]
        public void Axis_should_set_axisName()
        {
            builder.Axis("Secondary");
            series.Axis.ShouldEqual("Secondary");
        }

        [Fact]
        public void Axis_should_return_builder()
        {
            builder.Axis("Secondary").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Gap_should_set_gap()
        {
            builder.Gap(1);
            series.Gap.ShouldEqual(1);
        }

        [Fact]
        public void Spacing_should_set_spacing()
        {
            builder.Spacing(1);
            series.Spacing.ShouldEqual(1);
        }

        [Fact]
        public void Border_sets_width_and_color()
        {
            builder.Border(1, "red", ChartDashType.Dot);
            series.Border.Color.ShouldEqual("red");
            series.Border.Width.ShouldEqual(1);
            series.Border.DashType.ShouldEqual(ChartDashType.Dot);
        }

        [Fact]
        public void Overlay_should_set_overlay()
        {
            builder.Overlay(ChartBarSeriesOverlay.None);
            series.Overlay.ShouldEqual(ChartBarSeriesOverlay.None);
        }

        [Fact]
        public void Overlay_should_return_builder()
        {
            builder.Overlay(ChartBarSeriesOverlay.None).ShouldBeSameAs(builder);
        }

        [Fact]
        public void CurrentField_should_set_current_member()
        {
            builder.CurrentField("Current");
            series.CurrentMember.ShouldEqual("Current");
        }

        [Fact]
        public void CurrentField_should_return_builder()
        {
            builder.CurrentField("Current").ShouldBeSameAs(builder);
        }

        [Fact]
        public void TargetField_should_set_target_member()
        {
            builder.TargetField("Target");
            series.TargetMember.ShouldEqual("Target");
        }

        [Fact]
        public void TargetField_should_return_builder()
        {
            builder.TargetField("Target").ShouldBeSameAs(builder);
        }

        [Fact]
        public void ColorField_should_set_color_member()
        {
            builder.ColorField("Color");
            series.ColorMember.ShouldEqual("Color");
        }

        [Fact]
        public void ColorField_should_return_builder()
        {
            builder.ColorField("Color").ShouldBeSameAs(builder);
        }

        [Fact]
        public void Color_handler_returns_builder()
        {
            builder.ColorHandler("Foo").ShouldEqual(builder);
        }

        [Fact]
        public void Color_handler_sets_background_delegate()
        {
            builder.ColorHandler(nullFunc);
            series.ColorHandler.TemplateDelegate.ShouldEqual(nullFunc);
        }

        [Fact]
        public void Color_handler_delegate_returns_builder()
        {
            builder.ColorHandler(nullFunc).ShouldEqual(builder);
        }

        [Fact]
        public void NoteTextField_should_set_note_text_member()
        {
            builder.NoteTextField("NoteText");
            series.NoteTextMember.ShouldEqual("NoteText");
        }

        [Fact]
        public void NoteTextField_should_return_builder()
        {
            builder.NoteTextField("NoteText").ShouldBeSameAs(builder);
        }
    }
}