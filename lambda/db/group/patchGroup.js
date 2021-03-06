var AWS = require('aws-sdk');
// Set the region
AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: "http://dynamodb.ap-northeast-2.amazonaws.com"
})
// Create the DynamoDB service object
const dynamo = new AWS.DynamoDB.DocumentClient();

var response = {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "GET": "success",
    },
    "isBase64Encoded": false
};

var failResponse = {
    "statusCode": 400,
    "headers": {
        "GET": "fail"
    },
    "isBase64Encoded": false
};

exports.handler = function(event, context, callback) {
    var func = event.func
    var id = event.id;
    var probs = event.probs;
    var rank_Group = event.rank_Group;
    var attendance = event.attendance;
    var cycle = event.cycle;
    var new_member = event.new_member;
    var name = event.name;
    var score = event.score;
    var prob_num = event.prob_num;
    var group_type = event.group_type;
    var prob_level = event.prob_level;
    var group_noti = event.group_noti;
    var rank_member = {};
    var boj_id = event.boj_id;
    var attend_date = event.attend_date;
    var problems = event.problems;

    switch (func) {
        case 'updateAttendanceProblems':
            updateAttendanceProblems(id, probs, callback);
            break;
            
        case 'updateProblems':
            updateProblems(id, problems, callback);
            break;
        
        case 'updateCycle':
            updateCycle(id, cycle, callback);
            break;
        
        case 'updateGroupType':
            updateGroupType(id, group_type, callback);
            break;
        
        case 'updateProblemNumber':
            updateProblemNumber(id, prob_num, callback);
            break;
    
        case 'updateGroupRank':
            updateGroupRank(id, rank_Group, callback);
            break;
    
        case 'updateGroupNotice':
            updateGroupNotice(id, group_noti, callback);
            break;
        
        case 'updateAttendance':
            updateAttendance(id, name, attendance, callback);
            break;
        
        case 'updateAttendDate':
            updateAttendDate(id, name, attend_date, callback);
            break;
        
        case 'updatePersonalScore':
            updatePersonalScore(id, name, score, callback);
            break;
        
        case 'updateProblemLevel':
            updateProblemLevel(id, prob_level, callback);
            break;
        
        case 'addMember':
            addMember(id, new_member, callback);
            break;
        
        case 'addRankMember':
            rank_member[new_member] = {"boj_id": boj_id, "score":0, "attendance":"absent", "attend_date":0};
            addRankMember(id, rank_member, callback);
            break;
        
        case 'deleteMember':
            deleteMember(id, name, callback);
            break;
        
        case 'deleteRankMember':
            deleteRankMember(id, name, callback);
            break;
    }
}


function updateProblems(id, problems, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "problems": {
                "Action": "PUT",
                "Value": problems
            }
        }
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } 
        else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function updateAttendanceProblems(id, probs, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET group_attendance.probs = :probs",
        ExpressionAttributeValues: {":probs": probs}
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } 
        else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function updateCycle(id, cycle, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
    },
        UpdateExpression: "SET group_attendance.attendance_cycle = :cycle",
        ExpressionAttributeValues: {":cycle": cycle}
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateProblemNumber(id, prob_num, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET group_goal.prob_num = :prob_num",
        ExpressionAttributeValues: {":prob_num": prob_num}

    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateGroupType(id, group_type, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "group_type": {
                "Action": "PUT",
                "Value": group_type
            }
        }
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateProblemLevel(id, prob_level, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET group_goal.prob_level = :prob_level",
        ExpressionAttributeValues: {":prob_level": prob_level}

    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateGroupRank(id, rank_Group, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "rank_group": {
                "Action": "PUT",
                "Value": rank_Group
            }
        }            
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } 
        else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateGroupNotice(id, group_noti, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "group_noti": {
                "Action": "PUT",
                "Value": group_noti
            }
        }            
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}

function updateAttendance(id, name, attendance, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET rank_member.#name.attendance = :attendance",
        ExpressionAttributeNames: {"#name": name},
        ExpressionAttributeValues: {":attendance": attendance}
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function updateAttendDate(id, name, attend_date, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET rank_member.#name.attend_date = :attend_date",
        ExpressionAttributeNames: {"#name": name},
        ExpressionAttributeValues: {":attend_date": attend_date}
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function updatePersonalScore(id, name, score, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET rank_member.#name.score = :score",
        ExpressionAttributeNames: {"#name": name},
        ExpressionAttributeValues: {":score": score}
    };

    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function addMember(id, new_member, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "member": {
                "Action": "ADD",
                "Value": new_member
            }
        }
    };
    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}
function addRankMember(id, rank_member, callback){
    var rank_db = {};
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        }
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            rank_db = data.Item.rank_member;
            Object.assign(rank_db,rank_member);
       
            var params = {
                TableName: 'groupDataBase',
                Key: {
                    "id": id
                    
                },
                UpdateExpression: "SET rank_member = :ranking",
                ExpressionAttributeValues: {":ranking": rank_db}
                
            };
            
            dynamo.update(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    failResponse.body = JSON.stringify({"message": `has error: ${err}`});
                    callback(null, failResponse);
                    
                } else {
                    console.log("Success");
                    callback(null, response);
                    
                }
                
            });
            
        }
        
    });
    
    
}
function deleteMember(id, name, callback){
    var member_db = [];
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        }
    };
    dynamo.get(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            response.body = JSON.stringify(data);
            member_db = data.Item.member;
            member_db = member_db.filter(member_db => member_db != name);
       
            var params = {
                TableName: 'groupDataBase',
                Key: {
                    "id": id
                    
                },
                AttributeUpdates: {
                    "member": {
                        "Action": "PUT",
                        "Value": member_db
                    }
                }
                
            };
            
            dynamo.update(params, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    failResponse.body = JSON.stringify({"message": `has error: ${err}`});
                    callback(null, failResponse);
                    
                } else {
                    console.log("Success");
                    callback(null, response);
                    
                }
                
            });
            
        }
        
    });

}
function deleteRankMember(id, name, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "REMOVE rank_member.#name",
        ExpressionAttributeNames: {"#name": name}
    };

    dynamo.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            failResponse.body = JSON.stringify({"message": `has error: ${err}`});
            callback(null, failResponse);
        } else {
            console.log("Success");
            callback(null, response);
        }
    });
}
