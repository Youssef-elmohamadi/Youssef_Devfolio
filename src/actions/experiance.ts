"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";
export async function createExperianceAction(formData: FormData) {
  try {
    const response = await apiFetch(
      "https://khaled67.alwaysdata.net", 
      "/api/experiences",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('experiences-list');
        revalidateTag("about-data");
         revalidatePath("/admin/experiences");
         revalidatePath("/about");

    return { success: true, message: "experiences created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateExperianceAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/experiences/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("experieences-list");
    revalidateTag("about-data")
    revalidateTag(`experience-${id}`); 
    revalidatePath("/admin/experiences");
    revalidatePath(`/experiences/details/${id}`);
    revalidatePath("/about");

    return { success: true, message: "experience updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
  }
}

export async function deleteExperienceAction(id: number) {
  try {
    await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/experiences/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("experiences-list");
    revalidateTag("about-data");
    revalidatePath("/admin/experiences");
    revalidatePath("/about");
    return { success: true, message: "Experience deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}