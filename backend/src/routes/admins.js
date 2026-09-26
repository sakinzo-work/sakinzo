const express = require('express');
const Admin = require('../models/Admin');
const requireAuth = require('../middleware/auth');
const router = express.Router();
const DEFAULT_OWNER_EMAIL = 'alishafaq782@gmail.com';

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const canManage = ['owner', 'admin'].includes(req.admin.role);
    const filter = canManage ? {} : { _id: req.admin.id };
    const rows = await Admin.find(filter).select('-password').sort({ createdAt: 1 });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    if (!['owner', 'admin'].includes(req.admin.role)) return res.status(403).json({ message: 'Only an admin can add employees' });
    const name = String(req.body.name || '').trim();
    const employeeId = String(req.body.employeeId || '').trim();
    const position = String(req.body.position || 'Employee').trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    if (!name || !email || password.length < 8) return res.status(400).json({ message: 'Name, valid email and password of at least 8 characters are required' });
    const role = req.admin.role === 'owner' && req.body.role === 'owner'
      ? 'owner'
      : req.body.role === 'admin' ? 'admin' : 'employee';
    const admin = await Admin.create({ name, employeeId: employeeId || undefined, position, email, password, role, active: req.body.active !== false });
    res.status(201).json({ _id: admin._id, name: admin.name, employeeId: admin.employeeId, position: admin.position, email: admin.email, role: admin.role, active: admin.active });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'An employee with this email or ID already exists' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const canManage = ['owner', 'admin'].includes(req.admin.role);
    if (!canManage && String(req.admin.id) !== req.params.id) return res.status(403).json({ message: 'You can only update your own account' });
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });
    const isDefaultOwner = admin.email === DEFAULT_OWNER_EMAIL;
    if (req.body.name !== undefined) admin.name = String(req.body.name).trim();
    if (req.body.email !== undefined && !isDefaultOwner) admin.email = String(req.body.email).toLowerCase().trim();
    if (canManage && req.body.employeeId !== undefined) admin.employeeId = String(req.body.employeeId).trim() || admin.employeeId;
    if (canManage && req.body.position !== undefined) admin.position = String(req.body.position).trim() || 'Employee';
    if (req.body.password) {
      if (String(req.body.password).length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
      admin.password = String(req.body.password);
    }
    if (canManage) {
      if (req.body.role !== undefined) {
        if (admin.role === 'owner' && req.admin.role !== 'owner') return res.status(403).json({ message: 'Only an owner can edit an owner account' });
        admin.role = isDefaultOwner || (req.admin.role === 'owner' && req.body.role === 'owner')
          ? 'owner'
          : req.body.role === 'admin' ? 'admin' : 'employee';
      }
      if (req.body.active !== undefined) admin.active = isDefaultOwner ? true : req.body.active !== false;
    }
    if (isDefaultOwner) { admin.role = 'owner'; admin.active = true; }
    await admin.save();
    res.json({ _id: admin._id, name: admin.name, employeeId: admin.employeeId, position: admin.position, email: admin.email, role: admin.role, active: admin.active });
  } catch (err) {
    if (err && err.code === 11000) return res.status(409).json({ message: 'An employee with this email or ID already exists' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!['owner', 'admin'].includes(req.admin.role)) return res.status(403).json({ message: 'Only an admin can remove employees' });
    if (String(req.admin.id) === req.params.id) return res.status(400).json({ message: 'You cannot delete your own account' });
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });
    if (admin.email === DEFAULT_OWNER_EMAIL) return res.status(400).json({ message: 'Default owner account cannot be removed' });
    if (admin.role === 'owner' && req.admin.role !== 'owner') return res.status(403).json({ message: 'Only an owner can remove an owner account' });
    await admin.deleteOne();
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
