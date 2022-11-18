const axios = require("axios");
const cheerio = require("cheerio");

const myBusinessArr = [];

async function scrapMyBusiness(url) {
  return new Promise((resolve, reject) => {
    const getData = async (url) => {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);
      const dir = $("a");
      const properties = [];
      const metaData = [];

      for (const element of dir) {
        if (element.attribs.class) {
          if (element.attribs?.class.includes("ab_button")) {
            if (element.attribs["data-url"]?.includes("maps")) {
              const direction = {
                direction: element.attribs["data-url"],
              };
              properties.push(direction);
            } else if (element.attribs?.href?.includes("http")) {
              const website = {
                website: element.attribs.href,
              };
              const meta = await getMetadata(element.attribs.href);
              properties.push(website);
              metaData.push(meta);
            }
          }
        }
      }

      const spanObj = $("span");
      for (const element of spanObj) {
        if (element.attribs?.class?.includes("Aq14fc")) {
          const rating = {
            rating: +element.children[0].data.replace(",", "."),
          };
          properties.push(rating);
        } else if (element.children[0]?.data?.includes("Google")) {
          const index = properties.findIndex((el) => el.numberOfReviews);
          if (index === -1) {
            const numberOfReviews = {
              numberOfReviews: +element.children[0].data.split(" ")[0],
            };
            properties.push(numberOfReviews);
          }
        }
      }

      const spanAddress = $("span");
      for (const element of spanAddress) {
        if (element.attribs?.class?.includes("LrzXr")) {
          const index = properties.findIndex((el) => el.address);
          if (index === -1) {
            const address = {
              address: element.children[0].data,
            };
            properties.push(address);
          }
        }
      }

      const appoinments = $("a");
      for (const element of appoinments) {
        if (element.attribs?.class?.includes("xFAlBc")) {
          const appoinment = {
            appointment: element.attribs.href,
          };
          properties.push(appoinment);
        }
      }

      const missingInfo = $("span");
      for (const element of missingInfo) {
        if (element.attribs?.class?.includes("qe9kJc")) {
          const missingInfo = {
            missingInfo: element.children[0].data,
          };
          properties.push(missingInfo);
        }
      }

      const opens = $("span");
      for (const element of opens) {
        if (element.attribs?.class?.includes("JjSWRd")) {
          for (const child of element.children) {
            for (const child2 of child.children) {
              const openTime = {
                upTime: child2.children[0].next.data,
              };
              properties.push(openTime);
            }
          }
        }
      }

      const phone = $("span");
      for (const element of phone) {
        if (element.attribs?.class?.includes("LrzXr")) {
          for (const child of element.children) {
            if (child.children) {
              const phoneNumber = {
                phoneNumber:
                  child.children[0].children[0].attribs["aria-label"],
              };
              properties.push(phoneNumber);
            }
          }
        }
      }

      myBusinessArr.push({ business: "MyBusiness", properties });
      const businessDetails = myBusinessArr[0].properties;
      const myBusiness = {
        ...businessDetails,
        ...metaData,
      };
      console.log(myBusiness);
      resolve(myBusiness);
    };

    getData(url);
  });
}

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
        metadata: {
          description,
          keywords,
        },
      };
    });
  } catch (e) {}
}

module.exports = { scrapMyBusiness };
