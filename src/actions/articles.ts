'use server' // هذا السطر ضروري جداً

import { revalidatePath, revalidateTag } from "next/cache";
import { toglleLikeArticle } from "@/lib/api/articles"; // استورد دالتك القديمة
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api/config";

export async function likeArticleAction(articleId: number) {
  try {
    const result = await toglleLikeArticle(articleId);

    revalidateTag('articles-list');

    return result;
  } catch (error) {
    throw error;
  }
}

export async function createArticleAction(formData: FormData) {
  try {
    const response = await apiFetch(
      "http://127.0.0.1:8000", 
      "/api/articles",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('articles-list');

    revalidatePath("/admin/articles");

    return { success: true, message: "Article created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}


export async function updateArticleAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      "http://127.0.0.1:8000",
      `/api/articles/${id}`,
      {
        method: "POST", // نستخدم POST فعلياً
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("articles-list");
    revalidatePath("/admin/articles");
    revalidatePath(`/blog/${id}`); // تحديث صفحة المقال نفسها

    return { success: true, message: "Article updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
  }
}


export async function deleteArticleAction(id: number) {
  try {
    await apiFetch(
      "http://127.0.0.1:8000",
      `/api/articles/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("articles-list");
    revalidatePath("/admin/articles");
    return { success: true, message: "Article deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}