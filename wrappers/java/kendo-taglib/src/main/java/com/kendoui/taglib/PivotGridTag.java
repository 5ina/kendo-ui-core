
package com.kendoui.taglib;


import com.kendoui.taglib.pivotgrid.*;


import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class PivotGridTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public PivotGridTag() {
        super("PivotGrid");
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
        return "pivotGrid";
    }

    public void setExcel(com.kendoui.taglib.pivotgrid.ExcelTag value) {
        setProperty("excel", value);
    }

    public void setMessages(com.kendoui.taglib.pivotgrid.MessagesTag value) {
        setProperty("messages", value);
    }

    public void setPdf(com.kendoui.taglib.pivotgrid.PdfTag value) {
        setProperty("pdf", value);
    }

    public void setSortable(com.kendoui.taglib.pivotgrid.SortableTag value) {
        setProperty("sortable", value);
    }

    public void setCollapseMember(CollapseMemberFunctionTag value) {
        setEvent("collapseMember", value.getBody());
    }

    public void setDataBinding(DataBindingFunctionTag value) {
        setEvent("dataBinding", value.getBody());
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setExcelExport(ExcelExportFunctionTag value) {
        setEvent("excelExport", value.getBody());
    }

    public void setExpandMember(ExpandMemberFunctionTag value) {
        setEvent("expandMember", value.getBody());
    }

    public void setPdfExport(PdfExportFunctionTag value) {
        setEvent("pdfExport", value.getBody());
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public java.lang.String getColumnHeaderTemplate() {
        return (java.lang.String)getProperty("columnHeaderTemplate");
    }

    public void setColumnHeaderTemplate(java.lang.String value) {
        setProperty("columnHeaderTemplate", value);
    }

    public float getColumnWidth() {
        return (Float)getProperty("columnWidth");
    }

    public void setColumnWidth(float value) {
        setProperty("columnWidth", value);
    }

    public java.lang.String getDataCellTemplate() {
        return (java.lang.String)getProperty("dataCellTemplate");
    }

    public void setDataCellTemplate(java.lang.String value) {
        setProperty("dataCellTemplate", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
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

    public java.lang.String getKpiStatusTemplate() {
        return (java.lang.String)getProperty("kpiStatusTemplate");
    }

    public void setKpiStatusTemplate(java.lang.String value) {
        setProperty("kpiStatusTemplate", value);
    }

    public java.lang.String getKpiTrendTemplate() {
        return (java.lang.String)getProperty("kpiTrendTemplate");
    }

    public void setKpiTrendTemplate(java.lang.String value) {
        setProperty("kpiTrendTemplate", value);
    }

    public boolean getReorderable() {
        return (Boolean)getProperty("reorderable");
    }

    public void setReorderable(boolean value) {
        setProperty("reorderable", value);
    }

    public java.lang.String getRowHeaderTemplate() {
        return (java.lang.String)getProperty("rowHeaderTemplate");
    }

    public void setRowHeaderTemplate(java.lang.String value) {
        setProperty("rowHeaderTemplate", value);
    }

    public boolean getSortable() {
        return (Boolean)getProperty("sortable");
    }

    public void setSortable(boolean value) {
        setProperty("sortable", value);
    }

    public String getCollapseMember() {
        Function property = ((Function)getProperty("collapseMember"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCollapseMember(String value) {
        setProperty("collapseMember", new Function(value));
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

    public String getExpandMember() {
        Function property = ((Function)getProperty("expandMember"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setExpandMember(String value) {
        setProperty("expandMember", new Function(value));
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

//<< Attributes

    public void setConfigurator(com.kendoui.taglib.pivotgrid.ConfiguratorTag value) {
        setProperty("configurator", "#" + value.getName());
    }
}
