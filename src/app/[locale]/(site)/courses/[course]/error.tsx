"use client";

import React, { useEffect } from "react";
import { Link } from '@/i18n/routing';
import { FaExclamationTriangle, FaRedo, FaBookOpen } from "react-icons/fa";

export default function CourseDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Course detail error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
        <FaExclamationTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Failed to load course
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          We encountered an error loading this course. Please try again.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
        >
          <FaRedo className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FaBookOpen className="w-3.5 h-3.5" />
          <span>All Courses</span>
        </Link>
      </div>
    </div>
  );
}
