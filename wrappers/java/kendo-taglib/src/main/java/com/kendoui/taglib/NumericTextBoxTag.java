
package com.kendoui.taglib;

import com.kendoui.taglib.numerictextbox.*;

import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;
import com.kendoui.taglib.json.Function;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class NumericTextBoxTag extends WidgetTag /* interfaces *//* interfaces */ {

    public NumericTextBoxTag() {
        super("NumericTextBox");
    }

    @Override
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
        return "numericTextBox";
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setSpin(SpinFunctionTag value) {
        setEvent("spin", value.getBody());
    }

    public java.lang.String getCulture() {
        return (java.lang.String)getProperty("culture");
    }

    public void setCulture(java.lang.String value) {
        setProperty("culture", value);
    }

    public float getDecimals() {
        return (Float)getProperty("decimals");
    }

    public void setDecimals(float value) {
        setProperty("decimals", value);
    }

    public java.lang.String getDownArrowText() {
        return (java.lang.String)getProperty("downArrowText");
    }

    public void setDownArrowText(java.lang.String value) {
        setProperty("downArrowText", value);
    }

    public float getFactor() {
        return (Float)getProperty("factor");
    }

    public void setFactor(float value) {
        setProperty("factor", value);
    }

    public java.lang.String getFormat() {
        return (java.lang.String)getProperty("format");
    }

    public void setFormat(java.lang.String value) {
        setProperty("format", value);
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

    public java.lang.String getPlaceholder() {
        return (java.lang.String)getProperty("placeholder");
    }

    public void setPlaceholder(java.lang.String value) {
        setProperty("placeholder", value);
    }

    public boolean getRestrictDecimals() {
        return (Boolean)getProperty("restrictDecimals");
    }

    public void setRestrictDecimals(boolean value) {
        setProperty("restrictDecimals", value);
    }

    public boolean getRound() {
        return (Boolean)getProperty("round");
    }

    public void setRound(boolean value) {
        setProperty("round", value);
    }

    public boolean getSpinners() {
        return (Boolean)getProperty("spinners");
    }

    public void setSpinners(boolean value) {
        setProperty("spinners", value);
    }

    public float getStep() {
        return (Float)getProperty("step");
    }

    public void setStep(float value) {
        setProperty("step", value);
    }

    public java.lang.String getUpArrowText() {
        return (java.lang.String)getProperty("upArrowText");
    }

    public void setUpArrowText(java.lang.String value) {
        setProperty("upArrowText", value);
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

    public String getSpin() {
        Function property = ((Function)getProperty("spin"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSpin(String value) {
        setProperty("spin", new Function(value));
    }

//<< Attributes

}
