
package com.kendoui.taglib.lineargauge;

import com.kendoui.taglib.BaseTag;

import com.kendoui.taglib.LinearGaugeTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ScaleTag extends BaseTag /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        LinearGaugeTag parent = (LinearGaugeTag)findParentWithClass(LinearGaugeTag.class);


        parent.setScale(this);

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
        return "linearGauge-scale";
    }

    public void setLabels(com.kendoui.taglib.lineargauge.ScaleLabelsTag value) {
        setProperty("labels", value);
    }

    public void setLine(com.kendoui.taglib.lineargauge.ScaleLineTag value) {
        setProperty("line", value);
    }

    public void setMajorTicks(com.kendoui.taglib.lineargauge.ScaleMajorTicksTag value) {
        setProperty("majorTicks", value);
    }

    public void setMinorTicks(com.kendoui.taglib.lineargauge.ScaleMinorTicksTag value) {
        setProperty("minorTicks", value);
    }

    public void setRanges(ScaleRangesTag value) {

        setProperty("ranges", value.ranges());

    }

    public float getMajorUnit() {
        return (Float)getProperty("majorUnit");
    }

    public void setMajorUnit(float value) {
        setProperty("majorUnit", value);
    }

    public float getMax() {
        return (Float)getProperty("max");
    }

    public void setMax(float value) {
        setProperty("max", value);
    }

    public float getMin() {
        return (Float)getProperty("min");
    }

    public void setMin(float value) {
        setProperty("min", value);
    }

    public float getMinorUnit() {
        return (Float)getProperty("minorUnit");
    }

    public void setMinorUnit(float value) {
        setProperty("minorUnit", value);
    }

    public boolean getMirror() {
        return (Boolean)getProperty("mirror");
    }

    public void setMirror(boolean value) {
        setProperty("mirror", value);
    }

    public java.lang.String getRangePlaceholderColor() {
        return (java.lang.String)getProperty("rangePlaceholderColor");
    }

    public void setRangePlaceholderColor(java.lang.String value) {
        setProperty("rangePlaceholderColor", value);
    }

    public float getRangeSize() {
        return (Float)getProperty("rangeSize");
    }

    public void setRangeSize(float value) {
        setProperty("rangeSize", value);
    }

    public boolean getReverse() {
        return (Boolean)getProperty("reverse");
    }

    public void setReverse(boolean value) {
        setProperty("reverse", value);
    }

    public boolean getVertical() {
        return (Boolean)getProperty("vertical");
    }

    public void setVertical(boolean value) {
        setProperty("vertical", value);
    }

//<< Attributes

}
