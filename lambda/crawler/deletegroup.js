const axios = require('axios');

// 1. 넘겨져오는 인자 : (groupID), 그룹멤버 id 전체가 들어있는 (members), 그룹 이름(name)

// 2. 각 member별로 for문 돌면서

// 3. deleteGroup(유저) API 호출, 그룹 해체 메일 보내주기

// 4. 그룹 해체

exports.handler = async(event) => {
  let members = event.members; // 강퇴할 멤버들의 id가 담겨있는 배열
  let groupID = event.groupID; // 그룹 ID
  let GROUP = `https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB`;
  let USER = `https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource`;
  let MAIL = `https://4bm4z56bgg.execute-api.us-east-2.amazonaws.com/backend_api/mailing`;

  for(let member of members){
    // 유저 DB의 delteGroup API 호출
    await axios.patch(USER, {userid : member, funcname : "deleteGroup", groupid : groupID});
    // 그룹이 해체되었다고 메일 보내주기
    await axios.post(MAIL, {name : event.name, flag : "4", id : member});
  }
  
  // 그룹 해체
  await axios.delete(GROUP, {data : {id : groupID}});

};
