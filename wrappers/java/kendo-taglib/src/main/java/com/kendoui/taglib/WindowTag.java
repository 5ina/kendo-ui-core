
package com.kendoui.taglib;


import com.kendoui.taglib.window.*;


import com.kendoui.taglib.html.Div;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class WindowTag extends WidgetTag /* interfaces *//* interfaces */ {

    public WindowTag() {
        super("Window");
    }

    @Override
    protected Element<?> createElement() {
        Div element = new Div();

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
        return "window";
    }

    public void setAnimation(com.kendoui.taglib.window.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setPosition(com.kendoui.taglib.window.PositionTag value) {
        setProperty("position", value);
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

    public void setDragend(DragendFunctionTag value) {
        setEvent("dragend", value.getBody());
    }

    public void setDragstart(DragstartFunctionTag value) {
        setEvent("dragstart", value.getBody());
    }

    public void setError(ErrorFunctionTag value) {
        setEvent("error", value.getBody());
    }

    public void setOpen(OpenFunctionTag value) {
        setEvent("open", value.getBody());
    }

    public void setRefresh(RefreshFunctionTag value) {
        setEvent("refresh", value.getBody());
    }

    public void setResize(ResizeFunctionTag value) {
        setEvent("resize", value.getBody());
    }

    public java.lang.Object getActions() {
        return (java.lang.Object)getProperty("actions");
    }

    public void setActions(java.lang.Object value) {
        setProperty("actions", value);
    }

    public java.lang.Object getAppendTo() {
        return (java.lang.Object)getProperty("appendTo");
    }

    public void setAppendTo(java.lang.Object value) {
        setProperty("appendTo", value);
    }

    public boolean getAutoFocus() {
        return (Boolean)getProperty("autoFocus");
    }

    public void setAutoFocus(boolean value) {
        setProperty("autoFocus", value);
    }

    public java.lang.Object getContent() {
        return (java.lang.Object)getProperty("content");
    }

    public void setContent(java.lang.Object value) {
        setProperty("content", value);
    }

    public boolean getDraggable() {
        return (Boolean)getProperty("draggable");
    }

    public void setDraggable(boolean value) {
        setProperty("draggable", value);
    }

    public java.lang.Object getHeight() {
        return (java.lang.Object)getProperty("height");
    }

    public void setHeight(java.lang.Object value) {
        setProperty("height", value);
    }

    public boolean getIframe() {
        return (Boolean)getProperty("iframe");
    }

    public void setIframe(boolean value) {
        setProperty("iframe", value);
    }

    public float getMaxHeight() {
        return (Float)getProperty("maxHeight");
    }

    public void setMaxHeight(float value) {
        setProperty("maxHeight", value);
    }

    public float getMaxWidth() {
        return (Float)getProperty("maxWidth");
    }

    public void setMaxWidth(float value) {
        setProperty("maxWidth", value);
    }

    public float getMinHeight() {
        return (Float)getProperty("minHeight");
    }

    public void setMinHeight(float value) {
        setProperty("minHeight", value);
    }

    public float getMinWidth() {
        return (Float)getProperty("minWidth");
    }

    public void setMinWidth(float value) {
        setProperty("minWidth", value);
    }

    public boolean getModal() {
        return (Boolean)getProperty("modal");
    }

    public void setModal(boolean value) {
        setProperty("modal", value);
    }

    public boolean getPinned() {
        return (Boolean)getProperty("pinned");
    }

    public void setPinned(boolean value) {
        setProperty("pinned", value);
    }

    public boolean getResizable() {
        return (Boolean)getProperty("resizable");
    }

    public void setResizable(boolean value) {
        setProperty("resizable", value);
    }

    public java.lang.Object getTitle() {
        return (java.lang.Object)getProperty("title");
    }

    public void setTitle(java.lang.Object value) {
        setProperty("title", value);
    }

    public boolean getVisible() {
        return (Boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

    public java.lang.Object getWidth() {
        return (java.lang.Object)getProperty("width");
    }

    public void setWidth(java.lang.Object value) {
        setProperty("width", value);
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

    public String getDragend() {
        Function property = ((Function)getProperty("dragend"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragend(String value) {
        setProperty("dragend", new Function(value));
    }

    public String getDragstart() {
        Function property = ((Function)getProperty("dragstart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragstart(String value) {
        setProperty("dragstart", new Function(value));
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

    public String getRefresh() {
        Function property = ((Function)getProperty("refresh"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRefresh(String value) {
        setProperty("refresh", new Function(value));
    }

    public String getResize() {
        Function property = ((Function)getProperty("resize"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setResize(String value) {
        setProperty("resize", new Function(value));
    }

//<< Attributes

}
