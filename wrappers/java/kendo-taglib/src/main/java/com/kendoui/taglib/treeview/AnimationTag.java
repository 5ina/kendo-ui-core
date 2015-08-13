
package com.kendoui.taglib.treeview;

import com.kendoui.taglib.BaseTag;

import com.kendoui.taglib.TreeViewTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class AnimationTag extends BaseTag /* interfaces *//* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        TreeViewTag parent = (TreeViewTag)findParentWithClass(TreeViewTag.class);


        parent.setAnimation(this);

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
        return "treeView-animation";
    }

    public void setCollapse(com.kendoui.taglib.treeview.AnimationCollapseTag value) {
        setProperty("collapse", value);
    }

    public void setExpand(com.kendoui.taglib.treeview.AnimationExpandTag value) {
        setProperty("expand", value);
    }

    public boolean getCollapse() {
        return (Boolean)getProperty("collapse");
    }

    public void setCollapse(boolean value) {
        setProperty("collapse", value);
    }

    public boolean getExpand() {
        return (Boolean)getProperty("expand");
    }

    public void setExpand(boolean value) {
        setProperty("expand", value);
    }

//<< Attributes

}
