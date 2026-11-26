"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import katex from "katex";
import "katex/dist/katex.min.css";
import CodeBlockWithPreview from "./CodeBlockWithPreview";
import { renderInlineRichText } from "./ArticleTextRenderer";

const MermaidDiagram = dynamic(
  () => import("./MermaidDiagram"),
  { ssr: false }
);

export interface MarkdownHeading {
  id: string;
  title: string;
  level: number;
}

/**
 * Extracts headings from Markdown content to feed the TableOfContents component
 */
export function extractHeadingsFromMarkdown(content: string): MarkdownHeading[] {
  if (!content) return [];
  const lines = content.split("\n");
  const headings: MarkdownHeading[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawTitle = headingMatch[2].replace(/[*_`]/g, "").trim();
      const slugId =
        rawTitle
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(/\s+/g, "-") || `heading-${headings.length + 1}`;

      headings.push({
        id: slugId,
        title: rawTitle,
        level,
      });
    }
  }

  return headings;
}

interface LectureMarkdownRendererProps {
  content: string;
  isDark?: boolean;
}

/**
 * Parses and renders Markdown content supporting:
 * - Code blocks with copy and Sandpack preview
 * - Mermaid diagrams (```mermaid ... ```)
 * - KaTeX Math equations ($$, \[, \$, \()
 * - Tables, blockquotes, lists, images, headings
 */
export default function LectureMarkdownRenderer({
  content,
  isDark = false,
}: LectureMarkdownRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    const elements: React.ReactNode[] = [];
    const lines = content.split("\n");
    let i = 0;
    let blockIndex = 0;

    const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

    const renderInline = (text: string): React.ReactNode => {
      // 1. Process inline math: $...$ or \(...\)
      const mathParts = text.split(/(\$[^$\n]+\$|\\\([^\)]+\\\))/g);
      return mathParts.map((part, pIdx) => {
        if (
          (part.startsWith("$") && part.endsWith("$") && part.length > 2) ||
          (part.startsWith("\\(") && part.endsWith("\\)"))
        ) {
          const rawMath = part.startsWith("$")
            ? part.slice(1, -1)
            : part.slice(2, -2);
          try {
            const html = katex.renderToString(rawMath, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={pIdx}
                dir="ltr"
                className="inline-block px-1 font-mono text-primary"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={pIdx} className="font-mono">{part}</code>;
          }
        }

        // Inline images: ![alt](url)
        const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          const [full, alt, src] = imgMatch;
          const [before, after] = part.split(full);
          return (
            <React.Fragment key={pIdx}>
              {renderInlineTextFormatting(before)}
              <span className="block my-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <Image
                  src={src}
                  alt={alt || "Lecture image"}
                  width={900}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </span>
              {renderInlineTextFormatting(after)}
            </React.Fragment>
          );
        }

        return renderInlineTextFormatting(part);
      });
    };

    const renderInlineTextFormatting = (text: string): React.ReactNode => {
      return renderInlineRichText(text, isArabic(text));
    };

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        i++;
        continue;
      }

      // 1. Code blocks / Mermaid / Fenced blocks
      if (trimmed.startsWith("```")) {
        const langMatch = trimmed.match(/^```(\w+)?/);
        const language = (langMatch && langMatch[1]) ? langMatch[1].toLowerCase() : "text";
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const codeString = codeLines.join("\n");

        if (language === "mermaid") {
          elements.push(
            <div
              key={`mermaid-${blockIndex++}`}
              className="my-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0a0a0a]/90 backdrop-blur-md p-6 overflow-auto shadow-sm"
              dir="ltr"
            >
              <MermaidDiagram code={codeString} isDark={isDark} />
            </div>
          );
        } else {
          elements.push(
            <div key={`code-${blockIndex++}`} className="my-6" dir="ltr">
              <CodeBlockWithPreview
                code={codeString}
                language={language}
                isDark={isDark}
              />
            </div>
          );
        }
        continue;
      }

      // 2. Display Math: $$ ... $$ or \[ ... \]
      if (trimmed.startsWith("$$") || trimmed.startsWith("\\[")) {
        const isBracket = trimmed.startsWith("\\[");
        const closer = isBracket ? "\\]" : "$$";
        const mathLines: string[] = [];

        // Check if single line
        if (trimmed.length > 2 && trimmed.endsWith(closer) && trimmed !== "$$" && trimmed !== "\\[") {
          const raw = isBracket ? trimmed.slice(2, -2) : trimmed.slice(2, -2);
          mathLines.push(raw);
          i++;
        } else {
          i++;
          while (i < lines.length && !lines[i].trim().includes(closer)) {
            mathLines.push(lines[i]);
            i++;
          }
          if (i < lines.length) {
            const endLine = lines[i].replace(closer, "");
            if (endLine.trim()) mathLines.push(endLine);
            i++;
          }
        }

        const mathFormula = mathLines.join("\n").trim();
        let renderedMath = "";
        try {
          renderedMath = katex.renderToString(mathFormula, {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          renderedMath = `<pre>${mathFormula}</pre>`;
        }

        elements.push(
          <div
            key={`math-${blockIndex++}`}
            dir="ltr"
            className="my-5 sm:my-8 overflow-x-auto scrollbar-none rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/70 dark:bg-gray-900/60 p-3 sm:p-6 text-center shadow-xs text-xs sm:text-base [&_.katex-display]:my-1 [&_.katex]:text-[11px] sm:[&_.katex]:text-base [&_.katex-html]:overflow-hidden"
            dangerouslySetInnerHTML={{ __html: renderedMath }}
          />
        );
        continue;
      }

      // 3. Headings (#, ##, ###, ####)
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const rawTitle = headingMatch[2].replace(/[*_`]/g, "").trim();
        const slugId =
          rawTitle
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]/gu, "")
            .replace(/\s+/g, "-") || `heading-${blockIndex}`;

        const rtl = isArabic(rawTitle);

        if (level === 1) {
          elements.push(
            <h1
              key={`h1-${blockIndex++}`}
              id={slugId}
              dir={rtl ? "rtl" : "ltr"}
              className={`text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mt-12 mb-6 tracking-tight text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 ${
                rtl ? "font-arabic" : ""
              }`}
            >
              {renderInline(headingMatch[2])}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2
              key={`h2-${blockIndex++}`}
              id={slugId}
              dir={rtl ? "rtl" : "ltr"}
              className={`text-xl sm:text-2xl font-heading font-bold mt-10 mb-4 flex items-center gap-3 text-gray-900 dark:text-gray-100 ${
                rtl ? "font-arabic" : ""
              }`}
            >
              <span className="w-1.5 h-6 sm:h-7 bg-primary rounded-full inline-block shrink-0" />
              <span>{renderInline(headingMatch[2])}</span>
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3
              key={`h3-${blockIndex++}`}
              id={slugId}
              dir={rtl ? "rtl" : "ltr"}
              className={`text-lg sm:text-xl font-heading font-semibold mt-8 mb-3 text-gray-800 dark:text-gray-200 ${
                rtl ? "font-arabic" : ""
              }`}
            >
              {renderInline(headingMatch[2])}
            </h3>
          );
        } else {
          elements.push(
            <h4
              key={`h4-${blockIndex++}`}
              id={slugId}
              dir={rtl ? "rtl" : "ltr"}
              className={`text-base sm:text-lg font-heading font-semibold mt-6 mb-2 text-gray-700 dark:text-gray-300 ${
                rtl ? "font-arabic" : ""
              }`}
            >
              {renderInline(headingMatch[2])}
            </h4>
          );
        }
        i++;
        continue;
      }

      // 4. Horizontal Rule
      if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
        elements.push(
          <hr
            key={`hr-${blockIndex++}`}
            className="my-10 border-t border-gray-200 dark:border-gray-800"
          />
        );
        i++;
        continue;
      }

      // 5. Blockquote (> ...)
      if (trimmed.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        const quoteText = quoteLines.join(" ");
        const rtl = isArabic(quoteText);

        elements.push(
          <blockquote
            key={`quote-${blockIndex++}`}
            dir={rtl ? "rtl" : "ltr"}
            className={`my-6 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 p-5 border-s-4 border-primary text-gray-700 dark:text-gray-300 italic shadow-sm text-start ${
              rtl ? "font-arabic" : ""
            }`}
          >
            {renderInline(quoteText)}
          </blockquote>
        );
        continue;
      }

      // 6. Markdown Tables (| ... | ... |)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCols = tableLines[0]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          // line 1 is separator |:---|:---|
          const bodyRows = tableLines.slice(2).map((rowLine) =>
            rowLine
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          const isTableArabic =
            headerCols.some(isArabic) ||
            bodyRows.some((row) => row.some(isArabic));

          elements.push(
            <div key={`table-${blockIndex++}`} dir={isTableArabic ? "rtl" : "ltr"} className="my-6">
              {/* Desktop / Tablet Table View (hidden on mobile, visible on sm:) */}
              <div className="hidden sm:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#0c1424]/70 shadow-xs">
                <table className="w-full text-sm border-collapse text-start">
                  <thead className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 font-bold border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      {headerCols.map((h, hIdx) => (
                        <th key={hIdx} className="px-5 py-3.5 text-xs uppercase tracking-wider font-semibold text-start">
                          {renderInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    {bodyRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-5 py-3.5 whitespace-normal text-start">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View (sm:hidden) */}
              <div className="sm:hidden space-y-3">
                {bodyRows.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 rounded-2xl border border-gray-200/90 dark:border-gray-800/90 bg-white/90 dark:bg-[#0c1424]/90 shadow-xs space-y-2.5 text-xs text-start"
                  >
                    {/* Primary Badge / Header (first column, usually the layer name) */}
                    {row.length > 0 && (
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800/60">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {renderInline(headerCols[0] || "")}
                        </span>
                        <span className="font-heading font-extrabold text-sm text-primary">
                          {renderInline(row[0])}
                        </span>
                      </div>
                    )}

                    {/* Remaining Columns rendered as clean key-value rows */}
                    {row.slice(1).map((cell, cIdx) => {
                      const actualIdx = cIdx + 1;
                      const colHeader = headerCols[actualIdx] || "";
                      return (
                        <div key={actualIdx} className="space-y-1">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">
                            {renderInline(colHeader)}:
                          </span>
                          <div className="text-gray-800 dark:text-gray-200 leading-relaxed ps-1">
                            {renderInline(cell)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
          continue;
        }
      }

      // 7. Lists (- or * or 1.)
      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const isOrdered = /^\d+\.\s+/.test(trimmed);
        const listItems: string[] = [];

        while (
          i < lines.length &&
          (/^[-*]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim()))
        ) {
          listItems.push(lines[i].trim().replace(/^([-*]|\d+\.)\s+/, ""));
          i++;
        }

        const rtl = isArabic(listItems[0] || "");

        if (isOrdered) {
          elements.push(
            <ol
              key={`ol-${blockIndex++}`}
              dir={rtl ? "rtl" : "ltr"}
              className={`my-4 space-y-2 list-decimal ps-6 text-start text-gray-700 dark:text-gray-300 leading-relaxed ${
                rtl ? "font-arabic" : ""
              }`}
            >
              {listItems.map((item, idx) => (
                <li key={idx} className="ps-1">
                  {renderInline(item)}
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul
              key={`ul-${blockIndex++}`}
              dir={rtl ? "rtl" : "ltr"}
              className={`my-4 space-y-2 list-disc ps-6 text-start text-gray-700 dark:text-gray-300 leading-relaxed marker:text-primary ${
                rtl ? "font-arabic" : ""
              }`}
            >
              {listItems.map((item, idx) => (
                <li key={idx} className="ps-1">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        continue;
      }

      // 8. Standard Paragraph
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().startsWith("```") &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith(">") &&
        !lines[i].trim().startsWith("|") &&
        !/^[-*]\s+/.test(lines[i].trim()) &&
        !/^\d+\.\s+/.test(lines[i].trim()) &&
        !lines[i].trim().startsWith("$$") &&
        !lines[i].trim().startsWith("\\[")
      ) {
        paraLines.push(lines[i].trim());
        i++;
      }

      const paraText = paraLines.join(" ");
      const rtl = isArabic(paraText);

      elements.push(
        <p
          key={`p-${blockIndex++}`}
          dir={rtl ? "rtl" : "ltr"}
          className={`my-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 text-start ${
            rtl ? "font-arabic" : "font-sans"
          }`}
        >
          {renderInline(paraText)}
        </p>
      );
    }

    return elements;
  }, [content, isDark]);

  const isOverallArabic = /[\u0600-\u06FF]/.test(content || "");

  return (
    <div
      className={`lecture-markdown-body space-y-2 ${isOverallArabic ? "font-arabic" : ""}`}
      dir={isOverallArabic ? "rtl" : "ltr"}
    >
      {renderedElements}
    </div>
  );
}
