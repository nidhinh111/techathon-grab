const jwt = require("jsonwebtoken");
const User = require("../models/User");
const driver_daily_details = require("../models/driver_daily_details");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded.id);

    //Get daily details
    req.daily_details = await driver_daily_details.findOne({eid: req.user.eid}).sort({created_time : -1}).limit(1)
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});