import { apiFetch } from "./config";

export const getArticles = async (page , per_page=10) => {
  try {
    const data = await apiFetch("http://127.0.0.1:8000", `/api/articles?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['articles-list']
       },
      
    });

    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to load articles");
  }
};


export const toglleLikeArticle = async (articleId: number) => {
  try {
    const data = await apiFetch(
      "http://127.0.0.1:8000",
        `/api/articles/${articleId}/like`,
        {method: "POST",})
    return data;
  } catch (error) {
    console.error("Error toggling like for article:", error);
    throw error;
  } 
};
