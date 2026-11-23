"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaBookOpen,
  FaTimes,
  FaFilter,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
  FaPlus,
  FaArrowLeft,
  FaSlidersH,
} from "react-icons/fa";
import { fadeInUp, staggerContainer, cardHoverSmall } from "@/utils/animations";
import { CustomFilterSelect, type CustomSelectOption } from "@/components/CustomFilterSelect";
import type {
  CourseCard,
  PaginationMeta,
  CoursesFilterMetadata,
  CourseLevel,
  CourseStatus,
} from "@/types/courses";

interface CoursesClientPageProps {
  initialCourses: CourseCard[];
  meta: PaginationMeta;
  filtersMetadata: CoursesFilterMetadata;
  currentParams: {
    subject?: string;
    tag?: string;
    level?: string;
    status?: string;
    search?: string;
    sort?: "latest" | "oldest" | "title";
    page?: string;
  };
}

const LEVEL_COLORS: Record<CourseLevel, string> = {
  beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  advanced: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

const STATUS_COLORS: Record<CourseStatus, string> = {
  ongoing: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  completed: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
};

// Course Card Item matching the horizontal reference layout
function CourseCardItem({
  course,
  isRtl,
  t,
}: {
  course: CourseCard;
  isRtl: boolean;
  t: any;
}) {
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const primaryKey = `course_progress_${course.id}`;
      const legacyKey = `course_progress_${course.slug}`;
      const stored = localStorage.getItem(primaryKey) || localStorage.getItem(legacyKey);
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          setCompletedCount(arr.length);
        }
      }
    } catch {
      // ignore
    }
  }, [course.id, course.slug]);

  const total = course.lectures_count || 0;
  const progressPercent = total > 0 ? Math.min(100, Math.round((completedCount / total) * 100)) : 0;
  const hasStarted = completedCount > 0;
  const isCompleted = total > 0 && completedCount >= total;

  let progressLabel = t("notStarted", { completed: 0, total });
  if (isCompleted) {
    progressLabel = t("completedAll", { completed: total, total });
  } else if (hasStarted) {
    progressLabel = t("inProgress", { completed: completedCount, total });
  }

  return (
    <motion.article
      variants={fadeInUp}
      {...cardHoverSmall}
      className="rounded-3xl border border-gray-200/90 dark:border-gray-800/90 bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-md p-5 sm:p-6 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch relative overflow-hidden group shadow-sm hover:shadow-xl dark:shadow-none"
    >
      {/* Visual / Image Section (on mobile: displayed first / top; on desktop: sm:order-2 or right side) */}
      <div className="order-1 sm:order-2 sm:w-44 md:w-48 shrink-0 flex flex-col items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111c30] dark:to-[#0c1424] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        {/* Status badge top */}
        <div className="w-full flex justify-end">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {course.status === "ongoing"
              ? t("statuses.ongoing")
              : course.status === "completed"
              ? t("statuses.completed")
              : course.status}
          </span>
        </div>

        {/* Visual center */}
        <div className="my-auto py-3 flex flex-col items-center text-center">
          {course.cover_image ? (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-primary/20">
              <Image
                src={course.cover_image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <FaGraduationCap className="w-8 h-8" />
            </div>
          )}
          <span className="mt-3 text-xs font-mono font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            {course.subject}
          </span>
        </div>
      </div>

      {/* Content Section (on mobile: displayed second / below image; on desktop: flex-1 sm:order-1) */}
      <div className="order-2 sm:order-1 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div>
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${LEVEL_COLORS[course.level]}`}
            >
              {course.level === "beginner"
                ? t("levels.beginner")
                : course.level === "intermediate"
                ? t("levels.intermediate")
                : course.level === "advanced"
                ? t("levels.advanced")
                : course.level}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {course.subject}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-heading font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
            <Link href={`/courses/${course.slug}`}>{course.title}</Link>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Tags & Meta Row */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {course.tags?.slice(0, 4).map((tg) => (
              <span key={tg.id} className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                <bdi dir="ltr">#{tg.name}</bdi>
              </span>
            ))}
            <span className="ms-auto flex items-center gap-1 font-mono text-[11px] text-primary">
              <FaBookOpen className="w-3 h-3 text-primary/70" />
              <span>{t("lecturesCount", { count: course.lectures_count })}</span>
            </span>
          </div>

          {/* Progress & CTA row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800/60">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-primary/20 transition-all shrink-0"
            >
              <span>{hasStarted ? t("continueCourse") : t("startCourse")}</span>
              <FaArrowLeft className={`w-3.5 h-3.5 ${isRtl ? "" : "rotate-180"}`} />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mb-1">
                {progressLabel}
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function CoursesClientPage({
  initialCourses,
  meta,
  filtersMetadata,
  currentParams,
}: CoursesClientPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("courses");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(currentParams.search || "");
  const [selectedSubject, setSelectedSubject] = useState(currentParams.subject || "");
  const [selectedTag, setSelectedTag] = useState(currentParams.tag || "");
  const [selectedLevel, setSelectedLevel] = useState(currentParams.level || "");
  const [selectedStatus, setSelectedStatus] = useState(currentParams.status || "");
  const [selectedSort, setSelectedSort] = useState(currentParams.sort || "latest");

  // Mobile Filter Bottom Sheet State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [tempLevel, setTempLevel] = useState(selectedLevel);
  const [tempStatus, setTempStatus] = useState(selectedStatus);
  const [tempSort, setTempSort] = useState(selectedSort);

  useEffect(() => {
    if (isMobileFilterOpen) {
      setTempLevel(selectedLevel);
      setTempStatus(selectedStatus);
      setTempSort(selectedSort);
    }
  }, [isMobileFilterOpen, selectedLevel, selectedStatus, selectedSort]);

  const handleApplyMobileFilters = () => {
    setSelectedLevel(tempLevel);
    setSelectedStatus(tempStatus);
    setSelectedSort(tempSort);
    updateURL({
      level: tempLevel,
      status: tempStatus,
      sort: tempSort,
    });
    setIsMobileFilterOpen(false);
  };

  const handleClearMobileFilters = () => {
    setTempLevel("");
    setTempStatus("");
    setTempSort("latest");
  };

  // Keep state synced with currentParams if URL changes externally
  useEffect(() => {
    setSearchTerm(currentParams.search || "");
    setSelectedSubject(currentParams.subject || "");
    setSelectedTag(currentParams.tag || "");
    setSelectedLevel(currentParams.level || "");
    setSelectedStatus(currentParams.status || "");
    setSelectedSort(currentParams.sort || "latest");
  }, [currentParams]);

  // Push URL updates
  const updateURL = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    const merged = {
      subject: selectedSubject,
      tag: selectedTag,
      level: selectedLevel,
      status: selectedStatus,
      search: searchTerm,
      sort: selectedSort,
      page: "1", // reset to page 1 on filter changes
      ...overrides,
    };

    Object.entries(merged).forEach(([k, v]) => {
      if (v && v.trim()) {
        params.set(k, v.trim());
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounced search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (currentParams.search || "")) {
        updateURL({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubjectClick = (subj: string) => {
    const next = selectedSubject === subj ? "" : subj;
    setSelectedSubject(next);
    updateURL({ subject: next });
  };

  const handleTagClick = (tagSlug: string) => {
    const next = selectedTag === tagSlug ? "" : tagSlug;
    setSelectedTag(next);
    updateURL({ tag: next });
  };

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    updateURL({ level: lvl });
  };

  const handleStatusChange = (st: string) => {
    setSelectedStatus(st);
    updateURL({ status: st });
  };

  const handleSortChange = (sort: "latest" | "oldest" | "title") => {
    setSelectedSort(sort);
    updateURL({ sort });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedTag("");
    setSelectedLevel("");
    setSelectedStatus("");
    setSelectedSort("latest");

    startTransition(() => {
      router.push(pathname);
    });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage.toString() });
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
      selectedSubject ||
      selectedTag ||
      selectedLevel ||
      selectedStatus ||
      (selectedSort && selectedSort !== "latest")
  );

  // Localized level options with color indicators
  const levelOptions: CustomSelectOption[] = [
    { value: "", label: t("allLevels") },
    ...filtersMetadata.levels.map((lvl) => {
      let localizedLabel = lvl.label;
      let dotColor = "bg-blue-500";
      const normVal = (lvl.value || "").toLowerCase();
      if (normVal === "beginner") {
        localizedLabel = t("levels.beginner");
        dotColor = "bg-emerald-500";
      } else if (normVal === "intermediate") {
        localizedLabel = t("levels.intermediate");
        dotColor = "bg-blue-500";
      } else if (normVal === "advanced") {
        localizedLabel = t("levels.advanced");
        dotColor = "bg-purple-500";
      }
      return {
        value: lvl.value,
        label: localizedLabel,
        count: lvl.count,
        dotColor,
      };
    }),
  ];

  // Localized status options with color indicators
  const statusOptions: CustomSelectOption[] = [
    { value: "", label: t("allStatuses") },
    ...filtersMetadata.statuses.map((st) => {
      let localizedLabel = st.label;
      let dotColor = "bg-amber-500";
      const normVal = (st.value || "").toLowerCase();
      if (normVal === "ongoing") {
        localizedLabel = t("statuses.ongoing");
        dotColor = "bg-amber-500";
      } else if (normVal === "completed") {
        localizedLabel = t("statuses.completed");
        dotColor = "bg-teal-500";
      }
      return {
        value: st.value,
        label: localizedLabel,
        count: st.count,
        dotColor,
      };
    }),
  ];

  // Sort options
  const sortOptions: CustomSelectOption[] = [
    { value: "latest", label: t("sortNewest") },
    { value: "oldest", label: t("sortOldest") },
    { value: "title", label: t("sortTitle") },
  ];

  const totalLectures = initialCourses.reduce(
    (acc, c) => acc + (c.lectures_count || 0),
    0
  );

  return (
    <div className="space-y-8 sm:space-y-10 max-w-[1440px] mx-auto">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 shadow-xs">
          <FaGraduationCap className="w-4 h-4" />
          <span>{t("curriculumBadge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t("title")}
        </h1>
      </div>

      {/* ── Unified Filters Box (Clean & Uncluttered) ────────────── */}
      <div className="bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-xl rounded-2xl border border-gray-200/90 dark:border-gray-800/90 p-4 sm:p-5 shadow-xl space-y-4">
        {/* Row 1: Search + Select Dropdowns (Desktop) / Filter Button (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search Box + Mobile Filter Button */}
          <div className="lg:col-span-5 flex items-center gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full ps-10 pe-9 py-2.5 rounded-xl bg-gray-50/90 dark:bg-[#121c2e]/80 border border-gray-200/90 dark:border-gray-700/80 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button (Visible only on mobile/tablet < lg) */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label={t("filtersModalTitle")}
              className="lg:hidden flex items-center justify-center w-11 h-10 rounded-xl bg-gray-50/90 dark:bg-[#121c2e]/80 border border-gray-200/90 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:text-primary hover:border-primary transition-colors shrink-0 relative"
            >
              <FaSlidersH className="w-4 h-4" />
              {(selectedLevel || selectedStatus || (selectedSort && selectedSort !== "latest")) && (
                <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#0c1424]" />
              )}
            </button>
          </div>

          {/* Level Dropdown (Desktop) */}
          <div className="hidden lg:block lg:col-span-2">
            <CustomFilterSelect
              value={selectedLevel}
              onChange={handleLevelChange}
              options={levelOptions}
              placeholder={t("allLevels")}
              ariaLabel={t("allLevels")}
            />
          </div>

          {/* Status Dropdown (Desktop) */}
          <div className="hidden lg:block lg:col-span-2">
            <CustomFilterSelect
              value={selectedStatus}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder={t("allStatuses")}
              ariaLabel={t("allStatuses")}
            />
          </div>

          {/* Sort Dropdown (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <CustomFilterSelect
              value={selectedSort}
              onChange={(val) => handleSortChange(val as any)}
              options={sortOptions}
              placeholder={t("sortNewest")}
              ariaLabel={t("sortNewest")}
            />
          </div>
        </div>
      </div>

      {/* Results Meta & Reset */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>{t("showingResults", { count: initialCourses.length, total: meta.total })}</span>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <FaTimes className="w-3 h-3" />
            <span>{t("resetFilters")}</span>
          </button>
        )}
      </div>

      {/* ── Courses Grid ─────────────────────────────────────────── */}
      {initialCourses.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-dark/50 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <FaBookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white">
            {t("noCourses")}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            {t("noCoursesDesc")}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              <FaTimes className="w-3.5 h-3.5" />
              <span>{t("resetFilters")}</span>
            </button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {initialCourses.map((course) => (
            <CourseCardItem key={course.id} course={course} isRtl={isRtl} t={t} />
          ))}

          {/* "More courses soon" placeholder card matching the design */}
          <motion.div
            variants={fadeInUp}
            className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800/80 hover:border-primary/40 bg-gray-50/50 dark:bg-[#0c1424]/40 p-6 flex flex-col items-center justify-center text-center min-h-[240px] transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary group-hover:scale-110 flex items-center justify-center mb-3 transition-all shadow-xs">
              <FaPlus className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base mb-1">
              {t("moreCoursesSoon")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
              {t("moreCoursesSoonDesc")}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(meta.current_page - 1)}
            disabled={meta.current_page <= 1 || isPending}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous Page"
          >
            {isRtl ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
          </button>

          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={isPending}
              className={`w-10 h-10 rounded-xl font-mono text-sm font-semibold transition-all ${
                pageNum === meta.current_page
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark text-gray-700 dark:text-gray-300 hover:border-primary"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(meta.current_page + 1)}
            disabled={meta.current_page >= meta.last_page || isPending}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark text-gray-600 dark:text-gray-300 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next Page"
          >
            {isRtl ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* ── Mobile Filter Bottom Sheet Modal (Image 2) ─────────── */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Bottom Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 w-full rounded-t-3xl bg-[#0c1424] border-t border-gray-800 p-6 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-gray-700/80 mx-auto -mt-1" />

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    aria-label="Close"
                    className="w-9 h-9 rounded-full bg-[#121c2e] hover:bg-gray-800 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleClearMobileFilters}
                    className="text-xs font-semibold text-primary hover:text-orange-400 transition-colors"
                  >
                    {t("clearAll")}
                  </button>
                </div>

                <h3 className="font-heading font-bold text-lg text-white">
                  {t("filtersModalTitle")}
                </h3>
              </div>

              {/* Section 1: Level */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400">
                  {t("filterLevelTitle")}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempLevel("")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempLevel === ""
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("allSubjectsPill")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempLevel("beginner")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempLevel === "beginner"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("levels.beginner")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempLevel("intermediate")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempLevel === "intermediate"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("levels.intermediate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempLevel("advanced")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempLevel === "advanced"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("levels.advanced")}
                  </button>
                </div>
              </div>

              {/* Section 2: Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400">
                  {t("filterStatusTitle")}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempStatus("")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempStatus === ""
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("allSubjectsPill")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStatus("ongoing")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempStatus === "ongoing"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("statuses.ongoing")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStatus("completed")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempStatus === "completed"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("statuses.completed")}
                  </button>
                </div>
              </div>

              {/* Section 3: Sort */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-400">
                  {t("filterSortTitle")}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTempSort("latest")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempSort === "latest"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("sortNewest")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempSort("oldest")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempSort === "oldest"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("sortOldest")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempSort("title")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      tempSort === "title"
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-[#121c2e] text-gray-300 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {t("sortName")}
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleApplyMobileFilters}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all text-center mt-2"
              >
                {t("showResults", { count: meta.total })}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
