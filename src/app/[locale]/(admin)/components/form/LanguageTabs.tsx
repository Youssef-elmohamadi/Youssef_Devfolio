"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FaCheckCircle, FaExclamationCircle, FaLanguage } from "react-icons/fa";

export type SupportedAdminLocale = "en" | "ar";

interface LanguageTabsProps {
  activeLang: SupportedAdminLocale;
  onChange: (lang: SupportedAdminLocale) => void;
  completion?: {
    en?: boolean;
    ar?: boolean;
  };
  hasErrors?: {
    en?: boolean;
    ar?: boolean;
  };
  className?: string;
}

export default function LanguageTabs({
  activeLang,
  onChange,
  completion = { en: false, ar: false },
  hasErrors = { en: false, ar: false },
  className = "",
}: LanguageTabsProps) {
  const t = useTranslations("admin.form");

  const completedCount = (completion.en ? 1 : 0) + (completion.ar ? 1 : 0);
  const totalCount = 2;
  const isAllComplete = completedCount === totalCount;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 ${className}`}
    >
      {/* Tabs */}
      <div className="flex items-center gap-2">
        {/* English Tab */}
        <button
          type="button"
          onClick={() => onChange("en")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeLang === "en"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <span>{t("tabs.en")}</span>
          <span className="font-mono text-[10px] uppercase font-bold opacity-80">
            EN
          </span>
          {hasErrors.en ? (
            <FaExclamationCircle className="w-3.5 h-3.5 text-red-500 bg-white rounded-full" />
          ) : completion.en ? (
            <FaCheckCircle
              className={`w-3.5 h-3.5 ${
                activeLang === "en" ? "text-white" : "text-emerald-500"
              }`}
            />
          ) : (
            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </button>

        {/* Arabic Tab */}
        <button
          type="button"
          onClick={() => onChange("ar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeLang === "ar"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <span>{t("tabs.ar")}</span>
          <span className="font-mono text-[10px] uppercase font-bold opacity-80">
            AR
          </span>
          {hasErrors.ar ? (
            <FaExclamationCircle className="w-3.5 h-3.5 text-red-500 bg-white rounded-full" />
          ) : completion.ar ? (
            <FaCheckCircle
              className={`w-3.5 h-3.5 ${
                activeLang === "ar" ? "text-white" : "text-emerald-500"
              }`}
            />
          ) : (
            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
        </button>
      </div>

      {/* Completion Indicator */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
            isAllComplete
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
          }`}
        >
          <FaLanguage className="w-3.5 h-3.5" />
          <span>
            {isAllComplete
              ? t("completion.allDone")
              : t("completion.partial", {
                  count: completedCount,
                  total: totalCount,
                })}
          </span>
        </span>
      </div>
    </div>
  );
}
