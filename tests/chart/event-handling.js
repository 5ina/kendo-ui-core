(function() {
    var dataviz = kendo.dataviz,
        draw = dataviz.drawing,
        Chart = dataviz.ui.Chart,
        chart;

    function setupChart(options) {
        chart = createChart(options);
    }

    (function() {
        function triggerMouseover(element) {
            return chart._mouseover({ element: element, originalEvent: { } });
        }

        module("mouseover", {
            setup: function() {
                setupChart({});
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("does not change highlight if hovering over the plotarea", function() {
            var calls = 0;
            chart._highlight.show = chart._highlight.hide = function() {
                calls++;
            };

            triggerMouseover(chart._plotArea.visual);
            equal(calls, 0);
        });

    })();

    // ------------------------------------------------------------
    (function() {
        function createEvent(relatedTarget) {
            var relatedTarget = relatedTarget === undefined ? document.body : relatedTarget;
            return $.Event("mouseleave", { relatedTarget: relatedTarget});
        }

        module("mouseleve", {
            setup: function() {
                setupChart({
                    valueAxis: {
                        crosshair: {
                            visible: true
                        }
                    },
                    tooltip:{
                        visible: true
                    }
                });
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("cancels mousemove handler", function() {
            chart._mousemove.cancel = function() {
                ok(true);
            };
            chart.element.trigger(createEvent());
        });

        test("hides highlight", function() {
            stubMethod(chart._highlight, "hide", function() {
                ok(true);
            }, function() {
                chart.element.trigger(createEvent());
            });
        });

        test("hides highlight if there is no relatedTarget", function() {
            stubMethod(chart._highlight, "hide", function() {
                ok(true);
            }, function() {
                chart.element.trigger(createEvent(null));
            });
        });

        test("does not hide highlight if the relatedTarget is from the tooltip element", 0, function() {
            stubMethod(chart._highlight, "hide", function() {
                ok(false);
            }, function() {
                chart.element.trigger(createEvent(chart._tooltip.element));
            });
        });

        asyncTest("hides tooltip", function() {
            var tooltip = chart._tooltip;
            tooltip.hide = function() {
                tooltip.hide = $.noop;

                ok(true);
                start();
            };
            chart.element.trigger(createEvent());
        });

        asyncTest("hides tooltip if there is no related target", function() {
            var tooltip = chart._tooltip;
            tooltip.hide = function() {
                tooltip.hide = $.noop;

                ok(true);
                start();
            };
            chart.element.trigger(createEvent(null));
        });

        test("hides crosshairs", function() {
            var crosshair =  chart._plotArea.crosshairs[0];
            stubMethod(crosshair, "hide", function() {
                ok(true);
            }, function() {
                chart.element.trigger(createEvent());
            });
        });

        test("hides crosshairs if there is no related target", function() {
            var crosshair =  chart._plotArea.crosshairs[0];
            stubMethod(crosshair, "hide", function() {
                ok(true);
            }, function() {
                chart.element.trigger(createEvent(null));
            });
        });

        test("does not hide crosshairs if the relatedTarget is from the tooltip element", 0, function() {
            var crosshair =  chart._plotArea.crosshairs[0];
            stubMethod(crosshair, "hide", function() {
                ok(false);
            }, function() {
                chart.element.trigger(createEvent(chart._tooltip.element));
            });
        });

    })();

    // ------------------------------------------------------------
    (function() {
        module("surface mouseleave", {
            setup: function() {
                setupChart({});
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("calls chart element leave method if available", function() {
            chart._drawingChartElement = function() {
                return {
                    leave: function() {
                        ok(true);
                    }
                };
            };

            chart.surface.trigger("mouseleave", { element: { }, originalEvent: {}});
        });

    })();

    // ------------------------------------------------------------
    (function() {
        module("tooltip leave", {
            setup: function() {
                setupChart({
                    valueAxis: {
                        crosshair: {
                            visible: true
                        }
                    },
                    tooltip:{
                        visible: true
                    }
                });
            },
            teardown: function() {
                destroyChart();
            }
        });

        test("hides crosshairs ", function() {
            chart._plotArea.crosshairs[0].hide = function() {
                ok(true);
            };
            chart._tooltip.trigger("leave");
        });

        test("hides highlight ", function() {
            chart._highlight.hide = function() {
                ok(true);
            };
            chart._tooltip.trigger("leave");
        });

    })();

})();