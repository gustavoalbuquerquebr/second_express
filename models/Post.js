"use strict";

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
});
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
