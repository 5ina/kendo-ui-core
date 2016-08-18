function uploadAsync(createUpload, simulateUpload, simulateUploadWithResponse, simulateRemove, errorResponse) {

    test("Upload wrapper should contain k-upload-empty class", function() {
        var uploadInstance = createUpload();
        ok($(uploadInstance.wrapper).is(".k-upload-empty"));
    });

    test("Upload wrapper should contain k-header class", function() {
        var uploadInstance = createUpload();
        ok($(uploadInstance.wrapper).is(".k-header"));
    });

    test("k-upload-empty class is removed when file is selected", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();

        ok(!$(uploadInstance.wrapper).is(".k-upload-empty"));
    });

    test("k-upload-empty class is added again when file list is empty", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");

        ok($(uploadInstance.wrapper).is(".k-upload-empty"));
    });

    test("remove icon is not rendered upon success if remove action is not configured", function() {
        var uploadInstance = createUpload( { async: { saveUrl: "javascript:;", removeUrl: null } } );

        simulateUpload();
        equal($(".k-i-delete", uploadInstance.wrapper).length, 0);
    });

    test("status icon wrapper is rendered", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-files .k-file span.k-file-extension-wrapper", uploadInstance.wrapper).length, 1);
    });

    test("status icon is rendered", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-files .k-file span.k-file-extension", uploadInstance.wrapper).length, 1);
    });

    test("remove icon is rendered upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-i-delete", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total shows loading icon when upload starts", function(){
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-status-total .k-i-loading", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total loading icon span contains correct text when upload starts", function(){
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-status-total .k-i-loading", uploadInstance.wrapper).text(), "uploading");
    });

    test("k-upload-status-total contains correct text when upload starts", function(){
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-status-total", uploadInstance.wrapper).clone().children().remove().end().text(), "Uploading...");
    });

    test("k-upload-status-total text reverts back to Done if upload is canceled and there are other finished uploads", function(){
        var uploadInstance = createUpload();
        simulateUpload();
        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");
        equal($(".k-upload-status-total", uploadInstance.wrapper).clone().children().remove().end().text(), "Done");
    });

    test("k-upload-status-total icon reverts back to success if upload is canceled and there are no failed uploads", function(){
        var uploadInstance = createUpload();
        simulateUpload();
        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");
        equal($(".k-upload-status-total .k-i-tick", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total icon reverts back to warning if upload is canceled and there are failed uploads", function(){
        var uploadInstance = createUpload();

        simulateUploadWithResponse(errorResponse);
        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");
        equal($(".k-upload-status-total .k-warning", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total shows warning icon when upload has not finished successfully", function(){
        var uploadInstance = createUpload();
        simulateUploadWithResponse(errorResponse);

        equal($(".k-upload-status-total .k-warning", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total shows success icon when upload has finished successfully", function(){
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-upload-status-total .k-i-tick", uploadInstance.wrapper).length, 1);
    });

    test("k-upload-status-total contains correct text when upload is finished", function(){
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-upload-status-total", uploadInstance.wrapper).clone().children().remove().end().text(), "Done");
    });

    test("k-upload-status-total warning icon span contains correct text when upload has finished with errors", function(){
        var uploadInstance = createUpload();
        simulateUploadWithResponse(errorResponse);

        equal($(".k-upload-status-total .k-warning", uploadInstance.wrapper).text(), "warning");
    });

    test("k-upload-status-total success icon span contains correct text when upload has finished successfully", function(){
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-upload-status-total .k-i-tick", uploadInstance.wrapper).text(), "uploaded");
    });

    test("Header status icon is displayed when selecting invalid file", function() {
        var uploadInstance = createUpload({
            validation: {
                allowedExtensions: [".txt"]
            }
        });

        simulateFileSelect("invalid.png");

        equal($(".k-upload-status-total .k-warning", uploadInstance.wrapper).length, 1);
    });

    test("Header status icon is updated when selecting invalid file after valid", function() {
        var uploadInstance = createUpload({
            validation: {
                allowedExtensions: [".txt"]
            }
        });

        simulateUpload();
        simulateFileSelect("invalid.png");

        equal($(".k-upload-status-total .k-warning", uploadInstance.wrapper).length, 1);
    });

    test("Header status icon is updated when only successfully uploaded files are left", function() {
        var uploadInstance = createUpload({
            validation: {
                allowedExtensions: [".txt"]
            }
        });

        simulateUpload();
        simulateFileSelect("invalid.png");
        simulateRemoveClick(1);

        equal($(".k-upload-status-total .k-i-tick", uploadInstance.wrapper).length, 1);
    });

    test("k-file-progress is rendered when upload starts", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();

        equal($(".k-upload-files li.k-file-progress", uploadInstance.wrapper).length, 1);
    });

    test("k-file-progress is cleared upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-upload-files li.k-file-progress", uploadInstance.wrapper).length, 0);
    });

    test("uploading status text is rendered when upload starts", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();
        
        equal($(".k-upload-files .k-file span.k-file-state", uploadInstance.wrapper).text(), "uploading");
    });

    test("k-file-success is rendered upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-upload-files li.k-file-success", uploadInstance.wrapper).length, 1);
    });

    test("uploaded status text is rendered upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();
        
        equal($(".k-upload-files .k-file span.k-file-state", uploadInstance.wrapper).text(), "uploaded");
    });

    test("k-file-error is rendered upon upload error", function() {
        var uploadInstance = createUpload();
        simulateUploadWithResponse(errorResponse);

        equal($(".k-upload-files li.k-file-error", uploadInstance.wrapper).length, 1);
    });

    test("error status text is rendered upon upload error", function() {
        var uploadInstance = createUpload();
        simulateUploadWithResponse(errorResponse);

        equal($(".k-upload-files .k-file span.k-file-state", uploadInstance.wrapper).text(), "failed");
    });

    test("retry button is rendered upon upload error", function() {
        var uploadInstance = createUpload();
        simulateUploadWithResponse(errorResponse);

        equal($(".k-upload-files li.k-file .k-upload-action .k-i-retry", uploadInstance.wrapper).length, 1);
    });

    test("clicking remove should call remove action", function() {
        var uploadInstance = createUpload();
        var removeCalled = false;
        uploadInstance._submitRemove = function(data, onSuccess) {
            removeCalled = true;
        };

        simulateUpload();
        simulateRemove();

        ok(removeCalled);
    });

    test("Anti-Forgery Token is sent to remove action", 1, function() {
        $(document.body).append("<input type='hidden' name='__RequestVerificationToken' value='42' />");

        $.mockjax(function(settings) {
            equal(settings.data["__RequestVerificationToken"], 42);
        });

        simulateUpload();
        simulateRemoveClick();

        $("input[name='__RequestVerificationToken']").remove();
    });

    test("Rails CSRF token is sent to remove action", 1, function() {
        $("head").append('<meta content="authenticity_token" name="csrf-param" />');
        $("head").append('<meta content="42" name="csrf-token" />');

        $.mockjax(function(settings) {
            equal(settings.data["authenticity_token"], 42);
        });

        simulateUpload();
        simulateRemoveClick();

        $("meta[name='csrf-param'], meta[name='csrf-token']").remove();
    });


    asyncTest("clicking remove should remove file entry upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();
        simulateRemove();

        setTimeout(function() {
            equal($(".k-file", uploadInstance.wrapper).length, 0);
            start();
        }, 100);
    });

    asyncTest("disable prevents clicking remove", function () {
        var uploadInstance = createUpload();
        simulateUpload();
        uploadInstance.disable();
        simulateRemove();
        setTimeout(function() {
            equal($(".k-file", uploadInstance.wrapper).length, 1);
            start();
        }, 100);
    });

    test("cancel icon is rendered", function() {
        var uploadInstance = createUpload();
        simulateFileSelect();
        equal($(".k-upload-files li.k-file button.k-upload-action span.k-i-cancel", uploadInstance.wrapper).length, 1);
    });

    test("cancel icon is cleared upon success", function() {
        var uploadInstance = createUpload();
        simulateUpload();

        equal($(".k-i-cancel", uploadInstance.wrapper).length, 0);
    });

    test("Progress event is raised", 1, function() {
        var uploadInstance = createUpload({ progress:
            function() {
                ok(true);
            }
        });

        simulateUpload();
    });

    test("Progress event arguments contains percentComplete", 1, function() {
        var uploadInstance = createUpload({ progress:
            function(e) {
                ok(e.percentComplete > 0);
            }
        });

        simulateUpload();
    });

    test("Progress event arguments contains files", 1, function() {
        var uploadInstance = createUpload({ progress:
            function(e) {
                ok(e.files.length == 1);
            }
        });

        simulateUpload();
    });

    test("k-file-error class is removed on upload retry", function() {
        var uploadInstance = createUpload();
        var performUploadCalled = false;

        simulateUploadWithResponse(errorResponse);

        uploadInstance._module.performUpload = function() { performUploadCalled = true; };

        $(".k-i-retry", uploadInstance.wrapper).trigger("click");

        ok(performUploadCalled);
    });
}
