import React from "react";
import type { Metadata } from "next";
import { getCourses } from "@/lib/api/courses";
import CoursesClientPage from "./CoursesClientPage";
import { generateSEO } from "@/utils/seo";

interface CoursesPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    subject?: string;
    tag?: string;
    level?: string;
    status?: string;
    search?: string;
    sort?: "latest" | "oldest" | "title";
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CoursesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "الكورسات والدروس التفاعلية | يوسف المحمدي"
    : "Interactive Courses & Tutorials | Youssef Elmohamadi";
  const description = isAr
    ? "كورسات وشروحات برمجية متعمقة في .NET Core، Clean Architecture، React، Next.js وهندسة البرمجيات."
    : "In-depth written courses and tutorials on .NET Core, Clean Architecture, React, Next.js, and Software Engineering.";

  return generateSEO({
    title,
    description,
    type: "website",
    locale,
    asPath: "/courses",
    keywords: isAr
      ? [
          "كورسات برمجية",
          "دروس تفاعلية",
          "Clean Architecture",
          ".NET 8",
          "ASP.NET Core",
          "React",
          "Next.js",
          "هندسة البرمجيات",
          "تطوير الويب",
        ]
      : [
          "Courses",
          "Tutorials",
          "Clean Architecture",
          ".NET 8",
          "ASP.NET Core",
          "React",
          "Next.js",
          "Software Engineering",
          "Backend Development",
        ],
  });
}

export default async function CoursesPage({ params, searchParams }: CoursesPageProps) {
  const { locale } = await params;
  const sp = await searchParams;

  const page = sp.page ? Math.max(1, parseInt(sp.page, 10)) : 1;

  const response = await getCourses(
    {
      page,
      per_page: 9,
      subject: sp.subject,
      tag: sp.tag,
      level: sp.level,
      status: sp.status,
      search: sp.search,
      sort: sp.sort || "latest",
    },
    locale
  );

  return (
    <main className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto">
      <CoursesClientPage
        initialCourses={response.data || []}
        meta={response.meta}
        filtersMetadata={response.filters}
        currentParams={sp}
      />
    </main>
  );
}
