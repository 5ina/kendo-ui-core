(function(){

var InlineFormatFinder = kendo.ui.editor.InlineFormatFinder;
var finder;
var formats;

editor_module("editor inline format finder", {
   setup: function() {
       editor = $("#editor-fixture").data("kendoEditor");
       formats = editor.options.formats;
   }
});

test('findSuitable() does not return for single text node', function() {
    editor.value('foo');

    finder = new InlineFormatFinder(formats.bold);
    ok(null === finder.findSuitable(editor.body.firstChild));
});

test('findSuitable() returns matching tag', function() {
    editor.value('<span>foo</span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.firstChild), editor.body.firstChild);
});

test('findSuitable() returns closest', function() {
    editor.value('<span><span>foo</span></span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.firstChild.firstChild), editor.body.firstChild.firstChild);
});

test('findSuitable() does not return in case of partial selection', function() {
    editor.value('<span>foo<em>bar</em></span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.firstChild), null);
});

test('findSuitable() skips caret marker', function() {
    editor.value('<span><span class="k-marker"></span>foo<span class="k-marker"></span>bar<span class="k-marker"></span></span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.firstChild), editor.body.firstChild);
});

test('findSuitable() skips beginning and end marker', function() {
    editor.value('<span><span class="k-marker"></span>foobar<span class="k-marker"></span></span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.childNodes[1]), editor.body.firstChild);
});

test('findSuitable() does not skip mid-element markers', function() {
    editor.value('<span>foo <span class="k-marker"></span>ba<span class="k-marker"></span>az<span class="k-marker"></span> bar</span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.childNodes[2]), null);
});


test("findSuitable() does not break out of element", function() {
    editor.value('<span>foo <em><span class="k-marker"></span>bar<span class="k-marker"></span></em> baz</span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findSuitable(editor.body.firstChild.childNodes[1].childNodes[1]), null);
});

test('findFormat() finds formatted node by tag', function() {
    editor.value('<strong>foo</strong>');

    finder = new InlineFormatFinder(formats.bold);

    equal(finder.findFormat(editor.body.firstChild.firstChild), editor.body.firstChild);
});

test('findFormat() finds formatterd node by tag and style', function() {
    editor.value('<span style="text-decoration:underline">foo</span>');

    finder = new InlineFormatFinder(formats.underline);

    equal(finder.findFormat(editor.body.firstChild.firstChild), editor.body.firstChild);
});

test('findFormat() returns null if node does not match tag and style', function() {
    editor.value('<span>foo</span>');

    finder = new InlineFormatFinder(formats.underline);

    ok(null === finder.findFormat(editor.body.firstChild.firstChild));
});

test('findFormat() returns parent element', function() {
    editor.value('<span style="text-decoration:underline"><span>foo</span></span>');

    finder = new InlineFormatFinder(formats.underline);
    equal(finder.findFormat(editor.body.firstChild.firstChild.firstChild), editor.body.firstChild);
});

test('findFormat() checks all formats', function() {
    editor.value('<span style="font-weight:bold">foo</span>');

    finder = new InlineFormatFinder(formats.bold);

    equal(finder.findFormat(editor.body.firstChild.firstChild), editor.body.firstChild);
});

test('isFormatted() returns true if at least one node has format', function() {
    editor.value('<span style="font-weight:bold">foo</span>');

    finder = new InlineFormatFinder(formats.bold);
    ok(finder.isFormatted([editor.body.firstChild.firstChild]));
});

test('isFormatted() returns false if all nodes dont have format', function() {
    editor.value('foo');

    finder = new InlineFormatFinder(formats.bold);
    ok(!finder.isFormatted([editor.body.firstChild]));
});

test('isFormatted() returns true for formatted and unformatted nodes', function() {
    editor.value('<strong>foo</strong>bar');

    finder = new InlineFormatFinder(formats.bold);
    ok(finder.isFormatted([editor.body.firstChild.firstChild, editor.body.lastChild]));
});

test('isFormatted() returns true when the format node is the argument', function() {
    editor.value('<strong>foo</strong>');

    finder = new InlineFormatFinder(formats.bold);
    ok(finder.isFormatted([editor.body.firstChild]));
});

test("isFormatted() returns true for legacy styles", function() {
    editor.value("");
    $(editor.body).html("<b><i><u>foo</u></i></b>");

    var foo = editor.body.firstChild.firstChild.firstChild.firstChild;

    finder = new InlineFormatFinder(formats.bold);
    ok(finder.isFormatted([foo]));
    finder = new InlineFormatFinder(formats.italic);
    ok(finder.isFormatted([foo]));
    finder = new InlineFormatFinder(formats.underline);
    ok(finder.isFormatted([foo]));
});
}());
