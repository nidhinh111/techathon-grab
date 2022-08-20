const mongoose = require("mongoose");
const reward_configuration = new mongoose.Schema({
  vertical: {
    type: String,
    unique: true,
    required: [true, "Please add vertical"]
  },
  rider_type: {
    type: String,
  },
  payroll:{
    type: String,
  },
  reward_details: [{
    reward_type : String,
    reward_value : {
      type:[Number]
    }
  }],
  created_time: {
    type: Date,
    default: Date.now,
  },  
  updated_time: {
    type: Date,
  },
});

module.exports = mongoose.model("reward_configuration", reward_configuration,"reward_configuration");