import profiles from "virtual:page-styles";

const resources = new Map();
let activeUrls = new Set();
const urlsFor = slug => profiles[slug] || profiles["who-we-are"];

function loadStyle(url) {
  if (resources.has(url)) return resources.get(url).promise;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.reactPageStyle = "";
  link.setAttribute("fetchpriority", "high");
  const entry = { link, ready: false };
  entry.promise = new Promise((resolve, reject) => {
    const fail = () => {
      clearTimeout(timer);
      link.onload = link.onerror = null;
      link.remove();
      if (resources.get(url) === entry) resources.delete(url);
      reject(new Error("Page styling could not be loaded."));
    };
    const timer = setTimeout(fail, 12000);
    link.onload = () => {
      clearTimeout(timer);
      link.onload = link.onerror = null;
      entry.ready = true;
      link.media = activeUrls.has(url) ? "all" : "not all";
      resolve();
    };
    link.onerror = fail;
    document.head.appendChild(link);
  });
  resources.set(url, entry);
  return entry.promise;
}

export const pageStylesReady = slug => urlsFor(slug).every(url => resources.get(url)?.ready);
export function loadPageStyles(slug) {
  const urls = urlsFor(slug);
  activeUrls = new Set(urls);
  for (const [url, entry] of resources) entry.link.media = activeUrls.has(url) ? "all" : "not all";
  const promise = Promise.all(urls.map(loadStyle));
  // Preserve source order without moving an already ordered link (which can refetch it).
  let previous;
  for (const url of urls) {
    const entry = resources.get(url);
    if (entry) {
      if (previous && (previous.compareDocumentPosition(entry.link) & Node.DOCUMENT_POSITION_PRECEDING)) previous.after(entry.link);
      previous = entry.link;
    }
  }
  return promise;
}
