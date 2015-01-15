<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>

<demo:header />

<div class="demo-section">
	<kendo:numericTextBox name="numerictextbox" change="change" spin="spin"></kendo:numericTextBox>
</div>
<div class="demo-section">
    <h3 class="title">Console log</h3>
    <div class="console"></div>
</div>

<script>
    function change() {
        kendoConsole.log("Change :: " + this.value());
    }

    function spin() {
        kendoConsole.log("Spin :: " + this.value());
    }
</script>

<style>
    .demo-section {
        width: 500px;
        text-align: center;
    }
    .console {
        margin: 0;
    }
</style>
<demo:footer />
