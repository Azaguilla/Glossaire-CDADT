const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema et collection pour un mot
var schemaWord = new mongoose.Schema({
  definition: "string",
  know_more: "string",
  last_edit: "string",
  themes: [Schema.Types.ObjectId],
  title: "string",
}, {
  collection: "word",
});

//On exporte pour rendre le schema accessible
module.exports = mongoose.model("Word", schemaWord);
