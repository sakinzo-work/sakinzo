import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useLocation } from "react-router-dom";
import metadata from "../data/metadata.json";
import covers from "../data/page-covers.js";
import services from "../data/services.json";
import { useLanguage } from "./LanguageContext.jsx";
import { createSeo } from "../lib/seo.js";
const Context = createContext(() => {});
export function MetadataProvider({ slug, children }) {
  const location = useLocation(),
    { t, language } = useLanguage();
  const [override, setOverride] = useState(null);
  const info = metadata[slug] || metadata.index;
  const current =
    override?.route === location.pathname + location.search ? override : null;
  const meta = { ...info, ...current?.meta };
  const seo = createSeo({
    slug,
    path: location.pathname,
    search: location.search,
    meta: {
      ...meta,
      title: slug === "admin" ? meta.title : t(meta.title),
      description: slug === "admin" ? meta.description : t(meta.description),
    },
    cover: covers.get(slug),
    service: services.find((item) => item.slug === slug),
    siteUrl: import.meta.env.VITE_SITE_URL,
    api: import.meta.env.VITE_API_BASE,
    language,
    schema: current?.schema,
  });
  useLayoutEffect(() => {
    const upsert = (selector, tag, attributes, text) => {
      const matches = [...document.head.querySelectorAll(selector)];
      const element = matches.shift() || document.createElement(tag);
      matches.forEach((duplicate) => duplicate.remove());
      for (const [name, value] of Object.entries(attributes))
        element.setAttribute(name, value);
      if (text !== undefined) element.textContent = text;
      if (!element.isConnected) document.head.appendChild(element);
    };
    upsert("title", "title", {}, seo.title);
    const names = {
      description: seo.description,
      robots: seo.robots,
      "twitter:card": "summary_large_image",
      "twitter:title": seo.title,
      "twitter:description": seo.description,
      "twitter:image": seo.image,
      "twitter:image:alt": seo.imageAlt,
    };
    for (const [name, content] of Object.entries(names))
      upsert(`meta[name="${name}"]`, "meta", { name, content });
    const properties = {
      "og:title": seo.title,
      "og:description": seo.description,
      "og:url": seo.url,
      "og:image": seo.image,
      "og:image:alt": seo.imageAlt,
      "og:type": seo.type,
      "og:site_name": "Sakin.zo",
      "og:locale": "en_IN",
    };
    for (const [property, content] of Object.entries(properties))
      upsert(`meta[property="${property}"]`, "meta", { property, content });
    for (const [property, content] of [
      ["og:image:width", seo.imageWidth],
      ["og:image:height", seo.imageHeight],
    ]) {
      if (content)
        upsert(`meta[property="${property}"]`, "meta", {
          property,
          content: String(content),
        });
      else
        document.head
          .querySelectorAll(`meta[property="${property}"]`)
          .forEach((element) => element.remove());
    }
    upsert('link[rel="canonical"]', "link", {
      rel: "canonical",
      href: seo.url,
    });
    upsert(
      "script[data-site-seo]",
      "script",
      {
        id: current?.schemaId || "sakinzo-schema",
        type: "application/ld+json",
        "data-site-seo": "",
      },
      JSON.stringify(seo.schema).replace(/</g, "\\u003c"),
    );
  }, [JSON.stringify(seo), current?.schemaId]);
  return <Context.Provider value={setOverride}>{children}</Context.Provider>;
}

export function useMetadata(meta, schema, schemaId) {
  const setOverride = useContext(Context),
    location = useLocation();
  const key = JSON.stringify([meta, schema]);
  useEffect(() => {
    if (!meta) return;
    setOverride({
      route: location.pathname + location.search,
      meta,
      schema,
      schemaId,
    });
    return () => setOverride(null);
  }, [key, location.pathname, location.search, setOverride]);
}
