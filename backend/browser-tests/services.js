const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');
const services = require('../../frontend/services-data');
const root = path.join(__dirname, '../../frontend');
const origin = 'https://sakinzo.test';

async function setup(browser) {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/i18n/languages')) return route.fulfill({ json: { configured: false, languages: [{ code: 'en', name: 'English' }] } });
    if (url.pathname.endsWith('/public/site-data')) return route.fulfill({ json: { projects: [], clients: [], stats: [], team: [], testimonials: [], mapLocations: [], sections: {}, insights: [], blogs: [] } });
    if (url.pathname.endsWith('/blogs')) return route.fulfill({ json: [] });
    if (url.origin === origin) {
      const file = path.resolve(root, `.${url.pathname}`);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : 'application/octet-stream' });
    }
    return route.fulfill({ body: '', contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' });
  });
  const open = async file => { await page.goto(`${origin}/${file}`); await page.waitForFunction(() => window.SakinzoI18n); };
  return { page, errors, open };
}

test('all fifteen services render on desktop and mobile, and directory, FAQ and contact navigation work', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const screenshots = path.join(os.tmpdir(), 'sakinzo-services'); fs.mkdirSync(screenshots, { recursive: true });
  try {
    const { page, errors, open } = await setup(browser);
    for (const service of services) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await open(service.href);
      assert.equal(await page.locator('h1').textContent(), service.headline);
      assert.equal(await page.locator('.service-capabilities article').count(), 3);
      assert.equal(await page.locator('.service-process>li').count(), 4);
      assert.equal(await page.locator('header .service-menu a').count(), 16);
      await page.locator('details summary').first().click();
      assert.equal(await page.locator('details').first().getAttribute('open'), '');
      assert.ok(await page.locator('details[open] p').isVisible());
      assert.equal(await page.locator('.service-hero-actions .btn').getAttribute('href'), 'contactus.html#form-section');
      await page.setViewportSize({ width: 390, height: 844 });
      assert.ok(await page.locator('.language-trigger').isVisible());
      const metrics = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(metrics.page <= metrics.viewport, `${service.slug}: mobile overflow ${JSON.stringify(metrics)}`);
      if (service.slug === 'web-mobile-development') {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(screenshots, 'service-mobile.png'), fullPage: true });
        await page.screenshot({ path: path.join(screenshots, 'service-mobile-hero.png') });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(screenshots, 'service-desktop.png'), fullPage: true });
        await page.screenshot({ path: path.join(screenshots, 'service-desktop-hero.png') });
      }
    }
    await open('services.html');
    assert.equal(await page.locator('.service-grid .service-card').count(), 15);
    await page.screenshot({ path: path.join(screenshots, 'services-directory.png'), fullPage: true });
    await page.locator('.service-grid a[href="devops-solutions.html"]').click();
    await page.waitForURL('**/devops-solutions.html');
    assert.equal(await page.locator('h1').textContent(), services.find(service => service.slug === 'devops-solutions').headline);
    await page.locator('.service-hero-actions .btn').click(); await page.waitForURL('**/contactus.html#form-section');
    assert.deepEqual(errors, []);
    console.log(`Service page screenshots: ${screenshots}`);
  } finally { await browser.close(); }
});

test('home, company, contact and blog menus expose every service on desktop and mobile', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const { page, errors, open } = await setup(browser);
    for (const file of ['index.html', 'who-we-are.html', 'contactus.html', 'blog.html', 'qa-testing.html']) {
      await page.setViewportSize({ width: 1440, height: 1000 }); await open(file);
      const button = page.locator('header .service-nav-group .nbtn,header .service-nav-group .nav-btn');
      await button.hover();
      assert.ok(await page.locator('header .service-menu').isVisible(), file);
      for (const service of services) assert.equal(await page.locator(`header .service-menu a[href="${service.href}"]`).count(), 1, `${file}: ${service.href}`);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('.hamburger').click();
      const mobileGroup = page.locator('.mob-item,.mobile-nav-group').filter({ has: page.locator('.mob-link,.mobile-nav-toggle').filter({ hasText: /^\s*Services\s*$/ }) });
      await mobileGroup.locator('.mob-link,.mobile-nav-toggle').click();
      const link = mobileGroup.locator('a[href="business-analysis.html"]');
      await link.scrollIntoViewIfNeeded(); assert.ok(await link.isVisible(), file);
      assert.equal(await mobileGroup.locator('a').count(), 16, file);
      await link.click(); await page.waitForURL('**/business-analysis.html');
      assert.equal(await page.locator('h1').textContent(), services.find(service => service.slug === 'business-analysis').headline);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
