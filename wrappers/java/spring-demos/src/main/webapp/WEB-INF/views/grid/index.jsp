<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:url value="/resources/web/grid/clientsDb.png" var="backgroundUrl" />
<c:url value="/grid/customers/" var="transportReadUrl" />

<demo:header />

<div id="clientsDb">
    <kendo:grid name="grid" groupable="true" sortable="true" style="height:380px;">
    	<kendo:grid-pageable refresh="true" pageSizes="true" buttonCount="5">
    	</kendo:grid-pageable>
        <kendo:grid-columns>
            <kendo:grid-column title="Contact Name" field="contactName" width="140" />
            <kendo:grid-column title="Contact Title" field="contactTitle" width="190" />
            <kendo:grid-column title="Company Name" field="companyName" />
            <kendo:grid-column title="Country" field="country" width="110" />
        </kendo:grid-columns>
        <kendo:dataSource pageSize="10">
             <kendo:dataSource-schema>
                <kendo:dataSource-schema-model>
                    <kendo:dataSource-schema-model-fields>
                        <kendo:dataSource-schema-model-field name="contactName" type="string" />
                        <kendo:dataSource-schema-model-field name="contactTitle" type="string" />
                        <kendo:dataSource-schema-model-field name="companyName" type="string" />
                        <kendo:dataSource-schema-model-field name="country" type="string" />
                    </kendo:dataSource-schema-model-fields>
                </kendo:dataSource-schema-model>
            </kendo:dataSource-schema>
            <kendo:dataSource-transport>
                <kendo:dataSource-transport-read url="${transportReadUrl}"/>
            </kendo:dataSource-transport>
        </kendo:dataSource>
    </kendo:grid>
</div>  

 <style>
	#clientsDb {
	    width: 952px;
	    height: 396px;
	    margin: 20px auto 0;
	    padding: 51px 4px 0 4px;
        background: url('${backgroundUrl}') no-repeat 0 0;
     }
 </style>  
<demo:footer />