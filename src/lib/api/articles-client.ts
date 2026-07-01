/**
 * articles-client.ts
 *
 * Client-safe article fetching functions.
 * ⚠️  Do NOT import apiFetch or anything from lib/api/config here.
 *      This file must be free of "next/headers" to work inside "use client" components.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

/**
 * Fetch a paginated list of articles, optionally filtered by category.
 * Safe to call from Client Components.
 */
export const getArticlesClient = async (
  page: number,
  per_page = 10,
  categoryId?: number | null
) => {
  const query = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });
  if (categoryId) query.append("category_id", categoryId.toString());

  const res = await fetch(`${BASE_URL}/api/articles?${query.toString()}`, {
    next: {
      tags: ['articles-list'],
      revalidate: 3600 * 24,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json() as Promise<{ data: any[]; meta: any }>;
};
