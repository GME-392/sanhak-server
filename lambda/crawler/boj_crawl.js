const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {
    
    // 사용 변수들
    let url = 'https://www.acmicpc.net/user/';
    let solve_num = []; // 지금까지 푼 문제들을 저장해 놓은 배열  
    let User_ID; // User의 ID
    let today_problem = []; // 오늘의 문제 번호를 저장한 배열 // (예시 : '11559', '1477', '9370')  
    let doit = []; // 풀어야 하는 문제 중 푼 문제 번호들 저장하고 있는 배열
    let check; // 출석 여부를 저장하고 있는 변수
        
    // 받아온 데이터로 원하는 유저와 원하는 번호 크롤링
    User_ID = event.name;
    today_problem = event.prob;
        
    // User name을 프론트로부터 받고, URL에 더해줌 -> 이 코드를 통해 원하는 유저의 채점 현황을 크롤링 할 수 있음
    url += User_ID;  
    await axios.get(url).then(all_data => {
        // 성공적으로 data(html)를 받아왔다면
        console.log("Success!!");

         // cheerio 모듈을 사용하여 data를 저장하고
        var $ = cheerio.load(all_data.data);
        // 해당 string은 내가 원하는 정보인 "지금까지 solve한 문제들"이 저장되어 있는 경로임!
        $('body>div.wrapper>div.container>div.row>div.col-md-12>div.row>div.col-md-9>div.panel:nth-child(1)>div.panel-body>a').each((index,item) => {
            solve_num.push(item.attribs.href.substr(9)); // 지금까지 푼 문제 번호들 저장
        });
        for(let numb of today_problem){
            let numb_index = solve_num.indexOf(numb); // 해당 문제가 푼 문제 목록에 있는지
            if(numb_index != -1){ // 푼 문제 목록에 있다면
                doit.push(numb);
            }
        }

        check = today_problem.length === doit.length ? '출석' : '결석';
            
        })
    .catch(err => {console.log(err);});

    return {
        statusCode : 200,
        body : check, doit
    } 
    
};
