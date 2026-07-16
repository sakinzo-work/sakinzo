const mongoose = require('mongoose');
module.exports = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  images: [{ type: String }],
  demoUrl: { type: String, default: '' },
  creatorName: { type: String, default: '', trim: true },
  creatorPortfolio: { type: String, default: '', trim: true },
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
