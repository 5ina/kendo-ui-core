(function() {
    var TimezoneEditor = kendo.ui.TimezoneEditor,
        div;

    module("kendo.ui.TimezoneEditor initialization", {
        setup: function() {
            div = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("kendoTimezoneEditor attaches a TimezoneEditor object to target", function() {
        div.kendoTimezoneEditor();

       ok(div.data("kendoTimezoneEditor") instanceof TimezoneEditor);
    });

    test("TimezoneEditor creates query from windows_zones", function() {
        var widget = new TimezoneEditor(div);

        ok(widget._zonesQuery);
        equal(widget._zonesQuery.data.length, kendo.timezone.windows_zones.length);
    });

    test("TimezoneEditor renders zone_titles dropdownlist", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first"),
            ddl = zone_title.data("kendoDropDownList");

        ok(zone_title);
        ok(ddl);

        ok(zone_title.attr("id"))
        equal(ddl.ul.children().length, kendo.timezone.zones_titles.length);
    });

    test("TimezoneEditor renders zones dropdownlist", function() {
        var widget = new TimezoneEditor(div),
            zone = div.find("[data-role=dropdownlist]:last"),
            ddl = zone.data("kendoDropDownList");

        ok(zone);
        ok(ddl);

        ok(!ddl.wrapper.is(":visible"));
        equal(ddl.options.dataSource.length, kendo.timezone.windows_zones.length);
        equal(ddl.options.cascadeFrom, div.find("[data-role=dropdownlist]:first").attr("id"));
    });

    test("TimezoneEditor selects zone_title based on timezone", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        widget.value("Europe/Sofia");

        equal(widget.value(), "Europe/Sofia");
        equal(zone.value(), "Europe/Sofia");
        equal(zone_title.value(), "FLE Standard Time");
        equal(zone_title.text(), "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius");

        ok(zone.wrapper.is(":visible"));
    });

    test("TimezoneEditor shows second dropdownlist if more timezones are available", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        widget.value("America/New_York");

        ok(zone.wrapper.is(":visible"));
        equal(zone.value(), "America/New_York");
        equal(zone_title.value(), "Eastern Standard Time");
        equal(zone_title.text(), "(GMT-05:00) Eastern Time (US & Canada)");
    });

    test("TimezoneEditor clears selection if no such timezone", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        widget.value("America/New_York");
        widget.value("test");

        ok(!zone.wrapper.is(":visible"));
        equal(zone_title.value(), "");
    });

    test("TimezoneEditor selects America/Toronto", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        widget.value("America/Toronto");

        equal(zone.value(), "America/Toronto");
        equal(zone_title.value(), "Eastern Standard Time");
        equal(zone_title.text(), "(GMT-05:00) Eastern Time (US & Canada)");
    });

    module("kendo.ui.TimezoneEditor interaction", {
        setup: function() {
            div = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("Select zone_title selects timezone", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        zone_title.select(1);

        ok(widget.value());
        equal(widget.value(), zone.value());
    });

    test("Select option label clears widget value", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        zone_title.select(1);
        zone_title.select(0);

        equal(widget.value(), "");
        equal(widget.value(), zone.value());
    });

    test("Select specific value from second dropdownlist changes widget value", function() {
        var widget = new TimezoneEditor(div),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        zone_title.value("Eastern Standard Time");
        zone.select(2);

        equal(widget.value(), zone.value());
    });

    module("kendo.ui.TimezoneEditor events", {
        setup: function() {
            div = $("<div />").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
        }
    });

    test("Select zone_title triggers change", 1, function() {
        var widget = new TimezoneEditor(div, {
                change: function() {
                    ok(true);
                }
            }),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        zone_title.value("Eastern Standard Time");
    });

    //TODO: Before DDL the change event was fired twice. Investigate further
    test("Clear timezone triggers change", 3, function() {
        var widget = new TimezoneEditor(div, {
                change: function() {
                    ok(true);
                }
            }),
            zone_title = div.find("[data-role=dropdownlist]:first").data("kendoDropDownList"),
            zone = div.find("[data-role=dropdownlist]:last").data("kendoDropDownList");

        zone_title.value("Eastern Standard Time");
        zone_title.value("");
    });
})();
