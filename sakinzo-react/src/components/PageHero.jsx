import { T } from "../context/LanguageContext.jsx";
import { useEffect, useRef, useState } from "react";
import covers from "../data/page-covers.js";
import { safeUrl } from "../lib/api.js";
import { assetUrl } from "../lib/paths.js";
export default function PageHero({
  slug,
  category,
  image,
  baseClass = "hero",
  className = "",
  children,
}) {
  const hero = useRef(null);
  const [inset, setInset] = useState(0),
    [failed, setFailed] = useState(false);
  const fallback = covers.get(slug, {
    category,
  });
  const cover = covers.get(slug, {
    category,
    image: /^data:image\//i.test(image || "")
      ? image
      : safeUrl(image) || undefined,
  });
  useEffect(() => setFailed(false), [image, category, slug]);
  useEffect(() => {
    const refresh = () => {
      const header = document.querySelector("header"),
        node = hero.current;
      if (!header || !node) return;
      const inset =
        getComputedStyle(header).position === "fixed"
          ? Math.max(
              0,
              header.offsetHeight - node.getBoundingClientRect().top - scrollY,
            )
          : 0;
      setInset(inset);
    };
    refresh();
    window.addEventListener("resize", refresh);
    return () => window.removeEventListener("resize", refresh);
  }, []);
  return (
    <section
      ref={hero}
      className={`${baseClass}${cover ? " page-hero-photo" : ""}${className ? " " + className : ""}`}
      data-hero-page={slug}
      style={
        cover
          ? {
              "--page-cover-fit": cover.fit || "cover",
              "--page-hero-top-inset": `${inset}px`,
              "--page-cover-position": cover.position || "right center",
              "--page-cover-mobile-position":
                cover.mobilePosition || "78% center",
            }
          : undefined
      }
    >
      <T>
        {cover && (
          <img
            className="page-hero-image"
            src={assetUrl(failed ? fallback.image : cover.image)}
            alt=""
            fetchPriority="high"
            decoding="async"
            width={cover.width}
            height={cover.height}
            onError={() => setFailed(true)}
          />
        )}
      </T>
      <T>{children}</T>
    </section>
  );
}
