const express = require("express");
const router = express.Router();
const {
  createAdmins,
  loginAdmins,
  genrateMelodyModrator,
  createMelodyModrator,
  createContentWriterAccountByNewsModerator,
} = require("../../controller/admins_controller/Admins_Controller");
const {
  adminLoginAuthentication,
  adminRoleAuthentication,
} = require("../../middleware/admin_middleware");

// create admins
router.post("/admins/new",createAdmins);
// login admins
router.post("/admins/login", loginAdmins);
// genrate links for moderator
router.post("/moderator/new",adminLoginAuthentication,adminRoleAuthentication(["Technical_Heads","Higher_Heads"]), genrateMelodyModrator);
// create moderator accounts
router.post("/moderator/new/account",adminLoginAuthentication,adminRoleAuthentication(["Technical_Heads","Higher_Heads"]),createMelodyModrator);
// create content_writers
router.post(
  "/moderator/new/content_writers",
  adminLoginAuthentication,
  adminRoleAuthentication(["MelodyNews_Moderator","Technical_Heads","Higher_Heads"]),
  createContentWriterAccountByNewsModerator
);

module.exports = router;
