import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { canonicalUrl, siteAddress } from "../src/lib/seo.js";
import {
  contentEntries,
  escapeHtml,
  routeSeo,
  seoDocument,
  sitemapXml,
} from "./seo-document.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (file) =>
  JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
const env = { ...loadEnv("production", root, ""), ...process.env };
const siteUrl = siteAddress(env.VITE_SITE_URL);
const api = env.VITE_API_BASE?.startsWith("http")
  ? env.VITE_API_BASE.replace(/\/$/, "")
  : "https://sakinzo.onrender.com/api";
const [routes, metadata, services] = await Promise.all([
  readJson("src/data/routes.json"),
  readJson("src/data/metadata.json"),
  readJson("src/data/services.json"),
]);
const covers = Object.fromEntries(
  services.map((service) => [service.slug, service.cover]),
);
covers.index = {
  image: "assets/sakinzo-hero-desktop-waves.webp",
  width: 1671,
  height: 941,
  description:
    "Connected digital network waves for software product engineering",
};
for (const slug of [
  "who-we-are",
  "careers",
  "leadership",
  "contactus",
  "news",
  "services",
])
  covers[slug] ||= {
    image: "assets/page-company.webp",
    description: "Sakinzo product engineering and software development",
  };
covers.blog = {
  image: "assets/page-insights.webp",
  description: "Sakinzo software engineering insights",
};
let publicData = { blogs: [], projects: [] };
const controller = new AbortController(),
  timer = setTimeout(() => controller.abort(), 25000);
try {
  const response = await fetch(`${api}/public/site-data`, {
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  publicData = await response.json();
} catch {
  console.warn(
    "Public content snapshot unavailable; the live content sitemap will refresh from Render.",
  );
} finally {
  clearTimeout(timer);
}
const catalog = {
  siteUrl,
  api,
  routes,
  metadata,
  services,
  covers,
  content: {
    blogs: (publicData.blogs || []).map(
      ({
        _id,
        slug,
        title,
        excerpt,
        coverImage,
        author,
        category,
        tags,
        body,
        publishedAt,
        updatedAt,
        visible,
      }) => ({
        _id,
        slug,
        title,
        excerpt,
        coverImage,
        author,
        category,
        publishedAt,
        updatedAt,
        visible,
      }),
    ),
    projects: (publicData.projects || []).map(
      ({
        _id,
        title,
        desc,
        img,
        images,
        creatorName,
        category,
        updatedAt,
        visible,
      }) => ({
        _id,
        title,
        desc,
        img,
        images,
        creatorName,
        category,
        updatedAt,
        visible,
      }),
    ),
  },
};
const shell = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
await fs.mkdir(path.join(root, ".cache/seo"), { recursive: true });
await fs.mkdir(path.join(root, "dist/seo"), { recursive: true });
await fs.writeFile(path.join(root, ".cache/seo/shell.html"), shell);
await fs.writeFile(
  path.join(root, ".cache/seo/catalog.json"),
  JSON.stringify(catalog),
);
for (const route of [...routes, { slug: "admin", path: "/admin" }]) {
  const seo = routeSeo(catalog, route.slug, route.path);
  if (route.slug === "project") seo.robots = "noindex, follow";
  const document = seoDocument(shell, seo);
  await fs.writeFile(
    path.join(
      root,
      route.slug === "index"
        ? "dist/index.html"
        : `dist/seo/${route.slug}.html`,
    ),
    document,
  );
}
await fs.writeFile(
  path.join(root, "dist/404.html"),
  seoDocument(shell, routeSeo(catalog, "not-found", "/404")),
);
await fs.writeFile(
  path.join(root, "dist/sitemap-static.xml"),
  sitemapXml(
    routes
      .filter((route) => route.slug !== "project")
      .map((route) => ({ url: canonicalUrl(route.path, "", siteUrl) })),
  ),
);
await fs.writeFile(
  path.join(root, "dist/sitemap-content.xml"),
  sitemapXml(contentEntries(publicData, siteUrl)),
);
await fs.writeFile(
  path.join(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["sitemap-static.xml", "sitemap-live.xml"].map((file) => `  <sitemap><loc>${escapeHtml(new URL(file, siteUrl).href)}</loc></sitemap>`).join("\n")}\n</sitemapindex>\n`,
);
await fs.writeFile(
  path.join(root, "dist/robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: ${new URL("admin", siteUrl).pathname}\nDisallow: ${new URL("api/", siteUrl).pathname}\n\nSitemap: ${new URL("sitemap.xml", siteUrl).href}\n`,
);
console.log(
  `SEO: ${routes.length} public route heads, canonical URLs, structured data and content sitemap prepared.`,
);
