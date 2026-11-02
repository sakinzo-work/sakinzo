import { contact } from "../data/contact.js";
import { assetUrl } from "./paths.js";

export const DEFAULT_SITE_URL = "https://sakinzo.vercel.app/";
export function siteAddress(value = DEFAULT_SITE_URL) {
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) return DEFAULT_SITE_URL;
    url.search = url.hash = "";
    return url.href.replace(/\/?$/, "/");
  } catch {
    return DEFAULT_SITE_URL;
  }
}
export function canonicalUrl(path = "/", search = "", base = DEFAULT_SITE_URL) {
  const params = new URLSearchParams(search);
  const aliases = {
    index: "",
    index1: "",
    newindex: "",
    preindex: "",
    contactus: "contact",
    constactus2: "contact",
    project: "projects",
    ad: "admin",
  };
  let clean = path.replace(/^\/+|\/+$/g, "").replace(/\.html$/i, "");
  clean = aliases[clean] ?? clean;
  if (clean === "blog" && params.get("slug"))
    clean += "/" + encodeURIComponent(params.get("slug"));
  if (clean === "projects" && params.get("id"))
    clean += "/" + encodeURIComponent(params.get("id"));
  return new URL(clean, siteAddress(base)).href;
}
export const plainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
export function seoImage(
  value,
  base = DEFAULT_SITE_URL,
  api = "https://sakinzo.onrender.com/api",
) {
  if (!/^https?:\/\//.test(api || "")) api = "https://sakinzo.onrender.com/api";
  let image = assetUrl(typeof value === "string" ? value : "");
  if (image.startsWith("/uploads/"))
    image = api.replace(/\/api\/?$/, "") + image;
  try {
    const url = new URL(image.replace(/^\/(?!\/)/, ""), siteAddress(base));
    if (image && /^https?:$/.test(url.protocol)) return url.href;
  } catch {}
  return new URL("assets/sakinzo-hero-desktop-waves.webp", siteAddress(base))
    .href;
}
export function detailMetadata(kind, row) {
  const title = plainText(row.title || "Sakinzo project");
  return {
    title:
      kind === "blog"
        ? `${title} | Sakinzo Blog`
        : `${title} Case Study | Sakin.zo`,
    description: plainText(
      row.excerpt || row.desc || `Explore ${title} from the Sakinzo team.`,
    ).slice(0, 160),
    image: row.coverImage || row.img || row.images?.[0],
    type: "article",
  };
}
export function createSeo({
  slug,
  path = "/",
  search = "",
  meta,
  cover,
  service,
  siteUrl,
  api,
  language = "en",
  schema: customSchema,
}) {
  const base = siteAddress(siteUrl),
    url = canonicalUrl(path, search, base);
  const title = meta.title || "Sakin.zo | Software Development";
  const description = plainText(meta.description);
  const image = seoImage(meta.image || cover?.image, base, api);
  const organizationId = base + "#organization",
    websiteId = base + "#website";
  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: "Sakin.zo",
    alternateName: "Sakinzo",
    url: base,
    logo: { "@type": "ImageObject", url: new URL("favicon.svg", base).href },
    email: contact.email,
    telephone: "+918879162814",
    sameAs: [contact.instagramUrl],
    areaServed: [
      { "@type": "City", name: "Mumbai" },
      { "@type": "City", name: "Thane" },
      { "@type": "Country", name: "India" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: contact.email,
      telephone: "+918879162814",
    },
  };
  const graph = [
    organization,
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Sakin.zo",
      alternateName: "Sakinzo",
      url: base,
      publisher: { "@id": organizationId },
      inLanguage: "en",
    },
    {
      "@type":
        slug === "contactus"
          ? "ContactPage"
          : slug === "who-we-are"
            ? "AboutPage"
            : "WebPage",
      "@id": url + "#webpage",
      name: title,
      description,
      url,
      inLanguage: language,
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
    },
  ];
  if (service)
    graph.push(
      {
        "@type": "Service",
        "@id": url + "#service",
        name: service.name,
        serviceType: service.name,
        description: service.summary,
        url,
        image,
        provider: { "@id": organizationId },
        areaServed: organization.areaServed,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: new URL("services", base).href,
          },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    );
  if (customSchema) {
    const { "@context": ignored, ...entity } = customSchema;
    graph.push({
      ...entity,
      url,
      image,
      publisher: entity.publisher ? { "@id": organizationId } : undefined,
      mainEntityOfPage: { "@id": url + "#webpage" },
    });
  }
  return {
    title,
    description,
    url,
    image,
    type: meta.type || "website",
    imageAlt: cover?.description || title,
    imageWidth: !meta.image ? cover?.width : undefined,
    imageHeight: !meta.image ? cover?.height : undefined,
    robots:
      meta.noindex || ["admin", "not-found"].includes(slug)
        ? "noindex, nofollow"
        : slug === "project" &&
            !/\/projects\/.+/.test(path) &&
            !new URLSearchParams(search).get("id")
          ? "noindex, follow"
          : "index, follow, max-image-preview:large",
    schema: { "@context": "https://schema.org", "@graph": graph },
  };
}
