
package com.kendoui.taglib.stockchart;

import com.kendoui.taglib.FunctionTag;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class NavigatorCategoryAxisCrosshairTooltipTemplateFunctionTag extends FunctionTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        NavigatorCategoryAxisCrosshairTooltipTag parent = (NavigatorCategoryAxisCrosshairTooltipTag)findParentWithClass(NavigatorCategoryAxisCrosshairTooltipTag.class);


        parent.setTemplate(this);

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
//<< Attributes

}
