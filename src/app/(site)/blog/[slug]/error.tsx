"use client";

import { useEffect } from "react";
import {
  ArrowPathIcon,
  HomeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-4">
          <ExclamationTriangleIcon className="w-12 h-12" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          We encountered an error while loading this article. It might be a
          network issue or the article is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-primary/30"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
