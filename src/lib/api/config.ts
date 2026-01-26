import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function apiFetch(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {},
  tokenKey: string = "admin_token"
) {
  let token = "";
  let cookieStore: any = null;

  // 1. تحديد مكان جلب التوكن (سيرفر أم كلينت)
  if (typeof window === "undefined") {
    cookieStore = await cookies();
    token = cookieStore.get(tokenKey)?.value || "";
  } else {
    // ملحوظة: في Next.js App Router يفضل الاعتماد دائماً على الكوكيز حتى في الكلينت
    // لكننا سنبقي على localStorage كخيار احتياطي كما في كودك
    token = localStorage.getItem(tokenKey) || "";
  }

  // 2. تجهيز الهيدرز مع إجبار الاستجابة بصيغة JSON
  const headers: HeadersInit = {
    "Accept": "application/json", // أهم إضافة لمنع الـ HTML 500
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. التعامل مع انتهاء الصلاحية أو تضارب الجلسات (401 و 419)
  if (res.status === 401 || res.status === 419) {
    if (typeof window === "undefined") {
      // مسح الكوكي من السيرفر سايد
      cookieStore?.delete(tokenKey);
      redirect("/admin/login");
    } else {
      // مسح الكوكي والتوكن من الكلينت سايد
      localStorage.removeItem(tokenKey);
      document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      window.location.href = "/admin/login";
    }
  }

  // 4. معالجة الأخطاء الأخرى
  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || `API Error: ${res.status}`);
    } catch (e) {
      console.error("Non-JSON Error Response:", errorText);
      throw new Error(`API Error: ${res.status} (Check server logs)`);
    }
  }

  return res.json();
}