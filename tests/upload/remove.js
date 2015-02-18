function uploadRemoveEvent(params) {
    var createUpload = params.createUpload;
    var simulateUpload = params.simulateUpload;
    var simulateRemove = params.simulateRemove;

    test("remove fired when clicking remove", function() {
        var removeFired = false;
        var uploadInstance = createUpload({ remove:
            function(e) {
                removeFired = true;
            }
        });

        simulateUpload();
        simulateRemove();

        ok(removeFired);
    });

    test("remove event arguments contain list of files", function() {
        var files = false;
        var uploadInstance = createUpload({ remove:
            function(e) {
                files = e.files;
            }
        });

        simulateUpload();
        simulateRemove();

        assertSelectedFile(files);
    });

    test("user data set in remove event is sent to server", 1, function() {
        var uploadInstance = createUpload({ remove:
            function(e) {
                e.data = { id: 1 };
            }
        });

        simulateUpload();

        $.mockjax(function(s) {
            equal(s.data.id, 1);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("remove HTTP verb can be changed", 1, function() {
        var uploadInstance = createUpload();
        uploadInstance.options.async.removeVerb = "DELETE";

        simulateUpload();

        $.mockjax(function(s) {
            equal(s.type, "DELETE");
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("remove field is fileNames", 1, function() {
        var uploadInstance = createUpload();

        simulateUpload();

        $.mockjax(function(s) {
            deepEqual(s.data["fileNames"], [ "first.txt" ]);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("remove field can be changed", 1, function() {
        var uploadInstance = createUpload();
        uploadInstance.options.async.removeField = "fileNames[]";

        simulateUpload();

        $.mockjax(function(s) {
            deepEqual(s.data["fileNames[]"], [ "first.txt" ]);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("cancelling remove aborts remove operation", function() {
        var uploadInstance = createUpload({ remove:
            function(e) {
                e.preventDefault();
            }
        });

        var removeCalled = false;
        uploadInstance._submitRemove = function(data, onSuccess) {
            removeCalled = true;
        };

        simulateUpload();
        simulateRemove();

        ok(!removeCalled);
    });

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    //Remove tests for multiple false
    test("remove event is fired for first file, when selecting a second one", function(){
        var removeFired = false;
        var uploadInstance = createUpload({
            remove: function(e) {
                removeFired = true;
            },
            multiple: false
        });

        simulateUpload();
        simulateFileSelect();

        ok(removeFired);
    });

    test("previous file is not removed if the remove event is prevented", function(){
        var removeFired = false;
        var uploadInstance = createUpload({
            remove: function(e) {
                e.preventDefault();
            },
            multiple: false
        });

        simulateUpload();
        simulateFileSelect();

        equal($(".k-file", uploadInstance.wrapper).length, 2);
    });

    test("user data set in remove event is sent to server when removing previous file", 1, function() {
        var uploadInstance = createUpload({ remove:
            function(e) {
                e.data = { id: 1 };
            }
        });

        simulateUpload();

        $.mockjax(function(s) {
            equal(s.data.id, 1);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemove();
    });

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    //Remove tests for initial files
    test("remove is fired when clicking remove on initially rendered file", function(){
        var removeFired = false;
        var uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ], 
            remove: function(e) {
                removeFired = true;
            }
        });

        simulateRemove();

        ok(removeFired);
    });

    test("remove event arguments contain list of files when removing initially rendered file", function() {
        var files = false;
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            remove: function(e) {
                files = e.files;
                delete files[0].uid;
            }
        });

        simulateRemove();

        deepEqual(files, [ { name: "test.doc", extension: ".doc", size: 50 } ]);
    });

    test("remove HTTP verb can be changed when removing initially rendered file", 1, function() {
        var uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ]
        });
        uploadInstance.options.async.removeVerb = "DELETE";

        $.mockjax(function(s) {
            equal(s.type, "DELETE");
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("remove field is fileNames for initially rendered files", 1, function() {
        var uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ]
        });

        $.mockjax(function(s) {
            deepEqual(s.data["fileNames"], [ "test.doc" ]);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("remove field can be changed for initially rendered files", 1, function() {
        var uploadInstance = createUpload({
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ]
        });
        uploadInstance.options.async.removeField = "fileNames[]";

        $.mockjax(function(s) {
            deepEqual(s.data["fileNames[]"], [ "test.doc" ]);
            return {
                url: "/removeAction",
                responseTime: 0,
                responseText: ""
            };
        });

        simulateRemoveClick();
    });

    test("cancelling remove aborts remove operation for initially rendered files", function() {
        var uploadInstance = createUpload({ 
            files: [
                { name: "test.doc", size: 50, extension: ".doc"}
            ],
            remove: function(e) {
                e.preventDefault();
            }
        });

        var removeCalled = false;
        uploadInstance._submitRemove = function(data, onSuccess) {
            removeCalled = true;
        };

        simulateRemove();

        ok(!removeCalled);
    });
}