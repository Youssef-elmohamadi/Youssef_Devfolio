import React from "react";

export interface ArticleEndSentinelProps {
  id?: string;
  className?: string;
}

export default function ArticleEndSentinel({
  id = "article-end",
  className = "",
}: ArticleEndSentinelProps) {
  return (
    <div
      id={id}
      aria-hidden="true"
      className={`w-full h-px pointer-events-none opacity-0 ${className}`}
    />
  );
}
