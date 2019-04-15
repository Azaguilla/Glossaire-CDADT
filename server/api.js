const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  config = require("./bin/db");

/* On se connecte à la Base de données*/
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, {useNewUrlParser: true}).then(
  () => {
    console.log("Connexion à la Base de données effectuée");

    // Une fois connecté, on spécifie les routes
    const wordRoute = require("./routes/word");
    const ThemeRoute = require("./routes/theme");

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    //On indique l'url et la route
    app.use("/word", wordRoute);
    app.use("/theme", ThemeRoute);

    const port = process.env.PORT || 4000;

    const server = app.listen(port, function () {
      console.log("En écoute sur le port " + port);
    });

  },
  err => {
    console.log("Impossible de se connecter à la Base de données :" + err);
  },
);
