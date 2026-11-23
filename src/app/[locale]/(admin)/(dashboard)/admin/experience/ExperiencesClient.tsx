// app/admin/experiences/ExperiencesClient.tsx
"use client";

import React from "react";
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale } from "next-intl";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/[locale]/(admin)/components/ui/DataTable";
import { Link } from '@/i18n/routing';
import { deleteExperienceAction } from "@/actions/experiance";
import { unwrapField } from "@/utils/slug";

// Define the Experience type based on the API response
type Experience = {
  id: number;
  job_title: string | Record<string, string>;
  company: string | Record<string, string>;
  duration: string | Record<string, string>;
  location: string | Record<string, string>;
  tasks: string[] | Record<string, string[]>;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

export default function ExperiencesClient({
  experiences,
  meta,
}: {
  experiences: Experience[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Define columns for the DataTable
  const columns: Column<Experience>[] = [
    {
      header: locale === "ar" ? "المسمى الوظيفي" : "Job Title",
      render: (experience) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {unwrapField(experience.job_title, locale)}
        </span>
      ),
    },
    {
      header: locale === "ar" ? "الشركة" : "Company",
      render: (experience) => <span>{unwrapField(experience.company, locale)}</span>,
    },
    {
      header: locale === "ar" ? "المدة" : "Duration",
      render: (experience) => (
        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
          {unwrapField(experience.duration, locale)}
        </span>
      ),
    },
    {
      header: locale === "ar" ? "الموقع" : "Location",
      render: (experience) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {unwrapField(experience.location, locale)}
        </span>
      ),
    },
    {
      header: locale === "ar" ? "الإجراءات" : "Actions",
      className: "text-end",
      render: (experience) => (
        <div className="flex justify-end gap-2">
          {/* View Details Button */}
          <Link href={`/admin/experience/details/${experience.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEye className="text-xs" />
            </button>
          </Link>

          {/* Edit Button */}
          <Link href={`/admin/experience/update/${experience.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEdit className="text-xs" />
            </button>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (confirm(locale === "ar" ? "هل أنت متأكد من حذف هذه الخبرة؟" : "Are you sure you want to delete this experience?")) {
                deleteExperienceAction(experience.id);
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
      {/* Experience Table */}
      <DataTable data={experiences} columns={columns} />

      {/* Pagination Controls */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors rtl:rotate-180"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
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
                return null;
              })}
            </div>
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors rtl:rotate-180"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
