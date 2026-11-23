import React from "react";
import { Link } from '@/i18n/routing';
import { FaGraduationCap, FaArrowLeft } from "react-icons/fa";

export default function CoursesNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <FaGraduationCap className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Course Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          The course you are looking for does not exist, has been archived, or is currently unpublished.
        </p>
      </div>

      <Link
        href="/courses"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
      >
        <FaArrowLeft className="w-3.5 h-3.5" />
        <span>Browse All Courses</span>
      </Link>
    </div>
  );
}
