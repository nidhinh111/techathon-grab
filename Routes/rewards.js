const express = require("express");
const {
  getreward, redeem
} = require("../Controllers/rewards");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/getreward", protect, getreward);
router.post("/redeem", protect, redeem);

module.exports = router;