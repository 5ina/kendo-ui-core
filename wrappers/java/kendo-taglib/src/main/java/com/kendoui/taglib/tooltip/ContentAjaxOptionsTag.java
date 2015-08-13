
package com.kendoui.taglib.tooltip;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.FunctionTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ContentAjaxOptionsTag extends  BaseTag  /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

       ContentTag parent = (ContentTag)findParentWithClass(ContentTag.class);

       parent.setUrl(this);

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
        return "tooltip-content-url";
    }

    public void setData(FunctionTag value) {
        setEvent("data", value.getBody());
    }

    public void setUrl(FunctionTag value) {
        setEvent("url", value.getBody());
    }

    public boolean getCache() {
        return (Boolean)getProperty("cache");
    }

    public void setCache(boolean value) {
        setProperty("cache", value);
    }

    public String getContentType() {
        return (String)getProperty("contentType");
    }

    public void setContentType(String value) {
        setProperty("contentType", value);
    }

    public Object getData() {
        return (Object)getProperty("data");
    }

    public void setData(Object value) {
        setProperty("data", value);
    }

    public String getDataType() {
        return (String)getProperty("dataType");
    }

    public void setDataType(String value) {
        setProperty("dataType", value);
    }

    public String getType() {
        return (String)getProperty("type");
    }

    public void setType(String value) {
        setProperty("type", value);
    }

    public String getUrl() {
        return (String)getProperty("url");
    }

    public void setUrl(String value) {
        setProperty("url", value);
    }

//<< Attributes

}
