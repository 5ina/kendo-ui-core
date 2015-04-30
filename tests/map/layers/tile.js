(function() {
    var dataviz = kendo.dataviz,
        map = dataviz.map,

        TilePool = map.layers.TilePool,
        TileLayer = map.layers.TileLayer,
        ImageTile = map.layers.ImageTile,
        TileView = map.layers.TileView,
        Location = map.Location,

        Point = kendo.geometry.Point;

    (function() {
        var map,
            layer;

        function createTileLayer(options) {
            map = new MapMock();
            layer = new TileLayer(map, options);
        }

        // ------------------------------------------------------------
        var mobileOS;

        module("Tile Layer", {
            setup: function() {
                createTileLayer();
                mobileOS = kendo.support.mobileOS;
            },
            teardown: function() {
                kendo.support.mobileOS = mobileOS;
            }
        });

        test("appends to scrollElement", function() {
            ok(layer.element.parent().is("#scroll-element"));
        });

        test("sets custom z-index", function() {
            layer = new TileLayer(map, { zIndex: 100 });
            equal(layer.element.css("zIndex"), 100);
        });

        test("sets opacity", function() {
            layer = new TileLayer(map, { opacity: 0.5 });
            equal(layer.element.css("opacity"), 0.5);
        });

        test("adds attribution on map reset", function() {
            map.attribution = {
                add: function() {
                    ok(true);
                }
            };

            layer = new TileLayer(map, { attribution: "Foo" });
            layer.reset();
        });

        test("does not add attribution if unavailable", 0, function() {
            layer = new TileLayer(map, { attribution: "Foo" });
            layer.reset();
        });

        test("subdomains should be array", function() {
            createTileLayer({
                subdomains: "abc"
            });

            ok(layer.options.subdomains instanceof Array);
        });

        test("renders on pan (desktop)", function() {
            kendo.support.mobileOS = false;
            createTileLayer();

            stubMethod(TileView.fn, "render", function() {
                ok(true);
            }, function() {
                map.trigger("pan");
            });
        });

        test("throttles rendering on pan", function() {
            stubMethod(TileView.fn, "render", function() {
                ok(true);
            }, function() {
                map.trigger("pan");
                map.trigger("pan");
                map.trigger("pan");
            });
        });

        test("does not render on pan (mobile)", 0, function() {
            kendo.support.mobileOS = true;
            createTileLayer();

            stubMethod(TileLayer.fn, "_render", function() {
                ok(false);
            }, function() {
                map.trigger("pan");
            });
        });
    })();

    (function() {

        var view;

        function createView(options) {
            options = options || {};

            var element = $("<div class='k-layer' style='width: 800px; height: 800px;'></div>")
                            .appendTo(document.body);

            view = new TileView(element, {
                urlTemplate: "javascript:void(0)",
                tileSize: options.tileSize || 256
            });

            view.center(new Point(2400, 1500));
            view.extent({
                nw: new Point(1960, 1210),
                se: new Point(2760, 1810)
            });
            // top left corner
            view.basePoint = options.basePoint || new Point(1960, 1210);
            view.subdomainIndex = 0;
            view.zoom(4);
        }

        // ------------------------------------------------------------
        module("Tile view", {
            setup: function() {
                createView();
            },
            teardown: function() {
                $(".k-layer").remove();
            }
        });

        test("should render tiles", function() {
            view.render();
            ok(view.element.children().length === 16);
        });

        test("tileCount should calculate the matrix", function() {
            deepEqual(view.tileCount(), { x: 4, y: 4 });
        });

        test("size should calculate the corrent size", function() {
            deepEqual(view.size(), { width: 800, height: 600 });
        });

        test("indexToPoint should return the corret tile point", function() {
            ok(view.indexToPoint({ x: 1, y: 1 }).equals(new Point(256, 256)));
            ok(view.indexToPoint({ x: -1, y: -1 }).equals(new Point(-256, -256)));
        });

        test("pointToTileIndex should return the corret tile index", function() {
            view.zoom(3);
            ok(view.pointToTileIndex({ x: 256, y: 256 }).equals(new Point(1, 1)));
            ok(view.pointToTileIndex({ x: -256, y: 0 }).equals(new Point(-1, 0)));
        });

        test("subdomainText should return the corect subdomain", function() {
            equal(view.subdomainText(), "a");
        });

        test("clear should reset the tile pool", function() {
            view.pool.reset = function() {
                ok(true);
            };
            view.reset();
        });

        test("destroy should clear the element and the pool", function() {
            view.destroy();
            equal(view.pool._items.length, 0);
            equal(view.element.children().length, 0);
        });

        test("createTile should render tile from a tile index", function() {
            view.options.urlTemplate = "javascript:void('#= subdomain #/#= zoom #/#= x #/#= y #.png')";
            var index = { x: 1, y:1 };
            var tile = view.createTile(index);
            ok(tile.options.point.equals(new Point(256, 256)));
            ok(tile.options.offset.equals(new Point(-1704, -954)));
            equal(tile.options.index.x, index.x);
            equal(tile.options.index.y, index.y);
            equal(tile.url(), "javascript:void('a/4/1/1.png')");
        });

        test("createTile should return the correct offset", function() {
            createView({ basePoint: new Point(10, 10), tileSize: 10 });
            view.zoom(3);
            var index = { x: -1, y: 0 };
            var offset = view.createTile(index).options.offset;
            equal(offset.x, -20);
            equal(offset.y, -10);

            createView({ basePoint: new Point(10, 10), tileSize: 10 });
            view.zoom(3);
            var index = { x: 8, y: 0 };
            var offset = view.createTile(index).options.offset;
            equal(offset.x, 70);
            equal(offset.y, -10);
        });

        test("wrapValue should set the index of the tiles in the current matrix size", function() {
            view.zoom(3);
            var boundary = 8;
            equal(view.wrapValue(1, boundary), 1);
            equal(view.wrapValue(7, boundary), 7);
            equal(view.wrapValue(8, boundary), 0);
            equal(view.wrapValue(9, boundary), 1);
            equal(view.wrapValue(-1, boundary), 7);
            equal(view.wrapValue(-8, boundary), 0);
            equal(view.wrapValue(-9, boundary), 7);
            equal(view.wrapValue(-14, boundary), 2);
            equal(view.wrapValue(-16, boundary), 0);
        });

    })();


    (function() {

        var tile,
            pool;

        function addItemsToPool(count) {
            count = count || 15;
            for (var i = 0; i < count; i++) {
                pool.get({ x: 5, y: 5 },{
                    index: new Point(i, i),
                    currentIndex: new Point(i, i),
                    point: new Point(i, i),
                    offset: new Point(i, i),
                    zoom: 4,
                    subdomain: "a"
                });
            }
        }

        // ------------------------------------------------------------
        module("Tile layer / Pool", {
            setup: function() {
                pool = new TilePool();
            }
        });

        test("should not have more then 10 items", function() {
            pool.options.maxSize = 10;
            addItemsToPool();
            equal(pool._items.length, 10);
        });

        test("empty should remove the items", function() {
            addItemsToPool();
            pool.empty();
            equal(pool._items.length, 0);
        });

        test("should remove old items", function() {
            var oldItem = pool._items[0];
            pool.options.maxSize = 10;
            addItemsToPool(11);
            ok(pool._items[0] !== oldItem);
        });

        test("reset should hide tiles", function() {
            addItemsToPool();
            pool.reset();

            for (var i = 0; i < pool._items.length; i++) {
                ok(!pool._items[i].visible);
            }
        });

    })();

    function createImageTile(options) {
        // value or initial value
        options = options || {};
        options.index = options.index || { x: 0, y: 0 };
        options.currentIndex = options.index || { x: 0, y: 0 };
        options.offset = options.offset || { x: 0, y: 0 };
        options.point = options.point || { x: 0, y: 0 };
        options.opacity = options.opacity || 0;
        options.zoom = options.zoom || 1;
        options.subdomain = options.subdomain || "a";
        options.urlTemplate = options.urlTemplate || "";
        options.errorUrlTemplate = options.errorUrlTemplate || "";

        return new ImageTile("key", {
            index: new Point(options.index.x, options.index.y),
            currentIndex: new Point(options.currentIndex.x, options.currentIndex.y),
            offset: new Point(options.offset.x, options.offset.y),
            point: new Point(options.point.x, options.point.y),
            zoom: options.zoom,
            opacity: options.opacity,
            subdomain: options.subdomain,
            urlTemplate: options.urlTemplate,
            errorUrlTemplate: options.errorUrlTemplate,
            quadkey: "quadkey",
            culture: "culture"
        });
    }

    (function() {
        var tile;

        // ------------------------------------------------------------
        module("Tile layer / ImageTile");

        test("should render url", function() {
            tile = createImageTile({
                urlTemplate: "javascript:void(0)"
            });

            equal(tile.element.attr("src"), tile.url());
        });

        test("urlOptions", function() {
            tile = createImageTile();
            deepEqual(tile.urlOptions(), {
                x: 0,
                y: 0,
                s: "a",
                subdomain: "a",
                z: 1,
                zoom: 1,
                quadkey: "quadkey",
                q: "quadkey",
                culture: "culture",
                c: "culture"
            });
        });

        test("urlTemplate", function() {
            tile = createImageTile({
                urlTemplate: "javascript:void('#= s # #= z # #= x # #= y #')"
            });

            equal(tile.url(), "javascript:void('a 1 0 0')");
        });

        test("errorUrlTemplate", function() {
            tile = createImageTile({
                errorUrlTemplate: "javascript:void('#= s # #= z # #= x # #= y #')"
            });

            equal(tile.errorUrl(), "javascript:void('a 1 0 0')");
        });

        test("should have id", function() {
            tile = createImageTile();

            ok(tile.id);
        });

        test("initial visible should be true", function() {
            tile = createImageTile();

            ok(tile.visible);
        });

        test("destroy should remove the element", function() {
            tile = createImageTile();
            tile.destroy();

            ok(!tile.element);
        });

        // ------------------------------------------------------------
        module("Tile layer / ImageTile/ Update", {
            setup: function() {
                tile = createImageTile();
            }
        });

        test("should render url", function() {
            tile = createImageTile({
                index: {
                    x: 1,
                    y: 1
                },
                currentIndex: {
                    x: 1,
                    y: 1
                },
                offset: {
                    x: 20,
                    y: 10
                },
                urlTemplate: "foo"
            });

            equal(tile.element.attr("src"), tile.url());
        });

        test("should render offset", function() {
            tile = createImageTile({
                index: {
                    x: 1,
                    y: 1
                },
                currentIndex: {
                    x: 1,
                    y: 1
                },
                offset: {
                    x: 20,
                    y: 10
                }
            });

            equal(parseInt(tile.element.css("top")), 10);
            equal(parseInt(tile.element.css("left")), 20);
        });

        test("should set visible to true", function() {
            tile.show({
                index: {
                    x: 1,
                    y: 1
                },
                currentIndex: {
                    x: 1,
                    y: 1
                },
                offset: {
                    x: 1,
                    y: 1
                }
            });

            ok(tile.visible);
        });

    })();

    baseLayerTests("Tile Layer", TileLayer);
})();
