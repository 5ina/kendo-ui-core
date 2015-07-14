(function() {
    var createTreeView = TreeViewHelpers.fromOptions;

    function check(node, checked) {
        node = treeview.find(node || ".k-state-selected")

        if (!node.hasClass("k-item")) {
            node = node.parentsUntil(".k-treeview", ".k-item").eq(0);
        }

        if (typeof checked == "undefined") {
            checked = true;
        }

        node.find(":checkbox").eq(0).prop("checked", checked).trigger("change");
    }

    function uncheck(node) {
        check(false, false);
    }

    module("checkboxes", TreeViewHelpers.noAnimationMoudle);

    test("checking checkboxes sets indeterminate state of parents", function() {
        createTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar", selected: true },
                    { text: "baz" }
                ] },
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();

        ok(treeview.find(":checkbox:first").prop("indeterminate"));
    });

    test("checking checkboxes via the api indeterminate state of their parents", function() {
        createTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar", selected: true },
                    { text: "baz" }
                ] },
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var node = treeview.find(".k-item:last");
        var dataItem = treeview.kendoTreeView("dataItem", node);

        dataItem.set("checked", true);

        ok(treeview.find(":checkbox:first").prop("indeterminate"));
    });

    test("checking checkboxes sets checked state of parents", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar", selected: true }
                ] },
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();

        ok(treeview.find(":checkbox:first").prop("checked"));
    });

    test("checking checkboxes sets checked state of children", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true, items: [
                    { text: "bar" },
                    { text: "baz" }
                ] },
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();

        var checkboxes = treeview.find(":checkbox");

        ok(checkboxes.eq(1).prop("checked"));
        ok(checkboxes.eq(2).prop("checked"));
    });

    test("checking all checkboxes on a level clears parent indeterminate flag", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar", selected: true },
                    { text: "baz" }
                ] },
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();
        check(".k-item .k-item:last");

        ok(!treeview.find(":checkbox:first").prop("indeterminate"));
    });

    test("checking parent clears indeterminate state of children", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar", items: [
                        { text: "baz", selected: true },
                        { text: "cat" }
                    ] }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();
        check(".k-item:first");

        ok(!treeview.find(":checkbox").eq(1).prop("indeterminate"));
        ok(!treeview.find(":checkbox").eq(1).data("indeterminate"));
    });

    test("checkboxes:true renders k-checkbox wrappers with default template", function() {
        createTreeView({
            dataSource: [
                { text: "foo" }
            ],
            checkboxes: true
        });

        var items = treeview.find("span.k-checkbox");

        equal(items.length, 1);

        var checkbox = items.eq(0).find(":checkbox");
        equal(checkbox.length, 1);
        equal(checkbox.attr("name"), undefined);
        ok(!checkbox.is(":checked"));
    });

    test("checkboxes.template as function", function() {
        createTreeView({
            dataSource: [
                { text: "foo" }
            ],
            checkboxes: {
                template: kendo.template("<input class='mycheck_#= item.text #' type='checkbox' />")
            }
        });

        equal(treeview.find(".mycheck_foo").length, 1);
    });

    test("checkboxes.template as string", function() {
        createTreeView({
            dataSource: [
                { text: "bar" }
            ],
            checkboxes: {
                template: "<input class='mycheck_#= item.text #' type='checkbox' />"
            }
        });

        equal(treeview.find(".mycheck_bar").length, 1);
    });

    test("checkboxes.checkChildren checks child nodes", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar" },
                    { text: "baz" }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var checkboxes = treeview.find(":checkbox");

        checkboxes.eq(0).prop("checked", true).trigger("change");

        ok(checkboxes.eq(1).prop("checked"));
        ok(checkboxes.eq(2).prop("checked"));
    });

    test("checkbox does not check children if checkChildren is false", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar" },
                    { text: "baz" }
                ] }
            ],
            checkboxes: {
                checkChildren: false
            }
        });

        var checkboxes = treeview.find(":checkbox");

        checkboxes.eq(0).prop("checked", true).trigger("change");

        ok(!checkboxes.eq(1).prop("checked"));
        ok(!checkboxes.eq(2).prop("checked"));
    });

    test("checkboxes.checkChildren sets indeterminate state of parent", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar" },
                    { text: "baz" }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var checkboxes = treeview.find(":checkbox");

        checkboxes.eq(1).prop("checked", true).trigger("change");

        ok(checkboxes.eq(0).prop("indeterminate"));
    });

    test("checkboxes.checkChildren sets indeterminate state of all parents", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar", items: [
                        { text: "baz" },
                        { text: "qux" }
                    ] }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var checkboxes = treeview.find(":checkbox");

        checkboxes.eq(3).prop("checked", true).trigger("change");

        ok(checkboxes.eq(0).prop("indeterminate"));
    });

    test("indaterminate state is propagated across parents", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar" },
                    { text: "baz", items: [
                        { text: "qux" },
                        { text: "cat" }
                    ] }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var checkboxes = treeview.find(":checkbox");

        checkboxes.eq(3).prop("checked", true).trigger("change");

        ok(checkboxes.eq(0).prop("indeterminate"));
    });

    test("items with set checked state are rendered checked", function() {
        createTreeView({
            dataSource: [
                { id: 1, checked: true, text: "foo" },
                { id: 2, checked: false, text: "bar" }
            ],
            checkboxes: true
        });

        var checkboxes = treeview.find(":checkbox");

        ok(checkboxes.eq(0).is(":checked"));
        ok(!checkboxes.eq(1).is(":checked"));
    });

    test("checkboxes.name renders name attribute for checkbox inputs", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo" }
            ],
            checkboxes: {
                name: "bar[]"
            }
        });

        var checkboxes = treeview.find(":checkbox");

        equal(checkboxes.eq(0).attr("name"), "bar[]");
    });

    test("fetching remote nodes renders them as checked if parent checkboxes are checked and checkChildren is true", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", checked: true }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        treeview.data("kendoTreeView").append({ id: 2, text: "bar" }, $(".k-item"));

        ok(treeview.find(":checkbox:last").prop("checked"));
    });

    test("checking root node items does not propagate state outside of treeview", function() {
        var dom = $('<div class="k-item"><div><input type="checkbox" /></div><div class="t"></div></div>').appendTo(QUnit.fixture);

        treeview = dom.find(".t").kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
            dataSource: [{ id: 1, text: "foo", selected: true }]
        });

        check();

        ok(!dom.find(":checkbox").eq(0).is(":checked"));
    });

    test("indeterminate state is initially set", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, checked: false, text: "bar" },
                    { id: 3, checked: true, text: "baz" }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        ok(treeview.find(":checkbox:first").prop("indeterminate"));
    });

    test("checkChildren:false does not update parent node state after checks", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, text: "bar", selected: true }
                ] }
            ],
            checkboxes: true
        });

        check();

        ok(!treeview.find(":checkbox:first").prop("checked"));
    });

    test("checking all child checkboxes updates parent checked state", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, text: "bar", selected: true },
                    { id: 3, text: "baz", checked: true }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();

        ok(treeviewObject.dataSource.get(1).checked);
    });

    test("remove checked state on indeterminate parents", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, text: "bar", selected: true },
                    { id: 3, text: "baz", checked: true }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        check();
        uncheck();

        ok(!("checked" in treeviewObject.dataSource.get(1)));
    });

    test("enabled: false renders disabled checkbox", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo" },
                { id: 2, text: "bar", enabled: false }
            ],
            checkboxes: true
        });

        equal(treeview.find(":checkbox[disabled]").length, 1);
        equal(treeview.find(":checkbox:not([disabled])").length, 1);
    });

    test("disabling an item through the API disables its checkbox", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", selected: true }
            ],
            checkboxes: true
        });

        treeviewObject.enable(treeviewObject.select(), false);

        equal(treeview.find(":checkbox[disabled]").length, 1);
    });

    test("checkChildren sets state of child dataItems", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, text: "bar" }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var ds = treeviewObject.dataSource;

        ds.get(1).set("checked", true);

        ok(ds.get(2).checked);
    });

    test("checkChildren with sparse checkboxes", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", expanded: true, items: [
                    { id: 2, text: "bar", uncheckable: true },
                    { id: 3, text: "baz", uncheckable: true }
                ] }
            ],
            checkboxes: {
                checkChildren: true,
                template: "# if (!item.uncheckable) { #" +
                    "<input type='checkbox' />" +
                "# } #"
            }
        });

        var ds = treeviewObject.dataSource;

        ds.get(1).set("checked", true);

        ok(ds.get(3).checked);
    });

    test("checkChildren checks root dataItem upon initial load", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { text: "bar", checked: true },
                    { text: "baz", checked: true }
                ] }
            ],
            checkboxes: { checkChildren: true }
        });

        ok(treeviewObject.dataSource.get(1).checked);
    });

    asyncTest("indeterminate state is updated when fetching remote nodes", function() {
        var timeout = setTimeout(start, 1000);

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        if (options.data.id) {
                            setTimeout(function(){
                                options.success([
                                    { text: "sub1", checked: true, hasChildren: false},
                                    { text: "sub2", checked: false, hasChildren: false}
                                ]);

                                clearTimeout(timeout);
                                start();
                                ok(treeview.find(":checkbox:first").prop("indeterminate"));
                            }, 100);
                        } else {
                            options.success([
                                { id: 1, text: "item", hasChildren: true, expanded: true }
                            ]);
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        hasChildren: "hasChildren"
                    }
                },
            },
            checkboxes: { checkChildren: true }
        });
    });
})();
