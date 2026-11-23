"use client";

import React, { useEffect, useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { FaArrowLeft } from "react-icons/fa";
import type { MarkdownHeading } from "./LectureMarkdownRenderer";

interface LectureTableOfContentsProps {
  headings: MarkdownHeading[];
  isRtl?: boolean;
  backHref?: string;
  backLabel?: string;
  courseTitle?: string;
  currentIndex?: number;
  totalLectures?: number;
}

export default function LectureTableOfContents({
  headings,
  isRtl = false,
  backHref,
  backLabel,
  courseTitle,
  currentIndex = 0,
  totalLectures = 2,
}: LectureTableOfContentsProps) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const headingRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-10% 0px -40% 0px",
      threshold: 0.1,
    });

    headings.forEach((h) => {
      const element = document.getElementById(h.id);
      if (element) {
        observer.observe(element);
        headingRefs.current[h.id] = element;
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Table of Contents"
        className={`fixed bottom-24 z-40 p-3 rounded-full bg-primary text-white shadow-xl lg:hidden hover:bg-orange-600 transition-colors ${
          isRtl ? "left-6" : "right-6"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <XMarkIcon className="h-5 w-5" /> : <ListBulletIcon className="h-5 w-5" />}
      </motion.button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              className={`fixed top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-950 p-6 shadow-2xl overflow-y-auto ${
                isRtl ? "left-0 text-right" : "right-0 text-left"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <ListBulletIcon className="w-4 h-4" />
                  <span>{isRtl ? "فهرس المحاضرة" : "ON THIS PAGE"}</span>
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {backHref && (
                <Link
                  href={backHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-3 mb-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <FaArrowLeft className={`w-3.5 h-3.5 text-primary shrink-0 ${isRtl ? "" : "rotate-180"}`} />
                  <span>{backLabel || (isRtl ? "الرجوع للمحاضرات" : "Back to Lectures")}</span>
                </Link>
              )}

              {headings && headings.length > 0 ? (
                <ul className="space-y-2.5">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => handleScrollTo(h.id)}
                        className={`text-sm w-full py-1.5 transition-all text-start ${
                          activeId === h.id
                            ? "text-primary font-bold"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        } ${h.level === 3 ? (isRtl ? "pr-3 text-xs" : "pl-3 text-xs") : ""}`}
                      >
                        {h.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">
                  {isRtl ? "لا توجد عناوين فرعية في هذه المحاضرة." : "No subheadings found."}
                </p>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Sidebar Panel */}
      <div className="hidden lg:block sticky top-8 self-start w-72 shrink-0 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar space-y-3 z-20">
        {/* Card 1: Back Button Above TOC */}
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-primary hover:border-primary/50 backdrop-blur-md shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <FaArrowLeft className={`w-3.5 h-3.5 transition-transform ${isRtl ? "group-hover:translate-x-0.5" : "rotate-180 group-hover:-translate-x-0.5"}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase tracking-wider">
                {isRtl ? "فهرس الكورس" : "Course Index"}
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                {backLabel || (isRtl ? "الرجوع للمحاضرات" : "Back to Lectures")}
              </span>
            </div>
          </Link>
        )}

        {/* Card 2: Sticky Table of Contents Card */}
        {headings && headings.length > 0 && (
          <div className="bg-white/90 dark:bg-[#0c1424]/90 p-5 rounded-3xl border border-gray-200/90 dark:border-gray-800/90 backdrop-blur-md shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800/80">
              <ListBulletIcon className="w-4 h-4" />
              <span>{isRtl ? "فهرس المحاضرة" : "ON THIS PAGE"}</span>
            </h3>

            <ul
              className={`space-y-2 relative ${
                isRtl ? "border-r pr-3" : "border-l pl-3"
              } border-gray-200 dark:border-gray-800`}
            >
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <li key={h.id} className="relative">
                    <button
                      onClick={() => handleScrollTo(h.id)}
                      className={`block w-full py-1 text-xs text-start transition-colors duration-200 ${
                        isActive
                          ? "text-primary font-bold"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
                      } ${h.level === 3 ? (isRtl ? "pr-2" : "pl-2") : ""}`}
                    >
                      {h.title}
                    </button>

                    {isActive && (
                      <motion.div
                        layoutId="activeLectureTOC"
                        className={`absolute top-0 bottom-0 w-1 bg-primary rounded-full ${
                          isRtl ? "-right-[15px]" : "-left-[15px]"
                        }`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Bottom Progress Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              <span>
                {isRtl
                  ? `استكمال ${currentIndex + 1} من ${totalLectures}`
                  : `Progress ${currentIndex + 1} of ${totalLectures}`}
              </span>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-primary truncate max-w-[120px]" title={courseTitle}>
                {isRtl ? "الاعتماد على الكورس" : "Curriculum Path"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
