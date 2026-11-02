const express = require('express');
const { createTranslationService, languageCode } = require('../utils/translationService');

function createRouter({ service = createTranslationService(), requestLimit = 120, characterLimit = 200000 } = {}) {
  const router = express.Router(), clients = new Map();
  let budget = { at: Date.now(), characters: 0 };
  router.get('/languages', async (req, res, next) => {
    try {
      const languages = await service.languages();
      res.set('Cache-Control', 'public, max-age=300');
      res.json({ configured: service.configured, languages: languages.map(({ code, name }) => ({ code, name })) });
    } catch (error) { next(error); }
  });
  router.post('/translate', async (req, res, next) => {
    try {
      const { texts, target } = req.body || {};
      const code = languageCode(target);
      if (!code || !Array.isArray(texts) || !texts.length || texts.length > 100 || texts.some(text => typeof text !== 'string' || !text.trim() || [...text].length > 5000)) {
        return res.status(400).json({ message: 'Provide a valid target language and 1–100 nonempty text strings of up to 5,000 characters each.' });
      }
      const characters = texts.reduce((total, text) => total + [...text].length, 0);
      if (characters > 20000) return res.status(413).json({ message: 'Translate at most 20,000 characters per request.' });
      const now = Date.now();
      for (const [ip, row] of clients) if (now - row.at > 600000) clients.delete(ip);
      const client = clients.get(req.ip) || { at: now, count: 0 };
      if (client.count >= requestLimit || clients.size >= 10000 && !clients.has(req.ip)) {
        res.set('Retry-After', '600');
        return res.status(429).json({ message: 'Too many translation requests. Please try again later.' });
      }
      if (now - budget.at > 60000) budget = { at: now, characters: 0 };
      if (budget.characters + characters > characterLimit) {
        res.set('Retry-After', '60');
        return res.status(429).json({ message: 'Translation is busy. Please try again shortly.' });
      }
      client.count++; clients.set(req.ip, client); budget.characters += characters;
      const translations = await service.translate(texts, code);
      res.set('Cache-Control', 'no-store');
      res.json({ language: code, translations });
    } catch (error) { next(error); }
  });
  return router;
}
module.exports = createRouter();
module.exports.createRouter = createRouter;
