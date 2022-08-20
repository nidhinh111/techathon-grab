const User = require("../models/User");
const driver_daily_details = require("../models/driver_daily_details");
const order_details = require("../models/order_details");
const driver_incentive_details = require("../models/driver_incentive_details");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const validator = require("validator");
const path = require("path");
// @route POST /api/v1/payout/getpayoutamount
// @access Private
exports.getpayoutamount = asyncHandler(async (req, res, next) => {
  console.log("hello");
  let eid = req.user.eid;
  let total_amount = req.user.total_amount;
  let withdrawable_amount = 0;
  const incentiveResult = await driver_incentive_details.find({eid,is_cash:1}).sort({created_time: -1}).lean();
  if(incentiveResult.length <= 0){
    return next(new ErrorResponse("You Don't have any incentive", 400));
  }
  let earnings = [];
  incentiveResult.forEach(function(doc){
    let singleEarning = {
      date:doc.created_time.toLocaleDateString(),
      amount:doc.value,
      earning_type:"Reward"
      };
    earnings.push(singleEarning);
  });
  res.render(path.join(__dirname + "../../views/Earnings"),{eid: req.user.eid, name : req.user.name,success: true,
    msg: "",
    total_amount,
    withdrawable_amount,
    earnings});
});
