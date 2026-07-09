const express = require('express');
const Section = require('../models/Section');
const requireAuth = require('../middleware/auth');
const router = express.Router();
const keys = ['hero','why','clients','whatwedo','projects','services','cases','map','feedback','insights'];

router.get('/', requireAuth, async (req, res, next) => {
  try { res.json(await Section.find().sort({ key: 1 })); } catch (err) { next(err); }
});
router.put('/:key', requireAuth, async (req, res, next) => {
  try {
    if (!keys.includes(req.params.key)) return res.status(400).json({ message: 'Unknown section key' });
    const doc = await Section.findOneAndUpdate({ key: req.params.key }, { enabled: req.body.enabled !== false }, { upsert: true, new: true });
    res.json(doc);
  } catch (err) { next(err); }
});
module.exports = router;
