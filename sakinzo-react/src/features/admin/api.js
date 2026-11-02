import { apiBase } from "../../lib/api.js";
export async function adminRequest(path, token, options = {}) {
  const { signal, timeoutMs = options.body instanceof FormData ? 120000 : 30000, ...requestOptions } = options;
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  const multipart = requestOptions.body instanceof FormData;
  try {
  const response = await fetch(`${apiBase()}${path}`, {
    cache: "no-store",
    ...requestOptions,
    signal: controller.signal,
    headers: {
      ...(multipart ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(error => {
    if (controller.signal.aborted) throw error;
    return {};
  });
  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
  } catch (error) {
    if (timedOut) throw new Error("The admin server is taking too long to respond. Please try again.");
    if (error instanceof TypeError) throw new Error("Couldn't reach the admin server. Check your connection and try again.");
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
export function validateVideo(file) {
  if (!file) return;
  if (!["video/mp4", "video/webm", "video/ogg"].includes(file.type))
    throw new Error("Choose an MP4, WebM or Ogg video.");
  if (file.size > 50 * 1024 * 1024)
    throw new Error("Video must be 50 MB or smaller.");
}
async function optimizeImage(file) {
  if (
    !file ||
    !file.type.startsWith("image/") ||
    /svg|gif/i.test(file.type) ||
    file.size <= 900 * 1024
  )
    return file;
  const bitmap = await createImageBitmap(file),
    scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(
    Math.max(1, Math.round(bitmap.width * scale)),
    Math.max(1, Math.round(bitmap.height * scale)),
  );
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.82,
  });
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
export async function uploadMedia(file, token, video = false) {
  if (video) validateVideo(file);
  const prepared = video ? file : await optimizeImage(file);
  const data = new FormData();
  data.append("file", prepared, prepared.name || file.name);
  const result = await adminRequest(
    video ? "/upload/videos" : "/upload",
    token,
    { method: "POST", body: data },
  );
  if (!result.url) throw new Error("The upload did not return a file URL.");
  if (!video || /^(?:https?:|data:)/.test(result.url)) return result.url;
  const base = new URL(apiBase(), window.location.origin);
  return new URL(result.url, base.origin).href;
}
