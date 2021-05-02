var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
})
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB.DocumentClient();

var response = {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "GET": "success",
    },
    "isBase64Encoded": false
};

var failResponse = {
    "statusCode": 400,
    "headers": {
        "GET": "fail"
    },
    "isBase64Encoded": false
};


exports.handler = function(event, context, callback) {
    var infoName = event.queryStringParameters.infoName;
    var func = event.queryStringParameters.func;

    switch (func) {
        case 'getNotice':
            getNotice(infoName, callback);
            break;
        
        case 'getAllNotice':
            getAllNotice(callback);
            break;
        
    }
};

function getNotice(infoName, callback){
    var params = {
        TableName: 'noticeDB',
        Key: {
            "infoName": infoName            
        }
        
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success", data);
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
}
function getAllNotice(callback){
    var params = {
        TableName: 'noticeDB',
        Select: 'ALL_ATTRIBUTES'
    };
    dynamo.scan(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success", data);
            response.body = JSON.stringify(data.Items);
            callback(null, response);
        }
    });
}
