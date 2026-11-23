"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useLocaleSlug } from "@/context/LocaleSlugContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaRegCircle,
  FaClock,
  FaEye,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "@/app/context/ThemeContext";
import { recordLectureViewAction } from "@/actions/courses";
import LectureMarkdownRenderer, {
  extractHeadingsFromMarkdown,
} from "@/app/[locale]/(site)/components/LectureMarkdownRenderer";
import LectureTableOfContents from "@/app/[locale]/(site)/components/LectureTableOfContents";
import SocialShareButtons from "@/app/[locale]/(site)/components/SocialShareButtons";
import type { LectureDetail, CourseDetail } from "@/types/courses";

interface LectureClientProps {
  lecture: LectureDetail;
  course: CourseDetail;
}

export default function LectureClient({ lecture, course }: LectureClientProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("courses");
  const { setAlternatePath } = useLocaleSlug();

  const isTitleArabic = /[\u0600-\u06FF]/.test(lecture.title);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [viewsCount, setViewsCount] = useState(lecture.views || 0);
  const [currentUrl, setCurrentUrl] = useState("");

  const headings = extractHeadingsFromMarkdown(lecture.content);

  // Sync localized route slugs with LanguageSwitcher
  useEffect(() => {
    const cSlugEn = course.slugs?.en || course.slug;
    const cSlugAr = course.slugs?.ar || course.slug;
    const lSlugEn = lecture.slugs?.en || lecture.slug;
    const lSlugAr = lecture.slugs?.ar || lecture.slug;

    setAlternatePath(
      {
        en: `/courses/${cSlugEn}/${lSlugEn}`,
        ar: `/courses/${cSlugAr}/${lSlugAr}`,
      },
      lecture.available_locales || course.available_locales
    );
  }, [course, lecture, setAlternatePath]);

  // 1. Reading progress bar listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Track lecture view & load language-agnostic completion status from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);

      try {
        const primaryKey = `course_progress_${course.id}`;
        const legacyKey = `course_progress_${course.slug}`;
        const stored = localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
        if (stored) {
          const list: string[] = JSON.parse(stored);
          const isDone =
            list.includes(lecture.slug) ||
            list.includes(String(lecture.id)) ||
            (Boolean(lecture.slugs?.en) && list.includes(lecture.slugs!.en)) ||
            (Boolean(lecture.slugs?.ar) && list.includes(lecture.slugs!.ar));
          if (isDone) {
            setIsCompleted(true);
          }
        }
      } catch (e) {
        console.error("Failed to read progress from localStorage:", e);
      }
    }

    // Fire and forget view recording (backend deduplicates by IP)
    recordLectureViewAction(course.slug, lecture.slug).then((res) => {
      if (res?.success && typeof res.views === "number") {
        setViewsCount(res.views);
      }
    });
  }, [course.id, course.slug, lecture.id, lecture.slug, lecture.slugs]);

  // 3. Toggle Mark as Completed
  const handleToggleComplete = () => {
    if (typeof window === "undefined") return;

    try {
      const primaryKey = `course_progress_${course.id}`;
      const legacyKey = `course_progress_${course.slug}`;
      const stored = localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
      let list: string[] = stored ? JSON.parse(stored) : [];

      const allMyIdentifiers = [
        lecture.slug,
        String(lecture.id),
        lecture.slugs?.en,
        lecture.slugs?.ar,
      ].filter(Boolean) as string[];

      if (isCompleted) {
        list = list.filter((s) => !allMyIdentifiers.includes(s));
        setIsCompleted(false);
      } else {
        if (!list.includes(lecture.slug)) {
          list.push(lecture.slug);
        }
        if (!list.includes(String(lecture.id))) {
          list.push(String(lecture.id));
        }
        setIsCompleted(true);
      }

      // Save to both primary and legacy keys to guarantee backwards compatibility and cross-language sync
      localStorage.setItem(primaryKey, JSON.stringify(list));
      localStorage.setItem(legacyKey, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to update progress in localStorage:", e);
    }
  };

  const lecturesList = course.lectures || [];
  const currentIndex = lecturesList.findIndex(
    (l) => l.slug === lecture.slug || l.id === lecture.id
  );
  const lectureNumber = (currentIndex >= 0 ? currentIndex + 1 : lecture.order)
    .toString()
    .padStart(2, "0");

  // Fallback content badge detection
  const isContentFallback =
    locale === "ar" &&
    Array.isArray(lecture.available_locales) &&
    lecture.available_locales.length > 0 &&
    !lecture.available_locales.includes("ar");

  return (
    <div className="relative">
      {/* ── Top Fixed Reading Progress Bar ─────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Page Layout: Main Article Content + Sticky TOC ── */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Center: Main Lecture Content */}
        <div className="flex-1 min-w-0 max-w-5xl w-full space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-gray-500 dark:text-gray-400">
            <Link href="/courses" className="hover:text-primary transition-colors">
              {t("backToCourses")}
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-primary transition-colors line-clamp-1"
            >
              {course.title}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white line-clamp-1">{lecture.title}</span>
          </div>

          {/* Lecture Title Header Card */}
          <div className="bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-gray-200/90 dark:border-gray-800/90 shadow-sm space-y-4 sm:space-y-5">
            {/* Meta Badges Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-mono font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs">
                  {t("lectureNumber", { number: lectureNumber })}
                </span>

                <span className="flex items-center gap-1.5 font-mono text-gray-500 dark:text-gray-400 text-xs">
                  <FaClock className="text-primary w-3.5 h-3.5" />
                  <span>{t("readingTime", { minutes: lecture.reading_time })}</span>
                </span>

                <span className="flex items-center gap-1.5 font-mono text-gray-500 dark:text-gray-400 text-xs">
                  <FaEye className="text-blue-500 w-3.5 h-3.5" />
                  <span>{t("views", { count: viewsCount })}</span>
                </span>
              </div>

              {/* Fallback Notice Badge */}
              {isContentFallback && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans font-medium text-xs">
                  <FaGlobe className="w-3.5 h-3.5" />
                  <span>{t("availableEnglishOnly")}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              dir={isTitleArabic ? "rtl" : "ltr"}
              className={`text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.3] ${
                isTitleArabic ? "font-arabic text-start" : "text-start"
              }`}
            >
              {lecture.title}
            </h1>

            {/* Description / Subtitle */}
            {lecture.description && (
              <p
                dir={isTitleArabic ? "rtl" : "ltr"}
                className={`text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed ${
                  isTitleArabic ? "font-arabic text-start" : "text-start"
                }`}
              >
                {lecture.description}
              </p>
            )}

            {/* Actions Bar: Share on start, Complete button on end */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                  {t("share")}
                </span>
                <SocialShareButtons
                  title={`${lecture.title} - ${course.title}`}
                  description={lecture.description || ""}
                  url={currentUrl}
                  isRtl={isRtl}
                />
              </div>

              <button
                onClick={handleToggleComplete}
                className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-xs ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary"
                }`}
              >
                {isCompleted ? (
                  <>
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t("completed")}</span>
                  </>
                ) : (
                  <>
                    <FaRegCircle className="w-3.5 h-3.5" />
                    <span>{t("markCompleted")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Markdown Article Content (renders in content's actual direction) ── */}
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <LectureMarkdownRenderer content={lecture.content} isDark={isDark} />
          </article>

          {/* ── Bottom Unified Completion & Navigation Box ──────── */}
          <div className="bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/90 dark:border-gray-800/90 p-4 sm:p-7 space-y-5 sm:space-y-6 shadow-sm">
            {/* Top row: Mark Complete Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-5 border-b border-gray-100 dark:border-gray-800/80">
              <button
                onClick={handleToggleComplete}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 order-2 sm:order-1 ${
                  isCompleted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                    : "bg-gradient-to-r from-primary to-orange-500 text-white hover:from-primary/90 hover:to-orange-500/90 shadow-primary/25"
                }`}
              >
                <FaCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{isCompleted ? t("markedCompleted") : t("markCompleted")}</span>
              </button>

              <div className="text-start sm:text-end order-1 sm:order-2">
                <h4 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  {t("finishedReading")}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("finishedReadingDesc")}
                </p>
              </div>
            </div>

            {/* Bottom row: Next & Previous Lecture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Next Lecture Card */}
              {lecture.next_lecture ? (
                <Link
                  href={`/courses/${course.slug}/${lecture.next_lecture.slug}`}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#121c2e]/70 hover:bg-gray-100 dark:hover:bg-[#152238] hover:border-primary/50 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-semibold mb-2">
                    <span>{t("nextLecture")}</span>
                    <FaArrowLeft
                      className={`w-3.5 h-3.5 ${isRtl ? "" : "rotate-180"} group-hover:-translate-x-1 transition-transform text-primary`}
                    />
                  </div>
                  <div className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {lecture.next_lecture.title}
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/courses/${course.slug}`}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#121c2e]/70 hover:border-primary/50 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-2">
                    <span>{t("courseCompleted")}</span>
                    <FaCheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {t("returnToSummary")}
                  </div>
                </Link>
              )}

              {/* Previous Lecture Card */}
              {lecture.previous_lecture ? (
                <Link
                  href={`/courses/${course.slug}/${lecture.previous_lecture.slug}`}
                  className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#121c2e]/70 hover:bg-gray-100 dark:hover:bg-[#152238] hover:border-primary/50 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-semibold mb-2">
                    <FaArrowRight
                      className={`w-3.5 h-3.5 ${isRtl ? "" : "rotate-180"} group-hover:translate-x-1 transition-transform text-primary`}
                    />
                    <span>{t("previousLecture")}</span>
                  </div>
                  <div className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {lecture.previous_lecture.title}
                  </div>
                </Link>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30 flex flex-col justify-between opacity-50 cursor-not-allowed">
                  <div className="text-xs text-gray-400 font-semibold mb-2">
                    {t("previousLecture")}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    {isRtl ? "لا توجد محاضرة سابقة" : "No previous lecture"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right / Left (based on RTL): Sticky Table of Contents */}
        <LectureTableOfContents
          headings={headings}
          isRtl={isRtl}
          backHref={`/courses/${course.slug}`}
          backLabel={t("backToLectures")}
          courseTitle={course.title}
          currentIndex={currentIndex >= 0 ? currentIndex : 0}
          totalLectures={lecturesList.length || 2}
        />
      </div>
    </div>
  );
}
