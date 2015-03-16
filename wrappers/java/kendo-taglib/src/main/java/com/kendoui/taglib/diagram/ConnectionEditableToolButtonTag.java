
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.json.Function;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ConnectionEditableToolButtonTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ConnectionEditableToolButtonsTag parent = (ConnectionEditableToolButtonsTag)findParentWithClass(ConnectionEditableToolButtonsTag.class);

        parent.addButton(this);

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
        return "diagram-connection-editable-tool-button";
    }

    public void setClick(ConnectionEditableToolButtonClickFunctionTag value) {
        setEvent("click", value.getBody());
    }

    public void setToggle(ConnectionEditableToolButtonToggleFunctionTag value) {
        setEvent("toggle", value.getBody());
    }

    public java.lang.Object getAttributes() {
        return (java.lang.Object)getProperty("attributes");
    }

    public void setAttributes(java.lang.Object value) {
        setProperty("attributes", value);
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

    public boolean getEnable() {
        return (boolean)getProperty("enable");
    }

    public void setEnable(boolean value) {
        setProperty("enable", value);
    }

    public java.lang.String getGroup() {
        return (java.lang.String)getProperty("group");
    }

    public void setGroup(java.lang.String value) {
        setProperty("group", value);
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

    public boolean getSelected() {
        return (boolean)getProperty("selected");
    }

    public void setSelected(boolean value) {
        setProperty("selected", value);
    }

    public java.lang.String getShowIcon() {
        return (java.lang.String)getProperty("showIcon");
    }

    public void setShowIcon(java.lang.String value) {
        setProperty("showIcon", value);
    }

    public java.lang.String getShowText() {
        return (java.lang.String)getProperty("showText");
    }

    public void setShowText(java.lang.String value) {
        setProperty("showText", value);
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

    public boolean getTogglable() {
        return (boolean)getProperty("togglable");
    }

    public void setTogglable(boolean value) {
        setProperty("togglable", value);
    }

    public String getToggle() {
        Function property = ((Function)getProperty("toggle"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setToggle(String value) {
        setProperty("toggle", new Function(value));
    }

    public java.lang.String getUrl() {
        return (java.lang.String)getProperty("url");
    }

    public void setUrl(java.lang.String value) {
        setProperty("url", value);
    }

//<< Attributes

}
