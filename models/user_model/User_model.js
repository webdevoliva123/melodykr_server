const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String, 
    default : "https://res.cloudinary.com/dkz1pnb2b/image/upload/v1707601836/cat_2_cupgme.png"
  },
}, { timestamps: true });

const USER = mongoose.model('User', userSchema);

module.exports = USER;
