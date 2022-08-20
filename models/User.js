const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({

/* {
  "total_checkin_days": 18,
  "created_time": {
    "$date": {
      "$numberLong": "1660511152229"
    }
  },
  "updated_time": {
    "$date": {
      "$numberLong": "1660511152229"
    }
  }
} */
  eid: {
    type: String,
    unique: true,
    required: [true, "Please add an eid"]
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  vertical: {
    type: String,
    enum: ["Jiomart", "SDP"],
    default: "Jiomart",
  },
  rider_type: {
    type: String,
  },
  payroll: {
    type: String,
  },
  city_id: {
    type: String,
  },
  total_amount: {
    type: Number,
  },
  overall_rating: {
    type: Number,
  },
  delivery_rating: {
    type: Number,
  },
  checkin_rating: {
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
  total_days: {
    type: Number,
  },
  total_checkin_days: {
    type: Number,
  },
/*   role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  }, */
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

//Check user entered password to hashed password while login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");

  //hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  //Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resettoken;
};

module.exports = mongoose.model("User", UserSchema,"driver_master_details");