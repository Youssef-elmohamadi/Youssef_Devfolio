"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DeveloperGrid() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[-2]"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px),
          linear-gradient(to bottom, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  );
}
