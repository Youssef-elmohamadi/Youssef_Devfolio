import { apiFetch } from "./config";

export const getArticles = async (page: number, per_page=10) => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/articles?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['articles-list'],
        revalidate: 3600*24, // إعادة التحقق كل 24 ساعة
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
    const res = await fetch(`https://khaled67.alwaysdata.net/api/articles/${id}`, {
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
      "https://khaled67.alwaysdata.net",
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
      "https://khaled67.alwaysdata.net",
      `/api/articles/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}