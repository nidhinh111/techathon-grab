const User = require("../models/User");
const driver_daily_details = require("../models/driver_daily_details");
const order_details = require("../models/order_details");
const reward_configuration = require("../models/reward_configuration");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const validator = require("validator");
const { addReward } = require("./rewards");
// @route POST /configuration/save
// @access Private
exports.save = asyncHandler(async (req, res, next) => {
  let rewardId = req.body.rewardId;
  let rewardTrigger = req.body.rewardTrigger;
  if(validator.isEmpty(rewardId)){
    return next(new ErrorResponse("Empty reward id", 400));
  }
  if(validator.isEmpty(rewardTrigger)){
    return next(new ErrorResponse("Empty reward trigger", 400));
  }
  console.log(typeof(rewardId));
  let rewardValue = rewardTrigger.split(",");
  let rewardValueArr = [];
  rewardValue.forEach((singleItem)=>{
    rewardValueArr.push(parseInt(singleItem));
  })
  const rewardConfigResult = await reward_configuration.findByIdAndUpdate({_id:rewardId},{'$set' : {'reward_details.0.reward_value': rewardValueArr}});
  res.status(200).json({
    success: true,
    msg:""
  });
});
