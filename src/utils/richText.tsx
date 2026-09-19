import type { ReactNode } from "react";
import Link from "@mui/material/Link";

/**
 * Matches markdown-style links: `[label](https://example.com)`.
 * The label may not contain `]`; the URL must be http(s).
 */
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

/**
 * Parse a plain string into React nodes, turning `[label](url)` segments
 * into MUI `<Link>` elements that open in a new tab. Everything else is
 * rendered as plain text — no HTML is ever interpreted, so the output is
 * safe to render as JSX children (no dangerouslySetInnerHTML involved).
 */
export function renderRichText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  MARKDOWN_LINK_RE.lastIndex = 0;

  while ((match = MARKDOWN_LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, url] = match;
    parts.push(
      <Link
        key={`link-${match.index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}
