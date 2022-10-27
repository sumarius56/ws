const mongoose = require("mongoose");

const searchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SearchKeyword", searchKeywordSchema);
