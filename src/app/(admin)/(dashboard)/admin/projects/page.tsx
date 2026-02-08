import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { getProjects } from "@/lib/api/admin/projects";
import ProjectsClient from "./projectsClient";
type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;

  // جلب بيانات المشاريع من الـ API
  const projects = await getProjects(page);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects Portfolio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showcase your best work and manage project details.
          </p>
        </div>
        <Link
          href="/admin/projects/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaPlus className="text-sm" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* عرض الجدول */}
      <ProjectsClient projects={projects.data} meta={projects?.meta} />
    </div>
  );
}
