"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
  isDark?: boolean;
}

export default function MermaidDiagram({
  code,
  isDark = false,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code?.trim() || !containerRef.current) return;

    let cancelled = false;

    const render = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "Inter, sans-serif",
          themeVariables: isDark
            ? {
                primaryColor: "#ff6a00",
                primaryTextColor: "#ffffff",
                primaryBorderColor: "#ff6a00",
                lineColor: "#888888",
                sectionBkgColor: "#1a1a1a",
                altSectionBkgColor: "#0d0d0d",
                gridColor: "#333333",
                background: "#0a0a0a",
                mainBkg: "#1a1a1a",
                nodeBorder: "#ff6a00",
                clusterBkg: "#1a1a1a",
                titleColor: "#ffffff",
                edgeLabelBackground: "#1a1a1a",
              }
            : {
                primaryColor: "#ff6a00",
                primaryTextColor: "#1a1a1a",
                primaryBorderColor: "#ff6a00",
                lineColor: "#666666",
              },
        });

        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        let cleanCode = code.trim();
        
        // Extract custom width if specified via comment: %% width: 500px %% or %% width: 80% %%
        let customWidth = "100%";
        const widthMatch = cleanCode.match(/%%\s*width:\s*([a-zA-Z0-9%]+)\s*%%/);
        if (widthMatch && widthMatch[1]) {
          customWidth = widthMatch[1];
        }

        if (cleanCode.startsWith('```mermaid')) {
          cleanCode = cleanCode.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '');
        } else if (cleanCode.startsWith('```')) {
          cleanCode = cleanCode.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
        }
        const { svg } = await mermaid.render(uniqueId, cleanCode.trim());

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive and apply custom width
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.width = customWidth;
            svgEl.style.height = "auto";
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to render diagram");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [code, isDark]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-mono">
        <strong>Diagram Error:</strong>
        <pre className="mt-1 text-xs whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-[#ff6a00] border-t-transparent rounded-full"></span>
          Rendering diagram...
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex justify-center items-center overflow-auto p-4 ${isLoading ? "hidden" : ""}`}
      />
    </div>
  );
}
