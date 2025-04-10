const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("Mongo URI not present");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "roomBooking",
    });

    isConnected = true;
    console.log("DB connected");

    await Promise.all([
      require("../models/room").init(),
      require("../models/building").init(),
      require("../models/bookedrooms").init(),
      require("../models/user").init(),
    ]);
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
};

module.exports = { connectToDB };
