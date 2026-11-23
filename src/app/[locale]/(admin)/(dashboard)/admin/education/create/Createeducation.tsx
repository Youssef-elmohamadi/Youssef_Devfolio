"use client";

import React, { useState, useRef } from "react";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TrophyIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { createEduecationAction } from "@/actions/education";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";

const CreateEducationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Translatable State
  const [degree, setDegree] = useState({ en: "", ar: "" });
  const [university, setUniversity] = useState({ en: "", ar: "" });
  const [location, setLocation] = useState({ en: "", ar: "" });
  const [description, setDescription] = useState({ en: "", ar: "" });

  // Non-translatable State
  const [duration, setDuration] = useState("");
  const [grade, setGrade] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    if (!degree.en.trim()) errors.degree = ["Degree title (English) is required"];
    if (!university.en.trim()) errors.university = ["University / Institute (English) is required"];
    if (!duration.trim()) errors.duration = ["Duration is required"];

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
      formData.append("degree[en]", degree.en.trim());
      if (degree.ar.trim()) formData.append("degree[ar]", degree.ar.trim());
      formData.append("university[en]", university.en.trim());
      if (university.ar.trim()) formData.append("university[ar]", university.ar.trim());
      formData.append("location[en]", location.en.trim());
      if (location.ar.trim()) formData.append("location[ar]", location.ar.trim());
      formData.append("description[en]", description.en.trim());
      if (description.ar.trim()) formData.append("description[ar]", description.ar.trim());

      formData.append("duration", duration.trim());
      if (grade.trim()) formData.append("grade", grade.trim());

      const result = await createEduecationAction(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Education added successfully!",
        });
        setDegree({ en: "", ar: "" });
        setUniversity({ en: "", ar: "" });
        setLocation({ en: "", ar: "" });
        setDescription({ en: "", ar: "" });
        setDuration("");
        setGrade("");
      } else {
        setStatus({ type: "error", message: result.message });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const previewDegree = degree[activeLang]?.trim() || degree.en || "Degree Title";
  const previewUniversity = university[activeLang]?.trim() || university.en || "University / Institute";
  const previewLocation = location[activeLang]?.trim() || location.en || "Cairo, Egypt";
  const previewDescription = description[activeLang]?.trim() || description.en || "";

  return (
    <div className="w-full">
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
              <AcademicCapIcon className="w-6 h-6" />
            </span>
            Add New Education
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Language Tabs */}
            <LanguageTabs
              activeLang={activeLang}
              onChange={setActiveLang}
              completion={{
                en: Boolean(degree.en.trim() && university.en.trim()),
                ar: Boolean(degree.ar.trim() && university.ar.trim()),
              }}
              hasErrors={{
                en: Boolean(fieldErrors.degree || fieldErrors.university),
                ar: false,
              }}
            />

            {/* Degree Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Degree Title ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <div className="relative group">
                <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={degree[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setDegree((prev) => ({ ...prev, [activeLang]: e.target.value }));
                    if (fieldErrors.degree) setFieldErrors((prev) => ({ ...prev, degree: [] }));
                  }}
                  placeholder={activeLang === "ar" ? "مثال: بكالوريوس في علوم الحاسب" : "e.g. Bachelor of Computer Science"}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.degree && (
                <p className="text-red-500 text-xs ms-1">{fieldErrors.degree[0]}</p>
              )}
            </div>

            {/* University & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                  University / Institute ({activeLang.toUpperCase()}) {activeLang === "en" && <span className="text-red-500">*</span>}
                </label>
                <div className="relative group">
                  <BuildingLibraryIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={university[activeLang]}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    onChange={(e) => {
                      setUniversity((prev) => ({ ...prev, [activeLang]: e.target.value }));
                      if (fieldErrors.university) setFieldErrors((prev) => ({ ...prev, university: [] }));
                    }}
                    placeholder={activeLang === "ar" ? "مثال: جامعة القاهرة" : "e.g. Thebes Academy"}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.university && (
                  <p className="text-red-500 text-xs ms-1">{fieldErrors.university[0]}</p>
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
                    placeholder={activeLang === "ar" ? "القاهرة، مصر" : "e.g. Cairo, Egypt"}
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Grade Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                  Duration *
                </label>
                <div className="relative group">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      if (fieldErrors.duration) setFieldErrors((prev) => ({ ...prev, duration: [] }));
                    }}
                    placeholder="e.g. 2022 - 2026"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.duration && (
                  <p className="text-red-500 text-xs ms-1">{fieldErrors.duration[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                  Grade / Score
                </label>
                <div className="relative group">
                  <TrophyIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 3.8 GPA or Very Good"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Description ({activeLang.toUpperCase()})
              </label>
              <div className="relative group">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute start-4 top-4 group-focus-within:text-primary transition-colors" />
                <textarea
                  rows={4}
                  value={description[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => setDescription((prev) => ({ ...prev, [activeLang]: e.target.value }))}
                  placeholder={activeLang === "ar" ? "تفاصيل إضافية عن الدراسة والمشاريع الأكاديمية..." : "Describe major coursework, achievements, or honors..."}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 ps-12 pe-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium resize-none leading-relaxed"
                />
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
                  Saving Education...
                </>
              ) : (
                <>Add Education</>
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
              Card View
            </span>
          </div>

          <div
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <AcademicCapIcon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {previewDegree}
                  </h4>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {previewUniversity}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-100 dark:border-gray-800/60 py-3">
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                {duration || "Duration"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                {previewLocation}
              </span>
              {grade && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold">
                    <TrophyIcon className="w-4 h-4" />
                    {grade}
                  </span>
                </>
              )}
            </div>

            {previewDescription ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {previewDescription}
              </p>
            ) : (
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEducationForm;
