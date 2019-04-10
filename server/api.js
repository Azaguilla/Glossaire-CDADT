const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  config = require("./bin/db");

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Connexion à la Base de données effectuée");

    // Routes required
    //const listRoute = require('./routes/list');

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    //app.use('/list', listRoute);

    const port = process.env.PORT || 4000;

    const server = app.listen(port, function() {
      console.log("En écoute sur le port " + port);
    });

  },
  err => { console.log("Impossible de se connecter à la Base de données :" + err); },
);
