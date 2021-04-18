var AWS = require('aws-sdk')

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
})

let response = {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "GET": "success",
    },
    "isBase64Encoded": false
};

let failResponse = {
    "statusCode": 400,
    "headers": {
        "GET": "fail"
    },
    "isBase64Encoded": false
};

const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event, context, callback) {
    console.log(event);
    var params = {
        TableName: "groupDataBase",
        Item: {
            "id": event.id,
            "leader": event.leader,
            "name": event.name,
            "numberOfMember": event.numberOfMember,
            "member": event.member,
            "rank": event.rank,
            "solvedQuestion": event.solvedQuestion,
            "weeklyQuestion": event.weeklyQuestion,
            "tag": event.tag,
            "group_status": event.group_status
        }
    };
    var AWS = require('aws-sdk')

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
})

let response = {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "GET": "success",
    },
    "isBase64Encoded": false
};

let failResponse = {
    "statusCode": 400,
    "headers": {
        "GET": "fail"
    },
    "isBase64Encoded": false
};

const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event, context, callback) {
    console.log(event);
    var params = {
        TableName: "groupDataBase",
        Item: {
            "id": event.id,
            "leader": event.leader,
            "name": event.name,
            "numberOfMember": event.numberOfMember,
            "member": [],
            "rank_member": event.rank_member,
            "rank": event.rank,
            "group_goal": event.group_goal,
            "group_attendance": event.group_attendance,
            "group_info": event.group_info,
            "max_member": event.max_member,
            "tag": event.tag,
            "group_status": event.group_status
        }
    };
    
    

    dynamo.put(params, function(err, data) {
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
    

    dynamo.put(params, function(err, data) {
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
