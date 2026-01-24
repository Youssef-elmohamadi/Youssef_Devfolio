"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ProgressBar from "./ProgressBar";

// تحديث الـ Interface ليتناسب مع الـ API
interface TableOfContentsProps {
  content: Array<{
    id: number;
    title: string | null;
    [key: string]: any;
  }>;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // 1. فلترة العناوين التي ليست Null فقط
  const headings = content?.filter((block) => block.title !== null);

  const headingRefs = useRef<Record<string, HTMLElement | null>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // استخدام نسبة ظهور (threshold) أفضل
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-10% 0px -70% 0px", // تحسين المسافات للـ Active state
        threshold: 0.5,
      },
    );

    headings?.forEach((h) => {
      const element = document.getElementById(h.id.toString());
      if (element) {
        observer.observe(element);
        headingRefs.current[h.id.toString()] = element;
      }
    });

    return () => observer.disconnect();
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

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // مسافة التوقف قبل العنوان
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
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-2xl lg:hidden"
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
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
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="w-72 h-full bg-white dark:bg-dark p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-6 text-primary border-b pb-4">
                المحتويات
              </h2>
              <ul className="space-y-4">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => handleScrollTo(h.id.toString())}
                      className={`text-sm text-right w-full transition-all ${
                        activeId === h.id.toString()
                          ? "text-primary font-bold pr-2 border-r-2 border-primary"
                          : "text-gray-500"
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
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block fixed top-32 left-8 w-64 max-h-[70vh] overflow-y-auto"
      >
        <div className="bg-white/50 dark:bg-dark/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-md">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-primary">
            محتوى المقال
          </h2>
          <ul className="space-y-4">
            {headings.map((h) => (
              <li key={h.id} className="relative">
                <button
                  onClick={() => handleScrollTo(h.id.toString())}
                  className={`text-xs text-left w-full transition-all hover:text-primary ${
                    activeId === h.id.toString()
                      ? "text-primary font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {h.title}
                </button>
                {activeId === h.id.toString() && (
                  <motion.div
                    layoutId="indicator"
                    className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full"
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
