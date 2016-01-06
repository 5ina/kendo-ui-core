namespace Kendo.Mvc.UI.Tests
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Web;
    using System.Web.Mvc;
    using System.Web.UI;
    using Kendo.Mvc.Infrastructure;
    using Kendo.Mvc.UI.Html;
    using Moq;

    public static class GridTestHelper
    {
        public static ControllerBase Controller(IDictionary<string, ValueProviderResult> valueProvider, ViewDataDictionary viewData)
        {
            return new ControllerTestDouble(valueProvider, viewData);
        }

        public static Grid<T> CreateGrid<T>(HtmlTextWriter writer) where T : class
        {
            Mock<HttpContextBase> httpContext = TestHelper.CreateMockedHttpContext();

            if (writer != null)
            {
                httpContext.Setup(c => c.Request.Browser.CreateHtmlTextWriter(It.IsAny<TextWriter>())).Returns(writer);
            }

            Mock<IViewDataContainer> viewDataContainer = new Mock<IViewDataContainer>();
            Mock<IUrlGenerator> urlGenerator = new Mock<IUrlGenerator>();

            viewDataContainer.SetupGet(container => container.ViewData).Returns(new ViewDataDictionary());

            ViewContext viewContext = TestHelper.CreateViewContext();

            var initializer = new Mock<IJavaScriptInitializer>();
            
            var htmlBuilderFactory = new Mock<IGridHtmlBuilderFactory>();

            var gridHtmlBuilder = new Mock<IGridHtmlBuilder>();
            gridHtmlBuilder.Setup(builder => builder.CreateGrid(
                It.IsAny<IDictionary<string, object>>(),
                It.IsAny<GridFunctionalData>(),
                It.IsAny<GridRenderingData>()
                )
            ).Returns(new Mock<IHtmlNode>().Object);

            htmlBuilderFactory.Setup(builder => builder.CreateBuilder(It.IsAny<bool>())).Returns(gridHtmlBuilder.Object);

            Grid<T> grid = new Grid<T>(viewContext, initializer.Object, urlGenerator.Object, htmlBuilderFactory.Object) { Name = "Grid" };

            return grid;
        }
        
        public static Grid<T> CreateGrid<T>() where T : class
        {
            return CreateGrid<T>(new HtmlTextWriter(TextWriter.Null));
        }
        
        public static void Add(this IDictionary<string, ValueProviderResult> valueProvider, string key, object value)
        {
            valueProvider[key] = new ValueProviderResult(value, value.ToString(), CultureInfo.InvariantCulture);
        }
    }
}