const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const { createTranslationService } = require('../src/utils/translationService');
const { createRouter } = require('../src/routes/i18n');

function provider(handler) {
  const calls = [];
  const service = createTranslationService({ apiKey: 'private-test-key', fetchImpl: async (url, options) => {
    calls.push({ url, options });
    const payload = url.includes('/languages?') ? { data: { languages: [{ language: 'en', name: 'English' }, { language: 'hi', name: 'Hindi' }, { language: 'iw', name: 'Hebrew' }] } } : handler(JSON.parse(options.body));
    return { ok: true, json: async () => payload };
  } });
  return { service, calls };
}

test('translation uses official provider, keeps secrets server-side, caches duplicate text and normalizes language aliases', async () => {
  const { service, calls } = provider(body => ({ data: { translations: body.q.map(text => ({ translatedText: `अनुवाद ${text}` })) } }));
  const languages = await service.languages();
  assert.ok(languages.some(item => item.code === 'he'));
  assert.deepEqual(await service.translate(['Hello', 'Hello', 'World'], 'hi'), ['अनुवाद Hello', 'अनुवाद Hello', 'अनुवाद World']);
  assert.deepEqual(await service.translate(['Hello'], 'hi'), ['अनुवाद Hello']);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(call => !call.url.includes('private-test-key')));
  const request = JSON.parse(calls[1].options.body);
  assert.deepEqual(request, { q: ['Hello', 'World'], source: 'en', target: 'hi', format: 'text' });
  assert.equal(calls[1].options.headers['X-Goog-Api-Key'], 'private-test-key');
  assert.deepEqual(await service.translate(['English'], 'en'), ['English']);
  await assert.rejects(() => service.translate(['Hello'], 'xx'), error => error.status === 400);
});

test('simultaneous identical translation batches share one provider request', async () => {
  const { service, calls } = provider(body => ({ data: { translations: body.q.map(() => ({ translatedText: 'नमस्ते' })) } }));
  await Promise.all([service.translate(['Hello'], 'hi'), service.translate(['Hello'], 'hi')]);
  assert.equal(calls.length, 2);
});

test('missing configuration and provider failures never masquerade as successful translations', async () => {
  const unconfigured = createTranslationService({ apiKey: '' });
  assert.equal(unconfigured.configured, false);
  assert.deepEqual(await unconfigured.languages(), [{ code: 'en', name: 'English' }]);
  await assert.rejects(() => unconfigured.translate(['Hello'], 'hi'), /not configured/);
  const { service } = provider(() => ({ data: { translations: [] } }));
  await assert.rejects(() => service.translate(['Hello'], 'hi'), /incomplete translation/);
  const failed = createTranslationService({ apiKey: 'private', fetchImpl: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(() => failed.languages(), error => error.status === 503 && !error.message.includes('private'));
});

async function withApi(fn, options = {}) {
  const service = options.service || { configured: true, languages: async () => [{ code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi', providerCode: 'hi' }], translate: async texts => texts.map(() => 'नमस्ते') };
  const app = express(); app.use(express.json()); app.use('/api/i18n', createRouter({ service, ...options }));
  app.use((error, req, res, next) => res.status(error.status || 500).json({ message: error.message }));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  try { await fn(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }); }
}
const post = (base, body) => fetch(`${base}/api/i18n/translate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('public API exposes supported languages, translates text and rejects malformed/oversized requests', async () => {
  await withApi(async base => {
    const languages = await fetch(`${base}/api/i18n/languages`).then(response => response.json());
    assert.equal(languages.configured, true); assert.equal(languages.languages.length, 2);
    assert.equal(languages.languages[1].providerCode, undefined);
    const response = await post(base, { target: 'hi', texts: ['Hello'] });
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { language: 'hi', translations: ['नमस्ते'] });
    for (const body of [{ texts: ['Hello'] }, { target: 'hi', texts: [] }, { target: 'hi', texts: [null] }, { target: 'hi', texts: [''] }, { target: 'hi', texts: ['x'.repeat(5001)] }, { target: '../hi', texts: ['Hello'] }]) assert.equal((await post(base, body)).status, 400);
    assert.equal((await post(base, { target: 'hi', texts: Array(5).fill('x'.repeat(5000)) })).status, 413);
  });
});

test('public API limits repeated requests and total provider characters', async () => {
  await withApi(async base => {
    assert.equal((await post(base, { target: 'hi', texts: ['Hello'] })).status, 200);
    const limited = await post(base, { target: 'hi', texts: ['Hello'] });
    assert.equal(limited.status, 429); assert.ok(limited.headers.get('retry-after'));
  }, { requestLimit: 1 });
  await withApi(async base => {
    assert.equal((await post(base, { target: 'hi', texts: ['Hello'] })).status, 429);
  }, { characterLimit: 3 });
});
