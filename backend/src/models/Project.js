const mongoose = require('mongoose');
module.exports = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
