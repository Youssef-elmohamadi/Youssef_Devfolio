import { apiFetch } from "../config";

export async function login(email: string, password: string) {
  return await apiFetch(
    "http://127.0.0.1:8000",
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
    "http://127.0.0.1:8000",
    "/api/logout",
    {
      method: "POST",
    },
    "admin_token"
  );
}