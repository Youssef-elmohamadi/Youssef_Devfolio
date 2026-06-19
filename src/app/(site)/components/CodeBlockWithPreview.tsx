"use client";

/**
 * CodeBlockWithPreview.tsx
 *
 * Drop-in replacement for the raw code block rendering in SingleBlogClient.
 * - Always renders the existing syntax-highlighted code block (unchanged behaviour)
 * - Always renders the existing CodeCopyButton
 * - If the code is detected as runnable, renders a "Live Preview" toggle below
 * - Expand/collapse is animated via framer-motion
 * - Sandpack is lazy-loaded only when the preview section is expanded
 */

import { useState, useId } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { AnimatePresence, motion } from "framer-motion";
import { isRunnableExample } from "@/utils/sandpack-utils";
import CodeCopyButton from "./CodeCopyButton";
import LivePreview from "./LivePreview";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CodeBlockWithPreviewProps {
  code: string;
  language?: string;
  isDark: boolean;
}

// ---------------------------------------------------------------------------
// Badge component
// ---------------------------------------------------------------------------

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-pulse" />
      Runnable
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CodeBlockWithPreview({
  code,
  language = "javascript",
  isDark,
}: CodeBlockWithPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();

  const runnable = isRunnableExample(code);
  const displayLanguage =
    runnable && language === "javascript" ? "React / JSX" : language;

  return (
    <div className="relative my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
      {/* ── Code block header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-[#1f2129] border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-semibold capitalize">
            {displayLanguage}
          </span>
          {runnable && <LiveBadge />}
        </div>

        {/* macOS traffic-light dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
      </div>

      {/* ── Syntax-highlighted code ─────────────────────────────────────────── */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={isDark ? dracula : oneLight}
          customStyle={{ margin: 0, padding: "1.5rem" }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>

        {/* Existing copy button — always present */}
        <CodeCopyButton code={code} />
      </div>

      {/* ── Live Preview section (runnable examples only) ───────────────────── */}
      {runnable && (
        <div
          className={`
            border-t
            ${isDark ? "border-gray-800/60 bg-gray-900/40" : "border-gray-200/60 bg-gray-50/50"}
          `}
        >
          {/* Toggle button */}
          <button
            id={`toggle-${panelId}`}
            aria-expanded={isExpanded}
            aria-controls={`panel-${panelId}`}
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`
              w-full flex items-center justify-between px-4 py-3
              text-sm font-medium transition-colors duration-200 group
              ${
                isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            {/* Left — label */}
            <div className="flex items-center gap-2.5">
              {/* Play / chevron icon */}
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full
                  transition-all duration-300
                  ${
                    isDark
                      ? "bg-[#ff6a00]/15 text-[#ff6a00]"
                      : "bg-[#ff6a00]/10 text-[#ff6a00]"
                  }
                `}
                aria-hidden="true"
              >
                <motion.svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-2.5 h-2.5"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M3 3.5A.5.5 0 0 1 3.5 3l9 4.5a.5.5 0 0 1 0 .894l-9 4.5A.5.5 0 0 1 3 12.5v-9Z" />
                </motion.svg>
              </span>

              <span>Live Preview</span>

              <span
                className={`
                  text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded
                  font-semibold
                  ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                Interactive
              </span>
            </div>

            {/* Right — expand hint */}
            <span
              className={`
                text-xs transition-colors
                ${isDark ? "text-gray-600 group-hover:text-gray-400" : "text-gray-400 group-hover:text-gray-600"}
              `}
            >
              {isExpanded ? "Collapse ↑" : "Expand ↓"}
            </span>
          </button>

          {/* Animated preview panel */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={`panel-${panelId}`}
                role="region"
                aria-labelledby={`toggle-${panelId}`}
                key="preview-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-4 pb-4 pt-1">
                  {/* Live Preview header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-gray-800/60" : "bg-gray-200/80"}`}
                    />
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Rendered Output
                    </span>
                    <div
                      className={`h-px flex-1 ${isDark ? "bg-gray-800/60" : "bg-gray-200/80"}`}
                    />
                  </div>

                  {/* Lazy-loaded Sandpack */}
                  <LivePreview code={code} isDark={isDark} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
