(function(){

var uploadInstance,
    Upload = kendo.ui.Upload,
    _supportsFormData,
    validJSON = "{\"status\":\"OK\"}",
    errorResponse = "ERROR!";

function createUpload(options) {
    removeHTML();
    copyUploadPrototype();

    $('#uploadInstance').kendoUpload($.extend({ async:{"saveUrl":'javascript:;',"removeUrl":"/removeAction",autoUpload: true} }, options));
    return $('#uploadInstance').data("kendoUpload");
}

function triggerIframeLoad(iframeIndex) {
    $("iframe[id^='uploadInstance_']").eq(iframeIndex)
                .trigger("load");
}

function simulateIframeResponse(iframeIndex, response) {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");
    uploadInstance._module.processResponse($("#uploadInstance_" + iframeIndex), response || "");
}

function simulateUpload(index) {
    var i = index || 0;

    simulateFileSelect();
    triggerIframeLoad(i);

    // Clean-up iframe as if the upload as if complete
    $(".k-file:last", uploadInstance.wrapper).data("frame", null);
}

function simulateUploadWithResponse(response, postSelectCallback, index) {
    var i = index || 0;

    simulateFileSelect();
    if (postSelectCallback) {
        postSelectCallback();
    }
    simulateIframeResponse(i, response);
}

function simulateRemove() {
    $.mockjax({
        url: "/removeAction",
        responseTime: 0,
        responseText: ""
    });

    simulateRemoveClick();
}

function simulateRemoveWithResponse(response) {
    $.mockjax({
        url: "/removeAction",
        responseTime: 0,
        responseText: response
    });

    simulateRemoveClick();
}

function simulateRemoveError() {
    $.mockjax({
        url: "/removeAction",
        status: 500,
        responseTime: 0,
        responseText: errorResponse
    });

    simulateRemoveClick();
}

function moduleSetup() {
    _supportsFormData = Upload.prototype._supportsFormData;
    Upload.prototype._supportsFormData = function() { return false; };
    Upload.prototype._alert = function() { };
    Upload._frameId = 0;
}

function moduleTeardown() {
    Upload.prototype._supportsFormData = _supportsFormData;
    uploadInstance.destroy();
    $("iframe[name^='uploadInstance'], form[target^='uploadInstance']").remove();
    $.mockjax.clear();
    removeHTML();
}

function getFileUid(fileIndex) {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");

    return uploadInstance.wrapper.find(".k-file").eq(fileIndex).attr("data-uid");
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload();
    },
    teardown: moduleTeardown
});

test("iframe module is selected when FormData is not supported", function() {
    equal(uploadInstance._module.name, "iframeUploadModule");
});

test("iframe module is not selected when FormData is supported", function() {
    Upload.prototype._supportsFormData = function() { return true; };

    uploadInstance = createUpload();

    ok(uploadInstance._module.name != "iframeUploadModule");
});

test("iframe is created after choosing a file", function() {
    simulateFileSelect();
    ok($("#uploadInstance_0").is("iframe"));
});

test("form is created after choosing a file", function() {
    simulateFileSelect();
    equal($("form[action='" + uploadInstance.options.async.saveUrl + "']").length, 1);
});

test("input is moved to the form", function() {
    simulateFileSelect();
    equal($("form[action='" + uploadInstance.options.async.saveUrl + "'] input").length, 1);
});

test("input name is preserved", function() {
    simulateFileSelect();
    equal($("form[action='" + uploadInstance.options.async.saveUrl + "'] input").attr("name"), "uploadInstance");
});

test("input name is set to saveField", function() {
    uploadInstance.options.async.saveField = "field";
    simulateFileSelect();
    equal($("form[action='" + uploadInstance.options.async.saveUrl + "'] input").attr("name"), "field");
});

test("list element is created for the selected file", function() {
    simulateFileSelect();
    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 1);
});

asyncTest("iframe is removed upon success", function() {
    simulateUpload();

    window.setTimeout(function() {
        equal($("#uploadInstance_0").length, 0);
        start();
    }, 10);
});

asyncTest("form is removed upon success", function() {
    simulateUpload();

    window.setTimeout(function() {
        equal($("form[action='" + uploadInstance.options.async.saveUrl + "']").length, 0);
        start();
    }, 10);
});

asyncTest("input is moved back to the original form when it's submitted", function() {
    simulateFileSelect();
    $("#parentForm").trigger("submit");

    window.setTimeout(function() {
        equal($("input[name='uploadInstance']", uploadInstance.wrapper).length, 2);
        start();
    }, 10);
});

asyncTest("clicking cancel should remove iframe", function() {
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    $(".k-i-cancel", uploadInstance.wrapper).trigger("click");

    window.setTimeout(function() {
        equal($("#uploadInstance_0").length, 0);
        start();
    }, 10);
});

asyncTest("clicking cancel should remove form", function() {
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    $(".k-i-cancel", uploadInstance.wrapper).trigger("click");

    window.setTimeout(function() {
        equal($("form[action='" + uploadInstance.options.async.saveUrl + "']").length, 0);
        start();
    }, 10);
});

asyncTest("clicking cancel should remove file entry", function() {
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    $(".k-i-cancel", uploadInstance.wrapper).trigger("click");

    window.setTimeout(function() {
        equal($(".k-file", uploadInstance.wrapper).length, 0);
        start();
    }, 10);
});

test("form is submitted when clicking retry", 1, function() {
    simulateUploadWithResponse(errorResponse);

    uploadInstance._module.performUpload = function(fileEntry) {
        ok(true);
    }

    $(".k-i-retry", uploadInstance.wrapper).trigger("click");
});

test("frame is not destroyed on failure to allow retry", function() {
    simulateUploadWithResponse(errorResponse);

    notEqual($(".k-file", uploadInstance.wrapper).data("frame"), null);
});

test("frame is not unregistered on failure to allow retry", function() {
    simulateUploadWithResponse(errorResponse);

    equal(uploadInstance._module.iframes.length, 1);
});

uploadAsync(createUpload, simulateUpload, simulateUploadWithResponse, simulateRemove, errorResponse);
uploadSelection(createUpload);
uploadAsyncNoMultiple(createUpload, simulateUpload);

var removeApiTestParams = {
    createUpload: createUpload,
    simulateFileSelect: simulateFileSelect,
    simulateUpload: simulateUpload,
    getFileUid: getFileUid,
    simulateUploadWithResponse: simulateUploadWithResponse,
    errorResponse: errorResponse
};

removeApi(removeApiTestParams);

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload / autoUpload = false", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({ async: {"saveUrl": 'javascript:;', "removeUrl": 'javascript:;', autoUpload: false } });
    },
    teardown: moduleTeardown
});

test("upload doesn't start before upload button click", function() {
    simulateFileSelect();

    equal($("#uploadInstance_0").length, 0);
});

test("upload starts on upload button click", function() {
    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");

    equal($("#uploadInstance_0").length, 1);
});

test("upload button is rendered on subsequent select", function() {
    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");
    $("#uploadInstance_0").trigger("load");
    simulateFileSelect();

    equal($(".k-upload-selected", uploadInstance.wrapper).length, 1);
});

asyncTest("upload button click does not start upload if it is already in progress", function() {
    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");

    var counter = 0;
    uploadInstance._module.performUpload = function(fileEntry) { counter++; }

    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");

    window.setTimeout(function() {
        equal(counter, 1);
        start();
    }, 10);
});

asyncTest("upload button click does not start upload after completion", function() {
    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");
    $("#uploadInstance_0").trigger("load");

    $(".k-file").addClass("complete");

    var counter = 0;
    uploadInstance._module.performUpload = function(fileEntry) {
        ok(fileEntry.is(":not(.complete)"), "performUpload should not be called for completed upload");
        counter++;
    }

    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");

    window.setTimeout(function() {
        equal(counter, 1);
        start();
    }, 10);
});

asyncTest("clicking remove should call remove action for completed files", function() {
    var removeCalled = false;
    uploadInstance._submitRemove = function(data, onSuccess) {
        removeCalled = true;
    };

    simulateFileSelect();
    $(".k-upload-selected", uploadInstance.wrapper).trigger("click");
    $("#uploadInstance_0").trigger("load");

    window.setTimeout(function() {
        simulateRemove();
        ok(removeCalled);
        start();
    }, 10);
});

test("clicking remove should remove upload form", function() {
    simulateFileSelect();
    simulateRemoveClick();

    equal($(".k-file", uploadInstance.wrapper).data("form"), null);
});

var noAutoConfig = { async: {"saveUrl": 'javascript:;', "removeUrl": 'javascript:;', autoUpload: false } };
asyncNoAuto(createUpload, simulateUploadWithResponse, noAutoConfig, simulateRemove, errorResponse);

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload / Events", {
    setup: moduleSetup,
    teardown: moduleTeardown
});

test("user data set in upload event is sent to the server", function() {
    uploadInstance = createUpload({ upload:
        function(e) {
            e.data = { myId : 42 };
        }
    });

    simulateFileSelect();

    equal($("form[target='uploadInstance_0'] input[name='myId']").val(), "42");
});

test("Anti-Forgery Token is sent to the server", function() {
    $(document.body).append("<input type='hidden' name='__RequestVerificationToken' value='42' />");

    uploadInstance = createUpload();
    simulateFileSelect();

    equal($("form[target='uploadInstance_0'] input[name='__RequestVerificationToken']").val(), "42");

    $("input[name='__RequestVerificationToken']").remove();
});

test("Rails CSRF token is sent to the server", function() {
    $("head").append('<meta content="authenticity_token" name="csrf-param" />');
    $("head").append('<meta content="42" name="csrf-token" />');

    uploadInstance = createUpload();
    simulateFileSelect();

    equal($("form[target='uploadInstance_0'] input[name='authenticity_token']").val(), "42");

    $("meta[name='csrf-param'], meta[name='csrf-token']").remove();
});

test("Anti-Forgery Token with AppPath sent to the server", function() {
    $(document.body).append("<input type='hidden' name='__RequestVerificationToken_test' value='42' />");

    uploadInstance = createUpload();
    simulateFileSelect();

    equal($("form[target='uploadInstance_0'] input[name='__RequestVerificationToken_test']").val(), "42");

    $("input[name='__RequestVerificationToken_test']").remove();
});

test("Multiple Anti-Forgery Tokens are sent to the server", function() {
    $(document.body).append("<input type='hidden' name='__RequestVerificationToken_1' value='42' />");
    $(document.body).append("<input type='hidden' name='__RequestVerificationToken_2' value='24' />");

    uploadInstance = createUpload();
    simulateFileSelect();

    equal($("form[target='uploadInstance_0'] input[name='__RequestVerificationToken_1']").val(), "42");
    equal($("form[target='uploadInstance_0'] input[name='__RequestVerificationToken_2']").val(), "24");

    $("input[name^='__RequestVerificationToken']").remove();
});

test("user data set in upload event is not duplicated after retry", function() {
    uploadInstance = createUpload({ upload:
        function(e) {
            e.data = { myId : 42 };
        }
    });

    simulateUploadWithResponse(errorResponse);
    $(".k-i-retry", uploadInstance.wrapper).trigger("click");

    equal($("form[target='uploadInstance_0'] input[name='myId']").length, 1);
});

test("saveUrl set in upload event is applied", function() {
    uploadInstance = createUpload({ upload:
        function() {
            this.options.async.saveUrl = "javascript:void(0);";
        }
    });

    simulateFileSelect();

    equal($("form[target='uploadInstance_0']").attr("action"), "javascript:void(0);");
});

test("cancelling the upload event prevents the upload operation", function() {
    uploadInstance = createUpload({ upload:
        function(e) {
            e.preventDefault();
        }
    });

    simulateFileSelect();

    equal($("#uploadInstance_0").length, 0);
});

test("error event arguments contain XHR object with status", function() {
    var xhr = null;
    uploadInstance = createUpload({ error:
        function(e) {
            xhr = e.XMLHttpRequest;
        }
    });

    simulateUploadWithResponse(errorResponse);

    equal(xhr.status, "500");
});

test("error event arguments contain XHR object with statusText", function() {
    var xhr = null;
    uploadInstance = createUpload({ error:
        function(e) {
            xhr = e.XMLHttpRequest;
        }
    });

    simulateUploadWithResponse(errorResponse);

    equal(xhr.statusText, "error");
});

test("complete is fired when all uploads complete successfully", function() {
    var completeFired = false;
    uploadInstance = createUpload({ complete:
        function(e) {
            completeFired = true;
        }
    });

    simulateFileSelect();
    simulateFileSelect();

    triggerIframeLoad(0);

    ok(!completeFired);

    triggerIframeLoad(1);

    ok(completeFired);
});

test("complete is fired when all uploads complete either successfully or with error", function() {
    var completeFired = false;
    uploadInstance = createUpload({ complete:
        function(e) {
            completeFired = true;
        }
    });

    simulateFileSelect();
    simulateFileSelect();

    simulateIframeResponse(0, errorResponse);

    ok(!completeFired);

    triggerIframeLoad(1);

    ok(completeFired);
});

test("complete is fired when upload fails", 1, function() {
    uploadInstance = createUpload({ complete:
        function(e) {
            ok(true);
        }
    });

    simulateFileSelect();
    simulateIframeResponse(0, errorResponse);
});

uploadSelect(createUpload);

uploadUploadEvent(createUpload);

var testContext = {
    createUpload: createUpload,
    simulateUpload: simulateUpload,
    simulateUploadWithResponse: simulateUploadWithResponse,
    errorResponse: errorResponse,
    validJSON: validJSON,
    simulateRemoveWithResponse: simulateRemoveWithResponse,
    simulateRemove: simulateRemove,
    simulateRemoveError: simulateRemoveError,
    noAutoConfig: noAutoConfig,
    simulateFileSelect: simulateFileSelect
};

uploadSuccess(testContext);
uploadError(testContext);
uploadCancel(createUpload);
uploadRemoveEvent(testContext);
uploadClearEvent(testContext);

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload / Templates / autoUpload = false", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            async: {"saveUrl": 'javascript:;', "removeUrl": 'javascript:;', autoUpload: false },
            template: "<span class='k-progress'></span><div class='myTemplate'>" +
                      "<span class='fileInfo'><span class='fileName'>#=name#</span><span class='fileSize'>#=size#</span>" +
                      "#=files[0].extension#</span>" +
                      "<button type='button' class='k-upload-action'></button></div>"
        });
    },
    teardown: moduleTeardown
});

test("k-upload-action button should contain remove icon", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file button.k-upload-action > span.k-i-close", uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain remove title", function(){
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file button.k-upload-action .k-icon", uploadInstance.wrapper).attr("title"), "Remove");
});

test("progress bar is rendered in the template", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($('.k-progress', uploadInstance.wrapper).length, 1);
});


// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload / Templates / autoUpload = true", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            async: {"saveUrl": 'javascript:;', "removeUrl": 'javascript:;' },
            template: "<div class='myTemplate'><span class='k-icon'></span>" +
                      "<span class='fileInfo'><span class='fileName'>#=name#</span><span class='fileSize'>#=size#</span>" +
                      "#=files[0].extension#</span>" +
                      "<button type='button' class='k-upload-action'></button><span class='k-progress'></span></div>"
        });
    },
    teardown: function() {
        moduleTeardown();
        kendo.destroy($("form"));
    }
});

test("loading status icon is rendered while uploading", function(){
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    equal($('.k-icon.k-i-loading', uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain cancel icon while uploading", function(){
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    equal($(".k-file button.k-upload-action > span.k-i-cancel", uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain cancel title while uploading", function(){
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    equal($(".k-file button.k-upload-action .k-icon", uploadInstance.wrapper).attr("title"), "Cancel");
});

test("progress bar is rendered in the template", function() {
    uploadInstance._module.onIframeLoad = function() { };
    simulateFileSelect();
    equal($('.k-progress', uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain retry icon on unsuccessful upload", function(){
    simulateUploadWithResponse(errorResponse);
    equal($(".k-file button.k-upload-action > span.k-i-retry", uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain retry title on unsuccessful upload", function(){
    simulateUploadWithResponse(errorResponse);
    equal($(".k-file button.k-upload-action .k-icon", uploadInstance.wrapper).attr("title"), "Retry");
});

test("k-upload-action button should contain remove icon on successful upload", function(){
    simulateUpload();
    equal($(".k-file button.k-upload-action > span.k-i-close", uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain remove title on successful upload", function(){
    simulateUpload();
    equal($(".k-file button.k-upload-action .k-icon", uploadInstance.wrapper).attr("title"), "Remove");
});

test("k-progress-status should have 100% width on successful upload", function(){
    simulateUpload();
    equal($(".k-file .k-progress", uploadInstance.wrapper)[0].style.width, "100%");
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / IframeUpload / Files prior to initialization", {
    setup: function() {
        moduleSetup();
    },
    teardown: function() {
        moduleTeardown();
        kendo.destroy($("form"));
    }
});

test("files selected prior to initialization are added to the list", function(){
    removeHTML();
    copyUploadPrototype();

    simulateFileSelect();

    uploadInstance = $('#uploadInstance').kendoUpload({
        async:{
            "saveUrl":'javascript:;',
            "removeUrl":"/removeAction",
            autoUpload: false
        }
    }).data("kendoUpload");

    equal($('.k-file', uploadInstance.wrapper).length, 1);
});

test("select event is fired when files are selected prior to initialization", function(){
    var selectFired = false;

    removeHTML();
    copyUploadPrototype();

    simulateFileSelect();

    uploadInstance = $('#uploadInstance').kendoUpload({
        async:{
            "saveUrl":'javascript:;',
            "removeUrl":"/removeAction",
            autoUpload: false
        },
        select: function() {
            selectFired = true;
        }
    }).data("kendoUpload");

    ok(selectFired);
});

})();
