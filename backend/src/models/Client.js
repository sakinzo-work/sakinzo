const mongoose = require('mongoose');
module.exports = mongoose.model('Client', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
