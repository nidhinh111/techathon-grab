const express = require("express");
const { getallincentives } = require("../Controllers/incentive");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.post("/getallincentives", protect, getallincentives);

module.exports = router;