'use server'
import { apiFetch } from "@/lib/api/config";
import { revalidatePath, revalidateTag } from "next/dist/server/web/spec-extension/revalidate";

export async function saveProfileData(formData: FormData, id?: number) {
  try {
    const endpoint = id ? `/api/profiles/${id}` : "/api/profiles";
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      endpoint,         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidateTag("home-data");

    return { success: true, message: "Profile saved successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}
