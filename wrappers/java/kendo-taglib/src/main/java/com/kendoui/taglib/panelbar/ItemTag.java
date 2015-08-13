
package com.kendoui.taglib.panelbar;


import com.kendoui.taglib.BaseItemTag;
import com.kendoui.taglib.html.Anchor;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Li;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ItemTag extends  BaseItemTag  /* interfaces */implements Items/* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ItemsTag parent = (ItemsTag)findParentWithClass(ItemsTag.class);

        parent.addItem(this);

//<< doEndTag

        return super.doEndTag();
    }

    @Override
    protected void renderContents(Element<?> element) {
        boolean ajax = this.isSet("contentUrl") && !this.getContentUrl().isEmpty();
        Element<?> container = element;
        
        if (ajax) {
            Anchor a = new Anchor();
            a.attr("class", "k-link k-header");
            a.attr("href", this.getContentUrl());
            container.append(a);
            container = a;
        }        
        
        super.renderContents(container);
        
        if (ajax && body().isEmpty()) {
            appendContent(element, "");
        }
    }
    
    @Override
    protected void addLinkAttributes(Element<?> element) {
        if (this.isSet("selected") && this.getSelected()) {
            element.attr("class", "k-link k-state-selected");
        } else {
            super.addLinkAttributes(element);
        }
    }
    
    @Override
    public void addAttributes(Li element) {
        if (this.isSet("expanded") && this.getExpanded()) {
            element.attr("class", "k-state-active");
        }
        super.addAttributes(element);
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
        return "panelBar-item";
    }

    public java.lang.String getContentUrl() {
        return (java.lang.String)getProperty("contentUrl");
    }

    public void setContentUrl(java.lang.String value) {
        setProperty("contentUrl", value);
    }

    public boolean getEnabled() {
        return (Boolean)getProperty("enabled");
    }

    public void setEnabled(boolean value) {
        setProperty("enabled", value);
    }

    public boolean getExpanded() {
        return (Boolean)getProperty("expanded");
    }

    public void setExpanded(boolean value) {
        setProperty("expanded", value);
    }

    public java.lang.String getImageUrl() {
        return (java.lang.String)getProperty("imageUrl");
    }

    public void setImageUrl(java.lang.String value) {
        setProperty("imageUrl", value);
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

}
