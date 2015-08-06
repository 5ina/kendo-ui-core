
package com.kendoui.taglib.grid;

import com.kendoui.taglib.BaseTag;

import com.kendoui.taglib.GridTag;
import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class PageableTag extends BaseTag /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        GridTag parent = (GridTag)findParentWithClass(GridTag.class);


        parent.setPageable(this);

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
        return "grid-pageable";
    }

    public void setMessages(com.kendoui.taglib.grid.PageableMessagesTag value) {
        setProperty("messages", value);
    }

    public float getButtonCount() {
        return (float)getProperty("buttonCount");
    }

    public void setButtonCount(float value) {
        setProperty("buttonCount", value);
    }

    public boolean getInfo() {
        return (boolean)getProperty("info");
    }

    public void setInfo(boolean value) {
        setProperty("info", value);
    }

    public boolean getInput() {
        return (boolean)getProperty("input");
    }

    public void setInput(boolean value) {
        setProperty("input", value);
    }

    public boolean getNumeric() {
        return (boolean)getProperty("numeric");
    }

    public void setNumeric(boolean value) {
        setProperty("numeric", value);
    }

    public float getPageSize() {
        return (float)getProperty("pageSize");
    }

    public void setPageSize(float value) {
        setProperty("pageSize", value);
    }

    public boolean getPreviousNext() {
        return (boolean)getProperty("previousNext");
    }

    public void setPreviousNext(boolean value) {
        setProperty("previousNext", value);
    }

    public boolean getRefresh() {
        return (boolean)getProperty("refresh");
    }

    public void setRefresh(boolean value) {
        setProperty("refresh", value);
    }

//<< Attributes
    
    public java.lang.Object getPageSizes() {
        return (java.lang.Object)getProperty("pageSizes");
    }

    public void setPageSizes(java.lang.Object value) {        
        if (value instanceof java.lang.Object[])
        {
            setProperty("pageSizes", value);
        } 
        else 
        {
            setProperty("pageSizes", Boolean.parseBoolean((String) value));
        }
    }    
}
