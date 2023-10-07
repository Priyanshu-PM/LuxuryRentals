const express = require('express')
const mongoose = require('mongoose')
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    }
}, {timestamps: true});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  userSchema.methods.generateJWT = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
  };

module.exports = mongoose.model("User", userSchema);