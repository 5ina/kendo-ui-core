
package com.kendoui.taglib;


import com.kendoui.taglib.slider.*;


import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SliderTag extends WidgetTag /* interfaces *//* interfaces */ {

    public SliderTag() {
        super("Slider");
    }

    protected Element<?> createElement() {
        return new Input().attr("name", getName());
    }
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
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
        return "slider";
    }

    public void setTooltip(com.kendoui.taglib.slider.TooltipTag value) {
        setProperty("tooltip", value);
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setSlide(SlideFunctionTag value) {
        setEvent("slide", value.getBody());
    }

    public java.lang.String getDecreaseButtonTitle() {
        return (java.lang.String)getProperty("decreaseButtonTitle");
    }

    public void setDecreaseButtonTitle(java.lang.String value) {
        setProperty("decreaseButtonTitle", value);
    }

    public java.lang.String getDragHandleTitle() {
        return (java.lang.String)getProperty("dragHandleTitle");
    }

    public void setDragHandleTitle(java.lang.String value) {
        setProperty("dragHandleTitle", value);
    }

    public java.lang.String getIncreaseButtonTitle() {
        return (java.lang.String)getProperty("increaseButtonTitle");
    }

    public void setIncreaseButtonTitle(java.lang.String value) {
        setProperty("increaseButtonTitle", value);
    }

    public float getLargeStep() {
        return (Float)getProperty("largeStep");
    }

    public void setLargeStep(float value) {
        setProperty("largeStep", value);
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

    public java.lang.String getOrientation() {
        return (java.lang.String)getProperty("orientation");
    }

    public void setOrientation(java.lang.String value) {
        setProperty("orientation", value);
    }

    public boolean getShowButtons() {
        return (Boolean)getProperty("showButtons");
    }

    public void setShowButtons(boolean value) {
        setProperty("showButtons", value);
    }

    public float getSmallStep() {
        return (Float)getProperty("smallStep");
    }

    public void setSmallStep(float value) {
        setProperty("smallStep", value);
    }

    public java.lang.String getTickPlacement() {
        return (java.lang.String)getProperty("tickPlacement");
    }

    public void setTickPlacement(java.lang.String value) {
        setProperty("tickPlacement", value);
    }

    public float getValue() {
        return (Float)getProperty("value");
    }

    public void setValue(float value) {
        setProperty("value", value);
    }

    public String getChange() {
        Function property = ((Function)getProperty("change"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setChange(String value) {
        setProperty("change", new Function(value));
    }

    public String getSlide() {
        Function property = ((Function)getProperty("slide"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSlide(String value) {
        setProperty("slide", new Function(value));
    }

//<< Attributes

}
