"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CODE_SYMBOLS = ["{}", "< />", "()", "=>", "const", "let", "interface", "type", "[]", "&&"];

interface FloatingElementProps {
  symbol: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

function FloatingElement({ symbol, x, y, duration, delay }: FloatingElementProps) {
  return (
    <motion.div
      className="absolute text-primary/20 dark:text-primary/30 font-mono text-xl md:text-2xl font-bold select-none pointer-events-none"
      initial={{ x: `${x}vw`, y: `${y}vh`, opacity: 0 }}
      animate={{
        y: [`${y}vh`, `${y - 10}vh`, `${y}vh`],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {symbol}
    </motion.div>
  );
}

export default function FloatingCodeElements() {
  const [elements, setElements] = useState<FloatingElementProps[]>([]);

  useEffect(() => {
    // Generate random positions only on client to avoid hydration mismatch
    const generated = CODE_SYMBOLS.map((symbol) => ({
      symbol,
      x: Math.random() * 80 + 10, // 10% to 90% vw
      y: Math.random() * 80 + 10, // 10% to 90% vh
      duration: Math.random() * 10 + 15, // 15 to 25 seconds
      delay: Math.random() * 10,
    }));
    setElements(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
      {elements.map((el, i) => (
        <FloatingElement key={i} {...el} />
      ))}
    </div>
  );
}
