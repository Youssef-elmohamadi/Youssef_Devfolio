"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/(admin)/components/ui/DataTable";
import Link from "next/link";
// تأكد من وجود هذا الأكشن أو قم بإنشائه
import { deleteProjectAction } from "@/actions/projects"; 

// تعريف نوع البيانات بناءً على الـ JSON المرسل
type Project = {
  id: number;
  title: string;
  description: string;
  github_link: string;
  demo_link: string;
  tags: string[];
  image_url: string;
  created_at: string;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

export default function ProjectsClient({
  projects,
  meta,
}: {
  projects: Project[];
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

  // تعريف الأعمدة الخاصة بالمشاريع
  const columns: Column<Project>[] = [
    {
      header: "Project",
      render: (project) => (
        <div className="flex items-center gap-4">
          {/* صورة المشروع */}
          <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {project.title}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">
              {project.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Tech Stack",
      render: (project) => (
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-gray-400 self-center">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Links",
      render: (project) => (
        <div className="flex items-center gap-3 text-gray-500">
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="hover:text-black dark:hover:text-white transition-colors"
              title="GitHub Repo"
            >
              <FaGithub className="text-lg" />
            </Link>
          )}
          {project.demo_link && (
            <Link
              href={project.demo_link}
              target="_blank"
              className="hover:text-orange-500 transition-colors"
              title="Live Demo"
            >
              <FaExternalLinkAlt className="text-sm" />
            </Link>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (project) => (
        <div className="flex justify-end gap-2">
          {/* View */}
          <Link href={`/admin/projects/details/${project.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEye className="text-xs" />
            </button>
          </Link>
          
          {/* Edit */}
          <Link href={`/admin/projects/update/${project.id}`}>
            <button className="group flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black">
              <FaEdit className="text-xs" />
            </button>
          </Link>

          {/* Delete */}
          <button
            onClick={async () => {
                if(confirm("Are you sure you want to delete this project?")) {
                    await deleteProjectAction(project.id);
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
      <DataTable data={projects} columns={columns} />

      {/* Pagination */}
      {meta.total > meta.per_page && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{meta.from}</span> to <span className="font-semibold text-gray-900 dark:text-white">{meta.to}</span> of <span className="font-semibold text-gray-900 dark:text-white">{meta.total}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
                if (page === 1 || page === meta.last_page || (page >= meta.current_page - 1 && page <= meta.current_page + 1)) {
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
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00] disabled:opacity-50 dark:border-gray-800 dark:bg-[#0a0a0a] dark:text-gray-400"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}