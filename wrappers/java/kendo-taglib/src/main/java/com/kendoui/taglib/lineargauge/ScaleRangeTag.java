
package com.kendoui.taglib.lineargauge;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ScaleRangeTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ScaleRangesTag parent = (ScaleRangesTag)findParentWithClass(ScaleRangesTag.class);

        parent.addRange(this);

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
        return "linearGauge-scale-range";
    }

    public java.lang.String getColor() {
        return (java.lang.String)getProperty("color");
    }

    public void setColor(java.lang.String value) {
        setProperty("color", value);
    }

    public float getFrom() {
        return (Float)getProperty("from");
    }

    public void setFrom(float value) {
        setProperty("from", value);
    }

    public float getOpacity() {
        return (Float)getProperty("opacity");
    }

    public void setOpacity(float value) {
        setProperty("opacity", value);
    }

    public float getTo() {
        return (Float)getProperty("to");
    }

    public void setTo(float value) {
        setProperty("to", value);
    }

//<< Attributes

}
