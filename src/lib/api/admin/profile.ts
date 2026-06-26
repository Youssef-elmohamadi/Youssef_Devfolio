import { apiFetch } from "../config";

export async function getAdminUser() {
  try {
    const res = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/user`,
      { cache: "no-store" }, 
      "admin_token"
    );
    return res; 
  } catch (error) {
    return null;
  }
}

export async function getProfileData() {
  try {
    const res = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/profiles`,
      { cache: "no-store" }, 
      "admin_token"
    );
    return res.data; 
  } catch (error) {
    return null;
  }
}

export async function getSocialLinks() {
  try {
    const res = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/social-link-index`,
      { cache: "no-store" },
      "admin_token"
    );
    // SocialLinkResource returns an array directly, wrapped in apiFetch response
    return res.data || res;
  } catch (error) {
    return [];
  }
}

export async function getSupportedPlatforms() {
  try {
    const res = await apiFetch(
      (process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"),
      `/api/social-link-platforms`,
      { cache: "no-store" }
    );
    return res;
  } catch (error) {
    return [];
  }
}
