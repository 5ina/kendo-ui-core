(function() {
    var listbox;
    var item;
    var item1;
    var item2;
    var item3;
    var item4;
    var args;

    var DOT = ".";
    var DISABLED_STATE_CLASS = "k-state-disabled";
    var SELECTED_STATE_CLASS = "k-state-selected";
    var REMOVE = "remove";
    var TRANSFER = "transfer";
    var ADD = "add";
    var MOVE_UP = "moveUp";
    var MOVE_DOWN = "moveDown";
    var TRANSFER_TO = "transferTo";
    var TRANSFER_FROM = "transferFrom";
    var TRANSFER_ALL_TO = "transferAllTo";
    var TRANSFER_ALL_FROM = "transferAllFrom";

    function getId(item) {
        return item.data("uid");
    }

    function getToolElement(listbox, toolName) {
        return listbox.wrapper.find("[data-command='" + toolName + "']");
    }

    module("ListBox toolbar", {
        setup: function() {
            listbox = createListBoxWithToolbar();
            $(document.body).append(QUnit.fixture);
        },
        teardown: function() {
            destroyListBox(listbox);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("remove action should not work without selection", function() {
        var itemsLength = listbox.items().length;

        clickRemoveButton(listbox);

        equal(listbox.items().length, itemsLength);
    });

    test("remove action should call listbox.remove()", function() {
        var item = listbox.items().eq(0);
        var removeStub = stub(listbox, REMOVE);
        listbox.select(item);

        clickRemoveButton(listbox);

        equal(removeStub.args(REMOVE).length, 1);
        equal(removeStub.args(REMOVE)[0][0], item[0]);
    });

    test("remove action should clear the selection", function() {
        var item = listbox.items().eq(0);
        listbox.select(item);

        clickRemoveButton(listbox);

        equal(listbox.select().length, 0);
    });

    test("tools have title", function () {
        var toolsButtons = listbox.toolbar.element.find("a.k-button");
        var titleAttr = "title";

        equal(toolsButtons.filter('[data-command="remove"]').attr(titleAttr), "Delete");
        equal(toolsButtons.filter('[data-command="moveUp"]').attr(titleAttr), "Move Up");
        equal(toolsButtons.filter('[data-command="moveDown"]').attr(titleAttr), "Move Down");
        equal(toolsButtons.filter('[data-command="transferTo"]').attr(titleAttr), "To Right");
        equal(toolsButtons.filter('[data-command="transferFrom"]').attr(titleAttr), "To Left");
        equal(toolsButtons.filter('[data-command="transferAllTo"]').attr(titleAttr), "All to Right");
        equal(toolsButtons.filter('[data-command="transferAllFrom"]').attr(titleAttr), "All to Left");
    });

    module("ListBox toolbar", {
        setup: function() {
            listbox = createListBoxWithToolbar();
            item1 = listbox.items().eq(0);
            item2 = listbox.items().eq(1);
            item3 = listbox.items().eq(2);
            item4 = listbox.items().eq(3);
        },
        teardown: function() {
            destroyListBox(listbox);
            kendo.destroy(QUnit.fixture);
        }
    });

    test("moveup action should not move the html element of the first list item", function() {
        listbox.select(item);

        clickMoveUpButton(listbox);

        equal(listbox.items()[0], item1[0]);
    });

    test("moveup action should not move the data item of the first list item in the dataSource", function() {
        listbox.select(item);

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
    });

    test("moveup action should move the html element of a list item", function() {
        listbox.select(item2);

        clickMoveUpButton(listbox);

        equalListItems(listbox.items().eq(0), item2);
        equalListItems(listbox.items().eq(1), item1);
    });

    test("moveup action should move the data item of a list item in the dataSource", function() {
        listbox.select(item2);

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item2));
        equal(listbox.dataSource.at(1).uid, getId(item1));
    });

    test("moveup action should reorder the html elements of multiple list items", function() {
        listbox.select(item3.add(item2));

        clickMoveUpButton(listbox);

        equalListItems(listbox.items().eq(0), item2);
        equalListItems(listbox.items().eq(1), item3);
        equalListItems(listbox.items().eq(2), item1);
        equalListItems(listbox.items().eq(3), item4);
    });

    test("moveup action should reorder the data items of multiple list items in the dataSource", function() {
        listbox.select(item2.add(item3));

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item2));
        equal(listbox.dataSource.at(1).uid, getId(item3));
        equal(listbox.dataSource.at(2).uid, getId(item1));
        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    test("moveup action should reorder the html elements of non-adjacent list items", function() {
        listbox.select(item2.add(item4));

        clickMoveUpButton(listbox);

        equalListItems(listbox.items().eq(0), item2);
        equalListItems(listbox.items().eq(1), item1);
        equalListItems(listbox.items().eq(2), item4);
        equalListItems(listbox.items().eq(3), item3);
    });

    test("moveup action should reorder the data items of non-adjacent list items in the dataSource", function() {
        listbox.select(item4.add(item2));

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item2));
        equal(listbox.dataSource.at(1).uid, getId(item1));
        equal(listbox.dataSource.at(2).uid, getId(item4));
        equal(listbox.dataSource.at(3).uid, getId(item3));
    });

    test("moveup action should not reorder the html elements of multiple list items at the top", function() {
        listbox.select(item1.add(item2));

        clickMoveUpButton(listbox);

        equalListItems(listbox.items().eq(0), item1);
        equalListItems(listbox.items().eq(1), item2);
        equalListItems(listbox.items().eq(2), item3);
        equalListItems(listbox.items().eq(3), item4);
    });

    test("moveup action should not reorder the data items of multiple list items at the top in the dataSource", function() {
        listbox.select(item1.add(item2));

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
        equal(listbox.dataSource.at(1).uid, getId(item2));
        equal(listbox.dataSource.at(2).uid, getId(item3));
        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    test("moveup action should not partially reorder the html elements of multiple list items at the top", function() {
        listbox.select(item1.add(item3));

        clickMoveUpButton(listbox);

        equalListItems(listbox.items().eq(0), item1);
        equalListItems(listbox.items().eq(1), item2);
        equalListItems(listbox.items().eq(2), item3);
        equalListItems(listbox.items().eq(3), item4);
    });

    test("moveup action should not partially reorder the data items of multiple list items at the top in the dataSource", function() {
        listbox.select(item3.add(item1));

        clickMoveUpButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
        equal(listbox.dataSource.at(1).uid, getId(item2));
        equal(listbox.dataSource.at(2).uid, getId(item3));
        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    module("ListBox toolbar", {
        setup: function() {
            $(document.body).append(QUnit.fixture);
            listbox = createListBoxWithToolbar();
            item1 = listbox.items().eq(0);
            item2 = listbox.items().eq(1);
            item3 = listbox.items().eq(2);
            item4 = listbox.items().eq(3);
        },
        teardown: function() {
            destroyListBox(listbox);
            kendo.destroy(QUnit.fixture);
        }
    });

    test("movedown action should not move the html element of the last list item", function() {
        listbox.select(item4);

        clickMoveDownButton(listbox);

        equal(listbox.items()[3], item4[0]);
    });

    test("movedown action should not move the data item of the last list item in the dataSource", function() {
        listbox.select(item4);

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    test("movedown action should move the html element of a list item", function() {
        listbox.select(item1);

        clickMoveDownButton(listbox);

        equalListItems(listbox.items().eq(0), item2);
        equalListItems(listbox.items().eq(1), item1);
    });

    test("movedown action should move the data item of a list item in the dataSource", function() {
        listbox.select(item1);

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item2));
        equal(listbox.dataSource.at(1).uid, getId(item1));
    });

    test("movedown action should reorder the html elements of multiple list items", function() {
        listbox.select(item2.add(item3));

        clickMoveDownButton(listbox);

        equalListItems(listbox.items().eq(0), item1);
        equalListItems(listbox.items().eq(1), item4);
        equalListItems(listbox.items().eq(2), item2);
        equalListItems(listbox.items().eq(3), item3);
    });

    test("movedown action should reorder the data items of multiple list items in the dataSource", function() {
        listbox.select(item2.add(item3));

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
        equal(listbox.dataSource.at(1).uid, getId(item4));
        equal(listbox.dataSource.at(2).uid, getId(item2));
        equal(listbox.dataSource.at(3).uid, getId(item3));
    });

    test("movedown action should reorder the html elements of non-adjacent list items", function() {
        listbox.select(item1.add(item3));

        clickMoveDownButton(listbox);

        equalListItems(listbox.items().eq(0), item2);
        equalListItems(listbox.items().eq(1), item1);
        equalListItems(listbox.items().eq(2), item4);
        equalListItems(listbox.items().eq(3), item3);
    });

    test("movedown action should reorder the data items of non-adjacent list items in the dataSource", function() {
        listbox.select(item1.add(item3));

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item2));
        equal(listbox.dataSource.at(1).uid, getId(item1));
        equal(listbox.dataSource.at(2).uid, getId(item4));
        equal(listbox.dataSource.at(3).uid, getId(item3));
    });

    test("movedown action should not reorder the html elements of multiple list items at the bottom", function() {
        listbox.select(item2.add(item4));

        clickMoveDownButton(listbox);

        equalListItems(listbox.items().eq(0), item1);
        equalListItems(listbox.items().eq(1), item2);
        equalListItems(listbox.items().eq(2), item3);
        equalListItems(listbox.items().eq(3), item4);
    });

    test("movedown action should not reorder the data items of multiple list items at the bottom in the dataSource", function() {
        listbox.select(item3.add(item4));

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
        equal(listbox.dataSource.at(1).uid, getId(item2));
        equal(listbox.dataSource.at(2).uid, getId(item3));
        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    test("movedown action should not partially reorder the html elements of multiple list items at the bottom", function() {
        listbox.select(item2.add(item4));

        clickMoveDownButton(listbox);

        equalListItems(listbox.items().eq(0), item1);
        equalListItems(listbox.items().eq(1), item2);
        equalListItems(listbox.items().eq(2), item3);
        equalListItems(listbox.items().eq(3), item4);
    });

    test("movedown action should not partially reorder the data items of multiple list items at the bottom in the dataSource", function() {
        listbox.select(item2.add(item4));

        clickMoveDownButton(listbox);

        equal(listbox.dataSource.at(0).uid, getId(item1));
        equal(listbox.dataSource.at(1).uid, getId(item2));
        equal(listbox.dataSource.at(2).uid, getId(item3));
        equal(listbox.dataSource.at(3).uid, getId(item4));
    });

    module("ListBox toolbar", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: []
                }
            }, "<select id='listbox2' />");

            item1 = listbox1.items().eq(0);
            item2 = listbox1.items().eq(1);
            item3 = listbox1.items().eq(2);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferTo action should not work without selection", function() {
        var itemsLength = listbox1.items().length;

        clickTransferToButton(listbox1);

        equal(listbox1.items().length, itemsLength);
        equal(listbox2.items().length, 0);
    });

    test("transferTo action should call add() for destination listbox", function() {
        var item = listbox1.items().eq(0);
        var dataItem = listbox1.dataItem(item);
        var addStub = stub(listbox2, ADD);
        listbox1.select(item);

        clickTransferToButton(listbox1);

        equal(addStub.args(ADD).length, 1);
        deepEqual(addStub.args(ADD)[0], [dataItem]);
    });

    test("transferTo action should call remove() for source listbox", function() {
        var item = listbox1.items().eq(0);
        var dataItem = listbox1.dataItem(item);
        var removeStub = stub(listbox1, REMOVE);
        listbox1.select(item);

        clickTransferToButton(listbox1);

        equal(removeStub.args(REMOVE).length, 1);
        equalDataArrays(removeStub.args(REMOVE)[0], $(item));
    });

    test("transferTo action should select the next non-disabled item", function() {
        var dataItem = listbox1.dataItem(item1);
        listbox1.select(item1);

        clickTransferToButton(listbox1);

        equal(listbox1.select().length, 1);
        equalListItems(listbox1.select(), item2);
    });

    test("transferTo action should not selected disabled items", function() {
        var dataItem = listbox1.dataItem(item1);
        listbox1.enable(item2, false);
        listbox1.select(item1);

        clickTransferToButton(listbox1);

        equal(listbox1.select().length, 1);
        equal(listbox1.select()[0], item3[0]);
    });

    module("ListBox toolbar", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }, {
                        id: 7,
                        text: "item7"
                    }]
                }
            }, "<select id='listbox2' />");

            item1 = listbox2.items().eq(0);
            item2 = listbox2.items().eq(1);
            item3 = listbox2.items().eq(2);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferFrom action should not work without selection", function() {
        var itemsLength1 = listbox1.items().length;
        var itemsLength2 = listbox2.items().length;

        clickTransferFromButton(listbox1);

        equal(listbox1.items().length, itemsLength1);
        equal(listbox2.items().length, itemsLength2);
    });

    test("transferFrom action should call add() for destination listbox", function() {
        var item = listbox2.items().eq(0);
        var dataItem = listbox2.dataItem(item);
        var addStub = stub(listbox1, ADD);
        listbox2.select(item);

        clickTransferFromButton(listbox1);

        equal(addStub.args(ADD).length, 1);
        deepEqual(addStub.args(ADD)[0], [dataItem]);
    });

    test("transferFrom action should call remove() for source listbox", function() {
        var item = listbox2.items().eq(0);
        var dataItem = listbox2.dataItem(item);
        var removeStub = stub(listbox2, REMOVE);
        listbox2.select(item);

        clickTransferFromButton(listbox1);

        equal(removeStub.args(REMOVE).length, 1);
        equalDataArrays(removeStub.args(REMOVE)[0], $(item));
    });

    test("transferFrom action should select the next non-disabled item", function() {
        var dataItem = listbox2.dataItem(item1);
        listbox2.select(item1);

        clickTransferFromButton(listbox1);

        equal(listbox2.select().length, 1);
        equal(listbox2.select()[0], item2[0]);
    });

    test("transferFrom action should skip disabled item", function() {
        var dataItem = listbox2.dataItem(item1);
        listbox2.enable(item2, false);
        listbox2.select(item1);

        clickTransferFromButton(listbox1);

        equal(listbox2.select().length, 1);
        equal(listbox2.select()[0], item3[0]);
    });

    module("ListBox toolbar", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: []
                }
            }, "<select id='listbox2' />");

            item1 = listbox1.items().eq(0);
            item2 = listbox1.items().eq(1);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferAllTo action should work without selection", function() {
        var itemsLength = listbox1.items().length;

        clickTransferAllToButton(listbox1);

        equal(listbox1.items().length, 0);
        equal(listbox2.items().length, itemsLength);
    });

    test("transferAllTo action should call add() for destination listbox", function() {
        var dataItems = listbox1.dataItems();
        var addStub = stub(listbox2, ADD);

        clickTransferAllToButton(listbox1);

        equal(addStub.args(ADD).length, 1);
        equalDataArrays(addStub.args(ADD)[0], dataItems);
    });

    test("transferAllTo action should call remove() for source listbox", function() {
        var items = listbox1.items();
        var dataItems = listbox1.dataItems();
        var removeStub = stub(listbox1, REMOVE);

        clickTransferAllToButton(listbox1);

        equal(removeStub.args(REMOVE).length, 1);
        equalListItemArrays(removeStub.args(REMOVE)[0], items);
    });

    test("transferAllTo action should skip disabled items", function() {
        listbox1.enable(item2, false);

        clickTransferAllToButton(listbox1);

        equal(listbox1.items().length, 1)
        equalListItems(listbox1.items()[0], item2);
    });

    module("ListBox toolbar", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                dataSource: {
                    data: []
                },
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBox({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            item1 = listbox2.items().eq(0);
            item2 = listbox2.items().eq(1);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferAllFrom action should trigger remove event with args for source listbox", function() {
        listbox2.bind(REMOVE, function(e) {
            args = e;
        });
        var items = listbox2.items();
        var dataItems = listbox2.dataItems();

        clickTransferAllFromButton(listbox1);

        equalDataArrays(args.dataItems, dataItems);
        equalListItemArrays(args.items, items);
    });

    test("transferAllFrom action should trigger add event with args for destination listbox", function() {
        listbox1.bind(ADD, function(e) {
            args = e;
        });
        var items = listbox2.items();
        var dataItems = listbox2.dataItems();

        clickTransferAllFromButton(listbox1);

        equalDataArrays(args.dataItems, dataItems);
        equalListItemArrays(args.items, items);
    });

    test("transferAllFrom action should trigger a single add event for multiple items", function() {
        var calls = 0;
        listbox1.bind(ADD, function(e) {
            calls++;
        });

        clickTransferAllFromButton(listbox1);

        equal(calls, 1);
    });

    test("transferAllFrom action should trigger a single remove event for multiple items", function() {
        var calls = 0;
        listbox2.bind(REMOVE, function(e) {
            calls++;
        });

        clickTransferAllFromButton(listbox1);

        equal(calls, 1);
    });

    test("transferAllFrom should trigger a remove event for source listbox which should be preventable", function() {
        var args = {};
        listbox2.bind(REMOVE, function(e) {
            args = e;
            e.preventDefault();
        });
        var itemsLength = listbox2.items().length;

        clickTransferAllFromButton(listbox1);

        equal(args.isDefaultPrevented(), true);
        equal(listbox1.items().length, itemsLength);
        equal(listbox2.items().length, itemsLength);
    });

    test("transferAllFrom should trigger an add event for destination listbox which should be preventable", function() {
        var args = {};
        listbox1.bind(ADD, function(e) {
            args = e;
            e.preventDefault();
        });

        clickTransferAllFromButton(listbox1);

        equal(args.isDefaultPrevented(), true);
        equal(listbox1.items().length, 0);
        equal(listbox2.items().length, 0);
    });

    test("transferAllFrom action should skip disabled items", function() {
        listbox2.enable(item2, false);

        clickTransferAllFromButton(listbox1);

        equal(listbox2.items().length, 1)
        equalListItems(listbox2.items()[0], item2);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox = createListBoxWithToolbar();

            item1 = listbox.items().eq(0);
            item2 = listbox.items().eq(1);
            item3 = listbox.items().eq(2);
            lastItem = listbox.items().last();
        },
        teardown: function() {
            destroyListBox(listbox);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("remove tool should be disabled when no item is selected", function() {
        var tool = getToolElement(listbox, REMOVE);

        listbox.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("remove tool should be enabled when an item is selected", function() {
        var tool = getToolElement(listbox, REMOVE);

        listbox.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("remove tool should be disabled after executing remove", function() {
        var tool = getToolElement(listbox, REMOVE);
        listbox.select(item1);

        clickRemoveButton(listbox);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("moveup tool should be disabled when first item is selected", function() {
        var tool = getToolElement(listbox, MOVE_UP);

        listbox.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("moveup tool should be enabled when the first item is not selected", function() {
        var tool = getToolElement(listbox, MOVE_UP);

        listbox.select(item2);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("moveup tool should be disabled after executing moveup on the second item", function() {
        var tool = getToolElement(listbox, MOVE_UP);
        listbox.select(item2);

        clickMoveUpButton(listbox);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("movedown tool should be disabled when last item is selected", function() {
        var tool = getToolElement(listbox, MOVE_DOWN);

        listbox.select(lastItem);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("movedown tool should be enabled when the last item is not selected", function() {
        var tool = getToolElement(listbox, MOVE_DOWN);

        listbox.select(item2);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("movedown tool should be disabled after executing movedown before the last item", function() {
        var tool = getToolElement(listbox, MOVE_DOWN);
        listbox.select(item3);

        clickMoveDownButton(listbox);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            item1 = listbox1.items().eq(0);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferTo tool should be disabled when no item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_TO);

        listbox1.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("transferTo tool should be enabled when item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_TO);

        listbox1.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferTo tool should be enabled after executing transferTo", function() {
        var tool = getToolElement(listbox1, TRANSFER_TO);
        listbox1.select(item1);

        clickTransferToButton(listbox1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            item1 = listbox2.items().eq(0);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferFrom tool should be disabled when no item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_FROM);

        listbox2.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("transferFrom tool should be enabled when item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_FROM);

        listbox2.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferFrom tool should be enabled after executing transferFrom", function() {
        var tool = getToolElement(listbox1, TRANSFER_FROM);
        listbox2.select(item1);

        clickTransferFromButton(listbox1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferFrom tool should be disabled after deleting all items", function() {
        var tool = getToolElement(listbox1, TRANSFER_FROM);
        listbox2.select(listbox2.items());

        clickRemoveButton(listbox2);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox3 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 7,
                        text: "item7"
                    }, {
                        id: 8,
                        text: "item8"
                    }]
                },
                connectWith: "#listbox1"
            }, "<select id='listbox3' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            item1 = listbox1.items().eq(0);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            destroyListBox(listbox3);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferFrom tool should be disabled when item of connected listbox is not selected", function() {
        var tool = getToolElement(listbox3, TRANSFER_FROM);

        listbox1.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    test("transferFrom tool should be enabled when item of connected listbox is selected", function() {
        var tool = getToolElement(listbox3, TRANSFER_FROM);

        listbox1.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            item1 = listbox1.items().eq(0);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferAllTo tool should be enabled when no item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_TO);

        listbox1.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferAllTo tool should be enabled when item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_TO);

        listbox1.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferAllTo tool should be disabled after executing transferAllTo", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_TO);

        clickTransferAllToButton(listbox1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });

    module("ListBox toolbar tools", {
        setup: function() {
            $(document.body).append(QUnit.fixture);

            listbox1 = createListBoxWithToolbar({
                connectWith: "#listbox2"
            }, "<select id='listbox1' />");

            listbox2 = createListBoxWithToolbar({
                dataSource: {
                    data: [{
                        id: 5,
                        text: "item5"
                    }, {
                        id: 6,
                        text: "item6"
                    }]
                }
            }, "<select id='listbox2' />");

            item1 = listbox1.items().eq(0);
        },
        teardown: function() {
            destroyListBox(listbox1);
            destroyListBox(listbox2);
            kendo.destroy(QUnit.fixture);
            $(document.body).find(QUnit.fixture).off().remove();
        }
    });

    test("transferAllFrom tool should be enabled when no item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_FROM);

        listbox2.clearSelection();

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferAllFrom tool should be enabled when item is selected", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_FROM);

        listbox2.select(item1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), false);
    });

    test("transferAllFrom tool should be disabled after executing transferAllFrom", function() {
        var tool = getToolElement(listbox1, TRANSFER_ALL_FROM);

        clickTransferAllFromButton(listbox1);

        equal(tool.hasClass(DISABLED_STATE_CLASS), true);
    });
})();
