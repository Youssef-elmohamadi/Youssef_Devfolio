"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";
export async function createProjectAction(formData: FormData) {
  try {
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      "/api/projects",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('projects-list');
        revalidateTag("home-data");
        revalidateTag("home-data:en");
        revalidateTag("home-data:ar");
        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/");
        revalidatePath("/en");
        revalidatePath("/ar");

    return { success: true, message: "Project created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateProjectAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/projects/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("projects-list");
    revalidateTag(`project-${id}`); 
    revalidateTag("home-data");
    revalidateTag("home-data:en");
    revalidateTag("home-data:ar");
    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/ar");

    return { success: true, message: "Project updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
  }
}

export async function deleteProjectAction(id: number) {
  try {
    await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/projects/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("projects-list");
    revalidateTag("home-data");
    revalidateTag("home-data:en");
    revalidateTag("home-data:ar");
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/ar");
    return { success: true, message: "Project deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}