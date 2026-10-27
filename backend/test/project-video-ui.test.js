const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { File } = require('node:buffer');

function pageScript(filename) {
  const html = fs.readFileSync(path.join(__dirname, '../../frontend', filename), 'utf8');
  return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.trim()).join('\n');
}

function adminPage() {
  const elements = new Map(), alerts = [], requests = [];
  const element = id => {
    if (!elements.has(id)) {
      let value = '';
      const node = {
        style: {}, dataset: {}, files: [], listeners: {}, disabled: false,
        classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
        addEventListener(name, handler) { this.listeners[name] = handler; },
        setAttribute() {}, querySelector() { return element('modal-card'); }
      };
      Object.defineProperty(node, 'value', { get: () => value, set: next => { value = next; if (id === 'upload-project-video' && !next) node.files = []; } });
      elements.set(id, node);
    }
    return elements.get(id);
  };
  const form = element('modalForm');
  form.values = { _id: '', title: 'Demo', category: 'Web Development', previewDevice: 'auto', img: '', modelImage: '', images: '', tags: '', creatorName: 'Creator', creatorPortfolio: 'https://example.com', visible: 'true', order: '0' };
  form.querySelector = selector => selector.includes('button') ? element('submit') : selector === '#upload-project-video' ? element('upload-project-video') : element(selector.match(/name="([^"]+)"/)?.[1] || selector);
  element('category').value = form.values.category;
  class FormDataForPage extends FormData {
    constructor(target) {
      super();
      if (target) {
        Object.entries(target.values).forEach(([key, value]) => this.append(key, value));
        if (!element('videoUrl').disabled) this.append('videoUrl', element('videoUrl').value);
      }
    }
  }
  const context = vm.createContext({
    URL, FormData: FormDataForPage, console, navigator: { userAgent: '' },
    localStorage: { getItem() { return null; } }, sessionStorage: { getItem() { return 'test-token'; } },
    document: {
      documentElement: { dataset: {} }, body: element('body'),
      getElementById: element, addEventListener() {},
      querySelector: selector => selector.includes('category') ? element('category') : null
    },
    addEventListener() {}, matchMedia: () => ({ matches: false }),
    setTimeout() {}, clearTimeout() {}, setInterval() {}, clearInterval() {},
    alert: message => alerts.push(message),
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ url: '/api/upload/videos/012345678901234567890123' }) };
    }
  });
  context.window = context;
  vm.runInContext(pageScript('admin.html').replace(/\bboot\(\);\s*$/, ''), context);
  context.captureSave = (url, options) => {
    requests.push({ url, options });
    return JSON.parse(options.body);
  };
  vm.runInContext("editing={type:'projects',id:''};currentAdmin={role:'owner'};loadAll=async()=>{};api=async (url,options)=>captureSave(url,options);", context);
  return { context, form, element, alerts, requests, submit: () => form.listeners.submit({ preventDefault() {}, currentTarget: form }) };
}

test('project form offers videos in every category and retains existing video links', () => {
  const { context } = adminPage();
  for (const category of ['IoT', 'Web Development', 'Android App', 'Other']) {
    const html = context.projectForm({ category, videoUrl: 'https://example.com/demo.mp4' });
    assert.match(html, /id="upload-project-video"/);
    assert.match(html, /value="https:\/\/example.com\/demo.mp4"/);
    assert.match(html, /Remove video/);
  }
});

test('saving a video link, removing it and saving without video preserve the intended value', async () => {
  for (const value of ['https://youtu.be/demo', '']) {
    const page = adminPage();
    page.element('videoUrl').value = value;
    await page.submit();
    assert.deepEqual(page.alerts, []);
    assert.equal(JSON.parse(page.requests[0].options.body).videoUrl, value);
    assert.equal(page.requests.length, 1);
  }
  const page = adminPage();
  page.element('videoUrl').value = 'https://example.com/existing.mp4';
  page.context.removeProjectVideo();
  await page.submit();
  assert.equal(JSON.parse(page.requests[0].options.body).videoUrl, '');
});

test('device video uploads before saving, replaces the link and is not uploaded twice on retry', async () => {
  const page = adminPage(), input = page.element('upload-project-video');
  page.element('category').value = 'IoT';
  input.files = [new File(['video bytes'], 'demo.mp4', { type: 'video/mp4' })];
  page.context.selectProjectVideo(input);
  assert.equal(page.element('videoUrl').disabled, true);
  assert.equal(page.element('videoUrl').required, false);
  await page.submit();
  assert.deepEqual(page.alerts, []);
  assert.match(page.requests[0].url, /\/api\/upload\/videos$/);
  assert.equal(page.requests[0].options.headers.Authorization, 'Bearer test-token');
  assert.equal(page.requests[0].options.body.get('file').name, 'demo.mp4');
  const expected = 'https://sakinzo.onrender.com/api/upload/videos/012345678901234567890123';
  assert.equal(JSON.parse(page.requests[1].options.body).videoUrl, expected);
  assert.equal(page.element('videoUrl').value, expected);
  assert.equal(input.files.length, 0);
  assert.equal(page.element('videoUrl').required, true);
  assert.equal(page.element('videoUrl').disabled, false);
  assert.equal(await page.context.uploadProjectVideo(page.form), '');
  assert.equal(page.requests.length, 2);
});

test('invalid files are rejected and video upload errors leave the form available for retry', async () => {
  const page = adminPage(), input = page.element('upload-project-video');
  for (const file of [{ name: 'image.png', type: 'image/png', size: 10 }, { name: 'large.mp4', type: 'video/mp4', size: 51 * 1024 * 1024 }]) {
    input.files = [file];
    page.context.selectProjectVideo(input);
    assert.equal(input.files.length, 0);
  }
  assert.equal(page.alerts.length, 2);
  input.files = [new File(['bytes'], 'demo.mp4', { type: 'video/mp4' })];
  page.context.fetch = async () => ({ ok: false, json: async () => ({ message: 'Storage unavailable' }) });
  await page.submit();
  assert.equal(page.alerts[2], 'Storage unavailable');
  assert.equal(input.files.length, 1);
  assert.equal(page.element('submit').disabled, false);
  assert.equal(page.requests.length, 0);
});

test('employee project approvals include the uploaded video URL', async () => {
  const page = adminPage();
  vm.runInContext("currentAdmin={role:'employee'};", page.context);
  page.element('upload-project-video').files = [new File(['video'], 'demo.webm', { type: 'video/webm' })];
  await page.submit();
  assert.deepEqual(page.alerts, []);
  assert.equal(page.requests[1].url, '/approvals');
  const request = JSON.parse(page.requests[1].options.body);
  assert.equal(request.resourceType, 'projects');
  assert.match(request.payload.videoUrl, /\/api\/upload\/videos\/[a-f\d]{24}$/);
});

async function publicProject(project) {
  const app = { innerHTML: '' };
  const context = vm.createContext({
    URL, URLSearchParams, location: { href: 'https://example.com/project.html?id=demo', search: '?id=demo' },
    document: { getElementById: () => app, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({}), head: { appendChild() {} } },
    fetch: async () => ({ ok: true, status: 200, json: async () => project })
  });
  context.window = context;
  vm.runInContext(pageScript('project.html').replace(/\bloadProject\(\);\s*$/, ''), context);
  await context.loadProject();
  return { html: app.innerHTML, context };
}

test('public project videos play across categories and projects without videos omit the player', async () => {
  for (const category of ['IoT', 'Web Development', 'Android App', 'Other']) {
    const { html } = await publicProject({ title: 'Demo', category, videoUrl: 'https://api.example.com/api/upload/videos/demo' });
    assert.match(html, /<video class="project-video" controls playsinline/);
    assert.match(html, /<source src="https:\/\/api.example.com\/api\/upload\/videos\/demo">/);
    assert.match(html, /iot-grid single-media/);
  }
  const { html } = await publicProject({ title: 'No video', category: 'Web Development' });
  assert.doesNotMatch(html, /project-video|iot-showcase|preview-frame/);
  const iot = await publicProject({ title: 'IoT demo', category: 'IoT', modelImage: 'https://example.com/model.jpg', videoUrl: 'https://example.com/demo.mp4' });
  assert.match(iot.html, /model-photo/);
  assert.match(iot.html, /Real IoT model &amp; demo|Real IoT model & demo/);
  assert.doesNotMatch(iot.html, /iot-grid single-media/);
});

test('hosted videos embed YouTube and Vimeo and unsafe or empty links create no player', async () => {
  const { context } = await publicProject({ title: 'Demo' });
  for (const url of ['https://www.youtube.com/watch?v=demo123', 'https://youtu.be/demo123', 'https://youtube.com/shorts/demo123']) {
    assert.match(context.videoPlayer(url, 'Demo'), /https:\/\/www.youtube-nocookie.com\/embed\/demo123/);
  }
  assert.match(context.videoPlayer('https://vimeo.com/123456', 'Demo'), /https:\/\/player.vimeo.com\/video\/123456/);
  assert.equal(context.videoPlayer('', 'Demo'), '');
  assert.equal(context.videoPlayer('javascript:alert(1)', 'Demo'), '');
});

test('dashboard retains and saves the chosen live preview device', async () => {
  for (const device of ['auto', 'phone', 'tablet', 'desktop']) {
    const page = adminPage();
    const html = page.context.projectForm({ previewDevice: device });
    assert.match(html, new RegExp(`<option value="${device}" selected>`));
    page.form.values.previewDevice = device;
    await page.submit();
    assert.deepEqual(page.alerts, []);
    assert.equal(JSON.parse(page.requests[0].options.body).previewDevice, device);
  }
  const page = adminPage();
  vm.runInContext("currentAdmin={role:'employee'};", page.context);
  page.form.values.previewDevice = 'phone';
  await page.submit();
  assert.equal(JSON.parse(page.requests[0].options.body).payload.previewDevice, 'phone');
});

test('existing mobile projects automatically use a phone and web dashboards use desktop', async () => {
  for (const [category, expected] of [['Android App', 'phone'], ['iOS App', 'phone'], ['Mobile Development', 'phone'], ['App Development', 'phone'], ['Web Development', 'desktop'], ['IoT', 'desktop']]) {
    const { html } = await publicProject({ title: 'Demo', category, demoUrl: 'https://app.example.com/dashboard' });
    assert.match(html, new RegExp(`id="livePreviewDevice" data-device="${expected}"`));
    assert.match(html, /src="https:\/\/app.example.com\/dashboard"/);
    assert.match(html, /aria-label="Preview device"/);
    assert.match(html, /Open app/);
  }
});

test('dashboard reports when an older backend does not retain the preview setting', async () => {
  const page = adminPage();
  page.form.values.previewDevice = 'phone';
  page.context.captureSave = (url, options) => {
    const saved = JSON.parse(options.body);
    delete saved.previewDevice;
    return saved;
  };
  await page.submit();
  assert.match(page.alerts[0], /Preview device was not saved/);
  assert.equal(page.element('submit').disabled, false);
});

test('a project can override its category with phone, tablet or desktop preview', async () => {
  for (const device of ['phone', 'tablet', 'desktop']) {
    const { html } = await publicProject({ title: 'Demo', category: 'Android App', previewDevice: device, demoUrl: 'https://app.example.com' });
    assert.match(html, new RegExp(`id="livePreviewDevice" data-device="${device}"`));
    assert.match(html, new RegExp(`data-preview-device="${device}" aria-pressed="true"`));
  }
});

test('native app links open externally and empty or unsafe links do not create a preview', async () => {
  for (const demoUrl of ['https://play.google.com/store/apps/details?id=demo', 'https://apps.apple.com/app/id123', 'https://example.com/app.apk?download=1']) {
    const { html } = await publicProject({ title: 'Demo', demoUrl });
    assert.match(html, /Try the app/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /class="preview-frame"/);
  }
  for (const demoUrl of ['', 'javascript:alert(1)']) {
    const { html } = await publicProject({ title: 'Demo', demoUrl });
    assert.doesNotMatch(html, /id="livePreview"|class="preview-frame"/);
  }
});

test('device switching keeps the app loaded and scales each viewport to fit small screens', async () => {
  const { context } = await publicProject({ title: 'Demo' });
  const properties = {}, viewport = { clientWidth: 1180, style: {} }, label = {};
  const sizes = { phone: [414, 848], tablet: [792, 1092], desktop: [1298, 854] };
  const device = {
    dataset: { device: 'phone' }, style: { setProperty: (name, value) => { properties[name] = Number(value); } },
    get offsetWidth() { return sizes[this.dataset.device][0]; },
    get offsetHeight() { return sizes[this.dataset.device][1]; }
  };
  const iframe = { src: 'https://app.example.com', loaded: true };
  const buttons = ['phone', 'tablet', 'desktop'].map(value => ({
    dataset: { previewDevice: value }, attributes: {},
    setAttribute(name, next) { this.attributes[name] = next; },
    addEventListener(name, handler) { this[name] = handler; }
  }));
  const root = {
    querySelector: selector => ({ '.preview-viewport': viewport, '.preview-device': device, '#previewDeviceLabel': label, '.preview-frame': iframe }[selector]),
    querySelectorAll: () => buttons
  };
  context.document.getElementById = id => id === 'livePreview' ? root : null;
  context.addEventListener = () => {};
  context.setupLivePreview();
  for (const width of [280, 360, 768, 1180]) {
    viewport.clientWidth = width;
    for (const button of buttons) {
      button.click();
      const scale = properties['--preview-scale'];
      assert.ok(scale > 0 && scale <= 1);
      assert.ok(device.offsetWidth * scale <= width + 0.01);
      assert.equal(viewport.style.height, `${Math.ceil(device.offsetHeight * scale)}px`);
      assert.equal(button.attributes['aria-pressed'], 'true');
      assert.equal(root.querySelector('.preview-frame'), iframe);
      assert.equal(iframe.src, 'https://app.example.com');
    }
  }
});
