import React from "react";

export default function Loading() {
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      {/* عنوان الصفحة Skeleton */}
      <div className="flex justify-center items-center mb-8">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8" />
      </div>

      {/* شبكة المقالات Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-4"
          >
            {/* صورة المقال */}
            <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />

            {/* العنوان */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* تفاصيل سفلية */}
            <div className="flex justify-between pt-4">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
