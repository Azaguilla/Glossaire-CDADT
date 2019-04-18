const mongoose = require("mongoose");
// Pour le paramétrage et la vérification du mot de passe (gère les hashages etc...)
const crypto = require("crypto");
// Utilisé pour générer le token de session
const jwt = require("jsonwebtoken");

// Schema et collection pour un user
var schemaUser = new mongoose.Schema({
  email: {
    required: true,
    type: "string",
    unique: true,
  },
  firstname: "string",
  lastname: "string",
  username: "string",
  password: {
    required: true,
    type: "string",
  },
  salt: "string",
}, {
  collection: "user",
});

// On crée une méthode qui sera utilisée lors de la création d'un utilisateur
// Cette méthode permet de créer un salt aléatoire (randomBytes) et de définir un hashage (pbkdf2Sync) pour le password
// rappel : hex = hexadécimal
schemaUser.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};

// On créee une méthode qui permettra de vérifier le password
schemaUser.methods.verifPassword = function(password) {
  const userPassword = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
  return this.password === userPassword;
};

// On crée une méthode qui génère un jeton avec une date d'expiration et un message secret hashé
schemaUser.methods.generateJwt = function() {
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  expirationDate = String(expirationDate.getTime() / 1000);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    exp: parseInt(expirationDate, 10),
    username: this.username,
  }, "glossaire_secret"); // TODO Secret à mettre dans une variable d'environnement de NODEJS (fichier .env)
};

//On exporte pour rendre le schema accessible
module.exports = mongoose.model("User", schemaUser);
