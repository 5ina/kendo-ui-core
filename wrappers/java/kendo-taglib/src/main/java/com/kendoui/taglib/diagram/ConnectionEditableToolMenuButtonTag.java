
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ConnectionEditableToolMenuButtonTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ConnectionEditableToolMenuButtonsTag parent = (ConnectionEditableToolMenuButtonsTag)findParentWithClass(ConnectionEditableToolMenuButtonsTag.class);

        parent.addMenuButton(this);

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
        return "diagram-connection-editable-tool-menuButton";
    }

    public java.lang.Object getAttributes() {
        return (java.lang.Object)getProperty("attributes");
    }

    public void setAttributes(java.lang.Object value) {
        setProperty("attributes", value);
    }

    public boolean getEnable() {
        return (Boolean)getProperty("enable");
    }

    public void setEnable(boolean value) {
        setProperty("enable", value);
    }

    public java.lang.String getIcon() {
        return (java.lang.String)getProperty("icon");
    }

    public void setIcon(java.lang.String value) {
        setProperty("icon", value);
    }

    public java.lang.String getId() {
        return (java.lang.String)getProperty("id");
    }

    public void setId(java.lang.String value) {
        setProperty("id", value);
    }

    public java.lang.String getImageUrl() {
        return (java.lang.String)getProperty("imageUrl");
    }

    public void setImageUrl(java.lang.String value) {
        setProperty("imageUrl", value);
    }

    public java.lang.String getSpriteCssClass() {
        return (java.lang.String)getProperty("spriteCssClass");
    }

    public void setSpriteCssClass(java.lang.String value) {
        setProperty("spriteCssClass", value);
    }

    public java.lang.String getText() {
        return (java.lang.String)getProperty("text");
    }

    public void setText(java.lang.String value) {
        setProperty("text", value);
    }

    public java.lang.String getUrl() {
        return (java.lang.String)getProperty("url");
    }

    public void setUrl(java.lang.String value) {
        setProperty("url", value);
    }

//<< Attributes

}
