"use client";

import React, { useState, useTransition } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { unwrapField } from "@/utils/slug";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import DataTable, { Column } from "@/app/[locale]/(admin)/components/ui/DataTable";
import {
  deleteCourseAction,
  toggleCoursePublishAction,
} from "@/actions/courses";
import type { CourseCard, PaginationMeta } from "@/types/courses";

interface AdminCoursesClientProps {
  initialCourses: CourseCard[];
  meta: PaginationMeta;
  initialSearch?: string;
}

export default function AdminCoursesClient({
  initialCourses,
  meta,
  initialSearch = "",
}: AdminCoursesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const [courses, setCourses] = useState<CourseCard[]>(initialCourses);
  const [search, setSearch] = useState(initialSearch);
  const [courseToDelete, setCourseToDelete] = useState<CourseCard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sync with initialCourses when props change
  React.useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    params.set("page", p.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleTogglePublish = async (course: CourseCard) => {
    const newStatus = !course.is_published;
    // Optimistic UI
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, is_published: newStatus } : c))
    );

    try {
      const res = await toggleCoursePublishAction(course.id, newStatus, unwrapField(course.slug, locale));
      if (!res.success) {
        // Rollback
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, is_published: !newStatus } : c))
        );
        setActionError(res.message);
      } else {
        router.refresh();
      }
    } catch {
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_published: !newStatus } : c))
      );
      setActionError("Failed to update publish state");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      const res = await deleteCourseAction(courseToDelete.id, unwrapField(courseToDelete.slug, locale));
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
        setCourseToDelete(null);
        router.refresh();
      } else {
        setActionError(res.message);
      }
    } catch (e: any) {
      setActionError(e?.message || "Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  const isAr = locale === "ar";

  const getLevelLabel = (level: string) => {
    if (!isAr) return level;
    if (level === "beginner") return "مبتدئ";
    if (level === "intermediate") return "متوسط";
    if (level === "advanced") return "متقدم";
    return level;
  };

  const getStatusLabel = (status: string) => {
    if (!isAr) return status;
    if (status === "completed") return "مكتمل";
    if (status === "ongoing") return "قيد الإنشاء";
    return status;
  };

  const columns: Column<CourseCard>[] = [
    {
      header: isAr ? "الكورس" : "Course",
      accessorKey: "title",
      render: (item) => {
        const itemTitle = unwrapField(item.title, locale);
        const itemSlug = unwrapField(item.slug, locale);
        const itemSubject = unwrapField(item.subject, locale);
        return (
          <div className="flex items-center gap-3 max-w-sm">
            {item.cover_image ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                <Image src={item.cover_image} alt={itemTitle} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                {itemSubject.slice(0, 3)}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/admin/courses/${item.id}/edit`}
                className="font-bold text-sm text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
              >
                {itemTitle}
              </Link>
              <div className="text-xs text-gray-400 font-mono line-clamp-1">{itemSlug}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: isAr ? "الموضوع والمستوى" : "Subject & Level",
      render: (item) => {
        const itemSubject = unwrapField(item.subject, locale);
        return (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {itemSubject}
            </div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {getLevelLabel(item.level)}
            </span>
          </div>
        );
      },
    },
    {
      header: isAr ? "المحاضرات" : "Lectures",
      render: (item) => (
        <Link
          href={`/admin/courses/${item.id}/lectures`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-primary border border-primary/20 text-xs font-semibold hover:bg-primary hover:text-white transition-all"
        >
          <FaBookOpen className="w-3 h-3" />
          <span>{item.lectures_count} {isAr ? "محاضرات" : "lectures"}</span>
        </Link>
      ),
    },
    {
      header: isAr ? "الحالة" : "Status",
      render: (item) => (
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
            item.status === "completed"
              ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          }`}
        >
          {getStatusLabel(item.status)}
        </span>
      ),
    },
    {
      header: isAr ? "حالة النشر" : "Publish State",
      render: (item) => (
        <button
          onClick={() => handleTogglePublish(item)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            item.is_published
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 border border-gray-300 dark:border-gray-700"
          }`}
        >
          {item.is_published ? (
            <>
              <FaCheckCircle className="w-3 h-3 text-emerald-500" />
              <span>{isAr ? "منشور" : "Published"}</span>
            </>
          ) : (
            <>
              <FaTimesCircle className="w-3 h-3 text-gray-400" />
              <span>{isAr ? "مسودة" : "Draft"}</span>
            </>
          )}
        </button>
      ),
    },
    {
      header: isAr ? "الإجراءات" : "Actions",
      className: "text-right rtl:text-left",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.is_published && (
            <Link
              href={`/courses/${item.slug}`}
              target="_blank"
              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isAr ? "معاينة الكورس" : "Preview Public Course"}
            >
              <FaEye className="w-3.5 h-3.5" />
            </Link>
          )}
          <Link
            href={`/admin/courses/${item.id}/edit`}
            className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isAr ? "تعديل الكورس" : "Edit Course"}
          >
            <FaEdit className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setCourseToDelete(item)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isAr ? "حذف الكورس" : "Delete Course"}
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm">
          {actionError}
        </div>
      )}

      {/* Search Header */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? "ابحث عن الكورسات..." : "Search courses..."}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          {isAr ? "بحث" : "Search"}
        </button>
      </form>

      {/* Courses DataTable */}
      <DataTable data={courses} columns={columns} />

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4">
          <div>
            {isAr
              ? `عرض ${courses.length} من إجمالي ${meta.total} سجل`
              : `Showing ${courses.length} of ${meta.total} records`}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 rtl:rotate-180"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <span className="px-3 py-1 font-bold">
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page >= meta.last_page}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 rtl:rotate-180"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isAr ? "حذف الكورس؟" : "Delete Course?"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAr ? (
                <>
                  هل أنت متأكد من حذف{" "}
                  <strong className="text-gray-900 dark:text-white">
                    "{unwrapField(courseToDelete.title, locale)}"
                  </strong>{" "}
                  نهائياً؟ سيتم حذف جميع المحاضرات والملفات المرتبطة به.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-gray-900 dark:text-white">
                    "{unwrapField(courseToDelete.title, locale)}"
                  </strong>
                  ? All associated lectures and files will be permanently deleted.
                </>
              )}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isAr
                  ? isDeleting
                    ? "جاري الحذف..."
                    : "حذف نهائي"
                  : isDeleting
                  ? "Deleting..."
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
