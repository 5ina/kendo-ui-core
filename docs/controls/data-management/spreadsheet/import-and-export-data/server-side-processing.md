---
title: Server-Side Processing
page_title: Server-Side Processing | Kendo UI Spreadsheet
description: "Learn how to process Kendo UI Spreadsheet data using the Telerik Document Processing library."
slug: serverside_processing_spreadsheet_widget
position: 4
---

# Server-Side Processing

The native data format for the Spreadsheet widget is [JSON]({% slug loadand_saveas_json_spreadsheet_widget %}). There is also the built-in support for [exporting to Excel]({% slug export_toexcel_spreadsheet_widget %}) that runs in the browser.

For exporting big datasets, Kendo UI ships a .NET based server-side module that is established on [Telerik RadSpreadProcessing](http://docs.telerik.com/devtools/document-processing/libraries/radspreadprocessing/overview) and is part of [Telerik Document Processing by Progress](http://docs.telerik.com/devtools/document-processing/introduction).

The document processing library (DPL) handles the data import, export, and processing from the following formats:

* Excel Microsoft Office Open XML Spreadsheet (.xlsx)
* Comma-separated values (.csv)
* Tab-separated values (.txt)
* Portable document format (.pdf) (export only)

> **Important**
>
> The DPL module is distributed as part of the [UI for ASP.NET MVC]({% slug overview_aspnetmvc %}) and is available for the Kendo UI Enterprise and DevCraft bundles.

For the complete project on exporting huge datasets from the Grid to Excel, refer to [this how-to example]({% slug howto_exportgriddataasexceldocs_gridaspnetmv %}).

For more information on Excel export, refer to the article on [Spreadsheet processing]({% slug spreadsheet_processing_spreadsheet_mvc %}).

## See Also

Other articles on Kendo UI Spreadsheet:

* [API Reference](/api/javascript/ui/spreadsheet)
* [Load and Save Data as JSON]({% slug loadand_saveas_json_spreadsheet_widget %})
* [Data Source Binding]({% slug bind_todata_source_spreadsheet_widget %})
* [Export to Excel]({% slug export_toexcel_spreadsheet_widget %})
* [Custom Functions]({% slug custom_functions_spreadsheet_widget %})
* [Cell Formatting]({% slug cell_formatting_spreadsheet_widget %})
