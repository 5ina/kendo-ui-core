(function() {
    var keys = kendo.keys;
    var createTreeView = TreeViewHelpers.fromOptions;
    var treeFromHtml = TreeViewHelpers.fromHtml;

    module("expand / collapse", {
        setup: function() {
            $.mockjaxSettings.responseTime = 0;
            $.mockjaxSettings.contentType = "text/html";
            kendo.effects.disable();
        },
        teardown: function() {
            TreeViewHelpers.destroy();
            kendo.effects.enable();
            $.mockjax.clear();
        }
    });

    test("expanding disabled items does not expand them", function() {
        createTreeView([
            { text: "foo", enabled: false, items: [ { text: "bar" } ] }
        ]);

        var item = $(".k-item:first", treeview);

        item.find(".k-i-expand")
            .toggleClass("k-plus-disabled", true)
            .trigger("click");

        equal(item.find(".k-group").css("display"), "none");
    });

    test("clicking plus icon should toggle minus icon and show subgroup", function() {
        createTreeView([
            { text: "foo", items: [ { text: "bar" } ] }
        ]);

        var item = $(".k-item:first", treeview);

        item.find(".k-i-expand")
            .trigger("click");

        ok(item.find(".k-icon").hasClass("k-i-collapse"));
        equal(item.find(".k-group").css("display"), "block");
    });

    test("clicking minus icon should toggle plus icon and collaspe subgroup", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [ { text: "bar" } ] }
        ]);

        var item = $(".k-item:first", treeview);

        item.find(".k-i-collapse")
            .trigger("click");

        ok(item.find(".k-icon").hasClass("k-i-expand"));
        equal(item.find(".k-group").css("display"), "none");
    });

    test("double clicking disabled items does not expand them", function() {
        createTreeView([
            { text: "foo", disabled: true, items: [ { text: "bar" } ] }
        ]);

        var item = $(".k-item:first", treeview);

        item.find(".k-in.k-state-disabled")
            .trigger("dblclick");

        equal(item.find(".k-group").css("display"), "none");
    });

    test("appending items dynamically allows parent to be collapsed", function() {
        createTreeView([
            { text: "foo" }
        ]);

        var parentNode = treeview.find(".k-item:first");

        treeviewObject.append({ text: "bar" }, parentNode);
        treeviewObject.collapse(parentNode);

        equal(treeview.find(".k-icon.k-i-expand").length, 1);
    });

    test("toggle buttons work when initializing from ul", function() {
        var dom = treeFromHtml("<ul><li>foo<ul><li>bar</li></ul></li></ul>");

        dom.find(".k-i-expand").trigger("click");

        ok(dom.find(".k-i-collapse").length);
    });

    module("selection", TreeViewHelpers.noAnimationMoudle);

    test("clicking nodes selects them", function() {
        createTreeView([
            { text: "foo" }
        ]);

        var item = treeview.find(".k-item:first .k-in");

        item.trigger("click");

        ok(item.hasClass("k-state-selected"));
    });

    test("clicking node sets it as focused", function() {
        createTreeView([
            { text: "foo" }
        ]);

        var item = treeview.find(".k-item:first .k-in");

        item.trigger("click");

        ok(item.hasClass("k-state-focused"));
    });

    test("clicking disabled nodes does not select them", function() {
        createTreeView([
            { text: "foo", enabled: false }
        ]);

        var item = treeview.find(".k-item:first").find(".k-in");

        item.trigger("click");

        ok(!item.hasClass("k-state-selected"));
    });

    test("TreeView preserves id attributes of the enhanced html", function() {
        treeFromHtml('<ul id="treeview"><li id="custom">text</li></ul>');

        treeviewObject.wrapper.focus();

        var li = treeview.find(".k-state-focused").closest(".k-item");

        equal(li.attr("id"), "custom");
    });

    test("TreeView uses id of the LI as value for aria-activedescendant", function() {
        treeFromHtml('<ul id="treeview"><li id="custom">text</li></ul>');

        treeviewObject.wrapper.focus();

        var li = treeview.find(".k-state-focused").closest(".k-item");

        equal(treeviewObject.wrapper.attr("aria-activedescendant"), "custom");
    });

    module("drag & drop", TreeViewHelpers.noAnimationMoudle);

    function moveTo(element, destination) {
        var extend = $.extend,
            startOffset = element.offset(),
            sourcePosition = {
                pageX: startOffset.left + 5,
                pageY: startOffset.top + 5,
                relatedTarget: element[0]
            };

        element
            .trigger(extend({ type: "mousedown" }, sourcePosition));

        $(document.documentElement)
            .trigger(extend({ type: "mousemove"}, destination))
            .trigger(extend({ type: "mouseup"}, destination));
    }

    function moveNode(treeview, sourceText, destinationText, dropPosition) {
        var sourceNode = treeview.findByText(sourceText).find(".k-in:first"),
            destinationNode = treeview.findByText(destinationText).find(".k-in:first"),
            endOffset = destinationNode.offset(),
            nodeHeight = destinationNode.height(),
            endOffsetDelta = dropPosition == "below" ? nodeHeight-1 :
                             dropPosition == "above" ? 1 :
                             nodeHeight / 2,
            destinationPosition = {
                pageX: endOffset.left + 5,
                pageY: endOffset.top + endOffsetDelta,
                target: destinationNode[0]
            };

        moveTo(sourceNode, destinationPosition);
    }

    test("moving item across parents", function () {
        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar" }
                ] },
                { text: "baz" }
            ]
        });

        moveNode(treeviewObject, "bar", "baz");

        equal(treeviewObject.findByText("foo").find(".k-item").length, 0);
        equal(treeviewObject.findByText("baz").find(".k-item").length, 1);
    });

    test("moving parent to child item does not move it", function () {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar" }
            ] }
        ]);

        moveNode(treeviewObject, "foo", "bar");

        ok(treeviewObject.findByText("foo").parent().hasClass("k-treeview-lines"));
    });

    test("moving node above another", function() {
        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: "foo" },
                { text: "bar" },
                { text: "baz" }
            ]
        });

        moveNode(treeviewObject, "foo", "baz", "above");

        equal(treeview.text(), "barfoobaz");
    });

    test("moving nodes updates toggle button and group visibility", function() {
        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: "bar" },
                { text: "foo", expanded: true, items: [
                    { text: "baz" },
                    { text: "qux" }
                ] }
            ]
        });

        moveNode(treeviewObject, "baz", "bar");

        ok(treeviewObject.findByText("bar").find(".k-icon:first").hasClass("k-i-collapse"));
        ok(treeviewObject.findByText("bar").find(".k-group").is(":visible"));
    });

    test("moving nodes to last child", function() {
        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "baz" },
                    { text: "qux" }
                ] },
                { text: "bar", items: [
                    { text: "cat" }
                ] }
            ]
        });

        moveNode(treeviewObject, "baz", "bar");

        ok(treeviewObject.findByText("bar").find(".k-icon:first").hasClass("k-i-collapse"));
        ok(treeviewObject.findByText("bar").find(".k-group").is(":visible"));
    });

    test("moving nodes to empty treeview div", function() {
        var tree1 = createTreeView({
                dragAndDrop: true,
                dataSource: [ { text: "foo" } ]
            }),
            tree2 = createTreeView({
                dragAndDrop: true
            });

        tree2.width(100).height(100);

        var offset = tree2.offset();

        moveTo(tree1.find(".k-in"), {
            pageX: offset.left + 25,
            pageY: offset.top + 25,
            target: tree2[0]
        });

        equal(tree2.find(".k-item").length, 1);
        equal(tree1.find(".k-item").length, 0);
    });

    test("moving nodes to empty treeview ul", function() {
        var tree1 = createTreeView({
                dragAndDrop: true,
                dataSource: [ { text: "foo" } ]
            }),
            tree2 = createTreeView({
                dragAndDrop: true
            }),
            tree2root = tree2.children("ul");

        tree2root.width(100).height(100);

        var offset = tree2.offset();

        moveTo(tree1.find(".k-in"), {
            pageX: offset.left + 25,
            pageY: offset.top + 25,
            target: tree2root[0]
        });

        equal(tree2.find(".k-item").length, 1);
        equal(tree1.find(".k-item").length, 0);
    });

    test("drag hint encoding follows item.encoded field", function() {
        window.flag = false;

        var text = "foo<script>window.flag = true</" + "script>";

        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: text },
                { text: "bar" }
            ]
        });

        moveNode(treeviewObject, text, "bar", "below");

        ok(!window.flag);

        delete window.flag;
    });

    test("moving expanded items to childless items", function() {
        createTreeView({
            dragAndDrop: true,
            dataSource: [
                { text: "foo", expanded: true, items: [] },
                { text: "bar", expanded: true, items: [] }
            ]
        });

        moveNode(treeviewObject, "foo", "bar");

        equal(treeview.find(".k-item .k-item").length, 1);
    });

    test("moving items in observable hierarchy sets loaded flag", function() {
        createTreeView({
            dragAndDrop: true,
            dataSource: kendo.observableHierarchy([
                { id: 1, text: "foo" },
                { id: 2, text: "bar" }
            ])
        });

        moveNode(treeviewObject, "bar", "foo");

        ok(treeviewObject.dataSource.get(1).loaded());
    });

    test("moving items updates indeterminate state", function() {
        createTreeView({
            dragAndDrop: true,
            checkboxes: {
                checkChildren: true
            },
            dataSource: [
                { text: "foo", items: [
                    { text: "bar", checked: true },
                    { text: "qux", checked: false }
                ] },
                { text: "baz", items: [
                    { text: "cat", checked: true }
                ] }
            ]
        });

        window.foo = 1;
        moveNode(treeviewObject, "qux", "baz");
        delete window.foo;

        ok(treeviewObject.findByText("foo").find(":checkbox").prop("checked"));
        ok(!treeviewObject.findByText("baz").find(":checkbox").prop("checked"));
        ok(treeviewObject.findByText("baz").find(":checkbox").prop("indeterminate"));
    });

    module("keyboard support", {
        setup: function() {
            kendo.effects.disable();

            $.fn.press = function(key) {
                return this.trigger({ type: "keydown", keyCode: key } );
            };
        },
        teardown: function() {
            TreeViewHelpers.destroy();
            kendo.effects.enable();
        }
    });

    test("right arrow expands node", 1, function() {
        createTreeView({
            dataSource: [
                { selected: true, text: "foo", items: [
                    { text: "bar" }
                ] }
            ],
            expand: function(e) {
                ok(true);
            }
        });

        treeview.focus();
        treeview.press(keys.RIGHT);
    });

    test("left arrow in RTL mode expands node", 1, function() {
        createTreeView({
            dataSource: [
                { selected: true, text: "foo", items: [
                    { text: "bar" }
                ] }
            ],
            expand: function(e) {
                ok(true);
            }
        }, { rtl: true });

        treeview.focus();
        treeview.press(keys.LEFT);
    });

    test("right arrow at expanded node moves to first child", function() {
        createTreeView([
            { selected: true, text: "foo", expanded: true, items: [
                { text: "bar" }
            ] }
        ]);

        treeview.focus();
        treeview.press(keys.RIGHT);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[1]);
    });

    test("left arrow collapses expanded nodes", 1, function() {
        createTreeView({
            dataSource: [
                { selected: true, expanded: true, text: "foo", items: [
                    { text: "bar" }
                ] }
            ],
            collapse: function(e) {
                ok(true);
            }
        });

        treeview.focus();
        treeview.press(keys.LEFT);
    });

    test("right arrow in RTL mode collapses expanded nodes", 1, function() {
        createTreeView({
            dataSource: [
                { selected: true, expanded: true, text: "foo", items: [
                    { text: "bar" }
                ] }
            ],
            collapse: function(e) {
                ok(true);
            }
        }, { rtl: true });

        treeview.focus();
        treeview.press(keys.RIGHT);
    });

    test("left arrow focuses parent node of already collapsed nodes", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { selected: true, text: "bar", items: [
                    { text: "baz" }
                ] }
            ] }
        ]);

        treeview.focus();
        treeview.press(keys.LEFT);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[0]);
    });

    test("down arrow moves focus to next sibling", function() {
        createTreeView([
            { text: "foo", selected: true },
            { text: "baz" }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[1]);
    });

    test("down arrow moves focus to first child, if expanded", function() {
        createTreeView([
            { text: "foo", expanded: true, selected: true, items: [
                { text: "bar" }
            ] },
            { text: "baz" }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item .k-item")[0]);
    });

    test("down arrow moves focus to next parent, if there are no more siblings left", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", selected: true }
            ] },
            { text: "baz" }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item:last")[0]);
    });

    test("down arrow moves focus to next parent if expanded is true but there are no children", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", expanded: true, selected: true }
            ] },
            { text: "baz" }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item:last")[0]);
    });

    test("down arrow moves focus to next grandparent, if there are no more siblings left", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", expanded: true, items: [
                    { text: "baz", selected: true }
                ] }
            ] },
            { text: "qux" }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item:last")[0]);
    });

    test("down arrow does not change focus when hitting the last item", function() {
        createTreeView([
            { text: "foo" },
            { text: "qux", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeviewObject.current()[0], treeview.find(".k-item:last")[0]);
    });

    test("focusing a treeview without selection focuses first node", function() {
        createTreeView([
            { text: "foo" },
            { text: "bar" }
        ]);

        treeview.focus();

        equal(treeviewObject.current()[0], treeview.find(".k-item")[0]);
    });

    test("focusing treeview shows focused state on first non-disabled item", function() {
        createTreeView([
            { text: "foo", enabled: false },
            { text: "bar" }
        ]);

        treeview.focus();

        equal(treeviewObject.current()[0], treeview.find(".k-item")[1]);
    });

    test("subsequent focus does not focus disabled items", function() {
        createTreeView([
            { text: "foo" },
            { text: "bar" }
        ]);

        treeview.focus();
        treeview.blur();

        treeviewObject.enable(".k-item:first", false);

        treeview.focus();

        equal(treeviewObject.current()[0], treeview.find(".k-item")[1]);
    });

    test("focusing treeview with hidden selected item focuses first visible item", function() {
        createTreeView([
            { text: "foo", expanded: false, items: [
                { text: "bar", selected: true }
            ] },
            { text: "baz" }
        ]);

        treeview.focus();

        equal(treeview.find(".k-state-focused")[0], treeview.find(".k-in:first")[0]);
    });

    test("up arrow moves focus to previous node", function() {
        createTreeView([
            { text: "foo" },
            { text: "bar", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[0]);
    });

    test("up arrow moves focus to last expanded node of previous node", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar" }
            ] },
            { text: "baz", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeviewObject.current()[0], treeview.find(".k-item .k-item")[0]);
    });

    test("up arrow moves focus to previous grandparent, when parents are expanded", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", expanded: true, items: [
                    { text: "baz" }
                ] }
            ] },
            { text: "qux", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeviewObject.current()[0], treeview.find(".k-item .k-item .k-item")[0]);
    });

    test("up arrow moves focus to previous grandparent leaf with expanded flag set", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", expanded: true, items: [
                    { text: "baz", expanded: true }
                ] }
            ] },
            { text: "qux", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeviewObject.current()[0], treeview.find(".k-item .k-item .k-item")[0]);
    });

    test("up arrow moves focus to parent node when out of previous nodes", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", selected: true }
            ] }
        ]);

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[0]);
    });

    test("home key moves focus to first node", function() {
        createTreeView([
            { text: "foo" },
            { text: "bar" },
            { text: "baz", selected: true }
        ]);

        treeview.focus();
        treeview.press(keys.HOME);

        equal(treeviewObject.current()[0], treeview.find(".k-item")[0]);
    });

    test("end key moves focus to last node", function() {
        createTreeView([
            { text: "foo", selected: true },
            { text: "bar" },
            { text: "baz" }
        ]);

        treeview.focus();
        treeview.press(keys.END);

        equal(treeviewObject.current()[0], treeview.find(".k-item:last")[0]);
    });

    test("end key moves to last child node", function() {
        createTreeView([
            { text: "foo", expanded: true, items: [
                { text: "bar", expanded: true, items: [
                    { text: "baz" }
                ] }
            ] }
        ]);

        treeview.focus();
        treeview.press(keys.END);

        equal(treeviewObject.current()[0], treeview.find(".k-item .k-item .k-item")[0]);

    });

    test("enter key triggers select event after changing selection", 1, function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ],
            select: function(e) {
                equal(e.node, treeview.find(".k-item:last")[0]);
            }
        });
        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.ENTER);
    });

    test("enter key does not trigger select event if selection was not changed", function() {
        var triggered = false;

        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ],
            select: function() {
                triggered = true;
            }
        });

        treeview.focus();
        treeview.press(keys.ENTER);

        ok(!triggered);
    });

    test("enter key triggers select event after a sequential selection has been made", function() {
        var triggeredCount = 0;

        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ],
            select: function() {
                triggeredCount++;
            }
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.ENTER);
        treeview.press(keys.UP);
        treeview.press(keys.ENTER);

        equal(triggeredCount, 2);
    });

    test("space key toggles checkbox state", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
            ],
            checkboxes: true
        });

        treeview.focus();
        treeview.press(keys.SPACEBAR);

        var checkbox = treeview.find(":checkbox");

        ok(treeviewObject.dataItem(checkbox).checked);
        ok(checkbox.is(":checked"));

        treeview.press(keys.SPACEBAR);

        checkbox = treeview.find(":checkbox");

        ok(!treeviewObject.dataItem(checkbox).checked);
        ok(!checkbox.is(":checked"));
    });

    test("space on item without checkbox does nothing", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
            ]
        });

        treeview.press(keys.SPACEBAR);

        ok(true);
    });

    test("space on item with custom checkbox does nothing", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
            ],
            template: "<input type='checkbox'>#= item.text #"
        });

        treeview.press(keys.SPACEBAR);

        ok(!treeview.find(":checkbox").prop("checked"));
    });

    test("blurring the treeview removes the focused state", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.blur();

        ok(!treeview.data("kendoTreeView").current().hasClass("k-state-focused"));
    });

    test("focusing after blurring the treeview focus the same node", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "bar" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.DOWN);
        treeview.blur();
        treeview.focus();

        equal(treeview.data("kendoTreeView").current().text(), "bar");
    });

    test("focusing after blurring the treeview focus the selected node", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.DOWN);
        treeview.blur();
        treeview.focus();

        equal(treeview.data("kendoTreeView").current().text(), "foo");
    });

    test("blurring the treeview does not trigger select event, if selection has not changed", function() {
        var triggeredCount = 0;

        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ],
            select: function() {
                triggeredCount++;
            }
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.UP);
        treeview.blur();

        equal(triggeredCount, 0);
    });

    test("blurring without changing the selection does not trigger select event", function() {
        var triggeredCount = 0;

        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar" }
            ],
            select: function() {
                triggeredCount++;
            }
        });

        treeview.focus();
        treeview.blur();

        equal(triggeredCount, 0);
    });

    test("down arrow skips disabled items on same level", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "bar", enabled: false },
                { text: "baz" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("down arrow skips disabled child items", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true, expanded: true, items: [
                    { text: "bar", enabled: false },
                    { text: "baz" }
                ] }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("right arrow skips disabled first child", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true, expanded: true, items: [
                    { text: "bar", enabled: false },
                    { text: "baz" }
                ] }
            ]
        });

        treeview.focus();
        treeview.press(keys.RIGHT);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("right arrow skips disabled first child", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true, expanded: true, items: [
                    { text: "bar", enabled: false, expanded: true, items: [
                        { text: "baz" }
                    ] }
                ] }
            ]
        });

        treeview.focus();
        treeview.press(keys.RIGHT);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("up arrow skips disabled items", function() {
        createTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar", enabled: false, expanded: true, items: [
                        { text: "baz", selected: true }
                    ] }
                ] }
            ]
        });

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeview.find(".k-state-focused").text(), "foo");
    });

    test("left arrow does nothing when going to disabled parent", function() {
        createTreeView({
            dataSource: [
                { text: "foo", expanded: true, items: [
                    { text: "bar", enabled: false, expanded: true, items: [
                        { text: "baz", selected: true }
                    ] }
                ] }
            ]
        });

        treeview.focus();
        treeview.press(keys.LEFT);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("down arrow without selection goes to first non-disabled item", function() {
        createTreeView({
            dataSource: [
                { text: "foo", enabled: false },
                { text: "baz" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("up arrow without selection goes to last non-disabled item", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "baz", enabled: false }
            ]
        });

        treeview.focus();
        treeview.press(keys.UP);

        equal(treeview.find(".k-state-focused").text(), "foo");
    });

    test("down arrow without selection sets the first non-disabled item as focused", function() {
        createTreeView({
            dataSource: [
                { text: "foo", enabled: false },
                { text: "baz" }
            ]
        });

        treeview.focus();
        treeview.press(keys.DOWN);

        equal(treeview.find(".k-state-focused").text(), "baz");
    });

    test("selection from enter key can be prevented", function() {
        createTreeView({
            dataSource: [
                { text: "foo", selected: true },
                { text: "baz" }
            ],
            select: function(e) {
                e.preventDefault();
            }
        });

        treeview.focus();
        treeview.press(keys.DOWN);
        treeview.press(keys.ENTER);

        equal(treeview.find(".k-state-selected").text(), "foo");
    });

    test("down arrow triggers navigate event", 1, function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "baz" }
            ],
            navigate: function(node) {
                ok(node);
            }
        });

        treeview.focus();
        treeview.press(keys.DOWN);
    });

    test("up arrow triggers navigate event", 1, function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "baz", selected: true }
            ],
            navigate: function(node) {
                ok(node);
            }
        });

        treeview.focus();
        treeview.press(keys.UP);
    });

    test("focusing node set aria-activedescendant to the wrapper", function() {
        var treeview = $("<div id='treeview' />").appendTo(QUnit.fixture)
            .kendoTreeView({
                dataSource: [
                    { text: "foo" },
                    { text: "baz" }
                ]
            });

        treeview.focus();

        treeview.press(keys.DOWN);

        var activeDescendantId = treeview.attr("aria-activedescendant");
        equal(treeview.find("#" + activeDescendantId).text(), "baz");
    });

    test("focusing node sets its id", function() {
        var treeview = $("<div id='treeview' />").appendTo(QUnit.fixture)
            .kendoTreeView({
                dataSource: [
                    { text: "foo" },
                    { text: "baz" }
                ]
            });

        treeview.focus();

        treeview.press(keys.DOWN);

        ok(treeview.find("#" + treeview.attr("aria-activedescendant")).length, 1);
    });

    test("focusing node does not set its id if treeview does not have id", function() {
        var treeview = $("<div />").appendTo(QUnit.fixture)
            .kendoTreeView({
                dataSource: [
                    { text: "foo" },
                    { text: "baz" }
                ]
            });

        treeview.focus();

        treeview.press(keys.DOWN);

        ok(!treeview.find("[id]").length);
    });

    test("aria-activedescendant is not set if id is not set", function() {
        var treeview = $("<div/>").appendTo(QUnit.fixture)
            .kendoTreeView({
                dataSource: [
                    { text: "foo" },
                    { text: "baz" }
                ]
            });

        treeview.focus();

        treeview.press(keys.DOWN);

        ok(!treeview.data("kendoTreeView")._ariaId);
        ok(!treeview.filter("[aria-activedescendant]").length);
    });

    test("TreeView does not focus item if clicked element is focusable", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
            ],
            template: "<input />"
        });

        var input = treeview.find("input");

        input.mousedown();
        input.mouseup();
        input.click();

        notEqual(treeview[0], document.activeElement);
    });

    test("expand / collapse moves focus to closest item", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "bar", expanded: false, items: [
                    { text: "baz" }
                ] }
            ]
        });

        treeview.focus();
        treeview.find(".k-icon").trigger("mousedown").click();

        equal(treeview.find(".k-state-focused").text(), "bar");
    });

    test("select method moves focus to item", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "bar" }
            ]
        });

        treeview.find(".k-in:first").trigger("mousedown");
        treeviewObject.select(treeview.find(".k-in:last"));
        treeview.focus();

        equal(treeview.find(".k-state-focused").text(), "bar");
    });

    test("failed requests remove loading icon", function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.error({});
                    }
                }
            }
        });

        equal(treeview.find(".k-i-loading").length, 0);
    });

    test("failed subnode requests remove loading icon", function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        if (!options.data.id) {
                            options.success([
                                { id: 1, hasChildren: true, text: "foo" }
                            ]);
                        } else {
                            options.error({});
                        }
                    }
                }
            }
        });

        treeviewObject.expand(".k-item");
        equal(treeview.find(".k-i-loading").length, 0);
    });

    test("failed requests render retry template", function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        options.error({});
                    }
                }
            }
        });

        equal(treeview.find(".k-request-retry").length, 1);
    });

    test("retry text can be localized", function() {
        createTreeView({
            messages: {
                requestFailed: "foo",
                retry: "bar"
            },
            dataSource: {
                transport: {
                    read: function(options) {
                        options.error({});
                    }
                }
            }
        });

        equal(treeview.text(), "foo bar");
    });

    test("failed subnode requests show retry icon", function() {
        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        if (!options.data.id) {
                            options.success([
                                { id: 1, hasChildren: true, text: "foo" }
                            ]);
                        } else {
                            options.error({});
                        }
                    }
                }
            }
        });

        treeviewObject.expand(".k-item");
        equal(treeview.find(".k-icon.k-i-refresh").length, 1);
    });

    test("failed requests can be retried", function() {
        var calls = 0;

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        calls++;

                        if (calls == 1) {
                            options.error({});
                        } else {
                            options.success([{ id: 1, text: "foo" }]);
                        }
                    }
                }
            }
        });

        treeview.find(".k-request-retry").click();

        equal(calls, 2);
        equal(treeview.find(".k-request-retry").length, 0);
        equal(treeview.find(".k-item").length, 1);
    });

    test("failed subnode requests can be reloaded", function() {
        var calls = 0;

        createTreeView({
            dataSource: {
                transport: {
                    read: function(options) {
                        if (!options.data.id) {
                            options.success([
                                { id: 1, hasChildren: true, text: "foo" }
                            ]);
                        } else {
                            calls++;

                            if (calls == 1) {
                                options.error({});
                            } else {
                                options.success([{ id: 2, text: "bar" }]);
                            }
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        hasChildren: "hasChildren"
                    }
                }
            }
        });

        treeviewObject.expand(".k-item");

        // error out, show refresh icon
        equal(treeview.find(".k-i-refresh").length, 1);
        ok(!treeviewObject.dataItem(".k-item").expanded);

        treeview.find(".k-i-refresh").click();

        // success, hide refresh icon
        equal(calls, 2);
        equal(treeview.find(".k-i-refresh").length, 0);
        equal(treeview.find(".k-item .k-item").length, 1);
    });

    test("setOptions can disable dragAndDrop", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "bar" }
            ],
            dragAndDrop: true
        });

        treeviewObject.setOptions({ dragAndDrop: false });

        moveNode(treeviewObject, "bar", "foo");

        equal(treeview.find(".k-item .k-item").length, 0);
    });

    test("setOptions can enable a disabled dragAndDrop", function() {
        createTreeView({
            dataSource: [
                { text: "foo" },
                { text: "bar" }
            ],
            dragAndDrop: true
        });

        treeviewObject.setOptions({ dragAndDrop: false });
        treeviewObject.setOptions({ dragAndDrop: true });

        moveNode(treeviewObject, "bar", "foo");

        equal(treeview.find(".k-item .k-item").length, 1);
    });


    module("drag & drop with load-on-demand", TreeViewHelpers.noAnimationMoudle);

    asyncTest("dropping items over unfetched nodes fetches and appends node", function() {
        var i = 1;

        createTreeView({
            dragAndDrop: true,
            dataSource: {
                transport: {
                    read: function(options) {
                        if (i == 1) {
                            options.success([
                                { text: "Item " + (i++), hasChildren: true },
                                { text: "Item " + (i++), hasChildren: false }
                            ]);
                        } else {
                            setTimeout(function() {
                                options.success([
                                    { text: "Item " + (i++), hasChildren: true },
                                    { text: "Item " + (i++), hasChildren: false }
                                ]);

                                start();
                                equal(treeview.find(".k-item .k-item").length, 3);
                            }, 100);
                        }
                    }
                },
                schema: {
                    model: {
                        hasChildren: "hasChildren"
                    }
                }
            }
        });

        moveNode(treeviewObject, "Item 2", "Item 1");
    });
})();
