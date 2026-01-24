// app/admin/articles/ArticlesClient.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/(admin)/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { deleteArticleAction } from "@/actions/articles";

// 2. تعريف الأنواع بناءً على ريسبونس Laravel
type Article = {
  id: number;
  title: string;
  feature_image: string | null;
  date: { raw: string };
  stats: { views: number; likes: number };
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};



// استقبال المقالات + الميتا داتا
export default function ArticlesClient({
  articles,
  meta,
}: {
  articles: Article[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 3. دالة تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;

    // الحفاظ على أي فلاتر موجودة وتحديث رقم الصفحة فقط
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    // التوجيه للرابط الجديد (سيقوم السيرفر بإعادة جلب البيانات)
    router.push(`${pathname}?${params.toString()}`);
  };

  // تعريف الأعمدة (كما هي)
  const columns: Column<Article>[] = [
    {
      header: "Article Details",
      render: (article) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {article.feature_image ? (
              <Image
                src={article.feature_image}
                alt={article.title}
                fill
                className="object-cover transition-transform hover:scale-110"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No Img
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span
              className="font-bold text-gray-900 line-clamp-1 dark:text-white max-w-[200px]"
              title={article.title}
            >
              {article.title}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(article.date.raw)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Stats",
      className: "text-center",
      render: (article) => (
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1" title="Views">
            <FaEye className="text-blue-400" /> {article.stats.views}
          </span>
          <span className="flex items-center gap-1" title="Likes">
            <FaHeart className="text-red-400" /> {article.stats.likes}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (article) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/articles/details/${article.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEye className="text-xs" />
            </button>
          </Link>
          <Link href={`/admin/articles/update/${article.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEdit className="text-xs" />
            </button>
          </Link>

          <button
            onClick={() => deleteArticleAction(article.id)}
            className="group flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* الجدول */}
      <DataTable data={articles} columns={columns} />

      {/* 4. مكون الباجينيشن (تصميم The Forge) */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
          {/* معلومات النتائج */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.from}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.to}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.total}
            </span>{" "}
            results
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {/* أرقام الصفحات */}
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
                // إظهار عدد محدود من الصفحات لتجنب الازدحام (لو الصفحات كتير)
                if (
                  page === 1 ||
                  page === meta.last_page ||
                  (page >= meta.current_page - 1 &&
                    page <= meta.current_page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === meta.current_page
                          ? "bg-[#ff6a00] text-white shadow-lg shadow-orange-500/20"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 dark:hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                // نقاط ...
                if (
                  page === meta.current_page - 2 ||
                  page === meta.current_page + 2
                ) {
                  return (
                    <span key={page} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* زر التالي */}
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
