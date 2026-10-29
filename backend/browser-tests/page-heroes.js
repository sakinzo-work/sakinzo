const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');
const catalog = require('../../frontend/page-covers');
const services = require('../../frontend/services-data');
const root = path.join(__dirname, '../../frontend'), origin = 'https://sakinzo.test';
const screenshots = path.join(os.tmpdir(), 'sakinzo-page-heroes');

async function setup(browser) {
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const post = (slug, coverImage) => ({ slug, title: 'Practical AI engineering', excerpt: 'Build useful AI products with a clear evaluation plan.', body: 'A practical engineering article.\n\nEvaluate product outcomes.', category: 'AI', coverImage, publishedAt: '2026-10-29' });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/i18n/languages')) return route.fulfill({ json: { configured: false, languages: [{ code: 'en', name: 'English' }] } });
    if (url.pathname.endsWith('/public/site-data')) return route.fulfill({ json: { projects: [], clients: [], stats: [], team: [], testimonials: [], mapLocations: [], sections: {}, insights: [], blogs: [] } });
    if (url.pathname.endsWith('/blogs')) return route.fulfill({ json: [post('cover', '/uploaded-cover.webp'), post('fallback'), post('broken', '/missing.webp')] });
    if (url.pathname.includes('/projects/')) return route.fulfill({ json: { title: 'Connected product case study', desc: 'A practical connected platform with reliable device monitoring.', category: 'IoT', img: url.pathname.endsWith('/cover') ? '/uploaded-cover.webp' : url.pathname.endsWith('/broken') ? '/missing.webp' : undefined } });
    if (url.pathname.endsWith('/missing.webp')) return route.fulfill({ status: 404, body: '' });
    if (url.pathname.endsWith('/uploaded-cover.webp')) return route.fulfill({ body: fs.readFileSync(path.join(root, 'assets/service-fintech.webp')), contentType: 'image/webp' });
    if (url.origin === origin) {
      const file = path.resolve(root, `.${url.pathname}`);
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.webp') ? 'image/webp' : file.endsWith('.json') ? 'application/json' : 'application/octet-stream' });
    }
    return route.fulfill({ body: '', contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' });
  });
  const open = async file => { await page.goto(`${origin}/${file}`); await page.waitForFunction(() => window.SakinzoI18n); };
  return { page, open, errors };
}

async function checkCover(page, expected) {
  await page.locator('.page-hero-image').waitFor();
  await page.waitForFunction(expected => {
    const image = document.querySelector('.page-hero-image');
    return image.complete && image.naturalWidth > 0 && image.src.endsWith(expected);
  }, expected);
  const metrics = await page.locator('.page-hero-photo').evaluate(hero => {
    const photo = hero.querySelector('.page-hero-image'), heading = hero.querySelector('h1');
    const bounds = hero.getBoundingClientRect(), picture = photo.getBoundingClientRect(), title = heading.getBoundingClientRect();
    return { page: document.documentElement.scrollWidth, viewport: innerWidth, heroWidth: bounds.width, imageWidth: picture.width,
      heroHeight: bounds.height, imageHeight: picture.height, titleLeft: title.left, titleRight: title.right,
      titleBottom: title.bottom, heroBottom: bounds.bottom, color: getComputedStyle(heading).color };
  });
  assert.equal(await page.locator('.page-hero-image').count(), 1, 'no duplicate hero backgrounds after asynchronous rendering');
  assert.equal(metrics.heroWidth, metrics.imageWidth); assert.equal(metrics.heroHeight, metrics.imageHeight);
  assert.ok(metrics.page <= metrics.viewport, `page overflows: ${JSON.stringify(metrics)}`);
  assert.ok(metrics.titleLeft >= 0 && metrics.titleRight <= metrics.viewport + 1 && metrics.titleBottom < metrics.heroBottom, 'title remains inside banner');
  assert.equal(metrics.color, 'rgb(255, 255, 255)');
}

test('all company, story, contact, insight and home pages have topic-matched backgrounds on desktop, tablet and mobile', async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const { page, open, errors } = await setup(browser);
    const files = fs.readdirSync(root).filter(file => file.endsWith('.html') && !/^(admin|ad|google.*)\.html$/.test(file) && !services.some(service => service.href === file) && file !== 'services.html');
    for (const file of files) {
      const slug = catalog.aliases[file.replace('.html', '')] || file.replace('.html', '');
      await page.setViewportSize({ width: 1535, height: 900 });
      await open(file === 'project.html' ? `${file}?id=fallback` : file);
      for (const width of [1535, 768, 390]) {
        await page.setViewportSize({ width, height: 900 });
        if (slug === 'index') {
          await page.locator('.home-hero-photo').waitFor();
          assert.ok((await page.locator('.home-hero-photo').evaluate(hero => getComputedStyle(hero).backgroundImage)).includes(width <= 600 ? 'sakinzo-hero-mobile.webp' : 'sakinzo-hero-desktop-waves.webp'));
        } else {
          await checkCover(page, catalog.get(slug, slug === 'project' ? { category: 'IoT' } : {}).image);
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          if (width !== 768) await page.screenshot({ path: path.join(screenshots, `${file.replace('.html', '')}-${width}.png`) });
        }
      }
    }
    assert.deepEqual(errors, []);
    console.log(`Public page hero screenshots: ${screenshots}`);
  } finally { await browser.close(); }
});

test('asynchronous articles and projects use uploaded covers, category fallbacks and recover from broken images', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const { page, open, errors } = await setup(browser);
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const type of ['blog', 'project']) for (const mode of ['cover', 'fallback', 'broken']) {
      await open(`${type}.html?${type === 'blog' ? 'slug' : 'id'}=${mode}`);
      const image = mode === 'cover' ? '/uploaded-cover.webp' : catalog.get(type, { category: type === 'blog' ? 'AI' : 'IoT' }).image;
      await checkCover(page, image);
      await page.waitForFunction(expected => document.querySelector('meta[property="og:image"]').content.endsWith(expected), image);
      assert.ok((await page.locator('#sakinzo-schema').textContent()).includes(image));
      await page.setViewportSize({ width: 320, height: 844 }); await checkCover(page, image);
      if (mode === 'cover') await page.screenshot({ path: path.join(screenshots, `${type}-uploaded-mobile.png`) });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
