
package com.kendoui.taglib.map;


import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.DataBoundWidget;

import com.kendoui.taglib.DataSourceTag;

import javax.servlet.jsp.JspException;

@SuppressWarnings("serial")
public class LayerTag extends BaseTag implements DataBoundWidget {
    
    @Override
    public int doEndTag() throws JspException {
//>> doEndTag

        LayersTag parent = (LayersTag)findParentWithClass(LayersTag.class);

        parent.addLayer(this);

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
        return "map-layer";
    }

    public void setStyle(com.kendoui.taglib.map.LayerStyleTag value) {
        setProperty("style", value);
    }

    public void setTooltip(com.kendoui.taglib.map.LayerTooltipTag value) {
        setProperty("tooltip", value);
    }

    public java.lang.String getAttribution() {
        return (java.lang.String)getProperty("attribution");
    }

    public void setAttribution(java.lang.String value) {
        setProperty("attribution", value);
    }

    public boolean getAutoBind() {
        return (Boolean)getProperty("autoBind");
    }

    public void setAutoBind(boolean value) {
        setProperty("autoBind", value);
    }

    public java.lang.String getCulture() {
        return (java.lang.String)getProperty("culture");
    }

    public void setCulture(java.lang.String value) {
        setProperty("culture", value);
    }

    public void setDataSource(DataSourceTag dataSource) {
        setProperty("dataSource", dataSource);
    }

    public java.lang.Object getExtent() {
        return (java.lang.Object)getProperty("extent");
    }

    public void setExtent(java.lang.Object value) {
        setProperty("extent", value);
    }

    public java.lang.String getImagerySet() {
        return (java.lang.String)getProperty("imagerySet");
    }

    public void setImagerySet(java.lang.String value) {
        setProperty("imagerySet", value);
    }

    public java.lang.String getKey() {
        return (java.lang.String)getProperty("key");
    }

    public void setKey(java.lang.String value) {
        setProperty("key", value);
    }

    public java.lang.String getLocationField() {
        return (java.lang.String)getProperty("locationField");
    }

    public void setLocationField(java.lang.String value) {
        setProperty("locationField", value);
    }

    public float getMaxSize() {
        return (Float)getProperty("maxSize");
    }

    public void setMaxSize(float value) {
        setProperty("maxSize", value);
    }

    public float getMinSize() {
        return (Float)getProperty("minSize");
    }

    public void setMinSize(float value) {
        setProperty("minSize", value);
    }

    public float getOpacity() {
        return (Float)getProperty("opacity");
    }

    public void setOpacity(float value) {
        setProperty("opacity", value);
    }

    public java.lang.String getShape() {
        return (java.lang.String)getProperty("shape");
    }

    public void setShape(java.lang.String value) {
        setProperty("shape", value);
    }

    public java.lang.Object getSubdomains() {
        return (java.lang.Object)getProperty("subdomains");
    }

    public void setSubdomains(java.lang.Object value) {
        setProperty("subdomains", value);
    }

    public java.lang.String getSymbol() {
        return (java.lang.String)getProperty("symbol");
    }

    public void setSymbol(java.lang.String value) {
        setProperty("symbol", value);
    }

    public float getTileSize() {
        return (Float)getProperty("tileSize");
    }

    public void setTileSize(float value) {
        setProperty("tileSize", value);
    }

    public java.lang.String getTitleField() {
        return (java.lang.String)getProperty("titleField");
    }

    public void setTitleField(java.lang.String value) {
        setProperty("titleField", value);
    }

    public java.lang.String getType() {
        return (java.lang.String)getProperty("type");
    }

    public void setType(java.lang.String value) {
        setProperty("type", value);
    }

    public java.lang.String getUrlTemplate() {
        return (java.lang.String)getProperty("urlTemplate");
    }

    public void setUrlTemplate(java.lang.String value) {
        setProperty("urlTemplate", value);
    }

    public java.lang.String getValueField() {
        return (java.lang.String)getProperty("valueField");
    }

    public void setValueField(java.lang.String value) {
        setProperty("valueField", value);
    }

    public float getZindex() {
        return (Float)getProperty("zIndex");
    }

    public void setZindex(float value) {
        setProperty("zIndex", value);
    }

//<< Attributes

}
