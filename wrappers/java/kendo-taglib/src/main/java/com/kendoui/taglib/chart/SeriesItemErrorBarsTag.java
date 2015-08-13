
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.json.Function;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SeriesItemErrorBarsTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        SeriesItemTag parent = (SeriesItemTag)findParentWithClass(SeriesItemTag.class);


        parent.setErrorBars(this);

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
        return "chart-seriesItem-errorBars";
    }

    public void setLine(com.kendoui.taglib.chart.SeriesItemErrorBarsLineTag value) {
        setProperty("line", value);
    }

    public void setValue(SeriesItemErrorBarsValueFunctionTag value) {
        setEvent("value", value.getBody());
    }

    public void setVisual(SeriesItemErrorBarsVisualFunctionTag value) {
        setEvent("visual", value.getBody());
    }

    public void setXValue(SeriesItemErrorBarsXValueFunctionTag value) {
        setEvent("xValue", value.getBody());
    }

    public void setYValue(SeriesItemErrorBarsYValueFunctionTag value) {
        setEvent("yValue", value.getBody());
    }

    public java.lang.String getColor() {
        return (java.lang.String)getProperty("color");
    }

    public void setColor(java.lang.String value) {
        setProperty("color", value);
    }

    public boolean getEndCaps() {
        return (Boolean)getProperty("endCaps");
    }

    public void setEndCaps(boolean value) {
        setProperty("endCaps", value);
    }

    public java.lang.String getValue() {
        return (java.lang.String)getProperty("value");
    }

    public void setValue(java.lang.String value) {
        setProperty("value", value);
    }

    public String getVisual() {
        Function property = ((Function)getProperty("visual"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setVisual(String value) {
        setProperty("visual", new Function(value));
    }

    public java.lang.String getXvalue() {
        return (java.lang.String)getProperty("xValue");
    }

    public void setXvalue(java.lang.String value) {
        setProperty("xValue", value);
    }

    public java.lang.String getYvalue() {
        return (java.lang.String)getProperty("yValue");
    }

    public void setYvalue(java.lang.String value) {
        setProperty("yValue", value);
    }

//<< Attributes

}
