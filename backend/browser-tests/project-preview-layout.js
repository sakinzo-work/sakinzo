const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const frontend = path.join(__dirname, '../../frontend');
const previewHtml = fs.readFileSync(path.join(frontend, 'project.html'), 'utf8')
  .replace('<head>', '<head><script>window.API_BASE="https://preview.test/api";</script>');
const fixtureApp = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  *{box-sizing:border-box}body{margin:0;background:#f8faf5;font:16px Arial;color:#124729}
  header{padding:18px;background:#fff}main{padding:20px;min-height:1800px}.summary{padding:24px;border-radius:24px;background:#12522f;color:white}
  nav{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;padding:18px;background:white}
</style></head><body><header>Farm app preview</header><main><div class="summary"><h1>Farm overview</h1><p>Interactive app viewport</p></div></main><nav id="bottomNav">Home &nbsp; Animals &nbsp; Customers &nbsp; Profile</nav><script>window.previewLoadId=Math.random();</script></body></html>`;

async function settleLayout(page) {
  // Wait across multiple ResizeObserver deliveries, not just the first layout.
  await page.evaluate(() => new Promise(resolve => {
    let count = 0;
    function next() { requestAnimationFrame(() => ++count === 24 ? resolve() : next()); }
    next();
  }));
}

test('preview stays fully visible after observer callbacks, device switches and window resizing', async () => {
  const browser = await chromium.launch({ channel: process.env.PREVIEW_BROWSER_CHANNEL || 'chrome', headless: true });
  const screenshots = path.join(os.tmpdir(), 'sakinzo-preview-layout');
  fs.mkdirSync(screenshots, { recursive: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://preview.test/**', async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname === '/project.html') return route.fulfill({ contentType: 'text/html', body: previewHtml });
      if (pathname === '/demo-app') return route.fulfill({ contentType: 'text/html', body: fixtureApp });
      if (pathname === '/api/projects/demo') return route.fulfill({ json: { title: 'FarmDash layout check', category: 'Android App', demoUrl: 'https://preview.test/demo-app' } });
      if (pathname === '/seo.js') return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(path.join(frontend, 'seo.js'), 'utf8') });
      return route.fulfill({ status: 200, body: '' });
    });
    await page.setViewportSize({ width: 1536, height: 695 });
    await page.goto('https://preview.test/project.html?id=demo');
    await page.frameLocator('.preview-frame').locator('#bottomNav').waitFor();
    const loadedApp = await page.locator('.preview-frame').evaluate(frame => frame.contentWindow.previewLoadId);
    for (const size of [{ width: 1536, height: 695 }, { width: 1366, height: 768 }, { width: 390, height: 844 }, { width: 360, height: 640 }, { width: 320, height: 568 }, { width: 768, height: 1024 }]) {
      await page.setViewportSize(size);
      for (const device of ['phone', 'tablet', 'desktop']) {
        await page.getByRole('button', { name: new RegExp(`^${device}$`, 'i') }).click();
        await page.locator('.preview-toolbar').evaluate(toolbar => toolbar.scrollIntoView({ block: 'start' }));
        await settleLayout(page);
        const metrics = await page.locator('#livePreview').evaluate(root => {
          const viewport = root.querySelector('.preview-viewport'), device = root.querySelector('.preview-device'), frame = root.querySelector('.preview-frame');
          const outer = viewport.getBoundingClientRect(), inner = device.getBoundingClientRect();
          return {
            height: outer.height, deviceHeight: inner.height, naturalHeight: device.offsetHeight,
            top: inner.top - outer.top, bottom: inner.bottom - outer.bottom,
            screenTop: inner.top, screenBottom: inner.bottom,
            left: inner.left - outer.left, right: inner.right - outer.right,
            pageWidth: document.documentElement.scrollWidth, windowWidth: innerWidth, windowHeight: innerHeight,
            appWidth: frame.contentWindow.innerWidth, appHeight: frame.contentWindow.innerHeight, loadedApp: frame.contentWindow.previewLoadId
          };
        });
        const label = `${size.width}x${size.height} ${device}`;
        if (size.width === 1536 || size.width === 390) {
          await page.locator('#livePreview').screenshot({ path: path.join(screenshots, `${size.width}-${device}.png`) });
        }
        assert.ok(metrics.height > 100, `${label}: collapsed to ${metrics.height}px`);
        assert.ok(metrics.naturalHeight > 800, `${label}: intrinsic frame height changed to ${metrics.naturalHeight}px`);
        assert.ok(metrics.deviceHeight <= metrics.windowHeight - 140, `${label}: frame is taller than the available screen`);
        assert.ok(Math.abs(metrics.top) <= 1 && metrics.bottom <= 1, `${label}: device is clipped vertically`);
        assert.ok(metrics.screenTop >= -1 && metrics.screenBottom <= metrics.windowHeight + 1, `${label}: whole frame does not fit on screen`);
        assert.ok(metrics.left >= -1 && metrics.right <= 1, `${label}: device is clipped horizontally`);
        assert.ok(metrics.pageWidth <= metrics.windowWidth, `${label}: page overflows horizontally`);
        assert.equal(metrics.loadedApp, loadedApp, `${label}: switching devices reloaded the app`);
        const expected = { phone: [390, 780], tablet: [768, 1024], desktop: [1280, 800] }[device];
        assert.ok(Math.abs(metrics.appWidth - expected[0]) <= 2, `${label}: wrong iframe width`);
        assert.ok(Math.abs(metrics.appHeight - expected[1]) <= 2, `${label}: wrong iframe height`);
      }
    }
    assert.deepEqual(errors, []);
    console.log(`Layout screenshots: ${screenshots}`);
  } finally {
    await browser.close();
  }
});
