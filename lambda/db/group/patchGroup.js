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
    var func = event.func;
    var id = event.id;
    var probs = event.probs;
    var member = event.member;
    var baj_id = event.baj_id;
    var sum = event.sum;
    var rank = event.rank;
    var attendance = event.attendance;
    var cycle =  event.cycle;
    var prob_num = event.prob_num;
    var prob_level = event.prob_level;
    var number_member = event.number_member;
    var rank = event.rank;
    var new_member = event.new_member;
    var number = event.number;var AWS = require('aws-sdk');



    switch (func) {
        case 'updateProblems':
            updateProblems(id, probs, callback);
            break;
        
        case 'updateCycle':
            updateCycle(id, cycle, callback);
            break;
        
        case 'updateProblemNumber':
            updateProblemNumber(id, callback);
            break;
       
        case 'updateNumberMember':
            updateNumberMember(id, number_member, callback);
            break;
       
        case 'updateGroupRank':
            updateGroupRank(id, rank, callback);
            break;
        
        case 'updateAttendance':
            updateAttendance(id, name, attend, callback);
            break;
        
        case 'addMember':
            addMember(id, new_member, callback);
            break;
        
        case 'addRankMember':
            addRankMember(id, callback);
            break;
        
        case 'deleteMember':
            deleteMember(id, callback);
            break;
        
        case 'deleteRankMember':
            deleteRankMember(id, callback);
            break;
        
    }
}

function updateProblems(id, probs, callback){
    let probs_obj = {};
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        }
    };
    
}
function updateCycle(id, cycle, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "cycle": {
                "Action": "PUT",
                "Value": cycle
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
function updateProblemNumber(id, callback){
    
}
function updateGroupRank(id, rank, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "rank": {
                "Action": "PUT",
                "Value": rank
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
            console.log("Success", data);
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
}
function addRankMember(id, callback){
    
}
function deleteMember(id, callback){
    
}
function deleteRankMember(id, callback){
    
}
function updateNumberMember(id,number_member,callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "number_member": {
                "Action": "PUT",
                "Value": number_member
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
function updateAttendance(id, name, attend, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        UpdateExpression: "SET rank_member.#name.attendance = :attend",
        ExpressionAttributeNames: {"#name": name},
        ExpressionAttributeValues: {":attend": attend}
            
    };
    
    dynamo.update(params, function(err, data) {
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
 
function updateProblems(id, probs, callback){
        
}
function updateCycle(id, cycle, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "cycle": {
                "Action": "PUT",
                "Value": cycle
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
function updateProblemNumber(id, callback){
    
}
function updateGroupRank(id, rank, callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "rank": {
                "Action": "PUT",
                "Value": rank
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
            console.log("Success", data);
            response.body = JSON.stringify(data);
            callback(null, response);
        }
    });
}
function addRankMember(id, callback){
    
}
function deleteMember(id, callback){
    
}
function deleteRankMember(id, callback){
    
}
function updateNumberMember(id,number_member,callback){
    var params = {
        TableName: 'groupDataBase',
        Key: {
            "id": id
        },
        AttributeUpdates: {
            "number_member": {
                "Action": "PUT",
                "Value": number_member
            }

        }
            
    };
    dynamo.update(params, function(err, data) {
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
