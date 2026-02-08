"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
  FaGraduationCap,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/(admin)/components/ui/DataTable";
import Link from "next/link";
import { deleteEducationAction } from "@/actions/education";

type Education = {
  id: number;
  degree: string;
  university: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

export default function EducationClient({
  educations,
  meta,
}: {
  educations: Education[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // تعريف الأعمدة
  const columns: Column<Education>[] = [
    {
      header: "Degree",
      render: (edu) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg dark:bg-orange-900/20 dark:text-orange-400">
            <FaGraduationCap />
          </div>
          <div>
            <span className="block font-semibold text-gray-900 dark:text-white">
              {edu.degree}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {edu.grade}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "University",
      render: (edu) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {edu.university}
        </span>
      ),
    },
    {
      header: "Location",
      render: (edu) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {edu.location}
        </span>
      ),
    },
    {
      header: "Duration",
      render: (edu) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {edu.duration}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (edu) => (
        <div className="flex justify-end gap-2">
          {/* View Details */}
          <Link href={`/admin/education/details/${edu.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEye className="text-xs" />
            </button>
          </Link>

          {/* Edit */}
          <Link href={`/admin/education/update/${edu.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEdit className="text-xs" />
            </button>
          </Link>

          {/* Delete */}
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this degree?")) {
                await deleteEducationAction(edu.id);
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
      {/* Education Table */}
      <DataTable data={educations} columns={columns} />

      {/* Pagination Controls */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400 transition-colors"
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
