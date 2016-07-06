
package com.kendoui.taglib;


import com.kendoui.taglib.autocomplete.*;


import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class AutoCompleteTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public AutoCompleteTag() {
        super("AutoComplete");
    }

    @Override
    public Element<?> createElement() {
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
        return "autoComplete";
    }

    public void setAnimation(com.kendoui.taglib.autocomplete.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setVirtual(com.kendoui.taglib.autocomplete.VirtualTag value) {
        setProperty("virtual", value);
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

    public boolean getAnimation() {
        return (Boolean)getProperty("animation");
    }

    public void setAnimation(boolean value) {
        setProperty("animation", value);
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

    public java.lang.Object getPopup() {
        return (java.lang.Object)getProperty("popup");
    }

    public void setPopup(java.lang.Object value) {
        setProperty("popup", value);
    }

    public java.lang.Object getSeparator() {
        return (java.lang.Object)getProperty("separator");
    }

    public void setSeparator(java.lang.Object value) {
        setProperty("separator", value);
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
