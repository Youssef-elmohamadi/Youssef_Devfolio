"use server";

import { getAdminUser as apiGetAdminUser } from "@/lib/api/admin/profile";
import { logout as apiLogout } from "@/lib/api/admin/auth";
import { cookies } from "next/headers";

export async function getAdminUserAction() {
  return await apiGetAdminUser();
}

export async function logoutAction() {
  const res = await apiLogout();
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return res;
}
