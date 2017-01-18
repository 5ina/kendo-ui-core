(function() {
    var DataSource = kendo.data.DataSource,
        FilterCell = kendo.ui.FilterCell,
        filterCell,
        model,
        dom,
        dataSource;

    module("kendo.ui.FilterCell", {
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
            $(".k-row-filter").remove();
            kendo.ns = "";
        }
    });

    function setup(dom, options) {
        var menu = new FilterCell(dom, options);
        return menu;
    }

    test("wrap element has the filter-header class", function() {
        filterCell = setup(dom, { dataSource: dataSource });

        ok(dom.is(".k-filtercell"));
    });

    test("dataSource remains the same instance when set to an instance of the DataSource class, acDS creates new one", function() {
        filterCell = setup(dom, { dataSource: dataSource, suggestDataSource: dataSource });

        ok(filterCell.dataSource instanceof kendo.data.DataSource);
        ok(filterCell.dataSource === dataSource);
    });

    test("suggestions work with initially defined data", function() {
            dataSource = new DataSource({
                data: [
                    { foo: "foo" },
                    { foo: "foo" },
                    { foo: "bar" },
                    { foo: "bar" },
                ],
                schema: {
                    model: {
                        fields: {
                            foo: {
                                type: "string"
                            }
                        }
                    }
                }
            });

        filterCell = setup(dom, { field: "foo", dataSource: dataSource, suggestDataSource: dataSource.options, customDataSource: false });

        filterCell.suggestDataSource.read();
        equal(filterCell.suggestDataSource.data().length, 2);
    });

    test("ac dataSource is different instance when suggestDataSource is not specified", function() {
        filterCell = setup(dom, { dataSource: dataSource });

        ok(filterCell.suggestDataSource !== dataSource);
    });

    test("suggestDataSource is instance of the DataSource class when set with options", function() {
        var dsOptions = { transport: { read: function () {} } };
        filterCell = setup(dom, { suggestDataSource: dsOptions, dataSource: new kendo.data.DataSource() });

        ok(filterCell.suggestDataSource instanceof kendo.data.DataSource);
        ok(filterCell.suggestDataSource.transport.read === dsOptions.transport.read);
    });

    test("type is retrieved from dataSource when it is instance of the DataSource class ", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(filterCell.options.type, "string");
    });

    test("uses default type when dataSource is instance of the DataSource class and field type is not defined", function() {
        delete dataSource.options.schema.model.fields.bar.type;
        filterCell = setup(dom, { dataSource: dataSource, field: "bar" });
        equal(filterCell.options.type, "string");
    });
    test("type is retrieved from dataSource when it is instance of the DataSource class ", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "bar" });
        equal(filterCell.options.type, "number");
    });

    test("creates input elements by default", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "bar" });
        equal(dom.find("input[" + kendo.attr("bind") + "]").length, 2, "one for value, one for operator");
    });

    test("sets the value of the input element when there is default filter", function() {
        dataSource.filter({ field:"foo", operator:"eq", value:"baz" })
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(filterCell.element.find("input").val(), "baz");
    });

    test("uses the provided dataTextField option for autocompletion", function() {
        filterCell = setup(dom, { field: "foo", dataSource: dataSource, dataTextField: "bla"  });
        equal(filterCell.wrapper.find("[" + kendo.attr("role") + "=autocomplete]").data("kendoAutoComplete").options.dataTextField, "bla");
    });

    test("sets the filter option of the AutoComplete", function() {
        filterCell = setup(dom, { field: "foo", dataSource: dataSource, dataTextField: "bla", suggestionOperator: "contains"  });
        equal(filterCell.wrapper.find("[" + kendo.attr("role") + "=autocomplete]").data("kendoAutoComplete").options.filter, "contains");
    });

    test("sets the input width", function() {
        filterCell = setup(dom, { field: "foo", dataSource: dataSource, dataTextField: "bla", inputWidth: 333 , template: function(){}}); //template is used to create clean input, otherwise width is different based on the widget created
        equal(filterCell.input.width(), 333 );
    });

    test("sets the input width", function() {
        filterCell = setup(dom, { field: "foo", dataSource: dataSource, dataTextField: "bla", minLength:4 });
        equal(filterCell.wrapper.find("[" + kendo.attr("role") + "=autocomplete]").data("kendoAutoComplete").options.minLength, 4);
    });

    test("filtercell template option receive the special dataSource", function() {
        filterCell = setup(dom, {
            field: "foo",
            dataSource: dataSource,
            suggestDataSource: {
                transport: {
                    read: function(e) {
                        e.success([
                          { foo: "one" },
                          { foo: "one" },
                          { foo: "two" }
                        ])
                    }
                }
            },
            customDataSource: false,
            dataTextField: "bla", template: function(e) {
                e.dataSource.read();
                equal(e.dataSource.view().length, 2)
            }
        });
    });

    test("sets the value of the input element when there is array as filter", function() {
        dataSource.filter([{ field:"foo", operator:"eq", value:"baz" }]);
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(dom.find("input").val(), "baz");
    });

    test("sets the value of the input element when there is composite filter", function() {
        dataSource.filter({ filters: [{ field:"foo", operator:"eq", value:"baz" }] });
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(dom.find("input").val(), "baz");
    });

    test("sets the value of the input element when there is complex composite filter", function() {
        dataSource.filter({ filters: [{ field:"faz", operator:"eq", value:"gaz" }, { field:"foo", operator:"eq", value:"baz" }] });
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(dom.find("input").val(), "baz");
    });

    test("does not set the value of the input element to null when filter is cleared without adding filter before that", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.clearFilter();
        equal(dom.find("input").eq(0).val(), "");
    });

    test("sets default operator", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo", operator: "neq" });
        equal(dom.find("["+ kendo.attr("role") +"=dropdownlist]").data("kendoDropDownList").value(), "neq");
    });

    test("showOperators set to false does not render the operators DropDownList", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo", operator: "neq", showOperators: false });
        equal(dom.find("["+ kendo.attr("role") +"=dropdownlist]").length, 0);
    });

    test("does not set the value of the input element to null when filter is cleared without adding filter before that", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.clearFilter();
        equal(dom.find("input").eq(0).val(), "");
    });

    test("uses template", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo", template: function(e, model) {
            e.element.addClass("foo");
        } });
        equal(dom.find(".foo").length, 1);
    });

    test("sets the viewmodel initial operator to be the first available in operators", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" , operators: { string: { neq: "bar" } } });
        equal(filterCell.viewModel.operator, "neq");
    });

    test("updates the values of the filter when filter is cleared and then set", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(dom.find("input").val(), "");
        dataSource.filter({ filters: [{ field:"faz", operator:"eq", value:"gaz" }, { field:"foo", operator:"eq", value:"baz" }] });
        equal(dom.find("input").val(), "baz");
        dataSource.filter({});
        equal(dom.find("input").val(), "");
        dataSource.filter({ field:"foo", operator:"eq", value:"gaz" });
        equal(dom.find("input").val(), "gaz");
    });

    test("updates the viewmodel operator when the dataSource is initially filtered", function() {
        dataSource.filter({ filters: [{ field:"faz", operator:"eq", value:"gaz" }, { field:"foo", operator:"neq", value:"baz" }] });
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(filterCell.viewModel.operator, "neq");
    });

    test("when viewModel is changed the filter of the dataSource is updated", function() {
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("value", "someValue");

        var filter = dataSource.filter();
        equal(filter.filters.length, 1);

        filter = filter.filters[0];
        equal(filter.value, "someValue");
        equal(filter.field, "foo");
        equal(filter.operator, "eq");
    });

    test("when viewModel is changed the filter of the dataSource is updated and other filters are preserved", function() {
        dataSource.filter({ field: "bar", value: "someBarvalue", operator: "neq"});
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("value", "someValue");

        var filter = dataSource.filter();
        ok(filter.filters);
        equal(filter.logic, "and");

        var filters = filter.filters;
        equal(filters[0].value, "someBarvalue");
        equal(filters[0].field, "bar");
        equal(filters[0].operator, "neq");
        equal(filters[1].value, "someValue");
        equal(filters[1].field, "foo");
        equal(filters[1].operator, "eq");
    });

    test("when viewModel is changed to empty value, filter of the dataSource is cleared if there are no other filters", function() {
        dataSource.filter([{ field: "foo", value: "soneFooValue", operator: "neq" }]);
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("value", "");
        var filter = dataSource.filter();
        equal(filter, null);
    });

    test("when operator is changed and value is null, no filtering is performed", function() {
        var notInvoked = true;
        dataSource.bind("requestStart", function() {
            notInvoked = false;
        });
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("operator", "neq");
        ok(notInvoked);
    });

    test("when viewModel is changed to empty value, filter of the dataSource is cleared and other filters are preserved", function() {
        dataSource.filter([{ field: "bar", value: "someBarvalue", operator: "neq" }, { field: "foo", value: "soneFooValue", operator: "neq" }]);
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("value", "");
        var filter = dataSource.filter();
        ok(filter.filters);
        equal(filter.logic, "and");
        var filters = filter.filters;
        equal(filters.length, 1);
        equal(filters[0].value, "someBarvalue");
        equal(filters[0].field, "bar");
        equal(filters[0].operator, "neq");
    });

    test("creates autocomplete widget for the string type", function() {
        var suggestDataSource = new kendo.data.DataSource({
            data: ["a", "b"]
        });
        filterCell = setup(dom, { dataSource: dataSource, field: "foo", suggestDataSource: suggestDataSource });
        var ac = filterCell.element.find("input").data("kendoAutoComplete");
        ok(ac);
    });

    test("autocomplete dataSource do not have any groups set if there are defined for main dataSource", function() {
        var suggestDataSource = {
            data: [
                { foo: "1", bar: "some value" },
                { foo: "1", bar: "some other" },
                { foo: "2", bar: "some third" }
            ],
            group: { field: "foo" }
        };
        filterCell = setup(dom, { dataSource: dataSource, field: "foo", suggestDataSource: suggestDataSource });
        var groups = filterCell.suggestDataSource.group();
        equal(groups.length, 0);
    });

    test("suggestDS does not trigger a request until it is needed", function() {
        var counter = 0;
        var suggestDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    options.success( [ { foo: "1", bar: "some value" },
                        { foo: "1", bar: "some other" },
                        { foo: "2", bar: "some third" } ])
                }
            },
            requestEnd: function() {
                counter++;
            },
            group: { field: "foo" }
        });
        filtercell = setup(dom, { dataSource: dataSource, field: "foo", suggestDataSource: suggestDataSource });
        equal(counter, 0);
    });

    // test("creates clear icon", function() {
    //     filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
    //     equal(filterCell.element.find(".k-icon.k-i-close").length, 2);
    // });

    test("clear icon clears the filter", function() {
        dataSource.filter({field: "foo", value: "someVal"})
        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        equal(filterCell.input.val(), "someVal");
        filterCell.element.find(".k-icon.k-i-close").click();
        equal(filterCell.input.val(), "");
    });

    test("clear icon triggers the change event", 1, function() {
        dataSource.filter({field: "foo", value: "someVal"})
        filterCell = setup(dom, {
            dataSource: dataSource,
            field: "foo" ,
            change: function() {
                ok(true);
            }
        });
        filterCell.element.find(".k-icon.k-clear-value").click();
    });

    test("clear icon is hidden when isnull filter on  numeric value is removed", function() {
        dataSource.filter({field: "bar", operator: "isnull", value: null })

        filterCell = setup(dom, { dataSource: dataSource, field: "bar" });

        equal(filterCell.input.val(), "");
        filterCell.element.find(".k-icon.k-i-close").click();
        ok(!filterCell.element.find(".k-icon.k-i-close").is(":visible"));
    });

    test("clear icon is hidden when isnull filter on string value is removed", function() {
        dataSource.filter({field: "foo", operator: "isnull", value: undefined })

        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });

        equal(filterCell.input.val(), "");
        filterCell.element.find(".k-button .k-icon.k-i-close").click();
        ok(!filterCell.element.find(".k-button .k-icon.k-i-close").is(":visible"));
    });


    test("suggest dataSource shows only unique records when inherited", function() {
        var ds = new kendo.data.DataSource({
            schema: {
                model: {
                    fields: {
                        foo: {
                            type: "string"
                        }
                    }
                }
            },
            transport: {
                read: function(options) {
                    options.success([
                        { foo: "1" },
                        { foo: "1" },
                        { foo: "2" }
                    ]);
                }
            }
        });

        filterCell = setup(dom, { dataSource: ds, field: "foo", suggestDataSource: ds.options });
        filterCell.suggestDataSource.read();
        var suggestedItems = filterCell.suggestDataSource.data();
        equal(suggestedItems.length, 2);
    });

    test("suggest dataSource shows only unique records when instance of dataSource is provided and it is not custom", function() {
        var ds = new kendo.data.DataSource({
            schema: {
                model: {
                    fields: {
                        foo: {
                            type: "string"
                        }
                    }
                }
            },
            transport: {
                read: function(options) {
                    options.success([
                        { foo: "1" },
                        { foo: "1" },
                        { foo: "2" }
                    ]);
                }
            }
        });

        filterCell = setup(dom, { dataSource: ds, field: "foo", suggestDataSource: ds, customDataSource: false });
        filterCell.suggestDataSource.read();
        var suggestedItems = filterCell.suggestDataSource.data();
        equal(suggestedItems.length, 2);
    });

    test("suggest dataSource shows only unique records when instance of dataSource is provided and it is not custom bound to nested field", function() {
        var ds = new kendo.data.DataSource({
            schema: {
                model: {
                    fields: {
                        foo: {
                            type: "string"
                        }
                    }
                }
            },
            transport: {
                read: function(options) {
                    options.success([
                        { bar: { foo: "1" } },
                        { bar: { foo: "1" } },
                        { bar: { foo: "2" } }
                    ]);
                }
            }
        });

        filterCell = setup(dom, { dataSource: ds, field: "bar.foo", suggestDataSource: ds, customDataSource: false });
        filterCell.suggestDataSource.read();
        var suggestedItems = filterCell.suggestDataSource.data();
        equal(suggestedItems.length, 2);
    });

    test("suggest dataSource shows all records when using inherited dataSource options", function() {
        var ds = new kendo.data.DataSource({
            schema: {
                model: {
                    fields: {
                        foo: {
                            type: "string"
                        }
                    }
                }
            },
            pageSize: 2,
            transport: {
                read: function(options) {
                    options.success([
                        { foo: "1" },
                        { foo: "1" },
                        { foo: "1" },
                        { foo: "2" },
                        { foo: "3" },
                        { foo: "3" }
                    ]);
                }
            }
        });

        filterCell = setup(dom, {
            dataSource: ds,
            field: "foo",
            suggestDataSource: ds.options
        });

        filterCell.suggestDataSource.read();
        var suggestedItems = filterCell.suggestDataSource.view();
        equal(suggestedItems.length, 3);
    });

    test("suggest dataSource shows all records when using inherited dataSource options", function() {
        var ds = new kendo.data.DataSource({
            schema: {
                model: {
                    fields: {
                        foo: {
                            type: "boolean"
                        }
                    }
                }
            }
        });

        filterCell = setup(dom, {
            dataSource: ds,
            field: "foo"
        });

        ds.filter({ field: "foo", operator: "eq", value: false});

        equal(filterCell.wrapper.find(":radio:checked").length, 1);

        ds.filter({});

        equal(filterCell.wrapper.find(":radio:checked").length, 0);
    });

    test("when isnull is selected, value of the input element is empty", function() {
        var dataSource = new kendo.data.DataSource({
        });

        filterCell = setup(dom, { dataSource: dataSource, field: "foo" });
        filterCell.viewModel.set("operator", "isnull");
        var filter = dataSource.filter();
        ok(filter.filters);
        equal(filter.logic, "and");
        var filters = filter.filters;
        equal(filters.length, 1);
        equal(filters[0].value, undefined);
        equal(filters[0].field, "foo");
        equal(filters[0].operator, "isnull");

        equal(filterCell.wrapper.find("input").val(), "");
    });

    test("triggers change event when filter is change passing current filter descriptor", 5, function() {
        var dataSource = new kendo.data.DataSource({});

        filterCell = setup(dom, {
            dataSource: dataSource,
            field: "foo",
            change: function(e) {
                equal(e.field, "foo");
                equal(e.filter.logic, "and");
                equal(e.filter.filters[0].value, "bar");
                equal(e.filter.filters[0].field, "foo");
                equal(e.filter.filters[0].operator, "eq");
            }
        });

        filterCell.viewModel.set("value", "bar");
    });

    test("preventing change event does not filter the dataSource", 1, function() {
        var dataSource = new kendo.data.DataSource({});

        filterCell = setup(dom, {
            dataSource: dataSource,
            field: "foo",
            change: function(e) {
                e.preventDefault();
            }
        });

        filterCell.viewModel.set("value", "bar");

        ok(!dataSource.filter());
    });

    test("clear triggers change event with null filter", 3, function() {
        var dataSource = new kendo.data.DataSource({});

        filterCell = setup(dom, {
            dataSource: dataSource,
            field: "foo",
            change: function(e) {
                equal(e.filter, null);
                equal(e.field, "foo");
            }
        });

        filterCell.clearFilter();

        ok(!dataSource.filter());
    });

})();
