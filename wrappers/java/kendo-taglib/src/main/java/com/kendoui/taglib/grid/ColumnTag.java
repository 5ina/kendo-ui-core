
package com.kendoui.taglib.grid;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.GridColumnContainer;

import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ColumnTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
        GridColumnContainer parent = (GridColumnContainer)findParentWithClass(GridColumnContainer.class);
        
        parent.addColumn(this);

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
        return "grid-column";
    }

    public void setCommand(ColumnCommandTag value) {

        setProperty("command", value.command());

    }

    public void setFilterable(com.kendoui.taglib.grid.ColumnFilterableTag value) {
        setProperty("filterable", value);
    }

    public void setSortable(com.kendoui.taglib.grid.ColumnSortableTag value) {
        setProperty("sortable", value);
    }

    public void setEditor(ColumnEditorFunctionTag value) {
        setEvent("editor", value.getBody());
    }

    public void setFooterTemplate(ColumnFooterTemplateFunctionTag value) {
        setEvent("footerTemplate", value.getBody());
    }

    public void setGroupHeaderTemplate(ColumnGroupHeaderTemplateFunctionTag value) {
        setEvent("groupHeaderTemplate", value.getBody());
    }

    public void setGroupFooterTemplate(ColumnGroupFooterTemplateFunctionTag value) {
        setEvent("groupFooterTemplate", value.getBody());
    }

    public void setHeaderTemplate(ColumnHeaderTemplateFunctionTag value) {
        setEvent("headerTemplate", value.getBody());
    }

    public void setTemplate(ColumnTemplateFunctionTag value) {
        setEvent("template", value.getBody());
    }

    public java.lang.Object getAggregates() {
        return (java.lang.Object)getProperty("aggregates");
    }

    public void setAggregates(java.lang.Object value) {
        setProperty("aggregates", value);
    }

    public java.lang.Object getAttributes() {
        return (java.lang.Object)getProperty("attributes");
    }

    public void setAttributes(java.lang.Object value) {
        setProperty("attributes", value);
    }

    public java.lang.String getCommand() {
        return (java.lang.String)getProperty("command");
    }

    public void setCommand(java.lang.String value) {
        setProperty("command", value);
    }

    public String getEditor() {
        Function property = ((Function)getProperty("editor"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setEditor(String value) {
        setProperty("editor", new Function(value));
    }

    public boolean getEncoded() {
        return (Boolean)getProperty("encoded");
    }

    public void setEncoded(boolean value) {
        setProperty("encoded", value);
    }

    public java.lang.String getField() {
        return (java.lang.String)getProperty("field");
    }

    public void setField(java.lang.String value) {
        setProperty("field", value);
    }

    public boolean getFilterable() {
        return (Boolean)getProperty("filterable");
    }

    public void setFilterable(boolean value) {
        setProperty("filterable", value);
    }

    public java.lang.String getFooterTemplate() {
        return (java.lang.String)getProperty("footerTemplate");
    }

    public void setFooterTemplate(java.lang.String value) {
        setProperty("footerTemplate", value);
    }

    public java.lang.String getFormat() {
        return (java.lang.String)getProperty("format");
    }

    public void setFormat(java.lang.String value) {
        setProperty("format", value);
    }

    public java.lang.String getGroupFooterTemplate() {
        return (java.lang.String)getProperty("groupFooterTemplate");
    }

    public void setGroupFooterTemplate(java.lang.String value) {
        setProperty("groupFooterTemplate", value);
    }

    public java.lang.String getGroupHeaderTemplate() {
        return (java.lang.String)getProperty("groupHeaderTemplate");
    }

    public void setGroupHeaderTemplate(java.lang.String value) {
        setProperty("groupHeaderTemplate", value);
    }

    public boolean getGroupable() {
        return (Boolean)getProperty("groupable");
    }

    public void setGroupable(boolean value) {
        setProperty("groupable", value);
    }

    public java.lang.Object getHeaderAttributes() {
        return (java.lang.Object)getProperty("headerAttributes");
    }

    public void setHeaderAttributes(java.lang.Object value) {
        setProperty("headerAttributes", value);
    }

    public java.lang.String getHeaderTemplate() {
        return (java.lang.String)getProperty("headerTemplate");
    }

    public void setHeaderTemplate(java.lang.String value) {
        setProperty("headerTemplate", value);
    }

    public boolean getHidden() {
        return (Boolean)getProperty("hidden");
    }

    public void setHidden(boolean value) {
        setProperty("hidden", value);
    }

    public boolean getLockable() {
        return (Boolean)getProperty("lockable");
    }

    public void setLockable(boolean value) {
        setProperty("lockable", value);
    }

    public boolean getLocked() {
        return (Boolean)getProperty("locked");
    }

    public void setLocked(boolean value) {
        setProperty("locked", value);
    }

    public boolean getMenu() {
        return (Boolean)getProperty("menu");
    }

    public void setMenu(boolean value) {
        setProperty("menu", value);
    }

    public float getMinScreenWidth() {
        return (Float)getProperty("minScreenWidth");
    }

    public void setMinScreenWidth(float value) {
        setProperty("minScreenWidth", value);
    }

    public boolean getSortable() {
        return (Boolean)getProperty("sortable");
    }

    public void setSortable(boolean value) {
        setProperty("sortable", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public java.lang.String getTitle() {
        return (java.lang.String)getProperty("title");
    }

    public void setTitle(java.lang.String value) {
        setProperty("title", value);
    }

    public java.lang.Object getWidth() {
        return (java.lang.Object)getProperty("width");
    }

    public void setWidth(java.lang.Object value) {
        setProperty("width", value);
    }

//<< Attributes
    
    public void setValues(ColumnValuesTag value) {
        setProperty("values", value.getValue());
    }
}
