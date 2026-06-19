'use server'
import { apiFetch } from "@/lib/api/config";
import { revalidatePath, revalidateTag } from "next/dist/server/web/spec-extension/revalidate";

export async function createSocialLink(platform: string, url: string) {
  try {
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      "/api/social-link",         
      {
        method: "POST",
        body: JSON.stringify({ platform, url }),        
      },
      "admin_token"            
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidateTag("home-data");

    return { success: true, message: "Social link created successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateSocialLink(id: number, platform: string, url: string) {
  try {
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      `/api/social-link/${id}`,         
      {
        method: "PUT",
        body: JSON.stringify({ platform, url }),        
      },
      "admin_token"            
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidateTag("home-data");

    return { success: true, message: "Social link updated successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function deleteSocialLink(id: number) {
  try {
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      `/api/social-link/${id}`,         
      {
        method: "DELETE",        
      },
      "admin_token"            
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidateTag("home-data");

    return { success: true, message: "Social link deleted successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}
