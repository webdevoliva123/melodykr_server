const express = require("express");
const { createUserAccount, continueWithGoogle } = require("../../controller/user_controller/User_Controller");
const router = express.Router();

// 1. Register New Account

// ----------------------------------------------------------------

// New Account
router.post('/new/user', createUserAccount),
router.post('/google/authenticate', continueWithGoogle)



module.exports = router;
