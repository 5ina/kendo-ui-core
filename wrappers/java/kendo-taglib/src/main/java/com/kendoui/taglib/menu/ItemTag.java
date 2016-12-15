
package com.kendoui.taglib.menu;


import com.kendoui.taglib.BaseItemTag;






import com.kendoui.taglib.html.Li;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ItemTag extends  BaseItemTag  /* interfaces */implements Items/* interfaces */ {
    @Override
    protected boolean getExpanded() {
        return false;
    }
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ItemsTag parent = (ItemsTag)findParentWithClass(ItemsTag.class);

        parent.addItem(this);

//<< doEndTag

        return super.doEndTag();
    }
    
    @Override
    protected void addAttributes(Li element){
        super.addAttributes(element);
        
        if (isSet("separator")) {
            element.attr("class", "k-separator");
        }

        if (isSet("selected") && getSelected()) {
            element.attr("class", "k-state-selected");
        }
        
        if (isSet("enabled") && getEnabled() == false) {
            element.attr("class", "k-state-disabled");
        }

        if (isSet("select") && getSelect() != null) {
            element.attr("onclick", getSelect());
        }
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
    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public static String tagName() {
        return "menu-item";
    }

    public boolean getEnabled() {
        return (Boolean)getProperty("enabled");
    }

    public void setEnabled(boolean value) {
        setProperty("enabled", value);
    }

    public java.lang.String getImageUrl() {
        return (java.lang.String)getProperty("imageUrl");
    }

    public void setImageUrl(java.lang.String value) {
        setProperty("imageUrl", value);
    }

    public java.lang.String getSelect() {
        return (java.lang.String)getProperty("select");
    }

    public void setSelect(java.lang.String value) {
        setProperty("select", value);
    }

    public boolean getSelected() {
        return (Boolean)getProperty("selected");
    }

    public void setSelected(boolean value) {
        setProperty("selected", value);
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

    public boolean getSeparator() {
        return (Boolean)getProperty("separator");
    }

    public void setSeparator(boolean value) {
        setProperty("separator", value);
    }

}
