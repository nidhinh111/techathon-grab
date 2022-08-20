const express = require("express");
const {
  processorder,
} = require("../Controllers/order");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/processorder", protect, processorder);

module.exports = router;