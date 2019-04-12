const express = require("express");
const app = express();
const wordRoutes = express.Router();

// On "require" le modèle "word" pour avoir accès au schema de la collection dans la BDD
let Word = require("../models/word");

// Les actions à effectuer pour l'url /word/
wordRoutes.route("/").get(function(req, res) {
  //l'action suivante effectue un tri sur la date de tous les documents puis récupère le premier doc grâce au limit
  Word.find().sort({"last_edit": -1}).limit(1).exec(function(err, word) {
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

// Defined edit route
wordRoutes.route("/:title").get(function(req, res) {
  let title = req.params.title;
  Word.findOne({"title": title}, function(err, word){
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

// On exporte la route pour y avoir accès
module.exports = wordRoutes;
