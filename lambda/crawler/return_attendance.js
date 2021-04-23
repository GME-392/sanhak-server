const axios = require('axios');

// exports.handler = async (event, context, callback) => {

//     return {
//         statusCode : 200,
//         body : ret
//     } 
// };


// 변수들
let attend_probs = []; // 오늘의 출석 문제들, GROUP DB에서 받아와야 함
let solved_probs = []; // 멤버가 지금까지 푼 모든 문제들을 저장하고 있는 배열
let members_data; // 해당 그룹 멤버들 정보
let members_id; // 그룹에 속한 멤버들의 id
let group_id = 1;  // 이건 front로 부터 받아오기 (event.id)
let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
let BOJ_CRAWL_ENDPOINT = `https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user`;
let check; // 출석 정보
let update_id; // update할 id

// 그룹 정보 가져오기
const get_group_info = async() => {
  await axios
  .get(`${GROUP_ENDPOINT}?func=getGroup&id=${group_id}`)
  .then((res) => {
    attend_probs = res.data.Item.group_attendance.probs;
    members_data = res.data.Item.rank_member;
    members_id = Object.keys(members_data);
    console.log(members_id);
    console.log(attend_probs);
    console.log("get_group_info 함수 끝났음!!");
  })
}


// 그룹 내의 모든 인원들을 반복하며 출석 체크 해야 함
const Check_attend = async() => {
  members_id.forEach(async(item) => {
      boj_id = members_data[item].boj_id;
      await get_solved_probs(boj_id);
      console.log("solved_probs 받아왔음!!");
      // 출석 여부 확인
      check = "Absent";
      let cnt = 0;
      attend_probs.forEach((item) => {
        console.log(item);
        if(solved_probs.indexOf(item) != -1){ cnt++; }
      })
      if(cnt == attend_probs.length) check = "Present";
      console.log(check);
      update_id = item;
      console.log("이제 출석 확인 끝남!!");
    })
}

// 현재 해결한 문제들 가져옴 (현재는 크롤링, DB에서 가져와도 되긴 함)
const get_solved_probs = async(member) => {
  await axios
    .post(BOJ_CRAWL_ENDPOINT, {id : member})
    .then((res) => {
      solved_probs = res.data.body;
  })
}

// 해당 유저의 Group DB 내의 출석 여부를 갱신
const Update_Attendance = async() => {
  await axios
    .patch(`${GROUP_ENDPOINT}`, {func : "updateAttendance", id : group_id, name : update_id, attend : check})
    .then((res) => { console.log(`Success!!`); console.log(update_id, check); })
}

async function main() {
  await get_group_info();
  await Check_attend();
  await Update_Attendance();
}

main();
