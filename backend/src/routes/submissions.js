const express = require('express');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const requireAuth = require('../middleware/auth');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('attachment'), async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.email || !body.desc) return res.status(400).json({ message: 'Name, email and description are required' });
    const doc = await Submission.create({
      name: body.name, email: body.email, phone: body.phone || '', company: body.company || '', desc: body.desc, source: body.source || '',
      attachmentUrl: req.file ? `/uploads/${req.file.filename}` : '', attachmentName: req.file ? req.file.originalname : ''
    });
    res.status(201).json({ ok: true, submission: doc });
  } catch (err) { next(err); }
});
router.get('/', requireAuth, async (req, res, next) => {
  try { res.json(await Submission.find().sort({ createdAt: -1 })); } catch (err) { next(err); }
});
router.put('/:id', requireAuth, async (req, res, next) => {
  try { res.json(await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { next(err); }
});
router.delete('/:id', requireAuth, async (req, res, next) => {
  try { await Submission.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (err) { next(err); }
});
module.exports = router;
