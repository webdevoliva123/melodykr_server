const express = require("express");
const router = express.Router();
const {
  createAdmins, loginAdmins, genrateMelodyModrator, createMelodyModrator,
} = require("../../controller/account_controller/Admins");

// create admins
router.post("/admins/new", createAdmins);
// login admins
router.post('/admins/login',loginAdmins)
// genrate links for moderator
router.post('/moderator/new',genrateMelodyModrator)
// create moderator accounts
router.post('/moderator/new/account',createMelodyModrator)

// create content_writers



module.exports = router;
