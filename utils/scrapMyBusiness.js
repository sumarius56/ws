const axios = require("axios");
const cheerio = require("cheerio");

const myBusinessArr = [];

async function scrapMyBusiness(url) {
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

    for (const element of dir) {
      if (element.attribs.class) {
        if (element.attribs?.class.includes("ab_button")) {
          if (element.attribs["data-url"]?.includes("maps")) {
            const direction = {
              name: "direction",
              url: element.attribs["data-url"],
            };
            properties.push(direction);
          } else if (element.attribs?.href?.includes("http")) {
            const website = {
              name: "website",
              url: element.attribs.href,
            };
            properties.push(website);
          }
        }
      }
    }

    const spanObj = $("span");
    for (const element of spanObj) {
      if (element.attribs?.class?.includes("Aq14fc")) {
        const rating = {
          name: "rating",
          rating: +element.children[0].data.replace(",", "."),
        };
        properties.push(rating);
      } else if (element.children[0]?.data?.includes("Google")) {
        const index = properties.findIndex(
          (el) => el.name === "numberOfReviews"
        );
        if (index === -1) {
          const numberOfReviews = {
            name: "numberOfReviews",
            value: +element.children[0].data.split(" ")[0],
          };
          properties.push(numberOfReviews);
        }
      }
    }

    const spanAddress = $("span");
    for (const element of spanAddress) {
      if (element.attribs?.class?.includes("LrzXr")) {
        const index = properties.findIndex((el) => el.name === "address");
        if (index === -1) {
          const address = {
            name: "address",
            value: element.children[0].data,
          };
          properties.push(address);
        }
      }
    }

    const appoinments = $("a");
    for (const element of appoinments) {
      if (element.attribs?.class?.includes("xFAlBc")) {
        const appoinment = {
          name: "appoinment",
          url: element.attribs.href,
        };
        properties.push(appoinment);
      }
    }

    const missingInfo = $("span");
    for (const element of missingInfo) {
      if (element.attribs?.class?.includes("qe9kJc")) {
        const missingInfo = {
          name: "missingInfo",
          value: element.children[0].data,
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
              name: "openTime",
              value: child2.children[0].next.data,
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
              name: "phoneNumber",
              value: child.children[0].children[0].attribs["aria-label"],
            };
            properties.push(phoneNumber);
          }
        }
      }
    }

    myBusinessArr.push({ business: "MyBusiness", properties });
    const businessDetails = myBusinessArr[0].properties;
    console.log(businessDetails);
  };
  getData(url);
}

module.exports = { scrapMyBusiness };
