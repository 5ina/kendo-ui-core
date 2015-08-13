
package com.kendoui.taglib;



import com.kendoui.taglib.json.Function;


import com.kendoui.taglib.treemap.DataBoundFunctionTag;
import com.kendoui.taglib.treemap.ItemCreatedFunctionTag;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class TreeMapTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public TreeMapTag() {
        super("TreeMap");
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
        return "treeMap";
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setItemCreated(ItemCreatedFunctionTag value) {
        setEvent("itemCreated", value.getBody());
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public java.lang.String getColorField() {
        return (java.lang.String)getProperty("colorField");
    }

    public void setColorField(java.lang.String value) {
        setProperty("colorField", value);
    }

    public java.lang.Object getColors() {
        return (java.lang.Object)getProperty("colors");
    }

    public void setColors(java.lang.Object value) {
        setProperty("colors", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public java.lang.String getTextField() {
        return (java.lang.String)getProperty("textField");
    }

    public void setTextField(java.lang.String value) {
        setProperty("textField", value);
    }

    public java.lang.String getTheme() {
        return (java.lang.String)getProperty("theme");
    }

    public void setTheme(java.lang.String value) {
        setProperty("theme", value);
    }

    public java.lang.String getType() {
        return (java.lang.String)getProperty("type");
    }

    public void setType(java.lang.String value) {
        setProperty("type", value);
    }

    public java.lang.String getValueField() {
        return (java.lang.String)getProperty("valueField");
    }

    public void setValueField(java.lang.String value) {
        setProperty("valueField", value);
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

    public String getItemCreated() {
        Function property = ((Function)getProperty("itemCreated"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setItemCreated(String value) {
        setProperty("itemCreated", new Function(value));
    }

//<< Attributes

}
