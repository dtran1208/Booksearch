const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/developersApplications",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 
  }
);

module.exports = mongoose.connection;