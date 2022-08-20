const mongoose = require("mongoose");

const conn = async () => {
  const connection = await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = conn;
