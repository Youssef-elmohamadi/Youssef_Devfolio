"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function RoleSwitcher() {
  const t = useTranslations("home.hero");
  const roles = (t.raw("roles") as string[]) || [
    "Fullstack Developer",
    "React Specialist",
    ".NET Specialist",
    "Next.js Engineer",
    "UI/UX Enthusiast",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <div className="h-[36px] min-h-[36px] flex justify-center lg:justify-start items-center overflow-hidden mb-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-lg md:text-xl font-medium tracking-normal text-slate-600 dark:text-slate-300 select-none"
        >
          {roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
