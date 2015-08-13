
package com.kendoui.taglib;


import com.kendoui.taglib.scheduler.*;


import com.kendoui.taglib.json.Function;


import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class SchedulerTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public SchedulerTag() {
        super("Scheduler");
    }
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
//<< doEndTag

        if (isSet("eventTemplate")) {
            setProperty("eventTemplate", new Function("kendo.template($(\"#" + getEventTemplate() + "\").html())"));
        }
        
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
        return "scheduler";
    }

    public void setCurrentTimeMarker(com.kendoui.taglib.scheduler.CurrentTimeMarkerTag value) {
        setProperty("currentTimeMarker", value);
    }

    public void setEditable(com.kendoui.taglib.scheduler.EditableTag value) {
        setProperty("editable", value);
    }

    public void setFooter(com.kendoui.taglib.scheduler.FooterTag value) {
        setProperty("footer", value);
    }

    public void setGroup(com.kendoui.taglib.scheduler.GroupTag value) {
        setProperty("group", value);
    }

    public void setMessages(com.kendoui.taglib.scheduler.MessagesTag value) {
        setProperty("messages", value);
    }

    public void setPdf(com.kendoui.taglib.scheduler.PdfTag value) {
        setProperty("pdf", value);
    }

    public void setResources(ResourcesTag value) {

        setProperty("resources", value.resources());

    }

    public void setToolbar(ToolbarTag value) {

        setProperty("toolbar", value.toolbar());

    }

    public void setViews(ViewsTag value) {

        setProperty("views", value.views());

    }

    public void setAdd(AddFunctionTag value) {
        setEvent("add", value.getBody());
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

    public void setMove(MoveFunctionTag value) {
        setEvent("move", value.getBody());
    }

    public void setMoveEnd(MoveEndFunctionTag value) {
        setEvent("moveEnd", value.getBody());
    }

    public void setMoveStart(MoveStartFunctionTag value) {
        setEvent("moveStart", value.getBody());
    }

    public void setNavigate(NavigateFunctionTag value) {
        setEvent("navigate", value.getBody());
    }

    public void setPdfExport(PdfExportFunctionTag value) {
        setEvent("pdfExport", value.getBody());
    }

    public void setRemove(RemoveFunctionTag value) {
        setEvent("remove", value.getBody());
    }

    public void setResize(ResizeFunctionTag value) {
        setEvent("resize", value.getBody());
    }

    public void setResizeEnd(ResizeEndFunctionTag value) {
        setEvent("resizeEnd", value.getBody());
    }

    public void setResizeStart(ResizeStartFunctionTag value) {
        setEvent("resizeStart", value.getBody());
    }

    public void setSave(SaveFunctionTag value) {
        setEvent("save", value.getBody());
    }

    public java.lang.String getAllDayEventTemplate() {
        return (java.lang.String)getProperty("allDayEventTemplate");
    }

    public void setAllDayEventTemplate(java.lang.String value) {
        setProperty("allDayEventTemplate", value);
    }

    public boolean getAllDaySlot() {
        return (Boolean)getProperty("allDaySlot");
    }

    public void setAllDaySlot(boolean value) {
        setProperty("allDaySlot", value);
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public boolean getCurrentTimeMarker() {
        return (Boolean)getProperty("currentTimeMarker");
    }

    public void setCurrentTimeMarker(boolean value) {
        setProperty("currentTimeMarker", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.util.Date getDate() {
        return (java.util.Date)getProperty("date");
    }

    public void setDate(java.util.Date value) {
        setProperty("date", value);
    }

    public java.lang.String getDateHeaderTemplate() {
        return (java.lang.String)getProperty("dateHeaderTemplate");
    }

    public void setDateHeaderTemplate(java.lang.String value) {
        setProperty("dateHeaderTemplate", value);
    }

    public boolean getEditable() {
        return (Boolean)getProperty("editable");
    }

    public void setEditable(boolean value) {
        setProperty("editable", value);
    }

    public java.util.Date getEndTime() {
        return (java.util.Date)getProperty("endTime");
    }

    public void setEndTime(java.util.Date value) {
        setProperty("endTime", value);
    }

    public java.lang.String getEventTemplate() {
        return (java.lang.String)getProperty("eventTemplate");
    }

    public void setEventTemplate(java.lang.String value) {
        setProperty("eventTemplate", value);
    }

    public boolean getFooter() {
        return (Boolean)getProperty("footer");
    }

    public void setFooter(boolean value) {
        setProperty("footer", value);
    }

    public java.lang.String getGroupHeaderTemplate() {
        return (java.lang.String)getProperty("groupHeaderTemplate");
    }

    public void setGroupHeaderTemplate(java.lang.String value) {
        setProperty("groupHeaderTemplate", value);
    }

    public java.lang.Object getHeight() {
        return (java.lang.Object)getProperty("height");
    }

    public void setHeight(java.lang.Object value) {
        setProperty("height", value);
    }

    public float getMajorTick() {
        return (Float)getProperty("majorTick");
    }

    public void setMajorTick(float value) {
        setProperty("majorTick", value);
    }

    public java.lang.String getMajorTimeHeaderTemplate() {
        return (java.lang.String)getProperty("majorTimeHeaderTemplate");
    }

    public void setMajorTimeHeaderTemplate(java.lang.String value) {
        setProperty("majorTimeHeaderTemplate", value);
    }

    public java.util.Date getMax() {
        return (java.util.Date)getProperty("max");
    }

    public void setMax(java.util.Date value) {
        setProperty("max", value);
    }

    public java.util.Date getMin() {
        return (java.util.Date)getProperty("min");
    }

    public void setMin(java.util.Date value) {
        setProperty("min", value);
    }

    public float getMinorTickCount() {
        return (Float)getProperty("minorTickCount");
    }

    public void setMinorTickCount(float value) {
        setProperty("minorTickCount", value);
    }

    public java.lang.String getMinorTimeHeaderTemplate() {
        return (java.lang.String)getProperty("minorTimeHeaderTemplate");
    }

    public void setMinorTimeHeaderTemplate(java.lang.String value) {
        setProperty("minorTimeHeaderTemplate", value);
    }

    public java.lang.Object getMobile() {
        return (java.lang.Object)getProperty("mobile");
    }

    public void setMobile(java.lang.Object value) {
        setProperty("mobile", value);
    }

    public boolean getSelectable() {
        return (Boolean)getProperty("selectable");
    }

    public void setSelectable(boolean value) {
        setProperty("selectable", value);
    }

    public boolean getShowWorkHours() {
        return (Boolean)getProperty("showWorkHours");
    }

    public void setShowWorkHours(boolean value) {
        setProperty("showWorkHours", value);
    }

    public boolean getSnap() {
        return (Boolean)getProperty("snap");
    }

    public void setSnap(boolean value) {
        setProperty("snap", value);
    }

    public java.util.Date getStartTime() {
        return (java.util.Date)getProperty("startTime");
    }

    public void setStartTime(java.util.Date value) {
        setProperty("startTime", value);
    }

    public java.lang.String getTimezone() {
        return (java.lang.String)getProperty("timezone");
    }

    public void setTimezone(java.lang.String value) {
        setProperty("timezone", value);
    }

    public java.lang.Object getWidth() {
        return (java.lang.Object)getProperty("width");
    }

    public void setWidth(java.lang.Object value) {
        setProperty("width", value);
    }

    public java.util.Date getWorkDayEnd() {
        return (java.util.Date)getProperty("workDayEnd");
    }

    public void setWorkDayEnd(java.util.Date value) {
        setProperty("workDayEnd", value);
    }

    public java.util.Date getWorkDayStart() {
        return (java.util.Date)getProperty("workDayStart");
    }

    public void setWorkDayStart(java.util.Date value) {
        setProperty("workDayStart", value);
    }

    public float getWorkWeekEnd() {
        return (Float)getProperty("workWeekEnd");
    }

    public void setWorkWeekEnd(float value) {
        setProperty("workWeekEnd", value);
    }

    public float getWorkWeekStart() {
        return (Float)getProperty("workWeekStart");
    }

    public void setWorkWeekStart(float value) {
        setProperty("workWeekStart", value);
    }

    public String getAdd() {
        Function property = ((Function)getProperty("add"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setAdd(String value) {
        setProperty("add", new Function(value));
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

    public String getMove() {
        Function property = ((Function)getProperty("move"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setMove(String value) {
        setProperty("move", new Function(value));
    }

    public String getMoveEnd() {
        Function property = ((Function)getProperty("moveEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setMoveEnd(String value) {
        setProperty("moveEnd", new Function(value));
    }

    public String getMoveStart() {
        Function property = ((Function)getProperty("moveStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setMoveStart(String value) {
        setProperty("moveStart", new Function(value));
    }

    public String getNavigate() {
        Function property = ((Function)getProperty("navigate"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setNavigate(String value) {
        setProperty("navigate", new Function(value));
    }

    public String getPdfExport() {
        Function property = ((Function)getProperty("pdfExport"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setPdfExport(String value) {
        setProperty("pdfExport", new Function(value));
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

    public String getResize() {
        Function property = ((Function)getProperty("resize"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setResize(String value) {
        setProperty("resize", new Function(value));
    }

    public String getResizeEnd() {
        Function property = ((Function)getProperty("resizeEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setResizeEnd(String value) {
        setProperty("resizeEnd", new Function(value));
    }

    public String getResizeStart() {
        Function property = ((Function)getProperty("resizeStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setResizeStart(String value) {
        setProperty("resizeStart", new Function(value));
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
