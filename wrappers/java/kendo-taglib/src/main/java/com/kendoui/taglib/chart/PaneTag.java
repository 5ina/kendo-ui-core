
package com.kendoui.taglib.chart;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class PaneTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        PanesTag parent = (PanesTag)findParentWithClass(PanesTag.class);

        parent.addPane(this);

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
        return "chart-pane";
    }

    public void setBorder(com.kendoui.taglib.chart.PaneBorderTag value) {
        setProperty("border", value);
    }

    public void setMargin(com.kendoui.taglib.chart.PaneMarginTag value) {
        setProperty("margin", value);
    }

    public void setPadding(com.kendoui.taglib.chart.PanePaddingTag value) {
        setProperty("padding", value);
    }

    public void setTitle(com.kendoui.taglib.chart.PaneTitleTag value) {
        setProperty("title", value);
    }

    public java.lang.String getBackground() {
        return (java.lang.String)getProperty("background");
    }

    public void setBackground(java.lang.String value) {
        setProperty("background", value);
    }

    public boolean getClip() {
        return (Boolean)getProperty("clip");
    }

    public void setClip(boolean value) {
        setProperty("clip", value);
    }

    public float getHeight() {
        return (Float)getProperty("height");
    }

    public void setHeight(float value) {
        setProperty("height", value);
    }

    public float getMargin() {
        return (Float)getProperty("margin");
    }

    public void setMargin(float value) {
        setProperty("margin", value);
    }

    public java.lang.String getName() {
        return (java.lang.String)getProperty("name");
    }

    public void setName(java.lang.String value) {
        setProperty("name", value);
    }

    public float getPadding() {
        return (Float)getProperty("padding");
    }

    public void setPadding(float value) {
        setProperty("padding", value);
    }

    public java.lang.String getTitle() {
        return (java.lang.String)getProperty("title");
    }

    public void setTitle(java.lang.String value) {
        setProperty("title", value);
    }

//<< Attributes

}
