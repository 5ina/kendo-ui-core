
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SeriesItemExtremesBorderTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        SeriesItemExtremesTag parent = (SeriesItemExtremesTag)findParentWithClass(SeriesItemExtremesTag.class);


        parent.setBorder(this);

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
        return "chart-seriesItem-extremes-border";
    }

    public void setColor(SeriesItemExtremesBorderColorFunctionTag value) {
        setEvent("color", value.getBody());
    }

    public void setWidth(SeriesItemExtremesBorderWidthFunctionTag value) {
        setEvent("width", value.getBody());
    }

    public java.lang.String getColor() {
        return (java.lang.String)getProperty("color");
    }

    public void setColor(java.lang.String value) {
        setProperty("color", value);
    }

    public float getWidth() {
        return (Float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
    }

//<< Attributes

}
