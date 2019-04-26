const mongoose = require("mongoose");

// On défini la collection subscriber qui contient les utilisateurs inscrits aux notifications
var schema = new mongoose.Schema({
  endpoint: "string",
  keys: {
    auth: "string",
    p256dh: "string",
  },
}, {
  collection: "subscriber",
});

module.exports = mongoose.model("Subscriber", schema);
