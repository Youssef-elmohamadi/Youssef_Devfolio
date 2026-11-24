import React from "react";
import type { Metadata } from "next";
import BlogsClientPage from "./BlogsClientPage";
import { generateSEO } from "@/utils/seo";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category_id?: string }>;
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
  const categoryId = typeof sp.category_id === "string" ? Number(sp.category_id) : undefined;

  const [response, categories] = await Promise.all([
    getArticles(page, 10, categoryId, locale),
    getCategories(locale).catch(() => []),
  ]);

  const articles = response?.data || [];
  const meta = response?.meta || null;
  const firstArticleImage = articles[0]?.feature_image;

  return (
    <main>
      {firstArticleImage && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(firstArticleImage)}&w=640&q=70`}
          imageSrcSet={`/_next/image?url=${encodeURIComponent(firstArticleImage)}&w=384&q=70 384w, /_next/image?url=${encodeURIComponent(firstArticleImage)}&w=480&q=70 480w, /_next/image?url=${encodeURIComponent(firstArticleImage)}&w=640&q=70 640w, /_next/image?url=${encodeURIComponent(firstArticleImage)}&w=750&q=70 750w, /_next/image?url=${encodeURIComponent(firstArticleImage)}&w=828&q=70 828w, /_next/image?url=${encodeURIComponent(firstArticleImage)}&w=1080&q=70 1080w`}
          imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fetchPriority="high"
        />
      )}
      <BlogsClientPage
        initialBlogs={articles}
        meta={meta}
        initialCategories={categories}
      />
    </main>
  );
}
