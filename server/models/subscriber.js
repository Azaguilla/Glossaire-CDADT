const mongoose = require("mongoose");

// On défini la collection subscriber qui contient les utilisateurs inscrits aux notifications
var schemaSubscriber = new mongoose.Schema({
  endpoint: "string",
  keys: {
    auth: "string",
    p256dh: "string",
  },
}, {
  collection: "subscriber",
});

module.exports = mongoose.model("Subscriber", schemaSubscriber);
