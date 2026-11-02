// Keep the existing site's live data source as the default.
export const DEFAULT_BACKEND_ORIGIN = "https://sakinzo.onrender.com";

export function resolveApiBase(configuredBase, hostname = "") {
  const configured = String(configuredBase || "").trim();
  if (configured) return configured.replace(/\/+$/, "");
  // Vite forwards local requests to Render. This also works in preview and
  // avoids requiring the live API to allow every local hostname/port in CORS.
  const local = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(hostname);
  return local ? "/api" : `${DEFAULT_BACKEND_ORIGIN}/api`;
}
