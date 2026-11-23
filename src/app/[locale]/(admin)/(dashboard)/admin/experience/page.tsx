import { Link } from '@/i18n/routing';
import { FaPlus } from "react-icons/fa";
import { getAllExperiences } from "@/lib/api/admin/experience";
import ExperiencesClient from "./ExperiencesClient";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ExperiencesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const pageParam = (await searchParams)?.page;
  const page = typeof pageParam === "string" ? parseInt(pageParam) : 1;
  const experiences = await getAllExperiences(page);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? "إدارة الخبرات" : "Experience Management"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? "إنشاء وتعديل وإدارة خبراتك المهنية." : "Create, edit, and manage your experiences."}
          </p>
        </div>
        <Link
          href="/admin/experience/create"
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaPlus className="text-sm" />
          <span>{isAr ? "إضافة خبرة جديدة" : "Add New Experience"}</span>
        </Link>
      </div>
      <ExperiencesClient experiences={experiences.data} meta={experiences?.meta} />
    </div>
  );
}
