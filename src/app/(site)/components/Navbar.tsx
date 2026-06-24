"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  BookOpenIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon, isExternal: false },
    { name: "About", href: "/about", icon: UserIcon, isExternal: false },
    { name: "Projects", href: "/projects", icon: BriefcaseIcon, isExternal: false },
    { name: "Blogs", href: "/blog", icon: BookOpenIcon, isExternal: false },
    { name: "Contact", href: "/contact", icon: EnvelopeIcon, isExternal: false },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-full"
    >
      <nav className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 dark:bg-dark/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-full shadow-2xl">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const linkContent = (
            <motion.div
              className="relative group flex items-center justify-center p-2 sm:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`} />
              
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
                  >
                    {item.name}
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.href}
                aria-label={item.name}
                target={item.href !== "#" && !item.href.startsWith("mailto:") ? "_blank" : "_self"}
                rel={item.href !== "#" && !item.href.startsWith("mailto:") ? "noopener noreferrer" : ""}
              >
                {linkContent}
              </a>
            );
          }

          return (
            <Link key={item.name} href={item.href} aria-label={item.name} aria-current={isActive ? "page" : undefined}>
              {linkContent}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-6 sm:h-8 bg-gray-300 dark:bg-gray-700 mx-1 sm:mx-2 flex-shrink-0" />

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="relative group flex items-center justify-center p-2 sm:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          onHoverStart={() => setHoveredIndex(99)}
          onHoverEnd={() => setHoveredIndex(null)}
          whileHover={{ scale: 1.15, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === "dark" ? (
            <SunIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary" />
          ) : (
            <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-primary" />
          )}

          {/* Theme Toggle Tooltip */}
          <AnimatePresence>
            {hoveredIndex === 99 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="absolute -top-12 right-0 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50"
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                <div className="absolute -bottom-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>
    </motion.div>
  );
}
