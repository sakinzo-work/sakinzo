export function safeMarkdownLink(value) {
  if (/^https?:\/\/[^\s]+$/i.test(value)) {
    try {
      const url = new URL(value);
      if (!url.username && !url.password) return url.href;
    } catch {}
  }
  if (/^[a-z0-9-]+\.html(?:[?#][a-z0-9_=&%#.-]*)?$/i.test(value)) return value;
  return null;
}
export function parseMarkdown(markdown = "") {
  const blocks = [],
    headings = [],
    used = new Map();
  let paragraph = [],
    list = null,
    code = null,
    language = "";
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const closeList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  const flushCode = () => {
    blocks.push({ type: "code", text: code.join("\n"), language });
    code = null;
  };
  for (const line of String(markdown).replace(/\r\n?/g, "\n").split("\n")) {
    const fence = line.match(/^\s*```([a-z0-9_-]*)\s*$/i);
    if (fence) {
      flushParagraph();
      closeList();
      if (code) flushCode();
      else {
        code = [];
        language = fence[1];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const text = heading[2].replace(/\*\*|`/g, ""),
        level = heading[1].length >= 3 ? 3 : 2;
      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "section";
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);
      const id = `guide-${base}${count > 1 ? "-" + count : ""}`;
      if (level === 2) headings.push({ id, text });
      blocks.push({ type: `h${level}`, text: heading[2], id });
      continue;
    }
    const item = line.match(/^\s*(?:([-*•])|\d+[.)])\s+(.+)$/);
    if (item) {
      flushParagraph();
      const type = item[1] ? "ul" : "ol";
      if (list?.type !== type) {
        closeList();
        list = { type, items: [] };
      }
      list.items.push(item[2]);
      continue;
    }
    closeList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  if (code) flushCode();
  return { blocks, headings };
}
