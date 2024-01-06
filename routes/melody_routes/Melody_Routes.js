const express = require("express");
const { getMelodyHomeData } = require("../../controller/melody_controller/Melody_Controller");
const router = express.Router();

// 1. Home Page Data

// ----------------------------------------------------------------

// login
router.get('/home', getMelodyHomeData)



module.exports = router;
