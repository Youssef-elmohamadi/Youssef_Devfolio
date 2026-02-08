// app/admin/articles/page.tsx
import { getSkills } from "@/lib/api/admin/skills";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import SkillsClient from "./SkillsClient";
type Props = {
  searchParams: Promise<{ page?: string }>;
};
export default async function SkillsPage({ searchParams }: Props) {
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const skills = await getSkills(page);
    console.log("Skills data:", skills);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Skills Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, edit, and manage your skills.
          </p>
        </div>
        <Link
          href="/admin/skills/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaPlus className="text-sm" />
          <span>Add New Skill</span>
        </Link>
      </div>
      <SkillsClient skills={skills.data} meta={skills?.meta} />
    </div>
  );
}
