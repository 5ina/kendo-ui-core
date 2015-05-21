namespace Kendo.Mvc.UI.Tests
{
    using Kendo.Mvc.UI.Fluent;
    using System;
    using System.Collections.Generic;
    using Xunit;

    public class DatePickerClientEventsBuilderTests
    {
        private DatePickerEventBuilder builder;
        private Dictionary<string, object> clientEvents;


        public DatePickerClientEventsBuilderTests()
        {
            clientEvents = new Dictionary<string, object>();
            builder = new DatePickerEventBuilder(clientEvents);
        }

        [Fact]
        public void Change_sets_handlerName_of_the_datepicker()
        {
            builder.Change("change");

            var @event = clientEvents["change"] as ClientHandlerDescriptor;

            Assert.NotNull(@event);

            @event.HandlerName.ShouldEqual("change");
        }

        [Fact]
        public void Change_sets_inline_code_block_of_the_datepicker()
        {
            Func<object, object> codeBlock = (w) => { return w; };

            builder.Change(codeBlock);

            var @event = clientEvents["change"] as ClientHandlerDescriptor;

            @event.TemplateDelegate.ShouldBeSameAs(codeBlock);
        }

        [Fact]
        public void Open_sets_handlerName_of_the_datepicker()
        {
            builder.Open("open");

            var @event = clientEvents["open"] as ClientHandlerDescriptor;

            Assert.NotNull(@event);

            @event.HandlerName.ShouldEqual("open");
        }

        [Fact]
        public void Open_sets_inline_code_block_of_the_datepicker()
        {
            Func<object, object> codeBlock = (w) => { return w; };

            builder.Open(codeBlock);

            var @event = clientEvents["open"] as ClientHandlerDescriptor;

            @event.TemplateDelegate.ShouldBeSameAs(codeBlock);
        }

        [Fact]
        public void Close_sets_handlerName_of_the_datepicker()
        {
            builder.Close("close");

            var @event = clientEvents["close"] as ClientHandlerDescriptor;

            Assert.NotNull(@event);

            @event.HandlerName.ShouldEqual("close");
        }

        [Fact]
        public void Close_sets_inline_code_block_of_the_datepicker()
        {
            Func<object, object> codeBlock = (w) => { return w; };

            builder.Close(codeBlock);

            var @event = clientEvents["close"] as ClientHandlerDescriptor;

            @event.TemplateDelegate.ShouldBeSameAs(codeBlock);
        }
    }
}
