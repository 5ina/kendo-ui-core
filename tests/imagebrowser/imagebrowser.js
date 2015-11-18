(function() {
    var ImageBrowser = kendo.ui.ImageBrowser,
        container;

    function setup(options, data) {
        data = data || [{ name: "File1", size: 42, type: "f" }, { name: "Folder1", type: "d" }];
        options = $.extend(true, {
            transport: {
                read: function(options) {
                    options.success({
                        items: data
                    });
                }
            }
        }, options);
        return new ImageBrowser(container, options);
    }

    module("kendo.ui.imagebrowser", {
        setup: function() {
            container = $("<div/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
           var widget = container.data("kendoImageBrowser");
           if (widget) {
               widget.destroy();
           }
           container.remove();
        }
    });

    test("kendoImageBrowser attaches a imagebrowser object to target", function() {
        container.kendoImageBrowser({
            transport: {
                read: function(options) {
                    options.success({
                        items: [{ name: "File1", size: 42, type: "f" }, { name: "Folder1", type: "d" }]
                    });
                }
            }
        });

        ok(container.data("kendoImageBrowser") instanceof ImageBrowser);
    });

    test("constructor calls data", 1, function() {
        setup({ transport: { read: function() { ok(true); } } });
    });

    test("listView is attached", function() {
        var browser = setup();

        ok(browser.listView instanceof kendo.ui.ListView);
    });

    test("k-imagebrowser class is added to the container", function() {
        setup();

        ok(container.hasClass("k-imagebrowser"));
    });

    test("toolbar is rendered", function() {
        setup();
        ok(container.children("div.k-filebrowser-toolbar").length);
    });

    test("toolbar texts", function() {
        var browser = setup({
                transport: {
                    uploadUrl: "foo"
                }
            }),
            toolbar = browser.toolbar;

        equal(browser.toolbar.find("div.k-upload .k-upload-button").text(), "Upload");
        equal(toolbar.find(".k-tiles-arrange").text().indexOf("Arrange by:"), 0);
        equal(toolbar.find(".k-tiles-arrange .k-input").text(), "Name");
    });

    test("toolbar texts are loaded from messages", function() {
        var browser = setup({
                transport: {
                    uploadUrl: "foo"
                },
                messages: {
                    uploadFile: "foo",
                    orderBy: "bar",
                    orderByName: "baz"
                }
            }),
            toolbar = browser.toolbar;

        equal(toolbar.find("div.k-upload .k-upload-button").text(), "foo");
        equal(toolbar.find(".k-tiles-arrange").text().indexOf("bar"), 0);
        equal(toolbar.find(".k-tiles-arrange .k-input").text(), "baz");
    });

    test("Upload widget is attached", function() {
        var browser = setup({ transport: { uploadUrl: "foo" } }),
            upload = browser.toolbar.find("div.k-upload input").data("kendoUpload");

        ok(upload);
        equal(upload.options.async.saveUrl, "foo");
    });

    test("error event is raised if upload fails", 1, function() {
        var browser = setup({
                transport: { uploadUrl: "foo" },
                error: function(e) {
                    e.preventDefault(); // prevent showing the alert
                    ok(true);
                }
            }),
            upload = browser.toolbar.find("div.k-upload input").data("kendoUpload");

            upload.trigger("error", { XMLHttpRequest: { } });
    });

    test("selecting item from arrangeby popup changes the text", function() {
        var browser = setup(),
            toolbar = browser.toolbar;

        browser.arrangeBy.value("size");

        equal(toolbar.find(".k-tiles-arrange .k-input").text(), "Size");
    });

    test("items are sorted by type and name", function() {
        var browser = setup();

        var sortDescriptors = browser.dataSource.sort();

        equal(sortDescriptors.length, 2);
        equal(sortDescriptors[0].field, "type");
        equal(sortDescriptors[0].dir, "asc");
        equal(sortDescriptors[1].field, "name");
        equal(sortDescriptors[1].dir, "asc");
    });

    test("items are sorted by with custom schema", function() {
        var browser = setup({
            transport: {
                read: function(options) {
                    options.success({
                        items: [ { FileName: "foo", FileSize: 42, Kind: "f" } ]
                    });
                }
            },
            schema: {
                model: {
                    fields: {
                        name: "FileName",
                        size: "FileSize",
                        type: "Kind"
                    }
                }
            }
        });

        var sortDescriptors = browser.dataSource.sort();

        equal(sortDescriptors.length, 2);
        equal(sortDescriptors[0].field, "type");
        equal(sortDescriptors[0].dir, "asc");
        equal(sortDescriptors[1].field, "name");
        equal(sortDescriptors[1].dir, "asc");
    });

    test("items are sorted by with custom global schema", function() {
        kendo.data.schemas["imagebrowser_custom"] =  {
                model: {
                    fields: {
                        name: "FileName",
                        size: "FileSize",
                        type: "Kind"
                    }
                }
            };

        kendo.data.transports["imagebrowser_custom"] =
            kendo.data.RemoteTransport.extend({
                init: function(options) {
                    kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, {}, this.options, options));
                },
                read: function(options) {
                    options.success([ { FileName: "foo", FileSize: 42, Kind: "f" } ]);
                }
            });

        var browser = setup({
            transport: {
                type: "imagebrowser_custom"
            }
        });

        var sortDescriptors = browser.dataSource.sort();

        equal(sortDescriptors.length, 2);
        equal(sortDescriptors[0].field, "type");
        equal(sortDescriptors[0].dir, "asc");
        equal(sortDescriptors[1].field, "name");
        equal(sortDescriptors[1].dir, "asc");
    });

    test("selecting item from arrangeby popup changes the sort order and persist default order", function() {
        var browser = setup(),
            toolbar = browser.toolbar;

        toolbar.find(".k-tiles-arrange a").click();
        browser.arrangeBy.value("size");
        browser.arrangeBy.trigger("change");

        var sortDescriptors = browser.dataSource.sort();

        equal(sortDescriptors.length, 2);
        equal(sortDescriptors[0].field, "type");
        equal(sortDescriptors[0].dir, "asc");
        equal(sortDescriptors[1].field, "size");
        equal(sortDescriptors[1].dir, "asc");
    });


    test("listview renders the files", 1, function() {
        var browser = setup({}, [
            { name: "file1", type: "f", size: 42 },
            { name: "file2", type: "f", size: 142 }
        ]);

        equal(browser.listView.element.find("li").length, 2);
    });

    test("css class is applied to the files if no thubnailUrl is set", 1, function() {
        var browser = setup({ },
            [
                { name: "file1", type: "f", size: 42 },
                { name: "file2", type: "f", size: 142 }
            ]);

        equal(browser.listView.element.find(".k-file").length, 2);
    });


    test("schema is used to described custom result", function() {
        var browser = setup({
            transport: {
                read: function(options) {
                    options.success({
                        MyData: [
                            { name: "file1", type: "f", size: 42 },
                            { name: "file2", type: "f", size: 142 }
                        ]
                    });
                }
            },
            schema: {
                data: "MyData"
            }
        });

        equal(browser.listView.element.find("li").length, 2);
    });

    test("model field definition is used to generate item template", function() {
        var browser = setup({
            transport: {
                read: function(options) {
                    options.success({
                        items: [ { FileName: "foo", FileSize: 42, Kind: "f" } ]
                    });
                }
            },
            schema: {
                model: {
                    fields: {
                        name: "FileName",
                        size: "FileSize",
                        type: "Kind"
                    }
                }
            }
        });
        var item = browser.listView.items().first();
        equal(item.find("strong").text(), "foo");
        equal(item.find("span.k-filesize").text(), "42 bytes");
    });

    test("model field definition as object is used to generate item template", function() {
        var browser = setup({
            transport: {
                read: function(options) {
                    options.success({
                        items: [ { FileName: "foo", FileSize: 42, Kind: "f" } ]
                    });
                }
            },
            schema: {
                model: {
                    fields: {
                        name: { field: "FileName" },
                        size: { field: "FileSize" },
                        type: "Kind"
                    }
                }
            }
        });
        var item = browser.listView.items().first();
        equal(item.find("strong").text(), "foo");
        equal(item.find("span.k-filesize").text(), "42 bytes");
    });

    test("path is displayed in the toolbar input", function() {
        var browser = setup({ path: "foo" });

        equal(browser.breadcrumbs.value(), "foo");
    });

    test("path requests data", 1, function() {
        var browser = setup({ });

        browser.dataSource.bind("requestStart", function() {
            ok(true);
        });
        browser.path("foo");
    });

    test("path returns empty string if is root value", function() {
        var browser = setup({ });

        equal(browser.path(), "");
    });

    test("path adds slash at the end", function() {
        var browser = setup();

        browser.path("foo");

        equal(browser.path(), "foo/");
    });

    test("search adds a filter descriptor to the datasource", function() {
        var browser = setup({ });

        browser.search("foo");
        var filters = browser.dataSource.filter().filters;
        equal(filters.length, 1);
        equal(filters[0].field, "name");
        equal(filters[0].operator, "contains");
        equal(filters[0].value, "foo");
    });

    test("changing the value of the search box calls search method", function() {
        var browser = setup(),
            search = stub(browser, "search");

        browser.searchBox.value("foo");
        browser.searchBox.trigger("change");

        equal(search.calls("search"), 1);
    });

    test("clicking on directory does not trigger the change event", 1, function() {
        var browser = setup({
            change: function() {
                ok(false);
            }
        });

        clickAt(browser.list.find("li[data-type=d]"));

        ok(!browser.value());
    });

    test("clicking on file triggers the change event", 2, function() {
        var browser = setup({
            path: "foo",
            change: function() {
                ok(true);
            }
        });

        clickAt(browser.list.find("li[data-type=f]"));

        equal(browser.value(), "foo/File1");
    });

    test("clicking on file triggers the change event", 2, function() {
        var browser = setup({
            path: "foo",
            change: function() {
                ok(true);
            }
        });

        clickAt(browser.list.find("li[data-type=f]"));

        equal(browser.value(), "foo/File1");
    });

    test("clicking on folder enables the delete button", 2, function() {
        var browser = setup({ transport: { destroy: "foo" } });

        clickAt(browser.list.find("li[data-type=d]"));

        ok(browser.toolbar.find("button:has(span.k-delete)").length);
        ok(!browser.toolbar.find("button:has(span.k-delete)").hasClass("k-state-disabled"));
    });


    test("clicking on file enables the delete button", 1, function() {
        var browser = setup();

        clickAt(browser.list.find("li[data-type=f]"));

        ok(!browser.toolbar.find("button:has(span.k-delete)").hasClass("k-state-disabled"));
    });

    test("rebinding disables the delete button", function() {
        var browser = setup({ transport: { destroy: "foo" } });

        clickAt(browser.list.find("li[data-type=f]"));
        browser.dataSource.read();

        ok(browser.toolbar.find("button:has(span.k-delete)").hasClass("k-state-disabled"))
    });

    test("value contains the path diffrent then the base path", function() {
        var browser = setup({ path: "foo" });

        browser.path("bar");

        clickAt(browser.list.find("li[data-type=f]"))

        equal(browser.value(), "bar/File1");
    });

    test("file size is formatted", function() {
        var browser = setup({ path: "foo" }, [{ name: "Image", size: 7326629, type: "f" }, { name: "Image2", type: "f", size: 1073741824 }]);
        equal(browser.list.find("li:first .k-filesize").text(), "6.99 MB");
        equal(browser.list.find("li:last .k-filesize").text(), "1 GB");
    });

    test("file size is formatted if empty", function() {
        var browser = setup({ path: "foo" }, [{ name: "Image", type: "f" }]);
        equal(browser.list.find("li:first .k-filesize").text(), "");
    });

    test("double clicking a folder set the path", function() {
        var browser = setup();

        browser.list.find("li[data-type=d]")
            .trigger("dblclick");

        equal(browser.path(), "Folder1/");
    });

    test("no data message is shown if there is no data", function() {
        var browser = setup({}, []);

        equal(browser.list.find("li").length, 1);
        ok(browser.list.find("li.k-tile-empty").length);
    });

    test("delete button triggers listView remove method", function() {
        var browser = setup({ transport: { destroy: "foo" } }),
            remove = stub(browser.list.data("kendoListView"), "remove");

        browser._showMessage = function() { return true};// suppress the alert for poping

        clickAt(browser.list.find("li[data-type=f]"));

        browser.toolbar.find(".k-delete").click();

        ok(remove.calls("remove"));
    });

    test("delete button triggers datasource destory method passing the path", 1, function() {
        var browser = setup({
            transport: {
                destroy: function(options) {
                    equal(options.data.path, "foo/");
                }
            }
        });

        browser.path("foo");

        browser._showMessage = function() { return true};// suppress the alert for poping

        clickAt(browser.list.find("li[data-type=f]"));

        browser.toolbar.find(".k-delete").click();
    });

    test("delete button does not trigger listView remove method if no item is selected", function() {
        var browser = setup(),
            remove = stub(browser.list.data("kendoListView"), "remove"),
            showMessage = stub(browser, "_showMessage");// suppress the alert for poping

        browser.toolbar.find(".k-delete").click();

        ok(!remove.calls("remove"));
    });

    test("delete button shows confirmation", function() {
        var browser = setup({ transport: { destroy: "foo" } }),
            remove = stub(browser.list.data("kendoListView"), "remove"),
            showMessage = stub(browser, { _showMessage: function() { return true; } });

        clickAt(browser.list.find("li[data-type=f]"));
        browser.toolbar.find(".k-delete").click();

        ok(remove.calls("remove"));
        ok(showMessage.calls("_showMessage"));
        ok(showMessage.args("_showMessage"));
        equal(showMessage.args("_showMessage")[1], "confirm");
    });

    test("canceling the delete confirmation does not trigger the remove", function() {
        var browser = setup(),
            remove = stub(browser.list.data("kendoListView"), "remove"),
            showMessage = stub(browser, { _showMessage: function() { return false; } });

        clickAt(browser.list.find("li[data-type=f]"));
        browser.toolbar.find(".k-delete").click();

        ok(!remove.calls("remove"));
    });

    test("create directory", function() {
        var browser = setup({}, []);

        browser.createDirectory();

        ok(!browser.list.find("li.k-tile-empty").length);
        equal(browser.list.find("li").length, 1);
        ok(browser.list.find("li").hasClass("k-state-selected"));
        equal(browser.dataSource.data().length, 1);
    });

    test("createDirectory generates unique name", function() {
        var browser = setup({}, [{ name: "New folder", type: "d" }]);

        browser.createDirectory();

        equal(browser.list.find("li:last input").val(), "New folder (2)");
    });

    test("createDirectory generates first available unique name", function() {
        var browser = setup({}, [{ name: "New folder (2)", type: "d" }]);

        browser.createDirectory();

        equal(browser.list.find("li:first input").val(), "New folder");
    });

    test("bluring the new directory input set the value", 2, function() {
        var browser = setup({
            transport: {
                create:
                    function() { ok(true); }
                }
        }, []);

        browser.createDirectory();

        var tile =  browser.list.find("li:last");
        var model = browser.dataSource.getByUid(tile.attr("data-uid"));

        tile.find("input").val("foo").change().blur();
        equal(model.get("name"), "foo");
    });

    test("dblclicking the new directory input sets the value", 2, function() {
        var browser = setup({
            transport: {
                create:
                    function() { ok(true); }
                }
        }, []);

        browser.createDirectory();

        var tile =  browser.list.find("li:last");
        var model = browser.dataSource.getByUid(tile.attr("data-uid"));

        tile.find("input").val("foo").change().trigger("dblclick");
        equal(model.get("name"), "foo");
    });

    test("name is generated if directory name is empty", 2, function() {
        var browser = setup({
            transport: {
                create:
                    function() { ok(true); }
                }
        }, []);

        browser.createDirectory();

        var tile =  browser.list.find("li:last");
        var model = browser.dataSource.getByUid(tile.attr("data-uid"));

        tile.find("input").val("").change().blur();
        equal(model.get("name"), "New folder");
    });

    test("name is generated if directory name is changed to already existing one", 2, function() {
        var browser = setup({
            transport: {
                create:
                    function() { ok(true); }
                }
        }, [{ name: "New folder", type: "d" }]);

        browser.createDirectory();

        var tile =  browser.list.find("li:last");
        var model = browser.dataSource.getByUid(tile.attr("data-uid"));

        tile.find("input").val("new Folder").change().blur();
        equal(model.get("name"), "New folder (2)");
    });

    test("saving the new directory calls the DataSource create passing the path", 2, function() {
        var browser = setup({
            transport: {
                create: function(options) {
                    equal(options.data.path, "foo/");
                }
            }
        }, []);

        browser.path("foo/");

        browser.createDirectory();

        var tile =  browser.list.find("li:last");
        var model = browser.dataSource.getByUid(tile.attr("data-uid"));

        tile.find("input").val("foo").change().blur();
        equal(model.get("name"), "foo");
    });

    test("adding already existing file shows message", function() {
        var browser = setup({}, [{ name: "foo", type: "f" }]),
            showMessage = stub(browser, "_showMessage");

        browser._createFile("foo");

        ok(showMessage.calls("_showMessage"));
    });

    test("createFile return existing model is found", function() {
        var browser = setup({}, [{ name: "foo", type: "f" }]);

        browser._showMessage = function() { return true; };

        var model = browser.dataSource.get("foo");

        deepEqual(browser._createFile("foo"), model);
    });

    test("createFile sets _forceReload model field", function() {
        var browser = setup({}, [{ name: "foo", type: "f" }]);
        browser._showMessage = function() { return true; };

        var model = browser._createFile("foo");

        equal(model._forceReload, true);
    });

    test("loadImage adds unique parameter to thumbnailUrl if _forceReload is true", function() {
        var browser = setup({ transport: { thumbnailUrl: "foo" } }, [{ name: "foo", type: "f" }]);
        browser._showMessage = function() { return true; };

        var model = browser.dataSource.at(0);
        model._forceReload = true;

        browser._loadImage(browser._tiles.eq(0));
        var url = browser._tiles.find("img").attr("src");

        ok(/&_=\d+/.test(url));
    });

    test("loadImage deletes item _forceReload field", function() {
        var browser = setup({ transport: { thumbnailUrl: "foo" } }, [{ name: "foo", type: "f" }]);
        browser._showMessage = function() { return true; };

        var model = browser.dataSource.at(0);
        model._forceReload = true;

        browser._loadImage(browser._tiles.eq(0));
        ok(model._forceReload === undefined);
    });

    test("value custom formating is applied", function() {
        var browser = setup({
            transport: {
                imageUrl: function(path) {
                    return "foo" + "/" + path;
                }
            }
        });

        clickAt(browser.list.find("li[data-type=f]"));

        equal(browser.value(), "foo/File1");
    });

    test("value special chars are encoded", function() {
        var browser = setup({
            transport: {
                imageUrl: "foo/{0}"
            }
        },[{ name: "fileName#.jpg", type: "f" }]);

        clickAt(browser.list.find("li[data-type=f]"));

        equal(browser.value(), "foo/fileName%23.jpg");
    });

    test("value custom formating as string is applied", function() {
        var browser = setup({
            transport: {
                imageUrl: "foo?path={0}"
            }
        });

        clickAt(browser.list.find("li[data-type=f]"));

        equal(browser.value(), "foo?path=File1");
    });

    test("listView is not rebuild when item is deleted", 0, function() {
        var browser = setup();

        browser.listView.bind("dataBound", function() {
            ok(false);
        });

        browser._showMessage = function() { return true};// suppress the alert for poping

        clickAt(browser.list.find("li[data-type=d]"));
        browser.toolbar.find(".k-delete").click();
    });

    test("double clicking a image triggers apply event", 1, function() {
        var browser = setup({
            apply: function() {
                ok(true);
            }
        });

        browser.list.find("li[data-type=f]")
            .trigger("dblclick");
    });

    test("upload is not displayed if uploadUrl is not set", function() {
        var browser = setup({
            transport: {
            }
        });

        ok(!browser.element.find(".k-upload").length);
    });

    test("delete button is not displayed if destroy url is not set", function() {
        var browser = setup({
            transport: {
            }
        });

        ok(!browser.element.find(".k-delete").length);
    });

    test("create new folder button is not displayed if create url is not set", function() {
        var browser = setup({
            transport: {
            }
        });

        ok(!browser.element.find(".k-addfolder").length);
    });

    test("destroy calls nested upload destroy", function() {
        var browser = setup({ transport: { uploadUrl: "foo" } }),
            upload = container.find(".k-upload input").data("kendoUpload"),
            originalDestroy = upload.destroy,
            destroy = stub(upload, "destroy")

        browser.destroy();
        ok(destroy.calls("destroy"));
        originalDestroy.call(upload);
    });

    test("destroy calls nested listview destroy", function() {
        var browser = setup(),
            originalDestroy = browser.listView.destroy,
            destroy = stub(browser.listView, "destroy")

        browser.destroy();
        ok(destroy.calls("destroy"));
        originalDestroy.call(browser.listView);
    });

    test("destroy calls nested popup destroy", function() {
        var browser = setup(),
            originalDestroy = browser.arrangeBy.destroy,
            destroy = stub(browser.arrangeBy, "destroy")

        browser.destroy();
        ok(destroy.calls("destroy"));
        originalDestroy.call(browser.arrangeBy);
    });

    test("destroy calls nested searchbox destroy", function() {
        var browser = setup(),
            originalDestroy = browser.searchBox.destroy,
            destroy = stub(browser.searchBox, "destroy")

        browser.destroy();
        ok(destroy.calls("destroy"));
        originalDestroy.call(browser.searchBox);
    });

    test("destroy calls nested breadcrumbs destroy", function() {
        var browser = setup(),
            originalDestroy = browser.breadcrumbs.destroy,
            destroy = stub(browser.breadcrumbs, "destroy")

        browser.destroy();
        ok(destroy.calls("destroy"));
        originalDestroy.call(browser.breadcrumbs);
    });

    test("search label message default value", function() {
        var browser = setup({ })
        equal(browser.searchBox.options.label, "Search");
    });

    test("search label message is read from the options", function() {
        var browser = setup({
            messages: {
                search: "foo"
            }
        })
        equal(browser.searchBox.options.label, "foo");
    });
})();
