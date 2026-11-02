import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { transformWithEsbuild } from "vite";

// Keep page-specific CSS isolated, but serve each profile in one cached request.
export default function pageStyleBundles() {
  const id = "virtual:page-styles";
  let config;
  return {
    name: "sakinzo-page-styles",
    configResolved(value) { config = value; },
    resolveId(source) { if (source === id) return "\0" + id; },
    async load(source) {
      if (source !== "\0" + id) return;
      const root = new URL("../", import.meta.url);
      const profiles = JSON.parse(await fs.readFile(new URL("src/data/route-styles.json", root), "utf8"));
      const bundles = new Map(), result = {};
      for (const [slug, files] of Object.entries(profiles)) {
        if (config.command === "serve") {
          result[slug] = files.map(file => config.base + file.slice(1));
          continue;
        }
        const key = files.join("\n");
        if (!bundles.has(key)) {
          const parts = await Promise.all(files.map(async file => {
            const css = await fs.readFile(new URL("public" + file, root), "utf8");
            return css.replace(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g, (match, quote, url) => {
              if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) return match;
              const asset = new URL(url, "https://assets.local" + file);
              return `url(${JSON.stringify(config.base + asset.pathname.slice(1) + asset.search + asset.hash)})`;
            });
          }));
          const { code } = await transformWithEsbuild(parts.join("\n"), `page-${slug}.css`, { loader: "css", minify: true });
          const hash = createHash("sha256").update(code).digest("hex").slice(0, 12);
          const name = slug === "admin" || slug === "index" || slug === "blog" || slug === "project" || slug === "contactus"
            ? slug : files.includes("/services.css") ? "services" : "subpage";
          const fileName = `assets/page-${name}-${hash}.css`;
          this.emitFile({ type: "asset", fileName, source: code });
          bundles.set(key, config.base + fileName);
        }
        result[slug] = [bundles.get(key)];
      }
      return `export default ${JSON.stringify(result)};`;
    },
  };
}
