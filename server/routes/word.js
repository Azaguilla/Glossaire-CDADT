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

wordRoutes.route("/:title").get(function(req, res) {
  let title = req.params.title;

  Word.aggregate([{$lookup: {from: "theme", localField: "themes", foreignField: "_id", as: "themes_words"}},
    {$match: {"title": title}}]).exec(function(err, word) {
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

wordRoutes.route("/search/:title").get(function(req, res) {
  let title = req.params.title.toLowerCase().trim();
  Word.find({"title":  { $regex: title, $options: "i" }}).limit(4).exec(function(err, word) {
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

wordRoutes.route("/thm/:title").get(function(req, res) {
  let title = req.params.title;

  Word.aggregate([{$lookup: {from: "theme", localField: "themes", foreignField: "_id", as: "themes_words"}},
    {$match: {"themes_words.title": title}}]).exec(function(err, word) {
    if (err) {
      console.log(err);
    } else {
      res.json(word);
    }
  });
});

wordRoutes.route("/add").post(function(req, res) {
  const wordInfo = req.body;
  let word = new Word(wordInfo);

  word.save().then(definition => {
    res.status(200).json({"definition": "Ajout effectué"});
  })
    .catch(err => {
      res.status(400).send("Sauvegarde non effectuée : " + err);
    });
});

// On exporte la route pour y avoir accès
module.exports = wordRoutes;
