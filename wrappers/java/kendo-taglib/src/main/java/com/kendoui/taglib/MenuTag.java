
package com.kendoui.taglib;


import com.kendoui.taglib.menu.*;

import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Ul;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class MenuTag extends WidgetWithItemsTag /* interfaces */implements DataBoundWidget, Items/* interfaces */ {

    public MenuTag() {
        super("Menu");
    }

    @Override
    public Element<?> createElement() {
        Ul ul = new Ul();
        
        ul.html(body());
        
        return ul;
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
        return "menu";
    }

    public void setAnimation(com.kendoui.taglib.menu.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public void setActivate(ActivateFunctionTag value) {
        setEvent("activate", value.getBody());
    }

    public void setClose(CloseFunctionTag value) {
        setEvent("close", value.getBody());
    }

    public void setDeactivate(DeactivateFunctionTag value) {
        setEvent("deactivate", value.getBody());
    }

    public void setOpen(OpenFunctionTag value) {
        setEvent("open", value.getBody());
    }

    public void setSelect(SelectFunctionTag value) {
        setEvent("select", value.getBody());
    }

    public boolean getCloseOnClick() {
        return (Boolean)getProperty("closeOnClick");
    }

    public void setCloseOnClick(boolean value) {
        setProperty("closeOnClick", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getDirection() {
        return (java.lang.String)getProperty("direction");
    }

    public void setDirection(java.lang.String value) {
        setProperty("direction", value);
    }

    public float getHoverDelay() {
        return (Float)getProperty("hoverDelay");
    }

    public void setHoverDelay(float value) {
        setProperty("hoverDelay", value);
    }

    public boolean getOpenOnClick() {
        return (Boolean)getProperty("openOnClick");
    }

    public void setOpenOnClick(boolean value) {
        setProperty("openOnClick", value);
    }

    public java.lang.String getOrientation() {
        return (java.lang.String)getProperty("orientation");
    }

    public void setOrientation(java.lang.String value) {
        setProperty("orientation", value);
    }

    public java.lang.String getPopupCollision() {
        return (java.lang.String)getProperty("popupCollision");
    }

    public void setPopupCollision(java.lang.String value) {
        setProperty("popupCollision", value);
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

    public String getDeactivate() {
        Function property = ((Function)getProperty("deactivate"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDeactivate(String value) {
        setProperty("deactivate", new Function(value));
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
