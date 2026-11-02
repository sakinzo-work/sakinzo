import fs from "node:fs/promises";
import path from "node:path";
import { waitUntil } from "@vercel/functions";
import {
  contentEntries,
  routeSeo,
  seoDocument,
  sitemapXml,
} from "../scripts/seo-document.mjs";
import { contentSlug } from "../src/lib/content-slugs.js";

let files,
  snapshot,
  freshUntil = 0,
  pending;
const loadFiles = () =>
  (files ||= Promise.all([
    fs
      .readFile(path.join(process.cwd(), ".cache/seo/catalog.json"), "utf8")
      .then(JSON.parse),
    fs.readFile(path.join(process.cwd(), ".cache/seo/shell.html"), "utf8"),
  ]));
async function liveContent(catalog) {
  if (snapshot && Date.now() < freshUntil)
    return { data: snapshot, available: true };
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${catalog.api}/public/site-data`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Content unavailable");
      const data = await response.json();
      if (!Array.isArray(data.blogs) || !Array.isArray(data.projects))
        throw new Error("Invalid public content");
      snapshot = data;
      freshUntil = Date.now() + 60000;
      return { data, available: true };
    } catch {
      return { data: snapshot || catalog.content, available: false };
    } finally {
      clearTimeout(timer);
      pending = null;
    }
  })();
  return pending;
}
function cachedContent(catalog, lookup) {
  const data = snapshot || catalog.content;
  const rows = data?.[lookup?.kind === "blog" ? "blogs" : "projects"] || [];
  const contentKind = lookup?.kind === "blog" ? "blog" : "project";
  const known = lookup
    ? rows.some(
        (row) =>
          row.visible !== false &&
          (String(row._id || "") === lookup.value ||
            (lookup.kind === "blog" && String(row.slug || "") === lookup.value) ||
            contentSlug(row, rows, contentKind) === lookup.value),
      )
    : data?.blogs?.length || data?.projects?.length;
  if (known) {
    if (Date.now() >= freshUntil) waitUntil(liveContent(catalog));
    return Promise.resolve({ data, available: Boolean(snapshot) });
  }
  return liveContent(catalog);
}
export function createPageHandler({
  readFiles = loadFiles,
  contentFor = cachedContent,
} = {}) {
  return async function handler(request, response) {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      return response.status(405).end();
    }
    const [catalog, shell] = await readFiles();
    const url = new URL(request.url, catalog.siteUrl);
    const query = { ...Object.fromEntries(url.searchParams), ...request.query };
    const kind = query.kind,
      value = String(query.value || query.slug || query.id || "");
    response.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    );
    if (kind === "sitemap") {
      const content = await contentFor(catalog);
      response.setHeader("Content-Type", "application/xml; charset=utf-8");
      return response
        .status(200)
        .send(
          request.method === "HEAD"
            ? ""
            : sitemapXml(contentEntries(content.data, catalog.siteUrl)),
        );
    }
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    if (["blog-index", "project-index"].includes(kind)) {
      if (value) {
        const destination = new URL(
          `${kind === "blog-index" ? "blog" : "projects"}/${encodeURIComponent(value)}`,
          catalog.siteUrl,
        );
        if (query.lang) destination.searchParams.set("lang", query.lang);
        response.setHeader("Location", destination.href);
        return response.status(308).end();
      }
      const seo = routeSeo(
        catalog,
        kind === "blog-index" ? "blog" : "project",
        kind === "blog-index" ? "/blog" : "/projects",
      );
      if (kind === "project-index") seo.robots = "noindex, follow";
      return response
        .status(200)
        .send(request.method === "HEAD" ? "" : seoDocument(shell, seo));
    }
    const valid = /^[\p{L}\p{N}][\p{L}\p{N}._-]{0,199}$/u.test(value);
    if (["blog", "project"].includes(kind) && valid) {
      const content = await contentFor(catalog, { kind, value });
      const rows = content.data[kind === "blog" ? "blogs" : "projects"] || [];
      const row = rows.find(
        (row) =>
          row.visible !== false &&
          (String(row._id || "") === value ||
            (kind === "blog" && String(row.slug || "") === value) ||
            contentSlug(row, rows, kind) === value),
      );
      if (row) {
        const canonicalSlug = contentSlug(row, rows, kind);
        if (value !== canonicalSlug) {
          const destination = new URL(
            `${kind === "blog" ? "blog" : "projects"}/${encodeURIComponent(canonicalSlug)}`,
            catalog.siteUrl,
          );
          if (query.lang) destination.searchParams.set("lang", query.lang);
          response.setHeader("Location", destination.href);
          return response.status(308).end();
        }
        const seo = routeSeo(
          catalog,
          kind === "blog" ? "blog" : "project",
          `/${kind === "blog" ? "blog" : "projects"}/${encodeURIComponent(canonicalSlug)}`,
          row,
          kind,
        );
        return response
          .status(200)
          .send(request.method === "HEAD" ? "" : seoDocument(shell, seo));
      }
      if (!content.available) {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Retry-After", "120");
        const seo = routeSeo(
          catalog,
          kind,
          `/${kind === "blog" ? "blog" : "projects"}/${encodeURIComponent(value)}`,
        );
        return response
          .status(503)
          .send(request.method === "HEAD" ? "" : seoDocument(shell, seo));
      }
    }
    response.setHeader("X-Robots-Tag", "noindex");
    return response
      .status(404)
      .send(
        request.method === "HEAD"
          ? ""
          : seoDocument(shell, routeSeo(catalog, "not-found", "/404")),
      );
  };
}
export default createPageHandler();
