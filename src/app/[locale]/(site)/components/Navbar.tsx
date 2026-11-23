"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/app/context/ThemeContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { name: t("home"), href: "/", icon: HomeIcon, isExternal: false },
    { name: t("about"), href: "/about", icon: UserIcon, isExternal: false },
    { name: t("projects"), href: "/projects", icon: BriefcaseIcon, isExternal: false },
    { name: t("courses"), href: "/courses", icon: AcademicCapIcon, isExternal: false },
    { name: t("blog"), href: "/blog", icon: BookOpenIcon, isExternal: false },
    { name: t("contact"), href: "/contact", icon: EnvelopeIcon, isExternal: false },
  ];

  return (
    <>
      {/* ── Mobile Top Controls (Theme Toggle & Language Switcher) ── */}
      <div className="fixed top-4 end-4 z-40 sm:hidden flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 backdrop-blur-xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-lg active:scale-95 transition-transform"
        >
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5 text-gray-300" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <LanguageSwitcher />
      </div>

      {/* ── Unified Responsive Navigation Bar ───────────────────── */}
      <nav
        aria-label="Main Navigation"
        className="fixed bottom-0 inset-x-0 sm:bottom-6 sm:inset-x-0 sm:mx-auto z-50 w-full sm:w-auto sm:max-w-fit bg-white/95 dark:bg-[#080e1c]/95 sm:dark:bg-[#0c1424]/90 backdrop-blur-2xl border-t sm:border border-gray-200/90 dark:border-gray-800/90 sm:rounded-full px-2 py-1.5 sm:px-4 sm:py-2 shadow-2xl transition-all"
      >
        <div className="flex items-center justify-around sm:justify-center gap-0.5 sm:gap-1.5">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.name}
                aria-current={isActive ? "page" : undefined}
                className="relative block"
              >
                {/* Mobile View: Icon top, Label bottom (< sm) */}
                <div
                  className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all sm:hidden ${
                    isActive
                      ? "text-primary font-bold border border-primary/30 bg-primary/10"
                      : "text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                  <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[50px] text-center">
                    {item.name}
                  </span>
                </div>

                {/* Desktop View: Pill if active, Icon with hover tooltip if inactive (sm:) */}
                <div className="hidden sm:block">
                  {isActive ? (
                    <motion.div
                      layout
                      className="relative flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 dark:bg-primary/20 text-primary border border-primary/30 font-semibold text-xs sm:text-sm shadow-xs"
                    >
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="relative group flex items-center justify-center p-2.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />

                      {/* Tooltip for inactive item */}
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute -top-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
                          >
                            {item.name}
                            <div className="absolute -bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Desktop Divider, Language Switcher & Theme Toggle (hidden on mobile, top bar handles them) */}
          <div className="hidden sm:flex items-center gap-1.5 ms-1">
            <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-1 flex-shrink-0" />

            <LanguageSwitcher />

            <motion.button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t("themeLight") : t("themeDark")}
              className="relative group flex items-center justify-center p-2.5 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors flex-shrink-0"
              onHoverStart={() => setHoveredIndex(99)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-gray-400 group-hover:text-primary" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600 group-hover:text-primary" />
              )}

              <AnimatePresence>
                {hoveredIndex === 99 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute -top-12 end-0 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50"
                  >
                    {theme === "dark" ? tCommon("lightMode") : tCommon("darkMode")}
                    <div className="absolute -bottom-1 end-3 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
    </>
  );
}
