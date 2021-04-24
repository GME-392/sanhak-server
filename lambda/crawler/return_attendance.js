const axios = require("axios");


exports.handler = async (event, context, callback) => {

  // 사용 변수들
  let attend_probs = []; // 오늘의 출석 문제들, GROUP DB에서 받아와야 함
  let solved_probs = []; // 멤버가 지금까지 푼 모든 문제들을 저장하고 있는 배열
  let members_data; // 해당 그룹 멤버들 정보
  let members_id; // 그룹에 속한 멤버들의 id
  let group_id = event.id; // 이건 front로 부터 받아오기 (event.id)
  let GROUP_ENDPOINT = "https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB";
  let BOJ_CRAWL_ENDPOINT = `https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user`;
  let USER_ENDPOINT = 'https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource';
  let boj_id; // update할 id

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

  // 그룹 내의 모든 인원들을 반복하며 출석 체크 해야 함
  const Check_attend = async () => {
    return new Promise((resolve, reject) => {
      async function loop(){
        for(let member of members_id){
          await get_solved_probs(member);
          // 출석 여부 확인
          let check = "Absent";
          let cnt = 0;
          attend_probs.forEach((item) => {
            if (solved_probs.indexOf(item) != -1) {
              cnt++;
            }
          });
        if (cnt === attend_probs.length) check = "Present";
        await Update_Attendance(check, member);
      }
    }
    loop();
    });
  };

  // 해당 유저의 Group DB 내의 출석 여부를 갱신
  const Update_Attendance = async (check, update_id) => {
    return axios
      .patch(`${GROUP_ENDPOINT}`, {
        func : "updateAttendance",
        id : group_id,
        name : update_id,
        attendance : check
      });
  };

  async function main() {
    await get_group_info();
    await Check_attend();
  }

  await main();
  
  callback();
};
