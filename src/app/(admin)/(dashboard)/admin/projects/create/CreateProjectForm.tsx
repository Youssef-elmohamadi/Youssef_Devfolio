"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  CommandLineIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { createProjectAction } from "@/actions/projects";

const CreateProjectForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    github_link: "",
    demo_link: "",
  });

  // Media & Tags State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }
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
    if (!formState.title) errors.title = ["Project title is required"];
    if (!formState.description) errors.description = ["Description is required"];
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
      const formData = new FormData(formRef.current!);
      
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
        setFormState({ title: "", description: "", github_link: "", demo_link: "" });
        setTagsList([]);
        setImagePreview(null);
        if (formRef.current) formRef.current.reset();
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
      {/* Notifications */}
      {status && (
        <div
          className={`fixed top-4 right-4 z-[9000] px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 ${
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
        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <CodeBracketIcon className="w-6 h-6" />
            </span>
            Project Details
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Project Thumbnail</label>
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
              {fieldErrors.image && <p className="text-red-500 text-xs ml-1">{fieldErrors.image[0]}</p>}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Title</label>
              <input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="e.g. Tashtiba E-commerce"
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
              />
              {fieldErrors.title && <p className="text-red-500 text-xs ml-1">{fieldErrors.title[0]}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Brief overview of the project features..."
                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none leading-relaxed"
              />
              {fieldErrors.description && <p className="text-red-500 text-xs ml-1">{fieldErrors.description[0]}</p>}
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">GitHub Repo</label>
                    <div className="relative">
                        <CodeBracketIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="url"
                            name="github_link"
                            value={formState.github_link}
                            onChange={handleInputChange}
                            placeholder="https://github.com/..."
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Live Demo</label>
                    <div className="relative">
                        <LinkIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="url"
                            name="demo_link"
                            value={formState.demo_link}
                            onChange={handleInputChange}
                            placeholder="https://project.com"
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tech Stack Tags</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                    <CommandLineIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type tech (e.g. Next.js) & Enter"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                </div>
                <button 
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 p-3.5 rounded-xl transition-all active:scale-95"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
              {fieldErrors.tags && <p className="text-red-500 text-xs ml-1">{fieldErrors.tags[0]}</p>}

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                {tagsList.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary px-3 py-1 rounded-lg text-sm font-semibold text-primary dark:text-primary animate-in zoom-in duration-200">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1 transition-colors">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg flex justify-center items-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Creating...
                </>
              ) : (
                <>Create Project</>
              )}
            </button>

          </form>
        </div>

        {/* === Right: Live Preview === */}
        <div className="sticky top-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <EyeIcon className="w-4 h-4" /> Live Preview
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">Portfolio Card</span>
          </div>

          {/* Project Card */}
          <div className="group bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
            
            {/* Image Area */}
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-900 overflow-hidden">
               {imagePreview ? (
                  <Image src={imagePreview} alt="Project Cover" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-700">
                     <PhotoIcon className="w-16 h-16 mb-2 opacity-50" />
                     <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Image</span>
                  </div>
               )}
               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
               
               {/* Links on Hover */}
               <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {formState.github_link && (
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors">
                          <CodeBracketIcon className="w-5 h-5" />
                      </div>
                  )}
                  {formState.demo_link && (
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-white transition-colors">
                          <LinkIcon className="w-5 h-5" />
                      </div>
                  )}
               </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {formState.title || "Project Title"}
               </h3>
               
               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 h-[60px]">
                  {formState.description || "Project description will appear here. Describe features, challenges, and solutions."}
               </p>

               <div className="flex flex-wrap gap-2">
                  {tagsList.length > 0 ? tagsList.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary bg-primary/10 dark:bg-primary/30 px-2 py-1 rounded-md">
                          {tag}
                      </span>
                  )) : (
                      [1,2,3].map(i => <div key={i} className="h-5 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>)
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