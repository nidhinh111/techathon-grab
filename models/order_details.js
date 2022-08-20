const mongoose = require("mongoose");
const order_details = new mongoose.Schema({
  oid: {
    type: String,
    unique: true,
    required: [true, "Please add an oid"]
  },
  eid: {
    type: String,
  },
  vertical: {
    type: String,
    enum: ["JioMart", "SDP"],
    default: "JioMart",
  },
  client_id: {
    type: Number,
  },
  city_id: {
    type: Number,
  },  
  order_status: {
    type: Number,
  },  
  status_time: {
    type: Date,
    default: Date.now,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },  
  updated_time: {
    type: Date,
  },
});

module.exports = mongoose.model("order_details", order_details,"order_details");