const mongoose = require('mongoose');
module.exports = mongoose.model('Submission', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  desc: { type: String, required: true },
  source: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  attachmentName: { type: String, default: '' },
  read: { type: Boolean, default: false }
}, { timestamps: true }));
