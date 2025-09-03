// "use client";
// import React, { useEffect, useRef } from "react";
// import katex from "katex";
// import rough from "roughjs/bin/rough";
// import "katex/dist/katex.min.css";

// interface ThemeConfig {
//   background: string;
//   textColor: string;
//   shapeStroke: string;
//   shapeFill: string;
// }

// interface HandDrawnMathBackgroundProps {
//   equations?: string[];
//   csItems?: string[];
//   density?: number;
// }

// const HandDrawnMathBackground: React.FC<HandDrawnMathBackgroundProps> = ({
//   equations = [
//     "E = mc^2",
//     "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
//     "a^2 + b^2 = c^2",
//     "\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}",
//   ],
//   csItems = [
//     "for (int i=0; i<n; i++)",
//     "if (x > y) { ... }",
//     "O(n log n)",
//     "while(true) {}",
//     "∑ f(n)",
//     "λx.x+1",
//   ],
//   density = 8,
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const loadedImagesRef = useRef<
//     Map<string, { img: HTMLImageElement; url: string }>
//   >(new Map());

//   const themeConfig: Record<string, ThemeConfig> = {
//     light: {
//       background: "#ffffff",
//       textColor: "gray-600 ",
//       shapeStroke: "rgba(100, 100, 100, 0.5)",
//       shapeFill: "rgba(200, 200, 200, 0.2)",
//     },
//     dark: {
//       background: "#1a202c",
//       textColor: "#e2e8f0",
//       shapeStroke: "rgba(150, 150, 200, 0.5)",
//       shapeFill: "rgba(50, 50, 75, 0.2)",
//     },
//   };

//   const getTheme = () =>
//     document.documentElement.classList.contains("dark") ? "dark" : "light";

//   useEffect(() => {
//     if (!document.querySelector('link[href*="Architects+Daughter"]')) {
//       const link = document.createElement("link");
//       link.href =
//         "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap";
//       link.rel = "stylesheet";
//       document.head.appendChild(link);
//     }

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const rc = rough.canvas(canvas);

//     const generatePlacements = () => {
//       const placements: Array<{
//         key: string;
//         scale: number;
//         relX: number;
//         relY: number;
//         shape: string;
//         rotation: number;
//       }> = [];
//       const shapes = ["rectangle", "circle", "underline", "bracket", "none"];
//       const allItems = [
//         ...equations.map((e) => ({ content: e, type: "math" as const })),
//         ...csItems.map((c) => ({ content: c, type: "cs" as const })),
//       ];

//       for (let i = 0; i < density * 2; i++) {
//         const item = allItems[i % allItems.length];
//         const key = `${item.type}:${item.content}`;
//         const scale = 0.7 + Math.random() * 0.2;
//         const relX = Math.random();
//         const relY = Math.random();
//         const shape = shapes[Math.floor(Math.random() * shapes.length)];
//         const rotation = Math.random() * 20 - 10;
//         placements.push({ key, scale, relX, relY, shape, rotation });
//       }
//       return placements;
//     };

//     const loadImages = async (currentTheme: string) => {
//       const hiddenDiv = document.createElement("div");
//       hiddenDiv.style.position = "absolute";
//       hiddenDiv.style.left = "-9999px";
//       hiddenDiv.style.top = "0";
//       hiddenDiv.style.visibility = "hidden";
//       hiddenDiv.style.color = themeConfig[currentTheme].textColor;
//       hiddenDiv.style.background = themeConfig[currentTheme].background;
//       document.body.appendChild(hiddenDiv);

//       const katexSheet = Array.from(document.styleSheets).find(
//         (sheet) => sheet.href && sheet.href.includes("katex.min.css")
//       );
//       const katexCss = katexSheet
//         ? Array.from(katexSheet.cssRules)
//             .map((rule) => rule.cssText)
//             .join("\n")
//         : "";

//       const uniqueItems = new Map<
//         string,
//         { content: string; type: "math" | "cs" }
//       >();
//       equations.forEach((e) =>
//         uniqueItems.set(`math:${e}`, { content: e, type: "math" })
//       );
//       csItems.forEach((c) =>
//         uniqueItems.set(`cs:${c}`, { content: c, type: "cs" })
//       );

//       const loadPromises: Promise<void>[] = [];
//       const tempMap = new Map<string, { img: HTMLImageElement; url: string }>();

//       for (const [key, { content, type }] of uniqueItems) {
//         if (type === "math") {
//           katex.render(content, hiddenDiv, {
//             throwOnError: false,
//             displayMode: true,
//           });
//         } else {
//           hiddenDiv.innerHTML = `<span style="font-family: 'Architects+Daughter', cursive; font-size: 24px; color: ${
//             themeConfig[currentTheme].textColor
//           };">${content
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")}</span>`;
//         }

//         const rect = hiddenDiv.getBoundingClientRect();
//         const w = Math.ceil(rect.width);
//         const h = Math.ceil(rect.height);
//         const html = hiddenDiv.innerHTML;
//         const css = type === "math" ? katexCss : "";

//         const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
//           <style><![CDATA[${css}]]></style>
//           <foreignObject x="0" y="0" width="${w}" height="${h}">
//             <div xmlns="http://www.w3.org/1999/xhtml">${html}</div>
//           </foreignObject>
//         </svg>`;

//         const blob = new Blob([svgData], {
//           type: "image/svg+xml;charset=utf-8",
//         });
//         const url = URL.createObjectURL(blob);

//         const img = new Image();
//         const loadPromise = new Promise<void>((resolve) => {
//           img.onload = () => {
//             tempMap.set(key, { img, url });
//             resolve();
//           };
//           img.onerror = () => resolve();
//         });
//         img.src = url;
//         loadPromises.push(loadPromise);
//       }

//       await Promise.all(loadPromises);

//       document.body.removeChild(hiddenDiv);
//       return tempMap;
//     };

//     let currentTheme = getTheme();
//     const setup = async () => {
//       const images = await loadImages(currentTheme);
//       loadedImagesRef.current = images;
//       resize();
//     };

//     setup();

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       const newTheme = getTheme();
//       if (newTheme !== currentTheme) {
//         currentTheme = newTheme;
//         loadImages(currentTheme).then((newImages) => {
//           loadedImagesRef.current = newImages;
//           draw();
//         });
//       } else {
//         draw();
//       }
//     };

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       if (loadedImagesRef.current.size === 0) return;

//       const currentConfig = themeConfig[currentTheme];
//       canvas.style.background = currentConfig.background;
//       ctx.fillStyle = currentConfig.background;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       const placements = generatePlacements();

//       placements.forEach(({ key, scale, relX, relY, shape, rotation }) => {
//         const { img } = loadedImagesRef.current.get(key) || {};
//         if (!img) return;

//         const scaledW = img.naturalWidth * scale;
//         const scaledH = img.naturalHeight * scale;

//         const margin = 50;
//         const maxX = canvas.width - scaledW - 2 * margin;
//         const maxY = canvas.height - scaledH - 2 * margin;

//         if (maxX < 0 || maxY < 0) return;

//         let x = margin + relX * maxX;
//         let y = margin + relY * maxY;

//         const centerX = x + scaledW / 2;
//         const centerY = y + scaledH / 2;

//         ctx.save();
//         ctx.translate(centerX, centerY);
//         ctx.rotate((rotation * Math.PI) / 180);
//         ctx.translate(-centerX, -centerY);

//         ctx.globalAlpha = 0.1;

//         if (shape === "rectangle") {
//           rc.rectangle(x - 10, y - 10, scaledW + 20, scaledH + 20, {
//             roughness: 2,
//             stroke: currentConfig.shapeStroke,
//             fill: currentConfig.shapeFill,
//             fillStyle: "solid",
//           });
//         } else if (shape === "circle") {
//           rc.circle(
//             x + scaledW / 2,
//             y + scaledH / 2,
//             Math.max(scaledW, scaledH) / 2 + 10,
//             {
//               roughness: 2,
//               stroke: currentConfig.shapeStroke,
//               fill: currentConfig.shapeFill,
//               fillStyle: "solid",
//             }
//           );
//         } else if (shape === "underline") {
//           rc.line(x - 10, y + scaledH + 5, x + scaledW + 10, y + scaledH + 5, {
//             roughness: 2,
//             stroke: currentConfig.shapeStroke,
//             strokeWidth: 1,
//           });
//         } else if (shape === "bracket") {
//           rc.line(x - 5, y - 10, x - 5, y + scaledH + 10, {
//             roughness: 2,
//             stroke: currentConfig.shapeStroke,
//             strokeWidth: 1,
//           });
//           rc.line(x + scaledW + 5, y - 10, x + scaledW + 5, y + scaledH + 10, {
//             roughness: 2,
//             stroke: currentConfig.shapeStroke,
//             strokeWidth: 1,
//           });
//         }

//         ctx.globalAlpha = 1.0;
//         ctx.drawImage(img, x, y, scaledW, scaledH);
//         ctx.restore();
//       });
//     };

//     const observer = new MutationObserver(() => {
//       const newTheme = getTheme();
//       if (newTheme !== currentTheme) {
//         currentTheme = newTheme;
//         loadImages(currentTheme).then((newImages) => {
//           loadedImagesRef.current = newImages;
//           draw();
//         });
//       }
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     window.addEventListener("resize", resize);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", resize);
//       loadedImagesRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
//     };
//   }, [equations, csItems, density]);

//   return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
// };

// export default HandDrawnMathBackground;
