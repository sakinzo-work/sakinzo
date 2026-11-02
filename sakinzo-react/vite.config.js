import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { DEFAULT_BACKEND_ORIGIN } from "./src/lib/backend.js";
import pageStyleBundles from "./scripts/page-style-bundles.mjs";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN;
  const forward = () => ({
    target,
    changeOrigin: true,
    configure(proxy) {
      // The browser talks to Vite on the same origin; the upstream request is
      // server-to-server. Render's CORS list does not include 127.0.0.1:3000.
      proxy.on("proxyReq", (request) => request.removeHeader("origin"));
    },
  });
  const proxy = {
    "/api": forward(),
    "/uploads": forward(),
  };
  return {
    plugins: [react(), pageStyleBundles()],
    base: env.VITE_BASE_PATH || "/",
    server: { host: "127.0.0.1", port: 3000, strictPort: true, proxy },
    preview: { host: "127.0.0.1", port: 4173, strictPort: true, proxy },
  };
});
