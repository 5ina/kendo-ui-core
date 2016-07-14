(function() {
    module("enhancing DOM", {
        setup: function() {
            kendo.ns = "kendo-";
        },
        teardown: function() {
            TreeViewHelpers.destroy();
            kendo.ns = "";
        }
    });

    function fromHtml(html) {
        return TreeViewHelpers.fromHtml(html).parent();
    }

    test("basic classes", function() {
        var element = fromHtml("<ul><li>item</li></ul>");

        ok(element.is("div"));
        ok(element.is(".k-widget.k-treeview"));
        ok(element.find("ul").is(".k-group"));
        ok(element.find("li").is(".k-item"));
    });

    test("first level group sets lines", function() {
        var element = fromHtml("<ul><li>item<ul><li>subitem</li></ul></li></ul>");

        ok(element.find("ul:first").is(".k-treeview-lines"));
        ok(element.find("ul:last").is(":not(.k-treeview-lines)"));
        ok(element.find("ul:last").is(".k-group"));
    });

    test("collapsed groups", function() {
        var element = fromHtml("<ul><li data-kendo-expanded='false'>item<ul><li>subitem</li></ul></li></ul>");

        equal(element.find("ul:last").css("display"), "none");
    });

    test("node wrappers", function() {
        var element = fromHtml("<ul><li>item</li></ul>"),
            outerWrapper = element.find("li"),
            wrapper = element.find("div:first");

        equal(wrapper.length, 1);
        ok(outerWrapper.hasClass("k-first"));
        ok(outerWrapper.hasClass("k-last"));
        ok(wrapper.hasClass("k-top"));
        equal(wrapper.find("span.k-in").length, 1);
        equal(wrapper.find("span.k-in").text(), "item");
    });

    test("moves arbitrary content in the text wrapper", function() {
        var element = fromHtml("<ul><li>item<span class='status'></span></li></ul>"),
            wrapper = element.find("div:first");

        equal(wrapper.find("span.k-in").text(), "item");
        equal(wrapper.find("span.status").length, 1);
        ok(wrapper.find("span.status").parent().hasClass("k-in"));
    });

    test("does not nest wrapper elements", function() {
        var element = fromHtml("<ul><li><div class='k-bot'><span class='k-in'>text</span></div></li></ul>"),
            wrapper = element.find("div:first");

        equal(element.find("div.k-bot").length, 1);
        equal(element.find("span.k-in").length, 1);
    });

    test("creates toggle buttons", function() {
        var element = fromHtml("<ul><li data-kendo-expanded='true'>foo<ul><li>bar</li></ul></li></ul>"),
            wrapper = element.find("div:first");

        equal(wrapper.find("span.k-icon.k-i-collapse").length, 1);
        equal(element.find(".k-group:not(.k-treeview-lines)").length, 1);
    });

    test("extends link lists", function() {
        var element = fromHtml("<ul><li><a href='#foo'>foo</a></li></ul>");

        equal(element.find("a.k-in.k-link").length, 1);
    });

    test("extends link lists with sprites", function() {
        var element = fromHtml("<ul><li><span class='k-sprite foo' /><a href='#foo'>foo</a></li></ul>");

        var kin = element.find("a.k-in");
        var sprite = kin.find(".k-sprite");

        equal(sprite.length, 1);
        equal(sprite[0], kin[0].firstChild);
    });

    test("extends lists with sprites", function() {
        var element = fromHtml("<ul><li><span class='k-sprite foo' />foo</li></ul>");

        var kin = element.find("span.k-in");
        var sprite = kin.find(".k-sprite");

        equal(sprite.length, 1);
        equal(sprite[0], kin[0].firstChild);
    });

    var treeview;
    var moduleOptions = {
        setup: function() {
            kendo.ns = "kendo-";
            treeview = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            TreeViewHelpers.destroy();
            kendo.ns = "";
        }
    };

    module("groups", moduleOptions);

    test("renders lines class for first level", function() {
        treeview.kendoTreeView([]);

        var ul = treeview.find("ul");
        equal(ul.length, 1);
        equal(ul.children().length, 0);
        ok(ul.hasClass("k-group"));
        ok(ul.hasClass("k-treeview-lines"));
    });

    test("renders items", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        equal(treeview.find(".k-item").length, 1);
    });

    test("renders hidden group if it is not expanded", function() {
        treeview.kendoTreeView([
            { text: "foo", expanded: false, items: [
                { text: "bar" }
            ] }
        ]);

        equal(treeview.find("ul:last").css("display"), "none");
    });

    module("item", moduleOptions);

    test("renders list items with k-item class", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        var li = treeview.find("li");

        ok(li.hasClass("k-item"));
    });

    test("renders k-first class for first item in first-level groups", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        var li = treeview.find("li");

        ok(li.hasClass("k-first"));
    });

    test("renders k-last class for last item", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        var li = treeview.find("li");

        ok(li.hasClass("k-last"));
    });

    test("renders div wrapper for each item", function() {
        treeview.kendoTreeView([
            { text: "foo" },
            { text: "bar" }
        ]);

        var divs = treeview.find("div");

        equal(divs.length, 2);
    });

    test("renders k-top class for first item in group", function() {
        treeview.kendoTreeView([
            { text: "foo" },
            { text: "bar" },
            { text: "baz" }
        ]);

        var divs = treeview.find("div");

        ok(divs.eq(0).hasClass("k-top"));
        ok(divs.eq(1).hasClass("k-mid"));
        ok(divs.eq(2).hasClass("k-bot"));
        ok(!divs.eq(2).hasClass("k-top"));
    });

    test("does renders k-top class for single items in root group", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        var divs = treeview.find("div");

        ok(divs.eq(0).hasClass("k-top"));
        ok(divs.eq(0).hasClass("k-bot"));
    });

    test("renders links for items with url", function() {
        treeview.kendoTreeView([
            { text: "foo", url: "http://kendoui.com/" }
        ]);

        equal(treeview.find("a.k-in.k-link[href='http://kendoui.com/']").length, 1);
    });

    test("does not render link class on non-links", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        equal(treeview.find(".k-link").length, 0);
    });

    test("renders disabled state on disabled items", function() {
        treeview.kendoTreeView([
            { text: "foo", enabled: false }
        ]);

        equal(treeview.find(".k-in.k-state-disabled").length, 1);
    });

    test("renders selected state on selected items", function() {
        treeview.kendoTreeView([
            { text: "foo", selected: true }
        ]);

        equal(treeview.find(".k-in.k-state-selected").length, 1);
    });

    test("renders spriteCssClass", function() {
        treeview.kendoTreeView([
            { text: "foo", spriteCssClass: "cssClass1" }
        ]);

        var sprite = treeview.find('.k-sprite');

        equal(sprite.length, 1);
        ok(sprite.hasClass('cssClass1'));
    });

    test("renders images", function() {
        treeview.kendoTreeView([
            { text: "foo", imageUrl: "foo" }
        ]);

        var image = treeview.find(".k-image");

        equal(image.length, 1);
        ok(image.attr("src").indexOf("foo") >= 0);
    });

    test("renders text", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        equal(treeview.text(), "foo");
    });

    test("renders text encoded", function() {
        treeview.kendoTreeView([
            { text: "foo>>" }
        ]);

        equal(treeview.text(), "foo>>");
    });

    test("renders encoded text as html", function() {
        treeview.kendoTreeView([
            { text: "<span class='foo'></span>", encoded: false }
        ]);

        equal(treeview.find(".foo").length, 1);
    });

    test("renders plus icon if item contains items", function() {
        treeview.kendoTreeView([
            { text: "foo", items: [
                { text: "bar" }
            ] }
        ]);

        equal(treeview.find(".k-icon.k-i-expand").length, 1);
    });

    test("renders minus icon if item is expanded", function() {
        treeview.kendoTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar" }
            ] }
        ]);

        equal(treeview.find(".k-icon.k-i-collapse").length, 1);
    });

    test("does not render group, if there are no sub-items", function() {
        treeview.kendoTreeView([
            { text: "foo" }
        ]);

        equal(treeview.find(".k-item .k-group").length, 0);
    });

    module("template generation", moduleOptions);

    test("uses text field binding", function() {
        treeview.kendoTreeView({
            dataTextField: "foo",
            dataSource: [
                { foo: "bar" }
            ]
        });

        equal(treeview.find(".k-in:first").text(), "bar");
    });

    test("uses last text field binding for deeper levels", function() {
        treeview.kendoTreeView({
            dataTextField: "foo",
            dataSource: [
                { foo: "bar", items: [
                    { foo: "baz" }
                ] }
            ]
        });

        equal(treeview.find(".k-in:last").text(), "baz");
    });

    test("uses accurate text field binding for subnodes", function() {
        treeview.kendoTreeView({
            dataTextField: ["foo", "baz"],
            dataSource: [
                { foo: "bar", items: [
                    { baz: "qux" }
                ] }
            ]
        });

        equal(treeview.find(".k-in:first").text(), "bar");
        equal(treeview.find(".k-in:last").text(), "qux");
    });

    test("uses imageUrl field binding", function() {
        treeview.kendoTreeView({
            dataImageUrlField: "foo",
            dataSource: [
                { foo: "bar" }
            ]
        });

        var image = treeview.find(".k-image:first");

        ok(image.attr("src").indexOf("bar") >= 0);
    });

    test("uses spriteCssClass field binding", function() {
        treeview.kendoTreeView({
            dataSpriteCssClassField: "foo",
            dataSource: [
                { foo: "bar" }
            ]
        });

        ok(treeview.find(".k-sprite").hasClass("bar"));
    });

    test("uses url field binding", function() {
        treeview.kendoTreeView({
            dataUrlField: "foo",
            dataSource: [
                { foo: "bar" }
            ]
        });

        equal(treeview.find("a").length, 1);
        equal(treeview.find("a").attr("href"), "bar");
    });

    test("sets data-uid", function() {
        treeview.kendoTreeView({
            dataSource: [
                { id: 1, text: "foo" }
            ]
        });

        var node = treeview.data("kendoTreeView").dataSource.get(1),
            uidNodes = treeview.find("[" + kendo.attr("uid") + "]");

        equal(uidNodes.length, 1);
        equal(uidNodes.data("kendo-uid"), node.uid);
    });

    test("data-expanded attribute is initially set", function() {
        treeview.kendoTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar" }
                ] }
            ]
        });

        equal(treeview.find(".k-item[data-expanded]").length, 1);
    });

    test("aria-expanded attribute is initially set", function() {
        treeview.kendoTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar" }
                ] }
            ]
        });

        equal(treeview.find(".k-item[aria-expanded]").length, 1);
    });

    module("aria generation", moduleOptions);

    test("treeview role is added to the root list", function() {
        treeview.kendoTreeView({
            dataSource: [
                { id: 1, text: "foo" }
            ]
        });

        equal(treeview.find("ul").attr("role"), "tree");
    });

    test("treeview role is added if created from html", function() {
        var element = $("<div class=\"k-treeview\"><ul><li>item</li></ul></div>").appendTo(QUnit.fixture).kendoTreeView();

        equal(element.find("ul").attr("role"), "tree");
    });

    test("treeviewitem role is assigned to the nodes", function() {
        treeview.kendoTreeView({
            dataSource: [
                { id: 1, text: "foo" }
            ]
        });
        equal(treeview.find("li.k-item:first").attr("role"), "treeitem");
    });

    test("aria-selected true is rendered for selected nodes", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo", selected: true }
            ]
        }).data("kendoTreeView");

        ok(treeview.find(".k-state-selected").closest("li").attr("aria-selected"));
    });

    test("selecting node renders aria-selected", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo" }
            ]
        }).data("kendoTreeView");

        widget.dataSource.at(0).set("selected", true);

        ok(treeview.find(".k-state-selected").closest("li").attr("aria-selected"));
    });

    test("unselecting node selected node renders aria-selected false", function() {
        var widget = treeview.kendoTreeView({
                dataSource: [
                    { text: "foo" }
                ]
            }).data("kendoTreeView"),
            node = widget.dataSource.at(0);

        node.set("selected", true);
        node.set("selected", false);

        equal(treeview.find("li:first").attr("aria-selected"), "false");
    });

    test("aria-disabled true is rendered for disabled nodes", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo", enabled: false }
            ]
        }).data("kendoTreeView");

        ok(treeview.find(".k-state-disabled").closest("li").attr("aria-disabled"));
    });

    test("aria-disabled is not rendered for not disabled nodes", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo", enabled: true }
            ]
        }).data("kendoTreeView");

        ok(!treeview.find("li:first").filter("[aria-disabled]").length);
    });

    test("aria-disabled is not rendered for nodes which does not have enabled field", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo" }
            ]
        }).data("kendoTreeView");

        ok(!treeview.find("li:first").filter("[aria-disabled]").length);
    });

    test("aria-disabled true is rendered when node is disabled", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo" }
            ]
        }).data("kendoTreeView");

        widget.enable(treeview.find("li:first"), false);

        ok(treeview.find("[aria-disabled]").length);
    });

    test("aria-disabled is removed when node is enabled", function() {
        var widget = treeview.kendoTreeView({
            dataSource: [
                { text: "foo" }
            ]
        }).data("kendoTreeView");

        widget.enable(treeview.find("li:first"), false);
        widget.enable(treeview.find("li:first"), true);

        ok(!treeview.find("[aria-disabled]").length);
    });

    test("server-rendered checkboxes are moved to k-checkbox container", function() {
        var dom = $("<ul><li><input type='checkbox' />foo</li></ul>").appendTo(QUnit.fixture);
        dom.kendoTreeView();

        ok(dom.find(".k-checkbox-wrapper").next().is(".k-in"));
    });
})();
