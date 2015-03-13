namespace Kendo.Mvc.Extensions.Tests
{
    using System.Collections.Generic;

    using Xunit;

    public class DictionaryExtensionsTests
    {
        [Fact]
        public void Should_be_able_to_merge_item()
        {
            IDictionary<string, object> target = new Dictionary<string, object>();

            target.Merge("key", "value", true);

            Assert.True(target.ContainsKey("key"));
        }

        [Fact]
        public void Should_be_able_to_append_in_value()
        {
            IDictionary<string, object> target = new Dictionary<string, object>{{"key", "value"}};

            target.AppendInValue("key", " ", "value2");

            Assert.Equal("value value2", target["key"]);
        }

        [Fact]
        public void PrependInValue_should_append_the_value_in_front_of_existing_value()
        {
            IDictionary<string, object> target = new Dictionary<string, object> { { "key", "value" } };
            target.PrependInValue("key", " ", "value2");

            Assert.Equal("value2 value", target["key"]);
        }

        [Fact]
        public void Merge_with_dictionary_should_add_specified_items()
        {
            IDictionary<string, object> target = new Dictionary<string, object>();

            target.Merge(new Dictionary<string, object> { { "foo", "bar" } });

            Assert.Equal("bar", target["foo"]);
        }

        [Fact]
        public void Merge_with_dictionary_should_not_replace_the_existing_items()
        {
            IDictionary<string, object> target = new Dictionary<string, object> { { "foo", "bar" } };

            target.Merge(new Dictionary<string, object> { { "foo", "bar2" } }, false);

            Assert.Equal("bar", target["foo"]);
        }

        [Fact]
        public void Merge_with_object_should_add_specified_items()
        {
            IDictionary<string, object> target = new Dictionary<string, object>();

            target.Merge(new { foo = "bar" });

            Assert.Equal("bar", target["foo"]);
        }

        [Fact]
        public void Merge_with_object_should_not_replace_the_existing_items()
        {
            IDictionary<string, object> target = new Dictionary<string, object> { { "foo", "bar" } };

            target.Merge(new { foo = "bar2" }, false);

            Assert.Equal("bar", target["foo"]);
        }
    }
}