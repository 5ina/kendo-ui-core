﻿namespace Kendo.Mvc.UI.Html.Tests
{
	using System;
	using Kendo.Mvc.Tests;
	using Kendo.Mvc.UI.Fluent;
	using Xunit;

	public class ButtonBuilderTests
    {
		private ButtonBuilder builder;
		private Button button;

		public ButtonBuilderTests()
		{
			button = new Button(TestHelper.CreateViewContext());
			builder = new ButtonBuilder(button);
		}

		[Fact]
		public void Content_sets_Content_property()
		{
			Action content = () => { };

			builder.Content(content);

			button.ContentAction.ShouldEqual(content);
		}

		[Fact]
		public void Content_returns_builder_object()
		{
			builder.Content(() => { }).ShouldBeSameAs(builder);
		}

		[Fact]
		public void Content_with_string_param_sets_Content_property()
		{
			builder.Content("<ul><li>something</li></ul>");

			button.Html.ShouldNotBeNull();
		}

		[Fact]
		public void Content_with_string_param_returns_builder_object()
		{
			builder.Content("<ul><li>something</li></ul>").ShouldBeSameAs(builder);
		}

		[Fact]
		public void Enable_sets_Enable_property()
		{
			const bool enabled = false;

			builder.Enable(enabled);

			button.Enable.ShouldEqual(enabled);
		}

		[Fact]
		public void Enable_returns_builder()
		{
			builder.Enable(false).ShouldBeSameAs(builder);
		}

		[Fact]
		public void Icon_sets_Icon_property()
		{
			const string icon = "foo";

			builder.Icon(icon);

			button.Icon.ShouldEqual(icon);
		}

		[Fact]
		public void Icon_returns_builder()
		{
			builder.Icon("foo").ShouldBeSameAs(builder);
		}

		[Fact]
		public void ImageUrl_sets_ImageUrl_property()
		{
			const string url = "foo";

			builder.ImageUrl(url);

			button.ImageUrl.ShouldEqual(url);
		}

		[Fact]
		public void ImageUrl_returns_builder()
		{
			builder.ImageUrl("foo").ShouldBeSameAs(builder);
		}

		[Fact]
		public void SpriteCssClass_sets_SpriteCssClass_property()
		{
			const string cssClass = "foo";

			builder.SpriteCssClass(cssClass);

			button.SpriteCssClass.ShouldEqual(cssClass);
		}

		[Fact]
		public void SpriteCssClass_returns_builder()
		{
			builder.SpriteCssClass("foo").ShouldBeSameAs(builder);
		}

		[Fact]
		public void Tag_sets_Tag_property()
		{
			const string tag = "foo";

			builder.Tag(tag);

			button.Tag.ShouldEqual(tag);
		}

		[Fact]
		public void Tag_returns_builder()
		{
			builder.Tag("foo").ShouldBeSameAs(builder);
		}
	}
}