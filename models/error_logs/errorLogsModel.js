const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  message : {
    type : String,
    required : true,
  },
  error : {
    type : Object,
    required : true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ERRORLOGS = new mongoose.model("ErrorLogs", logSchema);

module.exports = ERRORLOGS;
