//처음에 넣을 때 쓰는 함수
//모든 데이터를 받아서 한번에 처리해준다.
//예측으로는 ID, PW, bojName, email이 4가지만 들어온다.

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    let userId = event ? event.userid : "default";
    let userPw = event ? event.userpw : "default";
    let bojName = event ? event.bojname : "default";
    let userEmail = event ? event.useremail : "default";
    
    if (userId == "default" || userPw == "default" || bojName == "default" || userEmail == "default"
    || userId =="" || userPw == "" || bojName == "" || userEmail == "") {
        console.log("userId, userPw, bojName, userEmail: ", userId, userPw, bojName, userEmail);
        let response = {
            "statusCode": 400,
            "headers": {"post":"fail"},
            "body": JSON.stringify({"message":"missing content"}),
            "isBase64Encoded": false
        };
        callback(null, response);
        return;
    }

    //db의 새로운 구조
    //active_group_set은 배열이 아니라 그룹명을 키로, 내용을 값으로
    //problem도 배열이 아닌 문제번호를 키값으로 내용을 값으로..
    let group_set = {};
    group_set["group_auth"] = false;
    group_set["rank"] = -1;
    group_set[-1] = {
        "due_date": "default",
        "solved": false,
        "s_date": "default"
    };
    
    
    const params = {
        TableName: 'ACTIVE_USER',
        Item: {
            "user_id": userId,
            "user_pw": userPw,
            "boj_name": bojName,
            "user_email": userEmail,
            "user_level": 0,
            "user_rank": -1,
            "user_status": true,
            "active_group_set": {"default": group_set},
            "inactive_group_set": {"default": group_set},
            "created_at": `${new Date()}`,
            "user_message": "",
            "organization": "",
            "solved_problems": [],
            "homepage": "",
        }
    };
    
    dynamo.put(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            let failResponse = {
                "statusCode": 400,
                "headers": {"post":"fail"},
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
                    "post":"success",
                },
                "body": JSON.stringify(responseBody),
                "isBase64Encoded": false
            };
            callback(null, response);
        }
    });
};