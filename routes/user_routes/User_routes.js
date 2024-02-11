const express = require("express");
const { createUserAccount, continueWithGoogle, loginUser } = require("../../controller/user_controller/User_Controller");
const router = express.Router();

// 1. Register New Account

// ----------------------------------------------------------------

// New Account
router.post('/new/user', createUserAccount),
router.post('/google/authenticate', continueWithGoogle)
router.post('/login/user', loginUser)



module.exports = router;
