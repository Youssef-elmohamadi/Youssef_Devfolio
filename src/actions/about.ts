'use server'
import { apiFetch } from "@/lib/api/config";
import { revalidatePath, revalidateTag } from "next/cache";

export async function pushAboutData(formData: FormData) {
  try {
    const response = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"), 
      "/api/about/update",         
      {
        method: "POST",
        body: formData,        
      },
      "admin_token"            
    );

    revalidateTag("about-data");
    revalidateTag("about-data:en");
    revalidateTag("about-data:ar");
    revalidateTag("home-data");
    revalidatePath("/admin/about");
    revalidatePath("/about");
    revalidatePath("/en/about");
    revalidatePath("/ar/about");

    return { success: true, message: "About data pushed successfully", data: response };

  } catch (error: any) {
    console.error("Action Error:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}