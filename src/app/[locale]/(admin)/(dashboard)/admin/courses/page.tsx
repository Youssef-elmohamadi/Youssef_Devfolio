import React from "react";
import { Link } from '@/i18n/routing';
import { FaPlus, FaGraduationCap } from "react-icons/fa";
import { getAdminCourses } from "@/lib/api/courses";
import AdminCoursesClient from "./AdminCoursesClient";

interface AdminCoursesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminCoursesPage({ params, searchParams }: AdminCoursesPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  let response: { data: any[]; meta?: any } = { data: [] };
  try {
    response = await getAdminCourses({
      page,
      per_page: 15,
      search: sp.search,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Failed to fetch admin courses:", error?.message);
  }

  const courses = response.data || [];
  const meta = response.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: courses.length,
    from: 1,
    to: courses.length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <FaGraduationCap className="w-4 h-4" />
            <span>{isAr ? "إدارة المنهج التعليمي" : "Curriculum Management"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? "الكورسات والشروحات المكتوبة" : "Courses & Written Tutorials"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr
              ? "إنشاء وإدارة المناهج وتعديل المحاضرات ونشر المسودات."
              : "Create, manage syllabus, publish drafts, and reorder lectures."}
          </p>
        </div>

        <Link
          href="/admin/courses/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium text-sm"
        >
          <FaPlus className="text-xs" />
          <span>{isAr ? "كورس جديد" : "New Course"}</span>
        </Link>
      </div>

      <AdminCoursesClient initialCourses={courses} meta={meta} initialSearch={sp.search || ""} />
    </div>
  );
}
