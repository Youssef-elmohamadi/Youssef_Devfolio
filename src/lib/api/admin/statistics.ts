import { getArticles } from "@/lib/api/articles";
import { getProjects } from "@/lib/api/admin/projects";
import { getSkills } from "@/lib/api/admin/skills";
import { getContacts } from "@/lib/api/admin/contacts";

export async function getDashboardStatistics() {
  try {
    const [articlesRes, projectsRes, skillsRes, contactsRes] = await Promise.all([
      getArticles(1, 1).catch(() => ({ meta: { total: 0 } })),
      getProjects(1, 1).catch(() => ({ meta: { total: 0 } })),
      getSkills(1, 1).catch(() => ({ meta: { total: 0 } })),
      getContacts(1, 1).catch(() => ({ meta: { total: 0 } })),
    ]);

    return {
      articlesCount: articlesRes?.meta?.total || 0,
      projectsCount: projectsRes?.meta?.total || 0,
      skillsCount: skillsRes?.meta?.total || 0,
      messagesCount: contactsRes?.meta?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return {
      articlesCount: 0,
      projectsCount: 0,
      skillsCount: 0,
      messagesCount: 0,
    };
  }
}
