function uploadCancel(createUpload) {
    test("cancel fired when clicking cancel", 1, function() {
        var uploadInstance = createUpload({ cancel:
            function(e) {
                ok(true);
            }
        });

        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");
    });

    test("cancel event arguments contain list of files", function() {
        var files = false;
        var uploadInstance = createUpload({ cancel:
            function(e) {
                files = e.files;
            }
        });

        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");

        assertSelectedFile(files);
    });

    test("cancelling an upload should fire complete event", 1, function() {
        var uploadInstance = createUpload({ complete:
            function(e) {
                ok(true);
            }
        });

        simulateFileSelect();
        $(".k-i-cancel", uploadInstance.wrapper).trigger("click");
    });
}