(function(){

var editor;

editor_module("editor events", {
   setup: function() {
       editor = $("#editor-fixture").data("kendoEditor");

       changeRaised = false;

       editor.options.encoded = true;

       editor.bind('select', function () {
           changeRaised = true;
       });

       QUnit.fixture.append('<div id="inline" contentEditable="true"></div>');
   },
   teardown: function() {
       kendo.destroy(QUnit.fixture);
   }
}, {
    value: "foo",
    select: onSelectionChange,
    change: onChange,
    execute: onExecute
});

function onSelectionChange() {
    selectionChangeRaised = true;
}

function onChange() {
    changeRaised = true;
}

function onExecute() {
    executeRaised = true;
}

var changeRaised = false;
var selectionChangeRaised = false;
var executeRaised = false;

function type(eventType, keyCode, ctrl, alt, shift) {
    var e = $.Event();
    e.keyCode = keyCode;
    e.ctrlKey = !!ctrl;
    e.altKey = !!alt;
    e.shiftKey = !!shift;
    e.type = eventType;

    $(editor.body).trigger(e);
}

function keydown() {
    type.apply(this, ["keydown"].concat([].slice.apply(arguments)));
}

function keyup() {
    type.apply(this, ["keyup"].concat([].slice.apply(arguments)));
}

test("blurring the editor triggers change event", function() {
    editor.value('bar');
    editor.body.innerHTML = 'foo';
    $(editor.window).trigger('blur');
    ok(changeRaised);
});

test("blurring the inlinline editor triggers change event", function() {
    var inline = new kendo.ui.Editor("#inline", {
        value: "foo",
        select: onSelectionChange,
        change: onChange,
        execute: onExecute
    });

    inline.body.innerHTML = "bar";

    $(inline.element).trigger("blur");

    ok(changeRaised);
});

test("blurring the editor updates value", function() {
    editor.value("foo");
    editor.body.innerHTML = "<em>bar</em>";
    $(editor.window).trigger("blur");
    equal($(editor.textarea).val(), "&lt;em&gt;bar&lt;/em&gt;");
});

test("blurring the editor honors encoded property when updating value", function() {
    editor.value("foo");
    editor.options.encoded = false;
    editor.body.innerHTML = "<em>bar</em>";
    $(editor.window).trigger("blur");
    equal($(editor.textarea).val(), "<em>bar</em>");
});

test("blurring an encoded editor does not trigger change event", function() {
    editor.options.encoded = false;
    editor.value("<em>foo</em>");
    $(editor.window).trigger("blur");
    ok(!changeRaised);
});

test('on selection change executed', function() {
    selectionChangeRaised = false;
    editor.trigger('select');
    ok(selectionChangeRaised);
});

test('exec raises onExecute', function() {
    editor.exec('undo');
    ok(executeRaised);
});

test('up arrow raises selection change', function() {
    keyup(38);

    ok(changeRaised);
});

asyncTest('mouseup raises selection change', function() {
    $(editor.body).mousedown().mouseup();
    setTimeout(function() {
        ok(changeRaised);
        start();
    }, 100);
});

test('down arrow raises selection change', function() {
    keyup(40);

    ok(changeRaised);
});

test('left arrow raises selection change', function() {
    keyup(37);

    ok(changeRaised);
});

test('right arrow raises selection change', function() {
    keyup(39);

    ok(changeRaised);
});

test('home raises selection change', function() {
    keyup(36);

    ok(changeRaised);
});

test('end raises selection change', function() {
    keyup(35);

    ok(changeRaised);
});

test('pgup raises selection change', function() {
    keyup(33);

    ok(changeRaised);
});

test('pgdown raises selection change', function() {
    keyup(34);

    ok(changeRaised);
});

test('insert raises selection change', function() {
    keyup(45);

    ok(changeRaised);
});

test('backspace raises selection change', function() {
    keyup(9);

    ok(changeRaised);
});

test('ctrl+a raises selection change', function() {
    keyup(65, true);

    ok(changeRaised);
});

test('ctrl+shift+a, ctrl+alt+a, and ctrl+shift+alt+a do not raise selection change', function() {
    keyup(65, true, true);
    keyup(65, true, false, true);
    keyup(65, true, true, true);

    ok(!changeRaised);
});

test('exec raises selection change', function() {
    editor.value('foo');
    var range = editor.createRange();
    range.selectNodeContents(editor.body.firstChild);
    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.exec('bold');
    ok(changeRaised);
});

test('undo raises selection change', function() {
    editor.exec('undo');

    ok(changeRaised);
});

test('redo raises selection change', function() {
    editor.exec('redo');

    ok(changeRaised);
});

test('exec supplies command name and object', function() {
    var e;
    editor.bind('execute', function() {
        e = arguments[0];
    });

    editor.value('foo');
    var range = editor.createRange();
    range.selectNodeContents(editor.body.firstChild);
    editor.getSelection().removeAllRanges();
    editor.getSelection().addRange(range);

    editor.exec('bold');

    equal(e.name, 'bold');
    ok(e.command instanceof kendo.ui.editor.FormatCommand);
});

test("keydown in document body triggers keydown event", function() {
    var e;

    editor.bind("keydown", function() {
        e = arguments[0];
    });

    editor.value('foo');

    $(editor.body).trigger({ type: "keydown", keyCode: 65 });

    ok(e);
    equal(e.keyCode, 65);
});

test("keyup in document body triggers keyup event", function() {
    var e;

    editor.bind("keyup", function() {
        e = arguments[0];
    });

    editor.value('foo');

    keyup(69);
    $(editor.body).trigger({ type: "keyup", keyCode: 69 });

    ok(e);
    equal(e.keyCode, 69);
});

test("calling preventDefault of observable keydown event prevents DOM event", function() {
    var preventDefault = function(e) { e.preventDefault(); };
    editor.bind("keydown", preventDefault);

    var e = $.Event({ type: "keydown", keyCode: 42, preventDefault: $.noop });

    $(editor.body).trigger(e);

    ok(e.isDefaultPrevented());

    editor.unbind("keydown", preventDefault);
});

test("keydown is triggered even if a command is being executed", function() {
    var e;

    editor.bind("keydown", function() {
        e = arguments[0];
    });

    editor.value('foo');

    keydown(13);

    ok(e);
    equal(e.keyCode, 13);
});

var assertRange = function(range, startContainer, endContainer, startOffset, endOffset){
    ok(range.startContainer === startContainer);
    ok(range.endContainer === endContainer);
    ok(range.startOffset === startOffset);
    ok(range.endOffset === endOffset);
};

if (kendo.support.browser.webkit) {
    test("keydown Ctrl+A selects all content", function() {
        var e = $.Event({ type: "keydown", keyCode: 65, ctrlKey: true, preventDefault: $.noop }, {keyCode: 65, ctrlKey: true});
        var body = editor.body;
        body.innerHTML = "<p><em>test</em></p> <p><em>test</em></p>";

        $(body).trigger(e);

        assertRange(editor.getRange(), body, body, 0, body.childNodes.length);
    });
}

test("blurring the editor blurs the textarea (jQuery validate compatibility)", function() {
    var called = false;
    editor.textarea.bind("blur", function() {
        called = true;
    });

    $(editor.window).trigger("blur");

    ok(called);
});

test("execute event can be prevented", function() {
    editor.value("bar");

    editor.undoRedoStack.clear();

    editor.bind('execute', function(e) {
        e.preventDefault();
    });

    editor.exec('bold');

    ok(!editor.undoRedoStack.canUndo());
});

module("editor body events", {
    setup: function() {
        var element = $(QUnit.fixture).append('<textarea id="fakeEditor"></textarea>');
        editor =  $(QUnit.fixture).find("#fakeEditor").kendoEditor({}).data("kendoEditor");
    },

    teardown: function() {
        kendo.destroy(QUnit.fixture);
    }
});

test("mouseenter event is attached to tables inside editor body", function() {
    assertEvent(editor.body, { type: "mouseenter", selector: "table", namespace: "kendoEditor" });
});

test("mouseenter events are detached from editor body on destroy", function() {
    editor.destroy();

    ok(jQueryEventsInfo(editor.body, "mouseenter") === undefined);
});

test("mouseleave events are detached from editor body on destroy", function() {
    editor.destroy();

    ok(jQueryEventsInfo(editor.body, "mouseleave") === undefined);
});

}());
