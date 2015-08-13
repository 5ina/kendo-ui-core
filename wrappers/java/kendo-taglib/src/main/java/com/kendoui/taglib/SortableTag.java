package com.kendoui.taglib;

import java.io.IOException;
import java.io.StringWriter;

import javax.servlet.jsp.JspException;

import com.kendoui.taglib.html.Element;
import com.kendoui.taglib.html.Empty;
import com.kendoui.taglib.html.Script;
import com.kendoui.taglib.json.Function;
import com.kendoui.taglib.json.Serializer;
import com.kendoui.taglib.sortable.CancelFunctionTag;
import com.kendoui.taglib.sortable.ChangeFunctionTag;
import com.kendoui.taglib.sortable.EndFunctionTag;
import com.kendoui.taglib.sortable.MoveFunctionTag;
import com.kendoui.taglib.sortable.StartFunctionTag;

@SuppressWarnings("serial")
public class SortableTag extends WidgetTag /* interfaces *//* interfaces */{

    public SortableTag() {
        super("Sortable");
    }
    
    @Override
    protected Element<?> createElement() {
        return new Empty();
    }
    
    @Override
    public Script script() {
        StringWriter content = new StringWriter();

        content.append("jQuery(function(){jQuery(\"")
               .append(getName())
               .append("\").kendo")
               .append("Sortable")
               .append("(");

        try {
            new Serializer().serialize(content, this);
        } catch (IOException exception) {
            // StringWriter is not supposed to throw IOException
        }

        content.append(");})");

        Script script = new Script();

        script.html(content.toString());

        return script;
    }

    @Override
    public int doEndTag() throws JspException {
        // >> doEndTag
        // << doEndTag

        return super.doEndTag();
    }

    @Override
    public void initialize() {
        // >> initialize
        // << initialize

        super.initialize();
    }

    @Override
    public void destroy() {
        // >> destroy
        // << destroy

        super.destroy();
    }

    // >> Attributes

    public static String tagName() {
        return "sortable";
    }

    public void setCancel(CancelFunctionTag value) {
        setEvent("cancel", value.getBody());
    }

    public void setChange(ChangeFunctionTag value) {
        setEvent("change", value.getBody());
    }

    public void setEnd(EndFunctionTag value) {
        setEvent("end", value.getBody());
    }

    public void setMove(MoveFunctionTag value) {
        setEvent("move", value.getBody());
    }

    public void setStart(StartFunctionTag value) {
        setEvent("start", value.getBody());
    }

    public java.lang.String getAxis() {
        return (java.lang.String) getProperty("axis");
    }

    public void setAxis(java.lang.String value) {
        setProperty("axis", value);
    }

    public java.lang.String getCursor() {
        return (java.lang.String) getProperty("cursor");
    }

    public void setCursor(java.lang.String value) {
        setProperty("cursor", value);
    }

    public java.lang.Object getCursorOffset() {
        return (java.lang.Object) getProperty("cursorOffset");
    }

    public void setCursorOffset(java.lang.Object value) {
        setProperty("cursorOffset", value);
    }
    
    public java.lang.String getContainer() {
        return (java.lang.String) getProperty("container");
    }

    public void setContainer(java.lang.String value) {
        setProperty("container", value);
    }
    
    public java.lang.String getConnectWith() {
        return (java.lang.String) getProperty("connectWith");
    }

    public void setConnectWith(java.lang.String value) {
        setProperty("connectWith", value);
    }

    public java.lang.String getDisabled() {
        return (java.lang.String) getProperty("disabled");
    }

    public void setDisabled(java.lang.String value) {
        setProperty("disabled", value);
    }

    public java.lang.String getFilter() {
        return (java.lang.String) getProperty("filter");
    }

    public void setFilter(java.lang.String value) {
        setProperty("filter", value);
    }

    public java.lang.String getHandler() {
        return (java.lang.String) getProperty("handler");
    }

    public void setHandler(java.lang.String value) {
        setProperty("handler", value);
    }

    public String getHint() {
        Function property = ((Function) getProperty("hint"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setHint(String value) {
        setProperty("hint", new Function(value));
    }

    public boolean getHoldToDrag() {
        return (Boolean) getProperty("holdToDrag");
    }

    public void setHoldToDrag(boolean value) {
        setProperty("holdToDrag", value);
    }

    public String getPlaceholder() {
        Function property = ((Function) getProperty("placeholder"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setPlaceholder(String value) {
        setProperty("placeholder", new Function(value));
    }

    public String getCancel() {
        Function property = ((Function) getProperty("cancel"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setCancel(String value) {
        setProperty("cancel", new Function(value));
    }

    public String getChange() {
        Function property = ((Function) getProperty("change"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setChange(String value) {
        setProperty("change", new Function(value));
    }

    public String getEnd() {
        Function property = ((Function) getProperty("end"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setEnd(String value) {
        setProperty("end", new Function(value));
    }

    public String getMove() {
        Function property = ((Function) getProperty("move"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setMove(String value) {
        setProperty("move", new Function(value));
    }

    public String getStart() {
        Function property = ((Function) getProperty("start"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setStart(String value) {
        setProperty("start", new Function(value));
    }

    // << Attributes

}
