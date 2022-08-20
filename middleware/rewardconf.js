const reward_configuration = require("../models/reward_configuration");
const asyncHandler = require("./async");

//Reward Conf 
exports.rewardConf = asyncHandler(async (req, res, next) => {
    try {
      
      req.reward_details = await reward_configuration.find({"active" : 1})
      next();
    } catch (error) {
      return next(new ErrorResponse("Something went wrong!", 401));
    }
  });