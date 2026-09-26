const express = require('express');
const ContactPageSetting = require('../models/ContactPageSetting');
const requireAuth = require('../middleware/auth');
const router = express.Router();

const defaults = {
  key: 'main',
  formTitle: 'Tell us about your project',
  formSubtitle: 'Fill in the details below and our team will get back to you within one business day.',
  sidebarLabel: 'Contact details',
  teamTitle: 'Meet the team',
  teamSubtitle: 'Ready to discuss your project',
  teamStatus: 'Team is online · Responds in < 24 h',
  officesTitle: 'Our Offices',
  methodsTitle: 'Other Ways to Reach Us',
  email: 'hello@sakinzo.com',
  emailLabel: 'Email us directly',
  linkedinUrl: 'https://www.linkedin.com/company/sakinzo',
  linkedinLabel: 'Connect on LinkedIn',
  footerCtaTitle: 'Ready to start your project?',
  footerCtaSubtitle: 'Get a free consultation from our experts.',
  footerCtaButton: 'Get in touch →'
};

const getSettings = async () => {
  const doc = await ContactPageSetting.findOne({ key: 'main' }).lean();
  return { ...defaults, ...(doc || {}) };
};

router.get('/', requireAuth, async (req, res, next) => {
  try { res.json(await getSettings()); } catch (err) { next(err); }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const payload = { ...req.body, key: 'main' };
    delete payload._id;
    const doc = await ContactPageSetting.findOneAndUpdate(
      { key: 'main' },
      payload,
      { upsert: true, new: true, runValidators: true }
    ).lean();
    res.json({ ...defaults, ...doc });
  } catch (err) { next(err); }
});

module.exports = { router, getSettings, defaults };
