const mongoose = require('mongoose');
module.exports = mongoose.model('Project', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  images: [{ type: String }],
  demoUrl: { type: String, default: '' },
  creatorName: { type: String, required: [true, 'Creator name is required'], trim: true },
  creatorPortfolio: {
    type: String,
    required: [true, 'Creator portfolio URL is required'],
    trim: true,
    validate: {
      validator(value) {
        try { return ['http:', 'https:'].includes(new URL(value).protocol); }
        catch { return false; }
      },
      message: 'Creator portfolio must be a valid http(s) URL'
    }
  },
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true }));
