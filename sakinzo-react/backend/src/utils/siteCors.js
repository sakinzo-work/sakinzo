// Google website translation serves the public site from its own HTTPS origin.
// Allow those exact mirrors only on the public endpoints used by that site.
function siteCors(origins) {
  const translated = new Set();
  for (const origin of origins) {
    try {
      const url = new URL(origin);
      if (url.protocol === 'https:' && !url.port) translated.add(`https://${url.hostname.replace(/-/g, '--').replace(/\./g, '-')}.translate.goog`);
    } catch {}
  }
  return (req, callback) => {
    const origin = req.get('Origin');
    const method = req.method === 'OPTIONS' ? (req.get('Access-Control-Request-Method') || '').toUpperCase() : req.method;
    const publicRead = method === 'GET' && (/^\/api\/public\/site-data\/?$/.test(req.path) || /^\/api\/(projects|blogs)(\/[^/]+)?\/?$/.test(req.path));
    const publicForm = method === 'POST' && /^\/api\/submissions\/?$/.test(req.path);
    const allowed = !origin || origins.includes(origin) || translated.has(origin) && (publicRead || publicForm);
    if (!allowed) return callback(new Error(`CORS blocked for origin: ${origin}`));
    callback(null, { origin: true, credentials: !translated.has(origin) });
  };
}
module.exports = siteCors;
