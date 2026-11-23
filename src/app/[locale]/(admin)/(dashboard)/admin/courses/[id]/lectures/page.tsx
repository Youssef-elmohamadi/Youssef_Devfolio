import React from "react";
import { Link } from '@/i18n/routing';
import { notFound } from "next/navigation";
import { FaArrowLeft, FaPlus, FaBookOpen } from "react-icons/fa";
import { getAdminCourse } from "@/lib/api/courses";
import { unwrapField } from "@/utils/slug";
import AdminLecturesClient from "./AdminLecturesClient";

interface AdminLecturesPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function AdminLecturesPage({ params }: AdminLecturesPageProps) {
  const { id, locale } = await params;
  let course = null;

  try {
    course = await getAdminCourse(id);
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (error?.status === 404) {
      notFound();
    }
    console.error("Failed to load course lectures:", error);
    throw error;
  }

  if (!course) {
    notFound();
  }

  const isAr = locale === "ar";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors mb-1 rtl:rotate-180"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>{isAr ? "العودة إلى الكورسات" : "Back to Courses"}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <FaBookOpen className="w-5 h-5 text-primary" />
            <span>
              {isAr ? "إدارة شروحات: " : "Manage Lectures: "}
              {unwrapField(course.title, locale)}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Drag and drop lectures to reorder them in real-time. Publish drafts or add new lessons.
          </p>
        </div>

        <Link
          href={`/admin/courses/${course.id}/lectures/create`}
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium text-sm shrink-0"
        >
          <FaPlus className="text-xs" />
          <span>New Lecture</span>
        </Link>
      </div>

      <AdminLecturesClient course={course} />
    </div>
  );
}
