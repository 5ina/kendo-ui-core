
package com.kendoui.taglib;


import com.kendoui.taglib.stockchart.*;
import com.kendoui.taglib.json.Function;
import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class StockChartTag extends WidgetTag /* interfaces */implements DataBoundWidget/* interfaces */ {

    public StockChartTag() {
        super("StockChart");
    }
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag
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
        return "stockChart";
    }

    public void setCategoryAxis(CategoryAxisTag value) {

        setProperty("categoryAxis", value.categoryAxis());

    }

    public void setChartArea(com.kendoui.taglib.stockchart.ChartAreaTag value) {
        setProperty("chartArea", value);
    }

    public void setLegend(com.kendoui.taglib.stockchart.LegendTag value) {
        setProperty("legend", value);
    }

    public void setNavigator(com.kendoui.taglib.stockchart.NavigatorTag value) {
        setProperty("navigator", value);
    }

    public void setPanes(PanesTag value) {

        setProperty("panes", value.panes());

    }

    public void setPdf(com.kendoui.taglib.stockchart.PdfTag value) {
        setProperty("pdf", value);
    }

    public void setPlotArea(com.kendoui.taglib.stockchart.PlotAreaTag value) {
        setProperty("plotArea", value);
    }

    public void setSeries(SeriesTag value) {

        setProperty("series", value.series());

    }

    public void setSeriesDefaults(com.kendoui.taglib.stockchart.SeriesDefaultsTag value) {
        setProperty("seriesDefaults", value);
    }

    public void setTitle(com.kendoui.taglib.stockchart.TitleTag value) {
        setProperty("title", value);
    }

    public void setTooltip(com.kendoui.taglib.stockchart.TooltipTag value) {
        setProperty("tooltip", value);
    }

    public void setValueAxis(ValueAxisTag value) {

        setProperty("valueAxis", value.valueAxis());

    }

    public void setAxisLabelClick(AxisLabelClickFunctionTag value) {
        setEvent("axisLabelClick", value.getBody());
    }

    public void setDataBound(DataBoundFunctionTag value) {
        setEvent("dataBound", value.getBody());
    }

    public void setDrag(DragFunctionTag value) {
        setEvent("drag", value.getBody());
    }

    public void setDragEnd(DragEndFunctionTag value) {
        setEvent("dragEnd", value.getBody());
    }

    public void setDragStart(DragStartFunctionTag value) {
        setEvent("dragStart", value.getBody());
    }

    public void setLegendItemClick(LegendItemClickFunctionTag value) {
        setEvent("legendItemClick", value.getBody());
    }

    public void setLegendItemHover(LegendItemHoverFunctionTag value) {
        setEvent("legendItemHover", value.getBody());
    }

    public void setNoteClick(NoteClickFunctionTag value) {
        setEvent("noteClick", value.getBody());
    }

    public void setNoteHover(NoteHoverFunctionTag value) {
        setEvent("noteHover", value.getBody());
    }

    public void setPlotAreaClick(PlotAreaClickFunctionTag value) {
        setEvent("plotAreaClick", value.getBody());
    }

    public void setRender(RenderFunctionTag value) {
        setEvent("render", value.getBody());
    }

    public void setSelect(SelectFunctionTag value) {
        setEvent("select", value.getBody());
    }

    public void setSelectEnd(SelectEndFunctionTag value) {
        setEvent("selectEnd", value.getBody());
    }

    public void setSelectStart(SelectStartFunctionTag value) {
        setEvent("selectStart", value.getBody());
    }

    public void setSeriesClick(SeriesClickFunctionTag value) {
        setEvent("seriesClick", value.getBody());
    }

    public void setSeriesHover(SeriesHoverFunctionTag value) {
        setEvent("seriesHover", value.getBody());
    }

    public void setZoom(ZoomFunctionTag value) {
        setEvent("zoom", value.getBody());
    }

    public void setZoomEnd(ZoomEndFunctionTag value) {
        setEvent("zoomEnd", value.getBody());
    }

    public void setZoomStart(ZoomStartFunctionTag value) {
        setEvent("zoomStart", value.getBody());
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

    public java.lang.String getDateField() {
        return (java.lang.String)getProperty("dateField");
    }

    public void setDateField(java.lang.String value) {
        setProperty("dateField", value);
    }

    public java.lang.String getRenderAs() {
        return (java.lang.String)getProperty("renderAs");
    }

    public void setRenderAs(java.lang.String value) {
        setProperty("renderAs", value);
    }

    public java.lang.Object getSeriesColors() {
        return (java.lang.Object)getProperty("seriesColors");
    }

    public void setSeriesColors(java.lang.Object value) {
        setProperty("seriesColors", value);
    }

    public java.lang.String getTheme() {
        return (java.lang.String)getProperty("theme");
    }

    public void setTheme(java.lang.String value) {
        setProperty("theme", value);
    }

    public boolean getTransitions() {
        return (Boolean)getProperty("transitions");
    }

    public void setTransitions(boolean value) {
        setProperty("transitions", value);
    }

    public String getAxisLabelClick() {
        Function property = ((Function)getProperty("axisLabelClick"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setAxisLabelClick(String value) {
        setProperty("axisLabelClick", new Function(value));
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

    public String getDrag() {
        Function property = ((Function)getProperty("drag"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDrag(String value) {
        setProperty("drag", new Function(value));
    }

    public String getDragEnd() {
        Function property = ((Function)getProperty("dragEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragEnd(String value) {
        setProperty("dragEnd", new Function(value));
    }

    public String getDragStart() {
        Function property = ((Function)getProperty("dragStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setDragStart(String value) {
        setProperty("dragStart", new Function(value));
    }

    public String getLegendItemClick() {
        Function property = ((Function)getProperty("legendItemClick"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setLegendItemClick(String value) {
        setProperty("legendItemClick", new Function(value));
    }

    public String getLegendItemHover() {
        Function property = ((Function)getProperty("legendItemHover"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setLegendItemHover(String value) {
        setProperty("legendItemHover", new Function(value));
    }

    public String getNoteClick() {
        Function property = ((Function)getProperty("noteClick"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setNoteClick(String value) {
        setProperty("noteClick", new Function(value));
    }

    public String getNoteHover() {
        Function property = ((Function)getProperty("noteHover"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setNoteHover(String value) {
        setProperty("noteHover", new Function(value));
    }

    public String getPlotAreaClick() {
        Function property = ((Function)getProperty("plotAreaClick"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setPlotAreaClick(String value) {
        setProperty("plotAreaClick", new Function(value));
    }

    public String getRender() {
        Function property = ((Function)getProperty("render"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setRender(String value) {
        setProperty("render", new Function(value));
    }

    public String getSelect() {
        Function property = ((Function)getProperty("select"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSelect(String value) {
        setProperty("select", new Function(value));
    }

    public String getSelectEnd() {
        Function property = ((Function)getProperty("selectEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSelectEnd(String value) {
        setProperty("selectEnd", new Function(value));
    }

    public String getSelectStart() {
        Function property = ((Function)getProperty("selectStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSelectStart(String value) {
        setProperty("selectStart", new Function(value));
    }

    public String getSeriesClick() {
        Function property = ((Function)getProperty("seriesClick"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSeriesClick(String value) {
        setProperty("seriesClick", new Function(value));
    }

    public String getSeriesHover() {
        Function property = ((Function)getProperty("seriesHover"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setSeriesHover(String value) {
        setProperty("seriesHover", new Function(value));
    }

    public String getZoom() {
        Function property = ((Function)getProperty("zoom"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setZoom(String value) {
        setProperty("zoom", new Function(value));
    }

    public String getZoomEnd() {
        Function property = ((Function)getProperty("zoomEnd"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setZoomEnd(String value) {
        setProperty("zoomEnd", new Function(value));
    }

    public String getZoomStart() {
        Function property = ((Function)getProperty("zoomStart"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setZoomStart(String value) {
        setProperty("zoomStart", new Function(value));
    }

//<< Attributes

}
