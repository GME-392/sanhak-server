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

//uri: "https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource"
//"x-api-key" :"vUJiHfh1OrapaFbbDY9xabWdR9FycrVpiroebh00"

// const options = {
//     uri: "https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource",
//     method: "POST",
//     body: {
//         userid: "testid2",
//         userpw: "123aaa123",
//         useremail: "myemail@google",
//         bojname: "baek"
//     },
//     json: true
// };

// request.post(options, (error, response, body) => {
//     console.log('get error:', error);
//     console.log('get statusCode:', response && response.statusCode); 
//     console.log('body:', body);
// });

//테스트용
const options = {
    uri: "https://m72biz7595.execute-api.ap-northeast-2.amazonaws.com/test/test2",
    method: "PATCH",
    headers: {myauth: "allow"},
    body: {
        userid: "t1",
        funcname: "updateSolved",
        problems: ['1000','100','1002','3']
    },
    json: true
};

request.patch(options, (error, response, body) => {
    console.log('get error:', error);
    console.log('get statusCode:', response && response.statusCode);
    //console.log("reponse:", response);
    console.log('body:', body);
});

// const options = {
//     uri: "https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource",
//     method: "PATCH",
//     body: {
//         userid: "t1",
//         funcname: "updateSolved",
//         problems: ['1000','100','1002','1006']
//     },
//     json: true
// };

// request.patch(options, (error, response, body) => {
//     console.log('get error:', error);
//     console.log('get statusCode:', response && response.statusCode); 
//     console.log('body:', body);
// });