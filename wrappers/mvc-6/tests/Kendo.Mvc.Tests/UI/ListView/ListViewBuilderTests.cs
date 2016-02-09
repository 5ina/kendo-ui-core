namespace Kendo.Mvc.UI.Fluent.Tests
{
    using Xunit;
    using System.Collections.Generic;
    using Mvc.Tests;
    public class ListViewBuilderTests
    {
        private readonly ListView<Customer> listView;
        private readonly ListViewBuilder<Customer> builder;

        public ListViewBuilderTests()
        {
            listView = new ListView<Customer>(TestHelper.CreateViewContext());
            builder = new ListViewBuilder<Customer>(listView);
        }

        [Fact]
        public void BindTo_sets_the_data_source()
        {
            IEnumerable<Customer> customers = new[] { new Customer() };
            builder.BindTo(customers);

            Assert.Same(customers, listView.DataSource.Data);
        }

        [Fact]
        public void BindTo_sets_the_data_source_if_non_generic_enumerable_is_assigned()
        {
            var data = new object[0];
            builder.BindTo(data);

            Assert.Same(data, listView.DataSource.Data);
        }

        [Fact]
        public void ClientTemplateId_sets_ListView_client_tempalate_id()
        {           
            builder.ClientTemplateId("foo");

            Assert.Equal("foo", listView.ClientTemplateId);
        }

        [Fact]
        public void Pageable_enables_ListView_pager()
        {
            builder.Pageable();

            Assert.True(listView.Pageable.Enabled);
        }

        [Fact]
        public void Navigatable_enables_ListView_navigation()
        {
            builder.Navigatable();

            Assert.True(listView.Navigatable);
        }

        [Fact]
        public void Selectable_enables_single_mode_selection()
        {
            builder.Selectable();

            Assert.True(listView.Selectable.Enabled);
            Assert.Equal(ListViewSelectionMode.Single, listView.Selectable.Mode);
        }

        [Fact]
        public void Selectable_enables_multi_mode_selection()
        {
            builder.Selectable(select => select.Mode(ListViewSelectionMode.Multiple));

            Assert.True(listView.Selectable.Enabled);
            Assert.Equal(ListViewSelectionMode.Multiple, listView.Selectable.Mode);
        }

        [Fact]
        public void Wrapper_tag_name_is_set()
        {
            builder.TagName("div");

            Assert.Equal("div", listView.TagName);
        }

        [Fact]
        public void Editable_enables_ediging()
        {
            builder.Editable();

            Assert.True(listView.Editable.Enabled);
        }
    }
}