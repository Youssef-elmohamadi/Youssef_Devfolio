"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Fullstack Developer",
  "React Specialist",
  ".NET Specialist",
  "Next.js Engineer",
  "UI/UX Enthusiast",
];

export default function RoleSwitcher() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[40px] flex justify-center md:justify-start items-center overflow-hidden mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300"
        >
          {roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
