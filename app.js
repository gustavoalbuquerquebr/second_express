"use strict";

// require libraries
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

// express's settings and middleware
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to database
const connectDB = require("./config/db");
connectDB();

// require models
const Post = require("./models/Post");
const User = require("./models/User");

// require custom middleware
const decodeToken = require("./middleware/decode");
const privateRoute = require("./middleware/private");

const secretKey = process.env.SECRET_KEY;
const tokenExpiresIn = parseInt(process.env.TOKEN_EXPIRES_IN);

app.get("/", decodeToken, async (req, res) => {
  if (!req.userid) {
    return res.render("home", { user: false });
  }

  try {
    const user = await User.findById(req.userid);
    res.render("home", { user });
  } catch {
    res.send("Error");
  }
});

app.use("/posts", require("./routes/posts"));

app.get("/register", (req, res) => {
  res.render("register", { errors: false });
});

app.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long"),
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        errors = errors.errors.map(err => err.msg);
        // return res.send(errMsg);
        return res.render("register", { errors });
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create(req.body);

      const payload = { userid: newUser.id };
      const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiresIn });
      res
        .cookie("token", token, { maxAge: tokenExpiresIn * 1000 })
        .redirect("/");
    } catch {
      res.send("Error");
    }
  },
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      // TOPIC: return is needed, otherwise the engine will keep executing this function until the end
      return res.send("User doesn't exist");
    }

    const check = await bcrypt.compare(req.body.password, foundUser.password);

    if (!check) {
      return res.send("Wrong password");
    }

    const payload = { userid: foundUser.id };
    const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiresIn });
    res.cookie("token", token, { maxAge: tokenExpiresIn * 1000 }).redirect("/");
  } catch (err) {
    res.send("Error!");
  }
});

app.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at ${PORT}...`));
