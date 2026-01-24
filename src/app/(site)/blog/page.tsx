// app/blog/page.tsx
import React, { Suspense } from "react";
import BlogsClientPage from "./BlogsClientPage";
import { generateSEO } from "@/utils/seo";
import { getArticles } from "@/lib/api/articles";
import Loading from "./load";

const blogPageTitle = "Blog Posts | Youssef Elmohamadi | The Forge";
const blogPageDescription =
  "Read the latest blog posts about web development, React, Next.js, and software engineering tips.";

export const metadata = generateSEO({
  title: blogPageTitle,
  description: blogPageDescription,
  type: "website",
  keywords: [
    "Youssef Elmohamadi",
    "blog",
    "web development",
    "React",
    "Laravel",
  ],
});

// تعريف واجهة الخصائص لاستقبال الباراميترز
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function ArticlesWrapper({ page }: { page: number }) {
  // جلب المقالات بناءً على رقم الصفحة
  const response = await getArticles(page);

  // التحقق من شكل البيانات (لضمان عدم حدوث خطأ إذا كانت المصفوفة فارغة)
  const articles = response.data || [];
  const meta = response.meta || null;

  return <BlogsClientPage initialBlogs={articles} meta={meta} />;
}

export default function Blog({ searchParams }: Props) {
  // استخراج رقم الصفحة (الافتراضي 1)
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ArticlesWrapper page={page} />
      </Suspense>
    </main>
  );
}
