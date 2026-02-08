"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error("Blog Page Error:", error);
  }, [error]);

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="container max-w-7xl mx-auto py-20 px-4 flex items-center justify-center min-h-[60vh]">
      <motion.div
        className="max-w-lg w-full text-center p-8 rounded-2xl bg-white dark:bg-dark/50 border border-red-100 dark:border-red-900/30 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }} // حركة تنبيه بسيطة
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
        >
          <FaExclamationTriangle className="text-4xl text-red-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          فشل تحميل المقالات
        </h2>

        <p className="text-secondary mb-8 text-sm leading-relaxed">
          حدث خطأ أثناء جلب البيانات. قد يكون السيرفر في حالة تحديث حالياً.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-medium shadow-md ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-white"
            }`}
          >
            <FaRedo className={`text-sm ${isPending ? "animate-spin" : ""}`} />
            <span>{isPending ? "جاري المحاولة..." : "إعادة المحاولة"}</span>
          </motion.button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-medium"
          >
            <FaHome className="text-sm" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
