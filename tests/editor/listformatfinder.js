(function(){

var editor;
var inlineDom;

editor_module("editor list format finder", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
        inlineDom = $('<div id="inline"></div>').appendTo(QUnit.fixture);
    },
    teardown: function() {
        kendo.destroy(QUnit.fixture);
    }
});

var ListFormatFinder = kendo.ui.editor.ListFormatFinder;

test('isFormatted returns false for text node', function() {
    editor.value('test');
    var finder = new ListFormatFinder('ul');
    ok(!finder.isFormatted([editor.body.firstChild]));
});

test('isFormatted returns false for mixed selection node', function () {
    editor.value('<ul><li>foo</li></ul><p>bar</p>');
    var finder = new ListFormatFinder('ul');
    ok(!finder.isFormatted([editor.body.firstChild.firstChild.firstChild, editor.body.childNodes[1].firstChild]));
});

test('isFormatted returns true for list', function() {
    editor.value('<ul><li>foo</li></ul>');
    var finder = new ListFormatFinder('ul');
    ok(finder.isFormatted([editor.body.firstChild.firstChild.firstChild]));
});

test('isFormatted returns true for list items from the same list', function() {
    editor.value('<ul><li>foo</li><li>bar</li></ul>');
    var finder = new ListFormatFinder('ul');
    ok(finder.isFormatted([editor.body.firstChild.firstChild.firstChild, editor.body.firstChild.lastChild.firstChild]));
});

test('isFormatted returns false for two lists', function() {
    editor.value('<ul><li>foo</li></ul><ul><li>bar</li></ul>');
    var finder = new ListFormatFinder('ul');
    ok(!finder.isFormatted([editor.body.firstChild.firstChild.firstChild, editor.body.childNodes[1].firstChild.firstChild]));
});

test('isFormatted returns true for multiple lists in table cells', function() {
    editor.value("<table><tbody><tr><td><ul><li>foo</li></ul></td><td><ul><li>bar</li></ul></td></tr></tbody></table>");

    var lis = editor.document.getElementsByTagName("li");

    var finder = new ListFormatFinder('ul');
    ok(finder.isFormatted([lis[0].firstChild, lis[1].firstChild]));
});

test('findSuitable returns ul', function() {
    editor.value('<ul><li>foo</li></ul>bar');
    var finder = new ListFormatFinder('ul');
    equal(finder.findSuitable([editor.body.firstChild.firstChild.firstChild, editor.body.childNodes[1]]), editor.body.firstChild);

});

test('findSuitable returns first ul for adjacent lists', function() {
    editor.value('<ul><li>foo</li></ul><ul><li>bar</li></ul>');
    var finder = new ListFormatFinder('ul');
    var firstUl = editor.body.firstChild;
    var secondUl = editor.body.childNodes[1];
    equal(finder.findSuitable([firstUl.firstChild.firstChild, secondUl.firstChild.firstChild]), firstUl);
});

test('findSuitable returns null when ul is not first sibling', function() {
    editor.value('<ol><li>foo</li></ol><ul><li>bar</li></ul>');
    var finder = new ListFormatFinder('ul');
    var firstList = editor.body.firstChild;
    var secondList = editor.body.childNodes[1];
    ok(null === finder.findSuitable([firstList.firstChild.firstChild, secondList.firstChild.firstChild]));
});

test('isFormatted returns false in mixed list scenario', function() {
    editor.value('<ol><li>foo<ul><li>bar</li></ul></li></ol>');
    var finder = new ListFormatFinder('ol');
    ok(!finder.isFormatted([$(editor.body).find('ul li')[0].firstChild]));
});

test('findSuitable returns null when ul is nested in ol', function() {
    editor.value('<ol><li>foo<ul><li>bar</li></ul></li></ol>');
    var finder = new ListFormatFinder('ol');
    ok(null === finder.findSuitable([$(editor.body).find('ul li')[0].firstChild]));
});

test("findSuitable returns null for inline editor container", function() {
    var inline = new kendo.ui.Editor(inlineDom);
    inline.value("foo");

    var finder = new ListFormatFinder('ul');

    ok(!finder.findSuitable([inline.body.firstChild]));
});

test("findSuitable returns null when list elements are found outside editor", function() {
    var ul = $("<ul><li /></ul>").appendTo(QUnit.fixture);
    inlineDom.appendTo(ul.find("li:first"));

    var inline = new kendo.ui.Editor(inlineDom);
    inline.value("foo");

    var finder = new ListFormatFinder('ul');

    ok(!finder.findSuitable([inline.body.firstChild]));
});

}());
