
package com.kendoui.taglib.diagram;


import com.kendoui.taglib.BaseTag;






import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class ShapeRotationTag extends  BaseTag  /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        ShapeTag parent = (ShapeTag)findParentWithClass(ShapeTag.class);


        parent.setRotation(this);

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
        return "diagram-shape-rotation";
    }

    public float getAngle() {
        return (Float)getProperty("angle");
    }

    public void setAngle(float value) {
        setProperty("angle", value);
    }

//<< Attributes

}
