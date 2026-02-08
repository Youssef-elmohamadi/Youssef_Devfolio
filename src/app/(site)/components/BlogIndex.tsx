"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import ProgressBar from "./ProgressBar";

interface TableOfContentsProps {
  content: Array<{
    id: number;
    title: string | null;
    text?: string;
    code?: string;
    images?: string[];
    videos?: string[];
  }>;
  lang?: string;
}

const TableOfContents = ({ content, lang = "en" }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const isRtl = lang === "ar";
  const headings = content?.filter((block) => block.title !== null);
  const headingRefs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const visibleEntry = visibleEntries[0];
        setActiveId(visibleEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-10% 0px -40% 0px", 
      threshold: 0.1,
    });

    headings?.forEach((h) => {
      const element = document.getElementById(h.id.toString());
      if (element) {
        observer.observe(element);
        headingRefs.current[h.id.toString()] = element;
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // 2. شريط التقدم العلوي
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

  // 3. التنقل السلس
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  if (!headings || headings.length === 0) return null;

  return (
    <>
      <ProgressBar progress={progress} />

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 p-3.5 rounded-full bg-primary text-white shadow-xl lg:hidden hover:bg-orange-600 transition-colors ${
          isRtl ? "left-6" : "right-6"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ListBulletIcon className="h-6 w-6" />
        )}
      </motion.button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              className={`fixed top-0 bottom-0 w-72 bg-white dark:bg-[#111] p-6 shadow-2xl overflow-y-auto ${
                isRtl ? "right-0" : "left-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className={`text-xl font-bold mb-6 text-primary border-b border-gray-100 dark:border-gray-800 pb-4 ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {isRtl ? "المحتويات" : "Table of Contents"}
              </h2>
              <ul className="space-y-4">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => handleScrollTo(h.id.toString())}
                      className={`text-sm w-full transition-all duration-200 ${
                        isRtl ? "text-right" : "text-left"
                      } ${
                        activeId === h.id.toString()
                          ? `text-primary font-bold ${isRtl ? "border-r-4 pr-3" : "border-l-4 pl-3"} border-primary`
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      {h.title}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`hidden lg:block fixed top-32 w-72 max-h-[70vh] overflow-y-auto custom-scrollbar ${
          isRtl ? "right-8" : "left-8"
        }`}
      >
        <div className="bg-white/80 dark:bg-[#111]/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-sm dark:shadow-none">
          <h2
            className={`text-xs font-black uppercase tracking-widest mb-6 text-primary flex items-center gap-2 ${
              isRtl ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <ListBulletIcon className="w-4 h-4" />
            {isRtl ? "محتوى المقال" : "ON THIS PAGE"}
          </h2>

          <ul
            className={`space-y-3 relative ${isRtl ? "border-r" : "border-l"} border-gray-200 dark:border-gray-800`}
          >
            {headings.map((h) => (
              <li key={h.id} className="relative group">
                <button
                  onClick={() => handleScrollTo(h.id.toString())}
                  className={`block w-full py-1 transition-all duration-300 ${
                    isRtl ? "text-right pr-4" : "text-left pl-4"
                  } ${
                    activeId === h.id.toString()
                      ? "text-primary font-bold scale-105 origin-left"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs font-medium"
                  }`}
                >
                  {h.title}
                </button>

               {activeId === h.id.toString() && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute top-0 bottom-0 w-1 bg-primary rounded-full ${
                      isRtl ? "-right-[2.5px]" : "-left-[2.5px]"
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </>
  );
};

export default TableOfContents;
