import { apiFetch } from "./config";

export const getArticles = async (page: number, per_page = 10, categoryId?: number) => {
  try {
    const query = new URLSearchParams({ page: page.toString(), per_page: per_page.toString() });
    if (categoryId) query.append('category_id', categoryId.toString());
    const data = await apiFetch((process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), `/api/articles?${query.toString()}`, {
      next: {
        tags: ['articles-list'],
        revalidate: 3600 * 24,
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to load articles");
  }
};


export async function getArticleForEndUser(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";
    const res = await fetch(`${baseUrl}/api/articles/${id}`, {
      next: { revalidate: 3600,
       tags: ['articles-list',`article-${id}`],
                
       },
      
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}


export const toglleLikeArticle = async (articleId: number) => {
  try {
    const data = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
        `/api/articles/${articleId}/like`,
        {method: "POST",})
    return data;
  } catch (error) {
    console.error("Error toggling like for article:", error);
    throw error;
  } 
};

export async function getArticleForEdit(id: string) {
  try {
    const res = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/articles/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}