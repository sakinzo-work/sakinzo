const mongoose = require('mongoose');
function isIotProject() {
  return (typeof this.get === 'function' ? this.get('category') : this.category) === 'IoT';
}
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    trim: true
  },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  images: [{ type: String }],
  modelImage: { type: String, default: '' },
  videoUrl: {
    type: String,
    default: '',
    required: isIotProject,
    validate: {
      validator(value) {
        if (!value) return !isIotProject.call(this);
        try { return ['http:', 'https:'].includes(new URL(value).protocol); }
        catch { return false; }
      },
      message: 'IoT video must be a valid http(s) URL'
    }
  },
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
}, { timestamps: true });

projectSchema.index({ visible: 1, order: 1 });
module.exports = mongoose.model('Project', projectSchema);
