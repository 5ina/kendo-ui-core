(function(){

var cleaner;

module("editor MS Word format cleaner", {
    setup: function() {
        cleaner = new kendo.ui.editor.MSWordFormatCleaner();
    }
});

function clean(html) {
    var value = cleaner.clean(html);

    return value
        // uppercase tags
        .replace(/(<\/?[^>]*>)/g, function (_, tag) {
            return tag.toLowerCase();
        })
        // empty lines
        .replace(/[\r\n]+/g, '')
        // CSS properties
        .replace(/(;|:)\s*/g, "$1")
        .replace(/;"/g, "\"")
        .replace(/(colspan=)("|')(.*?)('|")/gi, "$1$3");
}

test("cleaning meta tags", function() {
    equal(clean('<meta content="text/html"><meta content="Word.Document">'), '');
});

test("cleaning link tags", function() {
    equal(clean('<link href="file://clip_filelist.xml"><link rel="colorSchemeMapping"></link>'), '');
});

test("cleaning style tags", function() {
    equal(clean('<style>foo<\/style>'), '');
});

test("cleaning invalid tag contents style tags", function() {
    equal(clean('<style>foo<\/style>'), '');
});

test("ordered list", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><!--[if !supportLists]--><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span><!--[endif]-->foo</p>'), '<ol><li>foo</li></ol>');
});

test("strip comments", function() {
    equal(clean('<!--[if gte mso 9]>\n<xml>foo</xml><![endif]--><!--[if gte mso 9]><xml>foo</xml><![endif]-->'), '');
});

test("strip comments regardles of version", function() {
    equal(clean('<!--[if gte mso 10]>\n<xml>foo</xml><![endif]--><!--[if gte mso 49]><xml>foo</xml><![endif]-->'), '');
});

test("unordered list", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p>'), '<ul><li>foo</li></ul>');
});

test("class removed", function() {
    equal(clean('<p class="foo">foo</p>'), '<p>foo</p>');
});

test("class without quote removed", function() {
    equal(clean('<p class=MsoTest>foo</p>'), '<p>foo</p>');
});

test("class without quote and with other attributes removed", function() {
    equal(clean('<p class=MsoTest id="foo-bar">foo</p>').indexOf('MsoTest'), -1);
});

test("remove o namespace", function() {
    equal(clean('<o:p>foo</o:p>'), '');
});

test("remove v namespace", function() {
    equal(clean('<v:p>foo</v:p>'), '');
});

test("remove mso style attributes", function() {
    equal(clean('<p style="mso-fareast-font:Symbol;color:red;">foo</p>').indexOf('mso'), -1);
});

test("opening list when there is no comment", function() {
    equal(clean('<p style="text-indent: -0.25in;" class="MsoListParagraphCxSpFirst"><span style="font-family: Symbol;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p>'), '<ul><li>foo</li></ul>');
});

test("list with letters", function() {
    equal(clean('<p class="MsoNormal" style="text-align:justify;line-height:115%"><span lang="EN-GB" style="font-size:8.0pt;line-height:115%;mso-ansi-language:EN-GB">a)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; foo<o:p></o:p></span></p><p class="MsoNormal" style="text-align:justify;line-height:115%"><span lang="EN-GB" style="font-size:8.0pt;line-height:115%;mso-ansi-language:EN-GB">b)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bar<o:p></o:p></span></p>'), '<ol><li>foo</li><li>bar</li></ol>');
});

test("comments removed", function() {
    equal(clean('<!--[if gte vml 1]>foo<![endif]-->'), '');
});

test("nested lists with fractional margin", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>One</p><p class="MsoListParagraphCxSpFirst" style="margin-left: 0.75in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>Two</p>'), '<ol><li>One<ol><li>Two</li></ol></li></ol>');
});

test("nested list with more than one root node", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>One</p><p class="MsoListParagraphCxSpFirst" style="margin-left: 0.75in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>Two</p><p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style=""><span style="">2.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>Three</p>'), '<ol><li>One<ol><li>Two</li></ol></li><li>Three</li></ol>');
});

test("nested ordered lists", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]-->1.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Foo<o:p></o:p></p><p class="MsoListParagraphCxSpMiddle" style="margin-left:72.0pt;mso-add-space: auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]-->a.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Bar<o:p></o:p></p><p class="MsoListParagraphCxSpMiddle" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]-->2.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Bar<o:p></o:p></p>'), '<ol><li>Foo<ol><li>Bar</li></ol></li><li>Bar</li></ol>');
});

test("orderd lists with roman numerals", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent:-36.0pt;mso-text-indent-alt: -18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>i.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Foo<o:p></o:p></p><p class="MsoListParagraphCxSpMiddle" style="text-indent:-36.0pt;mso-text-indent-alt: -18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>ii.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Bar<o:p></o:p></p><p class="MsoListParagraphCxSpLast" style="text-indent:-36.0pt;mso-text-indent-alt: -18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>iii.<span style="font-size: 7pt; font-family: \'Times New Roman\';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><!--[endif]-->Baz<o:p></o:p></p>'), '<ol><li>Foo</li><li>Bar</li><li>Baz</li></ol>');
});

test("titles converted to header", function() {
    equal(clean('<p class="MsoTitle"><span>foo</span></p>'), '<h1><span>foo</span></h1>');
});

test("list paragraph", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>foo</p><p>bar</p>'), '<ul><li>foo</li></ul><p>bar</p>');
});

test("list paragraph list", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>foo</p><p>bar</p><p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>baz</p>'), '<ul><li>foo</li></ul><p>bar</p><ul><li>baz</li></ul>');
});

test("nested list paragraph list", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>foo</p><p class="MsoListParagraphCxSpFirst" style="margin-left:1in;"><span><span><span>o</span>&nbsp;</span></span>moo</p><p>bar</p><p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>baz</p>'), '<ul><li>foo<ul><li>moo</li></ul></li></ul><p>bar</p><ul><li>baz</li></ul>');
});

test("list block element list", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>foo</p><h1>bar</h1><p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>baz</p>'), '<ul><li>foo</li></ul><h1>bar</h1><ul><li>baz</li></ul>');
});

test("list when there is no class just margin", function() {
    equal(clean('<p style="margin-left:1in;text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p>'), '<ul><li>foo</li></ul>');
});

test("empty block elements skipped", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>foo</p><h1></h1><p class="MsoListParagraphCxSpFirst"><span><span><span>o</span>&nbsp;</span></span>baz</p>'), '<ul><li>foo</li><li>baz</li></ul>');
});

test("paragraph which contains o but not first is not suitable", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span>foo</span>&nbsp;</span>foo</p>'), '<p><span><span>foo</span>&nbsp;</span>foo</p>');
});

test("paragraph which contains number but not first is not suitable", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst"><span><span>foo1.</span>&nbsp;</span>foo</p>'), '<p><span><span>foo1.</span>&nbsp;</span>foo</p>');
});

test("nested lists", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style="font-family: &quot;Courier New&quot;;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1.5in; text-indent: -0.25in;"><span style="font-family: Wingdings;"><span style="">§<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;</span></span></span>baz</p><p class="MsoListParagraphCxSpLast" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>moo</p>'), '<ul><li>foo<ul><li>bar<ul><li>baz</li></ul></li></ul></li><li>moo</li></ul>');
});

test("unordered list with two nested spans", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>foo</p>'), '<ul><li>foo</li></ul>');
});

test("nested lists of different type and same margin", function() {
    equal(clean('<p><span><span>1.</span>&nbsp;&nbsp;</span>foo</p><p><span><span>o</span>&nbsp;</span>bar</p>'), '<ol><li>foo<ul><li>bar</li></ul></li></ol>');
});

test("mixed multi level lists setup 1", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1.5in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>moo</p><p class="MsoListParagraphCxSpLast" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">2.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>baz</p>'), '<ul><li>foo<ol><li>bar<ol><li>moo</li></ol></li><li>baz</li></ol></li></ul>');
});

test("mixed multi level lists setup 2", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoListParagraphCxSpLast" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>moo</p>'), '<ul><li>foo<ol><li>bar</li></ol></li><li>moo</li></ul>');
});

test("three level lists", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style="font-family: &quot;Courier New&quot;;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;</span></span></span>foo1</p><p class="MsoListParagraphCxSpMiddle" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style="font-family: &quot;Courier New&quot;;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;</span></span></span>bar1</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1.5in; text-indent: -0.25in;"><span style="font-family: Wingdings;"><span style="">§<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;</span></span></span>bar11</p><p class="MsoListParagraphCxSpLast" style="margin-left: 1in; text-indent: -0.25in;"><span style="font-family: &quot;Courier New&quot;;"><span style="">o<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;</span></span></span>bar2</p>'), '<ul><li>foo<ul><li>foo1</li></ul></li><li>bar<ul><li>bar1<ul><li>bar11</li></ul></li><li>bar2</li></ul></li></ul>');
});

test("three level mixed lists", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo1</p><p class="MsoListParagraphCxSpMiddle" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar1</p><p class="MsoListParagraphCxSpMiddle" style="margin-left: 1.5in; text-indent: -0.25in;"><span style=""><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar11</p><p class="MsoListParagraphCxSpLast" style="margin-left: 1in; text-indent: -0.25in;"><span style=""><span style="">2.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar2</p>'), '<ul><li>foo<ol><li>foo1</li></ol></li><li>bar<ol><li>bar1<ol><li>bar11</li></ol></li><li>bar2</li></ol></li></ul>');
});

test("mixed lists same margin", function() {
    equal(clean('<p class="MsoNormal" style="margin: 3pt 0in 3pt 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: &quot;Verdana&quot;,&quot;sans-serif&quot;;"><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoNormal" style="margin-left: 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoNormal" style="margin: 3pt 0in 3pt 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: &quot;Verdana&quot;,&quot;sans-serif&quot;;"><span style="">2.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;</span></span></span>baz</p>'), '<ol><li>foo<ul><li>bar</li></ul></li><li>baz</li></ol>');
});

test("mixed nested lists same margin", function() {
    equal(clean('<p class="MsoNormal" style="margin: 3pt 0in 3pt 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: &quot;Verdana&quot;,&quot;sans-serif&quot;;"><span style="">1.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;</span></span></span>foo</p><p class="MsoNormal" style="margin-left: 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p><p class="MsoNormal" style="margin: 3pt 0in 3pt 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: &quot;Verdana&quot;,&quot;sans-serif&quot;;"><span style="">2.<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;</span></span></span>baz</p><p class="MsoNormal" style="margin-left: 0.25in; text-align: justify; text-indent: -0.25in;"><span style="font-size: 10pt; font-family: Symbol;"><span style="">·<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>bar</p>'), '<ol><li>foo<ul><li>bar</li></ul></li><li>baz<ul><li>bar</li></ul></li></ol>');
});

test("ordered list from parenthesis", function() {
    equal(clean('<p class="MsoListParagraphCxSpFirst" style="text-indent: -0.25in;"><span style="font-family: Symbol;"><span style="">1)<span style="font: 7pt &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span>foo</p>'), '<ol><li>foo</li></ol>');
});

test("handling unclosed tags", function() {
    equal(clean('<h2>foo<br></h2><div>bar</div>'), '<h2>foo</h2><div>bar</div>');
});

test("cleaning attribute values with encoded quotes", function() {
    equal(clean('<span style="mso-bidi-font-family:&quot;Times New Roman&quot;;">foo</span>'), '<span>foo</span>');
});

test("converting bold tags to strong", function() {
    equal(clean('<b>foo</b>'), '<strong>foo</strong>');
    equal(clean('<blockquote>foo</blockquote>'), '<blockquote>foo</blockquote>');
});

test("converting italics tags to emphasis", function() {
    equal(clean('<i>foo</i>'), '<em>foo</em>');
    equal(clean('<img />foo'), '<img>foo');
});

test("xml declaration", function() {
    equal(clean('<?xml:namespace prefix="v" ns="urn:schemas-microsoft-com:vml" />'), '');
});

test("vml shapes", function() {
    equal(clean('<x:clientdata objecttype="Pict">'), '');
});

test("whitespace before tbody", function() {
    equal(clean('<table>  &nbsp;<tbody><tr><td>&nbsp;</td></tr></tbody></table>'), '<table><tbody><tr><td>&nbsp;</td></tr></tbody></table>');
});

test("whitespace rows", function() {
    equal(clean('<table cellPadding="0"><tbody><tr>&nbsp;  &nbsp;</tr></tbody></table>'), '');
});

test("graphic lists", function() {
    equal(clean('<p class="MsoListParagraph" style="text-indent:-.25in;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="font-family:Wingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family: Wingdings">ü<span style="font-size: 7pt; line-height: normal; font-family: \'Times New Roman\';">&nbsp; </span></span><!--[endif]-->foo<o:p></o:p></p>'), '<ul><li>foo</li></ul>');
});

test("does not interpret all graphic chars as lists", function() {
    equal(clean('<p class="MsoNormal">Foo <span style="font-family:Wingdings;mso-ascii-font-family: Calibri;mso-ascii-theme-font:minor-latin;mso-hansi-font-family:Calibri; mso-hansi-theme-font:minor-latin;mso-char-type:symbol;mso-symbol-font-family: Wingdings">J</span> bar baz<o:p></o:p></p>'), '<p>Foo <span style="font-family:wingdings">J</span> bar baz</p>');
});

    test("lists without whitespace between numbers and content", function() {
            var content = '<p class="MsoListParagraphCxSpFirst" style="text-indent:-12.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-fareast-font-family:Arial">1.<span style="font-stretch: normal; font-size: 7pt; font-family: \'Times New Roman\';">&nbsp; </span></span><!--[endif]--><span style="">item1<o:p></o:p></span></p>' +
                          '<p class="MsoListParagraphCxSpLast" style="text-indent:-12.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="mso-fareast-font-family:Arial">2.<span style="font-stretch: normal; font-size: 7pt; font-family: \'Times New Roman\';">&nbsp; </span></span><!--[endif]--><span style="">item2<o:p></o:p></span></p>';
            equal(clean(content), '<ol><li><span>item1</span></li><li><span>item2</span></li></ol>');
    });



test("cleans word tables", function() {
    equal(
        clean('<table class="MsoTableLightShadingAccent1" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-top-alt:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;mso-border-bottom-alt:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">' +
'<tbody><tr>' +
'<td width="160" valign="top" style="width:119.7pt;border:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;background:#D3DFEE;mso-background-themecolor:accent1;mso-background-themetint:63;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191;mso-bidi-font-weight:bold">cell 1</span></p>' +
'</td>' +
'<td width="160" valign="top" style="width:119.7pt;border:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;background:#D3DFEE;mso-background-themecolor:accent1;mso-background-themetint:63;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">cell 2</span></p>' +
'</td>' +
'</tr>' +
'</tbody></table>'),

        '<table>' +
            '<colgroup><col style="width:160px"><col style="width:160px"></colgroup>' +
            '<tbody>' +
                '<tr><td>cell 1</td><td>cell 2</td></tr>' +
            '</tbody>' +
        '</table>'
    );
});

test("converts bolded table row to header row", function() {
    equal(
        clean('<table class="MsoTableLightShadingAccent1" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-top-alt:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;mso-border-bottom-alt:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">' +
'<tbody><tr>' +
'<td width="160" valign="top" style="width:119.7pt;border-top:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;border-left:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;border-right:none;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">header 1<o:p></o:p></span></b></p>' +
'</td>' +
'<td width="160" valign="top" style="width:119.7pt;border-top:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;border-left:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;border-right:none;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">header 2<o:p></o:p></span></b></p>' +
'</td>' +
'</tr>' +
'</tbody></table>'),

        '<table>' +
            '<colgroup><col style="width:160px"><col style="width:160px"></colgroup>' +
            '<thead>' +
                '<tr><th>header 1</th><th>header 2</th></tr>' +
            '</thead>' +
            '<tbody></tbody>' +
        '</table>'
    );
});

test("persists line breaks in header row", function() {
    equal(
        clean('<table class="MsoTableLightShadingAccent1" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-top-alt:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;mso-border-bottom-alt:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">' +
'<tbody><tr>' +
'<td width="160" valign="top" style="width:119.7pt;border-top:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;border-left:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;border-right:none;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">header 1<o:p></o:p></span></b></p>' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">with rows</span></b></p>' +
'</td>' +
'<td width="160" valign="top" style="width:119.7pt;border-top:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;border-left:none;border-bottom:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;border-right:none;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#365F91;mso-themecolor:accent1;mso-themeshade:191">header 2<o:p></o:p></span></b></p>' +
'</td>' +
'</tr>' +
'</tbody></table>'),

        '<table>' +
            '<colgroup><col style="width:160px"><col style="width:160px"></colgroup>' +
            '<thead>' +
                '<tr><th>header 1<br><strong>with rows</strong></th><th>header 2</th></tr>' +
            '</thead>' +
            '<tbody></tbody>' +
        '</table>'
    );
});

test("persists HTML in table rows", function() {
    equal(
        clean('<table class="MsoTableLightShadingAccent1" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-top-alt:solid #4F81BD 1.0pt;mso-border-top-themecolor:accent1;mso-border-bottom-alt:solid #4F81BD 1.0pt;mso-border-bottom-themecolor:accent1;mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt">' +
'<tbody><tr>' +
'<td width="213" valign="top" style="width:159.6pt;border:none;border-bottom:solid #C0504D 1.0pt;mso-border-bottom-themecolor:accent2;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><span style="color:#943634;mso-themecolor:accent2;mso-themeshade:191;mso-bidi-font-weight:bold">foo </span><span style="background:yellow;mso-highlight:yellow;mso-bidi-font-weight:bold">bar</span><span style="color:#943634;mso-themecolor:accent2;mso-themeshade:191;mso-bidi-font-weight:bold"><o:p></o:p></span></p>' +
'</td>' +
'<td width="213" valign="top" style="width:159.6pt;border:none;border-bottom:solid #C0504D 1.0pt;mso-border-bottom-themecolor:accent2;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><b><span style="color:#943634;mso-themecolor:accent2;mso-themeshade:191">bold</span></b></p>' +
'</td>' +
'<td width="213" valign="top" style="width:159.6pt;border:none;border-bottom:solid #C0504D 1.0pt;mso-border-bottom-themecolor:accent2;padding:0in 5.4pt 0in 5.4pt">' +
'<p class="MsoNormal" style="margin-bottom: 0.0001pt;"><span style="color:#943634;mso-themecolor:accent2;mso-themeshade:191">foo<br>\nbar<br>\nbaz<o:p></o:p></span></p>' +
'</td>' +
'</tr>' +
'</tbody></table>'),

        '<table>' +
            '<colgroup><col style="width:213px"><col style="width:213px"><col style="width:213px"></colgroup>' +
            '<tbody>' +
                '<tr>' +
                    '<td>foo <span style="background:yellow">bar</span></td>' +
                    '<td><strong>bold</strong></td>' +
                    '<td>foo<br>bar<br>baz</td>' +
                '</tr>' +
            '</tbody>' +
        '</table>'
    );
});

test("persists colspan attribute", function() {
    equal(
        clean(
        '<table class="MsoTableGrid" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt; mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt"> ' +
            '<tbody><tr style="mso-yfti-irow:0;mso-yfti-firstrow:yes;">' +
                    '<td width="616" colspan="2" valign="top" style="width:462.1pt;border:solid windowtext 1.0pt; mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt;height:1.0cm">' +
                        '<p class="MsoNoSpacing" align="center" style="text-align:center">foo</p></td></tr>' +
                '<tr style="mso-yfti-irow:1;mso-yfti-lastrow:yes;"><td width="140" valign="top" style="width:104.65pt;border:solid windowtext 1.0pt; border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt; padding:0cm 5.4pt 0cm 5.4pt;"><p class="MsoNoSpacing">bar</p></td><td width="477" valign="top" style="width:357.45pt;border-top:none;border-left: none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt; mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt; mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt;"><p class="MsoNoSpacing">baz<o:p></td></p></o>'),
    '<table>' +
        '<colgroup><col style="width:140px"><col style="width:477px"></colgroup>' +
        '<tbody>' +
            '<tr>' +
                '<td colspan=2>foo</td>' +
            '</tr>' +
            '<tr>' +
                '<td>bar</td>' +
                '<td>baz</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>');
});

test("keeps empty cells", function() {
    equal(
        clean(
            '<table>' +
                '<tbody>' +
                    '<tr>' +
                        '<td></td>' +
                        '<td>a</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>'),
    '<table>' +
        '<colgroup><col><col></colgroup>' +
        '<tbody>' +
            '<tr>' +
                '<td></td>' +
                '<td>a</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>');
});

test("converts colgroup", function() {
    equal(
        clean(
            '<table>' +
                '<colgroup><col width="200"> <col width="100"></colgroup>' +
                '<tbody>' +
                    '<tr>' +
                        '<td></td>' +
                        '<td>a</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>'),
    '<table>' +
        '<colgroup><col style="width:200px"><col style="width:100px"></colgroup>' +
        '<tbody>' +
            '<tr>' +
                '<td></td>' +
                '<td>a</td>' +
            '</tr>' +
        '</tbody>' +
    '</table>');
});

test("persists HTML in text", function() {
    equal(clean('<p class="MsoNormal">&lt;label class="whatever"&gt;<o:p></o:p></p>'), '<p>&lt;label class="whatever"&gt;</p>');
});

test("replace phantom line feeds with space", function() {
    equal(clean('<p class="MsoNormal">foo\nbar</p>'), '<p>foo bar</p>');
});

test("do not replace line feeds with space after <br>", function() {
    equal(clean('<p class="MsoNormal">foo<br>\nbar</p>'), '<p>foo<br>bar</p>');
    equal(clean('<p class="MsoNormal">foo<br/>\nbar</p>'), '<p>foo<br>bar</p>');
    equal(clean('<p class="MsoNormal">foo<br />\nbar</p>'), '<p>foo<br>bar</p>');
});

test("does not remove empty Word paragraphs", function() {
    equal(clean('<p class="MsoNormal"><o:p>&nbsp;</o:p></p>'), '<p>&nbsp;</p>');
});

test("converts font tags to spans", function() {
    equal(clean('<font face="calibri">foo</font>'), '<span style="font-family:calibri">foo</span>');
});

}());
