const mongoose = require('mongoose');
module.exports = mongoose.model('TeamMember', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: '' },
  initials: { type: String, default: '' },
  color: { type: String, default: '#3b82f6' },
  portfolio: { type: String, default: '' },
  github: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
