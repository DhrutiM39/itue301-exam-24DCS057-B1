require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async function connect() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub";
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
