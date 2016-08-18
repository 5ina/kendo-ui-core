function copyUploadPrototype() {
    createHTML();
    $("#testbed").html(
        $("#prototype").html().replace(/uploadPrototype/g, "uploadInstance").replace(/file/g, "text")
    );
}

function createHTML() {
   var html = '<div id="testbed_container"><div id="prototype" style="display:none">' +
        '<div class="k-widget k-upload k-header k-upload-empty">' +
            '<div class="k-button k-upload-button">' +
                '<span>Select...</span>' +
                '<input id="uploadPrototype" name="uploadPrototype" type="file" />' +
           '</div>' +
        '</div>' +
    '</div>' +
    '<form id="parentForm" action="javascript:return \'\';" onsubmit="return false;" method="post">' +
    '<div id="testbed">' +
        '</div>' +
    '</form></div>'

    $(html).appendTo(QUnit.fixture);
}
function removeHTML() {
    kendo.destroy(QUnit.fixture);
    QUnit.fixture.empty();
}

function simulateFileSelect(fileName) {
    var clickEvent = $.Event("click");
    $("#uploadInstance").trigger(clickEvent);
    if (!clickEvent.isDefaultPrevented()) {
        $("#uploadInstance").val(fileName || "first.txt").trigger("change");
    }
}

function simulateSingleFileSelect(fileName, fileSize) {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");
    uploadInstance._onInputChange({ target: {
            files: [
                { name: fileName || "first.txt", size: fileSize || 100 }
            ]}
        }
    );
}

function simulateMultipleFileSelect() {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");
    uploadInstance._onInputChange({ target: {
            files: [
                { name: "first.txt", size: 1 },
                { fileName: "second.txt", fileSize: 2 } // fileName and fileSize are used by Firefox (versions before 3.6)
            ]}
        }
    );
}

function simulateMultipleFileSelectWithFileInfo(files) {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");
    uploadInstance._onInputChange({
        target: { files: files }
    });
}

function getFileListMock() {
    return [
        { name: "first.txt", size: 1, extension: ".txt" },
        { name: "second.txt", size: 2, extension: ".txt" }
    ];
}

function simulateRemoveClick(fileIndex) {
    var uploadInstance = $("#uploadInstance").data("kendoUpload");
    $(".k-i-delete", uploadInstance.wrapper).eq(fileIndex || 0).trigger("click");
}

function assertSelectedFile(files) {
    // Exclude the raw file and uid from comparison
    delete files[0].rawFile;
    delete files[0].uid;

    deepEqual(files, [ { name: "first.txt", extension: ".txt", size: null } ]);
}

function assertMultipleSelectedFiles(files) {
    // Exclude the raw file and uid from comparison
    delete files[0].rawFile;
    delete files[1].rawFile;

    delete files[0].uid;
    delete files[1].uid;

    deepEqual(files, [
        { name: "first.txt", extension: ".txt", size: 1 },
        { name: "second.txt", extension: ".txt", size: 2 }
    ]);
}
