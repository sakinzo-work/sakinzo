import assert from "node:assert/strict";
import { test } from "node:test";
import http from "node:http";
import { createServer } from "vite";
import { DEFAULT_BACKEND_ORIGIN, resolveApiBase } from "../src/lib/backend.js";
import viteConfig from "../vite.config.js";

test("local React uses the proxy; hosted React keeps the original Render API", () => {
  for (const hostname of ["localhost", "127.0.0.1", "[::1]"])
    assert.equal(resolveApiBase("", hostname), "/api");
  assert.equal(
    resolveApiBase("", "sakinzo-work.github.io"),
    "https://sakinzo.onrender.com/api",
  );
  assert.equal(DEFAULT_BACKEND_ORIGIN, "https://sakinzo.onrender.com");
  assert.equal(
    resolveApiBase("https://custom.example/api/", "localhost"),
    "https://custom.example/api",
  );
});

test("dev proxy forwards content, uploads and login with Render's restricted CORS", async () => {
  const requests = [];
  const backend = http.createServer((request, response) => {
    requests.push({ path: request.url, origin: request.headers.origin });
    if (request.headers.origin) {
      response.writeHead(500).end("Origin is not allowed");
      return;
    }
    if (request.url === "/uploads/existing-image.png") {
      response.writeHead(200, { "Content-Type": "image/png" }).end("image-bytes");
      return;
    }
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        projects: [{ _id: "existing-project", title: "Existing data" }],
        method: request.method,
        body: body ? JSON.parse(body) : null,
      }));
    });
  });
  await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
  let vite;
  try {
    const config = viteConfig({ mode: "test" });
    const target = `http://127.0.0.1:${backend.address().port}`;
    for (const proxy of Object.values(config.server.proxy)) proxy.target = target;
    vite = await createServer({
      ...config,
      configFile: false,
      server: { ...config.server, port: 0, strictPort: false, watch: null },
    });
    await vite.listen();
    const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
    const response = await fetch(`${origin}/api/public/site-data`, {
      headers: { Origin: origin },
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).projects[0]._id, "existing-project");
    const image = await fetch(`${origin}/uploads/existing-image.png`);
    assert.equal(await image.text(), "image-bytes");
    // This POST reaches only the isolated mock, never the live API.
    const login = await fetch(`${origin}/api/auth/login`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "fixture@example.test", password: "fixture" }),
    });
    assert.deepEqual((await login.json()).body, {
      email: "fixture@example.test", password: "fixture",
    });
    assert.deepEqual(requests.map((request) => request.path), [
      "/api/public/site-data", "/uploads/existing-image.png", "/api/auth/login",
    ]);
    assert.ok(requests.every((request) => request.origin === undefined));
  } finally {
    if (vite) await vite.close();
    backend.closeAllConnections();
    await new Promise((resolve) => backend.close(resolve));
  }
});
