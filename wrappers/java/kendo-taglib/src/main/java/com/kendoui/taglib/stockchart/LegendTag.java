
package com.kendoui.taglib.stockchart;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.StockChartTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class LegendTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        StockChartTag parent = (StockChartTag)findParentWithClass(StockChartTag.class);


        parent.setLegend(this);

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
        return "stockChart-legend";
    }

    public void setBorder(com.kendoui.taglib.stockchart.LegendBorderTag value) {
        setProperty("border", value);
    }

    public void setInactiveItems(com.kendoui.taglib.stockchart.LegendInactiveItemsTag value) {
        setProperty("inactiveItems", value);
    }

    public void setItem(com.kendoui.taglib.stockchart.LegendItemTag value) {
        setProperty("item", value);
    }

    public void setLabels(com.kendoui.taglib.stockchart.LegendLabelsTag value) {
        setProperty("labels", value);
    }

    public java.lang.String getBackground() {
        return (java.lang.String)getProperty("background");
    }

    public void setBackground(java.lang.String value) {
        setProperty("background", value);
    }

    public java.lang.Object getMargin() {
        return (java.lang.Object)getProperty("margin");
    }

    public void setMargin(java.lang.Object value) {
        setProperty("margin", value);
    }

    public float getOffsetX() {
        return (float)getProperty("offsetX");
    }

    public void setOffsetX(float value) {
        setProperty("offsetX", value);
    }

    public float getOffsetY() {
        return (float)getProperty("offsetY");
    }

    public void setOffsetY(float value) {
        setProperty("offsetY", value);
    }

    public java.lang.Object getPadding() {
        return (java.lang.Object)getProperty("padding");
    }

    public void setPadding(java.lang.Object value) {
        setProperty("padding", value);
    }

    public java.lang.String getPosition() {
        return (java.lang.String)getProperty("position");
    }

    public void setPosition(java.lang.String value) {
        setProperty("position", value);
    }

    public boolean getReverse() {
        return (boolean)getProperty("reverse");
    }

    public void setReverse(boolean value) {
        setProperty("reverse", value);
    }

    public boolean getVisible() {
        return (boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

//<< Attributes

}
