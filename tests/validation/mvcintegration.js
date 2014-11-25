(function() {
   var container,
        Validator = kendo.ui.Validator;

    function setup(element, options) {
        if (!element.parent().length) {
            element.appendTo(container);
        }
        return new Validator(element, $.extend({}, options));
    }

    module("kendo.ui.validation.mvc", {
        setup: function() {
            container = $("<div/>").appendTo("<form/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);

            container.remove();
            window.mvcClientValidationMetadata = [];
        }
    });

    test("validate returns false for empty input with attribute required", function() {
        var input = $('<input type="text" data-val="true" data-val-required="foo" />').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns true for non empty input with attribute required", function() {
        var input = $('<input type="text" data-val="true" data-val-required="foo" />').appendTo(QUnit.fixture),
            validator = setup(input);

        input.val("someValue");

        ok(validator.validate());
    });

    test("validate returns true for non empty input with attribute required which is initially invalid", function() {
        var input = $('<input type="text" data-val="true" data-val-required="foo" />').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(!validator.validate());

        input.val("someValue");

        ok(validator.validate());
    });

    test("validate returns false if checkbox with special character marked as required is not checked", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" name="foo.bar" />'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if checkbox with complex special character marked as required with hidden", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" name="Sections[0].Settings[0].Value" />' +
            '<input name="Sections[0].Settings[0].Value" type="hidden" value="false" /> '));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate reutrns true if checkbox with label and hidden is marked required", function() {
        container.append(
            '<input type="checkbox" class="k-checkbox" data-val="true" data-val-required="foo" id="bar" name="bar" />' +
            '<label class="k-checkbox-label" for="bar">Bar label</label>' +
            '<input name="bar" type="hidden" value="false" /> '
        );
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if checkbox marked as required is not checked", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" />'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if checkbox marked as required is checked", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" checked="checked"/>'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if checkbox marked as required is not checked but have value set", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" value="foo"/>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if checkbox marked as required is checked and have value set", function() {
        container.append($('<input type="checkbox" data-val="true" data-val-required="foo" value="foo" checked="checked" />'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if multi select is marked as required and no value is selected", function() {
        container.append($('<select multiple data-val="true" data-val-required="foo"><option>foo</option></select>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if multi select is marked as required and value is selected", function() {
        container.append($('<select multiple data-val="true" data-val-required="foo"><option value="foo" selected="selected">foo</option></select>'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if select is marked as required and option with empty value is selected", function() {
        container.append($('<select data-val="true" data-val-required="foo"><option value="" selected="selected">foo</option></select>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("errors returns type specific message if attribute is set for single invalid element", function() {
        var input = $('<input type="text" data-val="true" data-val-required="required message" />').appendTo(QUnit.fixture),
            validator = setup(input);

        validator.validate();
        var messages = validator.errors();

        equal(messages.length, 1);
        equal(messages[0], "required message");
    });

    test("existing error message element container is reused", function() {
        container.append($('<input type="text" name="foo" required validationMessage="invalid" /><span>some text</span><span class="field-validation-valid" data-valmsg-for="foo" data-valmsg-replace="true"></span>')),
        validator = setup(container, { errorTemplate: "<span>${message}</span>" });
        validator.validate();

        var span = container.find("span");
        ok(!span.eq(0).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("field-validation-error"));
        ok(span.eq(1).text(), "invalid");
    });

    test("existing error message element with whitespaces in the name container is reused", function() {
        container.append($('<input type="text" name="foo bar" required validationMessage="invalid" /><span>some text</span><span class="field-validation-valid" data-valmsg-for="foo bar" data-valmsg-replace="true"></span>')),
        validator = setup(container, { errorTemplate: "<span>${message}</span>" });
        validator.validate();

        var span = container.find("span");
        ok(!span.eq(0).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("field-validation-error"));
        ok(span.eq(1).text(), "invalid");
    });

    test("validate returns true if input with type=text value does not match min attribute", function() {
        var input = $('<input type="text" value="11" data-val-range="The field Number must be between 10 and 20." data-val-range-max="20" data-val-range-min="10" />').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns false if input with type=number value does not match min attribute", function() {
        var input = $('<input type="number" value="1" data-val-range="The field Number must be between 10 and 20." data-val-range-max="20" data-val-range-min="10" />').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns false if input value does not match min attribute decimal", function() {
        var input = $('<input type="number" value="10" data-val-range="The field Number must be between 10 and 20." data-val-range-max="20" data-val-range-min="10.10"/>').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns false if input value is smaller than the min attribute when a culture with comma for the decimal separator is used", function() {
        var input = $('<input data-type="number" value="1,3" data-val-range="The field Number must be between 1,5 and 20." data-val-range-max="20" data-val-range-min="1.5"/>').appendTo(QUnit.fixture),
            validator = setup(input),
            culture = kendo.culture(),
            defaultDecimalSeparator = culture.numberFormat["."],
            defaultGroupSeparator = culture.numberFormat[","];

        culture.numberFormat["."] = ",";
        culture.numberFormat[","] = ".";


        ok(!validator.validate());

        culture.numberFormat["."] = defaultDecimalSeparator;
        culture.numberFormat[","] = defaultGroupSeparator;
    });

    test("validate returns true if input value is bigger than the min attribute when a culture with comma for the decimal separator is used", function() {
        var input = $('<input data-type="number" value="1,6" data-val-range="The field Number must be between 1,5 and 20." data-val-range-max="20" data-val-range-min="1.5"/>').appendTo(QUnit.fixture),
            validator = setup(input),
            culture = kendo.culture(),
            defaultDecimalSeparator = culture.numberFormat["."],
            defaultGroupSeparator = culture.numberFormat[","];

        culture.numberFormat["."] = ",";
        culture.numberFormat[","] = ".";


        ok(validator.validate());

        culture.numberFormat["."] = defaultDecimalSeparator;
        culture.numberFormat[","] = defaultGroupSeparator;
    });

    test("validate returns true if input is empty and range validation is enabled", function() {
        var input = $('<input type="number" data-val-range="The field Number must be between 10 and 20." data-val-range-max="20" data-val-range-min="10.10"/>').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if input value does have same value as max attribute", function() {
        var input = $('<input type="number" value="10" data-val-range="The field Number must be between 10 and 20." data-val-range-max="10" data-val-range-min="10"/>').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns false if input does not match max attribute", function() {
        var input = $('<input type="text" value="11" data-val-range="The field Number must be between 10 and 20." data-val-range-max="10" data-val-range-min="10" />').appendTo(QUnit.fixture),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns false if input value is bigger than the max attribute when a culture with comma for the decimal separator is used", function() {
        var input = $('<input data-type="number" value="20,6" data-val-range="The field Number must be between 10 and 20,5." data-val-range-max="20.5" data-val-range-min="1.5"/>').appendTo(QUnit.fixture),
            validator = setup(input),
            culture = kendo.culture(),
            defaultDecimalSeparator = culture.numberFormat["."],
            defaultGroupSeparator = culture.numberFormat[","];

        culture.numberFormat["."] = ",";
        culture.numberFormat[","] = ".";


        ok(!validator.validate());

        culture.numberFormat["."] = defaultDecimalSeparator;
        culture.numberFormat[","] = defaultGroupSeparator;
    });

    test("validate returns true if input value is smaller than the max attribute when a culture with comma for the decimal separator is used", function() {
        var input = $('<input data-type="number" value="20,4" data-val-range="The field Number must be between 10 and 20,5." data-val-range-max="20.5" data-val-range-min="1.5"/>').appendTo(QUnit.fixture),
            validator = setup(input),
            culture = kendo.culture(),
            defaultDecimalSeparator = culture.numberFormat["."],
            defaultGroupSeparator = culture.numberFormat[","];

        culture.numberFormat["."] = ",";
        culture.numberFormat[","] = ".";


        ok(validator.validate());

        culture.numberFormat["."] = defaultDecimalSeparator;
        culture.numberFormat[","] = defaultGroupSeparator;
    });

    test("validate returns false if input with type=text value does not match pattern attribute", function() {
        var input = $('<input type="text" value="aaa" data-val-regex="message" data-val-regex-pattern="\\d"/>'),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns true if input with type=text value does match pattern attribute", function() {
        var input = $('<input type="text" value="6" data-val-regex="message" data-val-regex-pattern="\\d"/>'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true for empty input with attribute data-val-regex", function() {
        var input = $('<input type="text" value="" data-val-regex="message" data-val-regex-pattern="\\d"/>'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if input with type=text value is number", function() {
        var input = $('<input type="text" value="6" data-val-number="message" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if select value is number with no selected option", function() {
        var input = $('<select data-val-number="message"><option>1</option></select>'),
            validator = setup(input);

        input[0].selectedIndex = 42;

        ok(validator.validate());
    });

    test("validate returns true if select value is number with no selected option", function() {
        var input = $('<select data-val-number="message"></select>'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns false if input with type=text value is not a number", function() {
        var input = $('<input type="text" value="foo" data-val-number="message" />'),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("number is not validated if input is empty", function() {
        var input = $('<input type="text" value="" data-val-number="message" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("date is not validated if input is empty", function() {
        var input = $('<input type="text" value="" data-val-date="message" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if input with type=text value is date", function() {
        var input = $('<input type="text" value="1/2/2012" data-val-date="message" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns false if input with type=text value is not a date", function() {
        var input = $('<input type="text" value="foo" data-val-date="message" />'),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns false if input value length is greated than the specified value", function() {
        var input = $('<input type="text" value="foo" data-val-length="message" data-val-length-max="2"/>'),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns true if input value length matches the specified value", function() {
        var input = $('<input type="text" value="foo" data-val-length="message" data-val-length-max="3"/>'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if input max and min length attributes are missing", function() {
        var input = $('<input type="text" value="foo" data-val-length="message" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns false if input max length attribute is missing but min is specified and not matched", function() {
        var input = $('<input type="text" value="foo" data-val-length="message" data-val-length-min="4" />'),
            validator = setup(input);

        ok(!validator.validate());
    });

    test("validate returns true if input max length attribute is missing but min is specified and is matched", function() {
        var input = $('<input type="text" value="foo" data-val-length="message" data-val-length-min="3" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    test("validate returns true if input with data-val-length attribute does not have value", function() {
        var input = $('<input type="text" value="" data-val-length="message" data-val-length-min="3" />'),
            validator = setup(input);

        ok(validator.validate());
    });

    module("kendo.ui.validation.mvc metadata validation", {
        setup: function() {
            container = $('<div id="container"/>').appendTo("<form/>").appendTo(QUnit.fixture);
        },
        teardown: function() {
            kendo.destroy(QUnit.fixture);
            container.remove();
            window.mvcClientValidationMetadata = [];
        }
    });

    function addRule(fieldName, ruleName, message, params) {
        window.mvcClientValidationMetadata = [];

        window.mvcClientValidationMetadata.push({
            "Fields":[{
                "FieldName":fieldName,
                "ReplaceValidationMessageContents":true,
                "ValidationMessageId": fieldName + "_validationMessage",
                "ValidationRules":[
                    {"ErrorMessage":message,"ValidationParameters":params,"ValidationType":ruleName}
                ]
            }],
            "FormId":"container","ReplaceValidationSummary":false
        });
    }

    test("validate returns false for empty input with attribute required", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="text" name="foo" />'));

        var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns true for non empty input with attribute required", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="text" name="foo" />'));
        var validator = setup(container);

        container.find("input").val("someValue");

        ok(validator.validate());
    });

    test("validate returns true for non empty input with attribute required which is initially invalid", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="text" name="foo" />'));
        var  validator = setup(container);

        ok(!validator.validate());

        container.find("input").val("someValue");

        ok(validator.validate());
    });

    test("validate returns false if checkbox marked as required is not checked", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="checkbox" name="foo" />'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if checkbox marked as required is checked", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="checkbox" name="foo" checked="checked"/>'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if checkbox marked as required is not checked but have value set", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="checkbox" name="foo" value="foo"/>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if checkbox marked as required is checked and have value set", function() {
        addRule("foo", "required", "message", {});

        container.append($('<input type="checkbox" name="foo" value="foo" checked="checked" />'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if multi select is marked as required and no value is selected", function() {
        addRule("foo", "required", "message", {});

        container.append($('<select multiple name="foo"><option>foo</option></select>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("validate returns true if multi select is marked as required and value is selected", function() {
        addRule("foo", "required", "message", {});

        container.append($('<select multiple name="foo"><option value="foo" selected="selected">foo</option></select>'));
        var validator = setup(container);
        ok(validator.validate());
    });

    test("validate returns false if select is marked as required and option with empty value is selected", function() {
        addRule("foo", "required", "message", {});

        container.append($('<select name="foo"><option value="" selected="selected">foo</option></select>'));
        var validator = setup(container);
        ok(!validator.validate());
    });

    test("errors returns type specific message if attribute is set for single invalid element", function() {
        addRule("foo", "required", "required message", {});

        container.append($('<input type="text" name="foo" />'));
        var validator = setup(container);

        validator.validate();
        var messages = validator.errors();

        equal(messages.length, 1);
        equal(messages[0], "required message");
    });

    test("existing error message element container is reused", function() {
        addRule("foo", "required", "required message", {});

        container.append($('<input type="text" name="foo" /><span>some text</span><span class="field-validation-valid" id="foo_validationMessage"></span>')),
        validator = setup(container, { errorTemplate: "<span>${message}</span>" });
        validator.validate();

        var span = container.find("span");
        ok(!span.eq(0).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("k-invalid-msg"));
        ok(span.eq(1).hasClass("field-validation-error"));
        ok(span.eq(1).text(), "invalid");
    });

    test("validate returns true if input with type=text value does not match min attribute", function() {
        addRule("foo", "range", "message", { min: 10, max: 20});

        container.append($('<input type="text" value="11" name="foo" />'));
        var validator = setup(container);

        ok(validator.validate());
    });

    test("validate returns false if input with type=number value does not match min attribute", function() {
        addRule("foo", "range", "message", { min: 10, max: 20});

        container.append($('<input type="text" value="1" name="foo" />'));
        var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns false if input value does not match min attribute decimal", function() {
        addRule("foo", "range", "message", { min: 10.10, max: 20});

         container.append($('<input type="number" name="foo" value="10"/>'));
         var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns true if input value does have same value as max attribute", function() {
        addRule("foo", "range", "message", { min: 10, max: 10});

        container.append($('<input type="number" name="foo" value="10"/>'));
        var validator = setup(container);

        ok(validator.validate());
    });

    test("validate returns false if input does not match max attribute", function() {
        addRule("foo", "range", "message", { min: 10, max: 10});

        container.append($('<input type="text" name="foo" value="11"/>'));
        var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns false if input with type=text value does not match pattern attribute", function() {
        addRule("foo", "regex", "message", { pattern: "\\d"});

        container.append($('<input type="text" name="foo" value="aaa"/>'));
        var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns true if input with type=text value does match pattern attribute", function() {
        addRule("foo", "regex", "message", { pattern: "\\d"});

        container.append($('<input type="text" value="6" name="foo"/>'));
        var validator = setup(container);

        ok(validator.validate());
    });

    test("validate returns true if input with type=text value is number", function() {
        addRule("foo", "number", "message", { });

        container.append($('<input type="text" value="6" name="foo" />'));
        var validator = setup(container);

        ok(validator.validate());
    });

    test("validate returns false if input with type=text value is not a number", function() {
        addRule("foo", "number", "message", { });

        container.append($('<input type="text" value="foo" name="foo" />'));
        var validator = setup(container);

        ok(!validator.validate());
    });

    test("validate returns true if input with type=text value is date", function() {
        addRule("foo", "date", "message", { });

        container.append($('<input type="text" value="1/2/2012" name="foo" />'));
        var validator = setup(container);

        ok(validator.validate());
    });

    test("validate returns false if input with type=text value is not a date", function() {
        addRule("foo", "date", "message", { });

        container.append($('<input type="text" value="foo" name="foo" />'));
        var validator = setup(container);

        ok(!validator.validate());
    });

})();
