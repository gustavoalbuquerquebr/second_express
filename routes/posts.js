"use strict";

const express = require("express");
const router = express.Router();

const privateRoute = require("../middleware/private");
const decodeToken = require("../middleware/decode");

const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).populate("author");
    res.render("posts", { posts });
  } catch {
    res.send("Error!");
  }
});

router.get("/new", [privateRoute, decodeToken], (req, res) => {
  res.render("new", { userid: req.userid });
});

router.post("/", privateRoute, async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.redirect("/posts");
  } catch {
    res.send("Error!");
  }
});

module.exports = router;
