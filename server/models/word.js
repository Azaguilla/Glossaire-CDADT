const mongoose = require("mongoose");

// Schema et collection pour un mot
var schema = new mongoose.Schema({
  wordDefinition: "string",
  wordLastEdit: "string",
  wordTitle: "string",
}, {
  collection: "word",
});

//On exporte pour rendre le schema accessible
module.exports = mongoose.model("Word", schema);
