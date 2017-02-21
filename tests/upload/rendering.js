(function(){

var uploadInstance, _supportsMultiple, _supportsDrop,
    Upload = kendo.ui.Upload;

function createUpload(options) {
    removeHTML();
    copyUploadPrototype();

    $('#uploadInstance').kendoUpload(options);
    return $('#uploadInstance').data("kendoUpload");
}

function moduleSetup() {
    _supportsMultiple = Upload.prototype._supportsMultiple;
    _supportsDrop = Upload.prototype._supportsDrop;
}

function moduleTeardown() {
    Upload.prototype._supportsMultiple = _supportsMultiple;
    Upload.prototype._supportsDrop = _supportsDrop;
    removeHTML();
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / Rendering", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload();
    },
    teardown: moduleTeardown
});

test("multiple attribute rendered when multiple is set to true", function() {
    Upload.prototype._supportsMultiple = function() { return true; };
    createUpload();

    if (!kendo.support.browser.msie) {
        equal($("#uploadInstance").prop("multiple"), true);
    }
});

test("multiple attribute not rendered when multiple is set to false", function() {
    createUpload({ multiple: false });
    if (!kendo.support.browser.msie) {
        equal($("#uploadInstance").prop("multiple"), false);
    }
});

test("multiple attribute not rendered when multiple is not supported", function() {
    Upload.prototype._supportsMultiple = function() { return false; };
    createUpload();
    if (!kendo.support.browser.msie) {
        equal($("#uploadInstance").prop("multiple"), false);
    }
});

test("remove icon is rendered", function() {
    simulateFileSelect();
    equal($(".k-upload-files li.k-file button.k-upload-action span.k-i-close", uploadInstance.wrapper).length, 1);
});

test("file name is rendered", function() {
    simulateFileSelect();
    equal($(".k-file-name", uploadInstance.wrapper).text(), "first.txt");
});

test("file name is rendered as tooltip", function() {
    simulateFileSelect();
    equal($(".k-file-name", uploadInstance.wrapper).attr("title"), "first.txt");
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / Rendering / Aria-Label-Select-Files", {
    setup: function() {
        moduleSetup();

        uploadInstance = $('<input id="uploadInstance" name="uploadPrototype" type="file" />')
            .appendTo(QUnit.fixture)
            .kendoUpload({
                localization: {
                    select: "my select files",
                    remove: "remove file", 
                    cancel: "cancel the file upload"
                }
            });
    },
    teardown: moduleTeardown
});

test("aria-label is rendered for select files button", function() {
    var ariaLabelValue = $(".k-upload-button", uploadInstance.wrapper).attr("aria-label");
    ok(typeof ariaLabelValue !== typeof undefined && ariaLabelValue !== false);
});

test("aria-label is rendered for select files button", function() {
    var ariaLabelValue = $(".k-upload-button", uploadInstance.wrapper).attr("aria-label");
    equal(ariaLabelValue, "my select files");
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / Rendering / Aria-Label-Action-Buttons", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            localization: {
                select: "my select files",
                remove: "remove file",
                cancel: "cancel the file upload"
            }
        });
    },
    teardown: moduleTeardown
});

test("aria-label is rendered for remove button", function() {
    simulateFileSelect();
    var ariaLabelValue = $(".k-upload-action span", uploadInstance.wrapper).attr("aria-label");
    ok(typeof ariaLabelValue !== typeof undefined && ariaLabelValue !== false);
});

test("aria-label is rendered for remove button", function() {
    simulateFileSelect();
    var ariaLabelValue = $(".k-upload-action span", uploadInstance.wrapper).attr("aria-label");
    equal(ariaLabelValue, "remove file");
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

module("Upload / Rendering / Aria-Label-Action-Buttons-With-Templates", {
    setup: function() {
        moduleSetup();
        uploadInstance = createUpload({
            template: "<div><p>Name: #=name#</p>" +
              "<p>Size: #=size# bytes</p><p>Extension: #=files[0].extension#</p>" +
              "<button type='button' class='k-upload-action' style='position: absolute; top: 0; right: 0;'></button>" +
              "</div>",
            localization: {
                select: "my select files",
                remove: "remove file",
                cancel: "cancel the file upload"
            }
        });
    },
    teardown: moduleTeardown
});

test("aria-label is rendered for remove button when template is defined", function() {
    simulateFileSelect();
    var ariaLabelValue = $(".k-upload-action span", uploadInstance.wrapper).attr("aria-label");
    ok(typeof ariaLabelValue !== typeof undefined && ariaLabelValue !== false);
});

test("aria-label is rendered for remove button when template is defined", function() {
    simulateFileSelect();
    var ariaLabelValue = $(".k-upload-action span", uploadInstance.wrapper).attr("aria-label");
    equal(ariaLabelValue, "remove file");
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

module("Upload / Rendering / Drag and drop", {
    setup: function() {
        Upload.prototype._supportsDrop = function() { return true; };

        moduleSetup();
        uploadInstance = createUpload({ async: { showFileList: true } });
    },
    teardown: moduleTeardown
});

test("drop zone is rendered when supported by the browser", function() {
    equal($("> .k-dropzone", uploadInstance.wrapper).length, 1);
});

test("drop zone is not rendered when not supported by the browser", function() {
    Upload.prototype._supportsDrop = function() { return false; };
    uploadInstance = createUpload();

    equal($("> .k-dropzone", uploadInstance.wrapper).length, 0);
});

test("drop zone label is rendered", function() {
    equal($("> .k-dropzone > em", uploadInstance.wrapper).length, 1);
});

test("drop zone label text is rendered", function() {
    equal($("> .k-dropzone > em", uploadInstance.wrapper).text(), "Drop files here to upload");
});

test("drop zone is not active initially", function() {
    equal($(".k-dropzone-active", uploadInstance.wrapper).length, 0);
});

test("k-dropzone-active is rendered when dragging over the document", function() {
    $(document).trigger("dragenter");
    equal($(".k-dropzone-active", uploadInstance.wrapper).length, 1);
});

asyncTest("k-dropzone-active is removed when dragging out of the document", function() {
    $(document).trigger("dragenter");
    setTimeout(function() {
        equal($(".k-dropzone-active", uploadInstance.wrapper).length, 0);
        start();
    }, 250);
});

test("k-dropzone-hovered is rendered when dragging over the zone", function() {
    $(".k-dropzone").trigger("dragenter");
    equal($(".k-dropzone-hovered", uploadInstance.wrapper).length, 1);
});

asyncTest("k-dropzone-hovered is removed when dragging out of the zone", function() {
    $(".k-dropzone").trigger("dragenter");
    setTimeout(function() {
        equal($(".k-dropzone-hovered", uploadInstance.wrapper).length, 0);
        start();
    }, 250);
});

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
module("Upload / Rendering / Client Component Mode", {
    setup: function() {
        moduleSetup();
        $("<div id='cc'><input type='file' id='fileInput' name='fileInput' /></div>").appendTo(QUnit.fixture);
        $('#fileInput').kendoUpload();
        _supportsDrop = function() { return false; };
    },
    teardown: function() {
        moduleTeardown();
        $("#cc").remove();
    }
});

test("should render wrapper div", function() {
    equal($("#cc > div.k-widget.k-upload").length, 1);
});

test("should render upload button", function() {
    equal($("#cc > .k-upload > div.k-button.k-upload-button").length, 1);
});

test("should render upload button text", function() {
    equal($("#cc > .k-upload > .k-button span").text(), "Select files...");
});

test("should wrap input", function() {
    equal($("#cc > .k-upload > .k-button > input").length, 1);
});

})();
