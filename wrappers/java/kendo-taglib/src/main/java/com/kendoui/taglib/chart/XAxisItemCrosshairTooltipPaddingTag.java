
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class XAxisItemCrosshairTooltipPaddingTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        XAxisItemCrosshairTooltipTag parent = (XAxisItemCrosshairTooltipTag)findParentWithClass(XAxisItemCrosshairTooltipTag.class);


        parent.setPadding(this);

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
        return "chart-xAxisItem-crosshair-tooltip-padding";
    }

    public float getBottom() {
        return (Float)getProperty("bottom");
    }

    public void setBottom(float value) {
        setProperty("bottom", value);
    }

    public float getLeft() {
        return (Float)getProperty("left");
    }

    public void setLeft(float value) {
        setProperty("left", value);
    }

    public float getRight() {
        return (Float)getProperty("right");
    }

    public void setRight(float value) {
        setProperty("right", value);
    }

    public float getTop() {
        return (Float)getProperty("top");
    }

    public void setTop(float value) {
        setProperty("top", value);
    }

//<< Attributes

}
