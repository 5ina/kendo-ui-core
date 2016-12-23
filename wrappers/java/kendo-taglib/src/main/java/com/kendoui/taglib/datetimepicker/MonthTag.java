
package com.kendoui.taglib.datetimepicker;

import com.kendoui.taglib.BaseTag;

import com.kendoui.taglib.DateTimePickerTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class MonthTag extends BaseTag /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        DateTimePickerTag parent = (DateTimePickerTag)findParentWithClass(DateTimePickerTag.class);


        parent.setMonth(this);

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
        return "dateTimePicker-month";
    }

    public java.lang.String getContent() {
        return (java.lang.String)getProperty("content");
    }

    public void setContent(java.lang.String value) {
        setProperty("content", value);
    }

    public java.lang.String getEmpty() {
        return (java.lang.String)getProperty("empty");
    }

    public void setEmpty(java.lang.String value) {
        setProperty("empty", value);
    }

    public java.lang.String getWeekNumber() {
        return (java.lang.String)getProperty("weekNumber");
    }

    public void setWeekNumber(java.lang.String value) {
        setProperty("weekNumber", value);
    }

//<< Attributes

}
