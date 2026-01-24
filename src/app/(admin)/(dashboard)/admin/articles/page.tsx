// app/admin/articles/page.tsx
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { getArticles } from "@/lib/api/articles";
import ArticlesClient from "./ArticlesClient";

// 1. تعريف نوع الـ Props لاستقبال الباراميترز من الرابط
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// 2. استقبال searchParams كـ Prop
export default async function ArticlesPage({ searchParams }: Props) {
  // 3. استخراج رقم الصفحة (لو مش موجود نعتبره 1)
  // في Next.js 15 قد تحتاج لـ await searchParams، في 14 تعمل مباشرة
  const pageParam = searchParams?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;

  // 4. تمرير رقم الصفحة للدالة
  const articles = await getArticles(page);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Articles Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, edit, and manage your blog posts.
          </p>
        </div>
        <Link
          href="/admin/articles/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaPlus className="text-sm" />
          <span>Add New Article</span>
        </Link>
      </div>

      {/* تمرير البيانات والميتا للعميل */}
      <ArticlesClient articles={articles.data} meta={articles.meta} />
    </div>
  );
}
