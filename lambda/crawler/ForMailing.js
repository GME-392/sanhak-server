// 버전 1. 2021.5.21 테스트 중

const axios = require('axios');

let GROUP = `https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB`;
let BOJ = `https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user`;
let RANK = `https://ycwvl0727g.execute-api.us-east-2.amazonaws.com/backend_api/return-rank`;

let Group_Ids = [];
// 모든 그룹 정보 가져오기 (각 그룹의 id가 필요하기 때문)
const getAllgroup = async() =>{
  return await axios.get(`${GROUP}?id=1&func=getAllGroup`)
    .then((res) => {
      for(let group of res.data) Group_Ids.push(group.id); // 그룹 아이디들만 뽑아내기
    });
};

// 각 그룹을 돌며 그룹에 속해있는 인원들에게 분석보고서 메일 보내줌
const mailing = async() => {
  return new Promise(async(resolve, reject) => {
    // 보고서에 포함될 기본적인 내용들
    // 1. 누적 출석 일수
    // 2. group_noti (그룹 공지)
    // 3. 각 인원별로 문제집에서 출제된 문제들(solved) 중 안 푼 문제 보여주기
    // 4. 그룹 내 누적 랭킹 점수 및 등수 

    for(let id of Group_Ids){
      await axios.get(`${GROUP}?id=${id}&func=getGroup`)
        .then(async(res) => {

          let data = res.data.Item;
          let members_data = data.rank_member; // 그룹 내에 속해있는 멤버들의 정보를 담고 있는 객체
          let members = data.member; // 그룹 내에 속해있는 멤버들의 아이디
          let noti = data.group_noti; // 그룹 공지사항
          let problems = data.problems; // 그룹 문제집
          let myprobs; // 유저가 지금까지 푼 문제집
          let ranks; // 랭킹 

          // 4. 그룹 내 랭킹점수
          await axios.post(RANK, { id : id } )
          .then((res) => { 
            let temp = res.data.body;
            let cnt = 1;
            for(let i of temp) ranks[id] = cnt++; // 각 인원별 등수 저장
           });
          

          for(let memb of members){ // 각 멤버에 대하여 mailing 보내기
            // 1. 누적 출석 일수
            let attend_date = members_data[memb].attend_date;
            // 3. 각 인원별 그룹 문제집에서 출제된 문제 중 안 푼 문제
            // 먼저 유저가 푼 문제들 가져옴
            let notprob = []; // 안푼 문제들의 정보가 저장되어있는 집합
            await axios.post(BOJ, { id : members_data[memb].boj_id })
              .then((res) => { myprobs = res.data.body });
            // 문제집을 돌면서 solved라 표시되어있는 문제(즉 출석문제로 출제된 문제)를 유저가 풀었는지 확인
            for(let prob in problems){
              if(prob.solved === "true"){
                if(myprobs.indexOf(prob.number) === (-1)) notprob.push( { numb : prob.numb, name : prob.name } ); 
              }
            }
            // 이제 여기 부분에 mailing API를 호출하면 됨
            // 이때 mailing API의 본문은 아래와 같다. (즉 메일링 API에서 이렇게 쓰면 된다는 의미)
            // { date : attend_date, noti : noti, prob : notprobs, rank : ranks[memb]} 
          }
        })
    }
  })
}

const main = async() => {
  return new Promise(async(resolve, reject) => {
    await getAllgroup();
    await mailing();
  })
}

// main();

              
