"use client";

import React, { useEffect, useState, useRef } from "react";
import { Blog } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ProgressBar from "./ProgressBar";

const TableOfContents = ({ content }: { content: Blog["content"] }) => {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const headings = content?.filter((block) => block.type === "heading");
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    headings?.forEach((h) => {
      const heading = document.getElementById(h.id.toString());
      if (heading) {
        observer.observe(heading);
        headingRefs.current[h.id.toString()] = heading as HTMLHeadingElement;
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      setProgress((currentScroll / totalHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (id: string) => {
    headingRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsOpen(false);
  };

  return (
    <>
      <ProgressBar progress={progress} />

      {/* زرار فتح الـ TOC في الموبايل */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-orange-500 text-white shadow-lg lg:hidden"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </motion.button>

      {/* Mobile Drawer (Full Screen) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 top-[64px] bottom-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-80 h-full p-6 bg-white/80 dark:bg-dark/80 backdrop-blur-sm shadow-xl border-r border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-orange-400">
                  Table of Contents
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 dark:text-gray-300"
                >
                  <XMarkIcon className="h-7 w-7" />
                </button>
              </div>
              <ul className="space-y-4 text-base">
                {headings?.map((h, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleScroll(h.id.toString())}
                      className={`hover:text-orange-600 dark:hover:text-orange-300 block transition-colors cursor-pointer text-left w-full ${
                        activeId === h.id.toString()
                          ? "text-orange-600 dark:text-orange-400 font-bold"
                          : "text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      {h.content}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
        className="hidden lg:block fixed top-24 left-6 w-64 h-[60vh] overflow-y-auto pr-4 z-10"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-orange-400">
            Table of Contents
          </h2>
          <ul className="space-y-3 text-sm">
            {headings?.map((h, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <button
                  onClick={() => handleScroll(h.id.toString())}
                  className={`hover:text-orange-600 dark:hover:text-orange-300 block transition-colors cursor-pointer text-left w-full ${
                    activeId === h.id.toString()
                      ? "text-orange-600 dark:text-orange-400 font-bold"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {h.content}
                </button>
                {activeId === h.id.toString() && (
                  <motion.div
                    layoutId="active-toc-indicator"
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1 h-full rounded-full bg-gradient-to-b from-orange-500 to-pink-500 shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </>
  );
};

export default TableOfContents;
