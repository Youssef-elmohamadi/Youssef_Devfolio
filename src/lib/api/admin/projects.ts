import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "../config";

export const getProjects = async (page: number, per_page=10) => {
  try {
    const data = await apiFetch("https://khaled67.alwaysdata.net", `/api/projects?page=${page}&per_page=${per_page}`, {
      next: {
        tags: ['projects-list'],
        revalidate: 3600*24,
       },
    });

    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to load projects");
  }
};


export async function getProjectForEdit(id: string) {
  try {
    const res = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/projects/${id}`,
      { cache: "no-store" }, 
      "admin_token",
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}

export async function deleteProjectAction(id: number) {
  try {
    await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/projects/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("projects-list");
    revalidatePath("/admin/projects");
    revalidatePath("/about");
    return { success: true, message: "project deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}