"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastMessage {
  id: string;
  text: string;
}

interface LocaleSlugContextType {
  alternateSlugs: Record<string, string>;
  availableLocales: string[];
  setAlternatePath: (paths: Record<string, string>, locales?: string[]) => void;
  showToast: (message: string) => void;
}

const LocaleSlugContext = createContext<LocaleSlugContextType>({
  alternateSlugs: {},
  availableLocales: ["en", "ar"],
  setAlternatePath: () => {},
  showToast: () => {},
});

export function LocaleSlugProvider({ children }: { children: ReactNode }) {
  const [alternateSlugs, setAlternateSlugs] = useState<Record<string, string>>({});
  const [availableLocales, setAvailableLocales] = useState<string[]>(["en", "ar"]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const setAlternatePath = useCallback((paths: Record<string, string>, locales?: string[]) => {
    setAlternateSlugs(paths);
    if (locales && locales.length > 0) {
      setAvailableLocales(locales);
    }
  }, []);

  return (
    <LocaleSlugContext.Provider
      value={{
        alternateSlugs,
        availableLocales,
        setAlternatePath,
        showToast,
      }}
    >
      {children}

      {/* Modern floating toast notification */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto bg-gray-900/95 dark:bg-gray-100/95 text-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium border border-white/10 dark:border-gray-800 flex items-center gap-3"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
              <span className="leading-snug">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LocaleSlugContext.Provider>
  );
}

export function useLocaleSlug() {
  return useContext(LocaleSlugContext);
}
