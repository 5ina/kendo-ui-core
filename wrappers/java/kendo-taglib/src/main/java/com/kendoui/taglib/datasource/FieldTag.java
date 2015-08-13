package com.kendoui.taglib.datasource;

import javax.servlet.jsp.JspException;

import com.kendoui.taglib.BaseTag;
import com.kendoui.taglib.json.Function;

@SuppressWarnings("serial")
public class FieldTag extends BaseTag {
    @Override
    public int doEndTag() throws JspException {
        FieldsTag parent = (FieldsTag)findParentWithClass(FieldsTag.class);

        parent.addField(this);

        return super.doEndTag();
    }
    
    public String getName() {
        return (String)getProperty("name");
    }
    
    public void setName(String name) {
        setProperty("name", name);
    }
    
    public String getFrom() {
        return (String)getProperty("from");
    }
    
    public void setFrom(String from) {
        setProperty("from", from);
    }
    
    public Object getDefaultValue() {
        return getProperty("defaultValue");
    }
    
    public void setDefaultValue(Object value) {
        String stringValue = value.toString();
        try {
            value = Double.parseDouble(stringValue);
        }catch(NumberFormatException e) {
            try {                            
                if (stringValue.equalsIgnoreCase("true") || stringValue.equalsIgnoreCase("false")) {
                    value = Boolean.parseBoolean(stringValue);
                }
            }catch(Exception boolExc) {
            }
        }
        setProperty("defaultValue", value);
    }
    
    public boolean getEditable() {
        return (Boolean) getProperty("editable");
    }
    
    public void setEditable(boolean value) {
        setProperty("editable", value);
    }
    
    public boolean getNullable() {
        return (Boolean) getProperty("nullable");
    }
    
    public void setNullable(boolean value) {
        setProperty("nullable", value);
    }
    
    public String getType() {
        return (String)getProperty("type");
    }
    
    public void setType(String value) {
        setProperty("type", value);
    }

    public void setValidation(ValidationTag validationTag) {
        setProperty("validation", validationTag.properties());
    }

    public String getParse() {
        Function property = ((Function)getProperty("parse"));
        if (property != null) {
            return property.getBody();
        }
        return null;
    }

    public void setParse(String value) {
        setProperty("parse", new Function(value));
    }

    public void setParse(FieldParseFunctionTag value) {
        setEvent("parse", value.getBody());
    }
    
    public static String tagName() {
        return "dataSource-schema-model-field";
    }
}
