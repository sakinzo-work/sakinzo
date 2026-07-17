const express = require('express');
const WhatWeDoService = require('../models/WhatWeDoService');
const requireAuth = require('../middleware/auth');
const router = express.Router();

const services = [
  ['iot', 'IoT development services'],
  ['full-cycle', 'Full-cycle development'],
  ['ecommerce', 'eCommerce platform development'],
  ['blockchain', 'Blockchain development'],
  ['ai', 'AI Development Services'],
  ['fintech', 'Fintech Software Development Services']
];
const labels = Object.fromEntries(services);

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await WhatWeDoService.find();
    const saved = Object.fromEntries(rows.map(row => [row.key, row]));
    res.json(services.map(([key, label]) => ({ key, label, enabled: saved[key]?.enabled !== false })));
  } catch (err) { next(err); }
});

router.put('/:key', requireAuth, async (req, res, next) => {
  try {
    if (!labels[req.params.key]) return res.status(400).json({ message: 'Unknown service key' });
    const doc = await WhatWeDoService.findOneAndUpdate(
      { key: req.params.key },
      { enabled: req.body.enabled !== false },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ key: doc.key, label: labels[doc.key], enabled: doc.enabled });
  } catch (err) { next(err); }
});

module.exports = router;
