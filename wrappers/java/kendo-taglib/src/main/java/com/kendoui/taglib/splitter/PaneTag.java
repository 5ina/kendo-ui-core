
package com.kendoui.taglib.splitter;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.html.Div;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.DynamicAttributes;

@SuppressWarnings("serial")
public class PaneTag extends  BaseTag implements DynamicAttributes /* interfaces *//* interfaces */ {
    private Map<String, Object> attributes;
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        PanesTag parent = (PanesTag)findParentWithClass(PanesTag.class);

        parent.addPane(this);

//<< doEndTag
        
        try {
            html().write(pageContext.getOut());                
        } catch (IOException exception) {
            throw new JspException(exception);
        }
        
        return super.doEndTag();
    }
    
    public Div html() {
        Div element = new Div();
        String content = body();

        for (String attribute : attributes.keySet()) {
            Object value = attributes.get(attribute);
            
            if (value != null) {
                element.attr(attribute, value);
            }
        }
        
        if (!content.isEmpty()) {                
            element.html(content);
        }

        return element;
    }

    @Override
    public void initialize() {
//>> initialize
//<< initialize
        attributes = new HashMap<String, Object>();

        super.initialize();
    }

    @Override
    public void destroy() {
//>> destroy
//<< destroy
        attributes = null;

        super.destroy();
    }

//>> Attributes

    public static String tagName() {
        return "splitter-pane";
    }

    public boolean getCollapsed() {
        return (Boolean)getProperty("collapsed");
    }

    public void setCollapsed(boolean value) {
        setProperty("collapsed", value);
    }

    public java.lang.String getCollapsedSize() {
        return (java.lang.String)getProperty("collapsedSize");
    }

    public void setCollapsedSize(java.lang.String value) {
        setProperty("collapsedSize", value);
    }

    public boolean getCollapsible() {
        return (Boolean)getProperty("collapsible");
    }

    public void setCollapsible(boolean value) {
        setProperty("collapsible", value);
    }

    public java.lang.String getContentUrl() {
        return (java.lang.String)getProperty("contentUrl");
    }

    public void setContentUrl(java.lang.String value) {
        setProperty("contentUrl", value);
    }

    public java.lang.String getMax() {
        return (java.lang.String)getProperty("max");
    }

    public void setMax(java.lang.String value) {
        setProperty("max", value);
    }

    public java.lang.String getMin() {
        return (java.lang.String)getProperty("min");
    }

    public void setMin(java.lang.String value) {
        setProperty("min", value);
    }

    public boolean getResizable() {
        return (Boolean)getProperty("resizable");
    }

    public void setResizable(boolean value) {
        setProperty("resizable", value);
    }

    public boolean getScrollable() {
        return (Boolean)getProperty("scrollable");
    }

    public void setScrollable(boolean value) {
        setProperty("scrollable", value);
    }

    public java.lang.String getSize() {
        return (java.lang.String)getProperty("size");
    }

    public void setSize(java.lang.String value) {
        setProperty("size", value);
    }

//<< Attributes
    
    @Override
    public void setDynamicAttribute(String uri, String localName, Object value) throws JspException {
        attributes.put(localName, value);
    }
}
