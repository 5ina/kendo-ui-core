(function(){

var editor;
var Serializer = kendo.ui.editor.Serializer;

editor_module("editor serialization", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
    }
});

function serializeCycle(html, options) {
    return Serializer.domToXhtml(Serializer.htmlToDom(html, QUnit.fixture[0]), options);
}

function verifyCycle(html, options) {
    equal(serializeCycle(html, options), html);
}

test('value reciprocity', function() {
    editor.value("<p>foo</p>");

    equal(editor.value(), "<p>foo</p>");
});

test('closes empty tags', function() {
    editor.value('<hr>');
    equal(editor.value(), '<hr />');
});

test('converts to lower case', function() {
    editor.value('<hr>');
    equal(editor.value(), '<hr />');
});

test('converts mixed case to lower case', function() {
    editor.value('<hr>');
    equal(editor.value(), '<hr />');
});

test('returns child tags', function() {
    editor.value('<div><span></div>');
        equal(editor.value(), '<div><span></span></div>');
});

test('returns root text nodes', function() {
    editor.value('test');
    equal(editor.value(), 'test');
});

test('returns child text nodes', function() {
    editor.value('<span>test</span>');
    equal(editor.value(), '<span>test</span>');
});

test('fills attributes', function() {
    editor.value('<input type=hidden>');
    equal(editor.value(), '<input type="hidden" />');
});

test('expands attributes', function() {
    editor.value('<hr disabled>');
    equal(editor.value(), '<hr disabled="disabled" />');
});

test('fills custom attributes', function() {
    editor.value('<hr test="test">');
    equal(editor.value(), '<hr test="test" />');
});

test('caps attributes', function() {
    editor.value('<hr CLASS="test">');
    equal(editor.value(), '<hr class="test" />');
});

test('attributes containing dashes', function() {
    editor.value('<hr class=k-input />');
    equal(editor.value(), '<hr class="k-input" />');
});

test('adds closing tag', function() {
    editor.value('<strong>');
    equal(editor.value(), '<strong></strong>');
});

test('fixes improperly nested inline tags', function() {
    editor.value('<strong><span></strong></span>');
    equal(editor.value(), '<strong><span></span></strong>');
});

test('handles style attribute values', function() {
    editor.value('<div style="text-align:left"></div>');

    equal(editor.value(), '<div style="text-align:left;"></div>');
});

test('handles style color values', function() {
    editor.value('<div style="color:#000000"></div>');
    equal(editor.value(), '<div style="color:#000000;"></div>');
});

test('comments', function() {
    editor.value('<!-- comment -->');
    equal(editor.value(), '<!-- comment -->');
});

test('cdata', function() {
    editor.value('<![CDATA[test]]>');
    equal(editor.value(), '<![CDATA[test]]>');
});

test('b converted to strong', function() {
    editor.value('<b></b>');
    equal(editor.value(), '<strong></strong>');
});

test('i converted to em', function() {
    editor.value('<i></i>');
    equal(editor.value(), '<em></em>');
});

test('u converted to span with underline style', function() {
    editor.value('<u></u>');
    equal(editor.value(), '<span style="text-decoration:underline;"></span>');
});

test('font converted to span', function() {
    editor.value('<font color="#ff0000" face="verdana" size="5">foo</font>');
    equal(editor.value(), '<span style="color:#ff0000;font-family:verdana;font-size:x-large;">foo</span>');
});

test('script tag is removed', function() {
    equal(serializeCycle('<script>var answer=42;<\/script>', { scripts: false }), "");
});

test('script tag not executed', function() {
    editor.value('<script>var answer=42;<\/script>');
    ok(undefined === window.answer);
});

test('script tag content is not visible', function () {
    editor.value('<script id="script42">var answer=42;<\/script>');
    ok(!$(editor.body).find("#script42").is(":visible"));
});

test('br moz dirty removed', function() {
    editor.value('<br _moz_dirty="">');
    equal(editor.value(), '');
});

test('br k-br removed', function() {
    editor.value('<br class="k-br">');
    equal(editor.value(), '');
});

test('moz dirty removed', function() {
    editor.value('<hr _moz_dirty="">');
    equal(editor.value(), '<hr />');
});

test('multiple attributes sorted alphabetically', function() {
    editor.value('<input type="button" class="k-button" style="display:none;" />');
    equal(editor.value(), '<input class="k-button" style="display:none;" type="button" />');
});

test('javascript attributes are stripped', function() {
    equal(serializeCycle('<input type="button" onclick="alert(1)" />'), '<input type="button" />');
});

test('value attribute', function() {
    editor.value('<input type="button" value="test" />');
    equal(editor.value(), '<input type="button" value="test" />');
});

test('type text attribute', function() {
    editor.value('<input type="text" value="test" />');
    equal(editor.value(), '<input type="text" value="test" />');
});

test('style ending with whitespace', function() {
    editor.value('<hr style="display:none; " />');
    equal(editor.value(), '<hr style="display:none;" />');
});

test('href without quotes', function() {
    editor.value('<a href=foo>a</a>');
    equal(editor.value(), '<a href="foo">a</a>');
});

test('href without quotes and with whitespace', function() {
    editor.value('<a href= foo >a</a>');
    equal(editor.value(), '<a href="foo">a</a>');
});

test('href without quotes and whith other attrubutes', function() {
    editor.value('<a href= foo class=test>a</a>');
    equal(editor.value(), '<a class="test" href="foo">a</a>');
});

test('href with single quotes', function() {
    editor.value('<a href=\'foo\'>a</a>');
    equal(editor.value(), '<a href="foo">a</a>');
});

test('href with hash', function() {
    editor.value('<a href="#hash">a</a>');
    equal(editor.value(), '<a href="#hash">a</a>');
});

test('href with absolute', function() {
    editor.value('<a href="http://www.example.com">a</a>');
    equal(editor.value(), '<a href="http://www.example.com">a</a>');
});

test('href with absolute and url content', function() {
    editor.value('<a href="http://www.example.com">www.example.com</a>');
    equal(editor.value(), '<a href="http://www.example.com">www.example.com</a>');
});

test('attributes starting with underscore moz are removed', function() {
    editor.value('<hr _moz_resizing="true" />');
    equal(editor.value(), '<hr />');
});

test('empty whitespace trimmed', function() {
    editor.value('<hr />      ');
    equal(editor.value(), '<hr />');
});

test('whitespace empty whitespace trimmed', function() {
    editor.value('           <hr />');
    equal(editor.value(), '<hr />');
});

test('empty whitespace before inline marker trimmed', function() {
    editor.value('           <a></a>');
    equal(editor.value(), '<a></a>');
});

test('empty whitespace before inline node trimmed', function() {
    editor.value('           <a>foo</a>');
    equal(editor.value(), '<a>foo</a>');
});

test('inline whitespace is collapsed', function() {
    editor.value('<a>foo</a>     ');
    equal(editor.value(), '<a>foo</a> ');
});

test('whitespace empty block whitespace trimmed', function() {
    editor.value('           <div></div>');
    equal(editor.value(), '<div></div>');
});

test('whitespace block whitespace trimmed', function() {
    editor.value('           <div>foo</div>');
    equal(editor.value(), '<div>foo</div>');
});

test('empty block whitespace trimmed', function() {
    editor.value('<div></div>     ');
    equal(editor.value(), '<div></div>');
});

test('block whitespace trimmed', function() {
    editor.value('<div>foo</div>     ');
    equal(editor.value(), '<div>foo</div>');
});

test('trimming whitespace within content', function() {
    editor.value('<span>foo   bar</span>');
    equal(editor.value(), '<span>foo bar</span>');
});

test('keeping white space in pre', function() {
    editor.value('<pre>foo   bar</pre>');
    equal(editor.value(), '<pre>foo   bar</pre>');
});

test('keeping white space in pre children', function() {
    editor.value('<pre><span>   foo  </span></pre>');
    equal(editor.value(), '<pre><span>   foo  </span></pre>');
});

test('text whitespace inline whitespace collapsed', function() {
    editor.value('foo  <strong>bar</strong>');
    equal(editor.value(), 'foo <strong>bar</strong>');
});

test('text whitespace block whitespace preserved', function() {
    editor.value('foo <div>bar</div>');
    equal(editor.value(), 'foo <div>bar</div>');
});

test('text whitespace empty element whitespace preserved', function() {
    editor.value('foo <hr />');
    equal(editor.value(), 'foo <hr />');
});

test('empty element whitespace text whitespace trimmed', function() {
    editor.value('<hr /> foo');
    equal(editor.value(), '<hr />foo');
});

test('whitespace at end of inline element preserved', function() {
    editor.value('<strong>foo </strong>');
    equal(editor.value(), '<strong>foo </strong>');
});

test('whitespace at beginning of inline element after text', function() {
    editor.value('foo bar<strong> baz</strong>');
    equal(editor.value(), 'foo bar<strong> baz</strong>');
});

test('whitespace at end of inline element after text', function() {
    editor.value('foo bar<strong>baz </strong>');
    equal(editor.value(), 'foo bar<strong>baz </strong>');
});

test('whitespace at end of inline element', function() {
    editor.value('<strong>baz </strong>');
    equal(editor.value(), '<strong>baz </strong>');
});

test('whitespace at beginning of inline element', function() {
    editor.value('<strong> baz</strong>');
    equal(editor.value(), '<strong>baz</strong>');
});

test('whitespace at beginning of inline element before text', function() {
    editor.value('<span>boo <span style="color:red;">foo</span> bar</span>');
    equal(editor.value(), '<span>boo <span style="color:red;">foo</span> bar</span>');
});

test('whitespace after inline element is preserved', function() {
    editor.value('<p><strong>foo</strong> bar</p>');
    equal(editor.value(), '<p><strong>foo</strong> bar</p>');

});

test('complete attribute ignored', function() {
    editor.value('<img complete="complete" />');
    equal(editor.value(), '<img />');
});

test('image discards redundant height', function() {
    editor.value('<img height="2" style="height:2px;" />');
    equal(editor.value(), '<img height="2" />');
});

test('image migrates height from style', function() {
    editor.value('<img style="height:4px;" />');
    equal(editor.value(), '<img height="4" />');
});

test('image discards redundant width', function() {
    editor.value('<img width="2" style="width:2px;" />');
    equal(editor.value(), '<img width="2" />');
});

test('image migrates width from style', function() {
    editor.value('<img style="width:4px;" />');
    equal(editor.value(), '<img width="4" />');
});

test('image maintains non-pixel style widths', function() {
    editor.value('<img style="width:100%;" />');
    equal(editor.value(), '<img style="width:100%;" />');
});

test('image maintains non-pixel style heights', function() {
    editor.value('<img style="height:100%;" />');
    equal(editor.value(), '<img style="height:100%;" />');
});

test('nbsp', function() {
    editor.value('&nbsp;&nbsp;&nbsp;');
    equal(editor.value(), '&nbsp;&nbsp;&nbsp;');
});

test('amp', function() {
    editor.value('&amp;');
    equal(editor.value(), '&amp;');
});

test('lt', function() {
    editor.value('&lt;');
    equal(editor.value(), '&lt;');
});

test('gt', function() {
    editor.value('&gt;');
    equal(editor.value(), '&gt;');
});

test('amp escaped', function() {
    editor.value('&amp;');
    equal(editor.encodedValue(), '&amp;amp;');
});

test('gt escaped', function() {
    editor.value('&gt;');
    equal(editor.encodedValue(), '&amp;gt;');
});

test('nbsp escaped', function() {
    editor.value('&nbsp;');
    equal(editor.encodedValue(), '&amp;nbsp;');
});

if (!kendo.support.browser.msie) {
    test('empty paragraphs are filled with content', function() {
        editor.value('<p> </p>');

        equal(editor.body.firstChild.childNodes.length, 1);
        equal(editor.body.firstChild.firstChild.nodeValue, '\ufeff');
    });
}

test("nbsp in table cell is serialized", function() {
    editor.value("<table><tr><td>&nbsp;</td></tr></table");

    equal(editor.value(), "<table><tbody><tr><td>&nbsp;</td></tr></tbody></table>");
});

test("single quotes in style attribute", function() {
    editor.value('<span style="font-family:\'Verdana\';">foo</span>');
    equal(editor.value(), '<span style="font-family:\'Verdana\';">foo</span>');
});

test('single brs are considered no value (to enable required field validation)', function() {
    editor.value('<br>');
    equal(editor.value(), '');
});

test('single empty paragraph is considered no value (to enable required field validation)', function() {
    editor.value('<p></p>');
    equal(editor.value(), '');
});

test('strips font-size-adjust and font-stretch properties', function() {
    editor.value('<span style="font:12px Verdana;">foo</span>');
    equal(editor.value().replace("/normal", ""), '<span style="font:12px Verdana;">foo</span>');
});

test('reversing quotes in style attribute', function() {
    editor.body.innerHTML = '<span style=\'font:12px "Times New Roman";\'>foo</span>';
    equal(editor.value().replace("/normal", ""), '<span style="font:12px \'Times New Roman\';">foo</span>');
});

test("markers are not serialized", function() {
    editor.body.innerHTML = '<span class="k-marker"></span>foo<span class="k-marker"></span>';
    equal(editor.value(), "foo");
});

test("absolute background-image values are properly serialized", function() {
    editor.value('<div style="background-image:url(http://example.com/foo.gif);">foo</div>');
    equal(editor.value(), '<div style="background-image:url(http://example.com/foo.gif);">foo</div>');
});

test("strong / em tags can be converted to presentational", function() {
    editor.value("<strong>foo</strong><em>bar</em>");
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), "<b>foo</b><i>bar</i>");
});

test("underline span can be converted to presentational u", function() {
    editor.value('<span style="text-decoration:underline;">foo</span>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), "<u>foo</u>");
});

test("font properties from spans are converted to presentational font tags", function() {
    editor.value('<span style="color:#ff0000;font-family:verdana;font-size:x-large;">foo</span>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<font color="#ff0000" face="verdana" size="5">foo</font>');
});

test("span attributes are persisted when outputting presentational tags", function() {
    editor.value('<span class="red">foo</span>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<span class="red">foo</span>');
});

test("presentational span attributes are not duplicated", function() {
    editor.value('<span class="red" style="text-decoration: underline;">foo</span>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<span class="red"><u>foo</u></span>');
});

test("presentational tags are nested properly", function() {
    editor.value('<span style="text-decoration: underline;font-family: verdana; color: #f00" class="red">foo</span>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<span class="red"><u><font color="#ff0000" face="verdana">foo</font></u></span>');
});

test("attributes are persisted for iframe tag", function() {
    editor.value('<iframe data-attr="same data"></iframe>');

    equal(editor.value(), '<iframe data-attr="same data"></iframe>');
});

test("attributes are persisted for strong tag", function() {
    editor.value('<strong data-attr="same data">foo</strong>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<b data-attr="same data">foo</b>');
});

test("attributes are persisted for em tag", function() {
    editor.value('<em data-attr="same data">foo</em>');
    editor.setOptions({ serialization: { semantic: false } });

    equal(editor.value(), '<i data-attr="same data">foo</i>');
});

test("attributes are persisted for b tag", function() {
    editor.value('<b data-attr="same data">foo</b>');
    editor.setOptions({ serialization: { semantic: true } });

    equal(editor.value(), '<strong data-attr="same data">foo</strong>');
});

test("attributes are persisted for i tag", function() {
    editor.value('<i data-attr="same data">foo</i>');
    editor.setOptions({ serialization: { semantic: true } });

    equal(editor.value(), '<em data-attr="same data">foo</em>');
});

test("attributes are persisted for u tags", function() {
    editor.value('<u data-attr="same data">foo</u>');
    editor.setOptions({ serialization: { semantic: true } });

    equal(editor.value(), '<span data-attr="same data" style="text-decoration:underline;">foo</span>');
});

test("elements with class k-table-resize-handle are not serialized", function() {
    editor.body.innerHTML = '<div class="k-table-resize-handle-wrapper"><div class="k-table-resize-handle"></div></div>';

    equal(editor.value(), "");
});

test("elements with class k-column-resize-handle are not serialized", function() {
    editor.body.innerHTML = '<div class="k-column-resize-handle-wrapper"><div class="k-column-resize-handle"></div></div>';

    equal(editor.value(), "");
});

test("elements with class k-row-resize-handle are not serialized", function() {
    editor.body.innerHTML = '<div class="k-row-resize-handle-wrapper"><div class="k-row-resize-handle"></div></div>';

    equal(editor.value(), "");
});

module("editor content parsing");

test("removes onerror attribute", function() {
    equal(Serializer.toEditableHtml('<img src="foo" onerror="alert(1)">'), '<img src="foo">');
});

test("removes whitespace after images", function() {
    // whitespace after images create invalid nodes after cut in IE
    equal(Serializer.toEditableHtml('<img src="foo"> foo'), '<img src="foo">foo');
    equal(Serializer.toEditableHtml('<img src="foo">\nfoo'), '<img src="foo">foo');
    equal(Serializer.toEditableHtml('<img src="foo">\tfoo'), '<img src="foo">foo');
    equal(Serializer.toEditableHtml('<img src="foo">\r\n foo'), '<img src="foo">foo');

    var table = '<table><tr><td>foo</td></tr></table>';
    var blockquote = '<blockquote>foo</blockquote>';
    var br = '<br class="k-br">';
    equal(Serializer.toEditableHtml(table), br + table + br);
    equal(Serializer.toEditableHtml(blockquote), br + blockquote + br);
});

test("encodes scripts", function() {
    // prevent execution and losing content in IE
    equal(Serializer.toEditableHtml('<script>alert(1)</script>'), '<k:script>alert(1)</k:script>');
    equal(Serializer.toEditableHtml('<script src="inline.js"></script>'), '<k:script src="inline.js"></k:script>');
});

test("encodes CDATA sections as comments", function() {
    // some browsers do not allow setting CDATA sections through innerHTML
    equal(Serializer.toEditableHtml('<![CDATA[ whatever ]]>'), '<!--[CDATA[ whatever ]]-->');
});

test("removes whitespace at start before nbsp", function() {
    equal(Serializer.toEditableHtml(' &nbsp; foo'), '&nbsp; foo');
    equal(Serializer.toEditableHtml(' \u00a0 foo'), '\u00a0 foo');
});

test("does not convert relative href/src URLs to absolute", function() {
    // valid for IE < 8
    verifyCycle('<a href="foo">a</a>');
    verifyCycle('<link href="foo" />');
    verifyCycle('<img src="foo" />');
    verifyCycle('<script src="foo"><\/script>', { scripts: true });
});

test("filling empty elements does not trigger errors", function() {
    var fixture = QUnit.fixture[0];
    ok(Serializer.htmlToDom("<p><br></p>", fixture));
    ok(Serializer.htmlToDom("<p><img></p>", fixture));
});

test("does not remove empty elements from content", function() {
    var fixture = QUnit.fixture;

    Serializer.htmlToDom("<p> <img></p>", fixture[0]);
    ok(fixture.find("img").length);

    Serializer.htmlToDom("<p> <input></p>", fixture[0]);
    ok(fixture.find("input").length);
});

test("suppresses script execution", function() {
    var fixture = QUnit.fixture;

    Serializer.htmlToDom('<span onclick="alert(1)">foo</span>', fixture[0]);
    ok(!fixture.find("[onclick]").length, "click attribute is persisted");

    Serializer.htmlToDom('<div onmouseover="alert(1)">foo</div>', fixture[0]);
    ok(!fixture.find("[onmouseover]").length, "mouseover attribute is persisted");

    Serializer.htmlToDom('<script>foo=1</script>', fixture[0]);
    ok(fixture.find("k\\:script").length, "script block is persisted");
});

test("removes k-paste-container elements from content", function() {
    equal(serializeCycle('foo<p class="k-paste-container">bar</p>baz'), "foobaz");
});

test("removes k-marker elements from content", function() {
    equal(serializeCycle('f<span class="k-marker"></span>oob<span class="k-marker"></span>az'), "foobaz");
});

test("encoding of entities can be prevented", function() {
    verifyCycle('foo ä bar', { entities: false });
    verifyCycle('<p>foo ä bar</p>', { entities: false });
});

test("scripts can be permitted through serialization options", function() {
    verifyCycle('<input onclick="alert(1)" type="text" />', { scripts: true });
    verifyCycle('<span onmousedown="confirm()"></span>', { scripts: true });
    verifyCycle('<script>var answer=42;<\/script>', { scripts: true });
});

test("script contents are not HTML-encoded", function() {
    verifyCycle('<script>$.load("foo?bar=1&baz=2");</script>', { scripts: true });
});

test('presentational tags are persisted', function() {
    verifyCycle('<b>bold</b>', { semantic: false });
    verifyCycle('<i>italic</i>', { semantic: false });
    verifyCycle('<u>underline</u>', { semantic: false });
    verifyCycle('<font color="#ff0000" face="verdana" size="5">bold</font>', { semantic: false });
    verifyCycle('<script src="foo"><\/script>', { semantic: false, scripts: true });
});

test("list start attribute is serialized correctly", function() {
    verifyCycle('<ol start="5"><li>foo</li></ol>');
    equal(serializeCycle('<ol start="1"><li>foo</li></ol>'), "<ol><li>foo</li></ol>");
    equal(serializeCycle('<ul start="2"><li>foo</li></ul>'), "<ul><li>foo</li></ul>");
});

test("multiple script tags are persisted", function() {
    verifyCycle('<script>var a;</script><script>var b;</script>', { scripts: true });
});

test("base64 encoded image is persisted", function() {
    verifyCycle('<div style="background:url(data:image/png;base64,foobarbaz);"></div>');
});

test("multiple css properties are persisted", function() {
    verifyCycle('<span style="margin:2px;padding:1px;"></span>');
    verifyCycle('<span style="background:url(data:image/png;base64,foobarbaz);color:#ff0000;"></span>');
});

test('data-role resize attribute is removed from table rows and cells removed', function() {
    editor.body.innerHTML = '<table><tbody><tr data-role="resizable"><td data-role="resizable"></td></tr></tbody></table>';

    equal(editor.value(), '<table><tbody><tr><td></td></tr></tbody></table>');
});


    var root;
    editor_module("custom serialization", {
        beforeEach: function() {
            root = $("<div>content</div>")[0];
            editor = $("#editor-fixture").data("kendoEditor");
        },
        afterEach: function() {
            editor.options.serialization.custom = null;
            editor.options.deserialization.custom = null;
            editor.value("");
        }
    }, {
        deserialization: {
            custom: null
        },
        serialization: {
            custom: null
        }
    });

    test("custom serialization", function() {
        expect(2);
        var result = Serializer.domToXhtml(root, {
            custom: function(html) {
                equal(html, "content");
                return "new content";
            }
        });

        equal(result, "new content");
    });

    test("define custom with non-function value", function() {
        var result = Serializer.domToXhtml(root, { custom: {a:1} });
        equal(result, "content");
    });

    test("no return value of handler still does not break the result", function() {
        var result = Serializer.domToXhtml(root, { custom: function(html) {}});
        equal(result, "content");
    });

    test("html content is customized", function() {
        var content = "con<strong>tent</strong>";
        root.innerHTML = content;

        var result = Serializer.domToXhtml(root, { custom: function() {
            return "new content";
        }});

        equal(result, "new content");
    });

    test("editor value is customized", function() {
        editor.options.serialization.custom = function(html) {
            return "new content";
        };
        editor.value("should change");

        equal(editor.value(), "new content");
    });

    test("deserialization with defined custom handler with non-function value", function() {
        root = Serializer.htmlToDom("content", root, { custom: {a:1} });
        equal(root.innerHTML, "content");
    });

    test("deserialize custom handler", function() {
        expect(2);
        root = Serializer.htmlToDom("content", root, {
            custom: function(html) {
                equal(html, "content", "should propagate original value");
                return "new content";
            }
        });

        equal(root.innerHTML, "new content");
    });

    test("deserialize custom handler with no return value does not break content", function() {
        root = Serializer.htmlToDom("content", root, {
            custom: function(html) {}
        });

        equal(root.innerHTML, "content");
    });

    test("editor value custom content deserialization", function() {
        expect(2);
        editor.options.deserialization.custom = function(html) {
            equal(html, "content", "should provide original content");
            return "new content";
        };
        editor.value("content");

        equal(editor.value(), "new content", "update with custom");
    });

    editor_module("editor serialization with immutables enabled", {
        setup: function() {
            editor = $("#editor-fixture").data("kendoEditor");
        }
    });

    function setEditorImmutables(immutablesOptions) {
        editor.options.immutables = immutablesOptions || true;
        editor._initializeImmutables();
        editor.immutables.randomId = function() { return 12345; };
    }

    test('immutable container is serialized to an empty node with the same tag name', function() {
        setEditorImmutables();
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');
        editor.options.serialization.immutables = editor.immutables;
        equal(editor.value(), '<p>foo</p><p k-immutable="12345"></p>');
    });

    test('two immutable containers is serialized to an empty node with the same tag name', function() {
        setEditorImmutables();
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p><p>foo</p><p contenteditable="false">immutable content</p>');
        editor.options.serialization.immutables = editor.immutables;
        equal(editor.value(), '<p>foo</p><p k-immutable="12345"></p><p>foo</p><p k-immutable="12345"></p>');
    });

    test('immutable container widht children is serialized to an empty node with the same tag name', function() {
        setEditorImmutables();
        editor.value('<div contenteditable="false">immutable <div>child div</div> content</div>');
        editor.options.serialization.immutables = editor.immutables;
        equal(editor.value(), '<div k-immutable="12345"></div>');
    });

    test('immutable container is serialized to a html string difeined in serialization callback', function() {
        setEditorImmutables({
            serialization: function() {
                return '<ins></ins>';
            }
        });
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');
        editor.options.serialization.immutables = editor.immutables;
        equal(editor.value(), '<p>foo</p><ins k-immutable="12345"></ins>');
    });

    test('immutable container is serialized to a html string difeined in serialization template', function() {
        setEditorImmutables({
            serialization: "<#= data.nodeName # data=\"immutable-element\"></#= data.nodeName #>"
        });
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');
        editor.options.serialization.immutables = editor.immutables;
        equal(editor.value(), '<p>foo</p><P data="immutable-element" k-immutable="12345"></P>');
    });

    editor_module("editor deserialization with immutables enabled", {
        setup: function() {
            editor = $("#editor-fixture").data("kendoEditor");
        }
    });

    test('immutable container is deserialized', function() {
        setEditorImmutables();
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');

        var options = editor.options;
        options.serialization.immutables = editor.immutables;
        var value = editor.value();
        options.serialization.immutables = null;

        options.deserialization.immutables = editor.immutables;
        editor.value(value);
        options.deserialization.immutables = null;

        equal(editor.value(), '<p>foo</p><p contenteditable="false">immutable content</p>');
    });

    test('immutable container is deserialized when callback options is apssed', function() {
        setEditorImmutables({
            deserialization: function(node, immutableNode) { immutableNode.style.backgroundColor = "red"; }
        });

        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');

        var options = editor.options;
        options.serialization.immutables = editor.immutables;
        var value = editor.value();
        options.serialization.immutables = null;

        options.deserialization.immutables = editor.immutables;
        editor.value(value);
        options.deserialization.immutables = null;

        equal(editor.value(), '<p>foo</p><p contenteditable="false" style="background-color:red;">immutable content</p>');
    });

    test('k-br is added after the last immutable element', function() {
        editor.value('<p>foo</p><p contenteditable="false">immutable content</p>');
        var lastChild = editor.body.lastChild;
        equal(lastChild.nodeName, "BR");
        ok($(lastChild).hasClass("k-br"));
    });

    test('k-br is added before the first immutable element', function() {
        editor.value('<p contenteditable="false">immutable content</p>');
        var firstChild = editor.body.firstChild;
        equal(firstChild.nodeName, "BR");
        ok($(firstChild).hasClass("k-br"));
    });
}());
