
package com.kendoui.taglib.listview;

import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.ListViewTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class PageableTag extends BaseTag {
    
    @Override
    public int doEndTag() throws JspException {
        ListViewTag parent = (ListViewTag)findParentWithClass(ListViewTag.class);

        parent.setPageable(this);

        return super.doEndTag();
    }

    @Override
    public void initialize() {
        super.initialize();
    }

    @Override
    public void destroy() {
        super.destroy();
    }

    public static String tagName() {
        return "listview-pageable";
    }

    public void setMessages(PageableMessagesTag value) {
        setProperty("messages", value);
    }

    public float getPageSize() {
        return (Float)getProperty("pageSize");
    }

    public void setPageSize(float value) {
        setProperty("pageSize", value);
    }

    public boolean getPreviousNext() {
        return (Boolean)getProperty("previousNext");
    }

    public void setPreviousNext(boolean value) {
        setProperty("previousNext", value);
    }

    public boolean getNumeric() {
        return (Boolean)getProperty("numeric");
    }

    public void setNumeric(boolean value) {
        setProperty("numeric", value);
    }

    public float getButtonCount() {
        return (Float)getProperty("buttonCount");
    }

    public void setButtonCount(float value) {
        setProperty("buttonCount", value);
    }

    public boolean getInput() {
        return (Boolean)getProperty("input");
    }

    public void setInput(boolean value) {
        setProperty("input", value);
    }

    public boolean getPageSizes() {
        return (Boolean)getProperty("pageSizes");
    }

    public void setPageSizes(boolean value) {
        setProperty("pageSizes", value);
    }

    public boolean getRefresh() {
        return (Boolean)getProperty("refresh");
    }

    public void setRefresh(boolean value) {
        setProperty("refresh", value);
    }

    public boolean getInfo() {
        return (Boolean)getProperty("info");
    }

    public void setInfo(boolean value) {
        setProperty("info", value);
    }
}
