const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: [
      "MelodyNews_Moderator",
      "MelodyMusic_Moderator",
      "MelodyDramas_Moderator",
      "MelodyShopping_Moderator",
      "MelodyFamily_Moderator",
      "Super_Admins",
      "Technical_Heads",
      "Higher_Heads",
    ],
    default: "Technical_Heads",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ADMINS = new  mongoose.model('admins',adminsSchema)
module.exports = ADMINS