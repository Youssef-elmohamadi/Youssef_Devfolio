"use client";

/**
 * SandpackContainer.tsx
 *
 * Renders the Sandpack editor + preview panel.
 * This file is the ONLY one that imports from @codesandbox/sandpack-react,
 * keeping it safely isolated from SSR via dynamic import in LivePreview.tsx.
 */

import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackTheme,
} from "@codesandbox/sandpack-react";

// ---------------------------------------------------------------------------
// Blog-aligned custom Sandpack themes
// ---------------------------------------------------------------------------

const darkTheme: SandpackTheme = {
  colors: {
    surface1: "transparent",      // transparent to blend with wrapper
    surface2: "transparent",      // transparent to blend with wrapper
    surface3: "#374151",          // selected line highlight
    clickable: "#9ca3af",         // muted interactive elements (gray-400)
    base: "#e5e7eb",              // primary text (gray-200)
    disabled: "#4b5563",          // disabled text (gray-600)
    hover: "#374151",             // hover bg (gray-700)
    accent: "#ff6a00",            // primary brand color
    error: "#f87171",             // red-400
    errorSurface: "#1f1212",      // error bg
    warning: "#fbbf24",           // amber-400
    warningSurface: "#1f1c0e",    // warning bg
  },
  syntax: {
    plain: "#e5e7eb",
    comment: { color: "#6b7280", fontStyle: "italic" },
    keyword: "#c084fc",           // purple-400
    tag: "#60a5fa",               // blue-400
    punctuation: "#9ca3af",
    definition: "#34d399",        // emerald-400
    property: "#f97316",          // orange-500
    static: "#f59e0b",            // amber-500
    string: "#86efac",            // green-300
  },
  font: {
    body: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    size: "13.5px",
    lineHeight: "1.75",
  },
};

const lightTheme: SandpackTheme = {
  colors: {
    surface1: "transparent",      // matches wrapper
    surface2: "transparent",      // matches wrapper
    surface3: "#f3f4f6",          // gray-100 selected highlight
    clickable: "#6b7280",         // gray-500
    base: "#111827",              // gray-900
    disabled: "#9ca3af",
    hover: "#f9fafb",             // gray-50
    accent: "#ff6a00",            // primary
    error: "#ef4444",
    errorSurface: "#fef2f2",
    warning: "#f59e0b",
    warningSurface: "#fffbeb",
  },
  syntax: {
    plain: "#111827",
    comment: { color: "#9ca3af", fontStyle: "italic" },
    keyword: "#7c3aed",           // violet-700
    tag: "#2563eb",               // blue-600
    punctuation: "#6b7280",
    definition: "#059669",        // emerald-600
    property: "#ea580c",          // orange-600
    static: "#d97706",            // amber-600
    string: "#16a34a",            // green-600
  },
  font: {
    body: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    size: "13.5px",
    lineHeight: "1.75",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SandpackContainerProps {
  /** Files map: { "/App.js": "code..." } */
  files: Record<string, string>;
  isDark: boolean;
}

export default function SandpackContainer({ files, isDark }: SandpackContainerProps) {
  return (
    <SandpackProvider
      template="react"
      files={files}
      theme={isDark ? darkTheme : lightTheme}
      options={{
        externalResources: [
          "https://cdn.tailwindcss.com",  // allow Tailwind classes in previewed code
        ],
        recompileMode: "delayed",
        recompileDelay: 500,
      }}
    >
      <SandpackLayout
        style={{
          borderRadius: "0.5rem",
          border: isDark ? "1px solid rgba(55, 65, 81, 0.5)" : "1px solid rgba(229, 231, 235, 0.5)",
          background: "transparent",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        <SandpackPreview
          showNavigator={false}
          showOpenInCodeSandbox={false}
          showRefreshButton={true}
          style={{ minHeight: "350px", border: "none", background: "transparent" }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
