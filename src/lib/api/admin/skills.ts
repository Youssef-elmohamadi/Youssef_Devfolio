import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "../config";

export const getSkills = async (page: number, per_page=10) => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/skills?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['skills-list'],
        revalidate: 3600*24,
       },
    });

    return data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw new Error("Failed to load skills");
  }
};


export async function getSkillForEdit(id: string) {
  try {
    const res = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/skills/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}

export async function deleteSkillAction(id: number) {
  try {
    await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/skills/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("articles-list");
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    return { success: true, message: "skill deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}