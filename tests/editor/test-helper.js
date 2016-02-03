/* exported getEditor */
function getEditor(selector) {
    return $(selector || '#Editor1').data("kendoEditor");
}

/* exported editor_module */
function editor_module(name, options, editorOptions) {
    QUnit.moduleStart(function(details) {
        if (details.name == name) {
            $('<textarea id="editor-fixture"></textarea>').appendTo("body").kendoEditor(editorOptions);

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
