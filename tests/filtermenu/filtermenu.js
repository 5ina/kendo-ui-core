(function() {
    var DataSource = kendo.data.DataSource,
        FilterMenu = kendo.ui.FilterMenu,
        filterMenu,
        model,
        dom,
        dataSource;

    module("kendo.ui.FilterMenu", {
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

            dom = $("<th data-kendo-field=foo />").appendTo(QUnit.fixture);
        },

        teardown: function() {
            kendo.effects.enable();
            dataSource.unbind("change");
            kendo.destroy(QUnit.fixture);
            $(".k-filter-menu").remove();
            kendo.ns = "";
        }
    });

    function setup(dom, options, init) {
        var menu = new FilterMenu(dom, options);
        if (init !== false) {
            menu._init();
        }
        return menu;
    }

    test("menu link has negative tabindex", function() {
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.link.attr("tabindex"), -1);
    });

    test("binds the operator select from the field", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("select").attr(kendo.attr("bind")), "value: filters[0].operator");
    });

    test("renders binding for the value input from the field", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("input[" + kendo.attr("bind") + "='value:filters[0].value']").length, 1);
    });

    test("render title attribute to the form element", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.attr("title"), filterMenu.options.messages.info);
    });

    test("render title attribute to the first operator editor", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value: filters[0].operator']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.operator);
    });

    test("render title attribute to the first value editor", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value:filters[0].value']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.value);
    });

    test("render title attribute to the first value editor with values", function(){
        filterMenu = setup(dom, {dataSource: dataSource, values: ["1", "2"]});

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value:filters[0].value']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.value);
    });

    test("render title attribute to the logic editor", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value: logic']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.logic);
    });

    test("render title attribute to the second operator editor", function(){
        filterMenu = setup(dom, {
            dataSource: dataSource,
            messages: {
                additionalOperator: "extraOperator"
            }
        });

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value: filters[1].operator']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.additionalOperator);
    });

    test("render title attribute to the second value editor", function(){
        filterMenu = setup(dom, {
            dataSource: dataSource,
            messages: {
                additionalValue: "extraValue"
            }
        });

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value: filters[1].value']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.additionalValue);
    });

    test("render title attribute to the second value editor with values", function(){
        filterMenu = setup(dom, {
            dataSource: dataSource,
            values: ["1", "2"],
            messages: {
                additionalValue: "extraValue"
            }
        });

        var firstEditor = filterMenu.form.find("[" + kendo.attr("bind") + "='value:filters[1].value']");

        equal(firstEditor.attr("title"), filterMenu.options.messages.additionalValue);
    });


    test("renders binding for the extra value input from the field", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("input[" + kendo.attr("bind") + "='value:filters[0].value']").length, 1);
    });

    test("renders binding for the logical operation select from the field", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("select:eq(1)").attr(kendo.attr("bind")), "value: logic");
    });

    test("renders binding for the extra operator select", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("select:eq(2)").attr(kendo.attr("bind")), "value: filters[1].operator");
    });

    test("display extra filtering options by default", function(){
        filterMenu = setup(dom, {dataSource: dataSource});

        equal(filterMenu.form.find("select").length, 3);
    });

    test("does not display extra filtering options if extra is set to false", function(){
        filterMenu = setup(dom, {extra: false, dataSource: dataSource});

        equal(filterMenu.form.find("select").length, 1);
    });

    test("can change the filtering messages", function(){
        filterMenu = setup(dom, {
            messages: {
                info: "info"
            },
            dataSource: dataSource
        });

        ok(filterMenu.form.find("div:contains(info)").length);
    });

    test("can change the and and or messages", function(){
        filterMenu = setup(dom, {
            messages: {
                and: "foo",
                or: "bar"
            },
            dataSource: dataSource
        });

        ok(filterMenu.form.find("div:contains(foo)").length);
        ok(filterMenu.form.find("div:contains(bar)").length);
    });

    test("can change the operators", function(){
        filterMenu = setup(dom, {
            operators: {
                string: {
                    foo: "bar"
                }
            },
            dataSource: dataSource
        });

        equal(filterMenu.form.find("select option:first").val(), "foo");
    });

    test("custom operator is selected when submiting the form", function(){
        filterMenu = setup(dom, {
            operators: {
                string: {
                    startswith: "bar"
                }
            },
            dataSource: dataSource
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();
        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].operator, "startswith");
    });

    test("submitting the form raises change event passing the current filter expression", 5, function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            change: function(e) {
                equal(e.field, "foo");
                equal(e.filter.logic, "and");
                equal(e.filter.filters[0].value, "bar");
                equal(e.filter.filters[0].field, "foo");
                equal(e.filter.filters[0].operator, "eq");
            }
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();
        filterMenu.form.submit();
    });

    test("submitting empty form does not raises change event", 0, function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            change: function(e) {
                ok(true)
            }
        });

        filterMenu.form.submit();
    });

    test("preventing change event does not set filter to the DataSource", 1, function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            change: function(e) {
                e.preventDefault();
            }
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();
        filterMenu.form.submit();

        ok(!dataSource.filter());
    });

    test("submitting the form sets the filterMenu of the datasource", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();
        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].value, "bar");
        equal(dataSource.filter().filters[0].field, "foo");
        equal(dataSource.filter().filters[0].operator, "eq");
    });

    test("submitting the form does not send filters with null value", function() {
        filterMenu = setup(dom.attr("data-kendo-field", "bar"), {
            dataSource: dataSource
        });
        filterMenu.form.find("[data-kendo-role=numerictextbox]:first")
            .val("").change();

        filterMenu.form.submit();

        ok(dataSource.filter() == null);
    });

    test("submitting the form does send filters with null value if isnotnull is selected", function() {
        filterMenu = setup(dom.attr("data-kendo-field", "bar"), {
            dataSource: dataSource
        });

        var dropdownlist = filterMenu.form.find("[data-kendo-role=dropdownlist]:first").getKendoDropDownList();
        dropdownlist.value("isnotnull");
        dropdownlist.trigger("change");

        filterMenu.form.find("[data-kendo-role=numerictextbox]:first")
            .val("").change();

        filterMenu.form.submit();

        var filter = dataSource.filter();

        equal(filter.filters[0].operator, "isnotnull");
        equal(filter.filters[0].value, null);
    });

    test("submitting the form does send filters with null value if isnull is selected", function() {
        filterMenu = setup(dom.attr("data-kendo-field", "bar"), {
            dataSource: dataSource
        });

        var dropdownlist = filterMenu.form.find("[data-kendo-role=dropdownlist]:first").getKendoDropDownList();
        dropdownlist.value("isnull");
        dropdownlist.trigger("change");

        filterMenu.form.find("[data-kendo-role=numerictextbox]:first")
            .val("").change();

        filterMenu.form.submit();

        var filter = dataSource.filter();

        equal(filter.filters[0].operator, "isnull");
        equal(filter.filters[0].value, null);
    });

    test("submitting the form does send the extra filterMenu if default filter is isnotnull and extra is true", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            extra: true,
            operators: {
                string: {
                    isnotnull: "custom text"
                }
            }
        });

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 2);
    });


    test("submitting the form does not send the extra filterMenu if default filter is isnotnull and extra is false", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            extra: false,
            operators: {
                string: {
                    isnotnull: "custom text"
                }
            }
        });

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 1);
    });


    test("submitting the form does send the extra filterMenu if default filter is isnull and extra is true", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            extra: true,
            operators: {
                string: {
                    isnull: "custom text"
                }
            }
        });

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 2);
    });


    test("submitting the form does not send the extra filterMenu if default filter is isnull and extra is false", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            extra: false,
            operators: {
                string: {
                    isnull: "custom text"
                }
            }
        });

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 1);
    });

    test("submitting the form does not send the extra filterMenu if it is empty", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();
        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 1);
    });

    test("submitting the form does send the extra filterMenu if it is empty but isnull is selected ", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("input[type=text]:first").val("bar").change();

        var dropdownlist = filterMenu.form.find("[data-kendo-role=dropdownlist]:last").getKendoDropDownList();
        dropdownlist.value("isnull");
        dropdownlist.trigger("change");

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 2);
    });


    test("parses filterMenu value according to field type", function() {
        dom = $("<th data-kendo-field=bar />").appendTo(QUnit.fixture);

        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "bar"}
            ]
        });

        strictEqual(dataSource.filter().filters[0].value, 1);
    });

    test("filtering twice", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"}
            ]
        });

        filterMenu.filter({
            filters:[
                { value: "2", field: "foo"}
            ]
        });

        equal(dataSource.filter().filters.length, 1);
        equal(dataSource.filter().filters[0].value, "2");
    });

    test("filtering by two expressions", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"},
                { value: "2", field: "foo"}
            ]
        });

        equal(dataSource.filter().filters.length, 2);
        equal(dataSource.filter().filters[0].value, "1");
        equal(dataSource.filter().filters[1].value, "2");
    });

    test("filtering by more then two expressions", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"},
                { value: "2", field: "foo"},
                { value: "3", field: "foo"}
            ]
        });

        equal(dataSource.filter().filters.length, 3);
        equal(dataSource.filter().filters[0].value, "1");
        equal(dataSource.filter().filters[1].value, "2");
        equal(dataSource.filter().filters[2].value, "3");
    });

    test("or filtering", function() {
        filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("input[type=text]:first").val("foo").change();
        filterMenu.form.find("input[type=text]:last").val("bar").change();
        filterMenu.form.find("select.k-filter-and").data("kendoDropDownList").value("or");
        filterMenu.form.find("select.k-filter-and").data("kendoDropDownList").trigger("change");

        filterMenu.form.submit();

        equal(dataSource.filter().filters.length, 2);
        equal(dataSource.filter().logic, "or");
        equal(dataSource.filter().filters[0].value, "foo");
        equal(dataSource.filter().filters[1].value, "bar");
    });

    test("filtering by multiple fields", function() {
        var filter1 = setup(dom, {
            dataSource: dataSource
        });

        filter1.filter({
            filters:[
                { value: "1", field: "foo"}
            ]
        });

        dom = $("<th data-kendo-field=bar />").appendTo(QUnit.fixture);

        var filter2 = setup(dom, {
            dataSource: dataSource
        });

        filter2.filter({
            filters:[
                { value: "1", field: "bar"}
            ]
        });

        equal(dataSource.filter().filters.length, 2);
        equal(dataSource.filter().filters[0].field, "foo");
        equal(dataSource.filter().filters[1].field, "bar");
        equal(dataSource.filter().logic, "and");
    });

    test("filtering on multiple fields twice", function() {
        setup(dom, {
            dataSource: dataSource
        }).filter({
            logic: "and",
            filters: [
                { value: "1", field: "foo" },
                { value: "2", field: "foo" }
            ]
        });

        dom = $("<th data-kendo-field=bar />").appendTo(QUnit.fixture);

        var filter = setup(dom, {
            dataSource: dataSource
        });
        filter.filter({
            logic: "and",
            filters: [
                { value: "1", field: "bar" },
                { value: "2", field: "bar" }
            ]
        });
        filter.filter({
            logic: "and",
            filters: [
                { value: "1", field: "bar" },
                { value: "2", field: "bar" }
            ]
        });

        equal(dataSource.filter().filters.length, 3);
        equal(dataSource.filter().filters[0].field, "foo");
        equal(dataSource.filter().filters[1].field, "foo");
        equal(dataSource.filter().filters[2].filters.length, 2);
    });

    test("data source is not hit if no filters are specified", function() {
        var called = false;
        dataSource.bind("change", function() {
            called = true;
        });

        var filter1 = setup(dom, {
            dataSource: dataSource
        });

        filter1.filter({
            filters:[]
        });

        ok(!called);
    });

   test("filtering multiple fields and different logic", function() {
        var filter1 = setup(dom, {
            dataSource: dataSource
        });

        filter1.filter({
            logic: "or",
            filters:[
                { value: "1", field: "foo"},
                { value: "1", field: "foo"}
            ]
        });

        dom = $("<th data-kendo-field=bar />").appendTo(QUnit.fixture);

        var filter2 = setup(dom, {
            dataSource: dataSource
        });

        filter2.filter({
            filters:[
                { value: "1", field: "bar"}
            ]
        });

        equal(dataSource.filter().filters.length, 2);
        equal(dataSource.filter().logic, "and");
        equal(dataSource.filter().filters[0].logic, "or", "foo");
        equal(dataSource.filter().filters[0].filters.length, 2);
        equal(dataSource.filter().filters[1].field, "bar");
    });

    test("resetting the form clears the filterMenu", function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"}
            ]
        });

        filterMenu.form.trigger("reset");

        equal(dataSource.filter(), null);
    });

    test("resetting the form triggers change event", 1, function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"}
            ]
        });

        filterMenu.bind("change", function(e) {
            equal(e.filter, null);
        });

        filterMenu.form.trigger("reset");
    });

    test("pereventing change event prevents resetting the form", 1, function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.filter({
            filters:[
                { value: "1", field: "foo"}
            ]
        });

        filterMenu.bind("change", function(e) {
            e.preventDefault();
        });

        filterMenu.form.trigger("reset");

        equal(dataSource.filter().filters.length, 1);
    });

    test("clear removes two expression filter with multiple filtering", function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        dataSource.filter({ value: "1", field: "bar" });

        filterMenu.filter({
            logic: "and",
            filters: [
                { value: "1", field: "foo" },
                { value: "2", field: "foo" }
            ]
        });

        filterMenu.clear();

        equal(dataSource.filter().filters.length, 1);
        equal(dataSource.filter().filters[0].field, "bar");
        equal(dataSource.filter().filters[0].value, "1");
    });

    test("clear removes third level expressions", function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        dataSource.filter({
            logic: "and",
            filters: [{
                logic: "and",
                filters: [{
                    logic: "and",
                    filters: [
                        { value: "1", field: "foo" },
                        { value: "2", field: "foo" }]
                    }]
                }]
        });

        filterMenu.clear();

        equal(dataSource.filter(), null);
    });

    test("populates the first field value from the datasource", function() {
        dataSource.filter( { field: "foo", value: "1" });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("[type=text]:first").val(), "1");
    });

    test("populates the second field value from the datasource", function() {
        dataSource.filter( { logic: "or", filters: [{ field: "foo", value: "1" }, { field: "foo", value: "2" }]});

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("[type=text]:first").val(), "1");
        equal(filterMenu.form.find("[type=text]:last").val(), "2");
    });

    test("populates the logic value from the datasource", function() {
        dataSource.filter( { logic: "or", filters: [{ field: "foo", value: "1" }, { field: "foo", value: "2" }]});

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("select.k-filter-and").val(), "or");
    });

    test("populates the logic value from the datasource nested expression", function() {
        dataSource.filter( { logic: "and", filters: [{logic: "or", filters: [{ field: "foo", value: "1" }, { field: "foo", value: "2" }]}]});

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("select.k-filter-and").val(), "or");
    });

    test("populates the logic value from the last expression", function() {
        dataSource.filter( { logic: "and", filters: [{logic: "or", filters: [{ field: "foo", value: "1" }]}, { field: "foo", value: "2" }]});

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("select.k-filter-and").val(), "and");
    });

    test("populates the operator from the datasource", function() {
        dataSource.filter( { field: "foo", value: "1", operator: "neq" });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("select:first").val(), "neq");
    });

    test("applies active state", function() {
        dataSource.filter( { field: "foo", value: "1", operator: "neq" });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        ok(filterMenu.link.hasClass("k-state-active"));
    });

    test("applies active state before is opened", function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        }, false);

        dataSource.filter( { field: "foo", value: "1", operator: "neq" });

        ok(filterMenu.link.hasClass("k-state-active"), "The link is not marked as active");
    });

    test("applies active state when filtered before is created", function() {
        dataSource.filter( { field: "foo", value: "1", operator: "neq" });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        }, false);

        ok(filterMenu.link.hasClass("k-state-active"), "The link is not marked as active");
    });

    test("applies active state on nested expressions", function() {
        dataSource.filter( { filters: [{ filters: [{ field: "foo", value: "1", operator: "neq" }] }] });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        ok(filterMenu.link.hasClass("k-state-active"));
    });

    test("removes active state", function() {
        dataSource.filter( { field: "foo", value: "1", operator: "neq" });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        dataSource.filter(null);
        ok(!filterMenu.link.hasClass("k-state-active"));
    });

    test("creates numerictextbox for number fields", function() {
        var filterMenu = setup(
            dom.attr("data-kendo-field", "bar"), {
                dataSource: dataSource
            });

        ok(filterMenu.form.find("[" + kendo.attr("role") + "=numerictextbox]:first").data("kendoNumericTextBox"));
    });

    test("creates datepicker for date fields", function() {
        var filterMenu = setup(
            dom.attr("data-kendo-field", "baz"), {
                dataSource: dataSource
            });

        ok(filterMenu.form.find("[" + kendo.attr("role") + "=datepicker]:first").data("kendoDatePicker"));
    });

    test("updates dropdownlists", function() {
        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        dataSource.filter( { logic: "or", filters: [{ field: "foo", value: "1", operator: "neq" }, { field: "foo", value: "2", operator: "neq" }]});

        equal(filterMenu.form.find("select:first").data("kendoDropDownList").current().text(), "Is not equal to");
        equal(filterMenu.form.find("select:last").data("kendoDropDownList").current().text(), "Is not equal to");
        equal(filterMenu.form.find("select.k-filter-and").data("kendoDropDownList").current().text(), "Or");
    });

    test("updates numerictextboxes", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "bar"), {
            dataSource: dataSource
        });

        dataSource.filter({ field: "bar", value: 1 });
        equal(filterMenu.form.find("[" + kendo.attr("role") + "=numerictextbox]:first").data("kendoNumericTextBox")._text.val(), "1.00");
    });

    test("updates datepickers", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "baz"), {
            dataSource: dataSource
        });

        var date = new Date(2011, 1, 1);
        dataSource.filter({ field: "baz", value:date });
        equal(filterMenu.form.find("[" + kendo.attr("role") + "=datepicker]:first").data("kendoDatePicker").value().getTime(), date.getTime());
    });

    test("closes sibling filtering menus", function() {
        var dom1 = $("<div data-kendo-field=foo />").appendTo(QUnit.fixture);
        var dom2 = $("<div data-kendo-field=bar />").appendTo(QUnit.fixture);

        var filterMenu1 = setup(dom1, {
            dataSource: dataSource
        });

        var filterMenu2 = setup(dom2, {
            dataSource: dataSource
        });

        filterMenu1.link.click();
        filterMenu2.link.click();

        ok(!filterMenu1.popup.visible());
    });

    test("first focusable element is focused on popup activate", 1, function() {
        filterMenu = setup(dom, {extra: false, dataSource: dataSource});

        filterMenu.link.click();

        equal(document.activeElement, filterMenu.form.find(":kendoFocusable")[0]);
    });

    test("pressing esc closes the menu", function() {
        filterMenu = setup(dom, {extra: false, dataSource: dataSource});

        filterMenu.link.click();
        filterMenu.form.trigger({ type: "keydown", keyCode: kendo.keys.ESC });

        ok(!filterMenu.popup.visible());
    });

    test("destroy detaches click handle and removes objects from the element", function() {
        var dom1 = $("<div data-kendo-field=foo />").appendTo(QUnit.fixture);

        var filterMenu = setup(dom1, {
            dataSource: dataSource
        });
        var popup = filterMenu.popup;

        filterMenu.destroy();

        ok(!popup.visible());
        ok(!dom1.data("kendoFilterMenu"));
    });

    test("boolean filter template", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "boo"), {
            dataSource: dataSource
        });

        equal(filterMenu.form.find("[type='radio']").length, 2)
    });

    test("boolean filtering true values", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "boo"), {
            dataSource: dataSource
        });

        filterMenu.form.find("[type='radio']").first().attr("checked", "checked").change();
        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].field, "boo");
        equal(dataSource.filter().filters[0].operator, "eq");
        equal(dataSource.filter().filters[0].value, true);
    });

    test("boolean filtering false values", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "boo"), {
            dataSource: dataSource
        });

        filterMenu.form.find("[type='radio']").last().attr("checked", "checked").change();
        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].field, "boo");
        equal(dataSource.filter().filters[0].operator, "eq");
        equal(dataSource.filter().filters[0].value, false);
    });

    test("updates boolean true radio button", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "boo"), {
            dataSource: dataSource
        });

        dataSource.filter( { field: "boo", operator: "eq", value: true});

        ok(filterMenu.form.find("[type='radio']:first").is(":checked"));
    });

    test("updates boolean false radio button", function() {
        var filterMenu = setup(dom.attr("data-kendo-field", "boo"), {
            dataSource: dataSource
        });

        dataSource.filter( { field: "boo", operator: "eq", value: false });

        ok(filterMenu.form.find("[type='radio']:last").is(":checked"));
    });

    test("filtering without specified model defaults to string type", function() {
        dataSource = new kendo.data.DataSource( { data: [ { foo : "foo" }, { foo: "bar"} ] });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("[type=text]:first").val("foo").change();
        filterMenu.form.submit();

        equal(dataSource.view().length, 1);
    });

    test("filtering without specified field defaults to string type", function() {
        dataSource = new kendo.data.DataSource( {
            data: [ { foo : "foo" }, { foo: "bar"} ],
            schema: {
                model: {}
            }
        });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("[type=text]:first").val("foo").change();
        filterMenu.form.submit();

        equal(dataSource.view().length, 1);
    });

    test("values are displayed as select if set", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo" } ]});

        equal(filterMenu.form.find("select").length, 5);
        strictEqual(filterMenu.form.find("select").eq(1).data("kendoDropDownList").value(), "");
    });

    test("values with text as empty string are displayed as select if set", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: "", text: "" } ]});

        equal(filterMenu.form.find("select").length, 5);
        strictEqual(filterMenu.form.find("select").eq(1).data("kendoDropDownList").text(), "");
    });

    test("values as plain array", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ "foo", "bar" ]});

        var view = filterMenu.form.find("select").eq(1).data("kendoDropDownList").dataSource.view(),
            firstItem = view[0];

        equal(view.length, 2);
        equal(firstItem.text, "foo");
        equal(firstItem.value, "foo");
    });

    test("values as array with text only", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { text: "foo" }, { text:"bar" } ]});

        var view = filterMenu.form.find("select").eq(1).data("kendoDropDownList").dataSource.view(),
            firstItem = view[0];

        equal(view.length, 2);
        equal(firstItem.text, "foo");
        equal(firstItem.value, "foo");
    });

    test("values as array with text value pair", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { text: "foo", value: 0 }, { text:"bar", value: 1 } ]});

        var view = filterMenu.form.find("select").eq(1).data("kendoDropDownList").dataSource.view(),
            firstItem = view[0];

        equal(view.length, 2);
        equal(firstItem.text, "foo");
        equal(firstItem.value, 0);
    });

    test("filter model has null value when the option label is selected and the values contain zero", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo" },{ value: 42, text: "bar" }]});
        var dropdownlist1 = filterMenu.form.find("select").eq(1).data("kendoDropDownList");
        dropdownlist1.select(0);
        dropdownlist1.trigger("change");

        var dropdownlist2 = filterMenu.form.find("select").eq(4).data("kendoDropDownList");
        dropdownlist2.select(0);
        dropdownlist2.trigger("change");

        equal(dropdownlist2.select(), 0);
        equal(filterMenu.filterModel.filters[1].value, null);
    });


    test("submitting the form sets DataSource filter if values are set ", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { text: "foo", value: 0 }, { text:"bar", value: 1 } ]});

        var select = filterMenu.form.find("select").eq(1).data("kendoDropDownList");
        select.select(1); // first item skipping the optionLabel
        select.trigger("change");

        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].value, 0);
        equal(dataSource.filter().filters[0].field, "foo");
    });

    test("operators are constrained if values are set", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo" } ]});

        equal(filterMenu.form.find("select:first").find("option").length, 4);
    });

    test("filter value is selected from values", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo" },{ value: 42, text: "bar" }]});

        dataSource.filter({ field: "foo", value: 42, op: "eq" });

        equal(filterMenu.form.find("select").eq(1).val(), 42);
    });

    test("filter is populated with selected value from values list", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo" },{ value: 42, text: "bar" }]});

        var operators = filterMenu.form.find("select").eq(1).data("kendoDropDownList");
        operators.value(42);
        operators.trigger("change");

        filterMenu.form.submit();

        equal(dataSource.filter().filters[0].value, 42);
        equal(dataSource.filter().filters[0].field, "foo");
    });

    test("filter is populated when text have literal symbol", function() {
        filterMenu = setup(dom, {dataSource: dataSource, values: [ { value: 0, text: "foo ' bar" },{ value: 42, text: "bar" }]});

        var ddl = filterMenu.form.find("select").eq(1).data("kendoDropDownList");
        ddl.value(0);

        equal(ddl.value(), 0);
        equal(ddl.text(), "foo ' bar");
    });

    test("default parse is used if model with only field specified", function() {
        dataSource = new kendo.data.DataSource( {
            data: [ { foo : "foo" }, { foo: "bar"} ],
            schema: {
                model: {
                    fields: { foo: "foo" }
                }
            }
        });

        var filterMenu = setup(dom, {
            dataSource: dataSource
        });

        filterMenu.form.find("[type=text]:first").val("foo").change();
        filterMenu.form.submit();

        strictEqual(dataSource.filter().filters[0].value, "foo");
    });

    test("form is not created before link is click", function() {
        filterMenu = new FilterMenu(dom, {dataSource: dataSource});

        ok(!filterMenu.form);
    });

    test("form is created on link is click", function() {
        filterMenu = new FilterMenu(dom, {dataSource: dataSource});

        filterMenu.link.click();

        ok(filterMenu.form);
    });

    test("form is created once on multiple link clicks", function() {
        filterMenu = new FilterMenu(dom, {dataSource: dataSource});

        filterMenu.link.click();

        var form = filterMenu.form;

        filterMenu.link.click();

        equal(form, filterMenu.form);
    });

    test("init event is raised when form is created", 2, function() {
        filterMenu = new FilterMenu(dom, {dataSource: dataSource, field: "foo" });

        filterMenu.bind("init", function(e) {
            equal(e.field, "foo");
            equal(e.container, filterMenu.form);
        });

        filterMenu.link.click();
    });

    test("open event is raised when form is opened", 3, function() {
        filterMenu = new FilterMenu(dom, {dataSource: dataSource, field: "foo" });

        filterMenu.bind("open", function(e) {
            equal(e.field, "foo");
            equal(e.container, filterMenu.form);
            ok(this.form.find(":kendoFocusable:first").is($(document.activeElement)));
        });

        filterMenu.link.click();
    });

    test("role is not set if ui is function", 2, function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            ui: function(element) {
               ok(!element.filter("[" + kendo.attr("role") + "]").length);
            }
        });
    });

    test("role is set if ui is string",  function() {
        filterMenu = setup(dom, {
            dataSource: dataSource,
            ui: "datetimepicker"
        });

        equal(filterMenu.form.find("[" + kendo.attr("role") + "=datetimepicker]").length, 2);
    });

    test("ui widget is bound to the model",  function() {
        var date = new Date();

        dataSource.filter({ field: "baz", op: "eq", value: date });

        filterMenu = setup(dom, {
            dataSource: dataSource,
            field: "baz",
            ui: function(element) {
                element.kendoDateTimePicker();
            }
        });

        equal(filterMenu.form.find("[" + kendo.attr("role") + "=datetimepicker]:first").kendoDateTimePicker("value").getTime(), date.getTime());
    });

    test("dataSource as options",  function() {
        filterMenu = setup(dom, { dataSource: {} });

        ok(filterMenu.dataSource instanceof DataSource);
    });

    test("DataSource instance is not changed",  function() {
        filterMenu = setup(dom, { dataSource: dataSource });

        strictEqual(filterMenu.dataSource, dataSource);
    });

})();
