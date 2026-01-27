'use server'
import { apiFetch } from "@/lib/api/config";
import { revalidatePath, revalidateTag } from "next/dist/server/web/spec-extension/revalidate";

export async function pushAboutData(formData: FormData) {
  try {
    const response = await apiFetch(
      "http://127.0.0.1:8000", 
      "/api/about/update",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

             revalidatePath("/admin/about");
             revalidatePath("/about");

    return { success: true, message: "About data pushed successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}