import React from "react";
import { notFound } from "next/navigation";
import { getAdminCourse } from "@/lib/api/courses";
import CourseForm from "../../CourseForm";

interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
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
    console.error("Failed to load course for edit:", error);
    throw error;
  }

  if (!course) {
    notFound();
  }

  return <CourseForm initialCourse={course} isEdit={true} />;
}
