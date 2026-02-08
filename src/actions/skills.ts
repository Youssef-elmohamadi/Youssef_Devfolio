"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";
export async function createSkillAction(formData: FormData) {
  try {
    const response = await apiFetch(
      "https://khaled67.alwaysdata.net", 
      "/api/skills",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('skills-list');
        revalidateTag("about-data");
         revalidatePath("/admin/skills");
         revalidatePath("/about");

    return { success: true, message: "Skill created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateSkillAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/skills/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("skills-list");
    revalidateTag("about-data")
    revalidateTag(`skill-${id}`); 
    revalidatePath("/admin/skills");
    revalidatePath(`/skills/${id}`);
    revalidatePath("/about");

    return { success: true, message: "Skill updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
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
    revalidateTag("skills-list");
    revalidateTag("about-data");
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    return { success: true, message: "Skill deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}