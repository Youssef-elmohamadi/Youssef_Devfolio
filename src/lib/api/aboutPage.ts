import { apiFetch } from "./config";

export const getAboutData = async () => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/portfolio-data`, {
      next: {
        tags: ['about-data'],
        revalidate: 3600*24, 
       },
    });

    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Failed to load articles");
  }
};