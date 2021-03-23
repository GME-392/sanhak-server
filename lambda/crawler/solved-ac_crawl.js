const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express')
const bodyParser = require('body-parser')

let url_a= 'https://solved.ac/search?query=';
let url_b = '&sort=level&direction=asc&page=1';

// // 이 아래 코드는 프론트에서 난이도를 알고 싶은 문제 번호 가져오는 코드
// // 프론트로부터 받아야 하는 정보들 : 문제 번호
// let app = express();
// app.use(bodyParser().json());

// app.post('API URL : 나중에 프론트랑 연결시 입력 예정', function(req, res) {
//   // console.log(req.body);
//   // 제가 아직 body 정보가 어떻게 올지 몰라서 일단은 놔뒀어요!
//   // problem_number = ;
// });

let problem_number = '1718'; // 문제번호

let url = url_a + problem_number + url_b;

axios.get(url)
  .then(all_data => {
    // 성공적으로 data(html)를 받아왔다면
    console.log("Success!!");

    // cheerio 모듈을 사용하여 data를 저장하고
    var $ = cheerio.load(all_data.data);

    const diff = $('.StickyTable__Cell-akg1ak-1>span>a>img').attr().alt;	// 원하는 정보만 뽑아오기
    
    console.log(diff);
    
    //return(diff);
})
  .catch(err => {console.log(err);});