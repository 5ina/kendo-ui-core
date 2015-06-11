(function() {
    var WEEK_DAYS = {
        0: "SU",
        1: "MO",
        2: "TU",
        3: "WE",
        4: "TH",
        5: "FR",
        6: "SA"
    };

    var RecurrenceEditor = kendo.ui.RecurrenceEditor,
        div;

    module("kendo.ui.RecurrenceEditor initialization", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("kendoRecurrenceEditor attaches a reccurrenceEditor object to target", function() {
        div.kendoRecurrenceEditor();

       ok(div.data("kendoRecurrenceEditor") instanceof RecurrenceEditor);
    });

    test("kendoRecurrenceEditor overrides frequencies", function() {
        var widget = div.kendoRecurrenceEditor({
            frequencies: ["never", "daily"]
        }).data("kendoRecurrenceEditor");

        var freq = widget.options.frequencies;

        equal(freq.length, 2);
        equal(freq[0], "never");
        equal(freq[1], "daily");
    });

    test("renders dropdownlist for frequencies", function() {
        div.kendoRecurrenceEditor();

        var ddl = div.find("[data-role=dropdownlist]").data("kendoDropDownList");

        ok(ddl);
        ok(ddl.ul.children());
        equal(ddl.value(), "");
        equal(ddl.select(), 0);
    });

    test("changing frequency changes value of the widget", function() {
        var editor = new RecurrenceEditor(div, {
            frequencies: [
                "never",
                "hourly"
            ]
        });
        var ddl = div.find("[data-role=dropdownlist]").data("kendoDropDownList");

        ddl.value("hourly");
        ddl.trigger("change");

        equal(editor.value(), "FREQ=HOURLY");
    });

    test("changing frequency changes value of the widget", function() {
        var editor = new RecurrenceEditor(div);
        var ddl = div.find("[data-role=dropdownlist]").data("kendoDropDownList");

        ddl.value("daily");
        ddl.trigger("change");

        equal(editor.value(), "FREQ=DAILY");
    });

    test("changing frequency to never clears view and value", function() {
        var editor = new RecurrenceEditor(div);
        var ddl = div.find("[data-role=dropdownlist]").data("kendoDropDownList");

        ddl.value("daily");
        ddl.trigger("change");

        ddl.select(0);
        ddl.trigger("change");

        equal(editor.value(), "");
        equal(editor._container.html(), "");
    });

    test("changing frequency resets widget value", function() {
        var editor = new RecurrenceEditor(div, {
            value: "FREQ=WEEKLY;BYDAY=MO,TU,WE"
        });
        var ddl = div.find("[data-role=dropdownlist]").data("kendoDropDownList");

        ddl.value("daily");
        ddl.trigger("change");

        equal(editor.value(), "FREQ=DAILY");
    });

    test("renders frequency view container", function() {
        div.kendoRecurrenceEditor();

        var container = div.find(".k-recur-view");

        ok(container[0]);
    });

    module("kendo.ui.RecurrenceEditor Daily view", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("Render interval input with default value in hourly freq", function() {
        var editor = new RecurrenceEditor(div, {
            frequencies: [
                "never",
                "hourly"
            ]
        });
        editor._initView("hourly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        ok(interval);
        equal(interval.value(), 1);
    });

    test("Render interval input with default value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("daily");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        ok(interval);
        equal(interval.value(), 1);
    });

    test("Change interval updates widget value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("daily");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(3);
        interval.trigger("change");

        equal(editor.value(), "FREQ=DAILY;INTERVAL=3");
    });

    test("Clears value of the interval is equal to 1", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("daily");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(null);
        interval.trigger("change");

        equal(editor.value(), "FREQ=DAILY"); //default value of INTERVAL is 1
    });

    test("All end inputs are disabled if never radio is checked", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("daily");

        var radio = div.find(".k-recur-end-never,.k-recur-end-until,.k-recur-end-count").filter(":checked"),
            until = div.find(".k-recur-until:input"),
            count = div.find(".k-recur-count:input");

        equal(radio.length, 1);
        equal(radio.val(), "never");
        equal(until.prop("disabled"), true);
        equal(count.prop("disabled"), true);
    });

    test("Select count radio sets count value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("daily");

        editor._buttonCount.click();

        equal(editor.value(), "FREQ=DAILY;COUNT=1"); //default value of INTERVAL is 1
    });

    test("Select until radio sets until value (no timezone)", function() {
        var editor = new RecurrenceEditor(div),
            date = kendo.date.today(),
            normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        editor._initView("daily");
        editor._buttonUntil.click();

        normalizedDate = kendo.timezone.apply(normalizedDate, 0);

        equal(editor.value(), "FREQ=DAILY;UNTIL=" + kendo.toString(normalizedDate, "yyyyMMddTHHmmssZ"));
    });

    test("Select until radio and change datePicker value sets until value correctly vld old", function() {
        var editor = new RecurrenceEditor(div),
            date = kendo.date.today();

        editor._initView("daily");
        editor._buttonUntil.click();
        editor._until.trigger("change");

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        date = kendo.timezone.apply(date, 0);

        equal(editor.value(), "FREQ=DAILY;UNTIL=" + kendo.toString(date, "yyyyMMddTHHmmssZ"));
    });

    test("Until datepicker uses start value as min", function() {
        var date = kendo.date.today();
        var editor = new RecurrenceEditor(div, { start: date });

        editor._initView("daily");

        equal(editor._until.min().getTime(), date.getTime());
    });

    test("Select until radio sets until value (Etc/UTC zone)", function() {
        var editor = new RecurrenceEditor(div, {
                timezone: "Etc/UTC"
            }),
            date = kendo.date.today();


        editor._initView("daily");
        editor._buttonUntil.click();

        var normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        equal(editor.value(), "FREQ=DAILY;UNTIL=" + kendo.toString(normalizedDate, "yyyyMMddTHHmmssZ"));
    });

    module("kendo.ui.RecurrenceEditor Weekly view", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("Render interval input with default value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("weekly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        ok(interval);
        equal(interval.value(), 1);
    });

    test("Change interval updates widget value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("weekly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(3);
        interval.trigger("change");

        equal(editor.value(), "FREQ=WEEKLY;INTERVAL=3;BYDAY=FR");
    });

    test("Clears value of the interval is equal to 1", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("weekly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(null);
        interval.trigger("change");

        equal(editor.value(), "FREQ=WEEKLY;BYDAY=FR"); //default value of INTERVAL is 1
    });

    test("All end inputs are disabled if never radio is checked", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("weekly");

        var radio = div.find(".k-recur-end-never,.k-recur-end-until,.k-recur-end-count").filter(":checked"),
            until = div.find(".k-recur-until:input"),
            count = div.find(".k-recur-count:input");

        equal(radio.length, 1);
        equal(radio.val(), "never");
        equal(until.prop("disabled"), true);
        equal(count.prop("disabled"), true);
    });

    test("Select count radio sets count value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("weekly");

        editor._buttonCount.click();

        equal(editor.value(), "FREQ=WEEKLY;COUNT=1;BYDAY=FR"); //default value of INTERVAL is 1
    });

    test("Select until radio sets until value (no timezone)", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("weekly");
        editor._buttonUntil.click();

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        date = kendo.timezone.apply(date, 0);

        equal(editor.value(), "FREQ=WEEKLY;UNTIL=" + kendo.toString(date, "yyyyMMddTHHmmssZ") + ";BYDAY=FR");
    });

    test("Render weekdays", function() {
        var editor = new RecurrenceEditor(div),
            date = kendo.date.today();

        editor._initView("weekly");

        var checkboxes = editor._container.find("input[type=checkbox]");

        equal(checkboxes.length, 7);
    });

    test("Take into account firstWeekDay option", function() {
        var editor = new RecurrenceEditor(div, { firstWeekDay: 6 }),
            date = kendo.date.today();

        editor._initView("weekly");

        var checkboxes = editor._container.find("input[type=checkbox]");

        equal(checkboxes.eq(0).val(), "6");
    });

    test("Take into account firstWeekDay option when check the input", function() {
        var editor = new RecurrenceEditor(div, {
            firstWeekDay: 1,
            start: new Date(2013, 7, 27)
        }),
        date = kendo.date.today();

        editor._initView("weekly");

        var checkboxes = editor._container.find("input[type=checkbox]:checked");

        equal(checkboxes.eq(0).val(), "2");
    });

    test("Use day of event start date to check correct checkbox", function() {
        var date = kendo.date.today(),
            editor = new RecurrenceEditor(div, {
                start: date
            });

        editor._initView("weekly");

        var checkboxes = editor._container.find("input[type=checkbox]:checked");

        equal(checkboxes.eq(0).val(), date.getDay());
    });

    module("kendo.ui.RecurrenceEditor Monthly view", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("Render interval input with default value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("monthly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        ok(interval);
        equal(interval.value(), 1);
    });

    test("Change interval updates widget value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("monthly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(3);
        interval.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=14");
    });

    test("Clears value of the interval is equal to 1", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("monthly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(null);
        interval.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYMONTHDAY=14"); //default value of INTERVAL is 1
    });

    test("All end inputs are disabled if never radio is checked", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("monthly");

        var radio = div.find(".k-recur-end-never,.k-recur-end-until,.k-recur-end-count").filter(":checked"),
            until = div.find(".k-recur-until:input"),
            count = div.find(".k-recur-count:input");

        equal(radio.length, 1);
        equal(radio.val(), "never");
        equal(until.prop("disabled"), true);
        equal(count.prop("disabled"), true);
    });

    test("Select count radio sets count value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("monthly");

        editor._buttonCount.click();

        equal(editor.value(), "FREQ=MONTHLY;COUNT=1;BYMONTHDAY=14"); //default value of INTERVAL is 1
    });

    test("Select until radio sets until value (no timezone)", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("monthly");
        editor._buttonUntil.click();

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        date = kendo.timezone.apply(date, 0);

        equal(editor.value(), "FREQ=MONTHLY;UNTIL=" + kendo.toString(date, "yyyyMMddTHHmmssZ") + ";BYMONTHDAY=14");
    });

    test("Render inputs to handle bymonthday and byday options", function() {
        var editor = new RecurrenceEditor(div),
            container = editor._container;

        editor._initView("monthly");

        var radioButton = container.find("[type=radio].k-recur-month-radio");
        var numericMonthDay = container.find(".k-recur-monthday");
        var ddlOffset = container.find(".k-recur-weekday-offset");
        var ddlWeekDay = container.find(".k-recur-weekday");

        equal(radioButton.length, 2);
        ok(numericMonthDay[0]);
        ok(ddlOffset[0]);
        ok(ddlWeekDay[0]);
    });

    test("Render weekdays options along with week names", function() {
        var editor = new RecurrenceEditor(div),
            container = editor._container;

        editor._initView("monthly");

        var ddlWeekDay = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        var data = ddlWeekDay.dataSource.data();

        equal(data[0].value, "day");
        equal(data[1].value, "weekday");
        equal(data[2].value, "weekend");

        equal(data[0].text, "day");
        equal(data[1].text, "weekday");
        equal(data[2].text, "weekend day");
    });

    test("Initialize monthday numeric", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");

        var numericMonthDay = container.find("[data-role=numerictextbox].k-recur-monthday"),
            numeric = numericMonthDay.data("kendoNumericTextBox");

        ok(numeric);
        equal(numeric.min(), 1);
        equal(numeric.max(), 31);
        equal(numeric.value(), today.getDate());
    });

    test("Update monthdays rule on monthday numeric change", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");

        var numericMonthDay = container.find("[data-role=numerictextbox].k-recur-monthday"),
            numeric = numericMonthDay.data("kendoNumericTextBox");

        numeric.value(20);
        numeric.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYMONTHDAY=20");
    });

    test("Initialize week day widgets", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._value.weekDays = [
            { offset: 3, day: 6 }
        ];

        editor._initView("monthly");

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        ok(offset);
        ok(weekday);

        equal(offset.value(), "3");
        equal(weekday.value(), "6");
    });

    test("Update week day rule", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");
        container.find(".k-recur-month-radio:last").click();

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        offset.value("-1");
        offset.trigger("change");
        weekday.value("0");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYDAY=-1SU");

        weekday.value("3");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYDAY=-1WE");
    });

    test("Update week day rule to repeat on first weekday", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");
        container.find(".k-recur-month-radio:last").click();

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        offset.value("1");
        weekday.value("day");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYSETPOS=1");
    });

    test("Update week day rule to repeat on first work day", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");
        container.find(".k-recur-month-radio:last").click();

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        offset.value("1");
        weekday.value("weekday");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1");
    });

    test("Update week day rule to repeat on first weekend", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");
        container.find(".k-recur-month-radio:last").click();

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        offset.value("1");
        weekday.value("weekend");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=MONTHLY;BYDAY=SU,SA;BYSETPOS=1");
    });

    test("On initial render enable monthday and disable weekday", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");

        var numeric = container.find("[data-role=numerictextbox].k-recur-monthday"),
            offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset"),
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday");

        equal(numeric.prop("disabled"), false);
        equal(offset.prop("disabled"), true);
        equal(weekday.prop("disabled"), true);

        equal(editor.value(), "FREQ=MONTHLY;BYMONTHDAY=" + today.getDate());
    });

    test("Select weekday disables monthday", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("monthly");

        container.find(".k-recur-month-radio:last").click();

        var numeric = container.find("[data-role=numerictextbox].k-recur-monthday"),
            offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset"),
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday");

        var day = WEEK_DAYS[today.getDay()];

        equal(numeric.prop("disabled"), true);
        equal(offset.prop("disabled"), false);
        equal(weekday.prop("disabled"), false);
        equal(editor.value(), "FREQ=MONTHLY;BYDAY=1" + day);
    });

    module("kendo.ui.RecurrenceEditor Yearly view", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("Render interval input with default value", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("yearly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        ok(interval);
        equal(interval.value(), 1);
    });

    test("Change interval updates widget value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("yearly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(3);
        interval.trigger("change");

        equal(editor.value(), "FREQ=YEARLY;INTERVAL=3;BYMONTH=" + (date.getMonth() + 1) + ";BYMONTHDAY=14");
    });

    test("Clears value of the interval is equal to 1", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("yearly");

        var interval = div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox");

        interval.value(null);
        interval.trigger("change");

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + (date.getMonth() + 1) + ";BYMONTHDAY=14"); //default value of INTERVAL is 1
    });

    test("All end inputs are disabled if never radio is checked", function() {
        var editor = new RecurrenceEditor(div);
        editor._initView("yearly");

        var radio = div.find(".k-recur-end-never,.k-recur-end-until,.k-recur-end-count").filter(":checked"),
            until = div.find(".k-recur-until:input"),
            count = div.find(".k-recur-count:input");

        equal(radio.length, 1);
        equal(radio.val(), "never");
        equal(until.prop("disabled"), true);
        equal(count.prop("disabled"), true);
    });

    test("Select count radio sets count value", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("yearly");

        editor._buttonCount.click();

        equal(editor.value(), "FREQ=YEARLY;COUNT=1;BYMONTH=" + (date.getMonth() + 1) + ";BYMONTHDAY=14");
    });

    test("Select until radio sets until value (no timezone)", function() {
        var date = new Date(2013, 5, 14),
            editor = new RecurrenceEditor(div, { start: date });

        editor._initView("yearly");
        editor._buttonUntil.click();

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        date = kendo.timezone.apply(date, 0);

        equal(editor.value(), "FREQ=YEARLY;UNTIL=" + kendo.toString(date, "yyyyMMddTHHmmssZ") + ";BYMONTH=" + (date.getMonth() + 1) + ";BYMONTHDAY=14");
    });

    test("Render inputs to handle bymonthday and byday options", function() {
        var editor = new RecurrenceEditor(div),
            container = editor._container;

        editor._initView("yearly");

        var radioButton = container.find("[type=radio].k-recur-year-radio");
        var numericMonthDay = container.find(".k-recur-monthday");
        var ddlOffset = container.find(".k-recur-weekday-offset");
        var ddlWeekDay = container.find(".k-recur-weekday");

        equal(radioButton.length, 2);
        ok(numericMonthDay[0]);
        ok(ddlOffset[0]);
        ok(ddlWeekDay[0]);
    });

    test("Initialize monthday numeric", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("yearly");

        var numericMonthDay = container.find("[data-role=numerictextbox].k-recur-monthday"),
            numeric = numericMonthDay.data("kendoNumericTextBox");

        ok(numeric);
        equal(numeric.min(), 1);
        equal(numeric.max(), 31);
        equal(numeric.value(), today.getDate());
    });

    test("Update monthdays rule on monthday numeric change", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("yearly");

        var numericMonthDay = container.find("[data-role=numerictextbox].k-recur-monthday"),
            numeric = numericMonthDay.data("kendoNumericTextBox");

        numeric.value(20);
        numeric.trigger("change");

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + (today.getMonth() + 1) + ";BYMONTHDAY=20");
    });

    test("Initialize week day widgets", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._value.weekDays = [
            { offset: 3, day: 6 }
        ];

        editor._initView("yearly");

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        ok(offset);
        ok(weekday);

        equal(offset.value(), "3");
        equal(weekday.value(), "6");
    });

    test("Update week day rule", function() {
        var today = kendo.date.today(),
            month = today.getMonth() + 1,
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("yearly");
        container.find(".k-recur-year-radio:last").click();

        var offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset").data("kendoDropDownList")
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday").data("kendoDropDownList");

        offset.value("-1");
        offset.trigger("change");

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + month + ";BYDAY=-1" + WEEK_DAYS[today.getDay()]);

        weekday.value("3");
        weekday.trigger("change");

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + month + ";BYDAY=-1WE");
    });

    test("On initial render enable monthday and disable weekday", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("yearly");

        var numeric = container.find("[data-role=numerictextbox].k-recur-monthday"),
            offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset"),
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday"),
            monthFirst = container.find("[data-role=dropdownlist].k-recur-month:first"),
            monthLast = container.find("[data-role=dropdownlist].k-recur-month:last");

        equal(monthFirst.prop("disabled"), false);
        equal(numeric.prop("disabled"), false);
        equal(offset.prop("disabled"), true);
        equal(weekday.prop("disabled"), true);
        equal(monthLast.prop("disabled"), true);

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + (today.getMonth() + 1) + ";BYMONTHDAY=" + today.getDate());
    });

    test("Select weekday disables monthday", function() {
        var today = kendo.date.today(),
            editor = new RecurrenceEditor(div, { start: today }),
            container = editor._container;

        editor._initView("yearly");

        container.find(".k-recur-year-radio:last").click();

        var numeric = container.find("[data-role=numerictextbox].k-recur-monthday"),
            offset = container.find("[data-role=dropdownlist].k-recur-weekday-offset"),
            weekday = container.find("[data-role=dropdownlist].k-recur-weekday"),
            monthFirst = container.find("[data-role=dropdownlist].k-recur-month:first"),
            monthLast = container.find("[data-role=dropdownlist].k-recur-month:last");


        equal(monthFirst.prop("disabled"), true);
        equal(numeric.prop("disabled"), true);
        equal(offset.prop("disabled"), false);
        equal(weekday.prop("disabled"), false);
        equal(monthLast.prop("disabled"), false);

        equal(editor.value(), "FREQ=YEARLY;BYMONTH=" + (today.getMonth() + 1) + ";BYDAY=1" + WEEK_DAYS[today.getDay()]);
    });

    module("kendo.ui.RecurrenceEditor API", {
        setup: function() {
            div = $("<div>");
        },
        teardown: function() {
            kendo.destroy(div);
        }
    });

    test("value method sets frequency ddl value", function() {
        var editor = new RecurrenceEditor(div);
        editor.value("FREQ=DAILY");

        equal(editor._frequency.value(), "daily");
    });

    test("value method sets interval if valid frequency", function() {
        var editor = new RecurrenceEditor(div);
        editor.value("FREQ=DAILY;INTERVAL=2");

        equal(div.find("[data-role=numerictextbox].k-recur-interval").data("kendoNumericTextBox").value(), 2);
    });

    test("value method sets end rule to never", function() {
        var editor = new RecurrenceEditor(div);
        editor.value("FREQ=DAILY");

        ok(editor._buttonNever.prop("checked"));
    });

    test("value method sets end rule to count", function() {
        var editor = new RecurrenceEditor(div);
        editor.value("FREQ=DAILY;COUNT=10");

        ok(editor._buttonCount.prop("checked"));
        equal(div.find("[data-role=numerictextbox].k-recur-count").data("kendoNumericTextBox").value(), 10);
    });

    test("value method sets end rule to until (no timezone)", function() {
        var editor = new RecurrenceEditor(div),
            until = kendo.parseDate("20130615T000000Z", "yyyyMMddTHHmmsszz");

        editor.value("FREQ=DAILY;UNTIL=20130615T000000Z");

        ok(editor._buttonUntil.prop("checked"));
        deepEqual(div.find("[data-role=datepicker].k-recur-until").data("kendoDatePicker").value(), until);
    });

})();
