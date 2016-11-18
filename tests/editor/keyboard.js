(function(){

var keyboard;
var editor;

function initKeyboard(handlers) {
    keyboard = new kendo.ui.editor.Keyboard(handlers);
}

editor_module("editor keyboard", {
    setup: function() {
        editor = $("#editor-fixture").data("kendoEditor");
        initKeyboard();
    }
});

test("editor has keyboard", function() {
    ok(undefined !== editor.keyboard);
});

function triggerEvent(type, keyCode) {
    var e = new $.Event();
    e.keyCode = keyCode;
    e.type = type;

    $(editor.body).trigger(e);
}

var KEY_SHIFT = 16;
var KEY_CONTROL = 17;
var KEY_ALT = 18;
var KEY_DEL = 46;
var KEY_BACKSPACE = 8;
var KEY_B = "B".charCodeAt(0);

test("keydown calls clearTimeout", function() {
    var called = false;

    withMock(editor.keyboard, "keydown", $.noop, function() {
        withMock(editor.keyboard, "clearTimeout", function() { called = true; }, function() {
            triggerEvent("keydown", KEY_ALT);
        });
    });

    ok(called);
});

test("keydown calls keyboard keydown", function() {
    var called = false;

    withMock(editor.keyboard, "clearTimeout", $.noop, function() {
        withMock(editor.keyboard, "keydown", function() { called = true; }, function() {
            triggerEvent("keydown", KEY_ALT);
        });
    });

    ok(called);
});

test("keyup calls keyboard keyup", function() {
    var called = false;

    withMock(editor.keyboard, "keyup", function() { called = true; }, function() {
        triggerEvent("keyup", KEY_ALT);
    });

    ok(called);
});

test("isTypingKey returns true if char is typed", function() {
    ok(keyboard.isTypingKey({ keyCode: KEY_B }));
});

test("isTypingKey returns true if backspace is typed", function() {
    ok(keyboard.isTypingKey({ keyCode: KEY_BACKSPACE }));
});

test("isTypingKey returns true if delete is typed", function() {
    ok(keyboard.isTypingKey({ keyCode: KEY_DEL }));
});

test("isTypingKey returns false if ctrl and char is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_B, ctrlKey: true }));
});

test("isTypingKey returns false if alt and char is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_B, altKey: true }));
});

test("isTypingKey returns true if shift and char is typed", function() {
    ok(keyboard.isTypingKey({ keyCode: KEY_B, shiftKey: true }));
});

test("isTypingKey returns false if shift and delete is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_DEL, shiftKey: true }));
});

test("isTypingKey returns false if ctrl and delete is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_DEL, ctrlKey: true }));
});

test("isTypingKey returns false if alt and delete is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_DEL, altKey: true }));
});

test("isTypingKey returns false if ctrl is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_CONTROL }));
});

test("isTypingKey returns false if shift is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_SHIFT }));
});

test("isTypingKey returns false if alt is typed", function() {
    ok(!keyboard.isTypingKey({ keyCode: KEY_ALT }));
});

test("typingInProgress returns false initially", function() {
    ok(!keyboard.isTypingInProgress());
});

test("typingInProgress returns true after startTyping", function() {
    keyboard.startTyping();
    ok(keyboard.isTypingInProgress());
});

test("typingInProgress returns false after endTyping", function() {
    keyboard.startTyping($.noop);

    withMock(window, "setTimeout", function () { arguments[0](); }, function() {
        keyboard.endTyping();

        ok(!keyboard.isTypingInProgress());
    });
});

test("typingInProgress does not immediately return false after endTyping", function() {
    keyboard.startTyping($.noop);

    withMock(window, "setTimeout", $.noop, function() {
        keyboard.endTyping();

        ok(keyboard.isTypingInProgress());
    });
});

test("typingInProgress return false after forced endTyping", function() {
    keyboard.startTyping($.noop);

    withMock(window, "setTimeout", $.noop, function() {
        keyboard.endTyping(true);

        ok(!keyboard.isTypingInProgress());
    });
});

test("end typing calls callback specified in start typing", function() {
    var callbackInvoked = false;

    withMock(window, "setTimeout", function () { arguments[0](); }, function() {
        keyboard.startTyping(function () {
            callbackInvoked = true;
        });

        ok(!callbackInvoked);
        keyboard.endTyping();
        ok(callbackInvoked);
    });
});

test("end typing does not call callback if typing is not in progress", function() {
    var callbackInvoked = 0;

    withMock(window, "setTimeout", function () { arguments[0](); }, function() {
        keyboard.startTyping(function () {
            callbackInvoked++;
        });

        keyboard.endTyping();
        keyboard.endTyping();

        equal(callbackInvoked, 1);
    });
});

test("endTyping creates timeout", function() {
    var setTimeoutArgument;

    withMock(window, "setTimeout", function () { setTimeoutArgument = arguments[0]; }, function() {
        keyboard.startTyping($.noop);
        keyboard.endTyping();
    });

    ok(undefined !== setTimeoutArgument);
});

test("endTyping calls clear timeout", function() {
    withMock(window, "setTimeout", $.noop, function() {
        var called = false;

        keyboard.clearTimeout = function() {
            called = true;
        };
        keyboard.endTyping();
        ok(called);
    });
});

test("isModifierKey returns true for ctrl", function() {
    ok(keyboard.isModifierKey({ keyCode: KEY_CONTROL }));
});

test("isModifierKey returns true for shift", function() {
    ok(keyboard.isModifierKey({ keyCode: KEY_SHIFT }));
});

test("isModifierKey returns true for alt", function() {
    ok(keyboard.isModifierKey({ keyCode: KEY_ALT }));
});

test("isModifierKey returns false for character", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_B }));
});

test("isModifierKey returns false for character and ctrl", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_B, ctrlKey: true }));
});

test("isModifierKey returns false for ctrl and shift", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_CONTROL, shiftKey: true }));
});

test("isModifierKey returns false for ctrl and alt", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_CONTROL, altKey: true }));
});

test("isModifierKey returns false for shift and ctrl", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_SHIFT, ctrlKey: true }));
});

test("isModifierKey returns false for shift and alt", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_SHIFT, altKey: true }));
});

test("isModifierKey returns false for alt and ctrl", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_ALT, ctrlKey: true }));
});

test("isModifierKey returns false for alt and shift", function() {
    ok(!keyboard.isModifierKey({ keyCode: KEY_ALT, shiftKey: true }));
});

test("isSystem returns true for ctrl and del", function() {
    ok(keyboard.isSystem({ keyCode: KEY_DEL, ctrlKey: true }));
});

test("isSystem returns false for ctrl and del and alt", function() {
    ok(!keyboard.isSystem({ keyCode: KEY_DEL, ctrlKey: true, altKey: true }));
});

test("isSystem returns false for ctrl and del and shift", function() {
    ok(!keyboard.isSystem({ keyCode: KEY_DEL, ctrlKey: true, shiftKey: true }));
});

test("keydown calls the keydown method of the handlers", function() {
    var calls = 0;

    initKeyboard([
        { keydown: function () { calls++; } },
        { keydown: function () { calls++; } }
    ]);

    keyboard.keydown();
    equal(calls, 2);
});

test("keydown calls the keydown breaks if some handler returns true", function() {
    var calls = 0;

    initKeyboard([
        { keydown: function () { calls++; return true; } },
        { keydown: function () { calls++; } }
    ]);

    keyboard.keydown();
    equal(calls, 1);
});

test("keydown passes the argument to handler", function() {
    var e = {};
    var arg;

    initKeyboard([
        { keydown: function () { arg = arguments[0]; } }
    ]);

    keyboard.keydown(e);
    equal(arg, e);
});

test("keyup calls the keydup method of the handlers", function() {
    var calls = 0;
    initKeyboard([
        { keyup: function () { calls++; } },
        { keyup: function () { calls++; } }
    ]);

    keyboard.keyup();
    equal(calls, 2);
});

test("keyup calls the keyup breaks if some handler returns true", function() {
    var calls = 0;
    initKeyboard([
        { keyup: function () { calls++; return true; } },
        { keyup: function () { calls++; } }
    ]);

    keyboard.keyup();
    equal(calls, 1);
});

test("keyup passes the argument to handler", function() {
    var e = {};
    var arg;
    initKeyboard([
        { keyup: function () { arg = arguments[0]; } }
    ]);

    keyboard.keyup(e);
    equal(arg, e);
});

test("IME keyCodes is considered as characters", function() {
    ok(keyboard.isCharacter(229));
});

test("toolFromShortcut gets the shortcut modifier", function() {
    var getShortcutModifierSpy = spy(keyboard, "_getShortcutModifier");
    var e = new $.Event();
    e.keyCode = KEY_B;

    keyboard.toolFromShortcut([], e);

    equal(keyboard.calls("_getShortcutModifier"), 1);
});

test("the shortcut modifier is metaKey on Mac", function() {
    var e = new $.Event();
    e.keyCode = "Z".charCodeAt(0);
    e.metaKey = true;
    e.ctrlKey = false;

    var modifier = keyboard._getShortcutModifier(e, "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/534.16+ (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4");

    ok(modifier);
});

}());
