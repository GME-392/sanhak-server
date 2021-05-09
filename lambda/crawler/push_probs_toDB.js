// 이 코드는 백준 문제집의 문제들을 [문제번호, 제목, 난이도] 형태로 크롤링 해 group_DB에 저장하는 코드입니다.
// 이 코드는 그룹 생성시 사용하면 됩니다. 즉 이 코드(API로 만들 예정)를 실행시 그룹에서 설정한 태그, 목표, 난이도를 바탕으로 문제집에서 가져와 그룹 DB의 Problems에 넣고 사용할 예정입니다.
// 2021.4.30 버전 1 : 현재 TEST_URL 지정시 해당 문제집의 모든 문제를 가져와 GROUP_DB에 UPDATE / 개선해야 할 사항 : 태그와 난이도를 프론트로부터 입력받고 해당 문제 선별하여 집어넣기
// 2021.5.4 버전 2 : 그룹의 목표와 세부 태그, 난이도를 입력받고 해당하는 문제집을 크롤링해서 DB 갱신해주기
// 2021.5.9 버전 3 : 프론트에서 문제집 전체를 보여주고 싶다는 요청이 있어서 각 문제마다 solved property를 추가했음

const axios = require('axios')
const cheerio = require('cheerio')

exports.handler = async (event) => {
  
  let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
  let Gid = event.id; // API 배포시 event.id로 갱신
  // 문제집 번호들
  let bruteforce = ['7770','7771','7772'], backtracking = ['7773'], greedy = ['7767', '7768', '7769'],  bfsdfs = ['7754', '7755', '7760'], datastruct = ['7750', '7751', '7752'];
  let dp = ['7738', '7739', '7740'], simul = ['7741', '7742', '7743'], basicimplement = ['6198'];
  let pq = ['7753'],  binarysearch = ['7747'],  hash = ['7745'], twopointer = ['7744'], tree = ['7761'], phasesort = ['7765'], dijkstra = ['7761'], string = ['7774', '7775', '7776'];
  let CONTEST = {ICPC : '7773', USACO : '7702', KOI : '7701'};
  // 각 목표에 따른 문제집 
  let test = { samsung : ['7700'], kakao : bruteforce.concat(backtracking, greedy, bfsdfs, datastruct, dp, pq, binarysearch, hash, twopointer, tree, dijkstra, string),
              naver : datastruct.concat(bruteforce, dp, hash, binarysearch, string), line : bruteforce.concat(datastruct, string, dp, greedy),
              nc : bruteforce.concat(datastruct, string, hash), coupang : bruteforce.concat(hash, bfsdfs, dp), 
              lguplus : bruteforce.concat(datastruct), lgcns : bruteforce.concat(datastruct, simul, phasesort, binarysearch)};
  let study = { bruteforce, backtracking, greedy, bfsdfs, datastruct, dp, simul, pq, binarysearch, hash, twopointer, tree, phasesort, dijkstra, string, basicimplement};
  let probhasdiff = ['bruteforce', 'greedy', 'bfsdfs', 'datastruct', 'dp', 'simul', 'string'];
  
  let probs = []; 
  let diff = event.diff; // event.diff로 초기화 하기.
  
  
  const get_nn = async(URL) => {
    return await axios
      .get(URL)
      .then((res) => {
        const $ = cheerio.load(res.data);
        $('tbody>tr').each(async(index,item) => {
          let numb = $(item).find('td:nth-child(1)').text(); // 문제 번호
          let name = $(item).find('td:nth-child(2)').text(); // 문제 이름
          let temp = { numb : numb, name : name, solved : "false"};
          probs.push(temp);
        });
      });
  };
  
  const pushprobstoDB = async(probs) => {
    return await axios
    .patch(GROUP_ENDPOINT, { func : "updateProblems", id : Gid, problems : probs });
  };
  
  
  async function main(){
    return new Promise(async(resolve, reject) => {
      let tags = event.arr;
      let goal = event.goal;
      if(goal === 'test'){ // 그룹의 목표가 코테일때
        for(let tag of tags){
          console.log(tag);
          for(let tagnumb of test[tag]){
            console.log(test[tag]);
            let URL = `https://www.acmicpc.net/workbook/view/${tagnumb}`;
            await get_nn(URL);
            console.log(probs);
            await pushprobstoDB(probs);
          }
        }
      }
      else if(goal === 'contest'){ // 그룹의 목표가 대회일때
        for(let tag of tags){
          console.log(tag);
          console.log(CONTEST[tag]);
          let URL = `https://www.acmicpc.net/workbook/view/${CONTEST[tag]}`;
            await get_nn(URL);
            await pushprobstoDB(probs);
        }
      }
      else{ // 그룹의 목표가 study일때
        for(let tag of tags){
          console.log(tag);
          console.log(diff);
          let URL;
          if(probhasdiff.indexOf(tag) != -1){ // 문제집이 상 중 하로 나뉘어져 있다면
            let cnt = 0;
            if(diff === '상') cnt = 2;
            else if(diff === '중') cnt = 1;
            else cnt = 0;
            URL = `https://www.acmicpc.net/workbook/view/${study[tag][cnt]}`;
            console.log(URL);
            await get_nn(URL);
            await pushprobstoDB(probs);
          }
          else{
            let tags = study[tag];
            for(let pr of tags){
              URL = `https://www.acmicpc.net/workbook/view/${pr}`;
              await get_nn(URL);
              await pushprobstoDB(probs);
            }
          }
        }
      }    
      resolve("Success");
    });
  }
  
  await main();
};




