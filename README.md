# aws-lambda-auto-update
This solution allows a lambda function to automatically update when a new zip file is added to an S3 bucket.

# Build solution
In windows open powershell and run "build.ps1".  Upload files in the output folder to your S3 bucket.

# Deploy solution
1. Create a new cloudformation template.
2. Either point to your build of the solution in your s3 bucket or use the following url
```
https://s3-us-west-2.amazonaws.com/inspiredfuturesai-utilities/lambda-auto-deploy/cloudformation.json
```
3. If using your own bucket update the bucket name and path, otherwise leave the defaults
4. Finish deploying the cloudformation template

# Add autodeploy to your project
1. Run the cloudformation.bucketevent.json cloudformation script to create bucket permissions for the lambda function
```
https://s3-us-west-2.amazonaws.com/inspiredfuturesai-utilities/lambda-auto-deploy/cloudformation.bucketevent.json
```
2. Add an event to your project's s3 bucket
    1. Name: lambda-auto-deploy
    2. Events: Put
    3. Prefix: *Leave Empty*
    4. Suffix: .zip
    5. Send To: Lambda Function
    6. Lambda: *Your Auto Deploy Stack Name*-s3-hook
    7. Click Save
3. Add the following tags to your lambda functions
    1. S3Bucket: *The name of the s3 bucket where your code lives*
    2. S3Key: *The full path to your code zip file*

