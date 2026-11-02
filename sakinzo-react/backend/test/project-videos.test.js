const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');
const { Readable, Writable } = require('node:stream');
const express = require('express');
const mongoose = require('mongoose');
const { createRouter } = require('../src/routes/projectVideos');
const requireAuth = require('../src/middleware/auth');
const Project = require('../src/models/Project');

describe('project video API', () => {
// Exercise HTTP and multipart streaming without requiring an external database.
const files = new Map();
const deleted = [];
const bucket = {
  openUploadStream(filename, { metadata }) {
    const chunks = [];
    const stream = new Writable({
      write(chunk, encoding, cb) { chunks.push(chunk); stream.length += chunk.length; cb(); },
      final(cb) {
        files.set(String(stream.id), { _id: stream.id, filename, metadata, length: stream.length, data: Buffer.concat(chunks) });
        cb();
      }
    });
    stream.id = new mongoose.Types.ObjectId();
    stream.length = 0;
    stream.abort = async () => { files.delete(String(stream.id)); };
    return stream;
  },
  async delete(id) { deleted.push(String(id)); files.delete(String(id)); },
  find({ _id }) { return { next: async () => files.get(String(_id)) }; },
  openDownloadStream(id, { start, end }) { return Readable.from([files.get(String(id)).data.subarray(start, end)]); }
};

let server, base;
before(async () => {
  const app = express();
  app.use('/authenticated', createRouter({ getBucket: () => bucket, authenticate: requireAuth }));
  app.use('/api/upload/videos', createRouter({ getBucket: () => bucket, authenticate: (req, res, next) => next(), maxFileSize: 1024 }));
  app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message }));
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => {
    server.close(resolve);
    server.closeAllConnections();
  });
});

async function upload(data, type = 'video/mp4', filename = 'demo.mp4') {
  const body = new FormData();
  if (data !== undefined) body.append('file', new Blob([data], { type }), filename);
  return fetch(`${base}/api/upload/videos`, { method: 'POST', body });
}

test('video upload requires a login and validates the file', async () => {
  const unauthenticated = await fetch(`${base}/authenticated`, { method: 'POST' });
  assert.equal(unauthenticated.status, 401);
  const missing = await upload();
  assert.equal(missing.status, 400);
  const image = await upload('image data', 'image/png', 'image.png');
  assert.equal(image.status, 400);
  assert.match((await image.json()).message, /MP4, WebM or Ogg/);
});

test('uploaded video keeps its bytes, media type and original filename', async () => {
  for (const type of ['video/mp4', 'video/webm', 'video/ogg']) {
    const response = await upload('0123456789', type, 'project demo');
    assert.equal(response.status, 201);
    const video = await response.json();
    assert.equal(video.filename, 'project demo');
    assert.match(video.url, /^\/api\/upload\/videos\/[a-f\d]{24}$/);
    const download = await fetch(base + video.url);
    assert.equal(download.status, 200);
    assert.equal(download.headers.get('content-type'), type);
    assert.equal(download.headers.get('accept-ranges'), 'bytes');
    assert.equal(download.headers.get('content-length'), '10');
    assert.equal(await download.text(), '0123456789');
  }
});

test('oversized videos are rejected and removed from storage', async () => {
  const count = files.size, deletions = deleted.length;
  const response = await upload(Buffer.alloc(1025));
  assert.equal(response.status, 413);
  assert.equal(files.size, count);
  assert.equal(deleted.length, deletions + 1);
});

test('video seeking supports bounded, open-ended and suffix byte ranges', async () => {
  const video = await (await upload('0123456789')).json();
  for (const [range, expected, contentRange] of [
    ['bytes=2-5', '2345', 'bytes 2-5/10'],
    ['bytes=7-', '789', 'bytes 7-9/10'],
    ['bytes=-3', '789', 'bytes 7-9/10'],
    ['bytes=8-999', '89', 'bytes 8-9/10'],
    ['bytes=-999', '0123456789', 'bytes 0-9/10']
  ]) {
    const response = await fetch(base + video.url, { headers: { Range: range } });
    assert.equal(response.status, 206, range);
    assert.equal(response.headers.get('content-range'), contentRange);
    assert.equal(await response.text(), expected);
  }
  const head = await fetch(base + video.url, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), '10');
  assert.equal(await head.text(), '');
});

test('invalid ranges and missing videos return clear HTTP errors', async () => {
  const video = await (await upload('0123456789')).json();
  for (const range of ['bytes=10-', 'bytes=5-2', 'bytes=-0', 'bytes=-', 'bytes=0-1,4-5', 'invalid']) {
    const response = await fetch(base + video.url, { headers: { Range: range } });
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('content-range'), 'bytes */10');
    await response.arrayBuffer();
  }
  assert.equal((await fetch(`${base}/api/upload/videos/not-an-id`)).status, 400);
  assert.equal((await fetch(`${base}/api/upload/videos/${new mongoose.Types.ObjectId()}`)).status, 404);
});

test('project video is optional outside IoT and validates URLs in every category', () => {
  const fields = { title: 'Demo', creatorName: 'Creator', creatorPortfolio: 'https://example.com' };
  const noVideo = new Project({ ...fields, category: 'Web Development' });
  assert.equal(noVideo.validateSync(), undefined);
  const iot = new Project({ ...fields, category: 'IoT' });
  assert.ok(iot.validateSync().errors.videoUrl);
  for (const category of ['IoT', 'Web Development', 'Android App', 'Other']) {
    const valid = new Project({ ...fields, category, videoUrl: ' https://example.com/demo.mp4 ' });
    assert.equal(valid.validateSync(), undefined);
    assert.equal(valid.videoUrl, 'https://example.com/demo.mp4');
    const invalid = new Project({ ...fields, category, videoUrl: 'javascript:alert(1)' });
    assert.match(invalid.validateSync().errors.videoUrl.message, /Project video/);
  }
});

test('project preview device defaults to auto and accepts only supported views', () => {
  const fields = { title: 'Demo', category: 'Web Development', creatorName: 'Creator', creatorPortfolio: 'https://example.com' };
  assert.equal(new Project(fields).previewDevice, 'auto');
  for (const previewDevice of ['auto', 'phone', 'tablet', 'desktop']) {
    assert.equal(new Project({ ...fields, previewDevice }).validateSync(), undefined);
  }
  assert.ok(new Project({ ...fields, previewDevice: 'unknown' }).validateSync().errors.previewDevice);
});
});
