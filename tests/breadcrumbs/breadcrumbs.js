(function() {
    var Breadcrumbs = kendo.ui.Breadcrumbs,
        input;

    module("kendo.ui.breadcrumbs", {
        setup: function() {
            input = $("<input/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(input);
        }
    });

    function setup(options) {
        return new Breadcrumbs(input, options);
    }

    test("wraps the input", function() {
        var breadcrumbs = setup();
        ok(input.hasClass("k-input"));
        ok(breadcrumbs.wrapper.is("div"));
        ok(breadcrumbs.wrapper.hasClass("k-widget"));
        ok(breadcrumbs.wrapper.hasClass("k-breadcrumbs"));
    });

    test("kendoBreadCrumbs attaches breadcrumbs object to the target", function() {
        input.kendoBreadcrumbs({});

        ok(input.data("kendoBreadcrumbs") instanceof Breadcrumbs);
    });

    test("add class to the input", function() {
        var breadcrumbs = setup();
        equal(breadcrumbs.wrapper.find("input.k-input").length, 1);
    });

    test("value returns the initial value", function() {
        var breadcrumbs = setup({ value: "/foo/bar" });
        equal(breadcrumbs.value(), "/foo/bar");
    });

    test("renders elements for the path", function() {
        var breadcrumbs = setup({ value: "/foo/bar" });

        equal(breadcrumbs.wrapper.find("a").length, 3); // plus one for the root
    });

    test("value updates the breadcrumbs", function() {
        var breadcrumbs = setup();
        breadcrumbs.value("foo/bar");
        equal(breadcrumbs.wrapper.find("a").length, 3);// plus one for the root
    });

    test("previous breadcrumbs are cleared", function() {
        var breadcrumbs = setup();
        breadcrumbs.value("foo/bar");
        breadcrumbs.value("foo/bar");
        equal(breadcrumbs.wrapper.find("a").length, 3);// plus one for the root
    });

    test("should condense adjacent slashes", function() {
        var breadcrumbs = setup({ value: "///foo///bar///baz" });
        equal(breadcrumbs.wrapper.find("a").length, 4);// plus one for the root
        equal(breadcrumbs.value(), "/foo/bar/baz");
    });

    test("focus hides the breadcrumbs", function() {
        var breadcrumbs = setup({ value: "/foo" });
        input.focus();
        ok(breadcrumbs.overlay.is(":not(:visible)"));
    });

    test("bluring the input shows the breadcrumbs", function() {
        var breadcrumbs = setup({ value: "/foo" });
        input.focus();
        input.blur();
        ok(breadcrumbs.overlay.is(":visible"));
    });

    test("condense adjacent slashes user enters", function() {
        var breadcrumbs = setup({ value: "/foo" });
        input.focus();
        input.val("///foo///bar///baz");
        input.blur();
        ok(breadcrumbs.value(), "/foo/bar/baz");
    });

    test("bluring the input changes the value", function() {
        var breadcrumbs = setup({ value: "/foo" });
        input.focus();
        input.val("/foo/bar");
        input.blur();
        ok(breadcrumbs.value(), "/foo/bar");
    });

    test("bluring the input triggers the change event", 1, function() {
        var breadcrumbs = setup({
            value: "/foo",
            change: function() {
                ok(true);
            }
        });

        input.focus();
        input.val("/foo/bar");
        input.blur();
    });

    test("bluring clears the input value", 1, function() {
        var breadcrumbs = setup({
            value: "/foo",
        });

        input.focus();
        input.blur();
        equal(input.val(), "");
    });

    test("change event is not trigger if same value is set", 0, function() {
        var breadcrumbs = setup({
            value: "/foo",
            change: function() {
                ok(false);
            }
        });

        input.focus();
        input.val("/foo");
        input.blur();
    });

    test("change event is not trigger if same value but with multiple slashes is set", 0, function() {
        var breadcrumbs = setup({
            value: "/foo/bar",
            change: function() {
                ok(false);
            }
        });

        input.focus();
        input.val("//foo//bar");
        input.blur();
    });

    test("value does not trigger change event", 0, function() {
        var breadcrumbs = setup({
            value: "/foo",
            change: function() {
                ok(false);
            }
        });
        breadcrumbs.value("/bar");
    });

    test("if user sets path which does not start with slash such is added", 1, function() {
        var breadcrumbs = setup({
            value: "/foo"
        });

        input.focus();
        input.val("bar");
        input.blur();

        equal(breadcrumbs.value(), "/bar");
    });

    test("enter triggers the change event", 1, function() {
        var breadcrumbs = setup({
            change: function() {
                ok(true);
            }
        });
        input.focus();
        input.val("bar").trigger($.Event("keydown",{ keyCode: 13 }));
    });

    test("clicking on a breadcrumb sets a value", function() {
        var breadcrumbs = setup({
            value: "/foo/bar"
        });
        breadcrumbs.wrapper.find("a:not(.k-i-arrow-60-up)").first().click();
        equal(breadcrumbs.value(), "/foo");
    });
})();
