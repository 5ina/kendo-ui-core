(function(){

var uploadInstance,
    Upload = kendo.ui.Upload,
    _getSupportsMultiple;

function createUpload(options) {
    removeHTML();
    copyUploadPrototype();

    $('#uploadInstance').kendoUpload(options);
    $('#uploadInstance').closest(".k-upload").addClass("k-upload-sync");
    return $('#uploadInstance').data("kendoUpload");
}

function moduleSetup() {
    _getSupportsMultiple = Upload.prototype._getSupportsMultiple;
}

function moduleTeardown() {
    Upload.prototype._getSupportsMultiple = _getSupportsMultiple;
    removeHTML();
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / SyncUpload", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload();
    },
    teardown: moduleTeardown
});

test("upload wrapper contains k-upload-empty class", function() {
    ok($(uploadInstance.wrapper).is(".k-upload-empty"));
});

test("upload wrapper contains k-upload-sync class", function() {
    ok($(uploadInstance.wrapper).is(".k-upload-sync"));
});

test("k-upload-empty class is removed when file is selected", function() {
    simulateFileSelect();
    ok(!$(uploadInstance.wrapper).is(".k-upload-empty"));
});

test("k-upload-empty class is added again when file list is empty", function() {
    simulateFileSelect();
    simulateRemoveClick();
    ok($(uploadInstance.wrapper).is(".k-upload-empty"));
});

// test("k-i-extension class is added to the file icon if file has extension", function(){
//     simulateFileSelect("test.zip");
//     ok($(".k-upload-files li.k-file > .k-icon", uploadInstance.wrapper).is(".k-i-zip"));
// });

// test("k-i-extension class is not added to the file icon if file does not have extension", function(){
//     simulateFileSelect("test");
//     var fileIcon = $(".k-upload-files li.k-file > .k-icon", uploadInstance.wrapper);
//     equal(fileIcon.removeClass("k-icon").attr("class"), "");
// });

test("current input is hidden after choosing a file", function() {
    simulateFileSelect();
    equal($("input:not(:visible)", uploadInstance.wrapper).length, 1);
});

test("list element is created for the selected file", function() {
    simulateFileSelect();
    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 1);
});

test("status icon is rendered always", function() {
    simulateFileSelect();
    equal($(".k-upload-files li.k-file > .k-icon", uploadInstance.wrapper).length, 1);
});

test("clicking remove should remove file entry", function() {
    simulateFileSelect();
    simulateFileSelect();
    $(".k-i-delete:first", uploadInstance.wrapper).trigger("click");
    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 1);
});

test("disable prevents clicking remove", function () {
    simulateFileSelect();
    uploadInstance.disable();
    $(".k-i-delete:first", uploadInstance.wrapper).trigger("click");
    equal($(".k-file", uploadInstance.wrapper).length, 1);
});

test("clicking remove should remove file input", function() {
    simulateFileSelect();
    $(".k-i-delete", uploadInstance.wrapper).trigger("click");
    equal($("input", uploadInstance.wrapper).length, 1);
});

test("removing last file should remove list", function() {
    simulateFileSelect();
    $(".k-i-delete", uploadInstance.wrapper).trigger("click");
    equal($(".k-upload-files", uploadInstance.wrapper).length, 0);
});

test("list element is re-created after removing all files", function() {
    simulateFileSelect();
    $(".k-i-delete", uploadInstance.wrapper).trigger("click");
    simulateFileSelect();
    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 1);
});

test("the empty input is disabled when the parent form is submitted", function() {
    $("#parentForm").trigger("submit");

    equal(uploadInstance.element.attr("disabled"), "disabled");
});

asyncTest("the empty input is restored when the parent submit is completed", function() {
    $("#parentForm").trigger("submit");

    setTimeout(function() {
        equal(uploadInstance.element.attr("disabled"), undefined);
        start();
    }, 50);
});

test("enctype is set on parent form", function() {
    equal($("#parentForm").attr("enctype"), "multipart/form-data");
});

uploadSelection(createUpload);

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / SyncUpload / Events", {
    setup: moduleSetup,
    teardown: moduleTeardown
});

test("remove event fires upon remove", function() {
    var removeFired = false;

    uploadInstance = createUpload({ "remove" : (function() { removeFired = true; }) });

    simulateFileSelect();
    simulateRemoveClick();

    ok(removeFired);
});

test("remove event contains list of files", 1, function() {
    uploadInstance = createUpload({ "remove" :
        (function(e) { equal(e.files.length, 1); })
    });

    simulateFileSelect();
    simulateRemoveClick();
});

test("cancelling remove prevents file from being removed", function() {
    uploadInstance = createUpload({ "remove" : (function(e) { e.preventDefault(); }) });

    simulateFileSelect();
    simulateRemoveClick();

    equal($(".k-upload-files li.k-file", uploadInstance.wrapper).length, 1);
});

uploadSelect(createUpload);

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / SyncUpload / Templates", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            template: "<span class='k-progress'></span><div class='myTemplate'><span class='fileInfo'>#=name# #=size# #=files[0].extension#</span><button type='button' class='k-upload-action'></button></div>"
        });
    },
    teardown: moduleTeardown
});

test("rendered template should be wrapped as a list item", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file > .myTemplate").length, 1);
});

test("rendered template should contain file name, size and extension", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file .fileInfo", uploadInstance.wrapper).text(), "image.jpg 500 .jpg");
});

test("rendered template should contain k-upload-action button", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file button.k-upload-action", uploadInstance.wrapper).length, 1);
});

test("k-upload-action button should contain remove icon", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($(".k-file button.k-upload-action > span.k-i-delete", uploadInstance.wrapper).length, 1);
});

test("progress bar is rendered in the template", function() {
    simulateSingleFileSelect("image.jpg", 500);
    equal($('.k-progress', uploadInstance.wrapper).length, 1);
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / SyncUpload / Initial Files", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"},
                { name: "test1.jpg", size: 60, extension: ".jpg" }
            ]
        });
    },
    teardown: moduleTeardown
});

test("initial files are not rendered even if they are passed in the configuration", function(){
    equal($('.k-file', uploadInstance.wrapper).length, 0);
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / SyncUpload / Files prior to initialization", {
    setup: function() {
        moduleSetup();
    },
    teardown: moduleTeardown
});

test("files selected prior to initialization are added to the list", function(){
    removeHTML();
    copyUploadPrototype();

    simulateFileSelect();

    uploadInstance = $('#uploadInstance').kendoUpload().data("kendoUpload");

    equal($('.k-file', uploadInstance.wrapper).length, 1);
});

test("select event is fired when files are selected prior to initialization", function(){
    var selectFired = false;

    removeHTML();
    copyUploadPrototype();

    simulateFileSelect();

    uploadInstance = $('#uploadInstance').kendoUpload({
        select: function(){
            selectFired = true;
        }
    }).data("kendoUpload");

    ok(selectFired);
});

test("select event is not fired when no files are selected prior to initialization", function(){
    var selectFired = false;

    uploadInstance = createUpload({
        select: function(){
            selectFired = true;
        }
    });

    ok(!selectFired);
});

})();
