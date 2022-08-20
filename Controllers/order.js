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
// @route POST /order/process
// @access Private
exports.processorder = asyncHandler(async (req, res, next) => {
  let eid = req.user.eid;
  let payroll = req.user.payroll;
  let vertical = req.user.vertical;
  let client_id = 2531;
  if(validator.equals(vertical,"JioMart")){
    client_id = 2460
  }else if(validator.equals(vertical,"NetMeds")){
    client_id = 2548
  }
  let city_id = req.user.city_id;
  let order_id = req.body.order_id;
  let order_status = req.body.order_status;
  let is_incentive_eligible = 0;
  if(validator.isEmpty(order_id)){
    return next(new ErrorResponse("Empty order id", 400));
  }
  if(!["6", "10"].includes(order_status)){
    return next(new ErrorResponse("Invalid order status", 400));
  }
  const orderResult = await order_details.findOne({oid:order_id});
  if(orderResult){
    return next(new ErrorResponse("Order Already exists", 400));
  }

  // add in order details
  const order = new order_details({
    oid: order_id,
    eid,
    vertical,
    client_id,
    city_id,
    order_status,
  });

  const orderSaveResult = await order.save();
  if (!orderSaveResult) {
    return next(new ErrorResponse("Error saving order", 400));
  }
  // increment values in daily and master
  let deliverReject = "Delivered";
  let update = {$inc:{total_assigned_orders:1,total_delivered_orders:1}}
  if(order_status == "10"){
    deliverReject = "Rejected";
    update = {$inc:{total_assigned_orders:1,total_rejected_orders:1}}
  }
  const dailyDetails = await driver_daily_details.findOneAndUpdate({eid},update,{new:true});
  const userDetails = await User.findOneAndUpdate({eid},update,{new:true});

  // if agency then order delivered
  if(validator.equals(payroll,"Agency") || order_status == "10"){
    res.status(200).json({
      success: true,
      msg: `Order ${deliverReject} successfully`,
      is_incentive_eligible
    });
  }
  // array for limit orders 25 for jiomart and prmium fruit 20

  const configutation = await reward_configuration.findOne( { "vertical" : vertical, "payroll" : payroll} );
  const orderLimitArr = configutation.reward_details[0]['reward_value'];

  let eligibleOrderLimit = orderLimitArr[1];
  for (let col of orderLimitArr){
    if(dailyDetails.total_delivered_orders <= col){
      eligibleOrderLimit = col;
      break;
    }
  }

  let orderToDeliver = eligibleOrderLimit - dailyDetails.total_delivered_orders
  let msg = `Deliver ${orderToDeliver} more orders for a scratch card`;
  if(orderToDeliver == 0){
    msg = `Congratulations! You are eligible for scratch card`;
    is_incentive_eligible = "1";
    addReward(req)
  }
  res.status(200).json({
    success: true,
    msg,
    is_incentive_eligible
  });
});
