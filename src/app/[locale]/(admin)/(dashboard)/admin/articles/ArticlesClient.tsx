// app/admin/articles/ArticlesClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from "next-intl";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/[locale]/(admin)/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import { Link } from '@/i18n/routing';
import { deleteArticleAction } from "@/actions/articles";
import { getCategories } from "@/lib/api/categories";
import { unwrapField } from "@/utils/slug";

// 2. تعريف الأنواع بناءً على ريسبونس Laravel
type Article = {
  id: number;
  title: string | Record<string, string>;
  feature_image: string | null;
  date: { raw: string };
  stats: { views: number; likes: number };
  category_id?: number; // new field linking to category
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
  const locale = useLocale();

  const [categories, setCategories] = useState<{ id: number; name: string | Record<string, string> }[]>([]);

  useEffect(() => {
    getCategories(locale)
      .then((data) => setCategories(data))
      .catch(console.error);
  }, [locale]);

  const getCategoryName = (id?: number) => {
    if (!id) return "—";
    const found = categories.find((c) => c.id === id);
    return found ? unwrapField(found.name, locale) : `#${id}`;
  };
  
  // 3. دالة تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;

    // الحفاظ على أي فلاتر موجودة وتحديث رقم الصفحة فقط
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    // التوجيه للرابط الجديد (سيقوم السيرفر بإعادة جلب البيانات)
    router.push(`${pathname}?${params.toString()}`);
  };

  // تعريف الأعمدة
  const columns: Column<Article>[] = [
    {
      header: locale === "ar" ? "تفاصيل المقال" : "Article Details",
      render: (article) => {
        const titleStr = unwrapField(article.title, locale);
        return (
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              {article.feature_image ? (
                <Image
                  src={article.feature_image}
                  alt={titleStr}
                  fill
                  className="object-cover transition-transform hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  {locale === "ar" ? "بدون صورة" : "No Img"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-gray-900 line-clamp-1 dark:text-white max-w-[200px]"
                title={titleStr}
              >
                {titleStr}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(article.date.raw, locale)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: locale === "ar" ? "الإحصائيات" : "Stats",
      className: "text-center",
      render: (article) => (
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1" title={locale === "ar" ? "المشاهدات" : "Views"}>
            <FaEye className="text-blue-400" /> {article.stats.views}
          </span>
          <span className="flex items-center gap-1" title={locale === "ar" ? "الإعجابات" : "Likes"}>
            <FaHeart className="text-red-400" /> {article.stats.likes}
          </span>
        </div>
      ),
    },
    {
      header: locale === "ar" ? "القسم" : "Category",
      className: "text-center",
      render: (article) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
          {getCategoryName(article.category_id)}
        </span>
      ),
    },
    {
      header: locale === "ar" ? "الإجراءات" : "Actions",
      className: "text-end",
      render: (article) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/articles/details/${article.id}`}>
            <button
              title={locale === "ar" ? "عرض تفاصيل المقال" : "View Article Details"}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black"
            >
              <FaEye className="text-xs" />
            </button>
          </Link>
          <Link href={`/admin/articles/update/${article.id}`}>
            <button
              title={locale === "ar" ? "تعديل المقال" : "Edit Article"}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black"
            >
              <FaEdit className="text-xs" />
            </button>
          </Link>

          <button
            title={locale === "ar" ? "حذف المقال" : "Delete Article"}
            onClick={() => {
              if (confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المقال؟" : "Are you sure you want to delete this article?")) {
                deleteArticleAction(article.id);
              }
            }}
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

      {/* مكون الباجينيشن */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
          {/* معلومات النتائج */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {locale === "ar" ? (
              <>
                عرض <span className="font-semibold text-gray-900 dark:text-white">{meta.from}</span> إلى{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{meta.to}</span> من إجمالي{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{meta.total}</span> نتيجة
              </>
            ) : (
              <>
                Showing <span className="font-semibold text-gray-900 dark:text-white">{meta.from}</span> to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{meta.to}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{meta.total}</span> results
              </>
            )}
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors rtl:rotate-180"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {/* أرقام الصفحات */}
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const pageNumber = i + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === meta.last_page ||
                  (pageNumber >= meta.current_page - 1 &&
                    pageNumber <= meta.current_page + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        meta.current_page === pageNumber
                          ? "bg-[#ff6a00] text-white shadow-lg shadow-orange-500/20"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 dark:hover:bg-white/5"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === meta.current_page - 2 ||
                  pageNumber === meta.current_page + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="px-1 text-gray-400 dark:text-gray-600"
                    >
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors rtl:rotate-180"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
