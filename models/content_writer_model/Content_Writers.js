const mongoose = require("mongoose");

const contentWritersSchema = new mongoose.Schema({
  profileImage : {
    type : String,
    default : 'https://res.cloudinary.com/dkz1pnb2b/image/upload/v1703451537/cat_1_xfid2j.png'
  },
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
  bio: {
    type: String,
    default: "",
    required: true,
    maxlength  : 500
  },
  articles: [
    {
      article_id: {
        type: mongoose.Schema.ObjectId,
        default: mongoose.Schema.ObjectId,
        ref: 'Article',
      },
    },
  ],
  socialMedia: {
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CONTENT_WRITER = new mongoose.model(
  "ContentWriter",
  contentWritersSchema
);

module.exports = CONTENT_WRITER;
