
package com.kendoui.taglib;


import java.io.IOException;
import java.io.StringWriter;

import com.kendoui.taglib.tooltip.*;


import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Empty;
import com.kendoui.taglib.html.Script;
import com.kendoui.taglib.json.Function;
import com.kendoui.taglib.json.Serializer;
import com.kendoui.taglib.json.Template;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class TooltipTag extends WidgetTag /* interfaces *//* interfaces */ {

    public TooltipTag() {
        super("Tooltip");
    }
    
    @Override
    protected Element<?> createElement() {
        return new Empty();
    }
    
    @Override
    public Script script() {
        StringWriter content = new StringWriter();

        content.append("jQuery(function(){jQuery(\"")
               .append(getName())
               .append("\").kendo")
               .append("Tooltip")
               .append("(");

        try {
            new Serializer().serialize(content, this);
        } catch (IOException exception) {
            // StringWriter is not supposed to throw IOException
        }

        content.append(");})");

        Script script = new Script();

        script.html(content.toString());

        return script;
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
        return "tooltip";
    }

    public void setAnimation(com.kendoui.taglib.tooltip.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setContentLoad(ContentLoadFunctionTag value) {
        setEvent("contentLoad", value.getBody());
    }

    public void setError(ErrorFunctionTag value) {
        setEvent("error", value.getBody());
    }

    public void setHide(HideFunctionTag value) {
        setEvent("hide", value.getBody());
    }

    public void setRequestStart(RequestStartFunctionTag value) {
        setEvent("requestStart", value.getBody());
    }

    public void setShow(ShowFunctionTag value) {
        setEvent("show", value.getBody());
    }

    public boolean getAnimation() {
        return (Boolean)getProperty("animation");
    }

    public void setAnimation(boolean value) {
        setProperty("animation", value);
    }

    public boolean getAutoHide() {
        return (Boolean)getProperty("autoHide");
    }

    public void setAutoHide(boolean value) {
        setProperty("autoHide", value);
    }

    public boolean getCallout() {
        return (Boolean)getProperty("callout");
    }

    public void setCallout(boolean value) {
        setProperty("callout", value);
    }

    public java.lang.String getFilter() {
        return (java.lang.String)getProperty("filter");
    }

    public void setFilter(java.lang.String value) {
        setProperty("filter", value);
    }

    public float getHeight() {
        return (Float)getProperty("height");
    }

    public void setHeight(float value) {
        setProperty("height", value);
    }

    public boolean getIframe() {
        return (Boolean)getProperty("iframe");
    }

    public void setIframe(boolean value) {
        setProperty("iframe", value);
    }

    public java.lang.String getPosition() {
        return (java.lang.String)getProperty("position");
    }

    public void setPosition(java.lang.String value) {
        setProperty("position", value);
    }

    public float getShowAfter() {
        return (Float)getProperty("showAfter");
    }

    public void setShowAfter(float value) {
        setProperty("showAfter", value);
    }

    public java.lang.String getShowOn() {
        return (java.lang.String)getProperty("showOn");
    }

    public void setShowOn(java.lang.String value) {
        setProperty("showOn", value);
    }

    public float getWidth() {
        return (Float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
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

    public String getHide() {
        Function property = ((Function)getProperty("hide"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setHide(String value) {
        setProperty("hide", new Function(value));
    }

    public String getRequestStart() {
        Function property = ((Function)getProperty("requestStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRequestStart(String value) {
        setProperty("requestStart", new Function(value));
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
    
    public void setContent(com.kendoui.taglib.tooltip.ContentTag value) {
        setProperty("content", value);        
    }
    
    public void setContent(Template value) {
        setProperty("content", value);        
    }
    
    public void setContent(String value) {        
        setProperty("content", value);        
    }
    
    public void setContent(Object value) {        
        setProperty("content", value);        
    }
}
