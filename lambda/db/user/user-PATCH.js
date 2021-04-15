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
    let userId = event.userid ? event.userid : "default";
    let funcName = event.funcname ? event.funcname : "default";
    let problems = event.problems ? event.problems : "default";
    let groupName = event.groupname ? event.groupname : "defualt";
    let groupRequest = event.grouprequest ? event.grouprequest : "default";
    let message = event.message ? event.message : "default";
    let organization = event.organization ? event.organization : "";
    let homepage = event.homepage ? event.homepage : "";
     
    if (funcName == "default" || funcName == "") {
        failResponse.body = JSON.stringify({"message":"missing content"});
        callback(null, failResponse);
        return;
    }
    
    switch (funcName) {
        case 'initializeProblems':
            initializeProblems(userId, problems, callback);
            break;
        
        case 'updateProblems':
            updateProblems(userId, problems, callback);
            break;
            
        case 'addProblems':
            addProblems(userId, groupName, problems, callback);
            break;
            
        case 'updateMessage':
            updateMessage(userId, message, callback);
            break;
            
        case 'updateOrganization':
            updateOrganization(userId, organization, callback);
            break;
            
        case 'updateSolved':
            updateSolved(userId, problems, callback);
            break;
            
        case 'updateHomepage':
            updateHomepage(userId, homepage, callback);
            break;
            
        default:
            console.log("default_function");
            failResponse.body = JSON.stringify({"message": "thers is no appropriate function name"});
            callback(null, failResponse);
    }
};

//Action에는 ADD, PUT, DELETE 3가지가 있다.
//크롤러에서 유저 문제 셋 초기화
function initializeProblems(userId, problems, callback) {
    let group_set = {};
    group_set["group_auth"] = false;
    group_set["rank"] = -1;
    
    for(let i of problems) {
        group_set[i] = {
            "due_date": "default",
            "solved": true,
            "s_date": "default"
        };
    }
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "inactive_group_set": {
                Action: "PUT",
                Value: {"initialization": group_set},
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("initializeProblem Error", err);
            failResponse.body = JSON.stringify({"message": `initializeProblem has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("initializeProblem Success", data, group_set);
            response.body = JSON.stringify({"message": "problem is initialized"});
            callback(null, response);
        }
    });
}

//문제를 추가? 문제를 수정? 문제 삭제?
//일단은 여기서 get을 하고 문제를 업데이트해서 다시 집어넣는다.
//차후에는 get함수로 따로 옮기고 람다호출로 받아오도록 하자.
//active group에 있는 그룹을 찾아 문제 업데이트
function updateProblems(userId, problems, callback) {
    
    let params = {
        Key: {
            user_id: userId,
        },
        TableName: 'ACTIVE_USER',
    };
    let myData = {};
    //update에 파라미터를 줘서 하려고 했지만 실패했기 때문에
    //임시 방편으로 구현한 것. 차후에 수정해야함.
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("getUser Error", err);
            failResponse.body = JSON.stringify({"message": `getting userid: ${userId} is failed`});
            callback(null, failResponse);
        } else {
            console.log("getUser Success", data);
            myData = data.Item.inactive_group_set;
            response.body = JSON.stringify(myData);
            for(let i in myData) {
                console.log("myData !!!!! ", myData[`${i}`]);
                for(let k in problems) {
                    console.log("myData kkkk ", k);
                    if (myData[`${i}`][problems[k]] != undefined) {
                        myData[`${i}`][problems[k]]["solved"] = false;
                    }
                }
            }
            
            params = {
                TableName: 'ACTIVE_USER',
                Key: {
                    user_id: userId,
                },
                AttributeUpdates: {
                      "inactive_group_set": {
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
    
    
    params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId,
        },
        AttributeUpdates: {
              "inactive_group_set": {
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

function addProblems(userId, groupName, problems, callback) {
    let group_set = {};
    group_set["group_auth"] = false;
    group_set["rank"] = -1;
    
    for(let i of problems) {
        group_set[i] = {
            "due_date": "default",
            "solved": true,
            "s_date": "default"
        };
    }
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "inactive_group_set": {
                Action: "ADD",
                Value: {"initialization": group_set},
            }
        }
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("initializeProblem Error", err);
            failResponse.body = JSON.stringify({"message": `initializeProblem has error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("initializeProblem Success", data, group_set);
            response.body = JSON.stringify({"message": "problem is initialized"});
            callback(null, response);
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

//문제가 겹치지 않게 할 필요가 있다.
//임시 땜빵해야할 
function updateSolved(userId, problems, callback) {
    let v = [];
    for(let i of problems) {
        v[problems[i]] = i;
    }
    
    const params = {
        TableName: 'ACTIVE_USER',
        Key: {
            user_id: userId
        },
        AttributeUpdates: {
            "solved_problems": {
                Action: "ADD",
                Value: problems
            }
        },
    };
    
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("updateSolved Error", err);
            failResponse.body = JSON.stringify({"message": `updateSolved has an error: ${err}`});
            callback(null, failResponse);
            
        } else {
            console.log("updateSolved Success", data);
            response.body = JSON.stringify({"message": "updateSolved is changed"});
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
            "organization": {
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