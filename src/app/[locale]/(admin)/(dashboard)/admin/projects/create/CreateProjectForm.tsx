"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { createProjectAction } from "@/actions/projects";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";

const CreateProjectForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Form State
  const [title, setTitle] = useState({ en: "", ar: "" });
  const [description, setDescription] = useState({ en: "", ar: "" });
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");

  // Media & Tags State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Completion states
  const completion = {
    en: Boolean(title.en.trim() && description.en.trim()),
    ar: Boolean(title.ar.trim() && description.ar.trim()),
  };

  const hasErrors = {
    en: Boolean(
      fieldErrors["title.en"] ||
        fieldErrors["title"] ||
        fieldErrors["description.en"] ||
        fieldErrors["description"]
    ),
    ar: Boolean(fieldErrors["title.ar"] || fieldErrors["description.ar"]),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFieldErrors((prev) => ({ ...prev, image: [] }));
    }
  };

  const handleAddTag = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentTag.trim() && !tagsList.includes(currentTag.trim())) {
      setTagsList([...tagsList, currentTag.trim()]);
      setCurrentTag("");
      setFieldErrors((prev) => ({ ...prev, tags: [] }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter((tag) => tag !== tagToRemove));
  };

  // --- Validation ---
  const validateForm = () => {
    const errors: any = {};
    if (!title.en.trim()) errors.title = ["English project title is required"];
    if (!description.en.trim()) errors.description = ["English description is required"];
    if (!imagePreview) errors.image = ["Project image is required"];
    if (tagsList.length === 0) errors.tags = ["Add at least one technology tag"];
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("title[en]", title.en.trim());
      if (title.ar.trim()) formData.append("title[ar]", title.ar.trim());
      formData.append("description[en]", description.en.trim());
      if (description.ar.trim()) formData.append("description[ar]", description.ar.trim());
      if (githubLink.trim()) formData.append("github_link", githubLink.trim());
      if (demoLink.trim()) formData.append("demo_link", demoLink.trim());

      const fileInput = formRef.current?.querySelector('input[name="project_image"]') as HTMLInputElement;
      const projectImage = fileInput?.files?.[0];
      if (projectImage) {
        if (projectImage.size > 2 * 1024 * 1024) { // 2MB limit
          setStatus({
            type: "error",
            message: "Project image size must be less than 2MB.",
          });
          setIsLoading(false);
          return;
        }
        formData.append("project_image", projectImage);
      }

      // Append tags manually for Laravel array handling
      tagsList.forEach((tag) => {
        formData.append("tags[]", tag);
      });

      const result = await createProjectAction(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Project added successfully!",
        });
        // Reset
        setTitle({ en: "", ar: "" });
        setDescription({ en: "", ar: "" });
        setGithubLink("");
        setDemoLink("");
        setTagsList([]);
        setImagePreview(null);
        if (formRef.current) formRef.current.reset();
      } else {
        let errMsg = result.message;
        if (errMsg === "validation.max.file") {
          errMsg = "The project image exceeds the allowed size limit of 2MB.";
        } else if (errMsg === "validation.mimes") {
          errMsg = "Invalid image type. Please upload a valid image file.";
        }
        setStatus({ type: "error", message: errMsg });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Notifications */}
      {status && (
        <div
          className={`fixed top-4 end-4 z-[100000] px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 ${
            status.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status.type === "success" ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
          <span className="font-bold">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* === Left: Editor Form === */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <CodeBracketIcon className="w-6 h-6" />
            </span>
            Project Details
          </h2>

          <LanguageTabs
            activeLang={activeLang}
            onChange={setActiveLang}
            completion={completion}
            hasErrors={hasErrors}
          />

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Project Thumbnail
              </label>
              <div className="relative group w-full h-48 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                    <PhotoIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                   <ArrowUpTrayIcon className="w-8 h-8 text-white" />
                </div>
                <input 
                  type="file" 
                  name="project_image" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={handleImageChange} 
                />
              </div>
              {fieldErrors.image && <p className="text-red-500 text-xs ms-1">{fieldErrors.image[0]}</p>}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Title ({activeLang.toUpperCase()}){" "}
                {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={title[activeLang]}
                onChange={(e) =>
                  setTitle((prev) => ({ ...prev, [activeLang]: e.target.value }))
                }
                dir={activeLang === "ar" ? "rtl" : "ltr"}
                placeholder={
                  activeLang === "ar"
                    ? "اسم المشروع بالعربية (مثال: منصة تشطيبا للتجارة الإلكترونية)"
                    : "e.g. Tashtiba E-commerce Platform"
                }
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
              />
              {(fieldErrors[`title.${activeLang}`] || (activeLang === "en" && fieldErrors.title)) && (
                <p className="text-red-500 text-xs ms-1">
                  {fieldErrors[`title.${activeLang}`]?.[0] || fieldErrors.title?.[0]}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">
                Description ({activeLang.toUpperCase()}){" "}
                {activeLang === "en" && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows={4}
                value={description[activeLang]}
                onChange={(e) =>
                  setDescription((prev) => ({
                    ...prev,
                    [activeLang]: e.target.value,
                  }))
                }
                dir={activeLang === "ar" ? "rtl" : "ltr"}
                placeholder={
                  activeLang === "ar"
                    ? "وصف موجز للمشروع ومميزاته التقنية..."
                    : "Brief overview of the project features..."
                }
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none leading-relaxed"
              />
              {(fieldErrors[`description.${activeLang}`] ||
                (activeLang === "en" && fieldErrors.description)) && (
                <p className="text-red-500 text-xs ms-1">
                  {fieldErrors[`description.${activeLang}`]?.[0] ||
                    fieldErrors.description?.[0]}
                </p>
              )}
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">GitHub Repo</label>
                    <div className="relative">
                        <CodeBracketIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="url"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl ps-12 pe-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">Live Demo</label>
                    <div className="relative">
                        <LinkIcon className="w-5 h-5 text-gray-400 absolute start-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="url"
                            value={demoLink}
                            onChange={(e) => setDemoLink(e.target.value)}
                            placeholder="https://project.com"
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl ps-12 pe-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Tech Stack / Tags */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ms-1">Technologies &amp; Tags</label>
               <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Next.js (Press Enter)"
                    className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm cursor-pointer"
                  >
                    Add
                  </button>
               </div>
               {fieldErrors.tags && <p className="text-red-500 text-xs ms-1">{fieldErrors.tags[0]}</p>}

               {/* Tags Pills Display */}
               <div className="flex flex-wrap gap-2 pt-2">
                 {tagsList.map((tag) => (
                   <span 
                     key={tag}
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 animate-in fade-in zoom-in-95 duration-200"
                   >
                     {tag}
                     <button
                       type="button"
                       onClick={() => removeTag(tag)}
                       className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                     >
                       ×
                     </button>
                   </span>
                 ))}
               </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-8 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save & Publish Project"
              )}
            </button>

          </form>
        </div>

        {/* === Right: Live Preview === */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-6">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
             <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
               <EyeIcon className="w-6 h-6" />
             </span>
             Card Live Preview ({activeLang.toUpperCase()})
           </h2>

           <div
             dir={activeLang === "ar" ? "rtl" : "ltr"}
             className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
           >
             <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-800">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Live Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <PhotoIcon className="w-12 h-12 mb-1" />
                    <span className="text-xs">Image Preview</span>
                  </div>
                )}
             </div>

             <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title[activeLang] || (activeLang === "ar" ? "عنوان المشروع التجريبي" : "Project Title Example")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {description[activeLang] || (activeLang === "ar" ? "سيظهر وصف المشروع هنا كما سيراه الزوار..." : "Project description will appear here as users will see it on the portfolio...")}
                </p>

                {/* Tech Tags Preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                   {tagsList.length > 0 ? (
                     tagsList.map(tag => (
                       <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-[11px] font-mono">
                         {tag}
                       </span>
                     ))
                   ) : (
                     <span className="text-xs text-gray-400 italic">No tags added yet</span>
                   )}
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CreateProjectForm;
