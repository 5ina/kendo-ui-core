---
title: Range
page_title: Configuration, methods and events of Kendo UI Spreadsheet Range Instance object
---

# kendo.spreadsheet.Range

Represents one or more rectangular regions of cells in a given [Sheet](/api/javascript/spreadsheet/sheet). Inherits from [Class](/api/javascript/class).

An instance of a range object may be obtained as a return value from the Sheet [range](/api/javascript/spreadsheet/sheet#methods-range) or [selection](/api/javascript/spreadsheet/sheet#methods-selection) methods.

## Methods

### borderBottom

Gets or sets the state of the bottom border of the cells. If the range includes more than a single cell, the setting is applied to all cells.

#### Parameters

##### value `Object` *optional*

The border configuration object. It may contain `size` and `color` keys.

The `color` may be set to any valid [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
The `size` accepts any valid [Length value](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A2:B3").borderBottom({ size: "2px", color: "green" });
    </script>
```

### borderLeft

Gets or sets the state of the left border of the cells. If the range includes more than a single cell, the setting is applied to all cells.

#### Parameters

##### value `Object` *optional*

The border configuration object. It may contain `size` and `color` keys.

The `color` may be set to any valid [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
The `size` accepts any valid [Length value](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A2:B3").borderLeft({ size: "2px", color: "green" });
    </script>
```

### borderRight

Gets or sets the state of the right border of the cells. If the range includes more than a single cell, the setting is applied to all cells.

#### Parameters

##### value `Object` *optional*

The border configuration object. It may contain `size` and `color` keys.

The `color` may be set to any valid [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
The `size` accepts any valid [Length value](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A2:B3").borderRight({ size: "2px", color: "green" });
    </script>
```

### borderTop

Gets or sets the state of the top border of the cells. If the range includes more than a single cell, the setting is applied to all cells.

#### Parameters

##### value `Object` *optional*

The border configuration object. It may contain `size` and `color` keys.

The `color` may be set to any valid [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).
The `size` accepts any valid [Length value](https://developer.mozilla.org/en-US/docs/Web/CSS/length).

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A2:B3").borderTop({ size: "2px", color: "green" });
    </script>
```

### clear

Clears the contents of the range cells.

#### Parameters

##### options `Object` *optional*

An object which may contain `contentsOnly: true` or `formatOnly: true` key values. Clearing the format will remove the cell formatting and visual styles.

If a parameter is not passed, the method will clear both the cells values and the formatting.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1").value(1);
        sheet.range("A2").value(2);
        sheet.range("A1:A2").clear();
    </script>
```

### clearFilter

Clears the set filters for the given column(s). The indices is relative to the beginning of the range.

#### Parameters

##### indices `Array | Number`

The column(s) which filters should be cleared.

#### Example - clear the filters for a column

```html
    <div id="spreadsheet"></div>

    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ "C 1", "C 2", "C 3" ],
            [ 7, 5, 6 ],
            [ 7, 8, 9 ],
            [ 6, 3, 9 ]
        ];

        sheet.range("A1:C4").values(values);

        var filter = new kendo.spreadsheet.ValueFilter({ values: [ 7 ] });
        var filter2 = new kendo.spreadsheet.ValueFilter({ values: [ 8 ] });

        sheet.range("A1:C4").filter([
          { column: 0, filter: filter },
            { column: 1, filter: filter2 }
        ]);

        // row 3 will be visible now.

        sheet.range("A1:C3").clearFilter([ 1 ]);
        // the filter on B column will be cleared, so rows 2 and 3 will be visible.
    </script>

```

### filter

Enables/disables or sets the filter for a given range.

#### Parameters

##### filter `Boolean | Object | Array`

Determines the action performed by the method.

* Passing `true` enables the filtering for the given range.
* Passing `false` disables and clears the set filters.
* Passing a `{ column: Number, filter: kendo.spreadsheet.Filter }` object applies the filter to the respective column.
* Passing an array of `{ column: Number, filter: kendo.spreadsheet.Filter }` objects applies each filter to the respective column. The column index is relative to the beginning of the range.

#### Example - enable filter

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        sheet.range("A1:C3").values(values);

        sheet.range("A1:C3").filter(true);
    </script>
```

#### Example - disable filter
```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        sheet.range("A1:C3").values(values);

        sheet.range("A1:C3").filter(true);
        sheet.range("A1:C3").filter(false);
    </script>
```

#### Example - set filter
```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        var values = [
            [ "C 1", "C 2", "C 3" ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        sheet.range("A1:C3").values(values);

        var filter = new kendo.spreadsheet.ValueFilter({ values: [ 7 ] });

        sheet.range("A1:C3").filter({ column: 0, filter: filter });
    </script>
```

#### Example - set multiple filters

```html

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ "C 1", "C 2", "C 3" ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        sheet.range("A1:C3").values(values);

        var filter = new kendo.spreadsheet.ValueFilter({ values: [ 7 ] });
        var filter2 = new kendo.spreadsheet.ValueFilter({ values: [ 8 ] });

        sheet.range("A1:C3").filter([
            { column: 0, filter: filter },
            { column: 1, filter: filter2 }
        ]);
    </script>

```


### format

Gets or sets the format of the cells.

#### Parameters

##### format `String` *optional*

The new format for the cells.

#### Returns

`String` the format of the top-left cell of the range.  When used as a
setter, `format` returns the Range object to allow chained calls.

More details about the supported format may be found in [the cell formatting help topic](/web/spreadsheet/format).

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1").value(12.3456).format("#.###");
    </script>
```

### formula

Gets or sets the formula of the cells.

#### Parameters

##### formula `String` *optional*

The new formula of the cell. The string may optionally start with `=`.

#### Returns

`String` the formula of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1").input("1000");
        sheet.range("A2").formula("A1*2");
        console.log(sheet.range("A2").formula()); // "A1*2"
    </script>
```

### hasFilter

Returns `true` if the sheet of the range has filter enabled.

#### Returns

`Boolean` `true` if the sheet has a filter, `false` otherwise.

#### Example - clear the filters for a column

```html
    <div id="spreadsheet"></div>

    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ "C 1", "C 2", "C 3" ],
            [ 7, 5, 6 ],
            [ 7, 8, 9 ],
            [ 6, 3, 9 ]
        ];

        sheet.range("A1:C4").values(values);

        var filter = new kendo.spreadsheet.ValueFilter({ values: [ 7 ] });
        var filter2 = new kendo.spreadsheet.ValueFilter({ values: [ 8 ] });

        sheet.range("A1:C4").filter([
          { column: 0, filter: filter },
            { column: 1, filter: filter2 }
        ]);

        console.log(sheet.range("A1:C4").hasFilter());
    </script>
```


### input

Gets or sets the value of the cells.  This is similar to `value`, but it parses the argument as if it was entered through the text box:

- if it starts with `=` (equal sign), a *formula* is set.  This may throw an error if the formula is syntactically invalid.  Example: `range("C1").input("=A1+B1")`.
- if it looks like a number, a numeric value (not string) is set.
- if it's `true` or `false` (case-insensitive) the respective boolean value is set.
- if it's a `Date` object, or a string that can be parsed as a date, it is converted to the numerical representation of the date.
- if it starts with `'` (single quote), a string containing the rest of the characters is set.  Example: `range("A1").input("'TRUE")` — sets the *text* "TRUE", not the boolean.

#### Parameters

##### value `String|Number|Date` *optional*

The value to be set to the cells.

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1").input("1");
        sheet.range("A2").input("=A1*2");
    </script>
```


### isSortable

Returns if a range can be sorted.

#### Returns

`Boolean` whether the range can be sorted.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var range = sheet.range("A1:B1");

        if (range.isSortable()) {
            range.sort()
        }
    </script>
```

### isFilterable

Returns if a range can be filtered.

#### Returns

`Boolean` whether the range can be filtered.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var range = sheet.range("A1:B1");

        if (range.isFilterable()) {
            range.filter(true);
        }
    </script>
```

### merge

Merges the range cells into a single merged cell. If the range already includes a merged cell, they are merged, too.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").merge();
    </script>
```

### select

Sets the sheet selection to the range cells.

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").select();
    </script>
```

### values

Sets the values of the range cells. The argument should be an array of arrays which match the dimensions of the range.

#### Parameters

##### values `Array`

The cell values.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        var values = [
            [ 1, 2, 3 ],
            [ 4, 5, 6 ],
            [ 7, 8, 9 ]
        ];

        sheet.range("A1:C3").values(values);
    </script>
```

### unmerge

Un-merges any merged cells which are included in the range.

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").merge();
        sheet.range("B3:C3").merge();
        sheet.range("A1:D4").unmerge(); // this will unmerge both merged cells.
    </script>
```

### validation

Gets or sets the validation of the cells.

#### Parameters

##### value `Object` *optional*

The validation configuration object. It may contain `type`, `comparerType`, `dataType`, `from`, `to`, `allowNulls`, `messageTemplate` and `titleTemplate` keys.

The `type` Can be set to "warning" or "reject". By default the type is "warning".

The `comparerType` Can be set to "greaterThan", "lessThan", "between", "equalTo", "notEqualTo", "greaterThanOrEqualTo", "lessThanOrEqualTo", "notBetween" or "custom".

The `dataType` Can be set to "date", "text", "number" or "custom".

The `from` This key holds formula or value. Used as first or only compare value depending on specified comparer.

The `to` This key can be set to formula or value. It's optional depending on the specified comparer.

The `allowNulls` Can be set to boolean value.

The `messageTemplate` The message which will be displayed in the "reject" validation window.

The `titleTemplate` The title of the "reject" validation window.

#### Returns

`Object` the current validation of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1").value(4);
        sheet.range("A1").validation({
            from: "1",
            to: "2",
            comparerType: "between",
            dataType: "number",
            messageTemplate: "Number should match the validation."
        });
    </script>
```

### value

Gets or sets the value of the cells.

> If the cell has formula set, the value setting will clear it.

#### Parameters

##### value `String|Number|Date` *optional*

The value to be set to the cells.

#### Returns

`Object` the current value of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").value("foo");
    </script>
```

### wrap

Gets or sets the wrap of the range cells.

#### Parameters

##### value `Boolean` *optional*

`true` if to enable wrapping, `false` otherwise.

#### Returns

`Boolean` the current wrap state of the top-left cell of the range.

#### Example

```html
    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A2").value("long long long long long long text");
        sheet.range("A2:B3").wrap(true);
    </script>
```
