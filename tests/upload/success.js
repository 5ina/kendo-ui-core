function uploadSuccess(params) {
    var createUpload = params.createUpload;
    var simulateUpload = params.simulateUpload;
    var simulateUploadWithResponse = params.simulateUploadWithResponse;
    var validJSON = params.validJSON;
    var simulateRemove = params.simulateRemove;
    var simulateRemoveWithResponse = params.simulateRemoveWithResponse;

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    test("success is fired when upload action succeeds", 1, function() {
        var uploadInstance = createUpload({ success:
            function() {
                ok(true);
            }
        });

        simulateUpload();
    });

    test("success is fired when the upload action returns empty response", 1, function() {
        var uploadInstance = createUpload({ success:
            function(e) {
                ok(true);
            }
        });

        simulateUploadWithResponse("");
    });

    test("success is fired on a subsequent upload after cancelling the upload event", function() {
        var successFired = false,
            shouldPreventUpload = true;
        var uploadInstance = createUpload({
            onUpload: function(e) {
                if (shouldPreventUpload) {
                    e.preventDefault();
                }
            },
            success: function() {
                successFired = true;
            }
        });

        simulateFileSelect();
        shouldPreventUpload = false;
        simulateUpload();

        ok(successFired);
    });

    test("success event arguments contain upload operation name", function() {
        var operation;
        var uploadInstance = createUpload({ success:
            function(e) {
                operation = e.operation;
            }
        });

        simulateUpload();

        equal(operation, "upload");
    });

    test("success event arguments contain list of uploaded files", function() {
        var files = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                files = e.files;
            }
        });

        simulateUpload();

        assertSelectedFile(files);
    });

    test("success event arguments contain server response", function() {
        var response = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                response = e.response;
            }
        });

        simulateUploadWithResponse(validJSON);

        equal(response.status, "OK");
    });

    test("success event arguments contain original XHR", function() {
        var xhr = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        simulateUploadWithResponse(validJSON);

        notEqual(xhr, null);
    });

    test("success event arguments contains XHR object with responseText", function() {
        var xhr = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        simulateUploadWithResponse(validJSON);

        equal(xhr.responseText, validJSON);
    });

    test("success event arguments contains XHR object with status", function() {
        var xhr = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        simulateUploadWithResponse(validJSON);

        equal(xhr.status, "200");
    });

    test("success event arguments contains XHR object with statusText", function() {
        var xhr = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        simulateUploadWithResponse(validJSON);

        equal(xhr.statusText, "OK");
    });

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    asyncTest("success is fired when remove action succeeds", function() {
        var successFired;
        var uploadInstance = createUpload({ success:
            function(e) {
                successFired = true;
            }
        });

        simulateUpload();
        successFired = false;
        simulateRemove();

        setTimeout(function() {
            ok(successFired);
            start();
        }, 100);
    });

    asyncTest("success event arguments contain list of removed files", function() {
        stop(1);

        var uploadInstance = createUpload({ success:
            function(e) {
                assertSelectedFile(e.files);
                start();
            }
        });

        simulateUpload();
        simulateRemove();
    });

    asyncTest("success event arguments contain remove operation name", function() {
        var operation = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                operation = e.operation;
            }
        });

        simulateUpload();
        simulateRemove();

        setTimeout(function() {
            equal(operation, "remove");
            start();
        }, 100);
    });

    asyncTest("success event arguments contain remove action response", function() {
        var data = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                data = e.response;
            }
        });

        simulateUpload();
        simulateRemoveWithResponse(validJSON);

        setTimeout(function() {
            equal(data.status, "OK");
            start();
        }, 100);
    });

    asyncTest("success event arguments contain original XHR for remove action", function() {
        var xhr = null;
        var uploadInstance = createUpload({ success:
            function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        simulateUpload();
        xhr = null;
        simulateRemove();

        setTimeout(function() {
            notEqual(xhr, null);
            start();
        }, 100);
    });

    asyncTest("success event arguments contain XHR with responseText for remove action", function() {
        var responseText;
        var uploadInstance = createUpload({ success:
            function(e) {
                responseText = e.XMLHttpRequest.responseText;
            }
        });

        simulateUpload();
        simulateRemoveWithResponse(validJSON);

        setTimeout(function() {
            equal(responseText, validJSON);
            start();
        }, 100);
    });

    asyncTest("success event arguments contain XHR with status for remove action", function() {
        var status;
        var uploadInstance = createUpload({ success:
            function(e) {
                status = e.XMLHttpRequest.status;
            }
        });

        simulateUpload();
        simulateRemove();

        setTimeout(function() {
            equal(status, "200");
            start();
        }, 100);
    });


    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    //Success tests for initial files

    asyncTest("success is fired when remove action succeeds for initially rendered files", function() {
        var successFired;
        var uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                successFired = true;
            }
        });

        successFired = false;
        simulateRemove();

        setTimeout(function() {
            ok(successFired);
            start();
        }, 100);
    });

    test("success event arguments contain list of removed files for initially rendered files", function() {
        stop(1);

        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                var files = e.files;
                delete files[0].uid;

                deepEqual(files, [ { name: "test.doc", extension: ".doc", size: 50 } ]);
                start();
            }
        });

        simulateRemove();
    });

    asyncTest("success event arguments contain remove operation name for initially rendered files", function() {
        var operation = null;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                operation = e.operation;
            }
        });

        simulateRemove();

        setTimeout(function() {
            equal(operation, "remove");
            start();
        }, 100);
    });

    asyncTest("success event arguments contain remove action response for initially rendered files", function() {
        var data = null;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                data = e.response;
            }
        });

        simulateRemoveWithResponse(validJSON);

        setTimeout(function() {
            equal(data.status, "OK");
            start();
        }, 100);
    });

    asyncTest("success event arguments contain original XHR for remove action for initially rendered files", function() {
        var xhr = null;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                xhr = e.XMLHttpRequest;
            }
        });

        xhr = null;
        simulateRemove();

        setTimeout(function() {
            notEqual(xhr, null);
            start();
        }, 100);
    });

    asyncTest("success event arguments contain XHR with responseText for remove action for initially rendered files", function() {
        var responseText;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                responseText = e.XMLHttpRequest.responseText;
            }
        });

        simulateRemoveWithResponse(validJSON);

        setTimeout(function() {
            equal(responseText, validJSON);
            start();
        }, 100);
    });

    asyncTest("success event arguments contain XHR with status for remove action for initially rendered files", function() {
        var status;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            success: function(e) {
                status = e.XMLHttpRequest.status;
            }
        });

        simulateRemove();

        setTimeout(function() {
            equal(status, "200");
            start();
        }, 100);
    });
}
