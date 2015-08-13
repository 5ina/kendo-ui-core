
package com.kendoui.taglib;

import javax.servlet.jsp.JspException;

import com.kendoui.taglib.radialgauge.PointerTag;

@SuppressWarnings("serial")
public class RadialGaugeTag extends WidgetTag /* interfaces *//* interfaces */ {

    public RadialGaugeTag() {
        super("RadialGauge");
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
        return "radialGauge";
    }

    public void setGaugeArea(com.kendoui.taglib.radialgauge.GaugeAreaTag value) {
        setProperty("gaugeArea", value);
    }

    public void setPointer(PointerTag value) {

        setProperty("pointer", value.pointer());

    }

    public void setScale(com.kendoui.taglib.radialgauge.ScaleTag value) {
        setProperty("scale", value);
    }

    public java.lang.String getRenderAs() {
        return (java.lang.String)getProperty("renderAs");
    }

    public void setRenderAs(java.lang.String value) {
        setProperty("renderAs", value);
    }

    public boolean getTransitions() {
        return (Boolean)getProperty("transitions");
    }

    public void setTransitions(boolean value) {
        setProperty("transitions", value);
    }

//<< Attributes

}
