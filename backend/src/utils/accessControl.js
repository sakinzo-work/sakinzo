const PERMISSION_KEYS = [
  'dashboard',
  'projects',
  'blogs',
  'insights',
  'clients',
  'team',
  'testimonials',
  'contactPage',
  'stats',
  'mapLocations',
  'whatWeDoServices',
  'sections'
];

const RESOURCE_PERMISSIONS = {
  projects: 'projects',
  blogs: 'blogs',
  insights: 'insights',
  clients: 'clients',
  team: 'team',
  testimonials: 'testimonials',
  stats: 'stats',
  mapLocations: 'mapLocations',
  contactOffices: 'contactPage',
  contactPage: 'contactPage',
  submissions: 'contactPage',
  whatWeDoServices: 'whatWeDoServices',
  sections: 'sections',
  admins: 'profile'
};

const OWNER_EMAILS = [...new Set([
  'alishafaq782@gmail.com',
  process.env.ADMIN_EMAIL
].map(email => String(email || '').toLowerCase().trim()).filter(Boolean))];

function sanitizePermissions(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(values.map(item => String(item || '').trim()).filter(key => PERMISSION_KEYS.includes(key)))];
}

function isDefaultOwner(admin) {
  return OWNER_EMAILS.includes(String(admin?.email || '').toLowerCase().trim());
}

function hasOwnerAccess(admin) {
  return admin?.role === 'owner' || isDefaultOwner(admin);
}

function hasFullAccess(admin) {
  return hasOwnerAccess(admin) || admin?.role === 'admin';
}

function canSaveDirect(admin) {
  return hasOwnerAccess(admin);
}

function hasPermission(admin, resource) {
  if (hasFullAccess(admin)) return true;
  const key = RESOURCE_PERMISSIONS[resource] || resource;
  return key === 'profile' || (admin?.permissions || []).includes(key);
}

function requireResourceRead(resource) {
  return (req, res, next) => {
    if (hasPermission(req.admin, resource)) return next();
    return res.status(403).json({ message: 'You do not have access to this section' });
  };
}

function publicAdmin(admin) {
  if (!admin) return null;
  const owner = hasOwnerAccess(admin);
  return {
    id: String(admin._id || admin.id),
    _id: String(admin._id || admin.id),
    name: admin.name,
    employeeId: admin.employeeId,
    position: admin.position,
    email: admin.email,
    role: owner ? 'owner' : admin.role || 'employee',
    active: admin.active !== false,
    profileImage: admin.profileImage || '',
    phone: admin.phone || '',
    bio: admin.bio || '',
    permissions: sanitizePermissions(admin.permissions),
    isOwner: owner,
    canSaveDirect: owner,
    canManageAccess: hasFullAccess(admin)
  };
}

module.exports = {
  PERMISSION_KEYS,
  RESOURCE_PERMISSIONS,
  sanitizePermissions,
  isDefaultOwner,
  hasOwnerAccess,
  hasFullAccess,
  canSaveDirect,
  hasPermission,
  requireResourceRead,
  publicAdmin
};
