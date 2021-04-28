const axios = require("axios");

exports.handler = async (event) => {

  let USER_ENDPOINT = 'https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource';
  let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
  let DIFF_ENDPOINT = 'https://4f5hmhskte.execute-api.us-east-2.amazonaws.com/return_diff/';
  let group_id = event.id;
  let members_data, members_id;
  let rank_points = [];
  let probs_diff;
  // 먼저 그룹 내의 모든 인원들에 대한 정보를 받아온다.
  // 필요한 정보 : 멤버 id, 각 멤버별 attend_date(누적 출석일수), 누적 점수(score), attend_cycle(출석 갱신일)
  
  
  // 그룹 정보 가져오기
  const get_group_info = async () => {
    return axios
      .get(`${GROUP_ENDPOINT}?func=getGroup&id=${group_id}`)
      .then((res) => {
        members_data = res.data.Item.rank_member;
        members_id = Object.keys(members_data);
        for(let id of members_id){
          let attend_date = members_data[id].attend_date;
          let score = members_data[id].score;
          let temp = { id : id, score : (attend_date + score)}; // 나중에 attend_cycle 받아와서 attend_data에 곱해주기
          rank_points.push(temp);
        }
      });
  };
  
  const get_probs_diff = async (boj_id) => {
    return axios
    .post(`${DIFF_ENDPOINT}`,{ id : boj_id}).then((res) => {
      probs_diff = res.data.body;
    });
  };
  
  // 각 멤버별로 랭킹 점수를 산출
  const Get_rank_point = async() => {
    return new Promise (async (resolve, reject) => {
      let cnt = 0;
      for(let id of members_id){
        let boj_id = members_data[id].boj_id;
        await get_probs_diff(boj_id);
        let point = (probs_diff['Bronze']*10 + probs_diff['Silver']*50 + probs_diff['Gold']*100 
        + probs_diff['Platinum']*1000 + probs_diff['Diamond']*5000 + probs_diff['Ruby']*10000);
        rank_points[cnt].score += point;
        await Update_DB_score(rank_points[cnt].score, id);
        cnt++;
      }
      // 정렬 함수. 이때 점수 동일 시 id 사전순 정렬
      rank_points.sort(function(a,b){
        if(a.score < b.score) {
            return 1;}
        if(a.score > b.score) {
            return -1;}
        else{
            if(a.id < b.id) {
                return 1;}
            if(a.id > b.id) {
                return -1;}
        }
      });
      resolve(1);
    });
  };
  
  const Update_DB_score = async (score, update_id) => {
    return axios
      .patch(`${GROUP_ENDPOINT}`, {
        func : "updatePersonalScore",
        id : group_id,
        name : update_id,
        score : score
      });
  };
  
  // 정보를 정렬하여 반환
  async function main(){
    return new Promise(async (resolve, rejcect) => {
      await get_group_info();
      await Get_rank_point();
      resolve("Success!");
    });
  }
  
  await main();
  
  return{
    body : {
      rank_points
    }
  };
};
