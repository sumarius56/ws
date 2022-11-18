const { scrapPage } = require("../utils/scrapPage");
const { scrapMyBusiness } = require("../utils/scrapMyBusiness");
const Form = require("../models/formModel");
const SearchKeyword = require("../models/searchKeywordModel");

const scrapPages = async (req, res, next) => {
  const searchInput = req.body.search;
  const nrOfPages = req.body.pages;
  const keyword = await SearchKeyword.create({ keyword: searchInput });

  try {
    const urlFirstPage = `https://www.google.com/search?q=${searchInput}`;
    const maxResults = (nrOfPages - 1) * 10;
    let currentPage = 0;
    let pageArr = [];
    while (currentPage <= maxResults) {
      const urlPage = `${urlFirstPage}&start=${currentPage}`;
      const results = await scrapPage(
        currentPage === 0 ? urlFirstPage : urlPage
      );
      currentPage += 10;
      pageArr.push(results);
    }

    res.status(201).json({
      status: "success",
      data: {
        keyword: keyword.keyword,
        results: pageArr,
      },
    });
  } catch (error) {
    console.error({ message: error.message });
  }
};

const saveForm = async (req, res) => {
  //get form informations
  const formInfo = req.body;
  try {
    const form = await Form.create(formInfo);
    res.status(201).json({
      status: "success",
      data: form,
    });
  } catch (error) {
    console.error({ message: error.message });
  }
};

const getMyBusiness = async (req, res) => {
  const searchInput = req.body.search;
  try {
    const url = `https://www.google.com/search?q=${searchInput}`;
    const results = await scrapMyBusiness(url);
    let myBusinessArr = [];
    myBusinessArr.push(results);
    res.status(201).json({
      status: "success",
      data: myBusinessArr,
    });
  } catch (error) {
    console.error({ message: error.message });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json({
      status: "success",
      data: forms,
    });
  } catch (error) {
    console.error({ message: error.message });
  }
};

const getKeywords = async (req, res) => {
  try {
    const keywords = await SearchKeyword.find();
    res.status(200).json({
      status: "success",
      data: keywords,
    });
  } catch (error) {
    console.error({ message: error.message });
  }
};

module.exports = { scrapPages, saveForm, getMyBusiness, getForms, getKeywords };
