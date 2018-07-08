const AWS = require('aws-sdk');
const step = new AWS.StepFunctions();
const uuid = require('uuid');

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log('Step function arn: ' + process.env.stepFunctionArn);
    step.startExecution({
        stateMachineArn: process.env.stepFunctionArn,
        input: JSON.stringify(event),
        name: uuid()
    }, (err, data) => {
        console.log('Start execute finished');
        if(err) {
            console.error(`Could not invoke step function ${err}`);
            callback(err);
            return;
        }

        console.log('Step function started successfully');
        callback();
    });
};
