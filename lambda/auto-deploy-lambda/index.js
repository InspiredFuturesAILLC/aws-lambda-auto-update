const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    console.log('New event recieved');
    var s3Resource = {
        bucket: event.Records[0].s3.bucket.name,
        key: event.Records[0].s3.object.key
    };

    s3.getObject({
        Bucket: s3Resource.bucket,
        Key: s3Resource.key
    }, (err, data) => {
        if(err) {
            console.error('Could not get s3 resource: ' + err);
            callback(err);
            return;
        }
        console.log('S3 object retrieved');
        lambda.updateFunctionCode({
            FunctionName: event.targetFunction,
            S3Bucket: s3Resource.BucketName,
            S3Key: s3Resource.Key,
            Publish: true,
            DryRun: false,
            ZipFile: data.Body
        }, (err, data) => {
            if(err) {
                console.error(`Could not update function ${event.FunctionName}: ${err}`);
                callback(err);
                return;
            }
    
            console.log('Update function code completed successfully');
            console.log(JSON.stringify(data));
            callback(null, event);
        });
    });
    
};