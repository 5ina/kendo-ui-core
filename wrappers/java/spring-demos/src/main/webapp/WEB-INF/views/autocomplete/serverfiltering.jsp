<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:url value="/autocomplete/remote-data/read" var="readUrl" />

<demo:header />
    <div class="demo-section">
        <h2>Products</h2>

        <kendo:autoComplete name="products" dataTextField="productName" filter="contains" minLength="3" style="width:250px">
            <kendo:dataSource serverFiltering="true">
                <kendo:dataSource-transport>
                   <kendo:dataSource-transport-read url="${readUrl}" type="POST" contentType="application/json"/>
                   <kendo:dataSource-transport-parameterMap>
	                	<script>
		                	function parameterMap(options,type) {
		                		return JSON.stringify(options);
		                	}
	                	</script>
	                </kendo:dataSource-transport-parameterMap>
                </kendo:dataSource-transport>
                <kendo:dataSource-schema data="data" total="total">
                </kendo:dataSource-schema>
            </kendo:dataSource>
        </kendo:autoComplete>
    </div>
    <style>
	   .demo-section {
	       width: 250px;
	       margin: 35px auto 50px;
	       padding: 30px;
	   }
	   .demo-section h2 {
	       text-transform: uppercase;
	       font-size: 1.2em;
	       margin-bottom: 10px;
	   }
	</style>
<demo:footer />
