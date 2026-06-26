import CategoriesClient from "./CategoriesClient";
import { apiFetch } from "@/lib/api/config";

export const metadata = {
  title: "Categories | Admin Dashboard",
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export default async function CategoriesPage() {
  let categories: { id: number; name: string; slug?: string }[] = [];

  try {
    const res = await apiFetch(BASE_URL, "/api/categories", {
      next: { tags: ["categories-list"], revalidate: 3600 },
    });
    // Laravel may return {data:[...]} or a plain array
    categories = Array.isArray(res) ? res : res.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create and manage article categories.
        </p>
      </div>

      <CategoriesClient categories={categories} />
    </div>
  );
}

