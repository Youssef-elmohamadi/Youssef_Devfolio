import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function apiFetch(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {},
  tokenKey?: string,
  locale?: string
) {
  let token = "";
  let cookieStore: any = null;

  if (tokenKey) {
    if (typeof window === "undefined") {
      try {
        cookieStore = await cookies();
        token = cookieStore.get(tokenKey)?.value || "";
      } catch {
        token = "";
      }
    } else {
      token = localStorage.getItem(tokenKey) || "";
    }
  }

  // Determine active locale from argument or options headers
  const targetLocale =
    locale ||
    (options.headers as Record<string, string> | undefined)?.["Accept-Language"] ||
    "";

  // Build final endpoint ensuring ?lang= is set if locale is known
  let targetEndpoint = endpoint;
  if (targetLocale && !targetEndpoint.includes("lang=")) {
    const separator = targetEndpoint.includes("?") ? "&" : "?";
    targetEndpoint = `${targetEndpoint}${separator}lang=${encodeURIComponent(targetLocale)}`;
  }

  const headers: HeadersInit = {
    "Accept": "application/json",
    ...(targetLocale ? { "Accept-Language": targetLocale } : {}),
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res: Response | null = null;
  let lastError: any = null;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      res = await fetch(`${baseUrl}${targetEndpoint}`, {
        signal: AbortSignal.timeout(25000),
        ...options,
        headers,
      });
      break;
    } catch (fetchErr: any) {
      lastError = fetchErr;
      console.warn(
        `[apiFetch] Attempt ${attempt + 1}/${maxRetries + 1} failed for ${baseUrl}${endpoint}:`,
        fetchErr?.message
      );
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }
  }

  if (!res) {
    console.error(
      `[apiFetch] All ${maxRetries + 1} attempts failed for ${baseUrl}${endpoint}:`,
      lastError?.message,
      lastError?.cause
    );
    throw lastError;
  }
  if (res.status === 401 || res.status === 419) {
    if (typeof window === "undefined") {
      try {
        if (tokenKey) cookieStore?.delete(tokenKey);
      } catch {
      }
      redirect("/admin/login");
    } else {
      if (tokenKey) {
        localStorage.removeItem(tokenKey);
        document.cookie = `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
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

    if (res.status === 404) {
      const err: any = new Error(errorJson?.message || "Resource Not Found");
      err.status = 404;
      throw err;
    }

    if (res.status === 422 && errorJson?.errors) {
      throw {
        type: "validation",
        status: 422,
        message: errorJson?.message || "Validation Error",
        errors: errorJson.errors,
      };
    }
    const generalErr: any = new Error(errorJson?.message || `API Error: ${res.status}`);
    generalErr.status = res.status;
    throw generalErr;
  }
  
  return res.json();
}