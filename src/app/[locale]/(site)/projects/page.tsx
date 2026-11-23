import React from "react";
import type { Metadata } from "next";
import ProjectsClientPage from "./ProjectsClientPage";
import { generateSEO } from "@/utils/seo";
import { getProjects } from "@/lib/api/admin/projects";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const projectsPageTitle = isAr
    ? "المشاريع البرمجية | يوسف المحمدي | The Forge"
    : "Projects | Youssef Elmohamadi | The Forge";
  const projectsPageDescription = isAr
    ? "استكشف أحدث مشاريع وتطبيقات الويب التي قمت بتطويرها باستخدام React و Next.js و Laravel و .NET."
    : "Explore my latest web development projects, featuring React, Next.js, and Laravel applications.";

  return generateSEO({
    title: projectsPageTitle,
    description: projectsPageDescription,
    type: "website",
    locale,
    asPath: "/projects",
    keywords: isAr
      ? [
          "يوسف المحمدي",
          "مشاريع برمجية",
          "معرض الأعمال",
          "React",
          "Laravel",
          "Next.js",
          "تطبيقات ويب",
        ]
      : [
          "Youssef Elmohamadi",
          "Projects",
          "Portfolio",
          "React",
          "Laravel",
          "Full Stack",
          "Web Applications",
        ],
  });
}

export default async function Projects({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const response = await getProjects(page, 10, locale);

  const projects = response.data || [];
  const meta = response.meta || null;

  return (
    <main>
      <ProjectsClientPage initialProjects={projects} meta={meta} />
    </main>
  );
}
