const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const Exercise = require("./exercise");
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  exercises: [Exercise]
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
