import React from "react";
import type { Metadata } from "next";
import BlogsClientPage from "./BlogsClientPage";
import { generateSEO } from "@/utils/seo";
import { getArticles } from "@/lib/api/articles";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const blogPageTitle = isAr
    ? "المقالات والتدوينات التقنية | يوسف المحمدي | The Forge"
    : "Blog Posts | Youssef Elmohamadi | The Forge";
  const blogPageDescription = isAr
    ? "اقرأ أحدث المقالات والدروس التقنية حول تطوير الويب، هندسة البرمجيات، React و Next.js و Laravel."
    : "Read the latest blog posts about web development, React, Next.js, and software engineering tips.";

  return generateSEO({
    title: blogPageTitle,
    description: blogPageDescription,
    type: "website",
    locale,
    asPath: "/blog",
    keywords: isAr
      ? [
          "يوسف المحمدي",
          "مقالات تقنية",
          "مدونة برمجية",
          "تطوير الويب",
          "React",
          "Laravel",
          "Next.js",
          "هندسة البرمجيات",
        ]
      : [
          "Youssef Elmohamadi",
          "blog",
          "web development",
          "React",
          "Laravel",
          "Software Engineering",
        ],
  });
}

export default async function Blog({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const response = await getArticles(page, 10, undefined, locale);

  const articles = response.data || [];
  const meta = response.meta || null;

  return (
    <main>
      <BlogsClientPage initialBlogs={articles} meta={meta} />
    </main>
  );
}
