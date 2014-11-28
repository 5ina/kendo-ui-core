(function(){
    var context = window.parent,
        kendo = window.kendo,
        constant = function(property, target, values){
            return {
                target: target,
                property: property,
                values: values
            };
        },
        gradientConstant = function(target) {
            return {
                property: "background-image",
                editor: "ktb-gradient",
                infer: function() {
                    var background = cssPropertyFrom(target.slice(1), "background-image"),
                        match = /linear-gradient\((.*)\)$/i.exec(background);

                    return match ? match[1] : "none";
                }
            };
        },
        toProtocolRelative = function(url) {
            return url.replace(/^http(s?):\/\//i, "//");
        },
        cdnRoot = (function() {
            var scripts = document.getElementsByTagName("script"),
                script, path, i;

            for (i = 0; i < scripts.length; i++) {
                script = scripts[i];

                if (script.src.indexOf("kendo.all.min") > 0) {
                    break;
                }
            }

            path = script.src.split('?')[0];

            return toProtocolRelative(path.split("/").slice(0,-2).join("/") + "/");
        })(),
        lessTemplate = "",
        BGCOLOR = "background-color",
        BORDERCOLOR = "border-color",
        COLOR = "color",
        cssPropertyFrom = function(cssClass, property) {
            var dummy = $("<div class='" + cssClass + "' />"), result;

            dummy.css("display", "none").appendTo(context.document.body);

            result = dummy.css(property);

            dummy.remove();

            return result;
        },
        webConstants = {
            "@image-folder": {
                readonly: true,
                infer: function() {
                    var result = cssPropertyFrom("k-icon", "background-image")
                            .replace(/url\(["']?(.*?)\/sprite\.png["']?\)$/i, "\"$1\""),
                        cdnRootRe = /cdn\.kendostatic\.com/i;

                    result = result.replace(cdnRootRe, "da7xgjtj801h2.cloudfront.net");

                    return toProtocolRelative(result);
                }
            },

            "@fallback-texture":                { readonly: true, value: "none" },

            "@texture":                         {
                property: "background-image",
                target: ".k-header",
                values: [ { text: "flat", value: "none" } ].concat(
                    [
                        "highlight", "glass", "brushed-metal", "noise",
                        "dots1", "dots2", "dots3", "dots4", "dots5",
                        "dots6", "dots7", "dots8", "dots9", "dots10",
                        "dots11", "dots12", "dots13", "leather1", "leather2",
                        "stripe1", "stripe2", "stripe3", "stripe4", "stripe5", "stripe6"
                    ].map(function(x) {
                        return { text: x, value: "url('" + cdnRoot + "styles/textures/" + x + ".png')" };
                    }
                )),
                infer: function() {
                    var background = cssPropertyFrom("k-header", "background-image"),
                        match = /^(.*),\s*[\-\w]*linear-gradient\(/i.exec(background);

                    return match ? match[1] : "none";
                }
            },
            "@tooltip-texture":                 {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom("k-widget k-tooltip", "background-image");
                }
            },

            "@widget-background-color":         constant(BGCOLOR, ".k-widget"),
            "@widget-gradient":                 gradientConstant(".k-header"),
            "@widget-border-color":             constant(BORDERCOLOR, ".k-widget"),
            "@widget-text-color":               constant(COLOR, ".k-widget"),
            "@widget-shadow":                   { readonly: true, value: "none" },

            "@header-background-color":         constant(BGCOLOR, ".k-header"),
            "@header-text-color":               constant(COLOR, ".k-header"),

            "@button-background-color":         constant(BGCOLOR, ".k-button"),
            "@button-hover-background-color":   constant(BGCOLOR, ".k-button.k-state-hover"),
            "@button-active-background":        constant(BGCOLOR, ".k-button.k-state-active"),
            "@button-text-color":               constant(COLOR, ".k-button"),
            "@button-hover-text-color":         constant(COLOR, ".k-button.k-state-hover"),

            "@primary-button-text-color":       constant(COLOR, ".k-primary"),
            "@primary-button-background-color": constant(BGCOLOR, ".k-primary"),
            "@primary-button-border-color":     constant(BORDERCOLOR, ".k-primary"),
            "@primary-gradient":                gradientConstant(".k-primary"),
            "@primary-focused-color":           constant(COLOR, ".k-primary.k-state-focused"),
            "@primary-focused-border-color":    constant(BORDERCOLOR, ".k-primary.k-state-focused"),
            "@primary-focused-gradient":        gradientConstant(".k-primary.k-state-focused"),
            "@primary-hover-text-color":        constant(COLOR, ".k-primary.k-state-hover"),
            "@primary-hover-border-color":      constant(BORDERCOLOR, ".k-primary.k-state-hover"),
            "@primary-hover-gradient":          gradientConstant(".k-primary.k-state-hover"),
            "@primary-hover-background-color":  constant(BGCOLOR, ".k-primary.k-state-hover"),
            "@primary-active-text-color":       constant(COLOR, ".k-primary.k-state-active"),
            "@primary-active-border-color":     constant(BORDERCOLOR, ".k-primary.k-state-active"),
            "@primary-active-gradient":         gradientConstant(".k-primary.k-state-active"),
            "@primary-active-background-color": constant(BGCOLOR, ".k-primary.k-state-active"),
            "@primary-disabled-text-color":      constant(COLOR, ".k-primary.k-state-disabled"),
            "@primary-disabled-border-color":   constant(BORDERCOLOR, ".k-primary.k-state-disabled"),
            "@primary-disabled-background-color":constant(BGCOLOR, ".k-primary.k-state-disabled"),
            "@primary-disabled-gradient":       gradientConstant(".k-primary.k-state-disabled"),

            "@group-background-color":          constant(BGCOLOR, ".k-group"),
            "@group-border-color":              constant(BORDERCOLOR, ".k-group"),

            "@content-background-color":        constant(BGCOLOR, ".k-content"),

            "@select-background-color":         constant(BGCOLOR, ".k-widget .k-picker-wrap"),
            "@select-border-color":             constant(BORDERCOLOR, ".k-picker-wrap.k-state-hover"),
            "@select-hover-background-color":   constant(BGCOLOR, ".k-picker-wrap.k-state-hover"),
            "@select-group-background-color":   constant(BGCOLOR, ".k-list-container"),

            "@hover-background-color":          constant(BGCOLOR, ".k-state-hover"),
            "@hover-border-color":              constant(BORDERCOLOR, ".k-state-hover"),
            "@hover-text-color":                constant(COLOR, ".k-state-hover"),
            "@hover-gradient":                  gradientConstant(".k-state-hover"),
            "@hover-shadow":                    { readonly: true, value: "none" },

            "@selected-background-color":       constant(BGCOLOR, ".k-state-selected"),
            "@selected-border-color":           constant(BORDERCOLOR, ".k-state-selected"),
            "@selected-text-color":             constant(COLOR, ".k-state-selected"),
            "@selected-gradient":               gradientConstant(".k-state-selected"),
            "@selected-shadow":                 { readonly: true, value: "none" },

            "@active-background-color":         constant(BGCOLOR, ".k-state-active"),
            "@active-border-color":             constant(BORDERCOLOR, ".k-state-active"),
            "@active-text-color":               constant(COLOR, ".k-state-active"),
            "@active-gradient":                 gradientConstant(".k-state-active"),
            "@active-shadow":                   { readonly: true, value: "none" },
            "@active-filter-background-color":  constant(BGCOLOR, ".k-state-active"),

            "@focused-border-color":            constant(BORDERCOLOR, ".k-state-focused"),
            "@focused-item-shadow":             {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom("k-state-focused", "box-shadow");
                }
            },
            "@focused-active-item-shadow":             {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom("k-state-focused k-state-selected", "box-shadow");
                }
            },
            "@focused-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom("k-picker-wrap k-state-focused", "box-shadow");
                }
            },
            "@button-focused-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-button.k-state-focused", "box-shadow");
                }
            },
            "@button-focused-active-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-button.k-state-focused.k-state-active", "box-shadow");
                }
            },
            "@primary-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-primary", "box-shadow");
                }
            },
            "@primary-focused-active-item-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-primary.k-state-focused", "box-shadow");
                }
            },
            "@primary-hover-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-primary.k-state-hover", "box-shadow");
                }
            },
            "@primary-active-shadow": {
                readonly: true,
                infer: function() {
                    return cssPropertyFrom(".k-primary.k-state-active", "box-shadow");
                }
            },

            "@error-background-color":          constant(BGCOLOR, ".k-state-error"),
            "@error-border-color":              constant(BORDERCOLOR, ".k-state-error"),
            "@error-text-color":                constant(COLOR, ".k-state-error"),

            "@disabled-text-color":             constant(COLOR, ".k-state-disabled"),
            "@disabled-gradient":               gradientConstant(".k-state-disabled"),
            "@disabled-border-color":           constant(BORDERCOLOR, ".k-state-disabled"),
            "@disabled-background-color":       constant(BGCOLOR, ".k-state-disabled"),

            "@validation-background-color":     constant(BGCOLOR, ".k-tooltip-validation"),
            "@validation-border-color":         constant(BORDERCOLOR, ".k-tooltip-validation"),
            "@validation-text-color":           constant(COLOR, ".k-tooltip-validation"),

            "@tooltip-background-color":        constant(BGCOLOR, ".k-tooltip"),
            "@tooltip-border-color":            constant(BORDERCOLOR, ".k-tooltip"),
            "@tooltip-text-color":              constant(COLOR, ".k-tooltip"),

            "@main-border-radius":                constant("border-radius", ".k-button"),
            "@list-border-radius":                { readonly: true, value: "@main-border-radius - 1" },
            "@inner-border-radius":               { readonly: true, value: "@main-border-radius - 2" },
            "@slider-border-radius":              { readonly: true, value: "13px" },

            "@draghandle-border-radius":          constant("border-radius", ".k-draghandle"),
            "@draghandle-border-color":           constant(BORDERCOLOR, ".k-draghandle"),
            "@draghandle-background-color":       constant(BGCOLOR, ".k-draghandle"),
            "@draghandle-shadow":                 { readonly: true, value: "none" },
            "@draghandle-hover-border-color":     { readonly: true, value: "@hover-border-color" },
            "@draghandle-hover-background-color": { readonly: true, value: "@hover-background-color" },
            "@draghandle-hover-shadow":           { readonly: true, value: "none" },

            "@default-icon-opacity":              { readonly: true, value: "0.8" },

            "@scheduler-background-color":          constant(BGCOLOR, ".k-scheduler"),
            "@cell-border-color":                   constant(BORDERCOLOR, ".k-scheduler-times"),
            "@column-highlight-background-color":   constant(BGCOLOR, ".k-scheduler-table .k-today"),
            "@current-time-color":                  constant(BGCOLOR, ".k-scheduler-now-line"),
            "@event-background-color":              constant(BGCOLOR, ".k-event"),
            "@event-text-color":                    constant(COLOR, ".k-event"),
            "@event-inverse-text-color":            constant(COLOR, ".k-event-inverse"),
            "@scheduler-nonwork-background-color":  constant(BGCOLOR, ".k-scheduler-table .k-nonwork-hour"),
            "@resize-background-color":             constant(BGCOLOR, ".k-ie7 .k-event .k-resize-handle"),

            "@calendar-border-radius":              constant("border-radius", ".k-window .k-link"),
            "@calendar-content-text-color":         constant(COLOR, ".k-calendar .k-link"),
            "@calendar-footer-background":          constant(BGCOLOR, ".k-calendar .k-footer .k-nav-today"),
            "@calendar-footer-text-decoration":         { readonly: true, value: "none" },
            "@calendar-footer-hover-text-decoration":   { readonly: true, value: "underline" },
            "@calendar-footer-hover-background":    constant("background-color", ".k-calendar .k-footer .k-nav-today.k-state-hover"),
            "@calendar-footer-active-background":       { readonly: true, value: "@widget-background-color" },
            "@calendar-header-hover-text-decoration":   constant("text-decoration", ".k-calendar .k-nav-fast.k-state-hover"),
            "@calendar-header-hover-background":        constant("background-color", ".k-calendar .k-nav-fast.k-state-hover"),
            "@calendar-group-background-color":         constant(BGCOLOR, ".k-calendar th"),
            "@button-border-color":                     constant(BORDERCOLOR, ".k-button"),
            "@button-hover-border-color":               constant(BORDERCOLOR, ".k-button.k-state-hover"),
            "@button-active-border-color":              constant(BORDERCOLOR, ".k-button.k-state-active"),
            "@button-focused-border-color":             constant(BORDERCOLOR, ".k-button.k-state-focused, .k-button.k-state-focused"),
            "@menu-border-color":                       constant(BORDERCOLOR, ".k-menu .k-item"),
            "@filter-menu-content-background":          constant(BGCOLOR, ".k-secondary.k-filter-menu"),
            "@icon-background-color":                   constant(BGCOLOR, ".k-treeview .k-icon"),
            "@tabstrip-items-border":                   constant(BORDERCOLOR, ".k-tabstrip-items .k-state-default"),
            "@tabstrip-active-background":              constant(BGCOLOR, ".k-tabstrip .k-content.k-state-active"),
            "@tabstrip-tabs-color":                     constant(COLOR, ".k-tabstrip-items .k-state-default .k-link"),

            "@form-widget-color":                       constant(COLOR, ".k-secondary .k-dropdown .k-dropdown-wrap.k-state-hover .k-input"),

            "@drop-down-background":                    constant(BGCOLOR, ".k-dropdown-wrap.k-state-default"),
            "@drop-down-border-color":                  constant(BORDERCOLOR, ".k-dropdown-wrap.k-state-default"),
            "@drop-down-hover-border-color":            constant(BORDERCOLOR, ".k-dropdown-wrap.k-state-hover"),
            "@drop-down-focused-border-color":          constant(BORDERCOLOR, ".k-dropdown-wrap.k-state-focused"),

            "@drop-down-text-color":                    constant(COLOR, ".k-list-container"),
            "@secondary-border-color":                  constant(BORDERCOLOR, ".k-secondary .k-dropdown-wrap"),
            "@secondary-text-color":                    constant(COLOR, ".k-secondary .k-button"),
            "@numeric-selected-background":             constant(BGCOLOR, ".k-numeric-wrap .k-link.k-state-selected"),
            "@panelbar-content-background":             constant(BGCOLOR, ".k-panelbar .k-content"),
            "@panelbar-content-color":                  constant(COLOR, ".k-panelbar .k-content"),
            "@window-shadow-style":                     { readonly: true, value: "1px 1px 7px 1px" },

            "@upload-progress-text-color":              constant(COLOR, ".k-file-progress"),
            "@upload-progress-background-color":        constant(BGCOLOR, ".k-file-progress .k-progress"),
            "@upload-success-text-color":               constant(COLOR, ".k-file-success"),
            "@upload-success-background-color":         constant(BGCOLOR, ".k-file-success .k-progress"),
            "@upload-error-text-color":                 constant(COLOR, ".k-file-error"),
            "@upload-error-background-color":           constant(BGCOLOR, ".k-file-error .k-progress"),

            "@alt-background-color":            constant(BGCOLOR, ".k-alt"),
            "@nested-alt-background-color":     constant(BGCOLOR, ".k-alt .k-alt"),
            "@inverse-text-color":              constant(COLOR, ".k-inverse"),
            "@input-background-color":          constant(BGCOLOR, ".k-input"),
            "@input-text-color":                constant(COLOR, ".k-autocomplete .k-input"),
            "@shadow-color":                    constant("box-shadow", ".k-popup"),
            "@shadow-inset-color":              constant("box-shadow", ".k-autocomplete .k-input"),
            "@link-text-color":                 constant(COLOR, "a.k-link"),
            "@loading-panel-color":             constant(BGCOLOR, ".k-loading-color"),
            "@splitbar-background-color":       constant(BGCOLOR, ".k-splitbar"),

            "@notification-info-background-color": constant(BGCOLOR, ".k-notification.k-notification-info"),
            "@notification-info-text-color": constant(COLOR, ".k-notification.k-notification-info"),
            "@notification-info-border-color": constant(BORDERCOLOR, ".k-notification.k-notification-info"),
            "@notification-success-background-color": constant(BGCOLOR, ".k-notification.k-notification-success"),
            "@notification-success-text-color": constant(COLOR, ".k-notification.k-notification-success"),
            "@notification-success-border-color": constant(BORDERCOLOR, ".k-notification.k-notification-info"),
            "@notification-warning-background-color": constant(BGCOLOR, ".k-notification.k-notification-warning"),
            "@notification-warning-text-color": constant(COLOR, ".k-notification.k-notification-warning"),
            "@notification-warning-border-color": constant(BORDERCOLOR, ".k-notification.k-notification-info"),
            "@notification-error-background-color": constant(BGCOLOR, ".k-notification.k-notification-error"),
            "@notification-error-text-color": constant(COLOR, ".k-notification.k-notification-error"),
            "@notification-error-border-color": constant(BORDERCOLOR, ".k-notification.k-notification-info"),

            "@task-summary-color": constant(BORDERCOLOR, ".k-task-summary"),
            "@task-summary-selected-color": constant(BORDERCOLOR, ".k-state-selected.k-task-summary"),

            "@checkbox-border-color-before": constant(BORDERCOLOR, ".k-checkbox-label"),
            "@checkbox-border-color-after": constant(BORDERCOLOR, ".ktb-checkbox-label-after"),
            "@checkbox-border-radius-before": constant("border-radius", ".k-checkbox-label"),
            "@checkbox-background-color": constant(BGCOLOR, ".ktb-checkbox-label-after"),
            "@checkbox-hover-border-color": constant(BORDERCOLOR, ".ktb-checkbox-label-hover-after"),
            "@checkbox-hover-box-shadow": constant("box-shadow", ".k-checkbox-label"),

            "@checkbox-checked-border-color-after": constant(BORDERCOLOR, ".ktb-checkbox-checked + .ktb-checkbox-label-after"),
            "@checkbox-checked-border-radius-after": constant("border-radius", ".k-checkbox-label"),
            "@checkbox-checked-background-color-after": constant(BORDERCOLOR, ".ktb-checkbox-checked + .ktb-checkbox-label-after"),
            "@checkbox-checked-color-after": constant(COLOR, ".ktb-checkbox-checked + .ktb-checkbox-label-after"),

            "@checkbox-active-border-color-before": constant(BORDERCOLOR, ".k-checkbox-label"),
            "@checkbox-active-border-color-after": constant(BORDERCOLOR, ".ktb-checkbox-label-active-after"),
            "@checkbox-active-border-radius": constant("border-radius", ".k-checkbox-label"),
            "@checkbox-active-border-radius-after": constant("border-radius", ".k-checkbox-label"),
            "@checkbox-active-box-shadow": constant("box-shadow", ".k-checkbox-label"),

            "@checkbox-checked-active-border-radius-before": constant("border-radius", ".k-checkbox-label"),
            "@checkbox-checked-active-box-shadow": constant("box-shadow", ".k-checkbox-label"),

            "@checkbox-checked-disabled-color-after": constant(COLOR, ".ktb-checkbox-checked-disabled + .ktb-checkbox-label-after"),
            "@checkbox-disabled-background-color-after": constant(BORDERCOLOR, ".ktb-checkbox-checked-disabled + .ktb-checkbox-label-after"),
            "@checkbox-disabled-color": constant(COLOR, ".k-checkbox-label"),
            "@checkbox-disabled-box-shadow": constant("box-shadow", ".k-checkbox-label"),
            "@checkbox-disabled-border-color-before": constant(BORDERCOLOR, ".ktb-checkbox-checked-disabled + .ktb-checkbox-label-after"),

            "@radio-border-color-before": constant(BORDERCOLOR, ".ktb-radio-label-before"),
            "@radio-background-color": constant(BGCOLOR, ".ktb-radio-label-before"),
            "@radio-border-width-before": constant("border-width", ".k-radio-label"),
            "@radio-hover-border-color": constant(BORDERCOLOR, ".ktb-radio-label-hover-before"),
            "@radio-hover-box-shadow": constant("box-shadow", ".k-radio-label"),

            "@radio-checked-border-color-before": constant(BORDERCOLOR, ".ktb-radio-checked + .ktb-radio-label-before"),
            "@radio-checked-background-color-after": constant(BGCOLOR, ".ktb-radio-checked + .ktb-radio-label-after"),
            "@radio-active-border-color-before": constant(BORDERCOLOR, ".ktb-radio-label-active-before"),
            "@radio-active-box-shadow": constant("box-shadow", ".k-radio-label"),

            "@radio-checked-active-border-color-before": constant(BORDERCOLOR, ".k-radio-label"),
            "@radio-checked-active-box-shadow": constant("box-shadow", ".k-radio-label"),

            "@radio-disabled-background-color-after": constant(BGCOLOR, ".ktb-radio-disabled + .ktb-radio-label-before"),
            "@radio-disabled-color": constant(BORDERCOLOR, ".ktb-radio-checked + .ktb-radio-label-after"),
            "@radio-disabled-box-shadow": constant("box-shadow", ".k-radio-label"),
            "@radio-disabled-background-color-before": constant(BGCOLOR, ".k-radio-label")
        },
        datavizConstants = {
            "chart.title.color":                          constant(COLOR),
            "chart.legend.labels.color":                  constant(COLOR),
            "chart.chartArea.background":                 constant(COLOR),
            "chart.seriesDefaults.labels.color":          constant(COLOR),
            "chart.axisDefaults.line.color":              constant(COLOR),
            "chart.axisDefaults.labels.color":            constant(COLOR),
            "chart.axisDefaults.minorGridLines.color":    constant(COLOR),
            "chart.axisDefaults.majorGridLines.color":    constant(COLOR),
            "chart.axisDefaults.title.color":             constant(COLOR),
            "chart.seriesColors[0]":                      constant(COLOR),
            "chart.seriesColors[1]":                      constant(COLOR),
            "chart.seriesColors[2]":                      constant(COLOR),
            "chart.seriesColors[3]":                      constant(COLOR),
            "chart.seriesColors[4]":                      constant(COLOR),
            "chart.seriesColors[5]":                      constant(COLOR),
            "chart.tooltip.background":                   constant(COLOR),
            "chart.tooltip.color":                        constant(COLOR),
            "chart.tooltip.opacity":                      constant("opacity"),
            "gauge.pointer.color":                        constant(COLOR),
            "gauge.scale.rangePlaceholderColor":          constant(COLOR),
            "gauge.scale.labels.color":                   constant(COLOR),
            "gauge.scale.minorTicks.color":               constant(COLOR),
            "gauge.scale.majorTicks.color":               constant(COLOR),
            "gauge.scale.line.color":                     constant(COLOR)
        },
        webConstantsHierarchy = {
            "Widgets": {
                "@widget-gradient":               "Gradient",
                "@widget-background-color":       "Background color",
                "@widget-border-color":           "Border color",
                "@widget-text-color":             "Text color"
            },
            "Headers and links": {
                "@header-background-color":       "Header background",
                "@header-text-color":             "Header text color",

                "@link-text-color":               "Link text color",

                "@fallback-texture":              "Texture"
            },
            "Grid": {
                "@active-filter-background-color":"Filters active background"
            },
            "Buttons": {
                "@button-background-color":       "Background",
                "@button-hover-background-color": "Hover background",
                "@button-text-color":             "Text color",
                "@button-hover-text-color":       "Hover text color",
                "@button-border-color":           "Border color",
                "@button-hover-border-color":     "Hover border color",
                "@button-focused-border-color":   "Focused border color",
                "@button-active-background":      "Active background",
                "@button-active-border-color":    "Active border color"
            },
            "Groups and content areas": {
                "@group-background-color":        "Group background",
                "@group-border-color":            "Group border color",
                "@content-background-color":      "Content area color"
            },
            "Inputs, pickers, and select boxes": {
                "@input-background-color":        "Input background",

                "@select-background-color":       "Picker background",
                "@select-border-color":           "Border color",
                "@select-group-background-color": "Popup background",
                "@select-hover-background-color": "Popup item hover state",

                "@input-text-color":              "Text color"
            },
             "Checkboxes": {
                "@checkbox-background-color":     "Background",
                "@checkbox-border-color-after":   "Border color",               
                "@checkbox-checked-color-after":  "Checked color",
                "@checkbox-checked-background-color-after": "Checked background",
                "@checkbox-checked-border-color-after": "Checked border color",
                "@checkbox-hover-border-color":   "Hover border color",
                "@checkbox-active-border-color-after": "Active border color",
                "@checkbox-checked-disabled-color-after": "Disabled color",
                "@checkbox-disabled-background-color-after": "Disabled background",
                "@checkbox-disabled-border-color-before": "Disabled border color"
            },
            "Radio buttons": {
                "@radio-border-color-before":     "Border color",
                "@radio-background-color":        "background",    
                "@radio-checked-background-color-after": "Checked color",
                "@radio-checked-border-color-before": "Checked border color",
                "@radio-hover-border-color":       "Hover border color",     
                "@radio-active-border-color-before": "Active border color",
                "@radio-disabled-color":           "Disabled color",
                "@radio-disabled-background-color-after": "Disabled background"

            },
            "Calendar": {
                "@calendar-footer-hover-background": "Calendar footer hover background"
            },
            "Drop-downs": {
                "@drop-down-text-color":          "Text color",
                "@drop-down-background":          "Background color",
                "@drop-down-border-color":        "Border color"
            },
            "TabStrip": {
                "@tabstrip-active-background":   "Tabstrip active content background",
                "@tabstrip-items-border":        "Tabstrip inactive tabs border",
                "@header-background-color":      "Tabstrip inactive tabs background",
                "@tabstrip-tabs-color":          "Tabstrip tabs color"
            },
            "Panelbar": {
                "@panelbar-content-background":  "Background color"
            },
            "Widget states": {
                "@hover-gradient":                "Hover gradient",
                "@hover-background-color":        "Hover background",
                "@hover-border-color":            "Hover border color",
                "@hover-text-color":              "Hover text color",

                "@selected-gradient":             "Selection gradient",
                "@selected-background-color":     "Selection background",
                "@selected-border-color":         "Selection border color",
                "@selected-text-color":           "Selection text color",

                "@active-gradient":               "Active gradient",
                "@active-background-color":       "Active background",
                "@active-border-color":           "Active border color",
                "@active-text-color":             "Active text color",

                "@error-background-color":        "Error background",
                "@error-border-color":            "Error border color",
                "@error-text-color":              "Error text color",

                "@disabled-text-color":           "Disabled text color"
            },
            "Tooltips": {
                "@tooltip-background-color":      "Background",
                "@tooltip-border-color":          "Border color",
                "@tooltip-text-color":            "Text color"
            },
            "Notifications": {
                "@notification-info-background-color":      "Info background",
                "@notification-info-text-color":            "Info text color",
                "@notification-info-border-color":          "Info border color",
                "@notification-success-background-color":   "Success background",
                "@notification-success-text-color":         "Success text color",
                "@notification-success-border-color":       "Success border color",
                "@notification-warning-background-color":   "Warning background",
                "@notification-warning-text-color":         "Warning text color",
                "@notification-warning-border-color":       "Warning border color",
                "@notification-error-background-color":     "Error background",
                "@notification-error-text-color":           "Error text color",
                "@notification-error-border-color":         "Error border color"
            },
            "Validation": {
                "@validation-background-color":   "Background",
                "@validation-border-color":       "Border color",
                "@validation-text-color":         "Text color"
            },
            "Drag handle": {
                "@draghandle-border-radius":      "Border radius",
                "@draghandle-border-color":       "Border color",
                "@draghandle-background-color":   "Background"
            },
            "Misc": {
                "@main-border-radius":            "Border radius",
                "@alt-background-color":          "Alternating color",
                "@nested-alt-background-color":   "Nested alternating color",
                "@shadow-color":                  "Shadow color",
                "@shadow-inset-color":            "Inset shadow",
                "@loading-panel-color":           "Loading panel background",
                "@splitbar-background-color":     "Splitbar background",
                "@inverse-text-color":            "Inverse text color"
            },
            "Gantt charts": {
                "@task-summary-color":          "Task summary color",
                "@task-summary-selected-color": "Task summary selected color"
            }
        },
        datavizConstantsHierarchy = {
            "Title, legend & charting area": {
                "chart.title.color":                       "Title color",
                "chart.legend.labels.color":               "Legend text color",
                "chart.chartArea.background":              "Charting area"
            },

            "Axes": {
                "chart.seriesDefaults.labels.color":       "Series text color",
                "chart.axisDefaults.line.color":           "Axis line color",
                "chart.axisDefaults.labels.color":         "Axis labels color",
                "chart.axisDefaults.minorGridLines.color": "Minor grid lines color",
                "chart.axisDefaults.majorGridLines.color": "Major grid lines color",
                "chart.axisDefaults.title.color":          "Axis title color"
            },

            "Tooltip": {
                "chart.tooltip.background":                "Tooltip background",
                "chart.tooltip.color":                     "Tooltip text",
                "chart.tooltip.opacity":                   "Tooltip opacity"
            },

            "Series colors": {
                "chart.seriesColors[0]":                   "Color #1",
                "chart.seriesColors[1]":                   "Color #2",
                "chart.seriesColors[2]":                   "Color #3",
                "chart.seriesColors[3]":                   "Color #4",
                "chart.seriesColors[4]":                   "Color #5",
                "chart.seriesColors[5]":                   "Color #6"
            },

            "Gauge": {
                "gauge.pointer.color":                     "Pointer color",
                "gauge.scale.rangePlaceholderColor":       "Range placeholder color",
                "gauge.scale.labels.color":                "Scale labels text color",
                "gauge.scale.minorTicks.color":            "Minor ticks color",
                "gauge.scale.majorTicks.color":            "Major ticks color",
                "gauge.scale.line.color":                  "Scale line color"
            }
        };

    window.themeBuilder = new kendo.ThemeBuilder({
        webConstants: new kendo.LessTheme({
            constants: webConstants,
            template: lessTemplate
        }),
        datavizConstants: new kendo.JsonConstants({
            constants: datavizConstants
        }),
        webConstantsHierarchy: webConstantsHierarchy,
        datavizConstantsHierarchy: datavizConstantsHierarchy
    });

    if (typeof context.kendoThemeBuilder != "undefined") {
        context.kendoThemeBuilder.open();
    }
})();
