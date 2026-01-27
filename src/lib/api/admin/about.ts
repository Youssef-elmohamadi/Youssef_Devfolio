
import { apiFetch } from "../config";

export async function getAboutData() {
  try {
    const res = await apiFetch(
      "http://127.0.0.1:8000",
      `/api/about`,
      { cache: "no-store" }, 
      "admin_token",

    );
    return res.data; 
  } catch (error) {
    return null;
  }
}




