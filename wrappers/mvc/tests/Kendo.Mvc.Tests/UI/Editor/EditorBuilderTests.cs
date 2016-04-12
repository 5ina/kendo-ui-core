namespace Kendo.Mvc.UI.Tests
{
	using Kendo.Mvc.UI;
	using Kendo.Mvc.UI.Fluent;
	using Xunit;
	public class EditorBuilderTests
    {
        private readonly Editor editor;
        private readonly EditorBuilder builder;

        public EditorBuilderTests()
        {
            editor = EditorTestHelper.CreateEditor();
            builder = new EditorBuilder(editor);
        }

		//[Fact]
		//public void Effects_creates_fx_factory()
		//{
		//    var fxFacCreated = false;

		//    builder.Effects(fx =>
		//    {
		//        fxFacCreated = fx != null;
		//    });

		//    Assert.True(fxFacCreated);
		//}

		[Fact]
		public void PasteCleanup_returns_builder()
		{
			builder.PasteCleanup(pasteCleanup => { }).ShouldBeSameAs(builder);
		}
    }
}