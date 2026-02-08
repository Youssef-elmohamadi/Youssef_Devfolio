import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "../config";

export const getAllExperiences = async (page: number, per_page=10) => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/experiences?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['experiences-list'],
        revalidate: 3600*24,
       },
    });

    return data;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw new Error("Failed to load experiences");
  }
};


export async function getExperiencesForEdit(id: string) {
  try {
    const res = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/experiences/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}