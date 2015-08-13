
package com.kendoui.taglib.map;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class LayerTooltipAnimationOpenTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        LayerTooltipAnimationTag parent = (LayerTooltipAnimationTag)findParentWithClass(LayerTooltipAnimationTag.class);


        parent.setOpen(this);

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
        return "map-layer-tooltip-animation-open";
    }

    public float getDuration() {
        return (Float)getProperty("duration");
    }

    public void setDuration(float value) {
        setProperty("duration", value);
    }

    public java.lang.String getEffects() {
        return (java.lang.String)getProperty("effects");
    }

    public void setEffects(java.lang.String value) {
        setProperty("effects", value);
    }

//<< Attributes

}
