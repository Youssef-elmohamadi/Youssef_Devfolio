"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaGraduationCap,
  FaBriefcase,
  FaUniversity,
  FaVolumeUp,
  FaChevronDown,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCode,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  fadeInUp,
  fadeInDown,
  fadeIn,
} from "@/utils/animations";
import { unwrapField } from "@/utils/slug";
import LocationMap from "../components/LocationMap";

// --- Subcomponents ---
function CairoTime() {
  const locale = useLocale();
  const [time, setTime] = useState<string>("");

  React.useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  if (!time) {
    return (
      <span className="text-gray-900 dark:text-white font-bold text-lg sm:text-xl opacity-0">
        00:00 AM
      </span>
    );
  }

  return (
    <span className="text-gray-900 dark:text-white font-bold text-lg sm:text-xl font-mono">
      {time}
    </span>
  );
}

// --- Interfaces ---
interface Skill {
  id: number;
  title: string;
  icon: string;
  skills: string[];
}

interface Experience {
  id: number;
  job_title: string | Record<string, string>;
  company: string | Record<string, string>;
  location: string | Record<string, string>;
  duration: string | Record<string, string>;
  tasks: string[] | Record<string, string[]>;
}

interface Education {
  id: number;
  degree: string | Record<string, string>;
  university: string | Record<string, string>;
  location: string | Record<string, string>;
  duration: string | Record<string, string>;
  grade?: string | Record<string, string>;
  description?: string | Record<string, string>;
}

interface AboutData {
  about: {
    title: string | Record<string, string>;
    description: string | Record<string, string>;
    image_url?: string;
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

interface AboutClientProps {
  data: AboutData;
}

export default function AboutClient({ data }: AboutClientProps) {
  const t = useTranslations("about");
  const locale = useLocale();
  const { about, skills = [], experience = [], education = [] } = data;

  // 1. Sort Experience newest to oldest (Sep 2025 – Present first)
  const sortedExperience = [...experience].sort((a, b) => {
    const aDur = (unwrapField(a.duration, locale) || "").toLowerCase();
    const bDur = (unwrapField(b.duration, locale) || "").toLowerCase();
    const aIsPresent = aDur.includes("present") || aDur.includes("حالي") || aDur.includes("الآن");
    const bIsPresent = bDur.includes("present") || bDur.includes("حالي") || bDur.includes("الآن");
    if (aIsPresent && !bIsPresent) return -1;
    if (!aIsPresent && bIsPresent) return 1;
    return b.id - a.id;
  });

  // Accordion state for experience bullets
  const [openExpId, setOpenExpId] = useState<number | null>(
    sortedExperience[0]?.id ?? null
  );

  const toggleAccordion = (id: number) => {
    setOpenExpId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container max-w-[1440px] md:pt-24 mx-auto py-12 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <motion.h1
        className="text-section font-bold mb-8 text-center text-gray-900 dark:text-white"
        {...fadeInDown}
      >
        {t("title")}
      </motion.h1>

      {/* =========================================================================
          1) INTRO SECTION: Photo Start + Text End on Large Screens, Stacked Mobile
             + Small Stats Row (Years experience, Projects built, Technologies)
         ========================================================================= */}
      <motion.section
        className="mb-16 p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-300 dark:border-gray-800 shadow-sm"
        {...fadeInUp}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Profile Photo */}
          {about.image_url && (
            <div className="relative shrink-0">
              <Image
                src={about.image_url}
                alt={unwrapField(about.title, locale) || "Youssef Elmohamadi"}
                width={200}
                height={200}
                className="rounded-2xl w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-cover ring-4 ring-primary/20 shadow-xl"
                priority
              />
            </div>
          )}

          {/* Intro Text */}
          <div className="flex flex-col justify-between flex-grow text-center md:text-start">
            <div>
              <h2 className="text-section font-heading font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                {unwrapField(about.title, locale) || "Hi there!"}
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                {unwrapField(about.description, locale)}
              </p>
            </div>

            {/* Small Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {t("stats.yearsValue")}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("stats.yearsExperience")}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {t("stats.projectsValue")}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("stats.projectsBuilt")}
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {skills.reduce((acc, g) => acc + (g.skills?.length || 0), 0) > 0
                    ? `${skills.reduce((acc, g) => acc + (g.skills?.length || 0), 0)}+`
                    : "15+"}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("stats.technologies")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          2) FUN FACTS BENTO GRID:
             - 4 columns on desktop, 2 on tablet, 1 on mobile
             - LocationMap takes col-span-2 row-span-2
             - Equal padding, border-radius, and height on cards
         ========================================================================= */}
      <motion.section className="mb-20" {...fadeIn} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Bento Item 1: Location Map (2 Cols x 2 Rows on Desktop) */}
          <div className="lg:col-span-2 lg:row-span-2 md:col-span-2 h-full flex flex-col">
            <LocationMap />
          </div>

          {/* Bento Item 2: Pronunciation */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/30 flex flex-col justify-center text-center gap-2 min-h-[170px]">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-serif tracking-wide text-gray-900 dark:text-white">
                {t("bento.pronunciation.name")}
              </span>
              <button
                onClick={() => {
                  const u = new SpeechSynthesisUtterance("Youssef");
                  u.lang = locale === "ar" ? "ar-EG" : "en-US";
                  window.speechSynthesis.speak(u);
                }}
                className="text-primary hover:scale-110 transition-transform focus:outline-none p-2 rounded-full hover:bg-primary/10"
                aria-label={t("bento.pronunciation.ariaListen")}
                title={t("bento.pronunciation.clickToListen")}
              >
                <FaVolumeUp className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-medium">
              {t("bento.pronunciation.pronounced")}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-[11px]">
              {t("bento.pronunciation.clickToListen")}
            </p>
          </div>

          {/* Bento Item 3: Height */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/30 flex items-center gap-4 min-h-[170px]">
            <div className="shrink-0 w-12 h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2">
              <svg
                viewBox="0 0 100 200"
                className="w-full h-full stroke-gray-900 dark:stroke-white fill-none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="50" cy="30" r="20" />
                <line x1="50" y1="50" x2="50" y2="130" />
                <line x1="50" y1="70" x2="20" y2="110" />
                <line x1="50" y1="70" x2="80" y2="110" />
                <line x1="50" y1="130" x2="25" y2="190" />
                <line x1="50" y1="130" x2="75" y2="190" />
              </svg>
            </div>
            <div className="text-start space-y-1">
              <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold">
                {t("bento.height.title")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {t("bento.height.subtitle")}
              </p>
            </div>
          </div>

          {/* Bento Item 4: Cat (Overflow Fixed) */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/30 flex items-center gap-4 overflow-hidden min-h-[170px]">
            <div
              className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 cursor-pointer hover:rotate-6 hover:scale-110 transition-transform bg-primary/10 rounded-2xl p-2 flex items-center justify-center"
              onClick={() => {
                const u = new SpeechSynthesisUtterance("Meow! Meow!");
                u.pitch = 2;
                u.rate = 1.2;
                window.speechSynthesis.speak(u);
              }}
              title={t("bento.cat.ariaMeow")}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <g transform="rotate(10 50 50)">
                  <path
                    d="M 65,95 Q 85,95 85,80 Q 70,80 65,85"
                    fill="#fff"
                    stroke="#1f2937"
                    strokeWidth="3"
                  />
                  <path
                    d="M 12,38 L 8,10 L 38,18 Z"
                    fill="#fff"
                    stroke="#1f2937"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path d="M 15,33 L 13,16 L 31,21 Z" fill="#ffd1dc" />
                  <path
                    d="M 62,18 L 92,10 L 88,38 Z"
                    fill="#fff"
                    stroke="#1f2937"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path d="M 65,22 L 85,16 L 82,34 Z" fill="#ffd1dc" />
                  <ellipse
                    cx="50"
                    cy="55"
                    rx="42"
                    ry="34"
                    fill="#fff"
                    stroke="#1f2937"
                    strokeWidth="3"
                  />
                  <circle cx="68" cy="45" r="5" fill="#1f2937" />
                  <circle cx="69" cy="43" r="1.5" fill="#fff" />
                  <path
                    d="M 28,34 L 33,43 L 43,44 L 35,51 L 38,61 L 28,55 L 18,61 L 21,51 L 13,44 L 23,43 Z"
                    fill="#facc15"
                    stroke="#1f2937"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="28" cy="48" r="3.5" fill="#1f2937" />
                  <circle cx="29" cy="46" r="1.5" fill="#fff" />
                  <path
                    d="M 45,60 Q 50,65 50,60 Q 50,65 55,60"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            <div className="text-start space-y-1">
              <p className="text-gray-900 dark:text-white text-xs sm:text-sm font-medium leading-relaxed">
                {t("bento.cat.title")}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                {t("bento.cat.subtitle")}
              </p>
            </div>
          </div>

          {/* Bento Item 5: Proud Muslim */}
          <div className="bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary/30 flex items-center gap-4 min-h-[170px]">
            <div className="shrink-0">
              <Image
                src="/muslim_cat.png"
                alt="Muslim Cat Mascot"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shadow-sm"
              />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg">
                {t("bento.proudMuslim.title")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mt-0.5">
                {t("bento.proudMuslim.subtitle")}
              </p>
            </div>
          </div>

          {/* Bento Item 6: Status & Cairo Time Banner (Full width on Desktop, Top on Mobile) */}
          <div className="order-first md:order-last lg:order-last lg:col-span-4 md:col-span-2 bg-white dark:bg-dark/50 p-6 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-start gap-2.5 sm:gap-4">
              <div className="relative flex h-4 w-4 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
              </div>
              <div className="text-center sm:text-start">
                <h3 className="text-gray-900 dark:text-white font-bold text-base">
                  {t("bento.availableForWork.title")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  {t("bento.availableForWork.subtitle")}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-end ps-0 sm:ps-6 sm:border-s border-gray-100 dark:border-gray-800">
              <p className="text-gray-400 dark:text-gray-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                {t("bento.availableForWork.cairoTime")}
              </p>
              <CairoTime />
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          3) SKILLS SECTION:
             - 3 Balanced groups (Frontend / Backend & Programming / Tools)
             - Rounded Chips / Badges with subtle background, thin border,
                and hover effect in primary orange.
         ========================================================================= */}
      <motion.section className="mb-20" {...fadeIn} transition={{ delay: 0.25 }}>
        <h2 className="text-section font-heading font-bold mb-3 tracking-tight text-center text-gray-900 dark:text-white">
          {t("skills.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto text-center leading-relaxed mb-10">
          {t("skills.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillGroup) => (
            <motion.div
              key={skillGroup.id || skillGroup.title}
              className="bg-white dark:bg-dark/50 p-6 sm:p-7 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:border-primary/30 flex flex-col h-full shadow-xs"
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800/80">
                {skillGroup.icon ? (
                  <div
                    className="w-10 h-10 p-2 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current [&>svg]:stroke-current"
                    dangerouslySetInnerHTML={{ __html: skillGroup.icon }}
                  />
                ) : (
                  <div className="w-10 h-10 p-2.5 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FaCode className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                    {skillGroup.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {t("skills.competencies", { count: skillGroup.skills?.length || 0 })}
                  </p>
                </div>
              </div>

              {/* Chips / Badges Grid */}
              <div className="flex flex-wrap gap-2.5">
                {skillGroup.skills && skillGroup.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/60 hover:border-primary hover:text-primary dark:hover:text-primary dark:hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-default select-none shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* =========================================================================
          4 & 5) EXPERIENCE & EDUCATION (Merged in one cohesive section):
             - 2 columns on desktop (Experience left, Education right), stacked mobile
             - Sorted newest to oldest (Sep 2025 – Present first)
             - Accordion with Framer Motion for tasks
             - "Current" badge for active position
             - Education with placeholder removed & clean academic description
         ========================================================================= */}
      <motion.section {...fadeIn} transition={{ delay: 0.35 }}>
        <h2 className="text-section font-heading font-bold mb-3 tracking-tight text-center text-gray-900 dark:text-white">
          {t("experienceEducation.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto text-center leading-relaxed mb-10">
          {t("experienceEducation.subtitle")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Experience (7 Cols on Desktop) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-heading font-bold text-xl mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FaBriefcase className="h-4 w-4" />
              </div>
              <h3>{t("experienceEducation.experienceTitle")}</h3>
            </div>

            {sortedExperience.map((exp) => {
              const jobTitleStr = unwrapField(exp.job_title, locale);
              const companyStr = unwrapField(exp.company, locale);
              const locationStr = unwrapField(exp.location, locale);
              const durationStr = unwrapField(exp.duration, locale);
              const isCurrent =
                durationStr?.toLowerCase().includes("present") ||
                durationStr?.includes("حالي") ||
                durationStr?.includes("الآن");
              const isOpen = openExpId === exp.id;

              const rawTasks = exp.tasks;
              const tasksList: string[] = Array.isArray(rawTasks)
                ? rawTasks
                : (rawTasks && typeof rawTasks === "object"
                    ? ((rawTasks as any)[locale] || (rawTasks as any).en || [])
                    : []);

              return (
                <motion.div
                  key={exp.id}
                  className="bg-white dark:bg-dark/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-xs"
                  variants={fadeInUp}
                >
                  {/* Top Bar: Title + Badges */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                          {jobTitleStr}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t("experienceEducation.current")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary mt-0.5">
                        {companyStr}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg shrink-0">
                      <FaCalendarAlt className="text-primary/70" />
                      <span>{durationStr}</span>
                    </div>
                  </div>

                  {/* Location Meta */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-4">
                    <FaMapMarkerAlt />
                    <span>{locationStr}</span>
                  </div>

                  {/* Accordion Trigger Button */}
                  {tasksList.length > 0 && (
                    <>
                      <button
                        onClick={() => toggleAccordion(exp.id)}
                        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors border-t border-gray-100 dark:border-gray-800/80 pt-3"
                      >
                        <span>
                          {isOpen ? t("experienceEducation.hideResponsibilities") : t("experienceEducation.viewResponsibilities")} (
                          {tasksList.length})
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaChevronDown className="h-3 w-3" />
                        </motion.div>
                      </button>

                      {/* Accordion Body */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 pt-3 text-sm text-slate-600 dark:text-slate-400">
                              {tasksList.map((task, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                  <span className="leading-relaxed">{task}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Education (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-heading font-bold text-xl mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FaGraduationCap className="h-4 w-4" />
              </div>
              <h3>{t("experienceEducation.educationTitle")}</h3>
            </div>

            {education.map((edu) => {
              const rawDesc = unwrapField(edu.description, locale);
              const cleanDescription =
                rawDesc &&
                !rawDesc.toLowerCase().includes("brief description")
                  ? rawDesc
                  : t("experienceEducation.fallbackEduDescription");

              const degreeTitle = unwrapField(edu.degree, locale);
              const uniName = unwrapField(edu.university, locale);
              const locName = unwrapField(edu.location, locale);
              const durationStr = unwrapField(edu.duration, locale);
              const gradeStr = unwrapField(edu.grade, locale);

              return (
                <motion.div
                  key={edu.id}
                  className="bg-white dark:bg-dark/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-xs"
                  variants={fadeInUp}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                      {degreeTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <FaUniversity className="text-primary shrink-0" />
                    <span>
                      {uniName}{locName ? `, ${locName}` : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {durationStr && (
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-2.5 py-1 rounded-md">
                        {durationStr}
                      </span>
                    )}
                    {gradeStr && (
                      <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-md">
                        {t("experienceEducation.grade", { grade: gradeStr })}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {cleanDescription}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
