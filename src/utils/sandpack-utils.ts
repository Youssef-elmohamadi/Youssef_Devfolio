/**
 * sandpack-utils.ts
 *
 * Heuristic detection for runnable React/JSX code blocks.
 * Used to decide whether to render a Live Preview section below a code snippet.
 */

/** Minimum number of lines a code block must have to qualify for a live preview. */
const MIN_RUNNABLE_LINES = 5;

/**
 * Patterns that strongly signal the code is a renderable React component or
 * a self-contained runnable JS example.
 */
const RUNNABLE_PATTERNS: RegExp[] = [
  /import\s+React/,                          // import React from "react"
  /import\s*\{[^}]*useState[^}]*\}/,         // import { useState }
  /import\s*\{[^}]*useEffect[^}]*\}/,        // import { useEffect }
  /import\s*\{[^}]*useCallback[^}]*\}/,      // import { useCallback }
  /import\s*\{[^}]*useTransition[^}]*\}/,    // import { useTransition }
  /export\s+default\s+(function|class|App|const)/,  // export default ...
  /return\s*\(\s*[\n\r]*\s*[<(]/,            // return ( <JSX>
  /<[A-Z][A-Za-z]*/,                         // JSX component tag e.g. <MyComponent
  /ReactDOM\.render/,                         // ReactDOM.render
  /createRoot/,                               // ReactDOM.createRoot
];

/**
 * Patterns that indicate the code is definitely NOT runnable as-is
 * (e.g. it's a diff, a config snippet, bash, or a pure output block).
 */
const NON_RUNNABLE_PATTERNS: RegExp[] = [
  /^\s*\/\/\s*\d+\s*$/m,  // output-only lines like "//3"
  /^\s*#\s/m,              // shell comments
  /^\s*\$\s/m,             // shell commands
];

/**
 * Returns `true` if the code is a self-contained, runnable React/JSX example
 * that can be rendered inside Sandpack.
 */
export function isRunnableExample(code: string): boolean {
  if (!code || typeof code !== "string") return false;

  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < MIN_RUNNABLE_LINES) return false;

  // Bail out early for known non-runnable patterns
  const isDefinitelyNotRunnable = NON_RUNNABLE_PATTERNS.some((pattern) =>
    pattern.test(code)
  );
  if (isDefinitelyNotRunnable) return false;

  // Must match at least one runnable pattern
  return RUNNABLE_PATTERNS.some((pattern) => pattern.test(code));
}

/**
 * Wraps raw code so it can run in a Sandpack React template.
 *
 * If the code already has `export default`, it's used as the entry component.
 * Otherwise, we try to auto-wrap it in an App component.
 */
export function prepareSandpackCode(code: string): Record<string, string> {
  const hasExportDefault = /export\s+default/.test(code);

  if (hasExportDefault) {
    return {
      "/App.js": code,
    };
  }

  // Wrap in a simple App shell
  const wrapped = `import React from "react";\n\n${code}\n\nexport default App;`;
  return {
    "/App.js": wrapped,
  };
}
