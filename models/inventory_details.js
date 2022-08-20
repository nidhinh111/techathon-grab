const mongoose = require("mongoose");
const inventory_details = new mongoose.Schema({

  inventory_id: {
    type: Number,
    unique: true,
    required: [true, "Please add an inventory id"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  value: {
    type: Number
  },
  quantity: {
    type: Number
  },
  active: {
    type: Number,
  },
  is_cash: {
    type: Number,
  },
  rider_category: {
    type: String,
  },
  events: {
    type: Array,
  },
  incentive_type: {
    type: Array,
  }
},{ timestamps: true });

module.exports = mongoose.model("inventory_details", inventory_details,"inventory_details");