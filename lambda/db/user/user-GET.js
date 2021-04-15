//필요기능들
//user id체크하여 있는지 없는지 반환 
//로그인 할 때 password값이 유효한지 체크.
//특정 user id에서 비밀번호를 제외한 값 가져오기
//header에 사용할 함수와 id를 받자.
//암호화 프로토콜이 필요해보인다: 프론트에서 처리가능이라고 함
//해당 유저의 문제만 끌어오는 함수도 필요
//모든 유저데이터를 보내는 함수도 필요
//차후에는 헤더에 x-api-key 속성에 키값을 넣어야 작동하게 할것.

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

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
    
//event에서 값을 받아오는 것은 proxy통합을 사용해야 가능하다.
//null은 들어오지 않을 것이라 가정하자.
exports.handler = (event, context, callback) => {
    let userId = event.queryStringParameters ? event.queryStringParameters.userid : "default";
    let funcName = event.queryStringParameters ? event.queryStringParameters.funcname : "default";
    
    //id와 pw가 입력되지 않은 경우
    if (userId == "default" || funcName == "default" || userId == "" || funcName == "") {
        console.log("userId, funcName:", userId, funcName);
        failResponse.body = JSON.stringify({"message":"missing content - id, function name"});
        callback(null, failResponse);
        return;
    }
    
    switch (funcName) {
        case 'getUser':
            getUser(userId, callback);
            break;
        
        case 'isAvailableID':
            isAvailableID(userId, callback);
            break;
            
        case 'isLogginable':
            
            break;
            
        case 'getUserProblems':
            
            break;
            
        case 'getAllUsers':
            getAllUsers(callback);
            break;
            
        case 'getSolved':
            getSolved(userId, callback);
            break;
            
        default:
            console.log("default_function");
            failResponse.body = JSON.stringify({"message": "thers is no appropriate function name"});
            callback(null, failResponse);
    }
};

//id에 따라 pw제외한 모든 데이터 가져오기
function getUser(userId, callback) {
    console.log("getUser in function");
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getUser Error", err);
            failResponse.body = JSON.stringify({"message": `getting userid: ${userId} is failed`});
            callback(null, failResponse);
        } else {
            console.log("getUser Success", data);
            let responseBody = {
                "user_id": `${data.Item.user_id}`,
                "boj_name": `${data.Item.boj_name}`,
                "user_email": `${data.Item.user_email}`,
                "active_group_set": `${data.Item.active_group_set}`,
                "inactive_group_set": `${data.Item.inactive_group_set}`,
                "user_level": `${data.Item.user_level}`,
                "user_rank": `${data.Item.user_rank}`,
                "created_at": `${data.Item.created_at}`,
                "user_status": `${data.Item.user_status}`,
                "user_message": `${data.Item.user_message}`,
                "organization": `${data.Item.organization}`,
                "solved_problems": `${data.Item.solved_problems}`,
                "homepage": `${data.Item.homepage}`,
            };
            response.body = JSON.stringify(responseBody);
            callback(null, response);
        }
    });
}

//회원가능한 id인지 확인
function isAvailableID(userId, callback) {
    console.log("isAvailableID in function");
    let params = {
        TableName: 'ACTIVE_USER',
        AttributesToGet: ['user_id'],
        Select: 'SPECIFIC_ATTRIBUTES'
    };
    dynamo.scan(params, function(err, data) {
        if (err) {
            console.log("isAvailableID Error", err);
            failResponse.body = JSON.stringify({"message": `isAvailableID has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("isAvailableID Success", data);
            response.body = JSON.stringify({"message": "this userId is available", "result": "TRUE"});
            callback(null, response);
        }
    });
}

//id와 pw가 유효한지 확인
function isLogginable(userId, password, callback) {
    
}

//유저의 문제만 가져오기
function getUserProblems(userId) {
    
}

//푼 문제들 가져오기
function getSolved() {
    
}

//모든 유저데이터를 가져오기
function getAllUsers(callback) {
    console.log("getAllUsers in function");
    let params = {
        TableName: 'ACTIVE_USER',
        Select: 'ALL_ATTRIBUTES'
    };
    dynamo.scan(params, function(err, data) {
        if (err) {
            console.log("getAllUsers Error", err);
            failResponse.body = JSON.stringify({"message": `when getting all users an error has occured, error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("getAllUsers Success", data);
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
}
