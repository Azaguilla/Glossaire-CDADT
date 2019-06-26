const express = require("express");
const app = express();
const themeRoutes = express.Router();

// On "require" le modèle "theme" pour avoir accès au schema de la collection dans la BDD
let Theme = require("../models/theme");

// Les actions à effectuer pour l'url /theme/
themeRoutes.route("/").get(function(req, res) {
  //l'action suivante récupère tous les themes
  Theme.find(function(err, themes) {
    if (err) {
      console.log(err);
    } else {
      res.json(themes);
    }
  });
});

// route récupérant un theme par son id
themeRoutes.route("/:id").get(function(req, res) {
  // let id = req.params.id;
  // Theme.findOne({"_id": id}, function(err, theme) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.json(theme);
  //   }
  // });
});

// route récupérant un theme par l'id d'un mot
themeRoutes.route("/word/:id").get(function(req, res) {
  // let id = req.params.id;
  //
  // Theme.findOne({"_id": id}, function(err, theme) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.json(theme);
  //   }
  // });
});

themeRoutes.route("/search/:title").get(function(req, res) {
  let title = req.params.title.toLowerCase().trim();
  Theme.find({"title":  { $regex: title, $options: "i" }}).sort({"title": 1}).exec(function(err, theme) {
    if (err) {
      console.log(err);
    } else {
      res.json(theme);
    }
  });
});

// On exporte la route pour y avoir accès
module.exports = themeRoutes;
