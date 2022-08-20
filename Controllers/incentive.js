const User = require("../models/User");
const driver_incentive_details = require("../models/driver_incentive_details");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const validator = require("validator");
// @route POST /order/process
// @access Private
exports.getallincentives = asyncHandler(async (req, res, next) => {
  let today = new Date();
  today.setDate(today.getDate() - 45); //45 days data
  let user_id = req.body.user_id;
  if (validator.isEmpty(user_id)) {
    return next(new ErrorResponse("Empty user id", 400));
  }

  const incentives = await driver_incentive_details.find({
    eid: req.user.eid,
    created_time: { $gte: "today" },
  },'incentive_type incentive_won status_desc status created_time').lean();
  res.status(200).json({
    success: true,
    incentives: incentives,
  });
});
