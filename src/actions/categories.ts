"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export async function createCategoryAction(formData: FormData) {
  try {
    await apiFetch(BASE_URL, "/api/categories", {
      method: "POST",
      body: formData,
    }, "admin_token");

    revalidateTag("categories-list");
    revalidatePath("/admin/categories");
    return { success: true, message: "Category created" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create category" };
  }
}

export async function updateCategoryAction(id: number, formData: FormData) {
  try {
    await apiFetch(BASE_URL, `/api/categories/${id}`, {
      method: "POST",
      body: formData,
    }, "admin_token");

    revalidateTag("categories-list");
    revalidatePath("/admin/categories");
    return { success: true, message: "Category updated" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    await apiFetch(BASE_URL, `/api/categories/${id}`, {
      method: "DELETE",
    }, "admin_token");

    revalidateTag("categories-list");
    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete category" };
  }
}
