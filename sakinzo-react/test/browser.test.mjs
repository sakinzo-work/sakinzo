import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/routes.json")),
);
const manifest = Object.fromEntries(
  [...routes, { slug: "admin", path: "/admin" }].map((route) => [
    route.slug,
    { file: route.path, bodyAttributes: { "data-page": route.slug } },
  ]),
);
const services = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/services.json")),
);
const article = {
  _id: "blog-fixture",
  slug: "engineering-guide",
  title: "Engineering guide",
  excerpt: "A practical engineering guide.",
  category: "AI",
  author: "Sakinzo Team",
  body: fs.readFileSync(
    path.join(root, "content/blogs/ai-tools-tips.md"),
    "utf8",
  ),
  coverImage: "assets/service-ai.webp",
  tags: ["AI", "Engineering"],
  publishedAt: "2026-10-29",
  readTime: 5,
};
const project = {
  _id: "project-fixture",
  title: "Connected app",
  category: "Android App",
  desc: "## The product\n\nA **connected** app.\n\n- Reliable software\n- Clear design",
  img: "assets/service-iot.webp",
  images: ["assets/service-ai.webp"],
  tags: ["React", "IoT"],
  demoUrl: "https://preview.example.test/",
  videoUrl: "https://media.example.test/demo.mp4",
  creatorName: "Example developer",
  creatorPortfolio: "https://example.test/",
  visible: true,
  order: 1,
};
const admin = {
  id: "owner-fixture",
  _id: "owner-fixture",
  name: "Test owner",
  email: "owner@example.test",
  role: "owner",
  canSaveDirect: true,
  canManageAccess: true,
  permissions: [],
  active: true,
};
const siteData = {
  projects: [project],
  blogs: [article],
  insights: [],
  clients: [],
  stats: [],
  team: [],
  testimonials: [],
  mapLocations: [],
  contactOffices: [],
  contactPage: {},
  whatWeDoServices: {},
  sections: {},
};
let server, browser, origin;
async function setup() {
  assert.ok(
    fs.existsSync(path.join(root, "dist/index.html")),
    "Run npm run build before npm test.",
  );
  server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (url.pathname.startsWith("/api/")) {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify(
          url.pathname.endsWith("/i18n/languages")
            ? { configured: false }
            : url.pathname.endsWith("/public/site-data")
              ? siteData
              : [],
        ),
      );
      return;
    }
    let file = path.resolve(
      root,
      "dist",
      "." +
        (url.pathname === "/"
          ? "/index.html"
          : decodeURIComponent(url.pathname)),
    );
    if (!fs.existsSync(file) && (!path.extname(file) || file.endsWith(".html")))
      file = path.join(root, "dist/index.html");
    if (
      !file.startsWith(path.join(root, "dist") + path.sep) ||
      !fs.existsSync(file) ||
      !fs.statSync(file).isFile()
    ) {
      response.writeHead(404).end();
      return;
    }
    const type =
      {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".webp": "image/webp",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".mp4": "video/mp4",
        ".webmanifest": "application/manifest+json",
        ".woff2": "font/woff2",
      }[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: "chrome", headless: true });
  fs.mkdirSync(path.join(root, "test-results"), { recursive: true });
}
await setup();

async function session({ translation = false, employee = false, brokenCover = false, mapLocations = [], projectCount = 1, projectCategory = project.category } = {}) {
  const identity = employee
    ? {
        ...admin,
        id: "employee-fixture",
        _id: "employee-fixture",
        email: "employee@example.test",
        role: "employee",
        canSaveDirect: false,
        canManageAccess: false,
        permissions: ["projects"],
      }
    : admin;
  const approvals = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    serviceWorkers: "block",
  });
  const page = await context.newPage(),
    errors = [],
    requests = [];
  let projects = [structuredClone(project)];
  projects[0].category = projectCategory;
  for (let index = 1; index < projectCount; index++)
    projects.push({ ...structuredClone(project), _id: `project-fixture-${index}`, title: `Connected app ${index + 1}` });
  if (brokenCover) projects[0].img = "assets/missing-project-cover.png";
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /React|hydration|Invalid DOM|did not match/i.test(message.text())
    )
      errors.push(message.text());
  });
  await page.route("**/*", async (route) => {
    const request = route.request(),
      url = new URL(request.url());
    if (url.pathname.startsWith("/api/")) {
      requests.push({
        method: request.method(),
        path: url.pathname,
        body: request.postData(),
      });
      const endpoint = url.pathname.slice(4);
      if (endpoint === "/approvals") {
        if (request.method() === "POST")
          approvals.push({
            ...request.postDataJSON(),
            _id: "approval-fixture",
            status: "pending",
          });
        return route.fulfill({
          json: request.method() === "POST" ? approvals.at(-1) : approvals,
        });
      }
      if (endpoint === "/i18n/languages")
        return route.fulfill({
          json: {
            configured: translation,
            languages: translation
              ? [
                  { code: "en", name: "English" },
                  { code: "hi", name: "Hindi" },
                  { code: "ur", name: "Urdu" },
                ]
              : [{ code: "en", name: "English" }],
          },
        });
      if (endpoint === "/i18n/translate") {
        const { texts, target } = request.postDataJSON();
        return route.fulfill({
          json: {
            translations: texts.map(
              (text) => `${target === "ur" ? "اردو" : "हिंदी"} ${text}`,
            ),
          },
        });
      }
      if (endpoint === "/public/site-data")
        return route.fulfill({ json: { ...siteData, projects, mapLocations } });
      if (endpoint === "/auth/login")
        return route.fulfill({
          json: { token: "local-test-token", admin: identity },
        });
      if (endpoint === "/auth/me")
        return route.fulfill({ json: { admin: identity } });
      if (endpoint === "/projects/admin/all")
        return route.fulfill({ json: projects });
      if (endpoint === "/projects" && request.method() === "POST") {
        const saved = { ...request.postDataJSON(), _id: "created-fixture" };
        projects.push(saved);
        return route.fulfill({ json: saved });
      }
      if (
        endpoint === "/projects/project-fixture" &&
        request.method() === "PUT"
      ) {
        projects[0] = { ...projects[0], ...request.postDataJSON() };
        return route.fulfill({ json: projects[0] });
      }
      if (endpoint.startsWith("/projects/") && !endpoint.endsWith("/all"))
        return route.fulfill({ json: projects[0] });
      if (endpoint === "/upload/videos")
        return route.fulfill({
          json: { url: "/api/upload/videos/video-fixture" },
        });
      if (endpoint === "/blogs" || endpoint === "/blogs/admin/all")
        return route.fulfill({ json: [article] });
      if (endpoint === "/contact-page") return route.fulfill({ json: {} });
      if (endpoint === "/submissions" && request.method() === "POST")
        return route.fulfill({
          status: 201,
          json: { _id: "submission-fixture", message: "Saved" },
        });
      if (endpoint === "/admins") return route.fulfill({ json: [identity] });
      return route.fulfill({ json: [] });
    }
    if (url.origin === origin) return route.continue();
    if (url.hostname === "preview.example.test")
      return route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>App preview fixture</title><p>App preview</p>",
      });
    return route.fulfill({
      contentType: url.pathname.endsWith(".css") ? "text/css" : "text/plain",
      body: "",
    });
  });
  const open = async (file) => {
    await page.goto(new URL(file.replace(/^\//, ""), origin + "/").href);
    await page.locator("[data-react-route]").waitFor({ state: "attached" });
  };
  return { page, errors, requests, open, close: () => context.close() };
}

await test("all public React routes render without runtime errors on desktop and mobile", async () => {
  const { page, open, errors, close } = await session();
  try {
    for (const [slug, route] of Object.entries(manifest)) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await open(route.file);
      assert.ok(await page.locator("#root").textContent(), slug);
      assert.equal(
        await page.locator("body").getAttribute("data-page"),
        route.bodyAttributes["data-page"] ?? null,
        slug,
      );
      for (const width of [1440, 390]) {
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 1000,
        });
        const metrics = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert.ok(
          metrics.scroll <= metrics.width + 1,
          `${slug} overflows at ${width}: ${metrics.scroll}`,
        );
      }
      assert.deepEqual(errors, [], `${slug}: browser errors`);
    }
  } finally {
    await close();
  }
});

await test("all fifteen service pages retain content, hero assets, FAQs and responsive navigation", async () => {
  const { page, open, errors, close } = await session();
  try {
    for (const service of services) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await open(service.href);
      assert.equal(await page.locator("h1").textContent(), service.headline);
      assert.equal(
        await page.locator(".service-capabilities article").count(),
        3,
      );
      assert.equal(await page.locator(".service-process > li").count(), 4);
      assert.equal(await page.locator("header .service-menu a").count(), 16);
      const image = page.locator(".service-hero-image");
      await image.evaluate((node) => node.decode());
      assert.equal(await image.getAttribute("src"), "/" + service.cover.image);
      await page.locator("details summary").first().click();
      assert.equal(await page.locator("details[open]").count(), 1);
    }
    await open("services.html");
    assert.equal(await page.locator(".service-grid .service-card").count(), 15);
    await page.locator("header .service-nav-group .nbtn").click();
    assert.equal(
      await page
        .locator("header .service-nav-group .nbtn")
        .getAttribute("aria-expanded"),
      "true",
    );
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#hamburger").click();
    await page
      .locator("#mobileMenu .mob-link")
      .filter({ hasText: /^Services$/ })
      .click();
    assert.equal(await page.locator("#mobileMenu .mob-sub.open a").count(), 16);
    await page.locator('#mobileMenu a[href="/qa-testing"]').click();
    await page.waitForURL("**/qa-testing");
    await page.locator("[data-react-route]").waitFor({ state: "attached" });
    assert.equal(
      await page.locator("h1").textContent(),
      services.find((item) => item.slug === "qa-testing").headline,
    );
    await page.screenshot({
      path: path.join(root, "test-results/service-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("home API content, contact submissions, attachments and reset work with fixtures", async () => {
  const { page, open, errors, requests, close } = await session();
  try {
    await open("index.html");
    await page.locator('a[href="/projects/project-fixture"]').first().waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".hero h1,.hero h1 *")].every(
        (node) => Number(getComputedStyle(node).opacity) > 0.99,
      ),
    );
    for (const element of await page.locator(".reveal:visible").all())
      await element.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: path.join(root, "test-results/home-hero-desktop.png"),
    });
    await page.screenshot({
      path: path.join(root, "test-results/home-desktop.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(root, "test-results/home-hero-mobile.png"),
    });
    await page.screenshot({
      path: path.join(root, "test-results/home-mobile.png"),
      fullPage: true,
    });
    await open("contactus.html");
    await page.locator('#cForm [name="name"]').fill("Local test");
    await page.locator('#cForm [name="email"]').fill("test@example.test");
    await page.locator('#cForm [name="phone"]').fill("1234567890");
    await page.locator('#cForm [name="company"]').fill("Example company");
    await page
      .locator('#cForm [name="desc"]')
      .fill("A fixture-only contact request.");
    await page.locator("#fileIn").setInputFiles({
      name: "brief.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Test brief"),
    });
    await page.locator("#chkBox").click();
    await page.locator("#subBtn").click();
    await page.locator("#successBox").waitFor({ state: "visible" });
    assert.ok(
      requests.some(
        (request) =>
          request.method === "POST" &&
          request.path === "/api/submissions" &&
          request.body.includes("brief.txt"),
      ),
    );
    await page.locator(".btn-reset").click();
    assert.equal(await page.locator('#cForm [name="name"]').inputValue(), "");
    assert.equal(
      await page.locator("#chkBox").getAttribute("class"),
      "chk-box",
    );
    await page.screenshot({
      path: path.join(root, "test-results/contact-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("public layout, visible map pins, language menu and business contact links work on desktop and mobile", async () => {
  const mapLocations = [
    { _id: "location-one", name: "Mumbra client", city: "Mumbra", country: "India", lat: 19.17541, lng: 73.026638 },
    { _id: "location-two", name: "Mulund client", city: "Mulund", country: "India", lat: 19.1725, lng: 72.9416 },
  ];
  const { page, open, errors, close } = await session({ mapLocations, projectCount: 4, translation: true });
  try {
    await open("/");
    await page.locator("#main-projects-grid .project-card").first().waitFor();
    const spacing = await page.locator("#sec-projects").evaluate((section) => ({
      padding: parseFloat(getComputedStyle(section).paddingTop),
      gap: section.querySelector(".project-filters").getBoundingClientRect().top - section.querySelector(".sec-hd").getBoundingClientRect().bottom,
    }));
    assert.ok(spacing.padding >= 64, "projects need section padding");
    assert.ok(spacing.gap >= 24, "filters must clear the heading");
    assert.equal(await page.locator(".project-filter").count(), 10);
    await page.getByRole("button", { name: "Show More", exact: true }).click();
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 4);
    await page.getByRole("button", { name: "Show Less", exact: true }).click();
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 3);
    await page.getByRole("button", { name: "iOS App", exact: true }).click();
    assert.match(await page.locator(".empty-projects").textContent(), /in this category/);
    await page.locator("#sec-map").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const pins = [...document.querySelectorAll(".leaflet-marker-icon")];
      return pins.length === 2 && pins.every((pin) => pin.complete && pin.naturalWidth > 0 && !pin.src.includes("node_modules"));
    });
    await page.getByRole("button", { name: "Show Mumbra client on map" }).click();
    await page.locator(".leaflet-popup-content strong").waitFor();
    assert.equal(await page.locator(".leaflet-popup-content strong").textContent(), "Mumbra client");
    assert.ok((await page.locator(".leaflet-popup-content").boundingBox()).width >= 200);
    await page.locator("#clientsMap").evaluate((map) => map.scrollIntoView({ block: "start", behavior: "instant" }));
    assert.ok(await page.evaluate(() => document.elementFromPoint(innerWidth / 2, 25)?.closest("header")), "map controls must stay below the header");
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      assert.equal(await page.locator(".hero-content").evaluate((content) => Number(getComputedStyle(content).opacity)), 1, "mobile hero content must remain visible");
      const trigger = page.getByRole("button", { name: "Choose website language" });
      await trigger.click();
      const bounds = await page.locator(".language-panel").evaluate((panel) => {
        const rect = panel.getBoundingClientRect();
        return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: innerWidth, height: innerHeight, headerBottom: document.querySelector("header").getBoundingClientRect().bottom };
      });
      assert.ok(bounds.top >= bounds.headerBottom, "language panel must clear the header");
      assert.ok(bounds.left >= 0 && bounds.right <= bounds.width && bounds.bottom <= bounds.height, "language menu must fit the viewport");
      await page.getByPlaceholder("Search languages").fill("Hindi");
      assert.equal(await page.locator(".language-option").count(), 1);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator(".language-panel").count(), 0);
      assert.ok(await trigger.evaluate((button) => button === document.activeElement));
    }
    for (const route of ["/", "/contact", "/services", "/blog", "/projects/project-fixture"]) {
      await open(route);
      assert.ok(await page.locator('a[href="mailto:sakinzo.work@gmail.com"]').count(), route);
      assert.ok(await page.locator('a[href="tel:+918879162814"]').count(), route);
      assert.ok(await page.locator('a[href="https://www.instagram.com/sakin.zo/"]').count(), route);
      if (route === "/contact") assert.equal(await page.locator(".contact-details--methods a").count(), 3);
    }
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("footer attachments support select, remove, size validation and submit; the original phone hero remains clickable", async () => {
  const { page, open, requests, errors, close } = await session();
  try {
    await open("/");
    const form = page.locator("#indexContactForm");
    const row = await form.locator(".footer-form-row").first().evaluate((row) => {
      const [name, email] = [...row.querySelectorAll("input")].map((input) => input.getBoundingClientRect());
      return { sameRow: Math.abs(name.top - email.top) < 2, separated: name.right < email.left };
    });
    assert.ok(row.sameRow && row.separated);
    assert.match(await page.locator(".ft-addr").textContent(), /Mumbai.*Thane/);
    assert.doesNotMatch(await page.locator(".ft-addr").textContent(), /Pune/i);
    await form.locator("#indexAttachment").setInputFiles({ name: "brief.pdf", mimeType: "application/pdf", buffer: Buffer.from("Fixture brief") });
    assert.equal(await form.locator("#indexAttachLabel").textContent(), "brief.pdf");
    await form.getByRole("button", { name: "Remove attachment" }).click();
    assert.equal(await form.locator("#indexAttachLabel").textContent(), "Add an attachment");
    await form.locator("#indexAttachment").setInputFiles({ name: "too-large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
    assert.match(await form.getByRole("alert").textContent(), /smaller than 10 MB/);
    assert.equal(await form.locator(".attachment-remove").count(), 0);
    await form.locator("#indexAttachment").setInputFiles({ name: "footer-brief.pdf", mimeType: "application/pdf", buffer: Buffer.from("Footer fixture") });
    await form.locator('[name="name"]').fill("Footer test");
    await form.locator('[name="email"]').fill("fixture@example.test");
    await form.locator('[name="desc"]').fill("Fixture-only footer request.");
    await form.locator('input[type="checkbox"]').check();
    await form.getByRole("button", { name: "Send Request", exact: true }).click();
    await form.getByRole("status").waitFor();
    assert.ok(requests.some((request) => request.path === "/api/submissions" && request.method === "POST" && request.body.includes("footer-brief.pdf") && request.body.includes("Website footer")));
    await form.getByRole("button", { name: "Send another request" }).click();
    for (const width of [360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const hero = await page.locator(".home-hero-photo").evaluate((hero) => {
        const link = hero.querySelector(".hero-cta"), rect = link.getBoundingClientRect();
        return { image: getComputedStyle(hero).backgroundImage, clickable: document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest("a") === link, width: rect.width, height: rect.height };
      });
      assert.match(hero.image, /sakinzo-hero-mobile\.webp/);
      assert.ok(hero.clickable && hero.width > 120 && hero.height >= 44);
    }
    await page.locator(".home-hero-photo .hero-cta").click();
    await page.locator('[data-react-route="contactus"]').waitFor({ state: "attached" });
    assert.ok(page.url().includes("/contact#form-section"));
    assert.equal(await page.locator(".attachment-picker #fileIn").count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("project cards retain working gallery images when the saved cover link fails", async () => {
  const { page, open, errors, close } = await session({ brokenCover: true });
  try {
    await open("/");
    const card = page.locator("#main-projects-grid .project-card").first();
    await card.waitFor();
    await card.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector("#main-projects-grid .project-img.active");
      return image?.src.endsWith("/assets/service-ai.webp") && image.complete && image.naturalWidth > 0;
    });
    assert.equal(await card.locator(".project-img-fallback").count(), 0);
    assert.equal(await card.locator(".project-img").count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("blog guides render safe React content and project previews switch devices without iframe reloads", async () => {
  const { page, open, errors, close } = await session();
  try {
    await open("blog.html?slug=engineering-guide");
    await page.locator("h1").filter({ hasText: article.title }).waitFor();
    assert.ok((await page.locator(".article-toc a").count()) > 2);
    assert.ok((await page.locator(".article-content h2").count()) > 2);
    await page.locator(".article-toc a").first().click();
    assert.ok(new URL(page.url()).hash.startsWith("#guide-"));
    await page.screenshot({
      path: path.join(root, "test-results/blog-desktop.png"),
      fullPage: true,
    });
    await open("project.html?id=project-fixture");
    await page.locator("#livePreview").waitFor();
    await page.locator(".preview-frame").evaluate((frame) => {
      frame.dataset.original = "true";
    });
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const device of ["phone", "tablet", "desktop"]) {
        await page.locator(`[data-preview-device="${device}"]`).click();
        assert.equal(
          await page.locator("#livePreviewDevice").getAttribute("data-device"),
          device,
        );
        assert.equal(
          await page.locator(".preview-frame").getAttribute("data-original"),
          "true",
        );
        const metrics = await page
          .locator(".preview-device")
          .evaluate((element) => ({
            box: element.getBoundingClientRect().toJSON(),
            width: innerWidth,
          }));
        assert.ok(
          metrics.box.left >= -1 && metrics.box.right <= metrics.width + 1,
          `${width}/${device}: preview clipping`,
        );
      }
    }
    assert.equal(await page.locator("video.project-video").count(), 1);
    await page.screenshot({
      path: path.join(root, "test-results/project-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("admin login, navigation, edit modal and video upload retain their API behavior", async () => {
  const { page, open, errors, requests, close } = await session();
  try {
    await open("admin.html");
    await page.locator('#loginForm [name="email"]').fill("owner@example.test");
    await page.locator("#loginPassword").fill("local-test-password");
    await page.locator("#loginButton").click();
    await page.locator("#app").waitFor({ state: "visible" });
    await page.locator('#nav [data-page="projects"]').click();
    await page
      .locator("button")
      .filter({ hasText: /^Edit$/ })
      .first()
      .click();
    await page
      .locator('#modalForm [name="title"]')
      .fill("Updated connected app");
    await page.locator("#upload-project-video").setInputFiles({
      name: "project-demo.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from("Fixture video bytes"),
    });
    await page
      .locator("#modalForm button")
      .filter({ hasText: "Save changes" })
      .click();
    await page.locator("#modal").waitFor({ state: "hidden" });
    assert.ok(
      requests.some(
        (request) =>
          request.path === "/api/upload/videos" && request.method === "POST",
      ),
    );
    const saved = requests.find(
      (request) =>
        request.path === "/api/projects/project-fixture" &&
        request.method === "PUT",
    );
    assert.ok(saved, "updated project was submitted");
    assert.equal(JSON.parse(saved.body).title, "Updated connected app");
    assert.ok(
      JSON.parse(saved.body).videoUrl.endsWith(
        "/api/upload/videos/video-fixture",
      ),
    );
    await page.screenshot({
      path: path.join(root, "test-results/admin-desktop.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("translation retains form values, switches RTL correctly and restores English", async () => {
  const { page, open, errors, requests, close } = await session({
    translation: true,
  });
  try {
    await open("/contact");
    await page.locator('#cForm [name="name"]').fill("Original form value");
    const original = await page.locator("h2#contactFormTitle").textContent();
    const choose = async (name) => {
      await page.locator("header .language-trigger").click();
      await page.getByRole("option").filter({ hasText: name }).click();
    };
    await choose("Hindi");
    await page.waitForFunction(
      () =>
        document.documentElement.lang === "hi" &&
        document
          .querySelector("#contactFormTitle")
          ?.textContent.includes("\u0939\u093f\u0902\u0926\u0940"),
    );
    assert.equal(
      await page.locator('#cForm [name="name"]').inputValue(),
      "Original form value",
    );
    assert.equal(
      (await page.locator("header .logo-txt").textContent()).trim(),
      "Sakin.zo",
    );
    await choose("Urdu");
    await page.waitForFunction(() => document.documentElement.dir === "rtl");
    await choose("English");
    await page.waitForFunction(() => document.documentElement.lang === "en");
    assert.equal(
      await page.locator("#contactFormTitle").textContent(),
      original,
    );
    assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("admin PWA retains its React shell when opened offline", async () => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/admin.html`);
    await page.locator("[data-react-route]").waitFor({ state: "attached" });
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.waitForFunction(() =>
      Boolean(navigator.serviceWorker.controller),
    );
    await context.setOffline(true);
    await page.reload();
    await page.locator("[data-react-route]").waitFor({ state: "attached" });
    assert.equal(await page.locator("#loginForm").isVisible(), true);
    assert.equal(
      await page.locator("#loginPassword").getAttribute("type"),
      "password",
    );
  } finally {
    await context.close();
  }
});

await test("React navigation preserves the document across routes, back navigation and blog query links", async () => {
  const { page, open, errors, close } = await session();
  try {
    await open("/");
    await page.evaluate(() => (window.__navigationSentinel = "same-document"));
    await page.locator("header .service-nav-group .nbtn").click();
    await page.locator("header .service-menu-all").click();
    await page.waitForURL("**/services");
    await page.locator(".service-grid").first().waitFor();
    assert.equal(
      await page.evaluate(() => window.__navigationSentinel),
      "same-document",
    );
    await page.locator('.service-grid a[href="/qa-testing"]').first().click();
    await page.waitForURL("**/qa-testing");
    await page.locator("h1").waitFor();
    await page.goBack();
    await page.waitForURL("**/services");
    await page.locator(".service-grid").first().waitFor();
    assert.equal(
      await page.evaluate(() => window.__navigationSentinel),
      "same-document",
    );
    await page
      .locator("header .nbtn")
      .filter({ hasText: /^Insights$/ })
      .click();
    await page.locator('header .drop a[href="/blog"]').click();
    await page.locator(".post-card a").first().click();
    await page.locator("h1").filter({ hasText: article.title }).waitFor();
    assert.equal(
      await page.evaluate(() => window.__navigationSentinel),
      "same-document",
    );
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});
await test("employee project edits submit approvals and unauthorized sections remain inaccessible", async () => {
  const { page, open, requests, errors, close } = await session({
    employee: true,
  });
  try {
    await open("/admin");
    await page
      .locator('#loginForm [name="email"]')
      .fill("employee@example.test");
    await page.locator("#loginPassword").fill("fixture-password");
    await page.locator("#loginButton").click();
    await page.locator("#app").waitFor();
    await page.locator('#nav [data-page="projects"]').click();
    assert.equal(await page.locator('#nav [data-page="blogs"]').count(), 0);
    await page
      .getByRole("button", { name: "Edit", exact: true })
      .first()
      .click();
    await page
      .locator('#modalForm [name="title"]')
      .fill("Employee project request");
    await page.locator('#modalForm button[type="submit"]').click();
    await page.locator("#modal").waitFor({ state: "hidden" });
    const request = requests.find(
      (row) => row.path === "/api/approvals" && row.method === "POST",
    );
    assert.ok(request);
    const payload = JSON.parse(request.body);
    assert.equal(payload.resourceType, "projects");
    assert.equal(payload.action, "update");
    assert.equal(payload.payload.title, "Employee project request");
    assert.equal(
      requests.some(
        (row) =>
          row.path === "/api/projects/project-fixture" && row.method === "PUT",
      ),
      false,
    );
    await open("/admin/blogs");
    await page.locator("#pages").getByRole("alert").waitFor();
    assert.ok(
      (await page.locator("#pages").textContent()).includes(
        "do not have access",
      ),
    );
    assert.deepEqual(errors, []);
  } finally {
    await close();
  }
});

await test("header dropdowns remain open across the pointer gap and support keyboard navigation", async () => {
  const { page, open, errors, close } = await session();
  try {
    for (const path of ["/", "/contact", "/ai-development", "/blog"]) {
      await open(path);
      for (const label of ["About Us", "Services"]) {
        const trigger = page.locator("header .nbtn").filter({ hasText: label });
        const group = trigger.locator("..");
        const menu = group.locator(".drop");
        await trigger.hover();
        await menu.waitFor({ state: "visible" });
        assert.equal(await trigger.getAttribute("aria-expanded"), "true");
        const button = await trigger.boundingBox(), panel = await menu.boundingBox();
        await page.mouse.move(button.x + button.width / 2, (button.y + button.height + panel.y) / 2);
        // Staying in the visual gap must not run out the delayed close timer.
        await page.waitForTimeout(300);
        assert.equal(await menu.isVisible(), true, `${path}: ${label} closes in the gap`);
        await menu.locator("a").first().hover();
        assert.equal(await menu.isVisible(), true);
        await page.mouse.move(1400, 800);
        await menu.waitFor({ state: "hidden" });
        await trigger.focus();
        await page.keyboard.press("ArrowDown");
        await menu.waitFor({ state: "visible" });
        await page.waitForFunction(() => document.activeElement?.matches(".drop a"));
        await page.keyboard.press("Escape");
        await menu.waitFor({ state: "hidden" });
        assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
      }
    }
    await open("/");
    await page.locator("header .nbtn").filter({ hasText: "About Us" }).hover();
    await page.locator('header .drop a[href="/careers"]').click();
    await page.waitForURL("**/careers");
    await page.locator("header .drop").first().waitFor({ state: "hidden" });
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("failed and slow public data has styled recovery controls and preserves saved projects", async () => {
  const { page, open, errors, close } = await session();
  let mode = "hold", release;
  let gate = new Promise(resolve => { release = resolve; });
  const hold = () => { mode = "hold"; gate = new Promise(resolve => { release = resolve; }); };
  await page.route("**/api/public/site-data", async route => {
    if (mode === "hold") await gate;
    await route.fulfill(mode === "error" ? { status: 503, json: { message: "Fixture outage" } } :
      { json: { ...siteData, projects: mode === "empty" ? [] : [project] } }).catch(() => {});
  });
  try {
    await open("/");
    await page.locator("#sec-projects .project-skeleton").first().waitFor();
    assert.equal(await page.locator("#sec-projects .project-skeleton").count(), 3);
    assert.equal(await page.locator(".project-filter").count(), 0);
    mode = "error"; release();
    const failure = page.locator('#sec-projects .content-state[data-state="error"]');
    await failure.waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const retry = failure.getByRole("button", { name: "Try again", exact: true });
      const appearance = await retry.evaluate(element => ({ height: element.getBoundingClientRect().height,
        background: getComputedStyle(element).backgroundColor }));
      assert.ok(appearance.height >= 44);
      assert.equal(appearance.background, "rgb(22, 115, 255)");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await failure.screenshot({ path: path.join(root, `test-results/projects-recovery-${width}.png`) });
    }
    hold();
    await failure.getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator("#sec-projects .project-skeleton").first().waitFor();
    assert.equal(await page.locator('#sec-projects .content-state[data-state="error"]').count(), 0);
    mode = "success"; release();
    await page.locator("#main-projects-grid .project-card").first().waitFor();
    assert.equal(await page.locator(".project-filter").count(), 10);
    mode = "error";
    await page.reload();
    await page.locator('#sec-projects .content-state--compact[data-state="error"]').waitFor();
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 1);
    hold();
    await page.locator("#sec-projects").getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator("#sec-projects").getByRole("button", { name: "Refreshing…", exact: true }).waitFor();
    assert.equal(await page.locator("#sec-projects .content-state-action").isDisabled(), true);
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 1);
    mode = "success"; release();
    await page.locator("#sec-projects .content-state--compact").waitFor({ state: "hidden" });
    mode = "empty";
    await page.reload();
    await page.getByRole("heading", { name: "No projects published yet." }).waitFor();
    assert.equal(await page.locator("#sec-projects .content-state-action").count(), 0);
    assert.equal(await page.locator(".project-filter").count(), 0);
    await page.route("**/api/blogs", route => route.fulfill({ status: 503, json: {} }));
    await open("/blog");
    await page.getByRole("heading", { name: "Articles are temporarily unavailable" }).waitFor();
    assert.equal(await page.locator(".content-state-action").isVisible(), true);
    await page.route("**/api/projects/unavailable", route => route.fulfill({ status: 503, json: {} }));
    await open("/projects/unavailable");
    await page.getByRole("heading", { name: "Project details are temporarily unavailable" }).waitFor();
    assert.equal(await page.locator(".content-state-action").isVisible(), true);
    assert.deepEqual(errors, []);
  } finally { release(); await close(); }
});

await test("page JavaScript loads alongside CSS and failed styling recovers without showing a broken layout", async () => {
  const { page, errors, close } = await session();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let fail = true, stylesheetRequests = 0;
  await page.route("**/assets/page-index-*.css", async route => {
    stylesheetRequests++;
    if (fail) { await gate; await route.abort().catch(() => {}); }
    else await route.continue();
  });
  try {
    const pageChunk = page.waitForRequest(request => /\/assets\/SiteHeader-[^/]+\.js$/.test(request.url()));
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.locator(".route-loading").waitFor();
    await pageChunk;
    assert.equal(await page.locator(".home-hero-photo").count(), 0);
    assert.equal(stylesheetRequests, 1);
    release();
    await page.getByRole("heading", { name: "This page couldn't finish loading" }).waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const retry = page.getByRole("button", { name: "Try again", exact: true });
      const appearance = await retry.evaluate(element => ({ height: element.getBoundingClientRect().height,
        background: getComputedStyle(element).backgroundColor }));
      assert.ok(appearance.height >= 44);
      assert.equal(appearance.background, "rgb(22, 115, 255)");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(root, `test-results/stylesheet-recovery-${width}.png`) });
    }
    fail = false;
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator(".home-hero-photo").waitFor();
    assert.equal(stylesheetRequests, 2);
    assert.equal(await page.locator('link[data-react-page-style][media="all"]').count(), 1);
    assert.equal(await page.locator('link[href*="leaflet"]').count(), 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator("header .nbtn").filter({ hasText: /^Insights$/ }).click();
    await page.locator('header .drop a[href="/blog"]').click();
    await page.locator(".post-card").first().waitFor();
    await page.goBack();
    await page.locator(".home-hero-photo").waitFor();
    assert.equal(stylesheetRequests, 2, "Returning to a page should reuse its loaded CSS");
    assert.deepEqual(errors, []);
  } finally { release(); await close(); }
});

await test("saved public articles and project details remain usable through slow reloads and outages", async () => {
  const { page, open, errors, close } = await session();
  let mode = "success", release;
  let gate;
  const hold = () => { mode = "hold"; gate = new Promise(resolve => { release = resolve; }); };
  const respond = async route => {
    if (mode === "hold") await gate;
    const blog = new URL(route.request().url()).pathname.endsWith("/blogs");
    await route.fulfill(mode === "success" ? { json: blog ? [article] : project }
      : { status: mode === "missing" ? 404 : 503, json: {} }).catch(() => {});
  };
  await page.route("**/api/blogs", respond);
  await page.route("**/api/projects/project-fixture", respond);
  try {
    await open("/blog");
    await page.locator(".post-card").first().waitFor();
    hold();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Updating articles…", exact: true }).waitFor();
    assert.equal(await page.locator(".post-card").count(), 1);
    mode = "error"; release();
    await page.getByRole("heading", { name: "Showing saved articles" }).waitFor();
    assert.equal(await page.locator(".post-card").count(), 1);
    mode = "success";
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator(".content-state--compact").waitFor({ state: "hidden" });
    await open("/projects/project-fixture");
    await page.getByRole("heading", { name: project.title, exact: true }).waitFor();
    hold();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Updating project details…", exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: project.title, exact: true }).count(), 1);
    mode = "error"; release();
    await page.getByRole("heading", { name: "Showing saved project details" }).waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const notice = page.locator(".remote-refresh-note .content-state");
      const copy = await notice.locator(".content-state-copy").boundingBox();
      const button = await notice.locator("button").boundingBox();
      const hero = await page.locator('[data-hero-page="project"]').boundingBox();
      const panel = await notice.boundingBox();
      assert.ok(hero.y >= panel.y + panel.height, "Saved-data notice must not overlap the project hero");
      if (width === 390) {
        assert.ok(copy.width >= 200, "The saved-data message needs readable text width");
        assert.ok(button.y >= copy.y + copy.height, "Retry belongs below the message on mobile");
      }
      await page.screenshot({ path: path.join(root, `test-results/saved-project-recovery-${width}.png`) });
    }
    mode = "missing";
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.getByRole("heading", { name: "Project not found", exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: project.title, exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => Object.keys(localStorage).some(key => key.startsWith("sakinzo-public-v1:") && key.endsWith(":/projects/project-fixture"))), false);
    assert.deepEqual(errors, []);
  } finally { release?.(); await close(); }
});

await test("incomplete saved site data does not break the homepage and stalled requests expose a styled retry", async () => {
  const { page, open, errors, close } = await session();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.addInitScript(cached => {
    localStorage.setItem("sakinzo-site-data-v6", JSON.stringify({ data: cached }));
    const original = window.setTimeout;
    window.setTimeout = (handler, delay, ...args) => original(handler, delay === 30000 ? 500 : delay, ...args);
  }, { ...siteData, projects: [null, project], clients: [null], mapLocations: [null], sections: null, contactPage: null });
  await page.route("**/api/public/site-data", async route => { await gate; await route.fulfill({ json: siteData }).catch(() => {}); });
  try {
    await open("/");
    await page.getByRole("heading", { name: "Showing saved projects" }).waitFor();
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 1);
    assert.ok(await page.locator("#sec-projects .content-state-action").isEnabled());
    assert.deepEqual(errors, []);
  } finally { release(); await close(); }
});

await test("legacy Render blog covers and insight links work locally across every original guide", async () => {
  const { page, open, errors, close } = await session();
  const posts = JSON.parse(fs.readFileSync(path.join(root, "content/blogs/posts.json"), "utf8")).map((post, index) => ({
    ...post, _id: `original-guide-${index}`, readTime: 5,
    body: fs.readFileSync(path.join(root, "content/blogs", post.bodyFile), "utf8"),
  }));
  const insights = posts.map(post => ({ ...post, image: post.coverImage, desc: post.excerpt,
    articleUrl: `https://sakinzo-work.github.io/sakinzo/frontend/blog.html?slug=${post.slug}` }));
  const external = { _id: "external-insight", title: "External reference", image: "https://example.test/cover.webp", articleUrl: "https://example.test/article" };
  await page.route("**/api/blogs", route => route.fulfill({ json: posts }));
  await page.route("**/api/public/site-data", route => route.fulfill({ json: { ...siteData, blogs: posts, insights: [...insights, external] } }));
  const legacyRequests = [];
  page.on("request", request => { if (request.url().startsWith("https://sakinzo-work.github.io/")) legacyRequests.push(request.url()); });
  try {
    await open("/");
    await page.locator("#main-insights-grid .ins-card").first().waitFor();
    for (let index = 0; index < posts.length; index++) {
      const card = page.locator("#main-insights-grid .ins-card").nth(index);
      await card.scrollIntoViewIfNeeded();
      assert.equal(await card.locator("img").getAttribute("src"), "/assets/" + posts[index].coverImage.split("/assets/")[1]);
      await card.locator("img").evaluate(image => image.decode());
      assert.equal(await card.locator("a").getAttribute("href"), `/blog/${posts[index].slug}`);
      assert.equal(await card.locator("a").getAttribute("target"), null);
    }
    const externalLink = page.locator('#main-insights-grid a[href="https://example.test/article"]');
    assert.equal(await externalLink.getAttribute("target"), "_blank");
    await page.locator("#main-insights-grid .ins-card a").first().click();
    await page.getByRole("heading", { name: posts[0].title, exact: true }).waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await open("/blog");
      assert.equal(await page.locator(".post-card").count(), 4);
      for (const image of await page.locator(".post-cover img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(node => node.decode());
      }
      for (const post of posts) {
        await page.locator(`.post-card a[href="/blog/${post.slug}"]`).click();
        await page.getByRole("heading", { name: post.title, exact: true }).waitFor();
        await page.locator(".article-cover").evaluate(image => image.decode());
        await page.locator(".page-hero-image").evaluate(image => image.decode());
        assert.ok(await page.locator(".article-content h2").count() > 2);
        const toc = page.locator(".article-toc a").first();
        await toc.click();
        assert.ok(new URL(page.url()).hash.startsWith("#guide-"));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.locator(".article-header .back").click();
        await page.locator(".post-card").first().waitFor();
      }
    }
    await open("/blog/" + posts[0]._id);
    await page.getByRole("heading", { name: posts[0].title, exact: true }).waitFor();
    await open("/blog/" + posts[0].slug);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: posts[0].title, exact: true }).waitFor();
    await page.locator(".article-cover").evaluate(image => image.decode());
    await page.screenshot({ path: path.join(root, "test-results/blog-fixed-mobile.png"), fullPage: false });
    assert.deepEqual(legacyRequests, []);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("missing blog images have a cover fallback and article URLs have loading, retry and missing states", async () => {
  const { page, open, errors, close } = await session();
  let mode = "hold", release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route("**/api/blogs", async route => {
    if (mode === "hold") await gate;
    await route.fulfill(mode === "error" ? { status: 503, json: {} } :
      { json: [{ ...article, category: "AI Development", coverImage: "https://sakinzo-work.github.io/sakinzo/frontend/assets/missing-cover.webp" }] }).catch(() => {});
  });
  try {
    await open("/blog/engineering-guide");
    await page.getByRole("heading", { name: "Loading article…", exact: true }).waitFor();
    assert.equal(await page.locator(".blog-grid").count(), 0);
    mode = "error"; release();
    await page.getByRole("heading", { name: "This article couldn't be loaded", exact: true }).waitFor();
    mode = "success";
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.getByRole("heading", { name: article.title, exact: true }).waitFor();
    await page.waitForFunction(() => {
      const image = document.querySelector(".article-cover");
      return image?.complete && image.naturalWidth > 0 && image.getAttribute("src") === "/assets/service-ai.webp";
    });
    await page.locator(".article-header .back").click();
    await page.waitForFunction(() => {
      const image = document.querySelector(".post-cover img");
      return image?.complete && image.naturalWidth > 0 && image.getAttribute("src") === "/assets/service-ai.webp";
    });
    await page.route("**/assets/service-ai.webp", route => route.abort());
    await open("/blog");
    await page.waitForFunction(() => {
      const image = document.querySelector(".post-cover img");
      return image?.complete && image.naturalWidth > 0 && image.getAttribute("src") === "/assets/page-insights.webp";
    });
    await page.route("**/assets/page-insights.webp", route => route.abort());
    await open("/blog");
    await page.locator(".post-cover .blog-image-fallback").waitFor();
    assert.equal(await page.locator(".post-cover img").count(), 0);
    await open("/blog/not-a-published-article");
    await page.getByRole("heading", { name: "Article not found", exact: true }).waitFor();
    assert.equal(await page.locator(".blog-grid").count(), 0);
    assert.deepEqual(errors, []);
  } finally { release(); await close(); }
});

await test("homepage service images, panels and plus/minus controls stay synchronized on desktop and mobile", async () => {
  const { page, open, errors, close } = await session();
  const items = [
    ["web-mobile-development", "Web and Mobile Development"],
    ["devops-solutions", "DevOps Solutions"],
    ["architecture-design", "Architecture Design"],
    ["poc-mvp-development", "PoC, Prototype, MVP"],
    ["qa-testing", "QA & Testing"],
    ["ux-ui-design", "UX/UI Design"],
    ["business-analysis", "BA"],
  ];
  try {
    await open("/");
    const section = page.locator("#sec-services");
    const artwork = section.locator("#svcImg .svc-artwork");
    const images = new Set();
    for (const width of [1440, 1025, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [slug, title] of items) {
        const trigger = section.getByRole("button", { name: title, exact: true });
        await trigger.click();
        assert.equal(await trigger.getAttribute("aria-expanded"), "true");
        assert.equal(await section.locator('.svc-head[aria-expanded="true"]').count(), 1);
        assert.equal(await section.locator(".svc-item.open").count(), 1);
        assert.equal(await section.locator(".svc-item.open .svc-tog").textContent(), "−");
        assert.deepEqual(await section.locator(".svc-item:not(.open) .svc-tog").allTextContents(), Array(6).fill("+"));
        assert.equal(await artwork.getAttribute("data-service"), slug);
        const panel = section.locator(`#${await trigger.getAttribute("aria-controls")}`);
        assert.ok(await panel.isVisible());
        assert.equal(await panel.getAttribute("aria-labelledby"), await trigger.getAttribute("id"));
        assert.equal(await section.locator(".svc-body:visible").count(), 1);
        assert.equal(await panel.locator("a").getAttribute("href"), `/${slug}`);
        const visibleArt = width <= 900 ? panel.locator(".svc-artwork-mobile") : artwork;
        assert.ok(await visibleArt.isVisible());
        const image = visibleArt.locator("img");
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(image => image.decode());
        await visibleArt.locator(".svc-service-image.is-loaded").waitFor();
        assert.ok((await image.getAttribute("alt")).length > 30);
        assert.ok(await image.evaluate(image => image.complete && image.naturalWidth > 0 && /-(640|1200)\.webp$/.test(image.currentSrc)));
        assert.ok((await visibleArt.locator("source").getAttribute("srcset")).includes("640w"));
        const box = await visibleArt.boundingBox();
        assert.ok(Math.abs(box.width / box.height - 4 / 3) < 0.02, "The image reserves a stable 4:3 frame");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} overflows at ${width}`);
        if (width === 1440) {
          images.add(await image.evaluate(image => image.currentSrc));
          await section.locator("#svcImg").screenshot({ path: path.join(root, `test-results/service-art-${slug}.png`) });
        }
        if (width === 390) await section.locator(".svc-item.open").screenshot({ path: path.join(root, `test-results/service-art-mobile-${slug}.png`) });
      }
    }
    assert.equal(images.size, 7, "Every service needs its own generated image");
    await page.setViewportSize({ width: 1440, height: 1000 });
    const qa = section.getByRole("button", { name: "QA & Testing", exact: true });
    await qa.focus();
    await page.keyboard.press("Enter");
    assert.equal(await artwork.getAttribute("data-service"), "qa-testing");
    const devops = section.getByRole("button", { name: "DevOps Solutions", exact: true });
    await devops.focus();
    await page.keyboard.press("Space");
    assert.equal(await artwork.getAttribute("data-service"), "devops-solutions");
    await devops.click();
    assert.equal(await devops.getAttribute("aria-expanded"), "true");
    await section.screenshot({ path: path.join(root, "test-results/services-synchronized-desktop.png") });
    await section.locator('.svc-item.open a[href="/devops-solutions"]').focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/devops-solutions");
    await page.getByRole("heading", { name: services.find(service => service.slug === "devops-solutions").headline, exact: true }).waitFor();
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("service images have a stable loading frame and a matching illustration fallback when files fail", async () => {
  const { page, open, errors, close } = await session();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const imageRequests = [];
  page.on("request", request => { if (/\/assets\/services-.*-3d-v1-/.test(request.url())) imageRequests.push(request.url()); });
  await page.route("**/assets/services-web-mobile-3d-v1-*.webp", async route => { await gate; await route.continue().catch(() => {}); });
  await page.route("**/assets/services-testing-3d-v1-*.webp", route => route.abort());
  try {
    await open("/");
    const section = page.locator("#sec-services");
    const frame = section.locator("#svcImg");
    await frame.scrollIntoViewIfNeeded();
    const before = await frame.boundingBox();
    assert.ok(before.height > 200);
    assert.ok(!imageRequests.some(url => url.includes("services-devops-")), "Unopened service images do not slow the initial page load");
    release();
    await frame.locator("img.is-loaded").waitFor();
    const after = await frame.boundingBox();
    assert.ok(Math.abs(after.height - before.height) < 1);
    assert.ok(Math.abs(after.width - before.width) < 1);
    await section.getByRole("button", { name: "QA & Testing", exact: true }).click();
    await frame.getByRole("img", { name: "QA & Testing", exact: true }).waitFor();
    assert.equal(await frame.locator("img").count(), 0);
    assert.equal(await frame.locator("[data-service]").first().getAttribute("data-service"), "qa-testing");
    await page.setViewportSize({ width: 390, height: 900 });
    const panel = section.locator(".svc-item.open .svc-body");
    await panel.locator(".svc-artwork-mobile").scrollIntoViewIfNeeded();
    await panel.getByRole("img", { name: "QA & Testing", exact: true }).waitFor();
    assert.ok(await panel.getByRole("img", { name: "QA & Testing", exact: true }).isVisible());
    await section.getByRole("button", { name: "UX/UI Design", exact: true }).click();
    const recovered = section.locator(".svc-item.open .svc-artwork-mobile img");
    await recovered.scrollIntoViewIfNeeded();
    await recovered.evaluate(image => image.decode());
    assert.ok(await recovered.evaluate(image => image.complete && image.naturalWidth > 0));
    assert.deepEqual(errors, []);
  } finally { release(); await close(); }
});

await test("admin startup avoids overlapping syncs and recovers from failed, stalled and expired sessions", async () => {
  const { page, open, errors, close } = await session();
  await page.clock.install();
  await page.addInitScript(() => sessionStorage.setItem("sakinzo_admin_token", "mock-admin-session"));
  let mode = "hold-projects", releaseProjects, releaseAuth, authCalls = 0;
  const projectGate = new Promise(resolve => { releaseProjects = resolve; });
  const authGate = new Promise(resolve => { releaseAuth = resolve; });
  await page.route("**/api/auth/me", async route => {
    authCalls++;
    if (mode === "stall-auth") await authGate;
    await route.fulfill(mode === "expired" ? { status: 401, json: { message: "Session expired" } } : { json: { admin } }).catch(() => {});
  });
  await page.route("**/api/projects/admin/all", async route => {
    if (mode === "hold-projects") await projectGate;
    await route.fulfill(mode === "fail-projects" ? { status: 503, json: { message: "Fixture server unavailable" } } : { json: [project] }).catch(() => {});
  });
  try {
    await open("/admin");
    await page.getByRole("heading", { name: "Opening admin console", exact: true }).waitFor();
    await page.clock.fastForward(16000);
    assert.equal(authCalls, 1, "The polling interval must not restart a pending initial sync");
    mode = "success"; releaseProjects();
    await page.locator(".layout#app").waitFor();
    mode = "fail-projects";
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Couldn't open the admin console", exact: true }).waitFor();
    assert.equal(await page.locator(".layout#app").count(), 0);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const retry = page.getByRole("button", { name: "Try again", exact: true });
      assert.ok((await retry.boundingBox()).height >= 44);
      assert.ok(await retry.isEnabled());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(root, `test-results/admin-startup-recovery-${width}.png`) });
    }
    mode = "success";
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator(".layout#app").waitFor();
    mode = "stall-auth";
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Opening admin console", exact: true }).waitFor();
    await page.clock.fastForward(31000);
    await page.getByRole("heading", { name: "Couldn't open the admin console", exact: true }).waitFor();
    assert.ok((await page.locator(".admin-startup-card").textContent()).includes("taking too long"));
    mode = "expired"; releaseAuth();
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await page.locator("#loginForm").waitFor();
    assert.equal(await page.evaluate(() => sessionStorage.getItem("sakinzo_admin_token")), null);
    assert.deepEqual(errors, []);
  } finally { releaseProjects(); releaseAuth(); await close(); }
});

await test("admin Game category dropdown and styled image, gallery and video controls save correctly", async () => {
  const { page, open, requests, errors, close } = await session({ projectCategory: "Legacy category" });
  let imageUploads = 0, releaseVideo;
  const videoGate = new Promise(resolve => { releaseVideo = resolve; });
  await page.route("**/api/upload", route => route.fulfill({ json: { url: `/uploads/editor-image-${++imageUploads}.png` } }));
  await page.route("**/api/upload/videos", async route => { await videoGate; await route.fulfill({ json: { url: "/api/upload/videos/game-video" } }).catch(() => {}); });
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jPZkAAAAASUVORK5CYII=", "base64");
  try {
    await open("/admin");
    await page.locator('#loginForm [name="email"]').fill("owner@example.test");
    await page.locator("#loginPassword").fill("fixture-password");
    await page.locator("#loginButton").click();
    await page.locator(".layout#app").waitFor();
    await page.locator('#nav [data-page="projects"]').click();
    await page.getByRole("button", { name: "Edit", exact: true }).first().click();
    const category = page.locator('#modalForm select[name="category"]');
    assert.equal(await category.inputValue(), "Legacy category");
    assert.equal(await page.locator('#modalForm input[name="category"]').count(), 0);
    assert.ok(await category.locator('option[value="Game Development"]').count());
    await category.selectOption("Game Development");
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["dark", "light"]) {
        await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
        const metrics = await page.locator(".modal-card").evaluate(element => ({ width: innerWidth, left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right, scroll: element.scrollWidth, client: element.clientWidth }));
        assert.ok(metrics.left >= -1 && metrics.right <= metrics.width + 1);
        assert.ok(metrics.scroll <= metrics.client + 1, `${width}/${theme}: editor overflows`);
        for (const input of await page.locator('#modal input[type="file"]').all()) {
          assert.equal(await input.evaluate(element => getComputedStyle(element).opacity), "0");
          assert.ok((await input.locator("..").boundingBox()).height >= 44);
        }
        await page.locator("#upload-projects").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(root, `test-results/admin-media-${width}-${theme}.png`) });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const remove = page.getByRole("button", { name: "Remove video", exact: true });
    await remove.click();
    assert.ok(await remove.isDisabled());
    await page.locator("#upload-project-video").setInputFiles({ name: "wrong.txt", mimeType: "text/plain", buffer: Buffer.from("invalid") });
    await page.getByRole("alert").filter({ hasText: "Choose an MP4" }).waitFor();
    assert.ok(await remove.isDisabled());
    await page.locator("#upload-project-video").setInputFiles({ name: "game-demo.mp4", mimeType: "video/mp4", buffer: Buffer.from("fixture video") });
    assert.ok(await remove.isEnabled());
    assert.ok((await page.locator("#projectVideoStatus").textContent()).includes("game-demo.mp4"));
    await page.locator("#upload-projects").setInputFiles({ name: "game-cover.png", mimeType: "image/png", buffer: png });
    assert.ok((await page.locator("#upload-projects-selection").textContent()).includes("game-cover.png"));
    await page.locator("#projectGalleryUpload").setInputFiles([
      { name: "game-1.png", mimeType: "image/png", buffer: png },
      { name: "game-2.png", mimeType: "image/png", buffer: png },
    ]);
    await page.waitForFunction(() => document.querySelector('[name="images"]').value.includes("editor-image-2.png"));
    await page.locator('#modalForm button[type="submit"]').click();
    await page.getByRole("button", { name: "Saving…", exact: true }).waitFor();
    assert.ok(await category.isDisabled());
    assert.ok(await page.locator("#upload-project-video").isDisabled());
    releaseVideo();
    await page.locator("#modal").waitFor({ state: "hidden" });
    const saved = requests.find(request => request.path === "/api/projects/project-fixture" && request.method === "PUT");
    assert.ok(saved);
    const payload = JSON.parse(saved.body);
    assert.equal(payload.category, "Game Development");
    assert.ok(payload.img.startsWith("/uploads/editor-image-"));
    assert.equal(payload.images.length, 3);
    assert.ok(payload.images.includes(project.images[0]));
    assert.equal(payload.images.filter(image => image.startsWith("/uploads/editor-image-")).length, 2);
    assert.ok(payload.videoUrl.endsWith("/api/upload/videos/game-video"));
    await page.getByRole("button", { name: "+ Add Projects", exact: true }).click();
    assert.equal(await page.locator('#modal select[name="category"]').inputValue(), "");
    await page.locator('#modal select[name="category"]').selectOption("Game Development");
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await open("/");
    await page.locator("#main-projects-grid .project-card").first().waitFor();
    await page.locator(".project-filter").filter({ hasText: /^Game Development$/i }).click();
    assert.equal(await page.locator("#main-projects-grid .project-card").count(), 1);
    assert.deepEqual(errors, []);
  } finally { releaseVideo(); await close(); }
});

await test("approval inbox renders readable changes and preserves review notes, filters and failure recovery", async () => {
  const { page, open, errors, close } = await session();
  const picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6CKsAAAAASUVORK5CYII=";
  const approvals = [
    { _id: "profile-review", title: "Profile update", resourceType: "admins", action: "profile-update", requester: "employee-fixture", requesterName: "Team member", status: "pending", createdAt: "2026-10-31T12:00:00Z", payload: { name: "Updated name", profileImage: picture, phone: "1234567890", password: "must-never-be-rendered", permissions: ["projects", "blogs"] } },
    { _id: "visibility-review", title: "Hide projects", resourceType: "sections", action: "update", requester: "employee-fixture", requesterName: "Team member", status: "pending", payload: { enabled: false } },
    { _id: "approved-review", title: "Previous profile update", resourceType: "admins", action: "profile-update", requesterName: "Team member", status: "approved", payload: { profileImage: picture, bio: "Developer" }, reviewedByName: "Test owner", reviewedAt: "2026-10-31T13:00:00Z", reviewNote: "Looks good" },
    { _id: "rejected-review", title: "Delete blog", resourceType: "blogs", action: "delete", status: "rejected", payload: {} },
  ];
  const decisions = [];
  let failReview = true;
  await page.addInitScript(() => sessionStorage.setItem("sakinzo_admin_token", "mock-admin-session"));
  await page.route("**/api/approvals**", async route => {
    const request = route.request(), match = new URL(request.url()).pathname.match(/\/approvals\/([^/]+)\/(approve|reject)$/);
    if (!match) return route.fulfill({ json: approvals });
    if (match[2] === "reject" && failReview) { failReview = false; return route.fulfill({ status: 503, json: { message: "Review service unavailable. Try again." } }); }
    const row = approvals.find(row => row._id === match[1]);
    Object.assign(row, { status: match[2] === "approve" ? "approved" : "rejected", ...request.postDataJSON(), reviewedByName: "Test owner" });
    decisions.push({ id: row._id, decision: match[2], note: row.reviewNote });
    await route.fulfill({ json: row });
  });
  try {
    await open("/admin/approvals");
    await page.locator(".approval-card").first().waitFor();
    assert.equal(await page.locator(".approval-card").count(), 4);
    assert.equal(await page.locator(".approval-payload, .approval-card pre").count(), 0);
    const text = await page.locator("#pages").textContent();
    assert.ok(!text.includes("base64") && !text.includes("must-never-be-rendered"));
    const preview = page.locator(".approval-card").first().getByRole("img", { name: "Profile picture", exact: true });
    await preview.waitFor();
    assert.ok(await preview.evaluate(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator(".approval-card").nth(2).locator("details").getAttribute("open"), null);
    await page.getByRole("button", { name: /^Pending 2$/ }).click();
    assert.equal(await page.locator(".approval-card").count(), 2);
    await page.locator(".approval-card").first().getByRole("button", { name: "Approve", exact: true }).click();
    const dialog = page.getByRole("alertdialog");
    await dialog.getByRole("textbox", { name: "Review note" }).fill("Photo and details checked");
    await dialog.getByRole("button", { name: "Confirm", exact: true }).focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "TEXTAREA");
    await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll(".approval-card").length === 1);
    assert.deepEqual(decisions[0], { id: "profile-review", decision: "approve", note: "Photo and details checked" });
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    await page.keyboard.press("Escape");
    assert.equal(await dialog.count(), 0);
    assert.equal(decisions.length, 1);
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    await dialog.getByRole("textbox", { name: "Review note" }).fill("Keep projects visible");
    await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "Review service unavailable" }).waitFor();
    assert.equal(await page.locator(".approval-card").count(), 1);
    assert.ok(await page.getByRole("button", { name: "Reject", exact: true }).isEnabled());
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    await dialog.getByRole("textbox", { name: "Review note" }).fill("Keep projects visible");
    await dialog.getByRole("button", { name: "Confirm", exact: true }).click();
    await page.getByText("You're all caught up", { exact: true }).waitFor();
    assert.deepEqual(decisions[1], { id: "visibility-review", decision: "reject", note: "Keep projects visible" });
    await page.getByRole("button", { name: /^Approved 2$/ }).click();
    assert.equal(await page.locator(".approval-card").count(), 2);
    assert.ok((await page.locator(".approval-list").textContent()).includes("Photo and details checked"));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("admin settings, profile and directory remain usable across mobile, desktop and both themes", async () => {
  const { page, open, errors, close } = await session();
  const picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6CKsAAAAASUVORK5CYII=";
  const identity = { ...admin, profileImage: picture, employeeId: "EMP-01", phone: "1234567890", bio: "Team owner" };
  const saves = [], sections = [{ key: "cases", enabled: false }];
  const services = [{ key: "iot", label: "IoT development services", enabled: true }, { key: "fintech", label: "Fintech Software Development Services", enabled: false }];
  await page.addInitScript(() => sessionStorage.setItem("sakinzo_admin_token", "mock-admin-session"));
  await page.route("**/api/auth/me", route => route.fulfill({ json: { admin: identity } }));
  await page.route("**/api/admins**", async route => {
    if (route.request().method() === "PUT") { const body = route.request().postDataJSON(); saves.push(body); Object.assign(identity, body); return route.fulfill({ json: identity }); }
    await route.fulfill({ json: [identity, { _id: "teammate", name: "Asha Sharma", email: "asha@example.test", role: "employee", employeeId: "EMP-02", profileImage: "assets/missing-employee.png", permissions: ["projects", "blogs", "contactPage"], active: true }] });
  });
  for (const [endpoint, rows] of [["sections", sections], ["what-we-do-services", services]]) await page.route(`**/api/${endpoint}**`, async route => {
    if (route.request().method() === "PUT") {
      const key = new URL(route.request().url()).pathname.split("/").at(-1);
      let row = rows.find(row => row.key === key);
      if (!row) { row = { key }; rows.push(row); }
      Object.assign(row, route.request().postDataJSON());
      return route.fulfill({ json: row });
    }
    await route.fulfill({ json: rows });
  });
  await page.route("**/api/contact-offices**", route => route.fulfill({ json: [{ _id: "office", label: "Thane office", city: "Thane", address: "Mumbai Metropolitan Region", country: "India", visible: true }] }));
  await page.route("**/api/approvals", route => route.fulfill({ json: [{ _id: "visual-review", title: "Profile update", resourceType: "admins", action: "profile-update", requesterName: "Asha Sharma", status: "pending", payload: { name: "Asha Sharma", profileImage: picture, phone: "1234567890", bio: "Product designer" }, createdAt: "2026-10-31T12:00:00Z" }] }));
  try {
    await open("/admin/sections");
    const hero = page.getByRole("switch", { name: "Show Hero banner on homepage", exact: true });
    await hero.waitFor();
    assert.equal(await hero.getAttribute("aria-checked"), "true");
    await hero.click();
    await page.waitForFunction(() => document.querySelector('[role="switch"][aria-label="Show Hero banner on homepage"]')?.getAttribute("aria-checked") === "false");
    assert.equal(sections.find(row => row.key === "hero").enabled, false);
    await open("/admin/whatWeDoServices");
    await page.getByRole("switch", { name: "Show Fintech Software Development Services on homepage", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('[role="switch"][aria-checked="true"]').length === 2);
    await open("/admin/contactPage");
    await page.locator("#contactSettingsForm").waitFor();
    assert.equal(await page.getByRole("heading", { name: "Offices", exact: true }).count(), 1);
    assert.equal(await page.getByRole("button", { name: /\+ Add Office/ }).count(), 1);
    assert.equal(await page.locator("#contactSettingsForm fieldset").count(), 4);
    await open("/admin/profile");
    await page.locator("#profileForm").waitFor();
    assert.ok(!(await page.locator("#pages").textContent()).includes("base64"));
    assert.equal(await page.locator('#profileForm input[name="profileImage"]').count(), 0);
    await page.locator('#profileForm input[name="name"]').fill("Updated owner");
    await page.getByRole("button", { name: "Save profile", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Profile saved" }).waitFor();
    assert.equal(saves[0].profileImage, picture, "saving text fields preserves the uploaded profile picture");
    await page.getByRole("button", { name: "Remove picture", exact: true }).click();
    await page.getByRole("button", { name: "Save profile", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".profile-card .avatar-initials"));
    assert.equal(saves[1].profileImage, "");
    await open("/admin/admins");
    await page.locator(".employee-card").first().waitFor();
    await page.getByRole("textbox", { name: "Search employee", exact: true }).fill("asha");
    assert.equal(await page.locator(".employee-card").count(), 1);
    await page.locator(".employee-permissions summary").click();
    assert.ok((await page.locator(".employee-permissions").textContent()).includes("Contact Page"));
    await page.locator(".employee-card .avatar-initials").waitFor();
    assert.equal(await page.locator(".employee-card .avatar-initials").textContent(), "AS");
    for (const [width, theme] of [[1440, "dark"], [390, "dark"], [320, "light"]]) {
      await page.setViewportSize({ width, height: 950 });
      if ((await page.locator("html").getAttribute("data-theme")) !== theme) await page.locator("#themeToggle").click();
      for (const section of ["approvals", "sections", "whatWeDoServices", "contactPage", "blogs", "profile", "admins"]) {
        await open(`/admin/${section}`);
        await page.locator("#app").waitFor();
        await page.locator("#pages .card").first().waitFor();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${section} viewport overflow at ${width}`);
        const overflow = await page.locator("#pages").evaluate(element => element.scrollWidth > element.clientWidth + 1);
        assert.equal(overflow, false, `${section} content overflow at ${width}`);
        if (width !== 320) await page.screenshot({ path: path.join(root, `test-results/admin-clean-${section}-${width}.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("managers cannot review their own pending request", async () => {
  const { page, open, errors, close } = await session({ employee: true });
  const identity = { ...admin, role: "admin", canSaveDirect: false, canManageAccess: true };
  await page.addInitScript(() => sessionStorage.setItem("sakinzo_admin_token", "mock-admin-session"));
  await page.route("**/api/auth/me", route => route.fulfill({ json: { admin: identity } }));
  await page.route("**/api/approvals", route => route.fulfill({ json: [{ _id: "own-review", title: "My profile update", resourceType: "admins", action: "profile-update", status: "pending", requester: identity.id, payload: { name: "Manager" } }] }));
  try {
    await open("/admin/approvals");
    await page.locator(".approval-card").waitFor();
    assert.equal(await page.getByRole("button", { name: /^(Approve|Reject)$/ }).count(), 0);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("phone navigation stays readable, scrolls long service lists and closes without locking the page", async () => {
  const { page, open, errors, close } = await session();
  try {
    for (const [width, height, route] of [[390,844,"/"], [320,740,"/contact"], [430,932,"/qa-testing"], [844,390,"/blog"], [390,844,"/who-we-are"]]) {
      await page.setViewportSize({ width, height });
      await open(route);
      const toggle = page.locator("#hamburger"), menu = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
      await toggle.click();
      await menu.waitFor({ state: "visible" });
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      assert.equal(await page.locator("body").evaluate(body => body.style.overflow), "hidden");
      const colours = await menu.evaluate(element => {
        const link = element.querySelector(".mob-link"), style = getComputedStyle(element);
        return { background: style.backgroundColor, opacity: style.opacity, link: getComputedStyle(link).color };
      });
      assert.equal(colours.background, "rgb(7, 19, 38)");
      assert.equal(colours.opacity, "1");
      assert.equal(colours.link, "rgb(242, 246, 255)");
      const menuBox = await menu.boundingBox(), headerBox = await page.locator("header[data-react-header]").boundingBox();
      assert.ok(Math.abs(menuBox.y - headerBox.y - headerBox.height) < 2);
      assert.ok(menuBox.y + menuBox.height <= height + 2);
      await menu.getByRole("button", { name: "Services", exact: true }).click();
      const lastService = menu.getByRole("link", { name: "Business Analysis", exact: true });
      await lastService.scrollIntoViewIfNeeded();
      assert.ok(await lastService.isVisible());
      assert.ok(await menu.evaluate(element => element.scrollHeight > element.clientHeight));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      if (width === 390 && route === "/") await page.screenshot({ path: path.join(root, "test-results/phone-menu-services.png") });
      await menu.getByRole("button", { name: "About Us", exact: true }).click();
      assert.equal(await menu.locator(".mob-sub.open").count(), 1);
      await page.keyboard.press("Escape");
      await menu.waitFor({ state: "hidden" });
      assert.notEqual(await page.locator("body").evaluate(body => body.style.overflow), "hidden");
      assert.equal(await page.evaluate(() => document.activeElement.id), "hamburger");
      await toggle.click();
      if (width === 390 && route === "/") await page.screenshot({ path: path.join(root, "test-results/phone-menu-collapsed.png") });
      await menu.getByRole("button", { name: "Services", exact: true }).click();
      await menu.getByRole("link", { name: "QA & Testing", exact: true }).click();
      await page.waitForURL("**/qa-testing");
      assert.equal(await page.locator("#hamburger").getAttribute("aria-expanded"), "false");
      assert.notEqual(await page.locator("body").evaluate(body => body.style.overflow), "hidden");
    }
    await page.locator("#hamburger").click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).waitFor({ state: "hidden" });
    assert.notEqual(await page.locator("body").evaluate(body => body.style.overflow), "hidden");
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await test("SEO metadata remains unique across React navigation, articles, tracking parameters and private pages", async () => {
  const { page, open, errors, close } = await session();
  try {
    await open("/?utm_source=instagram&lang=en");
    await page.waitForFunction(() => document.title.includes("Mumbai"));
    for (const [route, suffix, title] of [["/web-mobile-development?utm_source=instagram", "/web-mobile-development", "Web & Mobile"], ["/blog?slug=engineering-guide&utm_source=share", "/blog/engineering-guide", article.title], ["/projects/project-fixture?fbclid=test", "/projects/project-fixture", project.title]]) {
      await open(route);
      await page.waitForFunction(title => document.title.includes(title), title);
      assert.equal(await page.locator("head title").count(), 1);
      assert.equal(await page.locator('head meta[name="description"]').count(), 1);
      assert.equal(await page.locator('head link[rel="canonical"]').count(), 1);
      const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
      assert.ok(canonical.endsWith(suffix));
      assert.ok(!canonical.includes("utm_") && !canonical.includes("fbclid"));
      assert.equal(await page.locator('head meta[property="og:url"]').getAttribute("content"), canonical);
      assert.equal(await page.locator('head script[data-site-seo]').count(), 1);
      const graph = await page.locator('head script[data-site-seo]').evaluate(element => JSON.parse(element.textContent)["@graph"]);
      assert.ok(graph.some(entity => entity["@type"] === "Organization" && entity.email === "sakinzo.work@gmail.com"));
    }
    await page.goto(origin + "/does-not-exist");
    await page.getByRole("heading", { name: "Page not found", exact: true }).waitFor();
    assert.ok((await page.locator('head meta[name="robots"]').getAttribute("content")).includes("noindex"));
    await open("/admin");
    await page.locator("#loginForm").waitFor();
    assert.ok((await page.locator('head meta[name="robots"]').getAttribute("content")).includes("noindex"));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

await browser.close();
await new Promise((resolve) => {
  server.close(resolve);
  server.closeAllConnections();
});
