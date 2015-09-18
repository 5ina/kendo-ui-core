(function(window) {
    var root;
    var tree;
    var element;
    var text;
    var render;
    var html;

    module("virtual dom", {
       setup: function() {
          root = $("<div>")[0];
          tree = new kendo.dom.Tree(root);
          element = tree.element;
          text = tree.text;
          html = tree.html;
       }
    });

    test("render appends element to root", function() {
        tree.render([element("div")]);

        equal(root.children.length, 1);
        equal(root.children[0].children.length, 0);
    });

    test("render creates text node", function() {
        tree.render([text("foo")]);

        equal(root.firstChild.nodeName, "#text");
    });

    test("render creates text node with specified text", function() {
        tree.render([text("foo")]);

        equal(root.firstChild.nodeValue, "foo");
    });

    test("renders children", function() {
        tree.render([ element("div"), element("div") ]);

        equal(root.children.length, 2);
    });

    test("render attributes", function() {
        var div = element("div", {id:"foo"});

        tree.render([div]);

        equal(root.firstChild.id, "foo");
    });

    test("render doesn't replace existing element if no changes present", function() {
        tree.render([ element("div") ]);
        var firstChild = root.children[0];

        tree.render([ element("div") ]);

        equal(root.children.length, 1);

        strictEqual(firstChild, root.children[0]);
    });

    test("render changes tag name", function() {
        tree.render([ element("div") ]);
        tree.render([ element("span") ]);

        equal(root.children.length, 1);

        equal(root.children[0].nodeName, "SPAN");
    });

    test("render changes attribute of existing element", function() {
        tree.render([ element("div", {id: "foo"}) ]);

        var firstChild = root.children[0];

        tree.render([ element("div", {id: "bar"}) ]);

        equal(root.children.length, 1);

        strictEqual(firstChild, root.children[0]);

        equal(firstChild.id, "bar");
    });

    test("render doesn't change attribute with same value", 0, function() {
        var div = element("div", { "foo": "foo" });
        tree.render([div]);

        div.node.setAttribute = function() {
            ok(false);
        };

        tree.render([element("div", { "foo": "foo" })]);
    });

    test("render inserts new children", function() {
        tree.render([]);

        tree.render([ element("div") ]);

        equal(root.children.length, 1);
    });

    test("render updates existing text node", function() {
        tree.render([text("foo")]);

        var textNode = root.firstChild;

        tree.render([text("bar")]);

        equal(root.childNodes.length, 1);

        strictEqual(textNode, root.firstChild);

        equal(textNode.nodeValue, "bar");
    });

    test("render replaces text node with element", function() {
        tree.render([text("foo")]);

        tree.render([element("div")]);

        equal(root.childNodes.length, 1);

        equal(root.firstChild.tagName, "DIV");
    });

    test("render replaces element with text node", function() {
        tree.render([element("div")]);

        tree.render([text("foo")]);

        equal(root.childNodes.length, 1);

        equal(root.firstChild.nodeValue, "foo");
    });

    test("render doesn't change text node with same value", 0, function() {
        var node = text("foo");

        tree.render([node]);

        Object.defineProperty(node, "nodeValue", {
            set: function() {
                ok(false);
            }
        });

        tree.render([text("foo")]);
    });

    test("render removes existing nodes", function() {
        tree.render([element("div"), element("div")]);

        tree.render([element("div")]);

        equal(root.childNodes.length, 1);
    });

    test("render removes existing child nodes", function() {
        tree.render([element("div", null, [element("span"), element("span") ])]);

        tree.render([element("div", null, [element("span") ])]);

        equal(root.firstChild.childNodes.length, 1);
    });

    test("render removes attributes set via dirrect assignment", function() {
        tree.render([element("div", { id: "foo" })]);

        tree.render([element("div", null)]);

        equal(root.firstChild.id, "");
    });

    test("render removes attributes instead of clearing it", function() {
        tree.render([element("td", { rowSpan: 2 })]);

        tree.render([element("td", null)]);

        equal(root.firstChild.rowSpan, 1);
    });

    test("render removes attributes set via setAttribute", function() {
        tree.render([element("div", { foo: "foo" })]);

        tree.render([element("div", null)]);

        equal(root.firstChild.getAttribute("foo"), null);
    });

    test("render adds style attributes", function() {
        tree.render([element("div", { style: { width: "100px" } })]);

        equal(root.firstChild.style.width,"100px");
    });

    test("render does not set style if same", 0, function() {
        var div = element("div", { style: { width: "100px", height: "100px" } });

        tree.render([div]);

        var height = div.node.style.height;
        var width = div.node.style.width;

        Object.defineProperty(div.node.style, "height", {
            set: function() {
                ok(false);
            },
            get: function() {
               return height;
            }
        });

        Object.defineProperty(div.node.style, "width", {
            set: function() {
                ok(false);
            },
            get: function() {
               return width;
            }
        });

        tree.render([element("div", { style: { width: "100px", height: "100px" } })]);
    });

    test("render removes style attribute", function() {
        tree.render([element("div", { style: { width: "100px" } })]);
        tree.render([element("div", null)]);

        equal(root.firstChild.style.cssText, "");
    });

    test("render removes style attribute when style is set to empty object", function() {
        tree.render([element("div", { style: { width: "100px" } })]);
        tree.render([element("div", { style: {} } )]);

        equal(root.firstChild.style.cssText, "");
    });

    test("render removes style attribute value", function() {
        tree.render([element("div", { style: { width: "100px", height: "100px" } })]);
        tree.render([element("div", { style: { width: "100px" } } )]);

        equal(root.firstChild.style.width, "100px");
    });

    test("render removes class attribute", function() {
        tree.render([element("div", { className: "test" })]);
        tree.render([element("div", null)]);

        equal(root.firstChild.className, "");
    });

    test("render outputs html child node", function() {
        tree.render([html("<b>foo</b>")]);

        equal(root.firstChild.nodeName, "B");
        equal(root.firstChild.firstChild.nodeValue, "foo");
    });

    test("render removes html child node", function() {
        tree.render([html("<b>foo</b>")]);

        tree.render([]);

        equal(root.childNodes.length, 0);
    });

    test("render doesn't insert same html node", 0, function() {
        tree.render([html("<b>foo</b>")]);

        root.insertAdjacentHTML = function() {
            ok(false);
        };

        tree.render([html("<b>foo</b>")]);
    });

    test("render inserts new html node after the same node has been rendered", 2, function() {
        tree.render([html("<b>foo</b>")]);
        tree.render([html("<b>foo</b>")]);

        tree.render([html("<i>bar</i>")]);

        equal(root.firstChild.nodeName, "I");
        equal(root.firstChild.firstChild.nodeValue, "bar");
    });

    test("render updates html node", function() {
        tree.render([html("<b>foo</b>")]);

        tree.render([html("<i>bar</i>")]);
        equal(root.firstChild.nodeName, "I");
        equal(root.firstChild.firstChild.nodeValue, "bar");
    });


    test("render removes more than one html child nodes", function() {
        tree.render([html("<b>foo</b><b>bar</b>")]);

        tree.render([]);

        equal(root.childNodes.length, 0);
    });

    test("render leaves existing nodes", function() {
        tree.render([element("div"), html("<b>foo</b>")]);

        tree.render([element("div")]);

        equal(root.childNodes.length, 1);
    });

    test("render destroys tree if there are more than two changed children", function() {
        tree.render([element("div", null, [element("div"), element("div"), element("div"), element("div")])]);
        var firstChild = root.firstChild.firstChild;
        tree.render([element("div", null, [element("div")])]);
        ok(firstChild !== root.firstChild.firstChild);
    });

    test("render updates children if node type has changed", function() {
        tree.render([ element("div", null, [ text("test_1") ]) ]);
        tree.render([ element("div", null, [ element("span", { class: "k-icon k-i-arrow-s" }), text("test_1") ]) ]);

        ok(true);
    });

    test("render updates variable children", function() {
        tree.render([ element("div", null, [ element("div", { style:{ position: "absolute", left: "50px", top: "50px" }}) ]) ]);
        debugger;
        tree.render([ element("div", null, [ element("table", { style:{ position: "absolute", top: "50px", left: "50px" }}) ]) ]);

        equal(root.firstChild.firstChild.tagName, "TABLE");
        equal(root.firstChild.firstChild.style.left, "50px");
    });

    test("render persists the order of elements", function() {
        var initial = [
            element("div", null, [
                element("div", null, [text("1")]),
                element("div", null, [text("2")]),
                element("div", null, [text("3")]),
                element("div", null, [text("4")])
            ]),
            element("div", null, [
                element("div", null, [text("5")]),
                element("div", null, [text("6")])
            ])
        ];

        tree.render(initial);

        var updated = [
            element("div", null, [
                element("div", null, [text("1")])
            ]),
            element("div", null, [
                element("div", null, [text("2")]),
                element("div", null, [text("3")])
            ])
        ];

        tree.render(updated);

        var rows = root.childNodes;

        equal(rows[0].childNodes.length, 1);
        equal(rows[1].childNodes.length, 2);
    });
}());
