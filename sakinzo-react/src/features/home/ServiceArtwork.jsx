import { useState } from "react";
import { assetUrl } from "../../lib/paths.js";
import ServiceIllustration from "./ServiceIllustration.jsx";

const artwork = {
  "web-mobile-development": [
    "web-mobile",
    "Laptop and smartphone with responsive applications, code, cloud delivery and a product launch",
  ],
  "devops-solutions": [
    "devops",
    "Connected cloud servers, an automated delivery pipeline and monitoring dashboard",
  ],
  "architecture-design": [
    "architecture",
    "Layered software architecture with connected applications, services and databases",
  ],
  "poc-mvp-development": [
    "mvp",
    "A wireframe, interactive prototype and launched application showing product validation stages",
  ],
  "qa-testing": [
    "testing",
    "Software test dashboard, inspection tools, checklists and a security shield",
  ],
  "ux-ui-design": [
    "ux-ui",
    "Interface design canvas, components, colours and a mobile application prototype",
  ],
  "business-analysis": [
    "business-analysis",
    "Product roadmap, requirements and analytics for business strategy",
  ],
};

export default function ServiceArtwork({ service, className = "" }) {
  const [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false);
  const [name, description] = artwork[service.slug];
  const base = `assets/services-${name}-3d-v1`;
  return (
    <div className={`svc-artwork ${className}`} data-service={service.slug}>
      {failed ? (
        <ServiceIllustration service={service} />
      ) : (
        <picture>
          <source
            type="image/webp"
            srcSet={`${assetUrl(`${base}-640.webp`)} 640w, ${assetUrl(`${base}-1200.webp`)} 1200w`}
            sizes="(max-width: 640px) calc(100vw - 68px), (max-width: 900px) 600px, (max-width: 1320px) calc((100vw - 200px) / 2), 620px"
          />
          <img
            className={`svc-service-image${loaded ? " is-loaded" : ""}`}
            src={assetUrl(`${base}-1200.webp`)}
            alt={description}
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </picture>
      )}
    </div>
  );
}
