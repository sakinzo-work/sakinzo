import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AppLink from "../../components/AppLink.jsx";
import { useSiteData, visibleItems } from "../../context/SiteDataContext.jsx";
import { T } from "../../context/LanguageContext.jsx";
import { mediaUrl, safeUrl } from "../../lib/api.js";
import { appPath, assetUrl } from "../../lib/paths.js";
import BlogImage from "../../components/BlogImage.jsx";
import { projectCategories, projectImages } from "../../lib/project.js";
import ContentState, { ProjectSkeletons } from "../../components/ContentState.jsx";
import localBlogPosts from "../../../content/blogs/posts.json";
import { contentPath, contentSlug } from "../../lib/content-slugs.js";
export const categoryOrder = projectCategories;
export function categoryKey(category = "") {
  const value = String(category || "").trim().toLowerCase().replace(/\s+/g, " ");
  return (
    {
      "web developement": "web development",
      "website development": "web development",
      "web app": "web development",
      "web application": "web development",
      "ai/ml": "ai / ml",
      "ai-ml": "ai / ml",
      aiml: "ai / ml",
      "i os app": "ios app",
      game: "game development",
      games: "game development",
    }[value] || value
  );
}
export const categoryLabel = (value) =>
  categoryOrder.find((name) => categoryKey(name) === categoryKey(value)) ||
  value;
export function HomeSection({ sectionKey, children }) {
  const { site } = useSiteData();
  if (site.sections?.[sectionKey] === false) return null;
  return sectionKey === "cases" ? <HomeCaseStudies /> : children;
}
export function HomeStats({ children }) {
  const { site } = useSiteData(),
    rows = visibleItems(site.stats);
  return (
    <div className="stats-grid" id="main-stats-grid">
      {rows.length
        ? rows.map((row, index) => (
            <div
              className="stat"
              key={row._id}
              style={
                index
                  ? { borderLeft: "2px solid #e2eaf4", paddingLeft: 32 }
                  : undefined
              }
            >
              <div className="stat-num">{row.value}</div>
              <div className="stat-lbl">
                <T text={row.label} />
              </div>
            </div>
          ))
        : children}
    </div>
  );
}
export function HomeClients({ children }) {
  const { site } = useSiteData(),
    rows = visibleItems(site.clients);
  return (
    <div className="clients-grid" id="main-clients-grid">
      {rows.length
        ? rows.map((row) => (
            <div className="cl-card" key={row._id}>
              {row.logo ? (
                <img
                  src={mediaUrl(row.logo)}
                  alt={row.name}
                  style={{ maxWidth: 130, maxHeight: 46, objectFit: "contain" }}
                />
              ) : (
                <strong>{row.name}</strong>
              )}
            </div>
          ))
        : children}
    </div>
  );
}
function ProjectCard({ project, projects }) {
  const [slide, setSlide] = useState(0),
    [hover, setHover] = useState(false),
    [broken, setBroken] = useState([]);
  const images = projectImages(project).filter((image) => !broken.includes(image));
  const activeSlide = images.length ? slide % images.length : 0;
  useEffect(() => {
    if (!hover || images.length < 2) return;
    const timer = setInterval(
      () => setSlide((value) => (value + 1) % images.length),
      2400,
    );
    return () => clearInterval(timer);
  }, [hover, images.length]);
  return (
    <AppLink
      to={contentPath("project", project, projects)}
      className="project-card"
      aria-label={`View ${project.title || "project"} project`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setSlide(0);
      }}
    >
      <div className="project-media">
        {images.length ? (
          images.map((image, index) => (
            <img
              key={image}
              src={mediaUrl(image)}
              className={`project-img${activeSlide === index ? " active" : ""}`}
              alt={`${project.title} image ${index + 1}`}
              loading="lazy"
              onError={() =>
                setBroken((failed) => failed.includes(image) ? failed : [...failed, image])
              }
            />
          ))
        ) : (
          <div className="project-img-fallback">
            <span>NO IMAGE</span>
          </div>
        )}
        {images.length > 1 && (
          <div className="project-dots">
            {images.map((image, index) => (
              <span
                key={image}
                className={`project-dot${activeSlide === index ? " active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="project-overlay">
        <span className="project-category">
          <T text={categoryLabel(project.category || "")} />
        </span>
        <h3 className="project-title">
          <T text={project.title || "Untitled project"} />
        </h3>
        <p className="project-desc">
          <T text={project.desc || "Project details coming soon."} />
        </p>
        <div className="project-tech">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span className="tech-tag" key={tag}>
              {tag}
            </span>
          ))}
          {project.tags?.length > 3 && (
            <span className="tech-tag">+{project.tags.length - 3}</span>
          )}
        </div>
        <span className="project-link">
          <T>View project</T>
        </span>
      </div>
    </AppLink>
  );
}
function HomeCaseStudies() {
  const { site, loading, error, refresh } = useSiteData();
  const projects = visibleItems(site.projects);
  const featured = [
    /air.*water|aquaair/i,
    /focus\s*lock/i,
    /farm.?dash/i,
  ]
    .map((pattern) => projects.find((project) => pattern.test(project.title || "")))
    .filter(Boolean);
  for (const project of projects) {
    if (featured.length >= 3) break;
    if (!featured.some((item) => item._id === project._id)) featured.push(project);
  }
  return (
    <section className="sec projects-sec cases-sec" id="sec-cases">
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <h2 className="sec-title"><T>Selected Projects</T></h2>
            <p className="sec-subtitle"><T>Real products built by Sakin.zo, with their published scope and project details.</T></p>
          </div>
          <AppLink className="btn-blue" href="/projects"><T>Browse all projects</T></AppLink>
        </div>
        {loading && !featured.length ? (
          <ProjectSkeletons />
        ) : error && !featured.length ? (
          <ContentState compact state="error" title="Projects are temporarily unavailable"
            description="Please try again to explore our published work."
            onAction={() => refresh()} />
        ) : featured.length ? (
          <div className="projects-grid cases-grid">
            {featured.map((project) => <ProjectCard key={project._id} project={project} projects={projects} />)}
          </div>
        ) : (
          <ContentState compact state="empty" title="Project details are being prepared"
            description="Our published work will appear here soon." />
        )}
      </div>
    </section>
  );
}
export function HomeProjects() {
  const { site, loading, error, refresh } = useSiteData(),
    [filter, setFilter] = useState("all"),
    [count, setCount] = useState(3);
  const projects = visibleItems(site.projects),
    categories = [...new Set([
      ...categoryOrder,
      ...projects.map((row) => categoryLabel(row.category || "")).filter(Boolean),
    ])];
  const filtered = projects.filter(
    (row) => filter === "all" || categoryKey(row.category) === filter,
  );
  return (
    <HomeSection sectionKey="projects">
      <section className="sec projects-sec" id="sec-projects">
        <div className="wrap">
          <div className="sec-hd">
            <h2 className="sec-title"><T>Our Projects</T></h2>
            {filtered.length > 3 && (
              <button type="button" className="btn-blue" aria-expanded={count > 3}
                onClick={() => setCount(count > 3 ? 3 : filtered.length)}>
                <T>{count > 3 ? "Show Less" : "Show More"}</T>
              </button>
            )}
          </div>
          {!!projects.length && <div
            className="project-filters"
            id="project-filters"
            role="group"
            aria-label="Project category"
          >
            {[
              ["all", "All"],
              ...categories.map((name) => [categoryKey(name), name]),
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={`project-filter${filter === key ? " active" : ""}`}
                aria-pressed={filter === key}
                onClick={() => {
                  setFilter(key);
                  setCount(3);
                }}
              >
                <T text={label} />
              </button>
            ))}
          </div>}
          {!!projects.length && (loading || error) && <ContentState compact
            state={error ? "error" : "loading"}
            title={error ? "Showing saved projects" : "Updating projects…"}
            description={error ? "The latest updates couldn't be loaded. You can still explore our work below." : "You can keep browsing while we check for updates."}
            onAction={() => refresh()} busy={loading} />}
          <div className="projects-grid" id="main-projects-grid" aria-busy={loading}>
            {filtered.length ? (
              filtered
                .slice(0, count)
                .map((project) => (
                  <ProjectCard key={project._id} project={project} projects={projects} />
                ))
            ) : loading && !projects.length ? <ProjectSkeletons /> : (
              <ContentState className="empty-projects"
                state={error && !projects.length ? "error" : "empty"}
                title={error && !projects.length ? "Projects are temporarily unavailable" : projects.length ? "No projects in this category yet." : "No projects published yet."}
                description={error && !projects.length ? "Please try again in a moment to explore our latest work." : projects.length ? "Explore all our projects to find more of what we build." : "Our latest work will appear here soon."}
                onAction={error && !projects.length ? () => refresh() : projects.length ? () => { setFilter("all"); setCount(3); } : undefined}
                actionLabel={error && !projects.length ? "Try again" : "View all projects"} />
            )}
          </div>
          {count < filtered.length && (
            <div className="projects-more-wrap">
              <button
                type="button"
                className="btn-view-all"
                onClick={() => setCount((value) => value + 3)}
              >
                <T>View All Projects</T>
                <span>↗</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </HomeSection>
  );
}
export function HomeInsights() {
  const { site, loading, error, refresh } = useSiteData();
  const rows = visibleItems(site.insights);
  const fallback = visibleItems(site.blogs).map((post) => ({
    ...post,
    image: post.coverImage,
    desc: post.excerpt,
    articleUrl: contentPath("blog", post, site.blogs),
  }));
  const blogFallback = fallback.length ? fallback : localBlogPosts.map((post) => ({
    ...post,
    image: post.coverImage,
    desc: post.excerpt,
    articleUrl: contentPath("blog", post, localBlogPosts),
  }));
  const cards = (rows.length ? rows : blogFallback).map(row => {
    const href = appPath(row.articleUrl || "");
    let sameSitePath = href;
    try {
      const parsed = new URL(href, window.location.origin);
      if (parsed.origin === window.location.origin) sameSitePath = parsed.pathname + parsed.search;
    } catch {}
    const reference = sameSitePath.match(/^\/blog\/([^/?#]+)/)?.[1];
    let decodedReference = reference || "";
    try { decodedReference = decodeURIComponent(decodedReference); } catch {}
    const knownPost = site.blogs.find((post) =>
      String(post._id || "") === String(row._id || "") ||
      post.slug === row.slug ||
      post.title === row.title ||
      post.slug === decodedReference ||
      String(post._id || "") === decodedReference ||
      contentSlug(post, site.blogs, "blog") === decodedReference
    );
    const internalBlog = sameSitePath.startsWith("/blog/");
    const articleUrl = knownPost
      ? contentPath("blog", knownPost, site.blogs)
      : internalBlog && /^(?:\d+|[a-f\d]{24})$/i.test(decodedReference)
        ? contentPath("blog", row, blogFallback)
        : href || contentPath("blog", row, blogFallback);
    return { ...row, articleUrl };
  });
  return (
    <div className="ins-grid" id="main-insights-grid">
      {cards.length ? (
        cards.map((row) => (
          <article className="ins-card" key={row._id}>
              <BlogImage
                className="ins-img"
                src={row.image}
                category={row.category}
                alt={row.title}
                loading="lazy"
                decoding="async"
              />
            <div className="ins-meta">
              <T text={row.category || ""} />
            </div>
            <div className="ins-ttl">
              <T text={row.title} />
            </div>
            <div className="ins-desc">
              <T text={row.desc} />
            </div>
            {row.author && (
              <div className="ins-author">
                By {row.author} · {Number(row.readTime || 5)} min read
              </div>
            )}
            <div className="ins-ft">
              <span className="ins-date">
                {row.publishedAt
                  ? new Date(row.publishedAt).toLocaleDateString("en", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
              {row.rating > 0 && (
                <span className="ins-rating">
                  ★ Avg {Number(row.rating).toFixed(1)} / 5
                </span>
              )}
            </div>
            {row.articleUrl && (
              <AppLink
                href={row.articleUrl}
                className="ins-lnk"
                target={/^https?:/.test(row.articleUrl) ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <T>Learn more</T> ↗
              </AppLink>
            )}
          </article>
        ))
      ) : (
        <ContentState compact state={loading ? "loading" : error ? "error" : "empty"}
          title={loading ? "Loading insights…" : error ? "Insights are temporarily unavailable" : "New insights are on the way"}
          description={error ? "Please try again in a moment." : "Our latest ideas will appear here soon."}
          onAction={error && !loading ? () => refresh() : undefined} />
      )}
    </div>
  );
}
export function HomeTestimonials() {
  const { site } = useSiteData(),
    rows = visibleItems(site.testimonials),
    [index, setIndex] = useState(0);
  useEffect(() => {
    if (rows.length < 2) return;
    const timer = setInterval(
      () => setIndex((value) => (value + 1) % rows.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [rows.length]);
  if (!rows.length || site.sections.feedback === false) return null;
  const row = rows[index % rows.length];
  return (
    <section className="fb-sec" id="sec-feedback">
      <div className="sec-inner">
        <h2 className="sec-title">
          <T>What our clients say</T>
        </h2>
        <div className="fb-card">
          <div className="fb-init" id="fbInit">
            {row.initials || row.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="fb-name" id="fbName">
            {row.name}
          </div>
          <div className="fb-role" id="fbRole">
            <T text={row.role || ""} />
          </div>
          <div className="fb-txt" id="fbTxt">
            <T text={row.text || ""} />
          </div>
          <div className="fb-nav">
            <button
              type="button"
              className="fb-arr"
              aria-label="Previous testimonial"
              onClick={() =>
                setIndex((value) => (value - 1 + rows.length) % rows.length)
              }
            >
              ←
            </button>
            <div className="fb-dots" id="fbDots">
              {rows.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  className={`fb-dot${i === index % rows.length ? " on" : ""}`}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="fb-arr"
              aria-label="Next testimonial"
              onClick={() => setIndex((value) => (value + 1) % rows.length)}
            >
              →
            </button>
          </div>
          <div className="fb-prog">
            <div
              className="fb-prog-fill"
              id="fbFill"
              style={{
                width: `${(((index % rows.length) + 1) / rows.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeMap() {
  const { site, loading, error, refresh } = useSiteData(),
    root = useRef(null),
    [failed, setFailed] = useState(false),
    [popup, setPopup] = useState(null);
  const mapRef = useRef(null), markers = useRef(new Map());
  useLayoutEffect(() => { popup?.instance.update(); }, [popup]);
  const points = visibleItems(site.mapLocations).filter(
    (row) =>
      Number.isFinite(Number(row.lat)) && Number.isFinite(Number(row.lng)),
  );
  const key = JSON.stringify(points);
  useEffect(() => {
    if (!points.length || !root.current) return;
    let active = true,
      map,
      observer,
      resizeObserver;
    const load = async () => {
      try {
        const [L] = await Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]);
        if (!active) return;
        const icon = L.icon({
          iconUrl: assetUrl("vendor/leaflet/images/marker-icon.png"),
          iconRetinaUrl: assetUrl("vendor/leaflet/images/marker-icon-2x.png"),
          shadowUrl: assetUrl("vendor/leaflet/images/marker-shadow.png"),
          iconSize: [25, 41], iconAnchor: [12, 41],
          popupAnchor: [1, -34], shadowSize: [41, 41],
        });
        map = L.map(root.current, { scrollWheelZoom: false }).setView(
          [20, 0],
          2,
        );
        mapRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);
        const bounds = [];
        points.forEach((row) => {
          const position = [Number(row.lat), Number(row.lng)];
          const container = L.DomUtil.create("div");
          const label = [row.name, row.city, row.country].filter(Boolean).join(", ");
          const marker = L.marker(position, { icon, title: label, alt: label }).addTo(map).bindPopup(container, { minWidth: 200, maxWidth: 280 });
          markers.current.set(row._id, marker);
          marker.on("popupopen", () => {
            if (active) setPopup({ container, row, instance: marker.getPopup() });
          });
          marker.on("popupclose", () => {
            if (active) setPopup(null);
          });
          bounds.push(position);
        });
        bounds.length > 1
          ? map.fitBounds(bounds, { padding: [56, 56], maxZoom: 12 })
          : map.setView(bounds[0], 5);
        resizeObserver = new ResizeObserver(() => {
          if (!active) return;
          map.invalidateSize();
          if (bounds.length > 1) map.fitBounds(bounds, { padding: [56, 56], maxZoom: 12, animate: false });
        });
        resizeObserver.observe(root.current);
      } catch {
        if (active) setFailed(true);
      }
    };
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            load();
          }
        },
        { rootMargin: "250px" },
      );
      observer.observe(root.current);
    } else load();
    return () => {
      active = false;
      observer?.disconnect();
      resizeObserver?.disconnect();
      map?.remove();
      mapRef.current = null;
      markers.current.clear();
    };
  }, [key]);
  return (
    <HomeSection sectionKey="map">
      <section className="sec map-sec" id="sec-map">
        <div className="wrap">
          <div className="sec-hd"><h2 className="sec-title">
            <T>Our clients around the world</T>
          </h2></div>
          <div
            ref={root}
            id="clientsMap"
            role="region"
            aria-label="Client locations map"
            style={{ height: points.length && !failed ? 480 : 0, display: points.length && !failed ? undefined : "none" }}
          />
          {!!points.length && <div className="map-locations" aria-label="Client locations">
            {points.map((row) => <button key={row._id} type="button" className="map-location"
              aria-label={`Show ${row.name} on map`}
              onClick={() => {
                const marker = markers.current.get(row._id);
                if (marker) {
                  mapRef.current?.panTo(marker.getLatLng());
                  marker.openPopup();
                }
              }}>
              <span className="location-dot" aria-hidden="true" />
              <span><strong>{row.name}</strong><small>{[row.city, row.country].filter(Boolean).join(", ")}</small></span>
              <span className="location-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>}
          {popup &&
            createPortal(
              <>
                <strong>{popup.row.name}</strong>
                <p>
                  {[popup.row.city, popup.row.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{Number(popup.row.clientsCount || 1)} client(s)</p>
              </>,
              popup.container,
            )}
          {(!points.length || failed) && (
            <ContentState compact state={loading ? "loading" : error || failed ? "error" : "empty"}
              title={loading ? "Loading client locations…" : error || failed ? "Client locations are temporarily unavailable" : "Our client locations"}
              description={error || failed ? "Please try again in a moment." : "Client locations will appear here when published."}
              onAction={error && !loading ? () => refresh() : undefined} />
          )}
        </div>
      </section>
    </HomeSection>
  );
}
