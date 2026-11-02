const mongoose = require('mongoose');
module.exports = mongoose.model('Testimonial', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: '' },
  initials: { type: String, default: '' },
  text: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
