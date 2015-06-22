﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Models
{
    public static class StyleGroups
    {
        public static readonly IList<string> All = new string[]
        {
#if DEBUG
            "web/kendo.CURRENT_COMMON.less",
            "web/kendo.rtl.css",
            "web/kendo.CURRENT_THEME.less",
            "web/kendo.CURRENT_THEME.mobile.less"
#else
            "kendo.CURRENT_COMMON.min.css",
            "kendo.rtl.min.css",
            "kendo.CURRENT_THEME.min.css",
            "kendo.CURRENT_THEME.mobile.min.css"
#endif
        };

        public static readonly IList<string> Metro = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.rtl.css",
            "web/kendo.metro.less"
#else
            "kendo.common.min.css",
            "kendo.rtl.min.css",
            "kendo.metro.min.css"
#endif
        };

        public static readonly IList<string> Simulator = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.metroblack.less"
#else
            "kendo.common.min.css",
            "kendo.metroblack.min.css"
#endif
        };

        public static readonly IList<string> Mobile = new string[]
        {
#if DEBUG
            "mobile/kendo.mobile.nova.less"
#else
            "kendo.mobile.nova.min.css"
#endif
        };

        public static readonly IList<string> Bootstrap = new string[]
        {
#if DEBUG
            "web/kendo.common-bootstrap.less",
            "web/kendo.bootstrap.less"
#else
            "kendo.common-bootstrap.min.css",
            "kendo.bootstrap.min.css"
#endif
        };

        public static readonly IList<string> MobileThemeBuilder = new string[]
        {
#if DEBUG
            "web/kendo.common.less",
            "web/kendo.default.less",
            "mobile/kendo.mobile.all.less",
#else
            "kendo.common.min.css",
            "kendo.default.min.css",
            "kendo.mobile.all.min.css",
#endif
        };
    }
}
