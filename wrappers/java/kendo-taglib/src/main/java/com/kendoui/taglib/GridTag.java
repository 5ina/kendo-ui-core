
package com.kendoui.taglib;


import com.kendoui.taglib.grid.*;


import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class GridTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public GridTag() {
        super("Grid");
    }

    
    @Override
    public int doEndTag() throws JspException {
        String template;
//>> doEndTag
//<< doEndTag        
        
        if (isSet("detailTemplate")) {
            template = "kendo.template(jQuery(\"#" + getDetailTemplate() + "\").html())";
            setProperty("detailTemplate", new Function(template));
        }
        
        if (isSet("rowTemplate")) {
            template = "kendo.template(jQuery(\"#" + getRowTemplate() + "\").html())";
            setProperty("rowTemplate", new Function(template));
        }
        
        if (isSet("altRowTemplate")) {
            template = "kendo.template(jQuery(\"#" + getAltRowTemplate() + "\").html())";
            setProperty("altRowTemplate", new Function(template));
        }
        
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
        return "grid";
    }

    public void setAllowCopy(com.kendoui.taglib.grid.AllowCopyTag value) {
        setProperty("allowCopy", value);
    }

    public void setColumnMenu(com.kendoui.taglib.grid.ColumnMenuTag value) {
        setProperty("columnMenu", value);
    }

    public void setColumns(ColumnsTag value) {

        setProperty("columns", value.columns());

    }

    public void setEditable(com.kendoui.taglib.grid.EditableTag value) {
        setProperty("editable", value);
    }

    public void setExcel(com.kendoui.taglib.grid.ExcelTag value) {
        setProperty("excel", value);
    }

    public void setFilterable(com.kendoui.taglib.grid.FilterableTag value) {
        setProperty("filterable", value);
    }

    public void setGroupable(com.kendoui.taglib.grid.GroupableTag value) {
        setProperty("groupable", value);
    }

    public void setMessages(com.kendoui.taglib.grid.MessagesTag value) {
        setProperty("messages", value);
    }

    public void setNoRecords(com.kendoui.taglib.grid.NoRecordsTag value) {
        setProperty("noRecords", value);
    }

    public void setPageable(com.kendoui.taglib.grid.PageableTag value) {
        setProperty("pageable", value);
    }

    public void setPdf(com.kendoui.taglib.grid.PdfTag value) {
        setProperty("pdf", value);
    }

    public void setScrollable(com.kendoui.taglib.grid.ScrollableTag value) {
        setProperty("scrollable", value);
    }

    public void setSortable(com.kendoui.taglib.grid.SortableTag value) {
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

    public void setDetailCollapse(DetailCollapseFunctionTag value) {
        setEvent("detailCollapse", value.getBody());
    }

    public void setDetailExpand(DetailExpandFunctionTag value) {
        setEvent("detailExpand", value.getBody());
    }

    public void setDetailInit(DetailInitFunctionTag value) {
        setEvent("detailInit", value.getBody());
    }

    public void setEdit(EditFunctionTag value) {
        setEvent("edit", value.getBody());
    }

    public void setExcelExport(ExcelExportFunctionTag value) {
        setEvent("excelExport", value.getBody());
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

    public void setSaveChanges(SaveChangesFunctionTag value) {
        setEvent("saveChanges", value.getBody());
    }

    public boolean getAllowCopy() {
        return (Boolean)getProperty("allowCopy");
    }

    public void setAllowCopy(boolean value) {
        setProperty("allowCopy", value);
    }

    public java.lang.String getAltRowTemplate() {
        return (java.lang.String)getProperty("altRowTemplate");
    }

    public void setAltRowTemplate(java.lang.String value) {
        setProperty("altRowTemplate", value);
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

    public float getColumnResizeHandleWidth() {
        return (Float)getProperty("columnResizeHandleWidth");
    }

    public void setColumnResizeHandleWidth(float value) {
        setProperty("columnResizeHandleWidth", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getDetailTemplate() {
        return (java.lang.String)getProperty("detailTemplate");
    }

    public void setDetailTemplate(java.lang.String value) {
        setProperty("detailTemplate", value);
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

    public boolean getGroupable() {
        return (Boolean)getProperty("groupable");
    }

    public void setGroupable(boolean value) {
        setProperty("groupable", value);
    }

    public java.lang.Object getHeight() {
        return (java.lang.Object)getProperty("height");
    }

    public void setHeight(java.lang.Object value) {
        setProperty("height", value);
    }

    public java.lang.Object getMobile() {
        return (java.lang.Object)getProperty("mobile");
    }

    public void setMobile(java.lang.Object value) {
        setProperty("mobile", value);
    }

    public boolean getNavigatable() {
        return (Boolean)getProperty("navigatable");
    }

    public void setNavigatable(boolean value) {
        setProperty("navigatable", value);
    }

    public boolean getNoRecords() {
        return (Boolean)getProperty("noRecords");
    }

    public void setNoRecords(boolean value) {
        setProperty("noRecords", value);
    }

    public boolean getPageable() {
        return (Boolean)getProperty("pageable");
    }

    public void setPageable(boolean value) {
        setProperty("pageable", value);
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

    public java.lang.String getRowTemplate() {
        return (java.lang.String)getProperty("rowTemplate");
    }

    public void setRowTemplate(java.lang.String value) {
        setProperty("rowTemplate", value);
    }

    public boolean getScrollable() {
        return (Boolean)getProperty("scrollable");
    }

    public void setScrollable(boolean value) {
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

    public String getDetailCollapse() {
        Function property = ((Function)getProperty("detailCollapse"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDetailCollapse(String value) {
        setProperty("detailCollapse", new Function(value));
    }

    public String getDetailExpand() {
        Function property = ((Function)getProperty("detailExpand"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDetailExpand(String value) {
        setProperty("detailExpand", new Function(value));
    }

    public String getDetailInit() {
        Function property = ((Function)getProperty("detailInit"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDetailInit(String value) {
        setProperty("detailInit", new Function(value));
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

    public String getSaveChanges() {
        Function property = ((Function)getProperty("saveChanges"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSaveChanges(String value) {
        setProperty("saveChanges", new Function(value));
    }

//<< Attributes

    public void setToolbarTemplate(ToolbarTemplateFunctionTag value) {        
        setProperty("toolbar", value.getBody());
    }
    
    public String getToolbarTemplate() {
        Function property = ((Function)getProperty("toolbar"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }
}
