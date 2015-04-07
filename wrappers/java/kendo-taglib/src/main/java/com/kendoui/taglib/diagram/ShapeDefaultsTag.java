
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;



import com.kendoui.taglib.DiagramTag;




import com.kendoui.taglib.json.Function;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ShapeDefaultsTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        DiagramTag parent = (DiagramTag)findParentWithClass(DiagramTag.class);


        parent.setShapeDefaults(this);

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
        return "diagram-shapeDefaults";
    }

    public void setConnectors(ShapeDefaultsConnectorsTag value) {

        setProperty("connectors", value.connectors());

    }

    public void setContent(com.kendoui.taglib.diagram.ShapeDefaultsContentTag value) {
        setProperty("content", value);
    }

    public void setEditable(com.kendoui.taglib.diagram.ShapeDefaultsEditableTag value) {
        setProperty("editable", value);
    }

    public void setFill(com.kendoui.taglib.diagram.ShapeDefaultsFillTag value) {
        setProperty("fill", value);
    }

    public void setHover(com.kendoui.taglib.diagram.ShapeDefaultsHoverTag value) {
        setProperty("hover", value);
    }

    public void setRotation(com.kendoui.taglib.diagram.ShapeDefaultsRotationTag value) {
        setProperty("rotation", value);
    }

    public void setStroke(com.kendoui.taglib.diagram.ShapeDefaultsStrokeTag value) {
        setProperty("stroke", value);
    }

    public void setVisual(ShapeDefaultsVisualFunctionTag value) {
        setEvent("visual", value.getBody());
    }

    public boolean getEditable() {
        return (boolean)getProperty("editable");
    }

    public void setEditable(boolean value) {
        setProperty("editable", value);
    }

    public java.lang.String getFill() {
        return (java.lang.String)getProperty("fill");
    }

    public void setFill(java.lang.String value) {
        setProperty("fill", value);
    }

    public float getHeight() {
        return (float)getProperty("height");
    }

    public void setHeight(float value) {
        setProperty("height", value);
    }

    public float getMinHeight() {
        return (float)getProperty("minHeight");
    }

    public void setMinHeight(float value) {
        setProperty("minHeight", value);
    }

    public float getMinWidth() {
        return (float)getProperty("minWidth");
    }

    public void setMinWidth(float value) {
        setProperty("minWidth", value);
    }

    public java.lang.String getPath() {
        return (java.lang.String)getProperty("path");
    }

    public void setPath(java.lang.String value) {
        setProperty("path", value);
    }

    public boolean getSelectable() {
        return (boolean)getProperty("selectable");
    }

    public void setSelectable(boolean value) {
        setProperty("selectable", value);
    }

    public java.lang.String getSource() {
        return (java.lang.String)getProperty("source");
    }

    public void setSource(java.lang.String value) {
        setProperty("source", value);
    }

    public java.lang.String getType() {
        return (java.lang.String)getProperty("type");
    }

    public void setType(java.lang.String value) {
        setProperty("type", value);
    }

    public String getVisual() {
        Function property = ((Function)getProperty("visual"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setVisual(String value) {
        setProperty("visual", new Function(value));
    }

    public float getWidth() {
        return (float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
    }

    public float getX() {
        return (float)getProperty("x");
    }

    public void setX(float value) {
        setProperty("x", value);
    }

    public float getY() {
        return (float)getProperty("y");
    }

    public void setY(float value) {
        setProperty("y", value);
    }

//<< Attributes

}
