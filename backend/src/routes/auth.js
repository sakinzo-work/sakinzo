const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const requireAuth = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: String(email || '').toLowerCase().trim() });
    if (!admin || admin.active === false || !(await admin.comparePassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name, role: admin.role || 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role || 'admin' } });
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, (req, res) => res.json({ admin: req.admin }));
module.exports = router;
