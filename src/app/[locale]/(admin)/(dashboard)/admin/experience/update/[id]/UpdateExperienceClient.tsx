"use client";

import React, { useState, useRef } from "react";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { updateExperianceAction } from "@/actions/experiance";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";

function parseInitialTranslatable(val: unknown): { en: string; ar: string } {
  if (!val) return { en: "", ar: "" };
  if (typeof val === "object") {
    const obj = val as Record<string, string>;
    return { en: obj.en || "", ar: obj.ar || "" };
  }
  const str = String(val);
  if (str.trim().startsWith("{") && str.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "object" && parsed !== null) {
        return { en: parsed.en || "", ar: parsed.ar || "" };
      }
    } catch {
      // ignore
    }
  }
  return { en: str, ar: "" };
}

function parseInitialTasks(val: unknown): { en: string[]; ar: string[] } {
  if (!val) return { en: [], ar: [] };
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, any>;
    const enTasks = Array.isArray(obj.en) ? obj.en.map(String) : [];
    const arTasks = Array.isArray(obj.ar) ? obj.ar.map(String) : [];
    return { en: enTasks, ar: arTasks };
  }
  if (Array.isArray(val)) {
    return { en: val.map(String), ar: [] };
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parseInitialTasks(parsed);
    } catch {
      return { en: [val], ar: [] };
    }
  }
  return { en: [], ar: [] };
}

interface ExperienceData {
  id: number;
  job_title: string | Record<string, string>;
  company: string | Record<string, string>;
  location: string | Record<string, string>;
  duration: string | Record<string, string>;
  tasks: string[] | Record<string, string[]>;
}

const EditExperienceForm = ({
  initialData,
}: {
  initialData: ExperienceData;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Translatable State Initialized with Data
  const [jobTitle, setJobTitle] = useState(parseInitialTranslatable(initialData.job_title));
  const [company, setCompany] = useState(parseInitialTranslatable(initialData.company));
  const [location, setLocation] = useState(parseInitialTranslatable(initialData.location));
  const [duration, setDuration] = useState(parseInitialTranslatable(initialData.duration));

  // Tasks Logic per language
  const [currentTask, setCurrentTask] = useState("");
  const [tasksByLang, setTasksByLang] = useState<{ en: string[]; ar: string[] }>(
    parseInitialTasks(initialData.tasks)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const formRef = useRef<HTMLFormElement>(null);

  const handleAddTask = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentTask.trim()) {
      setTasksByLang((prev) => ({
        ...prev,
        [activeLang]: [...(prev[activeLang] || []), currentTask.trim()],
      }));
      setCurrentTask("");
      setFieldErrors((prev) => ({ ...prev, tasks: [] }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const removeTask = (indexToRemove: number) => {
    setTasksByLang((prev) => ({
      ...prev,
      [activeLang]: (prev[activeLang] || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    if (!jobTitle.en.trim()) errors.job_title = ["Job Title (English) is required"];
    if (!company.en.trim()) errors.company = ["Company Name (English) is required"];
    if (!duration.en.trim()) errors.duration = ["Duration (English) is required"];
    if (!tasksByLang.en || tasksByLang.en.length === 0) {
      errors.tasks = ["Add at least one task/responsibility (English)"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("job_title[en]", jobTitle.en.trim());
      if (jobTitle.ar.trim()) formData.append("job_title[ar]", jobTitle.ar.trim());
      formData.append("company[en]", company.en.trim());
      if (company.ar.trim()) formData.append("company[ar]", company.ar.trim());
      formData.append("location[en]", location.en.trim());
      if (location.ar.trim()) formData.append("location[ar]", location.ar.trim());
      formData.append("duration[en]", duration.en.trim());
      if (duration.ar.trim()) formData.append("duration[ar]", duration.ar.trim());

      (tasksByLang.en || []).forEach((task) => {
        formData.append("tasks[en][]", task);
      });
      (tasksByLang.ar || []).forEach((task) => {
        formData.append("tasks[ar][]", task);
      });

      const result = await updateExperianceAction(initialData.id, formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Experience updated successfully!",
        });
      } else {
        setStatus({ type: "error", message: result.message });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const previewJobTitle = jobTitle[activeLang]?.trim() || jobTitle.en || "Job Title";
  const previewCompany = company[activeLang]?.trim() || company.en || "Company Name";
  const previewLocation = location[activeLang]?.trim() || location.en || "Cairo, Egypt";
  const previewDuration = duration[activeLang]?.trim() || duration.en || "Jan 2023 - Present";
  const currentTasksList = tasksByLang[activeLang] || [];
  const previewTasks = currentTasksList.length > 0 ? currentTasksList : tasksByLang.en || [];

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {status && (
        <div
          className={`fixed top-4 right-4 z-[9000] px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 ${
            status.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircleIcon className="w-6 h-6" />
          ) : (
            <XCircleIcon className="w-6 h-6" />
          )}
          <span className="font-bold">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* === Left: Input Form === */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 relative z-10">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <PencilSquareIcon className="w-6 h-6" />
            </span>
            Edit Experience
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Language Tabs */}
            <LanguageTabs
              activeLang={activeLang}
              onChange={setActiveLang}
              completion={{
                en: Boolean(jobTitle.en.trim() && company.en.trim() && duration.en.trim() && (tasksByLang.en?.length || 0) > 0),
                ar: Boolean(jobTitle.ar.trim() && company.ar.trim() && duration.ar.trim() && (tasksByLang.ar?.length || 0) > 0),
              }}
              hasErrors={{
                en: Boolean(fieldErrors.job_title || fieldErrors.company || fieldErrors.duration || fieldErrors.tasks),
                ar: false,
              }}
            />

            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Job Title ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <div className="relative group">
                <BriefcaseIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={jobTitle[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setJobTitle((prev) => ({ ...prev, [activeLang]: e.target.value }));
                    if (fieldErrors.job_title) setFieldErrors((prev) => ({ ...prev, job_title: [] }));
                  }}
                  placeholder={activeLang === "ar" ? "مثال: كبير مطوري الويب" : "e.g. Senior Frontend Developer"}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.job_title && (
                <p className="text-red-500 text-xs ms-1">{fieldErrors.job_title[0]}</p>
              )}
            </div>

            {/* Company & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                  Company ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
                </label>
                <div className="relative group">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={company[activeLang]}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    onChange={(e) => {
                      setCompany((prev) => ({ ...prev, [activeLang]: e.target.value }));
                      if (fieldErrors.company) setFieldErrors((prev) => ({ ...prev, company: [] }));
                    }}
                    placeholder={activeLang === "ar" ? "مثال: حلول التقنية المتقدمة" : "e.g. Tech Solutions Inc."}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.company && (
                  <p className="text-red-500 text-xs ms-1">{fieldErrors.company[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                  Location ({activeLang.toUpperCase()})
                </label>
                <div className="relative group">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={location[activeLang]}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    onChange={(e) => setLocation((prev) => ({ ...prev, [activeLang]: e.target.value }))}
                    placeholder={activeLang === "ar" ? "القاهرة، مصر (عن بعد)" : "e.g. Cairo, Egypt (Remote)"}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Duration ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={duration[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setDuration((prev) => ({ ...prev, [activeLang]: e.target.value }));
                    if (fieldErrors.duration) setFieldErrors((prev) => ({ ...prev, duration: [] }));
                  }}
                  placeholder={activeLang === "ar" ? "مثال: سبتمبر 2025 - أبريل 2026" : "e.g. Sep 2025 – Apr 2026"}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.duration && (
                <p className="text-red-500 text-xs ms-1">{fieldErrors.duration[0]}</p>
              )}
            </div>

            {/* Tasks Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Key Responsibilities / Tasks ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ListBulletIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={currentTask}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={activeLang === "ar" ? "اكتب المهمة واضغط Enter..." : "Type task & press Enter..."}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 p-4 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
              {fieldErrors.tasks && (
                <p className="text-red-500 text-xs ms-1">{fieldErrors.tasks[0]}</p>
              )}

              {/* Tasks List Display */}
              <div className="space-y-2 mt-4 min-h-[50px] p-4 bg-gray-50/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                {currentTasksList.length === 0 && (
                  <span className="text-gray-400 text-sm italic w-full text-center block py-2">
                    {activeLang === "ar" ? "لم تتم إضافة مهام بالعربية بعد." : "No tasks added yet."}
                  </span>
                )}
                {currentTasksList.map((task, index) => (
                  <div
                    key={index}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-lg shadow-sm animate-in fade-in duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{task}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>Update Experience</>
              )}
            </button>
          </form>
        </div>

        {/* === Right: Live Preview === */}
        <div className="sticky top-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" /> Live Preview ({activeLang.toUpperCase()})
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              Updated View
            </span>
          </div>

          <div
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800/60 pb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {previewJobTitle}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-semibold text-primary">{previewCompany}</span>
                  <span>•</span>
                  <span>{previewLocation}</span>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {previewDuration || "Duration"}
              </span>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Responsibilities:
              </h5>
              {previewTasks.length > 0 ? (
                previewTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{task}</p>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExperienceForm;
