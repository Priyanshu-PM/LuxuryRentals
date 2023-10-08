const express = require('express')
const mongoose = require('mongoose')
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
      type: String,
      default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
    },
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password") || user.isNew) {
      const hash = await bcryptjs.hash(user.password, 10);
      user.password = hash;
    }
    return next();
  });
  

userSchema.methods.comparePassword = async function (password) {
    return bcryptjs.compareSync(password, this.password);
  };
  
  userSchema.methods.generateJWT = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
  };

module.exports = mongoose.model("User", userSchema);