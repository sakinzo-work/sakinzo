import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = (await fs.readdir(path.join(root, "dist/assets")))
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => "./assets/" + file);
const version = crypto
  .createHash("sha256")
  .update(assets.join("\n"))
  .digest("hex")
  .slice(0, 12);
const file = path.join(root, "dist/admin-sw.js");
const source = await fs.readFile(file, "utf8");
await fs.writeFile(
  file,
  source
    .replace("__REACT_BUILD_ASSETS__", JSON.stringify(assets))
    .replace("__REACT_BUILD_VERSION__", version),
);
console.log("Admin offline shell includes the versioned React bundles.");
