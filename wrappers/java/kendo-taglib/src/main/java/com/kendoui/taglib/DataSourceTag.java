
package com.kendoui.taglib;


import com.kendoui.taglib.datasource.*;


import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class DataSourceTag extends BaseTag /* interfaces *//* interfaces */ {

    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
//<< doEndTag
        
        try {
            // allow nesting in hierarchical model
            HierarchicalModelTag hierarchicalModel = (HierarchicalModelTag)findParentWithClass(HierarchicalModelTag.class);
            
            hierarchicalModel.setChildren(this);
            
            return super.doEndTag();
        } catch(JspException ex) { }
        
        DataBoundWidget widget = (DataBoundWidget)findParentWithClass(DataBoundWidget.class);
        
        widget.setDataSource(this);

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
        return "dataSource";
    }

    public void setAggregate(AggregateTag value) {

        setProperty("aggregate", value.aggregate());

    }

    public void setFilter(FilterTag value) {

        setProperty("filter", value.filter());

    }

    public void setGroup(GroupTag value) {

        setProperty("group", value.group());

    }

    public void setSchema(com.kendoui.taglib.datasource.SchemaTag value) {
        setProperty("schema", value);
    }

    public void setSort(SortTag value) {

        setProperty("sort", value.sort());

    }

    public void setTransport(com.kendoui.taglib.datasource.TransportTag value) {
        setProperty("transport", value);
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setError(ErrorFunctionTag value) {
        setEvent("error", value.getBody());
    }

    public void setPush(PushFunctionTag value) {
        setEvent("push", value.getBody());
    }

    public void setRequestEnd(RequestEndFunctionTag value) {
        setEvent("requestEnd", value.getBody());
    }

    public void setRequestStart(RequestStartFunctionTag value) {
        setEvent("requestStart", value.getBody());
    }

    public void setSync(SyncFunctionTag value) {
        setEvent("sync", value.getBody());
    }

    public boolean getAutoSync() {
        return (Boolean)getProperty("autoSync");
    }

    public void setAutoSync(boolean value) {
        setProperty("autoSync", value);
    }

    public boolean getBatch() {
        return (Boolean)getProperty("batch");
    }

    public void setBatch(boolean value) {
        setProperty("batch", value);
    }

    public java.lang.Object getData() {
        return (java.lang.Object)getProperty("data");
    }

    public void setData(java.lang.Object value) {
        setProperty("data", value);
    }

    public boolean getInPlaceSort() {
        return (Boolean)getProperty("inPlaceSort");
    }

    public void setInPlaceSort(boolean value) {
        setProperty("inPlaceSort", value);
    }

    public java.lang.Object getOfflineStorage() {
        return (java.lang.Object)getProperty("offlineStorage");
    }

    public void setOfflineStorage(java.lang.Object value) {
        setProperty("offlineStorage", value);
    }

    public float getPage() {
        return (Float)getProperty("page");
    }

    public void setPage(float value) {
        setProperty("page", value);
    }

    public float getPageSize() {
        return (Float)getProperty("pageSize");
    }

    public void setPageSize(float value) {
        setProperty("pageSize", value);
    }

    public boolean getServerAggregates() {
        return (Boolean)getProperty("serverAggregates");
    }

    public void setServerAggregates(boolean value) {
        setProperty("serverAggregates", value);
    }

    public boolean getServerFiltering() {
        return (Boolean)getProperty("serverFiltering");
    }

    public void setServerFiltering(boolean value) {
        setProperty("serverFiltering", value);
    }

    public boolean getServerGrouping() {
        return (Boolean)getProperty("serverGrouping");
    }

    public void setServerGrouping(boolean value) {
        setProperty("serverGrouping", value);
    }

    public boolean getServerPaging() {
        return (Boolean)getProperty("serverPaging");
    }

    public void setServerPaging(boolean value) {
        setProperty("serverPaging", value);
    }

    public boolean getServerSorting() {
        return (Boolean)getProperty("serverSorting");
    }

    public void setServerSorting(boolean value) {
        setProperty("serverSorting", value);
    }

    public java.lang.String getType() {
        return (java.lang.String)getProperty("type");
    }

    public void setType(java.lang.String value) {
        setProperty("type", value);
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

    public String getError() {
        Function property = ((Function)getProperty("error"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setError(String value) {
        setProperty("error", new Function(value));
    }

    public String getPush() {
        Function property = ((Function)getProperty("push"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setPush(String value) {
        setProperty("push", new Function(value));
    }

    public String getRequestEnd() {
        Function property = ((Function)getProperty("requestEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRequestEnd(String value) {
        setProperty("requestEnd", new Function(value));
    }

    public String getRequestStart() {
        Function property = ((Function)getProperty("requestStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRequestStart(String value) {
        setProperty("requestStart", new Function(value));
    }

    public String getSync() {
        Function property = ((Function)getProperty("sync"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSync(String value) {
        setProperty("sync", new Function(value));
    }

//<< Attributes

}
