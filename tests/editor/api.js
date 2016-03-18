(function(){

module("editor api", {
    setup: function() {
        QUnit.fixture.append(
            '<textarea cols="20" rows="4" id="editor"></textarea>' +
            '<div id="inline" contentEditable></div>'
        );
    },
    teardown: function() {
        kendo.destroy(QUnit.fixture);
        kendo.destroy("[data-role=window]");
    }
});

test("value returns unencoded value if encoded is false", function() {
    var editor = new kendo.ui.Editor("#editor", {
        encoded: false
    });

    editor.value("<p>foo</p>");

    editor.update();

    equal(editor.textarea.val(), "<p>foo</p>");
});

test("stylesheets config option renders stylesheets in the editing area", function() {
    var editor = new kendo.ui.Editor("#editor", {
        stylesheets: [
            "/base/tests/editor/editorStyles.css"
        ]
    });

    var links = $("link", editor.document);

    equal(links.eq(0).attr("href"), "/base/tests/editor/editorStyles.css");
});

test("value method does not remove selection if provided value is the same as the current text", function() {
    var editor = new kendo.ui.Editor("#editor");

    editor.value("<p>foo</p>");

    var range = editor.createRange();
    var p = editor.body.firstChild.firstChild;
    range.setStart(p, 1);
    range.setEnd(p, 2);

    editor.selectRange(range);

    editor.value("<p>foo</p>");

    range = editor.getRange();

    equal(range.startOffset, 1);
    equal(range.endOffset, 2);
});

test("value method passes serialization options to serializer", function() {
    var editor = new kendo.ui.Editor("#editor", {
        serialization: {
            entities: false
        },
        value: "foo ä bar"
    });

    equal(editor.value(), "foo ä bar");
});

test("value method refreshes toolbar tools", function() {
    var editor = new kendo.ui.Editor("#editor");
    var refreshSpy = spy(editor.toolbar, "refreshTools")

    editor.value("<p>content change</p>");

    equal(refreshSpy.calls("refreshTools"), 1);
});

test("restoreSelection restores element selection", function() {
    var editor = new kendo.ui.Editor("#inline");

    editor.value("foo bar baz");

    var text = editor.body.firstChild;

    var range = editor.createRange();
    range.setStart(text, 4);
    range.setEnd(text, 7);
    editor.selectRange(range);

    QUnit.fixture.append('<p>lorem ipsum</p>');

    var con = editor.createRange();
    con.selectNodeContents(QUnit.fixture.find("p")[0]);
    editor.selectRange(con);

    editor.restoreSelection();

    range = editor.getRange();

    equal(range.startContainer, text);
    equal(range.startOffset, 4);
    equal(range.endContainer, text);
    equal(range.endOffset, 7);
});

function selectRangeInValue(editor, value) {
    editor.selectRange(createRangeFromText(editor, value));
}

test("state returns true when tool is toggled", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>f|o|o</em");

    ok(editor.state("italic"));
});

test("state returns false when tool is not toggled", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>f|o|o</em");

    ok(!editor.state("bold"));
});

test("state returns false when tool does not provide a finder", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>f|o|o</em");

    ok(!editor.state("insertImage"));
});

test("state returns false for unknown tools", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>f|o|o</em");

    ok(!editor.state("foo"));
});

test("state returns true when range is collapsed", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>fo||o</em");

    ok(editor.state("italic"));
});

test("state returns format for tools that support it", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<span style='color: #f00'>f|o|o</span>");

    ok(/^#(f00|ff0000)$/i.test(editor.state("foreColor")));
});

test("state returns font name", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<span style='font-family: Arial'>f|o|o</span>");

    equal(editor.state("fontName"), "Arial");
});

test("state returns true when in non-expandable range", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<em>foo||:</em>");

    ok(editor.state("italic"));
});

test("state returns true in unordered lists", function() {
    var editor = new kendo.ui.Editor("#editor");

    selectRangeInValue(editor, "<ul><li>||</li></ul>");

    ok(editor.state("insertUnorderedList"));
});

test("refresh works with inline editor", function() {
    var editor = new kendo.ui.Editor("#inline");

    editor.refresh();

    ok(true);
});

test("destroy destroys toolbar", function() {
    var editor = new kendo.ui.Editor("#inline");

    var called;

    withMock(editor.toolbar, "destroy", function() { called = true; }, function() {
        editor.destroy();

        ok(called);
    });

    editor.toolbar.destroy();
});

test("selectedHtml returns selected whitespace", function() {
    var editor = new kendo.ui.Editor("#editor", {
        value: "foo bar"
    });

    var range = editor.createRange();
    var node = editor.document.body.firstChild;

    range.setStart(node, 3);
    range.setEnd(node, node.length);

    editor.selectRange(range);

    equal(editor.selectedHtml(), " bar");
});

test("paste method inserts content", function() {
    var editor = new kendo.ui.Editor("#editor", { tools: [] });

    editor.value("");

    editor.paste("<p>foo</p>");

    equal(editor.value(), "<p>foo</p>");
});

test("paste method allows content insertion without splitting", function() {
    var editor = new kendo.ui.Editor("#editor", { tools: [] });

    editor.value("<em>foobar</em>");

    var range = editor.getRange();

    range.setStart(editor.body.firstChild.firstChild, 3);
    range.collapse(true);

    editor.selectRange(range);

    editor.paste("<strong>baz</strong>", { split: false });

    equal(editor.value(), "<em>foo<strong>baz</strong>bar</em>");
});

test("paste method is pushed to undo/redo stack", function() {
    var editor = new kendo.ui.Editor("#editor", { tools: [] });

    editor.value("");

    editor.paste("<p>foo</p>");

    editor.exec("undo");

    equal(editor.value(), "");
});

test("paste method does not require focus of inline editor", function() {
    var editor = new kendo.ui.Editor("#inline");

    editor.value("");

    $("#editor").focus();

    editor.paste("<p>foo</p>");

    equal(editor.value(), "<p>foo</p>");
});

test("inline Editor toolbar does not show on focus when widget is readonly", function () {
    var editor = new kendo.ui.Editor("#inline");

    editor.value('<a href="#" tabindex="1" id="focusable-link">focusable link</a>');

    editor.body.removeAttribute("contenteditable");

    document.getElementById("focusable-link").focus();

    ok(!editor.toolbar.element.is(":visible"));
});

})();
