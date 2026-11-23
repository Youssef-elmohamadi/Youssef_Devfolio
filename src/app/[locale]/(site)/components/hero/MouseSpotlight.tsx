"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionTemplate } from "framer-motion";

export default function MouseSpotlight() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Spring config for smooth follow
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const isDark = resolvedTheme === "dark";

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${
    isDark ? "rgba(255,106,0,0.07)" : "rgba(255,106,0,0.04)"
  }, transparent 40%)`;

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{ background }}
    />
  );
}
