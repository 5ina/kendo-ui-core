(function(){

var editor;
var keys = kendo.keys;

editor_module("editor toolbar", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
    },
    teardown: function() {
        removeMocksIn(editor.toolbar);
        editor.trigger("select");
    }
}, {
    tools: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "fontName",
        "fontSize",
        "foreColor",
        "backColor",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "insertUnorderedList",
        "insertOrderedList",
        "indent",
        "outdent",
        "formatting",
        "createLink",
        "unlink",
        "insertImage",
        "createTable"
    ]
});

var componentType = kendo.support.browser.msie || kendo.support.touch ? 'kendoDropDownList' : 'kendoComboBox';

function value($ui) {
    if (kendo.support.browser.msie) {
        return $.trim($ui.parent().find("span.k-input").text());
    } else {
        return $ui.val();
    }
}

test('initially fontName should have "inherit" value', function () {
    editor.value("foo");

    var component = $('select.k-fontSize').data(componentType);

    equal(component.value(), 'inherit');
});

test('exec with node parameter calls exec', function() {
    var execArgs = [];

    withMock(editor, "exec", function() { execArgs = arguments; }, function() {
        $('.k-i-bold', editor.wrapper).parent().click();

        equal(execArgs.length, 1);
        equal(execArgs[0], 'bold');
    });
});

test("popup buttons do not call exec", function() {
    var called;

    withMock(editor, "exec", function() { called = true; }, function() {
        $("[data-popup]", editor.wrapper).click();

        ok(!called);
    });
});

test('handle carret selection', function() {
    editor.value('<strong>foo</strong>');
    var range = editor.createRange();
    range.setStart(editor.body.firstChild.firstChild, 1);
    range.setEnd(editor.body.firstChild.firstChild, 1);

    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.trigger('select');

    ok($('.k-i-bold', editor.wrapper).parent().hasClass('k-state-selected'));
});

test('handle word selection', function() {
    editor.value('<strong>foo</strong>');
    var range = editor.createRange();
    range.selectNodeContents(editor.body.firstChild);

    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.trigger('select');

    ok($('.k-i-bold', editor.wrapper).parent().hasClass('k-state-selected'));
});

test('handle mixed selection', function() {
    editor.value('<ul><li>foo</li></ul><ul><li>bar</li></ul>');
    var range = editor.createRange();
    range.setStart(editor.body.firstChild.firstChild.firstChild, 1);
    range.setEnd(editor.body.firstChild.firstChild.firstChild, 1);

    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.trigger('select');

    ok(!$('k-i-list-unordered', editor.wrapper).hasClass('k-state-selected'));
});

test('handle image selection', function() {
    editor.value('<img style="float:right" src="foo" />');
    var range = editor.createRange();
    range.selectNode(editor.body.firstChild);

    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.trigger('select');

    ok($('.k-i-align-right', editor.wrapper).parent().hasClass('k-state-selected'));
});

if (!kendo.support.browser.msie) {
    // select box does not show custom values

    test('font size combobox on mixed content', function() {
        editor.selectRange(createRangeFromText(editor, '|foo<span style="font-size:8px;">bar|</span>'));

        editor.trigger('select');

        equal(value($('.k-fontSize', editor.wrapper)), '');
    });

    test('font size combobox on custom font size', function() {
        editor.selectRange(createRangeFromText(editor, '<span style="font-size:8px;">f|o|o</span>'));

        editor.trigger('select');

        equal(value($('.k-fontSize', editor.wrapper)), '8px');
    });
}

test('inherited font size', function() {
    editor.selectRange(createRangeFromText(editor, '<span>f|o|o</span>'));

    editor.trigger('select');

    equal(value($('.k-fontSize', editor.wrapper)), editor.options.messages.fontSizeInherit);
});

test('font size combobox on relative font size', function() {
    editor.selectRange(createRangeFromText(editor, '<span style="font-size:x-small;">f|o|o</span>'));

    editor.trigger('select');

    equal(value($('.k-fontSize', editor.wrapper)), '2 (10pt)');
});

test('formatting tool should display format initially', function() {
    editor.value('');
    editor.focus();
    editor.trigger('select');
    equal($('.k-formatting').closest('.k-widget').find('.k-input').text(), 'Format');
});

test('formatting tool displays known values', function() {
    var range = createRangeFromText(editor, '<p>|foo|</p>');
    editor.selectRange(range);
    editor.trigger('select');
    equal($('.k-formatting').closest('.k-widget').find('.k-input').text(), 'Paragraph');
});

    test('toolbar is bound once again in new tools are provided', function () {
        mockFunc(editor.toolbar, "bindTo");
        editor.setOptions({tools: ["foreColor"]});

        ok(editor.toolbar.bindTo.called);
    });

var toolbar;
var dom;
var editorElement = $("<div />");
var editorNS = kendo.ui.editor;
var toolCssClassNames = {

    "unlink" : "unlink-horizontal",
    "insert-image" : "image",
    "create-link" : "link-horizontal"
};

var mockedToolbarModule = {
    setup: function() {
        dom = $("<ul class='k-editor-toolbar' />").appendTo(QUnit.fixture);
        toolbar = new editorNS.Toolbar(dom[0]);
        $.fn.press = function (key) {
            $(this).trigger({
                type: "keydown",
                keyCode: key
            });
        };
    },

    teardown: function() {
        toolbar.destroy();
        kendo.destroy(QUnit.fixture);
    }
};

module("editor toolbar configuration & rendering", mockedToolbarModule);

function mockEditorTools(array, options) {
    return {
        element: editorElement,
        options: $.extend({
            tools: array,
            messages: {
                bold: "Bold",
                italic: "Italic",
                underline: "Underline",
                strikethrough: "Strikethrough",
                superscript: "Superscript",
                subscript: "Subscript",
                justifyCenter: "Center text",
                justifyLeft: "Align text left",
                justifyRight: "Align text right",
                justifyFull: "Justify"
            }
        }, options),
        bind: $.noop,
        exec: $.noop
    };
}

function bindToMock(array, options) {
    toolbar.bindTo(mockEditorTools(array, options));
}

function getTool(className) {
    if (toolCssClassNames[className]) {
        className = toolCssClassNames[className];
    }
    var tool = dom.find(".k-" + className + ", .k-i-" + className);

    if (tool.hasClass("k-tool-icon")) {
        tool = tool.closest(".k-tool");
    }

    return tool;
}


test("expands tool configuration for default tool", function() {
    bindToMock([ "bold" ]);

    ok(toolbar.tools.bold);
    equal(toolbar.tools.bold.options.name, "bold");
    equal(dom.find(".k-i-bold").length, 1);
});

test("expands tool configuration for custom tool", function() {
    bindToMock([ { name: "foo" } ]);

    ok(toolbar.tools.foo);
    equal(toolbar.tools.foo.options.name, "foo");
    equal(toolbar.tools.foo.options.type, "button");
    equal(dom.find(".k-i-foo").length, 1);
});

test("expands native tools", function() {
    bindToMock([]);

    ok(toolbar.tools.undo);
    ok(toolbar.tools.redo);
    ok(toolbar.tools.insertParagraph);
    ok(toolbar.tools.insertLineBreak);
});

test("clicking on tool executes editor command", function() {
    var editorMock = mockEditorTools([ "bold" ]);
    var args;

    editorMock.exec = function() { args = arguments; };

    toolbar.bindTo(editorMock);

    getTool("bold").trigger("click");

    ok(args);
    equal(args[0], "bold");
});

test("pressing enter on a button tool executes editor command", function() {
    var editorMock = mockEditorTools([ "bold" ]);
    var args;

    editorMock.exec = function() { args = arguments; };

    toolbar.bindTo(editorMock);

    getTool("bold").trigger({ type: "keydown", keyCode: keys.ENTER });

    ok(args);
    equal(args[0], "bold");
});

test("pressing enter on a button tool with href attribute does not execute editor command", function() {
    var editorMock = mockEditorTools([ "bold" ]);
    spy(editorMock, "exec");
    toolbar.bindTo(editorMock);

    getTool("bold").attr("href", "#href").trigger({ type: "keydown", keyCode: keys.ENTER });

    equal(editorMock.calls("exec"), 0);
});

test("pressing enter on a drop-down tool does not execute editor command", function() {
    var editorMock = mockEditorTools([ "formatting" ]);
    spy(editorMock, "exec");
    toolbar.bindTo(editorMock);

    getTool("formatting").trigger({ type: "keydown", keyCode: keys.ENTER });

    equal(editorMock.calls("exec"), 0);
});

test("expands configured tools", function() {
    bindToMock([ {
        name: "formatting",
        items: [ { text: "foo", tag: "h1" } ]
    } ]);

    var formatting = dom.find("select.k-formatting");

    ok(formatting.length);

    var dataSource = formatting.data("kendoSelectBox").dataSource;
    equal(dataSource.data().length, 1);
    equal(dataSource.data()[0].text, "foo");
});

test("toolById returns tool", function() {
    bindToMock([ { name: "foo" }, { name: "bar" } ]);

    var tool = toolbar.toolById("bar");

    ok(tool);
    equal(tool.options.name, "bar");
});

test("snippets tool is not shown if it has no items", function() {
    bindToMock([]);

    equal(dom.find("li").length, 0);
});

test("unlink tool applies custom title", 2, function() {
    bindToMock([ "unlink" ], { messages: { unlink: "foo" } });

    equal(getTool("unlink").attr("title"), "foo");
    equal(getTool("unlink").children(".k-tool-text").html(), "foo");
});

test("clicking disabled links should not navigate", function() {
    bindToMock([ "unlink" ]);

    var isDefaultPrevented = false;
    var navigationListener = function(e) {
        isDefaultPrevented = e.isDefaultPrevented();
    };

    dom.bind("click", navigationListener);

    dom.find(".k-tool.k-state-disabled:first").trigger("click");

    dom.unbind("click", navigationListener);

    ok(isDefaultPrevented);
});

test("first and last buttons in groups get k-group-start/end classes", function() {
    bindToMock([
        "bold", "italic", "underline",
        "insertImage", "createLink"
    ]);

    equal(dom.find("li.k-tool-group").length, 2);
    equal(dom.find(".k-group-start").length, 2);
    equal(dom.find(".k-group-end").length, 2);
    ok(getTool("bold").hasClass("k-group-start"));
    ok(getTool("insert-image").hasClass("k-group-start"));
    ok(getTool("underline").hasClass("k-group-end"));
    ok(getTool("create-link").hasClass("k-group-end"));
});

test("hidden buttons do not end groups", function() {
    bindToMock([
        "createLink", "unlink"
    ]);

    dom.find(".k-i-unlink-horizontal").addClass(".k-state-disabled");
    toolbar.update();

    ok(getTool("create-link").hasClass("k-group-end"));
});

test("shown groups do are the only group end", function() {
    bindToMock([
        "indent", "outdent"
    ]);

    getTool("outdent").addClass("k-state-disabled");
    toolbar.update();
    getTool("outdent").removeClass("k-state-disabled");
    toolbar.update();

    ok(!getTool("indent").hasClass("k-group-end"));
});

test("break tool renders row breaking element", function() {
    bindToMock([
        "bold", "italic", "underline", "break",
        "createLink", "unlink"
    ]);

    equal(getTool("row-break").length, 1);
});

test("custom tools are moved into new groups", function() {
    bindToMock([
        "formatting",
        { name: "custom", template: "<b class='foo' />" },
        "fontName"
    ]);

    equal(getTool("tool-group").length, 3);
});

test("custom tools are moved into separate groups", function() {
    bindToMock([
        { name: "custom1", template: "<b class='foo' />" },
        { name: "custom2", template: "<b class='bar' />" }
    ]);

    equal(getTool("tool-group").length, 2);
});

test("custom tools exec function is bound to tool click", 2, function() {
    bindToMock([
        { name: "custom1", exec: function() {
            ok(true);
            equal(this, editorElement[0]);
        } }
    ]);

    dom.find(".k-tool").trigger("click");
});

test("buttons honor tooltip configuration", function() {
    bindToMock([
        { name: "custom", tooltip: "foo" }
    ]);

    equal(dom.find(".k-tool").attr("title"), "foo");
});

test("nameless custom commands are rendered", function() {
    bindToMock([
        { template: "<span class='foo' />" }
    ]);

    equal(dom.find(".foo").length, 1);
});

module("editor toolbar button tool", mockedToolbarModule);

test("should be rendered as anchor", function() {
    bindToMock([ "bold" ]);;
    var tool = getTool("bold");

    equal($(tool).is("a"), true);
});

test("should be rendered with tabindex", function() {
    bindToMock([ "bold" ]);;
    var tool = getTool("bold");

    equal($(tool).attr("tabindex"), 0);
});

test("should be rendered with role='button'", function() {
    bindToMock([ "bold" ]);;
    var tool = getTool("bold");

    equal($(tool).attr("role"), "button");
});

module("destroy", {
    setup: function() {
        dom = $("<ul class='k-editor-toolbar' />").appendTo(QUnit.fixture);
        toolbar = new editorNS.Toolbar(dom[0], { popup: true });
    },
    teardown: function() {
        dom.remove();

        if (toolbar && toolbar.destroy) {
            toolbar.destroy();
        }
    }
});

test("destroy destroys popup window", function() {
    bindToMock([ "bold" ]);

    var called;

    withMock(toolbar.window, "destroy", function() { called = true; }, function() {
        toolbar.destroy();

        ok(called);
    });
});

test("destroy calls destroy on tools", function() {
    bindToMock([ "bold" ]);

    var called;

    withMock(toolbar.tools.bold, "destroy", function() { called = true; }, function() {
        toolbar.destroy();

        ok(called);
    });
});

test("destroy destroys popup", function() {
    bindToMock([ "createTable" ]);

    var called;
    var popup = toolbar.toolById("createtable")._popup;

    withMock(popup, "destroy", function() { called = true; }, function() {
        toolbar.destroy();

        ok(called);
    });
});



module("editor toolbar keyboard navigation", mockedToolbarModule);

function active() {
    return $(kendo._activeElement());
}

function isToolActive(className) {
    return active()[0] == getTool(className)[0];
}

test("focuses first tool if it is a drop-down", function() {
    bindToMock([ "formatting" ]);

    toolbar.focus();

    equal(dom.find(".k-dropdown-wrap.k-state-focused").length, 1);
});

test("focuses first tool if it is a button", function() {
    bindToMock([ "bold" ]);

    toolbar.focus();

    ok(isToolActive("bold"));
});

test("right arrow focuses next tool", function() {
    bindToMock([ "bold", "italic" ]);

    getTool("bold").press(keys.RIGHT);

    ok(isToolActive("italic"));
});

test("right arrow focuses tool in next group", function() {
    bindToMock([ "bold", "createLink" ]);

    getTool("bold").press(keys.RIGHT);

    ok(isToolActive("create-link"));
});

test("right arrow focuses first tool in next group", function() {
    bindToMock([ "bold", "createLink", "unlink" ]);

    getTool("bold").press(keys.RIGHT);

    ok(isToolActive("create-link"));
});

test("left arrow focuses previous tool", function() {
    bindToMock([ "bold", "italic" ]);

    getTool("italic").press(keys.LEFT);

    ok(isToolActive("bold"));
});

test("right arrow focuses tool in next group", function() {
    bindToMock([ "bold", "createLink" ]);

    getTool("create-link").press(keys.LEFT);

    ok(isToolActive("bold"));
});

test("right arrow skips disabled tools", function() {
    bindToMock([ "bold", "italic", "underline" ]);

    getTool("italic").addClass("k-state-disabled");

    getTool("bold").press(keys.RIGHT);

    ok(isToolActive("underline"));
});

test("right arrow focuses color picker", function() {
    bindToMock([ "bold", "foreColor", "underline" ]);

    getTool("bold").press(keys.RIGHT);

    ok(active().is(".k-colorpicker"));
});

}());
