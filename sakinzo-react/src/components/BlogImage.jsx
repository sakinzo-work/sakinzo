import { useState } from "react";
import { mediaUrl } from "../lib/api.js";
import { assetUrl } from "../lib/paths.js";
import covers from "../data/page-covers.js";

export default function BlogImage({ src, category, alt = "", className = "", ...props }) {
  const [failed, setFailed] = useState([]);
  const candidates = [
    typeof src === "string" && src ? mediaUrl(src) : null,
    assetUrl(covers.get("blog", { category })?.image),
    assetUrl("assets/page-insights.webp"),
  ].filter(Boolean);
  const source = candidates.find(url => !failed.includes(url));
  return source ? <img {...props} className={className} src={source} alt={alt}
    onError={() => setFailed(previous => [...previous, source])} /> :
    <div className={`blog-image-fallback ${className}`} role="img" aria-label={alt || "Article cover"}>
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="8" y="6" width="32" height="36" rx="5" /><path d="M16 16h16M16 24h16M16 32h10" /></svg>
    </div>;
}
