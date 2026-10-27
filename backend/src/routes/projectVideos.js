const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { pipeline } = require('stream');
const requireAuth = require('../middleware/auth');

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/ogg']);
const getVideoBucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'projectVideos' });

function createRouter({ getBucket = getVideoBucket, authenticate = requireAuth, maxFileSize = MAX_VIDEO_SIZE } = {}) {
  const router = express.Router();
  const upload = multer({
    limits: { fileSize: maxFileSize, files: 1 },
    fileFilter: (req, file, cb) => VIDEO_TYPES.has(file.mimetype)
      ? cb(null, true)
      : cb(Object.assign(new Error('Choose an MP4, WebM or Ogg video'), { status: 400 })),
    storage: {
      _handleFile(req, file, cb) {
        let stream;
        try {
          stream = getBucket().openUploadStream(file.originalname, { metadata: { contentType: file.mimetype } });
        } catch (err) { return cb(err); }
        pipeline(file.stream, stream, err => {
          if (err) {
            return stream.abort().catch(() => {}).finally(() => cb(err));
          }
          cb(null, { id: stream.id, size: stream.length });
        });
      },
      _removeFile(req, file, cb) {
        if (!file.id) return cb(null);
        getBucket().delete(file.id).then(() => cb(null), cb);
      }
    }
  }).single('file');

  router.post('/', authenticate, (req, res, next) => {
    upload(req, res, err => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: 'Video must be 50 MB or smaller' });
        }
        if (err instanceof multer.MulterError) err.status = 400;
        return next(err);
      }
      if (!req.file) return res.status(400).json({ message: 'Video file is required' });
      res.status(201).json({ url: `/api/upload/videos/${req.file.id}`, filename: req.file.originalname });
    });
  });

  router.get('/:id', async (req, res, next) => {
    try {
      if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: 'Invalid video id' });
      const bucket = getBucket();
      const id = new mongoose.Types.ObjectId(req.params.id);
      const file = await bucket.find({ _id: id }).next();
      if (!file) return res.status(404).json({ message: 'Video not found' });
      let start = 0, end = file.length - 1;
      const range = req.get('Range');
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (match && (match[1] || match[2])) {
          if (match[1]) {
            start = Number(match[1]);
            if (match[2]) end = Math.min(Number(match[2]), end);
          } else {
            start = Math.max(0, file.length - Number(match[2]));
            if (Number(match[2]) === 0) start = file.length;
          }
        }
        if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= file.length) {
          return res.status(416).set('Content-Range', `bytes */${file.length}`).end();
        }
        res.status(206).set('Content-Range', `bytes ${start}-${end}/${file.length}`);
      }
      res.set({
        'Content-Type': VIDEO_TYPES.has(file.metadata?.contentType) ? file.metadata.contentType : 'application/octet-stream',
        'Content-Length': String(Math.max(0, end - start + 1)),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=2592000, immutable',
        'X-Content-Type-Options': 'nosniff'
      });
      if (req.method === 'HEAD' || !file.length) return res.end();
      const stream = bucket.openDownloadStream(id, { start, end: end + 1 });
      stream.on('error', err => res.headersSent ? res.destroy(err) : next(err));
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (err) { next(err); }
  });
  return router;
}

module.exports = createRouter();
module.exports.createRouter = createRouter;
