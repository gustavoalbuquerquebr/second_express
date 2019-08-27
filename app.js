"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
connectDB();

const Post = require("./models/Post");
const User = require("./models/User");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/posts", require("./routes/posts"));

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);

    const newUser = User.create({
      username: req.body.username,
      password: hash,
    });

    res.redirect("/");
  } catch {
    res.send("Error!");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    if (!foundUser) {
      // TOPIC: return is needed, otherwise the engine will keep executing this function until the end
      return res.send("User doesn't exist");
    }

    const check = await bcrypt.compare(req.body.password, foundUser.password);
    check ? res.redirect("/") : res.send("Wrong password");
  } catch (err) {
    res.send("Error!");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started at ${PORT}...`));
