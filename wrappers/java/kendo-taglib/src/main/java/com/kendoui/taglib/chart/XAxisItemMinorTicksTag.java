
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class XAxisItemMinorTicksTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        XAxisItemTag parent = (XAxisItemTag)findParentWithClass(XAxisItemTag.class);


        parent.setMinorTicks(this);

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
        return "chart-xAxisItem-minorTicks";
    }

    public java.lang.String getColor() {
        return (java.lang.String)getProperty("color");
    }

    public void setColor(java.lang.String value) {
        setProperty("color", value);
    }

    public float getSize() {
        return (Float)getProperty("size");
    }

    public void setSize(float value) {
        setProperty("size", value);
    }

    public float getSkip() {
        return (Float)getProperty("skip");
    }

    public void setSkip(float value) {
        setProperty("skip", value);
    }

    public float getStep() {
        return (Float)getProperty("step");
    }

    public void setStep(float value) {
        setProperty("step", value);
    }

    public boolean getVisible() {
        return (Boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

    public float getWidth() {
        return (Float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
    }

//<< Attributes

}
