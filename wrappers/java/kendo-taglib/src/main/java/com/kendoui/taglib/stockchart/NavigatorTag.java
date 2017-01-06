
package com.kendoui.taglib.stockchart;


import com.kendoui.taglib.*;


import com.kendoui.taglib.StockChartTag;




import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class NavigatorTag extends  BaseTag  /* interfaces */implements DataBoundWidget/* interfaces */ {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag


        StockChartTag parent = (StockChartTag)findParentWithClass(StockChartTag.class);


        parent.setNavigator(this);

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
        return "stockChart-navigator";
    }

    public void setCategoryAxis(com.kendoui.taglib.stockchart.NavigatorCategoryAxisTag value) {
        setProperty("categoryAxis", value);
    }

    public void setHint(com.kendoui.taglib.stockchart.NavigatorHintTag value) {
        setProperty("hint", value);
    }

    public void setPane(com.kendoui.taglib.stockchart.NavigatorPaneTag value) {
        setProperty("pane", value);
    }

    public void setSelect(com.kendoui.taglib.stockchart.NavigatorSelectTag value) {
        setProperty("select", value);
    }

    public void setSeries(NavigatorSeriesTag value) {

        setProperty("series", value.series());

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

    public boolean getVisible() {
        return (Boolean)getProperty("visible");
    }

    public void setVisible(boolean value) {
        setProperty("visible", value);
    }

//<< Attributes

}
