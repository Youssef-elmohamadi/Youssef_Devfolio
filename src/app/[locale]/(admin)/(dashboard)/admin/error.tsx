"use client";

import React, { useEffect } from "react";
import { Link } from '@/i18n/routing';
import { useLocale } from "next-intl";
import { FaExclamationTriangle, FaRedo, FaArrowLeft } from "react-icons/fa";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isAr = locale === "ar";

  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
          <FaExclamationTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isAr ? "مشكلة في الاتصال أو الخادم" : "Connection or Server Issue"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error?.message?.includes("fetch failed") || error?.message?.includes("Timeout")
            ? isAr
              ? "تعذر الاتصال بخادم الـ API. قد يكون هذا بسبب تأخر مؤقت في الشبكة أو بدء تشغيل الخادم."
              : "Could not reach the backend API server. This might be a temporary network delay or cold start."
            : error?.message || (isAr ? "حدث خطأ غير متوقع أثناء تحميل هذا القسم." : "An unexpected error occurred while loading this admin section.")}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
          >
            <FaRedo className="text-xs" />
            <span>{isAr ? "إعادة المحاولة" : "Try Again"}</span>
          </button>
          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <FaArrowLeft className="text-xs rtl:rotate-180" />
            <span>{isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
