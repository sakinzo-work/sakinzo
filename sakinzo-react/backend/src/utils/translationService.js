const { createHash } = require('node:crypto');

const API = 'https://translation.googleapis.com/language/translate/v2';
const DAY = 24 * 60 * 60 * 1000;
function languageCode(value) {
  try { return Intl.getCanonicalLocales(String(value || ''))[0] || ''; }
  catch { return ''; }
}
function failure(message, status = 503) {
  return Object.assign(new Error(message), { status });
}

function createTranslationService({ apiKey = process.env.GOOGLE_TRANSLATE_API_KEY, fetchImpl = global.fetch, maxEntries = 10000 } = {}) {
  const cache = new Map(), pending = new Map();
  let languageCache, languageRequest;
  const configured = Boolean(apiKey);
  async function request(url, options = {}) {
    if (!configured) throw failure('Translation is not configured. Add GOOGLE_TRANSLATE_API_KEY to the backend environment.');
    let response;
    try {
      response = await fetchImpl(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
        signal: AbortSignal.timeout(15000)
      });
    } catch { throw failure('The translation service is temporarily unavailable. Please try again.'); }
    if (!response.ok) throw failure('The translation service could not complete this request. Please try again.', response.status === 429 ? 429 : 503);
    return response.json();
  }
  async function languages() {
    if (!configured) return [{ code: 'en', name: 'English' }];
    if (languageCache && languageCache.expires > Date.now()) return languageCache.value;
    if (!languageRequest) languageRequest = (async () => {
      const data = await request(`${API}/languages?target=en&model=nmt`);
      if (!Array.isArray(data.data?.languages) || !data.data.languages.length) throw failure('The translation language list is unavailable.');
      const unique = new Map([['en', { code: 'en', name: 'English' }]]);
      data.data.languages.forEach(item => {
        const code = languageCode(item.language);
        if (code) unique.set(code, { code, name: String(item.name || code), providerCode: item.language });
      });
      const value = [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
      languageCache = { value, expires: Date.now() + DAY };
      return value;
    })().finally(() => { languageRequest = null; });
    return languageRequest;
  }
  async function translate(texts, target) {
    if (target === 'en') return texts;
    const language = (await languages()).find(item => item.code === target);
    if (!language) {
      if (!configured) throw failure('Translation is not configured. Add GOOGLE_TRANSLATE_API_KEY to the backend environment.');
      throw failure('This language is not supported by the translation provider.', 400);
    }
    const keyFor = text => createHash('sha256').update(`${target}\0${text}`).digest('hex');
    const missing = [...new Set(texts)].filter(text => !cache.has(keyFor(text)));
    if (missing.length) {
      const batchKey = createHash('sha256').update(JSON.stringify([target, missing])).digest('hex');
      if (!pending.has(batchKey)) pending.set(batchKey, (async () => {
        const data = await request(API, { method: 'POST', body: JSON.stringify({ q: missing, source: 'en', target: language.providerCode || target, format: 'text' }) });
        const rows = data.data?.translations;
        if (!Array.isArray(rows) || rows.length !== missing.length || rows.some(row => typeof row.translatedText !== 'string' || !row.translatedText.trim())) {
          throw failure('The translation service returned an incomplete translation.');
        }
        missing.forEach((text, index) => {
          cache.set(keyFor(text), rows[index].translatedText);
        });
      })().finally(() => { pending.delete(batchKey); }));
      await pending.get(batchKey);
    }
    const result = texts.map(text => cache.get(keyFor(text)));
    while (cache.size > maxEntries) cache.delete(cache.keys().next().value);
    return result;
  }
  return { configured, languages, translate };
}

module.exports = { createTranslationService, languageCode };
