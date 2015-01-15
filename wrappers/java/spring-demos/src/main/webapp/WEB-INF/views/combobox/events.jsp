<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>
<demo:header />
    <div class="demo-section">
        <h3 class="title">Select item
        </h3>
        <kendo:comboBox name="combobox" open="onOpen" close="onClose" change="onChange" dataBound="onDataBound" select="onSelect"
            filtering="onFiltering" dataTextField="text" dataValueField="value" filter="startswith">
            <kendo:dataSource data="${items}">
            </kendo:dataSource>
        </kendo:comboBox>
    </div>
    <div class="demo-section">
        <h3 class="title">Console log
    	</h3>
    	<div class="console"></div>
    </div>
    <script>
        function onOpen() {
            if ("kendoConsole" in window) {
                kendoConsole.log("event :: open");
            }
        }

        function onClose() {
            if ("kendoConsole" in window) {
                kendoConsole.log("event :: close");
            }
        }

        function onChange() {
            if ("kendoConsole" in window) {
                kendoConsole.log("event :: change");
            }
        }

        function onDataBound() {
            if ("kendoConsole" in window) {
                kendoConsole.log("event :: dataBound");
            }
        }
        
        function onFiltering(e) {
            if ("kendoConsole" in window) {
                kendoConsole.log("event :: filtering");
            }
        }

        function onSelect(e) {
            if ("kendoConsole" in window) {
                var dataItem = this.dataItem(e.item.index());
                kendoConsole.log("event :: select (" + dataItem.text + " : " + dataItem.value + ")" );
            }
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
