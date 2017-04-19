namespace Kendo.Mvc.UI
{
    using System;
    using System.Collections.Generic;
    using Kendo.Mvc.Extensions;

    public class ListBoxHtmlBuilder
    {
        private readonly ListBox component;

        /// <summary>
        /// Initializes a new instance of the <see cref="ListBoxHtmlBuilder" /> class.
        /// </summary>
        /// <param name="component">The ListBox component.</param>
        public ListBoxHtmlBuilder(ListBox component)
        {
            this.component = component;
        }

        /// <summary>
        /// Builds the ListBox markup.
        /// </summary>
        /// <returns></returns>
        public IHtmlNode Build()
        {
            var html = CreateElement();
            html.Attribute("data-role", "listbox")
                .Attribute("id", component.Id)
                .Attributes(component.HtmlAttributes);

            return html;
        }

        protected virtual IHtmlNode CreateElement()
        {
            return new HtmlElement("select");
        }

        
        protected virtual void AddEventAttributes(IHtmlNode html, IDictionary<string, object> events)
        {
            foreach (var keyValuePair in events)
            {
                var value = keyValuePair.Value as ClientHandlerDescriptor;
                var key = "data-" + keyValuePair.Key;

                if (value.HandlerName.HasValue())
                {
                    html.Attribute(key, value.HandlerName);
                }

            }
        }
        
    }
}

