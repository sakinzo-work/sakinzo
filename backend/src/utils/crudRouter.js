const express = require('express');
const requireAuth = require('../middleware/auth');

module.exports = function crudRouter(Model, options = {}) {
  const router = express.Router();
  const publicList = options.publicList !== false;

  if (publicList) {
    router.get('/', async (req, res, next) => {
      try {
        const filter = req.query.all === 'true' ? {} : { visible: { $ne: false } };
        const rows = await Model.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(rows);
      } catch (err) { next(err); }
    });
  } else {
    router.get('/', requireAuth, async (req, res, next) => {
      try { res.json(await Model.find().sort({ order: 1, createdAt: -1 })); }
      catch (err) { next(err); }
    });
  }

  router.get('/admin/all', requireAuth, async (req, res, next) => {
    try { res.json(await Model.find().sort({ order: 1, createdAt: -1 })); }
    catch (err) { next(err); }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findOne({ _id: req.params.id, visible: { $ne: false } });
      if (!doc) return res.status(404).json({ message: 'Item not found' });
      res.set('Cache-Control', 'no-store');
      res.json(doc);
    } catch (err) { next(err); }
  });

  router.post('/', requireAuth, async (req, res, next) => {
    try { res.status(201).json(await Model.create(req.body)); }
    catch (err) { next(err); }
  });

  router.put('/:id', requireAuth, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: 'Item not found' });
      res.json(doc);
    } catch (err) { next(err); }
  });

  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Item not found' });
      res.json({ ok: true });
    } catch (err) { next(err); }
  });

  router.post('/reorder', requireAuth, async (req, res, next) => {
    try {
      const items = Array.isArray(req.body.items) ? req.body.items : [];
      await Promise.all(items.map((item, index) => Model.findByIdAndUpdate(item.id || item._id, { order: item.order ?? index })));
      res.json({ ok: true });
    } catch (err) { next(err); }
  });

  return router;
};
