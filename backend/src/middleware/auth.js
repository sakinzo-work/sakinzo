const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { publicAdmin, hasFullAccess, canSaveDirect } = require('../utils/accessControl');
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select('_id name email employeeId position role active profileImage phone bio permissions');
    if (!admin || admin.active === false) return res.status(401).json({ message: 'Admin access is disabled' });
    req.admin = publicAdmin(admin);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.admin || !hasFullAccess(req.admin)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

function requireDirectSave(req, res, next) {
  if (!req.admin || !canSaveDirect(req.admin)) {
    return res.status(403).json({ message: 'Owner approval required before this change can go live' });
  }
  next();
}

module.exports = requireAuth;
module.exports.requireAdmin = requireAdmin;
module.exports.requireDirectSave = requireDirectSave;
