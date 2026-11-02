const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const cors = require('cors');
const siteCors = require('../src/utils/siteCors');

test('translated public website can load dynamic data and submit forms without opening admin endpoints or unrelated origins', async () => {
  const app = express(); app.use(cors(siteCors(['https://sakinzo-work.github.io', 'http://localhost:5500'])));
  app.use((req, res) => res.json({ ok: true }));
  app.use((error, req, res, next) => res.status(403).json({ message: error.message }));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = `http://127.0.0.1:${server.address().port}`, origin = 'https://sakinzo--work-github-io.translate.goog';
  try {
    for (const [method, url] of [['GET', '/api/public/site-data'], ['GET', '/api/projects'], ['GET', '/api/projects/123'], ['GET', '/api/blogs'], ['POST', '/api/submissions']]) {
      const response = await fetch(base + url, { method, headers: { Origin: origin } });
      assert.equal(response.status, 200, `${method} ${url}`);
      assert.equal(response.headers.get('access-control-allow-origin'), origin);
      assert.equal(response.headers.get('access-control-allow-credentials'), null);
    }
    const preflight = await fetch(base + '/api/submissions', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'Content-Type' } });
    assert.equal(preflight.status, 204);
    for (const url of ['/api/admins', '/api/auth/login', '/api/projects/admin/all', '/api/blogs/admin/all', '/api/submissions']) {
      assert.equal((await fetch(base + url, { headers: { Origin: origin } })).status, 403, url);
    }
    assert.equal((await fetch(base + '/api/projects/123', { method: 'PUT', headers: { Origin: origin } })).status, 403);
    for (const untrusted of ['https://random.translate.goog', 'https://sakinzo--work-github-io.translate.goog.attacker.test', 'https://attacker.test']) {
      assert.equal((await fetch(base + '/api/public/site-data', { headers: { Origin: untrusted } })).status, 403);
    }
    assert.equal((await fetch(base + '/api/admins', { headers: { Origin: 'https://sakinzo-work.github.io' } })).headers.get('access-control-allow-credentials'), 'true');
  } finally { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); }
});
