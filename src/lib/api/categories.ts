import axios from "axios";
import { unwrapField, normalizeSlug } from "@/utils/slug";

type Category = { id: number; name: string; slug?: string };

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export const getCategories = async (locale: string = "en"): Promise<Category[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/categories?lang=${encodeURIComponent(locale)}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      next: {
        revalidate: 3600 * 24,
        tags: ["categories-list", `categories-list:${locale}`],
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((c: any) => ({
      ...c,
      name: unwrapField(c.name, locale),
      slug: normalizeSlug(c.slug),
    }));
  } catch (err) {
    console.error("Failed to load categories", err);
    return [];
  }
};

export const createCategory = async (payload: Partial<Category>) => {
  return await axios.post(`${BASE_URL}/api/categories`, payload);
};

export const updateCategory = async (id: number, payload: Partial<Category>) => {
  return await axios.put(`${BASE_URL}/api/categories/${id}`, payload);
};

export const deleteCategory = async (id: number) => {
  return await axios.delete(`${BASE_URL}/api/categories/${id}`);
};
