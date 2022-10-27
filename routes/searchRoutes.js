const express = require("express");
const router = express.Router();
const {
  scrapPages,
  saveForm,
  getMyBusiness,
  getForms,
  getKeywords,
} = require("../controllers/searchControllers");

router.route("/").post(scrapPages).get(getKeywords);
router.route("/form").post(saveForm).get(getForms);
router.route("/mybusiness").post(getMyBusiness);

module.exports = router;
