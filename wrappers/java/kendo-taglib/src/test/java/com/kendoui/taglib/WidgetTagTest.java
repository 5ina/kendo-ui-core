package com.kendoui.taglib;

import javax.servlet.jsp.JspWriter;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.PageContext;

import org.junit.Before;
import org.junit.Test;

import com.kendoui.taglib.html.Element;
public class WidgetTagTest {
    private WidgetTagTestDouble tag;
    private PageContext pageContext;

    @Before
    public void setUp() throws IOException {
        tag = spy(new WidgetTagTestDouble());

        tag.initialize();
        tag.setName("foo");

        JspWriter out = mock(JspWriter.class);

        when(out.append((String)anyObject())).thenReturn(out);

        pageContext = mock(PageContext.class);

        when(pageContext.getOut()).thenReturn(out);

        tag.setPageContext(pageContext);
    }

    @Test
    public void htmlReturnsElement() {
        assertTrue(tag.html() instanceof Element);
    }
    
    @Test
    public void dynamicAttributesAreTreatedAsHtmlAttributes() throws JspException, IOException {
        tag.setDynamicAttribute(null, "bar", "baz");
	assertTrue(tag.html().outerHtml().startsWith("<div"));
        assertTrue(tag.html().outerHtml().endsWith("</div>"));
        assertTrue(tag.html().outerHtml().contains("id=\"foo\""));
	assertTrue(tag.html().outerHtml().contains("bar=\"baz\""));
    }

    @Test
    public void htmlSetsThedAttributeToTheValueOfTheNameProperty() throws IOException {
        assertEquals("<div id=\"foo\"></div>", tag.html().outerHtml());
    }

    @Test
    public void doEndTagCallsHtmlAndScript() throws JspException {
        tag.doEndTag();

        verify(tag).html();
        verify(tag).script();
    }

    @Test
    public void scriptReturnsPluginInitializationStatement() throws IOException {
        tag.setFoo("foo");
        assertEquals("jQuery(function(){jQuery(\"#foo\").kendoFoo({\"foo\":\"foo\"});})", tag.script().html());
    }
    
    @Test
    public void scriptUsesTheElementID() throws IOException {
        tag.attributes.put("id", "testFoo");
        assertEquals("jQuery(function(){jQuery(\"#testFoo\").kendoFoo({});})", tag.script().html());
    }
}
