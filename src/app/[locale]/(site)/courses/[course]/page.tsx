import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug, getCourses, normalizeSlug } from "@/lib/api/courses";
import { generateSEO } from "@/utils/seo";
import { generateCourseSchema } from "@/lib/schema-generator";
import JsonLd from "../../components/JsonLd";
import CourseDetailClient from "./CourseDetailClient";

interface CoursePageProps {
  params: Promise<{
    locale: string;
    course: string;
  }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { course: rawSlug, locale } = await params;
  const slug = normalizeSlug(rawSlug);
  const course = await getCourseBySlug(slug, locale);

  if (!course) {
    return {
      title: "Course Not Found | Youssef Elmohamadi",
    };
  }

  const isAr = locale === "ar";
  const title = `${course.title} | ${isAr ? "الكورسات" : "Courses"} | Youssef Elmohamadi`;
  const description = course.description || (isAr ? "اقرأ هذا الكورس المتعمق في هندسة البرمجيات." : "Read this in-depth written engineering course.");

  const enSlug = course.slugs?.en ? normalizeSlug(course.slugs.en) : slug;
  const arSlug = course.slugs?.ar ? normalizeSlug(course.slugs.ar) : slug;

  return generateSEO({
    title,
    description,
    image: course.cover_image || undefined,
    type: "article",
    locale,
    asPath: `/courses/${slug}`,
    alternatePaths: {
      en: `/courses/${enSlug}`,
      ar: `/courses/${arSlug}`,
    },
    keywords: [
      course.title,
      course.subject,
      ...(course.tags?.map((t) => t.name) || []),
      "Programming",
      "Software Engineering",
    ],
  });
}

export async function generateStaticParams() {
  try {
    const resEn = await getCourses({ per_page: 50 }, "en");
    const resAr = await getCourses({ per_page: 50 }, "ar");
    const params: { course: string }[] = [];
    for (const c of [...(resEn.data || []), ...(resAr.data || [])]) {
      const clean = normalizeSlug(c.slug);
      if (clean && !params.some((p) => p.course === clean)) {
        params.push({ course: clean });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { course: rawSlug, locale } = await params;
  const slug = normalizeSlug(rawSlug);
  const course = await getCourseBySlug(slug, locale);

  if (!course) {
    notFound();
  }

  const jsonLd = generateCourseSchema({
    title: course.title,
    description: course.description,
    image: course.cover_image,
    courseSlug: slug,
    locale,
    level: course.level,
    lectures: course.lectures?.map((lec) => ({
      title: lec.title,
      slug: lec.slug,
      description: lec.description,
    })),
  });

  return (
    <main className="min-h-screen pt-4 sm:pt-10 pb-24 sm:pb-16 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto">
      <JsonLd data={jsonLd} />
      <CourseDetailClient course={course} />
    </main>
  );
}
