const mongoose = require("mongoose");
const driver_daily_details = new mongoose.Schema({
  eid: {
    type: String,
  },
  name: {
    type: String,
  }, 
  vertical: {
    type: String,
    enum: ["JioMart", "SDP"],
    default: "JioMart",
  },
  rider_type: {
    type: String,
  },
  payroll: {
    type: String,
  },
  city_id: {
    type: Number,
  },
  order_date: {
    type: Date,
  },
  checkin_status: {
    type: Number,
  },
  total_assigned_orders: {
    type: Number,
  },
  total_delivered_orders: {
    type: Number,
  },
  total_rejected_orders: {
    type: Number,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },  
  updated_time: {
    type: Date,
  },
});

module.exports = mongoose.model("driver_daily_details", driver_daily_details,"driver_daily_details");