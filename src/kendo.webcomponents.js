(function(f, define){
    define([ "./kendo.core" ], f);
})(function() {

var __meta__ = { // jshint ignore:line
    id: "webcomponents",
    name: "Web Components",
    category: "framework",
    description: "Adds Kendo UI custom elements for Web Components",
    depends: [ "core" ]
};

(function ($, undefined) {
    var TAGNAMES = {
        editor         : "textarea",
        numerictextbox : "input",
        datepicker     : "input",
        datetimepicker : "input",
        timepicker     : "input",
        autocomplete   : "input",
        colorpicker    : "input",
        maskedtextbox  : "input",
        multiselect    : "select",
        upload         : "input",
        validator      : "form",
        button         : "button",
        mobilebutton        : "a",
        mobilebackbutton    : "a",
        mobiledetailbutton  : "a",
        listview       : "ul",
        mobilelistview : "ul",
        treeview       : "ul",
        menu           : "ul",
        contextmenu    : "ul",
        actionsheet    : "ul"
    };
    var EVENT_PREFIX = "on-";

    Object.keys(kendo.ui.roles).forEach(function(name) {
        registerElement(name, kendo.ui.roles[name]);
    });
    Object.keys(kendo.mobile.ui.roles).forEach(function(name) {
        registerElement("mobile" + name, kendo.mobile.ui.roles[name]);
    });

    var jsonRegExp = /^\s*(?:\{(?:.|\r\n|\n)*\}|\[(?:.|\r\n|\n)*\])\s*$/;
    var jsonFormatRegExp = /^\{(\d+)(:[^\}]+)?\}|^\[[A-Za-z_]*\]$/;
    var numberRegExp = /^(\+|-?)\d+(\.?)\d*$/;

    function parseOption(element, option) {
        var value = element.getAttribute(option);

        if (value === null) {
            value = undefined;
        } else if (value === "null") {
            value = null;
        } else if (value === "true") {
            value = true;
        } else if (value === "false") {
            value = false;
        } else if (numberRegExp.test(value)) {
            value = parseFloat(value);
        } else if (jsonRegExp.test(value) && !jsonFormatRegExp.test(value)) {
            value = new Function("return (" + value + ")")(); // jshint ignore:line
        }

        return value;
    }

    function parseOptions(element, options) {
        var result = {};

        Object.keys(options).concat("dataSource").forEach(function(name) {
            if (element.hasAttribute(name)) {
                result[name] = parseOption(element, name);
            }
        });

        return result;
    }

    function cloneEvent(e) {
        var result = {};

        Object.keys(e).forEach(function(key) {
            if (key[0] != "_") {
                result[key] = e[key];
            }
        });

        return result;
    }

    function eventHandler(eventName, e) {
        var event = document.createEvent("CustomEvent");

        event.initCustomEvent(eventName, /*bubbles*/ false, /*cancelable*/true, cloneEvent(e));

        this.dispatchEvent(event);

        if (event.defaultPrevented) {
            e.preventDefault();
        }
    }

    function expose(component, obj) {
        var props  = Object.keys(obj);
        for(var idx = 0; idx <= props.length; idx++) {
            if(typeof(obj[props[idx]]) === "function"){
                if(!component[props[idx]]) {
                    component[props[idx]] = obj[props[idx]].bind(component.widget);
                }
            }else{
                component[props[idx]] = component[props[idx]] || obj[props[idx]];
            }
        }
    }

    function registerElement(name, widget) {
        var options = widget.prototype.options;

        var prototype = Object.create(HTMLElement.prototype);

        prototype.attachedCallback = function() {
            var that = this;
            var element = document.createElement(TAGNAMES[name] || "div");

            that.appendChild(element);
            that.widget = new widget(element, parseOptions(that, options));

            var obj = that.widget;
            do {
                expose(that, obj);
            } while ((obj = Object.getPrototypeOf(obj)));

            widget.prototype.events.forEach(function(eventName) {
                that.widget.bind(eventName, eventHandler.bind(that, eventName));
                that.widget.element.on(eventName, function(e){
                    e.stopPropagation();
                });
                if (that.hasAttribute(EVENT_PREFIX + eventName)) {
                    that.bind(eventName, function(e) {
                        window[that.getAttribute(EVENT_PREFIX + eventName)].call(that, e);
                    });
                }
            });
        };

        prototype.detachedCallback = function() {
            kendo.destroy(this.element);
        };

        document.registerElement("kendo-" + name, {
            prototype: prototype
        });
    }
})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
