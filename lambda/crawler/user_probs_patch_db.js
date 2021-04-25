const axios = require('axios')

let BOJ_ENDPOINT = 'https://vo2gl8s0za.execute-api.us-east-2.amazonaws.com/backend_api/user';
let USER_ENDPOINT = 'https://9u31ip8rz2.execute-api.ap-northeast-2.amazonaws.com/deployment-stage/rest-resource';
let sp;
let userid = 'kimtaehyun98';

async function main(){
  return new Promise(async (resolve, reject) => {
    await axios
      .post(BOJ_ENDPOINT, {id : "kimtaehyun98"})
      .then((res) => {
        sp = res.data.body;
        console.log(res.data.body);
      });

      await axios
        .patch(USER_ENDPOINT, { userid : userid, funcname : 'updateSolved', problems : sp });  
  })
}

main();
