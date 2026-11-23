import { apiFetch } from "./config";

export const getAboutData = async (locale: string = "en") => {
  try {
    const data = await apiFetch(
      process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net",
      `/api/portfolio-data?lang=${encodeURIComponent(locale)}`,
      {
        headers: { "Accept-Language": locale },
        next: {
          tags: ["about-data", `about-data:${locale}`],
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