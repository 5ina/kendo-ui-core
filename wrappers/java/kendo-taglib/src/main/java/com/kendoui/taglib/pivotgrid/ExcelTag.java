
package com.kendoui.taglib.pivotgrid;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.PivotGridTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ExcelTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        PivotGridTag parent = (PivotGridTag)findParentWithClass(PivotGridTag.class);


        parent.setExcel(this);

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
        return "pivotGrid-excel";
    }

    public java.lang.String getFileName() {
        return (java.lang.String)getProperty("fileName");
    }

    public void setFileName(java.lang.String value) {
        setProperty("fileName", value);
    }

    public boolean getFilterable() {
        return (Boolean)getProperty("filterable");
    }

    public void setFilterable(boolean value) {
        setProperty("filterable", value);
    }

    public boolean getForceProxy() {
        return (Boolean)getProperty("forceProxy");
    }

    public void setForceProxy(boolean value) {
        setProperty("forceProxy", value);
    }

    public java.lang.String getProxyURL() {
        return (java.lang.String)getProperty("proxyURL");
    }

    public void setProxyURL(java.lang.String value) {
        setProperty("proxyURL", value);
    }

//<< Attributes

}
