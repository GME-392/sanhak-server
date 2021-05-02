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
            "group_member": ,
            "rank_group": null,
            "group_goal": {},
            "group_attendance": {"attendance_cycle": 7,"probs":[]},
            "group_info": event.group_info,
            "max_member": event.max_member,
            "tag": event.tag,
            "group_status": null,
            "group_noti": null,
            "group_type": event.group_type,
            "problems": []
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

