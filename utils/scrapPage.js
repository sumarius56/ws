const axios = require("axios");
const cheerio = require("cheerio");

const scrapPage = async (url) => {
  return new Promise((resolve, reject) => {
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

        const resultsArr = await new Promise(async (resolve, reject) => {
          const arr = [];
          for (let i = 0; i < links.length; i++) {
            const meta = await getMetadata(links[i]);
            const obj = {
              link: links[i],
              title: titles[i],
              ...meta,
            };
            arr.push(obj);
          }

          resolve(arr);
        });
        resolve(resultsArr);
        console.log(resultsArr);
      };
      getData(url);
    }

    scrapPage();
  });
};

async function getMetadata(link) {
  try {
    return await axios.get(link).then((res) => {
      if (!res.data) return;
      const $ = cheerio.load(res.data);
      const metaArray = $("meta");
      let description = "No description";
      let keywords = "No keywords";
      for (const element of metaArray) {
        if (element.attribs.property === "keywords") {
          keywords = element.attribs.content;
        }
        if (element.attribs.name === "keywords") {
          keywords = element.attribs.content;
        }
        if (element.attribs.name === "description") {
          description = element.attribs.content;
        }
      }
      return {
        description,
        keywords,
      };
    });
  } catch (e) {}
}

module.exports = { scrapPage };
