"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";
export async function createProjectAction(formData: FormData) {
  try {
    const response = await apiFetch(
      "https://khaled67.alwaysdata.net", 
      "/api/projects",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('projects-list');
         revalidatePath("/admin/projects");
         revalidatePath("/projects");

    return { success: true, message: "Project created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateProjectAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/projects/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("projects-list");
    revalidateTag(`project-${id}`); 
    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");

    return { success: true, message: "Project updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
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
    revalidatePath("/projects");
    return { success: true, message: "Project deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}