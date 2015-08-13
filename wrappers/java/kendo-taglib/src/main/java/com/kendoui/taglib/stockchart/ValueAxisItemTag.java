
package com.kendoui.taglib.stockchart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ValueAxisItemTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ValueAxisTag parent = (ValueAxisTag)findParentWithClass(ValueAxisTag.class);

        parent.addValueAxisItem(this);

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
        return "stockChart-valueAxisItem";
    }

    public void setCrosshair(com.kendoui.taglib.stockchart.ValueAxisItemCrosshairTag value) {
        setProperty("crosshair", value);
    }

    public void setLabels(com.kendoui.taglib.stockchart.ValueAxisItemLabelsTag value) {
        setProperty("labels", value);
    }

    public void setLine(com.kendoui.taglib.stockchart.ValueAxisItemLineTag value) {
        setProperty("line", value);
    }

    public void setMajorGridLines(com.kendoui.taglib.stockchart.ValueAxisItemMajorGridLinesTag value) {
        setProperty("majorGridLines", value);
    }

    public void setMajorTicks(com.kendoui.taglib.stockchart.ValueAxisItemMajorTicksTag value) {
        setProperty("majorTicks", value);
    }

    public void setMinorGridLines(com.kendoui.taglib.stockchart.ValueAxisItemMinorGridLinesTag value) {
        setProperty("minorGridLines", value);
    }

    public void setMinorTicks(com.kendoui.taglib.stockchart.ValueAxisItemMinorTicksTag value) {
        setProperty("minorTicks", value);
    }

    public void setNotes(com.kendoui.taglib.stockchart.ValueAxisItemNotesTag value) {
        setProperty("notes", value);
    }

    public void setPlotBands(ValueAxisItemPlotBandsTag value) {

        setProperty("plotBands", value.plotBands());

    }

    public void setTitle(com.kendoui.taglib.stockchart.ValueAxisItemTitleTag value) {
        setProperty("title", value);
    }

    public java.lang.Object getAxisCrossingValue() {
        return (java.lang.Object)getProperty("axisCrossingValue");
    }

    public void setAxisCrossingValue(java.lang.Object value) {
        setProperty("axisCrossingValue", value);
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

    public java.lang.Object getName() {
        return (java.lang.Object)getProperty("name");
    }

    public void setName(java.lang.Object value) {
        setProperty("name", value);
    }

    public boolean getNarrowRange() {
        return (Boolean)getProperty("narrowRange");
    }

    public void setNarrowRange(boolean value) {
        setProperty("narrowRange", value);
    }

    public java.lang.String getPane() {
        return (java.lang.String)getProperty("pane");
    }

    public void setPane(java.lang.String value) {
        setProperty("pane", value);
    }

    public boolean getReverse() {
        return (Boolean)getProperty("reverse");
    }

    public void setReverse(boolean value) {
        setProperty("reverse", value);
    }

    public boolean getVisible() {
        return (Boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

//<< Attributes

}
