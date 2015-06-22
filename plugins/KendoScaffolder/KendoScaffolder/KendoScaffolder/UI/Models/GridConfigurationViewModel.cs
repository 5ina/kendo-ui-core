﻿using Microsoft.AspNet.Scaffolding;
using Microsoft.AspNet.Scaffolding.EntityFramework;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace KendoScaffolder.UI.Models
{
    public enum GridFilterMode { Menu, Row }
    public enum GridSortMode { MultipleColumn, SingleColumn }
    public enum GridSelectionMode { Multiple, Single }
    public enum GridSelectionType { Row, Cell }
    public enum GridEvents
    {
        Cancel, Change, ColumnHide, ColumnLock, ColumnMenuInit, ColumnReorder, ColumnResize, ColumnShow,
        ColumnUnlock, DataBinding, DataBound, DetailCollapse, DetailExpand, DetailInit,
        Edit, ExcelExport, FilterMenuInit, PdfExport, Remove, Save, SaveChanges
    }

    public class CheckBoxListItem
    {
        public bool Checked { get; set; }
        public string Text { get; set; }

        public CheckBoxListItem(bool ch, string text)
        {
            Checked = ch;
            Text = text;
        }

        public CheckBoxListItem()
        {
            Checked = false;
        }
    }

    public class GridConfigurationViewModel : DataSourceBoundWidgetViewModel
    {
        public bool ServerOperation { get; set; }
        public string SelectedDataSourceType { get; set; }
        public bool Editable { get; set; }
        public bool EditableCreate { get; set; }
        public bool EditableUpdate { get; set; }
        public bool EditableDestroy { get; set; }
        public string EditMode { get; set; }

        public bool ColumnMenu { get; set; }

        public bool Filterable { get; set; }
        public GridFilterMode FilterMode { get; set; }

        public bool Groupable { get; set; }
        public bool Navigatable { get; set; }
        public bool Pageable { get; set; }
        public bool Reorderable { get; set; }
        public bool Scrollable { get; set; }

        public bool Selectable { get; set; }
        public GridSelectionMode SelectionMode { get; set; }
        public GridSelectionType SelectionType { get; set; }

        public bool Sortable { get; set; }
        public bool AllowUnsort { get; set; }
        public GridSortMode SortMode { get; set; }

        public bool ExcelExport { get; set; }
        public bool PdfExport { get; set; }

        public List<string> SelectedGridEvents { get; set; }

        public GridConfigurationViewModel(CodeGenerationContext context)
            : base(context)
        {
            EditMode = "InLine";
            Scrollable = true;
            FilterMode = GridFilterMode.Menu;
            SelectionMode = GridSelectionMode.Single;
            SelectionType = GridSelectionType.Row;
            SortMode = GridSortMode.SingleColumn;
            AllowUnsort = true;
            SelectedDataSourceType = "Ajax";
            SelectedGridEvents = new List<string>();
            ServerOperation = true;
        }

        public IEnumerable<string> DataSourceTypes
        {
            get
            {
                return new List<string> { "Ajax", "Server", "WebApi" };
            }
        }

        public IEnumerable<string> EditModes
        {
            get
            {
                return new List<string> { "InCell", "InLine", "PopUp" };
            }
        }

        public IEnumerable<CheckBoxListItem> GridEvents
        {
            get
            {
                return Enum.GetValues(typeof(GridEvents))
                           .Cast<GridEvents>()
                           .Select(ev => new CheckBoxListItem
                           {
                               Checked = false,
                               Text = ev.ToString()
                           });
            }
        }
    }
}
