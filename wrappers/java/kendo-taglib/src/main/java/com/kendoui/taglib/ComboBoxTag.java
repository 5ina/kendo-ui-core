
package com.kendoui.taglib;


import com.kendoui.taglib.combobox.*;


import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ComboBoxTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public ComboBoxTag() {
        super("ComboBox");
    }

    @Override
    protected Element<?> createElement() {
        return new Input().attr("name", getName());
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
        return "comboBox";
    }

    public void setAnimation(com.kendoui.taglib.combobox.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setPopup(com.kendoui.taglib.combobox.PopupTag value) {
        setProperty("popup", value);
    }

    public void setVirtual(com.kendoui.taglib.combobox.VirtualTag value) {
        setProperty("virtual", value);
    }

    public void setCascade(CascadeFunctionTag value) {
        setEvent("cascade", value.getBody());
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setClose(CloseFunctionTag value) {
        setEvent("close", value.getBody());
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setFiltering(FilteringFunctionTag value) {
        setEvent("filtering", value.getBody());
    }

    public void setOpen(OpenFunctionTag value) {
        setEvent("open", value.getBody());
    }

    public void setSelect(SelectFunctionTag value) {
        setEvent("select", value.getBody());
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public boolean getAutoWidth() {
        return (Boolean)getProperty("autoWidth");
    }

    public void setAutoWidth(boolean value) {
        setProperty("autoWidth", value);
    }

    public java.lang.String getCascadeFrom() {
        return (java.lang.String)getProperty("cascadeFrom");
    }

    public void setCascadeFrom(java.lang.String value) {
        setProperty("cascadeFrom", value);
    }

    public java.lang.String getCascadeFromField() {
        return (java.lang.String)getProperty("cascadeFromField");
    }

    public void setCascadeFromField(java.lang.String value) {
        setProperty("cascadeFromField", value);
    }

    public boolean getClearButton() {
        return (Boolean)getProperty("clearButton");
    }

    public void setClearButton(boolean value) {
        setProperty("clearButton", value);
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

    public java.lang.String getDataValueField() {
        return (java.lang.String)getProperty("dataValueField");
    }

    public void setDataValueField(java.lang.String value) {
        setProperty("dataValueField", value);
    }

    public float getDelay() {
        return (Float)getProperty("delay");
    }

    public void setDelay(float value) {
        setProperty("delay", value);
    }

    public boolean getEnable() {
        return (Boolean)getProperty("enable");
    }

    public void setEnable(boolean value) {
        setProperty("enable", value);
    }

    public boolean getEnforceMinLength() {
        return (Boolean)getProperty("enforceMinLength");
    }

    public void setEnforceMinLength(boolean value) {
        setProperty("enforceMinLength", value);
    }

    public java.lang.String getFilter() {
        return (java.lang.String)getProperty("filter");
    }

    public void setFilter(java.lang.String value) {
        setProperty("filter", value);
    }

    public java.lang.String getFixedGroupTemplate() {
        return (java.lang.String)getProperty("fixedGroupTemplate");
    }

    public void setFixedGroupTemplate(java.lang.String value) {
        setProperty("fixedGroupTemplate", value);
    }

    public java.lang.String getFooterTemplate() {
        return (java.lang.String)getProperty("footerTemplate");
    }

    public void setFooterTemplate(java.lang.String value) {
        setProperty("footerTemplate", value);
    }

    public java.lang.String getGroupTemplate() {
        return (java.lang.String)getProperty("groupTemplate");
    }

    public void setGroupTemplate(java.lang.String value) {
        setProperty("groupTemplate", value);
    }

    public java.lang.String getHeaderTemplate() {
        return (java.lang.String)getProperty("headerTemplate");
    }

    public void setHeaderTemplate(java.lang.String value) {
        setProperty("headerTemplate", value);
    }

    public float getHeight() {
        return (Float)getProperty("height");
    }

    public void setHeight(float value) {
        setProperty("height", value);
    }

    public boolean getHighlightFirst() {
        return (Boolean)getProperty("highlightFirst");
    }

    public void setHighlightFirst(boolean value) {
        setProperty("highlightFirst", value);
    }

    public boolean getIgnoreCase() {
        return (Boolean)getProperty("ignoreCase");
    }

    public void setIgnoreCase(boolean value) {
        setProperty("ignoreCase", value);
    }

    public float getIndex() {
        return (Float)getProperty("index");
    }

    public void setIndex(float value) {
        setProperty("index", value);
    }

    public float getMinLength() {
        return (Float)getProperty("minLength");
    }

    public void setMinLength(float value) {
        setProperty("minLength", value);
    }

    public java.lang.String getNoDataTemplate() {
        return (java.lang.String)getProperty("noDataTemplate");
    }

    public void setNoDataTemplate(java.lang.String value) {
        setProperty("noDataTemplate", value);
    }

    public java.lang.String getPlaceholder() {
        return (java.lang.String)getProperty("placeholder");
    }

    public void setPlaceholder(java.lang.String value) {
        setProperty("placeholder", value);
    }

    public boolean getSuggest() {
        return (Boolean)getProperty("suggest");
    }

    public void setSuggest(boolean value) {
        setProperty("suggest", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public java.lang.String getText() {
        return (java.lang.String)getProperty("text");
    }

    public void setText(java.lang.String value) {
        setProperty("text", value);
    }

    public java.lang.String getValue() {
        return (java.lang.String)getProperty("value");
    }

    public void setValue(java.lang.String value) {
        setProperty("value", value);
    }

    public boolean getValuePrimitive() {
        return (Boolean)getProperty("valuePrimitive");
    }

    public void setValuePrimitive(boolean value) {
        setProperty("valuePrimitive", value);
    }

    public boolean getVirtual() {
        return (Boolean)getProperty("virtual");
    }

    public void setVirtual(boolean value) {
        setProperty("virtual", value);
    }

    public String getCascade() {
        Function property = ((Function)getProperty("cascade"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCascade(String value) {
        setProperty("cascade", new Function(value));
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

    public String getClose() {
        Function property = ((Function)getProperty("close"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setClose(String value) {
        setProperty("close", new Function(value));
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

    public String getFiltering() {
        Function property = ((Function)getProperty("filtering"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setFiltering(String value) {
        setProperty("filtering", new Function(value));
    }

    public String getOpen() {
        Function property = ((Function)getProperty("open"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setOpen(String value) {
        setProperty("open", new Function(value));
    }

    public String getSelect() {
        Function property = ((Function)getProperty("select"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSelect(String value) {
        setProperty("select", new Function(value));
    }

//<< Attributes

}
