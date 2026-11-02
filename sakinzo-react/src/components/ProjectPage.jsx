import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import Localized from "./Localized.jsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SiteHeader from "./SiteHeader.jsx";
import PageHero from "./PageHero.jsx";
import Markdown from "./Markdown.jsx";
import useRemoteData from "../hooks/useRemoteData.js";
import ContentState from "./ContentState.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { mediaUrl, safeUrl } from "../lib/api.js";
import {
  cleanList,
  nativeAppLink,
  previewDevices,
  projectImages,
  projectPreviewDevice,
  videoSource,
} from "../lib/project.js";
import covers from "../data/page-covers.js";
import { useParams, useSearchParams } from "react-router-dom";
import SiteFooter from "./SiteFooter.jsx";
import { useSiteData, visibleItems } from "../context/SiteDataContext.jsx";
import { contentSlug } from "../lib/content-slugs.js";
function Gallery({ images, title }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(
      () => setSlide((value) => (value + 1) % images.length),
      3000,
    );
    return () => clearInterval(timer);
  }, [images.length]);
  if (!images.length) return null;
  return (
    <div className="wrap">
      <div className="cover-carousel">
        <T>
          {images.map((image, index) => (
            <Localized>
              <img
                key={image}
                className={`cover-slide${slide === index ? " active" : ""}`}
                src={mediaUrl(image)}
                alt={`${title} image ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Localized>
          ))}
        </T>
        <T>
          {images.length > 1 && (
            <div className="cover-dots">
              <T>
                {images.map((image, index) => (
                  <Localized>
                    <button
                      key={image}
                      type="button"
                      className={`cover-dot${slide === index ? " active" : ""}`}
                      aria-label={`Show image ${index + 1}`}
                      onClick={() => setSlide(index)}
                    />
                  </Localized>
                ))}
              </T>
            </div>
          )}
        </T>
      </div>
    </div>
  );
}
function VideoPlayer({ source, title }) {
  if (!source) return null;
  if (source.type === "embed")
    return (
      <Localized>
        <iframe
          className="project-video"
          src={source.url}
          title={`${title} video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </Localized>
    );
  return (
    <Localized>
      <video
        className="project-video"
        controls
        playsInline
        preload="metadata"
        aria-label={`${title} video`}
      >
        <source src={source.url} />
        <T>{" Your browser cannot play this video."}</T>{" "}
        <RouteLink href={source.url} target="_blank" rel="noopener">
          <T>{" Open video "}</T>
        </RouteLink>
      </video>
    </Localized>
  );
}
function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3h7v7M21 3 10 14M21 14v7H3V3h7" />
    </svg>
  );
}
function DeviceIcon({ device }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <T>
        {device === "phone" ? (
          <>
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M10 18h4" />
          </>
        ) : device === "tablet" ? (
          <>
            <rect x="3" y="2" width="18" height="20" rx="3" />
            <path d="M10 18h4" />
          </>
        ) : (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 22h8M12 17v5" />
          </>
        )}
      </T>
    </svg>
  );
}
function LivePreview({ project }) {
  const [layout, setLayout] = useState({
    scale: 1,
    height: 0,
  });
  const [device, setDevice] = useState(() => projectPreviewDevice(project));
  const viewport = useRef(null),
    frame = useRef(null);
  const url = safeUrl(project.demoUrl);
  const native = url ? nativeAppLink(url) : false;
  useLayoutEffect(() => {
    if (!viewport.current || !frame.current) return;
    const resize = () => {
      const container = viewport.current,
        element = frame.current;
      if (
        !container?.clientWidth ||
        !element?.offsetWidth ||
        !element?.offsetHeight
      )
        return;
      const height = Math.max(
        280,
        (window.visualViewport?.height || innerHeight || 1000) - 180,
      );
      const scale = Math.min(
        1,
        container.clientWidth / element.offsetWidth,
        height / element.offsetHeight,
      );
      const nextHeight = Math.ceil(element.offsetHeight * scale);
      setLayout((previous) =>
        previous.scale === scale && previous.height === nextHeight
          ? previous
          : {
              scale,
              height: nextHeight,
            },
      );
    };
    let observedWidth = -1;
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width !== observedWidth) {
              observedWidth = width;
              resize();
            }
          });
    observer?.observe(viewport.current);
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    resize();
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
    };
  }, [device, url]);
  if (!url) return null;
  const open = (
    <RouteLink
      className="preview-open"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <T>{" Open app "}</T>
      <OpenIcon />
    </RouteLink>
  );
  if (native)
    return (
      <section className="live-preview">
        <div className="wrap">
          <div className="preview-store">
            <h2>
              <T>{"Try the app"}</T>
            </h2>
            <p>
              <T>
                {
                  " This link opens an app store or an app download. Open it on your device to try the native app. "
                }
              </T>
            </p>
            <T>{open}</T>
          </div>
        </div>
      </section>
    );
  return (
    <section className="live-preview" id="livePreview">
      <div className="wrap">
        <div className="preview-heading">
          <div>
            <h2>
              <T>{"Live project preview"}</T>
            </h2>
            <p>
              <T>{"Explore the working app and choose a device view."}</T>
            </p>
          </div>
          <T>{open}</T>
        </div>
        <div className="preview-toolbar">
          <Localized>
            <div
              className="preview-modes"
              role="group"
              aria-label="Preview device"
            >
              <T>
                {previewDevices.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="preview-mode"
                    data-preview-device={value}
                    aria-pressed={device === value}
                    aria-controls="livePreviewDevice"
                    onClick={() => setDevice(value)}
                  >
                    <DeviceIcon device={value} />
                    <T>{value[0].toUpperCase() + value.slice(1)}</T>
                  </button>
                ))}
              </T>
            </div>
          </Localized>
          <span
            className="preview-device-label"
            id="previewDeviceLabel"
            role="status"
          >
            <T>{device[0].toUpperCase() + device.slice(1)}</T>
            <T>{" preview "}</T>
          </span>
        </div>
        <div className="preview-stage">
          <div
            className="preview-viewport"
            ref={viewport}
            style={{
              height: layout.height || undefined,
            }}
          >
            <div
              className="preview-device"
              id="livePreviewDevice"
              data-device={device}
              ref={frame}
              style={{
                "--preview-scale": layout.scale,
              }}
            >
              <div className="preview-device-bar" aria-hidden="true">
                <span className="preview-camera" />
                <span className="preview-traffic">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="preview-address">
                  <T>{new URL(url).hostname}</T>
                </span>
              </div>
              <div className="preview-screen">
                <Localized>
                  <iframe
                    className="preview-frame"
                    src={url}
                    title={`${project.title || "Project"} live preview`}
                    loading="lazy"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </Localized>
              </div>
              <div className="preview-device-bottom" aria-hidden="true">
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Project({ project }) {
  const images = projectImages(project);
  const description =
    `Explore ${project.title || "this Sakin.zo project"}: ${project.desc || "a custom software solution designed for measurable business impact."}`.slice(
      0,
      160,
    );
  const image = images[0]
    ? mediaUrl(images[0])
    : covers.get("project", {
        category: project.category,
      })?.image;
  const portfolio = safeUrl(project.creatorPortfolio);
  const modelImage =
    project.category === "IoT"
      ? safeUrl(mediaUrl(project.modelImage || ""))
      : "";
  const player = videoSource(project.videoUrl);
  useDocumentMeta(
    {
      title: `${project.title || "Project"} Case Study | Sakin.zo`,
      description,
      type: "article",
      image,
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title || "Sakin.zo Project",
      description,
      image,
      url: typeof location === "undefined" ? undefined : location.href,
      creator: project.creatorName
        ? {
            "@type": "Person",
            name: project.creatorName,
            url: portfolio || undefined,
          }
        : {
            "@type": "Organization",
            name: "Sakin.zo",
          },
    },
    "project-schema",
  );
  return (
    <>
      <PageHero slug="project" category={project.category} image={image}>
        <div className="wrap">
          <div className="category">
            <T>{project.category || "Project"}</T>
          </div>
          <h1>
            <T>{project.title || "Untitled project"}</T>
          </h1>
          <div className="lead">
            <Markdown text={project.desc || "Project details coming soon."} />
          </div>
          <T>
            {project.creatorName && (
              <div className="creator">
                <span className="creator-mark">
                  <T>
                    {project.creatorName.trim().charAt(0).toUpperCase() || "?"}
                  </T>
                </span>
                <div>
                  <small>
                    <T>{"Created by"}</T>
                  </small>
                  <div className="creator-name">
                    <T>
                      {portfolio ? (
                        <Localized>
                          <RouteLink
                            href={portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`View ${project.creatorName}'s portfolio`}
                          >
                            <T>{project.creatorName}</T>
                            <T>{" \u2197 "}</T>
                          </RouteLink>
                        </Localized>
                      ) : (
                        project.creatorName
                      )}
                    </T>
                  </div>
                </div>
              </div>
            )}
          </T>
          <div className="tags">
            <T>
              {cleanList(project.tags).map((tag) => (
                <span className="tag" key={tag}>
                  <T>{tag}</T>
                </span>
              ))}
            </T>
          </div>
        </div>
      </PageHero>
      <Gallery images={images} title={project.title} />
      <T>
        {(modelImage || player) && (
          <section className="iot-showcase">
            <div className="wrap">
              <h2>
                <T>{modelImage ? "Real IoT model & demo" : "Project video"}</T>
              </h2>
              <p>
                <T>
                  {modelImage
                    ? "See the physical model and watch the project working in the real world."
                    : "Watch the project in action."}
                </T>
              </p>
              <div
                className={`iot-grid${modelImage && player ? "" : " single-media"}`}
              >
                <T>
                  {modelImage && (
                    <Localized>
                      <img
                        className="model-photo"
                        src={modelImage}
                        alt={`${project.title || "IoT project"} model`}
                        loading="lazy"
                      />
                    </Localized>
                  )}
                </T>
                <VideoPlayer
                  source={player}
                  title={project.title || "Project"}
                />
              </div>
            </div>
          </section>
        )}
      </T>
      <LivePreview project={project} />
    </>
  );
}
export default function ProjectPage() {
  const { id } = useParams();
  const [query] = useSearchParams();
  const { site, loading: siteLoading, error: siteError, refresh: refreshSite } = useSiteData();
  const projects = visibleItems(site.projects);
  const routeValue = id || query.get("id") || "";
  const selected = projects.find(
    (project) =>
      String(project._id || "") === routeValue ||
      contentSlug(project, projects, "project") === routeValue,
  );
  const legacyId = /^[a-f\d]{24}$/i.test(routeValue);
  const projectId = selected?._id || (legacyId ? routeValue : "");
  const selection = {
    ready: true,
    id: projectId,
  };
  const { data, loading, error, refresh } = useRemoteData(
    selection.id ? `/projects/${encodeURIComponent(selection.id)}` : null,
  );
  const waitingForSlug = Boolean(routeValue && !legacyId && !selected && siteLoading);
  const lookupError = !legacyId && !selected && !siteLoading ? siteError : null;
  const missing = selection.ready && (!routeValue || (!selected && !legacyId && !siteLoading && !siteError));
  return (
    <>
      <SiteHeader projectBack />
      <main id="app">
        {data && (loading || error) && <div className="wrap remote-refresh-note"><ContentState compact state={error ? "error" : "loading"}
          title={error ? "Showing saved project details" : "Updating project details…"} description="You can keep exploring while we check for the latest updates."
          onAction={refresh} busy={loading} /></div>}
        <T>
          {data ? (
            <Project project={data} key={data._id || selection.id} />
          ) : waitingForSlug || lookupError ? (
            <div className="wrap project-state-wrap">
              <ContentState heading="h1" state={lookupError ? "error" : "loading"}
                title={lookupError ? "Project details are temporarily unavailable" : "Loading project…"}
                description={lookupError ? "Please try again in a moment." : "Project details will be ready in a moment."}
                onAction={lookupError ? refreshSite : undefined} busy={!lookupError} />
              <p><RouteLink href="/#sec-projects" style={{ color: "#1673ff" }}><T>Back to projects</T></RouteLink></p>
            </div>
          ) : missing || error ? (
            <div className="wrap project-state-wrap">
              <ContentState heading="h1" state={waitingForSlug || loading ? "loading" : missing || error?.status === 404 ? "empty" : "error"}
                title={waitingForSlug || loading ? "Loading project…" : missing || error?.status === 404 ? "Project not found" : "Project details are temporarily unavailable"}
                description={waitingForSlug || loading ? "Project details will be ready in a moment." : missing || error?.status === 404 ? "Explore our other projects to see what we've been building." : "Please try again in a moment."}
                onAction={lookupError ? refreshSite : !missing && error?.status !== 404 ? refresh : undefined} busy={waitingForSlug || loading} />
              <p>
                <RouteLink
                  href="/#sec-projects"
                  style={{
                    color: "#1673ff",
                  }}
                >
                  <T>{" Back to projects "}</T>
                </RouteLink>
              </p>
            </div>
          ) : (
            <div className="wrap project-state-wrap"><ContentState state="loading" title="Loading project…" description="Project details will be ready in a moment." /></div>
          )}
        </T>
      </main>
      <SiteFooter />
    </>
  );
}
