(function(){

var editor;

editor_module("editor range enumerator", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
    }
});

function enumerateRange(range) {
    return new kendo.ui.editor.RangeEnumerator(range).enumerate();
}

function assertArrayEquals(actual, expected) {
    equal(actual.length, expected.length);

    for (var i = 0; i < expected.length; i++)
        equal(actual[i], expected[i]);
}

test('enumerate returns text node when all content selected', function() {
    var range = createRangeFromText(editor, '|foo|');

    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild]);
});

test('enumerate returns text nodes when inline node is selected', function() {
    var range = createRangeFromText(editor, '|<span><span>foo</span></span>|');

    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild.firstChild.firstChild]);
});

test('enumerate returns does not return comments', function() {
    var range = createRangeFromText(editor, '|foo<!-- comment -->|');

    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild]);
});

test('enumerate returns the text contents when more than one node is selected', function() {
    var range = createRangeFromText(editor, '|<span>foo</span><span>bar</span>|');

    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild.firstChild, editor.body.childNodes[1].firstChild]);
});

test('enumerate returns the text contents in case of partial selection', function() {
    var range = createRangeFromText(editor, '<span>f|oo</span><span>b|ar</span>');

    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild.firstChild, editor.body.childNodes[1].firstChild]);
});

test('enumerate skips white space nodes', function() {
    var range = createRangeFromText(editor, '|\r\t<p>test</p>\r\n|');

    var p = $('p', editor.body)[0];
    var result = enumerateRange(range);

    assertArrayEquals(result, [p.firstChild]);
});

    test("enumerate space nodes", function () {
        var range = createRangeFromText(editor, "| |");
        var result = enumerateRange(range);

        equal(result.length, 1);
        ok(result[0].nodeValue, " ");
    })

test('enumerate returns images', function() {
    var range = createRangeFromText(editor, '|<img />|');
    var result = enumerateRange(range);

    assertArrayEquals(result, [editor.body.firstChild]);
});

}());
