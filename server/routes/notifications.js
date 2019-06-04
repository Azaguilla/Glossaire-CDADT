const express = require("express");
const notificationRoutes = express.Router();
const cors      = require("cors");

var corsOptions = {
  "origin": "*",
  "Cache-Control": "no-cache",
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
};

// On a besoin du model subscriber
let Subscriber = require("../models/subscriber");

notificationRoutes.route("/").options(cors());

notificationRoutes.route("/").post(cors(corsOptions), function(req, res) {
  let subscriber = new Subscriber(req.body);
  subscriber.save()
    .then(subscriber => {
      res.status(200).json({"subscriber": "Subscriber ajouté"});
    })
    .catch(err => {
      res.status(400).send("Un problème est survenu : " + err);
    });
});

notificationRoutes.route("/del").post(function(req, res) {
  Subscriber.findOne(req.body).remove().exec().then( success => {
    res.status(200).json({"subscriber": "Subscriber supprimé"});
  }).catch(err => {
    res.status(400).send("Un problème est survenu : " + err);
  });
});
module.exports = notificationRoutes;
