import { apiFetch } from "./config";
import { unwrapField, normalizeSlug } from "@/utils/slug";
export { unwrapField, normalizeSlug };
import type {
  CoursesApiResponse,
  CourseDetail,
  LectureDetail,
  CourseQueryParams,
  CourseTag,
  CourseCard,
  LectureListItem,
} from "@/types/courses";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

function sanitizeCourseCard(c: any, locale: string = "en"): CourseCard {
  return {
    ...c,
    title: unwrapField(c.title, locale),
    slug: normalizeSlug(c.slug),
    slugs:
      typeof c.slugs === "object" && c.slugs !== null
        ? {
            en: normalizeSlug(c.slugs.en),
            ar: normalizeSlug(c.slugs.ar),
          }
        : undefined,
    available_locales: Array.isArray(c.available_locales) ? c.available_locales : ["en", "ar"],
    description: unwrapField(c.description, locale),
    subject: unwrapField(c.subject, locale),
    tags: Array.isArray(c.tags)
      ? c.tags.map((t: any) => ({
          ...t,
          name: unwrapField(t.name, locale),
          slug: normalizeSlug(t.slug),
        }))
      : [],
  };
}

function sanitizeCourseDetail(c: any, locale: string = "en"): CourseDetail {
  return {
    ...sanitizeCourseCard(c, locale),
    total_reading_time: Number(c.total_reading_time) || 0,
    lectures: Array.isArray(c.lectures)
      ? c.lectures.map((l: any) => ({
          ...l,
          title: unwrapField(l.title, locale),
          slug: normalizeSlug(l.slug),
          slugs:
            typeof l.slugs === "object" && l.slugs !== null
              ? {
                  en: normalizeSlug(l.slugs.en),
                  ar: normalizeSlug(l.slugs.ar),
                }
              : undefined,
          available_locales: Array.isArray(l.available_locales) ? l.available_locales : ["en", "ar"],
          description: unwrapField(l.description, locale),
        }))
      : [],
  };
}

function sanitizeLectureDetail(l: any, locale: string = "en"): LectureDetail {
  return {
    ...l,
    title: unwrapField(l.title, locale),
    slug: normalizeSlug(l.slug),
    slugs:
      typeof l.slugs === "object" && l.slugs !== null
        ? {
            en: normalizeSlug(l.slugs.en),
            ar: normalizeSlug(l.slugs.ar),
          }
        : undefined,
    available_locales: Array.isArray(l.available_locales) ? l.available_locales : ["en", "ar"],
    description: unwrapField(l.description, locale),
    content: unwrapField(l.content, locale),
    course: l.course ? sanitizeCourseCard(l.course, locale) : l.course,
    previous_lecture: l.previous_lecture
      ? {
          ...l.previous_lecture,
          slug: normalizeSlug(l.previous_lecture.slug),
          title: unwrapField(l.previous_lecture.title, locale),
        }
      : null,
    next_lecture: l.next_lecture
      ? {
          ...l.next_lecture,
          slug: normalizeSlug(l.next_lecture.slug),
          title: unwrapField(l.next_lecture.title, locale),
        }
      : null,
  };
}

/**
 * Fetch published courses with filters and pagination (Public)
 */
export async function getCourses(
  params: CourseQueryParams = {},
  locale: string = "en"
): Promise<CoursesApiResponse> {
  const query = new URLSearchParams();

  if (params.page) query.append("page", params.page.toString());
  if (params.per_page) query.append("per_page", params.per_page.toString());
  if (params.subject) query.append("subject", params.subject);
  if (params.tag) query.append("tag", params.tag);
  if (params.level) query.append("level", params.level);
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.sort) query.append("sort", params.sort);
  query.append("lang", locale);

  const endpoint = `/api/courses?${query.toString()}`;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      next: {
        tags: ["courses", `courses:${locale}`],
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch courses: ${res.status}`);
    }

    const json = await res.json();
    return {
      ...json,
      data: (json.data || []).map((c: any) => sanitizeCourseCard(c, locale)),
      filters: {
        ...json.filters,
        subjects: (json.filters?.subjects || []).map((s: any) => ({
          ...s,
          name: unwrapField(s.name, locale),
        })),
        tags: (json.filters?.tags || []).map((t: any) => ({
          ...t,
          name: unwrapField(t.name, locale),
          slug: normalizeSlug(t.slug),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      meta: { current_page: 1, from: 0, last_page: 1, per_page: 12, to: 0, total: 0 },
      links: {},
      filters: { subjects: [], tags: [], levels: [], statuses: [] },
    };
  }
}

/**
 * Fetch single course detail with lecture outline (Public)
 */
export async function getCourseBySlug(
  slug: string,
  locale: string = "en"
): Promise<CourseDetail | null> {
  const cleanSlug = normalizeSlug(slug);
  if (!cleanSlug) return null;

  const tryFetch = async (targetSlug: string) => {
    try {
      const url = `${BASE_URL}/api/courses/${encodeURIComponent(targetSlug)}?lang=${encodeURIComponent(locale)}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": locale,
        },
        next: {
          tags: ["courses", `courses:${locale}`, `course:${cleanSlug}`, `course:${locale}:${cleanSlug}`],
          revalidate: 3600,
        },
      });

      if (res.ok) {
        const json = await res.json();
        return json.data ?? null;
      }
    } catch {
      return null;
    }
    return null;
  };

  let data = await tryFetch(cleanSlug);
  // Fallback for legacy database where slug is saved as a JSON string
  if (!data) {
    data = await tryFetch(JSON.stringify({ en: cleanSlug }));
  }
  if (!data) {
    data = await tryFetch(JSON.stringify({ ar: cleanSlug }));
  }

  return data ? sanitizeCourseDetail(data, locale) : null;
}

/**
 * Fetch single lecture with full content and navigation (Public)
 */
export async function getLecture(
  courseSlug: string,
  lectureSlug: string,
  locale: string = "en"
): Promise<LectureDetail | null> {
  const cleanCourse = normalizeSlug(courseSlug);
  const cleanLecture = normalizeSlug(lectureSlug);
  if (!cleanCourse || !cleanLecture) return null;

  const tryFetch = async (cSlug: string, lSlug: string) => {
    try {
      const url = `${BASE_URL}/api/courses/${encodeURIComponent(cSlug)}/lectures/${encodeURIComponent(lSlug)}?lang=${encodeURIComponent(locale)}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": locale,
        },
        next: {
          tags: [
            "courses",
            `courses:${locale}`,
            `course:${cleanCourse}`,
            `lecture:${cleanCourse}:${cleanLecture}`,
            `lecture:${locale}:${cleanCourse}:${cleanLecture}`,
          ],
          revalidate: 3600,
        },
      });

      if (res.ok) {
        const json = await res.json();
        return json.data ?? null;
      }
    } catch {
      return null;
    }
    return null;
  };

  let data = await tryFetch(cleanCourse, cleanLecture);
  if (!data) {
    data = await tryFetch(JSON.stringify({ en: cleanCourse }), JSON.stringify({ en: cleanLecture }));
  }
  if (!data) {
    data = await tryFetch(cleanCourse, JSON.stringify({ en: cleanLecture }));
  }
  if (!data) {
    data = await tryFetch(JSON.stringify({ en: cleanCourse }), cleanLecture);
  }

  return data ? sanitizeLectureDetail(data, locale) : null;
}

/**
 * Fetch available tags with courses count (Public)
 */
export async function getTags(locale: string = "en"): Promise<CourseTag[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/tags?lang=${encodeURIComponent(locale)}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      next: {
        tags: ["courses", "tags", `tags:${locale}`],
        revalidate: 3600,
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((t: any) => ({
      ...t,
      name: unwrapField(t.name, locale),
      slug: normalizeSlug(t.slug),
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

/**
 * Fetch all courses (including drafts) for Admin dashboard
 */
export async function getAdminCourses(params: {
  page?: number;
  per_page?: number;
  search?: string;
  is_published?: boolean;
} = {}): Promise<{ data: CourseCard[]; meta?: any }> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.per_page) query.append("per_page", params.per_page.toString());
  if (params.search) query.append("search", params.search);
  if (typeof params.is_published === "boolean") {
    query.append("is_published", params.is_published.toString());
  }

  const endpoint = `/api/admin/courses${query.toString() ? `?${query.toString()}` : ""}`;

  return await apiFetch(BASE_URL, endpoint, { cache: "no-store" }, "admin_token");
}

/**
 * Fetch single course detail for Admin
 */
export async function getAdminCourse(idOrSlug: string | number): Promise<CourseDetail> {
  const res = await apiFetch(
    BASE_URL,
    `/api/admin/courses/${idOrSlug}?translations=all`,
    { cache: "no-store" },
    "admin_token"
  );
  const data = res.data ?? res;
  if (data && Array.isArray(data.tags)) {
    data.tags = data.tags.map((tg: any) => {
      if (typeof tg === "string") return { name: tg };
      let name = "";
      if (typeof tg?.name === "string") name = tg.name;
      else if (typeof tg?.name === "object" && tg.name !== null) name = tg.name.en || tg.name.ar || "";
      else if (typeof tg?.en === "string" || typeof tg?.ar === "string") name = tg.en || tg.ar || "";
      else name = String(tg?.name || "");
      return { ...tg, name };
    });
  }
  return data;
}

/**
 * Fetch lectures for a course in Admin
 */
export async function getAdminLectures(courseId: string | number): Promise<LectureListItem[]> {
  const res = await apiFetch(
    BASE_URL,
    `/api/admin/courses/${courseId}/lectures?translations=all`,
    { cache: "no-store" },
    "admin_token"
  );
  return res.data ?? res;
}

/**
 * Fetch single lecture detail for Admin
 */
export async function getAdminLecture(
  courseId: string | number,
  lectureId: string | number
): Promise<LectureDetail> {
  const res = await apiFetch(
    BASE_URL,
    `/api/admin/courses/${courseId}/lectures/${lectureId}?translations=all`,
    { cache: "no-store" },
    "admin_token"
  );
  return res.data ?? res;
}
