const express = require("express");
const app = express();
const userRoutes = express.Router();
const passport = require("passport");

let User = require("../models/user");

// Les actions à effectuer pour l'url /user/
userRoutes.route("/login").post(function(req, res) {

  passport.authenticate("local", function(err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token,
      });
    } else {
      // If user is not found
      res.status(401).json(info.error);
    }
  })(req, res);

});

userRoutes.route("/register").post(function(req, res) {
  var user = new User();

  user.username = req.body.username;
  user.email = req.body.email;
  user.lastname = req.body.lastname;
  user.firstname = req.body.firstname;

  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token,
    });
  });
});

// On exporte la route pour y avoir accès
module.exports = userRoutes;
