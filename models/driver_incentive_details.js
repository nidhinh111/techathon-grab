const mongoose = require("mongoose");
const driver_incentive_details = new mongoose.Schema(
  {
    eid: {
      type: String,
      unique: true,
      required: [true, "Please add an eid"],
    },
    incentive_type: {
      type: String,
    },
    incentive_desc: {
      type: String,
    },
    inventory_id: {
      type: String,
    },
    inventory_desc: {
      type: String,
    },
    status: {
      type: String,
    },
    is_cash: {
      type: Number,
    },
    value: {
      type: Number,
    },
    status_desc: {
      type: String,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "driver_incentive_details",
  driver_incentive_details,
  "driver_incentive_details"
);
