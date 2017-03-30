
package com.kendoui.taglib;


import com.kendoui.taglib.datetimepicker.*;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;
import com.kendoui.taglib.json.Function;



import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class DateTimePickerTag extends WidgetTag /* interfaces *//* interfaces */ {

    public DateTimePickerTag() {
        super("DateTimePicker");
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
    
    public String getDisableDates() {
        Function property = ((Function)getProperty("disableDates"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDisableDates(String value) {
        setProperty("disableDates", new Function(value));
    }

//>> Attributes

    public static String tagName() {
        return "dateTimePicker";
    }

    public void setAnimation(com.kendoui.taglib.datetimepicker.AnimationTag value) {
        setProperty("animation", value);
    }

    public void setMonth(com.kendoui.taglib.datetimepicker.MonthTag value) {
        setProperty("month", value);
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setClose(CloseFunctionTag value) {
        setEvent("close", value.getBody());
    }

    public void setOpen(OpenFunctionTag value) {
        setEvent("open", value.getBody());
    }

    public java.lang.String getARIATemplate() {
        return (java.lang.String)getProperty("ARIATemplate");
    }

    public void setARIATemplate(java.lang.String value) {
        setProperty("ARIATemplate", value);
    }

    public boolean getAnimation() {
        return (Boolean)getProperty("animation");
    }

    public void setAnimation(boolean value) {
        setProperty("animation", value);
    }

    public java.lang.String getCulture() {
        return (java.lang.String)getProperty("culture");
    }

    public void setCulture(java.lang.String value) {
        setProperty("culture", value);
    }

    public boolean getDateInput() {
        return (Boolean)getProperty("dateInput");
    }

    public void setDateInput(boolean value) {
        setProperty("dateInput", value);
    }

    public java.lang.Object getDates() {
        return (java.lang.Object)getProperty("dates");
    }

    public void setDates(java.lang.Object value) {
        setProperty("dates", value);
    }

    public java.lang.String getDepth() {
        return (java.lang.String)getProperty("depth");
    }

    public void setDepth(java.lang.String value) {
        setProperty("depth", value);
    }

    public java.lang.String getFooter() {
        return (java.lang.String)getProperty("footer");
    }

    public void setFooter(java.lang.String value) {
        setProperty("footer", value);
    }

    public java.lang.String getFormat() {
        return (java.lang.String)getProperty("format");
    }

    public void setFormat(java.lang.String value) {
        setProperty("format", value);
    }

    public float getInterval() {
        return (Float)getProperty("interval");
    }

    public void setInterval(float value) {
        setProperty("interval", value);
    }

    public java.util.Date getMax() {
        return (java.util.Date)getProperty("max");
    }

    public void setMax(java.util.Date value) {
        setProperty("max", value);
    }

    public java.util.Date getMin() {
        return (java.util.Date)getProperty("min");
    }

    public void setMin(java.util.Date value) {
        setProperty("min", value);
    }

    public java.lang.Object getParseFormats() {
        return (java.lang.Object)getProperty("parseFormats");
    }

    public void setParseFormats(java.lang.Object value) {
        setProperty("parseFormats", value);
    }

    public java.lang.String getStart() {
        return (java.lang.String)getProperty("start");
    }

    public void setStart(java.lang.String value) {
        setProperty("start", value);
    }

    public java.lang.String getTimeFormat() {
        return (java.lang.String)getProperty("timeFormat");
    }

    public void setTimeFormat(java.lang.String value) {
        setProperty("timeFormat", value);
    }

    public java.util.Date getValue() {
        return (java.util.Date)getProperty("value");
    }

    public void setValue(java.util.Date value) {
        setProperty("value", value);
    }

    public boolean getWeekNumber() {
        return (Boolean)getProperty("weekNumber");
    }

    public void setWeekNumber(boolean value) {
        setProperty("weekNumber", value);
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

    public String getClose() {
        Function property = ((Function)getProperty("close"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setClose(String value) {
        setProperty("close", new Function(value));
    }

    public String getOpen() {
        Function property = ((Function)getProperty("open"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setOpen(String value) {
        setProperty("open", new Function(value));
    }

//<< Attributes

}
