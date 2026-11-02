import { mediaUrl, safeUrl } from "./api.js";

export const previewDevices = ["phone", "tablet", "desktop"];
export const projectCategories = ["IoT", "Web Development", "Android App", "iOS App", "AI / ML", "Desktop App", "Blockchain", "Game Development", "Other"];
export function cleanList(value) {
  return (Array.isArray(value) ? value : [value])
    .flatMap((item) => {
      const text = String(item || "").trim();
      if (!text) return [];
      if (text.startsWith("/uploads/") || text.startsWith("data:image/"))
        return [text];
      const urls = [...text.matchAll(/https?:\/\/[^\s,'"<>()[\]]+/g)].map(
        (match) => match[0].replace(/[.,;]+$/g, ""),
      );
      return urls.length
        ? urls
        : text
            .split(/[\n,]+/)
            .map((part) => part.trim())
            .filter(Boolean);
    })
    .filter((item, index, list) => list.indexOf(item) === index);
}
export const projectImages = (project) =>
  [...cleanList(project.img), ...cleanList(project.images)].filter(
    (item, index, all) => all.indexOf(item) === index,
  );
export function projectPreviewDevice(project) {
  if (previewDevices.includes(project.previewDevice))
    return project.previewDevice;
  return /android|\bios\b|mobile|\bapp development\b/i.test(
    project.category || "",
  )
    ? "phone"
    : "desktop";
}
export function nativeAppLink(value) {
  const url = new URL(value);
  return (
    url.hostname === "apps.apple.com" ||
    (url.hostname === "play.google.com" &&
      url.pathname.startsWith("/store/")) ||
    /\.(apk|aab|ipa)$/i.test(url.pathname)
  );
}
export function videoSource(value) {
  const url = safeUrl(mediaUrl(value || ""));
  if (!url) return null;
  const parsed = new URL(url);
  let id;
  if (
    [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ].includes(parsed.hostname)
  )
    id =
      parsed.searchParams.get("v") ||
      parsed.pathname.split("/").filter(Boolean).pop();
  else if (parsed.hostname === "youtu.be")
    id = parsed.pathname.split("/").filter(Boolean)[0];
  if (id)
    return {
      type: "embed",
      url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`,
    };
  if (
    ["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(parsed.hostname)
  ) {
    id = parsed.pathname.split("/").filter(Boolean).pop();
    if (/^\d+$/.test(id || ""))
      return { type: "embed", url: `https://player.vimeo.com/video/${id}` };
  }
  return { type: "video", url };
}
