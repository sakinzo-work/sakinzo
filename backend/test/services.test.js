const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const services = require('../../frontend/services-data');
const root = path.join(__dirname, '../../frontend');

test('every advertised service has complete static content, valid local destinations and service SEO', () => {
  const titles = new Set(), headlines = new Set();
  assert.equal(services.length, 15);
  for (const service of services) {
    const html = fs.readFileSync(path.join(root, service.href), 'utf8');
    assert.equal([...html.matchAll(/<h1>/g)].length, 1, service.href);
    assert.ok(html.includes(service.headline.replace(/&/g, '&amp;')), service.href);
    assert.ok(!html.includes('src="subpage.js"'), `${service.href}: page content must not depend on JavaScript`);
    for (const section of ['overview', 'capabilities', 'deliverables', 'delivery', 'faq']) assert.ok(html.includes(`id="${section}"`), `${service.href}: ${section}`);
    assert.equal([...html.matchAll(/<details>/g)].length, 3, service.href);
    assert.ok(!html.includes('href="#"'), `${service.href}: placeholder link`);
    assert.ok(!titles.has(service.seoTitle), `${service.href}: duplicate SEO title`); titles.add(service.seoTitle);
    assert.ok(!headlines.has(service.headline), `${service.href}: duplicate headline`); headlines.add(service.headline);
    const schema = JSON.parse(html.match(/<script id="sakinzo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    const serviceSchema = schema['@graph'].find(item => item['@type'] === 'Service');
    assert.equal(serviceSchema.name, service.name);
    assert.ok(serviceSchema.url.endsWith(`/${service.href}`));
    assert.equal(schema['@graph'].find(item => item['@type'] === 'BreadcrumbList').itemListElement.length, 3);
    const hero = html.match(/<img class="service-hero-image"[^>]+>/)?.[0];
    assert.ok(hero?.includes(`src="${service.cover.image}"`), `${service.href}: matching hero cover`);
    assert.ok(fs.existsSync(path.join(root, service.cover.image)), `${service.href}: missing cover asset`);
    assert.ok(html.includes(`rel="preload" as="image" href="${service.cover.image}"`), `${service.href}: prioritize hero image`);
    const socialImage = new URL(service.cover.image, serviceSchema.url).href;
    assert.ok(html.includes(`property="og:image" content="${socialImage}"`), `${service.href}: matching social cover`);
    assert.equal(serviceSchema.image, socialImage);
    assert.equal(schema['@graph'].find(item => item['@type'] === 'WebPage').primaryImageOfPage.url, socialImage);
    for (const match of html.matchAll(/href="([^"#?]+\.html)(?:[?#][^"]*)?"/g)) if (!/^https?:/.test(match[1])) assert.ok(fs.existsSync(path.join(root, match[1])), `${service.href}: missing ${match[1]}`);
  }
});

test('service directory and homepage cards expose all service destinations without placeholder links', () => {
  const hub = fs.readFileSync(path.join(root, 'services.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const service of services) {
    assert.ok(hub.includes(`class="service-card" href="${service.href}"`), service.href);
    assert.ok(sitemap.includes(`/${service.href}</loc>`), service.href);
  }
  assert.ok(sitemap.includes('/services.html</loc>'));
  for (const filename of ['index.html', 'newindex.html', 'preindex.html', 'index1.html']) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const whatWeDo = [...html.matchAll(/<a\b[^>]*data-service-key="[^"]+"[^>]*>/g)];
    const accordion = [...html.matchAll(/<a\b[^>]*class="svc-link"[^>]*>/g)];
    assert.equal(whatWeDo.length, 6, filename); assert.equal(accordion.length, 7, filename);
    for (const [tag] of [...whatWeDo, ...accordion]) {
      const href = tag.match(/href="([^"]+)"/)[1];
      assert.ok(services.some(service => service.href === href), `${filename}: ${href}`);
    }
  }
});
