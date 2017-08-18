'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

/**
 * Increment Counter Function
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    });

    // enter your tableName
    const tableName = "";
    const key = {'Id': 'Counter'};

    var body = {
        "TableName": tableName,
        "Key": key
    }

    switch (event.httpMethod) {
        case 'GET':
            // get count
            dynamo.getItem(body, done);
            break;
        case 'POST':
            // increment counter
            body.UpdateExpression = "set #key = #key + :value",
            body.ExpressionAttributeNames = {"#key": "Count"};
            body.ExpressionAttributeValues = {":value": 1};
            dynamo.updateItem(body, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
