const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const { loadPosts } = require('../../scripts/publish-blogs');
const root = path.resolve(__dirname, '../../frontend');

test('all four guides render covers, navigation, readable sections and article metadata on desktop and mobile', async () => {
  const posts = await loadPosts('2026-10-30T00:00:00Z');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const output = path.join(os.tmpdir(), 'sakinzo-blog-guides'); fs.mkdirSync(output, { recursive: true });
  try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/i18n/languages')) return route.fulfill({ json: { configured: false, languages: [{ code: 'en', name: 'English' }] } });
      if (url.pathname.endsWith('/blogs')) return route.fulfill({ json: posts });
      if (url.origin === 'https://sakinzo.test' || url.origin === 'https://sakinzo-work.github.io') {
        const pathname = url.pathname.replace(/^\/sakinzo\/frontend\//, '/');
        const file = path.resolve(root, `.${pathname}`);
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
        return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.webp') ? 'image/webp' : 'application/octet-stream' });
      }
      return route.fulfill({ body: '', contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' });
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('https://sakinzo.test/blog.html');
    await page.waitForFunction(() => document.querySelectorAll('.post-card').length === 4);
    for (const post of posts) {
      await page.goto(`https://sakinzo.test/blog.html?slug=${post.slug}`);
      await page.waitForFunction(() => window.SakinzoI18n && document.querySelector('.article-toc'));
      await page.locator('.page-hero-image').evaluate(image => image.decode());
      assert.equal(await page.locator('h1').textContent(), post.title);
      assert.ok(await page.locator('.article-content h2').count() >= 8);
      const schema = JSON.parse(await page.locator('#blog-article-schema').textContent());
      assert.equal(schema['@type'], 'BlogPosting'); assert.equal(schema.headline, post.title);
      assert.equal(schema.author.name, 'Sakinzo Team'); assert.ok(schema.url.endsWith(`?slug=${post.slug}`));
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), post.coverImage);
      assert.equal(await page.locator('.article-content a[href^="javascript:"]').count(), 0);
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${post.slug}: overflow at ${width}`);
        if (width !== 320) await page.screenshot({ path: path.join(output, `${post.slug}-${width}.png`) });
      }
      await page.locator('.article-toc a').first().click();
      const id = (await page.locator('.article-toc a').first().getAttribute('href')).slice(1);
      assert.ok(await page.locator(`#${id}`).isVisible());
      await page.locator(`#${id}`).screenshot({ path: path.join(output, `${post.slug}-section.png`) });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    assert.deepEqual(errors, []); console.log(`Blog guide screenshots: ${output}`);
  } finally { await browser.close(); }
});
