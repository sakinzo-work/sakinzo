const mongoose = require('mongoose');

module.exports = mongoose.model('ContactPageSetting', new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  formTitle: { type: String, default: 'Tell us about your project', trim: true },
  formSubtitle: { type: String, default: 'Fill in the details below and our team will get back to you within one business day.', trim: true },
  sidebarLabel: { type: String, default: 'Contact details', trim: true },
  teamTitle: { type: String, default: 'Meet the team', trim: true },
  teamSubtitle: { type: String, default: 'Ready to discuss your project', trim: true },
  teamStatus: { type: String, default: 'Team is online · Responds in < 24 h', trim: true },
  officesTitle: { type: String, default: 'Our Offices', trim: true },
  methodsTitle: { type: String, default: 'Other Ways to Reach Us', trim: true },
  email: { type: String, default: 'hello@sakinzo.com', trim: true },
  emailLabel: { type: String, default: 'Email us directly', trim: true },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/company/sakinzo', trim: true },
  linkedinLabel: { type: String, default: 'Connect on LinkedIn', trim: true },
  footerCtaTitle: { type: String, default: 'Ready to start your project?', trim: true },
  footerCtaSubtitle: { type: String, default: 'Get a free consultation from our experts.', trim: true },
  footerCtaButton: { type: String, default: 'Get in touch →', trim: true }
}, { timestamps: true }));
