const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select('_id name email employeeId position role active');
    if (!admin || admin.active === false) return res.status(401).json({ message: 'Admin access is disabled' });
    req.admin = { id: String(admin._id), name: admin.name, email: admin.email, employeeId: admin.employeeId, position: admin.position, role: admin.role || 'employee' };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.admin || !['owner', 'admin'].includes(req.admin.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = requireAuth;
module.exports.requireAdmin = requireAdmin;
