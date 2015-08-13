
package com.kendoui.taglib.map;


import com.kendoui.taglib.BaseTag;






import com.kendoui.taglib.json.Template;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class LayerDefaultsMarkerTooltipTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        LayerDefaultsMarkerTag parent = (LayerDefaultsMarkerTag)findParentWithClass(LayerDefaultsMarkerTag.class);


        parent.setTooltip(this);

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
        return "map-layerDefaults-marker-tooltip";
    }

    public void setAnimation(com.kendoui.taglib.map.LayerDefaultsMarkerTooltipAnimationTag value) {
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

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public float getWidth() {
        return (Float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
    }

//<< Attributes
    
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
