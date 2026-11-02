const mongoose = require('mongoose');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Blog title is required'], trim: true, maxlength: 180 },
  slug: { type: String, trim: true, lowercase: true, maxlength: 140 },
  excerpt: { type: String, required: [true, 'Blog excerpt is required'], trim: true, maxlength: 500 },
  body: { type: String, required: [true, 'Blog content is required'], trim: true, maxlength: 30000 },
  category: { type: String, default: 'Technology', trim: true, maxlength: 80 },
  author: { type: String, default: 'Sakinzo Team', trim: true, maxlength: 100 },
  coverImage: { type: String, default: '', trim: true },
  tags: [{ type: String, trim: true, maxlength: 50 }],
  readTime: { type: Number, default: 5, min: 1, max: 999 },
  publishedAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
}, { timestamps: true });

blogSchema.pre('validate', function ensureSlug(next) {
  if (!this.slug) this.slug = slugify(this.title);
  else this.slug = slugify(this.slug);
  next();
});

blogSchema.index({ slug: 1 });
blogSchema.index({ visible: 1, order: 1, publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
