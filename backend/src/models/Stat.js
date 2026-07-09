const mongoose = require('mongoose');
module.exports = mongoose.model('Stat', new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
