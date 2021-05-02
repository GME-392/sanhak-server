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
    var func = event.func;
    var infoName = event.infoName;
    var date = event.date;
    var link = event.link;
    

    switch (func) {
        case 'updateDate':
            updateDate(infoName, date, callback);
            break;
        
        case 'updateLink':
            updateLink(infoName, link, callback);
            break;
    }
}

function updateDate(infoName, date, callback){
    var params = {
        TableName: 'noticeDB',
        Key: {
            "infoName": infoName
        },
        AttributeUpdates: {
            "date": {
                "Action": "PUT",
                "Value": date
            }

        }
    };
    dynamo.update(params, function(err, data) {
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
function updateLink(infoName, link, callback){
    var params = {
        TableName: 'noticeDB',
        Key: {
            "infoName": infoName
        },
        AttributeUpdates: {
            "link": {
                "Action": "PUT",
                "Value": link
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
