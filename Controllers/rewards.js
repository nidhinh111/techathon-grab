const driver_daily_details = require("../models/driver_daily_details");
const inventory_details = require("../models/inventory_details");
const driver_incentive_details = require("../models/driver_incentive_details");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const validator = require("validator");
const path = require("path");
const User = require("../models/User");

exports.getreward = asyncHandler(async (req, res, next) => {
  let user_id = req.user.eid;
  if (validator.isEmpty(user_id)) {
    return next(new ErrorResponse("Empty user id", 400));
  }

  let userDetails = await driver_daily_details.findOne({ eid: user_id });

  if (userDetails) {
    if (userDetails.payroll == "Grab") {
      let InventoryDetails = await inventory_details.find({
        incentive_type: { $all: [1] },
        active: 1,
      });
      if (InventoryDetails) {
        const inventory =
          InventoryDetails[
            Math.floor(Math.random() * InventoryDetails.length) + 1
          ];
        if (inventory.inventory_id != 1) {
          await inventory_details.findOneAndUpdate(
            { inventory_id: inventory.inventory_id },
            { $inc: { quantity: -1 } }
          );
        }

        const doc = {
          eid: userDetails.eid,
          incentive_type: 1,
          incentive_desc: "Scratch Card",
          inventory_id: inventory.inventory_id,
          inventory_desc: inventory.description,
          status: 1,
          status_desc: "Pending",
          is_cash: inventory.is_cash,
          value: inventory.value,
          created_time: new Date(),
          modified_time: new Date(),
        };

        const insert = await driver_incentive_details.insertMany(doc);
        res.status(200).json({
          success: true,
          incentive_type: 1,
          incentive_details: [],
          incentive_won: inventory.description,
          is_cash: inventory.is_cash,
          value: inventory.value,
          driver_incentive_id: insert[0]._id,
        });
      } else {
        res.status(200).json({
          success: false,
          incentive_type: 0,
          incentive_details: [],
          incentive_won: " Please try later! ",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        incentive_type: 0,
        incentive_details: [],
        incentive_won: "Something went wrong. Please try later!",
      });
    }
  }
});

exports.addReward = async (req, res) => {
  let InventoryDetails = await inventory_details.find({
    incentive_type: { $all: [1] },
    active: 1,
  });
  if (InventoryDetails) {
    const inventory =
      InventoryDetails[Math.floor(Math.random() * InventoryDetails.length) + 1];
    if (inventory.inventory_id != 1) {
      await inventory_details.findOneAndUpdate(
        { inventory_id: inventory.inventory_id },
        { $inc: { quantity: -1 } }
      );
    }

    const doc = {
      eid: req.user.eid,
      incentive_type: 1,
      incentive_desc: "Scratch Card",
      inventory_id: inventory.inventory_id,
      inventory_desc: inventory.description,
      status: 1,
      status_desc: "Pending",
      is_cash: inventory.is_cash,
      value: inventory.value,
      rider : req.user._id,
      created_time: new Date(),
      modified_time: new Date(),
    };

    const insert = await driver_incentive_details.insertMany(doc);
  }
};

exports.showRewards = asyncHandler(async (req, res, next) => {
  let eid = req.user.eid;
  const rewards = await driver_incentive_details
    .find({ eid , is_cash : 1})
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  if (rewards.length <= 0) {
    return next(new ErrorResponse("You Don't have any incentive", 400));
  }
  let riderRewards = [];
  rewards.forEach(function (doc) {
    let reward = {
      id: doc._id.toString(),
      date: doc.createdAt,
      idesc: doc.inventory_desc,
      sdesc: doc.status_desc,
      status: doc.status,
    };
    riderRewards.push(reward);
  });

  res.render(path.join(__dirname + "../../views/Rewards"), {
    eid: req.user.eid,
    name: req.user.name,
    riderRewards,
  });
});

exports.redeem = asyncHandler(async (req, res, next) => {
  let user_id = req.user.eid;
  let incentiveId = req.body.incentiveid;
  console.log(incentiveId);
  if (validator.isEmpty(user_id)) {
    return next(new ErrorResponse("Empty user id", 400));
  }

  const reward = await driver_incentive_details
    .findById({ _id: incentiveId })
    .lean();

  if (reward) {
    //Update total value in user master
    const updateAmount = await User.findOneAndUpdate(
      { eid: user_id },
      { total_amount: req.user.total_amount + reward.value },
      { new: true }
    );

    //Update card status to processed in incentive details
    const updateCard = await driver_incentive_details.findByIdAndUpdate(
      { _id: incentiveId },
      { status: "2", status_desc: "Processed" },
      { new: true }
    );
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
});
