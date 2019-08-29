"use strict";

const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log("Connected to database...");
  } catch (err) {
    console.error(err.message);
    // TOPIC: to stop the program, otherwise it keeps running
    process.exit(1);
  }
}

module.exports = connectDB;
