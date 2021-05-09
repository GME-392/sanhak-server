// 이 코드는 그룹 DB의 Problems 항목에 선별된 문제들이 들어가 있다고 가정하고 작성한 코드입니다.
// 그룹의 목표에 따라 문제가 추천되는 방식이 다릅니다.
// 1. 그룹의 목표가 코딩 테스트, 또는 대회일때 -> 세부 태그(삼성, 카카오, ICPC 등등)의 문제집을 크롤링 해서 넣어줌
// 2. 그룹의 목표가 학습(공부)라면 -> 세부 태그들()

const axios = require('axios');


exports.handler = async(event) => {
  
  // 사용 변수들
  let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
  let GROUPID = event.id; // API로 바꿀 때 event.id로 바꾸기
  let Probs, Goal;
  let ret = [];
  // 1. 그룹 DB로부터 선별된 문제들, 출석 문제 개수 가져오기 
  
  const GetProblems = async() => {
    return await axios
      .get(`${GROUP_ENDPOINT}?func=getGroup&id=${GROUPID}`)
      .then((res) => {
        Probs = res.data.Item.problems;
        Goal = res.data.Item.group_goal;
      });
  };
  
  // 2. 랜덤으로 문제 추출
  
  // 랜덤으로 (min, max) 범위 내의 정수를 생성하는 함수
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
  }
  
  const RandomProbs = async() => {
    return new Promise((resolve, reject) => {
      let t = Goal.prob_num; let cnt = 0;
      while(1){
        let index = getRandomInt(0,Probs.length);
        if(Probs[index].solved === "false") {
          cnt++;
          ret.push(Probs[index]);
          Probs[index].solved = "true";
        }
        if(cnt === t) break;
      }
      resolve("Success");
    });
  };
  
  // 3. solved가 갱신된 배열을 GROUP DB에 갱신
  const pushprobstoDB = async(probs) => {
    return await axios
    .patch(GROUP_ENDPOINT, { func : "updateProblems", id : GROUPID, problems : probs });
  };
  
  const UpdateAttendaceProbs = async(probs) => {
    return await axios
      .patch(GROUP_ENDPOINT, {func : "updateAttendanceProblems", id : GROUPID, probs : probs}); 
  };
  
  async function main(){
    await GetProblems();
    await RandomProbs();
    console.log(ret);
    await UpdateAttendaceProbs(ret);
    await pushprobstoDB(Probs);
  }
  
  await main();
  
  return {
    ret
  };
};
