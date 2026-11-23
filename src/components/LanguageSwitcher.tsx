"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition, Suspense } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLocaleSlug } from "@/context/LocaleSlugContext";

interface LanguageSwitcherProps {
  className?: string;
}

function LanguageSwitcherContent({ className = "" }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const { alternateSlugs, availableLocales, showToast } = useLocaleSlug();

  const targetLocale = currentLocale === "ar" ? "en" : "ar";
  const label = targetLocale === "ar" ? "العربية" : "English";
  const badge = targetLocale === "ar" ? "AR" : "EN";

  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    const queryString = searchParams?.toString();

    // Persist chosen language preference so back/forward navigation retains this language
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_lang_pref", targetLocale);
      } catch {
        // ignore
      }
      document.cookie = `user_lang_pref=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Check if current page has an explicit localized slug path
    const targetSlugPath = alternateSlugs[targetLocale];

    if (targetSlugPath) {
      // Check if content is available in target locale
      const isAvailable = availableLocales.includes(targetLocale);
      if (!isAvailable) {
        const fallbackNotice =
          targetLocale === "ar"
            ? "محتوى هذه الصفحة متوفر باللغة الإنجليزية فقط حالياً."
            : "Content for this page is currently available in English only.";
        showToast(fallbackNotice);
      }

      const fullPath = queryString ? `${targetSlugPath}?${queryString}` : targetSlugPath;
      router.replace(fullPath, { locale: targetLocale });
      return;
    }

    // Default route navigation
    const targetPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetPath, { locale: targetLocale });
  };

  return (
    <motion.button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      aria-label={`Switch to ${label}`}
      className={`relative group flex items-center justify-center gap-1 p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-xs font-bold uppercase tracking-wider">{badge}</span>
      <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5" />

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50"
          >
            {label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-1 p-2 sm:p-2.5 rounded-full text-gray-400">
          <GlobeAltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
}
