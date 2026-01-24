import { cookies } from "next/headers";

export async function apiFetch(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {},
  tokenKey: string = "admin_token"
) {
  let token = "";
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    token = cookieStore.get(tokenKey)?.value || "";
  } else {
    token = localStorage.getItem(tokenKey) || "";
  }

  const headers: HeadersInit = {
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });
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