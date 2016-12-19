
package com.kendoui.taglib.panelbar;

import com.kendoui.taglib.FunctionTag;

import com.kendoui.taglib.PanelBarTag;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class DataBoundFunctionTag extends FunctionTag /* interfaces */ /* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        PanelBarTag parent = (PanelBarTag)findParentWithClass(PanelBarTag.class);


        parent.setDataBound(this);

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
