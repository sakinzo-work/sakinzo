const opaqueSlug = (value) => /^(?:\d+|[a-f\d]{24})$/i.test(String(value || ""));

export function slugifyContent(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function baseSlug(row, kind) {
  const preferred = kind === "blog" ? row?.slug : "";
  const source = preferred && !opaqueSlug(preferred) ? preferred : row?.title || row?.name;
  return slugifyContent(source) || kind;
}

export function contentSlug(row, rows = [], kind = "project") {
  const base = baseSlug(row, kind);
  const duplicates = rows.filter(
    (other) =>
      other &&
      String(other._id || "") !== String(row?._id || "") &&
      baseSlug(other, kind) === base,
  );
  if (!duplicates.length) return base;
  const suffix = String(row?._id || "").replace(/[^a-z\d]/gi, "").slice(-6);
  return `${base}-${suffix || "item"}`;
}

export function contentPath(kind, row, rows = []) {
  const route = kind === "blog" ? "blog" : "projects";
  return `/${route}/${encodeURIComponent(contentSlug(row, rows, kind))}`;
}
