(function() {
    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,

        g = kendo.geometry,
        Point = g.Point,
        Matrix = g.Matrix,

        d = kendo.drawing,
        Circle = d.Circle,
        Group = d.Group,
        MultiPath = d.MultiPath,
        Path = d.Path,

        vml = d.vml,
        Node = vml.Node,
        ArcNode = vml.ArcNode,
        CircleNode = vml.CircleNode,
        CircleTransformNode = vml.CircleTransformNode,
        FillNode = vml.FillNode,
        GroupNode = vml.GroupNode,
        PathNode = vml.PathNode,
        MultiPathNode = vml.MultiPathNode,
        Surface = vml.Surface,
        StrokeNode = vml.StrokeNode,
        TransformNode = vml.TransformNode;

    // ------------------------------------------------------------
    function expect(value) {
        return function(actual) {
            equal(actual, value);
        };
    }

    // ------------------------------------------------------------
    (function() {
        var container,
            surface;

        baseSurfaceTests("VML", Surface);
        baseSurfaceEventTests("VML", Surface);

        module("Surface", {
            setup: function() {
                container = $("<div>").appendTo(QUnit.fixture[0]);
                surface = new Surface(container);
            },
            teardown: function() {
                surface.destroy();
                container.remove();
            }
        });

        test("reports actual surface type", function() {
            surface.destroy();
            surface = new Surface(container, { type: "foo" });
            equal(surface.type, "vml");
        });

        test("appends element to container", function() {
            equal(container.find("div").length, 1);
        });

        test("draw passes null to root load method", function() {
            var group = new Group();

            surface._root.load = function(elements, pos, matrix) {
                ok(matrix === null);
            };

            surface.draw(group);
        });
    })();

    function baseClipTests(name, TNode, TElement) {
        var node;
        var srcElement;
        var clip;
        var bbox;

        function compareClipStyle(node, expected) {
            if (kendo.support.browser.mozilla) {
                expected = expected.replace(/\s/g, ", ");
            }
            equal(node.element.style.clip, expected);
        }

        var TestNode = TNode.extend({
            clipBBox: function() {
                return bbox;
            }
        });

        module("Clip tests / " + name, {
            setup: function() {
                srcElement = new TElement();
                bbox = new g.Rect([10, 20], [100, 100]);
                clip = d.Path.fromRect(bbox);
                srcElement.clip(clip);
                node = new TestNode(srcElement);
            }
        });

        test("sets clip style", function() {
            compareClipStyle(node, "rect(20px 110px 120px 10px)");
        });

        test("sets clip observer", function() {
            equal(clip.observers().length, 2);
        });

        test("changing element clip option updates clip style", function() {
            bbox = new g.Rect([20, 30], [100, 100]);

            srcElement.clip(new Path());
            compareClipStyle(node, "rect(30px 120px 130px 20px)");
        });

        test("clearing element clip option updates clip style", function() {
            srcElement.clip(null);

            compareClipStyle(node, "inherit");
        });

        test("changing element clip path updates clip style", function() {
            bbox = new g.Rect([20, 30], [100, 100]);

            clip.moveTo(10, 10);
            compareClipStyle(node, "rect(30px 120px 130px 20px)");
        });

        test("sets clip style", function() {
            ok(node.element.style.clip);
        });

        test("clear removes clip observer", function() {
            node.clear();
            equal(clip.observers().length, 1);
        });
    }

    function baseNodeTests(name, TNode, TElement) {
        var node;
        var srcElement;

        module("Base VML Node tests / " + name, {
            setup: function() {
                srcElement = new TElement();
                node = new TNode(srcElement);
            }
        });

        test("sets element", function() {
            ok(node.element);
        });

        test("sets _kendoNode expando", function() {
            equal(node.element._kendoNode, node);
        });

        test("attachTo attaches DOM element", function() {
            var parent = document.createElement("div");
            node.attachTo(parent);

            equal(node.element.parentNode, parent);
        });

        test("removeSelf destroys element", function() {
            var element = document.createElement("div");
            node.attachTo(element);
            node.removeSelf();

            equal(element.parentNode, null);
            equal(node.element, null);
        });

        test("clear cleans up child DOM nodes", function() {
            node.load([new Group()]);
            node.clear();

            equal(node.element.children.length, 0);
        });

        test("clear destroys children", function() {
            var child = new TNode();
            child.destroy = function() { ok(true); };

            node.append(child);
            node.clear();
        });

        test("renders visibility", function() {
            srcElement.visible(false);
            node = new TNode(srcElement);
            equal(node.element.style.display, "none");
        });

        test("does not render visibility if not set", function() {
            equal(node.element.style.display, "");
        });

        test("options change for visible updates display css style", function() {
            node.css = function(style, value) {
                equal(style, "display");
                equal(value, "none");
            };
            srcElement.visible(false);
        });
    }

    function nodeLoadTests(name, TNode, createElement) {
        var node;
        var element;

        module("Node / Load / " + name, {
            setup: function() {
                node = new Node();
                element = createElement();
            }
        });

        test("appends node", function() {
            node.append = function(child) {
                ok(child instanceof TNode);
            };

            node.load([element]);
        });

        test("inserts node at position", function() {
            node.insertAt = function(child, pos) {
                equal(pos, 1);
            };

            node.load([element], 1);
        });

        test("load appends PathNode with srcElement transformation", function() {
            var matrix = new Matrix(2,2,2,2,2,2),
                element = createElement({ transform: matrix });

            node.append = function(child) {
                compareMatrices(child.transform.transform.matrix(), matrix);
            };

            node.load([element]);
        });

        test("load appends node with current transformation", function() {
            var transform = g.transform();
            node.append = function(child) {
                ok(child.transform.transform.matrix().equals(transform.matrix()));
            };

            node.load([element], undefined, transform);
        });

        test("load appends node with combined transformation", function() {
            var matrix = new Matrix(3,3,3,3,3,3),
                currentMatrix = new Matrix(2,2,2,2,2,2),
                combinedMatrix = currentMatrix.multiplyCopy(matrix),
                element = createElement({ transform: matrix });

            node.append = function(child) {
                compareMatrices(child.transform.transform.matrix(), combinedMatrix);
            };

            node.load([element], undefined, currentMatrix);
        });
    }

    // ------------------------------------------------------------
    (function() {
        var node;

        module("RootNode", {
            setup: function() {
                node = new vml.RootNode();
            }
        });

        test("sets size", function() {
            equal(node.element.style.width, "100%");
            equal(node.element.style.height, "100%");
        });

        test("sets position", function() {
            equal(node.element.style.position, "relative");
        });

        test("doesn't attach _kendoNode expando", function() {
            ok(!node.element._kendoNode);
        });

        test("clear cleans up content", function() {
            node.load([new Group()]);
            node.clear();

            equal(node.element.innerHTML, "");
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var node;

        module("Node / Group load", {
            setup: function() {
                node = new Node();
            }
        });

        test("load appends GroupNode", function() {
            node.append = function(child) {
                ok(child instanceof GroupNode);
            };

            node.load([new Group()]);
        });

        // ------------------------------------------------------------
        var groupLoad = GroupNode.fn.load;

        module("Node / Group load / Transformations", {
            setup: function() {
                node = new Node();
            },
            teardown: function() {
                GroupNode.fn.load = groupLoad;
            }
        });

        test("load passes element transformation", function() {
            var matrix = new Matrix(2,2,2,2,2,2),
                group = new Group({transform: g.transform(matrix)});

            group.append(new Group());
            GroupNode.fn.load = function(children, pos, transform) {
                compareMatrices(transform.matrix(), matrix);
            };
            node.load([group]);
        });

        test("load passes current transformation", function() {
            var matrix = new Matrix(2,2,2,2,2,2),
                group = new Group();

            group.append(new Group());
            GroupNode.fn.load = function(children, pos, transform) {
                compareMatrices(transform.matrix(), matrix);
            };
            node.load([group], undefined, g.transform(matrix));
        });

        test("load passes combined transformation", function() {
            var matrix = new Matrix(3,3,3,3,3,3),
                currentMatrix = new Matrix(2,2,2,2,2,2),
                combinedMatrix = currentMatrix.multiplyCopy(matrix),
                group = new Group({transform: g.transform(matrix)});

            group.append(new Group());
            GroupNode.fn.load = function(children, pos, transform) {
                compareMatrices(transform.matrix(), combinedMatrix);
            };
            node.load([group], undefined, g.transform(currentMatrix));
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var group;
        var groupNode;

        baseClipTests("Group", vml.GroupNode, d.Group);
        baseNodeTests("Group", vml.GroupNode, d.Group);

        module("GroupNode", {
            setup: function() {
                group = new d.Group();
                groupNode = new GroupNode(group);
            }
        });

        test("renders div tag", function() {
            equal(groupNode.element.tagName.toLowerCase(), "div");
        });

        test("renders position", function() {
            equal(groupNode.element.style.position, "absolute");
        });

        test("renders nowrap", function() {
            equal(groupNode.element.style["white-space"], "nowrap");
        });

        test("changing clip sets dimensions", function() {
            groupNode.css = function(name, value) {
                if (name === "width") {
                    equal(value, 120);
                } else if (name === "height") {
                    equal(value, 130);
                }
            };

            var clipRect = new g.Rect([20, 30], [100, 100]);
            group.clip(d.Path.fromRect(clipRect));
        });

        test("load appends child nodes", function() {
            var parentGroup = new Group();
            var childGroup = new Group();
            parentGroup.append(childGroup);

            groupNode.load([parentGroup]);

            ok(groupNode.childNodes[0].childNodes[0] instanceof GroupNode);
        });

        test("load attaches child nodes", function() {
            groupNode.attachTo(document.createElement("div"));
            groupNode.load([new Group()]);

            equal(groupNode.childNodes[0].element.parentNode, groupNode.element);
        });

        test("load attaches child node at position", function() {
            groupNode.attachTo(document.createElement("div"));

            var group1 = new Group();
            groupNode.load([group1]);

            var group2 = new Group();
            groupNode.load([group2], 0);

            equal(groupNode.element.childNodes[0], group2._observers[0].element);
        });

        test("refreshTransform method calls childNodes refreshTransform method", function() {
            var group = new Group(),
                path = new Path(),
                childGroupNode;
            group.append(path);
            groupNode.load([group]);
            childGroupNode = groupNode.childNodes[0];
            childGroupNode.childNodes[0].refreshTransform = function() {
                ok(true);
            };

            childGroupNode.refreshTransform(new Matrix());
        });

        test("refreshTransform method calls childNodes refreshTransform method with current transformation", function() {
            var matrix = new Matrix(2,2,2,2,2,2),
                parentMatrix = new Matrix(3,3,3,3,3,3),
                currentMatrix = parentMatrix.multiplyCopy(matrix),
                group = new Group({transform: g.transform(matrix)}),
                path = new Path(),
                childGroupNode,
                parentGroup = new Group({transform: g.transform(parentMatrix)});
            parentGroup.append(group);
            group.append(path);
            groupNode = new GroupNode(parentGroup);
            groupNode.load([group]);
            childGroupNode = groupNode.childNodes[0];
            childGroupNode.childNodes[0].refreshTransform = function(transformation) {
                compareMatrices(transformation.matrix(), currentMatrix);
            };

            childGroupNode.refreshTransform();
        });

        test("options change for transform calls childNodes refreshTransform method", function() {
            var group = new Group(),
                path = new Path(),
                childGroupNode;
            group.append(path);
            groupNode.load([group]);
            childGroupNode = groupNode.childNodes[0];
            childGroupNode.childNodes[0].refreshTransform = function() {
                ok(true);
            };

            group.transform(g.transform(new Matrix()));
        });

        test("options change for transform calls childNodes refreshTransform method with the current transformation as argument", function() {
            var group = new Group(),
                path = new Path(),
                childGroupNode,
                matrix = new Matrix(1,1,1,1,1,1);
            group.append(path);
            groupNode.load([group]);
            childGroupNode = groupNode.childNodes[0];
            childGroupNode.childNodes[0].refreshTransform = function(transform) {
                compareMatrices(transform.matrix(), matrix);
            };

            group.transform(g.transform(matrix));
        });

        test("options change for other field different than transform does not call childNodes refreshTransform method", 0, function() {
            var group = new Group(),
                path = new Path(),
                childGroupNode;
            group.append(path);
            groupNode.load([group]);
            childGroupNode = groupNode.childNodes[0];
            childGroupNode.childNodes[0].refreshTransform = function() {
                ok(false);
            };

            group.options.set("foo", 1);
        });

        test("options change for visible updates display css style", function() {
            var group = new Group();
            groupNode = new GroupNode(group);
            groupNode.css = function(style, value) {
                equal(style, "display");
                equal(value, "none");
            };
            group.visible(false);
        });

        // ------------------------------------------------------------
        module("GroupNode / clip", {
            setup: function() {
                group = new Group();
                groupNode = new GroupNode(group);
            }
        });

        test("clipBBox returns clip path bbox with src element current transformation", function() {
            var clip = d.Path.fromRect(new g.Rect([10, 10], [100, 100]));
            var parentGroup = new Group({
                transform: g.transform().translate(100, 100)
            });
            parentGroup.append(group);

            group.transform(g.transform().translate(100, 100));
            compareBoundingBox(groupNode.clipBBox(clip), [210, 210, 310, 310]);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var group;
        var groupNode;

        module("GroupNode / Opacity", {
            setup: function() {
                group = new Group();
                groupNode = new GroupNode(group);
            }
        });

        test("load sets group opacity on child groups", function() {
            var childGroup = new d.Group({ opacity: 0.5 });
            childGroup.append(new d.Path());

            group.opacity(0.5);
            groupNode.load([childGroup]);

            equal(groupNode.childNodes[0].childNodes[0].fill.opacity, 0.25);
        });

        test("load sets group opacity on children", function() {
            group.opacity(0.5);
            groupNode.load([new d.Path()]);

            equal(groupNode.childNodes[0].fill.opacity, 0.5);
        });

        test("load multiplies group opacity with child opacity", function() {
            group.opacity(0.5);
            groupNode.load([new d.Path({ opacity: 0.5 })]);

            equal(groupNode.childNodes[0].fill.opacity, 0.25);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var rootGroup;
        var rootGroupNode;

        var childGroup;
        var childGroupNode;

        var childNode;

        module("GroupNode / Opacity / Refresh", {
            setup: function() {
                rootGroup = new d.Group();
                rootGroupNode = new GroupNode(rootGroup);

                childGroup = new d.Group();
                childGroupNode = new GroupNode(childGroup);
                rootGroupNode.append(childGroupNode);

                childNode = new vml.Node();
                childGroupNode.append(childNode);
            }
        });

        test("sets child opacity", function() {
            childNode.refreshOpacity = expect(0.5);

            rootGroup.opacity(0.5);
        });

        test("multiplies with child group opacity", function() {
            childNode.refreshOpacity = $.noop;
            childGroup.opacity(0.5);
            childNode.refreshOpacity = expect(0.25);

            rootGroup.opacity(0.5);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var path,
            strokeNode;

        function createNode(pathOptions) {
            path = new Path(deepExtend({
                stroke: {
                    width: 1,
                    color: "black"
                }
            }, pathOptions));
            strokeNode = new StrokeNode(path);
        }

        function updateOption(field, value) {
            path.options.set(field, value);
            strokeNode.optionsChange({
                field: field,
                value: value
            });
        }

        module("StrokeNode", {
            setup: function() {
                createNode();
            }
        });

        test("renders stroke element", function() {
            equal(strokeNode.element.tagName.toLowerCase(), "kvml:stroke");
        });

        test("renders on attribute", function() {
            createNode({ stroke: { color: "red" } });
            equal(strokeNode.element.on, "true");
        });

        test("renders on attribute when no stroke is set", function() {
            createNode({ stroke: null });
            equal(strokeNode.element.on, "false");
        });

        test("renders on attribute when stroke width is 0", function() {
            createNode({ stroke: { color: "red", width: 0 } });
            equal(strokeNode.element.on, "false");
        });

        test("renders on attribute when stroke color is 'transparent'", function() {
            createNode({ stroke: { color: "transparent", width: 0 } });
            equal(strokeNode.element.on, "false");
        });

        test("renders on attribute when stroke color is 'none'", function() {
            createNode({ stroke: { color: "transparent", width: 0 } });
            equal(strokeNode.element.on, "false");
        });

        test("renders on attribute when stroke color is ''", function() {
            createNode({ stroke: { color: "", width: 0 } });
            equal(strokeNode.element.on, "false");
        });

        test("renders color", function() {
            createNode({ stroke: { color: "red" } });
            equal(strokeNode.element.color, "red");
        });

        test("renders default stroke width", function() {
            createNode({ stroke: { color: "red" } });
            equal(strokeNode.element.weight, "1px");
        });

        test("renders stroke width", function() {
            createNode({ stroke: { width: 2 } });
            equal(strokeNode.element.weight, "2px");
        });

        test("renders stroke opacity", function() {
            createNode({ stroke: { opacity: 0.5 } });
            equal(strokeNode.element.opacity, "0.5");
        });

        test("renders default stroke opacity if not set", function() {
            equal(strokeNode.element.opacity, 1);
        });

        test("renders stroke dashType", function() {
            createNode({ stroke: { dashType: "dot" } });
            equal(strokeNode.element.dashstyle, "dot");
        });

        test("does not render stroke dashType if not set", function() {
            ok(!strokeNode.element.dashstyle);
        });

        test("renders stroke lineJoin", function() {
            createNode({ stroke: { lineJoin: "round" } });
            equal(strokeNode.element.joinstyle, "round");
        });

        test("does not render stroke lineJoin if not set", function() {
            ok(!strokeNode.element.joinstyle);
        });

        test("renders stroke lineCap", function() {
            createNode({ stroke: { lineCap: "round" } });
            equal(strokeNode.element.endcap, "round");
        });

        test("renders stroke lineCap (butt)", function() {
            createNode({ stroke: { lineCap: "butt" } });
            equal(strokeNode.element.endcap, "flat");
        });

        test("does not render stroke lineCap if not set", function() {
            ok(!strokeNode.element.endcap);
        });

        test("optionsChange sets stroke color", function() {
            strokeNode.attr = function(name, value) {
                if (name === "color") {
                    equal(value, "red");
                }
            };

            updateOption("stroke.color", "red");
        });

        test("optionsChange sets stroke width", function() {
            strokeNode.attr = function(name, value) {
                if (name === "weight") {
                    equal(value, "4px");
                }
            };

            updateOption("stroke.width", 4);
        });

        test("optionsChange sets stroke opacity", function() {
            strokeNode.attr = function(name, value) {
                if (name === "opacity") {
                    equal(value, 0.4);
                }
            };

            updateOption("stroke.opacity", 0.4);
        });

        test("optionsChange sets stroke dashType", function() {
            strokeNode.attr = function(name, value) {
                if (name === "dashstyle") {
                    equal(value, "dot");
                }
            };

            updateOption("stroke.dashType", "dot");
        });

        test("optionsChange sets stroke", 3, function() {
            strokeNode.attr = function(name, value) {
                if (name === "color") {
                    equal(value, "red");
                } else if (name === "opacity") {
                    equal(value, 0.4);
                } else if (name === "weight") {
                    equal(value, "4px");
                }
            };

            updateOption("stroke", { color: "red", opacity: 0.4, width: 4 });
        });

        test("optionsChange clears stroke", 1, function() {
            strokeNode.attr = function(name, value) {
                if (name === "on") {
                    equal(value, "false");
                }
            };

            updateOption("stroke", null);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var LinearGradient = d.LinearGradient,
            RadialGradient = d.RadialGradient,
            path, fillNode;

        function createNode(pathOptions) {
            path = new Path(pathOptions);
            fillNode = new FillNode(path);
        }

        function updateOption(field, value) {
            path.options.set(field, value);
            fillNode.optionsChange({
                field: field,
                value: value
            });
        }

        module("FillNode", {
            setup: function() {
                createNode();
            }
        });

        test("renders fill element", function() {
            equal(fillNode.element.tagName.toLowerCase(), "kvml:fill");
        });

        test("renders on attribute if no fill set", function() {
            createNode({ fill: { color: "red" } });
            equal(fillNode.element.on, "true");
        });

        test("renders on attribute if set to 'none'", function() {
            path.options.set("fill.color", "none");
            equal(fillNode.element.on, "false");
        });

        test("renders on attribute if set to 'transparent'", function() {
            path.options.set("fill.color", "transparent");
            equal(fillNode.element.on, "false");
        });

        test("renders on attribute if set to ''", function() {
            path.options.set("fill.color", "");
            equal(fillNode.element.on, "false");
        });

        test("renders color", function() {
            createNode({ fill: { color: "red" } });
            equal(fillNode.element.color, "red");
        });

        test("renders opacity", function() {
            createNode({ fill: { color: "white", opacity: 0.5 } });
            equal(fillNode.element.opacity, "0.5");
        });

        test("renders default opacity if not set", function() {
            createNode({ fill: { color: "white" } });
            equal(fillNode.element.opacity, 1);
        });

        test("renders linear gradient", function() {
            var linearGradient = new LinearGradient({
                stops: [[0.3, "blue", 0.5], [1, "blue", 1]],
                start: [0.1, 0.2],
                end: [0.5, 0.6]
            });
            createNode({fill: linearGradient});
            var element = fillNode.element;
            equal(element.angle, 225);
            equal(element.color, "#8080ff");
            equal(element.color2, "#0000ff");
            equal(element.colors, "30% #8080ff,100% #0000ff");
            equal(element.focus, 0);
            equal(element.method, "none");
            equal(element.on, "true");
            equal(element.type, "gradient");
        });

        test("renders linear gradient with base color", function() {
            var linearGradient = new LinearGradient({
                stops: [[0.3, "#fff", 0.5], [1, "#fff", 1]]
            });

            createNode({
                fill: linearGradient,
                baseColor: "red"
            });
            var element = fillNode.element;

            equal(element.color, "#ff8080");
            equal(element.color2, "#ffffff");
            equal(element.colors, "30% #ff8080,100% #ffffff");
        });

        test("renders on for RadialGradient", function() {
            createNode({ fill: new RadialGradient() });
            equal(fillNode.element.on, "false");
        });

        test("renders gradient fallbackFill for RadialGradient if set", function() {
            createNode({
                fill: new RadialGradient({
                    fallbackFill: {
                        color: "red",
                        opacity: 0.1
                    }
                })
            });
            equal(fillNode.element.color, "red");
            equal(fillNode.element.opacity, 0.1);
        });

        test("renders element fallbackFill if set for RadialGradient", function() {
            createNode({
                fill: new RadialGradient(),
                fallbackFill: {
                    color: "red",
                    opacity: 0.1
                }
            });
            equal(fillNode.element.color, "red");
            equal(fillNode.element.opacity, 0.1);
        });

        test("renders element fallbackFill if both RadialGradient fallbackFill and element fallbackFill are set", function() {
            createNode({
                fill: new RadialGradient({
                    fallbackFill: {
                        color: "green",
                        opacity: 0.5
                    }
                }),
                fallbackFill: {
                    color: "red",
                    opacity: 0.1
                }
            });
            equal(fillNode.element.color, "red");
            equal(fillNode.element.opacity, 0.1);
        });

        test("renders RadialGradient if it has supportVML set to true", function() {
            var radialGradient = new RadialGradient({
                stops: [{
                    color: "red",
                    offset: 0.3
                }, {
                    color: "green",
                    offset: 0.7
                }],
                center: [100, 200]
            });
            radialGradient.supportVML = true;
            path = new Path({
                fill: radialGradient
            });
            path.segments.elements(Path.fromRect(new g.Rect([50, 60], [50, 100])).segments.elements());
            fillNode = new FillNode(path);
            var element = fillNode.element;
            equal(element.color, "#ff0000");
            equal(element.color2, "#008000");
            equal(element.colors, "30% #ff0000,70% #008000");
            equal(element.focus, "100%");
            equal(element.method, "none");
            equal(element.on, "true");
            equal(element.type, "gradienttitle");
            equal(element.focusposition, "1 1.4");
        });

        test("sets colors to colors.value if colors is already set", function() {
            var linearGradient = new LinearGradient({
                stops: [[0.3, "blue", 0.5], [1, "blue", 1]],
                start: [0.1, 0.2],
                end: [0.5, 0.6]
            });
            createNode({fill: linearGradient});
            var element = fillNode.element;
            element.colors = {};
            updateOption("fill", linearGradient);

            equal(element.colors.value, "30% #8080ff,100% #0000ff");
        });

        test("optionsChange sets fill color", function() {
            fillNode.attr = function(name, value) {
                if (name === "color") {
                    equal(value, "red");
                }
            };

            updateOption("fill.color", "red");
        });

        test("optionsChange sets fill opacity", function() {
            createNode({ fill: { color: "white" } });
            fillNode.attr = function(name, value) {
                if(name === "opacity") {
                    equal(value, 0.4);
                }
            };

            updateOption("fill.opacity", 0.4);
        });

        test("optionsChange clears fill for 'none'", function() {
            fillNode.attr = function(name, value) {
                if (name === "on") {
                    equal(value, "false");
                }
            };

            updateOption("fill.color", "none");
        });

        test("optionsChange clears fill for 'transparent'", function() {
            fillNode.attr = function(name, value) {
                if (name === "on") {
                    equal(value, "false");
                }
            };

            updateOption("fill.color", "transparent");
        });

        test("optionsChange clears fill for ''", function() {
            fillNode.attr = function(name, value) {
                if(name === "on") {
                    equal(value, "false");
                }
            };

            updateOption("fill.color", "");
        });

        test("optionsChange sets fill", 3, function() {
            fillNode.attr = function(name, value) {
                if (name === "color") {
                    equal(value, "red");
                } else if (name === "opacity") {
                    equal(value, 0.4);
                } else if (name === "on") {
                    equal(value, "true");
                } else {
                    ok(false);
                }
            };

            updateOption("fill", { color: "red", opacity: 0.4 });
        });

        test("optionsChange clears fill", 2, function() {
            fillNode.attr = function(name, value) {
                equal(name, "on");
                equal(value, "false");
            };

            path.fill("red");
            updateOption("fill", null);
        });

        test("refreshOpacity sets opacity", function() {
            fillNode.attr = function(name, value) {
                if (name === "opacity") {
                    equal(value, 0.5);
                }
            };

            path.fill("red");
            fillNode.refreshOpacity(0.5);
        });

        test("refreshOpacity multiplies with fill opacity", function() {
            fillNode.attr = function(name, value) {
                if (name === "opacity") {
                    equal(value, 0.25);
                }
            };

            path.fill("red", 0.5);
            fillNode.refreshOpacity(0.5);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var transformNode;

        function createNode(matrix) {
            transformNode = new vml.TransformNode(new d.Element(), matrix);
        }

        function updateTransform(expectedValues, element, transformation) {
            transformNode.attr = function(key, value) {
                equal(expectedValues[key], value);
            };
            element.transform(transformation);
            transformNode.optionsChange({
                field: "transform",
                value: transformation
            });
        }

        module("TransformNode", {
            setup: function() {
                createNode(new g.Matrix(1, 2, 3, 4, 5, 6));
            }
        });

        test("renders skew element", function() {
            equal(transformNode.element.tagName.toLowerCase(), "kvml:skew");
        });

        test("sets on to true when matrix is available", function() {
            equal(transformNode.element.on, "true");
        });

        test("sets on to false when matrix is not available", function() {
            createNode();
            equal(transformNode.element.on, "false");
        });

        test("renders matrix attribute", function() {
            equal(transformNode.element.matrix, "1,3,2,4,0,0");
        });

        test("rounds matrix values to the 4th digit", function() {
            createNode(new Matrix(0.55555, 0, 0, 1, 0, 0));
            var matrix = transformNode.element.matrix;
            equal(matrix.substring(0, matrix.indexOf(",")), "0.5556");
        });

        test("does not render matrix attribute if there is no matrix", function() {
            createNode();
            ok(!transformNode.element.matrix);
        });

        test("renders offset attribute", function() {
            equal(transformNode.element.offset, "5px,6px");
        });

        test("does not render offset attribute if there is no matrix", function() {
            createNode();
            ok(!transformNode.element.offset);
        });

        test("renders origin attribute", function() {
            equal(transformNode.element.origin, "-0.5,-0.5");
        });

        test("does not render origin attribute if there is no matrix", function() {
            createNode();
            ok(!transformNode.element.offset);
        });

        test("options change updates attributes", 4, function() {
            var element = new d.Element(),
                expectedValues = {
                    on: "true",
                    matrix: "1,3,2,4,0,0",
                    offset: "5px,6px",
                    origin: "-0.5,-0.5"
                },
                transformation = g.transform(new Matrix(1,2,3,4,5,6));

            transformNode = new TransformNode(element);
            updateTransform(expectedValues, element, transformation);
        });

        test("options change takes parents matrix into account", 4, function() {
            var element = new d.Element(),
                group = new d.Group({transform: new Matrix(1,0,0,1,10,10)}),
                expectedValues = {
                    on: "true",
                    matrix: "1,3,2,4,0,0",
                    offset: "15px,16px",
                    origin: "-0.5,-0.5"
                },
                transformation = g.transform(new Matrix(1,2,3,4,5,6));
            group.append(element);
            transformNode = new TransformNode(element);
            updateTransform(expectedValues, element, transformation);
        });

        test("clearing transform updates attributes", function() {
            var element = new d.Element(),
                expectedValues = {
                    on: "false"
                };
            transformNode = new TransformNode(element);
            updateTransform(expectedValues, element, null);
        });

        test("refresh method updates attributes", function() {
            var element = new d.Element(),
                expectedValues = {
                    on: "true",
                    matrix: "1,3,2,4,0,0",
                    offset: "5px,6px",
                    origin: "-0.5,-0.5"
                };

            transformNode = new TransformNode(element);
            transformNode.attr = function(key, value) {
                equal(expectedValues[key], value);
            };
            transformNode.refresh(new Matrix(1,2,3,4,5,6));
        });
    })();

    // ------------------------------------------------------------
    function shapeTests(name, createNode) {
        var shape,
            node;

        module("Shape tests / " + name, {
            setup: function() {
                node = createNode();
                shape = node.srcElement;
            }
        });

        test("renders visibility", function() {
            node = createNode({ visible: false });
            equal(node.element.style.display, "none");
        });

        test("does not render visibility if not set", function() {
            ok(!node.element.style.display);
        });

        test("does not render visibility if set to true", function() {
            node = createNode({ visible: true });
            ok(!node.element.style.display);
        });

        test("renders cursor", function() {
            node = createNode({ cursor: "none" });
            equal(node.element.style.cursor, "none");
        });

        test("does not render cursor if not set", function() {
            ok(!node.element.style.cursor);
        });

        test("optionsChange sets visibility to hidden", function() {
            node.css = function(name, value) {
                if (name === "display") {
                    equal(value, "none");
                }
            };

            shape.visible(false);
        });

        test("optionsChange sets visibility to visible", function() {
            node.css = function(name, value) {
                if (name === "display") {
                    equal(value, "");
                }
            };

            shape.visible(true);
        });

        test("optionsChange is forwarded to stroke", function() {
            node.stroke.optionsChange = function() {
                ok(true);
            };

            shape.options.set("stroke", { width: 1 });
        });

        test("optionsChange for opacity is forwarded to stroke", function() {
            node.stroke.setOpacity = function() {
                ok(true);
            };

            shape.options.set("opacity", 1);
        });

        test("optionsChange is not forwarded to stroke", 0, function() {
            node.stroke.optionsChange = function() {
                ok(true);
            };

            shape.options.set("foo", true);
        });

        test("optionsChange is forwarded to fill", function() {
            node.fill.optionsChange = function() {
                ok(true);
            };

            shape.options.set("fill", { color: "red" });
        });

        test("optionsChange for opacity is forwarded to fill", function() {
            node.fill.setOpacity = function() {
                ok(true);
            };

            shape.options.set("opacity", 1);
        });

        test("optionsChange is not forwarded to fill", 0, function() {
            node.fill.optionsChange = function() {
                ok(true);
            };

            shape.options.set("foo", true);
        });

        test("optionsChange is forwarded to transform", function() {
            node.transform.optionsChange = function(e) {
                ok(true);
            };

            shape.transform(Matrix.unit());
        });

        test("optionsChange is not forwarded to transform", 0, function() {
            node.transform.optionsChange = function() {
                ok(true);
            };

            shape.options.set("foo", true);
        });

        test("refreshTransform calls transform refresh method with the srcElement transformation", 12, function() {
            var srcMatrix = new Matrix(3,3,3,3,3,3);
            var parentMatrix = new Matrix(2,2,2,2,2,2);
            var currentMatrix = parentMatrix.multiplyCopy(srcMatrix);
            var group = new Group({transform: parentMatrix});

            shape.transform(srcMatrix);
            group.append(shape);

            node.transform.refresh = function(transform) {
                compareMatrices(transform.matrix(), currentMatrix);
            };

            node.refreshTransform();
            node.refreshTransform(g.transform(parentMatrix));
        });

        // ------------------------------------------------------------
        module("Shape tests / " + name + " / source observer", {
            setup: function() {
                node = createNode();
                shape = node.srcElement;
            }
        });

        test("Adds srcElement observer", function() {
            equal(shape.observers()[0], node);
        });

        test("destroy removes srcElement observer", function() {
            node.destroy();
            equal(shape.observers().length, 0);
        });

        test("destroy removes element reference", function() {
            node.attachTo($("<div>")[0]);
            var element = node.element;
            node.destroy();
            equal(element._kendoNode, null);
        });

        // ------------------------------------------------------------
        module("Shape tests / " + name + " / clip", {
            setup: function() {
                node = createNode();
                shape = node.srcElement;
            }
        });

        test("clipBBox returns clip path bbox translated with minus the top left coordinates of the shape raw bbox", function() {
            var clip = d.Path.fromRect(new g.Rect([10, 10], [100, 100]));
            var topLeft = shape.rawBBox().topLeft();

            compareBoundingBox(node.clipBBox(clip), [10 - topLeft.x, 10 - topLeft.y, 110 - topLeft.x, 110 - topLeft.y]);
        });
    }

    // ------------------------------------------------------------
    (function() {
        var path,
            node;

        function createNode(path) {
            node = new vml.PathDataNode(path);
        }

        module("PathDataNode", {
            setup: function() {
                path = new Path();
            }
        });

        test("renders straight segments", function() {
            createNode(path.moveTo(0, 0).lineTo(10, 20).lineTo(20, 30));
            equal(node.element.v, "m 0,0 l 1000,2000 2000,3000 e");
        });

        test("renders curve", function() {
            createNode(path.moveTo(0, 0).curveTo([10, 10], [20, 10], [30, 0]));
            equal(node.element.v, "m 0,0 c 1000,1000 2000,1000 3000,0 e");
        });

        test("switches between line and curve", function() {
            createNode(path.moveTo(0, 0).lineTo(5, 5).curveTo([10, 10], [20, 10], [30, 0]));
            equal(node.element.v, "m 0,0 l 500,500 c 1000,1000 2000,1000 3000,0 e");
        });

        test("switches between curve and line", function() {
            createNode(path.moveTo(0, 0).curveTo([10, 10], [20, 10], [30, 0]).lineTo(40, 10));
            equal(node.element.v, "m 0,0 c 1000,1000 2000,1000 3000,0 l 4000,1000 e");
        });

        test("renders closed paths", function() {
            createNode(path.moveTo(0, 0).lineTo(10, 20).close());
            equal(node.element.v, "m 0,0 l 1000,2000 x e");
        });

        test("does not render segments for empty path", function() {
            createNode(path);
            ok(!node.element.v);
        });

        test("geometryChange sets path", function() {
            createNode(path.moveTo(0, 0));
            node.attr = function(name, value) {
                if (name === "v") {
                    equal(value, "m 0,0 l 1000,1000 e");
                }
            };

            path.lineTo(10, 10);
            node.geometryChange();
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var path,
            pathNode;

        baseClipTests("PathNode", vml.PathNode, d.Path);

        nodeLoadTests("PathNode", vml.PathNode, function (options) {
                return new d.Path(options);
            }
        );

        module("PathNode", {
            setup: function() {
                path = new Path();
                pathNode = new PathNode(path);
            }
        });

        test("initializes a TransformNode", function() {
            ok(pathNode.transform instanceof TransformNode);
        });

        test("creates data node", function() {
            ok(pathNode.pathData instanceof vml.PathDataNode);
        });

        test("renders coordsize", function() {
            ok(pathNode.element.coordsize, "10000 10000");
        });

        test("renders width", function() {
            ok(pathNode.element.style.width, "100px");
        });

        test("renders height", function() {
            ok(pathNode.element.style.height, "100px");
        });

        test("geometryChange is forwarded to pathData", function() {
            pathNode.pathData.geometryChange = function() {
                ok(true);
            };

            path.lineTo(10, 10);
        });

        test("refreshOpacity is forwarded to fill node", function() {
            pathNode.fill.refreshOpacity = expect(0.5);
            pathNode.refreshOpacity(0.5);
        });

        test("refreshOpacity is forwarded to stroke node", function() {
            pathNode.stroke.refreshOpacity = expect(0.5);
            pathNode.refreshOpacity(0.5);
        });

        test("refreshOpacity multiplies with own opacity for fill", function() {
            pathNode.fill.refreshOpacity = expect(0.25);

            path.opacity(0.5);
            pathNode.refreshOpacity(0.5);
        });

        test("refreshOpacity multiplies with own opacity for stroke", function() {
            pathNode.stroke.refreshOpacity = expect(0.25);

            path.opacity(0.5);
            pathNode.refreshOpacity(0.5);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var multiPath,
            node;

        module("MultiPathDataNode", {
            setup: function() {
                multiPath = new MultiPath().moveTo(0, 0).lineTo(10, 20);
                node = new vml.MultiPathDataNode(multiPath);
            }
        });

        test("renders composite paths initially", function() {
            equal(node.element.v, "m 0,0 l 1000,2000 e");
        });

        test("geometryChange sets composite path", function() {
            node.attr = function(name, value) {
                if (name === "v") {
                    equal(value, "m 0,0 l 1000,2000 m 1000,1000 l 1000,2000 e");
                }
            };

            multiPath.moveTo(10, 10).lineTo(10, 20);
            node.geometryChange();
        });

    })();

    // ------------------------------------------------------------
    (function() {
        var multiPath,
            multiPathNode;

        baseClipTests("MultiPathNode", vml.MultiPathNode, d.MultiPath);

        nodeLoadTests("MultiPathNode", vml.MultiPathNode, function (options) {
                return new d.MultiPath(options);
            }
        );

        module("MultiPathNode", {
            setup: function() {
                multiPath = new MultiPath();
                multiPathNode = new MultiPathNode(multiPath);
            }
        });

        test("creates data node", function() {
            ok(multiPathNode.pathData instanceof vml.MultiPathDataNode);
        });

        test("renders coordsize", function() {
            ok(multiPathNode.element.coordsize, "10000 10000");
        });

        test("renders width", function() {
            ok(multiPathNode.element.style.width, "100px");
        });

        test("renders height", function() {
            ok(multiPathNode.element.style.height, "100px");
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var circleTransformNode,
            transformCircle;

        module("CircleTransformNode", {
            setup: function() {
                transformCircle = new Circle(new g.Circle([600,400], 100));
                circleTransformNode = new CircleTransformNode(transformCircle, new Matrix(1,2,3,4,5,6));
            }
        });

        test("circle transform origin is minus bbox center over bbox size", function() {
            equal(circleTransformNode.element.origin, "-3,-2");
        });

        test("circle transform origin rounds up center coordinates", function() {
            transformCircle.geometry().center.move(599.1, 399.1);
            equal(circleTransformNode.transformOrigin(), "-3,-2");
        });

        test("circle transform origin rounds up bounding box", function() {
            transformCircle.geometry().setRadius(99.55);
            equal(circleTransformNode.transformOrigin(), "-3,-2");
        });

        test("options change updates attributes", 4, function() {
            var expectedValues = {
                    on: "true",
                    matrix: "2,4,3,5,0,0",
                    offset: "6px,7px",
                    origin: "-3,-2"
                };
            var transformation = g.transform(new Matrix(2,3,4,5,6,7));
            circleTransformNode.attr = function(key, value) {
                equal(expectedValues[key], value);
            };
            transformCircle.transform(transformation);
            circleTransformNode.optionsChange({
                field: "transform",
                value: transformation
            });
        });

        test("clearing transform updates attributes", 1, function() {
            var expectedValues = {
                    on: "false"
                };
            circleTransformNode.attr = function(key, value) {
                equal(expectedValues[key], value);
            };
            transformCircle.transform(null);
            circleTransformNode.optionsChange({
                field: "transform",
                value: null
            });
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var geometry,
            circle,
            circleNode;

        baseClipTests("CircleNode", vml.CircleNode, d.Circle);

        nodeLoadTests("CircleNode", vml.CircleNode, function (options) {
                var geometry = new g.Circle(new Point(10, 20), 30);
                return new d.Circle(geometry, options);
            }
        );

        module("CircleNode", {
            setup: function() {
                geometry = new g.Circle(new Point(10, 20), 30);
                circle = new Circle(geometry);
                circleNode = new CircleNode(circle);
            }
        });

        test("initializes a CircleTransformNode", function() {
            ok(circleNode.transform instanceof CircleTransformNode);
        });

        test("renders center", function() {
            equal(circleNode.element.style.top, "-10px");
            equal(circleNode.element.style.left, "-20px");
        });

        test("rounds center up", function() {
            geometry.center.translate(-0.4, -0.4);
            equal(circleNode.element.style.top, "-10px");
            equal(circleNode.element.style.left, "-20px");
        });

        test("renders radius", function() {
            equal(circleNode.element.style.width, "60px");
            equal(circleNode.element.style.height, "60px");
        });

        test("rounds radius up", function() {
            geometry.setRadius(29.55);
            equal(circleNode.element.style.width, "60px");
            equal(circleNode.element.style.height, "60px");
        });

        test("geometryChange sets center", 2, function() {
            circleNode.css = function(name, value) {
                if (name === "left") {
                    equal(value, "-10px");
                } else if (name === "top") {
                    equal(value, "10px");
                }
            };

            circle.geometry().center.scale(2);
        });

        test("geometryChange sets radius", 2, function() {
            circleNode.css = function(name, value) {
                if (name === "width" || name === "height") {
                    equal(value, "120px");
                }
            };

            circle.geometry().setRadius(60);
        });

        test("geometryChange should update transformation", function() {
            circleNode.transform.refresh = function() {
                ok(true);
            };

            circle.geometry().setRadius(60);
        });

        test("optionsChange is forwarded to transform", function() {
            circleNode.transform.optionsChange = function(e) {
                ok(true);
            };

            circle.transform(Matrix.unit());
        });

        test("optionsChange is not forwarded to transform", 0, function() {
            circleNode.transform.optionsChange = function() {
                ok(true);
            };

            circle.options.set("foo", true);
        });

        shapeTests("CircleNode", function(shapeOptions) {
            var geometry = new g.Circle(new Point(10, 20), 30);
            var circle = new Circle(geometry, shapeOptions);
            return new CircleNode(circle);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var arc,
            node;

        module("ArcDataNode", {
            setup: function() {
                var geometry = new g.Arc(new Point(100, 100), {
                    startAngle: 0,
                    endAngle: 120,
                    radiusX: 50,
                    radiusY: 100
                });

                arc = new d.Arc(geometry);
                node = new vml.ArcDataNode(arc);
            }
        });

        test("renders curve path", function() {
            equal(node.element.v,
                "m 15000,10000 c 15000,12327 14578,14645 13830,16428 13082,18211 12014,19444 10868,19848 9722,20252 8508,19824 7500,18660 e"
            );
        });

        test("geometryChange updates path", function() {
            node.attr = function(name, value) {
                equal(name, "v");
                equal(value, "m 15000,10000 c 15000,12618 14461,15220 13536,17071 12610,18922 11309,20000 10000,20000 8691,20000 7390,18922 6464,17071 5539,15220 5000,12618 5000,10000 e");
            };

            arc.geometry().setEndAngle(180);
            node.geometryChange();
        });

    })();
    // ------------------------------------------------------------
    (function() {
        var arc,
            arcNode;

        baseClipTests("ArcNode", vml.ArcNode, d.Arc);

        module("ArcNode", {
            setup: function() {
                arc = new d.Arc(new g.Arc());
                arcNode = new ArcNode(arc);
            }
        });

        test("creates data node", function() {
            ok(arcNode.pathData instanceof vml.ArcDataNode);
        });

        test("geometryChange is forwarded to data node", function() {
            arcNode.pathData.geometryChange = function() {
                ok(true);
            };

            arc.geometry().setEndAngle(180);
        });

        shapeTests("ArcNode", function(shapeOptions) {
            var geometry = new g.Arc(new Point(10, 20));
            var shape = new d.Arc(geometry, shapeOptions);
            return new vml.ArcNode(shape);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var text;
        var node;

        module("TextPathDataNode", {
            setup: function() {
                text = new d.Text("Foo", new g.Point(100, 100));
                text.measure = function() {
                    return { width: 40, height: 20, baseline: 15 };
                };

                node = new vml.TextPathDataNode(text);
            }
        });

        test("renders text path", function() {
            ok(node.element.v, "m 10000,11000 l 14000,11000");
        });

        test("renders text path w/o current transform", function() {
            var group = new d.Group({ transform: g.transform().translate(100, 100) });
            group.append(text);
            node = new vml.TextPathDataNode(text);

            ok(node.element.v, "m 10000,11000 l 14000,11000");
        });

        test("renders text path w/o transform", function() {
            text.transform(g.transform().translate(100, 100));
            node = new vml.TextPathDataNode(text);

            ok(node.element.v, "m 10000,11000 l 14000,11000");
        });

        test("geometryChange updates path", function() {
            node.attr = function(name, value) {
                equal(name, "v");
                equal(value, "m 0,11000 l 4000,11000");
            };

            text.position().setX(0);
            node.geometryChange();
        });

        test("rounds path coordinates", function() {
            node.attr = function(name, value) {
                equal(value, "m 10001,11001 l 14001,11001");
            };

            text.position().translate(0.005, 0.005);
            node.geometryChange();
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var text;
        var node;

        module("TextPathNode", {
            setup: function() {
                text = new d.Text("Foo", new g.Point(), { font: "4pt Arial" });
                node = new vml.TextPathNode(text);
            }
        });

        test("renders style", function() {
            equal(node.element.style.font, "4pt Arial");
        });

        test("renders string", function() {
            equal(node.element.string, "Foo");
        });

        test("optionsChange updates style", function() {
            node.css = function(name, value) {
                equal(name, "font");
                equal(value, "10pt Arial");
            };

            text.options.set("font", "10pt Arial");
            node.optionsChange({
                field: "font",
                value: "10pt Arial"
            });
        });

        test("optionsChange updates string", function() {
            node.attr = function(name, value) {
                equal(name, "string");
                equal(value, "Bar");
            };

            text.content("Bar");
            node.optionsChange({
                field: "content",
                value: "Bar"
            });
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var text;
        var node;

        baseClipTests("TextNode", vml.TextNode, d.Text);

        nodeLoadTests("TextNode", vml.TextNode, function (options) {
                return new d.Text("Foo", new g.Point(), options);
            }
        );

        module("TextNode", {
            setup: function() {
                text = new d.Text("Foo", new g.Point());
                node = new vml.TextNode(text);
            }
        });

        test("forwards font change to path node", function() {
            node.path.optionsChange = function() { ok(true); };
            text.options.set("font", "10pt Arial");
        });

        test("forwards font change to path data node", function() {
            node.pathData.geometryChange = function() { ok(true); };
            text.options.set("font", "10pt Arial");
        });

        test("forwards optionsChange to path node", function() {
            node.path.optionsChange = function() { ok(true); };
            text.content("Bar");
        });

        test("geometryChange is forwarded to path data node", function() {
            node.pathData.geometryChange = function() { ok(true); };
            text.position().setX(1);
        });

        shapeTests("TextNode", function(shapeOptions) {
            var text = new d.Text("Foo", [], shapeOptions);
            return new vml.TextNode(text);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var image;
        var dataNode;

        module("ImagePathDataNode", {
            setup: function() {
                image = new d.Image("foo", new g.Rect([10, 20], [90, 80]));
                dataNode = new vml.ImagePathDataNode(image);
            }
        });

        test("renders rectangle", function() {
            equal(dataNode.element.v, "m 1000,2000 l 10000,2000 10000,10000 1000,10000 x e");
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var image;
        var fillNode;

        function updateTransform(value) {
            image.transform(value);
            fillNode.optionsChange({
                field: "transform",
                value: value
            });
        }

        module("ImageFillNode", {
            setup: function() {
                image = new d.Image("foo", new g.Rect([10, 20], [90, 80]), { opacity: 0.5 });
                fillNode = new vml.ImageFillNode(image);
            }
        });

        test("renders src", function() {
            equal(fillNode.element.src, "foo");
        });

        test("renders type", function() {
            equal(fillNode.element.type, "frame");
        });

        test("renders rotate", function() {
            equal(fillNode.element.rotate, true);
        });

        test("renders fill relative size", function() {
            equal(fillNode.element.size, "0.9,0.8");
        });

        test("renders fill relative center position", function() {
            equal(fillNode.element.position, "0.05,0.1");
        });

        test("renders opacity", function() {
            equal(fillNode.element.opacity, "0.5");
        });

        test("renders default angle of rotation", function() {
            equal(fillNode.element.angle, "0");
        });

        test("sets size for transformation scale", function() {
            updateTransform(g.transform().scale(2, 4));
            equal(fillNode.element.size, "1.8,3.2");
        });

        test("sets position for transformation scale", function() {
            updateTransform(g.transform().scale(2, 4));
            equal(fillNode.element.position, "0.6,1.9");
        });

        test("sets position for transformation translation", function() {
            updateTransform(g.transform().translate(10, 20));
            equal(fillNode.element.position, "0.15,0.3");
        });

        test("sets position for transformation translation and scale", function() {
            updateTransform(g.transform().translate(10, 20).scale(2, 4));
            equal(fillNode.element.position, "0.7,2.1");
        });

        test("sets position for transformation rotation", function() {
            updateTransform(g.transform().translate(10, 20).rotate(90));
            equal(fillNode.element.position, "-1,0.25");
        });

        test("sets angle for transformation angle", function() {
            updateTransform(g.transform().rotate(45));
            equal(fillNode.element.angle, "45");
        });

        test("sets angle for transformation angle and non-uniform scale", function() {
            updateTransform(g.transform().rotate(45).scale(2, 4));
            equal(fillNode.element.angle, "45");
        });

        test("optionsChange sets src", function() {
            fillNode.attr = function(name, value) {
                equal(name, "src");
                equal(value, "bar");
            };

            image.src("bar");
            fillNode.optionsChange({
                field: "src",
                value: "bar"
            });
        });

        test("optionsChange sets transform", function() {
            fillNode.attr = function(name, value) {
                if (name === "angle") {
                    equal(value, 45);
                }
            };

            updateTransform(g.transform().rotate(45));
        });

        test("geometryChange sets transform", function() {
            fillNode.attr = function(name, value) {
                if (name === "size") {
                    equal(value, "2,2");
                }
            };

            image.rect().setSize([200, 200]);
            fillNode.geometryChange();
        });

        test("refreshOpacity multiplies with image opacity", function() {
            fillNode.attr = function(name, value) {
                if (name === "opacity") {
                    equal(value, 0.25);
                }
            };

            fillNode.refreshOpacity(0.5);
        });
    })();

    // ------------------------------------------------------------
    (function() {
        var image;
        var imageNode;

        baseClipTests("ImageNode", vml.ImageNode, d.Image);

        nodeLoadTests("ImageNode", vml.ImageNode, function (options) {
                return new d.Image("foo", new g.Rect(), options);
            }
        );

        module("ImageNode", {
            setup: function() {
                image = new d.Image("foo", new g.Rect(new g.Point(10, 20), [90, 80]));
                imageNode = new vml.ImageNode(image);
            }
        });

        test("optionsChange is forwarded to fill (src)", function() {
            imageNode.fill.optionsChange = function() {
                ok(true);
            };

            image.src("bar");
        });

        test("optionsChange is forwarded to fill (transform)", function() {
            imageNode.fill.optionsChange = function() {
                ok(true);
            };

            image.options.set("transform", g.transform());
        });

        test("geometryChange is forwarded to pathData", function() {
            imageNode.pathData.geometryChange = function() {
                ok(true);
            };

            image.rect().size.setWidth(100);
        });

        test("geometryChange is forwarded to fill", function() {
            imageNode.fill.geometryChange = function() {
                ok(true);
            };

            image.rect().size.setWidth(100);
        });

        test("refreshTransform refreshes fill transform", 14, function() {
            var srcMatrix = new Matrix(3,3,3,3,3,3),
                parentMatrix = new Matrix(2,2,2,2,2,2),
                currentMatrix = parentMatrix.multiplyCopy(srcMatrix),
                group = new Group({ transform: parentMatrix });

            image = new d.Image("foo", new g.Rect([0, 0], [10, 10]), {
                transform: srcMatrix
            });

            group.append(image);
            imageNode = new vml.ImageNode(image);
            imageNode.fill.refresh = function(transform) {
                ok(true);
                compareMatrices(transform.matrix(), currentMatrix);
            };

            imageNode.refreshTransform();
            imageNode.refreshTransform(g.transform(parentMatrix));
        });

        shapeTests("ImageNode", function(shapeOptions) {
            var image = new d.Image("foo", new g.Rect([10, 20], [90, 80]), shapeOptions);
            return new vml.ImageNode(image);
        });
    })();

})();
