const mongoose = require("mongoose");

// Schema et collection pour un theme
var schemaThm = new mongoose.Schema({
  ThemeTitle: "string",
}, {
  collection: "theme",
});

//On exporte pour rendre le schema accessible
module.exports = mongoose.model("Theme", schemaThm);
