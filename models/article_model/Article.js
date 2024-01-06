const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  thumbnail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      user: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
  },
  isHeadline : {
    type : Boolean,
    default : false,
  },
  tags: {
    type: [String],
  },
});

const ARTICLE = mongoose.model("Article", articleSchema);

module.exports = ARTICLE;
