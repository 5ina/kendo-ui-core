(function() {
    var DataSource = kendo.data.DataSource,
        ColumnMenu = kendo.ui.ColumnMenu,
        dom,
        dataSource;


    module("kendo.ui.ColumnMenu", {
        setup: function() {
            kendo.effects.disable();
            kendo.ns = "kendo-";
            dataSource = new DataSource({
                schema: {
                    model: {
                        fields: {
                            foo: {
                                type: "string"
                            },
                            bar: {
                                type: "number"
                            },
                            baz: {
                                type: "date"
                            },
                            boo: {
                                type: "boolean"
                            }
                        }
                    }
                }
            });

            dom = $("<div data-kendo-field=foo ></div>");
            dom.appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.effects.enable();
            kendo.destroy(QUnit.fixture);
            kendo.ns = "";
            $(".k-filter-menu").remove();
            dom.remove();
        }
    });

    function setup(options) {
        options = $.extend(true, {}, {
            dataSource: dataSource,
            owner: {
                columns: [{ field: "foo" }, { field: "bar", hidden: true}],
                bind: $.noop,
                unbind: $.noop
            }
        }, options);

        var menu = new ColumnMenu(dom, options);
        menu._init();

        menu.menu.options.hoverDelay = 1;

        return menu;
    }

    test("column menu is initialized", function() {
        setup();
        var menu = dom.data("kendoColumnMenu");

        ok(menu instanceof ColumnMenu);
        equal(menu.field, "foo");
    });

    test("popup is initialized over the wrapper", function() {
        var menu = setup();

        ok(menu.wrapper.data("kendoPopup"));
    });

    test("menu link has negative tabindex", function() {
        var menu = setup();

        equal(menu.link.attr("tabindex"), -1);
    });

    test("clicking the link toggles popup visibility", function() {
        var menu = setup();

        menu.wrapper.data("kendoPopup").toggle();
        menu.link.click();

        ok(!menu.wrapper.is(":visible"));
    });

    test("sortable true shows sort links", function() {
        var menu = setup({
            sortable: true
        });

        equal(menu.wrapper.find(".k-sort-asc").length, 1);
        equal(menu.wrapper.find(".k-sort-desc").length, 1);
    });

    test("sortble false does not render sort links", function() {
        var menu = setup({
            sortable: false
        });

        equal(menu.wrapper.find(".k-sort-asc").length, 0);
        equal(menu.wrapper.find(".k-sort-desc").length, 0);
    });

    test("changing default sort options", function() {
        var menu = setup({
            messages: {  sortAscending: "foo" }
        });

        equal(menu.options.messages.sortAscending, "foo");
        equal(menu.options.messages.sortDescending, "Sort Descending");
    });

    test("filterable enabled", function() {
        var menu = setup({
            filterable: true
        });

        equal(menu.options.messages.filter, "Filter");
        equal(menu.wrapper.find(".k-filterable").length, 1);
    });

    test("filterable dataSource sets the options of the checkSource", function() {
        var checkSource = DataSource.create({
            transport: {
                read: "foo"
            },
            serverPaging: true
        });

        var menu = setup({
            filterable: {
                multi: true,
                forceUnique: false,
                dataSource: checkSource
            }
        });

        var multiCheck = menu.wrapper.find("[data-kendo-role=filtermulticheck]");
        equal(multiCheck.length, 1);
        multiCheck = multiCheck.data("kendoFilterMultiCheck");
        ok(multiCheck.checkSource === checkSource);
    });

    test("changing default filter option", function() {
        var menu = setup({ filter: "foo" });

        equal(menu.options.filter, "foo");
    });

    test("columns option as true boolean", function() {
        var menu = setup({
            columns: true
        });

        equal(menu.options.messages.columns, "Columns");
    });

    test("changing default columns option", function() {
        var menu = setup({
            messages: {
                columns: "foo"
            }
        });

        equal(menu.options.messages.columns, "foo");
    });

    test("columns checkboxes are initialized", function() {
        var columnMenu = setup();

        var checkboxes = columnMenu.wrapper.find("[type=checkbox]");
        equal(checkboxes.length, 2);
        ok(checkboxes.eq(0).prop("checked"));
        ok(!checkboxes.eq(1).prop("checked"));
    });

    test("unchecking checkbox calls hideColumn method", function() {
        var called = false;
        var menu = setup({
            owner: {
                columns: [{ field: "foo" }, { field: "bar", hidden: false }],
                hideColumn: function() {
                    called = true;
                }
            }
        });
        menu.wrapper.find("[type=checkbox]").eq(0).prop("checked", true).click();

        ok(called);
    });

    test("checking checkbox calls showColumn method", function() {
        var called = false;
        var menu = setup({
            owner: {
                columns: [{ field: "foo", hidden: true }, { field: "bar", hidden: false }],
                showColumn: function() {
                    called = true;
                }
            }
        });

        menu.wrapper.find("[type=checkbox]").eq(0).click();

        ok(called);
    });

    test("checkboxes are disabled when one column with field left visible", function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: "foo", hidden: true },
                    { field: "bar", hidden: false },
                    { template: "template", title: "template", hidden: false }
                ]
            }
        });

        var checkboxes = menu.wrapper.find("[type=checkbox]");
        ok(!checkboxes.eq(0).prop("disabled"));
        ok(checkboxes.eq(1).prop("disabled"), "column is not disabled");
        ok(checkboxes.eq(2).prop("disabled"), "column is not disabled");
    });

    test("hiding column with space in the field name", 2, function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: '["foo bar"]', hidden: false },
                    { field: "bar", hidden: false }
                ],
                dataSource: new DataSource({
                    data: [
                        {
                            "foo bar": "foo bar",
                            "bar": "bar"
                        }
                    ]
                }),
                hideColumn: function(column) {
                    ok(true);
                    equal(column, menu.owner.columns[0]);
                }
            }
        });

        menu.wrapper.find("[type=checkbox]").eq(0).click();
    });

    test("sortable as empty object does not append sort expressions", function() {
        var menu = setup({ field: "foo", sortable: {} });

        dataSource.sort({ field: "bar", dir: "desc" });

        menu.wrapper.find(".k-sort-asc").click();

        var sort = dataSource.sort();

        equal(sort.length, 1);
        equal(sort[0].field, "foo");
        equal(sort[0].dir, "asc");
    });

    test("selecting sort asc item sorts the dataSource", function() {
        var menu = setup({ field: "foo" });

        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        equal(sort.length, 1);
        equal(sort[0].field, "foo");
        equal(sort[0].dir, "asc");
    });

    test("selecting sort asc item twice remove sort expression for the field", function() {
        var menu = setup({ field: "foo" });

        menu.wrapper.find(".k-sort-asc").click();
        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        equal(sort.length, 0, "Sort expression for the field is removed");
    });

    test("selecting sort asc item when sortable mode is multiple", function() {
        var menu = setup({
            field: "foo",
            sortable: {
                mode: "multiple"
            }
        });

        dataSource.sort({ field: "bar", dir: "desc" });
        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        equal(sort.length, 2);
        equal(sort[0].field, "bar");
        equal(sort[0].dir, "desc");
        equal(sort[1].field, "foo");
        equal(sort[1].dir, "asc");
    });

    test("unselecting sort asc item when allowUnsort is false", function() {
        var menu = setup({
            field: "foo",
            sortable: {
                allowUnsort: false
            }
        });

        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        equal(sort.length, 1);
        equal(sort[0].field, "foo");
        equal(sort[0].dir, "asc");
    });

    test("selecting sort item sorts the dataSource with compare", function() {
        var menu = setup({
            field: "foo",
            sortable: {
                compare: function() {}
            }
        });

        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        ok(sort[0].compare);
    });

    test("selecting sort item sorts the dataSource with compare when sortable mode is multiple", function() {
        var menu = setup({
            field: "foo",
            sortable: {
                mode: "multiple",
                compare: function() {}
            }
        });

        menu.wrapper.find(".k-sort-asc").click();
        var sort = dataSource.sort();

        ok(sort[0].compare);
    });

    test("clicking asc item highlight it", function() {
        var menu = setup({ field: "foo" });

        var item = menu.wrapper.find(".k-sort-asc").click();

        ok(item.hasClass("k-state-selected"));
    });

    test("clicking desc item highlight it", function() {
        var menu = setup({ field: "foo" });

        var ascItem = menu.wrapper.find(".k-sort-asc").click();
        var descItem = menu.wrapper.find(".k-sort-desc").click();

        ok(descItem.hasClass("k-state-selected"));
        ok(!ascItem.hasClass("k-state-selected"));
    });

    test("sort asc item is highlighted on dataSource sort", function() {
        var menu = setup({ field: "foo" });

        dataSource.sort({ field: "foo", dir: "asc" });

        var ascItem = menu.wrapper.find(".k-sort-asc");
        ok(ascItem.hasClass("k-state-selected"));
    });

    test("sort asc item is unhighlighted on dataSource sort", function() {
        var menu = setup({ field: "foo" });

        var ascItem = menu.wrapper.find(".k-sort-asc").click();
        dataSource.sort({ field: "foo" });

        ok(!ascItem.hasClass("k-state-selected"));
    });

    test("sort desc item is highlighted on dataSource sort", function() {
        var menu = setup({ field: "foo" });

        dataSource.sort({ field: "foo", dir: "desc" });

        var descItem = menu.wrapper.find(".k-sort-desc");
        ok(descItem.hasClass("k-state-selected"));
    });

    test("sort desc item is unhighlighted on dataSource sort", function() {
        var menu = setup({ field: "foo" });

        var descItem = menu.wrapper.find(".k-sort-desc").click();
        dataSource.sort({ field: "foo" });

        ok(!descItem.hasClass("k-state-selected"));
    });

    test("sort asc item is highlighted on menu initialization", function() {
        dataSource.sort({ field: "foo", dir: "asc" });

        var menu = setup({ field: "foo" });

        var ascItem = menu.wrapper.find(".k-sort-asc");
        ok(ascItem.hasClass("k-state-selected"));
    });

    test("sort desc item is highlighted on menu initialization", function() {
        dataSource.sort({ field: "foo", dir: "desc" });

        var menu = setup({ field: "foo" });

        var descItem = menu.wrapper.find(".k-sort-desc");
        ok(descItem.hasClass("k-state-selected"));
    });

    test("destroy calls filter menu destroy", function() {
        var menu = setup();

        var destroy = stub(menu.filterMenu, {
            destroy: menu.filterMenu.destroy
        });

        menu.destroy();

        equal(destroy.calls("destroy"), 1, "Filter menu is not destroyed");
    });

    test("hiding column after reorder", function() {
        var col;
        var menu = setup({
            owner: {
                columns: [{ field: "foo", hidden: false }, { field: "bar", hidden: false }],
                hideColumn: function() {
                    col = arguments[0];
                }
            }
        });
        var owner = menu.owner;

        var tmp = owner.columns[0];
        owner.columns[0] = owner.columns[1];
        owner.columns[1] = tmp;

        menu.wrapper.find("[type=checkbox]:first").click();

        equal(col, owner.columns[1]);
    });

    test("hiding column by title after reorder", function() {
        var colIndex;
        var menu = setup({
            owner: {
                columns: [{ field: "foo", hidden: false }, { field: "bar", hidden: false }, { title: "baz" }],
                hideColumn: function() {
                    colIndex = arguments[0];
                }
            }
        });
        var owner = menu.owner;

        var tmp = owner.columns[0];
        owner.columns[0] = owner.columns[2];
        owner.columns[2] = tmp;

        menu.wrapper.find("[type=checkbox]:last").click();

        equal(colIndex, owner.columns[0]);
    });

    test("on open menu element is focused", function() {
        var columnMenu = setup();

        columnMenu.wrapper.data("kendoPopup").toggle();
        columnMenu.link.click();

        equal(document.activeElement, columnMenu.menu.element[0]);
    });

    test("closeCallback is called on popup close", function() {
        var wasCalled = false,
            columnMenu = setup({
                closeCallback: function() {
                    wasCalled = true;
                }
            }),
            popup = columnMenu.wrapper.data("kendoPopup");

        popup.toggle();
        columnMenu.link.click();
        popup.close();

        ok(wasCalled);
    });

    test("menu is not created before link is clicked", function() {
        var columnMenu = new ColumnMenu(dom, { dataSource: dataSource });

        ok(!columnMenu.menu);
    });

    test("menu is created after link is clicked", function() {
        var columnMenu = new ColumnMenu(dom, {
            dataSource: dataSource,
            owner: {
                columns: [{ field: "foo" }, { field: "bar", hidden: true}],
                bind: $.noop,
                unbind: $.noop
            }
        });
        columnMenu.link.click();

        ok(columnMenu.menu);
    });

    test("single menu instance is created on multiple link clicks", function() {
        var columnMenu = new ColumnMenu(dom, {
            dataSource: dataSource,
            owner: {
                columns: [{ field: "foo" }, { field: "bar", hidden: true}],
                bind: $.noop,
                unbind: $.noop
            }
        });
        columnMenu.link.click();
        var menu = columnMenu.menu;

        columnMenu.link.click();

        equal(columnMenu.menu, menu);
    });

    test("init event is raised when initialized", 2, function() {
        var columnMenu = new ColumnMenu(dom, {
            dataSource: dataSource,
            owner: {
                columns: [{ field: "foo" }, { field: "bar", hidden: true}],
                bind: $.noop,
                unbind: $.noop
            }
        });

        columnMenu.bind("init", function(e) {
            equal(e.field, columnMenu.field);
            equal(e.container, columnMenu.wrapper);
        });

        columnMenu.link.click();
    });

    test("locked columns section is initialized", function() {
        var menu = setup({ lockedColumns: true });

        ok(menu.wrapper.find(".k-lock").length);
        ok(menu.wrapper.find(".k-unlock").length);
    });

    test("locked columns section has separator", function() {
        var menu = setup({ lockedColumns: true });

        ok(menu.wrapper.find(".k-lock").prev().hasClass("k-separator"));
    });

    test("locked column, lock menu item is disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: true },
                    { field: "bar" },
                    { field: "baz", locked: true }
                ]
            }
        });
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(!menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("only one locked column, lock and unlock menu items are disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: true }
                ]
            }
        });
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("only one visible locked column, lock and unlock menu items are disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: true },
                    { field: "bar", locked: true, hidden: true }
                ]
            }
        });
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("unlocking columns updates disabled state", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: true },
                    { field: "bar", locked: false, hidden: false },
                    { field: "baz", locked: true }
                ],
                unlockColumn: function() {
                    menu.owner.columns[0].locked = false;
                }
            }
        });
        menu.link.click();
        menu.wrapper.find(".k-unlock").click();
        menu.link.click();

        ok(!menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("unlocked column, unlock menu item is disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: false },
                    { field: "bar" },
                    { field: "baz", locked: false }
                ]
            }
        });
        menu.link.click();

        ok(!menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("only one unlocked column, lock and unlock menu items are disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo", locked: false },
                    { field: "bar", locked: true, hidden: false }
                ]
            }
        });
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("only one visible unlocked column, lock and unlock menu items are disabled", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo" },
                    { field: "bar", hidden: true }
                ]
            }
        });
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("locking columns updates disabled state", function() {
        var menu = setup({
            lockedColumns: true,
            owner: {
                columns: [
                    { field: "foo" },
                    { field: "bar", hidden: false },
                    { field: "baz", locked: true }
                ],
                lockColumn: function() {
                    menu.owner.columns[0].locked = true;
                }
            }
        });
        menu.link.click();
        menu.wrapper.find(".k-lock").click();
        menu.link.click();

        ok(menu.wrapper.find(".k-lock").hasClass("k-state-disabled"));
        ok(!menu.wrapper.find(".k-unlock").hasClass("k-state-disabled"));
    });

    test("unlocking column updated disabled state on already opened menu", function() {
        var owner = new kendo.ui.Widget({
        });

        owner.columns = [
            { field: "foo", locked: true },
            { field: "bar", hidden: false, locked: true },
            { field: "baz" }
        ];

        var menu = setup({
            lockedColumns: true,
            owner: owner
        });

        menu.link.click();
        owner.columns[1].locked = false;
        owner.trigger("columnUnlock");


        var locked = menu.wrapper.find(".k-lock");
        var unlocked = menu.wrapper.find(".k-unlock");

        ok(locked.hasClass("k-state-disabled"));
        ok(!unlocked.hasClass("k-state-disabled"));
    });

    test("only one visible locked column - multiple unlocked columns", function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: "foo", locked: true, hidden: true },
                    { field: "bar", locked: true, hidden: false },
                    { field: "baz", locked: false, hidden: false },
                    { field: "bax", locked: false, hidden: false },
                ],
            }
        });

        var checkboxes = menu.wrapper.find("[type=checkbox]");
        equal(checkboxes.length, 4);
        ok(!checkboxes.eq(0).prop("checked"));
        ok(!checkboxes.eq(0).prop("disabled"));
        ok(checkboxes.eq(1).prop("checked"));
        ok(checkboxes.eq(1).prop("disabled"));

        ok(checkboxes.eq(2).prop("checked"));
        ok(!checkboxes.eq(2).prop("disabled"));
        ok(checkboxes.eq(3).prop("checked"));
        ok(!checkboxes.eq(3).prop("disabled"));
    });

    test("only one visible locked column - one visible unlocked column", function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: "foo", locked: true, hidden: true },
                    { field: "bar", locked: true, hidden: false },
                    { field: "baz", locked: false, hidden: true },
                    { field: "bax", locked: false, hidden: false },
                ],
            }
        });

        var checkboxes = menu.wrapper.find("[type=checkbox]");
        equal(checkboxes.length, 4);
        ok(!checkboxes.eq(0).prop("checked"));
        ok(!checkboxes.eq(0).prop("disabled"));
        ok(checkboxes.eq(1).prop("checked"));
        ok(checkboxes.eq(1).prop("disabled"));

        ok(!checkboxes.eq(2).prop("checked"));
        ok(!checkboxes.eq(2).prop("disabled"));
        ok(checkboxes.eq(3).prop("checked"));
        ok(checkboxes.eq(3).prop("disabled"));
    });

    test("multiple visible locked columns - only one visible unlocked column", function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: "foo", locked: true, hidden: false },
                    { field: "bar", locked: true, hidden: false },
                    { field: "baz", locked: false, hidden: true },
                    { field: "bax", locked: false, hidden: false },
                ],
            }
        });

        var checkboxes = menu.wrapper.find("[type=checkbox]");
        equal(checkboxes.length, 4);
        ok(checkboxes.eq(0).prop("checked"));
        ok(!checkboxes.eq(0).prop("disabled"));
        ok(checkboxes.eq(1).prop("checked"));
        ok(!checkboxes.eq(1).prop("disabled"));

        ok(!checkboxes.eq(2).prop("checked"));
        ok(!checkboxes.eq(2).prop("disabled"));
        ok(checkboxes.eq(3).prop("checked"));
        ok(checkboxes.eq(3).prop("disabled"));
    });

    test("change of locked state updates column checkboxes", function() {
        var menu = setup({
            owner: {
                columns: [
                    { field: "foo", locked: true, hidden: false},
                    { field: "bar", locked: true, hidden: false },
                    { field: "baz", locked: false, hidden: false },
                    { field: "bax", locked: false, hidden: false },
                ],
            },
            lockedColumns: true
        });
        var popup = menu.wrapper.data("kendoPopup");

        menu.link.click();
        popup.close();
        menu.owner.columns[2].locked = true;
        menu.link.click();

        var checkboxes = menu.wrapper.find("[type=checkbox]");
        equal(checkboxes.eq(0).attr(kendo.attr("locked")), "true", "first column is not locked");
        ok(!checkboxes.eq(0).prop("disabled"), "first column is disabled");
        equal(checkboxes.eq(1).attr(kendo.attr("locked")), "true", "second column is not locked");
        ok(!checkboxes.eq(1).prop("disabled"), "second column is disabled");
        equal(checkboxes.eq(2).attr(kendo.attr("locked")), "true", "third column is not locked");
        ok(!checkboxes.eq(2).prop("disabled"), "third column is disabled");
        equal(checkboxes.eq(3).attr(kendo.attr("locked")), "false", "fourth column is locked");
        ok(checkboxes.eq(3).prop("disabled"), "fourth column is not disabled");
    });

    test("destroy should not detach owner's columnShow event handlers", 1, function() {
        var owner = new kendo.ui.Widget($(), {
                columns: [
                    { field: "foo"},
                    { field: "bar" },
                    { field: "baz" },
                    { field: "bax" }
                ],
            });

        owner.columns = {};

        owner.bind("columnShow", function() {
            ok(true);
        });

        var menu = new ColumnMenu($(), {
            owner: owner,
            columns: {}
        });

        menu.destroy();

        owner.trigger("columnShow");
    });

    test("destroy should not detach owner's columnHide event handlers", 1, function() {
        var owner = new kendo.ui.Widget($(), {
                columns: [
                    { field: "foo"},
                    { field: "bar" },
                    { field: "baz" },
                    { field: "bax" }
                ],
            });

        owner.columns = {};

        owner.bind("columnHide", function() {
            ok(true);
        });

        var menu = new ColumnMenu($(), {
            owner: owner,
            columns: {}
        });

        menu.destroy();

        owner.trigger("columnHide");
    });

    test("filter by menu field highlights the link element", function() {
        var menu = setup();

        dataSource.filter({ field: "foo", operator: "eq", value: "bar" });

        ok(menu.link.hasClass("k-state-active"));
    });

    test("remove filter clears linka active class", function() {
        var menu = setup();

        dataSource.filter({ field: "foo", operator: "eq", value: "bar" });
        dataSource.filter({});

        ok(!menu.link.hasClass("k-state-active"));
    });

    test("filter by menu field highlights the link element with disabled sorting", function() {
        var menu = setup({ sortable: false });

        dataSource.filter({ field: "foo", operator: "eq", value: "bar" });

        ok(menu.link.hasClass("k-state-active"));
    });
})();
