import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import { parseMarkdown, safeMarkdownLink } from "../lib/markdown.js";
function Inline({ text }) {
  const pattern = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  const children = [];
  let start = 0;
  for (const match of String(text).matchAll(pattern)) {
    children.push(text.slice(start, match.index));
    const key = match.index;
    if (match[1]) children.push(<code key={key}>{match[1]}</code>);
    else if (match[2])
      children.push(
        <strong key={key}>
          <T>{match[2]}</T>
        </strong>,
      );
    else {
      const href = safeMarkdownLink(match[4]);
      children.push(
        href ? (
          <RouteLink
            key={key}
            href={href}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <T>{match[3]}</T>
          </RouteLink>
        ) : (
          match[0]
        ),
      );
    }
    start = match.index + match[0].length;
  }
  children.push(text.slice(start));
  return children;
}
export default function Markdown({ text, parsed }) {
  const { blocks } = parsed || parseMarkdown(text);
  return blocks.map((block, index) => {
    if (block.type === "code")
      return (
        <pre key={index}>
          <code
            className={
              block.language ? `language-${block.language}` : undefined
            }
          >
            {block.text}
          </code>
        </pre>
      );
    if (["ul", "ol"].includes(block.type)) {
      const Tag = block.type;
      return (
        <Tag key={index}>
          <T>
            {block.items.map((item, i) => (
              <li key={i}>
                <Inline text={item} />
              </li>
            ))}
          </T>
        </Tag>
      );
    }
    const Tag = block.type;
    return (
      <Tag id={block.id} key={index}>
        <Inline text={block.text} />
      </Tag>
    );
  });
}
