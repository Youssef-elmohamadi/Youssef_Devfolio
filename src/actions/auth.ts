"use server";

import { apiFetch } from "@/lib/api/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await apiFetch(
      "http://127.0.0.1:8000",
      "/api/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    console.log("API Response:", response); // 👈 دي أهم سطر عشان نعرف شكل الداتا
console.log("Token to save:", response.token)

    // 2. تخزين التوكين في كوكيز آمنة
    // هذا الكود يعمل على السيرفر، لذا هو آمن
    const cookieStore = await cookies();
    
    cookieStore.set("admin_token", response.token, {
      httpOnly: false, // يمنع الوصول إليه عبر الجافاسكريبت
      secure: process.env.NODE_ENV === "production", // يعمل فقط على HTTPS في البرودكشن
      sameSite: "strict", // حماية من CSRF
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

  } catch (error: any) {
    return {
      error: error?.response?.data?.message || "Invalid credentials",
    };
  }
  redirect("/admin");
}