const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {
    
    // 사용 변수들
    let User_ID = event.name;
    let url = `https://www.acmicpc.net/user/${User_ID}`;
    let solve_num = []; // 지금까지 푼 문제들을 저장해 놓은 배열  
    let User_ID; // User의 ID
        
    await axios.get(url).then(all_data => {
        // 성공적으로 data(html)를 받아왔다면
        console.log("Success!!");

         // cheerio 모듈을 사용하여 data를 저장하고
        let $ = cheerio.load(all_data.data);
        // 해당 string은 내가 원하는 정보인 "지금까지 solve한 문제들"이 저장되어 있는 경로임!
        $('body>div.wrapper>div.container>div.row>div.col-md-12>div.row>div.col-md-9>div.panel:nth-child(1)>div.panel-body>a').each((index,item) => {
            solve_num.push(item.attribs.href.substr(9)); // 지금까지 푼 문제 번호들 저장
        });
            
        })
    .catch(err => {console.log(err);});

    return {
        statusCode : 200,
        body : solve_num
    } 
    
};
