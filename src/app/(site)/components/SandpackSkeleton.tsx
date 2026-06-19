"use client";

/**
 * SandpackSkeleton.tsx
 *
 * Placeholder skeleton displayed while the Sandpack bundle loads.
 * Matches the blog's dark/light code block styling exactly.
 */

interface SandpackSkeletonProps {
  isDark?: boolean;
}

export default function SandpackSkeleton({ isDark }: SandpackSkeletonProps) {
  return (
    <div
      className={`
        mt-3 rounded-xl overflow-hidden border
        ${isDark ? "border-gray-700 bg-[#111]" : "border-gray-200 bg-gray-50"}
      `}
      role="status"
      aria-label="Loading live preview…"
    >
      {/* Header bar skeleton */}
      <div
        className={`
          flex items-center justify-between px-4 py-2.5 border-b
          ${isDark ? "bg-[#1f2129] border-gray-800" : "bg-gray-100 border-gray-200"}
        `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}
          />
          <div
            className={`h-3 w-20 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}
          />
        </div>
        <div
          className={`h-3 w-16 rounded ${isDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}
        />
      </div>

      {/* Single-panel layout skeleton: preview only */}
      <div className="flex min-h-[350px]">
        {/* Preview panel */}
        <div
          className={`flex-1 flex items-center justify-center ${isDark ? "bg-transparent" : "bg-transparent"}`}
        >
          <div className="flex flex-col items-center gap-3 opacity-40">
            <svg
              className={`w-10 h-10 animate-pulse ${isDark ? "text-gray-600" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Loading preview…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
