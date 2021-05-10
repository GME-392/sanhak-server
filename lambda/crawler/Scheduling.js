const axios = require('axios');

// 누적 출석 갱신 -> 출석 반영 개인 랭킹 갱신 -> 개인 랭킹 반영 그룹 랭킹 갱신 -> 출석 문제 갱신


exports.handler = async (event) => {

  // endpoints
  let Three = `https://9zl6kjhghe.execute-api.us-east-2.amazonaws.com/backend_api/return-attendance`;
  let Five = `https://ycwvl0727g.execute-api.us-east-2.amazonaws.com/backend_api/return-rank`;
  let Seven = `https://g9eq7bmlgl.execute-api.us-east-2.amazonaws.com/backend_api/recommendprobs`;
  let Eight = `https://rg4a7gp98g.execute-api.us-east-2.amazonaws.com/backend_api/returngrouprank`;
  let GROUPID = event.id;

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
  
  
  await API_Three();
  await API_Five();
  await API_Eight();
  await API_Seven();
};
