<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib prefix="kendo" uri="http://www.kendoui.com/jsp/tags"%>
<%@taglib prefix="demo" tagdir="/WEB-INF/tags"%>

<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<demo:header />

<div id="example" class="k-content">
    <div class="demo-section">
        <h2>Reset Password</h2>
        <div>
            <ul class="forms">
                <li>
                    <label>New Password</label>
                    <input id="userPass" type="password" name="userPass" value="" class="k-textbox" style="width: 260px;" />
                </li>
                <li>
                    <label>Password strength</label>
                    <kendo:progressBar name="passStrength" type="value" max="9" change="onChange">
                    	<kendo:progressBar-animation duration="0"></kendo:progressBar-animation>
                    </kendo:progressBar>
                </li>
                <li>
                    <label></label>
                    <button id ="submitButton" class="k-button">Done</button>
                </li>
            </ul>
        </div>
    </div>
    <script>
        var passProgress;
        $(document).ready(function () {
            passProgress = $("#passStrength").data("kendoProgressBar");
            passProgress.progressStatus.text("Empty");
        });

        $("#userPass").keyup(function () {
            passProgress.value(this.value.length);
        });

        $("#submitButton").click(function () {
            var strength = passProgress.progressStatus.first().text();
            alert(strength + " password!");
        });

        function onChange(e) {
            this.progressWrapper.css({
                "background-image": "none",
                "border-image": "none"
            });

            if (e.value < 1) {
                this.progressStatus.text("Empty");
            } else if (e.value <= 3) {
                this.progressStatus.text("Weak");

                this.progressWrapper.css({
                    "background-color": "#EE9F05",
                    "border-color": "#EE9F05"
                });
            } else if (e.value <= 6) {
                this.progressStatus.text("Good");

                this.progressWrapper.css({
                    "background-color": "#428bca",
                    "border-color": "#428bca"
                });
            } else {
                this.progressStatus.text("Strong");

                this.progressWrapper.css({
                    "background-color": "#8EBC00",
                    "border-color": "#8EBC00"
                });
            }
        }
    </script>

    <style>
    	#passStrength {
            width: 260px;
        }
    
        .demo-section {
            width: 400px;
            padding: 30px;
        }
        
        .demo-section h2 {
            font-weight: normal;
            margin: 0 0 20px 0;
        }
        
        .forms {
            list-style-type: none;
            padding: 0;
            margin-bottom: -10px;
        }
        
        .forms label {
            display: inline-block;
            width: 115px;
            text-align: right;
            padding-right: 20px;
        }
        
        .forms li {
            margin-bottom: 10px;
        }
        
        #submitButton {
            width: 260px;
            margin: 10px 0 0 0;
        }
    </style>
</div>

<demo:footer />