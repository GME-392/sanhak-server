const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {

  let id = event.id;
  let url = `https://solved.ac/profile/${id}`;
  let ret = {
    Bronze : 0,
    Silver : 0,
    Gold : 0,
    Platinum : 0,
    Diamond : 0,
    Ruby : 0
  }

    await axios.get(url).then(all_data => {
      let $ = cheerio.load(all_data.data);
      ret.Bronze = $('label[for = "Bronze"]>div>div>span:nth-child(1)').text();
      ret.Silver = $('label[for = "Silver"]>div>div>span:nth-child(1)').text();
      ret.Gold = $('label[for = "Gold"]>div>div>span:nth-child(1)').text();
      ret.Platinum = $('label[for = "Platinum"]>div>div>span:nth-child(1)').text();
      ret.Diamond = $('label[for = "Diamond"]>div>div>span:nth-child(1)').text();
      ret.Ruby = $('label[for = "Ruby"]>div>div>span:nth-child(1)').text();
    })
    .catch(err => {console.log(err);});

    return {
        statusCode : 200,
        body : ret
    } 
};
