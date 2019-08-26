"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost/demo", { useNewUrlParser: true });

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
});
const Post = mongoose.model("Post", PostSchema);

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

const app = express();
app.set("view engine", "ejs");
app.set("views", "./");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch {
    res.send("Error!");
  }
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/", async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.redirect("/");
  } catch {
    res.send("Error!");
  }
});

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
      throw "User doesn't exist";
    }

    const check = await bcrypt.compare(req.body.password, foundUser.password);

    if (check) {
      res.redirect("/");
    } else {
      throw "Wrong password";
    }
  } catch (err) {
    res.send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("..."));
