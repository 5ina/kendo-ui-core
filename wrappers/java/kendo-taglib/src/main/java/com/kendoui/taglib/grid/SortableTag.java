
package com.kendoui.taglib.grid;

import com.kendoui.taglib.BaseTag;

import com.kendoui.taglib.GridTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SortableTag extends BaseTag /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        GridTag parent = (GridTag)findParentWithClass(GridTag.class);


        parent.setSortable(this);

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
        return "grid-sortable";
    }

    public boolean getAllowUnsort() {
        return (Boolean)getProperty("allowUnsort");
    }

    public void setAllowUnsort(boolean value) {
        setProperty("allowUnsort", value);
    }

    public java.lang.String getInitialDirection() {
        return (java.lang.String)getProperty("initialDirection");
    }

    public void setInitialDirection(java.lang.String value) {
        setProperty("initialDirection", value);
    }

    public java.lang.String getMode() {
        return (java.lang.String)getProperty("mode");
    }

    public void setMode(java.lang.String value) {
        setProperty("mode", value);
    }

    public boolean getShowIndexes() {
        return (Boolean)getProperty("showIndexes");
    }

    public void setShowIndexes(boolean value) {
        setProperty("showIndexes", value);
    }

//<< Attributes

}
