using System.Collections.Generic;
using System.IO;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Mvc.ViewFeatures;

namespace Kendo.Mvc.UI
{
	/// <summary>
	/// Kendo UI MaskedTextBox component
	/// </summary>
	public partial class MaskedTextBox : WidgetBase
        
    {
        public MaskedTextBox(ViewContext viewContext) : base(viewContext)
        {
        }

		public Dictionary<string, object> Rules { get; } = new Dictionary<string, object>();

		protected override void WriteHtml(TextWriter writer)
        {
			var metadata = ExpressionMetadataProvider.FromStringExpression(Name, HtmlHelper.ViewData, HtmlHelper.MetadataProvider).Metadata;
			var tag = Generator.GenerateTextInput(ViewContext, metadata, Id, Name, Value, string.Empty, HtmlAttributes);

			if (!Enable.GetValueOrDefault(true))
			{
				tag.MergeAttribute("disabled", "disabled");
			}

			tag.TagRenderMode = TagRenderMode.SelfClosing;
            tag.WriteTo(writer, HtmlEncoder);

            base.WriteHtml(writer);
        }

        public override void WriteInitializationScript(TextWriter writer)
        {
            var settings = SerializeSettings();

			settings["rules"] = Rules;

			writer.Write(Initializer.Initialize(Selector, "MaskedTextBox", settings));
        }
    }
}

