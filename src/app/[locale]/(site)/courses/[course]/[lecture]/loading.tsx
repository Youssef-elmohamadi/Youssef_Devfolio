import React from "react";

export default function LectureLoading() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto animate-pulse space-y-8">
      {/* Breadcrumb skeleton */}
      <div className="w-64 h-4 bg-gray-200 dark:bg-gray-800 rounded" />

      {/* Hero card skeleton */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-4 bg-white/40 dark:bg-gray-900/40">
        <div className="flex gap-3">
          <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>
        <div className="w-3/4 h-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
        <div className="w-full h-5 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      {/* Content lines skeleton */}
      <div className="max-w-4xl space-y-4 pt-6">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-11/12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-full h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl my-6" />
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
}
