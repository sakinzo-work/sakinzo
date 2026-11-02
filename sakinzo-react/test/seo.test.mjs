import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { canonicalUrl, createSeo, seoImage } from "../src/lib/seo.js";
import { contentEntries, routeSeo, seoDocument, sitemapXml } from "../scripts/seo-document.mjs";
import { createPageHandler } from "../api/page.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, ".cache/seo/catalog.json"), "utf8"));
const shell = fs.readFileSync(path.join(root, ".cache/seo/shell.html"), "utf8");
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const text = node => node.value || (node.childNodes || []).map(text).join("");
function inspect(html) {
  const nodes = walk(parse(html));
  return {
    nodes,
    titles: nodes.filter(node => node.tagName === "title"),
    metas: name => nodes.filter(node => node.tagName === "meta" && attr(node, "name") === name),
    canonical: nodes.filter(node => node.tagName === "link" && attr(node, "rel") === "canonical"),
    schema: nodes.filter(node => node.tagName === "script" && attr(node, "type") === "application/ld+json"),
  };
}
test("every public route has its own metadata and canonical in the HTTP HTML before JavaScript", () => {
  const titles = new Set();
  for (const route of catalog.routes) {
    const html = fs.readFileSync(path.join(root, route.slug === "index" ? "dist/index.html" : `dist/seo/${route.slug}.html`), "utf8");
    const page = inspect(html);
    assert.equal(page.titles.length, 1, route.path);
    assert.ok(text(page.titles[0]).length > 15);
    assert.equal(page.metas("description").length, 1);
    assert.ok(attr(page.metas("description")[0], "content").length > 70);
    assert.equal(page.canonical.length, 1);
    assert.equal(attr(page.canonical[0], "href"), canonicalUrl(route.path, "", catalog.siteUrl));
    assert.equal(page.schema.length, 1);
    const graph = JSON.parse(text(page.schema[0]))["@graph"];
    const business = graph.find(item => item["@type"] === "Organization");
    assert.equal(business.email, "sakinzo.work@gmail.com");
    assert.equal(business.telephone, "+918879162814");
    assert.ok(business.areaServed.some(area => area.name === "Thane"));
    assert.ok(!business.areaServed.some(area => area.name === "Pune"));
    assert.equal(page.metas("google-site-verification").length, 1);
    assert.ok(!html.includes("github.io"));
    titles.add(text(page.titles[0]));
  }
  assert.equal(titles.size, catalog.routes.length, "Every page has a descriptive, unique title");
});
test("priority landing pages include useful crawlable copy and contextual links before JavaScript", () => {
  for (const [slug, phrases, hrefs] of [
    ["index", ["custom websites", "AI solutions", "connected IoT products"], ["/web-mobile-development", "/ai-agent-development", "/iot-development"]],
    ["web-mobile-development", ["Android and iOS app", "quality assurance", "Mumbai and Thane"], ["/projects", "/contact"]],
    ["ai-agent-development", ["trusted information", "human review", "Mumbai and Thane"], ["/blog/practical-guide-ai-assistant-business-systems", "/contact"]],
    ["iot-development", ["device integration", "device identity", "operational environment"], ["/blog/iot-platform-architecture-layers-guide", "/contact"]],
  ]) {
    const route = catalog.routes.find((item) => item.slug === slug);
    const html = fs.readFileSync(path.join(root, route.slug === "index" ? "dist/index.html" : `dist/seo/${route.slug}.html`), "utf8");
    for (const phrase of phrases) assert.ok(html.toLowerCase().includes(phrase.toLowerCase()), `${slug}: ${phrase}`);
    for (const href of hrefs) assert.ok(html.includes(`href="${href}"`), `${slug}: ${href}`);
  }
});
test("canonicals discard tracking and translation parameters while retaining article identity", () => {
  assert.equal(canonicalUrl("/web-mobile-development/", "?utm_source=instagram&lang=hi"), "https://sakinzo.vercel.app/web-mobile-development");
  assert.equal(canonicalUrl("/blog", "?slug=engineering-guide&utm_source=share&lang=hi"), "https://sakinzo.vercel.app/blog/engineering-guide");
  assert.equal(canonicalUrl("/projects", "?id=project-1&fbclid=abc"), "https://sakinzo.vercel.app/projects/project-1");
  assert.equal(canonicalUrl("/contactus.html"), "https://sakinzo.vercel.app/contact");
  assert.equal(seoImage("https://sakinzo-work.github.io/sakinzo/frontend/assets/service-ai.webp"), "https://sakinzo.vercel.app/assets/service-ai.webp");
  assert.equal(seoImage("/uploads/image.webp", undefined, "/api"), "https://sakinzo.onrender.com/uploads/image.webp");
  assert.ok(seoImage("javascript:alert(1)").endsWith("sakinzo-hero-desktop-waves.webp"));
});
test("SEO serialization escapes untrusted titles and scripts without duplicate metadata", () => {
  const seo = createSeo({ slug: "blog", path: "/blog/safe", meta: { title: '</title><script id="injected">bad()</script>', description: 'A "description" & details', image: "data:text/html,<script>bad()</script>" }, schema: { "@type": "BlogPosting", headline: "</script><script id='injected'>bad()</script>" } });
  const html = seoDocument(seoDocument(shell, seo), seo);
  const page = inspect(html);
  assert.equal(page.titles.length, 1);
  assert.equal(page.metas("description").length, 1);
  assert.equal(page.schema.length, 1);
  assert.equal(page.nodes.filter(node => attr(node, "id") === "injected").length, 0);
  assert.ok(JSON.parse(text(page.schema[0]))["@graph"].some(item => item["@type"] === "BlogPosting"));
});
const content = {
  blogs: [{ _id: "post", slug: "test-guide", title: "A useful engineering guide", excerpt: "A guide to reliable software design and delivery.", body: "## A connected **application**", category: "Engineering", coverImage: "assets/service-ai.webp", author: "Sakinzo Team", publishedAt: "2026-10-29", updatedAt: "2026-10-30", visible: true }, { _id: "hidden", slug: "hidden-guide", visible: false }],
  projects: [{ _id: "project-1", title: "Useful app", desc: "## A connected **application**", img: "/uploads/project.webp", visible: true }],
};
async function invoke(query, { available = true, method = "GET" } = {}) {
  const handler = createPageHandler({ readFiles: async () => [catalog, shell], contentFor: async () => ({ data: content, available }) });
  const result = { headers: {}, statusCode: 200, body: "" };
  const response = { setHeader(name, value) { result.headers[name.toLowerCase()] = value; }, status(code) { result.statusCode = code; return this; }, send(body) { result.body = body; return this; }, end() { return this; } };
  await handler({ method, url: "/api/page", query }, response);
  return result;
}
test("dynamic article and project responses provide the actual record's share metadata", async () => {
  for (const [kind, value, expected] of [["blog", "test-guide", content.blogs[0].title], ["project", "useful-app", content.projects[0].title]]) {
    const result = await invoke({ kind, value });
    assert.equal(result.statusCode, 200);
    const page = inspect(result.body);
    assert.ok(text(page.titles[0]).includes(expected));
    assert.equal(attr(page.canonical[0], "href"), `${catalog.siteUrl}${kind === "blog" ? "blog" : "projects"}/${value}`);
    const graph = JSON.parse(text(page.schema[0]))["@graph"];
    assert.ok(graph.some(item => item["@type"] === (kind === "blog" ? "BlogPosting" : "CreativeWork")));
    if (kind === "blog") {
      assert.ok(result.body.includes("<h2 id=\"guide-a-connected-application\">"));
      assert.ok(result.body.includes("<strong>application</strong>"));
      assert.ok(result.body.includes("A connected"));
    }
    assert.ok(!result.body.includes("## A connected **application**"));
  }
});
test("legacy detail URLs redirect, missing records return 404, and outages avoid a false missing page", async () => {
  const redirect = await invoke({ kind: "blog-index", slug: "test-guide" });
  assert.equal(redirect.statusCode, 308);
  assert.equal(redirect.headers.location, `${catalog.siteUrl}blog/test-guide`);
  for (const value of ["not-found", "hidden-guide", "../etc/passwd"]) {
    const result = await invoke({ kind: "blog", value });
    assert.equal(result.statusCode, 404);
    assert.ok(attr(inspect(result.body).metas("robots")[0], "content").includes("noindex"));
  }
  const unavailable = await invoke({ kind: "blog", value: "not-in-snapshot" }, { available: false });
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.headers["cache-control"], "no-store");
  assert.equal((await invoke({ kind: "blog", value: "test-guide" }, { method: "HEAD" })).body, "");
  assert.equal((await invoke({}, { method: "POST" })).statusCode, 405);
});
test("the live sitemap includes visible records, accurate dates and new content; admin stays excluded", async () => {
  const entries = contentEntries(content, catalog.siteUrl);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].modified, "2026-10-30T00:00:00.000Z");
  assert.ok(!entries[1].modified, "Never invent a modification date");
  assert.ok(!sitemapXml(entries).includes("hidden-guide"));
  const result = await invoke({ kind: "sitemap" });
  assert.equal(result.statusCode, 200);
  assert.ok(result.body.includes("/blog/test-guide") && result.body.includes("/projects/useful-app"));
  const index = fs.readFileSync(path.join(root, "dist/sitemap.xml"), "utf8");
  assert.ok(index.includes("sitemap-live.xml") && index.includes("sitemap-static.xml"));
  assert.ok(!fs.readFileSync(path.join(root, "dist/sitemap-static.xml"), "utf8").includes("/admin"));
  const admin = inspect(fs.readFileSync(path.join(root, "dist/seo/admin.html"), "utf8"));
  assert.ok(attr(admin.metas("robots")[0], "content").includes("noindex"));
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.ok(config.rewrites.some(rule => rule.source === "/sitemap-live.xml" && rule.destination.includes("kind=sitemap")));
  for (const route of catalog.routes.filter(route => !["index", "blog", "project"].includes(route.slug))) assert.ok(config.rewrites.some(rule => rule.source === route.path && rule.destination === `/seo/${route.slug}.html`));
});
