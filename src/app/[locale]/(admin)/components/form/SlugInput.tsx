"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FaSyncAlt, FaExclamationTriangle } from "react-icons/fa";

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  lang: "en" | "ar";
  onAutoGenerate?: () => void;
  error?: string;
  className?: string;
}

export function generateSlug(text: string, lang: "en" | "ar"): string {
  if (!text) return "";
  if (lang === "ar") {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\u0621-\u064A0-9a-zA-Z\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugInput({
  value,
  onChange,
  lang,
  onAutoGenerate,
  error,
  className = "",
}: SlugInputProps) {
  const t = useTranslations("admin.form.slug");

  // Validate conflict
  const hasSpaces = /\s/.test(value);
  const hasInvalidChars =
    lang === "ar"
      ? /[^\u0621-\u064A0-9a-zA-Z\-_]/.test(value)
      : /[^a-z0-9\-_]/.test(value);

  const showConflictWarning = value.length > 0 && (hasSpaces || hasInvalidChars);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {t("label")} ({lang.toUpperCase()})
        </label>
        {onAutoGenerate && (
          <button
            type="button"
            onClick={onAutoGenerate}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-orange-600 transition-colors"
          >
            <FaSyncAlt className="w-2.5 h-2.5" />
            <span>{t("autoGenerate")}</span>
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={lang === "ar" ? "رابط-المحاضرة-اللطيف" : "url-friendly-slug"}
          dir="ltr"
          className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
            error || showConflictWarning
              ? "border-red-400 focus:ring-red-400/20"
              : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary/20"
          }`}
        />
      </div>

      {showConflictWarning && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <FaExclamationTriangle className="w-3 h-3 shrink-0" />
          <span>{t("conflictWarning")}</span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
