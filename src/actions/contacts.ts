"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/config";
import type { ContactMessage } from "@/lib/api/admin/contacts";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

/**
 * Server Action: Fetch a single contact message by ID.
 * This automatically marks the message as read on the backend.
 */
export async function getContactDetailsAction(
  id: number
): Promise<{ success: boolean; data?: ContactMessage; message?: string }> {
  try {
    const res = await apiFetch(
      API_BASE,
      `/api/contacts/${id}`,
      { cache: "no-store" },
      "admin_token"
    );
    // Revalidate the list so the read status badge updates
    revalidatePath("/admin/messages");
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("getContactDetailsAction Error:", error);
    return { success: false, message: error.message || "Failed to load message" };
  }
}

/**
 * Server Action: Toggle read/unread status of a contact message.
 */
export async function toggleContactReadAction(
  id: number
): Promise<{ success: boolean; data?: ContactMessage; message?: string }> {
  try {
    const res = await apiFetch(
      API_BASE,
      `/api/contacts/${id}/toggle-read`,
      { method: "POST" },
      "admin_token"
    );
    revalidatePath("/admin/messages");
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("toggleContactReadAction Error:", error);
    return {
      success: false,
      message: error.message || "Failed to toggle read status",
    };
  }
}

/**
 * Server Action: Permanently delete a contact message.
 */
export async function deleteContactAction(
  id: number
): Promise<{ success: boolean; message: string }> {
  try {
    await apiFetch(
      API_BASE,
      `/api/contacts/${id}`,
      { method: "DELETE" },
      "admin_token"
    );
    revalidatePath("/admin/messages");
    return { success: true, message: "Message deleted successfully" };
  } catch (error: any) {
    console.error("deleteContactAction Error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete message",
    };
  }
}
