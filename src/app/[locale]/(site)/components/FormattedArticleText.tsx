"use client";

import React from "react";

interface FormattedArticleTextProps {
  text: string;
  className?: string;
  isRtl?: boolean;
}

/**
 * Parses custom syntax defined from the dashboard:
 * - [badge]word[/badge] -> Distinct syntax badge with primary styling
 * - ==word== -> Same distinct syntax badge
 * - `code` -> Inline monospace code
 * - **bold** -> Bold strong text
 * - *italic* -> Italic em text
 * - [label](url) -> External link
 */
export function renderFormattedContent(text: string): React.ReactNode {
  if (!text) return null;

  const regex =
    /(\[badge\][\s\S]*?\[\/badge\]|==[\s\S]*?==|`[\s\S]*?`|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|\[.*?\]\(.*?\))/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    const key = `fmt-${lastIndex}`;

    // 1. [badge]...[/badge]
    if (token.startsWith("[badge]") && token.endsWith("[/badge]")) {
      const val = token.slice(7, -8);
      elements.push(
        <code
          key={key}
          dir="ltr"
          className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md font-mono text-xs sm:text-sm font-bold bg-primary/10 text-primary border border-primary/25 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/35 shadow-2xs align-baseline select-all"
        >
          {val}
        </code>
      );
    }
    // 2. ==...==
    else if (token.startsWith("==") && token.endsWith("==")) {
      const val = token.slice(2, -2);
      elements.push(
        <code
          key={key}
          dir="ltr"
          className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md font-mono text-xs sm:text-sm font-bold bg-primary/10 text-primary border border-primary/25 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/35 shadow-2xs align-baseline select-all"
        >
          {val}
        </code>
      );
    }
    // 3. `inline code`
    else if (token.startsWith("`") && token.endsWith("`")) {
      const val = token.slice(1, -1);
      elements.push(
        <code
          key={key}
          dir="ltr"
          className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs sm:text-[13px] font-semibold bg-gray-100 dark:bg-gray-800 text-primary dark:text-orange-300 border border-gray-200 dark:border-gray-700/80 align-baseline select-all"
        >
          {val}
        </code>
      );
    }
    // 4. **bold**
    else if (token.startsWith("**") && token.endsWith("**")) {
      const val = token.slice(2, -2);
      elements.push(
        <strong key={key} className="font-bold text-gray-900 dark:text-white">
          {val}
        </strong>
      );
    }
    // 5. *italic*
    else if (token.startsWith("*") && token.endsWith("*")) {
      const val = token.slice(1, -1);
      elements.push(
        <em key={key} className="italic text-gray-800 dark:text-gray-200">
          {val}
        </em>
      );
    }
    // 6. [link](url)
    else {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        elements.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        elements.push(token);
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export default function FormattedArticleText({
  text,
  className = "text-[15px] sm:text-base leading-7 mb-4 whitespace-pre-line text-slate-700 dark:text-slate-300",
}: FormattedArticleTextProps) {
  if (!text) return null;

  return <p className={className}>{renderFormattedContent(text)}</p>;
}
