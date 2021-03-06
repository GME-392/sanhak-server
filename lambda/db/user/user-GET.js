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
    let userId = event.queryStringParameters.userid ? event.queryStringParameters.userid : "";
    let funcName = event.queryStringParameters.funcname ? event.queryStringParameters.funcname : "";
    let groupId = event.queryStringParameters.groupid ? event.queryStringParameters.groupid : "";
    
    switch (funcName) {
        case 'getUser':
            getUser(userId, callback);
            break;
        
        case 'isAvailableID':
            isAvailableID(userId, callback);
            break;
            
        case 'getAllUsers':
            getAllUsers(callback);
            break;
            
        case 'getSolved':
            getSolved(userId, callback);
            break;
            
        case 'getGroupById':
            getGroupById(userId, groupId, callback);
            break;
            
        case 'getDirectMessages':
            getDirectMessages(userId, callback);
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
            let active = [];
            for(let i in data.Item.active_group_set) {
                let element = data.Item.active_group_set[i];
                element["group_id"] = i;
                active.push(element);
            }
            let inactive = [];
            for(let i in data.Item.inactive_group_set) {
                let element = data.Item.inactive_group_set[i];
                element["group_id"] = i;
                inactive.push(element);
            }
            
            let responseBody = {
                "user_id": `${data.Item.user_id}`,
                "boj_name": `${data.Item.boj_name}`,
                "user_email": `${data.Item.user_email}`,
                "active_group_set": active,
                "inactive_group_set": inactive,
                "user_level": `${data.Item.user_level}`,
                "user_rank": `${data.Item.user_rank}`,
                "created_at": `${data.Item.created_at}`,
                "user_status": `${data.Item.user_status}`,
                "user_message": `${data.Item.user_message}`,
                "organization": `${data.Item.organization}`,
                "solved_problems": `${data.Item.solved_problems}`,
                "homepage": `${data.Item.homepage}`,
                "direct_messages": `${data.Item.direct_messages}`,
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

//푼 문제들 가져오기
function getSolved(userId, callback) {
    console.log("getSolved in function");
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getSolved Error", err);
            failResponse.body = JSON.stringify({"message": `when getting solved_problems an error has occured, error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("getSolved Success", data);
            response.body = JSON.stringify(data.Item.solved_problems);
            callback(null, response);
        }
    });
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

//group_id로 그룹데이터 가져오기
function getGroupById(userId, groupId, callback) {
    if (groupId == "") {
        failResponse.body = JSON.stringify({"message": "groupId is empty"});
        callback(null, failResponse);
    }
    
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
        ProjectionExpression: "active_group_set.#gid, user_id",
        ExpressionAttributeNames: {"#gid": groupId},
    };
    dynamo.scan(params, function(err, data) {
        if (err) {
            console.log("getGroupById Error", err);
            failResponse.body = JSON.stringify({"message": `getGroupById has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("getGroupById Success", data);
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
}

//projectionExpression으로는 user_id가 다른 여러 데이터에서 원하는 요소만 쏙 뽑아올 수 있다.
//예를 들어 특정 그룹에 속한 유저의 그룹데이터를 가져오면 그 그룹에 가입하지 않으면 빈데이터, 가입했으면 데이터가 있다.

//direct messages값 반환
function getDirectMessages(userId, callback) {
    console.log("getDirectMessages in function");
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getDirectMessages Error", err);
            failResponse.body = JSON.stringify({"message": `getting direct_messages: ${userId} is failed`});
            callback(null, failResponse);
        } else {
            console.log("getDirectMessages Success", data);
            let messages = data.Item.direct_messages;
            let send  = [];
            let receive = [];
            for(let item of messages) {
                if (item["from"] == userId) {
                    send.push(item);
                } else {
                    receive.push(item);
                }
            }
            
            let responseBody = {
                "sended_messages": send,
                "received_messages": receive,
            };
            response.body = JSON.stringify(responseBody);
            callback(null, response);
        }
    });
}