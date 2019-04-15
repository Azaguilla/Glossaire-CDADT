const mongoose = require("mongoose");

// Schema et collection pour un theme
var schema = new mongoose.Schema({
  ThemeId: "string",
  ThemeTitle: "string",
}, {
  collection: "theme",
});

//On exporte pour rendre le schema accessible
module.exports = mongoose.model("Theme", schema);
