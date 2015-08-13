
package com.kendoui.taglib.grid;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.DataBoundWidget;
import com.kendoui.taglib.DataSourceTag;
import com.kendoui.taglib.json.Function;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ColumnFilterableCellTag extends  BaseTag implements DataBoundWidget /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        ColumnFilterableTag parent = (ColumnFilterableTag)findParentWithClass(ColumnFilterableTag.class);


        parent.setCell(this);

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
        return "grid-column-filterable-cell";
    }

    public void setTemplate(ColumnFilterableCellTemplateFunctionTag value) {
        setEvent("template", value.getBody());
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getDataTextField() {
        return (java.lang.String)getProperty("dataTextField");
    }

    public void setDataTextField(java.lang.String value) {
        setProperty("dataTextField", value);
    }

    public float getDelay() {
        return (Float)getProperty("delay");
    }

    public void setDelay(float value) {
        setProperty("delay", value);
    }

    public boolean getEnabled() {
        return (Boolean)getProperty("enabled");
    }

    public void setEnabled(boolean value) {
        setProperty("enabled", value);
    }

    public float getInputWidth() {
        return (Float)getProperty("inputWidth");
    }

    public void setInputWidth(float value) {
        setProperty("inputWidth", value);
    }

    public float getMinLength() {
        return (Float)getProperty("minLength");
    }

    public void setMinLength(float value) {
        setProperty("minLength", value);
    }

    public java.lang.String getOperator() {
        return (java.lang.String)getProperty("operator");
    }

    public void setOperator(java.lang.String value) {
        setProperty("operator", value);
    }

    public boolean getShowOperators() {
        return (Boolean)getProperty("showOperators");
    }

    public void setShowOperators(boolean value) {
        setProperty("showOperators", value);
    }

    public java.lang.String getSuggestionOperator() {
        return (java.lang.String)getProperty("suggestionOperator");
    }

    public void setSuggestionOperator(java.lang.String value) {
        setProperty("suggestionOperator", value);
    }

    public String getTemplate() {
        Function property = ((Function)getProperty("template"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setTemplate(String value) {
        setProperty("template", new Function(value));
    }

//<< Attributes

}
