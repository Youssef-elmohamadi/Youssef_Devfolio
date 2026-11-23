import React from "react";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto space-y-10 animate-pulse">
      <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl" />

      {/* Hero skeleton */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-6 bg-white/40 dark:bg-gray-900/40">
        <div className="flex gap-2">
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <div className="w-3/4 h-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
        <div className="w-full h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-4 gap-4 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>

      {/* Lectures skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 h-20 bg-white/40 dark:bg-gray-900/40"
          />
        ))}
      </div>
    </div>
  );
}
