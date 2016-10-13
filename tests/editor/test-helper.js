/* exported getEditor */
function getEditor(selector) {
    return $(selector || '#Editor1').data("kendoEditor");
}

/* exported editor_module */
function editor_module(name, options, editorOptions) {
    QUnit.moduleStart(function(details) {
        if (details.name == name) {
            if (editorOptions && editorOptions.element) {
                $(editorOptions.element).appendTo(QUnit.fixture).kendoEditor(editorOptions);
            }
            else {
                $('<textarea id="editor-fixture"></textarea>').appendTo("body").kendoEditor(editorOptions);
            }
            QUnit.suppressCleanupCheck = true;
        }
    });

    QUnit.moduleDone(function(details) {
        if (details.name == name) {
            $("#editor-fixture").kendoEditor("destroy").closest(".k-editor").remove();
            // debug for editor leftovers
            // console.log(name, $(document.body).children(":not(script,#editor-fixture)").length);
            QUnit.suppressCleanupCheck = false;
        }
    });

    module(name, options);
}

/* exported createRangeFromText */
function createRangeFromText(editor, html) {
    editor.value(html.replace(/\|/g, '<span class="t-marker"></span>'));
    var $markers = $('.t-marker', editor.body);

    var range = editor.createRange();
    range.setStartBefore($markers[0]);
    range.setEndAfter($markers[1]);

    var marker = new kendo.ui.editor.Marker();

    marker.start = $markers[0];
    marker.end = $markers[1];

    marker.remove(range);
    return range;
}

/* exported withMock */
function withMock(context, method, mock, callback) {
    var originalMethod = context[method];

    try {
        context[method] = mock;

        callback();
    } finally {
        context[method] = originalMethod;
    }
}

/* exported propertyFrom */
function propertyFrom(className, property) {
    var element = $("<span class='" + className + "' />").appendTo(QUnit.fixture);
    var result = element.css(property);

    element.remove();

    return result;
}

/* exported rangeFromHtml */
function rangeFromHtml(html) {
    QUnit.fixture.append(html.replace(/\|/g, '<span class="t-marker"></span>'));

    var markers = QUnit.fixture.find('.t-marker');

    var range = kendo.ui.editor.RangeUtils.createRange(document);
    range.setStartBefore(markers[0]);
    range.setEndAfter(markers[1]);

    var marker = new kendo.ui.editor.Marker();

    marker.start = markers[0];
    marker.end = markers[1];

    marker.remove(range);

    return range;
}

/* exported contentEqual */
function contentEqual(editor, content) {
    equal(editor.value(), content);
}

window.EditorHelpers = {
    serialize: function(dom) {
        return kendo.ui.editor.Serializer.domToXhtml(dom);
    }
};

/* exported initMock */
function initMock(callback, context) {
    var mock = function() {
        mock.called = true;
        mock.callCount++;
        if (typeof(callback) === "function") {
            var result = callback.apply(context || this, arguments);
            if(mock.callbacks) {
                for (var i = 0; i < mock.callbacks.length; i++) {
                    mock.callbacks[i].apply(context || this, arguments);
                }
            }

            return result;
        }
    };

    mock.called = false;
    mock.callCount = 0;

    mock.callbacks = [];
    mock.addMethod = function(callback) {
        mock.callbacks.push(callback);
    };

    return mock;
}

/* exported mockFunc */
function mockFunc(obj, methodName, mockMethod, context) {
    var method = obj[methodName];
    var mock = initMock(mockMethod, context || obj);
    mock.originalMethod = method;
    obj[methodName] = mock;
}

/* exported removeMock */
function removeMock(obj, methodName) {
    var mock = obj[methodName];
    var method = mock.originalMethod;

    obj[methodName] = method;
}

/* exported isMockFunc */
function isMockFunc(mock) {
    return typeof(mock.originalMethod) === "function";
}

/* exported trackMethodCall */
function trackMethodCall(obj, methodName) {
    mockFunc(obj, methodName, obj[methodName]);
}

/* exported removeMocksIn */
function removeMocksIn(obj) {
    for (var propName in obj) {
        if (obj[propName] && isMockFunc(obj[propName])) {
            removeMock(obj, propName);
        }
    }
}

function getJQueryEventType(type) {
    //jQuery attaches "mouseenter" and "mouseleave" as "mouseover" and "mouseout"
    if (type === "mouseenter") {
        return "mouseover";
    }

    if (type === "mouseleave") {
        return "mouseout";
    }

    return type;
}

function jQueryEvents(element) {
    if (!element) {
        return undefined;
    }

    return $._data(element[0] || element, "events");
}

/* exported jQueryEventsInfo */
function jQueryEventsInfo(element, event) {
    var events = jQueryEvents(element);

    if (!events) {
        return undefined;
    }

    return events[getJQueryEventType(event)];
}

/* exported assertEvent */
function assertEvent(element, options) {
    var selector = options.selector;
    var namespace = options.namespace || "";
    var events = jQueryEvents(element);
    var type = getJQueryEventType(options.type);
    var event = events[type][0];

    equal(options.type, event.origType);
    equal(type, event.type);
    equal(selector, event.selector);
    equal(namespace, event.namespace);
}

/* exported assertEvents */
function assertEvents(element, events) {
    equal(Object.keys(jQueryEvents(element)).length, events.length);

    for (var i = 0; i < events.length; i++) {
        assertEvent(element, events[i]);
    }
}

/* exported roughlyEqual */
function roughlyEqual(actual, expected, precision) {
    var valueAndUnitRegex = /(\d+\.?\d*)(.*)/i;
    var actualParsed = valueAndUnitRegex.exec(actual);
    var expectedParsed = valueAndUnitRegex.exec(expected);
    var actualValue = actualParsed[1];
    var expectedValue = expectedParsed[1];
    var unitForActual = actualParsed[2];
    var unitForExpected = expectedParsed[2];

    var isEqual = (unitForActual === unitForExpected) && (Math.abs(actualValue - expectedValue) <= precision);
    var failMessage = (isEqual ? "" : "{expected: " + expected + ", actual: " + actual + "}");

    ok(isEqual, failMessage);
}