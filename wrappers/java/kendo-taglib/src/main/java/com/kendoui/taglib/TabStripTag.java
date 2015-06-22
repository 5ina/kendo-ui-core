
package com.kendoui.taglib;


import com.kendoui.taglib.tabstrip.*;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class TabStripTag extends WidgetWithItemsTag /* interfaces */implements Items/* interfaces */ {

    public TabStripTag() {
        super("TabStrip");
    }
    
    @Override
    protected Element<?> createElement() {
        Element<?> element = super.createElement();

        element.html(body());

        return element;
    }
    
    @Override
    public Element<?> html() {
        Element<?> element = createElement();

        element.attr("id", getName());

        for (String attribute : attributes.keySet()) {
            Object value = attributes.get(attribute);
            
            if (value != null) {
                element.attr(attribute, value);
            }
        }
        Element<?> wrapper = super.createElement();
        wrapper.attr("class", "k-tabstrip-wrapper");
        wrapper.append(element);

        return wrapper;
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
        return "tabStrip";
    }

    public void setAnimation(com.kendoui.taglib.tabstrip.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public void setScrollable(com.kendoui.taglib.tabstrip.ScrollableTag value) {
        setProperty("scrollable", value);
    }

    public void setActivate(ActivateFunctionTag value) {
        setEvent("activate", value.getBody());
    }

    public void setContentLoad(ContentLoadFunctionTag value) {
        setEvent("contentLoad", value.getBody());
    }

    public void setError(ErrorFunctionTag value) {
        setEvent("error", value.getBody());
    }

    public void setSelect(SelectFunctionTag value) {
        setEvent("select", value.getBody());
    }

    public void setShow(ShowFunctionTag value) {
        setEvent("show", value.getBody());
    }

    public boolean getAnimation() {
        return (boolean)getProperty("animation");
    }

    public void setAnimation(boolean value) {
        setProperty("animation", value);
    }

    public boolean getCollapsible() {
        return (boolean)getProperty("collapsible");
    }

    public void setCollapsible(boolean value) {
        setProperty("collapsible", value);
    }

    public java.lang.Object getContentUrls() {
        return (java.lang.Object)getProperty("contentUrls");
    }

    public void setContentUrls(java.lang.Object value) {
        setProperty("contentUrls", value);
    }

    public java.lang.String getDataContentField() {
        return (java.lang.String)getProperty("dataContentField");
    }

    public void setDataContentField(java.lang.String value) {
        setProperty("dataContentField", value);
    }

    public java.lang.String getDataContentUrlField() {
        return (java.lang.String)getProperty("dataContentUrlField");
    }

    public void setDataContentUrlField(java.lang.String value) {
        setProperty("dataContentUrlField", value);
    }

    public java.lang.String getDataImageUrlField() {
        return (java.lang.String)getProperty("dataImageUrlField");
    }

    public void setDataImageUrlField(java.lang.String value) {
        setProperty("dataImageUrlField", value);
    }

    public java.lang.String getDataSpriteCssClass() {
        return (java.lang.String)getProperty("dataSpriteCssClass");
    }

    public void setDataSpriteCssClass(java.lang.String value) {
        setProperty("dataSpriteCssClass", value);
    }

    public java.lang.String getDataTextField() {
        return (java.lang.String)getProperty("dataTextField");
    }

    public void setDataTextField(java.lang.String value) {
        setProperty("dataTextField", value);
    }

    public java.lang.String getDataUrlField() {
        return (java.lang.String)getProperty("dataUrlField");
    }

    public void setDataUrlField(java.lang.String value) {
        setProperty("dataUrlField", value);
    }

    public boolean getNavigatable() {
        return (boolean)getProperty("navigatable");
    }

    public void setNavigatable(boolean value) {
        setProperty("navigatable", value);
    }

    public boolean getScrollable() {
        return (boolean)getProperty("scrollable");
    }

    public void setScrollable(boolean value) {
        setProperty("scrollable", value);
    }

    public java.lang.String getTabPosition() {
        return (java.lang.String)getProperty("tabPosition");
    }

    public void setTabPosition(java.lang.String value) {
        setProperty("tabPosition", value);
    }

    public String getActivate() {
        Function property = ((Function)getProperty("activate"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setActivate(String value) {
        setProperty("activate", new Function(value));
    }

    public String getContentLoad() {
        Function property = ((Function)getProperty("contentLoad"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setContentLoad(String value) {
        setProperty("contentLoad", new Function(value));
    }

    public String getError() {
        Function property = ((Function)getProperty("error"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setError(String value) {
        setProperty("error", new Function(value));
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

    public String getShow() {
        Function property = ((Function)getProperty("show"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setShow(String value) {
        setProperty("show", new Function(value));
    }

//<< Attributes

}
