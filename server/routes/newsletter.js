const webpush = require("web-push");
const express = require("express");
const newsletterRoutes = express.Router();
const cors    = require("cors");
console.log("notifications ok");
var corsOptions = {
  "origin": "*",
  "Cache-Control": "no-cache",
  "Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
};
// TODO ne pas laisser les clés vapid dans le code
const vapidKeys = {
  "publicKey": "BNGmdT-zn-S0tocFwPP9Z6PG3pfouwebPHQ0lpAQg5Z5LLZJ4OdBXz8aN_ct19Bbvi56WeYosu94RCXS34D2NU0",
  "privateKey": "-YE8qIqdEBsrDj5mZR-90WsgWx7ODtH5xwTu_LqFIs4",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const app = express();

newsletterRoutes.route("/").options(cors());
newsletterRoutes.route("/").post(cors(corsOptions), async function(req, res) {
    const title = req.body.title;
    const user = req.body.user;

    let Subscription = require("../models/subscriber");
    const allSubscriptions = await Subscription.find();

    const notificationPayload = {
      "notification": {
        "title": "Une définition vient d'être ajoutée : " + title + ".",
        "body": "La définition du mot " + title + " vient d'être ajoutée par " + user + ".",
        "icon": "assets/img/logo_carre.png",
        "vibrate": [100, 50, 100],
        "data": {
          "dateOfArrival": Date.now(),
          "primaryKey": 1,
          "url": "https://glossaire.alwaysdata.net/definition/" + title,
        },
        "actions": [{
          "action": "explore",
          "title": "Consulter la définition",
        }],
      },
    };

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
      sub, JSON.stringify(notificationPayload) )))
      .then(() => res.status(200).json({message: "Notification envoyée avec succès."}))
      .catch(err => {
        console.error("Une erreur est survenue : ", err);
        res.sendStatus(500);
      });
  },
);

module.exports = newsletterRoutes;
