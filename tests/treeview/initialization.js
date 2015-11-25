(function() {
    var TreeView = kendo.ui.TreeView;
    var createTreeView = TreeViewHelpers.fromOptions;
    var treeFromHtml = TreeViewHelpers.fromHtml;

    module("initialization", TreeViewHelpers.basicModule);

    test("adds necessary classes to div", function() {
        ok(treeFromHtml("<div />").is(".k-widget.k-treeview"));
    });

    test("attaches treeview object to div", function() {
        ok(treeFromHtml("<div />").data("kendoTreeView") instanceof TreeView);
    });

    test("allows init from non-div elements", function() {
        ok($.contains(QUnit.fixture[0], treeFromHtml("<section id='tree' />")[0]));
    });

    test("attaches treeview object to ul", function() {
        ok(treeFromHtml("<ul><li>foo</li></ul>").data("kendoTreeView") instanceof TreeView);
    });

    test("extends passed options", function() {
        var dom = treeFromHtml("<ul><li>foo</li></ul>", { foo: "bar" });
        var options = dom.data("kendoTreeView").options;

        notEqual(options.foo, undefined);
        equal(options.foo, "bar");
    });

    test("unneeded whitespace is stripped from item text", function() {
        var treeview = treeFromHtml("<ul><li>foo    </li></ul>").data("kendoTreeView");

        equal(treeview.findByText("foo").length, 1);
    });

    test("initialization from fully rendered treeview", function() {
        var dom = treeFromHtml(
            '<div class="k-widget k-treeview" id="treeview">' +
                '<ul class="k-group">' +
                    '<li class="k-item k-first k-last">' +
                        '<div class="k-top k-bot">' +
                            '<span class="k-icon k-minus"></span>' +
                            '<span class="k-in">My Web Site</span>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>'
        );

        equal(dom.find(".k-item").length, 1);
    });

    test("initialization populates model expanded state", function() {
        var dom = treeFromHtml(
            '<div class="k-widget k-treeview" id="treeview">' +
                '<ul class="k-group">' +
                    '<li class="k-item k-first k-last" data-expanded="true">' +
                        '<div class="k-top k-bot">' +
                            '<span class="k-icon k-minus"></span>' +
                            '<span class="k-in">foo</span>' +
                        '</div>' +
                        '<ul class="k-group">' +
                            '<li class="k-item">' +
                                '<div class="k-top">' +
                                    '<span class="k-in">bar</span>' +
                                '</div>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</div>');

        ok(dom.data("kendoTreeView").dataSource.data()[0].expanded);
    });

    test("initialization populates model checked state", function() {
        var dom = treeFromHtml(
            '<div class="k-widget k-treeview" id="treeview">' +
                '<ul class="k-group">' +
                    '<li class="k-item k-first k-last">' +
                        '<div class="k-top k-bot">' +
                            '<span class="k-checkbox-wrapper"><input type="checkbox" checked></span>' +
                            '<span class="k-in">foo</span>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>', {
            checkboxes: true
        });

        ok(dom.data("kendoTreeView").dataSource.data()[0].checked);
    });

    test("toggle buttons are rendered correctly when initializing from html", function() {
        var dom = treeFromHtml("<ul>" +
            "<li>foo<ul><li>baz</li></ul></li>" +
            "<li data-expanded='true'>bar<ul><li>qux</li></ul></li>" +
        "</ul>");

        equal(dom.find(".k-icon.k-plus").length, 1);
        equal(dom.find(".k-icon.k-minus").length, 1);
    });

    test("sets tabindex=0 by default", function() {
        equal(treeFromHtml("<div />").attr("tabindex"), 0);
    });

    test("leaves wrapper tabindex, if available", function() {
        equal(treeFromHtml("<div tabindex=3 />").attr("tabindex"), 3);
    });

    test("leaves tabindex=-1", function() {
        equal(treeFromHtml("<div tabindex='-1' />").attr("tabindex"), -1);
    });

    test("gets tabindex from list", function() {
        var dom = treeFromHtml("<ul tabindex='42' />");

        equal(dom.closest(".k-treeview").attr("tabindex"), 42);
        ok(!dom.attr("tabindex"));
    });

    test("initializing from array", function() {
        var dom = treeFromHtml("<div />", [{ text: "foo" }]);

        ok(dom.is(".k-treeview.k-widget"));
        equal(dom.children("ul.k-treeview-lines.k-group").length, 1);
        equal(dom.find("li").length, 1);
        ok(dom.find("li").is(".k-item"));
        equal(dom.find("li").text(), "foo");
    });

    test("initialization from ul with datasource", function() {
        var dataSource = {
            transport: {
                read: function(options) {
                    options.success([ { text: "foo", hasChildren: true } ]);
                }
            },
            schema: { model: { id: "id", hasChildren: "hasChildren" } }
        };

        var dom = treeFromHtml("<ul />", { dataSource: dataSource });

        ok(true);
    });

    asyncTest("initialization from ul with static data", 1, function() {
        var dom = treeFromHtml("<ul />", {
            dataSource: {
                data: [ { text: "foo" } ],
                change: function () {
                    start();
                    ok(true);
                }
            }
        });
    });

    test("items returns the flattened items elements", 1, function() {
        var dom = treeFromHtml("<ul>" +
            "<li>foo<ul><li>baz</li></ul></li>" +
            "<li data-expanded='true'>bar<ul><li>qux</li></ul></li>" +
        "</ul>");

        equal(dom.data("kendoTreeView").items().length, 4);
    });
})();
