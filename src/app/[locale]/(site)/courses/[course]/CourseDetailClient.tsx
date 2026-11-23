"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useLocaleSlug } from "@/context/LocaleSlugContext";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaClock,
  FaChartBar,
  FaGraduationCap,
  FaCheckCircle,
  FaGlobe,
} from "react-icons/fa";
import { fadeInUp, staggerContainer } from "@/utils/animations";
import type { CourseDetail, LectureListItem } from "@/types/courses";

interface CourseDetailClientProps {
  course: CourseDetail;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const t = useTranslations("courses");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { setAlternatePath } = useLocaleSlug();

  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const isTitleArabic = /[\u0600-\u06FF]/.test(course.title);

  // Sync localized slugs with LanguageSwitcher
  useEffect(() => {
    if (course.slugs) {
      setAlternatePath(
        {
          en: `/courses/${course.slugs.en || course.slug}`,
          ar: `/courses/${course.slugs.ar || course.slug}`,
        },
        course.available_locales
      );
    }
  }, [course, setAlternatePath]);

  // Load progress from language-agnostic localStorage key with fallback
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const primaryKey = `course_progress_${course.id}`;
      const legacyKey = `course_progress_${course.slug}`;
      const stored = localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
      if (stored) {
        setCompletedSlugs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load course progress from localStorage:", e);
    }
  }, [course.id, course.slug]);

  const lectures = course.lectures || [];

  const isLectureCompleted = (l: LectureListItem) => {
    return (
      completedSlugs.includes(l.slug) ||
      completedSlugs.includes(String(l.id)) ||
      (Boolean(l.slugs?.en) && completedSlugs.includes(l.slugs!.en)) ||
      (Boolean(l.slugs?.ar) && completedSlugs.includes(l.slugs!.ar))
    );
  };

  const completedCount = lectures.filter(isLectureCompleted).length;
  const progressPercent =
    lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

  // Determine next lecture to continue
  const nextUncompletedLecture =
    lectures.find((l) => !isLectureCompleted(l)) || lectures[0];

  // Content fallback detection
  const isContentFallback =
    locale === "ar" &&
    Array.isArray(course.available_locales) &&
    course.available_locales.length > 0 &&
    !course.available_locales.includes("ar");

  // Localized level text
  const levelText =
    course.level === "beginner"
      ? t("levels.beginner")
      : course.level === "intermediate"
      ? t("levels.intermediate")
      : course.level === "advanced"
      ? t("levels.advanced")
      : course.level;

  // Localized status text
  const statusText =
    course.status === "ongoing"
      ? t("statuses.ongoing")
      : course.status === "completed"
      ? t("statuses.completed")
      : course.status;

  return (
    <div className="space-y-4 sm:space-y-8 max-w-[1440px] mx-auto">
      {/* ── Top Navigation (Mobile Back Link vs Desktop Breadcrumbs) ── */}
      <div className="lg:hidden flex items-center justify-between pt-1">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-semibold"
        >
          {isRtl ? (
            <FaArrowRight className="w-3 h-3 text-primary" />
          ) : (
            <FaArrowLeft className="w-3 h-3 text-primary" />
          )}
          <span>{t("backToCourses")}</span>
        </Link>
      </div>

      <nav
        aria-label="Breadcrumb"
        className="hidden lg:flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none py-1"
      >
        <Link
          href="/courses"
          className="hover:text-primary transition-colors shrink-0"
        >
          {t("breadcrumbsCourses")}
        </Link>
        <span className="text-gray-400 dark:text-gray-600 shrink-0">
          {isRtl ? "<" : ">"}
        </span>
        <Link
          href={`/courses?subject=${encodeURIComponent(course.subject)}`}
          className="hover:text-primary transition-colors shrink-0"
        >
          {course.subject}
        </Link>
        <span className="text-gray-400 dark:text-gray-600 shrink-0">
          {isRtl ? "<" : ">"}
        </span>
        <span className="text-gray-800 dark:text-gray-300 font-medium truncate max-w-[200px] sm:max-w-md">
          {course.title}
        </span>
      </nav>

      {/* ── Split-Screen Content Layout ─────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 xl:gap-12 items-start">
        {/* ── Main Column (Right in RTL, Left in LTR) ─────────────── */}
        <div className="flex-1 min-w-0 space-y-3.5 sm:space-y-7 w-full">
          {/* Top Badges (Desktop only, hidden on mobile for clean above-the-fold content) */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
            {/* Status Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{statusText}</span>
            </span>

            {/* Level Badge */}
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {levelText}
            </span>

            {/* Subject Badge */}
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
              {course.subject}
            </span>

            {/* Content Fallback Badge */}
            {isContentFallback && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-sans font-medium">
                <FaGlobe className="w-3 h-3" />
                <span>{t("availableEnglishOnly")}</span>
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2 sm:space-y-3.5">
            <h1
              dir={isTitleArabic ? "rtl" : "ltr"}
              className={`text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.3] font-heading ${
                isTitleArabic ? "font-arabic text-start" : "text-start"
              }`}
            >
              {course.title}
            </h1>
            <div>
              <p
                dir={isTitleArabic ? "rtl" : "ltr"}
                className={`text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed ${
                  !isDescExpanded ? "line-clamp-2 sm:line-clamp-none" : ""
                } ${isTitleArabic ? "font-arabic text-start" : "text-start"}`}
              >
                {course.description}
              </p>
              {course.description && course.description.length > 90 && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="sm:hidden text-primary hover:text-orange-400 text-xs font-bold mt-1 inline-flex items-center gap-1 transition-colors"
                >
                  {isDescExpanded ? t("showLess") : t("showMore")}
                </button>
              )}
            </div>
          </div>

          {/* Tags (Horizontal Scrolling with brand-colored scrollbar on mobile) */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto brand-scrollbar pb-2 pt-0.5 -mx-1 px-1">
              {course.tags.map((tg) => (
                <span
                  key={tg.id}
                  className="text-[11px] sm:text-xs font-mono px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 dark:bg-[#121c2e] text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-gray-800 shrink-0"
                >
                  <bdi dir="ltr">#{tg.name}</bdi>
                </span>
              ))}
            </div>
          )}


          {/* ── 3 Stat Cards in a row (3-columns on mobile) ─────────── */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 xl:gap-6">
            {/* Card 1: Lectures Count */}
            <div className="p-3 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-1.5 sm:gap-2 shadow-xs text-center sm:text-start">
              <div className="order-2 sm:order-1 min-w-0">
                <div className="text-base sm:text-2xl font-bold font-mono text-gray-900 dark:text-white">
                  {lectures.length}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {t("lecturesCount", { count: lectures.length })}
                </div>
              </div>
              <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 flex items-center justify-center text-primary shrink-0">
                <FaBookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Card 2: Total Reading Time */}
            <div className="p-3 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-1.5 sm:gap-2 shadow-xs text-center sm:text-start">
              <div className="order-2 sm:order-1 min-w-0">
                <div className="text-base sm:text-2xl font-bold font-mono text-gray-900 dark:text-white">
                  {course.total_reading_time} {t("minSuffix")}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {t("readingTimeShort")}
                </div>
              </div>
              <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 flex items-center justify-center text-primary shrink-0">
                <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Card 3: Level */}
            <div className="p-3 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-1.5 sm:gap-2 shadow-xs text-center sm:text-start">
              <div className="order-2 sm:order-1 min-w-0">
                <div className="text-base sm:text-2xl font-bold font-heading text-gray-900 dark:text-white truncate">
                  {levelText}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {t("levelTitle")}
                </div>
              </div>
              <div className="order-1 sm:order-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 flex items-center justify-center text-primary shrink-0">
                <FaChartBar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>

          {/* ── Curriculum / Lectures List ─────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>{t("courseOutline")}</span>
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {t("lecturesCount", { count: lectures.length })}
              </span>
            </div>

            {lectures.length === 0 ? (
              <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
                {t("noLecturesSoon")}
              </div>
            ) : (
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {lectures.map((lec, index) => {
                  const isDone = isLectureCompleted(lec);
                  const lectureNumber = (index + 1).toString().padStart(2, "0");

                  return (
                    <motion.div key={lec.id} variants={fadeInUp}>
                      <Link
                        href={`/courses/${course.slug}/${lec.slug}`}
                        className="block p-3.5 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c1424]/80 hover:bg-gray-50 dark:hover:bg-[#101b30] border border-gray-200/90 dark:border-gray-800/80 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 group shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Start: Number + Title & Description + Meta Badge */}
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold text-xs sm:text-sm shrink-0 border border-amber-500/20 group-hover:bg-primary group-hover:text-white transition-colors">
                              {lectureNumber}
                            </span>

                            <div className="space-y-1 min-w-0 flex-1">
                              <h3 className="font-heading font-bold text-sm sm:text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                {lec.title}
                              </h3>
                              {lec.description && (
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                                  {lec.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800/80 text-[10px] sm:text-[11px] font-mono text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60">
                                  <FaClock className="w-2.5 h-2.5 text-primary/70" />
                                  <span>{lec.reading_time} {t("minSuffix")}</span>
                                  <span className="text-gray-300 dark:text-gray-600">·</span>
                                  <span className={isDone ? "text-emerald-500 font-semibold" : "text-gray-400"}>
                                    {isDone ? t("completedPill") : t("notStartedPill")}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* End: Chevron */}
                          <div className="text-gray-400 group-hover:text-primary transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0 ms-1">
                            {isRtl ? (
                              <FaChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <FaChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* ── Mobile Metadata Card (lg:hidden) ───────────────────── */}
          <div className="lg:hidden p-5 rounded-3xl bg-white/90 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 dark:text-gray-400">
                {t("subjectLabel")}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {course.subject}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-800/60" />

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 dark:text-gray-400">
                {t("levelLabel")}
              </span>
              <span className="font-semibold text-blue-500 dark:text-blue-400">
                {levelText}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-gray-800/60" />

            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 dark:text-gray-400">
                {t("statusLabel")}
              </span>
              <span className="font-semibold text-amber-500">
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* ── Sticky Sidebar on Desktop (hidden lg:block) ─────────── */}
        <aside className="hidden lg:block lg:w-84 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0c1424]/90 border border-gray-200/90 dark:border-gray-800/90 backdrop-blur-xl shadow-xl space-y-6">
            {/* Top Subject / Cover Box */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform z-10">
                <FaGraduationCap className="w-8 h-8" />
              </div>
              <span className="mt-3 text-xs font-mono font-bold uppercase tracking-wider text-gray-900 dark:text-white z-10">
                {course.subject}
              </span>
            </div>

            {/* Progress Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("courseProgress")}
                </span>
                <span className="font-mono font-bold text-primary">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("completedLecturesOf", {
                  completed: completedCount,
                  total: lectures.length,
                })}
              </div>
            </div>

            {/* CTA Button */}
            {nextUncompletedLecture && (
              <div className="space-y-2 pt-1">
                <Link
                  href={`/courses/${course.slug}/${nextUncompletedLecture.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all group"
                >
                  <span>
                    {completedCount === 0
                      ? t("startCourseBtn")
                      : completedCount >= lectures.length
                      ? t("courseCompleted")
                      : t("continueCourseBtn")}
                  </span>
                  <FaArrowLeft
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${
                      !isRtl ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                <p className="text-[11px] text-center text-gray-500 dark:text-gray-400">
                  {completedCount === 0
                    ? t("readyToStartSub")
                    : completedCount >= lectures.length
                    ? t("allLecturesDoneSub")
                    : t("continueLearningSub")}
                </p>
              </div>
            )}

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-800/80" />

            {/* Metadata Details Table */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("subjectLabel")}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {course.subject}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("levelLabel")}
                </span>
                <span className="font-semibold text-blue-500 dark:text-blue-400">
                  {levelText}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t("statusLabel")}
                </span>
                <span className="font-semibold text-amber-500">
                  {statusText}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
