//DELETE하면 모든 데이터를 inactive db로 옮겨야 함
//삭제요청은 아이디와 비밀번호가 들어올 때 작동해야할 듯
//1.아이디가 존재해야하고, 2. 아이디와 비밀번호가 일치해야한다.

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

let response = {
    "statusCode": 200,
    "headers": {
        "DELETE": "success",
    },
    "isBase64Encoded": false
};

let failResponse = {
    "statusCode": 400,
    "headers": {
        "DELETE": "fail",
    },
    "isBase64Encoded": false
};

//응답 메시지의 성공 케이스를 선언하고 실패하는 경우 수정해서 응답하면 좋을 듯.
exports.handler = (event, context, callback) => {
    let userId = event ? event.userid : "default";
    let userPw = event ? event.userpw : "defalut";
    
    //id와 pw가 입력되지 않은 경우
    if (userId == "default" || userPw == "default" || userId == "" || userPw == "") {
        console.log("userId, userPw:", userId, userPw);
        failResponse.body = JSON.stringify({"message":"missing content"});
        callback(null, failResponse);
        return;
    }
    
    transferUserData(userId, userPw, callback);
};

//userData를 inactive그룹으로 옮김
function transferUserData(userId, userPw, callback) {
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    let userData;
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getUserData Error", err);
            failResponse.body = JSON.stringify({"message": `getting userid: ${userId} is failed`});
            callback(null, failResponse);
        } else {
            userData = {
                
            };
            
            params = {
                TableName: 'INACTIVE_USER',
                Item: {
                    "user_id": data.Item.user_id,
                    "boj_name": data.Item.boj_name,
                    "user_email": data.Item.user_email,
                    "active_group_set": data.Item.active_group_set,
                    "inactive_group_set": data.Item.inactive_group_set,
                    "user_level": data.Item.user_level,
                    "user_rank": data.Item.user_rank,
                    "created_at": `${data.Item.created_at}`,
                    "user_status": false,
                    "user_message": `${data.Item.user_message}`,
                    "organization": `${data.Item.organization}`,
                    "solved_problems": data.Item.solved_problems,
                    "homepage": `${data.Item.homepage}`,
                },
            };
            dynamo.put(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    failResponse.body = JSON.stringify({"message":"error occured when putting item", "data": userData});
                    callback(null, failResponse);
                } else {
                    console.log("Success", data);
                    response.body = JSON.stringify({"message": "get, delete, post item success", "data": data});
                }
            });
        }
    });
    
    params = {
        Key: {
            user_id: userId
        },
        TableName: 'ACTIVE_USER',
        Expected: {
            user_id: {
                Value: userId,
                Exist: true,
            },
            user_pw: {
                Value: userPw,
                Exist: true
            }
        },
    };
    dynamo.delete(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message":"error occured when deleting item", "error":`${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success", data);
            callback(null, response);
        }
    });
}