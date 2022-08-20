const express = require("express");
const {
  save
} = require("../Controllers/configuration");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/save", protect, save);

module.exports = router;