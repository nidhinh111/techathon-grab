const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const conn = require("./config/db");
const errorHandler = require("./middleware/error");
const auth = require("./Routes/auth");
const order = require("./Routes/order");
const incentive = require("./Routes/incentive");
const rewards = require("./Routes/rewards");
const configuration = require("./Routes/configuration");
const payout = require("./Routes/payout");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const { protect } = require("./middleware/auth");
const { getpayoutamount } = require("./Controllers/payout");
const { rewardConf } = require("./middleware/rewardconf");
const { showRewards } = require("./Controllers/rewards");
const { leadersheep } = require("./Controllers/leadersheep");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

//Connect to db
conn();

//body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Cookie parser
app.use(cookieParser());

//sanitize routes
app.use(mongoSanitize());

/* //set security headers
app.use(helmet()); */

//Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(hpp());

app.use(cors());

app.use(express.static('public'));

app.use("/api/v1/auth", auth);
app.use("/api/v1/incentives", incentive);
app.use("/api/v1/order", order);
app.use("/api/v1/rewards", rewards);
app.use("/api/v1/payout", payout);
app.use("/api/v1/configuration", configuration);

// Set the view engine to ejs
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

app.get("/", function (req, res) {
  res.render(path.join(__dirname + "/views/index"))
});

app.get("/admin", function (req, res) {
  res.render(path.join(__dirname + "/views/admin"))
});

app.get("/dashboard",protect,function (req, res) {
  res.render(path.join(__dirname + "/views/Dashboard"),{name : "Aditya"})
});

app.get("/orders",protect, function (req, res) {
  res.render(path.join(__dirname + "/views/orders"),{eid: req.user.eid, name : req.user.name, delivered : req.daily_details.total_delivered_orders, returned : req.daily_details.total_rejected_orders})
});

app.get("/earnings",protect,getpayoutamount);

app.get("/rewards",protect, showRewards);

app.get("/configuration", rewardConf,function (req, res) {
  res.render(path.join(__dirname + "/views/configuration"),{reward_details: req.reward_details})
});

app.get("/leadersheep", leadersheep,function (req, res) {
  res.render(path.join(__dirname + "/views/leadersheep"),{reward_details: req.reward_details})
});

app.use(errorHandler);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err}`);
  server.close(() => process.exit(1));
});
