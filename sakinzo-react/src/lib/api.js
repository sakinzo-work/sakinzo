import { assetUrl } from "./paths.js";
import { resolveApiBase } from "./backend.js";
export function apiBase() {
  return resolveApiBase(
    import.meta.env?.VITE_API_BASE,
    typeof location === "undefined" ? "" : location.hostname,
  );
}
export function mediaUrl(url = "") {
  return url.startsWith("/uploads/")
    ? apiBase().replace(/\/api$/, "") + url
    : assetUrl(url);
}
export function safeUrl(
  value,
  base = typeof location === "undefined" ? "http://localhost/" : location.href,
) {
  if (!String(value || "").trim()) return "";
  try {
    const url = new URL(value, base);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
export async function getJson(endpoint, signal) {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
  try {
  const response = await fetch(`${apiBase()}${endpoint}`, {
    signal: controller.signal,
    cache: "no-store",
  });
  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? "This item could not be found."
        : "Unable to load content. Please try again.",
    );
    error.status = response.status;
    throw error;
  }
  return await response.json();
  } catch (error) {
    if (timedOut) throw new Error("Content is taking longer than expected. Please try again.");
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
