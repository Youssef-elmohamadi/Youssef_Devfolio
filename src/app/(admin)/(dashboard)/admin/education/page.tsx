import {
  getAllEducations,
  getEducationsForEdit,
} from "@/lib/api/admin/education";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import EducationClient from "./EducationClient";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function EducationPage({ searchParams }: Props) {
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;

  const educations = await getAllEducations(page);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Education Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your academic degrees and certifications.
          </p>
        </div>
        <Link
          href="/admin/education/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaPlus className="text-sm" />
          <span>Add New Degree</span>
        </Link>
      </div>

      <EducationClient educations={educations.data} meta={educations?.meta} />
    </div>
  );
}
