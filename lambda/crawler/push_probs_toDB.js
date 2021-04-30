// 이 코드는 백준 문제집의 문제들을 [문제번호, 제목, 난이도] 형태로 크롤링 해 오는 코드입니다.
// cheerio 모듈 사용시 img 태그의 src를 불러올 수가 없어서 난이도만 따로 solved_ac에서 가져오는 크롤러를 추가 사용했습니다.
// 이 코드는 그룹 생성시 사용하면 됩니다. 즉 이 코드(API로 만들 예정)를 실행시 그룹에서 설정한 태그, 목표, 난이도를 바탕으로 문제집에서 가져와 그룹 DB의 Problems에 넣고 사용할 예정입니다.
// 2021.4.30 버전 1 : 현재 TEST_URL 지정시 해당 문제집의 모든 문제를 가져와 GROUP_DB에 UPDATE / 개선해야 할 사항 : 태그와 난이도를 프론트로부터 입력받고 해당 문제 선별하여 집어넣기


const axios = require('axios')
const cheerio = require('cheerio')

let BOJ_ENDPOINT = 'https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user';
let USER_ENDPOINT = 'https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource';
let GROUP_ENDPOINT = 'https://bb80o1csdl.execute-api.ap-northeast-2.amazonaws.com/groupDB';
let TEST_URL = 'https://www.acmicpc.net/workbook/view/7700';
let TEST2 = 'https://www.acmicpc.net/workbook/view/2771'
let ret = [];
let diff;

const get_rank = async(number) => {

  let RANK_URL = `https://solved.ac/search?query=${number}`;

  return await axios.get(RANK_URL)
    .then(all_data => {
      // cheerio 모듈을 사용하여 data를 저장하고
      var $ = cheerio.load(all_data.data);

      diff = $('.StickyTable__Cell-akg1ak-1>span>a>img').attr().alt;	// 원하는 정보만 뽑아오기
      
  })
    .catch(err => {console.log(err);});
}

const get_nn = async() => {
  return await axios
    .get(TEST_URL)
    .then((res) => {
      const $ = cheerio.load(res.data);
      $('tbody>tr').each(async(index,item) => {
        let numb = $(item).find('td:nth-child(1)').text(); // 문제 번호
        let name = $(item).find('td:nth-child(2)').text(); // 문제 이름
        // await get_rank(numb); // 난이도 구하기
        let temp = {};
        temp['numb'] = numb;
        temp['name'] = name;
        ret.push(temp);
        // console.log(temp);
      });
    })
}

const pushprobstoDB = async(probs) => {
  return await axios
  .patch(GROUP_ENDPOINT, { func : "updateProblems", id : "1", problems : probs })
}


async function main(){
  return new Promise(async(resolve, reject) => {
    await get_nn();
    for(prob of ret){
      await get_rank(prob.numb);
      prob['rank'] = diff;
    }
    console.log(ret);
    await pushprobstoDB(ret);
    resolve("Success");
  });
}

main();
