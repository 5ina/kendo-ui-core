(function(){
    var Editor = kendo.ui.editor;
    var dom = Editor.Dom;
    var Immutables = Editor.Immutables;
    var trueFn = function() { return true; };

    var wrapper = document.createElement("div");
    wrapper.setAttribute("contentEditable", false);

    var contentArea = document.createElement("div");
    contentArea.setAttribute("contentEditable", true);
    wrapper.appendChild(contentArea);

    var paragraph = dom.create(document, 'div', { innerHTML: "test1" });
    var immutableElem = dom.create(document, 'div', { innerHTML: "immutable" });
    immutableElem.setAttribute("contentEditable", false);

    contentArea.appendChild(paragraph);
    contentArea.appendChild(immutableElem);

    editor_module("editor immutable and immutableParent functions", {
        setup: function() { },
        teardown: function() { }
    });

    test("immutable function when element is immutable", function() {
        ok(Immutables.immutable(immutableElem));
    });

    test("immutable function when element is not immutable", function() {
        notOk(Immutables.immutable(paragraph));
    });

    test("immutableParent function when passed node is child of immutable element", function() {
        equal(immutableElem, Immutables.immutableParent(immutableElem.firstChild, contentArea));
    });

    var immutables, range, ev;
    var typingKeyCode = 65;
    var deleteKeyCode = 46;
    var backspaceKeyCode = 8;
    var defaultPrevented = false;
    var RangeUtils = Editor.RangeUtils;
    var keyboardTyping = {isTypingKey: trueFn, typingInProgress: false};
    var body = document.createElement("div");
    var paragraph1 = dom.create(document, 'div', { innerHTML: "test1" });
    var paragraph2 = dom.create(document, 'div', { innerHTML: "test2" });
    var immutable = dom.create(document, 'div', { innerHTML: "immutable" });
    immutable.setAttribute("contentEditable", false);
    body.appendChild(paragraph1);
    body.appendChild(immutable);
    body.appendChild(paragraph2);
    body.appendChild(dom.create(document, 'div', {
        innerHTML: "<table>" +
                    "<tbody>" +
                        "<tr>" +
                            "<td contenteditable='false'>immutable</td>" +
                            "<td>&#65279;</td>" +
                            "<td contenteditable='false'>immutable</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td><div contenteditable='false'>immutable</div></td>" +
                            "<td>&#65279;</td>" +
                        "</tr>" +
                    "</tbody>" +
                "</table>" }));

    body.appendChild(dom.create(document, 'div', {
        innerHTML: "<ol>" +
                    "<li><div contenteditable='false'>immutable</div></li>" +
                    "<li>&#65279;</li>" +
                    "<li><div contenteditable='false'>immutable</div></li>" +
                "</ol>" }));

    var editor = { keyboard: {}, body: body, toolbar: {tools: {}} };

    function setUpKeyboard(keyCode){
       ev = {keyCode: keyCode, preventDefault: function(){ defaultPrevented = true; }};
       editor.keyboard = keyboardTyping;
    }

    function setUpRange(startContainer, startOffset, endContainer, endOffset) {
        range = {collapsed: false, startContainer: startContainer, startOffset: startOffset, endContainer: endContainer, endOffset: endOffset};
        range.collapsed = startContainer === endContainer && startOffset === endOffset;
        range.commonAncestorContainer = dom.commonAncestor(startContainer, endContainer);
    }

    editor_module("keyboard support - typing and deleting over immutable elements", {
        setup: function() {
            immutables = new Immutables(editor);
        },
        teardown: function() {
            defaultPrevented = false;
            removeMocksIn(RangeUtils);
            removeMocksIn(Immutables.fn);
        }
    });

    test("delete by backspace when selection is after immutable element should delete immutable element", function() {
        setUpKeyboard(backspaceKeyCode);
        setUpRange(paragraph2.firstChild, 0, paragraph2.firstChild, 0);
        mockFunc(RangeUtils, "isStartOf", trueFn);
        var removed;
        mockFunc(Immutables.fn, "_removeImmutable", function(immutableEl, r) { removed = immutableEl;});

        ok(immutables._cancelDeleting(ev, range));
        ok(immutable === removed);
    });

    test("delete by delete when selection is before immutable element should delete immutable element", function() {
        setUpKeyboard(deleteKeyCode);
        setUpRange(paragraph1.firstChild, paragraph1.firstChild.length, paragraph1.firstChild, paragraph1.firstChild.length);
        mockFunc(RangeUtils, "isEndOf", trueFn);
        var removed;
        mockFunc(Immutables.fn, "_removeImmutable", function(immutableEl, r) { removed = immutableEl;});

        ok(immutables._cancelDeleting(ev, range));
        ok(immutable === removed);
    });

    test("delete by backspace when selection is in TD after an immutable TD element, should do nothing", function() {
        setUpKeyboard(backspaceKeyCode);
        var tableData = $(body).find("td").get(1);
        setUpRange(tableData.firstChild, 0, tableData.firstChild, 0);

        mockFunc(Immutables.fn, "_removeImmutable", $.noop);

        notOk(immutables._cancelDeleting(ev, range));
        notOk(Immutables.fn._removeImmutable.called);
    });

    test("delete by backspace when selection is at start of TD and previous TD contains immutable element, should do nothing", function() {
        setUpKeyboard(backspaceKeyCode);
        var tableData = $(body).find("tr").last().find("td").get(1);
        setUpRange(tableData.firstChild, 0, tableData.firstChild, 0);

        mockFunc(Immutables.fn, "_removeImmutable", $.noop);

        notOk(immutables._cancelDeleting(ev, range));
        notOk(Immutables.fn._removeImmutable.called);
    });

    test("delete by backspace when selection is at start of LI and previous LI contains immutable element, should do nothing", function() {
        setUpKeyboard(backspaceKeyCode);
        var li = $(body).find("ol").find("li").get(1);
        setUpRange(li.firstChild, 0, li.firstChild, 0);

        mockFunc(Immutables.fn, "_removeImmutable", $.noop);

        notOk(immutables._cancelDeleting(ev, range));
        notOk(Immutables.fn._removeImmutable.called);
    });

    test("delete by delete key when selection is before block element which contains immutable element only, should delete the block element", function() {
        setUpKeyboard(deleteKeyCode);
        var li = $(body).find("ol").find("li").get(1);
        setUpRange(li.firstChild, 0, li.firstChild, 0);

        mockFunc(Immutables.fn, "_removeImmutable", function (node){
            ok(node.nodeName == "LI");
        });

        ok(immutables._cancelDeleting(ev, range));
        ok(Immutables.fn._removeImmutable.called);
    });

    test("deleting with selection", function() {
        setUpKeyboard(backspaceKeyCode);
        setUpRange(immutable.firstChild, 2, paragraph2.firstChild, 2);

        notOk(immutables._cancelDeleting(ev, range));
    });

    var kendoEditor;
    editor_module("editor block format finder", {
        setup: function() {
            kendoEditor = $("#editor-fixture").data("kendoEditor");
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("immutables initialization updates tools options", function() {
        kendoEditor.options.immutables = true;
        kendoEditor._initializeImmutables();
        var tools = kendoEditor.toolbar.tools;

        ok(tools.justifyLeft.options.finder.options.immutables);
        ok(tools.justifyRight.options.finder.options.immutables);
        ok(tools.justifyCenter.options.finder.options.immutables);
    });
}());
