import { apiFetch } from "../config";

export async function login(email: string, password: string) {
  return await apiFetch(
    "https://khaled67.alwaysdata.net",
    "/api/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    "admin_token"
  );
}

export async function logout() {
  return await apiFetch(
    "https://khaled67.alwaysdata.net",
    "/api/logout",
    {
      method: "POST",
    },
    "admin_token"
  );
}