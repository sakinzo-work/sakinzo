const mongoose = require('mongoose');

module.exports = mongoose.model('ContactOffice', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, default: '', trim: true },
  address: { type: String, default: '', trim: true },
  mapUrl: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
