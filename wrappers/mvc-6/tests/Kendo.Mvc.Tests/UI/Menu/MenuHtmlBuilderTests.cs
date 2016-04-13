﻿namespace Kendo.Mvc.UI.Html.Tests
{
    using Kendo.Mvc.UI;
    using Microsoft.Extensions.WebEncoders;
    using Mvc.Tests;
    using System.IO;
    using Xunit;

    public class MenuHtmlBuilderTests
    {
        private Menu menu;
        private MenuItem item;
        private MenuHtmlBuilder builder;

        public MenuHtmlBuilderTests()
        {
            //Mock<HtmlTextWriter> writer = new Mock<HtmlTextWriter>(TextWriter.Null);
            //menu = MenuTestHelper.CreateMenu(writer.Object, null);

            menu = new Menu(TestHelper.CreateViewContext());
            menu.Name = "Menu1";

            item = new MenuItem();

            builder = new MenuHtmlBuilder(menu);
        }

        [Fact]
        public void Should_output_menu_root_tag_with_id_and_css_classes()
        {
            IHtmlNode tag = builder.Build();

            Assert.Equal(menu.Name, tag.Attribute("id"));
            Assert.Equal("ul", tag.TagName);
        }


        [Fact]
        public void Render_should_output_custom_menu_css_class_when_set()
        {
            menu.HtmlAttributes.Add("class", "custom");

            IHtmlNode tag = builder.Build();

            tag.Attribute("class").ShouldContain("custom");
        }

        [Fact]
        public void Should_tag_name()
        {
            item.Enabled = true;
            IHtmlNode tag = builder.ItemTag(item);
            Assert.Equal("li", tag.TagName);
        }

        [Fact]
        public void Should_apply_disabled_state()
        {
            item.Enabled = false;
            IHtmlNode tag = builder.ItemTag(item);

            Assert.Equal("k-item k-state-disabled", tag.Attribute("class"));
        }

        [Fact]
        public void Should_apply_selected_state()
        {
            item.Enabled = true;
            item.Selected = true;
            IHtmlNode tag = builder.ItemTag(item);

            Assert.Equal("k-item k-state-selected", tag.Attribute("class"));
        }

        [Fact]
        public void Should_apply_default_state()
        {
            item.Enabled = true;
            IHtmlNode tag = builder.ItemTag(item);

            Assert.Equal("k-item k-state-default", tag.Attribute("class"));
        }

        [Fact]
        public void Should_output_span_for_item_without_link()
        {
            item.Text = "text";
            item.Url = "#";

            IHtmlNode tag = builder.ItemInnerContentTag(item, false);

            StringWriter sw = new StringWriter();
            tag.Children[0].WriteTo(sw, HtmlEncoder.Default);

            Assert.Equal(UIPrimitives.Link, tag.Attribute("class"));
            Assert.False(tag.Attributes().ContainsKey("href"));
            Assert.Equal("span", tag.TagName);
            Assert.Equal("text", sw.ToString());
        }

        [Fact]
        public void Should_apply_vertical_css_class()
        {
            menu.Orientation = MenuOrientation.Vertical;

            IHtmlNode tag = builder.Build();

            Assert.Equal("k-widget k-reset k-header k-menu k-menu-vertical", tag.Attribute("class"));
        }

        [Fact]
        public void Should_output_sprite_if_sprite_css_classes_is_set()
        {
            item.SpriteCssClasses = "sprite";
            item.Items.Clear();

            IHtmlNode tag = builder.ItemInnerContentTag(item, false);

            Assert.Equal("span", tag.Children[0].TagName);
            Assert.Equal("k-sprite sprite", tag.Children[0].Attribute("class"));
        }

        [Fact]
        public void Should_output_an_expand_arrow_for_items_with_children()
        {
            item.Items.Add(new MenuItem() { Text = "My child item" });

            IHtmlNode tag = builder.ItemInnerContentTag(item, true);

            Assert.Equal("span", tag.Children[1].TagName);
            Assert.Equal("k-icon k-i-arrow-s", tag.Children[1].Attribute("class"));
        }

        [Fact]
        public void Should_output_an_expand_arrow_for_root_items_with_content()
        {
            item.Items.Clear();
            item.Content = () => { };

            IHtmlNode tag = builder.ItemInnerContentTag(item, true);

            Assert.Equal("span", tag.Children[1].TagName);
            Assert.Equal("k-icon k-i-arrow-s", tag.Children[1].Attribute("class"));
        }

        [Fact]
        public void Should_output_an_horizontal_expand_arrow_for_root_items_with_children_in_vertical_menus()
        {
            item.Items.Add(new MenuItem() { Text = "My child item" });

            menu.Orientation = MenuOrientation.Vertical;

            IHtmlNode tag = builder.ItemInnerContentTag(item, true);

            Assert.Equal("span", tag.Children[1].TagName);
            Assert.Equal("k-icon k-i-arrow-e", tag.Children[1].Attribute("class"));
        }

        [Fact]
        public void Should_not_output_an_expand_arrow_if_no_child_items()
        {
            item.Items.Clear();

            IHtmlNode tag = builder.ItemInnerContentTag(item, false /*no child items*/);

            Assert.Equal(1, tag.Children.Count); //only text node
        }

        [Fact]
        public void Should_render_content_css_class_and_id_attr()
        {
            item.Content = () => { };

            IHtmlNode tag = builder.ItemContentTag(item).Children[0].Children[0];

            Assert.Equal(UIPrimitives.Content, tag.Attribute("class"));
            Assert.Equal("div", tag.TagName);
            Assert.NotNull(tag.Attribute("id"));
        }

        [Fact]
        public void Should_render_content()
        {
            item.Content = () => { };

            IHtmlNode tag = builder.ItemContentTag(item).Children[0].Children[0];

            Assert.NotNull(tag.Template());
        }
    }
}
