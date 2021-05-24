// Load the AWS SDK for Node.js
let aws = require('aws-sdk');
// Set the region 
let ses = new aws.SES({ region: "us-east-2" });
// axios 모듈
let axios = require('axios');

exports.handler = async function (event) {
  
  // 사용 변수들
  let USER_ENDPOINT = `https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource`;
  let email;
  
  const GetUser = async() => {
    return await axios
      .get(`${USER_ENDPOINT}?userid=${event.id}&funcname=getUser`)
      .then((res) => {
        email = res.data.user_email;
        params.Destination.ToAddresses.push(email);
      });
  };
  
  // 메일의 형태
  let params = {
    Destination: {
      ToAddresses: [],
    },
    Message: {
      Body: {
        Text: { 
          Data: ``,
          Charset : "UTF-8" },
        Html : { 
          Data : ``,
          Charset : "UTF-8" },
      },

      Subject: { Data: "산학프로젝트 분석 보고서 메일링 서비스 테스트" }, 
    },
    Source: 'kimtaehyun98@naver.com',
  };
  
  let str =  `<!DOCTYPE html>
              <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>태현</title>
              </head>
              
              <body>
              <h1>그룹별 주간 분석보고서</h1>
              <p>그룹 이름 : "${event.name}"</p>
              <p>그룹 공지사항 : ${event.noti}</p>
              <p>해당 유저의 그룹 내 누적 출석 일수 : ${event.date}일</p>
              <p>해당 유저가 출석 문제중 해결하지 못한 문제들 : ${event.prob}</p>
              <p>해당 유저의 그룹 내 랭킹 : ${event.rank}등</p>
              </body>
              </html>`; 
  
  await GetUser();
  
  params.Message.Body.Html.Data = str;
  
  return ses.sendEmail(params).promise();
};
