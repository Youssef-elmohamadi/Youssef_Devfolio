
import { apiFetch } from "../config";

export async function getAboutData() {
  try {
    const res = await apiFetch(
      "https://khaled67.alwaysdata.net",
      `/api/about`,
      { cache: "no-store" }, 
      "admin_token",

    );
    return res.data; 
  } catch (error) {
    return null;
  }
}




