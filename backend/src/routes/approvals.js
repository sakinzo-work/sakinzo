const express = require('express');
const mongoose = require('mongoose');
const ApprovalRequest = require('../models/ApprovalRequest');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Insight = require('../models/Insight');
const Client = require('../models/Client');
const TeamMember = require('../models/TeamMember');
const Testimonial = require('../models/Testimonial');
const Stat = require('../models/Stat');
const MapLocation = require('../models/MapLocation');
const ContactOffice = require('../models/ContactOffice');
const ContactPageSetting = require('../models/ContactPageSetting');
const Section = require('../models/Section');
const WhatWeDoService = require('../models/WhatWeDoService');
const Submission = require('../models/Submission');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/auth').requireAdmin;
const { hasPermission, hasFullAccess, publicAdmin } = require('../utils/accessControl');
const { defaults: contactDefaults } = require('./contactPage');

const router = express.Router();

const MODEL_BY_RESOURCE = {
  projects: Project,
  blogs: Blog,
  insights: Insight,
  clients: Client,
  team: TeamMember,
  testimonials: Testimonial,
  stats: Stat,
  mapLocations: MapLocation,
  contactOffices: ContactOffice,
  submissions: Submission
};

const PROFILE_FIELDS = ['name', 'email', 'profileImage', 'phone', 'bio'];
const SECTION_KEYS = ['hero', 'why', 'clients', 'whatwedo', 'projects', 'services', 'cases', 'map', 'feedback', 'insights'];
const WHAT_WE_DO_KEYS = ['iot', 'full-cycle', 'ecommerce', 'blockchain', 'ai', 'fintech'];

function cleanObject(value = {}) {
  return JSON.parse(JSON.stringify(value || {}));
}

function requestTitle(body = {}) {
  return String(body.title || body.payload?.title || body.payload?.name || body.payload?.label || body.resourceId || '').trim();
}

async function applyApproval(row) {
  const payload = cleanObject(row.payload);
  const resourceType = row.resourceType;

  if (row.action === 'profile-update') {
    const targetId = row.resourceId || String(row.requester);
    const target = await Admin.findById(targetId);
    if (!target) throw Object.assign(new Error('Employee profile not found'), { status: 404 });
    PROFILE_FIELDS.forEach(field => {
      if (payload[field] !== undefined) target[field] = String(payload[field] || '').trim();
    });
    await target.save();
    return publicAdmin(target);
  }

  if (resourceType === 'contactPage') {
    if (!['create', 'update'].includes(row.action)) throw Object.assign(new Error('Unsupported contact page action'), { status: 400 });
    const doc = await ContactPageSetting.findOneAndUpdate(
      { key: 'main' },
      { ...payload, key: 'main' },
      { upsert: true, new: true, runValidators: true }
    ).lean();
    return { ...contactDefaults, ...doc };
  }

  if (resourceType === 'sections') {
    if (!SECTION_KEYS.includes(row.resourceId)) throw Object.assign(new Error('Unknown section key'), { status: 400 });
    const doc = await Section.findOneAndUpdate(
      { key: row.resourceId },
      { enabled: payload.enabled !== false },
      { upsert: true, new: true, runValidators: true }
    );
    return doc;
  }

  if (resourceType === 'whatWeDoServices') {
    if (!WHAT_WE_DO_KEYS.includes(row.resourceId)) throw Object.assign(new Error('Unknown service key'), { status: 400 });
    const doc = await WhatWeDoService.findOneAndUpdate(
      { key: row.resourceId },
      { enabled: payload.enabled !== false },
      { upsert: true, new: true, runValidators: true }
    );
    return doc;
  }

  const Model = MODEL_BY_RESOURCE[resourceType];
  if (!Model) throw Object.assign(new Error('Unsupported approval resource'), { status: 400 });

  if (row.action === 'create') {
    return Model.create(payload);
  }

  if (row.action === 'update') {
    if (!mongoose.isValidObjectId(row.resourceId)) throw Object.assign(new Error('Invalid item id'), { status: 400 });
    const doc = await Model.findByIdAndUpdate(row.resourceId, payload, { new: true, runValidators: true });
    if (!doc) throw Object.assign(new Error('Item not found'), { status: 404 });
    return doc;
  }

  if (row.action === 'delete') {
    if (!mongoose.isValidObjectId(row.resourceId)) throw Object.assign(new Error('Invalid item id'), { status: 400 });
    const doc = await Model.findByIdAndDelete(row.resourceId);
    if (!doc) throw Object.assign(new Error('Item not found'), { status: 404 });
    return doc;
  }

  if (row.action === 'reorder') {
    const items = Array.isArray(payload.items) ? payload.items : [];
    await Promise.all(items
      .filter(item => mongoose.isValidObjectId(item.id || item._id))
      .map((item, index) => Model.findByIdAndUpdate(item.id || item._id, { order: Number(item.order ?? index) })));
    return { ok: true };
  }

  throw Object.assign(new Error('Unsupported approval action'), { status: 400 });
}

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const filter = hasFullAccess(req.admin) ? {} : { requester: req.admin.id };
    if (req.query.status) filter.status = req.query.status;
    const rows = await ApprovalRequest.find(filter).sort({ createdAt: -1 }).lean();
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const resourceType = String(req.body.resourceType || '').trim();
    const action = String(req.body.action || '').trim();
    const payload = cleanObject(req.body.payload || {});
    const resourceId = String(req.body.resourceId || '').trim();
    if (!resourceType || !action) return res.status(400).json({ message: 'Resource and action are required' });
    if (hasFullAccess(req.admin)) return res.status(400).json({ message: 'Admins can save changes directly' });
    if (resourceType === 'admins' && action !== 'profile-update') {
      return res.status(400).json({ message: 'Employee account changes must use profile approval' });
    }
    if (action === 'profile-update') {
      if (resourceType !== 'admins') return res.status(400).json({ message: 'Invalid profile request' });
    } else if (!hasPermission(req.admin, resourceType)) {
      return res.status(403).json({ message: 'You do not have access to request this change' });
    }
    const approval = await ApprovalRequest.create({
      requester: req.admin.id,
      requesterName: req.admin.name || req.admin.email,
      resourceType,
      resourceId: action === 'profile-update' ? req.admin.id : resourceId,
      action,
      title: requestTitle(req.body),
      payload,
      status: 'pending'
    });
    res.status(201).json(approval);
  } catch (err) { next(err); }
});

router.put('/:id/approve', requireAdmin, async (req, res, next) => {
  try {
    const row = await ApprovalRequest.findById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Approval request not found' });
    if (row.status !== 'pending') return res.status(400).json({ message: 'This request is already reviewed' });
    const result = await applyApproval(row);
    row.status = 'approved';
    row.reviewedBy = req.admin.id;
    row.reviewedByName = req.admin.name || req.admin.email;
    row.reviewNote = String(req.body.reviewNote || '').trim();
    row.reviewedAt = new Date();
    row.resultId = String(result?._id || result?.id || row.resourceId || '');
    await row.save();
    res.json(row);
  } catch (err) { next(err); }
});

router.put('/:id/reject', requireAdmin, async (req, res, next) => {
  try {
    const row = await ApprovalRequest.findById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Approval request not found' });
    if (row.status !== 'pending') return res.status(400).json({ message: 'This request is already reviewed' });
    row.status = 'rejected';
    row.reviewedBy = req.admin.id;
    row.reviewedByName = req.admin.name || req.admin.email;
    row.reviewNote = String(req.body.reviewNote || '').trim();
    row.reviewedAt = new Date();
    await row.save();
    res.json(row);
  } catch (err) { next(err); }
});

module.exports = router;
