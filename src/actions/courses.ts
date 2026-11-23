'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { apiFetch } from "@/lib/api/config";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Create a new course
 */
export async function createCourseAction(formData: FormData): Promise<ActionResult> {
  try {
    const response = await apiFetch(
      BASE_URL,
      "/api/admin/courses",
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("courses");
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      message: "Course created successfully",
      data: response.data ?? response,
    };
  } catch (error: any) {
    console.error("createCourseAction error:", error);
    if (error?.type === "validation") {
      return {
        success: false,
        message: error.message || "Validation failed",
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error?.message || "Failed to create course",
    };
  }
}

/**
 * Update an existing course
 */
export async function updateCourseAction(
  id: number | string,
  formData: FormData,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    const response = await apiFetch(
      BASE_URL,
      `/api/admin/courses/${id}`,
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}`);
    revalidatePath("/courses");

    return {
      success: true,
      message: "Course updated successfully",
      data: response.data ?? response,
    };
  } catch (error: any) {
    console.error("updateCourseAction error:", error);
    if (error?.type === "validation") {
      return {
        success: false,
        message: error.message || "Validation failed",
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error?.message || "Failed to update course",
    };
  }
}

/**
 * Delete a course
 */
export async function deleteCourseAction(
  id: number | string,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    await apiFetch(
      BASE_URL,
      `/api/admin/courses/${id}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
    }
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return { success: true, message: "Course deleted successfully" };
  } catch (error: any) {
    console.error("deleteCourseAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to delete course",
    };
  }
}

/**
 * Toggle or set course publish status
 */
export async function toggleCoursePublishAction(
  id: number | string,
  isPublished?: boolean,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    const payload = typeof isPublished === "boolean" ? { is_published: isPublished } : {};
    const res = await apiFetch(
      BASE_URL,
      `/api/admin/courses/${id}/publish`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return { success: true, message: "Publish status updated", data: res };
  } catch (error: any) {
    console.error("toggleCoursePublishAction error:", error);
    return { success: false, message: error?.message || "Failed to update status" };
  }
}

/**
 * Create a lecture inside a course
 */
export async function createLectureAction(
  courseId: number | string,
  data: {
    title: string | Record<string, string>;
    description?: string | Record<string, string>;
    content: string | Record<string, string>;
    order?: number;
    is_published?: boolean;
    slug?: string | Record<string, string>;
  },
  courseSlug?: string
): Promise<ActionResult> {
  try {
    const response = await apiFetch(
      BASE_URL,
      `/api/admin/courses/${courseId}/lectures`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath(`/admin/courses/${courseId}/lectures`);

    return {
      success: true,
      message: "Lecture created successfully",
      data: response.data ?? response,
    };
  } catch (error: any) {
    console.error("createLectureAction error:", error);
    if (error?.type === "validation") {
      return {
        success: false,
        message: error.message || "Validation failed",
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error?.message || "Failed to create lecture",
    };
  }
}

/**
 * Update a lecture
 */
export async function updateLectureAction(
  courseId: number | string,
  lectureId: number | string,
  data: {
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
    content?: string | Record<string, string>;
    order?: number;
    is_published?: boolean;
    slug?: string | Record<string, string>;
  },
  courseSlug?: string,
  lectureSlug?: string
): Promise<ActionResult> {
  try {
    const response = await apiFetch(
      BASE_URL,
      `/api/admin/courses/${courseId}/lectures/${lectureId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    if (courseSlug && lectureSlug) {
      revalidateTag(`lecture:${courseSlug}:${lectureSlug}`);
      revalidatePath(`/courses/${courseSlug}/lectures/${lectureSlug}`);
    }
    revalidatePath(`/admin/courses/${courseId}/lectures`);

    return {
      success: true,
      message: "Lecture updated successfully",
      data: response.data ?? response,
    };
  } catch (error: any) {
    console.error("updateLectureAction error:", error);
    if (error?.type === "validation") {
      return {
        success: false,
        message: error.message || "Validation failed",
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error?.message || "Failed to update lecture",
    };
  }
}

/**
 * Delete a lecture
 */
export async function deleteLectureAction(
  courseId: number | string,
  lectureId: number | string,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    await apiFetch(
      BASE_URL,
      `/api/admin/courses/${courseId}/lectures/${lectureId}`,
      {
        method: "DELETE",
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath(`/admin/courses/${courseId}/lectures`);

    return { success: true, message: "Lecture deleted successfully" };
  } catch (error: any) {
    console.error("deleteLectureAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to delete lecture",
    };
  }
}

/**
 * Toggle lecture publish status
 */
export async function toggleLecturePublishAction(
  courseId: number | string,
  lectureId: number | string,
  isPublished?: boolean,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    const payload = typeof isPublished === "boolean" ? { is_published: isPublished } : {};
    const res = await apiFetch(
      BASE_URL,
      `/api/admin/courses/${courseId}/lectures/${lectureId}/publish`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath(`/admin/courses/${courseId}/lectures`);

    return { success: true, message: "Lecture publish status updated", data: res };
  } catch (error: any) {
    console.error("toggleLecturePublishAction error:", error);
    return { success: false, message: error?.message || "Failed to toggle status" };
  }
}

/**
 * Reorder lectures inside a course
 */
export async function reorderLecturesAction(
  courseId: number | string,
  lectures: Array<{ id: number; order: number }>,
  courseSlug?: string
): Promise<ActionResult> {
  try {
    await apiFetch(
      BASE_URL,
      `/api/admin/courses/${courseId}/lectures/reorder`,
      {
        method: "PATCH",
        body: JSON.stringify({ lectures }),
      },
      "admin_token"
    );

    revalidateTag("courses");
    if (courseSlug) {
      revalidateTag(`course:${courseSlug}`);
      revalidatePath(`/courses/${courseSlug}`);
    }
    revalidatePath(`/admin/courses/${courseId}/lectures`);

    return { success: true, message: "Lectures reordered successfully" };
  } catch (error: any) {
    console.error("reorderLecturesAction error:", error);
    return {
      success: false,
      message: error?.message || "Failed to reorder lectures",
    };
  }
}

/**
 * Upload asset (image/diagram/attachment) for Markdown lectures
 */
export async function uploadCourseAssetAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  path?: string;
  message?: string;
}> {
  try {
    const res = await apiFetch(
      BASE_URL,
      "/api/admin/uploads",
      {
        method: "POST",
        body: formData,
      },
      "admin_token"
    );

    return {
      success: true,
      url: res.url,
      path: res.path,
      message: "Asset uploaded successfully",
    };
  } catch (error: any) {
    console.error("uploadCourseAssetAction error:", error);
    return {
      success: false,
      message: error?.message || "Asset upload failed",
    };
  }
}

/**
 * Record view for a lecture (deduplicated by IP in backend)
 */
export async function recordLectureViewAction(
  courseSlug: string,
  lectureSlug: string
): Promise<{ success: boolean; views?: number }> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/courses/${encodeURIComponent(courseSlug)}/lectures/${encodeURIComponent(lectureSlug)}/view`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return { success: false };
    }

    const data = await res.json();
    return { success: true, views: data.views };
  } catch (error) {
    console.error("recordLectureViewAction error:", error);
    return { success: false };
  }
}
