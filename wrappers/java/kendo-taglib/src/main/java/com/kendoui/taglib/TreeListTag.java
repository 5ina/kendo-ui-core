
package com.kendoui.taglib;


import com.kendoui.taglib.treelist.*;


import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class TreeListTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public TreeListTag() {
        super("TreeList");
    }
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
//<< doEndTag

        return super.doEndTag();
    }

    @Override
    public void initialize() {
//>> initialize
//<< initialize

        super.initialize();
    }

    @Override
    public void destroy() {
//>> destroy
//<< destroy

        super.destroy();
    }

//>> Attributes

    public static String tagName() {
        return "treeList";
    }

    public void setColumnMenu(com.kendoui.taglib.treelist.ColumnMenuTag value) {
        setProperty("columnMenu", value);
    }

    public void setColumns(ColumnsTag value) {

        setProperty("columns", value.columns());

    }

    public void setEditable(com.kendoui.taglib.treelist.EditableTag value) {
        setProperty("editable", value);
    }

    public void setExcel(com.kendoui.taglib.treelist.ExcelTag value) {
        setProperty("excel", value);
    }

    public void setFilterable(com.kendoui.taglib.treelist.FilterableTag value) {
        setProperty("filterable", value);
    }

    public void setMessages(com.kendoui.taglib.treelist.MessagesTag value) {
        setProperty("messages", value);
    }

    public void setPdf(com.kendoui.taglib.treelist.PdfTag value) {
        setProperty("pdf", value);
    }

    public void setSortable(com.kendoui.taglib.treelist.SortableTag value) {
        setProperty("sortable", value);
    }

    public void setToolbar(ToolbarTag value) {

        setProperty("toolbar", value.toolbar());

    }

    public void setCancel(CancelFunctionTag value) {
        setEvent("cancel", value.getBody());
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setCollapse(CollapseFunctionTag value) {
        setEvent("collapse", value.getBody());
    }

    public void setColumnHide(ColumnHideFunctionTag value) {
        setEvent("columnHide", value.getBody());
    }

    public void setColumnLock(ColumnLockFunctionTag value) {
        setEvent("columnLock", value.getBody());
    }

    public void setColumnMenuInit(ColumnMenuInitFunctionTag value) {
        setEvent("columnMenuInit", value.getBody());
    }

    public void setColumnReorder(ColumnReorderFunctionTag value) {
        setEvent("columnReorder", value.getBody());
    }

    public void setColumnResize(ColumnResizeFunctionTag value) {
        setEvent("columnResize", value.getBody());
    }

    public void setColumnShow(ColumnShowFunctionTag value) {
        setEvent("columnShow", value.getBody());
    }

    public void setColumnUnlock(ColumnUnlockFunctionTag value) {
        setEvent("columnUnlock", value.getBody());
    }

    public void setDataBinding(DataBindingFunctionTag value) {
        setEvent("dataBinding", value.getBody());
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setDrag(DragFunctionTag value) {
        setEvent("drag", value.getBody());
    }

    public void setDragend(DragendFunctionTag value) {
        setEvent("dragend", value.getBody());
    }

    public void setDragstart(DragstartFunctionTag value) {
        setEvent("dragstart", value.getBody());
    }

    public void setDrop(DropFunctionTag value) {
        setEvent("drop", value.getBody());
    }

    public void setEdit(EditFunctionTag value) {
        setEvent("edit", value.getBody());
    }

    public void setExcelExport(ExcelExportFunctionTag value) {
        setEvent("excelExport", value.getBody());
    }

    public void setExpand(ExpandFunctionTag value) {
        setEvent("expand", value.getBody());
    }

    public void setFilterMenuInit(FilterMenuInitFunctionTag value) {
        setEvent("filterMenuInit", value.getBody());
    }

    public void setPdfExport(PdfExportFunctionTag value) {
        setEvent("pdfExport", value.getBody());
    }

    public void setRemove(RemoveFunctionTag value) {
        setEvent("remove", value.getBody());
    }

    public void setSave(SaveFunctionTag value) {
        setEvent("save", value.getBody());
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public boolean getColumnMenu() {
        return (Boolean)getProperty("columnMenu");
    }

    public void setColumnMenu(boolean value) {
        setProperty("columnMenu", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public boolean getEditable() {
        return (Boolean)getProperty("editable");
    }

    public void setEditable(boolean value) {
        setProperty("editable", value);
    }

    public boolean getFilterable() {
        return (Boolean)getProperty("filterable");
    }

    public void setFilterable(boolean value) {
        setProperty("filterable", value);
    }

    public java.lang.Object getHeight() {
        return (java.lang.Object)getProperty("height");
    }

    public void setHeight(java.lang.Object value) {
        setProperty("height", value);
    }

    public boolean getReorderable() {
        return (Boolean)getProperty("reorderable");
    }

    public void setReorderable(boolean value) {
        setProperty("reorderable", value);
    }

    public boolean getResizable() {
        return (Boolean)getProperty("resizable");
    }

    public void setResizable(boolean value) {
        setProperty("resizable", value);
    }

    public java.lang.Object getScrollable() {
        return (java.lang.Object)getProperty("scrollable");
    }

    public void setScrollable(java.lang.Object value) {
        setProperty("scrollable", value);
    }

    public java.lang.Object getSelectable() {
        return (java.lang.Object)getProperty("selectable");
    }

    public void setSelectable(java.lang.Object value) {
        setProperty("selectable", value);
    }

    public boolean getSortable() {
        return (Boolean)getProperty("sortable");
    }

    public void setSortable(boolean value) {
        setProperty("sortable", value);
    }

    public java.lang.String getToolbar() {
        return (java.lang.String)getProperty("toolbar");
    }

    public void setToolbar(java.lang.String value) {
        setProperty("toolbar", value);
    }

    public String getCancel() {
        Function property = ((Function)getProperty("cancel"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCancel(String value) {
        setProperty("cancel", new Function(value));
    }

    public String getChange() {
        Function property = ((Function)getProperty("change"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setChange(String value) {
        setProperty("change", new Function(value));
    }

    public String getCollapse() {
        Function property = ((Function)getProperty("collapse"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCollapse(String value) {
        setProperty("collapse", new Function(value));
    }

    public String getColumnHide() {
        Function property = ((Function)getProperty("columnHide"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnHide(String value) {
        setProperty("columnHide", new Function(value));
    }

    public String getColumnLock() {
        Function property = ((Function)getProperty("columnLock"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnLock(String value) {
        setProperty("columnLock", new Function(value));
    }

    public String getColumnMenuInit() {
        Function property = ((Function)getProperty("columnMenuInit"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnMenuInit(String value) {
        setProperty("columnMenuInit", new Function(value));
    }

    public String getColumnReorder() {
        Function property = ((Function)getProperty("columnReorder"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnReorder(String value) {
        setProperty("columnReorder", new Function(value));
    }

    public String getColumnResize() {
        Function property = ((Function)getProperty("columnResize"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnResize(String value) {
        setProperty("columnResize", new Function(value));
    }

    public String getColumnShow() {
        Function property = ((Function)getProperty("columnShow"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnShow(String value) {
        setProperty("columnShow", new Function(value));
    }

    public String getColumnUnlock() {
        Function property = ((Function)getProperty("columnUnlock"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setColumnUnlock(String value) {
        setProperty("columnUnlock", new Function(value));
    }

    public String getDataBinding() {
        Function property = ((Function)getProperty("dataBinding"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDataBinding(String value) {
        setProperty("dataBinding", new Function(value));
    }

    public String getDataBound() {
        Function property = ((Function)getProperty("dataBound"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDataBound(String value) {
        setProperty("dataBound", new Function(value));
    }

    public String getDrag() {
        Function property = ((Function)getProperty("drag"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDrag(String value) {
        setProperty("drag", new Function(value));
    }

    public String getDragend() {
        Function property = ((Function)getProperty("dragend"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragend(String value) {
        setProperty("dragend", new Function(value));
    }

    public String getDragstart() {
        Function property = ((Function)getProperty("dragstart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragstart(String value) {
        setProperty("dragstart", new Function(value));
    }

    public String getDrop() {
        Function property = ((Function)getProperty("drop"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDrop(String value) {
        setProperty("drop", new Function(value));
    }

    public String getEdit() {
        Function property = ((Function)getProperty("edit"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setEdit(String value) {
        setProperty("edit", new Function(value));
    }

    public String getExcelExport() {
        Function property = ((Function)getProperty("excelExport"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setExcelExport(String value) {
        setProperty("excelExport", new Function(value));
    }

    public String getExpand() {
        Function property = ((Function)getProperty("expand"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setExpand(String value) {
        setProperty("expand", new Function(value));
    }

    public String getFilterMenuInit() {
        Function property = ((Function)getProperty("filterMenuInit"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setFilterMenuInit(String value) {
        setProperty("filterMenuInit", new Function(value));
    }

    public String getPdfExport() {
        Function property = ((Function)getProperty("pdfExport"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setPdfExport(String value) {
        setProperty("pdfExport", new Function(value));
    }

    public String getRemove() {
        Function property = ((Function)getProperty("remove"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRemove(String value) {
        setProperty("remove", new Function(value));
    }

    public String getSave() {
        Function property = ((Function)getProperty("save"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSave(String value) {
        setProperty("save", new Function(value));
    }

//<< Attributes

}
