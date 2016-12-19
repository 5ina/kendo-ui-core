
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.json.Function;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SeriesItemLabelsTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        SeriesItemTag parent = (SeriesItemTag)findParentWithClass(SeriesItemTag.class);


        parent.setLabels(this);

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
        return "chart-seriesItem-labels";
    }

    public void setBorder(com.kendoui.taglib.chart.SeriesItemLabelsBorderTag value) {
        setProperty("border", value);
    }

    public void setFrom(com.kendoui.taglib.chart.SeriesItemLabelsFromTag value) {
        setProperty("from", value);
    }

    public void setMargin(com.kendoui.taglib.chart.SeriesItemLabelsMarginTag value) {
        setProperty("margin", value);
    }

    public void setPadding(com.kendoui.taglib.chart.SeriesItemLabelsPaddingTag value) {
        setProperty("padding", value);
    }

    public void setTo(com.kendoui.taglib.chart.SeriesItemLabelsToTag value) {
        setProperty("to", value);
    }

    public void setBackground(SeriesItemLabelsBackgroundFunctionTag value) {
        setEvent("background", value.getBody());
    }

    public void setColor(SeriesItemLabelsColorFunctionTag value) {
        setEvent("color", value.getBody());
    }

    public void setFont(SeriesItemLabelsFontFunctionTag value) {
        setEvent("font", value.getBody());
    }

    public void setFormat(SeriesItemLabelsFormatFunctionTag value) {
        setEvent("format", value.getBody());
    }

    public void setPosition(SeriesItemLabelsPositionFunctionTag value) {
        setEvent("position", value.getBody());
    }

    public void setTemplate(SeriesItemLabelsTemplateFunctionTag value) {
        setEvent("template", value.getBody());
    }

    public void setVisible(SeriesItemLabelsVisibleFunctionTag value) {
        setEvent("visible", value.getBody());
    }

    public void setVisual(SeriesItemLabelsVisualFunctionTag value) {
        setEvent("visual", value.getBody());
    }

    public java.lang.String getAlign() {
        return (java.lang.String)getProperty("align");
    }

    public void setAlign(java.lang.String value) {
        setProperty("align", value);
    }

    public java.lang.String getBackground() {
        return (java.lang.String)getProperty("background");
    }

    public void setBackground(java.lang.String value) {
        setProperty("background", value);
    }

    public java.lang.String getColor() {
        return (java.lang.String)getProperty("color");
    }

    public void setColor(java.lang.String value) {
        setProperty("color", value);
    }

    public float getDistance() {
        return (Float)getProperty("distance");
    }

    public void setDistance(float value) {
        setProperty("distance", value);
    }

    public java.lang.String getFont() {
        return (java.lang.String)getProperty("font");
    }

    public void setFont(java.lang.String value) {
        setProperty("font", value);
    }

    public java.lang.String getFormat() {
        return (java.lang.String)getProperty("format");
    }

    public void setFormat(java.lang.String value) {
        setProperty("format", value);
    }

    public float getMargin() {
        return (Float)getProperty("margin");
    }

    public void setMargin(float value) {
        setProperty("margin", value);
    }

    public float getPadding() {
        return (Float)getProperty("padding");
    }

    public void setPadding(float value) {
        setProperty("padding", value);
    }

    public java.lang.String getPosition() {
        return (java.lang.String)getProperty("position");
    }

    public void setPosition(java.lang.String value) {
        setProperty("position", value);
    }

    public java.lang.Object getRotation() {
        return (java.lang.Object)getProperty("rotation");
    }

    public void setRotation(java.lang.Object value) {
        setProperty("rotation", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public boolean getVisible() {
        return (Boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
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

//<< Attributes

}
