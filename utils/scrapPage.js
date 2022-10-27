const axios = require("axios");
const cheerio = require("cheerio");

const scrapPage = async (url) => {
  return new Promise((resolve, reject) => {
    //Results will be stored here
    const resultsArr = [];
    console.log(url);
    //First page results
    async function scrapPage() {
      const getData = async (url) => {
        const { data } = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
          },
        });
        const $ = cheerio.load(data);
        const links = Array.from($('div[class="yuRUbf"] >a')).map((a) => {
          return $(a).attr("href");
        });

        const titles = Array.from($("h3")).map((h3) => {
          return $(h3).text();
        });

        titles.forEach((element, index) => {
          const obj = {};
          obj.title = element;
          obj.link = links[index];
          resultsArr.push(obj);
        });
        await resolve(resultsArr);
        console.log(resultsArr);
      };
      getData(url);
    }

    scrapPage();
  });
};

module.exports = { scrapPage };
