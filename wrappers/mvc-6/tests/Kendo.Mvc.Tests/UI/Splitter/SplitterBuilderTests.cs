namespace Kendo.Mvc.UI.Tests
{
    using Kendo.Mvc.Tests;
    using Kendo.Mvc.UI.Fluent;
    using Xunit;

    public class SplitterBuilderTests
    {
        private readonly Splitter splitter;
        private readonly SplitterBuilder builder;

        public SplitterBuilderTests()
        {
            splitter = new Splitter(TestHelper.CreateViewContext());
            builder = new SplitterBuilder(splitter);
        }

        [Fact]
        public void Orientation_sets_component_orientation()
        {
            builder.Orientation(SplitterOrientation.Vertical);

            Assert.Equal(splitter.Orientation, SplitterOrientation.Vertical);
        }

        [Fact]
        public void Orientation_should_return_builder()
        {
            Assert.IsType<SplitterBuilder>(builder.Orientation(SplitterOrientation.Horizontal));
        }
    }
}