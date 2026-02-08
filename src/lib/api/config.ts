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

  if (typeof window === "undefined") {
    cookieStore = await cookies();
    token = cookieStore.get(tokenKey)?.value || "";
  } else {
    token = localStorage.getItem(tokenKey) || "";
  }

  const headers: HeadersInit = {
    "Accept": "application/json",
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });
  if (res.status === 401 || res.status === 419) {
    if (typeof window === "undefined") {
      cookieStore?.delete(tokenKey);
      redirect("/admin/login");
    } else {
      localStorage.removeItem(tokenKey);
      document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      window.location.href = "/admin/login";
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.log("API Fetch Error Response Text:", errorText);
    let errorJson: any = null;
    try {
       errorJson = JSON.parse(errorText);
    } catch (e) {
      throw new Error(`API Error: ${res.status}`);
    }

    if (res.status === 422 && errorJson.errors) {
      throw {
        type: "validation",
        message: errorJson.message || "Validation Error",
        errors: errorJson.errors,
      };
    }
    throw new Error(errorJson.message || `API Error: ${res.status}`);
      }
  
  return res.json();
}