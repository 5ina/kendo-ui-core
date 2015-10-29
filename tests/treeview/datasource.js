(function() {
    var HierarchicalDataSource = kendo.data.HierarchicalDataSource;
    var createTreeView = TreeViewHelpers.fromOptions;
    var treeFromHtml = TreeViewHelpers.fromHtml;

    module("DataSource binding", TreeViewHelpers.noAnimationMoudle);

    test("Initializing from JSON creates HierarchicalDataSource", function() {
        createTreeView([]);

        ok(treeviewObject.dataSource instanceof HierarchicalDataSource);
    });

    test("Initializing from JSON populates dataSource", function() {
        createTreeView([
            { text: "foo" },
            { text: "bar" }
        ]);

        equal(treeviewObject.dataSource.view().length, 2);
    });

    test("Adding items to the datasource adds them to the treeview", function() {
        createTreeView([
            { text: "foo" }
        ]);

        treeviewObject.dataSource.add({ text: "bar" });

        equal(treeview.find(".k-item").length, 2);
    });

    test("Adding items to the datasource adds them to the proper level", function() {
        createTreeView([
            { id: 1, text: "foo" },
            { id: 2, text: "bar" }
        ]);

        var foo = treeviewObject.dataSource.get(1);

        foo.append({ id: 3, text: "baz" });

        equal(treeview.find(".k-item").length, 3);
        equal(treeview.find(".k-item:first .k-item").length, 1);
    });

    test("Removing items from the datasource removes them from the treeview", function() {
        createTreeView([
            { text: "foo" }
        ]);

        var dataItem = treeviewObject.dataItem(treeview.find(".k-item"));

        treeviewObject.dataSource.remove(dataItem);

        equal(treeview.find(".k-item").length, 0);
    });

    test("Removing subgroup items from the datasource removes them from the treeview", function() {
        createTreeView([
            { text: "foo", items: [
                { text: "bar" }
            ] }
        ]);

        var dataItem = treeviewObject.dataItem(treeview.find(".k-item:last"));

        treeviewObject.dataSource.remove(dataItem);

        equal(treeview.find(".k-item").length, 1);
    });

    test("DataSource as an object", 2, function() {
        createTreeView({
            dataSource: {
                data: [
                    { text: "foo" }
                ]
            }
        });

        var item = treeview.find(".k-item");

        equal(item.length, 1);
        equal(treeviewObject.text(item), "foo");
    });

    test("Passing existing dataSource", function() {
        var dataSource = new HierarchicalDataSource({
            data: [
                { text: "foo" }
            ]
        });

        createTreeView({
            dataSource: dataSource
        });

        var item = treeview.find(".k-item");

        equal(item.length, 1);
        equal(treeviewObject.text(item), "foo");
    });

    test("Removing items from the datasource removes them from the treeview at the proper level", function() {
        createTreeView([
            { id: 1, text: "foo", items: [
                { id: 2, text: "bar" }
            ] }
        ]);

        var dataItem = treeviewObject.dataItem(treeview.find(".k-item:last"));

        treeviewObject.dataSource.remove(dataItem);

        equal(treeview.find(".k-item").length, 1);

    });

    test("Loading root nodes from remote datasource inserts them in the TreeView", function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success([ { id: 1, text: "foo" } ]);
                    }
                }
            }
        });

        var item = treeview.find(".k-item");

        equal(item.length, 1);
        equal(treeviewObject.text(item), "foo");
    });

    test("Non-leaf nodes are rendered as expandable", function() {
        var i = 1;

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success([ { id: i++, hasChildren: true, text: "foo" } ]);
                    }
                },
                schema: {
                    model: {
                        hasChildren: "hasChildren"
                    }
                }
            }
        });

        var icon = treeview.find(".k-plus");

        equal(icon.length, 1);
    });

    test("Expanding non-leaf nodes loads subgroups", function() {
        var i = 0;

        function readAction(options) {
            i++;

            options.success([
                { id: i, hasChildren: true, text: "foo " + i }
            ]);
        }

        createTreeView({
            dataSource: {
                transport: {
                    read: readAction
                },
                schema: {
                    model: {
                        hasChildren: "hasChildren"
                    }
                }
            },
            animation: false
        });

        treeviewObject.toggle(treeview.find(".k-item"));

        equal(treeview.find(".k-item").length, 2);
        equal(treeview.find(".k-minus").length, 1);
    });

    test("Sorting the datasource sorts the treeview", function() {
        createTreeView([
            { text: "bravo" },
            { text: "alpha" }
        ]);

        treeviewObject.dataSource.sort({ field: "text", dir: "asc" });

        var items = treeview.find(".k-item");

        equal(items.length, 2);
        equal(items.eq(0).text(), "alpha");
        equal(items.eq(1).text(), "bravo");
    });

    test("Sorting expanded nodes persists their expanded state", function() {
        createTreeView({
            dataSource: [
                { text: "alpha", expanded: true, items: [
                    { text: "charlie" },
                    { text: "bravo" }
                ] }
            ]
        });

        treeviewObject.dataSource.sort({ field: "text", dir: "asc" });

        var items = treeview.find(".k-item");

        equal(items.length, 3);
        equal(treeviewObject.text(items.eq(0)), "alpha");

        var subitems = items.eq(0).find(".k-item");
        equal(subitems.length, 2);
        equal(treeviewObject.text(subitems.eq(0)), "charlie");
        equal(treeviewObject.text(subitems.eq(1)), "bravo");
    });

    test("Sorting dynamically expanded nodes persists their expanded state", function() {
        createTreeView([
            { text: "alpha", items: [
                { text: "charlie" },
                { text: "bravo" }
            ] }
        ]);

        treeviewObject.expand(".k-item:first");

        treeviewObject.dataSource.sort({ field: "text", dir: "asc" });

        var items = treeview.find(".k-item");

        equal(items.length, 3);
        equal(treeviewObject.text(items.eq(0)), "alpha");

        var subitems = items.eq(0).find(".k-item");
        equal(subitems.length, 2);
        equal(subitems.parent().css("display"), "block");
        equal(treeviewObject.text(subitems.eq(0)), "charlie");
        equal(treeviewObject.text(subitems.eq(1)), "bravo");
    });

    test("moving nodes between treeviews", function() {
        var tree1 = $("<div />").appendTo(QUnit.fixture).kendoTreeView([
                { text: "foo" }
            ]),
            tree2 = $("<div />").appendTo(QUnit.fixture).kendoTreeView([
                { text: "bar" }
            ]);

        tree2.data("kendoTreeView").append(tree2.find(".k-item"), tree1.find(".k-item"));

        equal(tree1.find(".k-item").length, 2);
        equal(tree2.find(".k-item").length, 0);
    });

    test("moving of parent nodes", function() {
        createTreeView([
            { text: "alpha", expanded: true, items: [
                { text: "charlie" }
            ] },
            { text: "bravo" }
        ]);

        // move alpha over bravo
        treeviewObject.append(treeview.find(".k-item:first"), treeview.find(".k-item:last"));

        equal(treeview.find(".k-item").length, 3);
        equal(treeview.find(".k-item:last").text(), "charlie");
    });

    test("insertBefore refreshes the treeview", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar" },
                { text: "baz" }
            ] }
        ]);

        treeviewObject.insertBefore(treeviewObject.findByText("baz"), treeviewObject.findByText("bar"));

        var subitems = treeview.find(".k-item > .k-group > .k-item");

        equal(subitems.eq(0).text(), "baz");
        equal(subitems.eq(1).text(), "bar");
    });

    test("Moving root level nodes between treeviews", function() {
        var tree1 = $("<div />").appendTo(QUnit.fixture).kendoTreeView([
                { text: "foo" }
            ]),
            tree2 = $("<div />").appendTo(QUnit.fixture).kendoTreeView([
                { text: "bar" }
            ]);

        tree2.data("kendoTreeView").insertBefore(tree2.find(".k-item"), tree1.find(".k-item"));

        equal(tree1.find(".k-item").length, 2);
        equal(tree2.find(".k-item").length, 0);
    });

    test("initializing from list infers text", function() {
        treeFromHtml("<ul><li>foo</li></ul>");

        equal(treeviewObject.dataSource.data()[0].text, "foo");
    });

    test("initializing from list attaches uids", function() {
        treeFromHtml("<ul><li>foo</li></ul>");

        equal(treeview.find(".k-item").attr(kendo.attr("uid")), treeviewObject.dataSource.data()[0].uid);
    });

    test("initializing from list reads all levels", function() {
        treeFromHtml("<ul><li>foo<ul><li>bar</li></ul></li></ul>");

        var children = treeviewObject.dataSource.data()[0].children;

        equal(children.data().length, 1);
    });

    test("initializing from list attaches uids to subgroup nodes", function() {
        treeFromHtml("<ul><li>foo<ul><li>bar</li></ul></li></ul>");

        var children = treeviewObject.dataSource.data()[0].children;

        var child = children.data()[0];

        equal(treeview.find(".k-item:last").attr(kendo.attr("uid")), child.uid);
    });

    test("moving node after initializing from list", function() {
        treeFromHtml("<ul><li>foo<ul><li>bar</li></ul></li></ul>");

        treeviewObject.insertAfter(treeviewObject.findByText("bar"), treeviewObject.findByText("foo"));

        equal(treeview.closest(".k-treeview").find("ul").length, 1);
        equal(treeview.find(".k-item:last").text(), "bar");
    });

    test("the current datasource view is used when refreshing the datasource", function() {
        createTreeView([
            { text: "alpha" },
            { text: "bravo" }
        ]);

        treeviewObject.dataSource.filter({ field: "text", operator: "eq", value: "alpha" });

        treeviewObject.dataSource.read();

        equal(treeview.find(".k-item").length, 1);
    });

    test("setting autoBind to false does not fetch the dataSource", function() {
        var changeTriggered = false,
            dataSource = new HierarchicalDataSource({
                items: [
                    { text: "alpha" },
                    { text: "bravo" }
                ],
                change: function() {
                    changeTriggered = true;
                }
            });

        createTreeView({
            autoBind: false,
            dataSource: dataSource
        });

        ok(!changeTriggered);
    });

    test("appending items to leaf nodes sets the expanded state of the leaf node", function() {
        createTreeView([
            { text: "foo" }
        ]);

        var foo = treeviewObject.findByText("foo");

        treeviewObject.append({ text: "bar" }, foo);

        ok(treeviewObject.dataItem(foo).expanded);
    });

    test("sorting subnodes behaves correctly", function() {
        createTreeView({
            dataSource: [
                { text: "alpha", items: [
                    { text: "charlie" },
                    { text: "bravo" }
                ] }
            ]
        });

        treeviewObject.dataItem(".k-item:first").children.sort({ field: "text", dir: "asc" });

        equal(treeview.find(".k-item:first .k-item").length, 2);
    });

    test("appending nodes loads their parent nodes", function() {
        var called = false;

        treeFromHtml("<ul><li>foo</li></ul>");

        var first = treeviewObject.dataItem(".k-item:first");

        treeviewObject.append({ text: "bar" }, treeview.find(".k-item:first"));

        ok(first.loaded());
    });

    test("appending nodes sets their expanded state", function() {
        treeFromHtml("<ul><li>foo</li></ul>");

        var foo = treeview.find(".k-item:first");

        treeviewObject.append({ text: "bar" }, foo);

        ok(treeviewObject.dataItem(foo).expanded);
    });

    test("appending nodes with subitems", function() {
        treeFromHtml("<ul><li>foo</li><li>bar<ul><li>baz</li></ul></li></ul>");

        var foo = treeviewObject.findByText("foo"),
            bar = treeviewObject.findByText("bar");

        bar = treeviewObject.append(bar, foo);

        equal(treeview.find(".k-item").length, 3);
        equal(bar.find(".k-group").length, 1);
        equal(bar.find(".k-group .k-in").text(), "baz");
    });

    test("appending nodes with subitems to parents with subnodes", function() {
        treeFromHtml("<ul>" +
            "<li>foo<ul><li>qux</li></ul></li>" +
            "<li>bar<ul><li>baz</li></ul></li>" +
        "</ul>");

        var foo = treeviewObject.findByText("foo"),
            bar = treeviewObject.findByText("bar");

        bar = treeviewObject.append(bar, foo);

        equal(treeview.find(".k-item").length, 4);
        equal(bar.find(".k-group").length, 1);
        equal(bar.find(".k-group .k-in").text(), "baz");
    });

    test("updating dataItem text updates the treeview", function() {
        createTreeView([
            { id: 1, text: "foo" }
        ]);

        var foo = treeviewObject.findByText("foo");
        treeviewObject.dataItem(foo).set("text", "bar");

        equal(treeviewObject.text(foo), "bar");
    });

    test("updating dataItem text updates the treeview and regards dataTextField", function() {
        createTreeView({
            dataTextField: "foo",
            dataSource: [
                { id: 1, text: "unused", foo: "bar" }
            ]
        });

        var bar = treeviewObject.findByText("bar");
        treeviewObject.dataItem(bar).set("foo", "baz");

        equal(treeviewObject.text(bar), "baz");
    });

    test("dataTextField as array accessor", function() {
        createTreeView({
            dataTextField: "['foo']",
            dataSource: [
                { id: 1, text: "unused", foo: "bar" }
            ]
        });

        equal(treeview.text(), "bar");
    });

    test("complex dataTextField is evaluated with getter", function() {
        createTreeView({
            dataTextField: "Product.Name",
            dataSource: [
                { id: 1, Product: { Name: "bar" } }
            ]
        });

        equal(treeview.text(), "bar");
    });

    test("initially expanded items query the child datasources", function() {
        createTreeView({
            dataSource: new HierarchicalDataSource({
                data: [
                    { text: "foo", expanded: true, items: [
                        { text: "bar" }
                    ] }
                ]
            })
        });

        equal(treeview.find(".k-item").length, 2);
    });

    test("checking checkboxes sets dataItem checked state", function() {
        createTreeView({
            dataSource: [
                { text: "foo" }
            ],
            checkboxes: true
        });

        treeview.find(":checkbox").attr("checked", "checked").trigger("change");

        ok(treeviewObject.dataSource.data()[0].checked);
    });

    test("initializing checked nodes sets indeterminate state of parents correctly", function() {
        createTreeView({
            dataSource: [
                { text: "foo", items: [
                    { text: "bar" },
                    { text: "baz", checked: true }
                ] }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        ok(treeview.find(":checkbox").eq(0).prop("indeterminate"));
    });

    test("setDataSource sets new datasource", function() {
        createTreeView([
            { text: "foo" }
        ]);

        treeviewObject.setDataSource(new HierarchicalDataSource({
            data: [
                { text: "bar" }
            ]
        }));

        equal(treeview.find(".k-item").text(), "bar");
    });

    test("setDataSource updates indeterminate state when new data arrives", function() {
        createTreeView({
            dataSource: [
                { text: "foo" }
            ],
            checkboxes: {
                checkChildren: true
            }
        });

        var treeSpy = spy(treeviewObject, "updateIndeterminate");

        var deferred = $.Deferred();
        treeviewObject.setDataSource({
            transport: {
                read: function(options) {
                    deferred.then(options.success, options.error);
                }
            }
        });

        ok(!treeSpy.calls("updateIndeterminate"));

        deferred.resolve([ { text: "bar" } ]);

        ok(treeSpy.calls("updateIndeterminate"));
    });

    var Node = kendo.data.Node;

    test("binding to derived nodes", function() {
        var ExtendedNode = Node.define({
            extension: true
        });

        createTreeView({
            dataSource: {
                data: [
                    new ExtendedNode({ text: "foo" })
                ]
            }
        });

        equal(treeview.find(".k-item").text(), "foo");
    });

    test("binding to hierarchy of derived nodes", function() {
        var ExtendedNode = Node.define({
            extension: true
        });

        createTreeView({
            dataSource: {
                data: [
                    new ExtendedNode({ text: "foo", items: [
                        new ExtendedNode({ text: "bar" })
                    ] })
                ]
            },

            loadOnDemand: false
        });

        equal(treeview.find(".k-item:last").text(), "bar");
    });

    test("appending through node api does not expand item and group", function() {
        var ExtendedNode = Node.define({
            extension: true,
            expanded: false
        });

        var foo = new ExtendedNode({ text: "foo" });

        createTreeView({
            dataSource: {
                data: [ foo ]
            },

            loadOnDemand: false
        });

        foo.append(new ExtendedNode({ text: "bar" }));

        ok(!treeview.find(".k-item .k-group").is(":visible"));
    });

    test("populating hierarchical datasource before initialization", function() {
        var root = new Node({ text: "foo", expanded: true });

        var child = new Node({ text: "bar" });

        root.append(child);

        createTreeView({
            dataSource: {
                data: [root]
            },

            loadOnDemand: false
        });

        equal(treeview.find(".k-item").length, 2);
    });

    test("items without children do not initialize empty datasource", function() {
        var root = new Node({ text: "foo" });

        createTreeView({
            dataSource: {
                data: [root]
            },

            loadOnDemand: false
        });

        ok(!root.children);
    });

    test("binding to HDS in observable object", function() {
        var viewModel = new kendo.observable({
            treeData: new kendo.data.HierarchicalDataSource({
                data: [
                    { text: "Storage", items: [
                        { text: "Wall Shelving" },
                        { text: "Floor Shelving" },
                        { text: "Kids Storage" }
                    ] },
                    { text: "Lights", items: [
                        { text: "Ceiling" },
                        { text: "Table" },
                        { text: "Floor" }
                    ] }
                ]
            })
        });

        createTreeView({
            dataSource: viewModel.treeData
        });

        equal(treeview.find(".k-item").length, 2);
    });

    test("re-fetching a node removes subgroup", function() {
        var i = 1;

        createTreeView({
            animation: false,
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success([ { id: i++, hasChildren: true, text: "foo" } ]);
                    }
                },
                schema: {
                    model: {
                        hasChildren: "hasChildren"
                    }
                }
            },
            expand: function(e) {
                var dataItem = this.dataItem(e.node);
                dataItem.loaded(false);
            }
        });

        treeviewObject.expand(".k-item");

        treeviewObject.collapse(".k-item:first");

        treeview.find(".k-item .k-group").attr("marked", "marked");

        treeviewObject.expand(".k-item");

        ok(!treeview.find(".k-item .k-group").attr("marked"));
    });

    test("collapse method does not fetch data from server", function() {
        var calls = 0;

        var dataFor = {
            "root": [ { id: 1, text: "foo", hasChildren: true } ],
            1: [ { id: 2, text: "bar", hasChildren: false } ]
        };

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        calls++;
                        options.success(dataFor[options.data.id || "root"]);
                    }
                }
            }
        });

        treeviewObject.expand(".k-item");
        treeviewObject.collapse(".k-item");

        equal(calls, 2);
    });

    test("returning an empty response from the server removes the expand icon", function() {
        var dataFor = {
            "root": [ { id: 1, text: "foo", hasChildren: true } ],
            1: []
        };

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.success(dataFor[options.data.id || "root"]);
                    }
                }
            }
        });

        treeviewObject.expand(".k-item");

        equal(treeview.find(".k-icon").length, 0);
    });

    test("append sets hasChildren flag", function() {
        createTreeView([
            { text: "foo", hasChildren: false }
        ]);

        var foo = $(".k-item");

        treeviewObject.append({ text: "bar" }, foo);

        ok(treeviewObject.dataItem(foo).hasChildren);
    });

    test("appending to collapsed item", function() {
        createTreeView({
            dataSource: new HierarchicalDataSource({
                data: [
                    { text: "foo", items: [
                        { text: "bar" }
                    ] }
                ]
            })
        });

        var foo = $(".k-item:first");

        treeviewObject.append({ text: "baz" }, foo);

        var items = foo.find(".k-item");

        equal(items.length, 2);
        equal(treeviewObject.text(items[0]), "bar");
        equal(treeviewObject.text(items[1]), "baz");
    });

    test("pushUpdate updates root node", function() {
        createTreeView({
            dataSource: {
                data: [
                    { id: 1, text: "foo" },
                    { id: 2, text: "bar" }
                ]
            }
        });

        treeviewObject.dataSource.pushUpdate({ id: 2, text: "baz" });

        equal(treeview.find(".k-item").length, 2);
        equal(treeview.find(".k-item:last").text(), "baz");
    });

    test("pushUpdate updates custom field in template", function() {
        createTreeView({
            dataTextField: "foo",
            template: "#: item.bar #",
            dataSource: {
                data: [
                    { id: 1, bar: "foo" },
                    { id: 2, bar: "bar" }
                ]
            }
        });

        treeviewObject.dataSource.pushUpdate({ id: 2, bar: "baz" });

        equal(treeview.find(".k-item:last").text(), "baz");
    });

    test("pushUpdate updates child node", function() {
        createTreeView({
            dataSource: [
                { id: 1, text: "foo", items: [
                    { id: 2, text: "bar" }
                ] },
            ]
        });

        treeviewObject.dataSource.pushUpdate({ id: 2, text: "baz" });

        equal(treeview.find(".k-item").length, 2);
        equal(treeview.find(".k-item .k-item:last").text(), "baz");
    });

    test("expand/collapse does not redraw node", function() {
        var dom = $("<ul><li>foo<i class='bar' /><ul><li>baz</li></ul></li></ul>").appendTo(QUnit.fixture);
        dom.kendoTreeView();

        dom.find(".k-icon:First").click();

        equal(dom.find("i.bar").length, 1);
    });

    test("checking does not redraw node", function() {
        var dom = $("<ul><li><input type='checkbox' class='k-checkbox' />foo <i class='bar' /></li></ul>").appendTo(QUnit.fixture);
        dom.kendoTreeView();

        dom.find("[type=checkbox]").prop("checked", true).trigger("change");

        equal(dom.find("i.bar").length, 1);
    });

    asyncTest("dataSource can be searched within dataBound handler", 1, function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        setTimeout(function() {
                            options.success([ { id: 1, expanded: true, hasChildren: true } ]);
                        }, 100);
                    }
                }
            },
            dataBound: function() {
                this.dataSource.get(2);

                ok(true);

                start();
            }
        });
    });

    asyncTest("appending to unloaded remote node calls read once", 1, function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        if (options.data.id){
                            setTimeout(function() {
                                ok(true);

                                options.success([]);
                            });
                        } else {
                            options.success([{id: 1, text: "foo", hasChildren: true}]);
                        }
                    }
                }
            }
        });

        treeviewObject.append({ text: "bar", hasChildren: true }, $(".k-item:first"));

        setTimeout(start, 100);
    });
})();
