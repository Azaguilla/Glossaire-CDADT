const express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  config = require("./bin/db"),
  passport = require("passport");
require("./config/passport");

/* On se connecte à la Base de données*/
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, {useNewUrlParser: true}).then(
  () => {
    console.log("Connexion à la Base de données effectuée");

    // Une fois connecté, on spécifie les routes
    const wordRoute = require("./routes/word");
    const ThemeRoute = require("./routes/theme");
    const UserRoute = require("./routes/user");
    const notificationsRouter = require("./routes/notifications");
    const newsletterRouter = require("./routes/newsletter");

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    // On initialise passport (pour la connexion des utilisateurs
    app.use(passport.initialize());

    //On indique l'url et la route
    app.use("/word", wordRoute);
    app.use("/theme", ThemeRoute);
    app.use("/user", UserRoute);
    app.use("/api/notifications", notificationsRouter);
    app.use("/api/newsletter", newsletterRouter);

    const port = process.env.PORT || 4000;

    const server = app.listen(port, function() {
      console.log("En écoute sur le port " + port);
    });

  },
  err => {
    console.log("Impossible de se connecter à la Base de données :" + err);
  },
);
