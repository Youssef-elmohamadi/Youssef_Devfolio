"use client";

/**
 * LivePreview.tsx
 *
 * Lazy-loaded, intersection-observed Sandpack preview panel.
 * Dynamically imports Sandpack only when this component is visible in the
 * viewport to preserve Lighthouse performance scores.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import SandpackSkeleton from "./SandpackSkeleton";
import { prepareSandpackCode } from "@/utils/sandpack-utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LivePreviewProps {
  /** Raw source code to render in Sandpack */
  code: string;
  /** Current theme from the blog's ThemeContext */
  isDark: boolean;
}

// ---------------------------------------------------------------------------
// Dynamic Sandpack import — SSR disabled, skeleton as fallback
// ---------------------------------------------------------------------------

const SandpackLazy = dynamic(
  () => import("./SandpackContainer"),
  {
    ssr: false,
    loading: () => <SandpackSkeleton />,
  }
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LivePreview({ code, isDark }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEverBeenVisible, setHasEverBeenVisible] = useState(false);

  // Intersection Observer — only initialize Sandpack once the section is in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasEverBeenVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const files = prepareSandpackCode(code);

  return (
    <div ref={containerRef} className="mt-1">
      {/* Only mount Sandpack once it has been visible (keep mounted after first reveal) */}
      {hasEverBeenVisible ? (
        <SandpackLazy files={files} isDark={isDark} />
      ) : (
        <SandpackSkeleton isDark={isDark} />
      )}
    </div>
  );
}
