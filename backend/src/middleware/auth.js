const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select('_id name email role active');
    if (!admin || admin.active === false) return res.status(401).json({ message: 'Admin access is disabled' });
    req.admin = { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role || 'admin' };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
