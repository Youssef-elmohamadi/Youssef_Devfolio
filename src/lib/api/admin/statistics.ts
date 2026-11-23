import { getArticles } from "@/lib/api/articles";
import { getProjects } from "@/lib/api/admin/projects";
import { getSkills } from "@/lib/api/admin/skills";
import { getContacts } from "@/lib/api/admin/contacts";
import { getCourses } from "@/lib/api/courses";

export async function getDashboardStatistics(locale: string = "en") {
  try {
    const [articlesRes, projectsRes, skillsRes, contactsRes, coursesRes] = await Promise.all([
      getArticles(1, 1, undefined, locale).catch(() => ({ meta: { total: 0 } })),
      getProjects(1, 1).catch(() => ({ meta: { total: 0 } })),
      getSkills(1, 1).catch(() => ({ meta: { total: 0 } })),
      getContacts(1, 1).catch(() => ({ meta: { total: 0 } })),
      getCourses({ per_page: 50 }, locale).catch(() => ({ data: [], meta: { total: 0 } })),
    ]);

    const coursesData = coursesRes?.data || [];
    const coursesCount = coursesRes?.meta?.total || coursesData.length || 0;
    const lecturesCount = coursesData.reduce((sum: number, c: any) => sum + (c.lectures_count || 0), 0);

    return {
      articlesCount: articlesRes?.meta?.total || 0,
      projectsCount: projectsRes?.meta?.total || 0,
      skillsCount: skillsRes?.meta?.total || 0,
      messagesCount: contactsRes?.meta?.total || 0,
      coursesCount,
      lecturesCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return {
      articlesCount: 0,
      projectsCount: 0,
      skillsCount: 0,
      messagesCount: 0,
      coursesCount: 0,
      lecturesCount: 0,
    };
  }
}
