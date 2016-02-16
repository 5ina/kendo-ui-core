﻿using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.ModelBinding;
using Microsoft.AspNet.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc.ModelBinding.Validation;
using Microsoft.AspNet.Mvc.Infrastructure;
using Microsoft.AspNet.Mvc.ViewFeatures;

namespace Kendo.Mvc.Rendering
{
    public class KendoHtmlGenerator : IKendoHtmlGenerator
    {
        private readonly ActionBindingContext _actionBindingContext;
        private readonly IModelMetadataProvider _metadataProvider;
        private readonly IServiceProvider _requestServices;

        /// <summary>
        /// Initializes a new instance of the <see cref="KendoHtmlGenerator"/> class.
        /// </summary>
        public KendoHtmlGenerator(
            IActionBindingContextAccessor actionBindingContextAccessor,
            IModelMetadataProvider metadataProvider,
            IServiceProvider requestServices)

        {
            _actionBindingContext = actionBindingContextAccessor.ActionBindingContext;
            _metadataProvider = metadataProvider;
            _requestServices = requestServices;
        }
		private TagBuilder GenerateInput(
		   ViewContext viewContext,
		   ModelMetadata metadata,
		   string id,
		   string name,
		   object value,
		   string format,
		   string type,
		   IDictionary<string, object> htmlAttributes)
		{
			var tagBuilder = GenerateTag("input", viewContext, id, name, htmlAttributes);
            tagBuilder.TagRenderMode = TagRenderMode.SelfClosing;
			tagBuilder.MergeAttribute("type", type);

			var fullName = tagBuilder.Attributes["name"];
			var valueParameter = FormatValue(value, format);
			var useViewData = metadata == null && value == null;
			var attributeValue = (string)GetModelStateValue(viewContext, fullName, typeof(string));
			if (attributeValue == null)
			{
				attributeValue = useViewData ? EvalString(viewContext, fullName, format) : valueParameter;
			}

			tagBuilder.MergeAttribute("value", attributeValue, true);

            // If there are any errors for a named field, we add the CSS attribute.
            ModelStateEntry modelState;
			if (viewContext.ViewData.ModelState.TryGetValue(fullName, out modelState) && modelState.Errors.Count > 0)
			{
				tagBuilder.AddCssClass(HtmlHelper.ValidationInputCssClassName);
			}

			tagBuilder.MergeAttributes(GetValidationAttributes(viewContext, metadata, name));

			return tagBuilder;
		}

		public virtual TagBuilder GenerateColorInput(
			ViewContext viewContext,
			ModelMetadata metadata,
			string id,
			string name,
			object value,
			IDictionary<string, object> htmlAttributes)
		{
			return GenerateInput(viewContext, metadata, id, name, value, null, "color", htmlAttributes);
		}

        public virtual TagBuilder GenerateRangeInput(
            ViewContext viewContext,
            ModelMetadata metadata,
            string id,
            string name,
            object value,
            IDictionary<string, object> htmlAttributes)
        {
            return GenerateInput(viewContext, metadata, id, name, value, null, "range", htmlAttributes);
        }

        public virtual TagBuilder GenerateDateInput(
            ViewContext viewContext,
            ModelMetadata metadata,
            string id,
            string name,
            object value,
            string format,
            IDictionary<string, object> htmlAttributes)
        {
			return GenerateInput(viewContext, metadata, id, name, value, format, "date", htmlAttributes);
        }

        public virtual TagBuilder GenerateDateTimeInput(
            ViewContext viewContext,
            ModelMetadata metadata,
            string id,
            string name,
            object value,
            string format,
            IDictionary<string, object> htmlAttributes)
        {            
            return GenerateInput(viewContext, metadata, id, name, value, format, "datetime", htmlAttributes);
		}

        public virtual TagBuilder GenerateTimeInput(
            ViewContext viewContext,
            ModelMetadata metadata,
            string id,
            string name,
            object value,
            string format,
            IDictionary<string, object> htmlAttributes)
        {
            return GenerateInput(viewContext, metadata, id, name, value, format, "time", htmlAttributes);
        }

        public virtual TagBuilder GenerateNumericInput(
			ViewContext viewContext,
			ModelMetadata metadata,
			string id,
			string name,
			object value,
			string format,
			IDictionary<string, object> htmlAttributes)
		{			
			return GenerateInput(viewContext, metadata, id, name, value, format, "number", htmlAttributes);
		}

        public virtual TagBuilder GenerateTag(
            string tagName,            
            IDictionary<string, object> htmlAttributes)
        {            
            var tagBuilder = new TagBuilder(tagName);            
            tagBuilder.MergeAttributes(htmlAttributes, replaceExisting: true);
            return tagBuilder;
        }

        public virtual TagBuilder GenerateTag(
            string tagName,
            ViewContext viewContext,
            string id,
            string name,
            IDictionary<string, object> htmlAttributes)
        {
            var fullName = viewContext.GetFullHtmlFieldName(name);

            if (string.IsNullOrEmpty(fullName))
            {
                throw new InvalidOperationException(Resources.Exceptions.NameCannotBeBlank);
            }

            var tagBuilder = new TagBuilder(tagName);
            tagBuilder.MergeAttribute("id", id);
            tagBuilder.MergeAttribute("name", fullName);
            tagBuilder.MergeAttributes(htmlAttributes, replaceExisting: true);

            return tagBuilder;
        }

        // Only render attributes if client-side validation is enabled, and then only if we've
        // never rendered validation for a field with this name in this form.
        public virtual IDictionary<string, object> GetValidationAttributes(
            ViewContext viewContext,
            ModelMetadata metadata,
            string name)
        {
            var formContext = viewContext.ClientValidationEnabled ? viewContext.FormContext : null;
            if (formContext == null)
            {
                return null;
            }

            var fullName = viewContext.GetFullHtmlFieldName(name);
            if (formContext.RenderedField(fullName))
            {
                return null;
            }

            formContext.RenderedField(fullName, true);
            var clientRules = GetClientValidationRules(viewContext, metadata, name);

            return UnobtrusiveValidationAttributesGenerator.GetValidationAttributes(clientRules);
        }

        protected virtual IEnumerable<ModelClientValidationRule> GetClientValidationRules(
            ViewContext viewContext,
            ModelMetadata metadata,
            string name)
        {
            metadata = metadata ??
                ExpressionMetadataProvider.FromStringExpression(name, viewContext.ViewData, _metadataProvider).Metadata;

            var validatorProviderContext = new ModelValidatorProviderContext(metadata);
            _actionBindingContext.ValidatorProvider.GetValidators(validatorProviderContext);

            return validatorProviderContext
                .Validators.OfType<IClientModelValidator>()
                .SelectMany(v => v.GetClientValidationRules(
                    new ClientModelValidationContext(metadata, _metadataProvider, _requestServices)));
        }

        private static object GetModelStateValue(ViewContext viewContext, string key, Type destinationType)
        {
            ModelStateEntry modelState;
            if (viewContext.ViewData.ModelState.TryGetValue(key, out modelState) && modelState.RawValue != null)
            {
                return Convert.ChangeType(modelState.RawValue, destinationType);
            }

            return null;
        }

        private static string EvalString(ViewContext viewContext, string key)
        {
            return Convert.ToString(viewContext.ViewData.Eval(key), CultureInfo.CurrentCulture);
        }

        private static string EvalString(ViewContext viewContext, string key, string format)
        {
            return Convert.ToString(viewContext.ViewData.Eval(key, format), CultureInfo.CurrentCulture);
        }

        private static string FormatValue(object value, string format)
        {
            return ViewDataDictionary.FormatValue(value, format);
        }

		public TagBuilder GenerateTextInput(
			ViewContext viewContext,
			ModelMetadata metadata, 
			string id, 
			string name, 
			object value, 
			string format, 
			IDictionary<string, object> htmlAttributes)
		{
			return GenerateInput(viewContext, metadata, id, name, value, format, "text", htmlAttributes);
		}
	}
}
