import { apiFetch } from "./config";

export const getArticles = async (
  page: number,
  per_page = 10,
  categoryId?: number,
  locale: string = "en"
) => {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      lang: locale,
    });
    if (categoryId) query.append("category_id", categoryId.toString());
    const data = await apiFetch(
      process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net",
      `/api/articles?${query.toString()}`,
      {
        headers: { "Accept-Language": locale },
        next: {
          tags: ["articles-list", `articles-list:${locale}`],
          revalidate: 3600 * 24,
        },
      },
      undefined,
      locale
    );

    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to load articles");
  }
};


export async function getArticleForEndUser(id: string, locale: string = "en") {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";
    const res = await fetch(`${baseUrl}/api/articles/${id}?lang=${encodeURIComponent(locale)}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      next: {
        revalidate: 3600,
        tags: ["articles-list", `articles-list:${locale}`, `article-${id}`, `article-${locale}-${id}`],
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
      `/api/articles/${id}?translations=all`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}