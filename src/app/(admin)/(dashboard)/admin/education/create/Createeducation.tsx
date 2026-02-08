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
  PlusIcon,
} from "@heroicons/react/24/outline";
import { createEduecationAction } from "@/actions/education";

const CreateEducationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formState, setFormState] = useState({
    degree: "",
    university: "",
    location: "",
    duration: "",
    grade: "",
    description: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formState.degree) errors.degree = ["Degree is required"];
    if (!formState.university) errors.university = ["University is required"];
    if (!formState.duration) errors.duration = ["Duration is required"];

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
      const formData = new FormData(formRef.current!);
      const result = await createEduecationAction(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Education added successfully!",
        });
        setFormState({
          degree: "",
          university: "",
          location: "",
          duration: "",
          grade: "",
          description: "",
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
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 relative z-10">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <AcademicCapIcon className="w-6 h-6" />
            </span>
            Add New Degree
          </h2>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            {/* Degree Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Degree Title
              </label>
              <div className="relative group">
                <AcademicCapIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="degree"
                  value={formState.degree}
                  onChange={handleInputChange}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.degree && (
                <p className="text-red-500 text-xs ml-1">
                  {fieldErrors.degree[0]}
                </p>
              )}
            </div>

            {/* University & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                  University / Institute
                </label>
                <div className="relative group">
                  <BuildingLibraryIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="university"
                    value={formState.university}
                    onChange={handleInputChange}
                    placeholder="e.g. Thebes Academy"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.university && (
                  <p className="text-red-500 text-xs ml-1">
                    {fieldErrors.university[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                  Location
                </label>
                <div className="relative group">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Cairo, Egypt"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Grade Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                  Duration
                </label>
                <div className="relative group">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="duration"
                    value={formState.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 2022 - 2026"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.duration && (
                  <p className="text-red-500 text-xs ml-1">
                    {fieldErrors.duration[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                  Grade / GPA
                </label>
                <div className="relative group">
                  <TrophyIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="grade"
                    value={formState.grade}
                    onChange={handleInputChange}
                    placeholder="e.g. Excellent / 3.8 GPA"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Description
              </label>
              <div className="relative group">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-focus-within:text-primary transition-colors" />
                <textarea
                  name="description"
                  rows={4}
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about your study..."
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" /> Create Degree
                </>
              )}
            </button>
          </form>
        </div>

        {/* === Right: Live Preview === */}
        <div className="sticky top-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" /> Live Preview
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              Card View
            </span>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Background Decor */}
            <div className="h-24 bg-gradient-to-r from-primary to-orange-500 relative">
              <div className="absolute -bottom-10 right-8 p-4 bg-white dark:bg-[#111] rounded-2xl shadow-lg">
                <AcademicCapIcon className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="p-8 pt-6">
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  {formState.duration || "202X - 202X"}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {formState.degree || "Degree Title"}
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  {formState.university || "University Name"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                {formState.location && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" /> {formState.location}
                  </span>
                )}
                {formState.grade && (
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <TrophyIcon className="w-3.5 h-3.5" /> {formState.grade}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {formState.description ||
                  "Brief description about your academic path, achievements, or major subjects studied..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEducationForm;
