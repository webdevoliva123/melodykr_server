const express = require("express");
const router = express.Router();
const {
  createAdmins,
  loginAdmins,
  genrateMelodyModrator,
  createMelodyModrator,
  createContentWriterAccountByNewsModerator,
  getUpdateSechma,
} = require("../../controller/admins_controller/Admins_Controller");
const {
  adminLoginAuthentication,
  adminRoleAuthentication,
} = require("../../middleware/authentication_middleware");

// 1. create admins (Teach_Heads,Higher_Heads)
// 2. login admins (Teach_Heads,Higher_Heads)
// 3. genrate links for new account of moderator by (Teach_Heads,Higher_Heads)
// 4. create final moderator accounts by moderator by genrated links
// 5. create content writer accounts by new_moderator
// 6. update database schema

// ----------------------------------------------------------------


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
  // router.put("/update/database/scehma",getUpdateSechma)


module.exports = router;
