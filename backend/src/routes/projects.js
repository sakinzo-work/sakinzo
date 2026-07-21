const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const writableFields = [
  'title', 'category', 'desc', 'img', 'images', 'modelImage', 'videoUrl',
  'demoUrl', 'creatorName', 'creatorPortfolio', 'tags', 'order', 'visible'
];

function cleanPayload(body = {}) {
  return Object.fromEntries(writableFields.filter(key => body[key] !== undefined).map(key => [key, body[key]]));
}

function validId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project id' });
  next();
}

router.get('/', async (req, res, next) => {
  try {
    const rows = await Project.find({ visible: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json(rows);
  } catch (err) { next(err); }
});

router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json(await Project.find().sort({ order: 1, createdAt: -1 }).lean());
  } catch (err) { next(err); }
});

router.post('/reorder', requireAuth, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const operations = items.filter(item => mongoose.isValidObjectId(item.id || item._id)).map((item, index) => ({
      updateOne: { filter: { _id: item.id || item._id }, update: { $set: { order: Number(item.order ?? index) } } }
    }));
    if (operations.length) await Project.bulkWrite(operations);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/:id', validId, async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, visible: { $ne: false } }).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(project);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const project = await Project.create(cleanPayload(req.body));
    res.status(201).json(project);
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, validId, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    Object.assign(project, cleanPayload(req.body));
    if (project.category === 'IoT' && !project.videoUrl) {
      return res.status(400).json({ message: 'IoT video URL is required' });
    }
    await project.save({ validateModifiedOnly: true });
    res.json(project);
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, validId, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
