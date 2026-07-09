const express = require('express');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/auth');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  res.status(201).json({ url: `/uploads/${req.file.filename}`, filename: req.file.originalname });
});
module.exports = router;
