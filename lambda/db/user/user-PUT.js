//회원정보를 통으로 수정하는 곳에서 사용

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const params = {
        TableName: 'USER_LIST',
        Item: {
            "user_id": event.userid,
            "user_pw": event.userpw,
            "boj_name": event.bojname,
            "user_email": event.useremail,
            "user_level": event.userlevel,
            "user_rank": event.userrank,
            "user_status": event.userstatus,
            "active_group_set": event.activegroupset,
            "inactive_group_set": event.inactivegroupset,
            "created_at": event.created_at,
            "user_message": event.usermessage,
            "organization": event.organization,
            "solved_problems": event.solvedproblems,
            "homepage": event.homepage,
        }
    };

    dynamo.put(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            let failResponse = {
                "statusCode": 400,
                "headers": {"PUT":"fail"},
                "body": JSON.stringify({"message":"error occured when putting item"}),
                "isBase64Encoded": false
            };
            callback(null, failResponse);
        } else {
            console.log("Success", data);
            let responseBody = {"message": "putting item success"};
            let response = {
                "statusCode": 200,
                "headers": {
                    "PUT":"success",
                },
                "body": JSON.stringify(responseBody),
                "isBase64Encoded": false
            };
            callback(null, response);
        }
    });
};