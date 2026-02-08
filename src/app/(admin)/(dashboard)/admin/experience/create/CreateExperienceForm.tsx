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
  ListBulletIcon
} from "@heroicons/react/24/outline";
import { createExperianceAction } from "@/actions/experiance";

const CreateExperienceForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    job_title: "",
    company: "",
    location: "",
    duration: "",
  });

  // Tasks Logic
  const [currentTask, setCurrentTask] = useState("");
  const [tasksList, setTasksList] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    // Clear errors when typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: [] }));
    }
  };

  const handleAddTask = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentTask.trim()) {
      setTasksList([...tasksList, currentTask.trim()]);
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
    setTasksList(tasksList.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formState.job_title) errors.job_title = ["Job Title is required"];
    if (!formState.company) errors.company = ["Company Name is required"];
    if (!formState.duration) errors.duration = ["Duration is required"];
    if (tasksList.length === 0) errors.tasks = ["Add at least one task/responsibility"];
    
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
      formData.append("job_title", formState.job_title);
      formData.append("company", formState.company);
      formData.append("location", formState.location);
      formData.append("duration", formState.duration);

      // Append tasks array for Backend (tasks[])
      tasksList.forEach((task) => {
        formData.append("tasks[]", task);
      });

      const result = await createExperianceAction(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Experience added successfully!",
        });
        // Reset Form
        setFormState({ job_title: "", company: "", location: "", duration: "" });
        setTasksList([]);
        setCurrentTask("");
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
          
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 relative z-10">
            <span className="p-2 bg-primary/10 rounded-lg text-primary">
              <BriefcaseIcon className="w-6 h-6" />
            </span>
            Add New Experience
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Job Title</label>
              <div className="relative group">
                <BriefcaseIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="job_title"
                  value={formState.job_title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.job_title && <p className="text-red-500 text-xs ml-1">{fieldErrors.job_title[0]}</p>}
            </div>

            {/* Company & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Company</label>
                <div className="relative group">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Tech Solutions Inc."
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
                {fieldErrors.company && <p className="text-red-500 text-xs ml-1">{fieldErrors.company[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Location</label>
                <div className="relative group">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Cairo, Egypt (Remote)"
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Duration</label>
              <div className="relative group">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="duration"
                  value={formState.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. Jan 2023 - Present"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
              {fieldErrors.duration && <p className="text-red-500 text-xs ml-1">{fieldErrors.duration[0]}</p>}
            </div>

            {/* Tasks Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Key Responsibilities / Tasks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a task and press Enter..."
                  className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={handleAddTask}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 p-4 rounded-xl transition-all active:scale-95"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
              {fieldErrors.tasks && <p className="text-red-500 text-xs ml-1">{fieldErrors.tasks[0]}</p>}

              {/* Tasks List */}
              <div className="flex flex-col gap-2 mt-4">
                {tasksList.length === 0 && (
                  <div className="text-gray-400 text-sm italic w-full text-center py-4 bg-gray-50/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                    No tasks added yet. Add tasks to highlight your achievements.
                  </div>
                )}
                {tasksList.map((task, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                    <ListBulletIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{task}</span>
                    <button type="button" onClick={() => removeTask(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
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
                   Saving...
                </>
              ) : (
                <>Create Experience</>
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
            <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">Resume View</span>
          </div>

          {/* The Timeline Card Preview */}
          <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

            <div className="relative z-10">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                     {formState.job_title || "Job Title"}
                   </h3>
                   <div className="flex items-center gap-2 text-primary font-bold">
                     <BuildingOfficeIcon className="w-5 h-5" />
                     <span>{formState.company || "Company Name"}</span>
                   </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-1">
                   <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {formState.duration || "Duration"}
                   </div>
                   <div className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      {formState.location || "Location"}
                   </div>
                </div>
              </div>

              {/* Tasks Preview */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Achievements</h4>
                 <ul className="space-y-3">
                    {tasksList.length > 0 ? (
                        tasksList.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                             {task}
                          </li>
                        ))
                    ) : (
                        // Skeleton Lines
                        [1, 2, 3].map((i) => (
                           <li key={i} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0"></div>
                              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                           </li>
                        ))
                    )}
                 </ul>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateExperienceForm;