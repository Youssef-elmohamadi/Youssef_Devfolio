import { apiFetch } from "../config";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

export type ContactListResponse = {
  data: ContactMessage[];
  meta: ContactMeta;
};

/**
 * Fetch a paginated list of contact messages (newest first).
 * Requires admin authentication.
 */
export async function getContacts(
  page: number,
  per_page = 10
): Promise<ContactListResponse> {
  try {
    const data = await apiFetch(
      API_BASE,
      `/api/contacts?page=${page}&per_page=${per_page}`,
      { cache: "no-store" },
      "admin_token"
    );
    return data;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Error fetching contacts:", error);
    throw new Error("Failed to load contact messages");
  }
}

/**
 * Fetch a single contact message by ID.
 * This automatically marks the message as read on the backend.
 */
export async function getContact(id: number): Promise<ContactMessage> {
  try {
    const res = await apiFetch(
      API_BASE,
      `/api/contacts/${id}`,
      { cache: "no-store" },
      "admin_token"
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching contact #${id}:`, error);
    throw new Error("Failed to load message");
  }
}

/**
 * Toggle the read/unread status of a contact message.
 */
export async function toggleContactRead(id: number): Promise<ContactMessage> {
  try {
    const res = await apiFetch(
      API_BASE,
      `/api/contacts/${id}/toggle-read`,
      { method: "POST" },
      "admin_token"
    );
    return res.data;
  } catch (error) {
    console.error(`Error toggling read status for contact #${id}:`, error);
    throw new Error("Failed to update read status");
  }
}

/**
 * Permanently delete a contact message.
 */
export async function deleteContact(id: number): Promise<void> {
  try {
    await apiFetch(
      API_BASE,
      `/api/contacts/${id}`,
      { method: "DELETE" },
      "admin_token"
    );
  } catch (error) {
    console.error(`Error deleting contact #${id}:`, error);
    throw new Error("Failed to delete message");
  }
}
