
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ConnectionDefaultsEditableTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        ConnectionDefaultsTag parent = (ConnectionDefaultsTag)findParentWithClass(ConnectionDefaultsTag.class);


        parent.setEditable(this);

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
        return "diagram-connectionDefaults-editable";
    }

    public void setTools(ConnectionDefaultsEditableToolsTag value) {

        setProperty("tools", value.tools());

    }

    public boolean getDrag() {
        return (Boolean)getProperty("drag");
    }

    public void setDrag(boolean value) {
        setProperty("drag", value);
    }

    public boolean getRemove() {
        return (Boolean)getProperty("remove");
    }

    public void setRemove(boolean value) {
        setProperty("remove", value);
    }

//<< Attributes

}
