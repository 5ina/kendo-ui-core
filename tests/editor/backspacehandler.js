(function(){

    var editor;
    var BackspaceHandler = kendo.ui.editor.BackspaceHandler;
    var defaultPrevented;

    editor_module("editor backspace handler", {
        setup: function() {
            editor = $("#editor-fixture").data("kendoEditor");
            defaultPrevented = false;
        }
    });

    function handleKey(key) {
        return function() {
            var handler = new BackspaceHandler(editor);

            handler.keydown({
                preventDefault: function() {
                    defaultPrevented = true;
                },
                keyCode: key
            });
        }
    }

    var handleBackspace = handleKey(kendo.keys.BACKSPACE);
    var handleDelete = handleKey(kendo.keys.DELETE);

    test("removes selected content", function() {
        editor.selectRange(createRangeFromText(editor, 'foo|bar|baz'));

        handleBackspace();

        equal(editor.value(), "foobaz");
    });

    test("removes table content from complete selection", function() {
        var range = createRangeFromText(editor, '|<table><tr><td>foo</td><td>bar</td></tr></table>|');
        editor.selectRange(range);

        handleBackspace();

        equal(editor.value(), '');
    });

    test("removes all bom characters before caret without preventing default action", function() {
        var range = createRangeFromText(editor, 'foo\ufeff\ufeff||bar');
        editor.selectRange(range);

        handleBackspace();

        var text = editor.body.firstChild;

        equal(text.nodeValue.replace(/\ufeff/g, "BOM"), "foobar");
        ok(!defaultPrevented);
    });

    test("converts empty list to paragraph", function() {
        var range = createRangeFromText(editor, '<ul><li>\ufeff||foo</li></ul>');
        editor.selectRange(range);

        handleBackspace();

        equal(editor.value(), "<p>foo</p>");
        ok(defaultPrevented);
    });

    test("caret position is kept in element", function() {
        editor.value('<ul><li><em>foo</em></li></ul>');
        var range = editor.createRange();
        range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild, 0);
        range.collapse(true);
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<p><em><a></a>foo</em></p>");
    });

    test("does not change selection unnecessarily", function() {
        editor.selectRange(createRangeFromText(editor, 'foo||bar'));

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "foo<a></a>bar");
    });

    test("delete clears table contents", function() {
        var range = createRangeFromText(editor, '<table><tr><td>fo|o</td><td>b|ar</td></tr></table>');
        editor.selectRange(range);

        handleDelete();

        equal(editor.value(), '<table><tbody><tr><td>fo</td><td>ar</td></tr></tbody></table>');
    });

    test("backspace at start of element joins it with previous", function() {
        editor.value('<h3>foo</h3><h3>bar</h3>');
        var range = editor.createRange();
        range.setStart($("h3", editor.body)[1].firstChild, 0);
        range.collapse(true);
        editor.selectRange(range);

        handleBackspace();

        equal(editor.value(), '<h3>foobar</h3>');

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), '<h3>foo<a></a>bar</h3>');
    });

    test("prevents default action if handling range selection", function() {
        var range = createRangeFromText(editor, '<p>foo |bar |baz</p>');
        editor.selectRange(range);

        handleBackspace();

        equal(editor.value(), "<p>foo baz</p>");
    });

    test("fully removes selected content", function() {
        var range = createRangeFromText(editor, '<p>fo|o</p><p>b|ar</p>');
        editor.selectRange(range);

        handleBackspace();

        equal(editor.value(), "<p>foar</p>");
    });

    test("positions cursor at location of removed content", function() {
        var range = createRangeFromText(editor, '<p>fo|o</p><p>b|ar</p>');
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<p>fo<a></a>ar</p>");
    });

    test("does not join table cells", function() {
        var range = createRangeFromText(editor, '<table><tbody><tr><td>fo|o</td><td>b|ar</td></tbody></table>');
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<table><tbody><tr><td>fo<a></a></td><td>ar</td></tr></tbody></table>");
    });

    test("joins header and paragraph", function() {
        var range = createRangeFromText(editor, '<h1>fo|o</h1><p>b|ar</p>');
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<h1>fo<a></a>ar</h1>");
    });

    test("positions cursor when deleting data", function() {
        var range = createRangeFromText(editor, '<p>fo|ob|ar</p>');
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<p>fo<a></a>ar</p>");
    });

    test("positions cursor when deleting data at start", function() {
        var range = createRangeFromText(editor, '<p>|foob|ar</p>');
        editor.selectRange(range);

        handleBackspace();

        editor.getRange().insertNode(editor.document.createElement("a"));

        equal(editor.value(), "<p><a></a>ar</p>");
    });

    //test("does not remove table cells", function() {
        //editor.value("<table><tr><td>foo</td><td>bar</td></tr></table>");

        //var td = $(editor.body).find("td");
        //var range = editor.createRange();
        //range.setStartBefore(td[0]);
        //range.setEndAfter(td[1]);
        //editor.selectRange(range);

        //handleDelete();

        //equal(editor.value(), "<table><tr><td></td><td></td></tr></table>");
    //});

}());
