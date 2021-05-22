//값 일부만 변경
//user_id값(필수요소)과 변경할 변수들을 가져와서 바꾼다.
//problem의 값 갱신을 위한 함수
//크롤러가 회원가입 이전의 푼 문제들을 가져오면 inactive group set에 업데이트
//이후에 그룹 가입 후에는 active group set중 맞는 group에서 값 업데이트/이후에 그룹 가입 후에는 active group set중 맞는 group에서 값 업데이트
//문제 초기화 함수가 필요. 문제 업데이트 함수도 필요
//나중에는 groupDB에서 변경사항이 생기면 group구성원의 userid와 problem을 userDB로 보내면 업데이트 시켜야한다.
//그룹에서 탈퇴하거나 강퇴당하면 group data가 inactive로 옮겨짐

let AWS = require('aws-sdk');

AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
});

const dynamo = new AWS.DynamoDB.DocumentClient();

let response = {
    "statusCode": 200,
    "headers": {
        "PATCH": "success",
    },
    "isBase64Encoded": false
};

let failResponse = {
    "statusCode": 400,
    "headers": {
        "PATCH": "fail"
    },
    "isBase64Encoded": false
};

exports.handler = (event, context, callback) => {
    let userId = event.userid ? event.userid : "";
    let funcName = event.funcname ? event.funcname : "";
    let problems = event.problems ? event.problems : [];
    let grouprank = event.grouprank ? event.grouprank : -1;
    let groupName = event.groupname ? event.groupname : "defualt";
    let groupId = event.groupid ? event.groupid : "";
    let message = event.message ? event.message : "default";
    let organization = event.organization ? event.organization : "";
    let homepage = event.homepage ? event.homepage : "";
    let isMaster = event.ismaster ? event.ismaster : true;
    let emailAccept = event.emailaccept ? event.emailaccept : false;
    let msgId = event.msgid ? event.msgid : "";
    let msgTo = event.msgto ? event.msgto : "";
    let msgFrom = event.msgfrom ? event.msgfrom : "";
    let msgContent = event.msgcontent ? event.msgcontent : "";
    let msgCreatedAt = event.msgcreatedat ? event.msgcreatedat : 0;
     
    if (userId == "" || funcName == "") {
        failResponse.body = JSON.stringify({"message":"missing content", "userid":`${userId}`, "funcname": `${funcName}`});
        callback(null, failResponse);
        return;
    }
    
    switch (funcName) {
        case 'updateProblems':
            updateProblems(userId, callback);
            break;
            
        case 'updateMessage':
            updateMessage(userId, message, callback);
            break;
            
        case 'updateOrganization':
            updateOrganization(userId, organization, callback);
            break;
            
        case 'updateHomepage':
            updateHomepage(userId, homepage, callback);
            break;
            
        case 'updateGroupRank':
            updateGroupRank(userId, groupId, grouprank, callback);
            break;
        
        case 'updateSolved':
            updateSolved(userId, problems, callback);
            break;
            
        case 'updateEmailAccept':
            updateEmailAccept(userId, emailAccept, callback);
            break;
            
        case 'addGroup':
            addGroup(userId, groupName, groupId, isMaster, callback);
            break;
            
        case 'addGroupProblems':
            addGroupProblems(userId, groupId, problems, callback);
            break;
            
        case 'createDirectMessage':
            createDirectMessage(userId, msgId, msgFrom, msgTo, msgContent, msgCreatedAt, callback);
            break;
            
        case 'deleteDirectMessage':
            deleteDirectMessage(userId, msgId, callback);
            break;
            
        case 'deleteGroup':
            deleteGroup(userId, groupId, callback);
            break;
            
        case 'deleteGroupProblems':
            deleteGroupProblems(userId, groupId, problems, callback);
            break;
            
        default:
            console.log("default_function");
            failResponse.body = JSON.stringify({"message": "thers is no appropriate function name"});
            callback(null, failResponse);
    }
};

//문제를 추가? 문제를 수정? 문제 삭제?
//일단은 여기서 get을 하고 문제를 업데이트해서 다시 집어넣는다.
//차후에는 get함수로 따로 옮기고 람다호출로 받아오도록 하자.
//active group에 있는 그룹을 찾아 문제 업데이트
function updateProblems(userId, callback) {
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    let myData = {};
    //update에 파라미터를 줘서 하려고 했지만 실패했기 때문에
    //임시 방편으로 구현한 것. 차후에 수정해야함.
    //get에서 그룹 명을 받아오고 그
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getUser Error", err);
            failResponse.body = JSON.stringify({"message": `getting userid: ${userId} is failed`});
            callback(null, failResponse);
        } else {
            console.log("getUser Success", data);
            myData = data.Item.active_group_set;
            let problems = data.Item.solved_problems;
            response.body = JSON.stringify(myData);
            for(let i in myData) {
                console.log("myData !!!!! ", myData[`${i}`]);
                for(let k in problems) {
                    console.log("myData kkkk ", k);
                    if (myData[`${i}`][problems[k]] != undefined) {
                        myData[`${i}`][problems[k]]["solved"] = true;
                    }
                }
            }
            
            params = {
                TableName: 'ACTIVE_USER',
                Key: {
                    user_id: userId,
                },
                AttributeUpdates: {
                      "active_group_set": {
                          Action: "PUT",
                          Value: myData,
                      }
                },
            };
            
            dynamo.update(params, function(err, data) {
                if (err) {
                    console.log("updateProblem Error", err);
                    failResponse.body = JSON.stringify({"message": `updateProblem has error: ${err}`});
                    callback(null, failResponse);
                    
                } else {
                    console.log("updateProblem Success", data);
                    response.body = JSON.stringify({"message": "problem is updated", "..":`${myData}`});
                    callback(null, response);
                }
            });
            
        }
    });
}

//user_message 수정 함수
function updateMessage(userId, message, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "user_message": {
                Action: "PUT",
                Value: message
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("message Error", err);
            failResponse.body = JSON.stringify({"message": `changing message has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("message Success", data);
            response.body = JSON.stringify({"message": "user_message is changed"});
            callback(null, response);
        }
    });
}

//organization 수정 함수
function updateOrganization(userId, organization, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "organization": {
                Action: "PUT",
                Value: organization
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("organization Error", err);
            failResponse.body = JSON.stringify({"message": `changing organization has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("organization Success", data);
            response.body = JSON.stringify({"message": "organization is changed"});
            callback(null, response);
        }
    });
}

//homepage update
function updateHomepage(userId, homepage, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "homepage": {
                Action: "PUT",
                Value: homepage
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("updateHomepage Error", err);
            failResponse.body = JSON.stringify({"message": `changing homepage has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("updateHomepage Success", data);
            response.body = JSON.stringify({"message": "homepage is changed"});
            callback(null, response);
        }
    });
}

//group내에서 랭크 업데이트
function updateGroupRank(userId, groupId, rank, callback) {
    if (groupId == "") {
        failResponse.body = JSON.stringify({"message": "groupid is undefined"});
        callback(null, failResponse);
    }
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        UpdateExpression: 'set active_group_set.#k1.#k2 = :v1',
        ExpressionAttributeNames: {
            "#k1": groupId,
            "#k2": "rank"
        },
        ExpressionAttributeValues: {":v1": rank}
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("updateGroupRank Error", err);
            failResponse.body = JSON.stringify({"message": `updateGroupRank has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("updateGroupRank Success", data);
            response.body = JSON.stringify({"message": "group rank is added"});
            callback(null, response);
        }
    });
}


//문제를 추가해준다.
function updateSolved(userId, problems, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        AttributeUpdates: {
              "solved_problems": {
                  Action: "PUT",
                  Value: problems,
              }
        },
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("addProblem Error", err);
            failResponse.body = JSON.stringify({"message": `addProblem has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("addProblem Success", data);
            response.body = JSON.stringify({"message": "problem is added"});
            callback(null, response);
        }
    });
}

//email_accept항목 수정
function updateEmailAccept(userId, emailAccept, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "email_accept": {
                Action: "PUT",
                Value: emailAccept
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("updateEmailAccept Error", err);
            failResponse.body = JSON.stringify({"message": `changing email_accept has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("updateEmailAccept Success", data);
            response.body = JSON.stringify({"message": "email_accept is changed"});
            callback(null, response);
        }
    });
}

//그룹을 추가해주는 함수
function addGroup(userId, groupName , groupId, isMaster, callback) {
    if (groupId == "") {
        failResponse.body = JSON.stringify({"message": "groupid is undefined"});
        callback(null, failResponse);
    }
    
    //inactive group set에 저장되어 있으면 복원, 아니면 새로 만듬
    let group = {};
    group["group_auth"] = isMaster;
    group["rank"] = -1;
    group["group_name"] = groupName;
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        UpdateExpression: 'set active_group_set.#k1 = if_not_exists( active_group_set.#k1 , if_not_exists( inactive_group_set.#k1, :v1) ) remove inactive_group_set.#k1',
        ExpressionAttributeNames: {"#k1": groupId},
        ExpressionAttributeValues: {":v1": group}
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("addGroup Error", err);
            failResponse.body = JSON.stringify({"message": `addGroup has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("addGroup Success", data);
            response.body = JSON.stringify({"message": "group is added"});
            callback(null, response);
        }
    });
}

//그룹에 문제를 추가해주는 함수 문제들은 기본적으로 solved: false 상태
//그룹에 권한이 있는 사람만 변경할 수 있게 하는 것은 프론트와 상의 해봐야할 듯.
function addGroupProblems(userId, groupId, problems, callback) {
    const p_form = {
        "due_date": "default",
        "solved": false,
        "s_date": "default"
    };
    
    let updateExpression='set';
    let expressionAttributeNames={"#k1": groupId};

    for (const property of problems) {
        updateExpression += ` active_group_set.#k1.#p${property} = if_not_exists( active_group_set.#k1.#p${property}, :v1) ,`;
        expressionAttributeNames['#p'+property] = property ;
    }
    updateExpression = updateExpression.slice(0, -1);
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: {":v1": p_form}
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("addGroupProblems Error", err);
            failResponse.body = JSON.stringify({"message": `addGroupProblems has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("addGroupProblems Success", data);
            response.body = JSON.stringify({"message": "group_problem is added"});
            callback(null, response);
        }
    });
}

//direct message를 만들고 보냄
function createDirectMessage(userId, msgId, msgFrom, msgTo, msgContent, msgCreatedAt, callback) {
    if (msgId == "" || msgFrom == "" || msgTo == "") {
        failResponse.body = JSON.stringify({"message": "createDirectMessage is failed"});
        callback(null, failResponse);
    }
    
    let msgFormat = {
        "id": msgId,
        "from": msgFrom,
        "to": msgTo,
        "content": msgContent,
        "created_at": msgCreatedAt,
    };
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "direct_messages": {
                Action: "ADD",
                Value: [msgFormat]
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("createDirectMessage Error", err);
            failResponse.body = JSON.stringify({"message": `createDirectMessage has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("createDirectMessage Success", data);
            response.body = JSON.stringify({"message": "createDirectMessage is successful"});
            callback(null, response);
        }
    });
}

//msgid에 해당하는 값 삭제
function deleteDirectMessage(userId, msgId, callback) {
    if (msgId == "") {
        failResponse.body = JSON.stringify({"message": "deleteDirectMessage is failed"});
        callback(null, failResponse);
    }
    const params1 = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        }
    };
    dynamo.get(params1, function(err, data) {
        if (err) {
            console.log("getUser Error", err);
            failResponse.body = JSON.stringify({"message": `getUser has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("getUser Success", data);
            
            let updateExpression = "";
            let messages = data.Item.direct_messages;
            for (const index in messages) {
                if (messages[index]["id"] == msgId) {
                    updateExpression = `remove direct_messages[${index}]`;
                    break;
                }
            }
            if (updateExpression == "") {
                failResponse.body = JSON.stringify({"message": "object of msgid doesn't exist"});
                callback(null, failResponse);
            }
            
            const params2 = {
                TableName: 'ACTIVE_USER',
                Key: {
                    user_id: userId,
                },
                UpdateExpression: updateExpression,
            };
            
            dynamo.update(params2, function(err, data) {
                if (err) {
                    console.log("deleteDirectMessage Error", err);
                    failResponse.body = JSON.stringify({"message": `deleteDirectMessage has error: ${err}`});
                    callback(null, failResponse);
                    
                } else {
                    console.log("deleteDirectMessage Success", data);
                    response.body = JSON.stringify({"message": "DirectMessage is deleted"});
                    callback(null, response);
                }
            });
            
            callback(null, response);
        }
    });
}

//active group set에서 inactive로
function deleteGroup(userId, groupId, callback) {
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        UpdateExpression: 'set inactive_group_set.#k1 = active_group_set.#k1 remove active_group_set.#k1',
        ExpressionAttributeNames: {"#k1": groupId},
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("deleteGroup Error", err);
            failResponse.body = JSON.stringify({"message": `deleteGroup has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("deleteGroup Success", data);
            response.body = JSON.stringify({"message": "group is deleted"});
            callback(null, response);
        }
    });
}

//그룹장의 권한체크는 생각해 봐야할 듯.
//그룹에서 문제들을 제거
function deleteGroupProblems(userId, groupId, problems, callback) {
    let updateExpression='remove';
    let expressionAttributeNames={"#k1": groupId};

    for (const property of problems) {
        updateExpression += ` active_group_set.#k1.#p${property},`;
        expressionAttributeNames['#p'+property] = property ;
    }
    updateExpression = updateExpression.slice(0, -1);
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("deleteGroupProblems Error", err);
            failResponse.body = JSON.stringify({"message": `deleteGroupProblems has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("deleteGroupProblems Success", data);
            response.body = JSON.stringify({"message": "group_problem is deleted"});
            callback(null, response);
        }
    });
}