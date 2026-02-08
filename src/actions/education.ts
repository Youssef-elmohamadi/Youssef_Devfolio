"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";
export async function createEduecationAction(formData: FormData) {
  try {
    const response = await apiFetch(
      "https://khaled67.alwaysdata.net", 
      "/api/education",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

        revalidateTag('educations-list');
        revalidateTag("about-data");
         revalidatePath("/admin/educations");
         revalidatePath("/about");

    return { success: true, message: "educations created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateEducationsAction(id: number, formData: FormData) {
  try {

    const response = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/education/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("educations-list");
    revalidateTag("about-data")
    revalidateTag(`education-${id}`); 
    revalidatePath("/admin/educations");
    revalidatePath(`/educations/details/${id}`);
    revalidatePath("/about");

    return { success: true, message: "education updated successfully" };
  } catch (error: any) {
    console.error("Update Action Error:", error);
    return { success: false, message: error.message || "Failed to update" };
  }
}

export async function deleteEducationAction(id: number) {
  try {
    await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/education/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );
    revalidateTag("educations-list");
    revalidateTag("about-data");
    revalidatePath("/admin/educations");
    revalidatePath("/about");
    return { success: true, message: "educations deleted successfully" };
  } catch (error: any) {
    console.error("Delete Action Error:", error);
    return { success: false, message: error.message || "Failed to delete" };
  }
}