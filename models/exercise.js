const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date
  }
});

module.exports = exerciseSchema;
