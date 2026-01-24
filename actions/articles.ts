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