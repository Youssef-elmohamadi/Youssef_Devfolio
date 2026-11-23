import React from "react";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto" />
        <div className="w-80 h-10 bg-gray-300 dark:bg-gray-700 rounded-xl mx-auto" />
        <div className="w-full h-5 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
      </div>

      {/* Filter box skeleton */}
      <div className="bg-white/60 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="md:col-span-2 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="md:col-span-2 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="md:col-span-2 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="w-16 h-7 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-24 h-7 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-20 h-7 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 overflow-hidden space-y-4 p-5"
          >
            <div className="h-44 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="flex gap-2">
              <div className="w-20 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-16 h-5 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
