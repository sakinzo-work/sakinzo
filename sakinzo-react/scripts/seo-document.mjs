import { createSeo, detailMetadata, siteAddress } from "../src/lib/seo.js";
import { contentSlug } from "../src/lib/content-slugs.js";
import { parseMarkdown, safeMarkdownLink } from "../src/lib/markdown.js";

export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export function routeSeo(catalog, slug, path, row, kind) {
  const detail = row ? detailMetadata(kind, row) : {};
  const meta = {
    ...(catalog.metadata[slug] || catalog.metadata["not-found"]),
    ...detail,
  };
  const cover = catalog.covers[slug];
  const schema = row
    ? kind === "blog"
      ? {
          "@type": "BlogPosting",
          headline: row.title,
          description: meta.description,
          author: {
            "@type":
              !row.author || row.author === "Sakinzo Team"
                ? "Organization"
                : "Person",
            name: row.author || "Sakinzo Team",
          },
          publisher: { "@type": "Organization", name: "Sakin.zo" },
          datePublished: row.publishedAt || undefined,
          dateModified: row.updatedAt || row.publishedAt || undefined,
          articleSection: row.category,
          keywords: Array.isArray(row.tags) ? row.tags.join(", ") : undefined,
          wordCount: String(row.body || "").trim().split(/\s+/).filter(Boolean).length || undefined,
        }
      : {
          "@type": "CreativeWork",
          name: row.title,
          description: meta.description,
          creator: {
            "@type": row.creatorName ? "Person" : "Organization",
            name: row.creatorName || "Sakin.zo",
          },
        }
    : undefined;
  const seo = createSeo({
    slug,
    path,
    meta,
    cover,
    schema,
    service: catalog.services.find((item) => item.slug === slug),
    siteUrl: catalog.siteUrl,
    api: catalog.api,
  });
  seo.fallback = { slug, row };
  seo.content = catalog.content;
  return seo;
}
export function renderSeoHead(seo) {
  const meta = (name, content, property = false) =>
    `<meta ${property ? "property" : "name"}="${name}" content="${escapeHtml(content)}" />`;
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta("description", seo.description),
    meta("robots", seo.robots),
    `<link rel="canonical" href="${escapeHtml(seo.url)}" />`,
    ...Object.entries({
      "og:title": seo.title,
      "og:description": seo.description,
      "og:url": seo.url,
      "og:image": seo.image,
      "og:image:alt": seo.imageAlt,
      "og:type": seo.type,
      "og:site_name": "Sakin.zo",
      "og:locale": "en_IN",
      ...(seo.imageWidth
        ? {
            "og:image:width": seo.imageWidth,
            "og:image:height": seo.imageHeight,
          }
        : {}),
    }).map(([name, value]) => meta(name, value, true)),
    ...Object.entries({
      "twitter:card": "summary_large_image",
      "twitter:title": seo.title,
      "twitter:description": seo.description,
      "twitter:image": seo.image,
      "twitter:image:alt": seo.imageAlt,
    }).map(([name, value]) => meta(name, value)),
    `<script id="sakinzo-schema" type="application/ld+json" data-site-seo>${JSON.stringify(seo.schema).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}
export function seoDocument(shell, seo) {
  const block = `<!--seo:start-->\n${renderSeoHead(seo)}\n<!--seo:end-->`;
  const withHead = /<!--seo:start-->[\s\S]*?<!--seo:end-->/.test(shell)
    ? shell.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, () => block)
    : shell.replace("</head>", () => block + "\n</head>");
  const title = String(seo.title || "Sakin.zo")
    .replace(/^Sakinzo\s*\(Sakin\.zo\)\s*\|\s*/i, "")
    .replace(/^Sakin\.zo\s*[|–-]\s*/i, "")
    .replace(/\s*[|–-]\s*Sakin\.zo(?:\s+Blog)?\s*$/i, "");
  const fallback = renderSeoFallback(seo, title);
  return withHead.replace(/(<div\s+id="root"\s*>)(\s*)(<\/div>)/i, (_match, open, _empty, close) => `${open}${fallback}${close}`);
}

const searchContent = {
  index: {
    sections: [
      {
        heading: "Digital products for business needs",
        paragraphs: [
          "Sakin.zo builds custom websites, mobile apps, AI solutions and connected IoT products for businesses in Mumbai and Thane. Work can cover product discovery, design, software engineering, testing and launch.",
        ],
      },
      {
        heading: "Explore our core services",
        links: [
          ["Web and mobile development", "/web-mobile-development"],
          ["AI chatbot and agent development", "/ai-agent-development"],
          ["IoT development services", "/iot-development"],
          ["All Sakin.zo services", "/services"],
        ],
      },
    ],
  },
  "web-mobile-development": {
    sections: [
      {
        heading: "Websites, applications and mobile products",
        paragraphs: [
          "Plan a business website, web application or Android and iOS app around your customers, workflows and product goals. Sakin.zo works with teams in Mumbai and Thane from discovery through launch.",
          "A project can include requirements and product planning, responsive UX/UI design, frontend and backend development, integrations, quality assurance and deployment. Scope and delivery are agreed around the product requirements.",
        ],
      },
      {
        heading: "Related product engineering",
        links: [
          ["AI chatbot and agent development", "/ai-agent-development"],
          ["IoT development services", "/iot-development"],
          ["Explore Sakin.zo projects", "/projects"],
          ["Discuss a website or app project", "/contact"],
        ],
      },
    ],
  },
  "ai-agent-development": {
    sections: [
      {
        heading: "Business AI assistants and agents",
        paragraphs: [
          "Plan an AI chatbot or agent that can find trusted information, use approved tools and support defined business workflows. Sakin.zo works with teams in Mumbai and Thane to scope assistants around their data, users and operating needs.",
          "A responsible implementation defines permitted knowledge sources and actions, evaluates answer quality, and includes human review where a workflow needs it. Integrations, safeguards and success measures are set during discovery.",
        ],
      },
      {
        heading: "Related services and practical guides",
        links: [
          ["Web and mobile development", "/web-mobile-development"],
          ["IoT development services", "/iot-development"],
          ["Read the business AI assistant guide", "/blog/practical-guide-ai-assistant-business-systems"],
          ["Discuss an AI project", "/contact"],
        ],
      },
    ],
  },
  "iot-development": {
    sections: [
      {
        heading: "Connected devices, cloud platforms and applications",
        paragraphs: [
          "Sakin.zo helps plan and build connected product software across device integration, firmware interfaces, cloud services, monitoring dashboards and customer or operator applications.",
          "IoT work can include telemetry, device identity, fleet management, alerts, data workflows and integration testing. The design accounts for hardware limits, connectivity conditions and the operational environment.",
        ],
      },
      {
        heading: "Related connected product work",
        links: [
          ["IoT cloud platform case study", "/iot-cloud-platform"],
          ["Smart home solutions", "/smart-home-solutions"],
          ["Read the IoT platform architecture guide", "/blog/iot-platform-architecture-layers-guide"],
          ["Discuss an IoT project", "/contact"],
        ],
      },
    ],
  },
};

function renderMarkdown(markdown) {
  const { blocks } = parseMarkdown(markdown || "");
  return blocks.map((block) => {
    if (["ul", "ol"].includes(block.type))
      return `<${block.type}>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${block.type}>`;
    if (block.type === "code") return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
    const level = /^h[23]$/.test(block.type) ? block.type : "p";
    const id = block.id ? ` id="${escapeHtml(block.id)}"` : "";
    const text = escapeHtml(block.text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_match, label, target) => {
      const href = safeMarkdownLink(target);
      return href ? `<a href="${escapeHtml(href)}">${label}</a>` : label;
    });
    return `<${level}${id}>${text}</${level}>`;
  }).join("");
}

function renderSeoFallback(seo, title) {
  const content = seo.fallback || {};
  const row = content.row;
  let sections = searchContent[content.slug]?.sections || [];
  if (content.slug === "blog" && !row) {
    const posts = seo.content?.blogs || [];
    sections = [{
      heading: "Latest engineering guides",
      paragraphs: ["Practical Sakin.zo articles on AI, software engineering and IoT product development."],
      links: posts.map((post) => [post.title, `/blog/${contentSlug(post, posts, "blog")}`]),
    }];
  }
  const article = row && content.slug === "blog";
  const project = row && content.slug === "project";
  const articleDate = article && row.publishedAt && !Number.isNaN(Date.parse(row.publishedAt))
    ? new Date(row.publishedAt).toISOString().slice(0, 10)
    : "";
  const articleMeta = article
    ? `<p><strong>${escapeHtml(row.category || "Technology")}</strong>${row.author ? ` · By ${escapeHtml(row.author)}` : ""}${articleDate ? ` · ${escapeHtml(articleDate)}` : ""}</p>`
    : "";
  const body = article ? renderMarkdown(row.body) : project ? renderMarkdown(row.desc) : "";
  const details = sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${section.links?.length ? `<ul>${section.links.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`).join("")}</ul>` : ""}</section>`).join("");
  const projectLinks = project ? `<p><a href="/projects">All projects</a> · <a href="/contact">Discuss a similar project</a></p>` : "";
  const cta = !["not-found", "admin"].includes(content.slug)
    ? `<nav aria-label="Explore Sakin.zo"><a href="/services">Services</a> · <a href="/projects">Projects</a> · <a href="/blog">Insights</a> · <a href="/contact">Contact</a></nav>`
    : "";
  return `<main class="seo-prerender-fallback" style="max-width:760px;margin:12vh auto;padding:24px;font:16px/1.7 Inter,Arial,sans-serif;color:#13233f"><h1 style="margin:0 0 12px;font-size:clamp(28px,5vw,44px);line-height:1.15">${escapeHtml(title)}</h1><p style="margin:0 0 20px;color:#52647d">${escapeHtml(seo.description || "Digital product development by Sakin.zo.")}</p>${articleMeta}${body}${details}${projectLinks}${cta}</main>`;
}
export function contentEntries(data, siteUrl) {
  const base = siteAddress(siteUrl),
    entries = [];
  for (const [kind, rows] of [
    ["blog", data?.blogs],
    ["projects", data?.projects],
  ]) {
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row.visible === false) continue;
      const slug = contentSlug(
        row,
        Array.isArray(data?.[kind === "blog" ? "blogs" : "projects"])
          ? data[kind === "blog" ? "blogs" : "projects"]
          : [],
        kind === "blog" ? "blog" : "project",
      );
      if (!slug) continue;
      const updated = row.updatedAt || row.publishedAt;
      entries.push({
        url: new URL(`${kind}/${encodeURIComponent(slug)}`, base).href,
        ...(updated && !Number.isNaN(Date.parse(updated))
          ? { modified: new Date(updated).toISOString() }
          : {}),
      });
    }
  }
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
export function sitemapXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((entry) => `  <url><loc>${escapeHtml(entry.url)}</loc>${entry.modified ? `<lastmod>${escapeHtml(entry.modified)}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`;
}
