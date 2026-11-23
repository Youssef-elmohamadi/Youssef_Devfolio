import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLecture, getCourseBySlug, normalizeSlug } from "@/lib/api/courses";
import { generateSEO } from "@/utils/seo";
import { generateLectureSchema } from "@/lib/schema-generator";
import JsonLd from "../../../components/JsonLd";
import LectureClient from "./LectureClient";

interface LecturePageProps {
  params: Promise<{
    locale: string;
    course: string;
    lecture: string;
  }>;
}

export async function generateMetadata({ params }: LecturePageProps): Promise<Metadata> {
  const { course: rawCourse, lecture: rawLecture, locale } = await params;
  const courseSlug = normalizeSlug(rawCourse);
  const lectureSlug = normalizeSlug(rawLecture);
  const lecture = await getLecture(courseSlug, lectureSlug, locale);

  if (!lecture) {
    return {
      title: "Lecture Not Found | Youssef Elmohamadi",
    };
  }

  const isAr = locale === "ar";
  const title = `${lecture.title} | ${lecture.course?.title || (isAr ? "الكورسات" : "Courses")} | Youssef Elmohamadi`;
  const description =
    lecture.description ||
    (isAr
      ? `اقرأ المحاضرة الكاملة "${lecture.title}" في هندسة البرمجيات وتصميم الأنظمة.`
      : `Read the full lecture "${lecture.title}" on software engineering and system architecture.`);

  const courseSlugs = (lecture.course as any)?.slugs;
  const cEn = courseSlugs?.en ? normalizeSlug(courseSlugs.en) : courseSlug;
  const cAr = courseSlugs?.ar ? normalizeSlug(courseSlugs.ar) : courseSlug;
  const lEn = lecture.slugs?.en ? normalizeSlug(lecture.slugs.en) : lectureSlug;
  const lAr = lecture.slugs?.ar ? normalizeSlug(lecture.slugs.ar) : lectureSlug;

  return generateSEO({
    title,
    description,
    image: lecture.course?.cover_image || undefined,
    type: "article",
    locale,
    asPath: `/courses/${courseSlug}/${lectureSlug}`,
    alternatePaths: {
      en: `/courses/${cEn}/${lEn}`,
      ar: `/courses/${cAr}/${lAr}`,
    },
    publishedTime: lecture.published_at || undefined,
    keywords: [
      lecture.title,
      lecture.course?.title || "Course",
      "Lecture",
      "Software Engineering",
      "Tutorial",
    ],
  });
}

export default async function LectureDetailPage({ params }: LecturePageProps) {
  const { course: rawCourse, lecture: rawLecture, locale } = await params;
  const courseSlug = normalizeSlug(rawCourse);
  const lectureSlug = normalizeSlug(rawLecture);

  // Parallel fetch of lecture & course detail (to have full syllabus for drawer sidebar)
  const [lecture, courseDetail] = await Promise.all([
    getLecture(courseSlug, lectureSlug, locale),
    getCourseBySlug(courseSlug, locale),
  ]);

  if (!lecture || !courseDetail) {
    notFound();
  }

  const jsonLd = generateLectureSchema({
    title: lecture.title,
    description: lecture.description || "",
    courseTitle: courseDetail.title,
    courseSlug,
    lectureSlug,
    datePublished: lecture.published_at,
    locale,
    image: courseDetail.cover_image,
    wordCount: lecture.content ? lecture.content.split(/\s+/).length : undefined,
  });

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto pb-24 sm:pb-16">
      <JsonLd data={jsonLd} />
      <LectureClient lecture={lecture} course={courseDetail} />
    </main>
  );
}
