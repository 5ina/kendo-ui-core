(function() {
    var Reorderable = kendo.ui.Reorderable,
        div;

    module("kendo.ui.Reorderable", {
        setup: function() {
            div= $("<div><div>1</div><div>2</div><div>3</div></div>")
                .find("div")
                .css({float: "left"})
                .end().prependTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            div.remove();
        }
    });

    function ev(options) {
        return $.extend(new $.Event, options);
    }

    function moveOverDropTarget(draggable, dropTarget, leftOffset) {
        leftOffset = leftOffset || 0;
        var offset = dropTarget.offset();
        offset.left += leftOffset;

        draggable.trigger({ type: "mousedown", pageX: 1, pageY: 1 });

        $(QUnit.fixture).trigger({
            type: "mousemove",
            pageX: offset.left,
            pageY: offset.top,
            clientX: offset.left,
            clientY: offset.top
        });

        $(QUnit.fixture).trigger({
            type: "mouseup",
            pageX: offset.left,
            pageY: offset.top,
            clientX: offset.left,
            clientY: offset.top
        });
    }

    function equalPositions(source, target, before) {
        var position = target.offset().left + (before ? 0 : target.outerWidth());

        equal(parseInt(source.css("left"), 10), parseInt(position, 10));
    }

    test("widget name option is Reorderable", function() {
        equal(Reorderable.fn.options.name, "Reorderable");
    });

    test("Reorderable instance from element created from constructor", function() {
        var reorderable = new Reorderable(div, {});

        ok(div.data("kendoReorderable") instanceof Reorderable);
    });

    test("Reorderable instance from element created from jQuery extension", function() {
        div.kendoReorderable();

        ok(div.data("kendoReorderable") instanceof Reorderable);
    });

    test("draggable is destroyed", function() {
        var reorderable = new Reorderable(div);
        var draggable = stub(reorderable.draggable, {
            destroy: reorderable.draggable.destroy
        });

        reorderable.destroy();

        equal(draggable.calls("destroy"), 1);
    });

    test("drop targets are destroyed", function() {
        var reorderable = new Reorderable(div);

        reorderable.destroy();

        var dropTargets = div.children();
        ok(!dropTargets.eq(0).data("kendoDropTarget"));
        ok(!dropTargets.eq(1).data("kendoDropTarget"));
        ok(!dropTargets.eq(2).data("kendoDropTarget"));
    });

    test("adds class k-reorderable to element", function() {
        div.kendoReorderable();

        ok(div.hasClass("k-reorderable"));
    });

    test("element initialized as Draggable", function() {
        div.kendoReorderable();

        ok(div.data("kendoDraggable") instanceof kendo.ui.Draggable);
    });

    test("element initializes DropTargets", function() {
        div.kendoReorderable();

        var elements = div.children();

        ok(elements.eq(0).data("kendoDropTarget") instanceof kendo.ui.DropTarget);
        ok(elements.eq(1).data("kendoDropTarget") instanceof kendo.ui.DropTarget);
        ok(elements.eq(2).data("kendoDropTarget") instanceof kendo.ui.DropTarget);
    });

    test("reorder cue after drop target", function() {
        var reorderable = new Reorderable(div, {}),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        equalPositions(reorderable.reorderDropCue, target);
    });

    test("reorder cue doesn't show on same target", function() {
        var reorderable = new Reorderable(div, {}),
        target = div.children().eq(1);

        moveOverDropTarget(target, target);

        ok(!reorderable.reorderDropCue.is(":visible"));
    });

    test("reorder cue before first drop target", function() {
        var reorderable = new Reorderable(div, {}),
        target = div.children().eq(0);

        moveOverDropTarget(div.children().eq(1), target);

        equalPositions(reorderable.reorderDropCue, target, true);
    });

    test("reorder cue height is same as target height", function() {
        var reorderable = new Reorderable(div, {}),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        equal(reorderable.reorderDropCue.outerHeight(), target.outerHeight());
    });

    test("reorder cue is removed on drop", function() {
        var reorderable = new Reorderable(div, {}),
        source = div.children().eq(0),
        target = div.children().eq(1);

        moveOverDropTarget(source, target);

        ok(!reorderable.reorderDropCue.is(":visible"));
        equal($(".k-reorder-cue", QUnit.fixture).length, 0);
    });

    test("change event is triggered", function() {
        var called = false,
        reorderable = new Reorderable(div, {
            change: function() {
                called = true;
            }
        }),
        source = div.children().eq(0),
        target = div.children().eq(1);

        moveOverDropTarget(source, target);

        ok(called);
    });

    test("change event is not triggered when drop on same target", function() {
        var called = false,
        reorderable = new Reorderable(div, {
            change: function() {
                called = true;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(target, target);

        ok(!called);
    });

    test("change event arguments", function() {
        div.children().eq(0).addClass("disabled");
        var args,
        reorderable = new Reorderable(div, {
            change: function() {
                args = arguments[0];
            },
            filter: "div:not(.disabled)"
        }),
        source = div.children().eq(1),
        target = div.children().eq(2);

        moveOverDropTarget(source, target);

        equal(args.element[0], source[0]);
        equal(args.oldIndex, 0);
        equal(args.newIndex, 1);
    });

    test("calls inSameContainer", function() {
        var wasCalled = false;
        var reorderable = new Reorderable(div, {
            hint: $("<div />"),
            inSameContainer: function() {
                wasCalled = true;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);
        ok(wasCalled);
    });

    test("drop cue is positioned at the end of the drop target when not in same container", function() {
        div.empty()
            .append("<div><div>1</div><div>2</div></div><div><div>11</div><div>12</div></div>")
            .find("div")
            .css({float: "left"});

        var reorderable = new Reorderable(div, {
            filter: ">div>*",
            hint: $("<div />"),
            inSameContainer: function(e) {
                return $(e.source).parent()[0] == $(e.target).parent()[0];
            }
        }),
        target = div.find(">div:eq(0)>div:last");

        moveOverDropTarget(div.find(">div:eq(1)>div:last"), target, target.outerWidth());

        equalPositions(reorderable.reorderDropCue, target);
    });

    test("drop cue is positioned at the beging of the drop target when not in same container", function() {
        div.empty()
        .append("<div><div>1</div><div>2</div></div><div><div>11</div><div>12</div></div>")
            .find("div")
            .css({float: "left"});

        var reorderable = new Reorderable(div, {
            filter: ">div>*",
            hint: $("<div />"),
            inSameContainer: function(e) {
                return $(e.source).parent()[0] == $(e.target).parent()[0];
            }
        }),
        target = div.find(">div:eq(0)>div:last");

        moveOverDropTarget(div.find(">div:eq(1)>div:last"), target);

        equalPositions(reorderable.reorderDropCue, target, true);
    });

    skip("position is set to before", function() {
        var args,
            reorderable = new Reorderable(div, {
                change: function() {
                    args = arguments[0];
                }
            }),
            target = div.children().eq(0);

        moveOverDropTarget(div.children().eq(1), target, 1);

        equal(args.position, "before");
    });

    test("position is set to after", function() {
        var args,
            reorderable = new Reorderable(div, {
                change: function() {
                    args = arguments[0];
                }
            }),
            target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target, 1);

        equal(args.position, "after");
    });

    skip("reorder twice adjecent elements", function() {
        var args;
        new Reorderable(div, {
            change: function() {
                args = arguments[0];
            }
        });

        div.children().eq(1).insertBefore(div.children().eq(0));
        moveOverDropTarget(div.children().eq(1), div.children().eq(0), 1);

        equal(args.newIndex, 0);
        equal(args.oldIndex, 1);
    });

    test("will not trigger change if only one element in the right container", function() {
        div.empty()
            .append("<div><div>1</div><div>2</div></div><div><div>11</div></div>")
            .find("div")
            .css({float: "left"});

        var called = false,
            reorderable = new Reorderable(div, {
                filter: ">div>*",
                hint: $("<div />"),
                inSameContainer: function() {
                    return false;
                },
                change: function() {
                    called = true;
                }
            });

        moveOverDropTarget(div.find(">div:eq(1)>div"), div.find(">div:eq(0)>div:first"), 1);

        strictEqual(called, false);
    });

    test("drop cue is as denied when not in same container", function() {
        var hint = $('<div><div class="k-drag-status" /></div>');
        var reorderable = new Reorderable(div, {
            hint: function() {
                return hint;
            },
            inSameContainer: function(e) {
                return false;
            },
            dragOverContainers: function() {
                return false;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        ok(hint.find(".k-drag-status").hasClass("k-i-denied"), "drag hint is not in denied state");
        ok(!hint.find(".k-drag-status").hasClass("k-i-add"), "drag hint is in add state");
    });

    test("drop cue is as not denied when in same container", function() {
        var hint = $('<div><div class="k-drag-status" /></div>');
        var reorderable = new Reorderable(div, {
            hint: function() {
                return hint;
            },
            inSameContainer: function(e) {
                return true;
            },
            dragOverContainers: function() {
                return false;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        ok(!hint.find(".k-drag-status").hasClass("k-i-denied"), "drag hint is in denied state");
        ok(hint.find(".k-drag-status").hasClass("k-i-add"), "drag hint is not in add state");
    });

    test("change event is not triggered when drag over containers is not allowed", function() {
        var wasCalled = false;
        var reorderable = new Reorderable(div, {
            inSameContainer: function(e) {
                return false;
            },
            dragOverContainers: function() {
                return false;
            },
            change: function() {
                wasCalled = true;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        ok(!wasCalled, "change event was incorrectly triggered");
    });

    test("change event is triggered when drag over containers is allowed", function() {
        var wasCalled = false;
        var reorderable = new Reorderable(div, {
            inSameContainer: function(e) {
                return $(e.source).parent()[0] == $(e.target).parent()[0];
            },
            dragOverContainers: function() {
                return true;
            },
            change: function() {
                wasCalled = true;
            }
        }),
        target = div.children().eq(1);

        moveOverDropTarget(div.children().eq(0), target);

        ok(wasCalled, "change event did not triggered");
    });
})();
