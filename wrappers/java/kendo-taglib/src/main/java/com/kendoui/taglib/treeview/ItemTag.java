
package com.kendoui.taglib.treeview;


import com.kendoui.taglib.BaseItemTag;
import com.kendoui.taglib.TreeViewTag;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Input;








import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.Tag;

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
    protected void addLinkAttributes(Element<?> element) {
        if (this.isSet("enabled") && !this.getEnabled()) {
            element.attr("class", "k-link k-state-disabled");
        } else if (this.isSet("selected") && this.getSelected()) {
            element.attr("class", "k-link k-state-selected");
        } else {
            super.addLinkAttributes(element);
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
    
    private boolean rendersCheckboxes() {
        Tag parent = this.getParent();
        
        while (parent.getClass() != TreeViewTag.class) {
            parent = parent.getParent();
        }
        
        Object checkboxes = ((TreeViewTag)parent).getProperty("checkboxes");
        
        if (checkboxes == null) {
            return false;
        } else if (checkboxes.getClass() == boolean.class) {
            return (Boolean)checkboxes;
        } else {
            return true;
        }
    }
    
    @Override
    protected void renderContents(Element<?> element) {
        
        if (this.rendersCheckboxes()) {
            Input checkbox = new Input();
            checkbox.attr("type", "checkbox");            
            element.append(checkbox);
        }
        
        super.renderContents(element);
    }

//>> Attributes
    public void setItems(ItemsTag value) {

        items = value.items();

    }

    public static String tagName() {
        return "treeView-item";
    }

    public boolean getChecked() {
        return (Boolean)getProperty("checked");
    }

    public void setChecked(boolean value) {
        setProperty("checked", value);
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
