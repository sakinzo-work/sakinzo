const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '../../frontend');

test('every public HTML page has crawlable SEO and loads the shared language selector exactly once', () => {
  const files = fs.readdirSync(root).filter(file => file.endsWith('.html') && !/^(admin|ad|google.*)\.html$/.test(file));
  assert.ok(files.length > 20);
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8'), head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
    for (const expression of [/<title>[^<]+<\/title>/g, /name="description" content="[^"]+"/g, /rel="canonical" href="https:\/\/[^\"]+"/g, /property="og:title"/g, /name="twitter:title"/g, /src="seo\.js"/g, /src="i18n\.js"/g, /href="i18n\.css"/g]) assert.equal([...head.matchAll(expression)].length, 1, `${file}: ${expression}`);
    const schema = JSON.parse(head.match(/<script id="sakinzo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema['@graph'][0].inLanguage, 'en', file);
    assert.equal([...head.matchAll(/hreflang=/g)].length, 2, `${file}: only published English and x-default variants should be in static HTML`);
  }
});

test('sitemap includes the blog and public landing pages and excludes duplicate and empty project pages', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/blog\.html<\/loc>/);
  assert.match(sitemap, /\/ai-development\.html<\/loc>/);
  assert.doesNotMatch(sitemap, /\/(admin|ad|newindex|preindex|index1|constactus2|project)\.html/);
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 29);
  for (const file of ['newindex.html', 'preindex.html', 'index1.html', 'constactus2.html']) assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /name="robots" content="noindex, follow"/);
});
