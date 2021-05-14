// 2021.5.13 현재 AWS Sendbox 환경을 탈출하여 미인증된 메일로 메일 보내는 것 성공. User DB에 접근하여 정보 가지고 와서 메일 보내는 테스트 코드임. 



// Load the AWS SDK for Node.js
let aws = require('aws-sdk');
// Set the region 
let ses = new aws.SES({ region: "us-east-2" });
// axios 모듈
let axios = require('axios');

exports.handler = async function (event) {
  
  // 사용 변수들
  let USER_ENDPOINT = `https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource`;
  let user_data;
  
  // 메일의 형태
  let params = {
    Destination: {
      ToAddresses: ['kimtaehyun981107@gmail.com'],
    },
    Message: {
      Body: {
        Text: { Data: '' },
      },

      Subject: { Data: "산학프로젝트 분석 보고서 메일링 서비스 테스트" },
    },
    Source: 'kimtaehyun98@naver.com',
  };
  
  // 분석 내용
  // 먼저 user에 대한 정보를 가져와야함
  const GetUser = async() => {
    return await axios
      .get(`${USER_ENDPOINT}?userid=${event.id}&funcname=getUser`)
      .then((res) => {
        user_data = res.data;
      });
  };
  
  await GetUser();
  let str = `
  분석 내용은 여기에 들어가면 될듯. 아래는 예시임 (실제 DB의 내용임)
  해당 유저가 가입해 있는 그룹의 수 : ${user_data['active_group_set'].length}
  `;
  
  params.Message.Body.Text.Data = str;
  
  return ses.sendEmail(params).promise();
};
