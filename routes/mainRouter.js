const express = require("express");
const router = express.Router();
const {
  register,
  login,
  addPicutres,
  stayLogedin,
  logOut,
  filterMatches,
  allUsers,
  like,
} = require("../controllers/mainController");
const {
  validateRegistration,
  validatePicture,
} = require("../middleware/validators");

router.post("/register", validateRegistration, register);
router.post("/login", login);
router.get("/stay-logedin", stayLogedin);
router.get("/logout", logOut);
router.post("/addPicutres", validatePicture, addPicutres);
router.get("/allUsers", allUsers);
router.post("/filterMatches", filterMatches);
router.post("/like", like);

module.exports = router;
