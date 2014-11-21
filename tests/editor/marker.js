(function(){

var editor;

var Marker = kendo.ui.editor.Marker;

editor_module("editor marker", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
    }
});

function createCollapsedRange(container, offset) {
    var range = editor.createRange();
    range.setStart(container, offset);
    range.setEnd(container, offset);

    return range;
}

function createRange(startContainer, startOffset, endContainer, endOffset) {
    var range = editor.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);

    return range;
}

function clean(html) {
    return html.toLowerCase().replace(/class=k-marker/g, 'class="k-marker"').replace(/<br[^>]*k-br[^>]*>/ig, "").replace(/\ufeff/g, "BOM");
}

test('addMarker inserts markers', function() {
    editor.value('foo');

    var range = createRange(editor.body.firstChild, 1, editor.body.firstChild, 2);

    var marker = new Marker();
    marker.add(range);

    equal(clean(editor.body.innerHTML), 'f<span class="k-marker"></span>o<span class="k-marker"></span>o');

});

test('addMarker normalizes', function() {
    editor.value('bar');

    var range = createRange(editor.body.firstChild, 0, editor.body.firstChild, 3);

    var marker = new Marker();
    marker.add(range);

    ok(editor.body.childNodes.length < 5);
});

test('addMarker does not remove line breaks', function() {
    editor.value('foo<br />bar');

    var range = createRange(editor.body.firstChild, 0, editor.body.firstChild, 3);

    var marker = new Marker();
    marker.add(range);

    equal(editor.value(), 'foo<br />bar');
});

test('addMarker on collapsed range', function() {
    editor.value('baz');

    var range = createCollapsedRange(editor.body.firstChild, 1);

    var marker = new Marker();
    marker.add(range);

    equal(clean(editor.body.innerHTML), 'b<span class="k-marker"></span><span class="k-marker"></span>az');
});

test('removeMarker removes markers', function() {
    var range = createRangeFromText(editor, '|foo|');

    var marker = new Marker();
    marker.add(range);
    marker.remove(range);

    equal(editor.value(), 'foo');
});

test('removeMarker restores range', function() {
    var range = createRangeFromText(editor, '|foo|');

    var marker = new Marker();
    marker.add(range);
    marker.remove(range);

    equal(range.startContainer, editor.body.firstChild);
    equal(range.endContainer, editor.body.firstChild);
    equal(range.startOffset, 0);
    equal(range.endOffset, 3);
});

test('removeMarker normalizes neighbouring text nodes', function() {
    var range = createRangeFromText(editor, 'foo|bar|baz');

    var marker = new Marker();
    marker.add(range);
    marker.remove(range);

    equal(range.startContainer, editor.body.firstChild, "startContainer");
    equal(range.endContainer, editor.body.firstChild, "endContainer");
    equal(range.startOffset, 3, "endOffset");
    equal(range.endOffset, 6, "endOffset");
});

test('removeMarker on collapsed range', function() {
    editor.value('foo');
    var range = createCollapsedRange(editor.body.firstChild, 1);

    var marker = new Marker();
    marker.add(range);
    marker.remove(range);

    equal(range.startContainer, editor.body.firstChild);
    equal(range.startOffset, 1);
    equal(range.collapsed, true);
});

test('addMarker on collapsed range selects markers', function() {
    editor.value('foo bar');

    var range = editor.createRange();
    range.setStart(editor.body.firstChild, 3);
    range.collapse(true);

    var marker = new kendo.ui.editor.Marker();
    range = marker.add(range, true);

    equal(range.startContainer, editor.body);
    equal(range.endContainer, editor.body);
    equal(range.startOffset, 1);
    equal(range.endOffset, 6);
});

test('addCaretMarker inserts caret marker', function() {
    editor.value('foo');

    var range = createCollapsedRange(editor.body.firstChild, 2);

    var marker = new Marker();
    marker.addCaret(range);

    equal(clean(editor.body.innerHTML), 'fo<span class="k-marker"></span>o');
});

test('addCaretMarker updates range to include caret marker', function() {
    editor.value('foo');

    var range = createCollapsedRange(editor.body.firstChild, 2);

    var marker = new Marker();
    marker.addCaret(range);

    equal(range.startContainer, editor.body);
    equal(range.endContainer, editor.body);
    equal(range.startOffset, 1);
    equal(range.endOffset, 2);
});

test('removeCaretMarker removes caret marker', function() {
    editor.value('qux');

    var range = createRange(editor.body.firstChild, 1, editor.body.firstChild, 2);
    var marker = new Marker();
    marker.addCaret(range);
    marker.removeCaret(range);

    equal(editor.value(), 'qux');
});

test('removeCaretMarker normalizes dom', function() {
    editor.value('foo');

    var range = createRange(editor.body.firstChild, 1, editor.body.firstChild, 2);
    var marker = new Marker();
    marker.addCaret(range);
    marker.removeCaret(range);

    equal(editor.body.firstChild.nodeValue, "foo");
});

test('removeCaretMarker updates range to collapsed state', function() {
    editor.value('qux');

    var range = createRange(editor.body.firstChild, 1, editor.body.firstChild, 2);
    var marker = new Marker();
    marker.addCaret(range);
    marker.removeCaret(range);

    equal(range.startContainer, editor.body.firstChild);
    equal(range.endContainer, editor.body.firstChild);
    equal(range.startOffset, 1);
    equal(range.endOffset, 1);
});

test('removeCaretMarker when caret at the beginning', function() {
    editor.value('foo');
    var range = createRange(editor.body.firstChild, 0, editor.body.firstChild, 0);

    var marker = new Marker();
    marker.addCaret(range);

    editor.body.normalize();

    marker.removeCaret(range);

    equal(range.startOffset, 0);
    equal(range.startContainer, editor.body.firstChild);
    ok(range.collapsed);
});

test('removeCaretMarker within element', function() {
    editor.value('foo<strong></strong> bar');

    var range = createRange(editor.body.childNodes[1], 0, editor.body.childNodes[1], 0);

    var marker = new Marker();
    marker.addCaret(range);

    marker.removeCaret(range);

    equal(range.startOffset, 0);
    equal(range.startContainer, editor.body.childNodes[1]);
    ok(range.collapsed);
});

test('remove marker before br', function() {
    editor.value('<br />');
    var range = editor.getRange();
    range.setStartBefore(editor.body.firstChild);
    range.collapse(true);
    var marker = new Marker();
    marker.addCaret(range);
    marker.removeCaret(range);
    equal(range.startOffset, 0);
    equal(range.startContainer, editor.body);
});

test('remove caret after element', function() {
    editor.value('<a></a>');
    var range = editor.getRange();
    range.setEndAfter(editor.body.firstChild);
    range.collapse(false);
    var marker = new Marker();
    marker.addCaret(range);

    marker.removeCaret(range);
    equal(range.startOffset, 1);
    equal(range.startContainer, editor.body);
});

test('remove caret puts range at end of last text node', function() {
    editor.value('<a>foo</a>');
    var range = editor.getRange();
    range.setStartAfter(editor.body.firstChild);
    range.collapse(true);

    var marker = new Marker();
    marker.addCaret(range);
    marker.removeCaret(range);

    equal(range.startContainer, editor.body.firstChild.firstChild);
    equal(range.startOffset, 3);
    ok(range.collapsed);
});

test('remove marker from empty paragraph', function() {
    editor.value('<p>&nbsp;</p>');
    var range = editor.getRange();
    range.selectNodeContents(editor.body.firstChild);
    range.collapse(true);

    var marker = new Marker();
    marker.add(range);
    marker.remove(range);

    equal($(editor.body).find(".k-marker").length, 0);
});

}());
