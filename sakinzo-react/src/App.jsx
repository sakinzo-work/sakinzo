import { lazy, Suspense, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { MetadataProvider } from "./context/MetadataContext.jsx";
import { PageContext } from "./lib/PageContext.js";
import usePageStyles from "./hooks/usePageStyles.js";
import PageLoading from "./components/PageLoading.jsx";
import { appPath } from "./lib/paths.js";
import routes from "./data/routes.json";
import { preload } from "react-dom";
import { assetUrl } from "./lib/paths.js";
const modules = import.meta.glob("./pages/*.jsx");
const requests = new Map();
function loadPage(slug) {
  if (!requests.has(slug)) {
    const request = (slug === "admin" ? import("./features/admin/AdminPage.jsx") : modules[`./pages/${slug}.jsx`]());
    requests.set(slug, request);
    request.catch(() => { if (requests.get(slug) === request) requests.delete(slug); });
  }
  return requests.get(slug);
}
const pages = Object.fromEntries(
  Object.keys(modules).map((file) => [
    file.split("/").pop().slice(0, -4),
    lazy(() => loadPage(file.split("/").pop().slice(0, -4))),
  ]),
);
const Admin = lazy(() => loadPage("admin"));
function Loading() {
  return <PageLoading />;
}
function Ready({ slug, children }) {
  const location = useLocation(),
    previous = useRef(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: "start" });
      } else if (previous.current !== location.pathname)
        window.scrollTo({ top: 0, behavior: "instant" });
      previous.current = location.pathname;
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return (
    <>
      <span hidden data-react-route={slug} />
      {children}
    </>
  );
}
function Page({ slug, admin = false }) {
  const { ready, error, retry } = usePageStyles(slug),
    Component = admin ? Admin : pages[slug];
  if (slug === "index") preload(assetUrl(matchMedia("(max-width: 600px)").matches
    ? "assets/sakinzo-hero-mobile.webp" : "assets/sakinzo-hero-desktop-waves.webp"), { as: "image", fetchPriority: "high" });
  // Start the page chunk alongside CSS, rather than waiting for CSS first.
  useEffect(() => { loadPage(slug).catch(() => {}); }, [slug]);
  if (error) return <PageLoading error onRetry={retry} />;
  if (!ready) return <Loading />;
  return (
    <PageContext.Provider value={slug}>
      <MetadataProvider slug={slug}>
        <Suspense fallback={<Loading />}>
          <Ready slug={slug}>
            <Component />
          </Ready>
        </Suspense>
      </MetadataProvider>
    </PageContext.Provider>
  );
}
function Fallback() {
  const location = useLocation();
  if (/\.html$/.test(location.pathname)) {
    const destination = appPath(
      location.pathname + location.search + location.hash,
    );
    if (destination !== location.pathname + location.search + location.hash)
      return <Navigate to={destination} replace />;
  }
  return (
    <MetadataProvider slug="not-found">
    <main className="react-not-found">
      <h1>Page not found</h1>
      <p>The requested page is unavailable.</p>
      <a href={import.meta.env.BASE_URL}>Return to home</a>
    </main>
    </MetadataProvider>
  );
}
export default function App() {
  return (
    <LanguageProvider>
      <SiteDataProvider>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Page slug={route.slug} />}
            />
          ))}
          <Route path="/blog/:slug" element={<Page slug="blog" />} />
          <Route path="/projects/:id" element={<Page slug="project" />} />
          <Route
            path="/admin/:section?"
            element={<Page slug="admin" admin />}
          />
          <Route path="*" element={<Fallback />} />
        </Routes>
      </SiteDataProvider>
    </LanguageProvider>
  );
}
