"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const terminalCode = [
  { text: "$ whoami", type: "command" },
  { text: "> Youssef Elmohamadi", type: "output" },
  { text: "> Frontend Engineer", type: "output", highlight: true },
  { text: "", type: "empty" },
  { text: "$ cat skills.json", type: "command" },
  { text: "{", type: "code" },
  { text: '  "core": ["React", "Next.js", "ASP.NET"],', type: "code" },
  { text: '  "styling": ["Tailwind CSS", "Framer Motion"],', type: "code" },
  { text: '  "backend": ["C#", "Node.js", "ASP.NET"]', type: "code" },
  { text: "}", type: "code" },
  { text: "", type: "empty" },
  { text: "$ npm run craft", type: "command" },
  { text: "> Crafting digital experiences...", type: "output", animate: true },
];

export default function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < terminalCode.length) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 400); // 400ms per line reveal

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-[#1e1e1e]/80 dark:bg-[#0d0d0d]/90 backdrop-blur-md border border-gray-200/20 dark:border-gray-800/50 shadow-2xl shadow-primary/10"
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 bg-[#2d2d2d]/80 dark:bg-[#1a1a1a]/90 border-b border-gray-700/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto text-xs text-gray-400 font-mono tracking-wider">
          youssef@forge:~$
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm leading-relaxed text-gray-300 min-h-[300px]">
        {terminalCode.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1 ${
              line.type === "command"
                ? "text-green-400 font-semibold mt-2"
                : line.type === "code"
                ? "text-blue-300 ml-2 whitespace-pre"
                : line.highlight
                ? "text-primary font-bold"
                : "text-gray-300"
            }`}
          >
            {line.text}
            {/* Blinking cursor on the last visible line if it's the crafting output */}
            {index === visibleLines - 1 && line.animate && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
              />
            )}
          </motion.div>
        ))}
        {/* Default blinking cursor if waiting */}
        {visibleLines < terminalCode.length && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-gray-400 mt-2"
          />
        )}
      </div>
    </motion.div>
  );
}
