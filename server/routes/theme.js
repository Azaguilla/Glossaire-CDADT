const express = require("express");
const app = express();
const themeRoutes = express.Router();

// On "require" le modèle "theme" pour avoir accès au schema de la collection dans la BDD
let Theme = require("../models/theme");

// Les actions à effectuer pour l'url /theme/
themeRoutes.route("/").get(function(req, res) {
  //l'action suivante récupère tous les themes
  Theme.find(function(err, word) {
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

// route récupérant un theme par son id
themeRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Theme.findOne({"_id": id}, function(err, theme) {
    if (err) {
      console.log(err);
    } else {
      res.json(theme);
    }
  });
});

// route récupérant un theme par l'id d'un mot
themeRoutes.route("/word/:id").get(function(req, res) {
  let id = req.params.id;
  let Word = require("../models/word");

  Word.find({"title": id});

  Theme.findOne({"_id": id}, function(err, theme) {
    if (err) {
      console.log(err);
    } else {
      res.json(theme);
    }
  });
});

// On exporte la route pour y avoir accès
module.exports = themeRoutes;
