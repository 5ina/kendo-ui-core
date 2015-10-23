﻿namespace Kendo.Mvc.UI
{
    using System;
    using Infrastructure;
    using Microsoft.AspNet.Mvc.Rendering;

    public interface INavigationItemComponent<TItem> : INavigationItemContainer<TItem>
        where TItem : NavigationItem<TItem>
    {
        IUrlGenerator UrlGenerator
        {
            get;
        }

        ViewContext ViewContext
        {
            get;
        }

        Action<TItem> ItemAction
        {
            get;
            set;
        }

        INavigationItemAuthorization Authorization
        {
            get;
        }

        SecurityTrimming SecurityTrimming
        {
            get;
            set;
        }
    }
}
