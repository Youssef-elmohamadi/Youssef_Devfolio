"use client";

import React from "react";

interface ArticleTextRendererProps {
  text: string;
  locale?: string;
  className?: string;
}

/**
 * Parses inline text with support for:
 * 1. Markdown bold (**...**)
 * 2. Markdown italic (*...*)
 * 3. Markdown inline code (`...`)
 * 4. Markdown links ([text](url))
 * 5. Arabic technical prefixes attached to English code terms:
 *    (الـ Delegate, للـ Signature, بالـ EnglishGreeting, etc.)
 * 6. Standalone English programming tokens, keywords, and types in Arabic prose
 *    (Type, Method, void, string, (), C#, etc.)
 */
export function renderInlineRichText(
  text: string,
  isArabic: boolean = true
): React.ReactNode {
  if (!text) return null;

  // If text is not Arabic, only process standard Markdown tokens
  if (!isArabic) {
    const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
    return tokens.map((token, tIdx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={tIdx} className="font-bold text-gray-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("*") && token.endsWith("*") && !token.startsWith("**")) {
        return (
          <em key={tIdx} className="italic text-gray-800 dark:text-gray-200">
            {token.slice(1, -1)}
          </em>
        );
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={tIdx}
            dir="ltr"
            className="px-1.5 py-0.5 rounded font-mono text-sm font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/30"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a
            key={tIdx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return token;
    });
  }

  // Arabic context: intelligently detect programming terms & keywords
  // Regex matches:
  // 1. **bold**
  // 2. *italic*
  // 3. `inline code`
  // 4. [links](url)
  // 5. ()
  // 6. Prefixes (الـ, للـ, بالـ, كالـ, والـ, كـ, لـ, بـ) + English identifier
  // 7. Standalone English identifier / dotted member (e.g. Console.WriteLine, C#, useState)
  const regex =
    /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|\(\)|(?:(?:و?ال|و?لل|و?بال|و?كال|ك|ل|ب)[ـ\-]\s*)?[a-zA-Z][a-zA-Z0-9_#$]*(?:\.[a-zA-Z0-9_#$]+)*)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const full = match[0];
    const key = `inline-${lastIndex}`;

    if (full.startsWith("**") && full.endsWith("**")) {
      elements.push(
        <strong key={key} className="font-bold text-gray-900 dark:text-white">
          {full.slice(2, -2)}
        </strong>
      );
    } else if (full.startsWith("*") && full.endsWith("*") && !full.startsWith("**")) {
      elements.push(
        <em key={key} className="italic text-gray-800 dark:text-gray-200">
          {full.slice(1, -1)}
        </em>
      );
    } else if (full.startsWith("`") && full.endsWith("`")) {
      elements.push(
        <code
          key={key}
          dir="ltr"
          className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs sm:text-[13px] font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/30 align-baseline select-all"
        >
          {full.slice(1, -1)}
        </code>
      );
    } else if (full === "()") {
      elements.push(
        <code
          key={key}
          dir="ltr"
          className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs sm:text-[13px] font-semibold bg-gray-100 dark:bg-gray-800 text-primary dark:text-orange-400 border border-gray-200 dark:border-gray-700 align-baseline select-all"
        >
          ()
        </code>
      );
    } else {
      const linkMatch = full.match(/\[(.*?)\]\((.*?)\)/);
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
        // Check if there is an Arabic prefix attached (e.g. "الـ Delegate" or "للـ Signature")
        const prefixMatch = full.match(
          /^((?:و?ال|و?لل|و?بال|و?كال|ك|ل|ب)[ـ\-]\s*)(.+)$/
        );
        if (prefixMatch) {
          const prefix = prefixMatch[1];
          const term = prefixMatch[2];
          elements.push(
            <React.Fragment key={key}>
              <span>{prefix}</span>
              <code
                dir="ltr"
                className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs sm:text-[13px] font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/30 align-baseline select-all"
              >
                {term}
              </code>
            </React.Fragment>
          );
        } else {
          // Standalone English technical word (e.g. "Method", "Type", "GreetDelegate", "void")
          elements.push(
            <code
              key={key}
              dir="ltr"
              className="inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs sm:text-[13px] font-semibold bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/30 align-baseline select-all"
            >
              {full}
            </code>
          );
        }
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

/**
 * Rich Article Text Renderer
 * Handles multi-line article text blocks with smart detection of:
 * - Code definition terms (e.g. `public:`, `delegate:`, `void:`, `GreetDelegate:`, `string name:`, `Return Type:`)
 * - Arabic note/tip banners (`خد بالك من نقطة مهمة:`, `ملاحظة:`)
 * - Step milestones (`أول حاجة:`, `تاني حاجة:`, `تالت حاجة:`)
 * - Section lead headings ending with a colon `:`
 * - Bullet lists
 * - Normal paragraphs
 */
export default function ArticleTextRenderer({
  text,
  locale = "ar",
  className = "",
}: ArticleTextRendererProps) {
  if (!text) return null;

  const isArabic = locale === "ar" || /[\u0600-\u06FF]/.test(text);
  const lines = text.split(/\r?\n/);

  const renderedBlocks: React.ReactNode[] = [];
  let blockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Skip empty lines (paragraphs are separated naturally)
    if (!trimmed) continue;

    // Handle bullet lists: lines starting with "- " or "* "
    let content = trimmed;
    let isBullet = false;
    const bulletMatch = trimmed.match(/^([-*]|\d+\.)\s+(.*)$/);
    if (bulletMatch) {
      isBullet = true;
      content = bulletMatch[2];
    }

    // 1. Definition code key: starts with English / programming identifier(s) followed by ':'
    // Examples: "public:", "delegate:", "void:", "GreetDelegate:", "string name:", "Return Type:", "Parameters:"
    const codeKeyMatch = content.match(
      /^([a-zA-Z0-9_#<>[\]\.\(\)\s]+):(?:\s+|$)(.*)$/
    );
    if (codeKeyMatch && /[a-zA-Z]/.test(codeKeyMatch[1])) {
      const key = codeKeyMatch[1].trim();
      const val = codeKeyMatch[2].trim();

      renderedBlocks.push(
        <div
          key={`def-${blockIndex++}`}
          className="my-3 flex items-baseline gap-2 flex-wrap text-[15px] sm:text-base leading-relaxed group/item"
        >
          {isBullet && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 self-center me-1" />
          )}
          <span
            dir="ltr"
            className="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs sm:text-sm font-bold bg-primary/10 text-primary border border-primary/25 dark:bg-primary/20 dark:text-orange-400 dark:border-primary/35 shadow-2xs select-all shrink-0 tracking-wide"
          >
            {key}
          </span>
          <span className="text-primary font-bold me-1 shrink-0">:</span>
          <span className="text-slate-700 dark:text-slate-300">
            {renderInlineRichText(val, isArabic)}
          </span>
        </div>
      );
      continue;
    }

    // 2. Arabic warning / note: e.g. "خد بالك من نقطة مهمة:" or "ملاحظة:" or "تنبيه:"
    const noteMatch = content.match(
      /^(خد بالك(?: من نقطة مهمة)?|ملاحظة(?: مهمة)?|تنبيه|ملحوظة|نصيحة):(?:\s+|$)(.*)$/
    );
    if (noteMatch) {
      const noteLabel = noteMatch[1].trim();
      const noteVal = noteMatch[2].trim();

      renderedBlocks.push(
        <div
          key={`note-${blockIndex++}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-s-4 border-amber-500 text-slate-800 dark:text-slate-200 shadow-2xs"
        >
          <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 mb-1.5 text-sm sm:text-base">
            <span className="text-base">💡</span>
            <span>{noteLabel}:</span>
          </div>
          <div className="text-[15px] sm:text-base leading-relaxed">
            {renderInlineRichText(noteVal, isArabic)}
          </div>
        </div>
      );
      continue;
    }

    // 3. Step prefix: e.g. "أول حاجة: ...", "تاني حاجة: ...", "تالت حاجة: ..."
    const stepMatch = content.match(
      /^((?:أول|تاني|تالت|رابع|خامس|سادس)\s+حاجة|\d+\.)\s*:(?:\s+|$)(.*)$/
    );
    if (stepMatch) {
      const stepLabel = stepMatch[1].trim();
      const stepVal = stepMatch[2].trim();

      renderedBlocks.push(
        <div
          key={`step-${blockIndex++}`}
          className="my-4 flex items-start gap-2.5"
        >
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-primary/15 text-primary dark:bg-primary/25 dark:text-orange-400 border border-primary/20 shrink-0 mt-0.5 shadow-2xs">
            {stepLabel}
          </span>
          <div className="font-semibold text-slate-900 dark:text-white leading-relaxed text-[15px] sm:text-base">
            {renderInlineRichText(stepVal, isArabic)}
          </div>
        </div>
      );
      continue;
    }

    // 4. Short lead heading ending with colon: e.g. "تعالوا نفك السطر ده واحدة واحدة:" or "3. استدعينا الـ Delegate:"
    if (content.endsWith(":") && content.length < 90) {
      renderedBlocks.push(
        <h3
          key={`lead-${blockIndex++}`}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-6 mb-2 flex items-center gap-2.5"
        >
          <span className="w-1.5 h-4 sm:h-5 bg-primary rounded-full inline-block shrink-0" />
          <span>{renderInlineRichText(content, isArabic)}</span>
        </h3>
      );
      continue;
    }

    // 5. Standard paragraph line
    renderedBlocks.push(
      <p
        key={`p-${blockIndex++}`}
        className="my-2.5 text-[15px] sm:text-base leading-7 text-slate-700 dark:text-slate-300"
      >
        {isBullet && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary me-2 align-middle" />
        )}
        {renderInlineRichText(content, isArabic)}
      </p>
    );
  }

  return (
    <div
      className={`space-y-1 text-start ${isArabic ? "font-arabic" : "font-sans"} ${className}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {renderedBlocks}
    </div>
  );
}
