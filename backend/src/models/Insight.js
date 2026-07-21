const mongoose = require('mongoose');

function optionalHttpUrl(value) {
  if (!value) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
}

const insightSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Insight title is required'], trim: true, maxlength: 180 },
  desc: { type: String, required: [true, 'Insight description is required'], trim: true, maxlength: 1200 },
  category: { type: String, default: '', trim: true, maxlength: 80 },
  author: { type: String, default: 'Sakinzo Team', trim: true, maxlength: 100 },
  image: { type: String, default: '', trim: true },
  articleUrl: { type: String, default: '', trim: true, validate: { validator: optionalHttpUrl, message: 'Article URL must be a valid http(s) URL' } },
  publishedAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  readTime: { type: Number, default: 5, min: 1, max: 999 },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true });

insightSchema.index({ visible: 1, order: 1, publishedAt: -1 });
module.exports = mongoose.model('Insight', insightSchema);
