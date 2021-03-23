const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express')
const bodyParser = require('body-parser')

let url = 'https://www.acmicpc.net/user/';
let solve_num = []; // 지금까지 푼 문제들을 저장해 놓은 배열

let User_ID; // User의 ID
let today_problem = []; // 오늘의 문제 번호를 저장한 배열 // (예시 : '11559', '1477', '9370')

// test용 코드임. 나중에 지우기
User_ID = 'kimtaehyun98';

// 이 아래 코드는 프론트에서 User 정보와 오늘의 문제 번호 가져오는 코드
// 프론트로부터 받아야 하는 정보들 : User Id, 오늘 풀어야 하는 문제 번호
let app = express();
app.use(bodyParser().json());

app.post('API URL : 나중에 프론트랑 연결시 입력 예정', function(req, res) {
  // console.log(req.body);
  // 제가 아직 body 정보가 어떻게 올지 몰라서 일단은 놔뒀어요!
  // User_ID = ;
  // today_problem = ;
});

// User name을 프론트로부터 받고, URL에 더해줌 -> 이 코드를 통해 원하는 유저의 채점 현황을 크롤링 할 수 있음
url += User_ID;

axios.get(url)
  .then(all_data => {
    // 성공적으로 data(html)를 받아왔다면
    console.log("Success!!");

    // cheerio 모듈을 사용하여 data를 저장하고
    var $ = cheerio.load(all_data.data);
    // 해당 string은 내가 원하는 정보인 "지금까지 solve한 문제들"이 저장되어 있는 경로임!
    $('body>div.wrapper>div.container>div.row>div.col-md-12>div.row>div.col-md-9>div.panel:nth-child(1)>div.panel-body>a').each((index,item) => {
      solve_num.push(item.attribs.href.substr(9)); // 지금까지 푼 문제 번호들 저장
    });

    let doit = []; // 풀어야 하는 문제 중 푼 문제 번호들 저장하고 있는 배열

    for(let numb of today_problem){
      let numb_index = solve_num.indexOf(numb); // 해당 문제가 푼 문제 목록에 있는지
      if(numb_index != -1){ // 푼 문제 목록에 있다면
        doit.push(numb);
      }
    }

    let check = today_problem.length === doit.length ? '출석' : '결석';
    
    // 프론트로 리턴할 객체
    let ret = {
      TF : check, // 출석 여부 -> 출석 했으면 '출석', 결석 했으면 '결석' (데이터 타입은 나중에 프론트랑 연결할 때 원하는 대로 바꾸면 될듯)
      SV : doit   // 실제로 푼 문제 번호들 -> 현재는 배열 형태임
      // 추가적으로 어떤 것을 반환해야 할 지는 프론트랑 얘기 후 작성하면 될듯
    }
    
    return ret;
})
  .catch(err => {console.log(err);});