"use strict";

const express = require("express");
const router = express.Router();
const privateRoute = require("../middleware/private");

const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("posts", { posts });
  } catch {
    res.send("Error!");
  }
});

router.get("/new", privateRoute, (req, res) => {
  res.render("new");
});

router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.redirect("/posts");
  } catch {
    res.send("Error!");
  }
});

module.exports = router;
