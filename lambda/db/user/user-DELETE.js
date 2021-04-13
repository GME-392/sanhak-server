//DELETE하면 모든 데이터를 inactive db로 옮겨야 함
//삭제요청은 아이디와 비밀번호가 들어올 때 작동해야할 듯
//1.아이디가 존재해야하고, 2. 아이디와 비밀번호가 일치해야한다.

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

//응답 메시지의 성공 케이스를 선언하고 실패하는 경우 수정해서 응답하면 좋을 듯.

exports.handler = (event, context, callback) => {
    let userId = event ? event.userid : "default";
    let userPw = event ? event.userpw : "defalut";
    
    //id와 pw가 입력되지 않은 경우
    if (userId == "default" || userPw == "default" || userId == "" || userPw == "") {
        console.log("userId, userPw:", userId, userPw);
        let response = {
            "statusCode": 400,
            "headers": {"delete":"fail"},
            "body": JSON.stringify({"message":"missing content"}),
            "isBase64Encoded": false
        };
        callback(null, response);
        return;
    }

    //id가 없거나 pw가 틀리면 실패 메시지를 반환함
    const params = {
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
            let failResponse = {
                "statusCode": 400,
                "headers": {"delete":"fail"},
                "body": JSON.stringify({"message":"error occured when deleting item", "error":`${err}`}),
                "isBase64Encoded": false
            };
            callback(null, failResponse);
        } else {
            console.log("Success", data);
            //성공시에 inactive db로 옮기는 작업이 
            let responseBody = {"message": "deleting item success"};
            let response = {
                "statusCode": 200,
                "headers": {"delete":"success"},
                "body": JSON.stringify(responseBody),
                "isBase64Encoded": false
            };
            callback(null, response);
        }
    });
};