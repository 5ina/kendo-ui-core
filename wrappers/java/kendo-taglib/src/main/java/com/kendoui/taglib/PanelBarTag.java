
package com.kendoui.taglib;


import com.kendoui.taglib.panelbar.*;


import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Ul;
import com.kendoui.taglib.json.Function;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class PanelBarTag extends WidgetWithItemsTag /* interfaces */implements DataBoundWidget, Items/* interfaces */ {

    public PanelBarTag() {
        super("PanelBar");
    }
    
    @Override
    protected Element<?> createElement() {
        Ul element = new Ul();

        element.html(body());

        return element;
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
        return "panelBar";
    }

    public void setAnimation(com.kendoui.taglib.panelbar.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public void setMessages(com.kendoui.taglib.panelbar.MessagesTag value) {
        setProperty("messages", value);
    }

    public void setActivate(ActivateFunctionTag value) {
        setEvent("activate", value.getBody());
    }

    public void setCollapse(CollapseFunctionTag value) {
        setEvent("collapse", value.getBody());
    }

    public void setContentLoad(ContentLoadFunctionTag value) {
        setEvent("contentLoad", value.getBody());
    }

    public void setError(ErrorFunctionTag value) {
        setEvent("error", value.getBody());
    }

    public void setExpand(ExpandFunctionTag value) {
        setEvent("expand", value.getBody());
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

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public java.lang.Object getContentUrls() {
        return (java.lang.Object)getProperty("contentUrls");
    }

    public void setContentUrls(java.lang.Object value) {
        setProperty("contentUrls", value);
    }

    public java.lang.String getDataImageUrlField() {
        return (java.lang.String)getProperty("dataImageUrlField");
    }

    public void setDataImageUrlField(java.lang.String value) {
        setProperty("dataImageUrlField", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getDataSpriteCssClassField() {
        return (java.lang.String)getProperty("dataSpriteCssClassField");
    }

    public void setDataSpriteCssClassField(java.lang.String value) {
        setProperty("dataSpriteCssClassField", value);
    }

    public java.lang.Object getDataTextField() {
        return (java.lang.Object)getProperty("dataTextField");
    }

    public void setDataTextField(java.lang.Object value) {
        setProperty("dataTextField", value);
    }

    public java.lang.String getDataUrlField() {
        return (java.lang.String)getProperty("dataUrlField");
    }

    public void setDataUrlField(java.lang.String value) {
        setProperty("dataUrlField", value);
    }

    public java.lang.String getExpandMode() {
        return (java.lang.String)getProperty("expandMode");
    }

    public void setExpandMode(java.lang.String value) {
        setProperty("expandMode", value);
    }

    public boolean getLoadOnDemand() {
        return (Boolean)getProperty("loadOnDemand");
    }

    public void setLoadOnDemand(boolean value) {
        setProperty("loadOnDemand", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
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
