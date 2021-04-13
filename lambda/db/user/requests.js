const request = require("request");
/*
const options = {
    uri: "https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource?userid=testid4&funcname=getUser"
};

//get방식
request.get(options, (error, response, body) => {
    console.log('get error:', error);
    console.log('get statusCode:', response && response.statusCode); 
    console.log('body:', body);
});
*/

const options = {
    uri: "https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource",
    method: "POST",
    body: {
        userid: "testid2",
        userpw: "123aaa123",
        useremail: "myemail@google",
        bojname: "baek"
    },
    json: true
};

request.post(options, (error, response, body) => {
    console.log('get error:', error);
    console.log('get statusCode:', response && response.statusCode); 
    console.log('body:', body);
});