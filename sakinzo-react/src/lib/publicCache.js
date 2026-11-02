import { apiBase } from "./api.js";

const memory = new Map();
const keyFor = endpoint => /^\/blogs$|^\/projects\/[^/?]+$/.test(endpoint || "")
  ? `sakinzo-public-v1:${apiBase()}:${endpoint}` : null;
function valid(endpoint, data) {
  return endpoint === "/blogs" ? Array.isArray(data) && data.every(row => row && typeof row === "object")
    : data && typeof data === "object" && !Array.isArray(data) && typeof data._id === "string";
}
export function readPublicCache(endpoint) {
  const key = keyFor(endpoint);
  if (!key) return null;
  try {
    const entry = memory.get(key) || JSON.parse(localStorage.getItem(key) || "null");
    if (entry && Date.now() - entry.savedAt < 86400000 && valid(endpoint, entry.data)) return entry.data;
  } catch {}
  return null;
}
export function savePublicCache(endpoint, data) {
  const key = keyFor(endpoint);
  if (!key || !valid(endpoint, data)) return;
  const entry = { data, savedAt: Date.now() };
  memory.set(key, entry);
  try { localStorage.setItem(key, JSON.stringify(entry)); } catch {}
}
export function clearPublicCache(endpoint) {
  const key = keyFor(endpoint);
  if (!key) return;
  memory.delete(key);
  try { localStorage.removeItem(key); } catch {}
}
