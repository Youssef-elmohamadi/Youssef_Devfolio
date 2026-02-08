"use client";

import React, { useState, useRef } from "react";
import {
  CodeBracketIcon,
  SwatchIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { createSkillAction } from "@/actions/skills";
import Link from "next/link";

const CreateSkillForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [svgCode, setSvgCode] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");
  const [skillsList, setSkillsList] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  // --- Skills Logic ---
  const handleAddSkill = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentSkill.trim() && !skillsList.includes(currentSkill.trim())) {
      setSkillsList([...skillsList, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((skill) => skill !== skillToRemove));
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const validateForm = () => {
    const frontErrors: any = {};

    if (!title) frontErrors.title = ["Title is required"];
    if (!svgCode) frontErrors.icon = ["Icon is required"];
    if (skillsList.length === 0)
      frontErrors.skills = ["At least one skill is required"];

    if (Object.keys(frontErrors).length > 0) {
      setFieldErrors(frontErrors);
      return false;
    }
    return true;
  };

  // --- Submit Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    setFieldErrors({});
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("icon", svgCode);

      // Append skills array for Laravel/Backend (skills[])
      skillsList.forEach((skill) => {
        formData.append("skills[]", skill);
      });

      const result = await createSkillAction(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Skill category created successfully!",
        });
        // Reset Form
        setTitle("");
        setSvgCode("");
        setSkillsList([]);
        setCurrentSkill("");
      } else {
        setStatus({ type: "error", message: result.message });
      }
    } catch (err: any) {
      if (err.type === "validation") {
        setFieldErrors(err.errors);
        return;
      }

      setStatus({
        type: "error",
        message: err.message || "Unexpected error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 relative z-10">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <SparklesIcon className="w-6 h-6" />
            </span>
            Add New Skill Set
          </h2>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Category Title
              </label>
              <div className="relative group">
                <SwatchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, title: [] }));
                  }}
                  placeholder="e.g. Front-End Development"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-2 w-full">
                    {fieldErrors.title[0]}
                  </p>
                )}
              </div>
            </div>

            {/* SVG Icon Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex justify-between">
                <span>SVG Icon Code</span>
                <span className="text-primary text-[10px] cursor-pointer hover:underline">
                  <Link href="https://www.svgrepo.com/" target="_blank">
                    Where to get icons?
                  </Link>
                </span>
              </label>
              <div className="relative group">
                <CodeBracketIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-focus-within:text-primary transition-colors" />
                <textarea
                  rows={3}
                  value={svgCode}
                  onChange={(e) => {
                    setSvgCode(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, icon: [] }));
                  }}
                  placeholder="<svg>...</svg>"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-mono text-sm resize-none"
                />
                {fieldErrors.icon && (
                  <p className="text-red-500 text-sm mt-2 w-full">
                    {fieldErrors.icon[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Skills Tag Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Tech Stack List
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => {
                    setCurrentSkill(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, skills: [] }));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type skill & press Enter (e.g. React.js)"
                  className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 p-4 rounded-xl transition-all active:scale-95"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
              {fieldErrors.skills && (
                <p className="text-red-500 text-sm mt-2 w-full">
                  {fieldErrors.skills[0]}
                </p>
              )}

              {/* Tags Display Area */}
              <div className="flex flex-wrap gap-2 mt-4 min-h-[50px] p-4 bg-gray-50/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                {skillsList.length === 0 && (
                  <span className="text-gray-400 text-sm italic w-full text-center py-2">
                    No skills added yet...
                  </span>
                )}
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 animate-in zoom-in duration-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
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
                <>Create Skill Set</>
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
              Component View
            </span>
          </div>

          {/* The Card Preview */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300">
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700 text-primary transition-all duration-300 group hover:scale-110 hover:rotate-3">
                {svgCode ? (
                  <div
                    className="w-10 h-10 fill-current"
                    dangerouslySetInnerHTML={{ __html: svgCode }}
                  />
                ) : (
                  <CodeBracketIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                {title || "Skill Category"}
              </h3>
              <div className="h-1 w-12 bg-primary rounded-full mb-6"></div>

              {/* Skills List */}
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {skillsList.length > 0
                  ? skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))
                  : // Placeholders skeletons
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                      ></div>
                    ))}
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30">
            <p className="text-xs text-primary dark:text-primary leading-relaxed text-center">
              <strong>Tip:</strong> Ensure your SVG code is clean (without fixed
              width/height) to scale perfectly inside the icon circle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSkillForm;
