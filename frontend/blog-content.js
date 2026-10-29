(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SakinzoBlogContent = api;
})(typeof window === 'object' ? window : globalThis, function () {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function safeLink(value) {
    if (/^https?:\/\/[^\s]+$/i.test(value)) {
      try { const url = new URL(value); if (!url.username && !url.password) return url.href; } catch {}
    }
    if (/^[a-z0-9-]+\.html(?:[?#][a-z0-9_=&%#.-]*)?$/i.test(value)) return value;
  }
  function inline(text) {
    const pattern = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
    let html = '', start = 0;
    for (const match of text.matchAll(pattern)) {
      html += escape(text.slice(start, match.index));
      if (match[1]) html += `<code>${escape(match[1])}</code>`;
      else if (match[2]) html += `<strong>${escape(match[2])}</strong>`;
      else {
        const href = safeLink(match[4]);
        html += href ? `<a href="${escape(href)}"${href.startsWith('http') ? ' rel="noopener noreferrer"' : ''}>${escape(match[3])}</a>` : escape(match[0]);
      }
      start = match.index + match[0].length;
    }
    return html + escape(text.slice(start));
  }
  function render(markdown = '') {
    const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
    const headings = [], used = new Map();
    let html = '', paragraph = [], list = '', code = null, language = '';
    const flushParagraph = () => { if (paragraph.length) { html += `<p>${inline(paragraph.join(' '))}</p>`; paragraph = []; } };
    const closeList = () => { if (list) { html += `</${list}>`; list = ''; } };
    const flushCode = () => { html += `<pre><code${language ? ` class="language-${escape(language)}"` : ''}>${escape(code.join('\n'))}</code></pre>`; code = null; };
    for (const line of lines) {
      const fence = line.match(/^\s*```([a-z0-9_-]*)\s*$/i);
      if (fence) {
        flushParagraph(); closeList();
        if (code) flushCode(); else { code = []; language = fence[1]; }
        continue;
      }
      if (code) { code.push(line); continue; }
      if (!line.trim()) { flushParagraph(); closeList(); continue; }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph(); closeList();
        const text = heading[2].replace(/\*\*|`/g, ''), level = heading[1].length === 3 ? 3 : 2;
        const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
        const count = (used.get(base) || 0) + 1; used.set(base, count);
        const id = `guide-${base}${count > 1 ? `-${count}` : ''}`;
        if (level === 2) headings.push({ id, text });
        html += `<h${level} id="${id}">${inline(heading[2])}</h${level}>`;
        continue;
      }
      const item = line.match(/^\s*(?:([-*])|\d+[.)])\s+(.+)$/);
      if (item) {
        flushParagraph(); const type = item[1] ? 'ul' : 'ol';
        if (list !== type) { closeList(); html += `<${type}>`; list = type; }
        html += `<li>${inline(item[2])}</li>`;
        continue;
      }
      closeList(); paragraph.push(line.trim());
    }
    flushParagraph(); closeList(); if (code) flushCode();
    return { html, headings };
  }
  return { render, escape };
});
