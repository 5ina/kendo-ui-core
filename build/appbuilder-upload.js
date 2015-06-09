#!/usr/bin/env node

var subProcess = require('child_process'),
    util = require('util'),
    path = require('path');

var everliveConfiguration = {
    url: 'http://api.everlive.com/v1',
    // apiKey: 'xtHQnSO9us8WwznQ',
    // masterKey: '1o71N1LipdrX9aqGpxeknUpjaXZbq5C1',
    apiKey: 'T1zJXvnrJFQYX22O',
    masterKey: 'I5ZgLrd5bgJyzrJHNggkPm4I8hykDZQ3',

    buildFilesUploadUrl: function () {
        return this._createApplicationUrl() + '/' + 'Files';
    },

    buildPackageCreateUrl: function () {
        return this._createApplicationUrl() + '/' + 'Package';
    },

    createAuthorizationHeader: function () {
        return util.format('Authorization: masterkey %s', this.masterKey);
    },

    _createApplicationUrl: function () {
        return this.url + '/' + this.apiKey;
    }
}

function parseCommandLineArgs() {
    var args = process.argv;

    return {
        name: args[2],
        version: args[3],
        packagePath: args[4],
        releaseNotesPath: args[5],
        verified: args[6],
        requiredFeatures: args.slice(7)
    };
}

var curlHelper = {
    createUploadRequest: function (packagePath, releaseNotesPath, uploadUrl, header) {
        return util.format('curl -s -F upload=@%s -F upload=@%s --form press=OK %s -H "%s"', packagePath, releaseNotesPath, uploadUrl, header);
    },
    createPostRequest: function (url, data, header) {
        var jsonData = JSON.stringify(data).replace(/"/g, '\\"');
        return util.format('curl -s -d "%s" -X POST %s -H "Content-Type: application/json" -H "%s"', jsonData, url, header);
    },

    execute: function (request, successCallback) {
        console.log("Executing: " + request);
        subProcess.exec(request, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
                throw new Error(error);
            }
            else {
                var response = JSON.parse(stdout);
                if(response && response.errorCode) {
                    throw new Error(response.message);
                }
                if (typeof successCallback === "function") {
                    successCallback(response.Result);
                }
            }
        });
    }
}

function extractUploadedFileIds(result) {
    var uploadedFilesIds = {};

    for (var i = 0; i < result.length; i++) {
        var item = result[i];

        if (item.Filename === path.basename(args.packagePath)) {
            uploadedFilesIds.packageId = item.Id;
        }
        else if (item.Filename === path.basename(args.releaseNotesPath)) {
            uploadedFilesIds.releaseNotesId = item.Id;
        }
    }

    if (!uploadedFilesIds.packageId) {
        throw new Error("Package upload failed.");
    }

    if (!uploadedFilesIds.releaseNotesId) {
        throw new Error("Release Notes upload failed.");
    }

    return uploadedFilesIds;
}

var args = parseCommandLineArgs();
var uploadRequest = curlHelper.createUploadRequest(args.packagePath, args.releaseNotesPath, everliveConfiguration.buildFilesUploadUrl(), everliveConfiguration.createAuthorizationHeader());

curlHelper.execute(uploadRequest, function (result) {
    var uploadedFilesIds = extractUploadedFileIds(result);

    var record = {
        Name: args.name,
        Version: args.version,
        Content: uploadedFilesIds.packageId,
        VersionTags: args.verified == "true" ? [ 'verified' ] : [],
        ReleaseNotes: uploadedFilesIds.releaseNotesId,
        RequiredFeatures: args.requiredFeatures
    };

    var createRecordRequest = curlHelper.createPostRequest(everliveConfiguration.buildPackageCreateUrl(), record, everliveConfiguration.createAuthorizationHeader());

    curlHelper.execute(createRecordRequest);
    console.log("Upload complete");
});
