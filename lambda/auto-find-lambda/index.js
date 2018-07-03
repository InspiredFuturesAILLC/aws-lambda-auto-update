const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = (event, context, callback) => {
    console.log('New event recieved');
    var s3Resource = {
        bucket: event.Records[0].s3.bucket.name,
        key: event.Records[0].s3.object.key
    };
    event.functionFound = false;
    console.log('listing functions');
    lambda.listFunctions({
        Marker: event.token,
        MaxItems: 1
    }, (err, functionsData) => {
        console.log('List functions completed');
        if(err) {
            console.log('An error occured while retrieving lambda functions: ' + err);
            callback(err);
            return;
        }

        if(functionsData.Functions.length == 0) {
            console.log('No functions found');
            event.marker = '';
            callback(null, event);
            return;
        }

        console.log('List functions has one');
        event.token = functionsData.NextMarker;
        var func = functionsData.Functions[0];
        console.log('Getting function details ' + func.FunctionName);
        lambda.getFunction({
            FunctionName: func.FunctionName
        }, (err, data) => {
            console.log('getFunctions returned');
            if(err) {
                console.error(`An error occured while getting the function ${func.FunctionName}: ${err}`);
                callback('Could not get function ' + func.FunctionName);
                return;
            }

            console.log('getFunctions got the details');
            if(data.Tags && data.Tags.S3Bucket == s3Resource.bucket && data.Tags.S3Key == s3Resource.key){
                event.targetFunction = data.FunctionName;
                event.functionFound = true;
                callback(null, event);
            } else {
                callback(null, event);
            }
        });
    });
};