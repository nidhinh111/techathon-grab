const express = require("express");
const {
  getpayoutamount
} = require("../Controllers/payout");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/getpayoutamount", protect, getpayoutamount);

module.exports = router;