const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUser,
  loginadmin
} = require("../Controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/getMe", protect, getLoggedInUser);
router.post("/loginadmin", loginadmin);

module.exports = router;