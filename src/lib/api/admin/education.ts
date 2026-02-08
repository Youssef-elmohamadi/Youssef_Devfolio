import { apiFetch } from "../config";

export const getAllEducations = async (page: number, per_page=10) => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/education?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['educations-list'],
        revalidate: 3600*24,
       },
    });

    return data;
  } catch (error) {
    console.error("Error fetching educations:", error);
    throw new Error("Failed to load educations");
  }
};


export async function getEducationsForEdit(id: string) {
  try {
    const res = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/education/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res; 
  } catch (error) {
    return null;
  }
}