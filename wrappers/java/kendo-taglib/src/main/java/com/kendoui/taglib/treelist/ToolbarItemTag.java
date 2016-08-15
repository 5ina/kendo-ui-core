
package com.kendoui.taglib.treelist;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ToolbarItemTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ToolbarTag parent = (ToolbarTag)findParentWithClass(ToolbarTag.class);

        parent.addToolbarItem(this);

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
        return "treeList-toolbarItem";
    }

    public void setClick(ToolbarItemClickFunctionTag value) {
        setEvent("click", value.getBody());
    }

    public String getClick() {
        Function property = ((Function)getProperty("click"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setClick(String value) {
        setProperty("click", new Function(value));
    }

    public java.lang.String getName() {
        return (java.lang.String)getProperty("name");
    }

    public void setName(java.lang.String value) {
        setProperty("name", value);
    }

    public java.lang.String getText() {
        return (java.lang.String)getProperty("text");
    }

    public void setText(java.lang.String value) {
        setProperty("text", value);
    }

//<< Attributes

}
