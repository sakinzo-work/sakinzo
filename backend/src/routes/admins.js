const express = require('express');
const Admin = require('../models/Admin');
const requireAuth = require('../middleware/auth');
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const filter = req.admin.role === 'owner' ? {} : { _id: req.admin.id };
    const rows = await Admin.find(filter).select('-password').sort({ createdAt: 1 });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.admin.role !== 'owner') return res.status(403).json({ message: 'Only an owner can add admin users' });
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    if (!name || !email || password.length < 8) return res.status(400).json({ message: 'Name, valid email and password of at least 8 characters are required' });
    const admin = await Admin.create({ name, email, password, role: req.body.role === 'owner' ? 'owner' : 'admin', active: req.body.active !== false });
    res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role, active: admin.active });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'An admin with this email already exists' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (req.admin.role !== 'owner' && String(req.admin.id) !== req.params.id) return res.status(403).json({ message: 'You can only update your own account' });
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });
    if (req.body.name !== undefined) admin.name = String(req.body.name).trim();
    if (req.body.email !== undefined) admin.email = String(req.body.email).toLowerCase().trim();
    if (req.body.password) {
      if (String(req.body.password).length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
      admin.password = String(req.body.password);
    }
    if (req.admin.role === 'owner') {
      if (req.body.role !== undefined) admin.role = req.body.role === 'owner' ? 'owner' : 'admin';
      if (req.body.active !== undefined) admin.active = req.body.active !== false;
    }
    await admin.save();
    res.json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role, active: admin.active });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'An admin with this email already exists' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (req.admin.role !== 'owner') return res.status(403).json({ message: 'Only an owner can remove admin users' });
    if (String(req.admin.id) === req.params.id) return res.status(400).json({ message: 'You cannot delete your own account' });
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });
    await admin.deleteOne();
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
