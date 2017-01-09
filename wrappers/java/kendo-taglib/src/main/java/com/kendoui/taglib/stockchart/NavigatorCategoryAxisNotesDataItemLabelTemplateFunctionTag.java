
package com.kendoui.taglib.stockchart;

import com.kendoui.taglib.FunctionTag;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class NavigatorCategoryAxisNotesDataItemLabelTemplateFunctionTag extends FunctionTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        NavigatorCategoryAxisNotesDataItemLabelTag parent = (NavigatorCategoryAxisNotesDataItemLabelTag)findParentWithClass(NavigatorCategoryAxisNotesDataItemLabelTag.class);


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
