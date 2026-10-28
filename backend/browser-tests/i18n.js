const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');

const frontend = path.join(__dirname, '../../frontend');
const origin = 'https://sakinzo.test';
const supported = [{ code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' }, { code: 'ur', name: 'Urdu' }, { code: 'fr', name: 'French' }];
const translations = { hi: { 'Get in touch': 'संपर्क करें', 'Start a conversation': 'बातचीत शुरू करें', 'Our clients': 'हमारे ग्राहक', 'Full Name*': 'पूरा नाम*', 'AI development that moves business forward': 'व्यवसाय को आगे बढ़ाने वाला एआई विकास', 'Dynamic project': 'नया प्रोजेक्ट', 'Sakin.zo | AI, IoT, Robotics & Custom Software Development Company': 'Sakin.zo | एआई और सॉफ्टवेयर विकास कंपनी' }, ur: { 'Get in touch': 'رابطہ کریں' } };

async function setup(browser, { configured = true, failure = false, delay = 0, blogPosts = [] } = {}) {
  const context = await browser.newContext();
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/i18n/languages')) return route.fulfill({ json: { configured, languages: configured ? supported : [supported[0]] } });
    if (url.pathname.endsWith('/i18n/translate')) {
      const data = route.request().postDataJSON(); requests.push(data);
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      if (failure) return route.fulfill({ status: 503, json: { message: 'Translation service unavailable' } });
      return route.fulfill({ json: { translations: data.texts.map(text => translations[data.target]?.[text] || `${data.target === 'hi' ? 'अनुवाद' : data.target === 'ur' ? 'ترجمہ' : 'Traduit'} ${text}`) } });
    }
    if (/\/public\/site-data$/.test(url.pathname)) return route.fulfill({ json: { projects: [], clients: [], stats: [], mapLocations: [], testimonials: [], team: [], sections: {}, whatWeDoServices: {}, blogs: [], insights: [] } });
    if (url.pathname.endsWith('/blogs')) return route.fulfill({ json: blogPosts });
    if (url.pathname.includes('/projects/')) return route.fulfill({ json: { title: 'Dynamic project', desc: 'A useful connected platform', category: 'Web Development' } });
    if (url.origin === origin) {
      const file = path.resolve(frontend, `.${url.pathname === '/' ? '/index.html' : url.pathname}`);
      if (!file.startsWith(frontend + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : 'application/octet-stream' });
    }
    return route.fulfill({ body: '', contentType: url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript' });
  });
  const open = async file => { await page.goto(`${origin}/${file}`); await page.waitForFunction(() => window.SakinzoI18n); };
  return { context, page, errors, requests, open };
}

test('language selection translates text, forms, SEO and asynchronous content, persists across pages and restores English', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const { context, page, errors, requests, open } = await setup(browser);
    await open('index.html');
    await page.locator('input[name="name"]').fill('Private user name');
    await page.getByRole('button', { name: 'Change language', exact: true }).click();
    await page.locator('#site-language-search').fill('हिन्दी');
    await page.locator('[data-language="hi"]').click();
    await page.waitForFunction(() => document.documentElement.lang === 'hi');
    assert.equal(await page.locator('.hdr-right .btn-git').textContent(), 'संपर्क करें');
    assert.equal(await page.locator('input[name="name"]').getAttribute('placeholder'), 'पूरा नाम*');
    assert.equal(await page.locator('input[name="name"]').inputValue(), 'Private user name');
    assert.equal(await page.title(), 'Sakin.zo | एआई और सॉफ्टवेयर विकास कंपनी');
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /\?lang=hi$/);
    assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'), 'hi_IN');
    assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), await page.title());
    assert.match(await page.locator('link[hreflang="ur"]').getAttribute('href'), /lang=ur/);
    assert.equal(await page.locator('script#sakinzo-schema').evaluate(node => JSON.parse(node.textContent)['@graph'][0].inLanguage), 'hi');
    assert.ok(!requests.some(request => request.texts.some(text => text.includes('Private user name'))));
    await page.evaluate(() => { const p = document.createElement('p'); p.id = 'dynamic-text'; p.textContent = 'Dynamic project'; document.querySelector('#sec-projects').append(p); });
    await page.locator('#dynamic-text').filter({ hasText: 'नया प्रोजेक्ट' }).waitFor();
    await page.locator('.hdr-right .btn-git').click();
    await page.waitForFunction(() => document.documentElement.lang === 'hi' && window.SakinzoI18n);
    assert.match(page.url(), /contactus\.html\?lang=hi#form-section/);
    // An explicit English URL wins over the saved Hindi preference.
    await open('ai-development.html?lang=en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.evaluate(() => window.SakinzoI18n.setLanguage('ur'));
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'), 'ur_PK');
    await page.reload(); await page.waitForFunction(() => document.documentElement.lang === 'ur');
    await page.evaluate(() => window.SakinzoI18n.setLanguage('en'));
    assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
    assert.equal(await page.locator('.hdr-right .btn-git').textContent(), 'Get in touch');
    assert.ok(!page.url().includes('lang='));
    assert.deepEqual(errors, []);
    await context.close();
  } finally { await browser.close(); }
});

test('mobile and keyboard selection works across page types; keyless mode uses real Google website translation links', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const screenshots = path.join(os.tmpdir(), 'sakinzo-language-check'); fs.mkdirSync(screenshots, { recursive: true });
  try {
    const { context, page, errors, open } = await setup(browser, { configured: false });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const file of ['index.html', 'contactus.html', 'ai-development.html', 'blog.html', 'project.html?id=demo']) {
      await open(file);
      const button = page.getByRole('button', { name: 'Change language', exact: true });
      await button.click();
      await page.locator('#site-language-search').fill('Hindi');
      const link = page.locator('[data-language="hi"]'); await link.waitFor();
      const url = new URL(await link.getAttribute('href'));
      assert.equal(url.origin, 'https://translate.google.com');
      assert.equal(url.searchParams.get('tl'), 'hi');
      assert.equal(url.searchParams.get('u'), `${origin}/${file}`);
      assert.equal(await page.locator('link[hreflang="hi"]').count(), 0, 'keyless pages must not advertise nonexistent local translations');
      const rect = await page.locator('.language-panel').boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= 391);
      await page.keyboard.press('ArrowDown');
      assert.equal(await link.evaluate(node => node === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await button.getAttribute('aria-expanded'), 'false');
      assert.equal(await button.evaluate(node => node === document.activeElement), true);
    }
    await open('index.html');
    await page.getByRole('button', { name: 'Change language', exact: true }).click();
    await page.screenshot({ path: path.join(screenshots, 'mobile-language-menu.png') });
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.screenshot({ path: path.join(screenshots, 'desktop-language-menu.png') });
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Language selector screenshots: ${screenshots}`);
  } finally { await browser.close(); }
});

test('project IDs and blog slugs remain in localized canonicals and loaded content updates social metadata', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const { context, page, errors, open } = await setup(browser, { blogPosts: [{ title: 'Engineering insights', slug: 'engineering-insights', excerpt: 'Practical product lessons', body: 'Learn from our team.', tags: [] }] });
    await open('project.html?id=demo&lang=hi');
    await page.waitForFunction(() => document.documentElement.lang === 'hi');
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /project\.html\?id=demo&lang=hi$/);
    assert.match(await page.title(), /Dynamic project/);
    assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), await page.title());
    assert.equal(await page.locator('meta[property="og:description"]').getAttribute('content'), await page.locator('meta[name="description"]').getAttribute('content'));
    await open('blog.html?slug=engineering-insights&lang=hi');
    await page.waitForFunction(() => document.documentElement.lang === 'hi');
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /blog\.html\?slug=engineering-insights&lang=hi$/);
    assert.match(await page.title(), /Engineering insights/);
    assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), await page.title());
    assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /Practical product lessons/);
    assert.deepEqual(errors, []);
    await context.close();
  } finally { await browser.close(); }
});

test('failed translations preserve English and rapid switching does not apply stale translations', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const failure = await setup(browser, { failure: true });
    await failure.open('ai-development.html');
    assert.equal(await failure.page.evaluate(() => window.SakinzoI18n.setLanguage('hi')), false);
    assert.equal(await failure.page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await failure.page.locator('.hdr-right .btn-git').textContent(), 'Get in touch');
    assert.match(await failure.page.locator('.language-feedback').textContent(), /unavailable/);
    await failure.context.close();
    const rapid = await setup(browser, { delay: 150 });
    await rapid.open('ai-development.html');
    await rapid.page.evaluate(async () => {
      const first = window.SakinzoI18n.setLanguage('hi');
      await window.SakinzoI18n.setLanguage('en'); await first;
    });
    assert.equal(await rapid.page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await rapid.page.locator('.hdr-right .btn-git').textContent(), 'Get in touch');
    assert.deepEqual(rapid.errors, []);
    await rapid.context.close();
  } finally { await browser.close(); }
});
