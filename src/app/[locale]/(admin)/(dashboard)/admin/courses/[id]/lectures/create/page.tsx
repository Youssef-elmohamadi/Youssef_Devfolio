import React from "react";
import { notFound } from "next/navigation";
import { getAdminCourse } from "@/lib/api/courses";
import { unwrapField } from "@/utils/slug";
import LectureForm from "../LectureForm";

interface CreateLecturePageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function CreateLecturePage({ params }: CreateLecturePageProps) {
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
    console.error("Failed to load course for lecture create:", error);
    throw error;
  }

  if (!course) {
    notFound();
  }

  return <LectureForm courseId={course.id} courseSlug={unwrapField(course.slug, locale)} isEdit={false} />;
}
