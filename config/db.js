"use strict";

const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://gustavo:pass123@cluster0-grgdl.mongodb.net/test?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
      },
    );

    console.log("Connected to database...");
  } catch (err) {
    console.error(err.message);
    // TOPIC: to stop the program, otherwise it keeps running
    process.exit(1);
  }
}

module.exports = connectDB;
