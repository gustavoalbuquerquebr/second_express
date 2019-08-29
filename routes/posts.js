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

router.get("/:id", decodeToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    res.render("post", { post, userid: req.userid || false });
  } catch (err) {
    res.send("No post found");
  }
});

router.delete("/:id", privateRoute, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

router.get("/:id/edit", privateRoute, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

router.put("/:id", privateRoute, async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/posts/${req.params.id}`);
});

module.exports = router;
