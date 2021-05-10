const axios = require('axios');

// 누적 출석 갱신 -> 출석 반영 개인 랭킹 갱신 -> 개인 랭킹 반영 그룹 랭킹 갱신


exports.handler = async (event) => {

  // endpoints
  let GROUP_ENDPOINT = `https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB`;
  let Three = `https://9zl6kjhghe.execute-api.us-east-2.amazonaws.com/backend_api/return-attendance`;
  let Five = `https://ycwvl0727g.execute-api.us-east-2.amazonaws.com/backend_api/return-rank`;
  let Seven = `https://g9eq7bmlgl.execute-api.us-east-2.amazonaws.com/backend_api/recommendprobs`;
  let Eight = `https://rg4a7gp98g.execute-api.us-east-2.amazonaws.com/backend_api/returngrouprank`;
  let GROUPID;
  let AllGroup;

  // 누적 출석 갱신 API (3번 API)
  const API_Three = async() => {
    return await axios
      .post(Three, { id : GROUPID });
  }; 

  // 출석 반영 개인 랭킹 갱신 API (5번 API)
  const API_Five = async() => {
    return await axios
      .post(Five, { id : GROUPID });
  };

  // 개인 랭킹 반영 그룹 랭킹 갱신 API (8번 API)
  const API_Eight = async() => {
    return await axios.get(Eight);
  };
  
  // 출석 문제 갱신 API (7번 API)
  const API_Seven = async() => {
    return await axios
      .post(Seven, { id : GROUPID });
  };
  
  
  const DO = async() => {
    return new Promise(async(resolve, reject) => {
      // 모든 그룹의 정보 받아와서 모든 그룹의 누적 출석 갱신, 개인 랭킹 갱신, 출석 문제 갱신 해줘야 함
      await axios
        .get(`${GROUP_ENDPOINT}?func=getAllGroup&id=1`)
        .then(async(res) => {
          return new Promise(async(resolve,reject) => {
            for(let group of res.data){
              console.log(group.id);
              GROUPID = group.id;
              await API_Three();
              await API_Five();
              await API_Seven();
            }
            resolve("1");
          });
          
        });
      resolve("1");
    });
  };
  
  const main = async() => {
    return new Promise(async(resolve, reject) => {
      await DO();
      await API_Eight();
      resolve("1");
    });
  };
  
  await main();
};
