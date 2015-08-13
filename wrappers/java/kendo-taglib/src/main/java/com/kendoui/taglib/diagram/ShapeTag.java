
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;






import com.kendoui.taglib.json.Function;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ShapeTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        ShapesTag parent = (ShapesTag)findParentWithClass(ShapesTag.class);

        parent.addShape(this);

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
        return "diagram-shape";
    }

    public void setConnectors(ShapeConnectorsTag value) {

        setProperty("connectors", value.connectors());

    }

    public void setContent(com.kendoui.taglib.diagram.ShapeContentTag value) {
        setProperty("content", value);
    }

    public void setEditable(com.kendoui.taglib.diagram.ShapeEditableTag value) {
        setProperty("editable", value);
    }

    public void setFill(com.kendoui.taglib.diagram.ShapeFillTag value) {
        setProperty("fill", value);
    }

    public void setHover(com.kendoui.taglib.diagram.ShapeHoverTag value) {
        setProperty("hover", value);
    }

    public void setRotation(com.kendoui.taglib.diagram.ShapeRotationTag value) {
        setProperty("rotation", value);
    }

    public void setStroke(com.kendoui.taglib.diagram.ShapeStrokeTag value) {
        setProperty("stroke", value);
    }

    public void setVisual(ShapeVisualFunctionTag value) {
        setEvent("visual", value.getBody());
    }

    public boolean getEditable() {
        return (Boolean)getProperty("editable");
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
        return (Float)getProperty("height");
    }

    public void setHeight(float value) {
        setProperty("height", value);
    }

    public java.lang.String getId() {
        return (java.lang.String)getProperty("id");
    }

    public void setId(java.lang.String value) {
        setProperty("id", value);
    }

    public float getMinHeight() {
        return (Float)getProperty("minHeight");
    }

    public void setMinHeight(float value) {
        setProperty("minHeight", value);
    }

    public float getMinWidth() {
        return (Float)getProperty("minWidth");
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
        return (Float)getProperty("width");
    }

    public void setWidth(float value) {
        setProperty("width", value);
    }

    public float getX() {
        return (Float)getProperty("x");
    }

    public void setX(float value) {
        setProperty("x", value);
    }

    public float getY() {
        return (Float)getProperty("y");
    }

    public void setY(float value) {
        setProperty("y", value);
    }

//<< Attributes

}
