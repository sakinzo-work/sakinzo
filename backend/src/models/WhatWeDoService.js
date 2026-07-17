const mongoose = require('mongoose');

module.exports = mongoose.model('WhatWeDoService', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true }
}, { timestamps: true }));
