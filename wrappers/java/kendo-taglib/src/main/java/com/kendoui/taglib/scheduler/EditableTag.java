
package com.kendoui.taglib.scheduler;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.SchedulerTag;




import com.kendoui.taglib.json.Function;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class EditableTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        SchedulerTag parent = (SchedulerTag)findParentWithClass(SchedulerTag.class);


        parent.setEditable(this);

//<< doEndTag

        if (isSet("template")) {
            setProperty("template", new Function("kendo.template($(\"#" + getTemplate() + "\").html())"));
        }

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
        return "scheduler-editable";
    }

    public void setTemplate(EditableTemplateFunctionTag value) {
        setEvent("template", value.getBody());
    }

    public java.lang.Object getConfirmation() {
        return (java.lang.Object)getProperty("confirmation");
    }

    public void setConfirmation(java.lang.Object value) {
        setProperty("confirmation", value);
    }

    public boolean getCreate() {
        return (boolean)getProperty("create");
    }

    public void setCreate(boolean value) {
        setProperty("create", value);
    }

    public boolean getDestroy() {
        return (boolean)getProperty("destroy");
    }

    public void setDestroy(boolean value) {
        setProperty("destroy", value);
    }

    public java.lang.String getEditRecurringMode() {
        return (java.lang.String)getProperty("editRecurringMode");
    }

    public void setEditRecurringMode(java.lang.String value) {
        setProperty("editRecurringMode", value);
    }

    public boolean getMove() {
        return (boolean)getProperty("move");
    }

    public void setMove(boolean value) {
        setProperty("move", value);
    }

    public boolean getResize() {
        return (boolean)getProperty("resize");
    }

    public void setResize(boolean value) {
        setProperty("resize", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public boolean getUpdate() {
        return (boolean)getProperty("update");
    }

    public void setUpdate(boolean value) {
        setProperty("update", value);
    }

    public java.lang.Object getWindow() {
        return (java.lang.Object)getProperty("window");
    }

    public void setWindow(java.lang.Object value) {
        setProperty("window", value);
    }

//<< Attributes

}
