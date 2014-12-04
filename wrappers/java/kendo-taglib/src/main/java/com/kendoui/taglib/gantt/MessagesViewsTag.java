
package com.kendoui.taglib.gantt;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class MessagesViewsTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        MessagesTag parent = (MessagesTag)findParentWithClass(MessagesTag.class);


        parent.setViews(this);

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
        return "gantt-messages-views";
    }

    public java.lang.String getDay() {
        return (java.lang.String)getProperty("day");
    }

    public void setDay(java.lang.String value) {
        setProperty("day", value);
    }

    public java.lang.String getEnd() {
        return (java.lang.String)getProperty("end");
    }

    public void setEnd(java.lang.String value) {
        setProperty("end", value);
    }

    public java.lang.String getMonth() {
        return (java.lang.String)getProperty("month");
    }

    public void setMonth(java.lang.String value) {
        setProperty("month", value);
    }

    public java.lang.String getStart() {
        return (java.lang.String)getProperty("start");
    }

    public void setStart(java.lang.String value) {
        setProperty("start", value);
    }

    public java.lang.String getWeek() {
        return (java.lang.String)getProperty("week");
    }

    public void setWeek(java.lang.String value) {
        setProperty("week", value);
    }

    public java.lang.String getYear() {
        return (java.lang.String)getProperty("year");
    }

    public void setYear(java.lang.String value) {
        setProperty("year", value);
    }

//<< Attributes

}
