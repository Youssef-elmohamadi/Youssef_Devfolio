"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { unwrapField } from "@/utils/slug";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaBookOpen,
} from "react-icons/fa";
import {
  reorderLecturesAction,
  toggleLecturePublishAction,
  deleteLectureAction,
} from "@/actions/courses";
import type { CourseDetail, LectureListItem } from "@/types/courses";

interface AdminLecturesClientProps {
  course: CourseDetail;
}

interface SortableLectureItemProps {
  lecture: LectureListItem;
  index: number;
  courseId: number;
  courseSlug: string;
  onTogglePublish: (lecture: LectureListItem) => void;
  onDelete: (lecture: LectureListItem) => void;
}

function SortableLectureItem({
  lecture,
  index,
  courseId,
  courseSlug,
  onTogglePublish,
  onDelete,
}: SortableLectureItemProps) {
  const locale = useLocale();
  const lectureTitle = unwrapField(lecture.title, locale);
  const lectureSlug = unwrapField(lecture.slug, locale);
  const readingTime =
    typeof lecture.reading_time === "object"
      ? (lecture.reading_time as any)[locale] || (lecture.reading_time as any).en || 1
      : lecture.reading_time;

  const isAr = locale === "ar";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lecture.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const numberLabel = (index + 1).toString().padStart(2, "0");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 bg-white dark:bg-gray-900 ${
        isDragging
          ? "border-primary shadow-xl ring-2 ring-primary/30"
          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
      }`}
    >
      {/* Left: Drag Handle + Order + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isAr ? "اسحب لإعادة الترتيب" : "Drag to reorder"}
          aria-label="Drag handle"
        >
          <FaGripVertical className="w-4 h-4" />
        </button>

        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono font-bold text-xs text-primary shrink-0">
          {numberLabel}
        </span>

        <div className="min-w-0">
          <Link
            href={`/admin/courses/${courseId}/lectures/${lecture.id}/edit`}
            className="font-bold text-sm text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
          >
            {lectureTitle}
          </Link>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
            <span className="flex items-center gap-1">
              <FaClock className="w-2.5 h-2.5" />
              {readingTime}{isAr ? " د" : "m"}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="w-2.5 h-2.5" />
              {lecture.views}
            </span>
            <span className="hidden sm:inline line-clamp-1">{lectureSlug}</span>
          </div>
        </div>
      </div>

      {/* Right: Status Toggle + Edit/Delete Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onTogglePublish(lecture)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            lecture.is_published
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 border border-gray-300 dark:border-gray-700"
          }`}
        >
          {lecture.is_published ? (
            <>
              <FaCheckCircle className="w-3 h-3 text-emerald-500" />
              <span className="hidden sm:inline">{isAr ? "منشور" : "Published"}</span>
            </>
          ) : (
            <>
              <FaTimesCircle className="w-3 h-3 text-gray-400" />
              <span className="hidden sm:inline">{isAr ? "مسودة" : "Draft"}</span>
            </>
          )}
        </button>

        <Link
          href={`/admin/courses/${courseId}/lectures/${lecture.id}/edit`}
          className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isAr ? "تعديل الشرح" : "Edit Lecture"}
        >
          <FaEdit className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onDelete(lecture)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isAr ? "حذف الشرح" : "Delete Lecture"}
        >
          <FaTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminLecturesClient({ course }: AdminLecturesClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const [items, setItems] = useState<LectureListItem[]>(course.lectures || []);
  const [lectureToDelete, setLectureToDelete] = useState<LectureListItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex);
      setItems(reordered);

      // Save to backend
      setIsSaving(true);
      setStatusMessage("Saving order...");

      const payload = reordered.map((item, idx) => ({
        id: item.id,
        order: idx + 1,
      }));

      try {
        const res = await reorderLecturesAction(course.id, payload, unwrapField(course.slug, locale));
        if (res.success) {
          setStatusMessage("Order updated successfully!");
          setTimeout(() => setStatusMessage(null), 3000);
          router.refresh();
        } else {
          setStatusMessage(res.message);
        }
      } catch {
        setStatusMessage("Failed to save reordered lectures.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleTogglePublish = async (lecture: LectureListItem) => {
    const nextStatus = !lecture.is_published;
    setItems((prev) =>
      prev.map((l) => (l.id === lecture.id ? { ...l, is_published: nextStatus } : l))
    );

    try {
      const res = await toggleLecturePublishAction(
        course.id,
        lecture.id,
        nextStatus,
        unwrapField(course.slug, locale)
      );
      if (!res.success) {
        // Rollback
        setItems((prev) =>
          prev.map((l) => (l.id === lecture.id ? { ...l, is_published: !nextStatus } : l))
        );
      } else {
        router.refresh();
      }
    } catch {
      setItems((prev) =>
        prev.map((l) => (l.id === lecture.id ? { ...l, is_published: !nextStatus } : l))
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!lectureToDelete) return;
    try {
      const res = await deleteLectureAction(course.id, lectureToDelete.id, unwrapField(course.slug, locale));
      if (res.success) {
        setItems((prev) => prev.filter((l) => l.id !== lectureToDelete.id));
        setLectureToDelete(null);
        router.refresh();
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {statusMessage && (
        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-primary/20 text-xs text-primary font-semibold">
          {statusMessage}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 p-6 space-y-4">
          <FaBookOpen className="w-12 h-12 text-primary/40 mx-auto" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {locale === "ar" ? "لا توجد شروحات مضافة بعد" : "No lectures created yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {locale === "ar"
              ? "ابدأ بإضافة أول شرح أو محاضرة إلى هذا الكورس."
              : "Get started by adding the first lecture to this course."}
          </p>
          <Link
            href={`/admin/courses/${course.id}/lectures/create`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
          >
            {locale === "ar" ? "إنشاء الشرح الأول" : "Create Lecture 1"}
          </Link>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {items.map((lecture, index) => (
                <SortableLectureItem
                  key={lecture.id}
                  lecture={lecture}
                  index={index}
                  courseId={course.id}
                  courseSlug={unwrapField(course.slug, locale)}
                  onTogglePublish={handleTogglePublish}
                  onDelete={setLectureToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Modal */}
      {lectureToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {locale === "ar" ? "حذف الشرح؟" : "Delete Lecture?"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {locale === "ar" ? (
                <>
                  هل أنت متأكد من رغبتك في حذف{" "}
                  <strong className="text-gray-900 dark:text-white">
                    "{unwrapField(lectureToDelete.title, locale)}"
                  </strong>{" "}
                  نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-gray-900 dark:text-white">
                    "{unwrapField(lectureToDelete.title, locale)}"
                  </strong>
                  ? This action cannot be undone.
                </>
              )}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setLectureToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
              >
                {locale === "ar" ? "تأكيد الحذف" : "Delete Lecture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
