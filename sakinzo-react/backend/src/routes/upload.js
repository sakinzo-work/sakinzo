const express = require('express');
const multer = require('multer');
const requireAuth = require('../middleware/auth');
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/')
    ? cb(null, true)
    : cb(Object.assign(new Error('Only image uploads are allowed'), { status: 400 }))
});
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.status(201).json({ url: dataUrl, filename: req.file.originalname });
});
module.exports = router;
