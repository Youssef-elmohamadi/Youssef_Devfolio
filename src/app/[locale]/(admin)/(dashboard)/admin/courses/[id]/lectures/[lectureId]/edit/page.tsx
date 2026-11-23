import React from "react";
import { notFound } from "next/navigation";
import { getAdminCourse, getAdminLecture } from "@/lib/api/courses";
import { unwrapField } from "@/utils/slug";
import LectureForm from "../../LectureForm";

interface EditLecturePageProps {
  params: Promise<{
    id: string;
    lectureId: string;
    locale: string;
  }>;
}

export default async function EditLecturePage({ params }: EditLecturePageProps) {
  const { id, lectureId, locale } = await params;
  let course = null;
  let lecture = null;

  try {
    [course, lecture] = await Promise.all([
      getAdminCourse(id),
      getAdminLecture(id, lectureId),
    ]);
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (error?.status === 404) {
      notFound();
    }
    console.error("Failed to load lecture for edit:", error);
    throw error;
  }

  if (!course || !lecture) {
    notFound();
  }

  return (
    <LectureForm
      courseId={course.id}
      courseSlug={unwrapField(course.slug, locale)}
      initialLecture={lecture}
      isEdit={true}
    />
  );
}
