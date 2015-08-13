
package com.kendoui.taglib;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.kendoui.taglib.listview.*;
import com.kendoui.taglib.html.Div;
import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;

@SuppressWarnings("serial")
public class ListViewTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public ListViewTag() {
        super("ListView");
    }

    protected Element<?> pagerHtml() {
        Element<?> html = new Div();
        html.attr("id", getName() + "_pager");
        html.attr("class", "k-pager-wrap");
        
        return html;
    }
    
    @Override
    protected Element<?> createElement() {
        String tagName = "div";
        if (isSet("tagName")) {            
            tagName = getTagName().toLowerCase();
            properties().remove("tagName");
        }
        
        return new ListViewElement(tagName);
    }
    
    @SuppressWarnings("unchecked")
    @Override
    public int doEndTag() throws JspException {
        String template;
        int result;
        JspWriter writer;
        Map<String, Object> pagable;
        
//>> doEndTag
//<< doEndTag

        if (isSet("template")) {
            template = "kendo.template($(\"#" + getTemplate() + "\").html())";
            setProperty("template", new Function(template));
        }
        
        if (isSet("altTemplate")) {
            template = "kendo.template($(\"#" + getAltTemplate() + "\").html())";
            setProperty("altTemplate", new Function(template));
        }
        
        if (isSet("editTemplate")) {
            template = "kendo.template($(\"#" + getEditTemplate() + "\").html())";
            setProperty("editTemplate", new Function(template));
        }
        
        if (isSet("pageable")) {
            if (getProperty("pageable") instanceof HashMap<?, ?>) {
                pagable = (HashMap<String, Object>)getProperty("pageable");
            } 
            else
            {
                pagable = new HashMap<String, Object>();
            }
            
            pagable.put("pagerId", getName() + "_pager");
            setProperty("pageable", pagable);    
            
            result = super.doEndTag();
            
            writer = pageContext.getOut();        
            try {
                pagerHtml().write(writer);
            } catch (IOException exception) {
                throw new JspException(exception);
            }
            
            return result;
        }
        else {
            return super.doEndTag();
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
    
//>> Attributes

    public static String tagName() {
        return "listView";
    }

    public void setPageable(com.kendoui.taglib.listview.PageableTag value) {
        setProperty("pageable", value);
    }

    public void setCancel(CancelFunctionTag value) {
        setEvent("cancel", value.getBody());
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setDataBinding(DataBindingFunctionTag value) {
        setEvent("dataBinding", value.getBody());
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setEdit(EditFunctionTag value) {
        setEvent("edit", value.getBody());
    }

    public void setRemove(RemoveFunctionTag value) {
        setEvent("remove", value.getBody());
    }

    public void setSave(SaveFunctionTag value) {
        setEvent("save", value.getBody());
    }

    public java.lang.String getAltTemplate() {
        return (java.lang.String)getProperty("altTemplate");
    }

    public void setAltTemplate(java.lang.String value) {
        setProperty("altTemplate", value);
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.String getEditTemplate() {
        return (java.lang.String)getProperty("editTemplate");
    }

    public void setEditTemplate(java.lang.String value) {
        setProperty("editTemplate", value);
    }

    public boolean getNavigatable() {
        return (Boolean)getProperty("navigatable");
    }

    public void setNavigatable(boolean value) {
        setProperty("navigatable", value);
    }

    public boolean getPageable() {
        return (Boolean)getProperty("pageable");
    }

    public void setPageable(boolean value) {
        setProperty("pageable", value);
    }

    public java.lang.Object getSelectable() {
        return (java.lang.Object)getProperty("selectable");
    }

    public void setSelectable(java.lang.Object value) {
        setProperty("selectable", value);
    }

    public java.lang.String getTagName() {
        return (java.lang.String)getProperty("tagName");
    }

    public void setTagName(java.lang.String value) {
        setProperty("tagName", value);
    }

    public java.lang.String getTemplate() {
        return (java.lang.String)getProperty("template");
    }

    public void setTemplate(java.lang.String value) {
        setProperty("template", value);
    }

    public String getCancel() {
        Function property = ((Function)getProperty("cancel"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCancel(String value) {
        setProperty("cancel", new Function(value));
    }

    public String getChange() {
        Function property = ((Function)getProperty("change"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setChange(String value) {
        setProperty("change", new Function(value));
    }

    public String getDataBinding() {
        Function property = ((Function)getProperty("dataBinding"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDataBinding(String value) {
        setProperty("dataBinding", new Function(value));
    }

    public String getDataBound() {
        Function property = ((Function)getProperty("dataBound"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDataBound(String value) {
        setProperty("dataBound", new Function(value));
    }

    public String getEdit() {
        Function property = ((Function)getProperty("edit"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setEdit(String value) {
        setProperty("edit", new Function(value));
    }

    public String getRemove() {
        Function property = ((Function)getProperty("remove"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRemove(String value) {
        setProperty("remove", new Function(value));
    }

    public String getSave() {
        Function property = ((Function)getProperty("save"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSave(String value) {
        setProperty("save", new Function(value));
    }

//<< Attributes

}
