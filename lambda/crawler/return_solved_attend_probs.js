const axios = require("axios");

exports.handler = async (event) => {
  
  let USER_ENDPOINT = 'https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource';
  let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
  let group_id = event.id;
  let members_data, members_id;
  let attend_probs = [];
  let solved_probs = [];
  let ret = {};
  

  // 그룹 정보 가져오기
  const get_group_info = async () => {
    return axios
      .get(`${GROUP_ENDPOINT}?func=getGroup&id=${group_id}`)
      .then((res) => {
        attend_probs = res.data.Item.group_attendance.probs;
        members_data = res.data.Item.rank_member;
        members_id = Object.keys(members_data);
      });
  };
  
  // 현재 해결한 문제들 가져옴 (DB에서 가져오기)
  const get_solved_probs = async (member) => {
    return axios.get(`${USER_ENDPOINT}?funcname=getSolved&userid=${member}`).then((res) => {
      solved_probs = res.data;
    });
  };
  
  const Check_probs = async() => {
    return new Promise (async(resolve, reject) => {
      for(let id of members_id){
        await get_solved_probs(id);
        let temp = [];
        attend_probs.forEach((item) => {
          if (solved_probs.indexOf(item) != -1) {
            temp.push(item);
          }
        });
        ret[id] = temp;
      }
      resolve("1111");
    }
  )};

  async function main() {
     return new Promise(async (resolve, reject) => {
      await get_group_info();
      await Check_probs();
      resolve("1111");
     })
  }

  await main();
  
  return {
    statusCode : 200,
    body : ret
  }
};

