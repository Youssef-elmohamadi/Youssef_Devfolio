// app/admin/articles/ArticlesClient.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/(admin)/components/ui/DataTable";
import Link from "next/link";
import { deleteSkillAction } from "@/actions/skills";

type Skill = {
  id: number;
  title: string;
  icon: string;
  skills: string[];
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};
export default function SkillsClient({
  skills,
  meta,
}: {
  skills: Skill[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.last_page) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  // تعريف الأعمدة (كما هي)
  const columns: Column<Skill>[] = [
    {
      header: "Skill Title",
      render: (skill) => (
        <div className="flex items-center gap-4">
          <span
            className="w-6 h-6 text-primary"
            dangerouslySetInnerHTML={{ __html: skill.icon }}
          ></span>
          <span className="pb-[4px]">{skill.title}</span>
        </div>
      ),
    },
    {
      header: "Skills",
      render: (skill) => (
        <span className="w-40 truncate">{skill.skills.join(", ")}</span>
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (skill) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/skills/details/${skill.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEye className="text-xs" />
            </button>
          </Link>
          <Link href={`/admin/skills/update/${skill.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEdit className="text-xs" />
            </button>
          </Link>

          <button
            onClick={() => deleteSkillAction(skill.id)}
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
      <DataTable data={skills} columns={columns} />

      {/* 4. مكون الباجينيشن (تصميم The Forge) */}
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
