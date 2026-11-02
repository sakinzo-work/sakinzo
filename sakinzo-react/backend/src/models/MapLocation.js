const mongoose = require('mongoose');
module.exports = mongoose.model('MapLocation', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  lat: { type: Number, required: true, min: -90, max: 90 },
  lng: { type: Number, required: true, min: -180, max: 180 },
  clientsCount: { type: Number, default: 1 },
  notes: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
