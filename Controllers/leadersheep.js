const driver_incentive_details = require("../models/driver_incentive_details");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");

exports.leadersheep = asyncHandler(async (req, res, next) => {
  let leadersheepDetails = {};
  const leadershipResult = await driver_incentive_details.find({status:"2"}).populate("rider");
  if(leadershipResult.length > 0){
    leadershipResult.forEach(function(doc){
      if (leadersheepDetails[doc.eid]) {
        leadersheepDetails[doc.eid] += element.num;
      } else {
        leadersheepDetails[doc.eid] = element.num;
      }
    });
    
  }
  res.render(path.join(__dirname + "../../views/Earnings"),{eid: req.user.eid, name : req.user.name,leadersheepDetails});
});
